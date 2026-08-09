package com.finnova.backend.service;

import com.finnova.backend.dto.InvestmentRequest;
import com.finnova.backend.dto.InvestmentResponse;
import com.finnova.backend.entity.Investment;
import com.finnova.backend.entity.User;
import com.finnova.backend.exception.ResourceNotFoundException;
import com.finnova.backend.repository.InvestmentRepository;
import com.finnova.backend.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class InvestmentService {

    private final InvestmentRepository investmentRepository;

    @Transactional
    public InvestmentResponse addInvestment(InvestmentRequest request) {
        Investment investment = new Investment();
        investment.setUser(currentUserRef());
        applyRequest(investment, request);

        Investment saved = investmentRepository.save(investment);
        return toResponse(saved, totalCurrentValue());
    }

    @Transactional
    public InvestmentResponse updateInvestment(Long id, InvestmentRequest request) {
        Investment investment = getOwnedInvestment(id);
        applyRequest(investment, request);

        Investment saved = investmentRepository.save(investment);
        return toResponse(saved, totalCurrentValue());
    }

    @Transactional
    public void deleteInvestment(Long id) {
        investmentRepository.delete(getOwnedInvestment(id));
    }

    @Transactional(readOnly = true)
    public InvestmentResponse getInvestment(Long id) {
        return toResponse(getOwnedInvestment(id), totalCurrentValue());
    }

    @Transactional(readOnly = true)
    public Page<InvestmentResponse> getAll(Pageable pageable) {
        BigDecimal total = totalCurrentValue();
        return investmentRepository.findByUserIdOrderByCreatedAtDesc(currentUserId(), pageable)
                .map(investment -> toResponse(investment, total));
    }

    private BigDecimal totalCurrentValue() {
        return investmentRepository.sumCurrentValueByUserId(currentUserId());
    }

    private void applyRequest(Investment investment, InvestmentRequest request) {
        investment.setType(request.getType());
        investment.setAssetName(request.getAssetName());
        investment.setAmountInvested(request.getAmountInvested());
        investment.setCurrentValue(request.getCurrentValue());
        investment.setPurchaseDate(request.getPurchaseDate());
    }

    private int calculatePercent(BigDecimal numerator, BigDecimal denominator) {
        if (denominator == null || denominator.compareTo(BigDecimal.ZERO) <= 0) {
            return 0;
        }
        return numerator.multiply(BigDecimal.valueOf(100))
                .divide(denominator, 0, RoundingMode.HALF_UP)
                .intValue();
    }

    private Investment getOwnedInvestment(Long id) {
        return investmentRepository.findByIdAndUserId(id, currentUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Investment not found with id: " + id));
    }

    private Long currentUserId() {
        UserDetailsImpl principal = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return principal.getId();
    }

    private User currentUserRef() {
        User user = new User();
        user.setId(currentUserId());
        return user;
    }

    private InvestmentResponse toResponse(Investment investment, BigDecimal totalCurrentValue) {
        BigDecimal profitLoss = investment.getCurrentValue().subtract(investment.getAmountInvested());
        int profitLossPercent = calculatePercent(profitLoss, investment.getAmountInvested());
        int allocationPercent = calculatePercent(investment.getCurrentValue(), totalCurrentValue);

        return new InvestmentResponse(
                investment.getId(),
                investment.getType().name(),
                investment.getAssetName(),
                investment.getAmountInvested(),
                investment.getCurrentValue(),
                profitLoss,
                profitLossPercent,
                allocationPercent,
                investment.getPurchaseDate(),
                investment.getCreatedAt(),
                investment.getUpdatedAt());
    }
}

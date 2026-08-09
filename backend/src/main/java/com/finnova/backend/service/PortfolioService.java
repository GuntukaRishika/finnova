package com.finnova.backend.service;

import com.finnova.backend.dto.PortfolioAllocationResponse;
import com.finnova.backend.dto.PortfolioSummaryResponse;
import com.finnova.backend.entity.InvestmentType;
import com.finnova.backend.repository.InvestmentRepository;
import com.finnova.backend.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final InvestmentRepository investmentRepository;

    @Transactional(readOnly = true)
    public PortfolioSummaryResponse getSummary() {
        Long userId = currentUserId();
        BigDecimal totalInvested = investmentRepository.sumAmountInvestedByUserId(userId);
        BigDecimal totalCurrentValue = investmentRepository.sumCurrentValueByUserId(userId);
        BigDecimal totalProfitLoss = totalCurrentValue.subtract(totalInvested);
        int percent = calculatePercent(totalProfitLoss, totalInvested);
        long count = investmentRepository.countByUserId(userId);

        return new PortfolioSummaryResponse(totalInvested, totalCurrentValue, totalProfitLoss, percent, count);
    }

    @Transactional(readOnly = true)
    public List<PortfolioAllocationResponse> getAllocation() {
        Long userId = currentUserId();
        BigDecimal total = investmentRepository.sumCurrentValueByUserId(userId);

        return investmentRepository.sumCurrentValueGroupByType(userId).stream()
                .map(row -> {
                    String type = ((InvestmentType) row[0]).name();
                    BigDecimal value = (BigDecimal) row[1];
                    long count = (Long) row[2];
                    return new PortfolioAllocationResponse(type, value, calculatePercent(value, total), count);
                })
                .sorted(Comparator.comparing(PortfolioAllocationResponse::getCurrentValue).reversed())
                .toList();
    }

    private int calculatePercent(BigDecimal numerator, BigDecimal denominator) {
        if (denominator == null || denominator.compareTo(BigDecimal.ZERO) <= 0) {
            return 0;
        }
        return numerator.multiply(BigDecimal.valueOf(100))
                .divide(denominator, 0, RoundingMode.HALF_UP)
                .intValue();
    }

    private Long currentUserId() {
        UserDetailsImpl principal = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return principal.getId();
    }
}

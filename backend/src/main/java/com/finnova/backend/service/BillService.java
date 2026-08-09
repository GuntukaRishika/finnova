package com.finnova.backend.service;

import com.finnova.backend.dto.BillRequest;
import com.finnova.backend.dto.BillResponse;
import com.finnova.backend.entity.Bill;
import com.finnova.backend.entity.User;
import com.finnova.backend.exception.ResourceNotFoundException;
import com.finnova.backend.repository.BillRepository;
import com.finnova.backend.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BillService {

    private final BillRepository billRepository;

    @Transactional
    public BillResponse createBill(BillRequest request) {
        Bill bill = new Bill();
        bill.setUser(currentUserRef());
        applyRequest(bill, request);

        Bill saved = billRepository.save(bill);
        return toResponse(saved);
    }

    @Transactional
    public BillResponse updateBill(Long id, BillRequest request) {
        Bill bill = getOwnedBill(id);
        boolean dueDateChanged = !bill.getDueDate().equals(request.getDueDate());

        applyRequest(bill, request);
        if (dueDateChanged) {
            bill.setDueSoonNotified(false);
            bill.setOverdueNotified(false);
        }

        Bill saved = billRepository.save(bill);
        return toResponse(saved);
    }

    @Transactional
    public void deleteBill(Long id) {
        billRepository.delete(getOwnedBill(id));
    }

    @Transactional(readOnly = true)
    public BillResponse getBill(Long id) {
        return toResponse(getOwnedBill(id));
    }

    @Transactional(readOnly = true)
    public List<BillResponse> getAll(Integer year, Integer month) {
        Long userId = currentUserId();
        List<Bill> bills;
        if (year != null && month != null) {
            YearMonth yearMonth = YearMonth.of(year, month);
            bills = billRepository.findByUserIdAndDueDateBetweenOrderByDueDateAsc(
                    userId, yearMonth.atDay(1), yearMonth.atEndOfMonth());
        } else {
            bills = billRepository.findByUserIdOrderByDueDateAsc(userId);
        }
        return bills.stream().map(this::toResponse).toList();
    }

    /**
     * Marking a recurring bill paid rolls a fresh copy forward to next month
     * so reminders keep firing without the user re-creating it every cycle.
     */
    @Transactional
    public BillResponse markPaid(Long id) {
        Bill bill = getOwnedBill(id);
        bill.setPaid(true);
        bill.setPaidAt(LocalDateTime.now());
        Bill saved = billRepository.save(bill);

        if (bill.isRecurring()) {
            Bill next = new Bill();
            next.setUser(bill.getUser());
            next.setTitle(bill.getTitle());
            next.setAmount(bill.getAmount());
            next.setCategory(bill.getCategory());
            next.setRecurring(true);
            next.setDueDate(bill.getDueDate().plusMonths(1));
            billRepository.save(next);
        }

        return toResponse(saved);
    }

    private void applyRequest(Bill bill, BillRequest request) {
        bill.setTitle(request.getTitle());
        bill.setAmount(request.getAmount());
        bill.setDueDate(request.getDueDate());
        bill.setCategory(request.getCategory());
        bill.setRecurring(request.isRecurring());
    }

    private Bill getOwnedBill(Long id) {
        return billRepository.findByIdAndUserId(id, currentUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));
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

    private BillResponse toResponse(Bill bill) {
        return new BillResponse(
                bill.getId(),
                bill.getTitle(),
                bill.getAmount(),
                bill.getDueDate(),
                bill.getCategory(),
                bill.isRecurring(),
                bill.isPaid(),
                bill.getPaidAt(),
                bill.getCreatedAt(),
                bill.getUpdatedAt());
    }
}

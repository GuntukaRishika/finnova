package com.finnova.backend.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.finnova.backend.dto.NotificationResponse;
import com.finnova.backend.entity.Bill;
import com.finnova.backend.entity.Budget;
import com.finnova.backend.entity.Notification;
import com.finnova.backend.entity.NotificationType;
import com.finnova.backend.entity.User;
import com.finnova.backend.exception.ResourceNotFoundException;
import com.finnova.backend.repository.NotificationRepository;
import com.finnova.backend.security.UserDetailsImpl;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public void notifyBudgetWarning(Budget budget, BigDecimal spent, int percentUsed) {
        create(budget, NotificationType.BUDGET_WARNING,
                String.format("You've used %d%% of your %s budget for %d/%d (%s of %s spent).",
                        percentUsed, budget.getCategory().getName(), budget.getMonth(), budget.getYear(),
                        spent.toPlainString(), budget.getAmount().toPlainString()));
    }

    @Transactional
    public void notifyBudgetExceeded(Budget budget, BigDecimal spent) {
        create(budget, NotificationType.BUDGET_EXCEEDED,
                String.format("You've exceeded your %s budget for %d/%d (%s of %s spent).",
                        budget.getCategory().getName(), budget.getMonth(), budget.getYear(),
                        spent.toPlainString(), budget.getAmount().toPlainString()));
    }

    @Transactional
    public void notifyBillDueSoon(Bill bill) {
        create(bill.getUser(), NotificationType.BILL_DUE_SOON, null, bill.getId(),
                String.format("Your bill \"%s\" of %s is due on %s.",
                        bill.getTitle(), bill.getAmount().toPlainString(), bill.getDueDate()));
    }

    @Transactional
    public void notifyBillOverdue(Bill bill) {
        create(bill.getUser(), NotificationType.BILL_OVERDUE, null, bill.getId(),
                String.format("Your bill \"%s\" of %s was due on %s and is now overdue.",
                        bill.getTitle(), bill.getAmount().toPlainString(), bill.getDueDate()));
    }

    private void create(Budget budget, NotificationType type, String message) {
        create(budget.getUser(), type, budget.getId(), null, message);
    }

    private void create(User user, NotificationType type, Long budgetId, Long billId, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setMessage(message);
        notification.setBudgetId(budgetId);
        notification.setBillId(billId);
        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public Page<NotificationResponse> getAll(Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(currentUserId(), pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<NotificationResponse> getBudgetNotifications(Pageable pageable) {
        return notificationRepository.findByUserIdAndTypeInOrderByCreatedAtDesc(
                currentUserId(), List.of(NotificationType.BUDGET_WARNING, NotificationType.BUDGET_EXCEEDED), pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount() {
        return notificationRepository.countByUserIdAndReadFalse(currentUserId());
    }

    @Transactional
    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findByIdAndUserId(id, currentUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead() {
        List<Notification> unread = notificationRepository.findByUserIdAndReadFalse(currentUserId());
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    @Transactional
    public void markAllBudgetNotificationsAsRead() {
        List<Notification> unread = notificationRepository.findByUserIdAndTypeInAndReadFalse(
                currentUserId(), List.of(NotificationType.BUDGET_WARNING, NotificationType.BUDGET_EXCEEDED));
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    @Transactional
    public void deleteAllBudgetNotifications() {
        notificationRepository.deleteByUserIdAndTypeIn(
                currentUserId(), List.of(NotificationType.BUDGET_WARNING, NotificationType.BUDGET_EXCEEDED));
    }

    private Long currentUserId() {
        UserDetailsImpl principal = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return principal.getId();
    }

    private NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getType().name(),
                notification.getMessage(),
                notification.getBudgetId(),
                notification.getBillId(),
                notification.isRead(),
                notification.getCreatedAt());
    }
}

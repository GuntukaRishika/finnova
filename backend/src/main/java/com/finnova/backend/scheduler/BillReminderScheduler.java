package com.finnova.backend.scheduler;

import com.finnova.backend.entity.Bill;
import com.finnova.backend.repository.BillRepository;
import com.finnova.backend.service.EmailService;
import com.finnova.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Runs daily and fans out due-soon / overdue reminders for unpaid bills.
 * Each bill is only notified once per state (dueSoonNotified / overdueNotified)
 * so re-running the job doesn't spam users.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class BillReminderScheduler {

    private final BillRepository billRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    @Value("${app.bill-reminder.days-before:3}")
    private int reminderDaysBefore;

    @Scheduled(cron = "${app.bill-reminder.cron:0 0 8 * * *}")
    @Transactional
    public void sendBillReminders() {
        LocalDate today = LocalDate.now();

        List<Bill> dueSoon = billRepository.findByPaidFalseAndDueSoonNotifiedFalseAndDueDateBetween(
                today, today.plusDays(reminderDaysBefore));
        for (Bill bill : dueSoon) {
            notificationService.notifyBillDueSoon(bill);
            emailService.sendBillReminder(bill.getUser().getEmail(), bill, false);
            bill.setDueSoonNotified(true);
        }
        billRepository.saveAll(dueSoon);

        List<Bill> overdue = billRepository.findByPaidFalseAndOverdueNotifiedFalseAndDueDateBefore(today);
        for (Bill bill : overdue) {
            notificationService.notifyBillOverdue(bill);
            emailService.sendBillReminder(bill.getUser().getEmail(), bill, true);
            bill.setOverdueNotified(true);
        }
        billRepository.saveAll(overdue);

        if (!dueSoon.isEmpty() || !overdue.isEmpty()) {
            log.info("Bill reminders sent: {} due-soon, {} overdue", dueSoon.size(), overdue.size());
        }
    }
}

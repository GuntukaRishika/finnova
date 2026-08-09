package com.finnova.backend.service;

import com.finnova.backend.entity.Bill;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.email.enabled:false}")
    private boolean emailEnabled;

    @Value("${app.email.from:no-reply@finnova.app}")
    private String fromAddress;

    public void sendBillReminder(String toEmail, Bill bill, boolean overdue) {
        if (!emailEnabled) {
            log.info("Email sending disabled; skipping {} reminder for bill '{}' to {}",
                    overdue ? "overdue" : "due-soon", bill.getTitle(), toEmail);
            return;
        }

        String subject = overdue
                ? String.format("Overdue: %s payment of %s", bill.getTitle(), bill.getAmount().toPlainString())
                : String.format("Reminder: %s is due on %s", bill.getTitle(), bill.getDueDate());

        String body = overdue
                ? String.format(
                        "Your bill \"%s\" of %s was due on %s and hasn't been marked as paid yet.%n%nPlease make your payment as soon as possible.",
                        bill.getTitle(), bill.getAmount().toPlainString(), bill.getDueDate())
                : String.format(
                        "Your bill \"%s\" of %s is due on %s.%n%nDon't forget to schedule your payment.",
                        bill.getTitle(), bill.getAmount().toPlainString(), bill.getDueDate());

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception ex) {
            log.error("Failed to send bill reminder email to {}", toEmail, ex);
        }
    }
}

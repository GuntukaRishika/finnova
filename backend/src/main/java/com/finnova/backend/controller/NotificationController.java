package com.finnova.backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finnova.backend.dto.NotificationResponse;
import com.finnova.backend.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notification")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<Page<NotificationResponse>> getAll(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(notificationService.getAll(pageable));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> unreadCount() {
        return ResponseEntity.ok(notificationService.getUnreadCount());
    }

    @GetMapping("/budget")
    public ResponseEntity<Page<NotificationResponse>> budgetNotifications(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(notificationService.getBudgetNotifications(pageable));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/budget/read-all")
    public ResponseEntity<Void> markAllBudgetNotificationsAsRead() {
        notificationService.markAllBudgetNotificationsAsRead();
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/budget")
    public ResponseEntity<Void> deleteAllBudgetNotifications() {
        notificationService.deleteAllBudgetNotifications();
        return ResponseEntity.noContent().build();
    }
}

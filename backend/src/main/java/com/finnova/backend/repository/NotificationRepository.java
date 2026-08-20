package com.finnova.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.finnova.backend.entity.Notification;
import com.finnova.backend.entity.NotificationType;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    Page<Notification> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Page<Notification> findByUserIdAndTypeInOrderByCreatedAtDesc(Long userId, List<NotificationType> types, Pageable pageable);

    Optional<Notification> findByIdAndUserId(Long id, Long userId);

    List<Notification> findByUserIdAndReadFalse(Long userId);

    List<Notification> findByUserIdAndTypeInAndReadFalse(Long userId, List<NotificationType> types);

    void deleteByUserIdAndTypeIn(Long userId, List<NotificationType> types);

    long countByUserIdAndReadFalse(Long userId);
}

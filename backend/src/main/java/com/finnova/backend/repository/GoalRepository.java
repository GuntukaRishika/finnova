package com.finnova.backend.repository;

import com.finnova.backend.entity.Goal;
import com.finnova.backend.entity.GoalStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GoalRepository extends JpaRepository<Goal, Long> {

    Optional<Goal> findByIdAndUserId(Long id, Long userId);

    List<Goal> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Goal> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, GoalStatus status);
}

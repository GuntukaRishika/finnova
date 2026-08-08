package com.finnova.backend.service;

import com.finnova.backend.dto.GoalContributionRequest;
import com.finnova.backend.dto.GoalRequest;
import com.finnova.backend.dto.GoalResponse;
import com.finnova.backend.entity.Goal;
import com.finnova.backend.entity.GoalStatus;
import com.finnova.backend.entity.User;
import com.finnova.backend.exception.ResourceNotFoundException;
import com.finnova.backend.repository.GoalRepository;
import com.finnova.backend.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;

    @Transactional
    public GoalResponse createGoal(GoalRequest request) {
        Goal goal = new Goal();
        goal.setUser(currentUserRef());
        goal.setName(request.getName());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setTargetDate(request.getTargetDate());

        Goal saved = goalRepository.save(goal);
        return toResponse(saved);
    }

    @Transactional
    public GoalResponse updateGoal(Long id, GoalRequest request) {
        Goal goal = getOwnedGoal(id);
        goal.setName(request.getName());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setTargetDate(request.getTargetDate());

        recomputeStatus(goal);
        Goal saved = goalRepository.save(goal);
        return toResponse(saved);
    }

    @Transactional
    public void deleteGoal(Long id) {
        goalRepository.delete(getOwnedGoal(id));
    }

    @Transactional(readOnly = true)
    public GoalResponse getGoal(Long id) {
        return toResponse(getOwnedGoal(id));
    }

    @Transactional(readOnly = true)
    public List<GoalResponse> getAll(GoalStatus status) {
        Long userId = currentUserId();
        List<Goal> goals = status != null
                ? goalRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, status)
                : goalRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return goals.stream().map(this::toResponse).toList();
    }

    @Transactional
    public GoalResponse contribute(Long id, GoalContributionRequest request) {
        Goal goal = getOwnedGoal(id);
        goal.setCurrentAmount(goal.getCurrentAmount().add(request.getAmount()));

        recomputeStatus(goal);
        Goal saved = goalRepository.save(goal);
        return toResponse(saved);
    }

    private void recomputeStatus(Goal goal) {
        boolean reached = goal.getCurrentAmount().compareTo(goal.getTargetAmount()) >= 0;
        if (reached && goal.getStatus() != GoalStatus.COMPLETED) {
            goal.setStatus(GoalStatus.COMPLETED);
            goal.setCompletedAt(LocalDateTime.now());
        } else if (!reached && goal.getStatus() == GoalStatus.COMPLETED) {
            goal.setStatus(GoalStatus.ACTIVE);
            goal.setCompletedAt(null);
        }
    }

    private int calculatePercent(BigDecimal current, BigDecimal target) {
        if (target.compareTo(BigDecimal.ZERO) <= 0) {
            return 0;
        }
        int percent = current.multiply(BigDecimal.valueOf(100))
                .divide(target, 0, RoundingMode.HALF_UP)
                .intValue();
        return Math.min(percent, 100);
    }

    private Goal getOwnedGoal(Long id) {
        return goalRepository.findByIdAndUserId(id, currentUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + id));
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

    private GoalResponse toResponse(Goal goal) {
        BigDecimal remaining = goal.getTargetAmount().subtract(goal.getCurrentAmount()).max(BigDecimal.ZERO);
        int percentComplete = calculatePercent(goal.getCurrentAmount(), goal.getTargetAmount());

        return new GoalResponse(
                goal.getId(),
                goal.getName(),
                goal.getTargetAmount(),
                goal.getCurrentAmount(),
                remaining,
                percentComplete,
                goal.getTargetDate(),
                goal.getStatus().name(),
                goal.getCompletedAt(),
                goal.getCreatedAt(),
                goal.getUpdatedAt());
    }
}

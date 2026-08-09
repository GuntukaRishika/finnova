package com.finnova.backend.repository;

import com.finnova.backend.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BillRepository extends JpaRepository<Bill, Long> {

    Optional<Bill> findByIdAndUserId(Long id, Long userId);

    List<Bill> findByUserIdOrderByDueDateAsc(Long userId);

    List<Bill> findByUserIdAndDueDateBetweenOrderByDueDateAsc(Long userId, LocalDate start, LocalDate end);

    List<Bill> findByPaidFalseAndDueSoonNotifiedFalseAndDueDateBetween(LocalDate start, LocalDate end);

    List<Bill> findByPaidFalseAndOverdueNotifiedFalseAndDueDateBefore(LocalDate date);
}

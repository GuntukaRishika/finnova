package com.finnova.backend.repository;

import com.finnova.backend.entity.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense, Long>, JpaSpecificationExecutor<Expense> {

    Optional<Expense> findByIdAndUserId(Long id, Long userId);

    Page<Expense> findByUserIdAndExpenseDateBetween(Long userId, LocalDate start, LocalDate end, Pageable pageable);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e " +
            "WHERE e.user.id = :userId AND e.expenseDate BETWEEN :start AND :end")
    BigDecimal sumAmountByUserIdAndExpenseDateBetween(@Param("userId") Long userId,
                                                        @Param("start") LocalDate start,
                                                        @Param("end") LocalDate end);

    @Query("SELECT e FROM Expense e WHERE e.user.id = :userId AND (" +
            "LOWER(e.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(e.category.name) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Expense> search(@Param("userId") Long userId, @Param("keyword") String keyword, Pageable pageable);
}

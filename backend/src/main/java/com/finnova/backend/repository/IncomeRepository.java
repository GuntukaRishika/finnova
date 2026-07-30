package com.finnova.backend.repository;

import com.finnova.backend.entity.Income;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

public interface IncomeRepository extends JpaRepository<Income, Long>, JpaSpecificationExecutor<Income> {

    Optional<Income> findByIdAndUserId(Long id, Long userId);

    Page<Income> findByUserIdAndIncomeDateBetween(Long userId, LocalDate start, LocalDate end, Pageable pageable);

    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Income i " +
            "WHERE i.user.id = :userId AND i.incomeDate BETWEEN :start AND :end")
    BigDecimal sumAmountByUserIdAndIncomeDateBetween(@Param("userId") Long userId,
                                                       @Param("start") LocalDate start,
                                                       @Param("end") LocalDate end);

    @Query("SELECT i FROM Income i WHERE i.user.id = :userId AND (" +
            "LOWER(i.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(i.category.name) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Income> search(@Param("userId") Long userId, @Param("keyword") String keyword, Pageable pageable);
}

package com.finnova.backend.repository;

import com.finnova.backend.entity.Investment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface InvestmentRepository extends JpaRepository<Investment, Long> {

    Optional<Investment> findByIdAndUserId(Long id, Long userId);

    Page<Investment> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    long countByUserId(Long userId);

    @Query("SELECT COALESCE(SUM(i.currentValue), 0) FROM Investment i WHERE i.user.id = :userId")
    BigDecimal sumCurrentValueByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(i.amountInvested), 0) FROM Investment i WHERE i.user.id = :userId")
    BigDecimal sumAmountInvestedByUserId(@Param("userId") Long userId);

    @Query("SELECT i.type, COALESCE(SUM(i.currentValue), 0), COUNT(i) FROM Investment i " +
            "WHERE i.user.id = :userId GROUP BY i.type")
    List<Object[]> sumCurrentValueGroupByType(@Param("userId") Long userId);
}

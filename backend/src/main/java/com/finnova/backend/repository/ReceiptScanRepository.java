package com.finnova.backend.repository;

import com.finnova.backend.entity.ReceiptScan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReceiptScanRepository extends JpaRepository<ReceiptScan, Long> {

    Optional<ReceiptScan> findByIdAndUserId(Long id, Long userId);

    List<ReceiptScan> findByUserIdOrderByCreatedAtDesc(Long userId);
}

package com.finnova.backend.controller;

import com.finnova.backend.dto.ExpenseResponse;
import com.finnova.backend.dto.ReceiptScanResponse;
import com.finnova.backend.dto.SaveExpenseFromScanRequest;
import com.finnova.backend.service.ReceiptScanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/bills/scan")
@RequiredArgsConstructor
public class ReceiptScanController {

    private final ReceiptScanService receiptScanService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ReceiptScanResponse> uploadAndScan(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(receiptScanService.uploadAndScan(file));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReceiptScanResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(receiptScanService.getScan(id));
    }

    @GetMapping
    public ResponseEntity<List<ReceiptScanResponse>> getAll() {
        return ResponseEntity.ok(receiptScanService.getAll());
    }

    @PostMapping("/{id}/save-expense")
    public ResponseEntity<ExpenseResponse> saveAsExpense(@PathVariable Long id,
                                                           @Valid @RequestBody SaveExpenseFromScanRequest request) {
        return ResponseEntity.ok(receiptScanService.saveAsExpense(id, request));
    }
}

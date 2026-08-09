package com.finnova.backend.controller;

import com.finnova.backend.dto.BillRequest;
import com.finnova.backend.dto.BillResponse;
import com.finnova.backend.service.BillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
public class BillController {

    private final BillService billService;

    @PostMapping
    public ResponseEntity<BillResponse> create(@Valid @RequestBody BillRequest request) {
        return ResponseEntity.ok(billService.createBill(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BillResponse> update(@PathVariable Long id, @Valid @RequestBody BillRequest request) {
        return ResponseEntity.ok(billService.updateBill(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        billService.deleteBill(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BillResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(billService.getBill(id));
    }

    @GetMapping
    public ResponseEntity<List<BillResponse>> getAll(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        return ResponseEntity.ok(billService.getAll(year, month));
    }

    @PatchMapping("/{id}/paid")
    public ResponseEntity<BillResponse> markPaid(@PathVariable Long id) {
        return ResponseEntity.ok(billService.markPaid(id));
    }
}

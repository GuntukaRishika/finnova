package com.finnova.backend.controller;

import com.finnova.backend.dto.InvestmentRequest;
import com.finnova.backend.dto.InvestmentResponse;
import com.finnova.backend.service.InvestmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/investments")
@RequiredArgsConstructor
public class InvestmentController {

    private final InvestmentService investmentService;

    @PostMapping
    public ResponseEntity<InvestmentResponse> add(@Valid @RequestBody InvestmentRequest request) {
        return ResponseEntity.ok(investmentService.addInvestment(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InvestmentResponse> update(@PathVariable Long id, @Valid @RequestBody InvestmentRequest request) {
        return ResponseEntity.ok(investmentService.updateInvestment(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        investmentService.deleteInvestment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvestmentResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(investmentService.getInvestment(id));
    }

    @GetMapping
    public ResponseEntity<Page<InvestmentResponse>> getAll(
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(investmentService.getAll(pageable));
    }
}

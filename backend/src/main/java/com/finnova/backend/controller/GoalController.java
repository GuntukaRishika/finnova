package com.finnova.backend.controller;

import com.finnova.backend.dto.GoalContributionRequest;
import com.finnova.backend.dto.GoalRequest;
import com.finnova.backend.dto.GoalResponse;
import com.finnova.backend.entity.GoalStatus;
import com.finnova.backend.service.GoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goal")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @PostMapping
    public ResponseEntity<GoalResponse> create(@Valid @RequestBody GoalRequest request) {
        return ResponseEntity.ok(goalService.createGoal(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GoalResponse> update(@PathVariable Long id, @Valid @RequestBody GoalRequest request) {
        return ResponseEntity.ok(goalService.updateGoal(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        goalService.deleteGoal(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<GoalResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(goalService.getGoal(id));
    }

    @GetMapping
    public ResponseEntity<List<GoalResponse>> getAll(@RequestParam(required = false) GoalStatus status) {
        return ResponseEntity.ok(goalService.getAll(status));
    }

    @PostMapping("/{id}/contribute")
    public ResponseEntity<GoalResponse> contribute(@PathVariable Long id,
                                                     @Valid @RequestBody GoalContributionRequest request) {
        return ResponseEntity.ok(goalService.contribute(id, request));
    }
}

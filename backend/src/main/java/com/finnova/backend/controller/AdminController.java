package com.finnova.backend.controller;

import com.finnova.backend.dto.MessageResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/status")
    @PreAuthorize("hasRole('ADMIN')")
    public MessageResponse status() {
        return new MessageResponse("Admin access confirmed");
    }
}
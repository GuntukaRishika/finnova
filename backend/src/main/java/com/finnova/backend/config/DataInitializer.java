package com.finnova.backend.config;

import com.finnova.backend.entity.Category;
import com.finnova.backend.entity.Role;
import com.finnova.backend.repository.CategoryRepository;
import com.finnova.backend.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        seedRole("ROLE_USER");
        seedRole("ROLE_ADMIN");

        seedCategory("Salary", "Regular employment income");
        seedCategory("Freelance", "Freelance or contract work income");
        seedCategory("Investment", "Dividends, interest, capital gains");
        seedCategory("Gift", "Gifts received");

        seedCategory("Food", "Groceries and dining");
        seedCategory("Transportation", "Fuel, public transit, vehicle costs");
        seedCategory("Housing", "Rent, mortgage, utilities");
        seedCategory("Healthcare", "Medical expenses and insurance");
        seedCategory("Entertainment", "Leisure and recreation");
        seedCategory("Shopping", "Clothing, electronics, and general purchases");
        seedCategory("Education", "Tuition, courses, books");

        seedCategory("Other", "Miscellaneous income or expense");
    }

    private void seedRole(String name) {
        if (roleRepository.findByName(name).isEmpty()) {
            roleRepository.save(new Role(name));
        }
    }

    private void seedCategory(String name, String description) {
        if (categoryRepository.findByName(name).isEmpty()) {
            categoryRepository.save(new Category(name, description));
        }
    }
}

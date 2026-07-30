package com.finnova.backend.service;

import com.finnova.backend.dto.CategoryRequest;
import com.finnova.backend.dto.CategoryResponse;
import com.finnova.backend.entity.Category;
import com.finnova.backend.exception.ResourceNotFoundException;
import com.finnova.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public CategoryResponse create(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Category '" + request.getName() + "' already exists");
        }
        Category category = new Category(request.getName(), request.getDescription());
        return toResponse(categoryRepository.save(category));
    }

    Category getEntityById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(category.getId(), category.getName(), category.getDescription());
    }
}

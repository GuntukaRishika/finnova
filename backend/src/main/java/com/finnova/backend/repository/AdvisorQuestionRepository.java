package com.finnova.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.finnova.backend.entity.AdvisorQuestion;

public interface AdvisorQuestionRepository extends JpaRepository<AdvisorQuestion, Long> {

    List<AdvisorQuestion> findByUserIdOrderByCreatedAtAsc(Long userId);

    void deleteByUserId(Long userId);
}
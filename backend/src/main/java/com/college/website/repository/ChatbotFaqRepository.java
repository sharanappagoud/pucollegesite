package com.college.website.repository;

import com.college.website.entity.ChatbotFaq;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatbotFaqRepository extends JpaRepository<ChatbotFaq, Long> {

    List<ChatbotFaq> findByIsActiveTrueOrderByDisplayOrderAsc();

    List<ChatbotFaq> findAllByOrderByDisplayOrderAsc();

    List<ChatbotFaq> findByCategoryAndIsActiveTrue(String category);

    @Query("SELECT f FROM ChatbotFaq f WHERE f.isActive = true AND " +
           "(LOWER(f.question) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(f.keywords) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<ChatbotFaq> searchByKeyword(@Param("keyword") String keyword);
}

package com.college.website.repository;

import com.college.website.entity.ChatbotLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatbotLogRepository extends JpaRepository<ChatbotLog, Long> {

    Page<ChatbotLog> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<ChatbotLog> findTop50ByOrderByCreatedAtDesc();

    long countByHelpfulTrue();

    long countByHelpfulFalse();

    @Query("SELECT AVG(l.responseTimeMs) FROM ChatbotLog l WHERE l.responseTimeMs IS NOT NULL")
    Double getAverageResponseTimeMs();
}

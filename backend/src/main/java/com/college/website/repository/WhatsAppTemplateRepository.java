package com.college.website.repository;

import com.college.website.entity.WhatsAppTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WhatsAppTemplateRepository extends JpaRepository<WhatsAppTemplate, Long> {
    Optional<WhatsAppTemplate> findByTemplateName(String templateName);
    List<WhatsAppTemplate> findByIsActiveTrue();
    List<WhatsAppTemplate> findByCategoryAndIsActiveTrue(String category);
}

package com.college.website.repository;

import com.college.website.entity.NotificationTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationTemplateRepository extends JpaRepository<NotificationTemplate, Long> {
    Optional<NotificationTemplate> findByTemplateKey(String templateKey);
    List<NotificationTemplate> findByActiveTrue();
    List<NotificationTemplate> findAllByOrderByTemplateKeyAsc();
}

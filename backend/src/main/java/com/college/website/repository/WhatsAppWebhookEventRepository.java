package com.college.website.repository;

import com.college.website.entity.WhatsAppWebhookEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WhatsAppWebhookEventRepository extends JpaRepository<WhatsAppWebhookEvent, Long> {
    Optional<WhatsAppWebhookEvent> findByEventId(String eventId);
}

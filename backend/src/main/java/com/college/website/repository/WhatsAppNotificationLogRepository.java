package com.college.website.repository;

import com.college.website.entity.WhatsAppNotificationLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WhatsAppNotificationLogRepository extends JpaRepository<WhatsAppNotificationLog, Long> {
    Optional<WhatsAppNotificationLog> findByMetaMessageId(String metaMessageId);
    Page<WhatsAppNotificationLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
    List<WhatsAppNotificationLog> findTop50ByOrderByCreatedAtDesc();
    long countByDeliveryStatus(String deliveryStatus);
}

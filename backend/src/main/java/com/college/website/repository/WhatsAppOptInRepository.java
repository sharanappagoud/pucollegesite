package com.college.website.repository;

import com.college.website.entity.WhatsAppOptIn;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WhatsAppOptInRepository extends JpaRepository<WhatsAppOptIn, Long> {
    Optional<WhatsAppOptIn> findByPhoneNumber(String phoneNumber);
    boolean existsByPhoneNumberAndIsOptedInTrue(String phoneNumber);
    Page<WhatsAppOptIn> findAllByOrderByCreatedAtDesc(Pageable pageable);
    long countByIsOptedInTrue();
}

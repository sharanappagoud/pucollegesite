package com.college.website.repository;

import com.college.website.entity.AdmissionEnquiry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdmissionEnquiryRepository extends JpaRepository<AdmissionEnquiry, Long> {
    Optional<AdmissionEnquiry> findByReferenceNo(String referenceNo);
    List<AdmissionEnquiry> findByStatus(String status);
    List<AdmissionEnquiry> findByPreferredStream(String preferredStream);
    Page<AdmissionEnquiry> findAllByOrderByCreatedAtDesc(Pageable pageable);
    long countByStatus(String status);
}

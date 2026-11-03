package com.college.website.repository;

import com.college.website.entity.ContactEnquiry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactEnquiryRepository extends JpaRepository<ContactEnquiry, Long> {
    List<ContactEnquiry> findByStatus(String status);
    Page<ContactEnquiry> findAllByOrderByCreatedAtDesc(Pageable pageable);
    long countByStatus(String status);
}

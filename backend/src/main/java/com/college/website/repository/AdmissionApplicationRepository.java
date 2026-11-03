package com.college.website.repository;

import com.college.website.entity.AdmissionApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdmissionApplicationRepository extends JpaRepository<AdmissionApplication, Long> {
    Optional<AdmissionApplication> findByApplicationNo(String applicationNo);
    List<AdmissionApplication> findAllByOrderByCreatedAtDesc();
    List<AdmissionApplication> findByStatus(String status);
}

package com.college.website.repository;

import com.college.website.entity.Scholarship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScholarshipRepository extends JpaRepository<Scholarship, Long> {
    List<Scholarship> findByActiveTrueOrderByCreatedAtDesc();
    List<Scholarship> findAllByOrderByCreatedAtDesc();
    List<Scholarship> findByCategoryAndActiveTrue(String category);
}

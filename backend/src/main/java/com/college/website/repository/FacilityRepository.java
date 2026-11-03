package com.college.website.repository;

import com.college.website.entity.Facility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {
    List<Facility> findByActiveTrueOrderByDisplayOrderAsc();
    List<Facility> findByCategoryAndActiveTrueOrderByDisplayOrderAsc(String category);
    List<Facility> findAllByOrderByDisplayOrderAsc();
}

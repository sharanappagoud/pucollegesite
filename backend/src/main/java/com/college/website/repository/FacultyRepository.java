package com.college.website.repository;

import com.college.website.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    List<Faculty> findByActiveTrueOrderByDisplayOrderAsc();
    List<Faculty> findByDepartmentAndActiveTrueOrderByDisplayOrderAsc(String department);
    List<Faculty> findAllByOrderByDisplayOrderAsc();
}

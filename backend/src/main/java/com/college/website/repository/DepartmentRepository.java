package com.college.website.repository;

import com.college.website.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findByActiveTrueOrderByNameAsc();
    List<Department> findAllByOrderByNameAsc();
    Optional<Department> findByCode(String code);
}

package com.college.website.repository;

import com.college.website.entity.Examination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExaminationRepository extends JpaRepository<Examination, Long> {
    List<Examination> findByPublishedTrueOrderByStartDateAsc();
    List<Examination> findAllByOrderByStartDateDesc();
    List<Examination> findByAcademicYearAndPublishedTrue(String academicYear);
}

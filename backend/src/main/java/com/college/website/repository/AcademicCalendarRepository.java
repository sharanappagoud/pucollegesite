package com.college.website.repository;

import com.college.website.entity.AcademicCalendarItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AcademicCalendarRepository extends JpaRepository<AcademicCalendarItem, Long> {
    List<AcademicCalendarItem> findByAcademicYearOrderByStartDateAsc(String academicYear);
    List<AcademicCalendarItem> findAllByOrderByStartDateAsc();
}

package com.college.website.repository;

import com.college.website.entity.CourseSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseSubjectRepository extends JpaRepository<CourseSubject, Long> {
    List<CourseSubject> findByCourseId(Long courseId);
}

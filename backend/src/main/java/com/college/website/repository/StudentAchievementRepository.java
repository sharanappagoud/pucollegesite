package com.college.website.repository;

import com.college.website.entity.StudentAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentAchievementRepository extends JpaRepository<StudentAchievement, Long> {
    List<StudentAchievement> findByPublishedTrueOrderByCreatedAtDesc();
    List<StudentAchievement> findAllByOrderByCreatedAtDesc();
    List<StudentAchievement> findByExamTypeAndPublishedTrue(String examType);
    List<StudentAchievement> findByAcademicYearAndPublishedTrue(String academicYear);
}

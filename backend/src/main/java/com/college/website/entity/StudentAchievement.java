package com.college.website.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_achievements")
public class StudentAchievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_name", nullable = false, length = 150)
    private String studentName;

    @Column(name = "academic_year", nullable = false, length = 20)
    private String academicYear;

    @Column(name = "exam_type", nullable = false, length = 50)
    private String examType; // KCET, NEET, JEE, PU_BOARD, SPORTS, CULTURAL

    @Column(name = "rank_or_score", nullable = false, length = 100)
    private String rankOrScore;

    @Column(nullable = false, length = 50)
    private String stream; // SCIENCE, COMMERCE

    @Column(length = 50)
    private String combination; // PCMB, PCMC, CEBA, etc.

    @Column(name = "achievement_title", nullable = false, length = 255)
    private String achievementTitle;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Column(nullable = false)
    private Boolean published = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public StudentAchievement() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
    public String getExamType() { return examType; }
    public void setExamType(String examType) { this.examType = examType; }
    public String getRankOrScore() { return rankOrScore; }
    public void setRankOrScore(String rankOrScore) { this.rankOrScore = rankOrScore; }
    public String getStream() { return stream; }
    public void setStream(String stream) { this.stream = stream; }
    public String getCombination() { return combination; }
    public void setCombination(String combination) { this.combination = combination; }
    public String getAchievementTitle() { return achievementTitle; }
    public void setAchievementTitle(String achievementTitle) { this.achievementTitle = achievementTitle; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    public Boolean getPublished() { return published; }
    public void setPublished(Boolean published) { this.published = published; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

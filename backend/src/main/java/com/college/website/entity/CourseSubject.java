package com.college.website.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "course_subjects")
public class CourseSubject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    @JsonIgnore
    private Course course;

    @Column(name = "subject_name", nullable = false, length = 150)
    private String subjectName;

    @Column(name = "subject_code", length = 50)
    private String subjectCode;

    @Column(name = "is_core")
    private Boolean isCore = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public CourseSubject() {}

    public CourseSubject(Course course, String subjectName, String subjectCode, Boolean isCore) {
        this.course = course;
        this.subjectName = subjectName;
        this.subjectCode = subjectCode;
        this.isCore = isCore;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }
    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
    public Boolean getIsCore() { return isCore; }
    public void setIsCore(Boolean isCore) { this.isCore = isCore; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

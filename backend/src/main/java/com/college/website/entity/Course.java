package com.college.website.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code; // PCMB, PCMC, CEBA, MEBA, SEBA, MSBA

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 50)
    private String stream; // SCIENCE, COMMERCE, ARTS

    @Column(length = 50)
    private String duration = "2 Years";

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String eligibility;

    @Column(name = "career_prospects", columnDefinition = "TEXT")
    private String careerProspects;

    @Column(name = "fee_per_year", precision = 10, scale = 2)
    private BigDecimal feePerYear = BigDecimal.ZERO;

    @Column(length = 100)
    private String icon;

    @Column(nullable = false)
    private Boolean active = true;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CourseSubject> subjects = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Course() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getStream() { return stream; }
    public void setStream(String stream) { this.stream = stream; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getEligibility() { return eligibility; }
    public void setEligibility(String eligibility) { this.eligibility = eligibility; }
    public String getCareerProspects() { return careerProspects; }
    public void setCareerProspects(String careerProspects) { this.careerProspects = careerProspects; }
    public BigDecimal getFeePerYear() { return feePerYear; }
    public void setFeePerYear(BigDecimal feePerYear) { this.feePerYear = feePerYear; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public List<CourseSubject> getSubjects() { return subjects; }
    public void setSubjects(List<CourseSubject> subjects) { this.subjects = subjects; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

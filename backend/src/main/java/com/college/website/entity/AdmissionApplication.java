package com.college.website.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "admission_applications")
public class AdmissionApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_no", nullable = false, unique = true, length = 50)
    private String applicationNo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "enquiry_id")
    private AdmissionEnquiry enquiry;

    @Column(name = "student_name", nullable = false, length = 150)
    private String studentName;

    private LocalDate dob;

    @Column(length = 20)
    private String gender;

    @Column(name = "blood_group", length = 10)
    private String bloodGroup;

    @Column(length = 50)
    private String nationality = "Indian";

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "marks_percentage", precision = 5, scale = 2)
    private BigDecimal marksPercentage;

    @Column(length = 50)
    private String status = "SUBMITTED"; // SUBMITTED, VERIFIED, APPROVED, REJECTED, ADMITTED

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public AdmissionApplication() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getApplicationNo() { return applicationNo; }
    public void setApplicationNo(String applicationNo) { this.applicationNo = applicationNo; }
    public AdmissionEnquiry getEnquiry() { return enquiry; }
    public void setEnquiry(AdmissionEnquiry enquiry) { this.enquiry = enquiry; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public BigDecimal getMarksPercentage() { return marksPercentage; }
    public void setMarksPercentage(BigDecimal marksPercentage) { this.marksPercentage = marksPercentage; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

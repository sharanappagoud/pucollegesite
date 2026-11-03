package com.college.website.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admission_enquiries")
public class AdmissionEnquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reference_no", nullable = false, unique = true, length = 50)
    private String referenceNo;

    @Column(name = "student_name", nullable = false, length = 150)
    private String studentName;

    @Column(name = "parent_name", nullable = false, length = 150)
    private String parentName;

    @Column(name = "student_phone", nullable = false, length = 20)
    private String studentPhone;

    @Column(name = "parent_phone", nullable = false, length = 20)
    private String parentPhone;

    @Column(name = "parent_email", length = 150)
    private String parentEmail;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(name = "last_completed_class", nullable = false, length = 50)
    private String lastCompletedClass;

    @Column(nullable = false, length = 100)
    private String board; // CBSE, ICSE, Karnataka State Board, Other

    @Column(name = "preferred_stream", nullable = false, length = 50)
    private String preferredStream; // SCIENCE, COMMERCE

    @Column(name = "preferred_combination", nullable = false, length = 50)
    private String preferredCombination; // PCMB, PCMC, CEBA, MEBA, SEBA, MSBA

    @Column(name = "academic_year", nullable = false, length = 20)
    private String academicYear = "2026-27";

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 20)
    private String pincode;

    @Column(name = "referred_by", length = 150)
    private String referredBy;

    @Column(length = 50)
    private String status = "NEW"; // NEW, CONTACTED, COUNSELLING_SCHEDULED, APPLICATION_RECEIVED, UNDER_REVIEW, ADMITTED, REJECTED, CLOSED

    @Column(name = "follow_up_notes", columnDefinition = "TEXT")
    private String followUpNotes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public AdmissionEnquiry() {}

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getReferenceNo() { return referenceNo; }
    public void setReferenceNo(String referenceNo) { this.referenceNo = referenceNo; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getParentName() { return parentName; }
    public void setParentName(String parentName) { this.parentName = parentName; }
    public String getStudentPhone() { return studentPhone; }
    public void setStudentPhone(String studentPhone) { this.studentPhone = studentPhone; }
    public String getParentPhone() { return parentPhone; }
    public void setParentPhone(String parentPhone) { this.parentPhone = parentPhone; }
    public String getParentEmail() { return parentEmail; }
    public void setParentEmail(String parentEmail) { this.parentEmail = parentEmail; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getLastCompletedClass() { return lastCompletedClass; }
    public void setLastCompletedClass(String lastCompletedClass) { this.lastCompletedClass = lastCompletedClass; }
    public String getBoard() { return board; }
    public void setBoard(String board) { this.board = board; }
    public String getPreferredStream() { return preferredStream; }
    public void setPreferredStream(String preferredStream) { this.preferredStream = preferredStream; }
    public String getPreferredCombination() { return preferredCombination; }
    public void setPreferredCombination(String preferredCombination) { this.preferredCombination = preferredCombination; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    public String getReferredBy() { return referredBy; }
    public void setReferredBy(String referredBy) { this.referredBy = referredBy; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getFollowUpNotes() { return followUpNotes; }
    public void setFollowUpNotes(String followUpNotes) { this.followUpNotes = followUpNotes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

package com.college.website.dto;

import java.time.LocalDateTime;

public class AdmissionEnquiryResponse {
    private Long id;
    private String referenceNo;
    private String studentName;
    private String parentName;
    private String studentPhone;
    private String parentPhone;
    private String parentEmail;
    private String email;
    private String lastCompletedClass;
    private String board;
    private String preferredStream;
    private String preferredCombination;
    private String academicYear;
    private String message;
    private String address;
    private String pincode;
    private String referredBy;
    private String status;
    private String followUpNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AdmissionEnquiryResponse() {}

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

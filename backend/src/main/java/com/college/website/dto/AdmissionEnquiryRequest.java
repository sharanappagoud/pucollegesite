package com.college.website.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class AdmissionEnquiryRequest {

    @NotBlank(message = "Student full name is required")
    private String studentName;

    @NotBlank(message = "Parent or guardian name is required")
    private String parentName;

    @NotBlank(message = "Student mobile number is required")
    @Pattern(regexp = "^[+0-9\\s\\-]{10,15}$", message = "Please provide a valid 10-digit mobile number")
    private String studentPhone;

    @NotBlank(message = "Parent mobile number is required")
    @Pattern(regexp = "^[+0-9\\s\\-]{10,15}$", message = "Please provide a valid parent mobile number")
    private String parentPhone;

    private String parentEmail;

    @NotBlank(message = "Email address is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Last completed class is required")
    private String lastCompletedClass;

    @NotBlank(message = "SSLC or equivalent board is required")
    private String board;

    @NotBlank(message = "Preferred PUC stream is required")
    private String preferredStream; // SCIENCE, COMMERCE

    @NotBlank(message = "Preferred subject combination is required")
    private String preferredCombination; // PCMB, PCMC, CEBA, MEBA, SEBA, MSBA

    private String academicYear = "2026-27";

    private String address;

    private String pincode;

    private String referredBy;

    private String message;

    @AssertTrue(message = "You must agree to the privacy policy to submit")
    private Boolean consentGiven = true;

    public AdmissionEnquiryRequest() {}

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
    public Boolean getConsentGiven() { return consentGiven; }
    public void setConsentGiven(Boolean consentGiven) { this.consentGiven = consentGiven; }
}

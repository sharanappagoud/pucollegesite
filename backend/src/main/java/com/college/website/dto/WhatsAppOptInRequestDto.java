package com.college.website.dto;

import jakarta.validation.constraints.NotBlank;

public class WhatsAppOptInRequestDto {

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    private String studentName;
    private String optInSource = "ADMISSION_ENQUIRY";
    private Boolean isOptedIn = true;

    public WhatsAppOptInRequestDto() {}

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getOptInSource() { return optInSource; }
    public void setOptInSource(String optInSource) { this.optInSource = optInSource; }

    public Boolean getIsOptedIn() { return isOptedIn; }
    public void setIsOptedIn(Boolean isOptedIn) { this.isOptedIn = isOptedIn; }
}

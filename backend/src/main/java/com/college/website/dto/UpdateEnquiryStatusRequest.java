package com.college.website.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateEnquiryStatusRequest {

    @NotBlank(message = "Status is required")
    private String status; // NEW, CONTACTED, COUNSELLING_SCHEDULED, APPLICATION_RECEIVED, UNDER_REVIEW, ADMITTED, REJECTED, CLOSED

    private String followUpNotes;

    public UpdateEnquiryStatusRequest() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getFollowUpNotes() { return followUpNotes; }
    public void setFollowUpNotes(String followUpNotes) { this.followUpNotes = followUpNotes; }
}

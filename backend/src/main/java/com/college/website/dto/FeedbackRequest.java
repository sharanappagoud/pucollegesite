package com.college.website.dto;

import jakarta.validation.constraints.NotNull;

public class FeedbackRequest {

    @NotNull(message = "logId is required")
    private Long logId;

    @NotNull(message = "helpful flag is required")
    private Boolean helpful;

    public FeedbackRequest() {}

    public FeedbackRequest(Long logId, Boolean helpful) {
        this.logId = logId;
        this.helpful = helpful;
    }

    public Long getLogId() { return logId; }
    public void setLogId(Long logId) { this.logId = logId; }

    public Boolean getHelpful() { return helpful; }
    public void setHelpful(Boolean helpful) { this.helpful = helpful; }
}

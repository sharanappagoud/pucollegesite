package com.college.website.dto;

import jakarta.validation.constraints.NotBlank;

public class SendDirectMessageRequest {
    private String referenceNo;

    @NotBlank(message = "Recipient type is required")
    private String recipientType; // STAFF, STUDENT, PARENT

    private String recipientName;

    @NotBlank(message = "Recipient email or phone is required")
    private String recipientTarget;

    private String channel = "EMAIL"; // EMAIL, SMS

    private String subject;

    @NotBlank(message = "Message content is required")
    private String message;

    public SendDirectMessageRequest() {}

    public String getReferenceNo() { return referenceNo; }
    public void setReferenceNo(String referenceNo) { this.referenceNo = referenceNo; }
    public String getRecipientType() { return recipientType; }
    public void setRecipientType(String recipientType) { this.recipientType = recipientType; }
    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }
    public String getRecipientTarget() { return recipientTarget; }
    public void setRecipientTarget(String recipientTarget) { this.recipientTarget = recipientTarget; }
    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}


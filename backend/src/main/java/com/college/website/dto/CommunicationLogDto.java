package com.college.website.dto;

import java.time.LocalDateTime;

public class CommunicationLogDto {
    private Long id;
    private String referenceNo;
    private String recipientType;
    private String recipientName;
    private String recipientTarget;
    private String channel;
    private String subject;
    private String message;
    private String status;
    private String triggerEvent;
    private String errorMessage;
    private String sentBy;
    private LocalDateTime createdAt;

    public CommunicationLogDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getTriggerEvent() { return triggerEvent; }
    public void setTriggerEvent(String triggerEvent) { this.triggerEvent = triggerEvent; }
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    public String getSentBy() { return sentBy; }
    public void setSentBy(String sentBy) { this.sentBy = sentBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}


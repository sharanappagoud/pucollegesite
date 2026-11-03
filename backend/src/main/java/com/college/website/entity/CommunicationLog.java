package com.college.website.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "communication_logs")
public class CommunicationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reference_no", length = 50)
    private String referenceNo;

    @Column(name = "recipient_type", nullable = false, length = 50)
    private String recipientType; // STAFF, STUDENT, PARENT

    @Column(name = "recipient_name", length = 150)
    private String recipientName;

    @Column(name = "recipient_target", nullable = false, length = 150)
    private String recipientTarget; // Email or Mobile Number

    @Column(nullable = false, length = 20)
    private String channel = "EMAIL"; // EMAIL, SMS

    @Column(length = 255)
    private String subject;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(nullable = false, length = 50)
    private String status = "SENT"; // SENT, FAILED, QUEUED

    @Column(name = "trigger_event", nullable = false, length = 100)
    private String triggerEvent; // ENQUIRY_CONFIRMATION, STATUS_UPDATE, ADMIN_ALERT, MANUAL_DISPATCH

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "sent_by", length = 100)
    private String sentBy = "SYSTEM";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public CommunicationLog() {}

    public CommunicationLog(String referenceNo, String recipientType, String recipientName,
                            String recipientTarget, String channel, String subject,
                            String message, String status, String triggerEvent,
                            String errorMessage, String sentBy) {
        this.referenceNo = referenceNo;
        this.recipientType = recipientType;
        this.recipientName = recipientName;
        this.recipientTarget = recipientTarget;
        this.channel = channel;
        this.subject = subject;
        this.message = message;
        this.status = status;
        this.triggerEvent = triggerEvent;
        this.errorMessage = errorMessage;
        this.sentBy = sentBy;
        this.createdAt = LocalDateTime.now();
    }

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


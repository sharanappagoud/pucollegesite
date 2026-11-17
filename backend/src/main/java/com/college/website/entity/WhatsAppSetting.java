package com.college.website.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "whatsapp_settings")
public class WhatsAppSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "phone_number", nullable = false, length = 30)
    private String phoneNumber = "919743988354";

    @Column(name = "display_phone_number", length = 50)
    private String displayPhoneNumber = "+91 97439 88354";

    @Column(name = "floating_enabled")
    private Boolean floatingEnabled = true;

    @Column(name = "welcome_message", length = 255)
    private String welcomeMessage = "Chat with MPUC College";

    @Column(name = "welcome_subtitle", length = 255)
    private String welcomeSubtitle = "Typically replies within a few minutes";

    @Column(name = "prefilled_default_message", columnDefinition = "TEXT")
    private String prefilledDefaultMessage = "Hello MPUC College, I would like to enquire about PU admissions and courses for the academic year 2026-27.";

    @Column(name = "business_account_id", length = 100)
    private String businessAccountId;

    @Column(name = "phone_number_id", length = 100)
    private String phoneNumberId;

    @Column(name = "api_version", length = 20)
    private String apiVersion = "v19.0";

    @Column(name = "webhook_verify_token", length = 100)
    private String webhookVerifyToken = "mpuc_whatsapp_verify_token_2026";

    @Column(name = "auto_notifications_enabled")
    private Boolean autoNotificationsEnabled = false;

    @Column(name = "notify_on_enquiry")
    private Boolean notifyOnEnquiry = true;

    @Column(name = "notify_on_status_change")
    private Boolean notifyOnStatusChange = true;

    @Column(name = "notify_on_counselling")
    private Boolean notifyOnCounselling = true;

    @Column(name = "notify_on_exam")
    private Boolean notifyOnExam = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public WhatsAppSetting() {}

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getDisplayPhoneNumber() { return displayPhoneNumber; }
    public void setDisplayPhoneNumber(String displayPhoneNumber) { this.displayPhoneNumber = displayPhoneNumber; }

    public Boolean getFloatingEnabled() { return floatingEnabled; }
    public void setFloatingEnabled(Boolean floatingEnabled) { this.floatingEnabled = floatingEnabled; }

    public String getWelcomeMessage() { return welcomeMessage; }
    public void setWelcomeMessage(String welcomeMessage) { this.welcomeMessage = welcomeMessage; }

    public String getWelcomeSubtitle() { return welcomeSubtitle; }
    public void setWelcomeSubtitle(String welcomeSubtitle) { this.welcomeSubtitle = welcomeSubtitle; }

    public String getPrefilledDefaultMessage() { return prefilledDefaultMessage; }
    public void setPrefilledDefaultMessage(String prefilledDefaultMessage) { this.prefilledDefaultMessage = prefilledDefaultMessage; }

    public String getBusinessAccountId() { return businessAccountId; }
    public void setBusinessAccountId(String businessAccountId) { this.businessAccountId = businessAccountId; }

    public String getPhoneNumberId() { return phoneNumberId; }
    public void setPhoneNumberId(String phoneNumberId) { this.phoneNumberId = phoneNumberId; }

    public String getApiVersion() { return apiVersion; }
    public void setApiVersion(String apiVersion) { this.apiVersion = apiVersion; }

    public String getWebhookVerifyToken() { return webhookVerifyToken; }
    public void setWebhookVerifyToken(String webhookVerifyToken) { this.webhookVerifyToken = webhookVerifyToken; }

    public Boolean getAutoNotificationsEnabled() { return autoNotificationsEnabled; }
    public void setAutoNotificationsEnabled(Boolean autoNotificationsEnabled) { this.autoNotificationsEnabled = autoNotificationsEnabled; }

    public Boolean getNotifyOnEnquiry() { return notifyOnEnquiry; }
    public void setNotifyOnEnquiry(Boolean notifyOnEnquiry) { this.notifyOnEnquiry = notifyOnEnquiry; }

    public Boolean getNotifyOnStatusChange() { return notifyOnStatusChange; }
    public void setNotifyOnStatusChange(Boolean notifyOnStatusChange) { this.notifyOnStatusChange = notifyOnStatusChange; }

    public Boolean getNotifyOnCounselling() { return notifyOnCounselling; }
    public void setNotifyOnCounselling(Boolean notifyOnCounselling) { this.notifyOnCounselling = notifyOnCounselling; }

    public Boolean getNotifyOnExam() { return notifyOnExam; }
    public void setNotifyOnExam(Boolean notifyOnExam) { this.notifyOnExam = notifyOnExam; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

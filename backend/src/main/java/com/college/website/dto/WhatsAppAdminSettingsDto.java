package com.college.website.dto;

public class WhatsAppAdminSettingsDto {
    private Long id;
    private String phoneNumber;
    private String displayPhoneNumber;
    private Boolean floatingEnabled;
    private String welcomeMessage;
    private String welcomeSubtitle;
    private String prefilledDefaultMessage;
    private String businessAccountId;
    private String phoneNumberId;
    private String apiVersion;
    private String webhookVerifyToken;
    private Boolean autoNotificationsEnabled;
    private Boolean notifyOnEnquiry;
    private Boolean notifyOnStatusChange;
    private Boolean notifyOnCounselling;
    private Boolean notifyOnExam;
    private Boolean isCloudApiConfigured;
    private Boolean hasAccessToken;
    private Boolean hasAppSecret;

    public WhatsAppAdminSettingsDto() {}

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

    public Boolean getIsCloudApiConfigured() { return isCloudApiConfigured; }
    public void setIsCloudApiConfigured(Boolean cloudApiConfigured) { isCloudApiConfigured = cloudApiConfigured; }

    public Boolean getHasAccessToken() { return hasAccessToken; }
    public void setHasAccessToken(Boolean hasAccessToken) { this.hasAccessToken = hasAccessToken; }

    public Boolean getHasAppSecret() { return hasAppSecret; }
    public void setHasAppSecret(Boolean hasAppSecret) { this.hasAppSecret = hasAppSecret; }
}

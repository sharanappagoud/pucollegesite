package com.college.website.dto;

import java.util.Map;

public class WhatsAppPublicConfigDto {
    private String phoneNumber;
    private String displayPhoneNumber;
    private Boolean floatingEnabled;
    private String welcomeMessage;
    private String welcomeSubtitle;
    private String prefilledDefaultMessage;
    private Map<String, String> prefilledTemplates;
    private Boolean isCloudApiConfigured;

    public WhatsAppPublicConfigDto() {}

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

    public Map<String, String> getPrefilledTemplates() { return prefilledTemplates; }
    public void setPrefilledTemplates(Map<String, String> prefilledTemplates) { this.prefilledTemplates = prefilledTemplates; }

    public Boolean getIsCloudApiConfigured() { return isCloudApiConfigured; }
    public void setIsCloudApiConfigured(Boolean cloudApiConfigured) { isCloudApiConfigured = cloudApiConfigured; }
}

package com.college.website.dto;

import java.util.List;

public class ChatbotSettingsDto {

    private Boolean enabled;
    private String name;
    private String welcomeMessage;
    private List<String> suggestedQuestions;
    private String aiProvider;
    private String openaiModel;
    private Boolean hasApiKey;

    public ChatbotSettingsDto() {}

    public ChatbotSettingsDto(Boolean enabled, String name, String welcomeMessage, List<String> suggestedQuestions, String aiProvider, String openaiModel, Boolean hasApiKey) {
        this.enabled = enabled;
        this.name = name;
        this.welcomeMessage = welcomeMessage;
        this.suggestedQuestions = suggestedQuestions;
        this.aiProvider = aiProvider;
        this.openaiModel = openaiModel;
        this.hasApiKey = hasApiKey;
    }

    public Boolean getEnabled() { return enabled; }
    public void setEnabled(Boolean enabled) { this.enabled = enabled; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getWelcomeMessage() { return welcomeMessage; }
    public void setWelcomeMessage(String welcomeMessage) { this.welcomeMessage = welcomeMessage; }

    public List<String> getSuggestedQuestions() { return suggestedQuestions; }
    public void setSuggestedQuestions(List<String> suggestedQuestions) { this.suggestedQuestions = suggestedQuestions; }

    public String getAiProvider() { return aiProvider; }
    public void setAiProvider(String aiProvider) { this.aiProvider = aiProvider; }

    public String getOpenaiModel() { return openaiModel; }
    public void setOpenaiModel(String openaiModel) { this.openaiModel = openaiModel; }

    public Boolean getHasApiKey() { return hasApiKey; }
    public void setHasApiKey(Boolean hasApiKey) { this.hasApiKey = hasApiKey; }
}

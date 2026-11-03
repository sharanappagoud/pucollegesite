package com.college.website.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiProviderConfig {

    @Value("${app.ai.openai.api-key:}")
    private String apiKey;

    @Value("${app.ai.openai.model:gpt-4o-mini}")
    private String model;

    @Value("${app.ai.openai.base-url:https://api.openai.com/v1}")
    private String baseUrl;

    @Value("${app.ai.openai.timeout-seconds:15}")
    private int timeoutSeconds;

    @Value("${app.ai.chatbot.enabled:true}")
    private boolean chatbotEnabled;

    @Value("${app.ai.chatbot.rate-limit-per-minute:30}")
    private int rateLimitPerMinute;

    public String getApiKey() { return apiKey; }
    public void setApiKey(String apiKey) { this.apiKey = apiKey; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getBaseUrl() { return baseUrl; }
    public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }

    public int getTimeoutSeconds() { return timeoutSeconds; }
    public void setTimeoutSeconds(int timeoutSeconds) { this.timeoutSeconds = timeoutSeconds; }

    public boolean isChatbotEnabled() { return chatbotEnabled; }
    public void setChatbotEnabled(boolean chatbotEnabled) { this.chatbotEnabled = chatbotEnabled; }

    public int getRateLimitPerMinute() { return rateLimitPerMinute; }
    public void setRateLimitPerMinute(int rateLimitPerMinute) { this.rateLimitPerMinute = rateLimitPerMinute; }

    public boolean hasValidApiKey() {
        return apiKey != null && !apiKey.trim().isEmpty() && !apiKey.startsWith("your_");
    }
}

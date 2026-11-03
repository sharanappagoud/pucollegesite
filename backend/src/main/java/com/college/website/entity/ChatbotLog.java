package com.college.website.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chatbot_logs")
public class ChatbotLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", length = 100)
    private String sessionId;

    @Column(name = "user_message", nullable = false, columnDefinition = "TEXT")
    private String userMessage;

    @Column(name = "bot_response", nullable = false, columnDefinition = "TEXT")
    private String botResponse;

    @Column(length = 20)
    private String language = "en";

    @Column(length = 50)
    private String source = "RAG_MYSQL";

    private Boolean helpful;

    @Column(name = "user_ip", length = 50)
    private String userIp;

    @Column(name = "response_time_ms")
    private Integer responseTimeMs;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ChatbotLog() {}

    public ChatbotLog(String sessionId, String userMessage, String botResponse, String language, String source, String userIp, Integer responseTimeMs) {
        this.sessionId = sessionId;
        this.userMessage = userMessage;
        this.botResponse = botResponse;
        this.language = language;
        this.source = source;
        this.userIp = userIp;
        this.responseTimeMs = responseTimeMs;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getUserMessage() { return userMessage; }
    public void setUserMessage(String userMessage) { this.userMessage = userMessage; }

    public String getBotResponse() { return botResponse; }
    public void setBotResponse(String botResponse) { this.botResponse = botResponse; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public Boolean getHelpful() { return helpful; }
    public void setHelpful(Boolean helpful) { this.helpful = helpful; }

    public String getUserIp() { return userIp; }
    public void setUserIp(String userIp) { this.userIp = userIp; }

    public Integer getResponseTimeMs() { return responseTimeMs; }
    public void setResponseTimeMs(Integer responseTimeMs) { this.responseTimeMs = responseTimeMs; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

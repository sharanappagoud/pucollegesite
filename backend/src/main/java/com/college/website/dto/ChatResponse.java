package com.college.website.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ChatResponse {

    private String reply;
    private List<String> suggestions = new ArrayList<>();
    private List<Map<String, String>> links = new ArrayList<>();
    private String source = "RAG_MYSQL";
    private Long logId;
    private LocalDateTime timestamp = LocalDateTime.now();

    public ChatResponse() {}

    public ChatResponse(String reply) {
        this.reply = reply;
    }

    public ChatResponse(String reply, List<String> suggestions, String source, Long logId) {
        this.reply = reply;
        this.suggestions = suggestions != null ? suggestions : new ArrayList<>();
        this.source = source;
        this.logId = logId;
        this.timestamp = LocalDateTime.now();
    }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }

    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }

    public List<Map<String, String>> getLinks() { return links; }
    public void setLinks(List<Map<String, String>> links) { this.links = links; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public Long getLogId() { return logId; }
    public void setLogId(Long logId) { this.logId = logId; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}

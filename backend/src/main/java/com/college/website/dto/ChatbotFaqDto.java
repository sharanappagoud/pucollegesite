package com.college.website.dto;

public class ChatbotFaqDto {

    private Long id;
    private String question;
    private String answer;
    private String category;
    private String keywords;
    private Integer displayOrder;
    private Boolean isActive;

    public ChatbotFaqDto() {}

    public ChatbotFaqDto(Long id, String question, String answer, String category, String keywords, Integer displayOrder, Boolean isActive) {
        this.id = id;
        this.question = question;
        this.answer = answer;
        this.category = category;
        this.keywords = keywords;
        this.displayOrder = displayOrder;
        this.isActive = isActive;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getKeywords() { return keywords; }
    public void setKeywords(String keywords) { this.keywords = keywords; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}

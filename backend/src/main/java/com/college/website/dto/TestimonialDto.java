package com.college.website.dto;

public class TestimonialDto {
    private Long id;
    private String studentName;
    private String batchYear;
    private String stream;
    private String achievement;
    private String quote;
    private String photoUrl;
    private Boolean active;

    public TestimonialDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getBatchYear() { return batchYear; }
    public void setBatchYear(String batchYear) { this.batchYear = batchYear; }
    public String getStream() { return stream; }
    public void setStream(String stream) { this.stream = stream; }
    public String getAchievement() { return achievement; }
    public void setAchievement(String achievement) { this.achievement = achievement; }
    public String getQuote() { return quote; }
    public void setQuote(String quote) { this.quote = quote; }
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}

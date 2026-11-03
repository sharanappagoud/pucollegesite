package com.college.website.dto;

import java.time.LocalDate;

public class CalendarItemDto {
    private Long id;
    private String eventTitle;
    private String category;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private String academicYear;

    public CalendarItemDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
}

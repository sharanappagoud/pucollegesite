package com.college.website.dto;

import java.math.BigDecimal;
import java.util.List;

public class CourseDto {
    private Long id;
    private String code;
    private String name;
    private String stream;
    private String duration;
    private String description;
    private String eligibility;
    private String careerProspects;
    private BigDecimal feePerYear;
    private String icon;
    private Boolean active;
    private List<SubjectDto> subjects;

    public CourseDto() {}

    public static class SubjectDto {
        private Long id;
        private String subjectName;
        private String subjectCode;
        private Boolean isCore;

        public SubjectDto() {}
        public SubjectDto(Long id, String subjectName, String subjectCode, Boolean isCore) {
            this.id = id;
            this.subjectName = subjectName;
            this.subjectCode = subjectCode;
            this.isCore = isCore;
        }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getSubjectName() { return subjectName; }
        public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
        public String getSubjectCode() { return subjectCode; }
        public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
        public Boolean getIsCore() { return isCore; }
        public void setIsCore(Boolean isCore) { this.isCore = isCore; }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getStream() { return stream; }
    public void setStream(String stream) { this.stream = stream; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getEligibility() { return eligibility; }
    public void setEligibility(String eligibility) { this.eligibility = eligibility; }
    public String getCareerProspects() { return careerProspects; }
    public void setCareerProspects(String careerProspects) { this.careerProspects = careerProspects; }
    public BigDecimal getFeePerYear() { return feePerYear; }
    public void setFeePerYear(BigDecimal feePerYear) { this.feePerYear = feePerYear; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public List<SubjectDto> getSubjects() { return subjects; }
    public void setSubjects(List<SubjectDto> subjects) { this.subjects = subjects; }
}

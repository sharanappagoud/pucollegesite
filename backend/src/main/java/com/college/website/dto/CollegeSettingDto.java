package com.college.website.dto;

public class CollegeSettingDto {
    private Long id;
    private String settingKey;
    private String settingValue;
    private String category;
    private String description;

    public CollegeSettingDto() {}

    public CollegeSettingDto(Long id, String settingKey, String settingValue, String category, String description) {
        this.id = id;
        this.settingKey = settingKey;
        this.settingValue = settingValue;
        this.category = category;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSettingKey() { return settingKey; }
    public void setSettingKey(String settingKey) { this.settingKey = settingKey; }
    public String getSettingValue() { return settingValue; }
    public void setSettingValue(String settingValue) { this.settingValue = settingValue; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

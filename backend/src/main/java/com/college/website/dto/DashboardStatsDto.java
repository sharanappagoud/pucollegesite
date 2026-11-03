package com.college.website.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDto {
    private long totalAdmissionEnquiries;
    private long newAdmissionEnquiries;
    private long totalCourses;
    private long totalFaculty;
    private long totalNewsArticles;
    private long upcomingEvents;
    private long pendingContactEnquiries;
    private Map<String, Long> enquiriesByStatus;
    private Map<String, Long> enquiriesByStream;
    private List<AuditLogDto> recentActivities;

    public DashboardStatsDto() {}

    public static class AuditLogDto {
        private Long id;
        private String username;
        private String action;
        private String module;
        private String details;
        private String createdAt;

        public AuditLogDto() {}
        public AuditLogDto(Long id, String username, String action, String module, String details, String createdAt) {
            this.id = id;
            this.username = username;
            this.action = action;
            this.module = module;
            this.details = details;
            this.createdAt = createdAt;
        }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getAction() { return action; }
        public void setAction(String action) { this.action = action; }
        public String getModule() { return module; }
        public void setModule(String module) { this.module = module; }
        public String getDetails() { return details; }
        public void setDetails(String details) { this.details = details; }
        public String getCreatedAt() { return createdAt; }
        public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    }

    public long getTotalAdmissionEnquiries() { return totalAdmissionEnquiries; }
    public void setTotalAdmissionEnquiries(long totalAdmissionEnquiries) { this.totalAdmissionEnquiries = totalAdmissionEnquiries; }
    public long getNewAdmissionEnquiries() { return newAdmissionEnquiries; }
    public void setNewAdmissionEnquiries(long newAdmissionEnquiries) { this.newAdmissionEnquiries = newAdmissionEnquiries; }
    public long getTotalCourses() { return totalCourses; }
    public void setTotalCourses(long totalCourses) { this.totalCourses = totalCourses; }
    public long getTotalFaculty() { return totalFaculty; }
    public void setTotalFaculty(long totalFaculty) { this.totalFaculty = totalFaculty; }
    public long getTotalNewsArticles() { return totalNewsArticles; }
    public void setTotalNewsArticles(long totalNewsArticles) { this.totalNewsArticles = totalNewsArticles; }
    public long getUpcomingEvents() { return upcomingEvents; }
    public void setUpcomingEvents(long upcomingEvents) { this.upcomingEvents = upcomingEvents; }
    public long getPendingContactEnquiries() { return pendingContactEnquiries; }
    public void setPendingContactEnquiries(long pendingContactEnquiries) { this.pendingContactEnquiries = pendingContactEnquiries; }
    public Map<String, Long> getEnquiriesByStatus() { return enquiriesByStatus; }
    public void setEnquiriesByStatus(Map<String, Long> enquiriesByStatus) { this.enquiriesByStatus = enquiriesByStatus; }
    public Map<String, Long> getEnquiriesByStream() { return enquiriesByStream; }
    public void setEnquiriesByStream(Map<String, Long> enquiriesByStream) { this.enquiriesByStream = enquiriesByStream; }
    public List<AuditLogDto> getRecentActivities() { return recentActivities; }
    public void setRecentActivities(List<AuditLogDto> recentActivities) { this.recentActivities = recentActivities; }
}

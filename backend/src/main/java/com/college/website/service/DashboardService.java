package com.college.website.service;

import com.college.website.dto.DashboardStatsDto;
import com.college.website.entity.AdmissionEnquiry;
import com.college.website.entity.AuditLog;
import com.college.website.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final AdmissionEnquiryRepository enquiryRepository;
    private final CourseRepository courseRepository;
    private final FacultyRepository facultyRepository;
    private final NewsRepository newsRepository;
    private final EventRepository eventRepository;
    private final ContactEnquiryRepository contactEnquiryRepository;
    private final AuditLogRepository auditLogRepository;

    public DashboardService(AdmissionEnquiryRepository enquiryRepository,
                            CourseRepository courseRepository,
                            FacultyRepository facultyRepository,
                            NewsRepository newsRepository,
                            EventRepository eventRepository,
                            ContactEnquiryRepository contactEnquiryRepository,
                            AuditLogRepository auditLogRepository) {
        this.enquiryRepository = enquiryRepository;
        this.courseRepository = courseRepository;
        this.facultyRepository = facultyRepository;
        this.newsRepository = newsRepository;
        this.eventRepository = eventRepository;
        this.contactEnquiryRepository = contactEnquiryRepository;
        this.auditLogRepository = auditLogRepository;
    }

    public DashboardStatsDto getDashboardOverview() {
        DashboardStatsDto stats = new DashboardStatsDto();

        List<AdmissionEnquiry> enquiries = enquiryRepository.findAll();
        stats.setTotalAdmissionEnquiries(enquiries.size());
        stats.setNewAdmissionEnquiries(enquiries.stream().filter(e -> "NEW".equalsIgnoreCase(e.getStatus())).count());
        stats.setTotalCourses(courseRepository.count());
        stats.setTotalFaculty(facultyRepository.count());
        stats.setTotalNewsArticles(newsRepository.count());
        stats.setUpcomingEvents(eventRepository.findByEventDateGreaterThanEqualOrderByEventDateAsc(LocalDate.now()).size());
        stats.setPendingContactEnquiries(contactEnquiryRepository.countByStatus("NEW"));

        // Enquiries by Status
        Map<String, Long> statusMap = new HashMap<>();
        enquiries.forEach(e -> {
            String s = e.getStatus() != null ? e.getStatus() : "NEW";
            statusMap.put(s, statusMap.getOrDefault(s, 0L) + 1);
        });
        stats.setEnquiriesByStatus(statusMap);

        // Enquiries by Stream
        Map<String, Long> streamMap = new HashMap<>();
        enquiries.forEach(e -> {
            String str = e.getPreferredStream() != null ? e.getPreferredStream() : "SCIENCE";
            streamMap.put(str, streamMap.getOrDefault(str, 0L) + 1);
        });
        stats.setEnquiriesByStream(streamMap);

        // Recent Audit Activities
        List<AuditLog> logs = auditLogRepository.findTop20ByOrderByCreatedAtDesc();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd-MMM HH:mm");
        List<DashboardStatsDto.AuditLogDto> logDtos = logs.stream()
                .map(l -> new DashboardStatsDto.AuditLogDto(
                        l.getId(),
                        l.getUsername(),
                        l.getAction(),
                        l.getModule(),
                        l.getDetails(),
                        l.getCreatedAt() != null ? l.getCreatedAt().format(dtf) : ""
                ))
                .collect(Collectors.toList());
        stats.setRecentActivities(logDtos);

        return stats;
    }
}

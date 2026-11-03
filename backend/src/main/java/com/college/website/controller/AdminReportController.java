package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.entity.*;
import com.college.website.repository.*;
import com.college.website.service.AuditLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;

@RestController
@RequestMapping("/api/v1/admin/reports")
@Tag(name = "Admin Reports & CSV Export", description = "Aggregated statistical reports and compliant CSV data exports")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'ADMISSION_STAFF')")
public class AdminReportController {

    private final AdmissionEnquiryRepository enquiryRepository;
    private final AdmissionApplicationRepository applicationRepository;
    private final FacultyRepository facultyRepository;
    private final AuditLogRepository auditLogRepository;
    private final CourseRepository courseRepository;
    private final StudentAchievementRepository achievementRepository;
    private final AuditLogService auditLogService;

    public AdminReportController(AdmissionEnquiryRepository enquiryRepository,
                                 AdmissionApplicationRepository applicationRepository,
                                 FacultyRepository facultyRepository,
                                 AuditLogRepository auditLogRepository,
                                 CourseRepository courseRepository,
                                 StudentAchievementRepository achievementRepository,
                                 AuditLogService auditLogService) {
        this.enquiryRepository = enquiryRepository;
        this.applicationRepository = applicationRepository;
        this.facultyRepository = facultyRepository;
        this.auditLogRepository = auditLogRepository;
        this.courseRepository = courseRepository;
        this.achievementRepository = achievementRepository;
        this.auditLogService = auditLogService;
    }

    @GetMapping("/summary")
    @Operation(summary = "Get aggregated summary statistics for reports dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSummaryReport() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalEnquiries", enquiryRepository.count());
        summary.put("totalApplications", applicationRepository.count());
        summary.put("totalFaculty", facultyRepository.count());
        summary.put("totalCourses", courseRepository.count());
        summary.put("totalAchievements", achievementRepository.count());

        // Count breakdown of applications
        List<AdmissionApplication> apps = applicationRepository.findAll();
        Map<String, Long> appStatusCounts = new HashMap<>();
        for (AdmissionApplication a : apps) {
            String s = a.getStatus() != null ? a.getStatus() : "SUBMITTED";
            appStatusCounts.put(s, appStatusCounts.getOrDefault(s, 0L) + 1);
        }
        summary.put("applicationStatusBreakdown", appStatusCounts);

        // Count breakdown of enquiries
        List<AdmissionEnquiry> enquiries = enquiryRepository.findAll();
        Map<String, Long> enquiryStreamCounts = new HashMap<>();
        for (AdmissionEnquiry e : enquiries) {
            String stream = e.getPreferredStream() != null ? e.getPreferredStream() : "GENERAL";
            enquiryStreamCounts.put(stream, enquiryStreamCounts.getOrDefault(stream, 0L) + 1);
        }
        summary.put("enquiryStreamBreakdown", enquiryStreamCounts);

        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    @GetMapping("/enquiries/csv")
    @Operation(summary = "Export admission enquiries to CSV")
    public void exportEnquiriesCsv(HttpServletResponse response,
                                   @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        auditLogService.logAction(username, "EXPORT_CSV", "REPORTS", "Exported admission enquiries CSV");

        response.setContentType("text/csv; charset=UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename=\"admission_enquiries_" + System.currentTimeMillis() + ".csv\"");

        PrintWriter writer = response.getWriter();
        writer.println("Reference No,Student Name,Parent Name,Student Phone,Email,Board,Stream,Combination,Academic Year,Status,Created At");

        List<AdmissionEnquiry> list = enquiryRepository.findAll();
        for (AdmissionEnquiry e : list) {
            writer.printf("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"%n",
                    escapeCsv(e.getReferenceNo()),
                    escapeCsv(e.getStudentName()),
                    escapeCsv(e.getParentName()),
                    escapeCsv(e.getStudentPhone()),
                    escapeCsv(e.getEmail()),
                    escapeCsv(e.getBoard()),
                    escapeCsv(e.getPreferredStream()),
                    escapeCsv(e.getPreferredCombination()),
                    escapeCsv(e.getAcademicYear()),
                    escapeCsv(e.getStatus()),
                    e.getCreatedAt() != null ? e.getCreatedAt().toString() : "");
        }
        writer.flush();
    }

    @GetMapping("/applications/csv")
    @Operation(summary = "Export student applications to CSV")
    public void exportApplicationsCsv(HttpServletResponse response,
                                      @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        auditLogService.logAction(username, "EXPORT_CSV", "REPORTS", "Exported student applications CSV");

        response.setContentType("text/csv; charset=UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename=\"student_applications_" + System.currentTimeMillis() + ".csv\"");

        PrintWriter writer = response.getWriter();
        writer.println("Application No,Student Name,DOB,Gender,Blood Group,Nationality,10th Marks %,Status,Created At");

        List<AdmissionApplication> list = applicationRepository.findAll();
        for (AdmissionApplication a : list) {
            writer.printf("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"%n",
                    escapeCsv(a.getApplicationNo()),
                    escapeCsv(a.getStudentName()),
                    a.getDob() != null ? a.getDob().toString() : "",
                    escapeCsv(a.getGender()),
                    escapeCsv(a.getBloodGroup()),
                    escapeCsv(a.getNationality()),
                    a.getMarksPercentage() != null ? a.getMarksPercentage().toString() : "",
                    escapeCsv(a.getStatus()),
                    a.getCreatedAt() != null ? a.getCreatedAt().toString() : "");
        }
        writer.flush();
    }

    @GetMapping("/faculty/csv")
    @Operation(summary = "Export faculty directory to CSV")
    public void exportFacultyCsv(HttpServletResponse response,
                                 @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        auditLogService.logAction(username, "EXPORT_CSV", "REPORTS", "Exported faculty directory CSV");

        response.setContentType("text/csv; charset=UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename=\"faculty_directory_" + System.currentTimeMillis() + ".csv\"");

        PrintWriter writer = response.getWriter();
        writer.println("Full Name,Designation,Department,Qualification,Experience Years,Email,Phone,Active");

        List<Faculty> list = facultyRepository.findAll();
        for (Faculty f : list) {
            writer.printf("\"%s\",\"%s\",\"%s\",\"%s\",%d,\"%s\",\"%s\",%s%n",
                    escapeCsv(f.getFullName()),
                    escapeCsv(f.getDesignation()),
                    escapeCsv(f.getDepartment()),
                    escapeCsv(f.getQualification()),
                    f.getExperienceYears() != null ? f.getExperienceYears() : 0,
                    escapeCsv(f.getEmail()),
                    escapeCsv(f.getPhone()),
                    f.getActive());
        }
        writer.flush();
    }

    @GetMapping("/audit-logs/csv")
    @Operation(summary = "Export audit log trail to CSV")
    public void exportAuditLogsCsv(HttpServletResponse response,
                                  @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        auditLogService.logAction(username, "EXPORT_CSV", "REPORTS", "Exported audit logs CSV");

        response.setContentType("text/csv; charset=UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename=\"audit_trail_" + System.currentTimeMillis() + ".csv\"");

        PrintWriter writer = response.getWriter();
        writer.println("ID,Timestamp,Username,Module,Action,Details,IP Address");

        List<AuditLog> list = auditLogRepository.findTop20ByOrderByCreatedAtDesc();
        for (AuditLog l : list) {
            writer.printf("%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"%n",
                    l.getId(),
                    l.getCreatedAt() != null ? l.getCreatedAt().toString() : "",
                    escapeCsv(l.getUsername()),
                    escapeCsv(l.getModule()),
                    escapeCsv(l.getAction()),
                    escapeCsv(l.getDetails()),
                    escapeCsv(l.getIpAddress()));
        }
        writer.flush();
    }

    private String escapeCsv(String str) {
        if (str == null) return "";
        return str.replace("\"", "\"\"");
    }
}

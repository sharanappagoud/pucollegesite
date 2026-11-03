package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.entity.AdmissionApplication;
import com.college.website.exception.ResourceNotFoundException;
import com.college.website.repository.AdmissionApplicationRepository;
import com.college.website.service.AuditLogService;
import com.college.website.service.GoogleSheetsSyncService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/students")
@Tag(name = "Admin Student & Application Records", description = "Manage student applications, admission status and student records")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'ADMISSION_STAFF')")
public class AdminStudentApplicationController {

    private final AdmissionApplicationRepository applicationRepository;
    private final AuditLogService auditLogService;
    private final GoogleSheetsSyncService googleSheetsSyncService;

    public AdminStudentApplicationController(AdmissionApplicationRepository applicationRepository,
                                             AuditLogService auditLogService,
                                             GoogleSheetsSyncService googleSheetsSyncService) {
        this.applicationRepository = applicationRepository;
        this.auditLogService = auditLogService;
        this.googleSheetsSyncService = googleSheetsSyncService;
    }

    @GetMapping
    @Operation(summary = "Get all student applications")
    public ResponseEntity<ApiResponse<List<AdmissionApplication>>> getAllApplications(
            @RequestParam(required = false) String status) {
        List<AdmissionApplication> list;
        if (status != null && !status.isBlank()) {
            list = applicationRepository.findByStatus(status.toUpperCase());
        } else {
            list = applicationRepository.findAllByOrderByCreatedAtDesc();
        }
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single application record by ID")
    public ResponseEntity<ApiResponse<AdmissionApplication>> getApplicationById(@PathVariable Long id) {
        AdmissionApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + id));
        return ResponseEntity.ok(ApiResponse.ok(app));
    }

    @PostMapping
    @Operation(summary = "Create or update student application")
    public ResponseEntity<ApiResponse<AdmissionApplication>> saveApplication(
            @RequestBody AdmissionApplication application,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        boolean isNew = application.getId() == null;
        if (isNew && (application.getApplicationNo() == null || application.getApplicationNo().isBlank())) {
            application.setApplicationNo("APP-" + (int)(System.currentTimeMillis() % 1000000));
        }
        AdmissionApplication saved = applicationRepository.save(application);
        auditLogService.logAction(username, isNew ? "CREATE_APPLICATION" : "UPDATE_APPLICATION", "STUDENTS",
                "AppNo: " + saved.getApplicationNo() + " - " + saved.getStudentName());

        try {
            googleSheetsSyncService.forwardApplicationAsync(saved);
        } catch (Exception e) {
            // Non-blocking fallback
        }

        return ResponseEntity.ok(ApiResponse.ok("Application saved successfully", saved));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update application workflow status")
    public ResponseEntity<ApiResponse<AdmissionApplication>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        AdmissionApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + id));
        String oldStatus = app.getStatus();
        app.setStatus(status.toUpperCase());
        AdmissionApplication saved = applicationRepository.save(app);
        auditLogService.logAction(username, "UPDATE_APPLICATION_STATUS", "STUDENTS",
                "AppNo: " + app.getApplicationNo() + " status: " + oldStatus + " -> " + status.toUpperCase());
        return ResponseEntity.ok(ApiResponse.ok("Status updated successfully", saved));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete student application record")
    public ResponseEntity<ApiResponse<Void>> deleteApplication(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        AdmissionApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + id));
        applicationRepository.delete(app);
        auditLogService.logAction(username, "DELETE_APPLICATION", "STUDENTS", "Deleted AppNo: " + app.getApplicationNo());
        return ResponseEntity.ok(ApiResponse.ok("Application deleted successfully", null));
    }
}

package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.entity.Examination;
import com.college.website.exception.ResourceNotFoundException;
import com.college.website.repository.ExaminationRepository;
import com.college.website.service.AuditLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/examinations")
@Tag(name = "Admin Examination Management", description = "CRUD for examination schedules, timetables, and guidelines")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'CONTENT_EDITOR', 'ADMISSION_STAFF', 'STAFF')")
public class AdminExaminationController {

    private final ExaminationRepository examinationRepository;
    private final AuditLogService auditLogService;

    public AdminExaminationController(ExaminationRepository examinationRepository,
                                      AuditLogService auditLogService) {
        this.examinationRepository = examinationRepository;
        this.auditLogService = auditLogService;
    }

    @GetMapping
    @Operation(summary = "Get all examinations")
    public ResponseEntity<ApiResponse<List<Examination>>> getAllExaminations() {
        return ResponseEntity.ok(ApiResponse.ok(examinationRepository.findAllByOrderByStartDateDesc()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get examination by ID")
    public ResponseEntity<ApiResponse<Examination>> getExaminationById(@PathVariable Long id) {
        Examination exam = examinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Examination not found with ID: " + id));
        return ResponseEntity.ok(ApiResponse.ok(exam));
    }

    @PostMapping
    @Operation(summary = "Create or update examination")
    public ResponseEntity<ApiResponse<Examination>> saveExamination(
            @RequestBody Examination examination,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        boolean isNew = examination.getId() == null;
        Examination saved = examinationRepository.save(examination);
        auditLogService.logAction(username, isNew ? "CREATE_EXAMINATION" : "UPDATE_EXAMINATION", "EXAMINATIONS",
                "Exam: " + saved.getExamName() + " (" + saved.getAcademicYear() + ")");
        return ResponseEntity.ok(ApiResponse.ok("Examination saved successfully", saved));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete examination")
    public ResponseEntity<ApiResponse<Void>> deleteExamination(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        Examination exam = examinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Examination not found with ID: " + id));
        examinationRepository.delete(exam);
        auditLogService.logAction(username, "DELETE_EXAMINATION", "EXAMINATIONS", "Deleted exam: " + exam.getExamName());
        return ResponseEntity.ok(ApiResponse.ok("Examination deleted successfully", null));
    }

    @PatchMapping("/{id}/publish")
    @Operation(summary = "Toggle exam publication status")
    public ResponseEntity<ApiResponse<Examination>> togglePublish(
            @PathVariable Long id,
            @RequestParam boolean published,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        Examination exam = examinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Examination not found with ID: " + id));
        exam.setPublished(published);
        Examination saved = examinationRepository.save(exam);
        auditLogService.logAction(username, "TOGGLE_EXAM_PUBLISH", "EXAMINATIONS", "Exam ID: " + id + " -> " + published);
        return ResponseEntity.ok(ApiResponse.ok("Publication status updated", saved));
    }
}

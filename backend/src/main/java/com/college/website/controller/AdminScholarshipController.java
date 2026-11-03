package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.entity.Scholarship;
import com.college.website.exception.ResourceNotFoundException;
import com.college.website.repository.ScholarshipRepository;
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
@RequestMapping("/api/v1/admin/scholarships")
@Tag(name = "Admin Fee & Scholarship Management", description = "CRUD for scholarships, concessions, and fee waivers")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'CONTENT_EDITOR', 'ADMISSION_STAFF')")
public class AdminScholarshipController {

    private final ScholarshipRepository scholarshipRepository;
    private final AuditLogService auditLogService;

    public AdminScholarshipController(ScholarshipRepository scholarshipRepository,
                                     AuditLogService auditLogService) {
        this.scholarshipRepository = scholarshipRepository;
        this.auditLogService = auditLogService;
    }

    @GetMapping
    @Operation(summary = "Get all scholarships")
    public ResponseEntity<ApiResponse<List<Scholarship>>> getAllScholarships() {
        return ResponseEntity.ok(ApiResponse.ok(scholarshipRepository.findAllByOrderByCreatedAtDesc()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get scholarship by ID")
    public ResponseEntity<ApiResponse<Scholarship>> getScholarshipById(@PathVariable Long id) {
        Scholarship item = scholarshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scholarship not found with ID: " + id));
        return ResponseEntity.ok(ApiResponse.ok(item));
    }

    @PostMapping
    @Operation(summary = "Create or update scholarship")
    public ResponseEntity<ApiResponse<Scholarship>> saveScholarship(
            @RequestBody Scholarship scholarship,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        boolean isNew = scholarship.getId() == null;
        Scholarship saved = scholarshipRepository.save(scholarship);
        auditLogService.logAction(username, isNew ? "CREATE_SCHOLARSHIP" : "UPDATE_SCHOLARSHIP", "SCHOLARSHIPS",
                "Title: " + saved.getTitle() + " - " + saved.getBenefitAmount());
        return ResponseEntity.ok(ApiResponse.ok("Scholarship saved successfully", saved));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete scholarship")
    public ResponseEntity<ApiResponse<Void>> deleteScholarship(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        Scholarship item = scholarshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scholarship not found with ID: " + id));
        scholarshipRepository.delete(item);
        auditLogService.logAction(username, "DELETE_SCHOLARSHIP", "SCHOLARSHIPS", "Deleted: " + item.getTitle());
        return ResponseEntity.ok(ApiResponse.ok("Scholarship deleted successfully", null));
    }

    @PatchMapping("/{id}/active")
    @Operation(summary = "Toggle scholarship active status")
    public ResponseEntity<ApiResponse<Scholarship>> toggleActive(
            @PathVariable Long id,
            @RequestParam boolean active,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        Scholarship item = scholarshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scholarship not found with ID: " + id));
        item.setActive(active);
        Scholarship saved = scholarshipRepository.save(item);
        auditLogService.logAction(username, "TOGGLE_SCHOLARSHIP_ACTIVE", "SCHOLARSHIPS", "ID: " + id + " -> " + active);
        return ResponseEntity.ok(ApiResponse.ok("Status updated successfully", saved));
    }
}

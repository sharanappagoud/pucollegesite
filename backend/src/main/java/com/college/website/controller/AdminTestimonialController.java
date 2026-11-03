package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.entity.Testimonial;
import com.college.website.exception.ResourceNotFoundException;
import com.college.website.repository.TestimonialRepository;
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
@RequestMapping("/api/v1/admin/testimonials")
@Tag(name = "Admin Testimonials & Reviews", description = "CRUD and approval workflow for student and alumni testimonials")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'CONTENT_EDITOR')")
public class AdminTestimonialController {

    private final TestimonialRepository testimonialRepository;
    private final AuditLogService auditLogService;

    public AdminTestimonialController(TestimonialRepository testimonialRepository,
                                      AuditLogService auditLogService) {
        this.testimonialRepository = testimonialRepository;
        this.auditLogService = auditLogService;
    }

    @GetMapping
    @Operation(summary = "Get all testimonials")
    public ResponseEntity<ApiResponse<List<Testimonial>>> getAllTestimonials() {
        return ResponseEntity.ok(ApiResponse.ok(testimonialRepository.findAll()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get testimonial by ID")
    public ResponseEntity<ApiResponse<Testimonial>> getTestimonialById(@PathVariable Long id) {
        Testimonial item = testimonialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial not found with ID: " + id));
        return ResponseEntity.ok(ApiResponse.ok(item));
    }

    @PostMapping
    @Operation(summary = "Create or update testimonial")
    public ResponseEntity<ApiResponse<Testimonial>> saveTestimonial(
            @RequestBody Testimonial testimonial,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        boolean isNew = testimonial.getId() == null;
        Testimonial saved = testimonialRepository.save(testimonial);
        auditLogService.logAction(username, isNew ? "CREATE_TESTIMONIAL" : "UPDATE_TESTIMONIAL", "TESTIMONIALS",
                "Student: " + saved.getStudentName() + " (" + saved.getBatchYear() + ")");
        return ResponseEntity.ok(ApiResponse.ok("Testimonial saved successfully", saved));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete testimonial")
    public ResponseEntity<ApiResponse<Void>> deleteTestimonial(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        Testimonial item = testimonialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial not found with ID: " + id));
        testimonialRepository.delete(item);
        auditLogService.logAction(username, "DELETE_TESTIMONIAL", "TESTIMONIALS", "Deleted testimonial of: " + item.getStudentName());
        return ResponseEntity.ok(ApiResponse.ok("Testimonial deleted successfully", null));
    }

    @PatchMapping("/{id}/active")
    @Operation(summary = "Toggle testimonial approval/active status")
    public ResponseEntity<ApiResponse<Testimonial>> toggleActive(
            @PathVariable Long id,
            @RequestParam boolean active,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        Testimonial item = testimonialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial not found with ID: " + id));
        item.setActive(active);
        Testimonial saved = testimonialRepository.save(item);
        auditLogService.logAction(username, "TOGGLE_TESTIMONIAL_STATUS", "TESTIMONIALS", "ID: " + id + " -> " + active);
        return ResponseEntity.ok(ApiResponse.ok("Status updated successfully", saved));
    }
}

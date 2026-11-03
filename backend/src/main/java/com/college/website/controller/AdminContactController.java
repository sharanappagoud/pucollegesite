package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.entity.ContactEnquiry;
import com.college.website.service.ContactEnquiryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/contact-enquiries")
@Tag(name = "Admin Contact Enquiry Management", description = "Review and respond to visitor messages")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminContactController {

    private final ContactEnquiryService contactEnquiryService;

    public AdminContactController(ContactEnquiryService contactEnquiryService) {
        this.contactEnquiryService = contactEnquiryService;
    }

    @GetMapping
    @Operation(summary = "Get all contact enquiries with optional status filter")
    public ResponseEntity<ApiResponse<List<ContactEnquiry>>> getContactEnquiries(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.ok(contactEnquiryService.getAllEnquiries(status)));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update contact enquiry status (e.g. RESOLVED, CLOSED)")
    public ResponseEntity<ApiResponse<ContactEnquiry>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal UserDetails userDetails) {
        String status = payload.getOrDefault("status", "RESOLVED");
        String notes = payload.get("notes");
        String username = (userDetails != null) ? userDetails.getUsername() : "ADMIN";
        ContactEnquiry updated = contactEnquiryService.updateStatus(id, status, notes, username);
        return ResponseEntity.ok(ApiResponse.ok("Contact enquiry updated successfully", updated));
    }
}

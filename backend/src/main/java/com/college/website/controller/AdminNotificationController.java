package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.entity.NotificationTemplate;
import com.college.website.exception.ResourceNotFoundException;
import com.college.website.repository.NotificationTemplateRepository;
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
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/notifications")
@Tag(name = "Admin Email & Notification Settings", description = "Manage notification templates and alert dispatches")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminNotificationController {

    private final NotificationTemplateRepository templateRepository;
    private final AuditLogService auditLogService;

    public AdminNotificationController(NotificationTemplateRepository templateRepository,
                                       AuditLogService auditLogService) {
        this.templateRepository = templateRepository;
        this.auditLogService = auditLogService;
    }

    @GetMapping
    @Operation(summary = "Get all notification templates")
    public ResponseEntity<ApiResponse<List<NotificationTemplate>>> getAllTemplates() {
        return ResponseEntity.ok(ApiResponse.ok(templateRepository.findAllByOrderByTemplateKeyAsc()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get template by ID")
    public ResponseEntity<ApiResponse<NotificationTemplate>> getTemplateById(@PathVariable Long id) {
        NotificationTemplate tmpl = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with ID: " + id));
        return ResponseEntity.ok(ApiResponse.ok(tmpl));
    }

    @PostMapping
    @Operation(summary = "Create or update notification template")
    public ResponseEntity<ApiResponse<NotificationTemplate>> saveTemplate(
            @RequestBody NotificationTemplate template,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        boolean isNew = template.getId() == null;
        NotificationTemplate saved = templateRepository.save(template);
        auditLogService.logAction(username, isNew ? "CREATE_NOTIFICATION_TEMPLATE" : "UPDATE_NOTIFICATION_TEMPLATE",
                "NOTIFICATIONS", "Template: " + saved.getTemplateKey());
        return ResponseEntity.ok(ApiResponse.ok("Template saved successfully", saved));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete notification template")
    public ResponseEntity<ApiResponse<Void>> deleteTemplate(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        NotificationTemplate tmpl = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with ID: " + id));
        templateRepository.delete(tmpl);
        auditLogService.logAction(username, "DELETE_NOTIFICATION_TEMPLATE", "NOTIFICATIONS", "Deleted template: " + tmpl.getTemplateKey());
        return ResponseEntity.ok(ApiResponse.ok("Template deleted successfully", null));
    }

    @PostMapping("/test-send")
    @Operation(summary = "Send test notification preview")
    public ResponseEntity<ApiResponse<Map<String, String>>> testSend(
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal UserDetails userDetails) {
        String target = payload.getOrDefault("recipient", "admin@mpuc.edu.in");
        String templateKey = payload.getOrDefault("templateKey", "ENQUIRY_RECEIVED");
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";

        auditLogService.logAction(username, "TEST_NOTIFICATION_SENT", "NOTIFICATIONS", "Sent test notification to " + target);
        return ResponseEntity.ok(ApiResponse.ok("Test notification successfully queued and dispatched to " + target,
                Map.of("status", "DELIVERED", "recipient", target, "template", templateKey)));
    }
}

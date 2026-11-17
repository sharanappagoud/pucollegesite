package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.dto.WhatsAppAdminSettingsDto;
import com.college.website.dto.WhatsAppSendRequestDto;
import com.college.website.entity.WhatsAppNotificationLog;
import com.college.website.entity.WhatsAppOptIn;
import com.college.website.entity.WhatsAppTemplate;
import com.college.website.service.WhatsAppService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/whatsapp")
@Tag(name = "Admin WhatsApp Management", description = "Manage WhatsApp Business credentials, templates, logs and test messaging")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminWhatsAppController {

    private final WhatsAppService whatsAppService;

    public AdminWhatsAppController(WhatsAppService whatsAppService) {
        this.whatsAppService = whatsAppService;
    }

    @GetMapping("/settings")
    @Operation(summary = "Get WhatsApp configuration and Meta Cloud API connection status")
    public ResponseEntity<ApiResponse<WhatsAppAdminSettingsDto>> getSettings() {
        return ResponseEntity.ok(ApiResponse.ok(whatsAppService.getAdminSettings()));
    }

    @PutMapping("/settings")
    @Operation(summary = "Update WhatsApp settings (phone, welcome message, toggles)")
    public ResponseEntity<ApiResponse<WhatsAppAdminSettingsDto>> updateSettings(
            @RequestBody WhatsAppAdminSettingsDto dto) {
        WhatsAppAdminSettingsDto updated = whatsAppService.updateAdminSettings(dto);
        return ResponseEntity.ok(ApiResponse.ok("WhatsApp settings updated successfully", updated));
    }

    @GetMapping("/templates")
    @Operation(summary = "List all WhatsApp message templates")
    public ResponseEntity<ApiResponse<List<WhatsAppTemplate>>> getTemplates() {
        return ResponseEntity.ok(ApiResponse.ok(whatsAppService.getAllTemplates()));
    }

    @PostMapping("/templates")
    @Operation(summary = "Create a new WhatsApp message template")
    public ResponseEntity<ApiResponse<WhatsAppTemplate>> createTemplate(
            @Valid @RequestBody WhatsAppTemplate template) {
        WhatsAppTemplate created = whatsAppService.saveTemplate(template);
        return ResponseEntity.ok(ApiResponse.ok("Template created successfully", created));
    }

    @PutMapping("/templates/{id}")
    @Operation(summary = "Update an existing WhatsApp message template")
    public ResponseEntity<ApiResponse<WhatsAppTemplate>> updateTemplate(
            @PathVariable Long id,
            @Valid @RequestBody WhatsAppTemplate template) {
        WhatsAppTemplate updated = whatsAppService.updateTemplate(id, template);
        return ResponseEntity.ok(ApiResponse.ok("Template updated successfully", updated));
    }

    @DeleteMapping("/templates/{id}")
    @Operation(summary = "Delete a WhatsApp message template")
    public ResponseEntity<ApiResponse<Void>> deleteTemplate(@PathVariable Long id) {
        whatsAppService.deleteTemplate(id);
        return ResponseEntity.ok(ApiResponse.ok("Template deleted successfully", null));
    }

    @GetMapping("/logs")
    @Operation(summary = "Get paginated WhatsApp notification logs with delivery status")
    public ResponseEntity<ApiResponse<Page<WhatsAppNotificationLog>>> getNotificationLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.ok(whatsAppService.getNotificationLogs(pageable)));
    }

    @GetMapping("/opt-ins")
    @Operation(summary = "Get user consent & opt-in records")
    public ResponseEntity<ApiResponse<Page<WhatsAppOptIn>>> getOptInRecords(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.ok(whatsAppService.getOptInRecords(pageable)));
    }

    @PostMapping("/send")
    @Operation(summary = "Send test or manual notification via WhatsApp Cloud API")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sendMessage(
            @Valid @RequestBody WhatsAppSendRequestDto request) {
        Map<String, Object> result = whatsAppService.sendMessage(request);
        return ResponseEntity.ok(ApiResponse.ok("WhatsApp message processed", result));
    }
}

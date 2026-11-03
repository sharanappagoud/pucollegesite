package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.dto.CollegeSettingDto;
import com.college.website.service.CollegeSettingService;
import com.college.website.service.EmailSenderService;
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
@RequestMapping("/api/v1/admin/settings")
@Tag(name = "Admin College Settings", description = "Update site configuration, contact info, social links")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminSettingController {

    private final CollegeSettingService settingService;
    private final EmailSenderService emailSenderService;

    public AdminSettingController(CollegeSettingService settingService,
                                  EmailSenderService emailSenderService) {
        this.settingService = settingService;
        this.emailSenderService = emailSenderService;
    }

    @GetMapping
    @Operation(summary = "Get all settings for admin")
    public ResponseEntity<ApiResponse<List<CollegeSettingDto>>> getAllSettings() {
        return ResponseEntity.ok(ApiResponse.ok(settingService.getAllSettings()));
    }

    @PostMapping
    @Operation(summary = "Update or add setting")
    public ResponseEntity<ApiResponse<Void>> updateSetting(
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal UserDetails userDetails) {
        String key = payload.get("key");
        String value = payload.get("value");
        String username = (userDetails != null) ? userDetails.getUsername() : "ADMIN";
        settingService.updateSetting(key, value, username);
        return ResponseEntity.ok(ApiResponse.ok("Setting updated successfully", null));
    }

    @PostMapping("/batch")
    @Operation(summary = "Update multiple settings at once")
    public ResponseEntity<ApiResponse<Void>> updateSettingsBatch(
            @RequestBody Map<String, String> settingsMap,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = (userDetails != null) ? userDetails.getUsername() : "ADMIN";
        settingService.updateSettings(settingsMap, username);
        return ResponseEntity.ok(ApiResponse.ok("Settings updated successfully", null));
    }

    @PostMapping("/send-test-email")
    @Operation(summary = "Send test notification email to verify inbox delivery")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sendTestEmail(
            @RequestParam(required = false) String email) {
        boolean sent = emailSenderService.sendTestEmail(email);
        Map<String, Object> res = Map.of(
                "success", sent,
                "targetEmail", (email != null && !email.isBlank()) ? email : emailSenderService.getRecipientEmail(),
                "message", sent ? "Test email dispatched successfully to inbox."
                                : "Direct SMTP sending inactive. To enable SMTP, configure SPRING_MAIL_PASSWORD in application.yml or use the connected Google Webhook."
        );
        return ResponseEntity.ok(ApiResponse.ok(res));
    }
}

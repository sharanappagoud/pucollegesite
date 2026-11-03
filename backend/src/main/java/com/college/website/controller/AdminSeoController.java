package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.service.AuditLogService;
import com.college.website.service.CollegeSettingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/seo")
@Tag(name = "Admin SEO & Social Media", description = "Manage search engine optimization tags, OG graph, and social links")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminSeoController {

    private final CollegeSettingService settingService;
    private final AuditLogService auditLogService;

    public AdminSeoController(CollegeSettingService settingService, AuditLogService auditLogService) {
        this.settingService = settingService;
        this.auditLogService = auditLogService;
    }

    @GetMapping
    @Operation(summary = "Get current SEO and social media settings")
    public ResponseEntity<ApiResponse<Map<String, String>>> getSeoSettings() {
        Map<String, String> all = settingService.getAllSettingsAsMap();
        Map<String, String> seoMap = new HashMap<>();
        String[] keys = {
                "seo_meta_title", "seo_meta_description", "seo_keywords",
                "og_image_url", "google_analytics_id", "sitemap_url", "robots_txt",
                "social_facebook", "social_twitter", "social_instagram",
                "social_youtube", "social_linkedin", "social_whatsapp"
        };
        for (String k : keys) {
            seoMap.put(k, all.getOrDefault(k, ""));
        }
        return ResponseEntity.ok(ApiResponse.ok(seoMap));
    }

    @PostMapping
    @Operation(summary = "Update SEO and social media settings")
    public ResponseEntity<ApiResponse<Map<String, String>>> updateSeoSettings(
            @RequestBody Map<String, String> settings,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        for (Map.Entry<String, String> entry : settings.entrySet()) {
            settingService.updateSetting(entry.getKey(), entry.getValue(), username);
        }
        auditLogService.logAction(username, "UPDATE_SEO_SETTINGS", "SEO_SETTINGS", "Updated " + settings.size() + " SEO/social keys");
        return ResponseEntity.ok(ApiResponse.ok("SEO & Social Media settings updated successfully", settings));
    }
}

package com.college.website.controller;

import com.college.website.dto.AdmissionEnquiryResponse;
import com.college.website.dto.ApiResponse;
import com.college.website.dto.UpdateEnquiryStatusRequest;
import com.college.website.service.AdmissionEnquiryService;
import com.college.website.service.GoogleSheetsSyncService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/admission-enquiries")
@Tag(name = "Admin Admission Enquiry Management", description = "Review and process student enquiries")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'ADMISSION_STAFF')")
public class AdminEnquiryController {

    private final AdmissionEnquiryService admissionEnquiryService;
    private final GoogleSheetsSyncService googleSheetsSyncService;

    public AdminEnquiryController(AdmissionEnquiryService admissionEnquiryService,
                                  GoogleSheetsSyncService googleSheetsSyncService) {
        this.admissionEnquiryService = admissionEnquiryService;
        this.googleSheetsSyncService = googleSheetsSyncService;
    }

    @GetMapping
    @Operation(summary = "List admission enquiries with optional status or stream filter")
    public ResponseEntity<ApiResponse<List<AdmissionEnquiryResponse>>> getEnquiries(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String stream) {
        return ResponseEntity.ok(ApiResponse.ok(admissionEnquiryService.getAllEnquiries(status, stream)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single admission enquiry details")
    public ResponseEntity<ApiResponse<AdmissionEnquiryResponse>> getEnquiryById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(admissionEnquiryService.getEnquiryById(id)));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update enquiry status and append follow-up notes")
    public ResponseEntity<ApiResponse<AdmissionEnquiryResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEnquiryStatusRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = (userDetails != null) ? userDetails.getUsername() : "ADMIN";
        AdmissionEnquiryResponse updated = admissionEnquiryService.updateStatus(id, request, username);
        return ResponseEntity.ok(ApiResponse.ok("Enquiry status updated successfully", updated));
    }

    @GetMapping("/export-csv")
    @Operation(summary = "Export all admission enquiries to CSV format")
    public ResponseEntity<String> exportCsv() {
        String csv = admissionEnquiryService.exportEnquiriesToCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=admission_enquiries.csv")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csv);
    }

    @GetMapping("/google-sheets-config")
    @Operation(summary = "Get Google Sheets configuration and live spreadsheet link")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getGoogleSheetsConfig() {
        return ResponseEntity.ok(ApiResponse.ok(googleSheetsSyncService.getConfig()));
    }

    @PutMapping("/google-sheets-config")
    @Operation(summary = "Update Google Sheets spreadsheet URL, webhook URL, and auto-sync status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateGoogleSheetsConfig(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = (userDetails != null) ? userDetails.getUsername() : "ADMIN";
        String spreadsheetUrl = (String) body.get("spreadsheetUrl");
        String webhookUrl = (String) body.get("webhookUrl");
        Boolean syncEnabled = body.get("syncEnabled") != null ? Boolean.valueOf(body.get("syncEnabled").toString()) : true;
        String ownerEmail = (String) body.get("ownerEmail");

        googleSheetsSyncService.updateConfig(spreadsheetUrl, webhookUrl, syncEnabled, ownerEmail, username);
        return ResponseEntity.ok(ApiResponse.ok("Google Sheets configuration updated successfully", googleSheetsSyncService.getConfig()));
    }

    @PostMapping("/sync-google-sheets")
    @Operation(summary = "Trigger immediate full sync of all admissions to Google Spreadsheet")
    public ResponseEntity<ApiResponse<Map<String, Object>>> syncAllToGoogleSheets() {
        Map<String, Object> result = googleSheetsSyncService.syncAllRecords();
        return ResponseEntity.ok(ApiResponse.ok(result));
    }
}

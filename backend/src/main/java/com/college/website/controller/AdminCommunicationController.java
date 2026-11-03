package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.dto.CommunicationLogDto;
import com.college.website.dto.PagedResponse;
import com.college.website.dto.SendDirectMessageRequest;
import com.college.website.service.CommunicationLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/communications")
@Tag(name = "Admin Communication Logs", description = "Email & SMS send record history for staff, students, and parents")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'STAFF', 'ADMISSION_STAFF')")
public class AdminCommunicationController {

    private final CommunicationLogService communicationLogService;

    public AdminCommunicationController(CommunicationLogService communicationLogService) {
        this.communicationLogService = communicationLogService;
    }

    @GetMapping("/logs")
    @Operation(summary = "Get paginated email & SMS send history with filters")
    public ResponseEntity<ApiResponse<PagedResponse<CommunicationLogDto>>> getLogs(
            @RequestParam(required = false) String recipientType,
            @RequestParam(required = false) String channel,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        PagedResponse<CommunicationLogDto> logs = communicationLogService.getFilteredLogs(recipientType, channel, search, page, size);
        return ResponseEntity.ok(ApiResponse.ok(logs));
    }

    @GetMapping("/logs/enquiry/{referenceNo}")
    @Operation(summary = "Get all email & SMS history for a specific enquiry")
    public ResponseEntity<ApiResponse<List<CommunicationLogDto>>> getEnquiryLogs(
            @PathVariable String referenceNo) {
        List<CommunicationLogDto> logs = communicationLogService.getLogsByReference(referenceNo);
        return ResponseEntity.ok(ApiResponse.ok(logs));
    }

    @PostMapping("/send-direct")
    @Operation(summary = "Send direct SMS or Email message to Staff, Student, or Parent")
    public ResponseEntity<ApiResponse<CommunicationLogDto>> sendDirectMessage(
            @Valid @RequestBody SendDirectMessageRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String adminUser = userDetails != null ? userDetails.getUsername() : "admin";
        CommunicationLogDto log = communicationLogService.sendDirectMessage(request, adminUser);
        return ResponseEntity.ok(ApiResponse.ok("Message dispatched successfully and logged in history", log));
    }
}

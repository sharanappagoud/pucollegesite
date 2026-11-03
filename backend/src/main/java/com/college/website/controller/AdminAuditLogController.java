package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.entity.AuditLog;
import com.college.website.repository.AuditLogRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/audit-logs")
@Tag(name = "Admin Audit Logs & Activity History", description = "Immutable audit logs of administrative activities and system changes")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
public class AdminAuditLogController {

    private final AuditLogRepository auditLogRepository;

    public AdminAuditLogController(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @GetMapping
    @Operation(summary = "Get immutable audit logs with pagination")
    public ResponseEntity<ApiResponse<Page<AuditLog>>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 100));
        Page<AuditLog> logPage = auditLogRepository.findAllByOrderByCreatedAtDesc(pageable);
        return ResponseEntity.ok(ApiResponse.ok(logPage));
    }

    @GetMapping("/recent")
    @Operation(summary = "Get top 20 recent audit log entries")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getRecentLogs() {
        return ResponseEntity.ok(ApiResponse.ok(auditLogRepository.findTop20ByOrderByCreatedAtDesc()));
    }
}

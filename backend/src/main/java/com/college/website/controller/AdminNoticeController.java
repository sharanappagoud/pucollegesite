package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.dto.NoticeDto;
import com.college.website.service.NoticeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/notices")
@Tag(name = "Admin Notice Management", description = "CRUD for official notices and circulars")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminNoticeController {

    private final NoticeService noticeService;

    public AdminNoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @GetMapping
    @Operation(summary = "Get all notices for admin")
    public ResponseEntity<ApiResponse<List<NoticeDto>>> getAllNotices() {
        return ResponseEntity.ok(ApiResponse.ok(noticeService.getAllNotices()));
    }

    @PostMapping
    @Operation(summary = "Create or update notice")
    public ResponseEntity<ApiResponse<NoticeDto>> saveNotice(
            @Valid @RequestBody NoticeDto noticeDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = (userDetails != null) ? userDetails.getUsername() : "ADMIN";
        NoticeDto saved = noticeService.saveNotice(noticeDto, username);
        return ResponseEntity.ok(ApiResponse.ok("Notice saved successfully", saved));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete notice")
    public ResponseEntity<ApiResponse<Void>> deleteNotice(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = (userDetails != null) ? userDetails.getUsername() : "ADMIN";
        noticeService.deleteNotice(id, username);
        return ResponseEntity.ok(ApiResponse.ok("Notice deleted successfully", null));
    }
}

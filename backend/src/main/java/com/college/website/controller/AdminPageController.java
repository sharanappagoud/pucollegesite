package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.entity.PageContent;
import com.college.website.exception.ResourceNotFoundException;
import com.college.website.repository.PageContentRepository;
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
@RequestMapping("/api/v1/admin/pages")
@Tag(name = "Admin Page Content Management", description = "CRUD for slug-based CMS pages")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'CONTENT_EDITOR')")
public class AdminPageController {

    private final PageContentRepository pageContentRepository;
    private final AuditLogService auditLogService;

    public AdminPageController(PageContentRepository pageContentRepository, AuditLogService auditLogService) {
        this.pageContentRepository = pageContentRepository;
        this.auditLogService = auditLogService;
    }

    @GetMapping
    @Operation(summary = "List all CMS pages")
    public ResponseEntity<ApiResponse<List<PageContent>>> getAllPages() {
        return ResponseEntity.ok(ApiResponse.ok(pageContentRepository.findAll()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single page by ID")
    public ResponseEntity<ApiResponse<PageContent>> getPageById(@PathVariable Long id) {
        PageContent page = pageContentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found with ID: " + id));
        return ResponseEntity.ok(ApiResponse.ok(page));
    }

    @PostMapping
    @Operation(summary = "Create or update CMS page")
    public ResponseEntity<ApiResponse<PageContent>> savePage(
            @RequestBody PageContent page,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        boolean isNew = page.getId() == null;
        PageContent saved = pageContentRepository.save(page);
        auditLogService.logAction(username, isNew ? "CREATE_PAGE" : "UPDATE_PAGE", "PAGES", "Page: " + saved.getSlug());
        return ResponseEntity.ok(ApiResponse.ok("Page saved successfully", saved));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete CMS page")
    public ResponseEntity<ApiResponse<Void>> deletePage(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        PageContent page = pageContentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found with ID: " + id));
        pageContentRepository.delete(page);
        auditLogService.logAction(username, "DELETE_PAGE", "PAGES", "Deleted slug: " + page.getSlug());
        return ResponseEntity.ok(ApiResponse.ok("Page deleted successfully", null));
    }

    @PatchMapping("/{id}/publish")
    @Operation(summary = "Toggle page publication status")
    public ResponseEntity<ApiResponse<PageContent>> togglePublish(
            @PathVariable Long id,
            @RequestParam boolean published,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        PageContent page = pageContentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found with ID: " + id));
        page.setPublished(published);
        PageContent saved = pageContentRepository.save(page);
        auditLogService.logAction(username, "TOGGLE_PAGE_PUBLISH", "PAGES", "Slug: " + page.getSlug() + " -> " + published);
        return ResponseEntity.ok(ApiResponse.ok("Publish status updated", saved));
    }
}

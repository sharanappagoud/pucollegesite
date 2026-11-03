package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.entity.Banner;
import com.college.website.entity.GalleryImage;
import com.college.website.exception.ResourceNotFoundException;
import com.college.website.repository.BannerRepository;
import com.college.website.repository.GalleryImageRepository;
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
@RequestMapping("/api/v1/admin/banners")
@Tag(name = "Admin Banner & Media Library", description = "CRUD for hero banners and media assets")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'CONTENT_EDITOR', 'ADMISSION_STAFF', 'STAFF')")
public class AdminBannerController {

    private final BannerRepository bannerRepository;
    private final GalleryImageRepository galleryImageRepository;
    private final AuditLogService auditLogService;

    public AdminBannerController(BannerRepository bannerRepository,
                                 GalleryImageRepository galleryImageRepository,
                                 AuditLogService auditLogService) {
        this.bannerRepository = bannerRepository;
        this.galleryImageRepository = galleryImageRepository;
        this.auditLogService = auditLogService;
    }

    @GetMapping
    @Operation(summary = "Get all hero banners")
    public ResponseEntity<ApiResponse<List<Banner>>> getAllBanners() {
        return ResponseEntity.ok(ApiResponse.ok(bannerRepository.findAllByOrderByDisplayOrderAsc()));
    }

    @PostMapping
    @Operation(summary = "Create or update hero banner")
    public ResponseEntity<ApiResponse<Banner>> saveBanner(
            @RequestBody Banner banner,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        boolean isNew = banner.getId() == null;
        Banner saved = bannerRepository.save(banner);
        auditLogService.logAction(username, isNew ? "CREATE_BANNER" : "UPDATE_BANNER", "BANNERS", "Title: " + saved.getTitle());
        return ResponseEntity.ok(ApiResponse.ok("Banner saved successfully", saved));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete hero banner")
    public ResponseEntity<ApiResponse<Void>> deleteBanner(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Banner not found with ID: " + id));
        bannerRepository.delete(banner);
        auditLogService.logAction(username, "DELETE_BANNER", "BANNERS", "Deleted banner: " + banner.getTitle());
        return ResponseEntity.ok(ApiResponse.ok("Banner deleted successfully", null));
    }

    @PatchMapping("/{id}/active")
    @Operation(summary = "Toggle banner active status")
    public ResponseEntity<ApiResponse<Banner>> toggleActive(
            @PathVariable Long id,
            @RequestParam boolean active,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Banner not found with ID: " + id));
        banner.setActive(active);
        Banner saved = bannerRepository.save(banner);
        auditLogService.logAction(username, "TOGGLE_BANNER_ACTIVE", "BANNERS", "Banner ID: " + id + " -> " + active);
        return ResponseEntity.ok(ApiResponse.ok("Banner status updated", saved));
    }

    @GetMapping("/media")
    @Operation(summary = "List all media assets in media library")
    public ResponseEntity<ApiResponse<List<GalleryImage>>> getAllMedia() {
        return ResponseEntity.ok(ApiResponse.ok(galleryImageRepository.findAll()));
    }

    @PostMapping("/media")
    @Operation(summary = "Add image to media library")
    public ResponseEntity<ApiResponse<GalleryImage>> addMedia(
            @RequestBody GalleryImage image,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        GalleryImage saved = galleryImageRepository.save(image);
        auditLogService.logAction(username, "UPLOAD_MEDIA", "MEDIA_LIBRARY", "Added media: " + saved.getTitle());
        return ResponseEntity.ok(ApiResponse.ok("Media item added", saved));
    }

    @DeleteMapping("/media/{id}")
    @Operation(summary = "Delete image from media library")
    public ResponseEntity<ApiResponse<Void>> deleteMedia(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        galleryImageRepository.deleteById(id);
        auditLogService.logAction(username, "DELETE_MEDIA", "MEDIA_LIBRARY", "Deleted media ID: " + id);
        return ResponseEntity.ok(ApiResponse.ok("Media item deleted", null));
    }
}

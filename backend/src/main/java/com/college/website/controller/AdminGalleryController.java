package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.entity.GalleryCategory;
import com.college.website.entity.GalleryImage;
import com.college.website.exception.ResourceNotFoundException;
import com.college.website.repository.GalleryCategoryRepository;
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
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/gallery")
@Tag(name = "Admin Campus Photo Gallery", description = "Manage gallery images and categories for the Owl Carousel")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'CONTENT_EDITOR', 'ADMISSION_STAFF', 'STAFF')")
public class AdminGalleryController {

    private final GalleryImageRepository imageRepository;
    private final GalleryCategoryRepository categoryRepository;
    private final AuditLogService auditLogService;

    public AdminGalleryController(GalleryImageRepository imageRepository,
                                  GalleryCategoryRepository categoryRepository,
                                  AuditLogService auditLogService) {
        this.imageRepository = imageRepository;
        this.categoryRepository = categoryRepository;
        this.auditLogService = auditLogService;
    }

    // ─── GALLERY IMAGES ────────────────────────────────────────────────────────

    @GetMapping("/images")
    @Operation(summary = "Get all gallery images (optionally by category)")
    public ResponseEntity<ApiResponse<List<GalleryImage>>> getAllImages(
            @RequestParam(required = false) Long categoryId) {
        List<GalleryImage> images = (categoryId != null)
                ? imageRepository.findByCategoryIdOrderByDisplayOrderAsc(categoryId)
                : imageRepository.findAllByOrderByDisplayOrderAsc();
        return ResponseEntity.ok(ApiResponse.ok(images));
    }

    @PostMapping("/images")
    @Operation(summary = "Add a new gallery image")
    public ResponseEntity<ApiResponse<GalleryImage>> addImage(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "admin";

        GalleryImage img = new GalleryImage();
        img.setTitle((String) body.getOrDefault("title", "Untitled"));
        img.setDescription((String) body.getOrDefault("description", ""));
        img.setImageUrl((String) body.get("imageUrl"));
        img.setDisplayOrder(body.get("displayOrder") != null
                ? Integer.parseInt(body.get("displayOrder").toString()) : 0);

        Object catId = body.get("categoryId");
        if (catId != null) {
            Long id = Long.parseLong(catId.toString());
            categoryRepository.findById(id).ifPresent(img::setCategory);
        }

        GalleryImage saved = imageRepository.save(img);
        auditLogService.logAction(username, "ADD_GALLERY_IMAGE", "GALLERY", "Added: " + saved.getTitle());
        return ResponseEntity.ok(ApiResponse.ok("Image added to gallery", saved));
    }

    @PutMapping("/images/{id}")
    @Operation(summary = "Update an existing gallery image")
    public ResponseEntity<ApiResponse<GalleryImage>> updateImage(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "admin";

        GalleryImage img = imageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery Image", "id", id));

        if (body.containsKey("title")) img.setTitle((String) body.get("title"));
        if (body.containsKey("description")) img.setDescription((String) body.get("description"));
        if (body.containsKey("imageUrl")) img.setImageUrl((String) body.get("imageUrl"));
        if (body.containsKey("displayOrder"))
            img.setDisplayOrder(Integer.parseInt(body.get("displayOrder").toString()));

        if (body.containsKey("categoryId") && body.get("categoryId") != null) {
            Long catId = Long.parseLong(body.get("categoryId").toString());
            categoryRepository.findById(catId).ifPresent(img::setCategory);
        } else if (body.containsKey("categoryId")) {
            img.setCategory(null);
        }

        GalleryImage saved = imageRepository.save(img);
        auditLogService.logAction(username, "UPDATE_GALLERY_IMAGE", "GALLERY", "Updated: " + saved.getTitle());
        return ResponseEntity.ok(ApiResponse.ok("Image updated", saved));
    }

    @DeleteMapping("/images/{id}")
    @Operation(summary = "Delete a gallery image")
    public ResponseEntity<ApiResponse<Void>> deleteImage(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "admin";
        GalleryImage img = imageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery Image", "id", id));
        imageRepository.delete(img);
        auditLogService.logAction(username, "DELETE_GALLERY_IMAGE", "GALLERY", "Deleted image ID: " + id);
        return ResponseEntity.ok(ApiResponse.ok("Image deleted", null));
    }

    // ─── GALLERY CATEGORIES ────────────────────────────────────────────────────

    @GetMapping("/categories")
    @Operation(summary = "Get all gallery categories")
    public ResponseEntity<ApiResponse<List<GalleryCategory>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.ok(categoryRepository.findAll()));
    }

    @PostMapping("/categories")
    @Operation(summary = "Create a new gallery category")
    public ResponseEntity<ApiResponse<GalleryCategory>> createCategory(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "admin";
        String name = body.getOrDefault("name", "New Category");
        String slug = name.toLowerCase().replaceAll("[^a-z0-9]+", "-");

        GalleryCategory cat = new GalleryCategory(name, slug);
        GalleryCategory saved = categoryRepository.save(cat);
        auditLogService.logAction(username, "CREATE_GALLERY_CATEGORY", "GALLERY", "Category: " + name);
        return ResponseEntity.ok(ApiResponse.ok("Category created", saved));
    }

    @DeleteMapping("/categories/{id}")
    @Operation(summary = "Delete a gallery category (images are also deleted)")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "admin";
        GalleryCategory cat = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery Category", "id", id));
        categoryRepository.delete(cat);
        auditLogService.logAction(username, "DELETE_GALLERY_CATEGORY", "GALLERY", "Deleted category: " + cat.getName());
        return ResponseEntity.ok(ApiResponse.ok("Category deleted", null));
    }
}


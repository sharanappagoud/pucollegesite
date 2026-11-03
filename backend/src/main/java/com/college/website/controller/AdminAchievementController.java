package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.entity.StudentAchievement;
import com.college.website.exception.ResourceNotFoundException;
import com.college.website.repository.StudentAchievementRepository;
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
@RequestMapping("/api/v1/admin/achievements")
@Tag(name = "Admin Student Achievements", description = "CRUD for student achievements and ranks")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'CONTENT_EDITOR')")
public class AdminAchievementController {

    private final StudentAchievementRepository achievementRepository;
    private final AuditLogService auditLogService;

    public AdminAchievementController(StudentAchievementRepository achievementRepository,
                                      AuditLogService auditLogService) {
        this.achievementRepository = achievementRepository;
        this.auditLogService = auditLogService;
    }

    @GetMapping
    @Operation(summary = "Get all student achievements")
    public ResponseEntity<ApiResponse<List<StudentAchievement>>> getAllAchievements() {
        return ResponseEntity.ok(ApiResponse.ok(achievementRepository.findAllByOrderByCreatedAtDesc()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single achievement by ID")
    public ResponseEntity<ApiResponse<StudentAchievement>> getAchievementById(@PathVariable Long id) {
        StudentAchievement item = achievementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Achievement not found with ID: " + id));
        return ResponseEntity.ok(ApiResponse.ok(item));
    }

    @PostMapping
    @Operation(summary = "Create or update student achievement")
    public ResponseEntity<ApiResponse<StudentAchievement>> saveAchievement(
            @RequestBody StudentAchievement achievement,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        boolean isNew = achievement.getId() == null;
        StudentAchievement saved = achievementRepository.save(achievement);
        auditLogService.logAction(username, isNew ? "CREATE_ACHIEVEMENT" : "UPDATE_ACHIEVEMENT", "ACHIEVEMENTS",
                "Student: " + saved.getStudentName() + " (" + saved.getRankOrScore() + ")");
        return ResponseEntity.ok(ApiResponse.ok("Achievement saved successfully", saved));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete student achievement")
    public ResponseEntity<ApiResponse<Void>> deleteAchievement(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        StudentAchievement item = achievementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Achievement not found with ID: " + id));
        achievementRepository.delete(item);
        auditLogService.logAction(username, "DELETE_ACHIEVEMENT", "ACHIEVEMENTS", "Deleted achievement: " + item.getStudentName());
        return ResponseEntity.ok(ApiResponse.ok("Achievement deleted successfully", null));
    }

    @PatchMapping("/{id}/publish")
    @Operation(summary = "Toggle achievement publication status")
    public ResponseEntity<ApiResponse<StudentAchievement>> togglePublish(
            @PathVariable Long id,
            @RequestParam boolean published,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        StudentAchievement item = achievementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Achievement not found with ID: " + id));
        item.setPublished(published);
        StudentAchievement saved = achievementRepository.save(item);
        auditLogService.logAction(username, "TOGGLE_ACHIEVEMENT_PUBLISH", "ACHIEVEMENTS", "ID: " + id + " -> " + published);
        return ResponseEntity.ok(ApiResponse.ok("Publication status updated", saved));
    }
}

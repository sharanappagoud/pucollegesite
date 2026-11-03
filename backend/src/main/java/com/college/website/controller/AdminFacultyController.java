package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.dto.FacultyDto;
import com.college.website.service.FacultyService;
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
@RequestMapping("/api/v1/admin/faculty")
@Tag(name = "Admin Faculty Management", description = "CRUD for faculty directory")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminFacultyController {

    private final FacultyService facultyService;

    public AdminFacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    @GetMapping
    @Operation(summary = "Get all faculty profiles for admin")
    public ResponseEntity<ApiResponse<List<FacultyDto>>> getAllFaculty() {
        return ResponseEntity.ok(ApiResponse.ok(facultyService.getAllFacultyAdmin()));
    }

    @PostMapping
    @Operation(summary = "Create or update faculty member profile")
    public ResponseEntity<ApiResponse<FacultyDto>> saveFaculty(
            @Valid @RequestBody FacultyDto facultyDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = (userDetails != null) ? userDetails.getUsername() : "ADMIN";
        FacultyDto saved = facultyService.saveFaculty(facultyDto, username);
        return ResponseEntity.ok(ApiResponse.ok("Faculty profile saved successfully", saved));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete faculty member profile")
    public ResponseEntity<ApiResponse<Void>> deleteFaculty(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = (userDetails != null) ? userDetails.getUsername() : "ADMIN";
        facultyService.deleteFaculty(id, username);
        return ResponseEntity.ok(ApiResponse.ok("Faculty profile deleted successfully", null));
    }
}

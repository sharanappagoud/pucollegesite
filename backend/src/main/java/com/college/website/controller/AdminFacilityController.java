package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.dto.FacilityDto;
import com.college.website.service.FacilityService;
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
@RequestMapping("/api/v1/admin/facilities")
@Tag(name = "Admin Facility Management", description = "CRUD for campus facilities & labs")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminFacilityController {

    private final FacilityService facilityService;

    public AdminFacilityController(FacilityService facilityService) {
        this.facilityService = facilityService;
    }

    @GetMapping
    @Operation(summary = "Get all campus facilities")
    public ResponseEntity<ApiResponse<List<FacilityDto>>> getAllFacilities() {
        return ResponseEntity.ok(ApiResponse.ok(facilityService.getAllFacilitiesAdmin()));
    }

    @PostMapping
    @Operation(summary = "Create or update campus facility")
    public ResponseEntity<ApiResponse<FacilityDto>> saveFacility(
            @Valid @RequestBody FacilityDto facilityDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = (userDetails != null) ? userDetails.getUsername() : "ADMIN";
        FacilityDto saved = facilityService.saveFacility(facilityDto, username);
        return ResponseEntity.ok(ApiResponse.ok("Facility saved successfully", saved));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete campus facility")
    public ResponseEntity<ApiResponse<Void>> deleteFacility(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = (userDetails != null) ? userDetails.getUsername() : "ADMIN";
        facilityService.deleteFacility(id, username);
        return ResponseEntity.ok(ApiResponse.ok("Facility deleted successfully", null));
    }
}

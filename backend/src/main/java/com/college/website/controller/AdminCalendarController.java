package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.dto.CalendarItemDto;
import com.college.website.service.AcademicCalendarService;
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
@RequestMapping("/api/v1/admin/calendar")
@Tag(name = "Admin Academic Calendar Management", description = "CRUD for academic calendar milestones")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCalendarController {

    private final AcademicCalendarService calendarService;

    public AdminCalendarController(AcademicCalendarService calendarService) {
        this.calendarService = calendarService;
    }

    @GetMapping
    @Operation(summary = "Get academic calendar items")
    public ResponseEntity<ApiResponse<List<CalendarItemDto>>> getCalendarItems(
            @RequestParam(required = false, defaultValue = "2026-27") String year) {
        return ResponseEntity.ok(ApiResponse.ok(calendarService.getCalendarByYear(year)));
    }

    @PostMapping
    @Operation(summary = "Create or update calendar item")
    public ResponseEntity<ApiResponse<CalendarItemDto>> saveCalendarItem(
            @Valid @RequestBody CalendarItemDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = (userDetails != null) ? userDetails.getUsername() : "ADMIN";
        CalendarItemDto saved = calendarService.saveCalendarItem(dto, username);
        return ResponseEntity.ok(ApiResponse.ok("Calendar event saved successfully", saved));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete calendar item")
    public ResponseEntity<ApiResponse<Void>> deleteCalendarItem(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = (userDetails != null) ? userDetails.getUsername() : "ADMIN";
        calendarService.deleteCalendarItem(id, username);
        return ResponseEntity.ok(ApiResponse.ok("Calendar event deleted successfully", null));
    }
}

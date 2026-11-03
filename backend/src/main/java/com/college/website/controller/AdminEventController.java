package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.dto.EventDto;
import com.college.website.service.EventService;
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
@RequestMapping("/api/v1/admin/events")
@Tag(name = "Admin Event Management", description = "CRUD for campus events")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminEventController {

    private final EventService eventService;

    public AdminEventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    @Operation(summary = "Get all events for admin")
    public ResponseEntity<ApiResponse<List<EventDto>>> getAllEvents() {
        return ResponseEntity.ok(ApiResponse.ok(eventService.getAllEvents()));
    }

    @PostMapping
    @Operation(summary = "Create or update event")
    public ResponseEntity<ApiResponse<EventDto>> saveEvent(
            @Valid @RequestBody EventDto eventDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = (userDetails != null) ? userDetails.getUsername() : "ADMIN";
        EventDto saved = eventService.saveEvent(eventDto, username);
        return ResponseEntity.ok(ApiResponse.ok("Event saved successfully", saved));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete event")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = (userDetails != null) ? userDetails.getUsername() : "ADMIN";
        eventService.deleteEvent(id, username);
        return ResponseEntity.ok(ApiResponse.ok("Event deleted successfully", null));
    }
}

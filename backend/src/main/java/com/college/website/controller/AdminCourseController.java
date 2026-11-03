package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.dto.CourseDto;
import com.college.website.service.CourseService;
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
@RequestMapping("/api/v1/admin/courses")
@Tag(name = "Admin Course Management", description = "CRUD for Science and Commerce courses & subject combinations")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCourseController {

    private final CourseService courseService;

    public AdminCourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    @Operation(summary = "Get all courses for administrative management")
    public ResponseEntity<ApiResponse<List<CourseDto>>> getAllCourses() {
        return ResponseEntity.ok(ApiResponse.ok(courseService.getAllCoursesAdmin()));
    }

    @PostMapping
    @Operation(summary = "Create or update course with subjects")
    public ResponseEntity<ApiResponse<CourseDto>> saveCourse(
            @Valid @RequestBody CourseDto courseDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = (userDetails != null) ? userDetails.getUsername() : "ADMIN";
        CourseDto saved = courseService.saveCourse(courseDto, username);
        return ResponseEntity.ok(ApiResponse.ok("Course saved successfully", saved));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete course by ID")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = (userDetails != null) ? userDetails.getUsername() : "ADMIN";
        courseService.deleteCourse(id, username);
        return ResponseEntity.ok(ApiResponse.ok("Course deleted successfully", null));
    }
}

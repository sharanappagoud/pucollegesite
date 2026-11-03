package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.entity.Department;
import com.college.website.exception.ResourceNotFoundException;
import com.college.website.repository.DepartmentRepository;
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
@RequestMapping("/api/v1/admin/departments")
@Tag(name = "Admin Staff & Department Management", description = "CRUD for academic departments, HODs and contact details")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminDepartmentController {

    private final DepartmentRepository departmentRepository;
    private final AuditLogService auditLogService;

    public AdminDepartmentController(DepartmentRepository departmentRepository,
                                    AuditLogService auditLogService) {
        this.departmentRepository = departmentRepository;
        this.auditLogService = auditLogService;
    }

    @GetMapping
    @Operation(summary = "Get all departments")
    public ResponseEntity<ApiResponse<List<Department>>> getAllDepartments() {
        return ResponseEntity.ok(ApiResponse.ok(departmentRepository.findAllByOrderByNameAsc()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get department by ID")
    public ResponseEntity<ApiResponse<Department>> getDepartmentById(@PathVariable Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));
        return ResponseEntity.ok(ApiResponse.ok(dept));
    }

    @PostMapping
    @Operation(summary = "Create or update department")
    public ResponseEntity<ApiResponse<Department>> saveDepartment(
            @RequestBody Department department,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        boolean isNew = department.getId() == null;
        Department saved = departmentRepository.save(department);
        auditLogService.logAction(username, isNew ? "CREATE_DEPARTMENT" : "UPDATE_DEPARTMENT", "DEPARTMENTS",
                "Department: " + saved.getName() + " (" + saved.getCode() + ")");
        return ResponseEntity.ok(ApiResponse.ok("Department saved successfully", saved));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete department")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));
        departmentRepository.delete(dept);
        auditLogService.logAction(username, "DELETE_DEPARTMENT", "DEPARTMENTS", "Deleted department: " + dept.getName());
        return ResponseEntity.ok(ApiResponse.ok("Department deleted successfully", null));
    }

    @PatchMapping("/{id}/active")
    @Operation(summary = "Toggle department active status")
    public ResponseEntity<ApiResponse<Department>> toggleActive(
            @PathVariable Long id,
            @RequestParam boolean active,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));
        dept.setActive(active);
        Department saved = departmentRepository.save(dept);
        auditLogService.logAction(username, "TOGGLE_DEPARTMENT_ACTIVE", "DEPARTMENTS", "Dept ID: " + id + " -> " + active);
        return ResponseEntity.ok(ApiResponse.ok("Status updated successfully", saved));
    }
}

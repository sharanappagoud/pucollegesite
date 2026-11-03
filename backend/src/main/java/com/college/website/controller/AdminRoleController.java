package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.dto.UserAdminDto;
import com.college.website.entity.Role;
import com.college.website.entity.User;
import com.college.website.exception.BadRequestException;
import com.college.website.exception.ResourceNotFoundException;
import com.college.website.repository.RoleRepository;
import com.college.website.repository.UserRepository;
import com.college.website.service.AuditLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "Admin Roles & User Permissions", description = "Manage system roles, staff permissions, and administrative accounts")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
public class AdminRoleController {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    public AdminRoleController(RoleRepository roleRepository,
                               UserRepository userRepository,
                               PasswordEncoder passwordEncoder,
                               AuditLogService auditLogService) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
    }

    @GetMapping("/roles")
    @Operation(summary = "Get all system roles and descriptions")
    public ResponseEntity<ApiResponse<List<Role>>> getAllRoles() {
        return ResponseEntity.ok(ApiResponse.ok(roleRepository.findAll()));
    }

    @GetMapping("/users")
    @Operation(summary = "Get all administrator and staff accounts")
    public ResponseEntity<ApiResponse<List<UserAdminDto>>> getAllUsers() {
        List<UserAdminDto> dtoList = userRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(dtoList));
    }

    @PostMapping("/users")
    @Operation(summary = "Create new staff or administrative account")
    public ResponseEntity<ApiResponse<UserAdminDto>> createUser(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        String currentAdmin = userDetails != null ? userDetails.getUsername() : "ADMIN";
        String username = (String) body.get("username");
        String email = (String) body.get("email");
        String fullName = (String) body.get("fullName");
        String phone = (String) body.get("phone");
        String password = (String) body.get("password");

        if (username == null || username.isBlank() || password == null || password.length() < 6) {
            throw new BadRequestException("Username and a password of at least 6 characters are required");
        }
        if (userRepository.existsByUsername(username)) {
            throw new BadRequestException("Username is already taken");
        }
        if (email != null && userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email is already registered");
        }

        User user = new User();
        user.setUsername(username.trim().toLowerCase());
        user.setEmail(email != null ? email.trim() : username + "@mpuc.edu.in");
        user.setFullName(fullName != null ? fullName : username);
        user.setPhone(phone);
        user.setPassword(passwordEncoder.encode(password));
        user.setActive(true);

        @SuppressWarnings("unchecked")
        List<String> roleNames = (List<String>) body.get("roles");
        Set<Role> roles = new HashSet<>();
        if (roleNames != null && !roleNames.isEmpty()) {
            for (String rName : roleNames) {
                roleRepository.findByName(rName).ifPresent(roles::add);
            }
        }
        if (roles.isEmpty()) {
            roleRepository.findByName("ROLE_STAFF").ifPresent(roles::add);
        }
        user.setRoles(roles);

        User saved = userRepository.save(user);
        auditLogService.logAction(currentAdmin, "CREATE_USER", "ROLES_PERMISSIONS",
                "Created user: " + saved.getUsername() + " with roles " + roleNames);
        return ResponseEntity.ok(ApiResponse.ok("User created successfully", toDto(saved)));
    }

    @PutMapping("/users/{id}")
    @Operation(summary = "Update user details and assigned roles")
    public ResponseEntity<ApiResponse<UserAdminDto>> updateUser(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        String currentAdmin = userDetails != null ? userDetails.getUsername() : "ADMIN";
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        if (body.containsKey("fullName")) user.setFullName((String) body.get("fullName"));
        if (body.containsKey("phone")) user.setPhone((String) body.get("phone"));
        if (body.containsKey("email")) user.setEmail((String) body.get("email"));
        if (body.containsKey("active")) user.setActive(Boolean.TRUE.equals(body.get("active")));

        if (body.containsKey("roles")) {
            @SuppressWarnings("unchecked")
            List<String> roleNames = (List<String>) body.get("roles");
            Set<Role> roles = new HashSet<>();
            if (roleNames != null) {
                for (String rName : roleNames) {
                    roleRepository.findByName(rName).ifPresent(roles::add);
                }
            }
            if (!roles.isEmpty()) {
                user.setRoles(roles);
            }
        }

        User saved = userRepository.save(user);
        auditLogService.logAction(currentAdmin, "UPDATE_USER", "ROLES_PERMISSIONS",
                "Updated user ID " + id + " (" + user.getUsername() + ")");
        return ResponseEntity.ok(ApiResponse.ok("User updated successfully", toDto(saved)));
    }

    @PatchMapping("/users/{id}/reset-password")
    @Operation(summary = "Administrative password reset for user")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        String currentAdmin = userDetails != null ? userDetails.getUsername() : "ADMIN";
        String newPassword = body.get("newPassword");
        if (newPassword == null || newPassword.length() < 6) {
            throw new BadRequestException("New password must be at least 6 characters");
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        auditLogService.logAction(currentAdmin, "ADMIN_PASSWORD_RESET", "ROLES_PERMISSIONS",
                "Reset password for user: " + user.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Password reset successfully for " + user.getUsername(), null));
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Deactivate or delete user account")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String currentAdmin = userDetails != null ? userDetails.getUsername() : "ADMIN";
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        if ("admin".equalsIgnoreCase(user.getUsername())) {
            throw new BadRequestException("Primary default administrator cannot be deleted");
        }
        userRepository.delete(user);
        auditLogService.logAction(currentAdmin, "DELETE_USER", "ROLES_PERMISSIONS", "Deleted account: " + user.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("User account deleted successfully", null));
    }

    private UserAdminDto toDto(User user) {
        Set<String> roleNames = user.getRoles() != null
                ? user.getRoles().stream().map(Role::getName).collect(Collectors.toSet())
                : Collections.emptySet();
        return new UserAdminDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getActive(),
                roleNames,
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}

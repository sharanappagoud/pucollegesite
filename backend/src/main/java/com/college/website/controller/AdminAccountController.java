package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.dto.UserAdminDto;
import com.college.website.entity.Role;
import com.college.website.entity.User;
import com.college.website.exception.BadRequestException;
import com.college.website.exception.ResourceNotFoundException;
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

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/account")
@Tag(name = "Admin Security & Account Settings", description = "Current administrator profile, security controls, and password change")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR', 'ADMISSION_STAFF', 'STAFF')")
public class AdminAccountController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    public AdminAccountController(UserRepository userRepository,
                                  PasswordEncoder passwordEncoder,
                                  AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated administrator profile")
    public ResponseEntity<ApiResponse<UserAdminDto>> getCurrentProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new BadRequestException("Not authenticated");
        }
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userDetails.getUsername()));

        return ResponseEntity.ok(ApiResponse.ok(toDto(user)));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update current administrator name, email, or phone")
    public ResponseEntity<ApiResponse<UserAdminDto>> updateProfile(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) throw new BadRequestException("Not authenticated");
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userDetails.getUsername()));

        if (body.containsKey("fullName")) user.setFullName(body.get("fullName"));
        if (body.containsKey("phone")) user.setPhone(body.get("phone"));
        if (body.containsKey("email")) {
            String newEmail = body.get("email");
            if (!newEmail.equalsIgnoreCase(user.getEmail()) && userRepository.existsByEmail(newEmail)) {
                throw new BadRequestException("Email is already registered to another account");
            }
            user.setEmail(newEmail);
        }

        User saved = userRepository.save(user);
        auditLogService.logAction(user.getUsername(), "UPDATE_OWN_PROFILE", "SECURITY_ACCOUNT", "Updated profile info");
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", toDto(saved)));
    }

    @PutMapping("/password")
    @Operation(summary = "Change own password with current password verification")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) throw new BadRequestException("Not authenticated");
        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");

        if (currentPassword == null || newPassword == null || newPassword.length() < 6) {
            throw new BadRequestException("New password must be at least 6 characters");
        }

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userDetails.getUsername()));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new BadRequestException("Current password does not match");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        auditLogService.logAction(user.getUsername(), "CHANGE_OWN_PASSWORD", "SECURITY_ACCOUNT", "Password changed successfully");
        return ResponseEntity.ok(ApiResponse.ok("Password updated successfully", null));
    }

    @GetMapping("/security-info")
    @Operation(summary = "Get current session security health metadata")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSecurityInfo(
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "ADMIN";
        Map<String, Object> info = new HashMap<>();
        info.put("currentUsername", username);
        info.put("passwordStatus", "SECURE_BCRYPT");
        info.put("sessionPolicy", "STATELESS_JWT");
        info.put("jwtExpiryMinutes", 1440);
        info.put("mfaRecommended", true);
        info.put("lastLoginCheck", LocalDateTime.now().toString());
        info.put("activeDevice", "Chrome Browser (Admin Portal)");
        return ResponseEntity.ok(ApiResponse.ok(info));
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

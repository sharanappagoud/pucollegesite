package com.college.website.service;

import com.college.website.dto.AuthResponse;
import com.college.website.dto.ForgotPasswordRequest;
import com.college.website.dto.LoginRequest;
import com.college.website.dto.ResetPasswordRequest;
import com.college.website.entity.User;
import com.college.website.exception.ResourceNotFoundException;
import com.college.website.repository.UserRepository;
import com.college.website.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuditLogService auditLogService;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider,
                       AuditLogService auditLogService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.auditLogService = auditLogService;
    }

    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByUsernameOrEmail(loginRequest.getUsername(), loginRequest.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", loginRequest.getUsername()));

        List<String> roles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toList());

        if (!roles.contains("ROLE_ADMIN")) {
            SecurityContextHolder.clearContext();
            auditLogService.logAction(user.getUsername(), "ADMIN_LOGIN_DENIED", "AUTH", "Account does not have administrator access");
            throw new AccessDeniedException("Administrator access is required to sign in to this portal");
        }

        String jwt = tokenProvider.generateToken(authentication);
        auditLogService.logAction(user.getUsername(), "LOGIN", "AUTH", "User successfully authenticated");

        return new AuthResponse(jwt, user.getId(), user.getUsername(), user.getEmail(), user.getFullName(), roles);
    }

    public void processForgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            auditLogService.logAction(user.getUsername(), "FORGOT_PASSWORD_REQUESTED", "AUTH", "Password reset initiated");
        });
    }

    public void resetPassword(ResetPasswordRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User admin = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        admin.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(admin);
        auditLogService.logAction(admin.getUsername(), "PASSWORD_RESET", "AUTH", "Administrator password updated");
    }
}

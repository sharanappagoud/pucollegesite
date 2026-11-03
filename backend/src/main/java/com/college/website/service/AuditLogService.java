package com.college.website.service;

import com.college.website.entity.AuditLog;
import com.college.website.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void logAction(String username, String action, String module, String details) {
        try {
            AuditLog log = new AuditLog(
                    username != null ? username : "ANONYMOUS",
                    action,
                    module,
                    details,
                    "127.0.0.1"
            );
            auditLogRepository.save(log);
        } catch (Exception ignored) {
            // Logging failure should not disrupt core transaction
        }
    }
}

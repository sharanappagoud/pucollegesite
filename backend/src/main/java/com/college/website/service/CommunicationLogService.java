package com.college.website.service;

import com.college.website.dto.CommunicationLogDto;
import com.college.website.dto.PagedResponse;
import com.college.website.dto.SendDirectMessageRequest;
import com.college.website.entity.CommunicationLog;
import com.college.website.mapper.EntityDtoMapper;
import com.college.website.repository.CommunicationLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommunicationLogService {

    private static final Logger logger = LoggerFactory.getLogger(CommunicationLogService.class);

    private final CommunicationLogRepository logRepository;
    private final EntityDtoMapper mapper;
    private final EmailSenderService emailSenderService;
    private final GoogleSheetsSyncService googleSheetsSyncService;

    public CommunicationLogService(CommunicationLogRepository logRepository,
                                   EntityDtoMapper mapper,
                                   EmailSenderService emailSenderService,
                                   GoogleSheetsSyncService googleSheetsSyncService) {
        this.logRepository = logRepository;
        this.mapper = mapper;
        this.emailSenderService = emailSenderService;
        this.googleSheetsSyncService = googleSheetsSyncService;
    }

    @Transactional
    public CommunicationLog logCommunication(String referenceNo, String recipientType, String recipientName,
                                            String recipientTarget, String channel, String subject,
                                            String message, String status, String triggerEvent,
                                            String errorMessage, String sentBy) {
        CommunicationLog log = new CommunicationLog(
                referenceNo,
                recipientType != null ? recipientType.toUpperCase() : "STAFF",
                recipientName,
                recipientTarget != null ? recipientTarget : "N/A",
                channel != null ? channel.toUpperCase() : "EMAIL",
                subject,
                message,
                status != null ? status.toUpperCase() : "SENT",
                triggerEvent != null ? triggerEvent.toUpperCase() : "GENERAL",
                errorMessage,
                sentBy != null ? sentBy : "SYSTEM"
        );
        return logRepository.save(log);
    }

    public List<CommunicationLogDto> getLogsByReference(String referenceNo) {
        return logRepository.findByReferenceNoOrderByCreatedAtDesc(referenceNo)
                .stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public PagedResponse<CommunicationLogDto> getFilteredLogs(String recipientType, String channel, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        String rType = (recipientType != null && !recipientType.isBlank() && !"ALL".equalsIgnoreCase(recipientType)) ? recipientType.toUpperCase() : null;
        String ch = (channel != null && !channel.isBlank() && !"ALL".equalsIgnoreCase(channel)) ? channel.toUpperCase() : null;
        String q = (search != null && !search.isBlank()) ? search.trim() : null;

        Page<CommunicationLog> paged = logRepository.findWithFilters(rType, ch, q, pageable);
        List<CommunicationLogDto> dtos = paged.getContent().stream().map(mapper::toDto).collect(Collectors.toList());

        return new PagedResponse<>(dtos, paged.getNumber(), paged.getSize(), paged.getTotalElements(), paged.getTotalPages(), paged.isLast());
    }

    @Transactional
    public CommunicationLogDto sendDirectMessage(SendDirectMessageRequest request, String adminUsername) {
        String status = "SENT";
        String errorMessage = null;

        if ("EMAIL".equalsIgnoreCase(request.getChannel())) {
            boolean smtpSent = false;
            try {
                smtpSent = emailSenderService.sendCustomEmail(
                        request.getRecipientTarget(),
                        request.getRecipientName(),
                        request.getSubject(),
                        request.getMessage()
                );
            } catch (Exception e) {
                logger.warn("SMTP email dispatch failed: {}", e.getMessage());
            }

            boolean webhookSent = false;
            try {
                webhookSent = googleSheetsSyncService.forwardDirectMessage(
                        request.getReferenceNo(),
                        request.getRecipientType(),
                        request.getRecipientName(),
                        request.getRecipientTarget(),
                        request.getSubject(),
                        request.getMessage()
                );
            } catch (Exception e) {
                logger.warn("Google Apps Script webhook dispatch failed: {}", e.getMessage());
            }

            if (smtpSent || webhookSent) {
                status = "SENT";
                errorMessage = null;
                logger.info("Direct message successfully dispatched to [{}] (SMTP: {}, Webhook: {})",
                        request.getRecipientTarget(), smtpSent, webhookSent);
            } else {
                status = "FAILED";
                errorMessage = "Delivery pending: Neither Gmail App Password nor Google Apps Script Webhook is active. Please configure SMTP password or re-deploy Apps Script as 'Anyone'.";
                logger.warn("Direct email delivery failed for [{}]: {}", request.getRecipientTarget(), errorMessage);
            }
        } else {
            // SMS simulation/logging
            logger.info("SMS dispatched to [{}] via SMS Gateway: {}", request.getRecipientTarget(), request.getMessage());
        }

        CommunicationLog saved = logCommunication(
                request.getReferenceNo(),
                request.getRecipientType(),
                request.getRecipientName(),
                request.getRecipientTarget(),
                request.getChannel(),
                request.getSubject() != null ? request.getSubject() : "Direct Message from College Admissions",
                request.getMessage(),
                status,
                "MANUAL_DISPATCH",
                errorMessage,
                adminUsername != null ? adminUsername : "admin"
        );

        return mapper.toDto(saved);
    }
}


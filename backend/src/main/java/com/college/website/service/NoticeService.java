package com.college.website.service;

import com.college.website.dto.NoticeDto;
import com.college.website.entity.Notice;
import com.college.website.exception.ResourceNotFoundException;
import com.college.website.mapper.EntityDtoMapper;
import com.college.website.repository.NoticeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final EntityDtoMapper mapper;
    private final AuditLogService auditLogService;

    public NoticeService(NoticeRepository noticeRepository,
                         EntityDtoMapper mapper,
                         AuditLogService auditLogService) {
        this.noticeRepository = noticeRepository;
        this.mapper = mapper;
        this.auditLogService = auditLogService;
    }

    public List<NoticeDto> getAllNotices() {
        return noticeRepository.findAllByOrderByPublishedAtDesc().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public List<NoticeDto> getImportantNotices() {
        return noticeRepository.findByIsImportantTrueOrderByPublishedAtDesc().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public NoticeDto saveNotice(NoticeDto dto, String adminUsername) {
        Notice notice;
        boolean isNew = (dto.getId() == null);
        if (!isNew) {
            notice = noticeRepository.findById(dto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Notice", "id", dto.getId()));
        } else {
            notice = new Notice();
        }

        notice.setTitle(dto.getTitle());
        notice.setDocumentUrl(dto.getDocumentUrl());
        notice.setIsImportant(dto.getIsImportant() != null ? dto.getIsImportant() : false);
        notice.setPublishedAt(dto.getPublishedAt() != null ? dto.getPublishedAt() : LocalDate.now());
        notice.setExpiresAt(dto.getExpiresAt());

        Notice saved = noticeRepository.save(notice);
        auditLogService.logAction(adminUsername, isNew ? "CREATE_NOTICE" : "UPDATE_NOTICE", "NOTICES", "Title: " + saved.getTitle());
        return mapper.toDto(saved);
    }

    @Transactional
    public void deleteNotice(Long id, String adminUsername) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notice", "id", id));
        noticeRepository.delete(notice);
        auditLogService.logAction(adminUsername, "DELETE_NOTICE", "NOTICES", "Deleted notice ID: " + id);
    }
}

package com.college.website.service;

import com.college.website.dto.CalendarItemDto;
import com.college.website.entity.AcademicCalendarItem;
import com.college.website.exception.ResourceNotFoundException;
import com.college.website.mapper.EntityDtoMapper;
import com.college.website.repository.AcademicCalendarRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AcademicCalendarService {

    private final AcademicCalendarRepository calendarRepository;
    private final EntityDtoMapper mapper;
    private final AuditLogService auditLogService;

    public AcademicCalendarService(AcademicCalendarRepository calendarRepository,
                                   EntityDtoMapper mapper,
                                   AuditLogService auditLogService) {
        this.calendarRepository = calendarRepository;
        this.mapper = mapper;
        this.auditLogService = auditLogService;
    }

    public List<CalendarItemDto> getCalendarByYear(String year) {
        String academicYear = (year != null && !year.trim().isEmpty()) ? year : "2026-27";
        return calendarRepository.findByAcademicYearOrderByStartDateAsc(academicYear).stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CalendarItemDto saveCalendarItem(CalendarItemDto dto, String adminUsername) {
        AcademicCalendarItem item;
        boolean isNew = (dto.getId() == null);
        if (!isNew) {
            item = calendarRepository.findById(dto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Calendar Item", "id", dto.getId()));
        } else {
            item = new AcademicCalendarItem();
        }

        item.setEventTitle(dto.getEventTitle());
        item.setCategory(dto.getCategory() != null ? dto.getCategory().toUpperCase() : "ACADEMIC");
        item.setStartDate(dto.getStartDate());
        item.setEndDate(dto.getEndDate());
        item.setDescription(dto.getDescription());
        item.setAcademicYear(dto.getAcademicYear() != null ? dto.getAcademicYear() : "2026-27");

        AcademicCalendarItem saved = calendarRepository.save(item);
        auditLogService.logAction(adminUsername, isNew ? "CREATE_CALENDAR_EVENT" : "UPDATE_CALENDAR_EVENT", "CALENDAR", "Title: " + saved.getEventTitle());
        return mapper.toDto(saved);
    }

    @Transactional
    public void deleteCalendarItem(Long id, String adminUsername) {
        AcademicCalendarItem item = calendarRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Calendar Item", "id", id));
        calendarRepository.delete(item);
        auditLogService.logAction(adminUsername, "DELETE_CALENDAR_EVENT", "CALENDAR", "Deleted calendar item ID: " + id);
    }
}

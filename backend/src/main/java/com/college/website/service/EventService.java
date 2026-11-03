package com.college.website.service;

import com.college.website.dto.EventDto;
import com.college.website.entity.Event;
import com.college.website.exception.ResourceNotFoundException;
import com.college.website.mapper.EntityDtoMapper;
import com.college.website.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final EntityDtoMapper mapper;
    private final AuditLogService auditLogService;

    public EventService(EventRepository eventRepository,
                        EntityDtoMapper mapper,
                        AuditLogService auditLogService) {
        this.eventRepository = eventRepository;
        this.mapper = mapper;
        this.auditLogService = auditLogService;
    }

    public List<EventDto> getUpcomingEvents() {
        return eventRepository.findByEventDateGreaterThanEqualOrderByEventDateAsc(LocalDate.now()).stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public List<EventDto> getAllEvents() {
        return eventRepository.findAllByOrderByEventDateDesc().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public EventDto getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));
        return mapper.toDto(event);
    }

    @Transactional
    public EventDto saveEvent(EventDto dto, String adminUsername) {
        Event event;
        boolean isNew = (dto.getId() == null);
        if (!isNew) {
            event = eventRepository.findById(dto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Event", "id", dto.getId()));
        } else {
            event = new Event();
        }

        event.setTitle(dto.getTitle());
        if (dto.getSlug() == null || dto.getSlug().trim().isEmpty()) {
            event.setSlug(dto.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        } else {
            event.setSlug(dto.getSlug());
        }
        event.setDescription(dto.getDescription());
        event.setEventDate(dto.getEventDate() != null ? dto.getEventDate() : LocalDate.now());
        event.setEventTime(dto.getEventTime());
        event.setLocation(dto.getLocation());
        event.setImageUrl(dto.getImageUrl());
        event.setStatus(dto.getStatus() != null ? dto.getStatus() : "UPCOMING");
        event.setRegistrationLink(dto.getRegistrationLink());

        Event saved = eventRepository.save(event);
        auditLogService.logAction(adminUsername, isNew ? "CREATE_EVENT" : "UPDATE_EVENT", "EVENTS", "Title: " + saved.getTitle());
        return mapper.toDto(saved);
    }

    @Transactional
    public void deleteEvent(Long id, String adminUsername) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));
        eventRepository.delete(event);
        auditLogService.logAction(adminUsername, "DELETE_EVENT", "EVENTS", "Deleted event ID: " + id);
    }
}

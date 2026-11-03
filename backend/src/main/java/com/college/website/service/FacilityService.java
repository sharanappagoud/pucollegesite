package com.college.website.service;

import com.college.website.dto.FacilityDto;
import com.college.website.entity.Facility;
import com.college.website.exception.ResourceNotFoundException;
import com.college.website.mapper.EntityDtoMapper;
import com.college.website.repository.FacilityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FacilityService {

    private final FacilityRepository facilityRepository;
    private final EntityDtoMapper mapper;
    private final AuditLogService auditLogService;

    public FacilityService(FacilityRepository facilityRepository,
                           EntityDtoMapper mapper,
                           AuditLogService auditLogService) {
        this.facilityRepository = facilityRepository;
        this.mapper = mapper;
        this.auditLogService = auditLogService;
    }

    public List<FacilityDto> getPublicFacilities(String category) {
        List<Facility> list;
        if (category != null && !category.trim().isEmpty() && !"ALL".equalsIgnoreCase(category)) {
            list = facilityRepository.findByCategoryAndActiveTrueOrderByDisplayOrderAsc(category.toUpperCase());
        } else {
            list = facilityRepository.findByActiveTrueOrderByDisplayOrderAsc();
        }
        return list.stream().map(mapper::toDto).collect(Collectors.toList());
    }

    public List<FacilityDto> getAllFacilitiesAdmin() {
        return facilityRepository.findAllByOrderByDisplayOrderAsc().stream().map(mapper::toDto).collect(Collectors.toList());
    }

    public FacilityDto getFacilityById(Long id) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facility", "id", id));
        return mapper.toDto(facility);
    }

    @Transactional
    public FacilityDto saveFacility(FacilityDto dto, String adminUsername) {
        Facility f;
        boolean isNew = (dto.getId() == null);
        if (!isNew) {
            f = facilityRepository.findById(dto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Facility", "id", dto.getId()));
        } else {
            f = new Facility();
        }

        f.setTitle(dto.getTitle());
        f.setCategory(dto.getCategory() != null ? dto.getCategory().toUpperCase() : "INFRASTRUCTURE");
        f.setDescription(dto.getDescription());
        f.setIcon(dto.getIcon());
        f.setImageUrl(dto.getImageUrl());
        f.setFeatures(dto.getFeatures());
        f.setDisplayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0);
        f.setActive(dto.getActive() != null ? dto.getActive() : true);

        Facility saved = facilityRepository.save(f);
        auditLogService.logAction(adminUsername, isNew ? "CREATE_FACILITY" : "UPDATE_FACILITY", "FACILITIES", "Title: " + saved.getTitle());
        return mapper.toDto(saved);
    }

    @Transactional
    public void deleteFacility(Long id, String adminUsername) {
        Facility f = facilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facility", "id", id));
        facilityRepository.delete(f);
        auditLogService.logAction(adminUsername, "DELETE_FACILITY", "FACILITIES", "Deleted facility ID: " + id);
    }
}

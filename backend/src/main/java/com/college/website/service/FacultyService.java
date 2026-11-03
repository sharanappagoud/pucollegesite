package com.college.website.service;

import com.college.website.dto.FacultyDto;
import com.college.website.entity.Faculty;
import com.college.website.exception.ResourceNotFoundException;
import com.college.website.mapper.EntityDtoMapper;
import com.college.website.repository.FacultyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FacultyService {

    private final FacultyRepository facultyRepository;
    private final EntityDtoMapper mapper;
    private final AuditLogService auditLogService;

    public FacultyService(FacultyRepository facultyRepository,
                          EntityDtoMapper mapper,
                          AuditLogService auditLogService) {
        this.facultyRepository = facultyRepository;
        this.mapper = mapper;
        this.auditLogService = auditLogService;
    }

    public List<FacultyDto> getPublicFaculty(String department) {
        List<Faculty> list;
        if (department != null && !department.trim().isEmpty() && !"ALL".equalsIgnoreCase(department)) {
            list = facultyRepository.findByDepartmentAndActiveTrueOrderByDisplayOrderAsc(department);
        } else {
            list = facultyRepository.findByActiveTrueOrderByDisplayOrderAsc();
        }
        return list.stream().map(mapper::toDto).collect(Collectors.toList());
    }

    public List<FacultyDto> getAllFacultyAdmin() {
        return facultyRepository.findAllByOrderByDisplayOrderAsc().stream().map(mapper::toDto).collect(Collectors.toList());
    }

    public FacultyDto getFacultyById(Long id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty", "id", id));
        return mapper.toDto(faculty);
    }

    @Transactional
    public FacultyDto saveFaculty(FacultyDto dto, String adminUsername) {
        Faculty faculty;
        boolean isNew = (dto.getId() == null);
        if (!isNew) {
            faculty = facultyRepository.findById(dto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Faculty", "id", dto.getId()));
        } else {
            faculty = new Faculty();
        }

        faculty.setFullName(dto.getFullName());
        faculty.setDesignation(dto.getDesignation());
        faculty.setDepartment(dto.getDepartment());
        faculty.setQualification(dto.getQualification());
        faculty.setExperienceYears(dto.getExperienceYears() != null ? dto.getExperienceYears() : 0);
        faculty.setSubjectsTaught(dto.getSubjectsTaught());
        faculty.setEmail(dto.getEmail());
        faculty.setPhone(dto.getPhone());
        faculty.setBio(dto.getBio());
        faculty.setPhotoUrl(dto.getPhotoUrl());
        faculty.setDisplayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0);
        faculty.setActive(dto.getActive() != null ? dto.getActive() : true);

        Faculty saved = facultyRepository.save(faculty);
        auditLogService.logAction(adminUsername, isNew ? "CREATE_FACULTY" : "UPDATE_FACULTY", "FACULTY", "Name: " + saved.getFullName());
        return mapper.toDto(saved);
    }

    @Transactional
    public void deleteFaculty(Long id, String adminUsername) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty", "id", id));
        facultyRepository.delete(faculty);
        auditLogService.logAction(adminUsername, "DELETE_FACULTY", "FACULTY", "Deleted faculty ID: " + id);
    }
}

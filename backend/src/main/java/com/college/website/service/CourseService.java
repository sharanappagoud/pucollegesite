package com.college.website.service;

import com.college.website.dto.CourseDto;
import com.college.website.entity.Course;
import com.college.website.entity.CourseSubject;
import com.college.website.exception.ResourceNotFoundException;
import com.college.website.mapper.EntityDtoMapper;
import com.college.website.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CourseService {

    private final CourseRepository courseRepository;
    private final EntityDtoMapper mapper;
    private final AuditLogService auditLogService;

    public CourseService(CourseRepository courseRepository,
                         EntityDtoMapper mapper,
                         AuditLogService auditLogService) {
        this.courseRepository = courseRepository;
        this.mapper = mapper;
        this.auditLogService = auditLogService;
    }

    public List<CourseDto> getPublicCourses(String stream) {
        List<Course> courses;
        if (stream != null && !stream.trim().isEmpty() && !"ALL".equalsIgnoreCase(stream)) {
            courses = courseRepository.findByStreamAndActiveTrue(stream.toUpperCase());
        } else {
            courses = courseRepository.findByActiveTrue();
        }
        return courses.stream().map(mapper::toDto).collect(Collectors.toList());
    }

    public List<CourseDto> getAllCoursesAdmin() {
        return courseRepository.findAll().stream().map(mapper::toDto).collect(Collectors.toList());
    }

    public CourseDto getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
        return mapper.toDto(course);
    }

    public CourseDto getCourseByCode(String code) {
        Course course = courseRepository.findByCode(code.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "code", code));
        return mapper.toDto(course);
    }

    @Transactional
    public CourseDto saveCourse(CourseDto dto, String adminUsername) {
        Course course;
        boolean isNew = (dto.getId() == null);
        if (!isNew) {
            course = courseRepository.findById(dto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Course", "id", dto.getId()));
        } else {
            course = new Course();
        }

        course.setCode(dto.getCode());
        course.setName(dto.getName());
        course.setStream(dto.getStream() != null ? dto.getStream().toUpperCase() : "SCIENCE");
        course.setDuration(dto.getDuration() != null ? dto.getDuration() : "2 Years");
        course.setDescription(dto.getDescription());
        course.setEligibility(dto.getEligibility());
        course.setCareerProspects(dto.getCareerProspects());
        course.setFeePerYear(dto.getFeePerYear());
        course.setIcon(dto.getIcon());
        course.setActive(dto.getActive() != null ? dto.getActive() : true);

        if (dto.getSubjects() != null) {
            course.getSubjects().clear();
            for (CourseDto.SubjectDto sub : dto.getSubjects()) {
                CourseSubject cs = new CourseSubject(course, sub.getSubjectName(), sub.getSubjectCode(), sub.getIsCore());
                course.getSubjects().add(cs);
            }
        }

        Course saved = courseRepository.save(course);
        auditLogService.logAction(adminUsername, isNew ? "CREATE_COURSE" : "UPDATE_COURSE", "COURSES", "Code: " + saved.getCode());
        return mapper.toDto(saved);
    }

    @Transactional
    public void deleteCourse(Long id, String adminUsername) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
        courseRepository.delete(course);
        auditLogService.logAction(adminUsername, "DELETE_COURSE", "COURSES", "Deleted course ID: " + id);
    }
}

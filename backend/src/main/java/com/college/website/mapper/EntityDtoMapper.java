package com.college.website.mapper;

import com.college.website.dto.*;
import com.college.website.entity.*;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.stream.Collectors;

@Component
public class EntityDtoMapper {

    public CourseDto toDto(Course course) {
        if (course == null) return null;
        CourseDto dto = new CourseDto();
        dto.setId(course.getId());
        dto.setCode(course.getCode());
        dto.setName(course.getName());
        dto.setStream(course.getStream());
        dto.setDuration(course.getDuration());
        dto.setDescription(course.getDescription());
        dto.setEligibility(course.getEligibility());
        dto.setCareerProspects(course.getCareerProspects());
        dto.setFeePerYear(course.getFeePerYear());
        dto.setIcon(course.getIcon());
        dto.setActive(course.getActive());
        if (course.getSubjects() != null) {
            dto.setSubjects(course.getSubjects().stream()
                .map(s -> new CourseDto.SubjectDto(s.getId(), s.getSubjectName(), s.getSubjectCode(), s.getIsCore()))
                .collect(Collectors.toList()));
        } else {
            dto.setSubjects(new ArrayList<>());
        }
        return dto;
    }

    public FacultyDto toDto(Faculty faculty) {
        if (faculty == null) return null;
        FacultyDto dto = new FacultyDto();
        dto.setId(faculty.getId());
        dto.setFullName(faculty.getFullName());
        dto.setDesignation(faculty.getDesignation());
        dto.setDepartment(faculty.getDepartment());
        dto.setQualification(faculty.getQualification());
        dto.setExperienceYears(faculty.getExperienceYears());
        dto.setSubjectsTaught(faculty.getSubjectsTaught());
        dto.setEmail(faculty.getEmail());
        dto.setPhone(faculty.getPhone());
        dto.setBio(faculty.getBio());
        dto.setPhotoUrl(faculty.getPhotoUrl());
        dto.setDisplayOrder(faculty.getDisplayOrder());
        dto.setActive(faculty.getActive());
        return dto;
    }

    public FacilityDto toDto(Facility facility) {
        if (facility == null) return null;
        FacilityDto dto = new FacilityDto();
        dto.setId(facility.getId());
        dto.setTitle(facility.getTitle());
        dto.setCategory(facility.getCategory());
        dto.setDescription(facility.getDescription());
        dto.setIcon(facility.getIcon());
        dto.setImageUrl(facility.getImageUrl());
        dto.setFeatures(facility.getFeatures());
        dto.setDisplayOrder(facility.getDisplayOrder());
        dto.setActive(facility.getActive());
        return dto;
    }

    public NewsDto toDto(News news) {
        if (news == null) return null;
        NewsDto dto = new NewsDto();
        dto.setId(news.getId());
        dto.setTitle(news.getTitle());
        dto.setSlug(news.getSlug());
        dto.setExcerpt(news.getExcerpt());
        dto.setContent(news.getContent());
        dto.setCategory(news.getCategory());
        dto.setImageUrl(news.getImageUrl());
        dto.setPublishedAt(news.getPublishedAt());
        dto.setPublished(news.getPublished());
        return dto;
    }

    public EventDto toDto(Event event) {
        if (event == null) return null;
        EventDto dto = new EventDto();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setSlug(event.getSlug());
        dto.setDescription(event.getDescription());
        dto.setEventDate(event.getEventDate());
        dto.setEventTime(event.getEventTime());
        dto.setLocation(event.getLocation());
        dto.setImageUrl(event.getImageUrl());
        dto.setStatus(event.getStatus());
        dto.setRegistrationLink(event.getRegistrationLink());
        return dto;
    }

    public NoticeDto toDto(Notice notice) {
        if (notice == null) return null;
        NoticeDto dto = new NoticeDto();
        dto.setId(notice.getId());
        dto.setTitle(notice.getTitle());
        dto.setDocumentUrl(notice.getDocumentUrl());
        dto.setIsImportant(notice.getIsImportant());
        dto.setPublishedAt(notice.getPublishedAt());
        dto.setExpiresAt(notice.getExpiresAt());
        return dto;
    }

    public CalendarItemDto toDto(AcademicCalendarItem item) {
        if (item == null) return null;
        CalendarItemDto dto = new CalendarItemDto();
        dto.setId(item.getId());
        dto.setEventTitle(item.getEventTitle());
        dto.setCategory(item.getCategory());
        dto.setStartDate(item.getStartDate());
        dto.setEndDate(item.getEndDate());
        dto.setDescription(item.getDescription());
        dto.setAcademicYear(item.getAcademicYear());
        return dto;
    }

    public BannerDto toDto(Banner banner) {
        if (banner == null) return null;
        BannerDto dto = new BannerDto();
        dto.setId(banner.getId());
        dto.setTitle(banner.getTitle());
        dto.setSubtitle(banner.getSubtitle());
        dto.setTitleColor(banner.getTitleColor());
        dto.setHighlightText(banner.getHighlightText());
        dto.setHighlightColor(banner.getHighlightColor());
        dto.setSubtitleColor(banner.getSubtitleColor());
        dto.setCtaText(banner.getCtaText());
        dto.setCtaLink(banner.getCtaLink());
        dto.setImageUrl(banner.getImageUrl());
        dto.setDisplayOrder(banner.getDisplayOrder());
        dto.setActive(banner.getActive());
        return dto;
    }

    public TestimonialDto toDto(Testimonial t) {
        if (t == null) return null;
        TestimonialDto dto = new TestimonialDto();
        dto.setId(t.getId());
        dto.setStudentName(t.getStudentName());
        dto.setBatchYear(t.getBatchYear());
        dto.setStream(t.getStream());
        dto.setAchievement(t.getAchievement());
        dto.setQuote(t.getQuote());
        dto.setPhotoUrl(t.getPhotoUrl());
        dto.setActive(t.getActive());
        return dto;
    }

    public AdmissionEnquiryResponse toDto(AdmissionEnquiry e) {
        if (e == null) return null;
        AdmissionEnquiryResponse dto = new AdmissionEnquiryResponse();
        dto.setId(e.getId());
        dto.setReferenceNo(e.getReferenceNo());
        dto.setStudentName(e.getStudentName());
        dto.setParentName(e.getParentName());
        dto.setStudentPhone(e.getStudentPhone());
        dto.setParentPhone(e.getParentPhone());
        dto.setParentEmail(e.getParentEmail());
        dto.setEmail(e.getEmail());
        dto.setLastCompletedClass(e.getLastCompletedClass());
        dto.setBoard(e.getBoard());
        dto.setPreferredStream(e.getPreferredStream());
        dto.setPreferredCombination(e.getPreferredCombination());
        dto.setAcademicYear(e.getAcademicYear());
        dto.setMessage(e.getMessage());
        dto.setAddress(e.getAddress());
        dto.setPincode(e.getPincode());
        dto.setReferredBy(e.getReferredBy());
        dto.setStatus(e.getStatus());
        dto.setFollowUpNotes(e.getFollowUpNotes());
        dto.setCreatedAt(e.getCreatedAt());
        dto.setUpdatedAt(e.getUpdatedAt());
        return dto;
    }

    public CommunicationLogDto toDto(CommunicationLog c) {
        if (c == null) return null;
        CommunicationLogDto dto = new CommunicationLogDto();
        dto.setId(c.getId());
        dto.setReferenceNo(c.getReferenceNo());
        dto.setRecipientType(c.getRecipientType());
        dto.setRecipientName(c.getRecipientName());
        dto.setRecipientTarget(c.getRecipientTarget());
        dto.setChannel(c.getChannel());
        dto.setSubject(c.getSubject());
        dto.setMessage(c.getMessage());
        dto.setStatus(c.getStatus());
        dto.setTriggerEvent(c.getTriggerEvent());
        dto.setErrorMessage(c.getErrorMessage());
        dto.setSentBy(c.getSentBy());
        dto.setCreatedAt(c.getCreatedAt());
        return dto;
    }
}

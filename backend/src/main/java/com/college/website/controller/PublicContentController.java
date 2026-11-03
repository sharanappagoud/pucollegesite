package com.college.website.controller;

import com.college.website.dto.*;
import com.college.website.entity.Banner;
import com.college.website.entity.GalleryCategory;
import com.college.website.entity.GalleryImage;
import com.college.website.entity.PageContent;
import com.college.website.exception.ResourceNotFoundException;
import com.college.website.mapper.EntityDtoMapper;
import com.college.website.repository.BannerRepository;
import com.college.website.repository.PageContentRepository;
import com.college.website.repository.TestimonialRepository;
import com.college.website.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Public Content APIs", description = "Endpoints for public website visitors")
public class PublicContentController {

    private final PageContentRepository pageContentRepository;
    private final BannerRepository bannerRepository;
    private final TestimonialRepository testimonialRepository;
    private final CourseService courseService;
    private final FacultyService facultyService;
    private final FacilityService facilityService;
    private final NewsService newsService;
    private final EventService eventService;
    private final NoticeService noticeService;
    private final AcademicCalendarService calendarService;
    private final GalleryService galleryService;
    private final CollegeSettingService settingService;
    private final EntityDtoMapper mapper;
    private final com.college.website.repository.StudentAchievementRepository achievementRepository;
    private final com.college.website.repository.ExaminationRepository examinationRepository;
    private final com.college.website.repository.ScholarshipRepository scholarshipRepository;
    private final com.college.website.repository.DepartmentRepository departmentRepository;

    public PublicContentController(PageContentRepository pageContentRepository,
                                   BannerRepository bannerRepository,
                                   TestimonialRepository testimonialRepository,
                                   CourseService courseService,
                                   FacultyService facultyService,
                                   FacilityService facilityService,
                                   NewsService newsService,
                                   EventService eventService,
                                   NoticeService noticeService,
                                   AcademicCalendarService calendarService,
                                   GalleryService galleryService,
                                   CollegeSettingService settingService,
                                   EntityDtoMapper mapper,
                                   com.college.website.repository.StudentAchievementRepository achievementRepository,
                                   com.college.website.repository.ExaminationRepository examinationRepository,
                                   com.college.website.repository.ScholarshipRepository scholarshipRepository,
                                   com.college.website.repository.DepartmentRepository departmentRepository) {
        this.pageContentRepository = pageContentRepository;
        this.bannerRepository = bannerRepository;
        this.testimonialRepository = testimonialRepository;
        this.courseService = courseService;
        this.facultyService = facultyService;
        this.facilityService = facilityService;
        this.newsService = newsService;
        this.eventService = eventService;
        this.noticeService = noticeService;
        this.calendarService = calendarService;
        this.galleryService = galleryService;
        this.settingService = settingService;
        this.mapper = mapper;
        this.achievementRepository = achievementRepository;
        this.examinationRepository = examinationRepository;
        this.scholarshipRepository = scholarshipRepository;
        this.departmentRepository = departmentRepository;
    }

    @GetMapping("/pages/{slug}")
    @Operation(summary = "Get content page by slug")
    public ResponseEntity<ApiResponse<PageContent>> getPageBySlug(@PathVariable String slug) {
        PageContent page = pageContentRepository.findBySlugAndPublishedTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Page", "slug", slug));
        return ResponseEntity.ok(ApiResponse.ok(page));
    }

    @GetMapping("/banners")
    @Operation(summary = "Get active homepage banners")
    public ResponseEntity<ApiResponse<List<BannerDto>>> getActiveBanners() {
        List<BannerDto> list = bannerRepository.findByActiveTrueOrderByDisplayOrderAsc().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/courses")
    @Operation(summary = "Get active courses with optional stream filter (SCIENCE / COMMERCE)")
    public ResponseEntity<ApiResponse<List<CourseDto>>> getCourses(@RequestParam(required = false) String stream) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.getPublicCourses(stream)));
    }

    @GetMapping("/courses/{code}")
    @Operation(summary = "Get single course by code e.g. PCMB, PCMC, CEBA")
    public ResponseEntity<ApiResponse<CourseDto>> getCourseByCode(@PathVariable String code) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.getCourseByCode(code)));
    }

    @GetMapping("/faculty")
    @Operation(summary = "Get faculty directory with optional department filter")
    public ResponseEntity<ApiResponse<List<FacultyDto>>> getFaculty(@RequestParam(required = false) String department) {
        return ResponseEntity.ok(ApiResponse.ok(facultyService.getPublicFaculty(department)));
    }

    @GetMapping("/facilities")
    @Operation(summary = "Get facilities with optional category filter")
    public ResponseEntity<ApiResponse<List<FacilityDto>>> getFacilities(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(ApiResponse.ok(facilityService.getPublicFacilities(category)));
    }

    @GetMapping("/gallery")
    @Operation(summary = "Get gallery images with optional category filter")
    public ResponseEntity<ApiResponse<List<GalleryImage>>> getGalleryImages(@RequestParam(required = false) Long categoryId) {
        return ResponseEntity.ok(ApiResponse.ok(galleryService.getImagesByCategory(categoryId)));
    }

    @GetMapping("/gallery/categories")
    @Operation(summary = "Get all gallery categories")
    public ResponseEntity<ApiResponse<List<GalleryCategory>>> getGalleryCategories() {
        return ResponseEntity.ok(ApiResponse.ok(galleryService.getAllCategories()));
    }

    @GetMapping("/news")
    @Operation(summary = "Get published news articles")
    public ResponseEntity<ApiResponse<List<NewsDto>>> getNews() {
        return ResponseEntity.ok(ApiResponse.ok(newsService.getPublicNews()));
    }

    @GetMapping("/news/{slug}")
    @Operation(summary = "Get news detail by slug")
    public ResponseEntity<ApiResponse<NewsDto>> getNewsBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(newsService.getNewsBySlug(slug)));
    }

    @GetMapping("/events")
    @Operation(summary = "Get upcoming campus events")
    public ResponseEntity<ApiResponse<List<EventDto>>> getEvents() {
        return ResponseEntity.ok(ApiResponse.ok(eventService.getUpcomingEvents()));
    }

    @GetMapping("/notices")
    @Operation(summary = "Get college notices and announcements")
    public ResponseEntity<ApiResponse<List<NoticeDto>>> getNotices(@RequestParam(required = false) Boolean important) {
        if (Boolean.TRUE.equals(important)) {
            return ResponseEntity.ok(ApiResponse.ok(noticeService.getImportantNotices()));
        }
        return ResponseEntity.ok(ApiResponse.ok(noticeService.getAllNotices()));
    }

    @GetMapping("/calendar")
    @Operation(summary = "Get academic calendar for given academic year")
    public ResponseEntity<ApiResponse<List<CalendarItemDto>>> getCalendar(@RequestParam(required = false) String year) {
        return ResponseEntity.ok(ApiResponse.ok(calendarService.getCalendarByYear(year)));
    }

    @GetMapping("/settings")
    @Operation(summary = "Get all public college settings")
    public ResponseEntity<ApiResponse<Map<String, String>>> getSettings() {
        return ResponseEntity.ok(ApiResponse.ok(settingService.getAllSettingsAsMap()));
    }

    @GetMapping("/testimonials")
    @Operation(summary = "Get alumni and student testimonials")
    public ResponseEntity<ApiResponse<List<TestimonialDto>>> getTestimonials() {
        List<TestimonialDto> list = testimonialRepository.findByActiveTrueOrderByCreatedAtDesc().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/achievements")
    @Operation(summary = "Get published student achievements")
    public ResponseEntity<ApiResponse<List<com.college.website.entity.StudentAchievement>>> getAchievements() {
        return ResponseEntity.ok(ApiResponse.ok(achievementRepository.findByPublishedTrueOrderByCreatedAtDesc()));
    }

    @GetMapping("/examinations")
    @Operation(summary = "Get published examination schedules and notifications")
    public ResponseEntity<ApiResponse<List<com.college.website.entity.Examination>>> getExaminations() {
        return ResponseEntity.ok(ApiResponse.ok(examinationRepository.findByPublishedTrueOrderByStartDateAsc()));
    }

    @GetMapping("/scholarships")
    @Operation(summary = "Get active scholarships and concessions")
    public ResponseEntity<ApiResponse<List<com.college.website.entity.Scholarship>>> getScholarships() {
        return ResponseEntity.ok(ApiResponse.ok(scholarshipRepository.findByActiveTrueOrderByCreatedAtDesc()));
    }

    @GetMapping("/departments")
    @Operation(summary = "Get academic departments")
    public ResponseEntity<ApiResponse<List<com.college.website.entity.Department>>> getDepartments() {
        return ResponseEntity.ok(ApiResponse.ok(departmentRepository.findByActiveTrueOrderByNameAsc()));
    }
}

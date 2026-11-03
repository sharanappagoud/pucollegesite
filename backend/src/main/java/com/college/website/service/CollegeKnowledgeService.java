package com.college.website.service;

import com.college.website.entity.*;
import com.college.website.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CollegeKnowledgeService {

    private static final Logger logger = LoggerFactory.getLogger(CollegeKnowledgeService.class);

    private final CollegeSettingRepository settingRepository;
    private final CourseRepository courseRepository;
    private final FacilityRepository facilityRepository;
    private final ScholarshipRepository scholarshipRepository;
    private final NoticeRepository noticeRepository;
    private final EventRepository eventRepository;
    private final ExaminationRepository examinationRepository;
    private final PageContentRepository pageContentRepository;
    private final ChatbotFaqRepository faqRepository;

    public CollegeKnowledgeService(CollegeSettingRepository settingRepository,
                                   CourseRepository courseRepository,
                                   FacilityRepository facilityRepository,
                                   ScholarshipRepository scholarshipRepository,
                                   NoticeRepository noticeRepository,
                                   EventRepository eventRepository,
                                   ExaminationRepository examinationRepository,
                                   PageContentRepository pageContentRepository,
                                   ChatbotFaqRepository faqRepository) {
        this.settingRepository = settingRepository;
        this.courseRepository = courseRepository;
        this.facilityRepository = facilityRepository;
        this.scholarshipRepository = scholarshipRepository;
        this.noticeRepository = noticeRepository;
        this.eventRepository = eventRepository;
        this.examinationRepository = examinationRepository;
        this.pageContentRepository = pageContentRepository;
        this.faqRepository = faqRepository;
    }

    /**
     * Finds a high-confidence match from approved FAQ repository.
     */
    public Optional<ChatbotFaq> findDirectFaqMatch(String userMessage) {
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return Optional.empty();
        }
        String clean = userMessage.trim().toLowerCase();

        List<ChatbotFaq> faqs = faqRepository.findByIsActiveTrueOrderByDisplayOrderAsc();

        // 1. Exact match
        for (ChatbotFaq faq : faqs) {
            if (faq.getQuestion() != null && faq.getQuestion().trim().equalsIgnoreCase(clean)) {
                return Optional.of(faq);
            }
        }

        // 2. Keyword score matching
        ChatbotFaq bestMatch = null;
        int maxScore = 0;

        for (ChatbotFaq faq : faqs) {
            int score = 0;
            if (faq.getKeywords() != null) {
                String[] kws = faq.getKeywords().split(",");
                for (String kw : kws) {
                    String trimmed = kw.trim().toLowerCase();
                    if (!trimmed.isEmpty() && clean.contains(trimmed)) {
                        score += 3;
                    }
                }
            }

            // Word overlap with question
            if (faq.getQuestion() != null) {
                String[] qWords = faq.getQuestion().toLowerCase().split("\\s+");
                for (String qw : qWords) {
                    if (qw.length() > 3 && clean.contains(qw)) {
                        score += 2;
                    }
                }
            }

            if (score > maxScore && score >= 5) {
                maxScore = score;
                bestMatch = faq;
            }
        }

        return Optional.ofNullable(bestMatch);
    }

    /**
     * Builds structured, parameterized RAG context from MySQL database matching the query topic.
     */
    public String retrieveRelevantKnowledge(String query) {
        String lowerQuery = (query != null) ? query.toLowerCase() : "";
        StringBuilder sb = new StringBuilder();

        // 1. General College Settings (Always relevant)
        Map<String, String> settings = new HashMap<>();
        settingRepository.findAll().forEach(s -> settings.put(s.getSettingKey(), s.getSettingValue()));

        String collegeName = settings.getOrDefault("college_name", "Sri Vidyodaya Composite Pre-University College");
        String collegeShortName = settings.getOrDefault("college_short_name", "SVCPUC");
        String address = settings.getOrDefault("campus_address", "#45, Vidya Soudha Campus, 18th Cross, Malleshwaram, Bengaluru, Karnataka - 560003");
        String phone = settings.getOrDefault("phone_primary", "+91 80 2345 6789");
        String email = settings.getOrDefault("email_primary", "info@svcpuc.edu.in");
        String admissionsEmail = settings.getOrDefault("email_admissions", "admissions@svcpuc.edu.in");
        String officeHours = settings.getOrDefault("office_hours", "Monday - Friday: 8:30 AM - 4:30 PM | Saturday: 8:30 AM - 1:30 PM");
        String principalName = settings.getOrDefault("principal_name", "Dr. K. S. Venkatesh");
        String principalTitle = settings.getOrDefault("principal_title_line", "M.Sc., M.Phil., Ph.D. | Principal & Professor");

        sb.append("=== INSTITUTION PROFILE ===\n");
        sb.append("Institution: ").append(collegeName).append(" (").append(collegeShortName).append(")\n");
        sb.append("Address: ").append(address).append("\n");
        sb.append("Phone / Helpline: ").append(phone).append("\n");
        sb.append("Admissions Email: ").append(admissionsEmail).append("\n");
        sb.append("General Email: ").append(email).append("\n");
        sb.append("Office Hours: ").append(officeHours).append("\n");
        sb.append("Principal: ").append(principalName).append(" (").append(principalTitle).append(")\n");
        sb.append("Affiliation: Recognized by Department of Pre-University Education, Govt. of Karnataka (PU Board Code: KA-PUC-0842)\n\n");

        // 2. Courses & Combinations (if query mentions course, subject, stream, science, commerce, pcmb, pcmc, ceba, etc. or general query)
        boolean queryMentionsCourses = containsAny(lowerQuery, "course", "stream", "combination", "science", "commerce", "pcmb", "pcmc", "ceba", "meba", "seba", "subject", "study", "offer", "admission", "eligib");
        if (queryMentionsCourses || lowerQuery.isEmpty() || lowerQuery.contains("what") || lowerQuery.contains("can")) {
            sb.append("=== PRE-UNIVERSITY COURSES & COMBINATIONS ===\n");
            List<Course> courses = courseRepository.findByActiveTrue();
            for (Course c : courses) {
                sb.append("- ").append(c.getCode()).append(" (").append(c.getName()).append(")\n");
                sb.append("  Stream: ").append(c.getStream()).append(" | Duration: ").append(c.getDuration()).append("\n");
                if (c.getDescription() != null && !c.getDescription().isBlank()) {
                    sb.append("  Description: ").append(c.getDescription()).append("\n");
                }
                if (c.getEligibility() != null && !c.getEligibility().isBlank()) {
                    sb.append("  Eligibility: ").append(c.getEligibility()).append("\n");
                }
                if (c.getFeePerYear() != null && c.getFeePerYear().compareTo(java.math.BigDecimal.ZERO) > 0) {
                    sb.append("  Annual Fee: ₹").append(c.getFeePerYear()).append("/year\n");
                }
            }
            sb.append("\n");
        }

        // 3. Admission Process & Guidelines
        boolean queryMentionsAdmissions = containsAny(lowerQuery, "admission", "apply", "document", "process", "deadline", "date", "form", "register", "sslc", "10th", "eligib", "requirement", "mark");
        if (queryMentionsAdmissions) {
            sb.append("=== ADMISSION GUIDELINES & PROCESS ===\n");
            sb.append("- Eligible Candidates: Passed Karnataka SSLC, CBSE Class 10, ICSE, or equivalent recognized secondary school exam.\n");
            sb.append("- Science Stream Cut-off: Minimum 60% aggregate in 10th Standard with strong marks in Maths & Science.\n");
            sb.append("- Commerce Stream Cut-off: Minimum 50% aggregate in 10th Standard.\n");
            sb.append("- Required Documents:\n");
            sb.append("  1. Original & 3 copies of 10th Marks Card (SSLC / CBSE / ICSE).\n");
            sb.append("  2. Transfer Certificate (TC) from the previous school.\n");
            sb.append("  3. Conduct / Study Certificate (minimum 7 years in Karnataka for domicile reservation).\n");
            sb.append("  4. Aadhaar Card copy (Student & Parent).\n");
            sb.append("  5. Category / Caste / Income Certificate (if applicable).\n");
            sb.append("  6. 4 passport size color photographs.\n");
            sb.append("  7. Migration Certificate (for non-Karnataka / ICSE / CBSE students).\n");
            sb.append("- Admissions Portal: Submit an online enquiry directly at the college Admissions page.\n\n");
        }

        // 4. Fees & Scholarships
        boolean queryMentionsFees = containsAny(lowerQuery, "fee", "cost", "scholarship", "concession", "waiver", "discount", "merit", "pay", "install", "price");
        if (queryMentionsFees) {
            sb.append("=== SCHOLARSHIPS & FINANCIAL ASSISTANCE ===\n");
            List<Scholarship> scholarships = scholarshipRepository.findByActiveTrueOrderByCreatedAtDesc();
            if (scholarships.isEmpty()) {
                sb.append("Merit scholarships (>90% in 10th SSLC) and sports fee concessions available upon verification.\n");
            } else {
                for (Scholarship s : scholarships) {
                    sb.append("- ").append(s.getTitle()).append(" (Category: ").append(s.getCategory()).append(")\n");
                    sb.append("  Benefit: ").append(s.getBenefitAmount()).append("\n");
                    sb.append("  Eligibility: ").append(s.getEligibilityCriteria()).append("\n");
                }
            }
            sb.append("Fee Policy Note: Full tuition details depend on the chosen combination and integrated coaching modules. Contact admissions helpline for exact itemized fee structures.\n\n");
        }

        // 5. Facilities & Campus
        boolean queryMentionsFacilities = containsAny(lowerQuery, "facility", "facilities", "lab", "laboratory", "library", "sport", "amenit", "hostel", "transport", "bus", "campus", "canteen", "cafeteria");
        if (queryMentionsFacilities) {
            sb.append("=== CAMPUS FACILITIES ===\n");
            List<Facility> facilities = facilityRepository.findByActiveTrueOrderByDisplayOrderAsc();
            for (Facility f : facilities) {
                sb.append("- ").append(f.getTitle()).append(" (").append(f.getCategory()).append("): ");
                if (f.getDescription() != null) sb.append(f.getDescription());
                if (f.getFeatures() != null && !f.getFeatures().isBlank()) sb.append(" [Features: ").append(f.getFeatures()).append("]");
                sb.append("\n");
            }
            sb.append("\n");
        }

        // 6. Notices, Exams & Calendar
        boolean queryMentionsExamsOrNotices = containsAny(lowerQuery, "exam", "notice", "circular", "test", "calendar", "event", "date", "holiday", "midterm", "preparatory");
        if (queryMentionsExamsOrNotices) {
            sb.append("=== NOTICES & EXAMINATIONS ===\n");
            List<Notice> notices = noticeRepository.findAllByOrderByPublishedAtDesc().stream().limit(5).collect(Collectors.toList());
            for (Notice n : notices) {
                sb.append("- Notice: ").append(n.getTitle()).append(" (Published: ").append(n.getPublishedAt()).append(")\n");
            }
            List<Examination> exams = examinationRepository.findByPublishedTrueOrderByStartDateAsc().stream().limit(3).collect(Collectors.toList());
            for (Examination e : exams) {
                sb.append("- Exam: ").append(e.getExamName()).append(" (").append(e.getStream()).append("): ")
                  .append(e.getStartDate()).append(" to ").append(e.getEndDate()).append("\n");
            }
            sb.append("\n");
        }

        return sb.toString();
    }

    /**
     * Generates intelligent, context-aware clickable navigation links based on user query and bot reply.
     */
    public List<Map<String, String>> extractSuggestedLinks(String reply, String query) {
        String combined = ((reply != null ? reply : "") + " " + (query != null ? query : "")).toLowerCase();
        List<Map<String, String>> links = new ArrayList<>();

        if (containsAny(combined, "admission", "apply", "enquiry", "document", "sslc", "eligib")) {
            links.add(Map.of("title", "Admissions & Online Enquiry", "url", "/admissions"));
        }
        if (containsAny(combined, "course", "stream", "pcmb", "pcmc", "ceba", "meba", "seba", "combination", "subject")) {
            links.add(Map.of("title", "Academic Combinations", "url", "/academics"));
        }
        if (containsAny(combined, "facility", "lab", "library", "sport", "campus", "amenit")) {
            links.add(Map.of("title", "Campus Facilities", "url", "/facilities"));
        }
        if (containsAny(combined, "contact", "address", "phone", "email", "office", "hour", "visit", "location")) {
            links.add(Map.of("title", "Contact & Campus Map", "url", "/contact"));
        }
        if (containsAny(combined, "faculty", "lecturer", "teacher", "professor", "hod")) {
            links.add(Map.of("title", "Faculty Directory", "url", "/faculty"));
        }

        // Limit to max 3 relevant links
        return links.stream().distinct().limit(3).collect(Collectors.toList());
    }

    private boolean containsAny(String text, String... keywords) {
        if (text == null) return false;
        for (String kw : keywords) {
            if (text.contains(kw)) return true;
        }
        return false;
    }
}

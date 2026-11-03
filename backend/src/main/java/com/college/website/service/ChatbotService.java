package com.college.website.service;

import com.college.website.config.AiProviderConfig;
import com.college.website.dto.*;
import com.college.website.entity.ChatbotFaq;
import com.college.website.entity.ChatbotLog;
import com.college.website.entity.CollegeSetting;
import com.college.website.repository.ChatbotFaqRepository;
import com.college.website.repository.ChatbotLogRepository;
import com.college.website.repository.CollegeSettingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChatbotService {

    private static final Logger logger = LoggerFactory.getLogger(ChatbotService.class);

    private final CollegeKnowledgeService knowledgeService;
    private final AiProviderService aiProviderService;
    private final ChatbotFaqRepository faqRepository;
    private final ChatbotLogRepository logRepository;
    private final CollegeSettingRepository settingRepository;
    private final AiProviderConfig aiProviderConfig;

    // Simple in-memory rate limiter: IP/Session -> List of request timestamps
    private final Map<String, List<Long>> rateLimitMap = new ConcurrentHashMap<>();

    public ChatbotService(CollegeKnowledgeService knowledgeService,
                          AiProviderService aiProviderService,
                          ChatbotFaqRepository faqRepository,
                          ChatbotLogRepository logRepository,
                          CollegeSettingRepository settingRepository,
                          AiProviderConfig aiProviderConfig) {
        this.knowledgeService = knowledgeService;
        this.aiProviderService = aiProviderService;
        this.faqRepository = faqRepository;
        this.logRepository = logRepository;
        this.settingRepository = settingRepository;
        this.aiProviderConfig = aiProviderConfig;
    }

    /**
     * Processes incoming visitor message, applies rate limiting & RAG retrieval, and logs the response.
     */
    @Transactional
    public ChatResponse processMessage(ChatRequest request, String clientIp) {
        long startTime = System.currentTimeMillis();

        // 1. Check if chatbot is enabled
        if (!isChatbotEnabled()) {
            return new ChatResponse("The college assistant is currently offline for scheduled maintenance. Please visit our Admissions page or call +91 80 2345 6789.", 
                    List.of("Contact Admissions", "View Courses"), "OFFLINE", null);
        }

        // 2. Rate limit check
        String identifier = (clientIp != null && !clientIp.isBlank()) ? clientIp : request.getSessionId();
        if (identifier != null && isRateLimited(identifier)) {
            logger.warn("Rate limit exceeded for client: {}", identifier);
            return new ChatResponse("You have sent too many messages in a short period. Please wait a minute before asking again.",
                    List.of("Admissions Helpline: +91 80 2345 6789"), "RATE_LIMITED", null);
        }

        String userMessage = request.getMessage() != null ? request.getMessage().trim() : "";
        if (userMessage.isEmpty()) {
            return new ChatResponse("Please ask a question about our college, courses, admissions, or facilities.",
                    getSuggestedQuestions(), "HELP", null);
        }

        // Cap message length safely
        if (userMessage.length() > 500) {
            userMessage = userMessage.substring(0, 500);
        }

        String replyText;
        String source;

        // 3. Check approved FAQs first for exact or high-confidence match
        Optional<ChatbotFaq> directFaq = knowledgeService.findDirectFaqMatch(userMessage);
        if (directFaq.isPresent()) {
            replyText = directFaq.get().getAnswer();
            source = "APPROVED_FAQ";
        } else {
            // 4. Retrieve RAG context from MySQL and invoke AI Provider
            String ragContext = knowledgeService.retrieveRelevantKnowledge(userMessage);
            Map<String, String> aiResult = aiProviderService.generateResponse(userMessage, ragContext, request.getLanguage());
            replyText = aiResult.getOrDefault("reply", "I am unable to process your request at this time. Please contact the admissions office.");
            source = aiResult.getOrDefault("source", "RAG_MYSQL");
        }

        long duration = System.currentTimeMillis() - startTime;

        // 5. Log interaction to MySQL
        ChatbotLog log = new ChatbotLog(
                request.getSessionId(),
                userMessage,
                replyText,
                request.getLanguage() != null ? request.getLanguage() : "en",
                source,
                clientIp,
                (int) duration
        );
        logRepository.save(log);

        // 6. Build response with suggested questions & navigation links
        ChatResponse response = new ChatResponse(replyText, getDynamicSuggestions(userMessage), source, log.getId());
        response.setLinks(knowledgeService.extractSuggestedLinks(replyText, userMessage));
        return response;
    }

    /**
     * Records visitor feedback (thumbs up / thumbs down).
     */
    @Transactional
    public void recordFeedback(Long logId, boolean helpful) {
        if (logId == null) return;
        logRepository.findById(logId).ifPresent(log -> {
            log.setHelpful(helpful);
            logRepository.save(log);
        });
    }

    /**
     * Returns public chatbot configuration for the frontend widget.
     */
    public ChatbotSettingsDto getPublicConfig() {
        boolean enabled = isChatbotEnabled();
        String name = getSettingValue("chatbot_name", "MPUC Assistant");
        String welcome = getSettingValue("chatbot_welcome_message",
                "Hello! Welcome to Sri Vidyodaya Composite Pre-University College (SVCPUC). How can I assist you today with courses, admissions, fees, or campus facilities?");
        List<String> suggestions = getSuggestedQuestions();

        String provider = aiProviderConfig.hasValidApiKey() ? "OpenAI (" + aiProviderConfig.getModel() + ")" : "Grounded MySQL Knowledge Engine";
        return new ChatbotSettingsDto(enabled, name, welcome, suggestions, provider, aiProviderConfig.getModel(), aiProviderConfig.hasValidApiKey());
    }

    /**
     * Admin: Updates chatbot settings.
     */
    @Transactional
    public void updateChatbotSettings(ChatbotSettingsDto dto) {
        if (dto.getEnabled() != null) {
            saveSetting("chatbot_enabled", String.valueOf(dto.getEnabled()), "CHATBOT", "Enable or disable public AI Chatbot widget");
        }
        if (dto.getName() != null) {
            saveSetting("chatbot_name", dto.getName(), "CHATBOT", "Name of the public AI chatbot assistant");
        }
        if (dto.getWelcomeMessage() != null) {
            saveSetting("chatbot_welcome_message", dto.getWelcomeMessage(), "CHATBOT", "Default greeting message");
        }
        if (dto.getSuggestedQuestions() != null && !dto.getSuggestedQuestions().isEmpty()) {
            saveSetting("chatbot_suggested_questions", String.join(",", dto.getSuggestedQuestions()), "CHATBOT", "Suggested quick questions");
        }
    }

    // -------------------------------------------------------------
    // FAQ Management
    // -------------------------------------------------------------

    public List<ChatbotFaqDto> getAllFaqs() {
        return faqRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(this::toFaqDto)
                .toList();
    }

    @Transactional
    public ChatbotFaqDto createFaq(ChatbotFaqDto dto) {
        ChatbotFaq faq = new ChatbotFaq(dto.getQuestion(), dto.getAnswer(), dto.getCategory(), dto.getKeywords());
        if (dto.getDisplayOrder() != null) faq.setDisplayOrder(dto.getDisplayOrder());
        if (dto.getIsActive() != null) faq.setIsActive(dto.getIsActive());
        ChatbotFaq saved = faqRepository.save(faq);
        return toFaqDto(saved);
    }

    @Transactional
    public ChatbotFaqDto updateFaq(Long id, ChatbotFaqDto dto) {
        ChatbotFaq faq = faqRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FAQ not found with id: " + id));
        if (dto.getQuestion() != null) faq.setQuestion(dto.getQuestion());
        if (dto.getAnswer() != null) faq.setAnswer(dto.getAnswer());
        if (dto.getCategory() != null) faq.setCategory(dto.getCategory());
        if (dto.getKeywords() != null) faq.setKeywords(dto.getKeywords());
        if (dto.getDisplayOrder() != null) faq.setDisplayOrder(dto.getDisplayOrder());
        if (dto.getIsActive() != null) faq.setIsActive(dto.getIsActive());
        return toFaqDto(faqRepository.save(faq));
    }

    @Transactional
    public void deleteFaq(Long id) {
        faqRepository.deleteById(id);
    }

    // -------------------------------------------------------------
    // Analytics & Logs
    // -------------------------------------------------------------

    public Page<ChatbotLog> getLogs(Pageable pageable) {
        return logRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    public Map<String, Object> getChatbotStats() {
        long totalLogs = logRepository.count();
        long helpfulCount = logRepository.countByHelpfulTrue();
        long unhelpfulCount = logRepository.countByHelpfulFalse();
        Double avgResponseTime = logRepository.getAverageResponseTimeMs();
        long totalFaqs = faqRepository.count();

        double satisfactionRate = (helpfulCount + unhelpfulCount > 0)
                ? ((double) helpfulCount / (helpfulCount + unhelpfulCount)) * 100.0
                : 100.0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalQueries", totalLogs);
        stats.put("helpfulCount", helpfulCount);
        stats.put("unhelpfulCount", unhelpfulCount);
        stats.put("satisfactionRate", Math.round(satisfactionRate * 10.0) / 10.0);
        stats.put("averageResponseTimeMs", avgResponseTime != null ? Math.round(avgResponseTime) : 120);
        stats.put("totalApprovedFaqs", totalFaqs);
        stats.put("aiProvider", aiProviderConfig.hasValidApiKey() ? "OpenAI (" + aiProviderConfig.getModel() + ")" : "Grounded MySQL Knowledge Engine");
        stats.put("hasApiKey", aiProviderConfig.hasValidApiKey());
        return stats;
    }

    // -------------------------------------------------------------
    // Helper Methods
    // -------------------------------------------------------------

    private boolean isChatbotEnabled() {
        return "true".equalsIgnoreCase(getSettingValue("chatbot_enabled", "true"));
    }

    private List<String> getSuggestedQuestions() {
        String raw = getSettingValue("chatbot_suggested_questions", null);
        if (raw != null && !raw.isBlank()) {
            return Arrays.stream(raw.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();
        }
        return List.of(
                "What courses does the college offer?",
                "Which Science combinations are available?",
                "Which Commerce combinations are available?",
                "What are the admission requirements?",
                "What documents are required for admission?",
                "What is the college fee structure?",
                "What facilities are available?",
                "Where is the college located?",
                "How can I contact the college?"
        );
    }

    private List<String> getDynamicSuggestions(String currentQuery) {
        String lower = currentQuery.toLowerCase();
        if (lower.contains("course") || lower.contains("stream")) {
            return List.of("What are the admission requirements?", "What documents are required?", "How can I contact the college?");
        } else if (lower.contains("admission") || lower.contains("apply")) {
            return List.of("What documents are required?", "What are the fee and scholarship options?", "Where is the college located?");
        } else if (lower.contains("fee") || lower.contains("scholarship")) {
            return List.of("What are the admission requirements?", "Which Science combinations are available?", "How can I contact the admissions office?");
        }
        return getSuggestedQuestions().stream().limit(3).toList();
    }

    private boolean isRateLimited(String identifier) {
        long now = System.currentTimeMillis();
        long window = 60_000L; // 1 minute
        int limit = aiProviderConfig.getRateLimitPerMinute();

        rateLimitMap.compute(identifier, (k, list) -> {
            if (list == null) list = new ArrayList<>();
            list.removeIf(timestamp -> now - timestamp > window);
            list.add(now);
            return list;
        });

        return rateLimitMap.get(identifier).size() > limit;
    }

    private String getSettingValue(String key, String defaultValue) {
        return settingRepository.findBySettingKey(key)
                .map(CollegeSetting::getSettingValue)
                .filter(v -> v != null && !v.isBlank())
                .orElse(defaultValue);
    }

    private void saveSetting(String key, String value, String category, String description) {
        CollegeSetting setting = settingRepository.findBySettingKey(key)
                .orElse(new CollegeSetting(key, value, category, description));
        setting.setSettingValue(value);
        settingRepository.save(setting);
    }

    private ChatbotFaqDto toFaqDto(ChatbotFaq f) {
        return new ChatbotFaqDto(f.getId(), f.getQuestion(), f.getAnswer(), f.getCategory(), f.getKeywords(), f.getDisplayOrder(), f.getIsActive());
    }
}

package com.college.website.service;

import com.college.website.dto.*;
import com.college.website.entity.*;
import com.college.website.repository.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class WhatsAppService {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppService.class);

    private final WhatsAppSettingRepository settingRepository;
    private final WhatsAppTemplateRepository templateRepository;
    private final WhatsAppNotificationLogRepository logRepository;
    private final WhatsAppOptInRepository optInRepository;
    private final WhatsAppWebhookEventRepository webhookEventRepository;
    private final WhatsAppCloudApiClient cloudApiClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public WhatsAppService(WhatsAppSettingRepository settingRepository,
                           WhatsAppTemplateRepository templateRepository,
                           WhatsAppNotificationLogRepository logRepository,
                           WhatsAppOptInRepository optInRepository,
                           WhatsAppWebhookEventRepository webhookEventRepository,
                           WhatsAppCloudApiClient cloudApiClient) {
        this.settingRepository = settingRepository;
        this.templateRepository = templateRepository;
        this.logRepository = logRepository;
        this.optInRepository = optInRepository;
        this.webhookEventRepository = webhookEventRepository;
        this.cloudApiClient = cloudApiClient;
    }

    /**
     * Retrieve or initialize settings
     */
    public WhatsAppSetting getOrCreateSettings() {
        return settingRepository.findFirstByOrderByIdAsc().orElseGet(() -> {
            WhatsAppSetting defaultSetting = new WhatsAppSetting();
            defaultSetting.setPhoneNumber("919743988354");
            defaultSetting.setDisplayPhoneNumber("+91 97439 88354");
            defaultSetting.setFloatingEnabled(true);
            defaultSetting.setWelcomeMessage("Chat with MPUC College");
            defaultSetting.setWelcomeSubtitle("Typically replies within a few minutes");
            defaultSetting.setPrefilledDefaultMessage("Hello MPUC College, I would like to enquire about PU admissions and courses for the academic year 2026-27.");
            return settingRepository.save(defaultSetting);
        });
    }

    /**
     * Public config: safe for frontend widgets, hides all internal ids/tokens
     */
    public WhatsAppPublicConfigDto getPublicConfig() {
        WhatsAppSetting settings = getOrCreateSettings();
        WhatsAppPublicConfigDto dto = new WhatsAppPublicConfigDto();
        dto.setPhoneNumber(settings.getPhoneNumber());
        dto.setDisplayPhoneNumber(settings.getDisplayPhoneNumber());
        dto.setFloatingEnabled(settings.getFloatingEnabled());
        dto.setWelcomeMessage(settings.getWelcomeMessage());
        dto.setWelcomeSubtitle(settings.getWelcomeSubtitle());
        dto.setPrefilledDefaultMessage(settings.getPrefilledDefaultMessage());
        dto.setIsCloudApiConfigured(cloudApiClient.isConfigured());

        Map<String, String> prefilled = new HashMap<>();
        List<WhatsAppTemplate> templates = templateRepository.findByIsActiveTrue();
        for (WhatsAppTemplate t : templates) {
            prefilled.put(t.getTemplateName(), t.getBodyText());
        }
        dto.setPrefilledTemplates(prefilled);

        return dto;
    }

    /**
     * Admin settings with sensitive token status
     */
    public WhatsAppAdminSettingsDto getAdminSettings() {
        WhatsAppSetting s = getOrCreateSettings();
        WhatsAppAdminSettingsDto dto = new WhatsAppAdminSettingsDto();
        dto.setId(s.getId());
        dto.setPhoneNumber(s.getPhoneNumber());
        dto.setDisplayPhoneNumber(s.getDisplayPhoneNumber());
        dto.setFloatingEnabled(s.getFloatingEnabled());
        dto.setWelcomeMessage(s.getWelcomeMessage());
        dto.setWelcomeSubtitle(s.getWelcomeSubtitle());
        dto.setPrefilledDefaultMessage(s.getPrefilledDefaultMessage());
        dto.setBusinessAccountId(s.getBusinessAccountId() != null ? s.getBusinessAccountId() : cloudApiClient.getBusinessAccountId());
        dto.setPhoneNumberId(s.getPhoneNumberId() != null ? s.getPhoneNumberId() : cloudApiClient.getPhoneNumberId());
        dto.setApiVersion(s.getApiVersion() != null ? s.getApiVersion() : cloudApiClient.getApiVersion());
        dto.setWebhookVerifyToken(s.getWebhookVerifyToken());
        dto.setAutoNotificationsEnabled(s.getAutoNotificationsEnabled());
        dto.setNotifyOnEnquiry(s.getNotifyOnEnquiry());
        dto.setNotifyOnStatusChange(s.getNotifyOnStatusChange());
        dto.setNotifyOnCounselling(s.getNotifyOnCounselling());
        dto.setNotifyOnExam(s.getNotifyOnExam());
        dto.setIsCloudApiConfigured(cloudApiClient.isConfigured());
        dto.setHasAccessToken(cloudApiClient.hasAccessToken());
        dto.setHasAppSecret(cloudApiClient.hasAppSecret());
        return dto;
    }

    @Transactional
    public WhatsAppAdminSettingsDto updateAdminSettings(WhatsAppAdminSettingsDto dto) {
        WhatsAppSetting s = getOrCreateSettings();
        if (dto.getPhoneNumber() != null && !dto.getPhoneNumber().isBlank()) {
            s.setPhoneNumber(WhatsAppCloudApiClient.cleanPhoneNumber(dto.getPhoneNumber()));
        }
        if (dto.getDisplayPhoneNumber() != null) s.setDisplayPhoneNumber(dto.getDisplayPhoneNumber());
        if (dto.getFloatingEnabled() != null) s.setFloatingEnabled(dto.getFloatingEnabled());
        if (dto.getWelcomeMessage() != null) s.setWelcomeMessage(dto.getWelcomeMessage());
        if (dto.getWelcomeSubtitle() != null) s.setWelcomeSubtitle(dto.getWelcomeSubtitle());
        if (dto.getPrefilledDefaultMessage() != null) s.setPrefilledDefaultMessage(dto.getPrefilledDefaultMessage());
        if (dto.getBusinessAccountId() != null) s.setBusinessAccountId(dto.getBusinessAccountId().trim());
        if (dto.getPhoneNumberId() != null) s.setPhoneNumberId(dto.getPhoneNumberId().trim());
        if (dto.getApiVersion() != null) s.setApiVersion(dto.getApiVersion());
        if (dto.getWebhookVerifyToken() != null) s.setWebhookVerifyToken(dto.getWebhookVerifyToken());
        if (dto.getAutoNotificationsEnabled() != null) s.setAutoNotificationsEnabled(dto.getAutoNotificationsEnabled());
        if (dto.getNotifyOnEnquiry() != null) s.setNotifyOnEnquiry(dto.getNotifyOnEnquiry());
        if (dto.getNotifyOnStatusChange() != null) s.setNotifyOnStatusChange(dto.getNotifyOnStatusChange());
        if (dto.getNotifyOnCounselling() != null) s.setNotifyOnCounselling(dto.getNotifyOnCounselling());
        if (dto.getNotifyOnExam() != null) s.setNotifyOnExam(dto.getNotifyOnExam());

        settingRepository.save(s);
        return getAdminSettings();
    }

    /**
     * Templates CRUD
     */
    public List<WhatsAppTemplate> getAllTemplates() {
        return templateRepository.findAll();
    }

    @Transactional
    public WhatsAppTemplate saveTemplate(WhatsAppTemplate template) {
        return templateRepository.save(template);
    }

    @Transactional
    public WhatsAppTemplate updateTemplate(Long id, WhatsAppTemplate updated) {
        WhatsAppTemplate existing = templateRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Template not found with id: " + id));
        existing.setTemplateName(updated.getTemplateName());
        existing.setCategory(updated.getCategory());
        existing.setLanguage(updated.getLanguage());
        existing.setHeaderText(updated.getHeaderText());
        existing.setBodyText(updated.getBodyText());
        existing.setFooterText(updated.getFooterText());
        existing.setIsActive(updated.getIsActive());
        existing.setStatus(updated.getStatus());
        return templateRepository.save(existing);
    }

    @Transactional
    public void deleteTemplate(Long id) {
        templateRepository.deleteById(id);
    }

    /**
     * Opt-in Management
     */
    @Transactional
    public WhatsAppOptIn recordOptIn(WhatsAppOptInRequestDto dto) {
        String cleanPhone = WhatsAppCloudApiClient.cleanPhoneNumber(dto.getPhoneNumber());
        WhatsAppOptIn optIn = optInRepository.findByPhoneNumber(cleanPhone).orElseGet(() -> {
            WhatsAppOptIn newRecord = new WhatsAppOptIn();
            newRecord.setPhoneNumber(cleanPhone);
            return newRecord;
        });

        optIn.setStudentName(dto.getStudentName());
        optIn.setOptInSource(dto.getOptInSource() != null ? dto.getOptInSource() : "ADMISSION_ENQUIRY");
        boolean isOptingIn = dto.getIsOptedIn() != null ? dto.getIsOptedIn() : true;
        optIn.setIsOptedIn(isOptingIn);
        if (isOptingIn) {
            optIn.setOptInDate(LocalDateTime.now());
            optIn.setOptOutDate(null);
        } else {
            optIn.setOptOutDate(LocalDateTime.now());
        }
        return optInRepository.save(optIn);
    }

    public Page<WhatsAppOptIn> getOptInRecords(Pageable pageable) {
        return optInRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    /**
     * Notification Logs
     */
    public Page<WhatsAppNotificationLog> getNotificationLogs(Pageable pageable) {
        return logRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    public List<WhatsAppNotificationLog> getRecentLogs() {
        return logRepository.findTop50ByOrderByCreatedAtDesc();
    }

    /**
     * Send Message (Official Meta Cloud API or Click-to-Chat fallback)
     */
    @Transactional
    public Map<String, Object> sendMessage(WhatsAppSendRequestDto request) {
        String cleanPhone = WhatsAppCloudApiClient.cleanPhoneNumber(request.getRecipientPhone());
        if (cleanPhone.length() < 10) {
            throw new IllegalArgumentException("Invalid phone number format: " + request.getRecipientPhone());
        }

        WhatsAppNotificationLog nLog = new WhatsAppNotificationLog();
        nLog.setRecipientPhone(cleanPhone);
        nLog.setRecipientName(request.getRecipientName());
        nLog.setTemplateName(request.getTemplateName());
        nLog.setReferenceType(request.getReferenceType());
        nLog.setReferenceId(request.getReferenceId());

        String messageContent = request.getCustomMessage();
        if (request.getTemplateName() != null && !request.getTemplateName().isBlank()) {
            Optional<WhatsAppTemplate> tOpt = templateRepository.findByTemplateName(request.getTemplateName());
            if (tOpt.isPresent()) {
                WhatsAppTemplate t = tOpt.get();
                String rendered = t.getBodyText();
                if (request.getParameters() != null) {
                    for (int i = 0; i < request.getParameters().size(); i++) {
                        rendered = rendered.replace("{{" + (i + 1) + "}}", request.getParameters().get(i));
                    }
                }
                messageContent = rendered;
            }
        }
        nLog.setMessageBody(messageContent);

        Map<String, Object> response = new HashMap<>();

        // If Cloud API is configured, send via Meta Cloud API
        if (cloudApiClient.isConfigured()) {
            try {
                Map<String, Object> apiRes;
                if (request.getTemplateName() != null && !request.getTemplateName().isBlank()) {
                    apiRes = cloudApiClient.sendTemplateMessage(cleanPhone, request.getTemplateName(), "en", request.getParameters());
                } else {
                    apiRes = cloudApiClient.sendTextMessage(cleanPhone, messageContent != null ? messageContent : "Hello from MPUC College!");
                }

                String messageId = (String) apiRes.get("messageId");
                nLog.setMetaMessageId(messageId);
                nLog.setDeliveryStatus("SENT");
                nLog.setChannel("CLOUD_API");
                logRepository.save(nLog);

                response.put("success", true);
                response.put("channel", "CLOUD_API");
                response.put("messageId", messageId);
                response.put("status", "SENT");
                response.put("message", "Message sent successfully via Meta WhatsApp Cloud API");
                return response;

            } catch (Exception ex) {
                log.error("Cloud API send failed: {}", ex.getMessage());
                nLog.setDeliveryStatus("FAILED");
                nLog.setErrorDetails(ex.getMessage());
                nLog.setChannel("CLOUD_API");
                logRepository.save(nLog);

                // Include click-to-chat fallback link
                String waUrl = generateClickToChatUrl(cleanPhone, messageContent);
                response.put("success", false);
                response.put("channel", "CLOUD_API_FAILED");
                response.put("status", "FAILED");
                response.put("error", ex.getMessage());
                response.put("clickToChatUrl", waUrl);
                response.put("message", "Cloud API request failed. Click-to-chat link generated as fallback.");
                return response;
            }
        } else {
            // Cloud API not configured: log as CLICK_TO_CHAT
            String waUrl = generateClickToChatUrl(cleanPhone, messageContent);
            nLog.setDeliveryStatus("CLICK_TO_CHAT");
            nLog.setChannel("WA_ME");
            nLog.setErrorDetails("Cloud API not configured in environment; click-to-chat URL provided");
            logRepository.save(nLog);

            response.put("success", true);
            response.put("channel", "WA_ME");
            response.put("status", "CLICK_TO_CHAT");
            response.put("clickToChatUrl", waUrl);
            response.put("message", "WhatsApp Cloud API credentials not configured. Click-to-chat fallback link created.");
            return response;
        }
    }

    /**
     * Process Meta WhatsApp Cloud API Webhook
     */
    @Transactional
    public void processWebhook(String rawPayload, String signatureHeader) {
        // 1. Signature validation
        if (!cloudApiClient.verifySignature(rawPayload, signatureHeader)) {
            log.warn("Invalid WhatsApp Webhook signature received: {}", signatureHeader);
            throw new SecurityException("Invalid webhook signature header");
        }

        // 2. Parse payload
        WhatsAppWebhookEvent event = new WhatsAppWebhookEvent();
        event.setSignature(signatureHeader);
        event.setPayloadJson(rawPayload);

        try {
            JsonNode root = objectMapper.readTree(rawPayload);
            if (root.has("entry") && root.get("entry").isArray()) {
                for (JsonNode entry : root.get("entry")) {
                    if (entry.has("changes") && entry.get("changes").isArray()) {
                        for (JsonNode change : entry.get("changes")) {
                            JsonNode value = change.path("value");
                            event.setEventType(change.path("field").asText("messages"));

                            // Process delivery statuses
                            if (value.has("statuses") && value.get("statuses").isArray()) {
                                for (JsonNode statusNode : value.get("statuses")) {
                                    String metaId = statusNode.path("id").asText();
                                    String status = statusNode.path("status").asText().toUpperCase(); // SENT, DELIVERED, READ, FAILED
                                    event.setEventId(metaId);

                                    // Update our notification log
                                    Optional<WhatsAppNotificationLog> logOpt = logRepository.findByMetaMessageId(metaId);
                                    if (logOpt.isPresent()) {
                                        WhatsAppNotificationLog notifLog = logOpt.get();
                                        notifLog.setDeliveryStatus(status);
                                        if (statusNode.has("errors")) {
                                            notifLog.setErrorDetails(statusNode.path("errors").toString());
                                        }
                                        logRepository.save(notifLog);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            event.setProcessed(true);
        } catch (Exception ex) {
            log.error("Failed to parse WhatsApp Webhook payload: {}", ex.getMessage(), ex);
            event.setProcessed(false);
            event.setProcessingError(ex.getMessage());
        }

        webhookEventRepository.save(event);
    }

    public String generateClickToChatUrl(String phone, String text) {
        String cleanPhone = WhatsAppCloudApiClient.cleanPhoneNumber(phone);
        String encodedText = "";
        if (text != null && !text.isBlank()) {
            encodedText = URLEncoder.encode(text, StandardCharsets.UTF_8);
        }
        return String.format("https://wa.me/%s?text=%s", cleanPhone, encodedText);
    }

    private String maskString(String str) {
        if (str == null || str.isBlank()) return "";
        if (str.length() <= 4) return "****";
        return str.substring(0, 2) + "****" + str.substring(str.length() - 2);
    }
}

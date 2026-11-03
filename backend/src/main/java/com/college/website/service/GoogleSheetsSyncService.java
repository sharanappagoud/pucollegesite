package com.college.website.service;

import com.college.website.entity.AdmissionApplication;
import com.college.website.entity.AdmissionEnquiry;
import com.college.website.entity.CollegeSetting;
import com.college.website.repository.AdmissionApplicationRepository;
import com.college.website.repository.AdmissionEnquiryRepository;
import com.college.website.repository.CollegeSettingRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.CompletableFuture;

@Service
public class GoogleSheetsSyncService {

    private static final Logger logger = LoggerFactory.getLogger(GoogleSheetsSyncService.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final CollegeSettingRepository settingRepository;
    private final AdmissionEnquiryRepository enquiryRepository;
    private final AdmissionApplicationRepository applicationRepository;
    private final AuditLogService auditLogService;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public GoogleSheetsSyncService(CollegeSettingRepository settingRepository,
                                   AdmissionEnquiryRepository enquiryRepository,
                                   AdmissionApplicationRepository applicationRepository,
                                   AuditLogService auditLogService,
                                   ObjectMapper objectMapper) {
        this.settingRepository = settingRepository;
        this.enquiryRepository = enquiryRepository;
        this.applicationRepository = applicationRepository;
        this.auditLogService = auditLogService;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .followRedirects(HttpClient.Redirect.ALWAYS)
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    public String getSpreadsheetUrl() {
        return getSetting("google_sheets_spreadsheet_url",
                "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing");
    }

    public String getWebhookUrl() {
        return getSetting("google_sheets_webhook_url", "");
    }

    public String getOwnerEmail() {
        return getSetting("google_sheets_owner_email", "Sharanappagouda148@gmail.com");
    }

    public boolean isSyncEnabled() {
        String val = getSetting("google_sheets_sync_enabled", "true");
        return "true".equalsIgnoreCase(val) || "1".equals(val);
    }

    public Map<String, Object> getConfig() {
        Map<String, Object> config = new HashMap<>();
        config.put("ownerEmail", getOwnerEmail());
        config.put("spreadsheetUrl", getSpreadsheetUrl());
        config.put("webhookUrl", getWebhookUrl());
        config.put("syncEnabled", isSyncEnabled());
        config.put("hasWebhook", !getWebhookUrl().isBlank());
        return config;
    }

    @Transactional
    public void updateConfig(String spreadsheetUrl, String webhookUrl, Boolean syncEnabled, String ownerEmail, String adminUsername) {
        if (spreadsheetUrl != null) saveSetting("google_sheets_spreadsheet_url", spreadsheetUrl.trim(), "INTEGRATIONS", "Google Spreadsheet URL");
        if (webhookUrl != null) saveSetting("google_sheets_webhook_url", webhookUrl.trim(), "INTEGRATIONS", "Google Apps Script Webhook URL");
        if (syncEnabled != null) saveSetting("google_sheets_sync_enabled", String.valueOf(syncEnabled), "INTEGRATIONS", "Enable Google Sheets Auto Forwarding");
        if (ownerEmail != null && !ownerEmail.isBlank()) saveSetting("google_sheets_owner_email", ownerEmail.trim(), "INTEGRATIONS", "Google Spreadsheet Owner Email");

        auditLogService.logAction(adminUsername, "UPDATE_GOOGLE_SHEETS_CONFIG", "SETTINGS",
                "Updated Google Spreadsheet integration config for " + (ownerEmail != null ? ownerEmail : getOwnerEmail()));
    }

    /**
     * Asynchronously forwards a single admission enquiry to Google Sheets
     */
    @Async
    public CompletableFuture<Boolean> forwardEnquiryAsync(AdmissionEnquiry enquiry) {
        if (!isSyncEnabled()) {
            logger.debug("Google Sheets auto-sync is disabled.");
            return CompletableFuture.completedFuture(false);
        }

        String webhook = getWebhookUrl();
        if (webhook.isBlank()) {
            logger.info("Admission enquiry [{}] recorded locally. Google Sheets Webhook URL not set yet; ready to sync once configured.",
                    enquiry.getReferenceNo());
            return CompletableFuture.completedFuture(false);
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("action", "APPEND_ENQUIRY");
        payload.put("ownerEmail", getOwnerEmail());
        payload.put("notificationEmail", getOwnerEmail());
        payload.put("sendEmailAlert", true);
        payload.put("sendStudentConfirmation", true);
        payload.put("studentEmail", enquiry.getEmail());
        payload.put("referenceNo", enquiry.getReferenceNo());
        payload.put("studentName", enquiry.getStudentName());
        payload.put("parentName", enquiry.getParentName());
        payload.put("studentPhone", enquiry.getStudentPhone());
        payload.put("parentPhone", enquiry.getParentPhone());
        payload.put("parentEmail", enquiry.getParentEmail() != null ? enquiry.getParentEmail() : "");
        payload.put("email", enquiry.getEmail());
        payload.put("qualifyingClass", enquiry.getLastCompletedClass());
        payload.put("board", enquiry.getBoard());
        payload.put("stream", enquiry.getPreferredStream());
        payload.put("combination", enquiry.getPreferredCombination());
        payload.put("academicYear", enquiry.getAcademicYear());
        payload.put("address", enquiry.getAddress() != null ? enquiry.getAddress() : "");
        payload.put("pincode", enquiry.getPincode() != null ? enquiry.getPincode() : "");
        payload.put("referredBy", enquiry.getReferredBy() != null ? enquiry.getReferredBy() : "");
        payload.put("message", enquiry.getMessage() != null ? enquiry.getMessage() : "");
        payload.put("status", enquiry.getStatus());
        payload.put("submittedAt", enquiry.getCreatedAt() != null ? enquiry.getCreatedAt().format(DATE_FORMATTER) : "");

        boolean success = sendPayload(webhook, payload);
        if (success) {
            auditLogService.logAction("SYSTEM", "GOOGLE_SHEETS_FORWARD", "ADMISSIONS",
                    "Forwarded enquiry " + enquiry.getReferenceNo() + " to Google Spreadsheet");
        }
        return CompletableFuture.completedFuture(success);
    }

    /**
     * Asynchronously forwards an enquiry status update to Google Sheets and notifies student
     */
    @Async
    public CompletableFuture<Boolean> forwardStatusUpdateAsync(AdmissionEnquiry enquiry, String oldStatus, String note) {
        if (!isSyncEnabled()) {
            return CompletableFuture.completedFuture(false);
        }
        String webhook = getWebhookUrl();
        if (webhook.isBlank()) {
            return CompletableFuture.completedFuture(false);
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("action", "UPDATE_ENQUIRY_STATUS");
        payload.put("ownerEmail", getOwnerEmail());
        payload.put("referenceNo", enquiry.getReferenceNo());
        payload.put("studentName", enquiry.getStudentName());
        payload.put("studentEmail", enquiry.getEmail());
        payload.put("recipientEmail", enquiry.getEmail());
        payload.put("parentEmail", enquiry.getParentEmail() != null ? enquiry.getParentEmail() : "");
        payload.put("studentPhone", enquiry.getStudentPhone());
        payload.put("parentPhone", enquiry.getParentPhone());
        payload.put("stream", enquiry.getPreferredStream());
        payload.put("combination", enquiry.getPreferredCombination());
        payload.put("academicYear", enquiry.getAcademicYear());
        payload.put("oldStatus", oldStatus);
        payload.put("status", enquiry.getStatus());
        payload.put("note", note != null ? note : "");
        payload.put("subject", "📢 Admission Status Update: " + enquiry.getStatus() + " (Ref: " + enquiry.getReferenceNo() + ")");
        payload.put("message", "Your admission status has been updated to: " + enquiry.getStatus() + 
                (note != null && !note.isBlank() ? "\n\nCounselor / Office Remarks:\n" + note : ""));
        payload.put("updatedAt", LocalDateTime.now().format(DATE_FORMATTER));
        payload.put("sendEmailAlert", true);

        boolean success = sendPayload(webhook, payload);
        if (success) {
            auditLogService.logAction("SYSTEM", "GOOGLE_SHEETS_STATUS_UPDATE", "ADMISSIONS",
                    "Dispatched status update for " + enquiry.getReferenceNo() + " (" + enquiry.getStatus() + ") to Google Sheets");
        }
        return CompletableFuture.completedFuture(success);
    }

    /**
     * Forwards a direct admin message (email/SMS) to Google Apps Script for inbox delivery
     */
    public boolean forwardDirectMessage(String referenceNo, String recipientType, String recipientName,
                                        String recipientEmail, String subject, String messageText) {
        if (!isSyncEnabled()) {
            return false;
        }
        String webhook = getWebhookUrl();
        if (webhook.isBlank() || webhook.contains("/edit") || webhook.contains("/home/projects/")) {
            return false;
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("action", "SEND_DIRECT_EMAIL");
        payload.put("ownerEmail", getOwnerEmail());
        payload.put("referenceNo", referenceNo != null ? referenceNo : "");
        payload.put("recipientType", recipientType);
        payload.put("recipientName", recipientName);
        payload.put("recipientEmail", recipientEmail);
        payload.put("subject", subject);
        payload.put("message", messageText);
        payload.put("submittedAt", LocalDateTime.now().format(DATE_FORMATTER));

        boolean ok = sendPayload(webhook, payload);
        if (ok) {
            auditLogService.logAction("ADMIN", "DIRECT_MESSAGE_APPS_SCRIPT", "COMMUNICATIONS",
                    "Forwarded direct message for " + recipientEmail + " to Google Apps Script");
        }
        return ok;
    }

    /**
     * Asynchronously forwards an admission application to Google Sheets
     */
    @Async
    public CompletableFuture<Boolean> forwardApplicationAsync(AdmissionApplication app) {
        if (!isSyncEnabled()) {
            return CompletableFuture.completedFuture(false);
        }

        String webhook = getWebhookUrl();
        if (webhook.isBlank()) {
            return CompletableFuture.completedFuture(false);
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("action", "APPEND_APPLICATION");
        payload.put("ownerEmail", getOwnerEmail());
        payload.put("notificationEmail", getOwnerEmail());
        payload.put("sendEmailAlert", true);
        payload.put("applicationNo", app.getApplicationNo());
        payload.put("enquiryRef", app.getEnquiry() != null ? app.getEnquiry().getReferenceNo() : "");
        payload.put("studentName", app.getStudentName());
        payload.put("dob", app.getDob() != null ? app.getDob().toString() : "");
        payload.put("gender", app.getGender() != null ? app.getGender() : "");
        payload.put("bloodGroup", app.getBloodGroup() != null ? app.getBloodGroup() : "");
        payload.put("nationality", app.getNationality() != null ? app.getNationality() : "Indian");
        payload.put("address", app.getAddress() != null ? app.getAddress() : "");
        payload.put("marksPercentage", app.getMarksPercentage() != null ? app.getMarksPercentage().toString() : "");
        payload.put("status", app.getStatus());
        payload.put("submittedAt", app.getCreatedAt() != null ? app.getCreatedAt().format(DATE_FORMATTER) : "");

        boolean success = sendPayload(webhook, payload);
        if (success) {
            auditLogService.logAction("SYSTEM", "GOOGLE_SHEETS_FORWARD", "STUDENTS",
                    "Forwarded application " + app.getApplicationNo() + " to Google Spreadsheet");
        }
        return CompletableFuture.completedFuture(success);
    }

    /**
     * Synchronizes all existing enquiries and applications to Google Sheets in bulk
     */
    public Map<String, Object> syncAllRecords() {
        String webhook = getWebhookUrl();
        List<AdmissionEnquiry> enquiries = enquiryRepository.findAll();
        List<AdmissionApplication> applications = applicationRepository.findAll();

        Map<String, Object> result = new HashMap<>();
        result.put("totalEnquiries", enquiries.size());
        result.put("totalApplications", applications.size());
        result.put("spreadsheetUrl", getSpreadsheetUrl());
        result.put("ownerEmail", getOwnerEmail());

        if (webhook.isBlank()) {
            result.put("success", false);
            result.put("message", "Google Sheets Webhook URL is not configured yet. Please configure the Webhook URL in settings.");
            result.put("setupNeeded", true);
            return result;
        }

        if (webhook.contains("/edit") || webhook.contains("/home/projects/")) {
            result.put("success", false);
            result.put("message", "Invalid Webhook URL: You pasted the Google Apps Script project editor link (.../edit). Please click 'Deploy' ➔ 'New deployment' ➔ 'Web app' (access: Anyone) in Apps Script, and copy the Web app URL ending in /exec.");
            result.put("isEditorUrl", true);
            return result;
        }

        List<Map<String, Object>> enquiryList = new ArrayList<>();
        for (AdmissionEnquiry e : enquiries) {
            Map<String, Object> row = new HashMap<>();
            row.put("referenceNo", e.getReferenceNo());
            row.put("studentName", e.getStudentName());
            row.put("parentName", e.getParentName());
            row.put("studentPhone", e.getStudentPhone());
            row.put("parentPhone", e.getParentPhone());
            row.put("email", e.getEmail());
            row.put("qualifyingClass", e.getLastCompletedClass());
            row.put("board", e.getBoard());
            row.put("stream", e.getPreferredStream());
            row.put("combination", e.getPreferredCombination());
            row.put("academicYear", e.getAcademicYear());
            row.put("address", e.getAddress() != null ? e.getAddress() : "");
            row.put("pincode", e.getPincode() != null ? e.getPincode() : "");
            row.put("referredBy", e.getReferredBy() != null ? e.getReferredBy() : "");
            row.put("message", e.getMessage() != null ? e.getMessage() : "");
            row.put("status", e.getStatus());
            row.put("submittedAt", e.getCreatedAt() != null ? e.getCreatedAt().format(DATE_FORMATTER) : "");
            enquiryList.add(row);
        }

        List<Map<String, Object>> applicationList = new ArrayList<>();
        for (AdmissionApplication a : applications) {
            Map<String, Object> row = new HashMap<>();
            row.put("applicationNo", a.getApplicationNo());
            row.put("enquiryRef", a.getEnquiry() != null ? a.getEnquiry().getReferenceNo() : "");
            row.put("studentName", a.getStudentName());
            row.put("dob", a.getDob() != null ? a.getDob().toString() : "");
            row.put("gender", a.getGender() != null ? a.getGender() : "");
            row.put("bloodGroup", a.getBloodGroup() != null ? a.getBloodGroup() : "");
            row.put("nationality", a.getNationality() != null ? a.getNationality() : "Indian");
            row.put("address", a.getAddress() != null ? a.getAddress() : "");
            row.put("marksPercentage", a.getMarksPercentage() != null ? a.getMarksPercentage().toString() : "");
            row.put("status", a.getStatus());
            row.put("submittedAt", a.getCreatedAt() != null ? a.getCreatedAt().format(DATE_FORMATTER) : "");
            applicationList.add(row);
        }

        Map<String, Object> bulkPayload = new HashMap<>();
        bulkPayload.put("action", "BULK_SYNC");
        bulkPayload.put("ownerEmail", getOwnerEmail());
        bulkPayload.put("enquiries", enquiryList);
        bulkPayload.put("applications", applicationList);

        boolean ok = sendPayload(webhook, bulkPayload);
        result.put("success", ok);
        result.put("message", ok ? "Successfully forwarded all " + enquiries.size() + " admission records to Google Spreadsheet."
                                : "Webhook responded with an error or timed out.");
        return result;
    }

    private boolean sendPayload(String webhookUrl, Map<String, Object> payload) {
        if (webhookUrl == null || webhookUrl.isBlank() || webhookUrl.contains("/edit") || webhookUrl.contains("/home/projects/")) {
            logger.warn("Skipping Google Sheets dispatch: Invalid or editor webhook URL: {}", webhookUrl);
            return false;
        }

        try {
            String json = objectMapper.writeValueAsString(payload);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(webhookUrl))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .timeout(Duration.ofSeconds(15))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            int code = response.statusCode();
            String body = response.body();
            if (code >= 200 && code < 400 && body != null && !body.contains("\"status\":\"error\"")) {
                logger.info("Successfully dispatched payload to Google Sheets webhook: HTTP {}", code);
                return true;
            } else {
                logger.warn("Google Sheets webhook returned HTTP {}: {}", code, body);
                return false;
            }
        } catch (Exception e) {
            logger.error("Failed to forward payload to Google Sheets webhook {}: {}", webhookUrl, e.getMessage());
            return false;
        }
    }

    private String getSetting(String key, String defaultValue) {
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
}


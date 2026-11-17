package com.college.website.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.*;

@Component
public class WhatsAppCloudApiClient {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppCloudApiClient.class);

    @Value("${app.whatsapp.access-token:${WHATSAPP_ACCESS_TOKEN:}}")
    private String accessToken;

    @Value("${app.whatsapp.phone-number-id:${WHATSAPP_PHONE_NUMBER_ID:}}")
    private String phoneNumberId;

    @Value("${app.whatsapp.business-account-id:${WHATSAPP_BUSINESS_ACCOUNT_ID:}}")
    private String businessAccountId;

    @Value("${app.whatsapp.api-version:${WHATSAPP_API_VERSION:v19.0}}")
    private String apiVersion;

    @Value("${app.whatsapp.app-secret:${WHATSAPP_APP_SECRET:}}")
    private String appSecret;

    @Value("${app.whatsapp.api-url:${WHATSAPP_API_URL:https://graph.facebook.com}}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public boolean isConfigured() {
        return accessToken != null && !accessToken.isBlank()
                && phoneNumberId != null && !phoneNumberId.isBlank();
    }

    public boolean hasAccessToken() {
        return accessToken != null && !accessToken.isBlank();
    }

    public boolean hasAppSecret() {
        return appSecret != null && !appSecret.isBlank();
    }

    public String getPhoneNumberId() {
        return phoneNumberId;
    }

    public String getBusinessAccountId() {
        return businessAccountId;
    }

    public String getApiVersion() {
        return apiVersion;
    }

    /**
     * Send official Meta WhatsApp Cloud API Template Message
     */
    public Map<String, Object> sendTemplateMessage(String toPhone, String templateName, String languageCode, List<String> parameters) {
        if (!isConfigured()) {
            throw new IllegalStateException("WhatsApp Cloud API credentials are not configured on the server.");
        }

        String cleanPhone = cleanPhoneNumber(toPhone);
        String endpoint = String.format("%s/%s/%s/messages", apiUrl, apiVersion, phoneNumberId);

        Map<String, Object> body = new HashMap<>();
        body.put("messaging_product", "whatsapp");
        body.put("recipient_type", "individual");
        body.put("to", cleanPhone);
        body.put("type", "template");

        Map<String, Object> template = new HashMap<>();
        template.put("name", templateName);
        Map<String, String> lang = new HashMap<>();
        lang.put("code", (languageCode != null && !languageCode.isBlank()) ? languageCode : "en");
        template.put("language", lang);

        if (parameters != null && !parameters.isEmpty()) {
            List<Map<String, Object>> components = new ArrayList<>();
            Map<String, Object> bodyComponent = new HashMap<>();
            bodyComponent.put("type", "body");

            List<Map<String, String>> params = new ArrayList<>();
            for (String p : parameters) {
                Map<String, String> param = new HashMap<>();
                param.put("type", "text");
                param.put("text", p != null ? p : "");
                params.add(param);
            }
            bodyComponent.put("parameters", params);
            components.add(bodyComponent);
            template.put("components", components);
        }

        body.put("template", template);

        return executeRequest(endpoint, body);
    }

    /**
     * Send raw text message via Cloud API (e.g., test message or within 24hr customer service window)
     */
    public Map<String, Object> sendTextMessage(String toPhone, String messageText) {
        if (!isConfigured()) {
            throw new IllegalStateException("WhatsApp Cloud API credentials are not configured on the server.");
        }

        String cleanPhone = cleanPhoneNumber(toPhone);
        String endpoint = String.format("%s/%s/%s/messages", apiUrl, apiVersion, phoneNumberId);

        Map<String, Object> body = new HashMap<>();
        body.put("messaging_product", "whatsapp");
        body.put("recipient_type", "individual");
        body.put("to", cleanPhone);
        body.put("type", "text");

        Map<String, Object> textObj = new HashMap<>();
        textObj.put("preview_url", false);
        textObj.put("body", messageText);
        body.put("text", textObj);

        return executeRequest(endpoint, body);
    }

    private Map<String, Object> executeRequest(String endpoint, Map<String, Object> payload) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken.trim());

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(endpoint, HttpMethod.POST, entity, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                Map<String, Object> result = new HashMap<>();
                result.put("success", true);
                if (root.has("messages") && root.get("messages").isArray() && root.get("messages").size() > 0) {
                    result.put("messageId", root.get("messages").get(0).path("id").asText());
                }
                result.put("rawResponse", response.getBody());
                return result;
            } else {
                throw new RuntimeException("Meta API error: " + response.getStatusCode() + " - " + response.getBody());
            }
        } catch (Exception ex) {
            log.error("Failed to send WhatsApp message via Cloud API: {}", ex.getMessage(), ex);
            throw new RuntimeException("Meta WhatsApp API error: " + ex.getMessage(), ex);
        }
    }

    /**
     * Verify HMAC SHA-256 signature for Meta Webhooks
     */
    public boolean verifySignature(String rawPayload, String signatureHeader) {
        if (appSecret == null || appSecret.isBlank()) {
            // If secret is not configured, we log warning and accept
            log.warn("WHATSAPP_APP_SECRET is not configured; skipping HMAC signature check");
            return true;
        }

        if (signatureHeader == null || !signatureHeader.startsWith("sha256=")) {
            return false;
        }

        try {
            String expectedHash = signatureHeader.substring("sha256=".length()).trim();
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(appSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hmacBytes = mac.doFinal(rawPayload.getBytes(StandardCharsets.UTF_8));

            StringBuilder hex = new StringBuilder();
            for (byte b : hmacBytes) {
                hex.append(String.format("%02x", b));
            }

            return MessageDigest.isEqual(hex.toString().getBytes(StandardCharsets.UTF_8), expectedHash.getBytes(StandardCharsets.UTF_8));
        } catch (Exception ex) {
            log.error("Error verifying webhook signature: {}", ex.getMessage());
            return false;
        }
    }

    public static String cleanPhoneNumber(String phone) {
        if (phone == null) return "";
        String cleaned = phone.replaceAll("[^0-9]", "");
        if (cleaned.length() == 10) {
            cleaned = "91" + cleaned; // Default Indian country code if missing
        }
        return cleaned;
    }
}

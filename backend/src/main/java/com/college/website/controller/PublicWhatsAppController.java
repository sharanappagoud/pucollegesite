package com.college.website.controller;

import com.college.website.dto.ApiResponse;
import com.college.website.dto.WhatsAppOptInRequestDto;
import com.college.website.dto.WhatsAppPublicConfigDto;
import com.college.website.entity.WhatsAppOptIn;
import com.college.website.entity.WhatsAppSetting;
import com.college.website.service.WhatsAppService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/whatsapp")
@Tag(name = "Public WhatsApp Endpoints", description = "Public config, opt-in consent, and Meta Webhook handlers")
public class PublicWhatsAppController {

    private static final Logger log = LoggerFactory.getLogger(PublicWhatsAppController.class);

    private final WhatsAppService whatsAppService;

    public PublicWhatsAppController(WhatsAppService whatsAppService) {
        this.whatsAppService = whatsAppService;
    }

    @GetMapping("/config")
    @Operation(summary = "Get public WhatsApp configuration for floating widget and contact buttons")
    public ResponseEntity<ApiResponse<WhatsAppPublicConfigDto>> getPublicConfig() {
        return ResponseEntity.ok(ApiResponse.ok(whatsAppService.getPublicConfig()));
    }

    @PostMapping("/opt-in")
    @Operation(summary = "Record user WhatsApp communication consent / opt-in")
    public ResponseEntity<ApiResponse<WhatsAppOptIn>> recordOptIn(@Valid @RequestBody WhatsAppOptInRequestDto dto) {
        WhatsAppOptIn record = whatsAppService.recordOptIn(dto);
        return ResponseEntity.ok(ApiResponse.ok("Consent preference recorded successfully", record));
    }

    /**
     * Meta WhatsApp Cloud API Webhook Verification (hub challenge)
     */
    @GetMapping("/webhook")
    @Operation(summary = "Meta Cloud API Webhook hub.challenge verification")
    public ResponseEntity<String> verifyWebhook(
            @RequestParam(name = "hub.mode", required = false) String mode,
            @RequestParam(name = "hub.verify_token", required = false) String verifyToken,
            @RequestParam(name = "hub.challenge", required = false) String challenge) {

        log.info("Received WhatsApp webhook verification request: mode={}, token={}", mode, verifyToken);

        WhatsAppSetting settings = whatsAppService.getOrCreateSettings();
        String expectedToken = settings.getWebhookVerifyToken();

        if ("subscribe".equals(mode) && expectedToken != null && expectedToken.equals(verifyToken)) {
            log.info("WhatsApp webhook verified successfully");
            return ResponseEntity.ok(challenge);
        } else {
            log.warn("WhatsApp webhook verification failed: tokens do not match");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Verification token mismatch");
        }
    }

    /**
     * Meta WhatsApp Cloud API Webhook Event Receiver
     */
    @PostMapping("/webhook")
    @Operation(summary = "Receive delivery receipts and status updates from Meta WhatsApp Cloud API")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String rawPayload,
            @RequestHeader(name = "X-Hub-Signature-256", required = false) String signatureHeader) {

        log.info("Received WhatsApp webhook event, signature: {}", signatureHeader);
        try {
            whatsAppService.processWebhook(rawPayload, signatureHeader);
            return ResponseEntity.ok("EVENT_RECEIVED");
        } catch (SecurityException secEx) {
            log.warn("Rejected WhatsApp webhook due to signature mismatch: {}", secEx.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid signature");
        } catch (Exception ex) {
            log.error("Error processing WhatsApp webhook: {}", ex.getMessage(), ex);
            // Return 200 OK so Meta doesn't aggressively retry broken payloads
            return ResponseEntity.ok("ERROR_LOGGED");
        }
    }
}

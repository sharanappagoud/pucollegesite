package com.college.website.controller;

import com.college.website.dto.*;
import com.college.website.service.ChatbotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/chatbot")
@Tag(name = "AI Chatbot APIs", description = "Public endpoints for MPUC Assistant chatbot widget")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping("/message")
    @Operation(summary = "Send question to AI chatbot and receive grounded answer")
    public ResponseEntity<ApiResponse<ChatResponse>> sendMessage(
            @Valid @RequestBody ChatRequest request,
            HttpServletRequest servletRequest) {
        String clientIp = extractClientIp(servletRequest);
        ChatResponse response = chatbotService.processMessage(request, clientIp);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/config")
    @Operation(summary = "Get public chatbot widget settings and suggested questions")
    public ResponseEntity<ApiResponse<ChatbotSettingsDto>> getConfig() {
        return ResponseEntity.ok(ApiResponse.ok(chatbotService.getPublicConfig()));
    }

    @PostMapping("/feedback")
    @Operation(summary = "Record visitor feedback (helpful or not)")
    public ResponseEntity<ApiResponse<Void>> recordFeedback(@Valid @RequestBody FeedbackRequest request) {
        chatbotService.recordFeedback(request.getLogId(), request.getHelpful());
        return ResponseEntity.ok(ApiResponse.ok("Feedback recorded successfully", null));
    }

    private String extractClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.isEmpty() && !"unknown".equalsIgnoreCase(xfHeader)) {
            return xfHeader.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}

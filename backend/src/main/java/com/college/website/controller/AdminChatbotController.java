package com.college.website.controller;

import com.college.website.dto.*;
import com.college.website.entity.ChatbotLog;
import com.college.website.service.ChatbotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/chatbot")
@Tag(name = "Admin AI Chatbot Management", description = "Configure chatbot settings, FAQs, knowledge base, and analytics")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminChatbotController {

    private final ChatbotService chatbotService;

    public AdminChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @GetMapping("/settings")
    @Operation(summary = "Get chatbot configuration & AI provider status")
    public ResponseEntity<ApiResponse<ChatbotSettingsDto>> getSettings() {
        return ResponseEntity.ok(ApiResponse.ok(chatbotService.getPublicConfig()));
    }

    @PostMapping("/settings")
    @Operation(summary = "Update chatbot settings (toggle, bot name, welcome message, suggestions)")
    public ResponseEntity<ApiResponse<Void>> updateSettings(@RequestBody ChatbotSettingsDto dto) {
        chatbotService.updateChatbotSettings(dto);
        return ResponseEntity.ok(ApiResponse.ok("Chatbot configuration updated successfully", null));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get chatbot usage statistics & satisfaction metrics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        return ResponseEntity.ok(ApiResponse.ok(chatbotService.getChatbotStats()));
    }

    @GetMapping("/logs")
    @Operation(summary = "Get paginated chatbot conversation interaction logs")
    public ResponseEntity<ApiResponse<Page<ChatbotLog>>> getLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(chatbotService.getLogs(PageRequest.of(page, size))));
    }

    @GetMapping("/faqs")
    @Operation(summary = "Get all approved chatbot FAQs")
    public ResponseEntity<ApiResponse<List<ChatbotFaqDto>>> getAllFaqs() {
        return ResponseEntity.ok(ApiResponse.ok(chatbotService.getAllFaqs()));
    }

    @PostMapping("/faqs")
    @Operation(summary = "Create new approved FAQ entry")
    public ResponseEntity<ApiResponse<ChatbotFaqDto>> createFaq(@Valid @RequestBody ChatbotFaqDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("FAQ created successfully", chatbotService.createFaq(dto)));
    }

    @PutMapping("/faqs/{id}")
    @Operation(summary = "Update approved FAQ entry")
    public ResponseEntity<ApiResponse<ChatbotFaqDto>> updateFaq(
            @PathVariable Long id,
            @Valid @RequestBody ChatbotFaqDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("FAQ updated successfully", chatbotService.updateFaq(id, dto)));
    }

    @DeleteMapping("/faqs/{id}")
    @Operation(summary = "Delete FAQ entry")
    public ResponseEntity<ApiResponse<Void>> deleteFaq(@PathVariable Long id) {
        chatbotService.deleteFaq(id);
        return ResponseEntity.ok(ApiResponse.ok("FAQ deleted successfully", null));
    }

    @PostMapping("/test")
    @Operation(summary = "Admin Interactive Test Simulator")
    public ResponseEntity<ApiResponse<ChatResponse>> testSimulator(@RequestBody Map<String, String> payload) {
        String testMessage = payload.getOrDefault("message", "What courses are available?");
        ChatRequest req = new ChatRequest(testMessage, "admin-test-session");
        ChatResponse resp = chatbotService.processMessage(req, "127.0.0.1-admin-simulator");
        return ResponseEntity.ok(ApiResponse.ok("Simulation successful", resp));
    }
}

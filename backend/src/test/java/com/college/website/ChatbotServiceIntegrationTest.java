package com.college.website;

import com.college.website.dto.ChatRequest;
import com.college.website.dto.ChatResponse;
import com.college.website.service.ChatbotService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class ChatbotServiceIntegrationTest {

    @Autowired
    private ChatbotService chatbotService;

    @Test
    void testChatbotProcessesCourseQuestion() {
        ChatRequest req = new ChatRequest("What courses are available in Science?", "test-session-123");
        ChatResponse res = chatbotService.processMessage(req, "127.0.0.1");

        Assertions.assertNotNull(res);
        Assertions.assertNotNull(res.getReply());
        Assertions.assertTrue(res.getReply().toLowerCase().contains("pcmb") || res.getReply().toLowerCase().contains("science"));
        Assertions.assertNotNull(res.getSource());
    }

    @Test
    void testChatbotHandlesKannadaGreeting() {
        ChatRequest req = new ChatRequest("ಕಾಲೇಜಿನಲ್ಲಿ ಯಾವ ಕೋರ್ಸ್‌ಗಳು ಲಭ್ಯವಿದೆ?", "test-kannada-session");
        ChatResponse res = chatbotService.processMessage(req, "127.0.0.1");

        Assertions.assertNotNull(res);
        Assertions.assertNotNull(res.getReply());
        Assertions.assertTrue(res.getReply().contains("ವಿಜ್ಞಾನ") || res.getReply().contains("PCMB"));
    }

    @Test
    void testChatbotReturnsPublicConfig() {
        var config = chatbotService.getPublicConfig();
        Assertions.assertNotNull(config);
        Assertions.assertTrue(config.getEnabled());
        Assertions.assertNotNull(config.getName());
        Assertions.assertFalse(config.getSuggestedQuestions().isEmpty());
    }
}

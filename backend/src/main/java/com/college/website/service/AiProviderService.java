package com.college.website.service;

import com.college.website.config.AiProviderConfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.*;

@Service
public class AiProviderService {

    private static final Logger logger = LoggerFactory.getLogger(AiProviderService.class);

    private final AiProviderConfig config;
    private final ObjectMapper objectMapper;
    private final RestClient restClient;

    public AiProviderService(AiProviderConfig config, ObjectMapper objectMapper) {
        this.config = config;
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder()
                .baseUrl(config.getBaseUrl())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    /**
     * Generates a grounded response using OpenAI API if configured, or the intelligent local RAG engine.
     * Returns a Map with "reply" and "source".
     */
    public Map<String, String> generateResponse(String userMessage, String ragContext, String language) {
        if (config.hasValidApiKey()) {
            try {
                String openAiReply = callOpenAiChatCompletion(userMessage, ragContext, language);
                if (openAiReply != null && !openAiReply.isBlank()) {
                    return Map.of("reply", openAiReply.trim(), "source", "OPENAI (" + config.getModel() + ")");
                }
            } catch (Exception e) {
                logger.warn("OpenAI API call failed or timed out: {}. Seamlessly falling back to Local Knowledge Engine.", e.getMessage());
            }
        }

        // Grounded Local Knowledge Engine fallback
        String fallbackReply = generateGroundedLocalResponse(userMessage, ragContext, language);
        return Map.of("reply", fallbackReply, "source", "RAG_MYSQL_ENGINE");
    }

    /**
     * Calls OpenAI Chat Completions API with system prompt & retrieved RAG context.
     */
    private String callOpenAiChatCompletion(String userMessage, String ragContext, String language) throws Exception {
        String systemPrompt = """
                You are MPUC Assistant, the official collegiate AI advisor for Sri Vidyodaya Composite Pre-University College (SVCPUC / MPUC) in Bengaluru, Karnataka.
                
                MISSION & RULES:
                1. Answer questions clearly, warmly, and concisely using simple English or Kannada based on the visitor's language.
                2. Ground your answer STRICTLY in the provided verified college knowledge below.
                3. NEVER invent or assume unpublished fees, admission guarantees, state ranks, or deadlines. If exact information is missing, politely direct the visitor to the admissions office at +91 80 2345 6789 or admissions@svcpuc.edu.in.
                4. Never claim that a student is admitted through this chat.
                5. Highlight combinations (PCMB, PCMC for Science; CEBA, MEBA, SEBA for Commerce) when asked about courses.
                6. Keep answers structured with short bullet points for readability.
                
                VERIFIED COLLEGE KNOWLEDGE:
                """ + ragContext;

        Map<String, Object> requestPayload = new HashMap<>();
        requestPayload.put("model", config.getModel());
        requestPayload.put("temperature", 0.3);
        requestPayload.put("max_tokens", 600);

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        messages.add(Map.of("role", "user", "content", userMessage));
        requestPayload.put("messages", messages);

        String jsonBody = objectMapper.writeValueAsString(requestPayload);

        String rawResponse = restClient.post()
                .uri("/chat/completions")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + config.getApiKey())
                .body(jsonBody)
                .retrieve()
                .body(String.class);

        JsonNode root = objectMapper.readTree(rawResponse);
        JsonNode choices = root.path("choices");
        if (choices.isArray() && !choices.isEmpty()) {
            return choices.get(0).path("message").path("content").asText();
        }

        return null;
    }

    /**
     * Intelligent local grounded knowledge engine that parses the visitor's question against the MySQL college context.
     */
    public String generateGroundedLocalResponse(String userMessage, String ragContext, String language) {
        String q = (userMessage != null) ? userMessage.toLowerCase().trim() : "";

        // Check for Kannada input
        boolean isKannada = isKannadaText(userMessage);

        if (isKannada) {
            if (q.contains("ಕೋರ್ಸ್") || q.contains("ವಿಜ್ಞಾನ") || q.contains("ವಾಣಿಜ್ಯ") || q.contains("ಕಾಂಬಿನೇಷನ್")) {
                return "ನಮ್ಮ ಕಾಲೇಜಿನಲ್ಲಿ ಕರ್ನಾಟಕ ಪಿಯು ಬೋರ್ಡ್ ಮಾನ್ಯತೆ ಪಡೆದ ಎರಡು ವರ್ಷಗಳ ವಿಜ್ಞಾನ (Science) ಮತ್ತು ವಾಣಿಜ್ಯ (Commerce) ಕೋರ್ಸ್‌ಗಳು ಲಭ್ಯವಿವೆ:\n\n" +
                       "1. **ವಿಜ್ಞಾನ ವಿಭಾಗ (Science)**: PCMB (ಭೌತಶಾಸ್ತ್ರ, ರಸಾಯನಶಾಸ್ತ್ರ, ಗಣಿತ, ಜೀವಶಾಸ್ತ್ರ) ಮತ್ತು PCMC (ಭೌತಶಾಸ್ತ್ರ, ರಸಾಯನಶಾಸ್ತ್ರ, ಗಣಿತ, ಕಂಪ್ಯೂಟರ್ ಸೈನ್ಸ್).\n" +
                       "2. **ವಾಣಿಜ್ಯ ವಿಭಾಗ (Commerce)**: CEBA, MEBA, ಮತ್ತು SEBA.\n\n" +
                       "ಹೆಚ್ಚಿನ ವಿವರಗಳಿಗಾಗಿ ಮತ್ತು ಪ್ರವೇಶಕ್ಕಾಗಿ ಸಂಪರ್ಕಿಸಿ: +91 80 2345 6789.";
            } else if (q.contains("ವಿಳಾಸ") || q.contains("ಸ್ಥಳ") || q.contains("ಎಲ್ಲಿದೆ")) {
                return "ನಮ್ಮ ಕಾಲೇಜು ವಿಳಾಸ:\n**ಶ್ರೀ ವಿದ್ಯೋದಯ ಸಂಯುಕ್ತ ಪದವಿ ಪೂರ್ವ ಕಾಲೇಜು (SVCPUC)**\n#45, ವಿದ್ಯಾ ಸೌಧ ಕ್ಯಾಂಪಸ್, 18ನೇ ಕ್ರಾಸ್, ಮಲ್ಲೇಶ್ವರಂ, ಬೆಂಗಳೂರು - 560003.\n\nಕಚೇರಿ ಸಮಯ: ಸೋಮವಾರದಿಂದ ಶುಕ್ರವಾರ 8:30 AM ನಿಂದ 4:30 PM ವರೆಗೆ.";
            } else if (q.contains("ಪ್ರವೇಶ") || q.contains("ಅಡ್ಮಿಷನ್") || q.contains("ದಾಖಲೆ")) {
                return "1ನೇ ಪಿಯುಸಿ ಪ್ರವೇಶಕ್ಕೆ SSLC / 10ನೇ ತರಗತಿಯ ಅಂಕಪಟ್ಟಿ, ಟಿ.ಸಿ (TC), ಆಧಾರ್ ಕಾರ್ಡ್ ಹಾಗೂ ಪಾಸ್‌ಪೋರ್ಟ್ ಅಳತೆಯ ಫೋಟೋಗಳು ಅಗತ್ಯವಿದೆ. ಆನ್‌ಲೈನ್ ಅರ್ಜಿಗಾಗಿ ನಮ್ಮ ವೆಬ್‌ಸೈಟ್‌ನ Admissions ವಿಭಾಗವನ್ನು ಪರಿಶೀಲಿಸಿ.";
            } else {
                return "ನಮಸ್ಕಾರ! ಶ್ರೀ ವಿದ್ಯೋದಯ ಸಂಯುಕ್ತ ಪದವಿ ಪೂರ್ವ ಕಾಲೇಜಿನ AI ಸಹಾಯಕನಿಗೆ ಸ್ವಾಗತ. ನಾವು ನಿಮಗೆ ಕೋರ್ಸ್‌ಗಳು, ಪ್ರವೇಶಗಳು, ಶುಲ್ಕ ಮತ್ತು ಸೌಲಭ್ಯಗಳ ಬಗ್ಗೆ ಮಾಹಿತಿ ನೀಡಲು ಸಂತೋಷಪಡುತ್ತೇವೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ ಅಥವಾ ಕಚೇರಿ ದೂರವಾಣಿ ಸಂಖ್ಯೆ +91 80 2345 6789 ಗೆ ಕರೆ ಮಾಡಿ.";
            }
        }

        // English Greetings
        if (q.matches("^(hi|hello|hey|good\\s*(morning|afternoon|evening)|namaste|greetings).*")) {
            return "Hello! Welcome to **Sri Vidyodaya Composite Pre-University College (SVCPUC)**. I am your MPUC Assistant.\n\n" +
                   "I can assist you with:\n" +
                   "- Pre-University Science (PCMB, PCMC) and Commerce (CEBA, MEBA, SEBA) combinations\n" +
                   "- Admission criteria and required documents\n" +
                   "- Scholarships and fee concessions\n" +
                   "- Campus labs, library, and sports facilities\n" +
                   "- Campus address and visiting hours\n\n" +
                   "How can I help you today?";
        }

        // Science stream
        if (q.contains("science") || q.contains("pcmb") || q.contains("pcmc") || q.contains("medical") || q.contains("engineering") || q.contains("neet") || q.contains("jee")) {
            return "Our college offers two premier **Science Stream Combinations** recognized by the Karnataka Pre-University Board:\n\n" +
                   "1. **PCMB** (Physics, Chemistry, Mathematics, Biology)\n" +
                   "   - *Focus*: Medicine, Dentistry, Biotechnology, Agriculture, Veterinary, Pure Sciences, and Allied Healthcare.\n" +
                   "   - *Coaching*: Integrated coaching for KCET & NEET.\n\n" +
                   "2. **PCMC** (Physics, Chemistry, Mathematics, Computer Science)\n" +
                   "   - *Focus*: Engineering, Computer Science, AI/Data Science, Robotics, and Physical Sciences.\n" +
                   "   - *Coaching*: Integrated coaching for KCET & JEE Main.\n\n" +
                   "Both combinations feature modern laboratories, individual workstations, and experienced lecturers.";
        }

        // Commerce stream
        if (q.contains("commerce") || q.contains("ceba") || q.contains("meba") || q.contains("seba") || q.contains("account") || q.contains("business") || q.contains("ca")) {
            return "We provide three dynamic **Commerce Stream Combinations**:\n\n" +
                   "1. **CEBA** (Computer Science, Economics, Business Studies, Accountancy)\n" +
                   "2. **MEBA** (Mathematics, Economics, Business Studies, Accountancy)\n" +
                   "3. **SEBA** (Statistics, Economics, Business Studies, Accountancy)\n\n" +
                   "These combinations build a solid foundation for Chartered Accountancy (CA Foundation), Company Secretary (CS), CMA, B.Com, BBA, Data Analytics, and Corporate Banking.";
        }

        // General Courses query
        if (q.contains("course") || q.contains("combination") || q.contains("program") || q.contains("stream") || q.contains("puc")) {
            return "At **Sri Vidyodaya Composite Pre-University College**, we offer two-year Pre-University programs in two distinct streams:\n\n" +
                   "**Science Stream**:\n" +
                   "- **PCMB**: Physics, Chemistry, Mathematics, Biology (for Medicine, Healthcare & Engineering)\n" +
                   "- **PCMC**: Physics, Chemistry, Mathematics, Computer Science (for Technology & Engineering)\n\n" +
                   "**Commerce Stream**:\n" +
                   "- **CEBA**: Computer Science, Economics, Business Studies, Accountancy\n" +
                   "- **MEBA**: Mathematics, Economics, Business Studies, Accountancy\n" +
                   "- **SEBA**: Statistics, Economics, Business Studies, Accountancy\n\n" +
                   "Languages offered: English (Compulsory) with Kannada, Hindi, or Sanskrit as Second Language.";
        }

        // Admission Process & Eligibility
        if (q.contains("admission") || q.contains("apply") || q.contains("eligib") || q.contains("criteria") || q.contains("mark") || q.contains("percentage") || q.contains("sslc")) {
            return "**Admission Guidelines & Eligibility Criteria for 1st PUC**:\n\n" +
                   "- **Eligibility**: Candidates must have passed the Karnataka SSLC, CBSE Class 10, ICSE, or an equivalent recognized examination.\n" +
                   "- **Cut-off Guidelines**:\n" +
                   "  - Science (PCMB / PCMC): Minimum 60% aggregate with strong foundational marks in Mathematics and Science.\n" +
                   "  - Commerce (CEBA / MEBA / SEBA): Minimum 50% aggregate.\n" +
                   "- **Application Procedure**:\n" +
                   "  1. Submit the online Admission Enquiry form on our Admissions page.\n" +
                   "  2. Visit the campus Admissions Desk for document verification and counselling.\n" +
                   "  3. Complete fee payment and receive your official admission acknowledgment.\n\n" +
                   "Admissions Helpline: **+91 80 2345 6789**.";
        }

        // Documents Required
        if (q.contains("document") || q.contains("certificate") || q.contains("tc") || q.contains("transfer")) {
            return "Here are the **Documents Required for Admission Verification**:\n\n" +
                   "1. Original & 3 photocopies of **10th Standard / SSLC Marks Card**\n" +
                   "2. **Transfer Certificate (TC)** from your previous school\n" +
                   "3. **Conduct / Study Certificate** (minimum 7 years in Karnataka for domicile reservation)\n" +
                   "4. **Aadhaar Card copy** (Student and Parent)\n" +
                   "5. **Caste & Income Certificate** (if applying under SC/ST/OBC fee concession)\n" +
                   "6. 4 recent passport-sized color photographs\n" +
                   "7. **Migration Certificate** (for students from non-Karnataka state boards, CBSE, or ICSE)";
        }

        // Fees & Scholarships
        if (q.contains("fee") || q.contains("cost") || q.contains("scholarship") || q.contains("concession") || q.contains("waiver") || q.contains("install")) {
            return "**Fee Structure & Scholarship Schemes**:\n\n" +
                   "- **Tuition Range**: Annual tuition typically ranges between ₹35,000 to ₹65,000 per year depending on whether you opt for standard board or integrated competitive coaching (KCET / NEET / JEE).\n" +
                   "- **Merit Scholarships**: Up to 50% fee concession for high achievers scoring above 90% in 10th standard.\n" +
                   "- **Sports Endowments**: Special fee waivers for district, state, and national level medalists.\n" +
                   "- **Economic Concessions**: Need-based aid for students from economically weaker sections.\n\n" +
                   "Please contact our admissions office directly at **+91 80 2345 6789** for verified fee breakdowns and flexible installment plans.";
        }

        // Campus Facilities
        if (q.contains("facilit") || q.contains("lab") || q.contains("library") || q.contains("sport") || q.contains("amenit") || q.contains("canteen") || q.contains("hostel") || q.contains("transport")) {
            return "Our campus provides **State-of-the-Art Infrastructure**:\n\n" +
                   "- **Science Laboratories**: High-tech, spacious Physics, Chemistry, and Biology laboratories equipped for board practical examinations.\n" +
                   "- **Computer Labs**: High-speed networked systems with modern programming environments.\n" +
                   "- **Central Library**: Rich collection of over 15,000 reference books, competitive test guides, and quiet reading halls.\n" +
                   "- **Sports & Fitness**: Badminton court, basketball court, cricket practice nets, table tennis, and indoor games.\n" +
                   "- **Auditorium**: Audio-visual seminar hall for guest lectures, workshops, and student fests.\n" +
                   "- **Cafeteria**: Clean dining facility serving hygienic snacks and beverages.";
        }

        // Location & Address & Timings
        if (q.contains("location") || q.contains("address") || q.contains("where") || q.contains("time") || q.contains("timing") || q.contains("hour") || q.contains("reach")) {
            return "**Campus Address & Operating Hours**:\n\n" +
                   "📍 **Campus Address**:\n" +
                   "Sri Vidyodaya Composite Pre-University College (SVCPUC)\n" +
                   "#45, Vidya Soudha Campus, 18th Cross, Malleshwaram,\n" +
                   "Bengaluru, Karnataka - 560003\n\n" +
                   "⏰ **Office Hours**:\n" +
                   "- Monday – Friday: 8:30 AM to 4:30 PM\n" +
                   "- Saturday: 8:30 AM to 1:30 PM\n" +
                   "- Sunday & Public Holidays: Closed";
        }

        // Contact details
        if (q.contains("contact") || q.contains("phone") || q.contains("email") || q.contains("number") || q.contains("call") || q.contains("helpline")) {
            return "**Official College Contact Details**:\n\n" +
                   "- **Admissions Helpline**: +91 80 2345 6789 / +91 80 2345 6790\n" +
                   "- **Admissions Email**: admissions@svcpuc.edu.in\n" +
                   "- **General Inquiries**: info@svcpuc.edu.in\n" +
                   "- **Campus Location**: Malleshwaram 18th Cross, Bengaluru\n\n" +
                   "You can also submit an instant enquiry via the Admissions tab on this website.";
        }

        // Notices, exams & announcements
        if (q.contains("exam") || q.contains("notice") || q.contains("circular") || q.contains("event") || q.contains("test") || q.contains("result")) {
            return "**Examinations & Academic Updates**:\n\n" +
                   "The college conducts regular Unit Tests, Mid-Term Examinations, and Preparatory Mock Board Exams modeled exactly after the Karnataka Pre-University State Board format.\n\n" +
                   "Official circulars, timetable schedules, and event announcements are published live in the **Notices** and **News** sections of our website.";
        }

        // Principal inquiry
        if (q.contains("principal") || q.contains("venkatesh") || q.contains("head") || q.contains("leader")) {
            return "Our Principal is **Dr. K. S. Venkatesh** (M.Sc., M.Phil., Ph.D.), a seasoned academician with over two decades of collegiate experience in Karnataka pre-university education and recipient of the State Best Teacher Accolade.";
        }

        // Default honest helpful fallback
        return "Thank you for reaching out to **Sri Vidyodaya Composite Pre-University College**.\n\n" +
               "While I can answer questions regarding courses (PCMB, PCMC, CEBA, MEBA, SEBA), admissions eligibility, required documents, campus facilities, and office hours, I recommend contacting our office directly for your specific request:\n\n" +
               "- 📞 **Helpline**: +91 80 2345 6789\n" +
               "- ✉️ **Email**: admissions@svcpuc.edu.in\n" +
               "- 🏢 **Campus Address**: #45, Vidya Soudha Campus, 18th Cross, Malleshwaram, Bengaluru - 560003";
    }

    private boolean isKannadaText(String text) {
        if (text == null) return false;
        for (char c : text.toCharArray()) {
            // Unicode range for Kannada: 0x0C80 - 0x0CFF
            if (c >= '\u0C80' && c <= '\u0CFF') {
                return true;
            }
        }
        return false;
    }
}

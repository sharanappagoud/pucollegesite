-- V4__chatbot_module.sql: AI Chatbot Schema & Seed Knowledge Base

-- 1. Chatbot Approved FAQ Knowledge Base
CREATE TABLE IF NOT EXISTS chatbot_faqs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'GENERAL',
    keywords VARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Chatbot Interaction Logs for Audit & Feedback
CREATE TABLE IF NOT EXISTS chatbot_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100),
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    language VARCHAR(20) DEFAULT 'en',
    source VARCHAR(50) DEFAULT 'RAG_MYSQL',
    helpful BOOLEAN,
    user_ip VARCHAR(50),
    response_time_ms INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Seed Default Verified FAQ Knowledge Base
INSERT INTO chatbot_faqs (question, answer, category, keywords, display_order, is_active) VALUES
(
    'What courses does the college offer?',
    'Our college offers comprehensive 2-year Pre-University courses recognized by the Karnataka PU Board in two streams:\n\n1. **Science Stream**: PCMB (Physics, Chemistry, Mathematics, Biology) and PCMC (Physics, Chemistry, Mathematics, Computer Science).\n2. **Commerce Stream**: CEBA (Commerce, Economics, Business Studies, Accountancy), MEBA (Mathematics, Economics, Business Studies, Accountancy), and SEBA (Statistics, Economics, Business Studies, Accountancy).\n\nBoth streams feature integrated preparatory coaching for KCET, NEET, and JEE.',
    'COURSES',
    'courses,streams,combinations,puc,science,commerce,pcmb,pcmc,ceba,offerings,programs',
    1,
    TRUE
),
(
    'What are the admission requirements and eligibility criteria?',
    'Candidates applying for 1st PUC must have successfully passed the Karnataka SSLC Board Examination, CBSE Class 10, ICSE, or any recognized equivalent secondary school examination.\n\n- **Science Stream (PCMB/PCMC)**: Minimum 60% aggregate in 10th standard with strong performance in Mathematics and Science.\n- **Commerce Stream (CEBA/MEBA/SEBA)**: Minimum 50% aggregate in 10th standard.\n\nYou can fill out an online admission enquiry on our Admissions page or visit the admissions desk in person.',
    'ADMISSIONS',
    'admission,requirements,eligibility,criteria,marks,percentage,sslc,10th,cbse,icse,apply',
    2,
    TRUE
),
(
    'Which Science combinations are available?',
    'We offer two premier Science combinations:\n1. **PCMB** (Physics, Chemistry, Mathematics, Biology) – Tailored for medical, dental, veterinary, agriculture, biotechnology, and pure science careers.\n2. **PCMC** (Physics, Chemistry, Mathematics, Computer Science) – Optimized for engineering, computing, artificial intelligence, robotics, and physical sciences.\n\nBoth combinations include integrated coaching for KCET, NEET, and JEE.',
    'COURSES',
    'science,combinations,pcmb,pcmc,biology,computer science,engineering,medical,neet,kcet,jee',
    3,
    TRUE
),
(
    'Which Commerce combinations are available?',
    'We offer three modern Commerce combinations:\n1. **CEBA** (Computer Science, Economics, Business Studies, Accountancy)\n2. **MEBA** (Mathematics, Economics, Business Studies, Accountancy)\n3. **SEBA** (Statistics, Economics, Business Studies, Accountancy)\n\nThese combinations prepare students for CA Foundation, CS, CMA, B.Com, BBA, Data Analytics, and Corporate Finance.',
    'COURSES',
    'commerce,combinations,ceba,meba,seba,accountancy,business studies,economics,ca,cma,finance',
    4,
    TRUE
),
(
    'What documents are required for admission?',
    'The following documents are required at the time of admission verification:\n1. Original & copies of 10th Standard / SSLC Marks Card.\n2. Transfer Certificate (TC) issued by the previous school.\n3. Conduct / Study Certificate (spanning at least 7 years for Karnataka domicile quota).\n4. Aadhaar Card copy of the student and parent.\n5. Category / Caste / Income Certificate (if claiming reservation concessions).\n6. Four recent passport-sized color photographs.\n7. Migration Certificate (for students from non-Karnataka state boards or ICSE/CBSE).',
    'ADMISSIONS',
    'documents,required,certificates,tc,transfer certificate,marks card,sslc,aadhaar,photos,caste,income',
    5,
    TRUE
),
(
    'What is the college fee structure and scholarship details?',
    'The annual fee structure depends on the selected stream (Science / Commerce) and integrated coaching modules. Typical tuition ranges from ₹35,000 to ₹65,000 per annum.\n\nWe provide generous **Merit and Need-Based Scholarships**:\n- **Merit Concession**: 25% to 50% fee concession for students scoring >90% in 10th standard.\n- **Sports Endowment**: Fee waivers for state/national level athletes.\n- **Economic Weaker Section (EWS)**: Need-based financial grants.\n\nPlease contact our admissions office at +91 80 2345 6789 or visit the campus for exact fee quotes and installment options.',
    'FEES',
    'fee,fees,structure,tuition,cost,scholarships,concession,waiver,merit,installments,payment',
    6,
    TRUE
),
(
    'What campus facilities are available?',
    'Our campus features state-of-the-art educational infrastructure:\n- **Science Labs**: Advanced, fully equipped Physics, Chemistry, and Biology laboratories compliant with state board practical norms.\n- **Digital Computer Labs**: High-speed internet connected labs with latest software.\n- **Central Library**: Over 15,000 books, periodicals, competitive exam guides (NEET/JEE/CET), and digital e-resources.\n- **Sports & Recreation**: Dedicated sports complex with badminton, basketball, cricket nets, table tennis, and chess.\n- **Seminar Halls**: Audio-visual enabled auditoriums for academic seminars and cultural activities.\n- **Cafeteria**: Hygienic and nutritious dining facilities.',
    'FACILITIES',
    'facilities,campus,labs,laboratories,library,sports,computer lab,cafeteria,auditorium,amenities',
    7,
    TRUE
),
(
    'Where is the college located and what are the campus hours?',
    'Sri Vidyodaya Composite Pre-University College is situated at:\n**#45, Vidya Soudha Campus, 18th Cross, Malleshwaram, Bengaluru, Karnataka - 560003**\n\n**Office & Campus Hours**:\n- Monday to Friday: 8:30 AM – 4:30 PM\n- Saturday: 8:30 AM – 1:30 PM\n- Sunday & Government Holidays: Closed',
    'CONTACT',
    'location,address,where,timings,hours,office hours,malleshwaram,bengaluru,directions,campus',
    8,
    TRUE
),
(
    'How can I contact the college admissions office?',
    'You can reach our administrative and admissions team through:\n- **Helpline Phone**: +91 80 2345 6789 / +91 80 2345 6790\n- **Admissions Email**: admissions@svcpuc.edu.in\n- **General Email**: info@svcpuc.edu.in\n- **Online Enquiry**: Submit your details directly on the Admissions page.\n- **Campus Visit**: Visit the Administrative Block, 1st Floor during official office hours.',
    'CONTACT',
    'contact,phone,email,helpline,reach,call,enquiry,admission office,principal',
    9,
    TRUE
),
(
    'ಕಾಲೇಜಿನಲ್ಲಿ ಯಾವ ಕೋರ್ಸ್‌ಗಳು ಲಭ್ಯವಿದೆ?',
    'ನಮ್ಮ ಕಾಲೇಜಿನಲ್ಲಿ ಕರ್ನಾಟಕ ಪಿಯು ಬೋರ್ಡ್ ಮಾನ್ಯತೆ ಪಡೆದ ಎರಡು ವರ್ಷಗಳ ವಿಜ್ಞಾನ (Science) ಮತ್ತು ವಾಣಿಜ್ಯ (Commerce) ಕೋರ್ಸ್‌ಗಳು ಲಭ್ಯವಿವೆ:\n\n1. **ವಿಜ್ಞಾನ ವಿಭಾಗ (Science)**: PCMB (ಭೌತಶಾಸ್ತ್ರ, ರಸಾಯನಶಾಸ್ತ್ರ, ಗಣಿತ, ಜೀವಶಾಸ್ತ್ರ) ಮತ್ತು PCMC (ಭೌತಶಾಸ್ತ್ರ, ರಸಾಯನಶಾಸ್ತ್ರ, ಗಣಿತ, ಗಣಕ ವಿಜ್ಞಾನ).\n2. **ವಾಣಿಜ್ಯ ವಿಭಾಗ (Commerce)**: CEBA, MEBA, ಮತ್ತು SEBA.\n\nಹೆಚ್ಚಿನ ವಿವರಗಳಿಗಾಗಿ ನಮ್ಮ ಕಾಲೇಜಿನ ವೆಬ್‌ಸೈಟ್ ಅಥವಾ ಪ್ರವೇಶ ಕಚೇರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ: +91 80 2345 6789.',
    'COURSES',
    'ಕೋರ್ಸ್,ವಿಜ್ಞಾನ,ವಾಣಿಜ್ಯ,ಪಿಯುಸಿ,ಅಡ್ಮಿಷನ್,ಮಾಹಿತಿ,kannada',
    10,
    TRUE
);

-- 4. Seed Default Chatbot Configuration in college_settings
INSERT IGNORE INTO college_settings (setting_key, setting_value, category, description) VALUES
('chatbot_enabled', 'true', 'CHATBOT', 'Enable or disable public AI Chatbot widget'),
('chatbot_name', 'MPUC Assistant', 'CHATBOT', 'Name of the public AI chatbot assistant'),
('chatbot_welcome_message', 'Hello! Welcome to Sri Vidyodaya Composite Pre-University College (SVCPUC). How can I assist you today with courses, admissions, fees, or campus facilities?', 'CHATBOT', 'Default greeting message shown when chatbot window opens'),
('chatbot_suggested_questions', 'What courses does the college offer?,Which Science combinations are available?,Which Commerce combinations are available?,What are the admission requirements?,What documents are required for admission?,What is the college fee structure?,What facilities are available?,Where is the college located?,How can I contact the admissions office?', 'CHATBOT', 'Comma-separated clickable quick questions in chatbot window');

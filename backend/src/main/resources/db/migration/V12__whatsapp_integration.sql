-- V12__whatsapp_integration.sql
-- WhatsApp Business Platform & Click-to-Chat Integration for MPUC College

-- 1. WhatsApp Settings
CREATE TABLE whatsapp_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    phone_number VARCHAR(30) NOT NULL DEFAULT '918023456789',
    display_phone_number VARCHAR(50) DEFAULT '+91 80234 56789',
    floating_enabled BOOLEAN DEFAULT TRUE,
    welcome_message VARCHAR(255) DEFAULT 'Chat with MPUC College',
    welcome_subtitle VARCHAR(255) DEFAULT 'Typically replies within a few minutes',
    prefilled_default_message TEXT,
    business_account_id VARCHAR(100),
    phone_number_id VARCHAR(100),
    api_version VARCHAR(20) DEFAULT 'v19.0',
    webhook_verify_token VARCHAR(100) DEFAULT 'mpuc_whatsapp_verify_token_2026',
    auto_notifications_enabled BOOLEAN DEFAULT FALSE,
    notify_on_enquiry BOOLEAN DEFAULT TRUE,
    notify_on_status_change BOOLEAN DEFAULT TRUE,
    notify_on_counselling BOOLEAN DEFAULT TRUE,
    notify_on_exam BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed default settings row
INSERT INTO whatsapp_settings (
    id, phone_number, display_phone_number, floating_enabled,
    welcome_message, welcome_subtitle, prefilled_default_message,
    api_version, webhook_verify_token, auto_notifications_enabled
) VALUES (
    1, '918023456789', '+91 80234 56789', TRUE,
    'Chat with MPUC College', 'Typically replies within a few minutes',
    'Hello MPUC College, I would like to enquire about PU admissions and courses for the academic year 2026-27.',
    'v19.0', 'mpuc_whatsapp_verify_token_2026', FALSE
);

-- 2. WhatsApp Message Templates
CREATE TABLE whatsapp_message_templates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    template_name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL DEFAULT 'UTILITY',
    language VARCHAR(20) DEFAULT 'en',
    meta_template_id VARCHAR(100),
    status VARCHAR(30) DEFAULT 'APPROVED',
    header_text VARCHAR(255),
    body_text TEXT NOT NULL,
    footer_text VARCHAR(255),
    buttons_json TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed initial message templates
INSERT INTO whatsapp_message_templates (template_name, category, language, status, header_text, body_text, footer_text, is_active)
VALUES
(
    'admission_enquiry_ack',
    'UTILITY',
    'en',
    'APPROVED',
    'MPUC College Admissions',
    'Hello {{1}}, thank you for contacting Master PU College. Your enquiry [Ref: {{2}}] for {{3}} stream has been received. Our admissions desk will reach out to you shortly.',
    'Master PU College (MPUC) • Bengaluru',
    TRUE
),
(
    'admission_status_update',
    'UTILITY',
    'en',
    'APPROVED',
    'Application Status Alert',
    'Dear {{1}}, your admission application (ID: {{2}}) status has been updated to: {{3}}. Please visit our admissions portal for the official update letter.',
    'Master PU College (MPUC)',
    TRUE
),
(
    'counselling_scheduled',
    'UTILITY',
    'en',
    'APPROVED',
    'Counselling Appointment',
    'Dear {{1}}, your academic counselling session at MPUC College is scheduled for {{2}} at {{3}} on campus. Please carry your 10th standard marks card.',
    'Master PU College (MPUC)',
    TRUE
),
(
    'exam_announcement',
    'UTILITY',
    'en',
    'APPROVED',
    'Examination Cell Notice',
    'Important Notice: The notification and schedule for {{1}} has been published on the MPUC College Examinations portal. Check details online or at the admin desk.',
    'MPUC Examination Cell',
    TRUE
),
(
    'science_enquiry_prefill',
    'GENERAL_ENQUIRY',
    'en',
    'APPROVED',
    'Science Course Enquiry',
    'Hello MPUC College, I am interested in Science combinations (PCMB/PCMC). Could you share details regarding eligibility, curriculum, and lab facilities?',
    'Click-to-chat prefill',
    TRUE
),
(
    'commerce_enquiry_prefill',
    'GENERAL_ENQUIRY',
    'en',
    'APPROVED',
    'Commerce Course Enquiry',
    'Hello MPUC College, I am interested in Commerce combinations (CEBA/SEBA). Could you share details regarding subjects, coaching, and career opportunities?',
    'Click-to-chat prefill',
    TRUE
),
(
    'exam_enquiry_prefill',
    'GENERAL_ENQUIRY',
    'en',
    'APPROVED',
    'Examinations Enquiry',
    'Hello MPUC College, I would like to enquire about upcoming PU Board examinations, time tables, and model question papers.',
    'Click-to-chat prefill',
    TRUE
),
(
    'general_enquiry_prefill',
    'GENERAL_ENQUIRY',
    'en',
    'APPROVED',
    'General College Enquiry',
    'Hello MPUC College, I would like to get more information about the college campus, facilities, and admissions for the upcoming session.',
    'Click-to-chat prefill',
    TRUE
);

-- 3. WhatsApp Notification Logs
CREATE TABLE whatsapp_notification_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipient_phone VARCHAR(30) NOT NULL,
    recipient_name VARCHAR(150),
    template_name VARCHAR(100),
    message_body TEXT,
    meta_message_id VARCHAR(150),
    delivery_status VARCHAR(50) DEFAULT 'SENT',
    error_details TEXT,
    reference_type VARCHAR(50),
    reference_id VARCHAR(100),
    channel VARCHAR(30) DEFAULT 'CLOUD_API',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_wa_recipient (recipient_phone),
    INDEX idx_wa_status (delivery_status),
    INDEX idx_wa_created_at (created_at)
);

-- 4. WhatsApp Opt-In / Consent Records
CREATE TABLE whatsapp_opt_in_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    phone_number VARCHAR(30) NOT NULL UNIQUE,
    student_name VARCHAR(150),
    opt_in_source VARCHAR(100) DEFAULT 'ADMISSION_ENQUIRY',
    is_opted_in BOOLEAN DEFAULT TRUE,
    opt_in_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    opt_out_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_wa_opt_phone (phone_number),
    INDEX idx_wa_opted_in (is_opted_in)
);

-- 5. WhatsApp Webhook Events
CREATE TABLE whatsapp_webhook_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id VARCHAR(150),
    event_type VARCHAR(50),
    payload_json LONGTEXT,
    signature VARCHAR(255),
    processed BOOLEAN DEFAULT FALSE,
    processing_error TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_wa_webhook_event_id (event_id),
    INDEX idx_wa_webhook_processed (processed)
);

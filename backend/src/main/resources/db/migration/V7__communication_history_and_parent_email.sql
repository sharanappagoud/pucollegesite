-- V7: Communication logs and parent email for admission enquiries
ALTER TABLE admission_enquiries
    ADD COLUMN parent_email VARCHAR(150) NULL AFTER parent_phone;

CREATE TABLE communication_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reference_no VARCHAR(50) NULL,
    recipient_type VARCHAR(50) NOT NULL, -- 'STAFF', 'STUDENT', 'PARENT'
    recipient_name VARCHAR(150) NULL,
    recipient_target VARCHAR(150) NOT NULL, -- Email address or mobile number
    channel VARCHAR(20) NOT NULL DEFAULT 'EMAIL', -- 'EMAIL', 'SMS'
    subject VARCHAR(255) NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'SENT', -- 'SENT', 'FAILED', 'QUEUED'
    trigger_event VARCHAR(100) NOT NULL, -- 'ENQUIRY_CONFIRMATION', 'STATUS_UPDATE', 'ADMIN_ALERT', 'MANUAL_DISPATCH'
    error_message TEXT NULL,
    sent_by VARCHAR(100) DEFAULT 'SYSTEM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_comm_ref (reference_no),
    INDEX idx_comm_type (recipient_type),
    INDEX idx_comm_created (created_at)
);

-- Seed demo initial logs for existing enquiries
INSERT INTO communication_logs (reference_no, recipient_type, recipient_name, recipient_target, channel, subject, message, status, trigger_event, sent_by, created_at)
VALUES
('ADM-2026-1001', 'STAFF', 'Admissions Office', 'sharanappagoudapolicepatil60@gmail.com', 'EMAIL', 'New Admission Enquiry: Rohan Sharma (PCMB)', 'Alert: Student Rohan Sharma submitted enquiry for Science (PCMB).', 'SENT', 'ADMIN_ALERT', 'SYSTEM', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('ADM-2026-1001', 'STUDENT', 'Rohan Sharma', 'rohan.sharma@gmail.com', 'EMAIL', 'Admission Enquiry Received - Ref: ADM-2026-1001', 'Your information is recorded successfully. Status: NEW.', 'SENT', 'ENQUIRY_CONFIRMATION', 'SYSTEM', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('ADM-2026-1001', 'PARENT', 'Suresh Sharma', '+91 98451 33444', 'SMS', 'SVCPUC Admission Acknowledgement', 'Dear Suresh Sharma, admission enquiry for Rohan Sharma is received. Ref: ADM-2026-1001.', 'SENT', 'ENQUIRY_CONFIRMATION', 'SYSTEM', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('ADM-2026-1004', 'STUDENT', 'Sneha M.', 'sneha.m@gmail.com', 'EMAIL', 'Admission Status Update: ADMITTED (Ref: ADM-2026-1004)', 'Status updated to ADMITTED. Fee paid, admission confirmed, ID generated: PU26C104.', 'SENT', 'STATUS_UPDATE', 'admin', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('ADM-2026-1004', 'PARENT', 'Manjunath B.', '+91 98454 66777', 'SMS', 'Admission Confirmed - SVCPUC', 'Dear Manjunath B., admission for Sneha M. is confirmed (ADMITTED). PU26C104.', 'SENT', 'STATUS_UPDATE', 'admin', DATE_SUB(NOW(), INTERVAL 1 DAY));


-- V3__admin_cms_modules.sql: Schema & Baseline Data for Extended Admin CMS Modules

-- 1. Student Achievements & Results Table
CREATE TABLE IF NOT EXISTS student_achievements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(150) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    exam_type VARCHAR(50) NOT NULL,
    rank_or_score VARCHAR(100) NOT NULL,
    stream VARCHAR(50) NOT NULL,
    combination VARCHAR(50),
    achievement_title VARCHAR(255) NOT NULL,
    description TEXT,
    photo_url VARCHAR(500),
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Examinations Management Table
CREATE TABLE IF NOT EXISTS examinations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    exam_name VARCHAR(200) NOT NULL,
    exam_type VARCHAR(50) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    stream VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    time_table_url VARCHAR(500),
    instructions TEXT,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Scholarships & Fee Concessions Table
CREATE TABLE IF NOT EXISTS scholarships (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    eligibility_criteria TEXT NOT NULL,
    benefit_amount VARCHAR(100) NOT NULL,
    deadline DATE,
    application_link VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Academic Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    hod_name VARCHAR(150),
    hod_email VARCHAR(150),
    hod_phone VARCHAR(20),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Email & Notification Templates Table
CREATE TABLE IF NOT EXISTS notification_templates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    template_key VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body_template TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'EMAIL',
    active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Insert Roles (SUPER_ADMIN, CONTENT_EDITOR, ADMISSION_STAFF)
INSERT INTO roles (name, description) VALUES
('ROLE_SUPER_ADMIN', 'Full Unrestricted Administrative Privileges across all modules'),
('ROLE_CONTENT_EDITOR', 'Content, Media, and Academic Publishing Editor'),
('ROLE_ADMISSION_STAFF', 'Admissions, Enquiries, Applications and Student Records Manager')
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- Map admin to ROLE_SUPER_ADMIN
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.username = 'admin' AND r.name = 'ROLE_SUPER_ADMIN'
ON DUPLICATE KEY UPDATE user_id=user_id;

-- 7. Seed Pages Content (slug-based pages)
INSERT INTO pages (slug, title, subtitle, content, meta_description, published) VALUES
('about-us', 'About Masters PU College', 'Excellence in Collegiate Education Since 1998', 'Masters Pre-University College (MPUC) was established with a clear mandate to provide high quality, disciplined, and accessible pre-university education in Bengaluru. Our integrated academic pedagogy bridges the gap between state board syllabi and national level competitive exams like KCET, NEET, and JEE.', 'Learn about Masters Pre-University College Bengaluru, our academic history, values, and campus culture.', TRUE),
('vision-mission', 'Vision & Mission', 'Our Philosophical North Star', 'VISION:\nTo empower youth through value-based secondary education that stimulates scientific curiosity, analytical thinking, and ethical character.\n\nMISSION:\n1. Maintain academic rigor in Science and Commerce streams.\n2. Provide integrated coaching for competitive examinations without overburdening students.\n3. Cultivate inclusive campus facilities that foster cultural, athletic, and leadership excellence.', 'Vision, mission and institutional objectives of Masters Pre-University College.', TRUE),
('principals-message', 'Principal''s Message', 'A Note from Dr. K. S. Venkatesh', 'Pre-University education is the critical watershed of higher secondary learning in India. The decisions made during these crucial two years define future trajectories in medicine, engineering, pure research, chartered accountancy, corporate finance, and administration.\n\nAt MPUC, we have engineered an academic framework that balances state board requirements with rigorous competitive problem solving. Our faculty members are empathetic mentors who monitor every student''s learning pace.', 'Read the official message from the Principal of Masters Pre-University College.', TRUE),
('admission-guidelines', 'Admissions Guidelines & Eligibility', 'Academic Year 2026-27', 'ADMISSION PROCEDURE:\n1. Eligibility: Candidates must have passed 10th Standard / SSLC / CBSE / ICSE or equivalent with minimum aggregate criteria.\n2. Science Stream Eligibility: Minimum 60% in Science and Mathematics.\n3. Commerce Stream Eligibility: Minimum 50% in aggregate.\n4. Required Documents: Original 10th Marks Card, Transfer Certificate (TC), Conduct Certificate, 4 passport photos, and Aadhar copy.', 'Complete eligibility guidelines, fee structure, and document checklist for 1st PUC admissions.', TRUE)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 8. Seed Student Achievements
INSERT INTO student_achievements (student_name, academic_year, exam_type, rank_or_score, stream, combination, achievement_title, description, photo_url, published) VALUES
('Rohith S. Rao', '2025-26', 'KCET', 'State Rank 9 (Engineering)', 'SCIENCE', 'PCMC', 'Top 10 State Rank in KCET Engineering', 'Master Rohith scored 592/600 in the Board examinations and achieved 9th State Rank in Karnataka CET 2026.', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80', TRUE),
('Ananya Kulkarni', '2025-26', 'PU_BOARD', 'State Rank 6 (594/600)', 'COMMERCE', 'CEBA', 'State 6th Rank in Commerce Stream', 'Kum. Ananya secured 100/100 in Accountancy, Computer Science, and Business Studies in the State Board examinations.', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', TRUE),
('Darshan Gowda', '2024-25', 'NEET', '682 / 720 Marks (AIR 412)', 'SCIENCE', 'PCMB', 'Secured MBBS Seat at Bangalore Medical College (BMC)', 'Darshan balanced Karnataka Board preparation with our integrated NEET test series to achieve a dream seat at BMC.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', TRUE),
('Meghana Murthy', '2024-25', 'SPORTS', 'Gold Medalist - State Athletic Meet', 'COMMERCE', 'SEBA', '400m Track Gold Medalist at Pre-University Athletic Meet', 'Represented the Bengaluru North district and set a state PU record in the 400m sprint.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', TRUE);

-- 9. Seed Examinations
INSERT INTO examinations (exam_name, exam_type, academic_year, stream, start_date, end_date, time_table_url, instructions, published) VALUES
('First Unit Test Assessment 2026', 'UNIT_TEST', '2026-27', 'ALL', '2026-08-01', '2026-08-08', '/uploads/timetable-unit1-2026.pdf', 'Syllabus covers Chapters 1 & 2 across all core subjects. Maximum marks: 25 per subject. Attendance is compulsory.', TRUE),
('Mid-Term Examinations 2026', 'MID_TERM', '2026-27', 'ALL', '2026-10-05', '2026-10-16', '/uploads/timetable-midterm-2026.pdf', 'Covers 50% state board syllabus. Maximum marks: 80 Theory + 20 Practical / Internal. Hall tickets issued at admin counter.', TRUE),
('Preparatory Mock Board Exams 2027', 'PREPARATORY', '2026-27', 'ALL', '2027-01-18', '2027-01-30', '/uploads/timetable-preparatory-2027.pdf', 'Exact Karnataka Pre-University Board pattern mock examination for 2nd PUC students.', TRUE),
('Annual Karnataka State PUC Board Exams', 'ANNUAL_BOARD', '2026-27', 'ALL', '2027-03-01', '2027-03-22', '/uploads/timetable-stateboard-2027.pdf', 'Official State Board examinations conducted by Karnataka School Examination and Assessment Board (KSEAB).', TRUE);

-- 10. Seed Scholarships
INSERT INTO scholarships (title, category, eligibility_criteria, benefit_amount, deadline, application_link, active) VALUES
('Sri Vidyodaya Merit Excellence Scholarship', 'MERIT', 'Students scoring >= 95% aggregate in 10th Standard / SSLC / CBSE / ICSE examinations.', '100% Tuition Fee Waiver', '2026-07-31', '/admissions#enquiry-form', TRUE),
('Dr. APJ Abdul Kalam Science Aspirant Grant', 'MERIT', 'Students scoring >= 90% in Mathematics and Science opting for PCMB or PCMC stream.', '50% Tuition Fee Waiver', '2026-07-31', '/admissions#enquiry-form', TRUE),
('Vidya Vardhaka Economic Need Concession', 'NEED_BASED', 'Students from low income families with annual household income < INR 2.5 Lakhs.', 'Up to 75% Fee Subsidy', '2026-08-15', '/contact', TRUE),
('Pratibha Sports & Athletics Felicitation', 'SPORTS', 'District, State, or National level medal winners in athletics, badminton, or cricket.', 'Full Sports Kit & 50% Concession', '2026-08-30', '/contact', TRUE);

-- 11. Seed Departments
INSERT INTO departments (name, code, description, hod_name, hod_email, hod_phone, active) VALUES
('Department of Physics', 'DEPT_PHY', 'Oversees Physics curricula, state-of-the-art laboratory practicals, and KCET/NEET problem-solving sessions.', 'Prof. H. S. Narayana', 'narayana.phy@svcpuc.edu.in', '+91 98450 11201', TRUE),
('Department of Chemistry', 'DEPT_CHE', 'Equipped with digital analytical balances, fume hoods, and organic/inorganic chemistry experimentation stations.', 'Dr. Malathi Sundaram', 'malathi.che@svcpuc.edu.in', '+91 98450 11202', TRUE),
('Department of Mathematics', 'DEPT_MAT', 'Fosters conceptual clarity in calculus, coordinate geometry, probability, and advanced problem heuristics.', 'Prof. Ramesh G. Kulkarni', 'ramesh.mat@svcpuc.edu.in', '+91 98450 11203', TRUE),
('Department of Biology', 'DEPT_BIO', 'Covers Botany and Zoology with microscopic tissue analysis, herbarium studies, and intensive NEET medical coaching.', 'Dr. S. Radhika', 'radhika.bio@svcpuc.edu.in', '+91 98450 11204', TRUE),
('Department of Computer Science', 'DEPT_CS', 'Modern high-speed air-conditioned laboratory running Python, SQL, C++, and AI introductory workshops.', 'Prof. Vikram Hegde', 'vikram.cs@svcpuc.edu.in', '+91 98450 11205', TRUE),
('Department of Commerce & Accountancy', 'DEPT_COM', 'Specializes in financial accounting, corporate taxation, CA foundation preparation, and business case studies.', 'Prof. Sunita Rao', 'sunita.com@svcpuc.edu.in', '+91 98450 11206', TRUE),
('Department of Economics & Statistics', 'DEPT_ECO', 'Mentors students in macro-economics, quantitative forecasting, business statistics, and financial modeling.', 'Prof. C. M. Murthy', 'murthy.eco@svcpuc.edu.in', '+91 98450 11207', TRUE),
('Department of Languages', 'DEPT_LANG', 'Instruction in English, Kannada, Hindi, and Sanskrit promoting linguistic fluency and literary appreciation.', 'Dr. Vijayalakshmi B.', 'vijaya.lang@svcpuc.edu.in', '+91 98450 11208', TRUE);

-- 12. Seed Notification Templates
INSERT INTO notification_templates (template_key, name, subject, body_template, type, active) VALUES
('ENQUIRY_RECEIVED', 'Admission Enquiry Acknowledgment', 'Admission Enquiry Received - Reference No: {{reference_no}}', 'Dear {{student_name}},\n\nThank you for choosing Masters Pre-University College. We have received your admission enquiry for {{preferred_stream}} ({{preferred_combination}}) for Academic Year {{academic_year}}.\n\nYour Reference Number: {{reference_no}}\n\nOur admissions counsellor will contact you shortly to schedule your campus visit and document verification.\n\nWarm Regards,\nAdmissions Office, MPUC', 'EMAIL', TRUE),
('COUNSELLING_INVITE', 'Counselling Slot Confirmation', 'MPUC Admission Counselling Scheduled - {{reference_no}}', 'Dear Parent & Candidate,\n\nYour academic counselling and seat allocation session has been scheduled for {{appointment_time}} at Campus Office.\n\nPlease carry original 10th marks card, 3 passport photographs, and Aadhar copy.\n\nAdmissions Helpline: +91 80 2345 6789', 'EMAIL', TRUE),
('SEAT_ALLOTMENT_CONFIRMED', 'Provisional Admission Confirmation', 'Provisional Admission Confirmed - MPUC Bengaluru', 'Congratulations {{student_name}}!\n\nYour provisional admission for 1st PUC {{preferred_combination}} has been confirmed under Application No {{application_no}}.\n\nClasses commence on 15th June. Welcome to the MPUC family!', 'EMAIL', TRUE);

-- 13. Seed Sample Admission Applications
INSERT INTO admission_applications (application_no, enquiry_id, student_name, dob, gender, blood_group, nationality, address, marks_percentage, status) VALUES
('APP-2026-501', 1, 'Rohan Sharma', '2010-04-12', 'MALE', 'O+', 'Indian', '#12, 4th Cross, Malleshwaram, Bengaluru - 560003', 92.40, 'VERIFIED'),
('APP-2026-502', 2, 'Priyanka Patel', '2010-08-25', 'FEMALE', 'B+', 'Indian', '#45, Gokula Extension, Mathikere, Bengaluru - 560054', 88.60, 'SUBMITTED'),
('APP-2026-503', 4, 'Sneha M.', '2009-12-14', 'FEMALE', 'A+', 'Indian', '#78, 8th Main, Sadashivanagar, Bengaluru - 560080', 95.20, 'APPROVED');

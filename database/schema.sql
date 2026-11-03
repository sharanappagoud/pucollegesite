-- V1__init_schema.sql: PU College Database Schema
-- Compatible with MySQL 8 and H2 MySQL mode

-- 1. Roles Table
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- 2. Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. User Roles Mapping Table
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- 4. Password Reset Tokens Table
CREATE TABLE password_reset_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expiry_date TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pw_reset_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. College Settings Table
CREATE TABLE college_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    category VARCHAR(50) DEFAULT 'GENERAL',
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Content Pages Table
CREATE TABLE pages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    subtitle VARCHAR(255),
    content MEDIUMTEXT NOT NULL,
    meta_description VARCHAR(300),
    published BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Homepage Banners Table
CREATE TABLE banners (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    cta_text VARCHAR(100),
    cta_link VARCHAR(255),
    image_url VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Courses Table
CREATE TABLE courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    stream VARCHAR(50) NOT NULL, -- SCIENCE, COMMERCE, ARTS
    duration VARCHAR(50) DEFAULT '2 Years',
    description TEXT,
    eligibility TEXT,
    career_prospects TEXT,
    fee_per_year DECIMAL(10, 2) DEFAULT 0.00,
    icon VARCHAR(100),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Course Subjects Table
CREATE TABLE course_subjects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT NOT NULL,
    subject_name VARCHAR(150) NOT NULL,
    subject_code VARCHAR(50),
    is_core BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_course_subjects_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 10. Faculty Table
CREATE TABLE faculty (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    designation VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL,
    qualification VARCHAR(200) NOT NULL,
    experience_years INT DEFAULT 0,
    subjects_taught VARCHAR(255),
    email VARCHAR(150),
    phone VARCHAR(20),
    bio TEXT,
    photo_url VARCHAR(500),
    display_order INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Facilities Table
CREATE TABLE facilities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    image_url VARCHAR(500),
    features TEXT,
    display_order INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Gallery Categories Table
CREATE TABLE gallery_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE
);

-- 13. Gallery Images Table
CREATE TABLE gallery_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(255),
    image_url VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_gallery_images_cat FOREIGN KEY (category_id) REFERENCES gallery_categories(id) ON DELETE SET NULL
);

-- 14. News Table
CREATE TABLE news (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content MEDIUMTEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    image_url VARCHAR(500),
    published_at DATE,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. Events Table
CREATE TABLE events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    event_date DATE NOT NULL,
    event_time VARCHAR(50),
    location VARCHAR(200),
    image_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'UPCOMING',
    registration_link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. Notices Table
CREATE TABLE notices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    document_url VARCHAR(500),
    is_important BOOLEAN DEFAULT FALSE,
    published_at DATE,
    expires_at DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. Academic Calendar Table
CREATE TABLE academic_calendar (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_title VARCHAR(200) NOT NULL,
    category VARCHAR(100) DEFAULT 'ACADEMIC',
    start_date DATE NOT NULL,
    end_date DATE,
    description VARCHAR(255),
    academic_year VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 18. Admission Enquiries Table
CREATE TABLE admission_enquiries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reference_no VARCHAR(50) NOT NULL UNIQUE,
    student_name VARCHAR(150) NOT NULL,
    parent_name VARCHAR(150) NOT NULL,
    student_phone VARCHAR(20) NOT NULL,
    parent_phone VARCHAR(20) NOT NULL,
    email VARCHAR(150) NOT NULL,
    last_completed_class VARCHAR(50) NOT NULL,
    board VARCHAR(100) NOT NULL,
    preferred_stream VARCHAR(50) NOT NULL,
    preferred_combination VARCHAR(50) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    message TEXT,
    status VARCHAR(50) DEFAULT 'NEW',
    follow_up_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 19. Admission Applications Table
CREATE TABLE admission_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_no VARCHAR(50) NOT NULL UNIQUE,
    enquiry_id BIGINT,
    student_name VARCHAR(150) NOT NULL,
    dob DATE,
    gender VARCHAR(20),
    blood_group VARCHAR(10),
    nationality VARCHAR(50) DEFAULT 'Indian',
    address TEXT,
    marks_percentage DECIMAL(5, 2),
    status VARCHAR(50) DEFAULT 'SUBMITTED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_adm_app_enquiry FOREIGN KEY (enquiry_id) REFERENCES admission_enquiries(id) ON DELETE SET NULL
);

-- 20. Application Documents Table
CREATE TABLE application_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_app_docs_app FOREIGN KEY (application_id) REFERENCES admission_applications(id) ON DELETE CASCADE
);

-- 21. Contact Enquiries Table
CREATE TABLE contact_enquiries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'NEW',
    response_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 22. Testimonials Table
CREATE TABLE testimonials (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(150) NOT NULL,
    batch_year VARCHAR(20) NOT NULL,
    stream VARCHAR(50) NOT NULL,
    achievement VARCHAR(200),
    quote TEXT NOT NULL,
    photo_url VARCHAR(500),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 23. Audit Logs Table
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    module VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for optimal querying
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_courses_stream ON courses(stream);
CREATE INDEX idx_faculty_dept ON faculty(department);
CREATE INDEX idx_news_slug ON news(slug);
CREATE INDEX idx_news_published ON news(published);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_enquiries_ref ON admission_enquiries(reference_no);
CREATE INDEX idx_enquiries_status ON admission_enquiries(status);
CREATE INDEX idx_contact_status ON contact_enquiries(status);

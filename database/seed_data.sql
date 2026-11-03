-- V2__seed_demo_data.sql: Realistic Seed Data for PU College

-- 1. Insert Roles
INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_ADMIN', 'Full Administrative Privileges'),
(2, 'ROLE_STAFF', 'Academic Staff & Enquiries Management'),
(3, 'ROLE_STUDENT', 'Student & Applicant Role');

-- 2. Insert Users (Admin password is 'Admin@123' hashed with BCrypt)
-- Hash: $2a$10$wN9P340tL0u0z4rT8sZzxeZc2ZkP6gY6Y9nZ8t4kI3j5k6m7n8o9p or fallback initialized by DataInitializer
INSERT INTO users (id, username, email, password, full_name, phone, active) VALUES
(1, 'admin', 'admin@svcpuc.edu.in', '$2a$10$hKDVYxL9zR.eA1/55g8a/.uQh5k4lqK.Vd6l9Vj7XbEwKz6V9pG2e', 'Dr. K. S. Venkatesh', '+91 98450 12345', TRUE),
(2, 'staff_admissions', 'admissions.staff@svcpuc.edu.in', '$2a$10$hKDVYxL9zR.eA1/55g8a/.uQh5k4lqK.Vd6l9Vj7XbEwKz6V9pG2e', 'Prof. Sunita Rao', '+91 98450 54321', TRUE);

INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1),
(2, 2);

-- 3. College Settings
INSERT INTO college_settings (setting_key, setting_value, category, description) VALUES
('college_name', 'Sri Vidyodaya Composite Pre-University College', 'GENERAL', 'Official College Name'),
('college_short_name', 'SVCPUC', 'GENERAL', 'Short Name / Acronym'),
('college_tagline', 'Excellence in Pre-University Education & Holistic Development', 'GENERAL', 'Motto or Tagline'),
('college_code', 'KA-PUC-0842', 'GENERAL', 'State Board Registration / Affiliation Code'),
('affiliation', 'Recognized by Department of Pre-University Education, Govt. of Karnataka', 'GENERAL', 'Affiliation Status'),
('established_year', '1998', 'GENERAL', 'Year of Establishment'),
('phone_primary', '+91 80 2345 6789', 'CONTACT', 'Main Campus Helpline'),
('phone_secondary', '+91 80 2345 6790', 'CONTACT', 'Admissions Office Direct'),
('email_primary', 'info@svcpuc.edu.in', 'CONTACT', 'General Enquiries Email'),
('email_admissions', 'admissions@svcpuc.edu.in', 'CONTACT', 'Admissions Email'),
('campus_address', '#45, Vidya Soudha Campus, 18th Cross, Malleshwaram, Bengaluru, Karnataka - 560003', 'CONTACT', 'Physical Campus Address'),
('office_hours', 'Monday - Friday: 8:30 AM - 4:30 PM | Saturday: 8:30 AM - 1:30 PM', 'CONTACT', 'Campus Operating Hours'),
('google_maps_embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.6534578964344!2d77.5684!3d13.0033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDAwJzExLjkiTiA3N8KwMzQnMDYuMiJF!5e0!3m2!1sen!2sin!4v1620000000000', 'CONTACT', 'Google Maps verified location URL'),
('facebook_url', 'https://facebook.com/svcpuc', 'SOCIAL', 'Facebook Page'),
('instagram_url', 'https://instagram.com/svcpuc_official', 'SOCIAL', 'Instagram Profile'),
('youtube_url', 'https://youtube.com/@svcpuc_bengaluru', 'SOCIAL', 'YouTube Channel'),
('linkedin_url', 'https://linkedin.com/school/svcpuc', 'SOCIAL', 'LinkedIn Page');

-- 4. Banners
INSERT INTO banners (id, title, subtitle, cta_text, cta_link, image_url, display_order, active) VALUES
(1, 'Shape Your Future With Academic Distinction', 'Admissions Open for 1st PUC (Science & Commerce) 2026-27', 'Apply For Admission', '/admissions', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80', 1, TRUE),
(2, 'Integrated Coaching for KCET, NEET & JEE', 'Mentored by experienced faculty with consistent state rank records', 'Explore Science Stream', '/academics', 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80', 2, TRUE),
(3, 'Excellence in Commerce, CA Foundation & Analytics', 'Equipping students with modern commerce, economics, and computational skills', 'Explore Commerce Stream', '/academics', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80', 3, TRUE);

-- 5. Courses (Science and Commerce streams with subject combinations)
INSERT INTO courses (id, code, name, stream, duration, description, eligibility, career_prospects, fee_per_year, icon, active) VALUES
(1, 'PCMB', 'Physics, Chemistry, Mathematics, Biology', 'SCIENCE', '2 Years', 'The ideal combination for aspirants aiming for medicine, biotechnology, healthcare, engineering, and pure sciences. Offers dual pathways for both NEET and JEE/KCET preparation.', 'Pass in 10th Standard / SSLC / ICSE / CBSE with a minimum aggregate of 60% and strong foundation in Science and Mathematics.', 'Medicine (MBBS, BDS, BAMS), Engineering (B.Tech), Biotechnology, Pharmacy, Nursing, Agricultural Sciences, Pure Science Research.', 55000.00, 'Microscope', TRUE),
(2, 'PCMC', 'Physics, Chemistry, Mathematics, Computer Science', 'SCIENCE', '2 Years', 'Tailored for students targeting premier engineering institutes and technological careers. Blends rigorous core sciences with modern Python and C++ computer programming.', 'Pass in 10th Standard / SSLC / ICSE / CBSE with a minimum aggregate of 65% in Mathematics and Science.', 'Software Engineering, Artificial Intelligence, Data Science, Aerospace, Robotics, Electronics & Communication, Pure Mathematics.', 58000.00, 'Cpu', TRUE),
(3, 'CEBA', 'Computer Science, Economics, Business Studies, Accountancy', 'COMMERCE', '2 Years', 'Modern commerce program integrating financial fundamentals with IT and data handling skills. Prepares students for fintech, data-driven management, and corporate careers.', 'Pass in 10th Standard / SSLC / ICSE / CBSE with at least 55% aggregate.', 'FinTech, Chartered Accountancy (CA), Company Secretary (CS), Business Administration (BBA), Data Analytics, Banking & Financial Services.', 48000.00, 'TrendingUp', TRUE),
(4, 'MEBA', 'Basic Maths, Economics, Business Studies, Accountancy', 'COMMERCE', '2 Years', 'Designed for commerce students who want mathematical aptitude for quantitative finance, actuarial science, and competitive professional examinations.', 'Pass in 10th Standard / SSLC / ICSE / CBSE with strong quantitative aptitude.', 'Actuarial Sciences, Chartered Accountancy (CA), Investment Banking, Corporate Finance, Economic Research, Stock Broking.', 46000.00, 'Calculator', TRUE),
(5, 'SEBA', 'Statistics, Economics, Business Studies, Accountancy', 'COMMERCE', '2 Years', 'Comprehensive focus on statistical modeling, business acumen, and accounting practices. Highly popular for economics and corporate management aspirants.', 'Pass in 10th Standard / SSLC / ICSE / CBSE with at least 50% aggregate.', 'Statistical Analysis, Market Research, Chartered Financial Analyst (CFA), CA, CS, Corporate Management, Economics.', 45000.00, 'BarChart3', TRUE),
(6, 'MSBA', 'Basic Maths, Statistics, Business Studies, Accountancy', 'COMMERCE', '2 Years', 'Analytical commerce suite emphasizing mathematical rigor and statistical inference for high-level commerce, financial auditing, and business analysis.', 'Pass in 10th Standard / SSLC / ICSE / CBSE with at least 50% aggregate.', 'Financial Auditing, Management Consulting, Cost & Management Accounting (CMA), Data Interpretation, Banking.', 46000.00, 'PieChart', TRUE);

-- 6. Course Subjects
INSERT INTO course_subjects (course_id, subject_name, subject_code, is_core) VALUES
(1, 'Physics', 'PHY-01', TRUE),
(1, 'Chemistry', 'CHE-02', TRUE),
(1, 'Mathematics', 'MAT-03', TRUE),
(1, 'Biology', 'BIO-04', TRUE),
(1, 'English (Language 1)', 'ENG-01', FALSE),
(1, 'Kannada / Hindi / Sanskrit (Language 2)', 'LANG-02', FALSE),

(2, 'Physics', 'PHY-01', TRUE),
(2, 'Chemistry', 'CHE-02', TRUE),
(2, 'Mathematics', 'MAT-03', TRUE),
(2, 'Computer Science', 'CS-05', TRUE),
(2, 'English (Language 1)', 'ENG-01', FALSE),
(2, 'Kannada / Hindi / Sanskrit (Language 2)', 'LANG-02', FALSE),

(3, 'Computer Science', 'CS-05', TRUE),
(3, 'Economics', 'ECO-01', TRUE),
(3, 'Business Studies', 'BUS-02', TRUE),
(3, 'Accountancy', 'ACC-03', TRUE),
(3, 'English (Language 1)', 'ENG-01', FALSE),
(3, 'Kannada / Hindi / Sanskrit (Language 2)', 'LANG-02', FALSE),

(4, 'Basic Mathematics', 'BMAT-04', TRUE),
(4, 'Economics', 'ECO-01', TRUE),
(4, 'Business Studies', 'BUS-02', TRUE),
(4, 'Accountancy', 'ACC-03', TRUE),
(4, 'English (Language 1)', 'ENG-01', FALSE),
(4, 'Kannada / Hindi / Sanskrit (Language 2)', 'LANG-02', FALSE),

(5, 'Statistics', 'STAT-05', TRUE),
(5, 'Economics', 'ECO-01', TRUE),
(5, 'Business Studies', 'BUS-02', TRUE),
(5, 'Accountancy', 'ACC-03', TRUE),
(5, 'English (Language 1)', 'ENG-01', FALSE),
(5, 'Kannada / Hindi / Sanskrit (Language 2)', 'LANG-02', FALSE),

(6, 'Basic Mathematics', 'BMAT-04', TRUE),
(6, 'Statistics', 'STAT-05', TRUE),
(6, 'Business Studies', 'BUS-02', TRUE),
(6, 'Accountancy', 'ACC-03', TRUE),
(6, 'English (Language 1)', 'ENG-01', FALSE),
(6, 'Kannada / Hindi / Sanskrit (Language 2)', 'LANG-02', FALSE);

-- 7. Faculty Members
INSERT INTO faculty (id, full_name, designation, department, qualification, experience_years, subjects_taught, email, phone, bio, photo_url, display_order, active) VALUES
(1, 'Dr. K. S. Venkatesh', 'Principal & Professor', 'Physics', 'M.Sc., M.Phil., Ph.D. (IISc Bengaluru)', 24, 'Classical Mechanics, Electrodynamics', 'principal@svcpuc.edu.in', '+91 98450 12345', 'Dedicated educationist with over two decades of experience in pre-university and collegiate education. Authored 3 textbooks on Karnataka PU Physics.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 1, TRUE),
(2, 'Prof. Sunita Rao', 'Vice Principal & HOD', 'Chemistry', 'M.Sc. (Organic Chemistry), B.Ed.', 18, 'Organic & Inorganic Chemistry', 'sunita.rao@svcpuc.edu.in', '+91 98450 54321', 'Passionate chemistry educator specializing in conceptual visualization and laboratory synthesis techniques. Key mentor for KCET chemistry.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', 2, TRUE),
(3, 'Prof. Anand Vardhan', 'Head of Department', 'Mathematics', 'M.Sc., SET Qualified', 16, 'Calculus, Trigonometry, Linear Algebra', 'anand.v@svcpuc.edu.in', '+91 98450 33441', 'Renowned mathematics mentor who has guided over 50 state top 100 rankers in CET and JEE Mains over the past decade.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 3, TRUE),
(4, 'Dr. Meenakshi Sundaram', 'Senior Lecturer', 'Biology', 'M.Sc. (Botany), Ph.D., B.Ed.', 14, 'Genetics, Plant Physiology, Biotechnology', 'meenakshi.s@svcpuc.edu.in', '+91 98450 66772', 'Specialist in NEET Biology curriculum and botanical taxonomy. Known for engaging interactive classroom discussions and specimen analysis.', 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=400&q=80', 4, TRUE),
(5, 'Prof. Rajesh Kulkarni', 'Head of Department', 'Computer Science', 'M.C.A., M.Tech (CS)', 12, 'Python Programming, SQL, Computer Networks', 'rajesh.k@svcpuc.edu.in', '+91 98450 88993', 'Industry veteran turned educator. Leads the robotics club, coding hackathons, and digital literacy initiatives on campus.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', 5, TRUE),
(6, 'Prof. Vidya Shankar', 'Head of Department', 'Commerce & Accountancy', 'M.Com, M.Phil., FCA Inter', 19, 'Financial Accounting, Corporate Accounting', 'vidya.shankar@svcpuc.edu.in', '+91 98450 22114', 'Chartered Accountant mentor leading the CA-CPT / Foundation preparatory coaching batch with a consistent 95%+ pass percentage.', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80', 6, TRUE),
(7, 'Prof. Geetha Narayanan', 'Senior Lecturer', 'Economics', 'M.A. (Economics), B.Ed.', 15, 'Microeconomics, Macroeconomics, Indian Economy', 'geetha.n@svcpuc.edu.in', '+91 98450 77885', 'Specializes in Indian developmental economics and financial budget analysis. Guides commerce students in real-world market case studies.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', 7, TRUE),
(8, 'Prof. Chandrashekar Hegde', 'Head of Department', 'Languages (Kannada & English)', 'M.A. (English), M.A. (Kannada), B.Ed.', 21, 'Communicative English, Kannada Sahitya', 'chandrashekar.h@svcpuc.edu.in', '+91 98450 44556', 'Cultural convener, orator, and literary advisor. Directs the annual college magazine and state-level debate tournaments.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', 8, TRUE);

-- 8. Campus Facilities
INSERT INTO facilities (id, title, category, description, icon, image_url, features, display_order, active) VALUES
(1, 'State-of-the-Art Physics Laboratory', 'LABORATORY', 'Spacious, well-illuminated laboratory equipped with modern optical benches, sonometers, spectrometers, and electronic testing apparatus conforming to Pre-University Board guidelines.', 'Atom', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80', 'Individual experiment workstations, Advanced optical spectrometers, Digital multimeters, High safety compliance with fire suppression', 1, TRUE),
(2, 'Advanced Chemistry Laboratory', 'LABORATORY', 'Fully ventilated chemistry facility with individual gas burners, fume hoods, analytical digital balances, and quality reagents for quantitative and qualitative salt analysis.', 'FlaskConical', 'https://images.unsplash.com/photo-1603555501671-8f96b3fce8b4?auto=format&fit=crop&w=800&q=80', 'Fume hoods for organic experiments, High-precision digital analytical balances, Dedicated titration stations, Comprehensive eyewash and safety gear', 2, TRUE),
(3, 'Modern Biology Laboratory', 'LABORATORY', 'Equipped with binocular compound microscopes, human anatomical models, preserved specimen museums, projection microscopes, and microtomes for microscopic slide studies.', 'Dna', 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80', 'High-definition compound microscopes, Extensive museum of botanical and zoological specimens, Human anatomical 3D models, Dissection gear and staining baths', 3, TRUE),
(4, 'Next-Gen Computer Science & AI Lab', 'LABORATORY', 'High-speed networked computer lab featuring 60+ latest Core i7 desktop workstations with dual operating systems (Ubuntu Linux and Windows 11), gigabit fiber internet, and developer IDEs.', 'Monitor', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80', '60 high-performance workstations, 1 Gbps dedicated leased-line internet, Python, C++, MySQL, VS Code preconfigured, Uninterrupted dual online UPS backup', 4, TRUE),
(5, 'Central Library & Digital Reading Room', 'ACADEMIC', 'Rich repository of over 15,000 academic textbooks, NCERT guides, reference encyclopedias, national journals, competitive exam modules (NEET, KCET, JEE), and digital e-library kiosks.', 'BookOpen', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80', '15,000+ print volumes and competitive exam guides, National & international educational journals, High-speed digital research terminals, Quiet reading zone seating 150 students', 5, TRUE),
(6, 'Multipurpose Auditorium & Seminar Hall', 'INFRASTRUCTURE', 'Air-conditioned 600-seater auditorium equipped with acoustic wall paneling, professional sound systems, theatrical stage lighting, and 4K digital projection for college ceremonies.', 'Mic', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80', '600 ergonomic cushioned seats, High-definition laser projector with wide screen, JBL acoustic line-array surround sound, Green rooms for performers', 6, TRUE),
(7, 'Indoor Sports Complex & Playing Arena', 'SPORTS', 'Dedicated sports facilities including indoor badminton courts, table tennis halls, chess/carrom clubs, and outdoor volleyball, basketball, and cricket practice nets.', 'Trophy', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80', 'Synthetic indoor badminton court, Standard outdoor basketball court, Turf cricket bowling nets, Qualified physical education instructors', 7, TRUE),
(8, 'Student Cafeteria & Wellness Hub', 'AMENITIES', 'Hygienic multi-cuisine cafeteria offering wholesome, nutritious meals, fresh juices, and refreshments alongside an on-campus first aid and wellness center with medical staff.', 'Coffee', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', 'Strict FSSAI-compliant hygienic cooking standards, Nutritious, affordable vegetarian breakfast and lunch, Clean RO drinking water dispensers, First-aid center with on-call doctor', 8, TRUE);

-- 9. Gallery Categories
INSERT INTO gallery_categories (id, name, slug) VALUES
(1, 'Campus & Infrastructure', 'campus'),
(2, 'Science & Computer Labs', 'labs'),
(3, 'Cultural Fest - Pratibha', 'cultural'),
(4, 'Sports & Athletics', 'sports'),
(5, 'Academic & Science Exhibitions', 'academics');

-- 10. Gallery Images
INSERT INTO gallery_images (id, category_id, title, description, image_url, display_order) VALUES
(1, 1, 'Majestic Campus Quadrangle', 'The central lush green quadrangle and administrative block of SVCPUC', 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80', 1),
(2, 2, 'Hands-on Physics Experimentation', 'Students conducting optics and wavelength determination experiments in the physics lab', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80', 2),
(3, 2, 'Computer Science Coding Session', 'Students implementing data structures and algorithms in Python under faculty guidance', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80', 3),
(4, 3, 'Inaugural Lamp Lighting at Pratibha Fest', 'Dignitaries and student representatives inaugurating the annual cultural festival', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80', 4),
(5, 3, 'Classical Dance Performance', 'Talented PU students presenting a vibrant Bharatanatyam recital during college day', 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80', 5),
(6, 4, 'Annual Inter-Collegiate Basketball Tournament', 'SVCPUC basketball team clinching the victory trophy in Bangalore district championship', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80', 6),
(7, 5, 'Anveshana Science Project Exhibition', 'Working model of renewable energy grid demonstrated by 2nd PUC Science students', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', 7),
(8, 1, 'Central Library Study Corridor', 'Students engaged in quiet reading and competitive examination preparation', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80', 8);

-- 11. News Articles
INSERT INTO news (id, title, slug, excerpt, content, category, image_url, published_at, published) VALUES
(1, 'SVCPUC Students Achieve Outstanding 98.6% Pass Rate in Karnataka PUC State Board Exams', 'svcpuc-students-achieve-outstanding-results-2026', 'Our students have once again brought laurels to the institution with 42 distinctions and 3 state top ranks in the annual examinations.', 'Sri Vidyodaya Composite Pre-University College (SVCPUC) is proud to announce another landmark year of academic brilliance in the Karnataka Pre-University Board Examinations. Out of 480 candidates who appeared for the exam across Science and Commerce streams, the college recorded an overall pass percentage of 98.6%.\n\nKey Highlights of Results:\n- 42 Students secured State Distinctions (>85%)\n- Master Rohith Rao secured 9th State Rank in Science Stream (PCMC) with 592/600 marks\n- Kum. Ananya Kulkarni secured 6th State Rank in Commerce Stream (CEBA) with 594/600 marks\n- 100% pass percentage in Computer Science and Accountancy departments\n\nThe Management, Principal Dr. K. S. Venkatesh, and faculty members congratulate all students and their parents for this stupendous accomplishment.', 'Academics', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80', '2026-05-15', TRUE),
(2, 'Admissions Open for Academic Year 2026-27: Online Applications & Counselling Schedule', 'admissions-open-academic-year-2026-27', 'Applications are invited from eligible 10th standard / SSLC / CBSE / ICSE pass-outs for 1st PUC Science (PCMB, PCMC) and Commerce (CEBA, MEBA, SEBA, MSBA).', 'Admissions for the upcoming academic year 2026-27 are now officially open at Sri Vidyodaya Composite Pre-University College. We welcome aspirational students seeking a supportive, disciplined, and academically rigorous environment.\n\nCourses Offered:\n1. Science: PCMB (Physics, Chemistry, Maths, Biology) and PCMC (Physics, Chemistry, Maths, Computer Science)\n2. Commerce: CEBA, MEBA, SEBA, MSBA\n\nHow to Apply:\nInterested parents and students can submit an online enquiry form on our website to receive an instant reference number. The admissions office will schedule a personal counselling session along with merit verification.', 'Admissions', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80', '2026-06-01', TRUE),
(3, 'Special Coaching Classes for KCET, NEET & CA Foundation Commence Next Week', 'coaching-classes-kcet-neet-ca-foundation-commence', 'SVCPUC inaugurates its specialized morning & weekend integrated coaching batches led by experienced faculties and test series mentors.', 'To ensure our students are well-prepared for competitive national and state entrance examinations, SVCPUC is launching its integrated preparatory classes for KCET (Karnataka Common Entrance Test), NEET, JEE Mains, and CA Foundation.\n\nThe curriculum features weekly chapter-wise mock tests, previous decade question paper reviews, personalized doubt-clearing sessions, and performance tracking dashboards for parents.', 'Coaching', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80', '2026-07-10', TRUE);

-- 12. Events
INSERT INTO events (id, title, slug, description, event_date, event_time, location, image_url, status, registration_link) VALUES
(1, 'Orientation Day & Welcome Ceremony for 1st Year PUC Batch', 'orientation-day-1st-year-puc-2026', 'Welcoming incoming first-year students and parents with academic briefings, campus tour, and faculty introductions.', '2026-06-20', '09:30 AM - 12:30 PM', 'Main Auditorium (Soudha Hall)', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80', 'UPCOMING', '/admissions'),
(2, 'Anveshana: Annual Science & Innovation Project Fair', 'anveshana-science-fair-2026', 'Interactive science exhibition where student teams showcase working robotics models, chemistry demonstrations, and green biology innovations.', '2026-08-14', '10:00 AM - 04:00 PM', 'Science Laboratories & Quadrangle', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', 'UPCOMING', '/events'),
(3, 'Pratibha: Annual Cultural Extravaganza & Talent Show', 'pratibha-annual-cultural-fest-2026', 'Two-day mega inter-class cultural tournament featuring classical dance, western music, skit, debate, quiz, and fashion pageant.', '2026-11-20', '09:00 AM - 05:00 PM', 'College Open Air Theatre & Auditorium', 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80', 'UPCOMING', '/events');

-- 13. Notices & Circulars
INSERT INTO notices (id, title, document_url, is_important, published_at, expires_at) VALUES
(1, 'Important Circular: Schedule for First Unit Test (Science & Commerce)', '#', TRUE, '2026-07-25', '2026-08-30'),
(2, 'Government Post-Matric and Merit-cum-Means Scholarship Portal Guidelines', '#', TRUE, '2026-07-15', '2026-09-30'),
(3, 'Mandatory Guidelines for College Identity Card & Uniform Code', '#', FALSE, '2026-06-18', '2026-12-31'),
(4, 'Library Book Return & Re-issuance Schedule for Mid-Term Exams', '#', FALSE, '2026-09-01', '2026-10-30');

-- 14. Academic Calendar
INSERT INTO academic_calendar (id, event_title, category, start_date, end_date, description, academic_year) VALUES
(1, 'Commencement of Classes for 1st & 2nd PUC', 'ACADEMIC', '2026-06-15', '2026-06-15', 'Academic classes commence for both First and Second year students.', '2026-27'),
(2, 'First Unit Test Examinations', 'EXAMINATION', '2026-08-01', '2026-08-08', 'Evaluation across core subjects for First & Second PUC.', '2026-27'),
(3, 'Mid-Term Examinations', 'EXAMINATION', '2026-10-05', '2026-10-16', 'Comprehensive semester assessments covering 50% syllabus.', '2026-27'),
(4, 'Dasara & Deepavali Cultural Vacations', 'HOLIDAY', '2026-10-18', '2026-11-02', 'Festival vacation for students and faculty.', '2026-27'),
(5, 'College Annual Athletic Meet & Sports Day', 'SPORTS', '2026-11-28', '2026-11-29', 'Track and field events, relay races, and championship matches.', '2026-27'),
(6, 'Second Unit Test & Preparatory Mock Exams', 'EXAMINATION', '2026-12-15', '2026-12-23', 'Unit assessments and practical syllabus completion check.', '2026-27'),
(7, 'State Board Preparatory Examinations', 'EXAMINATION', '2027-01-18', '2027-01-30', 'Strict board-pattern preparatory exams for 2nd PUC.', '2026-27'),
(8, 'Annual Karnataka PUC Board Final Examinations', 'EXAMINATION', '2027-03-01', '2027-03-22', 'Final Board examinations conducted by Karnataka Pre-University Board.', '2026-27');

-- 15. Admission Enquiries (Sample records for instant admin dashboard testing)
INSERT INTO admission_enquiries (id, reference_no, student_name, parent_name, student_phone, parent_phone, email, last_completed_class, board, preferred_stream, preferred_combination, academic_year, message, status, follow_up_notes) VALUES
(1, 'ADM-2026-1001', 'Rohan Sharma', 'Suresh Sharma', '+91 98451 11222', '+91 98451 33444', 'rohan.sharma@gmail.com', '10th Standard', 'CBSE', 'SCIENCE', 'PCMB', '2026-27', 'Interested in NEET medical coaching alongside regular board syllabus.', 'NEW', 'Enquiry received online. Awaiting document verification call.'),
(2, 'ADM-2026-1002', 'Priyanka Patel', 'Dharmesh Patel', '+91 98452 22333', '+91 98452 44555', 'priyanka.p@yahoo.com', 'SSLC', 'Karnataka State Board', 'COMMERCE', 'CEBA', '2026-27', 'Seeking scholarship eligibility based on 92% in 10th board exams.', 'CONTACTED', 'Spoke to parent. Counselling scheduled for Friday 10:30 AM.'),
(3, 'ADM-2026-1003', 'Kiran Kumar Reddy', 'Venkat Reddy', '+91 98453 33444', '+91 98453 55666', 'kiran.reddy@outlook.com', 'ICSE', 'ICSE', 'SCIENCE', 'PCMC', '2026-27', 'Wants to take up computer science and join robotics club.', 'COUNSELLING_SCHEDULED', 'Counselling slot confirmed with Dr. Venkatesh.'),
(4, 'ADM-2026-1004', 'Sneha M.', 'Manjunath B.', '+91 98454 44555', '+91 98454 66777', 'sneha.m@gmail.com', 'SSLC', 'Karnataka State Board', 'COMMERCE', 'MEBA', '2026-27', 'Aspiring for Chartered Accountancy (CA) Foundation batch.', 'ADMITTED', 'Fee paid, admission confirmed, ID generated: PU26C104.');

-- 16. Contact Enquiries
INSERT INTO contact_enquiries (id, full_name, email, phone, subject, message, status, response_notes) VALUES
(1, 'Raghavendra Joshi', 'raghav.joshi@gmail.com', '+91 98455 12345', 'Query regarding College Bus Transport Route from Yelahanka', 'Could you please let us know if college transport covers Yelahanka New Town and Kogilu cross?', 'NEW', 'Sent to transport coordinator for route confirmation.'),
(2, 'Lakshmi Narayan', 'lakshmi.n@rediffmail.com', '+91 98456 67890', 'Hostel Facility and Safety for Outstation Girl Students', 'We are from Hubli. Do you have dedicated hostel facilities for female students near campus?', 'RESOLVED', 'Provided details of partner hostel with 24/7 security and warden contact.');

-- 17. Testimonials
INSERT INTO testimonials (id, student_name, batch_year, stream, achievement, quote, photo_url, active) VALUES
(1, 'Aditi S. Rao', 'Batch 2024-25', 'PCMB (Science)', 'Scored 591/600 in PUC & Cleared NEET with 660 marks', 'The structured coaching and laboratory experience at SVCPUC made all the difference. The faculty was always approachable, even after college hours for clarifying doubts.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', TRUE),
(2, 'Naveen Kumar G.', 'Batch 2023-24', 'CEBA (Commerce)', 'State 5th Rank in Karnataka PUC Commerce & Cleared CA Foundation', 'The commerce department here is unmatched. Real-life case studies, mock balance sheets, and dedicated CA foundation guidance gave me tremendous confidence.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', TRUE),
(3, 'Bhavana Hegde', 'Batch 2024-25', 'PCMC (Science)', 'Secured Admission at NIT Surathkal (Computer Engineering)', 'The Computer Science lab and coding workshops ignited my passion for technology. SVCPUC strikes a perfect balance between academic discipline and extracurricular growth.', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80', TRUE);

-- 18. Audit Logs (Initial setup entry)
INSERT INTO audit_logs (username, action, module, details, ip_address) VALUES
('SYSTEM', 'SYSTEM_INITIALIZATION', 'DATABASE', 'Initialized database schema and seeded baseline PU college academic content', '127.0.0.1');

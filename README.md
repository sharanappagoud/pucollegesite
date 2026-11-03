# Sri Vidyodaya Composite Pre-University College (SVCPUC) / Masters PU College (MPUC)
### Full-Stack PU College Web Application & Complete 26-Module Admin CMS Portal

A modern, responsive, academic web application and enterprise-grade content management portal engineered for Pre-University (PU) collegiate education in Bengaluru, Karnataka.

Inspired by collegiate standards (e.g., Seshadripuram Composite PU College), this system delivers an original design system featuring deep navy blue (`#07172C` / `#133E87`), warm gold accents (`#D4AF37`), responsive components, real MySQL persistence, and role-based Spring Security.

---

## 🌟 Architecture & Admin Portal Modules (26 Modules)

The portal provides 26 dedicated modules organized into 6 intuitive operational domains:

### 1. Overview & Command
- **Dashboard Overview (`/admin`)**: Real-time KPI analytics, pending application queues, admission conversion rates, recent audit history, and quick-action shortcuts.

### 2. Admissions & Student Records
- **Admission Enquiries (`/admin/enquiries`)**: Candidate lead tracking, 10th board/marks, stream choices, follow-up timeline, and status workflow.
- **Student & Application Records (`/admin/students`)**: Formal admission records, document verification statuses (`SUBMITTED`, `VERIFIED`, `APPROVED`, `ADMITTED`, `REJECTED`), applicant detail modal, and data governance.
- **Fee & Scholarship Information (`/admin/scholarships`)**: Merit fee waivers, sports endowments, and need-based concession schemes.
- **Student Achievements & Results (`/admin/achievements`)**: Hall of fame records, State Ranks in Karnataka PU Board, KCET, NEET, JEE, and athletic medals.

### 3. Academics & Faculty
- **Courses & Combinations (`/admin/courses`)**: Science (PCMB, PCMC) and Commerce (CEBA, MEBA, SEBA, MSBA) combinations, annual fee structures, and subject syllabi.
- **Examination Management (`/admin/examinations`)**: Unit tests, mid-term examinations, preparatory mock exams, and state board timetables with PDF guidelines.
- **Academic Calendar (`/admin/calendar`)**: Institutional dates, term starts, practical sessions, vacations, and government holidays.
- **Faculty Profiles (`/admin/faculty`)**: Lecturer credentials, designations, departments, teaching experience, and faculty photos.
- **Staff & Department Management (`/admin/departments`)**: Academic departments (Physics, Chemistry, Math, Biology, CS, Commerce, Economics, Languages) and HOD leadership.

### 4. Content & Media CMS
- **Page Content Management (`/admin/pages`)**: Dynamic landing pages, institutional history, vision & mission, and policy content with live publish toggles.
- **Banner & Media Library (`/admin/banners`)**: Homepage carousel slides, call-to-actions, and central asset gallery with one-click URL copying.
- **Campus Facilities (`/admin/facilities`)**: Science laboratories, digital libraries, seminar halls, sports complexes, and hostel amenities.
- **News & Announcements (`/admin/news`)**: Institutional press releases, categorised articles, and publication dates.
- **College Events (`/admin/events`)**: Annual cultural fest 'Pratibha', science exhibitions, tech symposiums, and sports meets.
- **Notices & Circulars (`/admin/notices`)**: Official board circulars with immediate ticker broadcasting on the public homepage.
- **Testimonials & Reviews (`/admin/testimonials`)**: Student and alumni feedback approval and review moderation.

### 5. Communications & SEO
- **Contact Messages (`/admin/contact-enquiries`)**: Public visitor contact inquiries and response tracking.
- **SEO & Social Media Management (`/admin/seo`)**: Meta titles, search descriptions, OpenGraph share banners, Google Analytics tags, and social channel handles with **live Google Search Snippet Preview**.
- **Email & Notification Settings (`/admin/notifications`)**: Automated email and SMS templates (with token interpolation) and live test dispatch simulator.

### 6. System & Administration
- **Navbar & College Settings (`/admin/settings`)**: Dynamic institution name, short name, admissions hotline, campus address, and branding.
- **Roles & Permissions (`/admin/roles`)**: Least-privilege role-based access control (RBAC), staff account provisioning, and administrative password resets.
- **Audit Logs & Activity History (`/admin/audit-logs`)**: Immutable, tamper-resistant system trail recording timestamps, operator usernames, actions, and client IPs.
- **Reports & CSV Export (`/admin/reports`)**: Aggregated conversion funnels, stream breakdown analytics, and compliant one-click CSV data exports.
- **Backup & Maintenance (`/admin/backup`)**: Database snapshots, system maintenance mode toggle, and application cache purges.
- **Security & Account Settings (`/admin/account`)**: Administrator profile updates, password changes with current password verification, and active session health.

---

## 🔐 Security & Role-Based Access Control (RBAC)

The system implements Spring Security with method security (`@PreAuthorize`) and least-privilege principles:

| System Role | Scope & Permissions | Permitted Modules |
| :--- | :--- | :--- |
| **ROLE_SUPER_ADMIN** | Unrestricted institutional control | All 26 modules, User CRUD, Role assignment, DB backups, Cache flush, Audit logs |
| **ROLE_ADMIN** | General administrative management | Dashboard, Admissions, Academics, Settings, Reports, Backups view, Account |
| **ROLE_CONTENT_EDITOR** | Web media & public communications | Pages, Banners, Gallery, News, Events, Notices, Testimonials, Achievements |
| **ROLE_ADMISSION_STAFF** | Admissions office & counselling | Enquiries, Student Applications, Status workflows, Candidate CSV exports |
| **ROLE_STAFF** | General collegiate staff | Read-only directory access and personal security settings |

---

## 📡 REST API Reference

All management APIs are served under `/api/v1/admin/` with Bearer JWT authentication:

| Domain | Method | Endpoint | Authorized Roles | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Pages** | `GET, POST` | `/api/v1/admin/pages` | SUPER_ADMIN, ADMIN, CONTENT_EDITOR | List or save CMS pages |
| | `PATCH` | `/api/v1/admin/pages/{id}/publish` | SUPER_ADMIN, ADMIN, CONTENT_EDITOR | Toggle page publication |
| **Banners** | `GET, POST` | `/api/v1/admin/banners` | SUPER_ADMIN, ADMIN, CONTENT_EDITOR | List or save hero banners |
| | `GET, POST` | `/api/v1/admin/banners/media` | SUPER_ADMIN, ADMIN, CONTENT_EDITOR | Media library asset management |
| **Achievements** | `GET, POST` | `/api/v1/admin/achievements` | SUPER_ADMIN, ADMIN, CONTENT_EDITOR | Student ranks & awards |
| **Students** | `GET, POST` | `/api/v1/admin/students` | SUPER_ADMIN, ADMIN, ADMISSION_STAFF | Student application records |
| | `PATCH` | `/api/v1/admin/students/{id}/status` | SUPER_ADMIN, ADMIN, ADMISSION_STAFF | Update workflow status |
| **Exams** | `GET, POST` | `/api/v1/admin/examinations` | SUPER_ADMIN, ADMIN, CONTENT_EDITOR | Term tests & board schedules |
| **Scholarships** | `GET, POST` | `/api/v1/admin/scholarships` | SUPER_ADMIN, ADMIN, ADMISSION_STAFF | Fee concessions & grants |
| **Departments** | `GET, POST` | `/api/v1/admin/departments` | SUPER_ADMIN, ADMIN | Academic departments & HODs |
| **Testimonials**| `GET, POST` | `/api/v1/admin/testimonials` | SUPER_ADMIN, ADMIN, CONTENT_EDITOR | Reviews & approval workflow |
| **SEO** | `GET, POST` | `/api/v1/admin/seo` | SUPER_ADMIN, ADMIN | SEO meta tags & social channels |
| **Notifications**| `GET, POST` | `/api/v1/admin/notifications` | SUPER_ADMIN, ADMIN | Templates & dispatch simulation |
| **Roles & Users**| `GET` | `/api/v1/admin/roles` | SUPER_ADMIN, ADMIN | System roles matrix |
| | `GET, POST` | `/api/v1/admin/users` | SUPER_ADMIN, ADMIN | Staff account management |
| | `PATCH` | `/api/v1/admin/users/{id}/reset-password` | SUPER_ADMIN, ADMIN | Admin password reset |
| **Audit Logs** | `GET` | `/api/v1/admin/audit-logs` | SUPER_ADMIN, ADMIN | Immutable paginated audit log |
| **Reports** | `GET` | `/api/v1/admin/reports/summary` | SUPER_ADMIN, ADMIN, ADMISSION_STAFF | Analytics KPI aggregations |
| | `GET` | `/api/v1/admin/reports/{enquiries\|applications\|faculty\|audit-logs}/csv` | SUPER_ADMIN, ADMIN, ADMISSION_STAFF | Compliant CSV file download |
| **Backup** | `GET, POST` | `/api/v1/admin/backup/{status\|create\|clear-cache\|maintenance-toggle}` | SUPER_ADMIN, ADMIN | Snapshot & maintenance controls |
| **Account** | `GET, PUT` | `/api/v1/admin/account/{me\|profile\|password\|security-info}` | All Authenticated Staff | Personal profile & password |

---

## 🗄️ Database Migrations (Flyway)

All database changes are managed through Flyway in `backend/src/main/resources/db/migration/`:
- `V1__init_schema.sql`: Core schema (users, roles, enquiries, courses, faculty, facilities, news, events, notices, calendar, settings, gallery, testimonials, audit logs).
- `V2__seed_demo_data.sql`: Seed data for academic combinations, faculty, campus amenities, calendar, and default accounts.
- `V3__admin_cms_modules.sql`: Extended CMS tables:
  - `student_achievements`: Hall of fame, KCET/NEET ranks, and medals.
  - `examinations`: Mid-terms, unit tests, preparatory mock board exams.
  - `scholarships`: Merit waivers, sports grants, and economic assistance.
  - `departments`: Academic departments, codes, and HOD contacts.
  - `notification_templates`: Automated alert templates for admissions and schedules.
  - `roles`: Seeded `ROLE_SUPER_ADMIN`, `ROLE_CONTENT_EDITOR`, `ROLE_ADMISSION_STAFF`.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, React Router 6, React Hook Form, Lucide React Icons, Axios, Vanilla Academic CSS Tokens |
| **Backend** | Java 17, Spring Boot 3.3.4, Spring Security 6, Spring Data JPA, Hibernate 6 (validate), JJWT 0.12.6, Swagger / OpenAPI |
| **Database** | MySQL 8.0 / 9.x, Flyway Migrations (InnoDB, utf8mb4) |

---

## 🚀 Running the Application with MySQL 8

### 1. Database Provisioning (MySQL 8)
Ensure MySQL 8 is running locally. Execute the provisioning script:
```bash
mysql -u root -p < database/setup_mysql8.sql
```
This creates the `mpuc_college` database (`utf8mb4_unicode_ci`) and `mpuc_app` user with required privileges.

### 2. Spring Boot Backend
```bash
cd backend
export JAVA_HOME=$(/usr/libexec/java_home -v 17) # on macOS or your local JDK 17
mvn spring-boot:run
```
- Backend connects to MySQL 8 on `localhost:3306/mpuc_college`.
- Flyway automatically runs all migrations (`V1`, `V2`, `V3`).
- Hibernate strict schema validation (`ddl-auto=validate`) verifies persistence consistency.
- Backend runs on `http://localhost:8085` (or configured `${SERVER_PORT}` / `${PORT}`).
- Swagger UI available at `http://localhost:8085/swagger-ui.html`.

### 2. React Frontend
```bash
cd frontend
npm install
npm run dev
```
- Frontend runs on `http://localhost:5173`.
- Proxies `/api` and `/uploads` directly to the backend.

### 3. Default Credentials
- **Username**: `admin`
- **Password**: `Admin@123`
- **Role**: `ROLE_SUPER_ADMIN`, `ROLE_ADMIN`

---

## 🧪 Testing & Verification

### Run Automated Backend Tests:
```bash
cd backend
mvn test
```

### Build Production Bundle:
```bash
cd frontend
npm run build
```
Builds cleanly with zero bundling errors.

# MPUC College Website - MySQL 8 Database Architecture

## Relational Database Structure
The application uses an enterprise-grade **MySQL 8** database schema (InnoDB engine, `utf8mb4_unicode_ci` character encoding) managed automatically by **Flyway** migrations located under `backend/src/main/resources/db/migration/`.

H2 in-memory database has been completely removed in favor of direct MySQL 8 persistence.

### Migration Files
1. `V1__init_schema.sql`: Contains 23 core tables, primary keys, foreign key constraints, unique indexes, and audit logs.
2. `V2__seed_demo_data.sql`: Seeds default roles, administrative credentials, courses (PCMB, PCMC, CEBA, MEBA, SEBA, MSBA), subjects, faculty members, campus facilities, news, notices, events, academic calendar, gallery images, testimonials, and sample enquiries.
3. `V3__admin_cms_modules.sql`: Extends CMS tables for Student Achievements, Examinations, Scholarships, Academic Departments, and Email/SMS Notification Templates.

---

## 🛠️ MySQL 8 Database Setup Instructions

### 1. Provision Database & User (Run as MySQL Root)
Run the automated script [database/setup_mysql8.sql](file:///Users/sharanappagoudap/Desktop/pucollegesite/database/setup_mysql8.sql) or execute:

```sql
CREATE DATABASE IF NOT EXISTS mpuc_college
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'mpuc_app'@'localhost'
    IDENTIFIED BY 'Mpuc@Secure2026!';

GRANT SELECT, INSERT, UPDATE, DELETE,
      CREATE, ALTER, INDEX, REFERENCES, DROP
ON mpuc_college.*
TO 'mpuc_app'@'localhost';

FLUSH PRIVILEGES;
```

### 2. Configure Environment Variables
Set the credentials in your environment or `backend/.env`:

```bash
DB_HOST=localhost
DB_PORT=3306
DB_NAME=mpuc_college
DB_USERNAME=mpuc_app
DB_PASSWORD=Mpuc@Secure2026!
```

### 3. Automatic Migration & Validation
When the Spring Boot backend starts:
1. **Flyway** executes any pending migrations in `backend/src/main/resources/db/migration/`.
2. **Hibernate** performs strict schema validation (`spring.jpa.hibernate.ddl-auto=validate`), ensuring entity mappings strictly match table definitions.

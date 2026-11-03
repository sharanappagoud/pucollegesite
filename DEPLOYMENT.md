# Production Deployment Guide: PU College Website

## Architecture Overview
The system consists of:
1. **Frontend**: React 18 SPA built with Vite, styled with custom CSS tokens, served via Nginx.
2. **Backend**: Spring Boot 3.3.4 REST API running on Java 17/21, secured with Spring Security 6 and JWT Bearer authentication.
3. **Database**: MySQL 8.0 relational database with Flyway schema and seed migrations.

---

## 1. Quick Local Execution (MySQL 8 Setup)

The application connects directly to MySQL 8:
- Run the provisioning script [database/setup_mysql8.sql](file:///Users/sharanappagoudap/Desktop/pucollegesite/database/setup_mysql8.sql) to create `mpuc_college` and user `mpuc_app`.
- The backend runs Flyway migrations automatically against MySQL 8 and validates schema integrity.
- The frontend dev server proxies all `/api` requests to `http://localhost:8085`.

### Terminal 1: Start Spring Boot Backend
```bash
cd backend
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
mvn spring-boot:run
```
*Backend will start on `http://localhost:8085`*
*OpenAPI / Swagger UI docs are at `http://localhost:8085/swagger-ui.html`*

### Terminal 2: Start React Frontend
```bash
cd frontend
npm run dev
```
*Frontend will launch on `http://localhost:5173`*

---

## 2. Docker Compose Production Deployment

To run the complete production stack (MySQL 8 + Spring Boot + Nginx + React):

```bash
# From repository root
docker-compose up -d --build
```

- Public Website: `http://localhost`
- Admin Dashboard: `http://localhost/admin`
- Swagger API Docs: `http://localhost/swagger-ui/index.html`
- MySQL Database: `localhost:3306` (Database: `pucollege_db`)

To stop the containers:
```bash
docker-compose down
```

---

## 3. Production Cloud Hosting Recommendations

### A. Frontend Hosting
- **Vercel / Netlify / AWS CloudFront + S3 / Firebase Hosting**
  - Build command: `npm run build`
  - Output directory: `dist`
  - Set rewrite rule for SPA: `/* -> /index.html`

### B. Backend Hosting
- **AWS Elastic Beanstalk / GCP Cloud Run / Render / DigitalOcean App Platform**
  - Package JAR: `mvn clean package -DskipTests`
  - Set environment variables:
    ```env
    SPRING_PROFILES_ACTIVE=mysql
    DB_HOST=<managed-mysql-host>
    DB_PORT=3306
    DB_NAME=pucollege_db
    DB_USERNAME=<db-user>
    DB_PASSWORD=<db-password>
    APP_JWT_SECRET=<secure-random-256bit-key>
    APP_CORS_ALLOWED_ORIGINS=https://yourcollegedomain.edu.in
    ```

### C. Managed MySQL 8 Database
- **AWS RDS MySQL / GCP Cloud SQL / DigitalOcean Managed Databases / PlanetScale**
  - Ensure minimum 20GB SSD storage and automated daily snapshots.
  - Enable SSL connections in production: `useSSL=true&requireSSL=true`.

---

## 4. Default Seed Administrator Credentials

| Username | Password | Role | Access Level |
| :--- | :--- | :--- | :--- |
| `admin` | `Admin@123` | `ROLE_ADMIN` | Full administrative privileges (Courses, Faculty, Enquiries, Settings) |

> [!NOTE]
> All passwords are encrypted with BCrypt (10 rounds). Change the default administrator password immediately after deployment. Only `ROLE_ADMIN` can access `/admin` or `/api/v1/admin/**`.

-- ===================================================================
-- MPUC College Website - MySQL 8 Database Provisioning Script
-- ===================================================================
-- This script must be executed by an authorized MySQL Administrator (e.g. root)
-- before launching the Spring Boot application.
-- Replace 'Mpuc@Secure2026!' with a strong, unique secret.

-- 1. Create the database with full UTF-8 Unicode support
CREATE DATABASE IF NOT EXISTS mpuc_college
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- 2. Create the dedicated least-privilege application runtime user
CREATE USER IF NOT EXISTS 'mpuc_app'@'localhost'
    IDENTIFIED BY 'Mpuc@Secure2026!';

-- 3. Grant required Data Definition (DDL) and Data Manipulation (DML) privileges
-- for Flyway migrations and runtime application transactions
GRANT SELECT, INSERT, UPDATE, DELETE,
      CREATE, ALTER, INDEX, REFERENCES, DROP
ON mpuc_college.*
TO 'mpuc_app'@'localhost';

-- 4. Apply privilege changes
FLUSH PRIVILEGES;

-- Verification
SHOW DATABASES LIKE 'mpuc_college';
SELECT user, host FROM mysql.user WHERE user = 'mpuc_app';

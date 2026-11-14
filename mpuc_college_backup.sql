-- MySQL dump 10.13  Distrib 5.7.24, for osx11.1 (x86_64)
--
-- Host: localhost    Database: mpuc_college
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `academic_calendar`
--

DROP TABLE IF EXISTS `academic_calendar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `academic_calendar` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `event_title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'ACADEMIC',
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `academic_year` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academic_calendar`
--

LOCK TABLES `academic_calendar` WRITE;
/*!40000 ALTER TABLE `academic_calendar` DISABLE KEYS */;
INSERT INTO `academic_calendar` VALUES (1,'Commencement of Classes for 1st & 2nd PUC','ACADEMIC','2026-06-15','2026-06-15','Academic classes commence for both First and Second year students.','2026-27','2026-10-26 13:47:49'),(2,'First Unit Test Examinations','EXAMINATION','2026-08-01','2026-08-08','Evaluation across core subjects for First & Second PUC.','2026-27','2026-10-26 13:47:49'),(3,'Mid-Term Examinations','EXAMINATION','2026-10-05','2026-10-16','Comprehensive semester assessments covering 50% syllabus.','2026-27','2026-10-26 13:47:49'),(4,'Dasara & Deepavali Cultural Vacations','HOLIDAY','2026-10-18','2026-11-02','Festival vacation for students and faculty.','2026-27','2026-10-26 13:47:49'),(5,'College Annual Athletic Meet & Sports Day','SPORTS','2026-11-28','2026-11-29','Track and field events, relay races, and championship matches.','2026-27','2026-10-26 13:47:49'),(6,'Second Unit Test & Preparatory Mock Exams','EXAMINATION','2026-12-15','2026-12-23','Unit assessments and practical syllabus completion check.','2026-27','2026-10-26 13:47:49'),(7,'State Board Preparatory Examinations','EXAMINATION','2027-01-18','2027-01-30','Strict board-pattern preparatory exams for 2nd PUC.','2026-27','2026-10-26 13:47:49'),(8,'Annual Karnataka PUC Board Final Examinations','EXAMINATION','2027-03-01','2027-03-22','Final Board examinations conducted by Karnataka Pre-University Board.','2026-27','2026-10-26 13:47:49'),(9,'www','HOLIDAY','2026-11-05',NULL,'','2027','2026-11-05 10:01:04'),(10,'www','ACADEMIC','2026-11-05','2026-11-27','eeee','2026-27','2026-11-05 10:01:28');
/*!40000 ALTER TABLE `academic_calendar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admission_applications`
--

DROP TABLE IF EXISTS `admission_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admission_applications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `application_no` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `enquiry_id` bigint DEFAULT NULL,
  `student_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dob` date DEFAULT NULL,
  `gender` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `blood_group` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nationality` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Indian',
  `address` text COLLATE utf8mb4_unicode_ci,
  `marks_percentage` decimal(5,2) DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'SUBMITTED',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `application_no` (`application_no`),
  KEY `fk_adm_app_enquiry` (`enquiry_id`),
  CONSTRAINT `fk_adm_app_enquiry` FOREIGN KEY (`enquiry_id`) REFERENCES `admission_enquiries` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admission_applications`
--

LOCK TABLES `admission_applications` WRITE;
/*!40000 ALTER TABLE `admission_applications` DISABLE KEYS */;
INSERT INTO `admission_applications` VALUES (1,'APP-2026-501',1,'Rohan Sharma','2010-04-12','MALE','O+','Indian','#12, 4th Cross, Malleshwaram, Bengaluru - 560003',92.40,'VERIFIED','2026-10-26 13:47:49','2026-10-26 13:47:49'),(2,'APP-2026-502',2,'Priyanka Patel','2010-08-25','FEMALE','B+','Indian','#45, Gokula Extension, Mathikere, Bengaluru - 560054',88.60,'SUBMITTED','2026-10-26 13:47:49','2026-10-26 13:47:49'),(3,'APP-2026-503',4,'Sneha M.','2009-12-14','FEMALE','A+','Indian','#78, 8th Main, Sadashivanagar, Bengaluru - 560080',95.20,'APPROVED','2026-10-26 13:47:49','2026-10-26 13:47:49');
/*!40000 ALTER TABLE `admission_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admission_enquiries`
--

DROP TABLE IF EXISTS `admission_enquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admission_enquiries` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `reference_no` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_completed_class` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `board` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `preferred_stream` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `preferred_combination` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `academic_year` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `address` text COLLATE utf8mb4_unicode_ci,
  `pincode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referred_by` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'NEW',
  `follow_up_notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reference_no` (`reference_no`),
  KEY `idx_enquiries_ref` (`reference_no`),
  KEY `idx_enquiries_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admission_enquiries`
--

LOCK TABLES `admission_enquiries` WRITE;
/*!40000 ALTER TABLE `admission_enquiries` DISABLE KEYS */;
INSERT INTO `admission_enquiries` VALUES (1,'ADM-2026-1001','Rohan Sharma','Suresh Sharma','+91 98451 11222','+91 98451 33444',NULL,'rohan.sharma@gmail.com','10th Standard','CBSE','SCIENCE','PCMB','2026-27','Interested in NEET medical coaching alongside regular board syllabus.',NULL,NULL,NULL,'REJECTED','Enquiry received online. Awaiting document verification call.','2026-10-26 13:47:49','2026-10-26 09:07:38'),(2,'ADM-2026-1002','Priyanka Patel','Dharmesh Patel','+91 98452 22333','+91 98452 44555',NULL,'priyanka.p@yahoo.com','SSLC','Karnataka State Board','COMMERCE','CEBA','2026-27','Seeking scholarship eligibility based on 92% in 10th board exams.',NULL,NULL,NULL,'CONTACTED','Spoke to parent. Counselling scheduled for Friday 10:30 AM.','2026-10-26 13:47:49','2026-10-26 13:47:49'),(3,'ADM-2026-1003','Kiran Kumar Reddy','Venkat Reddy','+91 98453 33444','+91 98453 55666',NULL,'kiran.reddy@outlook.com','ICSE','ICSE','SCIENCE','PCMC','2026-27','Wants to take up computer science and join robotics club.',NULL,NULL,NULL,'COUNSELLING_SCHEDULED','Counselling slot confirmed with Dr. Venkatesh.','2026-10-26 13:47:49','2026-10-26 13:47:49'),(4,'ADM-2026-1004','Sneha M.','Manjunath B.','+91 98454 44555','+91 98454 66777',NULL,'sneha.m@gmail.com','SSLC','Karnataka State Board','COMMERCE','MEBA','2026-27','Aspiring for Chartered Accountancy (CA) Foundation batch.',NULL,NULL,NULL,'ADMITTED','Fee paid, admission confirmed, ID generated: PU26C104.','2026-10-26 13:47:49','2026-10-26 13:47:49'),(7,'ADM-2026-7704','Kavya Prakash','Prakash B. R.','9845099887','9845099886',NULL,'kavya.p@example.com','10th Standard','Karnataka State Board','SCIENCE','PCMB','2026-27','Enquiring about NEET integrated batch',NULL,NULL,NULL,'NEW','Online enquiry submitted on 26-Oct-2026 19:22','2026-10-26 08:22:43','2026-10-26 08:22:43'),(10,'ADM-2026-1084','Kavitha Gowda','Anand Gowda','9845099887','9845099888',NULL,'kavitha.g@example.com','10th Standard','Karnataka State Board','SCIENCE','PCMB','2026-27','Interested in NEET integrated coaching',NULL,NULL,NULL,'NEW','Online enquiry submitted on 29-Oct-2026 21:41','2026-10-29 10:41:52','2026-10-29 10:41:52'),(11,'ADM-2026-7959','sharanappagouda','basanagouda','9743988354','9743988354',NULL,'sharanappagouda148@gmail.com','10th Standard','Karnataka State Board','SCIENCE','PCMB','2026-27','Homepage quick enquiry',NULL,NULL,NULL,'NEW','Online enquiry submitted on 29-Oct-2026 23:23','2026-10-29 12:23:47','2026-10-29 12:23:47'),(12,'ADM-2026-1138','pwdcqe','neftgt','3456789343','3456789343',NULL,'sharanappagouda148@gmail.com','10th Standard','Karnataka State Board','SCIENCE','PCMB','2026-27','Homepage quick enquiry',NULL,NULL,NULL,'NEW','Online enquiry submitted on 30-Oct-2026 00:11','2026-10-29 13:11:58','2026-10-29 13:11:58'),(13,'ADM-2026-8211','shankar','naveena','6360707645','6360707645',NULL,'sharanappagouda148@gmail.com','10th Standard','Karnataka State Board','SCIENCE','PCMB','2026-27','Admission',NULL,NULL,NULL,'NEW','Online enquiry submitted on 30-Oct-2026 20:20','2026-10-30 09:20:50','2026-10-30 09:20:50'),(14,'ADM-2026-2182','Basavaraja k m','k m','2345678987','2345678987',NULL,'newbasavaraj@gmail.com','10th Standard','CBSE','COMMERCE','CEBA','2026-27','',NULL,NULL,NULL,'NEW','Online enquiry submitted on 30-Oct-2026 20:24','2026-10-30 09:24:53','2026-10-30 09:24:53'),(15,'ADM-2026-3921','Aditya Rao','Suresh Rao','9845112233','9845112234',NULL,'aditya.rao@example.com','10th Standard','CBSE','SCIENCE','PCMC','2026-27','Interested in engineering integrated batch',NULL,NULL,NULL,'NEW','Online enquiry submitted on 30-Oct-2026 20:29','2026-10-30 09:29:22','2026-10-30 09:29:22'),(16,'ADM-2026-2704','praveen matti','yalappa','1234567890','1234567890',NULL,'abc@gmail.com','10th Standard','Karnataka State Board','SCIENCE','PCMB','2026-27','admission',NULL,NULL,NULL,'UNDER_REVIEW','Online enquiry submitted on 30-Oct-2026 20:35','2026-10-30 09:35:23','2026-10-31 08:04:02'),(17,'ADM-2026-5014','ravi','naveena','2345678934','3248862777',NULL,'xyz@gmail.com','10th Standard','Karnataka State Board','SCIENCE','PCMB','2026-27','Homepage quick enquiry',NULL,NULL,NULL,'NEW','Online enquiry submitted on 30-Oct-2026 21:13','2026-10-30 10:13:06','2026-10-30 10:13:06'),(18,'ADM-2026-7019','shrushti','basanagouda','2345678987','2345678987',NULL,'2345678987@gmail.com','10th Standard','Karnataka State Board','SCIENCE','PCMB','2026-27','Homepage quick enquiry',NULL,NULL,NULL,'NEW','Online enquiry submitted on 30-Oct-2026 21:19','2026-10-30 10:19:25','2026-10-30 10:19:25'),(19,'ADM-2026-7843','patil','b patil','2345678123','23456781234',NULL,'sshhf@gmail.com','10th Standard','Karnataka State Board','SCIENCE','PCMB','2026-27','Homepage quick enquiry',NULL,NULL,NULL,'NEW','Online enquiry submitted on 30-Oct-2026 21:26','2026-10-30 10:26:20','2026-10-30 10:26:20'),(20,'ADM-2026-6597','sharanappagouda','basanagouda','6360707645','6360707645',NULL,'sharanappagoudapolicepatil60@gmail.com','10th Standard','Karnataka State Board','SCIENCE','PCMB','2026-27','Homepage quick enquiry',NULL,NULL,NULL,'NEW','Online enquiry submitted on 30-Oct-2026 21:49','2026-10-30 10:49:17','2026-10-30 10:49:17'),(21,'ADM-2026-8218','gouda','n','7648291910','7648291910',NULL,'abce@gmail.com','10th Standard','Karnataka State Board','SCIENCE','PCMB','2026-27','Homepage quick enquiry',NULL,NULL,NULL,'NEW','Online enquiry submitted on 30-Oct-2026 22:06','2026-10-30 11:06:44','2026-10-30 11:06:44'),(22,'ADM-2026-7267','Ramesh Patil','Sharanappa Patil','9845012345','9845012346',NULL,'sharanappagoudapolicepatil60@gmail.com','10th Standard','Karnataka State Board','SCIENCE','PCMB','2026-27','Enquiring about PCMB integrated batch','MG Road, Gulbarga, Karnataka','585102','Staff recommendation','CLOSED','Online enquiry submitted on 30-Oct-2026 23:31\n[30-Oct-2026 23:59 by admin]: m','2026-10-30 12:31:47','2026-10-30 12:59:46'),(23,'ADM-2026-9961','sharan','yalappa','2345678987','6360707645',NULL,'sharanappagouda148@gmail.com','10th Standard','Karnataka State Board','SCIENCE','PCMB','2026-27','Homepage quick enquiry','koppal','444566','yashwanth','REJECTED','Online enquiry submitted on 30-Oct-2026 23:43','2026-10-30 12:43:45','2026-10-30 12:58:35'),(24,'ADM-2026-3748','ganga','sharan','3456789097','3456789097',NULL,'rdrttdy@gmail.com','10th Standard','Karnataka State Board','SCIENCE','PCMB','2026-27','Homepage quick enquiry','vijayapur','456789','ravi','NEW','Online enquiry submitted on 31-Oct-2026 00:02','2026-10-30 13:02:01','2026-10-30 13:02:01'),(25,'ADM-2026-8848','uday','nagaraj','9876543243','9876543243',NULL,'abceds@gmail.com','10th Standard','Karnataka State Board','SCIENCE','PCMB','2026-27','Homepage quick enquiry','tumakur','23456','ravi','REJECTED','Online enquiry submitted on 31-Oct-2026 19:01','2026-10-31 08:01:19','2026-10-31 08:02:39'),(26,'ADM-2026-6590','Aarav Sharma','Dev Sharma','9876543210','9876543211',NULL,'sharanappagoudapolicepatil60@gmail.com','10th Standard','CBSE','SCIENCE','PCMB','2026-27','Interested in NEET integrated batch','123, 4th Cross, Malleshwaram, Bengaluru','560003','School Exhibition','APPLICATION_RECEIVED','Online enquiry submitted on 31-Oct-2026 19:25\n[31-Oct-2026 19:28 by admin]: Seat confirmed for PCMB integrated batch. Welcome to Sri Vidyodaya PU College!','2026-10-31 08:25:11','2026-10-31 08:34:35'),(27,'ADM-2026-2079','Pooja Patil','Mallikarjun Patil','9876543210','9876543211','parent.patil@gmail.com','sharanappagoudapolicepatil60@gmail.com','10th Standard','Karnataka State Board','SCIENCE','PCMB','2026-27','Enquiring about hostel and coaching','Plot 42, Green Avenue, Raichur','584101','Mr. Basavaraj / College Alumnus','REJECTED','Online enquiry submitted on 31-Oct-2026 23:25\n[31-Oct-2026 23:26 by admin]: Please submit 10th marks card copy and transfer certificate.','2026-10-31 12:25:55','2026-10-31 12:56:09'),(28,'ADM-2026-6156','sharanappagouda','basanagouda','9743988354','2345678987',NULL,'sharanappagouda148@gmail.com','10th Standard','Karnataka State Board','SCIENCE','PCMB','2026-27','Homepage quick enquiry','gadaga','34567','anush','COUNSELLING_SCHEDULED','Online enquiry submitted on 31-Oct-2026 23:58','2026-10-31 12:58:43','2026-10-31 13:01:44'),(37,'ADM-2026-9337','gavi','nagappa','7684553234','7684553234','sharanappagouda148@gmail.com','sharanappagouda148@gmail.com','10th Standard','ICSE','SCIENCE','PCMC','2026-27','admission','bengaluru','23432','anush','NEW','Online enquiry submitted on 07-Nov-2026 10:00','2026-11-06 23:00:56','2026-11-06 23:00:56');
/*!40000 ALTER TABLE `admission_enquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `application_documents`
--

DROP TABLE IF EXISTS `application_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `application_documents` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `application_id` bigint NOT NULL,
  `document_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `document_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_size` bigint DEFAULT NULL,
  `file_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_app_docs_app` (`application_id`),
  CONSTRAINT `fk_app_docs_app` FOREIGN KEY (`application_id`) REFERENCES `admission_applications` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_documents`
--

LOCK TABLES `application_documents` WRITE;
/*!40000 ALTER TABLE `application_documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `application_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `audit_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `module` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `details` text COLLATE utf8mb4_unicode_ci,
  `ip_address` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=273 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,'SYSTEM','SYSTEM_INITIALIZATION','DATABASE','Initialized database schema and seeded baseline PU college academic content','127.0.0.1','2026-10-26 13:47:49'),(5,'STUDENT_APPLICANT','SUBMIT_ENQUIRY','ADMISSIONS','Submitted admission enquiry ref: ADM-2026-7704','127.0.0.1','2026-10-26 08:22:43'),(6,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-26 08:29:29'),(7,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-26 08:30:59'),(8,'admin','CREATE_COURSE','COURSES','Code: PCME','127.0.0.1','2026-10-26 08:30:59'),(9,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-26 08:33:34'),(10,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-26 08:34:24'),(11,'admin','UPDATE_COURSE','COURSES','Code: PCME','127.0.0.1','2026-10-26 08:34:24'),(12,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-26 08:34:47'),(13,'admin','DELETE_COURSE','COURSES','Deleted course ID: 7','127.0.0.1','2026-10-26 08:34:47'),(14,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-26 08:35:43'),(15,'admin','CREATE_COURSE','COURSES','Code: PCME','127.0.0.1','2026-10-26 08:35:43'),(16,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-26 08:43:05'),(17,'admin','DELETE_COURSE','COURSES','Deleted course ID: 8','127.0.0.1','2026-10-26 08:43:05'),(18,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-26 08:43:19'),(19,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-26 08:46:03'),(23,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-26 09:03:34'),(24,'VISITOR','SUBMIT_CONTACT_FORM','CONTACT','Subject: fees pending','127.0.0.1','2026-10-26 09:05:45'),(25,'admin','UPDATE_STATUS','ADMISSIONS','Updated enquiry ADM-2026-1001 status from NEW to REJECTED','127.0.0.1','2026-10-26 09:07:38'),(26,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-27 08:17:39'),(27,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_badge_text','127.0.0.1','2026-10-27 08:34:59'),(28,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_name','127.0.0.1','2026-10-27 08:34:59'),(29,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_title_line','127.0.0.1','2026-10-27 08:34:59'),(30,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_photo_url','127.0.0.1','2026-10-27 08:34:59'),(31,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_quote','127.0.0.1','2026-10-27 08:34:59'),(32,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_cta_text','127.0.0.1','2026-10-27 08:34:59'),(33,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_cta_link','127.0.0.1','2026-10-27 08:34:59'),(34,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_accolade','127.0.0.1','2026-10-27 08:34:59'),(35,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_full_message','127.0.0.1','2026-10-27 08:34:59'),(36,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_desk_enabled','127.0.0.1','2026-10-27 08:34:59'),(37,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_badge_text','127.0.0.1','2026-10-27 08:35:02'),(38,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_name','127.0.0.1','2026-10-27 08:35:02'),(39,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_title_line','127.0.0.1','2026-10-27 08:35:02'),(40,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_photo_url','127.0.0.1','2026-10-27 08:35:02'),(41,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_quote','127.0.0.1','2026-10-27 08:35:02'),(42,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_cta_text','127.0.0.1','2026-10-27 08:35:02'),(43,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_cta_link','127.0.0.1','2026-10-27 08:35:02'),(44,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_accolade','127.0.0.1','2026-10-27 08:35:02'),(45,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_full_message','127.0.0.1','2026-10-27 08:35:02'),(46,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_desk_enabled','127.0.0.1','2026-10-27 08:35:02'),(47,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-28 08:43:12'),(48,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-28 09:17:46'),(49,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-28 10:06:32'),(50,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_badge_text','127.0.0.1','2026-10-28 10:08:21'),(51,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_name','127.0.0.1','2026-10-28 10:08:21'),(52,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_title_line','127.0.0.1','2026-10-28 10:08:21'),(53,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_photo_url','127.0.0.1','2026-10-28 10:08:21'),(54,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_quote','127.0.0.1','2026-10-28 10:08:21'),(55,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_cta_text','127.0.0.1','2026-10-28 10:08:21'),(56,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_cta_link','127.0.0.1','2026-10-28 10:08:21'),(57,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_accolade','127.0.0.1','2026-10-28 10:08:21'),(58,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_full_message','127.0.0.1','2026-10-28 10:08:21'),(59,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_desk_enabled','127.0.0.1','2026-10-28 10:08:21'),(60,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_badge_text','127.0.0.1','2026-10-28 10:08:38'),(61,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_name','127.0.0.1','2026-10-28 10:08:38'),(62,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_title_line','127.0.0.1','2026-10-28 10:08:38'),(63,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_photo_url','127.0.0.1','2026-10-28 10:08:38'),(64,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_quote','127.0.0.1','2026-10-28 10:08:38'),(65,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_cta_text','127.0.0.1','2026-10-28 10:08:38'),(66,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_cta_link','127.0.0.1','2026-10-28 10:08:38'),(67,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_accolade','127.0.0.1','2026-10-28 10:08:38'),(68,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_full_message','127.0.0.1','2026-10-28 10:08:38'),(69,'admin','UPDATE_SETTING','SETTINGS','Updated key: principal_desk_enabled','127.0.0.1','2026-10-28 10:08:38'),(70,'admin','UPDATE_SETTING','SETTINGS','Updated key: navbar_brand_name','127.0.0.1','2026-10-28 10:09:39'),(71,'admin','UPDATE_SETTING','SETTINGS','Updated key: navbar_brand_sub','127.0.0.1','2026-10-28 10:09:39'),(72,'admin','UPDATE_SETTING','SETTINGS','Updated key: navbar_brand_tagline','127.0.0.1','2026-10-28 10:09:39'),(73,'admin','UPDATE_SETTING','SETTINGS','Updated key: college_name','127.0.0.1','2026-10-28 10:09:39'),(74,'admin','UPDATE_SETTING','SETTINGS','Updated key: college_short_name','127.0.0.1','2026-10-28 10:09:39'),(75,'admin','UPDATE_SETTING','SETTINGS','Updated key: college_code','127.0.0.1','2026-10-28 10:09:39'),(76,'admin','UPDATE_SETTING','SETTINGS','Updated key: navbar_brand_name','127.0.0.1','2026-10-28 10:10:05'),(77,'admin','UPDATE_SETTING','SETTINGS','Updated key: navbar_brand_sub','127.0.0.1','2026-10-28 10:10:05'),(78,'admin','UPDATE_SETTING','SETTINGS','Updated key: navbar_brand_tagline','127.0.0.1','2026-10-28 10:10:05'),(79,'admin','UPDATE_SETTING','SETTINGS','Updated key: college_name','127.0.0.1','2026-10-28 10:10:05'),(80,'admin','UPDATE_SETTING','SETTINGS','Updated key: college_short_name','127.0.0.1','2026-10-28 10:10:05'),(81,'admin','UPDATE_SETTING','SETTINGS','Updated key: college_code','127.0.0.1','2026-10-28 10:10:05'),(82,'admin','UPDATE_SETTING','SETTINGS','Updated key: navbar_brand_name','127.0.0.1','2026-10-28 10:10:11'),(83,'admin','UPDATE_SETTING','SETTINGS','Updated key: navbar_brand_sub','127.0.0.1','2026-10-28 10:10:11'),(84,'admin','UPDATE_SETTING','SETTINGS','Updated key: navbar_brand_tagline','127.0.0.1','2026-10-28 10:10:11'),(85,'admin','UPDATE_SETTING','SETTINGS','Updated key: college_name','127.0.0.1','2026-10-28 10:10:11'),(86,'admin','UPDATE_SETTING','SETTINGS','Updated key: college_short_name','127.0.0.1','2026-10-28 10:10:11'),(87,'admin','UPDATE_SETTING','SETTINGS','Updated key: college_code','127.0.0.1','2026-10-28 10:10:11'),(88,'admin','UPDATE_SETTING','SETTINGS','Updated key: navbar_brand_name','127.0.0.1','2026-10-28 10:10:17'),(89,'admin','UPDATE_SETTING','SETTINGS','Updated key: navbar_brand_sub','127.0.0.1','2026-10-28 10:10:17'),(90,'admin','UPDATE_SETTING','SETTINGS','Updated key: navbar_brand_tagline','127.0.0.1','2026-10-28 10:10:17'),(91,'admin','UPDATE_SETTING','SETTINGS','Updated key: college_name','127.0.0.1','2026-10-28 10:10:17'),(92,'admin','UPDATE_SETTING','SETTINGS','Updated key: college_short_name','127.0.0.1','2026-10-28 10:10:17'),(93,'admin','UPDATE_SETTING','SETTINGS','Updated key: college_code','127.0.0.1','2026-10-28 10:10:17'),(94,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-29 10:05:14'),(95,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-29 10:08:09'),(96,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-29 10:41:42'),(97,'STUDENT_APPLICANT','SUBMIT_ENQUIRY','ADMISSIONS','Submitted admission enquiry ref: ADM-2026-1084','127.0.0.1','2026-10-29 10:41:52'),(98,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-29 10:42:03'),(99,'admin','UPDATE_GOOGLE_SHEETS_CONFIG','SETTINGS','Updated Google Spreadsheet integration config for Sharanappagouda148@gmail.com','127.0.0.1','2026-10-29 10:42:03'),(100,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-29 10:42:15'),(101,'admin','UPDATE_GOOGLE_SHEETS_CONFIG','SETTINGS','Updated Google Spreadsheet integration config for Sharanappagouda148@gmail.com','127.0.0.1','2026-10-29 10:42:15'),(102,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-29 11:03:36'),(103,'admin','UPDATE_GOOGLE_SHEETS_CONFIG','SETTINGS','Updated Google Spreadsheet integration config for Sharanappagouda148@gmail.com','127.0.0.1','2026-10-29 11:03:55'),(104,'admin','UPDATE_GOOGLE_SHEETS_CONFIG','SETTINGS','Updated Google Spreadsheet integration config for Sharanappagouda148@gmail.com','127.0.0.1','2026-10-29 11:06:11'),(105,'admin','UPDATE_GOOGLE_SHEETS_CONFIG','SETTINGS','Updated Google Spreadsheet integration config for Sharanappagouda148@gmail.com','127.0.0.1','2026-10-29 11:07:24'),(106,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-29 11:45:17'),(107,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-29 11:47:10'),(108,'admin','UPDATE_GOOGLE_SHEETS_CONFIG','SETTINGS','Updated Google Spreadsheet integration config for Sharanappagouda148@gmail.com','127.0.0.1','2026-10-29 11:47:10'),(109,'admin','UPDATE_GOOGLE_SHEETS_CONFIG','SETTINGS','Updated Google Spreadsheet integration config for Sharanappagouda148@gmail.com','127.0.0.1','2026-10-29 12:04:16'),(110,'admin','UPDATE_GOOGLE_SHEETS_CONFIG','SETTINGS','Updated Google Spreadsheet integration config for Sharanappagouda148@gmail.com','127.0.0.1','2026-10-29 12:09:44'),(111,'admin','UPDATE_GOOGLE_SHEETS_CONFIG','SETTINGS','Updated Google Spreadsheet integration config for Sharanappagouda148@gmail.com','127.0.0.1','2026-10-29 12:15:34'),(112,'admin','UPDATE_GOOGLE_SHEETS_CONFIG','SETTINGS','Updated Google Spreadsheet integration config for Sharanappagouda148@gmail.com','127.0.0.1','2026-10-29 12:16:34'),(113,'admin','UPDATE_GOOGLE_SHEETS_CONFIG','SETTINGS','Updated Google Spreadsheet integration config for Sharanappagouda148@gmail.com','127.0.0.1','2026-10-29 12:20:01'),(114,'admin','UPDATE_GOOGLE_SHEETS_CONFIG','SETTINGS','Updated Google Spreadsheet integration config for Sharanappagouda148@gmail.com','127.0.0.1','2026-10-29 12:21:17'),(115,'STUDENT_APPLICANT','SUBMIT_ENQUIRY','ADMISSIONS','Submitted admission enquiry ref: ADM-2026-7959','127.0.0.1','2026-10-29 12:23:47'),(116,'SYSTEM','GOOGLE_SHEETS_FORWARD','ADMISSIONS','Forwarded enquiry ADM-2026-7959 to Google Spreadsheet','127.0.0.1','2026-10-29 12:23:49'),(117,'admin','UPDATE_GOOGLE_SHEETS_CONFIG','SETTINGS','Updated Google Spreadsheet integration config for Sharanappagouda148@gmail.com','127.0.0.1','2026-10-29 12:26:06'),(118,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-29 12:26:29'),(119,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-29 12:31:12'),(120,'admin','UPDATE_GOOGLE_SHEETS_CONFIG','SETTINGS','Updated Google Spreadsheet integration config for Sharanappagouda148@gmail.com','127.0.0.1','2026-10-29 12:46:29'),(121,'admin','UPDATE_GOOGLE_SHEETS_CONFIG','SETTINGS','Updated Google Spreadsheet integration config for Sharanappagouda148@gmail.com','127.0.0.1','2026-10-29 13:02:56'),(122,'admin','UPDATE_GOOGLE_SHEETS_CONFIG','SETTINGS','Updated Google Spreadsheet integration config for Sharanappagouda148@gmail.com','127.0.0.1','2026-10-29 13:10:51'),(123,'STUDENT_APPLICANT','SUBMIT_ENQUIRY','ADMISSIONS','Submitted admission enquiry ref: ADM-2026-1138','127.0.0.1','2026-10-29 13:11:58'),(124,'SYSTEM','GOOGLE_SHEETS_FORWARD','ADMISSIONS','Forwarded enquiry ADM-2026-1138 to Google Spreadsheet','127.0.0.1','2026-10-29 13:12:01'),(125,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-30 08:48:59'),(126,'admin','UPDATE_SETTING','SETTINGS','Updated key: navbar_brand_name','127.0.0.1','2026-10-30 08:49:36'),(127,'admin','UPDATE_SETTING','SETTINGS','Updated key: navbar_brand_sub','127.0.0.1','2026-10-30 08:49:36'),(128,'admin','UPDATE_SETTING','SETTINGS','Updated key: navbar_brand_tagline','127.0.0.1','2026-10-30 08:49:36'),(129,'admin','UPDATE_SETTING','SETTINGS','Updated key: college_name','127.0.0.1','2026-10-30 08:49:36'),(130,'admin','UPDATE_SETTING','SETTINGS','Updated key: college_short_name','127.0.0.1','2026-10-30 08:49:36'),(131,'admin','UPDATE_SETTING','SETTINGS','Updated key: college_code','127.0.0.1','2026-10-30 08:49:36'),(132,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-30 08:53:55'),(133,'admin','UPDATE_SETTING','SETTINGS','Updated key: navbar_brand_name','127.0.0.1','2026-10-30 08:53:56'),(134,'admin','UPDATE_SETTING','SETTINGS','Updated key: navbar_brand_sub','127.0.0.1','2026-10-30 08:53:56'),(135,'admin','UPDATE_SETTING','SETTINGS','Updated key: college_name','127.0.0.1','2026-10-30 08:53:56'),(136,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-30 08:59:57'),(137,'admin','UPDATE_SETTINGS_BATCH','SETTINGS','Batch updated 3 settings','127.0.0.1','2026-10-30 08:59:58'),(138,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-30 09:01:43'),(139,'admin','UPDATE_SETTINGS_BATCH','SETTINGS','Batch updated 3 settings','127.0.0.1','2026-10-30 09:01:43'),(140,'admin','UPDATE_SETTINGS_BATCH','SETTINGS','Batch updated 6 settings','127.0.0.1','2026-10-30 09:03:34'),(141,'STUDENT_APPLICANT','SUBMIT_ENQUIRY','ADMISSIONS','Submitted admission enquiry ref: ADM-2026-8211','127.0.0.1','2026-10-30 09:20:50'),(142,'SYSTEM','GOOGLE_SHEETS_FORWARD','ADMISSIONS','Forwarded enquiry ADM-2026-8211 to Google Spreadsheet','127.0.0.1','2026-10-30 09:20:54'),(143,'STUDENT_APPLICANT','SUBMIT_ENQUIRY','ADMISSIONS','Submitted admission enquiry ref: ADM-2026-2182','127.0.0.1','2026-10-30 09:24:53'),(144,'SYSTEM','GOOGLE_SHEETS_FORWARD','ADMISSIONS','Forwarded enquiry ADM-2026-2182 to Google Spreadsheet','127.0.0.1','2026-10-30 09:24:56'),(145,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-30 09:29:02'),(146,'STUDENT_APPLICANT','SUBMIT_ENQUIRY','ADMISSIONS','Submitted admission enquiry ref: ADM-2026-3921','127.0.0.1','2026-10-30 09:29:22'),(147,'SYSTEM','GOOGLE_SHEETS_FORWARD','ADMISSIONS','Forwarded enquiry ADM-2026-3921 to Google Spreadsheet','127.0.0.1','2026-10-30 09:29:26'),(148,'admin','UPDATE_GOOGLE_SHEETS_CONFIG','SETTINGS','Updated Google Spreadsheet integration config for Sharanappagouda148@gmail.com','127.0.0.1','2026-10-30 09:33:40'),(149,'STUDENT_APPLICANT','SUBMIT_ENQUIRY','ADMISSIONS','Submitted admission enquiry ref: ADM-2026-2704','127.0.0.1','2026-10-30 09:35:23'),(150,'SYSTEM','GOOGLE_SHEETS_FORWARD','ADMISSIONS','Forwarded enquiry ADM-2026-2704 to Google Spreadsheet','127.0.0.1','2026-10-30 09:35:26'),(151,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-30 09:35:59'),(152,'STUDENT_APPLICANT','SUBMIT_ENQUIRY','ADMISSIONS','Submitted admission enquiry ref: ADM-2026-5014','127.0.0.1','2026-10-30 10:13:06'),(153,'SYSTEM','GOOGLE_SHEETS_FORWARD','ADMISSIONS','Forwarded enquiry ADM-2026-5014 to Google Spreadsheet','127.0.0.1','2026-10-30 10:13:10'),(154,'STUDENT_APPLICANT','SUBMIT_ENQUIRY','ADMISSIONS','Submitted admission enquiry ref: ADM-2026-7019','127.0.0.1','2026-10-30 10:19:25'),(155,'SYSTEM','GOOGLE_SHEETS_FORWARD','ADMISSIONS','Forwarded enquiry ADM-2026-7019 to Google Spreadsheet','127.0.0.1','2026-10-30 10:19:28'),(156,'STUDENT_APPLICANT','SUBMIT_ENQUIRY','ADMISSIONS','Submitted admission enquiry ref: ADM-2026-7843','127.0.0.1','2026-10-30 10:26:20'),(157,'SYSTEM','GOOGLE_SHEETS_FORWARD','ADMISSIONS','Forwarded enquiry ADM-2026-7843 to Google Spreadsheet','127.0.0.1','2026-10-30 10:26:24'),(158,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-30 10:39:33'),(159,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-30 10:41:44'),(160,'STUDENT_APPLICANT','SUBMIT_ENQUIRY','ADMISSIONS','Submitted admission enquiry ref: ADM-2026-6597','127.0.0.1','2026-10-30 10:49:17'),(161,'SYSTEM','GOOGLE_SHEETS_FORWARD','ADMISSIONS','Forwarded enquiry ADM-2026-6597 to Google Spreadsheet','127.0.0.1','2026-10-30 10:49:20'),(162,'STUDENT_APPLICANT','SUBMIT_ENQUIRY','ADMISSIONS','Submitted admission enquiry ref: ADM-2026-8218','127.0.0.1','2026-10-30 11:06:45'),(163,'SYSTEM','GOOGLE_SHEETS_FORWARD','ADMISSIONS','Forwarded enquiry ADM-2026-8218 to Google Spreadsheet','127.0.0.1','2026-10-30 11:06:47'),(164,'STUDENT_APPLICANT','SUBMIT_ENQUIRY','ADMISSIONS','Submitted admission enquiry ref: ADM-2026-7267','127.0.0.1','2026-10-30 12:31:47'),(165,'SYSTEM','GOOGLE_SHEETS_FORWARD','ADMISSIONS','Forwarded enquiry ADM-2026-7267 to Google Spreadsheet','127.0.0.1','2026-10-30 12:31:53'),(166,'STUDENT_APPLICANT','SUBMIT_ENQUIRY','ADMISSIONS','Submitted admission enquiry ref: ADM-2026-9961','127.0.0.1','2026-10-30 12:43:45'),(167,'SYSTEM','GOOGLE_SHEETS_FORWARD','ADMISSIONS','Forwarded enquiry ADM-2026-9961 to Google Spreadsheet','127.0.0.1','2026-10-30 12:43:48'),(168,'admin','UPDATE_GOOGLE_SHEETS_CONFIG','SETTINGS','Updated Google Spreadsheet integration config for sharanappagoudapolicepatil60@gmail.com','127.0.0.1','2026-10-30 12:57:44'),(169,'admin','UPDATE_STATUS','ADMISSIONS','Updated enquiry ADM-2026-9961 status from NEW to REJECTED','127.0.0.1','2026-10-30 12:58:35'),(170,'admin','UPDATE_STATUS','ADMISSIONS','Updated enquiry ADM-2026-9961 status from REJECTED to REJECTED','127.0.0.1','2026-10-30 12:58:39'),(171,'admin','UPDATE_STATUS','ADMISSIONS','Updated enquiry ADM-2026-7267 status from NEW to CLOSED','127.0.0.1','2026-10-30 12:59:46'),(172,'STUDENT_APPLICANT','SUBMIT_ENQUIRY','ADMISSIONS','Submitted admission enquiry ref: ADM-2026-3748','127.0.0.1','2026-10-30 13:02:01'),(173,'admin','UPDATE_GOOGLE_SHEETS_CONFIG','SETTINGS','Updated Google Spreadsheet integration config for sharanappagoudapolicepatil60@gmail.com','127.0.0.1','2026-10-30 13:16:09'),(174,'admin','UPDATE_GOOGLE_SHEETS_CONFIG','SETTINGS','Updated Google Spreadsheet integration config for sharanappagoudapolicepatil60@gmail.com','127.0.0.1','2026-10-30 13:22:10'),(175,'STUDENT_APPLICANT','SUBMIT_ENQUIRY','ADMISSIONS','Submitted admission enquiry ref: ADM-2026-8848','127.0.0.1','2026-10-31 08:01:19'),(176,'SYSTEM','GOOGLE_SHEETS_FORWARD','ADMISSIONS','Forwarded enquiry ADM-2026-8848 to Google Spreadsheet','127.0.0.1','2026-10-31 08:01:23'),(177,'admin','UPDATE_STATUS','ADMISSIONS','Updated enquiry ADM-2026-8848 status from NEW to REJECTED','127.0.0.1','2026-10-31 08:02:39'),(178,'admin','UPDATE_STATUS','ADMISSIONS','Updated enquiry ADM-2026-2704 status from NEW to UNDER_REVIEW','127.0.0.1','2026-10-31 08:04:02'),(179,'STUDENT_APPLICANT','SUBMIT_ENQUIRY','ADMISSIONS','Submitted admission enquiry ref: ADM-2026-6590','127.0.0.1','2026-10-31 08:25:11'),(180,'SYSTEM','GOOGLE_SHEETS_FORWARD','ADMISSIONS','Forwarded enquiry ADM-2026-6590 to Google Spreadsheet','127.0.0.1','2026-10-31 08:25:18'),(181,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-31 08:28:26'),(182,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-31 08:28:41'),(183,'admin','UPDATE_STATUS','ADMISSIONS','Updated enquiry ADM-2026-6590 status from NEW to ADMITTED','127.0.0.1','2026-10-31 08:28:41'),(184,'SYSTEM','GOOGLE_SHEETS_STATUS_UPDATE','ADMISSIONS','Dispatched status update for ADM-2026-6590 (ADMITTED) to Google Sheets','127.0.0.1','2026-10-31 08:28:48'),(185,'admin','UPDATE_GOOGLE_SHEETS_CONFIG','SETTINGS','Updated Google Spreadsheet integration config for sharanappagoudapolicepatil60@gmail.com','127.0.0.1','2026-10-31 08:33:10'),(186,'admin','UPDATE_STATUS','ADMISSIONS','Updated enquiry ADM-2026-6590 status from ADMITTED to APPLICATION_RECEIVED','127.0.0.1','2026-10-31 08:34:35'),(187,'SYSTEM','GOOGLE_SHEETS_STATUS_UPDATE','ADMISSIONS','Dispatched status update for ADM-2026-6590 (APPLICATION_RECEIVED) to Google Sheets','127.0.0.1','2026-10-31 08:34:38'),(188,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-31 11:52:22'),(189,'STUDENT_APPLICANT','SUBMIT_ENQUIRY','ADMISSIONS','Submitted admission enquiry ref: ADM-2026-2079','127.0.0.1','2026-10-31 12:25:55'),(190,'SYSTEM','GOOGLE_SHEETS_FORWARD','ADMISSIONS','Forwarded enquiry ADM-2026-2079 to Google Spreadsheet','127.0.0.1','2026-10-31 12:25:58'),(191,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-10-31 12:26:03'),(192,'admin','UPDATE_STATUS','ADMISSIONS','Updated enquiry ADM-2026-2079 status from NEW to DOCUMENTS_PENDING','127.0.0.1','2026-10-31 12:26:22'),(193,'SYSTEM','GOOGLE_SHEETS_STATUS_UPDATE','ADMISSIONS','Dispatched status update for ADM-2026-2079 (DOCUMENTS_PENDING) to Google Sheets','127.0.0.1','2026-10-31 12:26:25'),(194,'ADMIN','DIRECT_MESSAGE_APPS_SCRIPT','COMMUNICATIONS','Forwarded direct message for sharanappagoudapolicepatil60@gmail.com to Google Apps Script','127.0.0.1','2026-10-31 12:43:51'),(195,'admin','UPDATE_GOOGLE_SHEETS_CONFIG','SETTINGS','Updated Google Spreadsheet integration config for sharanappagoudapolicepatil60@gmail.com','127.0.0.1','2026-10-31 12:52:06'),(196,'ADMIN','DIRECT_MESSAGE_APPS_SCRIPT','COMMUNICATIONS','Forwarded direct message for sharanappagouda148@gmail.com to Google Apps Script','127.0.0.1','2026-10-31 12:54:26'),(197,'admin','UPDATE_STATUS','ADMISSIONS','Updated enquiry ADM-2026-2079 status from DOCUMENTS_PENDING to REJECTED','127.0.0.1','2026-10-31 12:56:09'),(198,'SYSTEM','GOOGLE_SHEETS_STATUS_UPDATE','ADMISSIONS','Dispatched status update for ADM-2026-2079 (REJECTED) to Google Sheets','127.0.0.1','2026-10-31 12:56:12'),(199,'admin','UPDATE_STATUS','ADMISSIONS','Updated enquiry ADM-2026-2079 status from REJECTED to REJECTED','127.0.0.1','2026-10-31 12:56:15'),(200,'SYSTEM','GOOGLE_SHEETS_STATUS_UPDATE','ADMISSIONS','Dispatched status update for ADM-2026-2079 (REJECTED) to Google Sheets','127.0.0.1','2026-10-31 12:56:17'),(201,'STUDENT_APPLICANT','SUBMIT_ENQUIRY','ADMISSIONS','Submitted admission enquiry ref: ADM-2026-6156','127.0.0.1','2026-10-31 12:58:43'),(202,'SYSTEM','GOOGLE_SHEETS_FORWARD','ADMISSIONS','Forwarded enquiry ADM-2026-6156 to Google Spreadsheet','127.0.0.1','2026-10-31 12:58:46'),(203,'admin','UPDATE_STATUS','ADMISSIONS','Updated enquiry ADM-2026-6156 status from NEW to COUNSELLING_SCHEDULED','127.0.0.1','2026-10-31 13:01:44'),(204,'SYSTEM','GOOGLE_SHEETS_STATUS_UPDATE','ADMISSIONS','Dispatched status update for ADM-2026-6156 (COUNSELLING_SCHEDULED) to Google Sheets','127.0.0.1','2026-10-31 13:01:49'),(205,'admin','UPDATE_GOOGLE_SHEETS_CONFIG','SETTINGS','Updated Google Spreadsheet integration config for sharanappagoudapolicepatil60@gmail.com','127.0.0.1','2026-10-31 13:12:33'),(206,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-11-02 07:47:46'),(207,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-11-02 08:15:36'),(208,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-11-02 08:16:12'),(209,'admin','ADD_GALLERY_IMAGE','GALLERY','Added: Smart Digital Seminar Hall','127.0.0.1','2026-11-02 08:16:12'),(210,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-11-02 08:19:46'),(211,'admin','CREATE_BANNER','BANNERS','Title: sharanappagouda','127.0.0.1','2026-11-02 08:32:03'),(212,'admin','UPDATE_BANNER','BANNERS','Title: sharanappagouda','127.0.0.1','2026-11-02 08:33:17'),(213,'admin','UPDATE_BANNER','BANNERS','Title: sharanappagouda','127.0.0.1','2026-11-02 08:48:35'),(214,'admin','UPDATE_BANNER','BANNERS','Title: sharanappagouda','127.0.0.1','2026-11-02 08:48:43'),(215,'admin','ADD_GALLERY_IMAGE','GALLERY','Added: ggggg','127.0.0.1','2026-11-02 09:59:41'),(216,'admin','ADD_GALLERY_IMAGE','GALLERY','Added: hhh','127.0.0.1','2026-11-02 10:01:14'),(217,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-11-02 10:09:24'),(218,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-11-02 10:12:28'),(219,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-11-02 10:12:39'),(220,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-11-02 10:26:43'),(221,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-11-02 10:28:52'),(222,'admin','UPDATE_GALLERY_IMAGE','GALLERY','Updated: Majestic Campus Quadranglejjj','127.0.0.1','2026-11-02 10:29:24'),(223,'admin','UPDATE_GALLERY_IMAGE','GALLERY','Updated: ggggg','127.0.0.1','2026-11-02 10:30:40'),(224,'admin','CREATE_FACULTY','FACULTY','Name: sharanappagouda','127.0.0.1','2026-11-02 10:36:12'),(225,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-11-03 11:02:48'),(226,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-11-04 11:03:34'),(227,'admin','UPDATE_SETTINGS_BATCH','SETTINGS','Batch updated 6 settings','127.0.0.1','2026-11-05 09:20:15'),(228,'admin','CREATE_EXAMINATION','EXAMINATIONS','Exam: hhh (2027-28)','127.0.0.1','2026-11-05 09:26:56'),(229,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-11-05 09:35:07'),(230,'admin','CREATE_CALENDAR_EVENT','CALENDAR','Title: www','127.0.0.1','2026-11-05 10:01:04'),(231,'admin','CREATE_CALENDAR_EVENT','CALENDAR','Title: www','127.0.0.1','2026-11-05 10:01:28'),(232,'admin','CREATE_NEWS','NEWS','Title: sharanappagouda','127.0.0.1','2026-11-05 10:11:03'),(233,'admin','CREATE_NOTICE','NOTICES','Title: divali','127.0.0.1','2026-11-05 10:12:04'),(234,'admin','CREATE_EVENT','EVENTS','Title: dance','127.0.0.1','2026-11-05 10:17:08'),(235,'admin','UPDATE_BANNER','BANNERS','Title: sharanappagouda','127.0.0.1','2026-11-05 10:18:28'),(236,'admin','CREATE_TESTIMONIAL','TESTIMONIALS','Student: shankar (Batch of 2025)','127.0.0.1','2026-11-05 10:19:26'),(237,'admin','CREATE_FACILITY','FACILITIES','Title: food','127.0.0.1','2026-11-05 10:22:12'),(238,'admin','DELETE_FACILITY','FACILITIES','Deleted facility ID: 2','127.0.0.1','2026-11-05 10:22:32'),(239,'admin','UPDATE_SETTINGS_BATCH','SETTINGS','Batch updated 10 settings','127.0.0.1','2026-11-05 10:24:49'),(240,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-11-05 11:05:48'),(241,'admin','CREATE_NOTICE','NOTICES','Title: jjjj','127.0.0.1','2026-11-05 11:06:31'),(242,'admin','DELETE_NOTICE','NOTICES','Deleted notice ID: 1','127.0.0.1','2026-11-05 11:07:34'),(243,'admin','DELETE_NOTICE','NOTICES','Deleted notice ID: 4','127.0.0.1','2026-11-05 11:07:38'),(244,'admin','DELETE_NOTICE','NOTICES','Deleted notice ID: 3','127.0.0.1','2026-11-05 11:07:44'),(245,'admin','UPDATE_NOTICE','NOTICES','Title: divali','127.0.0.1','2026-11-05 11:07:48'),(258,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-11-06 22:56:02'),(259,'admin','ADD_GALLERY_IMAGE','GALLERY','Added: lab','127.0.0.1','2026-11-06 22:58:08'),(260,'STUDENT_APPLICANT','SUBMIT_ENQUIRY','ADMISSIONS','Submitted admission enquiry ref: ADM-2026-9337','127.0.0.1','2026-11-06 23:00:56'),(261,'SYSTEM','GOOGLE_SHEETS_FORWARD','ADMISSIONS','Forwarded enquiry ADM-2026-9337 to Google Spreadsheet','127.0.0.1','2026-11-06 23:00:59'),(262,'admin','UPDATE_SETTINGS_BATCH','SETTINGS','Batch updated 6 settings','127.0.0.1','2026-11-06 23:03:06'),(263,'admin','UPDATE_BANNER','BANNERS','Title: sharanappagouda','127.0.0.1','2026-11-06 23:10:12'),(264,'admin','CREATE_BANNER','BANNERS','Title: photo_5_to_10KB','127.0.0.1','2026-11-07 00:35:30'),(265,'admin','UPDATE_NOTICE','NOTICES','Title: divali','127.0.0.1','2026-11-07 10:20:53'),(266,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-11-11 07:19:23'),(267,'admin','DELETE_BANNER','BANNERS','Deleted banner: photo_5_to_10KB','127.0.0.1','2026-11-11 07:19:32'),(268,'admin','UPDATE_SETTINGS_BATCH','SETTINGS','Batch updated 36 settings','127.0.0.1','2026-11-11 11:48:53'),(269,'admin','UPDATE_SETTINGS_BATCH','SETTINGS','Batch updated 36 settings','127.0.0.1','2026-11-11 12:47:34'),(270,'admin','UPDATE_SETTINGS_BATCH','SETTINGS','Batch updated 36 settings','127.0.0.1','2026-11-11 12:47:57'),(271,'admin','LOGIN','AUTH','User successfully authenticated','127.0.0.1','2026-11-14 01:42:09'),(272,'admin','UPDATE_OWN_PROFILE','SECURITY_ACCOUNT','Updated profile info','127.0.0.1','2026-11-14 01:42:56');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `banners` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title_color` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT '#FFFFFF',
  `highlight_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `highlight_color` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT '#E6CA65',
  `subtitle_color` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT '#CBD5E1',
  `cta_text` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cta_link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_order` int DEFAULT '0',
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
INSERT INTO `banners` VALUES (1,'Building Strong Foundations for Engineering, Medicine & Corporate Leadership','Sri Vidyodaya Composite Pre-University College provides rigorous Karnataka State Pre-University board education integrated with premier coaching for KCET, NEET, JEE, and CA Foundation.','#FFFFFF','Engineering, Medicine & Corporate','#E6CA65','#CBD5E1','Apply For Admission','/admissions','https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80',1,1,'2026-10-26 13:47:49'),(2,'Integrated Coaching for KCET, NEET & JEE','Mentored by experienced faculty with consistent state rank records','#FFFFFF','KCET, NEET & JEE','#E6CA65','#CBD5E1','Explore Science Stream','/academics','https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80',2,1,'2026-10-26 13:47:49'),(3,'Excellence in Commerce, CA Foundation & Analytics','Equipping students with modern commerce, economics, and computational skills','#FFFFFF','Commerce, CA Foundation & Analytics','#E6CA65','#CBD5E1','Explore Commerce Stream','/academics','https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',3,1,'2026-10-26 13:47:49'),(4,'sharanappagouda','hi jhc','#93C5FD','ranapp','#E6CA65','#CBD5E1','','','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_AToL0j8s49dxxm19ZJthiWoS9gn2_iDHNXq8Mlvp-w&s=10',4,1,'2026-11-02 08:32:03');
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chatbot_faqs`
--

DROP TABLE IF EXISTS `chatbot_faqs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chatbot_faqs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `question` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'GENERAL',
  `keywords` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chatbot_faqs`
--

LOCK TABLES `chatbot_faqs` WRITE;
/*!40000 ALTER TABLE `chatbot_faqs` DISABLE KEYS */;
INSERT INTO `chatbot_faqs` VALUES (1,'What courses does the college offer?','Our college offers comprehensive 2-year Pre-University courses recognized by the Karnataka PU Board in two streams:\n\n1. **Science Stream**: PCMB (Physics, Chemistry, Mathematics, Biology) and PCMC (Physics, Chemistry, Mathematics, Computer Science).\n2. **Commerce Stream**: CEBA (Commerce, Economics, Business Studies, Accountancy), MEBA (Mathematics, Economics, Business Studies, Accountancy), and SEBA (Statistics, Economics, Business Studies, Accountancy).\n\nBoth streams feature integrated preparatory coaching for KCET, NEET, and JEE.','COURSES','courses,streams,combinations,puc,science,commerce,pcmb,pcmc,ceba,offerings,programs',1,1,'2026-10-27 14:59:11','2026-10-27 14:59:11'),(2,'What are the admission requirements and eligibility criteria?','Candidates applying for 1st PUC must have successfully passed the Karnataka SSLC Board Examination, CBSE Class 10, ICSE, or any recognized equivalent secondary school examination.\n\n- **Science Stream (PCMB/PCMC)**: Minimum 60% aggregate in 10th standard with strong performance in Mathematics and Science.\n- **Commerce Stream (CEBA/MEBA/SEBA)**: Minimum 50% aggregate in 10th standard.\n\nYou can fill out an online admission enquiry on our Admissions page or visit the admissions desk in person.','ADMISSIONS','admission,requirements,eligibility,criteria,marks,percentage,sslc,10th,cbse,icse,apply',2,1,'2026-10-27 14:59:11','2026-10-27 14:59:11'),(3,'Which Science combinations are available?','We offer two premier Science combinations:\n1. **PCMB** (Physics, Chemistry, Mathematics, Biology) – Tailored for medical, dental, veterinary, agriculture, biotechnology, and pure science careers.\n2. **PCMC** (Physics, Chemistry, Mathematics, Computer Science) – Optimized for engineering, computing, artificial intelligence, robotics, and physical sciences.\n\nBoth combinations include integrated coaching for KCET, NEET, and JEE.','COURSES','science,combinations,pcmb,pcmc,biology,computer science,engineering,medical,neet,kcet,jee',3,1,'2026-10-27 14:59:11','2026-10-27 14:59:11'),(4,'Which Commerce combinations are available?','We offer three modern Commerce combinations:\n1. **CEBA** (Computer Science, Economics, Business Studies, Accountancy)\n2. **MEBA** (Mathematics, Economics, Business Studies, Accountancy)\n3. **SEBA** (Statistics, Economics, Business Studies, Accountancy)\n\nThese combinations prepare students for CA Foundation, CS, CMA, B.Com, BBA, Data Analytics, and Corporate Finance.','COURSES','commerce,combinations,ceba,meba,seba,accountancy,business studies,economics,ca,cma,finance',4,1,'2026-10-27 14:59:11','2026-10-27 14:59:11'),(5,'What documents are required for admission?','The following documents are required at the time of admission verification:\n1. Original & copies of 10th Standard / SSLC Marks Card.\n2. Transfer Certificate (TC) issued by the previous school.\n3. Conduct / Study Certificate (spanning at least 7 years for Karnataka domicile quota).\n4. Aadhaar Card copy of the student and parent.\n5. Category / Caste / Income Certificate (if claiming reservation concessions).\n6. Four recent passport-sized color photographs.\n7. Migration Certificate (for students from non-Karnataka state boards or ICSE/CBSE).','ADMISSIONS','documents,required,certificates,tc,transfer certificate,marks card,sslc,aadhaar,photos,caste,income',5,1,'2026-10-27 14:59:11','2026-10-27 14:59:11'),(6,'What is the college fee structure and scholarship details?','The annual fee structure depends on the selected stream (Science / Commerce) and integrated coaching modules. Typical tuition ranges from ₹35,000 to ₹65,000 per annum.\n\nWe provide generous **Merit and Need-Based Scholarships**:\n- **Merit Concession**: 25% to 50% fee concession for students scoring >90% in 10th standard.\n- **Sports Endowment**: Fee waivers for state/national level athletes.\n- **Economic Weaker Section (EWS)**: Need-based financial grants.\n\nPlease contact our admissions office at +91 80 2345 6789 or visit the campus for exact fee quotes and installment options.','FEES','fee,fees,structure,tuition,cost,scholarships,concession,waiver,merit,installments,payment',6,1,'2026-10-27 14:59:11','2026-10-27 14:59:11'),(7,'What campus facilities are available?','Our campus features state-of-the-art educational infrastructure:\n- **Science Labs**: Advanced, fully equipped Physics, Chemistry, and Biology laboratories compliant with state board practical norms.\n- **Digital Computer Labs**: High-speed internet connected labs with latest software.\n- **Central Library**: Over 15,000 books, periodicals, competitive exam guides (NEET/JEE/CET), and digital e-resources.\n- **Sports & Recreation**: Dedicated sports complex with badminton, basketball, cricket nets, table tennis, and chess.\n- **Seminar Halls**: Audio-visual enabled auditoriums for academic seminars and cultural activities.\n- **Cafeteria**: Hygienic and nutritious dining facilities.','FACILITIES','facilities,campus,labs,laboratories,library,sports,computer lab,cafeteria,auditorium,amenities',7,1,'2026-10-27 14:59:11','2026-10-27 14:59:11'),(8,'Where is the college located and what are the campus hours?','Sri Vidyodaya Composite Pre-University College is situated at:\n**#45, Vidya Soudha Campus, 18th Cross, Malleshwaram, Bengaluru, Karnataka - 560003**\n\n**Office & Campus Hours**:\n- Monday to Friday: 8:30 AM – 4:30 PM\n- Saturday: 8:30 AM – 1:30 PM\n- Sunday & Government Holidays: Closed','CONTACT','location,address,where,timings,hours,office hours,malleshwaram,bengaluru,directions,campus',8,1,'2026-10-27 14:59:11','2026-10-27 14:59:11'),(9,'How can I contact the college admissions office?','You can reach our administrative and admissions team through:\n- **Helpline Phone**: +91 80 2345 6789 / +91 80 2345 6790\n- **Admissions Email**: admissions@svcpuc.edu.in\n- **General Email**: info@svcpuc.edu.in\n- **Online Enquiry**: Submit your details directly on the Admissions page.\n- **Campus Visit**: Visit the Administrative Block, 1st Floor during official office hours.','CONTACT','contact,phone,email,helpline,reach,call,enquiry,admission office,principal',9,1,'2026-10-27 14:59:11','2026-10-27 14:59:11'),(10,'ಕಾಲೇಜಿನಲ್ಲಿ ಯಾವ ಕೋರ್ಸ್‌ಗಳು ಲಭ್ಯವಿದೆ?','ನಮ್ಮ ಕಾಲೇಜಿನಲ್ಲಿ ಕರ್ನಾಟಕ ಪಿಯು ಬೋರ್ಡ್ ಮಾನ್ಯತೆ ಪಡೆದ ಎರಡು ವರ್ಷಗಳ ವಿಜ್ಞಾನ (Science) ಮತ್ತು ವಾಣಿಜ್ಯ (Commerce) ಕೋರ್ಸ್‌ಗಳು ಲಭ್ಯವಿವೆ:\n\n1. **ವಿಜ್ಞಾನ ವಿಭಾಗ (Science)**: PCMB (ಭೌತಶಾಸ್ತ್ರ, ರಸಾಯನಶಾಸ್ತ್ರ, ಗಣಿತ, ಜೀವಶಾಸ್ತ್ರ) ಮತ್ತು PCMC (ಭೌತಶಾಸ್ತ್ರ, ರಸಾಯನಶಾಸ್ತ್ರ, ಗಣಿತ, ಗಣಕ ವಿಜ್ಞಾನ).\n2. **ವಾಣಿಜ್ಯ ವಿಭಾಗ (Commerce)**: CEBA, MEBA, ಮತ್ತು SEBA.\n\nಹೆಚ್ಚಿನ ವಿವರಗಳಿಗಾಗಿ ನಮ್ಮ ಕಾಲೇಜಿನ ವೆಬ್‌ಸೈಟ್ ಅಥವಾ ಪ್ರವೇಶ ಕಚೇರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ: +91 80 2345 6789.','COURSES','ಕೋರ್ಸ್,ವಿಜ್ಞಾನ,ವಾಣಿಜ್ಯ,ಪಿಯುಸಿ,ಅಡ್ಮಿಷನ್,ಮಾಹಿತಿ,kannada',10,1,'2026-10-27 14:59:11','2026-10-27 14:59:11'),(11,'What courses does the college offer?','Our college offers comprehensive 2-year Pre-University courses recognized by the Karnataka PU Board in two streams:\n\n1. **Science Stream**: PCMB (Physics, Chemistry, Mathematics, Biology) and PCMC (Physics, Chemistry, Mathematics, Computer Science).\n2. **Commerce Stream**: CEBA (Commerce, Economics, Business Studies, Accountancy), MEBA (Mathematics, Economics, Business Studies, Accountancy), and SEBA (Statistics, Economics, Business Studies, Accountancy).\n\nBoth streams feature integrated preparatory coaching for KCET, NEET, and JEE.','COURSES','courses,streams,combinations,puc,science,commerce,pcmb,pcmc,ceba,offerings,programs',1,1,'2026-10-27 15:07:10','2026-10-27 15:07:10'),(12,'What are the admission requirements and eligibility criteria?','Candidates applying for 1st PUC must have successfully passed the Karnataka SSLC Board Examination, CBSE Class 10, ICSE, or any recognized equivalent secondary school examination.\n\n- **Science Stream (PCMB/PCMC)**: Minimum 60% aggregate in 10th standard with strong performance in Mathematics and Science.\n- **Commerce Stream (CEBA/MEBA/SEBA)**: Minimum 50% aggregate in 10th standard.\n\nYou can fill out an online admission enquiry on our Admissions page or visit the admissions desk in person.','ADMISSIONS','admission,requirements,eligibility,criteria,marks,percentage,sslc,10th,cbse,icse,apply',2,1,'2026-10-27 15:07:10','2026-10-27 15:07:10'),(13,'Which Science combinations are available?','We offer two premier Science combinations:\n1. **PCMB** (Physics, Chemistry, Mathematics, Biology) – Tailored for medical, dental, veterinary, agriculture, biotechnology, and pure science careers.\n2. **PCMC** (Physics, Chemistry, Mathematics, Computer Science) – Optimized for engineering, computing, artificial intelligence, robotics, and physical sciences.\n\nBoth combinations include integrated coaching for KCET, NEET, and JEE.','COURSES','science,combinations,pcmb,pcmc,biology,computer science,engineering,medical,neet,kcet,jee',3,1,'2026-10-27 15:07:10','2026-10-27 15:07:10'),(14,'Which Commerce combinations are available?','We offer three modern Commerce combinations:\n1. **CEBA** (Computer Science, Economics, Business Studies, Accountancy)\n2. **MEBA** (Mathematics, Economics, Business Studies, Accountancy)\n3. **SEBA** (Statistics, Economics, Business Studies, Accountancy)\n\nThese combinations prepare students for CA Foundation, CS, CMA, B.Com, BBA, Data Analytics, and Corporate Finance.','COURSES','commerce,combinations,ceba,meba,seba,accountancy,business studies,economics,ca,cma,finance',4,1,'2026-10-27 15:07:10','2026-10-27 15:07:10'),(15,'What documents are required for admission?','The following documents are required at the time of admission verification:\n1. Original & copies of 10th Standard / SSLC Marks Card.\n2. Transfer Certificate (TC) issued by the previous school.\n3. Conduct / Study Certificate (spanning at least 7 years for Karnataka domicile quota).\n4. Aadhaar Card copy of the student and parent.\n5. Category / Caste / Income Certificate (if claiming reservation concessions).\n6. Four recent passport-sized color photographs.\n7. Migration Certificate (for students from non-Karnataka state boards or ICSE/CBSE).','ADMISSIONS','documents,required,certificates,tc,transfer certificate,marks card,sslc,aadhaar,photos,caste,income',5,1,'2026-10-27 15:07:10','2026-10-27 15:07:10'),(16,'What is the college fee structure and scholarship details?','The annual fee structure depends on the selected stream (Science / Commerce) and integrated coaching modules. Typical tuition ranges from ₹35,000 to ₹65,000 per annum.\n\nWe provide generous **Merit and Need-Based Scholarships**:\n- **Merit Concession**: 25% to 50% fee concession for students scoring >90% in 10th standard.\n- **Sports Endowment**: Fee waivers for state/national level athletes.\n- **Economic Weaker Section (EWS)**: Need-based financial grants.\n\nPlease contact our admissions office at +91 80 2345 6789 or visit the campus for exact fee quotes and installment options.','FEES','fee,fees,structure,tuition,cost,scholarships,concession,waiver,merit,installments,payment',6,1,'2026-10-27 15:07:10','2026-10-27 15:07:10'),(17,'What campus facilities are available?','Our campus features state-of-the-art educational infrastructure:\n- **Science Labs**: Advanced, fully equipped Physics, Chemistry, and Biology laboratories compliant with state board practical norms.\n- **Digital Computer Labs**: High-speed internet connected labs with latest software.\n- **Central Library**: Over 15,000 books, periodicals, competitive exam guides (NEET/JEE/CET), and digital e-resources.\n- **Sports & Recreation**: Dedicated sports complex with badminton, basketball, cricket nets, table tennis, and chess.\n- **Seminar Halls**: Audio-visual enabled auditoriums for academic seminars and cultural activities.\n- **Cafeteria**: Hygienic and nutritious dining facilities.','FACILITIES','facilities,campus,labs,laboratories,library,sports,computer lab,cafeteria,auditorium,amenities',7,1,'2026-10-27 15:07:10','2026-10-27 15:07:10'),(18,'Where is the college located and what are the campus hours?','Sri Vidyodaya Composite Pre-University College is situated at:\n**#45, Vidya Soudha Campus, 18th Cross, Malleshwaram, Bengaluru, Karnataka - 560003**\n\n**Office & Campus Hours**:\n- Monday to Friday: 8:30 AM – 4:30 PM\n- Saturday: 8:30 AM – 1:30 PM\n- Sunday & Government Holidays: Closed','CONTACT','location,address,where,timings,hours,office hours,malleshwaram,bengaluru,directions,campus',8,1,'2026-10-27 15:07:10','2026-10-27 15:07:10'),(19,'How can I contact the college admissions office?','You can reach our administrative and admissions team through:\n- **Helpline Phone**: +91 80 2345 6789 / +91 80 2345 6790\n- **Admissions Email**: admissions@svcpuc.edu.in\n- **General Email**: info@svcpuc.edu.in\n- **Online Enquiry**: Submit your details directly on the Admissions page.\n- **Campus Visit**: Visit the Administrative Block, 1st Floor during official office hours.','CONTACT','contact,phone,email,helpline,reach,call,enquiry,admission office,principal',9,1,'2026-10-27 15:07:10','2026-10-27 15:07:10'),(20,'ಕಾಲೇಜಿನಲ್ಲಿ ಯಾವ ಕೋರ್ಸ್‌ಗಳು ಲಭ್ಯವಿದೆ?','ನಮ್ಮ ಕಾಲೇಜಿನಲ್ಲಿ ಕರ್ನಾಟಕ ಪಿಯು ಬೋರ್ಡ್ ಮಾನ್ಯತೆ ಪಡೆದ ಎರಡು ವರ್ಷಗಳ ವಿಜ್ಞಾನ (Science) ಮತ್ತು ವಾಣಿಜ್ಯ (Commerce) ಕೋರ್ಸ್‌ಗಳು ಲಭ್ಯವಿವೆ:\n\n1. **ವಿಜ್ಞಾನ ವಿಭಾಗ (Science)**: PCMB (ಭೌತಶಾಸ್ತ್ರ, ರಸಾಯನಶಾಸ್ತ್ರ, ಗಣಿತ, ಜೀವಶಾಸ್ತ್ರ) ಮತ್ತು PCMC (ಭೌತಶಾಸ್ತ್ರ, ರಸಾಯನಶಾಸ್ತ್ರ, ಗಣಿತ, ಗಣಕ ವಿಜ್ಞಾನ).\n2. **ವಾಣಿಜ್ಯ ವಿಭಾಗ (Commerce)**: CEBA, MEBA, ಮತ್ತು SEBA.\n\nಹೆಚ್ಚಿನ ವಿವರಗಳಿಗಾಗಿ ನಮ್ಮ ಕಾಲೇಜಿನ ವೆಬ್‌ಸೈಟ್ ಅಥವಾ ಪ್ರವೇಶ ಕಚೇರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ: +91 80 2345 6789.','COURSES','ಕೋರ್ಸ್,ವಿಜ್ಞಾನ,ವಾಣಿಜ್ಯ,ಪಿಯುಸಿ,ಅಡ್ಮಿಷನ್,ಮಾಹಿತಿ,kannada',10,1,'2026-10-27 15:07:10','2026-10-27 15:07:10');
/*!40000 ALTER TABLE `chatbot_faqs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chatbot_logs`
--

DROP TABLE IF EXISTS `chatbot_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chatbot_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `session_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `bot_response` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `language` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'en',
  `source` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'RAG_MYSQL',
  `helpful` tinyint(1) DEFAULT NULL,
  `user_ip` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `response_time_ms` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chatbot_logs`
--

LOCK TABLES `chatbot_logs` WRITE;
/*!40000 ALTER TABLE `chatbot_logs` DISABLE KEYS */;
INSERT INTO `chatbot_logs` VALUES (3,'test-session-1','What Science courses are available?','Our college offers comprehensive 2-year Pre-University courses recognized by the Karnataka PU Board in two streams:\n\n1. **Science Stream**: PCMB (Physics, Chemistry, Mathematics, Biology) and PCMC (Physics, Chemistry, Mathematics, Computer Science).\n2. **Commerce Stream**: CEBA (Commerce, Economics, Business Studies, Accountancy), MEBA (Mathematics, Economics, Business Studies, Accountancy), and SEBA (Statistics, Economics, Business Studies, Accountancy).\n\nBoth streams feature integrated preparatory coaching for KCET, NEET, and JEE.','en','APPROVED_FAQ',NULL,'0:0:0:0:0:0:0:1',9,'2026-10-27 09:38:55'),(4,'mpuc_rct6euikh_1793114493933','Which Science combinations are available?','We offer two premier Science combinations:\n1. **PCMB** (Physics, Chemistry, Mathematics, Biology) – Tailored for medical, dental, veterinary, agriculture, biotechnology, and pure science careers.\n2. **PCMC** (Physics, Chemistry, Mathematics, Computer Science) – Optimized for engineering, computing, artificial intelligence, robotics, and physical sciences.\n\nBoth combinations include integrated coaching for KCET, NEET, and JEE.','en','APPROVED_FAQ',NULL,'0:0:0:0:0:0:0:1',81,'2026-10-27 09:52:16'),(5,'mpuc_rct6euikh_1793114493933','What courses does the college offer?','Our college offers comprehensive 2-year Pre-University courses recognized by the Karnataka PU Board in two streams:\n\n1. **Science Stream**: PCMB (Physics, Chemistry, Mathematics, Biology) and PCMC (Physics, Chemistry, Mathematics, Computer Science).\n2. **Commerce Stream**: CEBA (Commerce, Economics, Business Studies, Accountancy), MEBA (Mathematics, Economics, Business Studies, Accountancy), and SEBA (Statistics, Economics, Business Studies, Accountancy).\n\nBoth streams feature integrated preparatory coaching for KCET, NEET, and JEE.','en','APPROVED_FAQ',NULL,'0:0:0:0:0:0:0:1',6,'2026-10-27 09:53:34'),(6,'mpuc_rct6euikh_1793114493933','What are the admission requirements?','Candidates applying for 1st PUC must have successfully passed the Karnataka SSLC Board Examination, CBSE Class 10, ICSE, or any recognized equivalent secondary school examination.\n\n- **Science Stream (PCMB/PCMC)**: Minimum 60% aggregate in 10th standard with strong performance in Mathematics and Science.\n- **Commerce Stream (CEBA/MEBA/SEBA)**: Minimum 50% aggregate in 10th standard.\n\nYou can fill out an online admission enquiry on our Admissions page or visit the admissions desk in person.','en','APPROVED_FAQ',NULL,'0:0:0:0:0:0:0:1',6,'2026-10-27 09:53:37'),(7,'mpuc_rct6euikh_1793114493933','hi','Hello! Welcome to **Sri Vidyodaya Composite Pre-University College (SVCPUC)**. I am your MPUC Assistant.\n\nI can assist you with:\n- Pre-University Science (PCMB, PCMC) and Commerce (CEBA, MEBA, SEBA) combinations\n- Admission criteria and required documents\n- Scholarships and fee concessions\n- Campus labs, library, and sports facilities\n- Campus address and visiting hours\n\nHow can I help you today?','en','RAG_MYSQL_ENGINE',NULL,'0:0:0:0:0:0:0:1',15,'2026-10-27 09:53:48'),(8,'mpuc_rct6euikh_1793114493933','hi sir','Hello! Welcome to **Sri Vidyodaya Composite Pre-University College (SVCPUC)**. I am your MPUC Assistant.\n\nI can assist you with:\n- Pre-University Science (PCMB, PCMC) and Commerce (CEBA, MEBA, SEBA) combinations\n- Admission criteria and required documents\n- Scholarships and fee concessions\n- Campus labs, library, and sports facilities\n- Campus address and visiting hours\n\nHow can I help you today?','en','RAG_MYSQL_ENGINE',NULL,'0:0:0:0:0:0:0:1',7,'2026-10-27 09:59:33'),(9,'mpuc_rct6euikh_1793114493933','Which Science combinations are available?','We offer two premier Science combinations:\n1. **PCMB** (Physics, Chemistry, Mathematics, Biology) – Tailored for medical, dental, veterinary, agriculture, biotechnology, and pure science careers.\n2. **PCMC** (Physics, Chemistry, Mathematics, Computer Science) – Optimized for engineering, computing, artificial intelligence, robotics, and physical sciences.\n\nBoth combinations include integrated coaching for KCET, NEET, and JEE.','en','APPROVED_FAQ',NULL,'0:0:0:0:0:0:0:1',8,'2026-10-27 09:59:51'),(10,'mpuc_rct6euikh_1793114493933','Which Science combinations are available?','We offer two premier Science combinations:\n1. **PCMB** (Physics, Chemistry, Mathematics, Biology) – Tailored for medical, dental, veterinary, agriculture, biotechnology, and pure science careers.\n2. **PCMC** (Physics, Chemistry, Mathematics, Computer Science) – Optimized for engineering, computing, artificial intelligence, robotics, and physical sciences.\n\nBoth combinations include integrated coaching for KCET, NEET, and JEE.','en','APPROVED_FAQ',NULL,'0:0:0:0:0:0:0:1',12,'2026-10-27 10:00:01'),(19,'mpuc_f5e5jhiz6_1793118441399','What courses does the college offer?','Our college offers comprehensive 2-year Pre-University courses recognized by the Karnataka PU Board in two streams:\n\n1. **Science Stream**: PCMB (Physics, Chemistry, Mathematics, Biology) and PCMC (Physics, Chemistry, Mathematics, Computer Science).\n2. **Commerce Stream**: CEBA (Commerce, Economics, Business Studies, Accountancy), MEBA (Mathematics, Economics, Business Studies, Accountancy), and SEBA (Statistics, Economics, Business Studies, Accountancy).\n\nBoth streams feature integrated preparatory coaching for KCET, NEET, and JEE.','en','APPROVED_FAQ',NULL,'127.0.0.1',7,'2026-11-07 10:24:12'),(20,'mpuc_f5e5jhiz6_1793118441399','What are the admission requirements?','Candidates applying for 1st PUC must have successfully passed the Karnataka SSLC Board Examination, CBSE Class 10, ICSE, or any recognized equivalent secondary school examination.\n\n- **Science Stream (PCMB/PCMC)**: Minimum 60% aggregate in 10th standard with strong performance in Mathematics and Science.\n- **Commerce Stream (CEBA/MEBA/SEBA)**: Minimum 50% aggregate in 10th standard.\n\nYou can fill out an online admission enquiry on our Admissions page or visit the admissions desk in person.','en','APPROVED_FAQ',NULL,'127.0.0.1',6,'2026-11-07 10:24:18');
/*!40000 ALTER TABLE `chatbot_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `college_settings`
--

DROP TABLE IF EXISTS `college_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `college_settings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'GENERAL',
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `college_settings`
--

LOCK TABLES `college_settings` WRITE;
/*!40000 ALTER TABLE `college_settings` DISABLE KEYS */;
INSERT INTO `college_settings` VALUES (1,'college_name',' Master Pre-University College','GENERAL','Official College Name','2026-11-06 23:03:06'),(2,'college_short_name','MPUC','GENERAL','Short Name / Acronym','2026-11-06 23:03:06'),(3,'college_tagline','Excellence in Pre-University Education & Holistic Development','GENERAL','Motto or Tagline','2026-10-26 13:47:49'),(4,'college_code','KA-PUC-0842','GENERAL','State Board Registration / Affiliation Code','2026-10-26 13:47:49'),(5,'affiliation','Recognized by Department of Pre-University Education, Govt. of Karnataka','GENERAL','Affiliation Status','2026-10-26 13:47:49'),(6,'navbar_brand_name','master','BRANDING','Navbar Primary Brand Title (e.g. SRI VIDYODAYA)','2026-11-06 23:03:06'),(7,'navbar_brand_sub','PRE-UNIVERSITY COLLEGE','BRANDING','Navbar Subtitle Text (e.g. COMPOSITE PRE-UNIVERSITY COLLEGE)','2026-11-06 23:03:06'),(8,'navbar_brand_tagline','Recognized by Dept. of PU Education, Govt. of Karnataka','BRANDING','Navbar Tagline & Affiliation','2026-10-26 13:47:49'),(9,'established_year','1998','GENERAL','Year of Establishment','2026-10-26 13:47:49'),(10,'phone_primary','+91 80 2345 6789','CONTACT','Main Campus Helpline','2026-10-26 13:47:49'),(11,'phone_secondary','+91 80 2345 6790','CONTACT','Admissions Office Direct','2026-10-26 13:47:49'),(12,'email_primary','info@svcpuc.edu.in','CONTACT','General Enquiries Email','2026-10-26 13:47:49'),(13,'email_admissions','admissions@svcpuc.edu.in','CONTACT','Admissions Email','2026-10-26 13:47:49'),(14,'campus_address','#45, Vidya Soudha Campus, 18th Cross, Malleshwaram, Bengaluru, Karnataka - 560003','CONTACT','Physical Campus Address','2026-10-26 13:47:49'),(15,'office_hours','Monday - Friday: 8:30 AM - 4:30 PM | Saturday: 8:30 AM - 1:30 PM','CONTACT','Campus Operating Hours','2026-10-26 13:47:49'),(16,'google_maps_embed','https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.6534578964344!2d77.5684!3d13.0033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDAwJzExLjkiTiA3N8KwMzQnMDYuMiJF!5e0!3m2!1sen!2sin!4v1620000000000','CONTACT','Google Maps verified location URL','2026-10-26 13:47:49'),(17,'facebook_url','https://facebook.com/svcpuc','SOCIAL','Facebook Page','2026-10-26 13:47:49'),(18,'instagram_url','https://instagram.com/svcpuc_official','SOCIAL','Instagram Profile','2026-10-26 13:47:49'),(19,'youtube_url','https://youtube.com/@svcpuc_bengaluru','SOCIAL','YouTube Channel','2026-10-26 13:47:49'),(20,'linkedin_url','https://linkedin.com/school/svcpuc','SOCIAL','LinkedIn Page','2026-10-26 13:47:49'),(21,'principal_badge_text','PRINCIPAL\'S DESK','LEADERSHIP','Badge text at the top of the Principal card','2026-10-27 13:36:55'),(22,'principal_name','Dr. K. S. Venkatesh','LEADERSHIP','Full Name of the Principal','2026-10-28 10:08:21'),(23,'principal_title_line','M.Sc., M.Phil., Ph.D. | Principal & Professor','LEADERSHIP','Qualifications and designation line','2026-10-27 13:36:55'),(24,'principal_photo_url','https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80','LEADERSHIP','Portrait photo URL of the Principal','2026-10-27 13:36:55'),(25,'principal_quote','The two years of Pre-University education are the most transformative phase in a student\'s academic journey. At Sri Vidyodaya PU College, we mentor each student to realize their fullest latent capability, fostering scientific inquiry and disciplined character.','LEADERSHIP','Inspirational quote on homepage card','2026-10-27 13:36:55'),(26,'principal_cta_text','Read Principal\'s Complete Message','LEADERSHIP','Text for the call-to-action link','2026-10-27 13:36:55'),(27,'principal_cta_link','/about#principal-message','LEADERSHIP','Destination URL for the link','2026-10-27 13:36:55'),(28,'principal_accolade','Recipient of the State Best Teacher Accolade (2019)','LEADERSHIP','Honorary award or recognition for the About page','2026-10-27 13:36:55'),(29,'principal_full_message','Dear Students, Parents, and Well-Wishers,\n\nPre-University education is the critical watershed of higher secondary learning in India. The decisions made during these crucial two years define future trajectories in medicine, engineering, pure research, chartered accountancy, corporate finance, and administration.\n\nAt our institution, we have engineered an academic framework that balances state board requirements with rigorous competitive problem solving. Our faculty members are empathetic mentors who monitor every student\'s learning pace, identify individual strengths, and provide remedial handholding whenever required.\n\nI warmly invite you to visit our campus, interact with our teaching staff, and experience the vibrant learning atmosphere.','LEADERSHIP','Complete formal message from the Principal','2026-10-27 13:36:55'),(30,'principal_desk_enabled','true','LEADERSHIP','Whether the Principal\'s Desk widget is visible on the homepage','2026-11-05 10:24:49'),(31,'chatbot_enabled','true','CHATBOT','Enable or disable public AI Chatbot widget','2026-10-27 14:59:11'),(32,'chatbot_name','MPUC Assistant','CHATBOT','Name of the public AI chatbot assistant','2026-10-27 14:59:11'),(33,'chatbot_welcome_message','Hello! Welcome to Sri Vidyodaya Composite Pre-University College (SVCPUC). How can I assist you today with courses, admissions, fees, or campus facilities?','CHATBOT','Default greeting message shown when chatbot window opens','2026-10-27 14:59:11'),(34,'chatbot_suggested_questions','What courses does the college offer?,Which Science combinations are available?,Which Commerce combinations are available?,What are the admission requirements?,What documents are required for admission?,What is the college fee structure?,What facilities are available?,Where is the college located?,How can I contact the admissions office?','CHATBOT','Comma-separated clickable quick questions in chatbot window','2026-10-27 14:59:11'),(36,'google_sheets_owner_email','sharanappagoudapolicepatil60@gmail.com','INTEGRATIONS','Google Spreadsheet Owner Email for Admissions','2026-10-29 16:11:22'),(37,'google_sheets_spreadsheet_url','https://docs.google.com/spreadsheets/d/1pnE-3S6MjNPtjC8NyHxiIssu7N1QJ9saD2aRYltwl-M/edit?gid=0#gid=0','INTEGRATIONS','Google Spreadsheet URL for Real-Time Admission Sync','2026-10-30 13:22:10'),(38,'google_sheets_webhook_url','https://script.google.com/macros/s/AKfycby7kbfDb2Ujbym2P_eWZUztboRinriqaVTXp4eBZ324u0U_3Mv9tnrXVSRfLa4stxMNjQ/exec','INTEGRATIONS','Google Apps Script Webhook URL for Admission Forwarding','2026-10-30 13:22:10'),(39,'google_sheets_sync_enabled','true','INTEGRATIONS','Enable Automatic Forwarding of Admissions to Google Spreadsheet','2026-10-29 16:11:22'),(40,'nav_show_home','true','GENERAL','nav_show_home','2026-11-11 12:47:34'),(41,'nav_label_home','Home','GENERAL','nav_label_home','2026-11-11 11:48:52'),(42,'nav_show_about','true','GENERAL','nav_show_about','2026-11-11 11:48:52'),(43,'nav_label_about','About Us','GENERAL','nav_label_about','2026-11-11 11:48:52'),(44,'nav_show_about_history','true','GENERAL','nav_show_about_history','2026-11-11 11:48:52'),(45,'nav_show_about_vision','true','GENERAL','nav_show_about_vision','2026-11-11 11:48:52'),(46,'nav_show_about_principal','true','GENERAL','nav_show_about_principal','2026-11-11 11:48:52'),(47,'nav_show_about_management','true','GENERAL','nav_show_about_management','2026-11-11 11:48:52'),(48,'nav_show_about_student_life','true','GENERAL','nav_show_about_student_life','2026-11-11 11:48:52'),(49,'nav_show_academics','true','GENERAL','nav_show_academics','2026-11-11 11:48:52'),(50,'nav_label_academics','Academics','GENERAL','nav_label_academics','2026-11-11 11:48:52'),(51,'nav_show_academics_science','true','GENERAL','nav_show_academics_science','2026-11-11 11:48:52'),(52,'nav_show_academics_commerce','true','GENERAL','nav_show_academics_commerce','2026-11-11 11:48:53'),(53,'nav_show_academics_coaching','true','GENERAL','nav_show_academics_coaching','2026-11-11 11:48:53'),(54,'nav_show_academics_calendar','true','GENERAL','nav_show_academics_calendar','2026-11-11 11:48:53'),(55,'nav_show_admissions','true','GENERAL','nav_show_admissions','2026-11-11 11:48:53'),(56,'nav_label_admissions','Admissions','GENERAL','nav_label_admissions','2026-11-11 11:48:53'),(57,'nav_show_admissions_guidelines','true','GENERAL','nav_show_admissions_guidelines','2026-11-11 11:48:53'),(58,'nav_show_admissions_enquiry','true','GENERAL','nav_show_admissions_enquiry','2026-11-11 11:48:53'),(59,'nav_show_admissions_track','true','GENERAL','nav_show_admissions_track','2026-11-11 11:48:53'),(60,'nav_show_admissions_scholarships','true','GENERAL','nav_show_admissions_scholarships','2026-11-11 11:48:53'),(61,'nav_show_examinations','true','GENERAL','nav_show_examinations','2026-11-11 11:48:53'),(62,'nav_label_examinations','Examinations','GENERAL','nav_label_examinations','2026-11-11 11:48:53'),(63,'nav_show_faculty','true','GENERAL','nav_show_faculty','2026-11-11 11:48:53'),(64,'nav_label_faculty','Faculty','GENERAL','nav_label_faculty','2026-11-11 11:48:53'),(65,'nav_show_facilities','true','GENERAL','nav_show_facilities','2026-11-11 11:48:53'),(66,'nav_label_facilities','Facilities','GENERAL','nav_label_facilities','2026-11-11 11:48:53'),(67,'nav_show_gallery','false','GENERAL','nav_show_gallery','2026-11-11 12:47:57'),(68,'nav_label_gallery','Gallery','GENERAL','nav_label_gallery','2026-11-11 11:48:53'),(69,'nav_show_news','true','GENERAL','nav_show_news','2026-11-11 11:48:53'),(70,'nav_label_news','News & Events','GENERAL','nav_label_news','2026-11-11 11:48:53'),(71,'nav_show_contact','true','GENERAL','nav_show_contact','2026-11-11 11:48:53'),(72,'nav_label_contact','Contact','GENERAL','nav_label_contact','2026-11-11 11:48:53'),(73,'nav_show_apply_btn','true','GENERAL','nav_show_apply_btn','2026-11-11 11:48:53'),(74,'nav_label_apply_btn','Apply Now','GENERAL','nav_label_apply_btn','2026-11-11 11:48:53'),(75,'nav_show_search_btn','true','GENERAL','nav_show_search_btn','2026-11-11 11:48:53');
/*!40000 ALTER TABLE `college_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `communication_logs`
--

DROP TABLE IF EXISTS `communication_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `communication_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `reference_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recipient_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recipient_name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recipient_target` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EMAIL',
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SENT',
  `trigger_event` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `error_message` text COLLATE utf8mb4_unicode_ci,
  `sent_by` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'SYSTEM',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_comm_ref` (`reference_no`),
  KEY `idx_comm_type` (`recipient_type`),
  KEY `idx_comm_created` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `communication_logs`
--

LOCK TABLES `communication_logs` WRITE;
/*!40000 ALTER TABLE `communication_logs` DISABLE KEYS */;
INSERT INTO `communication_logs` VALUES (1,'ADM-2026-1001','STAFF','Admissions Office','sharanappagoudapolicepatil60@gmail.com','EMAIL','New Admission Enquiry: Rohan Sharma (PCMB)','Alert: Student Rohan Sharma submitted enquiry for Science (PCMB).','SENT','ADMIN_ALERT',NULL,'SYSTEM','2026-10-29 17:55:23'),(2,'ADM-2026-1001','STUDENT','Rohan Sharma','rohan.sharma@gmail.com','EMAIL','Admission Enquiry Received - Ref: ADM-2026-1001','Your information is recorded successfully. Status: NEW.','SENT','ENQUIRY_CONFIRMATION',NULL,'SYSTEM','2026-10-29 17:55:23'),(3,'ADM-2026-1001','PARENT','Suresh Sharma','+91 98451 33444','SMS','SVCPUC Admission Acknowledgement','Dear Suresh Sharma, admission enquiry for Rohan Sharma is received. Ref: ADM-2026-1001.','SENT','ENQUIRY_CONFIRMATION',NULL,'SYSTEM','2026-10-29 17:55:23'),(4,'ADM-2026-1004','STUDENT','Sneha M.','sneha.m@gmail.com','EMAIL','Admission Status Update: ADMITTED (Ref: ADM-2026-1004)','Status updated to ADMITTED. Fee paid, admission confirmed, ID generated: PU26C104.','SENT','STATUS_UPDATE',NULL,'admin','2026-10-30 17:55:23'),(5,'ADM-2026-1004','PARENT','Manjunath B.','+91 98454 66777','SMS','Admission Confirmed - SVCPUC','Dear Manjunath B., admission for Sneha M. is confirmed (ADMITTED). PU26C104.','SENT','STATUS_UPDATE',NULL,'admin','2026-10-30 17:55:23'),(6,'ADM-2026-2079','STAFF','Admissions Office','sharanappagoudapolicepatil60@gmail.com','EMAIL','New Admission Enquiry: Pooja Patil (PCMB)','Admin notification alert dispatched for candidate Pooja Patil. Stream: SCIENCE','SENT','ADMIN_ALERT',NULL,'SYSTEM','2026-10-31 12:25:55'),(7,'ADM-2026-2079','STUDENT','Pooja Patil','sharanappagoudapolicepatil60@gmail.com','EMAIL','Admission Enquiry Received - Ref: ADM-2026-2079','Your information has been recorded successfully! Reference No: ADM-2026-2079. Status: NEW','SENT','ENQUIRY_CONFIRMATION',NULL,'SYSTEM','2026-10-31 12:25:55'),(8,'ADM-2026-2079','PARENT','Mallikarjun Patil','parent.patil@gmail.com','EMAIL','Admission Enquiry Acknowledgement - SVCPUC','Dear Mallikarjun Patil, admission enquiry for Pooja Patil (Ref: ADM-2026-2079) is safely recorded with status: NEW.','SENT','ENQUIRY_CONFIRMATION',NULL,'SYSTEM','2026-10-31 12:25:55'),(9,'ADM-2026-2079','STUDENT','Pooja Patil','sharanappagoudapolicepatil60@gmail.com','EMAIL','Admission Status Update: DOCUMENTS_PENDING (Ref: ADM-2026-2079)','Admission status updated from NEW to DOCUMENTS_PENDING.\nNotes: Please submit 10th marks card copy and transfer certificate.','SENT','STATUS_UPDATE',NULL,'admin','2026-10-31 12:26:22'),(10,'ADM-2026-2079','PARENT','Mallikarjun Patil','parent.patil@gmail.com','EMAIL','Admission Status Update - DOCUMENTS_PENDING','Dear Mallikarjun Patil, status for Pooja Patil (ADM-2026-2079) is updated to DOCUMENTS_PENDING.\nNotes: Please submit 10th marks card copy and transfer certificate.','SENT','STATUS_UPDATE',NULL,'admin','2026-10-31 12:26:22'),(11,'','PARENT','sharanappagouda','sharanappagouda148@gmail.com','EMAIL','shortlisted','come to college','SENT','MANUAL_DISPATCH',NULL,'admin','2026-10-31 12:34:43'),(12,'ADM-2026-2079','STUDENT','Pooja Patil','sharanappagoudapolicepatil60@gmail.com','EMAIL','Direct Test from Admin','Testing inbox dispatch notification','SENT','MANUAL_DISPATCH',NULL,'admin','2026-10-31 12:43:51'),(13,'','STUDENT','gouda','sharanappagouda148@gmail.com','EMAIL','Document verfct','hi','SENT','MANUAL_DISPATCH',NULL,'admin','2026-10-31 12:54:26'),(14,'ADM-2026-2079','STUDENT','Pooja Patil','sharanappagoudapolicepatil60@gmail.com','EMAIL','Admission Status Update: REJECTED (Ref: ADM-2026-2079)','Admission status updated from DOCUMENTS_PENDING to REJECTED.','SENT','STATUS_UPDATE',NULL,'admin','2026-10-31 12:56:09'),(15,'ADM-2026-2079','PARENT','Mallikarjun Patil','parent.patil@gmail.com','EMAIL','Admission Status Update - REJECTED','Dear Mallikarjun Patil, status for Pooja Patil (ADM-2026-2079) is updated to REJECTED.','SENT','STATUS_UPDATE',NULL,'admin','2026-10-31 12:56:09'),(16,'ADM-2026-2079','STUDENT','Pooja Patil','sharanappagoudapolicepatil60@gmail.com','EMAIL','Admission Status Update: REJECTED (Ref: ADM-2026-2079)','Admission status updated from REJECTED to REJECTED.','SENT','STATUS_UPDATE',NULL,'admin','2026-10-31 12:56:15'),(17,'ADM-2026-2079','PARENT','Mallikarjun Patil','parent.patil@gmail.com','EMAIL','Admission Status Update - REJECTED','Dear Mallikarjun Patil, status for Pooja Patil (ADM-2026-2079) is updated to REJECTED.','SENT','STATUS_UPDATE',NULL,'admin','2026-10-31 12:56:15'),(18,'ADM-2026-6156','STAFF','Admissions Office','sharanappagoudapolicepatil60@gmail.com','EMAIL','New Admission Enquiry: sharanappagouda (PCMB)','Admin notification alert dispatched for candidate sharanappagouda. Stream: SCIENCE','SENT','ADMIN_ALERT',NULL,'SYSTEM','2026-10-31 12:58:43'),(19,'ADM-2026-6156','STUDENT','sharanappagouda','sharanappagouda148@gmail.com','EMAIL','Admission Enquiry Received - Ref: ADM-2026-6156','Your information has been recorded successfully! Reference No: ADM-2026-6156. Status: NEW','SENT','ENQUIRY_CONFIRMATION',NULL,'SYSTEM','2026-10-31 12:58:43'),(20,'ADM-2026-6156','PARENT','basanagouda','2345678987','SMS','Admission Enquiry Acknowledgement - SVCPUC','Dear basanagouda, admission enquiry for sharanappagouda (Ref: ADM-2026-6156) is safely recorded with status: NEW.','SENT','ENQUIRY_CONFIRMATION',NULL,'SYSTEM','2026-10-31 12:58:43'),(21,'ADM-2026-6156','STUDENT','sharanappagouda','sharanappagouda148@gmail.com','EMAIL','Admission Status Update: COUNSELLING_SCHEDULED (Ref: ADM-2026-6156)','Admission status updated from NEW to COUNSELLING_SCHEDULED.','SENT','STATUS_UPDATE',NULL,'admin','2026-10-31 13:01:44'),(22,'ADM-2026-6156','PARENT','basanagouda','2345678987','SMS','Admission Status Update - COUNSELLING_SCHEDULED','Dear basanagouda, status for sharanappagouda (ADM-2026-6156) is updated to COUNSELLING_SCHEDULED.','SENT','STATUS_UPDATE',NULL,'admin','2026-10-31 13:01:44'),(55,'ADM-2026-9337','STAFF','Admissions Office','sharanappagoudapolicepatil60@gmail.com','EMAIL','New Admission Enquiry: gavi (PCMC)','Admin notification alert dispatched for candidate gavi. Stream: SCIENCE','SENT','ADMIN_ALERT',NULL,'SYSTEM','2026-11-06 23:00:56'),(56,'ADM-2026-9337','STUDENT','gavi','sharanappagouda148@gmail.com','EMAIL','Admission Enquiry Received - Ref: ADM-2026-9337','Your information has been recorded successfully! Reference No: ADM-2026-9337. Status: NEW','SENT','ENQUIRY_CONFIRMATION',NULL,'SYSTEM','2026-11-06 23:00:56'),(57,'ADM-2026-9337','PARENT','nagappa','sharanappagouda148@gmail.com','EMAIL','Admission Enquiry Acknowledgement - SVCPUC','Dear nagappa, admission enquiry for gavi (Ref: ADM-2026-9337) is safely recorded with status: NEW.','SENT','ENQUIRY_CONFIRMATION',NULL,'SYSTEM','2026-11-06 23:00:56');
/*!40000 ALTER TABLE `communication_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_enquiries`
--

DROP TABLE IF EXISTS `contact_enquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contact_enquiries` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `full_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'NEW',
  `response_notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_contact_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_enquiries`
--

LOCK TABLES `contact_enquiries` WRITE;
/*!40000 ALTER TABLE `contact_enquiries` DISABLE KEYS */;
INSERT INTO `contact_enquiries` VALUES (1,'Raghavendra Joshi','raghav.joshi@gmail.com','+91 98455 12345','Query regarding College Bus Transport Route from Yelahanka','Could you please let us know if college transport covers Yelahanka New Town and Kogilu cross?','NEW','Sent to transport coordinator for route confirmation.','2026-10-26 13:47:49'),(2,'Lakshmi Narayan','lakshmi.n@rediffmail.com','+91 98456 67890','Hostel Facility and Safety for Outstation Girl Students','We are from Hubli. Do you have dedicated hostel facilities for female students near campus?','RESOLVED','Provided details of partner hostel with 24/7 security and warden contact.','2026-10-26 13:47:49'),(3,'sharanappagouda','sharanappagouda148@gmail.com','9743988354','fees pending','fewef','NEW',NULL,'2026-10-26 09:05:45');
/*!40000 ALTER TABLE `contact_enquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_subjects`
--

DROP TABLE IF EXISTS `course_subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course_subjects` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `course_id` bigint NOT NULL,
  `subject_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_core` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_course_subjects_course` (`course_id`),
  CONSTRAINT `fk_course_subjects_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_subjects`
--

LOCK TABLES `course_subjects` WRITE;
/*!40000 ALTER TABLE `course_subjects` DISABLE KEYS */;
INSERT INTO `course_subjects` VALUES (1,1,'Physics','PHY-01',1,'2026-10-26 13:47:49'),(2,1,'Chemistry','CHE-02',1,'2026-10-26 13:47:49'),(3,1,'Mathematics','MAT-03',1,'2026-10-26 13:47:49'),(4,1,'Biology','BIO-04',1,'2026-10-26 13:47:49'),(5,1,'English (Language 1)','ENG-01',0,'2026-10-26 13:47:49'),(6,1,'Kannada / Hindi / Sanskrit (Language 2)','LANG-02',0,'2026-10-26 13:47:49'),(7,2,'Physics','PHY-01',1,'2026-10-26 13:47:49'),(8,2,'Chemistry','CHE-02',1,'2026-10-26 13:47:49'),(9,2,'Mathematics','MAT-03',1,'2026-10-26 13:47:49'),(10,2,'Computer Science','CS-05',1,'2026-10-26 13:47:49'),(11,2,'English (Language 1)','ENG-01',0,'2026-10-26 13:47:49'),(12,2,'Kannada / Hindi / Sanskrit (Language 2)','LANG-02',0,'2026-10-26 13:47:49'),(13,3,'Computer Science','CS-05',1,'2026-10-26 13:47:49'),(14,3,'Economics','ECO-01',1,'2026-10-26 13:47:49'),(15,3,'Business Studies','BUS-02',1,'2026-10-26 13:47:49'),(16,3,'Accountancy','ACC-03',1,'2026-10-26 13:47:49'),(17,3,'English (Language 1)','ENG-01',0,'2026-10-26 13:47:49'),(18,3,'Kannada / Hindi / Sanskrit (Language 2)','LANG-02',0,'2026-10-26 13:47:49'),(19,4,'Basic Mathematics','BMAT-04',1,'2026-10-26 13:47:49'),(20,4,'Economics','ECO-01',1,'2026-10-26 13:47:49'),(21,4,'Business Studies','BUS-02',1,'2026-10-26 13:47:49'),(22,4,'Accountancy','ACC-03',1,'2026-10-26 13:47:49'),(23,4,'English (Language 1)','ENG-01',0,'2026-10-26 13:47:49'),(24,4,'Kannada / Hindi / Sanskrit (Language 2)','LANG-02',0,'2026-10-26 13:47:49'),(25,5,'Statistics','STAT-05',1,'2026-10-26 13:47:49'),(26,5,'Economics','ECO-01',1,'2026-10-26 13:47:49'),(27,5,'Business Studies','BUS-02',1,'2026-10-26 13:47:49'),(28,5,'Accountancy','ACC-03',1,'2026-10-26 13:47:49'),(29,5,'English (Language 1)','ENG-01',0,'2026-10-26 13:47:49'),(30,5,'Kannada / Hindi / Sanskrit (Language 2)','LANG-02',0,'2026-10-26 13:47:49'),(31,6,'Basic Mathematics','BMAT-04',1,'2026-10-26 13:47:49'),(32,6,'Statistics','STAT-05',1,'2026-10-26 13:47:49'),(33,6,'Business Studies','BUS-02',1,'2026-10-26 13:47:49'),(34,6,'Accountancy','ACC-03',1,'2026-10-26 13:47:49'),(35,6,'English (Language 1)','ENG-01',0,'2026-10-26 13:47:49'),(36,6,'Kannada / Hindi / Sanskrit (Language 2)','LANG-02',0,'2026-10-26 13:47:49');
/*!40000 ALTER TABLE `course_subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `courses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stream` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT '2 Years',
  `description` text COLLATE utf8mb4_unicode_ci,
  `eligibility` text COLLATE utf8mb4_unicode_ci,
  `career_prospects` text COLLATE utf8mb4_unicode_ci,
  `fee_per_year` decimal(10,2) DEFAULT '0.00',
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_courses_stream` (`stream`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'PCMB','Physics, Chemistry, Mathematics, Biology','SCIENCE','2 Years','The ideal combination for aspirants aiming for medicine, biotechnology, healthcare, engineering, and pure sciences. Offers dual pathways for both NEET and JEE/KCET preparation.','Pass in 10th Standard / SSLC / ICSE / CBSE with a minimum aggregate of 60% and strong foundation in Science and Mathematics.','Medicine (MBBS, BDS, BAMS), Engineering (B.Tech), Biotechnology, Pharmacy, Nursing, Agricultural Sciences, Pure Science Research.',55000.00,'Microscope',1,'2026-10-26 13:47:49'),(2,'PCMC','Physics, Chemistry, Mathematics, Computer Science','SCIENCE','2 Years','Tailored for students targeting premier engineering institutes and technological careers. Blends rigorous core sciences with modern Python and C++ computer programming.','Pass in 10th Standard / SSLC / ICSE / CBSE with a minimum aggregate of 65% in Mathematics and Science.','Software Engineering, Artificial Intelligence, Data Science, Aerospace, Robotics, Electronics & Communication, Pure Mathematics.',58000.00,'Cpu',1,'2026-10-26 13:47:49'),(3,'CEBA','Computer Science, Economics, Business Studies, Accountancy','COMMERCE','2 Years','Modern commerce program integrating financial fundamentals with IT and data handling skills. Prepares students for fintech, data-driven management, and corporate careers.','Pass in 10th Standard / SSLC / ICSE / CBSE with at least 55% aggregate.','FinTech, Chartered Accountancy (CA), Company Secretary (CS), Business Administration (BBA), Data Analytics, Banking & Financial Services.',48000.00,'TrendingUp',1,'2026-10-26 13:47:49'),(4,'MEBA','Basic Maths, Economics, Business Studies, Accountancy','COMMERCE','2 Years','Designed for commerce students who want mathematical aptitude for quantitative finance, actuarial science, and competitive professional examinations.','Pass in 10th Standard / SSLC / ICSE / CBSE with strong quantitative aptitude.','Actuarial Sciences, Chartered Accountancy (CA), Investment Banking, Corporate Finance, Economic Research, Stock Broking.',46000.00,'Calculator',1,'2026-10-26 13:47:49'),(5,'SEBA','Statistics, Economics, Business Studies, Accountancy','COMMERCE','2 Years','Comprehensive focus on statistical modeling, business acumen, and accounting practices. Highly popular for economics and corporate management aspirants.','Pass in 10th Standard / SSLC / ICSE / CBSE with at least 50% aggregate.','Statistical Analysis, Market Research, Chartered Financial Analyst (CFA), CA, CS, Corporate Management, Economics.',45000.00,'BarChart3',1,'2026-10-26 13:47:49'),(6,'MSBA','Basic Maths, Statistics, Business Studies, Accountancy','COMMERCE','2 Years','Analytical commerce suite emphasizing mathematical rigor and statistical inference for high-level commerce, financial auditing, and business analysis.','Pass in 10th Standard / SSLC / ICSE / CBSE with at least 50% aggregate.','Financial Auditing, Management Consulting, Cost & Management Accounting (CMA), Data Interpretation, Banking.',46000.00,'PieChart',1,'2026-10-26 13:47:49');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `departments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `hod_name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hod_email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hod_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Department of Physics','DEPT_PHY','Oversees Physics curricula, state-of-the-art laboratory practicals, and KCET/NEET problem-solving sessions.','Prof. H. S. Narayana','narayana.phy@svcpuc.edu.in','+91 98450 11201',1,'2026-10-26 13:47:49'),(2,'Department of Chemistry','DEPT_CHE','Equipped with digital analytical balances, fume hoods, and organic/inorganic chemistry experimentation stations.','Dr. Malathi Sundaram','malathi.che@svcpuc.edu.in','+91 98450 11202',1,'2026-10-26 13:47:49'),(3,'Department of Mathematics','DEPT_MAT','Fosters conceptual clarity in calculus, coordinate geometry, probability, and advanced problem heuristics.','Prof. Ramesh G. Kulkarni','ramesh.mat@svcpuc.edu.in','+91 98450 11203',1,'2026-10-26 13:47:49'),(4,'Department of Biology','DEPT_BIO','Covers Botany and Zoology with microscopic tissue analysis, herbarium studies, and intensive NEET medical coaching.','Dr. S. Radhika','radhika.bio@svcpuc.edu.in','+91 98450 11204',1,'2026-10-26 13:47:49'),(5,'Department of Computer Science','DEPT_CS','Modern high-speed air-conditioned laboratory running Python, SQL, C++, and AI introductory workshops.','Prof. Vikram Hegde','vikram.cs@svcpuc.edu.in','+91 98450 11205',1,'2026-10-26 13:47:49'),(6,'Department of Commerce & Accountancy','DEPT_COM','Specializes in financial accounting, corporate taxation, CA foundation preparation, and business case studies.','Prof. Sunita Rao','sunita.com@svcpuc.edu.in','+91 98450 11206',1,'2026-10-26 13:47:49'),(7,'Department of Economics & Statistics','DEPT_ECO','Mentors students in macro-economics, quantitative forecasting, business statistics, and financial modeling.','Prof. C. M. Murthy','murthy.eco@svcpuc.edu.in','+91 98450 11207',1,'2026-10-26 13:47:49'),(8,'Department of Languages','DEPT_LANG','Instruction in English, Kannada, Hindi, and Sanskrit promoting linguistic fluency and literary appreciation.','Dr. Vijayalakshmi B.','vijaya.lang@svcpuc.edu.in','+91 98450 11208',1,'2026-10-26 13:47:49');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `events` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `event_date` date NOT NULL,
  `event_time` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'UPCOMING',
  `registration_link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_events_date` (`event_date`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Orientation Day & Welcome Ceremony for 1st Year PUC Batch','orientation-day-1st-year-puc-2026','Welcoming incoming first-year students and parents with academic briefings, campus tour, and faculty introductions.','2026-06-20','09:30 AM - 12:30 PM','Main Auditorium (Soudha Hall)','https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80','UPCOMING','/admissions','2026-10-26 13:47:49'),(2,'Anveshana: Annual Science & Innovation Project Fair','anveshana-science-fair-2026','Interactive science exhibition where student teams showcase working robotics models, chemistry demonstrations, and green biology innovations.','2026-08-14','10:00 AM - 04:00 PM','Science Laboratories & Quadrangle','https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80','UPCOMING','/events','2026-10-26 13:47:49'),(3,'Pratibha: Annual Cultural Extravaganza & Talent Show','pratibha-annual-cultural-fest-2026','Two-day mega inter-class cultural tournament featuring classical dance, western music, skit, debate, quiz, and fashion pageant.','2026-11-20','09:00 AM - 05:00 PM','College Open Air Theatre & Auditorium','https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80','UPCOMING','/events','2026-10-26 13:47:49'),(4,'dance','dance','fffgx','2026-11-21','10:00 AM - 01:00 PM','Main Auditorium',NULL,'UPCOMING',NULL,'2026-11-05 10:17:08');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `examinations`
--

DROP TABLE IF EXISTS `examinations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `examinations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `exam_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `exam_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `academic_year` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stream` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `time_table_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `model_question_paper_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instructions` text COLLATE utf8mb4_unicode_ci,
  `published` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `examinations`
--

LOCK TABLES `examinations` WRITE;
/*!40000 ALTER TABLE `examinations` DISABLE KEYS */;
INSERT INTO `examinations` VALUES (1,'First Unit Test Assessment 2026','UNIT_TEST','2026-27','ALL','2026-08-01','2026-08-08','/uploads/timetable-unit1-2026.pdf','/uploads/model-paper-unit1-2026.pdf','Syllabus covers Chapters 1 & 2 across all core subjects. Maximum marks: 25 per subject. Attendance is compulsory.',1,'2026-10-26 13:47:49'),(2,'Mid-Term Examinations 2026','MID_TERM','2026-27','ALL','2026-10-05','2026-10-16','/uploads/timetable-midterm-2026.pdf','/uploads/model-paper-midterm-2026.pdf','Covers 50% state board syllabus. Maximum marks: 80 Theory + 20 Practical / Internal. Hall tickets issued at admin counter.',1,'2026-10-26 13:47:49'),(3,'Preparatory Mock Board Exams 2027','PREPARATORY','2026-27','ALL','2027-01-18','2027-01-30','/uploads/timetable-preparatory-2027.pdf','/uploads/model-paper-preparatory-2027.pdf','Exact Karnataka Pre-University Board pattern mock examination for 2nd PUC students.',1,'2026-10-26 13:47:49'),(4,'Annual Karnataka State PUC Board Exams','ANNUAL_BOARD','2026-27','ALL','2027-03-01','2027-03-22','/uploads/timetable-stateboard-2027.pdf','/uploads/model-paper-stateboard-2027.pdf','Official State Board examinations conducted by Karnataka School Examination and Assessment Board (KSEAB).',1,'2026-10-26 13:47:49'),(5,'hhh','PREPARATORY','2027-28','ALL','2026-11-05','2026-11-12','/uploads/b193dce8-1171-4b05-af33-4119f621a160.jpg','/uploads/c0554015-3634-443f-9ce5-cb8db1c3c2bd.pdf','jjhuuu',1,'2026-11-05 09:26:56');
/*!40000 ALTER TABLE `examinations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facilities`
--

DROP TABLE IF EXISTS `facilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `facilities` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `features` text COLLATE utf8mb4_unicode_ci,
  `display_order` int DEFAULT '0',
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facilities`
--

LOCK TABLES `facilities` WRITE;
/*!40000 ALTER TABLE `facilities` DISABLE KEYS */;
INSERT INTO `facilities` VALUES (1,'State-of-the-Art Physics Laboratory','LABORATORY','Spacious, well-illuminated laboratory equipped with modern optical benches, sonometers, spectrometers, and electronic testing apparatus conforming to Pre-University Board guidelines.','Atom','https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80','Individual experiment workstations, Advanced optical spectrometers, Digital multimeters, High safety compliance with fire suppression',1,1,'2026-10-26 13:47:49'),(3,'Modern Biology Laboratory','LABORATORY','Equipped with binocular compound microscopes, human anatomical models, preserved specimen museums, projection microscopes, and microtomes for microscopic slide studies.','Dna','https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80','High-definition compound microscopes, Extensive museum of botanical and zoological specimens, Human anatomical 3D models, Dissection gear and staining baths',3,1,'2026-10-26 13:47:49'),(4,'Next-Gen Computer Science & AI Lab','LABORATORY','High-speed networked computer lab featuring 60+ latest Core i7 desktop workstations with dual operating systems (Ubuntu Linux and Windows 11), gigabit fiber internet, and developer IDEs.','Monitor','https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80','60 high-performance workstations, 1 Gbps dedicated leased-line internet, Python, C++, MySQL, VS Code preconfigured, Uninterrupted dual online UPS backup',4,1,'2026-10-26 13:47:49'),(5,'Central Library & Digital Reading Room','ACADEMIC','Rich repository of over 15,000 academic textbooks, NCERT guides, reference encyclopedias, national journals, competitive exam modules (NEET, KCET, JEE), and digital e-library kiosks.','BookOpen','https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80','15,000+ print volumes and competitive exam guides, National & international educational journals, High-speed digital research terminals, Quiet reading zone seating 150 students',5,1,'2026-10-26 13:47:49'),(6,'Multipurpose Auditorium & Seminar Hall','INFRASTRUCTURE','Air-conditioned 600-seater auditorium equipped with acoustic wall paneling, professional sound systems, theatrical stage lighting, and 4K digital projection for college ceremonies.','Mic','https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80','600 ergonomic cushioned seats, High-definition laser projector with wide screen, JBL acoustic line-array surround sound, Green rooms for performers',6,1,'2026-10-26 13:47:49'),(7,'Indoor Sports Complex & Playing Arena','SPORTS','Dedicated sports facilities including indoor badminton courts, table tennis halls, chess/carrom clubs, and outdoor volleyball, basketball, and cricket practice nets.','Trophy','https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80','Synthetic indoor badminton court, Standard outdoor basketball court, Turf cricket bowling nets, Qualified physical education instructors',7,1,'2026-10-26 13:47:49'),(8,'Student Cafeteria & Wellness Hub','AMENITIES','Hygienic multi-cuisine cafeteria offering wholesome, nutritious meals, fresh juices, and refreshments alongside an on-campus first aid and wellness center with medical staff.','Coffee','https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80','Strict FSSAI-compliant hygienic cooking standards, Nutritious, affordable vegetarian breakfast and lunch, Clean RO drinking water dispensers, First-aid center with on-call doctor',8,1,'2026-10-26 13:47:49'),(9,'food','SPORTS','dd',NULL,'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80','fffgtg',0,1,'2026-11-05 10:22:12');
/*!40000 ALTER TABLE `facilities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faculty`
--

DROP TABLE IF EXISTS `faculty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `faculty` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `full_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `designation` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qualification` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `experience_years` int DEFAULT '0',
  `subjects_taught` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `photo_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_faculty_dept` (`department`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faculty`
--

LOCK TABLES `faculty` WRITE;
/*!40000 ALTER TABLE `faculty` DISABLE KEYS */;
INSERT INTO `faculty` VALUES (1,'Dr. K. S. Venkatesh','Principal & Professor','Physics','M.Sc., M.Phil., Ph.D. (IISc Bengaluru)',24,'Classical Mechanics, Electrodynamics','principal@svcpuc.edu.in','+91 98450 12345','Dedicated educationist with over two decades of experience in pre-university and collegiate education. Authored 3 textbooks on Karnataka PU Physics.','https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',1,1,'2026-10-26 13:47:49'),(2,'Prof. Sunita Rao','Vice Principal & HOD','Chemistry','M.Sc. (Organic Chemistry), B.Ed.',18,'Organic & Inorganic Chemistry','sunita.rao@svcpuc.edu.in','+91 98450 54321','Passionate chemistry educator specializing in conceptual visualization and laboratory synthesis techniques. Key mentor for KCET chemistry.','https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',2,1,'2026-10-26 13:47:49'),(3,'Prof. Anand Vardhan','Head of Department','Mathematics','M.Sc., SET Qualified',16,'Calculus, Trigonometry, Linear Algebra','anand.v@svcpuc.edu.in','+91 98450 33441','Renowned mathematics mentor who has guided over 50 state top 100 rankers in CET and JEE Mains over the past decade.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',3,1,'2026-10-26 13:47:49'),(4,'Dr. Meenakshi Sundaram','Senior Lecturer','Biology','M.Sc. (Botany), Ph.D., B.Ed.',14,'Genetics, Plant Physiology, Biotechnology','meenakshi.s@svcpuc.edu.in','+91 98450 66772','Specialist in NEET Biology curriculum and botanical taxonomy. Known for engaging interactive classroom discussions and specimen analysis.','https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=400&q=80',4,1,'2026-10-26 13:47:49'),(5,'Prof. Rajesh Kulkarni','Head of Department','Computer Science','M.C.A., M.Tech (CS)',12,'Python Programming, SQL, Computer Networks','rajesh.k@svcpuc.edu.in','+91 98450 88993','Industry veteran turned educator. Leads the robotics club, coding hackathons, and digital literacy initiatives on campus.','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',5,1,'2026-10-26 13:47:49'),(6,'Prof. Vidya Shankar','Head of Department','Commerce & Accountancy','M.Com, M.Phil., FCA Inter',19,'Financial Accounting, Corporate Accounting','vidya.shankar@svcpuc.edu.in','+91 98450 22114','Chartered Accountant mentor leading the CA-CPT / Foundation preparatory coaching batch with a consistent 95%+ pass percentage.','https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',6,1,'2026-10-26 13:47:49'),(7,'Prof. Geetha Narayanan','Senior Lecturer','Economics','M.A. (Economics), B.Ed.',15,'Microeconomics, Macroeconomics, Indian Economy','geetha.n@svcpuc.edu.in','+91 98450 77885','Specializes in Indian developmental economics and financial budget analysis. Guides commerce students in real-world market case studies.','https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',7,1,'2026-10-26 13:47:49'),(8,'Prof. Chandrashekar Hegde','Head of Department','Languages (Kannada & English)','M.A. (English), M.A. (Kannada), B.Ed.',21,'Communicative English, Kannada Sahitya','chandrashekar.h@svcpuc.edu.in','+91 98450 44556','Cultural convener, orator, and literary advisor. Directs the annual college magazine and state-level debate tournaments.','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',8,1,'2026-10-26 13:47:49'),(9,'sharanappagouda','ghhg','Computer Science','wff',5,'ai','sharanappagouda148@gmail.com','','gf','https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',0,1,'2026-11-02 10:36:12');
/*!40000 ALTER TABLE `faculty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flyway_schema_history`
--

DROP TABLE IF EXISTS `flyway_schema_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `flyway_schema_history` (
  `installed_rank` int NOT NULL,
  `version` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `script` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` int DEFAULT NULL,
  `installed_by` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `installed_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `execution_time` int NOT NULL,
  `success` tinyint(1) NOT NULL,
  PRIMARY KEY (`installed_rank`),
  KEY `flyway_schema_history_s_idx` (`success`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flyway_schema_history`
--

LOCK TABLES `flyway_schema_history` WRITE;
/*!40000 ALTER TABLE `flyway_schema_history` DISABLE KEYS */;
INSERT INTO `flyway_schema_history` VALUES (1,'1','init schema','SQL','V1__init_schema.sql',158464631,'mpuc_app','2026-10-26 13:47:49',182,1),(2,'2','seed demo data','SQL','V2__seed_demo_data.sql',-1575021586,'mpuc_app','2026-10-26 13:47:49',17,1),(3,'3','admin cms modules','SQL','V3__admin_cms_modules.sql',-1621365983,'mpuc_app','2026-10-26 13:47:49',32,1),(4,'4','chatbot module','SQL','V4__chatbot_module.sql',-1226458570,'mpuc_app','2026-10-27 15:07:10',14,1),(5,'5','google sheets sync','SQL','V5__google_sheets_sync.sql',-361807161,'mpuc_app','2026-10-29 16:11:22',7,1),(6,'6','add enquiry address and referral','SQL','V6__add_enquiry_address_and_referral.sql',399052378,'mpuc_app','2026-10-30 18:01:17',33,1),(7,'7','communication history and parent email','SQL','V7__communication_history_and_parent_email.sql',1856204402,'mpuc_app','2026-10-31 17:55:23',40,1),(8,'8','banner text colors','SQL','V8__banner_text_colors.sql',-2002708170,'mpuc_app','2026-11-02 14:53:03',21,1),(9,'9','add model question paper to examinations','SQL','V9__add_model_question_paper_to_examinations.sql',506625406,'mpuc_app','2026-11-05 14:53:17',18,1),(10,'10','update notice urls and add announcement defaults','SQL','V10__update_notice_urls_and_add_announcement_defaults.sql',-1985561143,'mpuc_app','2026-11-05 16:34:35',6,1),(11,'11','direct exam anchor links for announcements','SQL','V11__direct_exam_anchor_links_for_announcements.sql',1288418652,'mpuc_app','2026-11-05 17:54:05',6,1);
/*!40000 ALTER TABLE `flyway_schema_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery_categories`
--

DROP TABLE IF EXISTS `gallery_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gallery_categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery_categories`
--

LOCK TABLES `gallery_categories` WRITE;
/*!40000 ALTER TABLE `gallery_categories` DISABLE KEYS */;
INSERT INTO `gallery_categories` VALUES (1,'Campus & Infrastructure','campus'),(2,'Science & Computer Labs','labs'),(3,'Cultural Fest - Pratibha','cultural'),(4,'Sports & Athletics','sports'),(5,'Academic & Science Exhibitions','academics');
/*!40000 ALTER TABLE `gallery_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery_images`
--

DROP TABLE IF EXISTS `gallery_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gallery_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category_id` bigint DEFAULT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_gallery_images_cat` (`category_id`),
  CONSTRAINT `fk_gallery_images_cat` FOREIGN KEY (`category_id`) REFERENCES `gallery_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery_images`
--

LOCK TABLES `gallery_images` WRITE;
/*!40000 ALTER TABLE `gallery_images` DISABLE KEYS */;
INSERT INTO `gallery_images` VALUES (1,1,'Majestic Campus Quadranglejjj','The central lush green quadrangle and administrative block of SVCPUC','https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',1,'2026-10-26 13:47:49'),(2,2,'Hands-on Physics Experimentation','Students conducting optics and wavelength determination experiments in the physics lab','https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',2,'2026-10-26 13:47:49'),(3,2,'Computer Science Coding Session','Students implementing data structures and algorithms in Python under faculty guidance','https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',3,'2026-10-26 13:47:49'),(4,3,'Inaugural Lamp Lighting at Pratibha Fest','Dignitaries and student representatives inaugurating the annual cultural festival','https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',4,'2026-10-26 13:47:49'),(5,3,'Classical Dance Performance','Talented PU students presenting a vibrant Bharatanatyam recital during college day','https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',5,'2026-10-26 13:47:49'),(6,4,'Annual Inter-Collegiate Basketball Tournament','SVCPUC basketball team clinching the victory trophy in Bangalore district championship','https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',6,'2026-10-26 13:47:49'),(7,5,'Anveshana Science Project Exhibition','Working model of renewable energy grid demonstrated by 2nd PUC Science students','https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',7,'2026-10-26 13:47:49'),(8,1,'Central Library Study Corridor','Students engaged in quiet reading and competitive examination preparation','https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',8,'2026-10-26 13:47:49'),(9,1,'Smart Digital Seminar Hall','Air-conditioned audiovisual interactive conference hall with 4K projection','https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',9,'2026-11-02 08:16:12'),(10,NULL,'ggggg','hi','/uploads/b0fdcfb7-5348-4b37-8a9a-f7d3e954b70b.jpg',1,'2026-11-02 09:59:41'),(11,NULL,'hhh','hhhh','https://photos.google.com/photo/AF1QipOHoR-kKQNx6OarA-g9qpl660PGxrKZfQD9ubys',1,'2026-11-02 10:01:14'),(12,2,'lab','lab','/uploads/e19f254c-92e6-482d-b004-96b44c48a098.jpg',12,'2026-11-06 22:58:08');
/*!40000 ALTER TABLE `gallery_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `news` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `excerpt` text COLLATE utf8mb4_unicode_ci,
  `content` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'General',
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `published_at` date DEFAULT NULL,
  `published` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_news_slug` (`slug`),
  KEY `idx_news_published` (`published`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES (1,'SVCPUC Students Achieve Outstanding 98.6% Pass Rate in Karnataka PUC State Board Exams','svcpuc-students-achieve-outstanding-results-2026','Our students have once again brought laurels to the institution with 42 distinctions and 3 state top ranks in the annual examinations.','Sri Vidyodaya Composite Pre-University College (SVCPUC) is proud to announce another landmark year of academic brilliance in the Karnataka Pre-University Board Examinations. Out of 480 candidates who appeared for the exam across Science and Commerce streams, the college recorded an overall pass percentage of 98.6%.\n\nKey Highlights of Results:\n- 42 Students secured State Distinctions (>85%)\n- Master Rohith Rao secured 9th State Rank in Science Stream (PCMC) with 592/600 marks\n- Kum. Ananya Kulkarni secured 6th State Rank in Commerce Stream (CEBA) with 594/600 marks\n- 100% pass percentage in Computer Science and Accountancy departments\n\nThe Management, Principal Dr. K. S. Venkatesh, and faculty members congratulate all students and their parents for this stupendous accomplishment.','Academics','https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80','2026-05-15',1,'2026-10-26 13:47:49'),(2,'Admissions Open for Academic Year 2026-27: Online Applications & Counselling Schedule','admissions-open-academic-year-2026-27','Applications are invited from eligible 10th standard / SSLC / CBSE / ICSE pass-outs for 1st PUC Science (PCMB, PCMC) and Commerce (CEBA, MEBA, SEBA, MSBA).','Admissions for the upcoming academic year 2026-27 are now officially open at Sri Vidyodaya Composite Pre-University College. We welcome aspirational students seeking a supportive, disciplined, and academically rigorous environment.\n\nCourses Offered:\n1. Science: PCMB (Physics, Chemistry, Maths, Biology) and PCMC (Physics, Chemistry, Maths, Computer Science)\n2. Commerce: CEBA, MEBA, SEBA, MSBA\n\nHow to Apply:\nInterested parents and students can submit an online enquiry form on our website to receive an instant reference number. The admissions office will schedule a personal counselling session along with merit verification.','Admissions','https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80','2026-06-01',1,'2026-10-26 13:47:49'),(3,'Special Coaching Classes for KCET, NEET & CA Foundation Commence Next Week','coaching-classes-kcet-neet-ca-foundation-commence','SVCPUC inaugurates its specialized morning & weekend integrated coaching batches led by experienced faculties and test series mentors.','To ensure our students are well-prepared for competitive national and state entrance examinations, SVCPUC is launching its integrated preparatory classes for KCET (Karnataka Common Entrance Test), NEET, JEE Mains, and CA Foundation.\n\nThe curriculum features weekly chapter-wise mock tests, previous decade question paper reviews, personalized doubt-clearing sessions, and performance tracking dashboards for parents.','Coaching','https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80','2026-07-10',1,'2026-10-26 13:47:49'),(4,'sharanappagouda','sharanappagouda','hi','good eveing','Sports','https://blog.algomaster.io/p/15-leetcode-patterns','2026-11-05',1,'2026-11-05 10:11:03');
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notices`
--

DROP TABLE IF EXISTS `notices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notices` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `document_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_important` tinyint(1) DEFAULT '0',
  `published_at` date DEFAULT NULL,
  `expires_at` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notices`
--

LOCK TABLES `notices` WRITE;
/*!40000 ALTER TABLE `notices` DISABLE KEYS */;
INSERT INTO `notices` VALUES (2,'Government Post-Matric and Merit-cum-Means Scholarship Portal Guidelines','/admissions#scholarships',1,'2026-07-15','2026-09-30','2026-10-26 13:47:49'),(5,'divali','https://www.youtube.com/',1,'2026-11-05',NULL,'2026-11-05 10:12:04'),(6,'jjjj','/examinations',1,'2026-11-05',NULL,'2026-11-05 11:06:31');
/*!40000 ALTER TABLE `notices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification_templates`
--

DROP TABLE IF EXISTS `notification_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notification_templates` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `template_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `body_template` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'EMAIL',
  `active` tinyint(1) DEFAULT '1',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `template_key` (`template_key`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification_templates`
--

LOCK TABLES `notification_templates` WRITE;
/*!40000 ALTER TABLE `notification_templates` DISABLE KEYS */;
INSERT INTO `notification_templates` VALUES (1,'ENQUIRY_RECEIVED','Admission Enquiry Acknowledgment','Admission Enquiry Received - Reference No: {{reference_no}}','Dear {{student_name}},\n\nThank you for choosing Masters Pre-University College. We have received your admission enquiry for {{preferred_stream}} ({{preferred_combination}}) for Academic Year {{academic_year}}.\n\nYour Reference Number: {{reference_no}}\n\nOur admissions counsellor will contact you shortly to schedule your campus visit and document verification.\n\nWarm Regards,\nAdmissions Office, MPUC','EMAIL',1,'2026-10-26 13:47:49'),(2,'COUNSELLING_INVITE','Counselling Slot Confirmation','MPUC Admission Counselling Scheduled - {{reference_no}}','Dear Parent & Candidate,\n\nYour academic counselling and seat allocation session has been scheduled for {{appointment_time}} at Campus Office.\n\nPlease carry original 10th marks card, 3 passport photographs, and Aadhar copy.\n\nAdmissions Helpline: +91 80 2345 6789','EMAIL',1,'2026-10-26 13:47:49'),(3,'SEAT_ALLOTMENT_CONFIRMED','Provisional Admission Confirmation','Provisional Admission Confirmed - MPUC Bengaluru','Congratulations {{student_name}}!\n\nYour provisional admission for 1st PUC {{preferred_combination}} has been confirmed under Application No {{application_no}}.\n\nClasses commence on 15th June. Welcome to the MPUC family!','EMAIL',1,'2026-10-26 13:47:49');
/*!40000 ALTER TABLE `notification_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pages`
--

DROP TABLE IF EXISTS `pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta_description` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `published` tinyint(1) DEFAULT '1',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pages`
--

LOCK TABLES `pages` WRITE;
/*!40000 ALTER TABLE `pages` DISABLE KEYS */;
INSERT INTO `pages` VALUES (1,'about-us','About Masters PU College','Excellence in Collegiate Education Since 1998','Masters Pre-University College (MPUC) was established with a clear mandate to provide high quality, disciplined, and accessible pre-university education in Bengaluru. Our integrated academic pedagogy bridges the gap between state board syllabi and national level competitive exams like KCET, NEET, and JEE.','Learn about Masters Pre-University College Bengaluru, our academic history, values, and campus culture.',1,'2026-10-26 13:47:49'),(2,'vision-mission','Vision & Mission','Our Philosophical North Star','VISION:\nTo empower youth through value-based secondary education that stimulates scientific curiosity, analytical thinking, and ethical character.\n\nMISSION:\n1. Maintain academic rigor in Science and Commerce streams.\n2. Provide integrated coaching for competitive examinations without overburdening students.\n3. Cultivate inclusive campus facilities that foster cultural, athletic, and leadership excellence.','Vision, mission and institutional objectives of Masters Pre-University College.',1,'2026-10-26 13:47:49'),(3,'principals-message','Principal\'s Message','A Note from Dr. K. S. Venkatesh','Pre-University education is the critical watershed of higher secondary learning in India. The decisions made during these crucial two years define future trajectories in medicine, engineering, pure research, chartered accountancy, corporate finance, and administration.\n\nAt MPUC, we have engineered an academic framework that balances state board requirements with rigorous competitive problem solving. Our faculty members are empathetic mentors who monitor every student\'s learning pace.','Read the official message from the Principal of Masters Pre-University College.',1,'2026-10-26 13:47:49'),(4,'admission-guidelines','Admissions Guidelines & Eligibility','Academic Year 2026-27','ADMISSION PROCEDURE:\n1. Eligibility: Candidates must have passed 10th Standard / SSLC / CBSE / ICSE or equivalent with minimum aggregate criteria.\n2. Science Stream Eligibility: Minimum 60% in Science and Mathematics.\n3. Commerce Stream Eligibility: Minimum 50% in aggregate.\n4. Required Documents: Original 10th Marks Card, Transfer Certificate (TC), Conduct Certificate, 4 passport photos, and Aadhar copy.','Complete eligibility guidelines, fee structure, and document checklist for 1st PUC admissions.',1,'2026-10-26 13:47:49');
/*!40000 ALTER TABLE `pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiry_date` timestamp NOT NULL,
  `used` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `fk_pw_reset_user` (`user_id`),
  CONSTRAINT `fk_pw_reset_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ROLE_ADMIN','Full Administrative Privileges'),(2,'ROLE_STAFF','Academic Staff & Enquiries Management'),(3,'ROLE_STUDENT','Student & Applicant Role'),(4,'ROLE_SUPER_ADMIN','Full Unrestricted Administrative Privileges across all modules'),(5,'ROLE_CONTENT_EDITOR','Content, Media, and Academic Publishing Editor'),(6,'ROLE_ADMISSION_STAFF','Admissions, Enquiries, Applications and Student Records Manager');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scholarships`
--

DROP TABLE IF EXISTS `scholarships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `scholarships` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `eligibility_criteria` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `benefit_amount` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deadline` date DEFAULT NULL,
  `application_link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scholarships`
--

LOCK TABLES `scholarships` WRITE;
/*!40000 ALTER TABLE `scholarships` DISABLE KEYS */;
INSERT INTO `scholarships` VALUES (1,'Sri Vidyodaya Merit Excellence Scholarship','MERIT','Students scoring >= 95% aggregate in 10th Standard / SSLC / CBSE / ICSE examinations.','100% Tuition Fee Waiver','2026-07-31','/admissions#enquiry-form',1,'2026-10-26 13:47:49'),(2,'Dr. APJ Abdul Kalam Science Aspirant Grant','MERIT','Students scoring >= 90% in Mathematics and Science opting for PCMB or PCMC stream.','50% Tuition Fee Waiver','2026-07-31','/admissions#enquiry-form',1,'2026-10-26 13:47:49'),(3,'Vidya Vardhaka Economic Need Concession','NEED_BASED','Students from low income families with annual household income < INR 2.5 Lakhs.','Up to 75% Fee Subsidy','2026-08-15','/contact',1,'2026-10-26 13:47:49'),(4,'Pratibha Sports & Athletics Felicitation','SPORTS','District, State, or National level medal winners in athletics, badminton, or cricket.','Full Sports Kit & 50% Concession','2026-08-30','/contact',1,'2026-10-26 13:47:49');
/*!40000 ALTER TABLE `scholarships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_achievements`
--

DROP TABLE IF EXISTS `student_achievements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student_achievements` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `academic_year` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `exam_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rank_or_score` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stream` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `combination` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `achievement_title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `photo_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `published` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_achievements`
--

LOCK TABLES `student_achievements` WRITE;
/*!40000 ALTER TABLE `student_achievements` DISABLE KEYS */;
INSERT INTO `student_achievements` VALUES (1,'Rohith S. Rao','2025-26','KCET','State Rank 9 (Engineering)','SCIENCE','PCMC','Top 10 State Rank in KCET Engineering','Master Rohith scored 592/600 in the Board examinations and achieved 9th State Rank in Karnataka CET 2026.','https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',1,'2026-10-26 13:47:49'),(2,'Ananya Kulkarni','2025-26','PU_BOARD','State Rank 6 (594/600)','COMMERCE','CEBA','State 6th Rank in Commerce Stream','Kum. Ananya secured 100/100 in Accountancy, Computer Science, and Business Studies in the State Board examinations.','https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',1,'2026-10-26 13:47:49'),(3,'Darshan Gowda','2024-25','NEET','682 / 720 Marks (AIR 412)','SCIENCE','PCMB','Secured MBBS Seat at Bangalore Medical College (BMC)','Darshan balanced Karnataka Board preparation with our integrated NEET test series to achieve a dream seat at BMC.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',1,'2026-10-26 13:47:49'),(4,'Meghana Murthy','2024-25','SPORTS','Gold Medalist - State Athletic Meet','COMMERCE','SEBA','400m Track Gold Medalist at Pre-University Athletic Meet','Represented the Bengaluru North district and set a state PU record in the 400m sprint.','https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',1,'2026-10-26 13:47:49');
/*!40000 ALTER TABLE `student_achievements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testimonials`
--

DROP TABLE IF EXISTS `testimonials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `testimonials` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch_year` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stream` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `achievement` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quote` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testimonials`
--

LOCK TABLES `testimonials` WRITE;
/*!40000 ALTER TABLE `testimonials` DISABLE KEYS */;
INSERT INTO `testimonials` VALUES (1,'Aditi S. Rao','Batch 2024-25','PCMB (Science)','Scored 591/600 in PUC & Cleared NEET with 660 marks','The structured coaching and laboratory experience at SVCPUC made all the difference. The faculty was always approachable, even after college hours for clarifying doubts.','https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',1,'2026-10-26 13:47:49'),(2,'Naveen Kumar G.','Batch 2023-24','CEBA (Commerce)','State 5th Rank in Karnataka PUC Commerce & Cleared CA Foundation','The commerce department here is unmatched. Real-life case studies, mock balance sheets, and dedicated CA foundation guidance gave me tremendous confidence.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',1,'2026-10-26 13:47:49'),(3,'Bhavana Hegde','Batch 2024-25','PCMC (Science)','Secured Admission at NIT Surathkal (Computer Engineering)','The Computer Science lab and coding workshops ignited my passion for technology. SVCPUC strikes a perfect balance between academic discipline and extracurricular growth.','https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',1,'2026-10-26 13:47:49'),(4,'shankar','Batch of 2025','Science (PCMC)','Admitted to RV College of Engineering (CSE)','gg','https://blog.algomaster.io/p/15-leetcode-patterns',1,'2026-11-05 10:19:26');
/*!40000 ALTER TABLE `testimonials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_roles` (
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `fk_user_roles_role` (`role_id`),
  CONSTRAINT `fk_user_roles_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_roles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (1,1),(2,2),(1,4);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_username` (`username`),
  KEY `idx_users_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@svcpuc.edu.in','$2a$10$zvtTIVL6fBhN/UaQVRx7iuXiRk87tLqsIIDGqjkSCYtu6MV4f3Chm','Dr. K. S. Venkatesh','+91 98450 12345',1,'2026-10-26 13:47:49','2026-10-26 08:17:53'),(2,'staff_admissions','admissions.staff@svcpuc.edu.in','$2a$10$hKDVYxL9zR.eA1/55g8a/.uQh5k4lqK.Vd6l9Vj7XbEwKz6V9pG2e','Prof. Sunita Rao','+91 98450 54321',1,'2026-10-26 13:47:49','2026-10-26 13:47:49');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-14 12:58:41


-- HFCCF schema reference synchronized from live backend database `hfccf_backend`.
-- Schema-only export generated on 2026-07-20. No application data included.
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS `academic_years`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `academic_years` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `organization_id` bigint unsigned NOT NULL,
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_current` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `academic_years_organization_id_name_unique` (`organization_id`,`name`),
  KEY `academic_years_organization_id_is_current_index` (`organization_id`,`is_current`),
  CONSTRAINT `academic_years_organization_id_foreign` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `actor_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `domain` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_label` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `ip_address` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `audit_logs_actor_user_id_index` (`actor_user_id`),
  KEY `audit_logs_domain_index` (`domain`),
  KEY `audit_logs_action_index` (`action`),
  KEY `audit_logs_entity_type_index` (`entity_type`),
  KEY `audit_logs_entity_id_index` (`entity_id`),
  KEY `audit_logs_created_at_index` (`created_at`),
  CONSTRAINT `audit_logs_actor_user_id_foreign` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `cambodia_communes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cambodia_communes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `province_id` bigint unsigned NOT NULL,
  `district_id` bigint unsigned NOT NULL,
  `code` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_kh` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_en` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cambodia_communes_code_unique` (`code`),
  KEY `cambodia_communes_district_id_foreign` (`district_id`),
  KEY `cambodia_communes_parent_code_index` (`province_id`,`district_id`,`code`),
  CONSTRAINT `cambodia_communes_district_id_foreign` FOREIGN KEY (`district_id`) REFERENCES `cambodia_districts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cambodia_communes_province_id_foreign` FOREIGN KEY (`province_id`) REFERENCES `cambodia_provinces` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `cambodia_districts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cambodia_districts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `province_id` bigint unsigned NOT NULL,
  `code` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_kh` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_en` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cambodia_districts_code_unique` (`code`),
  KEY `cambodia_districts_province_code_index` (`province_id`,`code`),
  CONSTRAINT `cambodia_districts_province_id_foreign` FOREIGN KEY (`province_id`) REFERENCES `cambodia_provinces` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `cambodia_provinces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cambodia_provinces` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_kh` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_en` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cambodia_provinces_code_unique` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `cambodia_villages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cambodia_villages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `province_id` bigint unsigned NOT NULL,
  `district_id` bigint unsigned NOT NULL,
  `commune_id` bigint unsigned DEFAULT NULL,
  `code` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_kh` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_en` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cambodia_villages_district_id_foreign` (`district_id`),
  KEY `cambodia_villages_commune_id_foreign` (`commune_id`),
  KEY `cambodia_villages_parent_code_index` (`province_id`,`district_id`,`commune_id`,`code`),
  KEY `cambodia_villages_code_index` (`code`),
  CONSTRAINT `cambodia_villages_commune_id_foreign` FOREIGN KEY (`commune_id`) REFERENCES `cambodia_communes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cambodia_villages_district_id_foreign` FOREIGN KEY (`district_id`) REFERENCES `cambodia_districts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cambodia_villages_province_id_foreign` FOREIGN KEY (`province_id`) REFERENCES `cambodia_provinces` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `deleted_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deleted_users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `original_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `department_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `user_created_at` timestamp NULL DEFAULT NULL,
  `user_updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `original_data` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `deleted_users_email_index` (`email`),
  KEY `deleted_users_deleted_at_index` (`deleted_at`),
  KEY `deleted_users_original_id_index` (`original_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_order` tinyint unsigned NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`code`),
  KEY `departments_is_active_index` (`is_active`),
  KEY `departments_display_order_index` (`display_order`),
  KEY `departments_created_by_foreign` (`created_by`),
  KEY `departments_updated_by_foreign` (`updated_by`),
  CONSTRAINT `departments_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `departments_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `domain_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `domain_codes` (
  `code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `notification_recipients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_recipients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `notification_id` bigint unsigned NOT NULL,
  `user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `dismissed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `notification_recipients_notification_user_unique` (`notification_id`,`user_id`),
  KEY `notification_recipients_user_index` (`user_id`),
  KEY `notification_recipients_read_at_index` (`read_at`),
  KEY `notification_recipients_dismissed_at_index` (`dismissed_at`),
  KEY `notification_recipients_created_at_index` (`created_at`),
  CONSTRAINT `notification_recipients_notification_id_foreign` FOREIGN KEY (`notification_id`) REFERENCES `notifications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `notification_recipients_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `notification_targets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_targets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `notification_id` bigint unsigned NOT NULL,
  `target_type` enum('all','role','department','module','user') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_value` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notification_targets_notification_type_index` (`notification_id`,`target_type`),
  KEY `notification_targets_target_type_index` (`target_type`),
  KEY `notification_targets_target_value_index` (`target_value`),
  CONSTRAINT `notification_targets_notification_id_foreign` FOREIGN KEY (`notification_id`) REFERENCES `notifications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('info','success','warning','error','system') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `module` enum('global','english','preschool','scholarship','sport') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_url` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `notifications_type_index` (`type`),
  KEY `notifications_module_index` (`module`),
  KEY `notifications_created_by_index` (`created_by`),
  KEY `notifications_created_at_index` (`created_at`),
  CONSTRAINT `notifications_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `organizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organizations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_kh` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` enum('ngo','school','social_org') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ngo',
  `logo` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `province` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `settings` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `organizations_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `password_reset_otps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_otps` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `otp_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `purpose` enum('forgot_password') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'forgot_password',
  `channel` enum('email') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'email',
  `status` enum('pending','verified','used','expired','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `attempts` tinyint unsigned NOT NULL DEFAULT '0',
  `max_attempts` tinyint unsigned NOT NULL DEFAULT '5',
  `resend_count` tinyint unsigned NOT NULL DEFAULT '0',
  `expires_at` timestamp NOT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `used_at` timestamp NULL DEFAULT NULL,
  `last_sent_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `request_ip` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `password_reset_otps_user_index` (`user_id`),
  KEY `password_reset_otps_email_index` (`email`),
  KEY `password_reset_otps_status_index` (`status`),
  KEY `password_reset_otps_expires_at_index` (`expires_at`),
  KEY `password_reset_otps_user_status_index` (`user_id`,`status`),
  CONSTRAINT `fk_password_reset_otps_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `module` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`code`),
  KEY `permissions_module_index` (`module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'AppModelsUser',
  `tokenable_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_index` (`tokenable_type`,`tokenable_id`),
  KEY `fk_personal_access_tokens_user` (`tokenable_id`),
  CONSTRAINT `fk_personal_access_tokens_user` FOREIGN KEY (`tokenable_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_academic_years`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_academic_years` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('active','closed','archived') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `is_current` tinyint(1) NOT NULL DEFAULT '0',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `preschool_academic_years_code_unique` (`code`),
  KEY `preschool_academic_years_status_current_index` (`status`,`is_current`),
  KEY `preschool_academic_years_created_by_foreign` (`created_by`),
  KEY `preschool_academic_years_updated_by_foreign` (`updated_by`),
  KEY `preschool_academic_years_deleted_at_index` (`deleted_at`),
  CONSTRAINT `preschool_academic_years_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_academic_years_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_assessment_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_assessment_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `preschool_assessment_categories_code_unique` (`code`),
  KEY `preschool_assessment_categories_active_sort_index` (`is_active`,`sort_order`),
  KEY `preschool_assessment_categories_created_by_foreign` (`created_by`),
  KEY `preschool_assessment_categories_updated_by_foreign` (`updated_by`),
  CONSTRAINT `preschool_assessment_categories_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_assessment_categories_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_assessment_grading_scales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_assessment_grading_scales` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `grade` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `minimum_score` decimal(5,2) NOT NULL,
  `maximum_score` decimal(5,2) NOT NULL,
  `color` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `is_passing` tinyint(1) NOT NULL DEFAULT '0',
  `created_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `preschool_assessment_grading_scales_grade_unique` (`grade`),
  KEY `preschool_assessment_grading_scales_sort_min_index` (`sort_order`,`minimum_score`),
  KEY `preschool_assessment_grading_scales_created_by_foreign` (`created_by`),
  KEY `preschool_assessment_grading_scales_updated_by_foreign` (`updated_by`),
  CONSTRAINT `preschool_assessment_grading_scales_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_assessment_grading_scales_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_assessment_report_periods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_assessment_report_periods` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `academic_year_id` bigint unsigned NOT NULL,
  `period_type` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'term',
  `term_id` bigint unsigned DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preschool_assessment_report_periods_term_id_foreign` (`term_id`),
  KEY `preschool_assessment_report_periods_context_index` (`academic_year_id`,`term_id`,`is_active`),
  KEY `preschool_assessment_report_periods_dates_index` (`start_date`,`end_date`),
  KEY `preschool_assessment_report_periods_created_by_foreign` (`created_by`),
  KEY `preschool_assessment_report_periods_updated_by_foreign` (`updated_by`),
  KEY `preschool_assessment_report_periods_type_context_active_index` (`period_type`,`academic_year_id`,`term_id`,`is_active`),
  CONSTRAINT `preschool_assessment_report_periods_academic_year_id_foreign` FOREIGN KEY (`academic_year_id`) REFERENCES `preschool_academic_years` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `preschool_assessment_report_periods_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_assessment_report_periods_term_id_foreign` FOREIGN KEY (`term_id`) REFERENCES `preschool_terms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_assessment_report_periods_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_assessment_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_assessment_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `passing_score` smallint unsigned NOT NULL DEFAULT '60',
  `grading_scale_type` enum('percentage','letter','custom') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'letter',
  `weighting_enabled` tinyint(1) NOT NULL DEFAULT '0',
  `created_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preschool_assessment_settings_created_by_foreign` (`created_by`),
  KEY `preschool_assessment_settings_updated_by_foreign` (`updated_by`),
  CONSTRAINT `preschool_assessment_settings_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_assessment_settings_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_assessment_weights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_assessment_weights` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint unsigned NOT NULL,
  `percentage` decimal(5,2) NOT NULL,
  `created_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `preschool_assessment_weights_category_unique` (`category_id`),
  KEY `preschool_assessment_weights_created_by_foreign` (`created_by`),
  KEY `preschool_assessment_weights_updated_by_foreign` (`updated_by`),
  CONSTRAINT `preschool_assessment_weights_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `preschool_assessment_categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `preschool_assessment_weights_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_assessment_weights_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_attendance_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_attendance_records` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `class_id` bigint unsigned NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  `recorded_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `attendance_date` date NOT NULL,
  `status` enum('present','absent','late','excused') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `academic_year_id` bigint unsigned DEFAULT NULL,
  `term_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `attendance_session_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `preschool_attendance_session_student_unique` (`attendance_session_id`,`student_id`),
  KEY `preschool_attendance_records_class_id_foreign` (`class_id`),
  KEY `preschool_attendance_records_student_id_foreign` (`student_id`),
  KEY `preschool_attendance_date_status_index` (`attendance_date`,`status`),
  KEY `preschool_attendance_recorded_by_index` (`recorded_by_user_id`),
  KEY `preschool_attendance_records_academic_year_id_foreign` (`academic_year_id`),
  KEY `preschool_attendance_records_term_id_foreign` (`term_id`),
  KEY `preschool_attendance_records_session_student_index` (`attendance_session_id`,`student_id`),
  CONSTRAINT `preschool_attendance_records_academic_year_id_foreign` FOREIGN KEY (`academic_year_id`) REFERENCES `preschool_academic_years` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_attendance_records_attendance_session_id_foreign` FOREIGN KEY (`attendance_session_id`) REFERENCES `preschool_attendance_sessions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_attendance_records_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `preschool_classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `preschool_attendance_records_recorded_by_user_id_foreign` FOREIGN KEY (`recorded_by_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `preschool_attendance_records_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `preschool_students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `preschool_attendance_records_term_id_foreign` FOREIGN KEY (`term_id`) REFERENCES `preschool_terms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_attendance_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_attendance_sessions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `session_code` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preschool_class_id` bigint unsigned NOT NULL,
  `preschool_schedule_entry_id` bigint unsigned DEFAULT NULL,
  `schedule_id` bigint unsigned DEFAULT NULL,
  `attendance_date` date NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'open',
  `generated_from_schedule` tinyint(1) NOT NULL DEFAULT '0',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `session_key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opened_by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opened_at` timestamp NULL DEFAULT NULL,
  `completed_by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `locked_by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `locked_at` timestamp NULL DEFAULT NULL,
  `reopened_by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reopened_at` timestamp NULL DEFAULT NULL,
  `cancelled_by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `cancellation_reason` text COLLATE utf8mb4_unicode_ci,
  `closed_by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `closed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `teacher_user_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opens_at` datetime DEFAULT NULL,
  `closes_at` datetime DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_occurrence_key` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_user_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by_user_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opened_by_user_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `closed_by_user_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `locked_by_user_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cancelled_by_user_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_reopened_by_user_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_reopened_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `preschool_attendance_sessions_session_key_unique` (`session_key`),
  KEY `preschool_attendance_sessions_class_date_index` (`preschool_class_id`,`attendance_date`),
  KEY `preschool_attendance_sessions_schedule_date_index` (`schedule_id`,`attendance_date`),
  KEY `preschool_attendance_sessions_created_by_foreign` (`created_by`),
  KEY `preschool_attendance_sessions_closed_by_foreign` (`closed_by`),
  KEY `preschool_attendance_sessions_teacher_user_id_index` (`teacher_user_id`),
  KEY `preschool_attendance_sessions_opens_at_index` (`opens_at`),
  KEY `preschool_attendance_sessions_closes_at_index` (`closes_at`),
  KEY `preschool_attendance_sessions_source_occurrence_key_index` (`source_occurrence_key`),
  KEY `preschool_attendance_sessions_created_by_user_id_index` (`created_by_user_id`),
  KEY `preschool_attendance_sessions_updated_by_user_id_index` (`updated_by_user_id`),
  KEY `preschool_attendance_sessions_opened_by_user_id_index` (`opened_by_user_id`),
  KEY `preschool_attendance_sessions_closed_by_user_id_index` (`closed_by_user_id`),
  KEY `preschool_attendance_sessions_locked_by_user_id_index` (`locked_by_user_id`),
  KEY `preschool_attendance_sessions_cancelled_by_user_id_index` (`cancelled_by_user_id`),
  KEY `preschool_attendance_sessions_last_reopened_by_user_id_index` (`last_reopened_by_user_id`),
  CONSTRAINT `preschool_attendance_sessions_closed_by_foreign` FOREIGN KEY (`closed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_attendance_sessions_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_attendance_sessions_preschool_class_id_foreign` FOREIGN KEY (`preschool_class_id`) REFERENCES `preschool_classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `preschool_attendance_sessions_schedule_id_foreign` FOREIGN KEY (`schedule_id`) REFERENCES `preschool_schedule_entries` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_attendance_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_attendance_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `late_threshold_minutes` smallint unsigned NOT NULL DEFAULT '15',
  `half_day_threshold_minutes` smallint unsigned NOT NULL DEFAULT '180',
  `absence_alert_days` smallint unsigned NOT NULL DEFAULT '3',
  `guardian_alert_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `teacher_alert_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `admin_alert_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `monday_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `tuesday_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `wednesday_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `thursday_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `friday_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `saturday_enabled` tinyint(1) NOT NULL DEFAULT '0',
  `sunday_enabled` tinyint(1) NOT NULL DEFAULT '0',
  `created_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preschool_attendance_settings_created_by_foreign` (`created_by`),
  KEY `preschool_attendance_settings_updated_by_foreign` (`updated_by`),
  CONSTRAINT `preschool_attendance_settings_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_attendance_settings_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_automation_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_automation_tasks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `task_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `priority` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'normal',
  `status` enum('open','in_progress','completed','cancelled','overdue') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'open',
  `assigned_to_user_id` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigned_role` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `due_at` timestamp NULL DEFAULT NULL,
  `source_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preschool_student_id` bigint unsigned DEFAULT NULL,
  `preschool_class_id` bigint unsigned DEFAULT NULL,
  `action_route` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action_params` json DEFAULT NULL,
  `created_by` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `completed_by` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `cancelled_by` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preschool_automation_tasks_type_index` (`task_type`),
  KEY `preschool_automation_tasks_priority_index` (`priority`),
  KEY `preschool_automation_tasks_status_index` (`status`),
  KEY `preschool_automation_tasks_assigned_user_index` (`assigned_to_user_id`),
  KEY `preschool_automation_tasks_assigned_role_index` (`assigned_role`),
  KEY `preschool_automation_tasks_due_at_index` (`due_at`),
  KEY `preschool_automation_tasks_source_index` (`source_type`,`source_id`),
  KEY `preschool_automation_tasks_student_index` (`preschool_student_id`),
  KEY `preschool_automation_tasks_class_index` (`preschool_class_id`),
  KEY `preschool_automation_tasks_created_at_index` (`created_at`),
  KEY `preschool_automation_tasks_created_by_foreign` (`created_by`),
  KEY `preschool_automation_tasks_completed_by_foreign` (`completed_by`),
  KEY `preschool_automation_tasks_cancelled_by_foreign` (`cancelled_by`),
  CONSTRAINT `preschool_automation_tasks_assigned_to_user_id_foreign` FOREIGN KEY (`assigned_to_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_automation_tasks_cancelled_by_foreign` FOREIGN KEY (`cancelled_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_automation_tasks_completed_by_foreign` FOREIGN KEY (`completed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_automation_tasks_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_automation_tasks_preschool_class_id_foreign` FOREIGN KEY (`preschool_class_id`) REFERENCES `preschool_classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_automation_tasks_preschool_student_id_foreign` FOREIGN KEY (`preschool_student_id`) REFERENCES `preschool_students` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_class_levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_class_levels` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name_en` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_kh` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `preschool_class_levels_code_unique` (`code`),
  KEY `preschool_class_levels_active_sort_index` (`is_active`,`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_class_students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_class_students` (
  `class_id` bigint unsigned NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  `enrolled_at` timestamp NULL DEFAULT NULL,
  `academic_year` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `term_label` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `academic_year_id` bigint unsigned DEFAULT NULL,
  `term_id` bigint unsigned DEFAULT NULL,
  `enrollment_status` enum('active','inactive','transferred','completed','graduated','promoted','archived') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `enrollment_started_at` timestamp NULL DEFAULT NULL,
  `enrollment_ended_at` timestamp NULL DEFAULT NULL,
  `status` enum('active','inactive','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  UNIQUE KEY `preschool_class_students_unique` (`class_id`,`student_id`),
  KEY `preschool_class_students_student_status_index` (`student_id`,`status`),
  KEY `preschool_class_students_academic_year_id_foreign` (`academic_year_id`),
  KEY `preschool_class_students_term_id_foreign` (`term_id`),
  CONSTRAINT `preschool_class_students_academic_year_id_foreign` FOREIGN KEY (`academic_year_id`) REFERENCES `preschool_academic_years` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_class_students_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `preschool_classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `preschool_class_students_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `preschool_students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `preschool_class_students_term_id_foreign` FOREIGN KEY (`term_id`) REFERENCES `preschool_terms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_class_teacher_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_class_teacher_assignments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `class_id` bigint unsigned NOT NULL,
  `teacher_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `teacher_display_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `assigned_at` timestamp NULL DEFAULT NULL,
  `academic_year` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `academic_year_id` bigint unsigned DEFAULT NULL,
  `term_id` bigint unsigned DEFAULT NULL,
  `term_label` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ended_at` timestamp NULL DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preschool_class_teacher_assignments_class_id_status_index` (`class_id`,`status`),
  KEY `preschool_class_teacher_assignments_teacher_user_id_status_index` (`teacher_user_id`,`status`),
  KEY `preschool_class_teacher_assignments_teacher_user_id_index` (`teacher_user_id`),
  KEY `preschool_class_teacher_assignments_academic_year_id_foreign` (`academic_year_id`),
  KEY `preschool_class_teacher_assignments_term_id_foreign` (`term_id`),
  CONSTRAINT `pcta_teacher_user_fk` FOREIGN KEY (`teacher_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_class_teacher_assignments_academic_year_id_foreign` FOREIGN KEY (`academic_year_id`) REFERENCES `preschool_academic_years` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_class_teacher_assignments_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `preschool_classes` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `preschool_class_teacher_assignments_term_id_foreign` FOREIGN KEY (`term_id`) REFERENCES `preschool_terms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_classes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `teacher_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `teacher_display_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `class_level_id` bigint unsigned DEFAULT NULL,
  `level` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `schedule` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `students_count` int unsigned NOT NULL DEFAULT '0',
  `tuition_fee` decimal(10,2) DEFAULT NULL COMMENT 'Term tuition charged per enrolled student',
  `status` enum('active','pending','closed','archived') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `room` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `preschool_classes_code_unique` (`code`),
  KEY `preschool_classes_status_level_index` (`status`,`level`),
  KEY `preschool_classes_teacher_user_id_index` (`teacher_user_id`),
  KEY `preschool_classes_class_level_id_index` (`class_level_id`),
  CONSTRAINT `preschool_classes_class_level_id_foreign` FOREIGN KEY (`class_level_id`) REFERENCES `preschool_class_levels` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_classes_teacher_user_id_foreign` FOREIGN KEY (`teacher_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_classroom_resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_classroom_resources` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('books','toys','equipment','supplies','digital') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'supplies',
  `quantity` int unsigned NOT NULL DEFAULT '0',
  `condition` enum('good','fair','poor') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'good',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `classroom_resources_category_condition_index` (`category`,`condition`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_enrollment_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_enrollment_applications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `application_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `khmer_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latin_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` enum('male','female','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `place_of_birth` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nationality` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Cambodian',
  `ethnicity` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_province_id` bigint unsigned DEFAULT NULL,
  `birth_district_id` bigint unsigned DEFAULT NULL,
  `birth_commune_id` bigint unsigned DEFAULT NULL,
  `birth_village_id` bigint unsigned DEFAULT NULL,
  `residence_province_id` bigint unsigned DEFAULT NULL,
  `residence_district_id` bigint unsigned DEFAULT NULL,
  `residence_commune_id` bigint unsigned DEFAULT NULL,
  `residence_village_id` bigint unsigned DEFAULT NULL,
  `avatar` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requested_academic_year_id` bigint unsigned DEFAULT NULL,
  `requested_term_id` bigint unsigned DEFAULT NULL,
  `requested_level` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preferred_class_id` bigint unsigned DEFAULT NULL,
  `requested_start_date` date DEFAULT NULL,
  `guardian_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guardian_relationship` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guardian_phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guardian_email` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guardian_address` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guardian_can_pickup` tinyint(1) NOT NULL DEFAULT '1',
  `guardian_is_emergency` tinyint(1) NOT NULL DEFAULT '1',
  `status` enum('draft','submitted','under_review','approved','waitlisted','rejected','enrolled','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `application_date` date DEFAULT NULL,
  `source` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'walk_in',
  `admin_notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `rejection_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `waitlist_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `reviewed_by_user_id` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `approved_by_user_id` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `enrolled_by_user_id` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `enrolled_at` timestamp NULL DEFAULT NULL,
  `enrolled_student_id` bigint unsigned DEFAULT NULL,
  `created_by_user_id` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by_user_id` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `preschool_enrollment_applications_application_code_unique` (`application_code`),
  KEY `enrollment_status_index` (`status`),
  KEY `enrollment_date_index` (`application_date`),
  KEY `enrollment_academic_index` (`requested_academic_year_id`,`requested_term_id`),
  KEY `pea_req_term_fk` (`requested_term_id`),
  KEY `pea_pref_class_fk` (`preferred_class_id`),
  KEY `pea_enrolled_student_fk` (`enrolled_student_id`),
  KEY `pea_reviewed_by_fk` (`reviewed_by_user_id`),
  KEY `pea_approved_by_fk` (`approved_by_user_id`),
  KEY `pea_enrolled_by_fk` (`enrolled_by_user_id`),
  KEY `pea_created_by_fk` (`created_by_user_id`),
  KEY `pea_updated_by_fk` (`updated_by_user_id`),
  KEY `preschool_enrollment_applications_birth_province_id_foreign` (`birth_province_id`),
  KEY `preschool_enrollment_applications_birth_district_id_foreign` (`birth_district_id`),
  KEY `preschool_enrollment_applications_birth_commune_id_foreign` (`birth_commune_id`),
  KEY `preschool_enrollment_applications_birth_village_id_foreign` (`birth_village_id`),
  KEY `preschool_enrollment_applications_residence_province_id_foreign` (`residence_province_id`),
  KEY `preschool_enrollment_applications_residence_district_id_foreign` (`residence_district_id`),
  KEY `preschool_enrollment_applications_residence_commune_id_foreign` (`residence_commune_id`),
  KEY `preschool_enrollment_applications_residence_village_id_foreign` (`residence_village_id`),
  CONSTRAINT `pea_approved_by_fk` FOREIGN KEY (`approved_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pea_created_by_fk` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pea_enrolled_by_fk` FOREIGN KEY (`enrolled_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pea_enrolled_student_fk` FOREIGN KEY (`enrolled_student_id`) REFERENCES `preschool_students` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pea_pref_class_fk` FOREIGN KEY (`preferred_class_id`) REFERENCES `preschool_classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pea_req_ay_fk` FOREIGN KEY (`requested_academic_year_id`) REFERENCES `preschool_academic_years` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pea_req_term_fk` FOREIGN KEY (`requested_term_id`) REFERENCES `preschool_terms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pea_reviewed_by_fk` FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pea_updated_by_fk` FOREIGN KEY (`updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_enrollment_applications_birth_commune_id_foreign` FOREIGN KEY (`birth_commune_id`) REFERENCES `cambodia_communes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_enrollment_applications_birth_district_id_foreign` FOREIGN KEY (`birth_district_id`) REFERENCES `cambodia_districts` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_enrollment_applications_birth_province_id_foreign` FOREIGN KEY (`birth_province_id`) REFERENCES `cambodia_provinces` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_enrollment_applications_birth_village_id_foreign` FOREIGN KEY (`birth_village_id`) REFERENCES `cambodia_villages` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_enrollment_applications_residence_commune_id_foreign` FOREIGN KEY (`residence_commune_id`) REFERENCES `cambodia_communes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_enrollment_applications_residence_district_id_foreign` FOREIGN KEY (`residence_district_id`) REFERENCES `cambodia_districts` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_enrollment_applications_residence_province_id_foreign` FOREIGN KEY (`residence_province_id`) REFERENCES `cambodia_provinces` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_enrollment_applications_residence_village_id_foreign` FOREIGN KEY (`residence_village_id`) REFERENCES `cambodia_villages` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_enrollment_decision_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_enrollment_decision_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `application_id` bigint unsigned NOT NULL,
  `action` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `from_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `to_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `actor_user_id` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `actor_role` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `context` json DEFAULT NULL,
  `recorded_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `enrollment_log_app_time_index` (`application_id`,`recorded_at`),
  KEY `pedl_actor_user_fk` (`actor_user_id`),
  CONSTRAINT `pedl_actor_user_fk` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_enrollment_decision_logs_application_id_foreign` FOREIGN KEY (`application_id`) REFERENCES `preschool_enrollment_applications` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_enrollment_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_enrollment_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `application_id` bigint unsigned NOT NULL,
  `document_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_required` tinyint(1) NOT NULL DEFAULT '1',
  `is_received` tinyint(1) NOT NULL DEFAULT '0',
  `received_date` date DEFAULT NULL,
  `file_path` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `enrollment_doc_unique` (`application_id`,`document_type`),
  CONSTRAINT `preschool_enrollment_documents_application_id_foreign` FOREIGN KEY (`application_id`) REFERENCES `preschool_enrollment_applications` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_governance_case_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_governance_case_events` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `governance_case_id` bigint unsigned NOT NULL,
  `event_type` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `actor_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `actor_role` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `previous_status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `new_status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `preschool_governance_case_events_case_id_index` (`governance_case_id`),
  KEY `preschool_governance_case_events_event_type_index` (`event_type`),
  KEY `preschool_governance_case_events_actor_user_id_index` (`actor_user_id`),
  KEY `preschool_governance_case_events_created_at_index` (`created_at`),
  CONSTRAINT `preschool_governance_case_events_actor_user_id_foreign` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_governance_case_events_governance_case_id_foreign` FOREIGN KEY (`governance_case_id`) REFERENCES `preschool_governance_cases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_governance_case_evidence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_governance_case_evidence` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `governance_case_id` bigint unsigned NOT NULL,
  `evidence_type` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `evidence_reference` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `evidence_label` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `evidence_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `metadata` json DEFAULT NULL,
  `created_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `preschool_governance_case_evidence_case_id_index` (`governance_case_id`),
  KEY `preschool_governance_case_evidence_type_index` (`evidence_type`),
  KEY `preschool_governance_case_evidence_reference_index` (`evidence_reference`),
  KEY `preschool_governance_case_evidence_created_by_index` (`created_by`),
  KEY `preschool_governance_case_evidence_created_at_index` (`created_at`),
  CONSTRAINT `preschool_governance_case_evidence_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_governance_case_evidence_governance_case_id_foreign` FOREIGN KEY (`governance_case_id`) REFERENCES `preschool_governance_cases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_governance_cases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_governance_cases` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `case_key` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `summary` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `source_type` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_reference` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_context` json DEFAULT NULL,
  `severity` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  `risk_score` tinyint unsigned NOT NULL DEFAULT '0',
  `status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'open',
  `is_urgent` tinyint(1) NOT NULL DEFAULT '0',
  `urgent_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `owner_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reviewer_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `escalation_officer_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `academic_year_id` bigint unsigned DEFAULT NULL,
  `term_id` bigint unsigned DEFAULT NULL,
  `report_period_id` bigint unsigned DEFAULT NULL,
  `class_id` bigint unsigned DEFAULT NULL,
  `student_id` bigint unsigned DEFAULT NULL,
  `created_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `resolved_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `closed_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `closed_at` timestamp NULL DEFAULT NULL,
  `resolution_note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `latest_note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `preschool_governance_cases_case_key_unique` (`case_key`),
  KEY `preschool_governance_cases_term_id_foreign` (`term_id`),
  KEY `preschool_governance_cases_report_period_id_foreign` (`report_period_id`),
  KEY `preschool_governance_cases_student_id_foreign` (`student_id`),
  KEY `preschool_governance_cases_case_key_index` (`case_key`),
  KEY `preschool_governance_cases_source_type_index` (`source_type`),
  KEY `preschool_governance_cases_source_reference_index` (`source_reference`),
  KEY `preschool_governance_cases_severity_index` (`severity`),
  KEY `preschool_governance_cases_status_index` (`status`),
  KEY `preschool_governance_cases_risk_score_index` (`risk_score`),
  KEY `preschool_governance_cases_is_urgent_index` (`is_urgent`),
  KEY `preschool_governance_cases_owner_user_id_index` (`owner_user_id`),
  KEY `preschool_governance_cases_reviewer_user_id_index` (`reviewer_user_id`),
  KEY `preschool_governance_cases_escalation_officer_user_id_index` (`escalation_officer_user_id`),
  KEY `preschool_governance_cases_due_date_index` (`due_date`),
  KEY `preschool_governance_cases_academic_context_index` (`academic_year_id`,`term_id`,`report_period_id`),
  KEY `preschool_governance_cases_entity_index` (`class_id`,`student_id`),
  KEY `preschool_governance_cases_created_at_index` (`created_at`),
  KEY `preschool_governance_cases_updated_at_index` (`updated_at`),
  KEY `preschool_governance_cases_created_by_foreign` (`created_by`),
  KEY `preschool_governance_cases_resolved_by_foreign` (`resolved_by`),
  KEY `preschool_governance_cases_closed_by_foreign` (`closed_by`),
  CONSTRAINT `preschool_governance_cases_academic_year_id_foreign` FOREIGN KEY (`academic_year_id`) REFERENCES `preschool_academic_years` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_governance_cases_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `preschool_classes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_governance_cases_closed_by_foreign` FOREIGN KEY (`closed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_governance_cases_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `preschool_governance_cases_escalation_officer_user_id_foreign` FOREIGN KEY (`escalation_officer_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_governance_cases_owner_user_id_foreign` FOREIGN KEY (`owner_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_governance_cases_report_period_id_foreign` FOREIGN KEY (`report_period_id`) REFERENCES `preschool_report_periods` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_governance_cases_resolved_by_foreign` FOREIGN KEY (`resolved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_governance_cases_reviewer_user_id_foreign` FOREIGN KEY (`reviewer_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_governance_cases_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `preschool_students` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_governance_cases_term_id_foreign` FOREIGN KEY (`term_id`) REFERENCES `preschool_terms` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_guardian_communications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_guardian_communications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned DEFAULT NULL,
  `guardian_id` bigint unsigned DEFAULT NULL,
  `source_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `communication_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `severity` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `sent_at` timestamp NULL DEFAULT NULL,
  `acknowledged_at` timestamp NULL DEFAULT NULL,
  `failed_at` timestamp NULL DEFAULT NULL,
  `created_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preschool_guardian_communications_student_id_foreign` (`student_id`),
  KEY `preschool_guardian_communications_guardian_id_foreign` (`guardian_id`),
  KEY `preschool_guardian_communications_source_index` (`source_type`,`source_id`),
  CONSTRAINT `preschool_guardian_communications_guardian_id_foreign` FOREIGN KEY (`guardian_id`) REFERENCES `preschool_guardians` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_guardian_communications_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `preschool_students` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_guardian_governance_issues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_guardian_governance_issues` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `issue_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `issue_key` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `severity` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'info',
  `priority` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'low',
  `status` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'detected',
  `student_id` bigint unsigned DEFAULT NULL,
  `guardian_id` bigint unsigned DEFAULT NULL,
  `relationship_id` bigint unsigned DEFAULT NULL,
  `assigned_to_user_id` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `detected_at` timestamp NOT NULL,
  `acknowledged_at` timestamp NULL DEFAULT NULL,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `dismissed_at` timestamp NULL DEFAULT NULL,
  `recurrence_count` int unsigned NOT NULL DEFAULT '0',
  `latest_snapshot` json DEFAULT NULL,
  `resolution_notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preschool_guardian_governance_issues_issue_type_index` (`issue_type`),
  KEY `preschool_guardian_governance_issues_issue_key_index` (`issue_key`),
  KEY `preschool_guardian_governance_issues_severity_index` (`severity`),
  KEY `preschool_guardian_governance_issues_priority_index` (`priority`),
  KEY `preschool_guardian_governance_issues_status_index` (`status`),
  KEY `preschool_guardian_governance_issues_student_id_index` (`student_id`),
  KEY `preschool_guardian_governance_issues_guardian_id_index` (`guardian_id`),
  KEY `preschool_guardian_governance_issues_assigned_to_user_id_index` (`assigned_to_user_id`),
  KEY `preschool_guardian_governance_issues_detected_at_index` (`detected_at`),
  KEY `pghi_relationship_fk` (`relationship_id`),
  CONSTRAINT `pghi_assigned_user_fk` FOREIGN KEY (`assigned_to_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pghi_guardian_fk` FOREIGN KEY (`guardian_id`) REFERENCES `preschool_guardians` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pghi_relationship_fk` FOREIGN KEY (`relationship_id`) REFERENCES `preschool_student_guardians` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pghi_student_fk` FOREIGN KEY (`student_id`) REFERENCES `preschool_students` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_guardian_portal_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_guardian_portal_accounts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `guardian_id` bigint unsigned NOT NULL,
  `user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `invited_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invited_at` timestamp NULL DEFAULT NULL,
  `activated_at` timestamp NULL DEFAULT NULL,
  `revoked_at` timestamp NULL DEFAULT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `preschool_guardian_portal_accounts_email_unique` (`email`),
  UNIQUE KEY `preschool_guardian_portal_accounts_user_id_unique` (`user_id`),
  KEY `preschool_guardian_portal_accounts_invited_by_user_id_foreign` (`invited_by_user_id`),
  KEY `preschool_guardian_portal_accounts_guardian_id_index` (`guardian_id`),
  KEY `preschool_guardian_portal_accounts_user_id_index` (`user_id`),
  KEY `preschool_guardian_portal_accounts_status_idx` (`status`),
  KEY `preschool_guardian_portal_accounts_email_index` (`email`),
  KEY `preschool_guardian_portal_accounts_status_index` (`status`),
  CONSTRAINT `preschool_guardian_portal_accounts_guardian_id_foreign` FOREIGN KEY (`guardian_id`) REFERENCES `preschool_guardians` (`id`) ON DELETE CASCADE,
  CONSTRAINT `preschool_guardian_portal_accounts_invited_by_user_id_foreign` FOREIGN KEY (`invited_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_guardian_portal_accounts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_guardian_remediation_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_guardian_remediation_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `issue_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `issue_key` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `student_id` bigint unsigned DEFAULT NULL,
  `guardian_id` bigint unsigned DEFAULT NULL,
  `related_guardian_id` bigint unsigned DEFAULT NULL,
  `relationship_id` bigint unsigned DEFAULT NULL,
  `action` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `before_snapshot` json DEFAULT NULL,
  `after_snapshot` json DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `performed_by_user_id` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `performed_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preschool_guardian_remediation_logs_issue_type_index` (`issue_type`),
  KEY `preschool_guardian_remediation_logs_student_id_index` (`student_id`),
  KEY `preschool_guardian_remediation_logs_guardian_id_index` (`guardian_id`),
  KEY `preschool_guardian_remediation_logs_related_guardian_id_index` (`related_guardian_id`),
  KEY `preschool_guardian_remediation_logs_performed_by_user_id_index` (`performed_by_user_id`),
  KEY `preschool_guardian_remediation_logs_performed_at_index` (`performed_at`),
  KEY `pgrl_relationship_fk` (`relationship_id`),
  CONSTRAINT `pgrl_guardian_fk` FOREIGN KEY (`guardian_id`) REFERENCES `preschool_guardians` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pgrl_performed_by_fk` FOREIGN KEY (`performed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pgrl_related_guardian_fk` FOREIGN KEY (`related_guardian_id`) REFERENCES `preschool_guardians` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pgrl_relationship_fk` FOREIGN KEY (`relationship_id`) REFERENCES `preschool_student_guardians` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pgrl_student_fk` FOREIGN KEY (`student_id`) REFERENCES `preschool_students` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_guardians`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_guardians` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `full_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `secondary_phone` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `occupation` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `national_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preschool_guardians_status_name_index` (`status`,`full_name`),
  KEY `preschool_guardians_phone_status_index` (`phone`,`status`),
  KEY `preschool_guardians_status_index` (`status`),
  KEY `preschool_guardians_created_by_user_id_index` (`created_by_user_id`),
  KEY `preschool_guardians_updated_by_user_id_index` (`updated_by_user_id`),
  CONSTRAINT `preschool_guardians_created_by_user_id_foreign` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_guardians_updated_by_user_id_foreign` FOREIGN KEY (`updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_health_alerts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_health_alerts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `alert_type` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `severity` enum('low','medium','high','critical') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'low',
  `status` enum('new','acknowledged','in_progress','resolved','closed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'new',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `source_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `assigned_to_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `acknowledged_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `acknowledged_at` timestamp NULL DEFAULT NULL,
  `resolved_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resolved_at` timestamp NULL DEFAULT NULL,
  `closed_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `closed_at` timestamp NULL DEFAULT NULL,
  `resolution_notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `preschool_health_alerts_source_unique` (`student_id`,`source_type`,`source_id`),
  KEY `preschool_health_alerts_student_status_index` (`student_id`,`status`),
  KEY `preschool_health_alerts_student_severity_index` (`student_id`,`severity`),
  KEY `preschool_health_alerts_assignee_status_index` (`assigned_to_user_id`,`status`),
  KEY `preschool_health_alerts_acknowledged_by_user_id_foreign` (`acknowledged_by_user_id`),
  KEY `preschool_health_alerts_resolved_by_user_id_foreign` (`resolved_by_user_id`),
  KEY `preschool_health_alerts_closed_by_user_id_foreign` (`closed_by_user_id`),
  KEY `preschool_health_alerts_severity_index` (`severity`),
  KEY `preschool_health_alerts_status_index` (`status`),
  CONSTRAINT `preschool_health_alerts_acknowledged_by_user_id_foreign` FOREIGN KEY (`acknowledged_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_health_alerts_assigned_to_user_id_foreign` FOREIGN KEY (`assigned_to_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_health_alerts_closed_by_user_id_foreign` FOREIGN KEY (`closed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_health_alerts_resolved_by_user_id_foreign` FOREIGN KEY (`resolved_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_health_alerts_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `preschool_students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_invoice_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_invoice_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invoice_id` bigint unsigned NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` decimal(12,2) NOT NULL DEFAULT '1.00',
  `unit_price` decimal(12,2) NOT NULL DEFAULT '0.00',
  `amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preschool_invoice_items_invoice_sort_index` (`invoice_id`,`sort_order`),
  CONSTRAINT `preschool_invoice_items_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `preschool_invoices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_invoices` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `class_id` bigint unsigned NOT NULL,
  `academic_year_id` bigint unsigned DEFAULT NULL,
  `term_id` bigint unsigned DEFAULT NULL,
  `invoice_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `issue_date` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `subtotal` decimal(12,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `paid_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `balance_due` decimal(12,2) NOT NULL DEFAULT '0.00',
  `status` enum('draft','issued','partial','paid','overdue','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `created_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `preschool_invoices_invoice_number_unique` (`invoice_number`),
  KEY `preschool_invoices_academic_year_id_foreign` (`academic_year_id`),
  KEY `preschool_invoices_term_id_foreign` (`term_id`),
  KEY `preschool_invoices_student_status_index` (`student_id`,`status`),
  KEY `preschool_invoices_class_status_index` (`class_id`,`status`),
  KEY `preschool_invoices_status_due_index` (`status`,`due_date`),
  CONSTRAINT `preschool_invoices_academic_year_id_foreign` FOREIGN KEY (`academic_year_id`) REFERENCES `preschool_academic_years` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_invoices_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `preschool_classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `preschool_invoices_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `preschool_students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `preschool_invoices_term_id_foreign` FOREIGN KEY (`term_id`) REFERENCES `preschool_terms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_lifecycle_audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_lifecycle_audit_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `actor_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `actor_role` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action_type` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `academic_year_id` bigint unsigned DEFAULT NULL,
  `term_id` bigint unsigned DEFAULT NULL,
  `report_period_id` bigint unsigned DEFAULT NULL,
  `previous_state` json DEFAULT NULL,
  `new_state` json DEFAULT NULL,
  `override_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `lock_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lock_reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `request_context` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `preschool_lifecycle_audit_logs_actor_user_id_index` (`actor_user_id`),
  KEY `preschool_lifecycle_audit_logs_actor_role_index` (`actor_role`),
  KEY `preschool_lifecycle_audit_logs_action_type_index` (`action_type`),
  KEY `preschool_lifecycle_audit_logs_entity_type_index` (`entity_type`),
  KEY `preschool_lifecycle_audit_logs_entity_id_index` (`entity_id`),
  KEY `preschool_lifecycle_audit_logs_academic_year_id_index` (`academic_year_id`),
  KEY `preschool_lifecycle_audit_logs_term_id_index` (`term_id`),
  KEY `preschool_lifecycle_audit_logs_report_period_id_index` (`report_period_id`),
  KEY `preschool_lifecycle_audit_logs_created_at_index` (`created_at`),
  CONSTRAINT `preschool_lifecycle_audit_logs_academic_year_id_foreign` FOREIGN KEY (`academic_year_id`) REFERENCES `preschool_academic_years` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_lifecycle_audit_logs_actor_user_id_foreign` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_lifecycle_audit_logs_report_period_id_foreign` FOREIGN KEY (`report_period_id`) REFERENCES `preschool_report_periods` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_lifecycle_audit_logs_term_id_foreign` FOREIGN KEY (`term_id`) REFERENCES `preschool_terms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_monthly_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_monthly_submissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `academic_year_id` bigint unsigned NOT NULL,
  `class_id` bigint unsigned NOT NULL,
  `assessment_category_id` bigint unsigned NOT NULL,
  `submission_month` date NOT NULL COMMENT 'First day of the month, e.g., 2026-07-01',
  `submitted_at` timestamp NULL DEFAULT NULL COMMENT 'When teacher clicked Submit',
  `submitted_by_user_id` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Teacher who submitted (usually same as creator)',
  `reviewed_at` timestamp NULL DEFAULT NULL COMMENT 'When admin opened for review',
  `reviewed_by_user_id` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Admin who reviewed',
  `review_comment` text COLLATE utf8mb4_unicode_ci COMMENT 'Admin notes during review',
  `returned_at` timestamp NULL DEFAULT NULL COMMENT 'When admin returned for revision',
  `returned_by_user_id` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Admin who returned',
  `return_reason` text COLLATE utf8mb4_unicode_ci COMMENT 'Why submission was returned',
  `finalized_at` timestamp NULL DEFAULT NULL COMMENT 'When locked as official',
  `finalized_by_user_id` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Admin who finalized',
  `status` enum('draft','submitted','returned','finalized','archived') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `locked_at` timestamp NULL DEFAULT NULL COMMENT 'When no further edits allowed (= finalized_at)',
  `grading_scale_snapshot` json DEFAULT NULL COMMENT 'JSON snapshot of grading scales at finalization',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_monthly_submission` (`academic_year_id`,`class_id`,`assessment_category_id`,`submission_month`),
  KEY `idx_class_month` (`class_id`,`submission_month`),
  KEY `idx_status_submitted` (`status`,`submitted_at`),
  KEY `idx_category_status` (`assessment_category_id`,`status`),
  KEY `idx_year_status` (`academic_year_id`,`status`),
  KEY `idx_submitted_by_status` (`submitted_by_user_id`,`status`),
  KEY `idx_reviewed_by_status` (`reviewed_by_user_id`,`status`),
  KEY `preschool_monthly_submissions_returned_by_user_id_foreign` (`returned_by_user_id`),
  KEY `preschool_monthly_submissions_finalized_by_user_id_foreign` (`finalized_by_user_id`),
  CONSTRAINT `preschool_monthly_submissions_academic_year_id_foreign` FOREIGN KEY (`academic_year_id`) REFERENCES `preschool_academic_years` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `preschool_monthly_submissions_assessment_category_id_foreign` FOREIGN KEY (`assessment_category_id`) REFERENCES `preschool_assessment_categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `preschool_monthly_submissions_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `preschool_classes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `preschool_monthly_submissions_finalized_by_user_id_foreign` FOREIGN KEY (`finalized_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_monthly_submissions_returned_by_user_id_foreign` FOREIGN KEY (`returned_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_monthly_submissions_reviewed_by_user_id_foreign` FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_monthly_submissions_submitted_by_user_id_foreign` FOREIGN KEY (`submitted_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_notifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `notification_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `severity` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  `status` enum('unread','read','archived') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unread',
  `target_user_id` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_role` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preschool_student_id` bigint unsigned DEFAULT NULL,
  `preschool_class_id` bigint unsigned DEFAULT NULL,
  `action_route` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action_params` json DEFAULT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL,
  `created_by` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preschool_notifications_type_index` (`notification_type`),
  KEY `preschool_notifications_severity_index` (`severity`),
  KEY `preschool_notifications_status_index` (`status`),
  KEY `preschool_notifications_target_user_index` (`target_user_id`),
  KEY `preschool_notifications_target_role_index` (`target_role`),
  KEY `preschool_notifications_source_index` (`source_type`,`source_id`),
  KEY `preschool_notifications_student_index` (`preschool_student_id`),
  KEY `preschool_notifications_class_index` (`preschool_class_id`),
  KEY `preschool_notifications_created_at_index` (`created_at`),
  KEY `preschool_notifications_created_by_foreign` (`created_by`),
  CONSTRAINT `preschool_notifications_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_notifications_preschool_class_id_foreign` FOREIGN KEY (`preschool_class_id`) REFERENCES `preschool_classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_notifications_preschool_student_id_foreign` FOREIGN KEY (`preschool_student_id`) REFERENCES `preschool_students` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_notifications_target_user_id_foreign` FOREIGN KEY (`target_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `class_id` bigint unsigned NOT NULL,
  `invoice_id` bigint unsigned DEFAULT NULL,
  `academic_year_id` bigint unsigned DEFAULT NULL,
  `term_id` bigint unsigned DEFAULT NULL,
  `payment_reference` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `currency` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `payment_method` enum('cash','mobile_payment','bank_transfer','card','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cash',
  `payment_status` enum('pending','paid','overdue','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `paid_at` timestamp NULL DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `preschool_payments_payment_reference_unique` (`payment_reference`),
  KEY `preschool_payments_student_id_foreign` (`student_id`),
  KEY `preschool_payments_class_id_foreign` (`class_id`),
  KEY `preschool_payments_status_due_index` (`payment_status`,`due_date`),
  KEY `preschool_payments_academic_year_id_foreign` (`academic_year_id`),
  KEY `preschool_payments_term_id_foreign` (`term_id`),
  KEY `preschool_payments_invoice_id_foreign` (`invoice_id`),
  CONSTRAINT `preschool_payments_academic_year_id_foreign` FOREIGN KEY (`academic_year_id`) REFERENCES `preschool_academic_years` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_payments_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `preschool_classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `preschool_payments_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `preschool_invoices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_payments_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `preschool_students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `preschool_payments_term_id_foreign` FOREIGN KEY (`term_id`) REFERENCES `preschool_terms` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_receipts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_receipts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `payment_id` bigint unsigned DEFAULT NULL,
  `invoice_id` bigint unsigned DEFAULT NULL,
  `reissued_from_receipt_id` bigint unsigned DEFAULT NULL,
  `receipt_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `issued_at` timestamp NULL DEFAULT NULL,
  `issued_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `payment_method` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `preschool_receipts_receipt_number_unique` (`receipt_number`),
  KEY `preschool_receipts_reissued_from_receipt_id_foreign` (`reissued_from_receipt_id`),
  KEY `preschool_receipts_payment_issued_index` (`payment_id`,`issued_at`),
  KEY `preschool_receipts_invoice_issued_index` (`invoice_id`,`issued_at`),
  CONSTRAINT `preschool_receipts_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `preschool_invoices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_receipts_payment_id_foreign` FOREIGN KEY (`payment_id`) REFERENCES `preschool_payments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_receipts_reissued_from_receipt_id_foreign` FOREIGN KEY (`reissued_from_receipt_id`) REFERENCES `preschool_receipts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_report_export_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_report_export_records` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `actor_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `actor_role` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `export_type` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `export_format` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `export_source` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `academic_year_id` bigint unsigned DEFAULT NULL,
  `term_id` bigint unsigned DEFAULT NULL,
  `report_period_id` bigint unsigned DEFAULT NULL,
  `filters` json DEFAULT NULL,
  `snapshot_ids` json DEFAULT NULL,
  `record_count` int unsigned DEFAULT NULL,
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `checksum` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `export_reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `request_context` json DEFAULT NULL,
  `exported_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preschool_report_export_records_term_id_foreign` (`term_id`),
  KEY `preschool_report_export_records_report_period_id_foreign` (`report_period_id`),
  KEY `preschool_report_export_records_actor_user_id_index` (`actor_user_id`),
  KEY `preschool_report_export_records_export_type_export_format_index` (`export_type`,`export_format`),
  KEY `preschool_report_export_records_export_source_exported_at_index` (`export_source`,`exported_at`),
  KEY `preschool_report_export_context_index` (`academic_year_id`,`term_id`,`report_period_id`),
  CONSTRAINT `preschool_report_export_records_academic_year_id_foreign` FOREIGN KEY (`academic_year_id`) REFERENCES `preschool_academic_years` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_report_export_records_actor_user_id_foreign` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_report_export_records_report_period_id_foreign` FOREIGN KEY (`report_period_id`) REFERENCES `preschool_report_periods` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_report_export_records_term_id_foreign` FOREIGN KEY (`term_id`) REFERENCES `preschool_terms` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_report_periods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_report_periods` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `period_label` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `period_type` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'term',
  `academic_year_id` bigint unsigned DEFAULT NULL,
  `term_id` bigint unsigned DEFAULT NULL,
  `from_date` date DEFAULT NULL,
  `to_date` date DEFAULT NULL,
  `status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `summary_snapshot` json DEFAULT NULL,
  `report_snapshot` json DEFAULT NULL,
  `locked_at` timestamp NULL DEFAULT NULL,
  `locked_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `finalized_at` timestamp NULL DEFAULT NULL,
  `finalized_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL,
  `archived_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `preschool_report_periods_period_context_unique` (`period_label`,`period_type`,`academic_year_id`,`term_id`),
  KEY `preschool_report_periods_period_label_index` (`period_label`),
  KEY `preschool_report_periods_academic_year_id_index` (`academic_year_id`),
  KEY `preschool_report_periods_term_id_index` (`term_id`),
  KEY `preschool_report_periods_status_index` (`status`),
  KEY `preschool_report_periods_locked_by_foreign` (`locked_by`),
  KEY `preschool_report_periods_finalized_by_foreign` (`finalized_by`),
  KEY `preschool_report_periods_archived_by_foreign` (`archived_by`),
  KEY `preschool_report_periods_type_context_status_index` (`period_type`,`academic_year_id`,`term_id`,`status`),
  CONSTRAINT `preschool_report_periods_academic_year_id_foreign` FOREIGN KEY (`academic_year_id`) REFERENCES `preschool_academic_years` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_report_periods_archived_by_foreign` FOREIGN KEY (`archived_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_report_periods_finalized_by_foreign` FOREIGN KEY (`finalized_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_report_periods_locked_by_foreign` FOREIGN KEY (`locked_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_report_periods_term_id_foreign` FOREIGN KEY (`term_id`) REFERENCES `preschool_terms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_report_snapshots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_report_snapshots` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `snapshot_type` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `student_id` bigint unsigned DEFAULT NULL,
  `class_id` bigint unsigned DEFAULT NULL,
  `academic_year_id` bigint unsigned DEFAULT NULL,
  `term_id` bigint unsigned DEFAULT NULL,
  `report_period_id` bigint unsigned DEFAULT NULL,
  `generated_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lifecycle_state` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'finalized',
  `snapshot_version` int unsigned NOT NULL DEFAULT '1',
  `snapshot_payload` json NOT NULL,
  `generated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `locked_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `preschool_report_snapshots_context_version_unique` (`snapshot_type`,`student_id`,`class_id`,`academic_year_id`,`term_id`,`report_period_id`,`snapshot_version`),
  KEY `preschool_report_snapshots_snapshot_type_index` (`snapshot_type`),
  KEY `preschool_report_snapshots_student_id_index` (`student_id`),
  KEY `preschool_report_snapshots_class_id_index` (`class_id`),
  KEY `preschool_report_snapshots_academic_year_id_index` (`academic_year_id`),
  KEY `preschool_report_snapshots_term_id_index` (`term_id`),
  KEY `preschool_report_snapshots_report_period_id_index` (`report_period_id`),
  KEY `preschool_report_snapshots_lifecycle_state_index` (`lifecycle_state`),
  KEY `preschool_report_snapshots_generated_by_foreign` (`generated_by`),
  CONSTRAINT `preschool_report_snapshots_academic_year_id_foreign` FOREIGN KEY (`academic_year_id`) REFERENCES `preschool_academic_years` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_report_snapshots_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `preschool_classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_report_snapshots_generated_by_foreign` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_report_snapshots_report_period_id_foreign` FOREIGN KEY (`report_period_id`) REFERENCES `preschool_report_periods` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_report_snapshots_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `preschool_students` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_report_snapshots_term_id_foreign` FOREIGN KEY (`term_id`) REFERENCES `preschool_terms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_schedule_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_schedule_entries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `class_id` bigint unsigned NOT NULL,
  `teacher_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `day_of_week` tinyint unsigned NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `room` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activity_label` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `effective_from` date DEFAULT NULL,
  `effective_until` date DEFAULT NULL,
  `academic_year_id` bigint unsigned DEFAULT NULL,
  `term_id` bigint unsigned DEFAULT NULL,
  `created_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preschool_schedule_entries_class_id_day_of_week_index` (`class_id`,`day_of_week`),
  KEY `preschool_schedule_entries_teacher_user_id_day_of_week_index` (`teacher_user_id`,`day_of_week`),
  KEY `preschool_schedule_entries_day_of_week_start_time_end_time_index` (`day_of_week`,`start_time`,`end_time`),
  KEY `preschool_schedule_entries_teacher_user_id_index` (`teacher_user_id`),
  KEY `preschool_schedule_entries_day_of_week_index` (`day_of_week`),
  KEY `preschool_schedule_entries_room_index` (`room`),
  KEY `preschool_schedule_entries_status_index` (`status`),
  KEY `preschool_schedule_entries_effective_from_index` (`effective_from`),
  KEY `preschool_schedule_entries_effective_until_index` (`effective_until`),
  KEY `preschool_schedule_entries_created_by_user_id_index` (`created_by_user_id`),
  KEY `preschool_schedule_entries_updated_by_user_id_index` (`updated_by_user_id`),
  KEY `preschool_schedule_entries_academic_year_id_foreign` (`academic_year_id`),
  KEY `preschool_schedule_entries_term_id_foreign` (`term_id`),
  CONSTRAINT `preschool_schedule_entries_academic_year_id_foreign` FOREIGN KEY (`academic_year_id`) REFERENCES `preschool_academic_years` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_schedule_entries_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `preschool_classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `preschool_schedule_entries_created_by_user_id_foreign` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_schedule_entries_teacher_user_id_foreign` FOREIGN KEY (`teacher_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_schedule_entries_term_id_foreign` FOREIGN KEY (`term_id`) REFERENCES `preschool_terms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_schedule_entries_updated_by_user_id_foreign` FOREIGN KEY (`updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_school_calendar_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_school_calendar_events` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `academic_year_id` bigint unsigned NOT NULL,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type` enum('holiday','closure','teacher_training','examination','special_event') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('active','archived') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preschool_school_calendar_events_year_type_status_index` (`academic_year_id`,`type`,`status`),
  KEY `preschool_school_calendar_events_dates_index` (`start_date`,`end_date`),
  KEY `preschool_school_calendar_events_created_by_foreign` (`created_by`),
  KEY `preschool_school_calendar_events_updated_by_foreign` (`updated_by`),
  CONSTRAINT `preschool_school_calendar_events_academic_year_id_foreign` FOREIGN KEY (`academic_year_id`) REFERENCES `preschool_academic_years` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `preschool_school_calendar_events_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_school_calendar_events_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_settings_backbone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_settings_backbone` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_default` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `preschool_settings_backbone_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_student_allergies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_student_allergies` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `allergy_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `allergy_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `severity` enum('mild','moderate','high','critical') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'mild',
  `reaction` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action_taken` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` enum('active','resolved','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preschool_student_allergies_student_severity_status_index` (`student_id`,`severity`,`status`),
  KEY `preschool_student_allergies_created_by_user_id_foreign` (`created_by_user_id`),
  KEY `preschool_student_allergies_updated_by_user_id_foreign` (`updated_by_user_id`),
  CONSTRAINT `preschool_student_allergies_created_by_user_id_foreign` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_student_allergies_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `preschool_students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `preschool_student_allergies_updated_by_user_id_foreign` FOREIGN KEY (`updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_student_assessments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_student_assessments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `monthly_submission_id` bigint unsigned DEFAULT NULL,
  `student_id` bigint unsigned NOT NULL,
  `class_id` bigint unsigned DEFAULT NULL,
  `category_id` bigint unsigned NOT NULL,
  `assessed_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `period_label` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `academic_year_id` bigint unsigned DEFAULT NULL,
  `term_id` bigint unsigned DEFAULT NULL,
  `assessment_date` date NOT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `rating` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observation` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `teacher_comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` enum('draft','finalized','archived') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `finalized_at` timestamp NULL DEFAULT NULL,
  `finalized_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_per_monthly_submission` (`monthly_submission_id`,`student_id`),
  KEY `preschool_student_assessments_student_date_index` (`student_id`,`assessment_date`),
  KEY `preschool_student_assessments_class_date_index` (`class_id`,`assessment_date`),
  KEY `preschool_student_assessments_category_status_index` (`category_id`,`status`),
  KEY `preschool_student_assessments_status_date_index` (`status`,`assessment_date`),
  KEY `preschool_student_assessments_assessed_by_index` (`assessed_by_user_id`),
  KEY `preschool_student_assessments_finalized_by_index` (`finalized_by_user_id`),
  KEY `preschool_student_assessments_academic_year_id_foreign` (`academic_year_id`),
  KEY `preschool_student_assessments_term_id_foreign` (`term_id`),
  KEY `idx_submission_status` (`monthly_submission_id`,`status`),
  CONSTRAINT `preschool_student_assessments_academic_year_id_foreign` FOREIGN KEY (`academic_year_id`) REFERENCES `preschool_academic_years` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_student_assessments_assessed_by_user_id_foreign` FOREIGN KEY (`assessed_by_user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `preschool_student_assessments_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `preschool_assessment_categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `preschool_student_assessments_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `preschool_classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_student_assessments_finalized_by_user_id_foreign` FOREIGN KEY (`finalized_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_student_assessments_monthly_submission_id_foreign` FOREIGN KEY (`monthly_submission_id`) REFERENCES `preschool_monthly_submissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `preschool_student_assessments_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `preschool_students` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `preschool_student_assessments_term_id_foreign` FOREIGN KEY (`term_id`) REFERENCES `preschool_terms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_student_guardians`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_student_guardians` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `guardian_id` bigint unsigned NOT NULL,
  `relationship_type` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT '0',
  `can_pickup` tinyint(1) NOT NULL DEFAULT '0',
  `emergency_priority` int unsigned DEFAULT NULL,
  `status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `starts_at` date DEFAULT NULL,
  `ends_at` date DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `preschool_student_guardians_unique_active_pair` (`student_id`,`guardian_id`,`status`),
  KEY `preschool_student_guardians_student_status_index` (`student_id`,`status`),
  KEY `preschool_student_guardians_guardian_status_index` (`guardian_id`,`status`),
  KEY `preschool_student_guardians_type_status_index` (`relationship_type`,`status`),
  KEY `preschool_student_guardians_primary_index` (`student_id`,`is_primary`,`status`),
  KEY `preschool_student_guardians_priority_index` (`student_id`,`emergency_priority`),
  KEY `preschool_student_guardians_status_index` (`status`),
  KEY `preschool_student_guardians_starts_at_index` (`starts_at`),
  KEY `preschool_student_guardians_ends_at_index` (`ends_at`),
  KEY `preschool_student_guardians_created_by_user_id_index` (`created_by_user_id`),
  KEY `preschool_student_guardians_updated_by_user_id_index` (`updated_by_user_id`),
  CONSTRAINT `preschool_student_guardians_created_by_user_id_foreign` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_student_guardians_guardian_id_foreign` FOREIGN KEY (`guardian_id`) REFERENCES `preschool_guardians` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `preschool_student_guardians_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `preschool_students` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `preschool_student_guardians_updated_by_user_id_foreign` FOREIGN KEY (`updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_student_health_audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_student_health_audit_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `actor_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `severity` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `visibility` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'admin',
  `before_state` json DEFAULT NULL,
  `after_state` json DEFAULT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `preschool_student_health_audit_logs_student_id_index` (`student_id`),
  KEY `preschool_student_health_audit_logs_actor_user_id_index` (`actor_user_id`),
  KEY `preschool_student_health_audit_logs_action_index` (`action`),
  KEY `preschool_student_health_audit_logs_entity_type_index` (`entity_type`),
  KEY `preschool_student_health_audit_logs_entity_id_index` (`entity_id`),
  KEY `preschool_student_health_audit_logs_severity_index` (`severity`),
  KEY `preschool_student_health_audit_logs_visibility_index` (`visibility`),
  KEY `preschool_student_health_audit_logs_created_at_index` (`created_at`),
  CONSTRAINT `preschool_student_health_audit_logs_actor_user_id_foreign` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_student_health_audit_logs_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `preschool_students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_student_health_check_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_student_health_check_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `checked_at` datetime NOT NULL,
  `temperature_celsius` decimal(4,1) DEFAULT NULL,
  `weight_kg` decimal(6,2) DEFAULT NULL,
  `height_cm` decimal(6,2) DEFAULT NULL,
  `symptoms` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` enum('recorded','reviewed','follow_up') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'recorded',
  `logged_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preschool_student_health_check_logs_student_checked_at_index` (`student_id`,`checked_at`),
  KEY `preschool_student_health_check_logs_logged_by_user_id_foreign` (`logged_by_user_id`),
  KEY `preschool_student_health_check_logs_created_by_user_id_foreign` (`created_by_user_id`),
  KEY `preschool_student_health_check_logs_updated_by_user_id_foreign` (`updated_by_user_id`),
  CONSTRAINT `preschool_student_health_check_logs_created_by_user_id_foreign` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_student_health_check_logs_logged_by_user_id_foreign` FOREIGN KEY (`logged_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_student_health_check_logs_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `preschool_students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `preschool_student_health_check_logs_updated_by_user_id_foreign` FOREIGN KEY (`updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_student_health_contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_student_health_contacts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `relationship` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `secondary_phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` int unsigned NOT NULL DEFAULT '1',
  `is_primary` tinyint(1) NOT NULL DEFAULT '0',
  `receive_alerts` tinyint(1) NOT NULL DEFAULT '1',
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preschool_student_health_contacts_student_priority_index` (`student_id`,`priority`),
  KEY `preschool_student_health_contacts_created_by_user_id_foreign` (`created_by_user_id`),
  KEY `preschool_student_health_contacts_updated_by_user_id_foreign` (`updated_by_user_id`),
  CONSTRAINT `preschool_student_health_contacts_created_by_user_id_foreign` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_student_health_contacts_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `preschool_students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `preschool_student_health_contacts_updated_by_user_id_foreign` FOREIGN KEY (`updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_student_health_incidents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_student_health_incidents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `incident_date` datetime NOT NULL,
  `incident_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `severity` enum('low','medium','high','critical') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'low',
  `action_taken` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `follow_up_needed` tinyint(1) NOT NULL DEFAULT '0',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` enum('open','closed','resolved') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'open',
  `reported_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preschool_student_health_incidents_student_severity_status_index` (`student_id`,`severity`,`status`),
  KEY `preschool_student_health_incidents_reported_by_user_id_foreign` (`reported_by_user_id`),
  KEY `preschool_student_health_incidents_created_by_user_id_foreign` (`created_by_user_id`),
  KEY `preschool_student_health_incidents_updated_by_user_id_foreign` (`updated_by_user_id`),
  CONSTRAINT `preschool_student_health_incidents_created_by_user_id_foreign` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_student_health_incidents_reported_by_user_id_foreign` FOREIGN KEY (`reported_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_student_health_incidents_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `preschool_students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `preschool_student_health_incidents_updated_by_user_id_foreign` FOREIGN KEY (`updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_student_medical_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_student_medical_profiles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `blood_type` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `chronic_conditions` json DEFAULT NULL,
  `current_conditions` json DEFAULT NULL,
  `medical_notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_by_user_id` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by_user_id` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preschool_student_medical_profiles_student_id_foreign` (`student_id`),
  KEY `psmp_created_by_fk` (`created_by_user_id`),
  KEY `psmp_updated_by_fk` (`updated_by_user_id`),
  CONSTRAINT `preschool_student_medical_profiles_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `preschool_students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `psmp_created_by_fk` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `psmp_student_fk` FOREIGN KEY (`student_id`) REFERENCES `preschool_students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `psmp_updated_by_fk` FOREIGN KEY (`updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_student_medication_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_student_medication_records` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `medication_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dosage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `frequency` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `route` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('active','inactive','stopped','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preschool_student_medication_records_student_status_index` (`student_id`,`status`),
  KEY `preschool_student_medication_records_created_by_user_id_foreign` (`created_by_user_id`),
  KEY `preschool_student_medication_records_updated_by_user_id_foreign` (`updated_by_user_id`),
  CONSTRAINT `preschool_student_medication_records_created_by_user_id_foreign` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_student_medication_records_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `preschool_students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `preschool_student_medication_records_updated_by_user_id_foreign` FOREIGN KEY (`updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_student_vaccination_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_student_vaccination_records` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `vaccine_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `vaccination_date` date DEFAULT NULL,
  `status` enum('pending','completed','overdue','unknown') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unknown',
  `dose_number` int unsigned DEFAULT NULL,
  `provider` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preschool_student_vaccination_records_student_status_index` (`student_id`,`status`),
  KEY `preschool_student_vaccination_records_created_by_user_id_foreign` (`created_by_user_id`),
  KEY `preschool_student_vaccination_records_updated_by_user_id_foreign` (`updated_by_user_id`),
  CONSTRAINT `preschool_student_vaccination_records_created_by_user_id_foreign` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_student_vaccination_records_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `preschool_students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `preschool_student_vaccination_records_updated_by_user_id_foreign` FOREIGN KEY (`updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_students` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `public_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `student_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `latin_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` enum('male','female','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `place_of_birth` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nationality` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Cambodian',
  `ethnicity` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_province_id` bigint unsigned DEFAULT NULL,
  `birth_district_id` bigint unsigned DEFAULT NULL,
  `birth_commune_id` bigint unsigned DEFAULT NULL,
  `birth_village_id` bigint unsigned DEFAULT NULL,
  `residence_province_id` bigint unsigned DEFAULT NULL,
  `residence_district_id` bigint unsigned DEFAULT NULL,
  `residence_commune_id` bigint unsigned DEFAULT NULL,
  `residence_village_id` bigint unsigned DEFAULT NULL,
  `guardian_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guardian_phone` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','pending','inactive','graduated') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `student_type` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'paying',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `preschool_students_student_code_unique` (`student_code`),
  UNIQUE KEY `preschool_students_public_id_unique` (`public_id`),
  KEY `preschool_students_status_last_name_index` (`status`,`last_name`),
  KEY `preschool_students_birth_province_id_foreign` (`birth_province_id`),
  KEY `preschool_students_birth_district_id_foreign` (`birth_district_id`),
  KEY `preschool_students_birth_commune_id_foreign` (`birth_commune_id`),
  KEY `preschool_students_birth_village_id_foreign` (`birth_village_id`),
  KEY `preschool_students_residence_province_id_foreign` (`residence_province_id`),
  KEY `preschool_students_residence_district_id_foreign` (`residence_district_id`),
  KEY `preschool_students_residence_commune_id_foreign` (`residence_commune_id`),
  KEY `preschool_students_residence_village_id_foreign` (`residence_village_id`),
  CONSTRAINT `preschool_students_birth_commune_id_foreign` FOREIGN KEY (`birth_commune_id`) REFERENCES `cambodia_communes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_students_birth_district_id_foreign` FOREIGN KEY (`birth_district_id`) REFERENCES `cambodia_districts` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_students_birth_province_id_foreign` FOREIGN KEY (`birth_province_id`) REFERENCES `cambodia_provinces` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_students_birth_village_id_foreign` FOREIGN KEY (`birth_village_id`) REFERENCES `cambodia_villages` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_students_residence_commune_id_foreign` FOREIGN KEY (`residence_commune_id`) REFERENCES `cambodia_communes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_students_residence_district_id_foreign` FOREIGN KEY (`residence_district_id`) REFERENCES `cambodia_districts` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_students_residence_province_id_foreign` FOREIGN KEY (`residence_province_id`) REFERENCES `cambodia_provinces` (`id`) ON DELETE SET NULL,
  CONSTRAINT `preschool_students_residence_village_id_foreign` FOREIGN KEY (`residence_village_id`) REFERENCES `cambodia_villages` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_terms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_terms` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `academic_year_id` bigint unsigned NOT NULL,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('active','closed','archived') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `is_current` tinyint(1) NOT NULL DEFAULT '0',
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `preschool_terms_code_unique` (`code`),
  KEY `preschool_terms_year_status_current_index` (`academic_year_id`,`status`,`is_current`),
  KEY `preschool_terms_created_by_foreign` (`created_by`),
  KEY `preschool_terms_updated_by_foreign` (`updated_by`),
  KEY `preschool_terms_deleted_at_index` (`deleted_at`),
  CONSTRAINT `preschool_terms_academic_year_id_foreign` FOREIGN KEY (`academic_year_id`) REFERENCES `preschool_academic_years` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `preschool_terms_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_terms_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_workflow_approvals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_workflow_approvals` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `workflow_instance_id` bigint unsigned NOT NULL,
  `workflow_step_id` bigint unsigned DEFAULT NULL,
  `requested_by_user_id` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requested_to_user_id` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requested_to_role` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','approved','rejected','returned','cancelled','escalated') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `decision_notes` text COLLATE utf8mb4_unicode_ci,
  `decided_by_user_id` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `decided_at` timestamp NULL DEFAULT NULL,
  `due_at` timestamp NULL DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preschool_workflow_approvals_instance_status_index` (`workflow_instance_id`,`status`),
  KEY `preschool_workflow_approvals_step_status_index` (`workflow_step_id`,`status`),
  KEY `preschool_workflow_approvals_requested_by_user_id_index` (`requested_by_user_id`),
  KEY `preschool_workflow_approvals_requested_to_user_id_index` (`requested_to_user_id`),
  KEY `preschool_workflow_approvals_requested_to_role_index` (`requested_to_role`),
  KEY `preschool_workflow_approvals_status_index` (`status`),
  KEY `preschool_workflow_approvals_decided_by_user_id_index` (`decided_by_user_id`),
  KEY `preschool_workflow_approvals_due_at_index` (`due_at`),
  CONSTRAINT `preschool_workflow_approvals_decided_by_user_id_foreign` FOREIGN KEY (`decided_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_workflow_approvals_requested_by_user_id_foreign` FOREIGN KEY (`requested_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_workflow_approvals_requested_to_user_id_foreign` FOREIGN KEY (`requested_to_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_workflow_approvals_workflow_instance_id_foreign` FOREIGN KEY (`workflow_instance_id`) REFERENCES `preschool_workflow_instances` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `preschool_workflow_approvals_workflow_step_id_foreign` FOREIGN KEY (`workflow_step_id`) REFERENCES `preschool_workflow_steps` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_workflow_definitions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_workflow_definitions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `domain` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `config` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `preschool_workflow_definitions_key_unique` (`key`),
  KEY `preschool_workflow_definitions_domain_index` (`domain`),
  KEY `preschool_workflow_definitions_is_active_index` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_workflow_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_workflow_events` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `workflow_instance_id` bigint unsigned NOT NULL,
  `event_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `actor_user_id` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `from_status` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `to_status` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `from_step_id` bigint unsigned DEFAULT NULL,
  `to_step_id` bigint unsigned DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `preschool_workflow_events_from_step_id_foreign` (`from_step_id`),
  KEY `preschool_workflow_events_to_step_id_foreign` (`to_step_id`),
  KEY `preschool_workflow_events_instance_created_index` (`workflow_instance_id`,`created_at`),
  KEY `preschool_workflow_events_event_type_index` (`event_type`),
  KEY `preschool_workflow_events_actor_user_id_index` (`actor_user_id`),
  KEY `preschool_workflow_events_from_status_index` (`from_status`),
  KEY `preschool_workflow_events_to_status_index` (`to_status`),
  CONSTRAINT `preschool_workflow_events_actor_user_id_foreign` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_workflow_events_from_step_id_foreign` FOREIGN KEY (`from_step_id`) REFERENCES `preschool_workflow_steps` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_workflow_events_to_step_id_foreign` FOREIGN KEY (`to_step_id`) REFERENCES `preschool_workflow_steps` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_workflow_events_workflow_instance_id_foreign` FOREIGN KEY (`workflow_instance_id`) REFERENCES `preschool_workflow_instances` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_workflow_instances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_workflow_instances` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `workflow_definition_id` bigint unsigned NOT NULL,
  `source_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_label` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `current_step_id` bigint unsigned DEFAULT NULL,
  `status` enum('open','in_progress','pending_approval','approved','rejected','returned','completed','cancelled','escalated','overdue') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'open',
  `priority` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'normal',
  `assigned_to_user_id` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigned_role` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `due_at` timestamp NULL DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `escalated_at` timestamp NULL DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `preschool_workflow_instances_source_unique` (`workflow_definition_id`,`source_type`,`source_id`),
  KEY `preschool_workflow_instances_current_step_id_foreign` (`current_step_id`),
  KEY `preschool_workflow_instances_definition_status_index` (`workflow_definition_id`,`status`),
  KEY `preschool_workflow_instances_assigned_status_index` (`assigned_to_user_id`,`status`),
  KEY `preschool_workflow_instances_role_status_index` (`assigned_role`,`status`),
  KEY `preschool_workflow_instances_status_index` (`status`),
  KEY `preschool_workflow_instances_priority_index` (`priority`),
  KEY `preschool_workflow_instances_assigned_to_user_id_index` (`assigned_to_user_id`),
  KEY `preschool_workflow_instances_assigned_role_index` (`assigned_role`),
  KEY `preschool_workflow_instances_due_at_index` (`due_at`),
  CONSTRAINT `preschool_workflow_instances_assigned_to_user_id_foreign` FOREIGN KEY (`assigned_to_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_workflow_instances_current_step_id_foreign` FOREIGN KEY (`current_step_id`) REFERENCES `preschool_workflow_steps` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `preschool_workflow_instances_workflow_definition_id_foreign` FOREIGN KEY (`workflow_definition_id`) REFERENCES `preschool_workflow_definitions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_workflow_steps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_workflow_steps` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `workflow_definition_id` bigint unsigned NOT NULL,
  `key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `step_type` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'action',
  `assigned_role` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sla_hours` int unsigned DEFAULT NULL,
  `config` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `preschool_workflow_steps_definition_key_unique` (`workflow_definition_id`,`key`),
  KEY `preschool_workflow_steps_definition_sort_index` (`workflow_definition_id`,`sort_order`),
  KEY `preschool_workflow_steps_type_index` (`step_type`),
  CONSTRAINT `preschool_workflow_steps_workflow_definition_id_foreign` FOREIGN KEY (`workflow_definition_id`) REFERENCES `preschool_workflow_definitions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_workflow_sync_run_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_workflow_sync_run_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sync_run_id` bigint unsigned NOT NULL,
  `definition_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_id` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_label` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `result_status` enum('created','existing','skipped','failed') COLLATE utf8mb4_unicode_ci NOT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci,
  `workflow_instance_id` bigint unsigned DEFAULT NULL,
  `error_message` text COLLATE utf8mb4_unicode_ci,
  `processed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preschool_workflow_sync_run_items_workflow_instance_id_foreign` (`workflow_instance_id`),
  KEY `preschool_workflow_sync_run_items_sync_run_id_index` (`sync_run_id`),
  KEY `preschool_workflow_sync_run_items_definition_source_index` (`definition_key`,`source_type`),
  KEY `preschool_workflow_sync_run_items_source_index` (`source_type`,`source_id`),
  KEY `preschool_workflow_sync_run_items_result_status_index` (`result_status`),
  KEY `preschool_workflow_sync_run_items_processed_at_index` (`processed_at`),
  CONSTRAINT `preschool_workflow_sync_run_items_sync_run_id_foreign` FOREIGN KEY (`sync_run_id`) REFERENCES `preschool_workflow_sync_runs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `preschool_workflow_sync_run_items_workflow_instance_id_foreign` FOREIGN KEY (`workflow_instance_id`) REFERENCES `preschool_workflow_instances` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `preschool_workflow_sync_runs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preschool_workflow_sync_runs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `mode` enum('preview','run') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'run',
  `status` enum('pending','running','completed','completed_with_errors','failed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `definition_key` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filters` json DEFAULT NULL,
  `requested_limit` int unsigned DEFAULT NULL,
  `batch_size` int unsigned DEFAULT NULL,
  `eligible_count` int unsigned NOT NULL DEFAULT '0',
  `processed_count` int unsigned NOT NULL DEFAULT '0',
  `created_count` int unsigned NOT NULL DEFAULT '0',
  `existing_count` int unsigned NOT NULL DEFAULT '0',
  `skipped_count` int unsigned NOT NULL DEFAULT '0',
  `failed_count` int unsigned NOT NULL DEFAULT '0',
  `started_by_user_id` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `failure_message` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `preschool_workflow_sync_runs_mode_status_index` (`mode`,`status`),
  KEY `preschool_workflow_sync_runs_definition_key_index` (`definition_key`),
  KEY `preschool_workflow_sync_runs_source_type_index` (`source_type`),
  KEY `preschool_workflow_sync_runs_started_by_user_id_index` (`started_by_user_id`),
  KEY `preschool_workflow_sync_runs_started_at_index` (`started_at`),
  KEY `preschool_workflow_sync_runs_created_at_index` (`created_at`),
  CONSTRAINT `preschool_workflow_sync_runs_started_by_user_id_foreign` FOREIGN KEY (`started_by_user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `role_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `permission_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`role_code`,`permission_code`),
  KEY `fk_role_permissions_permission` (`permission_code`),
  CONSTRAINT `fk_role_permissions_permission` FOREIGN KEY (`permission_code`) REFERENCES `permissions` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_role_permissions_role` FOREIGN KEY (`role_code`) REFERENCES `roles` (`code`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `role_scopes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_scopes` (
  `code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `scope` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `domain_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `department_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` tinyint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`code`),
  KEY `roles_scope_index` (`scope`),
  KEY `roles_domain_code_index` (`domain_code`),
  KEY `roles_department_code_index` (`department_code`),
  KEY `roles_created_by_foreign` (`created_by`),
  KEY `roles_updated_by_foreign` (`updated_by`),
  CONSTRAINT `fk_roles_department` FOREIGN KEY (`department_code`) REFERENCES `departments` (`code`) ON UPDATE CASCADE,
  CONSTRAINT `roles_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `roles_domain_code_foreign` FOREIGN KEY (`domain_code`) REFERENCES `domain_codes` (`code`) ON UPDATE CASCADE,
  CONSTRAINT `roles_scope_foreign` FOREIGN KEY (`scope`) REFERENCES `role_scopes` (`code`) ON UPDATE CASCADE,
  CONSTRAINT `roles_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_permissions` (
  `user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `permission_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`permission_code`),
  KEY `fk_user_permissions_permission` (`permission_code`),
  CONSTRAINT `fk_user_permissions_permission` FOREIGN KEY (`permission_code`) REFERENCES `permissions` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_permissions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `user_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_statuses` (
  `code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `organization_id` bigint unsigned DEFAULT NULL,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `department_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `must_change_password` tinyint(1) NOT NULL DEFAULT '0',
  `password_changed_at` timestamp NULL DEFAULT NULL,
  `last_password_reset_at` timestamp NULL DEFAULT NULL,
  `last_password_reset_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `active_email_only` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci GENERATED ALWAYS AS (if((`deleted_at` is null),`email`,NULL)) VIRTUAL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`),
  UNIQUE KEY `users_active_email_unique` (`active_email_only`),
  KEY `users_role_code_index` (`role_code`),
  KEY `users_status_index` (`status`),
  KEY `users_department_code_index` (`department_code`),
  KEY `users_deleted_at_index` (`deleted_at`),
  KEY `users_created_by_foreign` (`created_by`),
  KEY `users_updated_by_foreign` (`updated_by`),
  KEY `users_email_status_index` (`email`,`status`),
  KEY `users_username_status_index` (`username`,`status`),
  KEY `users_created_at_index` (`created_at`),
  KEY `users_organization_id_index` (`organization_id`),
  KEY `users_must_change_password_index` (`must_change_password`),
  KEY `users_password_changed_at_index` (`password_changed_at`),
  KEY `users_last_password_reset_at_index` (`last_password_reset_at`),
  KEY `users_last_password_reset_by_index` (`last_password_reset_by`),
  CONSTRAINT `fk_users_department` FOREIGN KEY (`department_code`) REFERENCES `departments` (`code`) ON UPDATE CASCADE,
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_code`) REFERENCES `roles` (`code`) ON UPDATE CASCADE,
  CONSTRAINT `users_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_last_password_reset_by_foreign` FOREIGN KEY (`last_password_reset_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_organization_id_foreign` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE SET NULL,
  CONSTRAINT `users_status_foreign` FOREIGN KEY (`status`) REFERENCES `user_statuses` (`code`) ON UPDATE CASCADE,
  CONSTRAINT `users_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;


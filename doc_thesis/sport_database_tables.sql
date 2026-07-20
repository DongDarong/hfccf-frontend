
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
DROP TABLE IF EXISTS `coach_team_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coach_team_assignments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `coach_user_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `team_id` bigint unsigned NOT NULL,
  `assigned_by_user_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `assigned_at` timestamp NULL DEFAULT NULL,
  `ended_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `coach_team_assignments_coach_status_index` (`coach_user_id`,`status`),
  KEY `coach_team_assignments_team_status_index` (`team_id`,`status`),
  KEY `coach_team_assignments_coach_user_id_index` (`coach_user_id`),
  KEY `coach_team_assignments_assigned_by_user_id_index` (`assigned_by_user_id`),
  KEY `coach_team_assignments_status_index` (`status`),
  CONSTRAINT `coach_team_assignments_assigned_by_user_id_foreign` FOREIGN KEY (`assigned_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `coach_team_assignments_coach_user_id_foreign` FOREIGN KEY (`coach_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `coach_team_assignments_team_id_foreign` FOREIGN KEY (`team_id`) REFERENCES `sport_teams` (`id`) ON DELETE CASCADE
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
DROP TABLE IF EXISTS `sport_attendance_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sport_attendance_records` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `attendance_type` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject_key` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `team_id` bigint unsigned DEFAULT NULL,
  `player_id` bigint unsigned DEFAULT NULL,
  `coach_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recorded_by_user_id` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attendance_date` date NOT NULL,
  `status` enum('present','absent','late','excused') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sport_attendance_subject_date_unique` (`subject_key`,`attendance_date`),
  KEY `sport_attendance_type_date_index` (`attendance_type`,`attendance_date`),
  KEY `sport_attendance_team_date_index` (`team_id`,`attendance_date`),
  KEY `sport_attendance_player_date_index` (`player_id`,`attendance_date`),
  KEY `sport_attendance_coach_date_index` (`coach_user_id`,`attendance_date`),
  KEY `sport_attendance_date_status_index` (`attendance_date`,`status`),
  KEY `sport_attendance_recorded_by_index` (`recorded_by_user_id`),
  CONSTRAINT `sport_attendance_records_coach_user_id_foreign` FOREIGN KEY (`coach_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sport_attendance_records_player_id_foreign` FOREIGN KEY (`player_id`) REFERENCES `sport_players` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sport_attendance_records_recorded_by_user_id_foreign` FOREIGN KEY (`recorded_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sport_attendance_records_team_id_foreign` FOREIGN KEY (`team_id`) REFERENCES `sport_teams` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sport_divisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sport_divisions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sport_divisions_name_unique` (`name`),
  KEY `sport_divisions_status_index` (`status`),
  KEY `sport_divisions_created_at_index` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sport_equipment_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sport_equipment_assignments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `assignment_code` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `equipment_request_id` bigint unsigned NOT NULL,
  `equipment_item_id` bigint unsigned NOT NULL,
  `team_id` bigint unsigned NOT NULL,
  `coach_user_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `assigned_quantity` int unsigned NOT NULL,
  `returned_quantity` int unsigned NOT NULL DEFAULT '0',
  `damaged_quantity` int unsigned NOT NULL DEFAULT '0',
  `missing_quantity` int unsigned NOT NULL DEFAULT '0',
  `status` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'assigned',
  `assigned_at` datetime NOT NULL,
  `expected_return_at` datetime DEFAULT NULL,
  `returned_at` datetime DEFAULT NULL,
  `assigned_by_user_id` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `returned_by_user_id` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sport_equipment_assignments_assignment_code_unique` (`assignment_code`),
  UNIQUE KEY `sport_equipment_assignments_equipment_request_id_unique` (`equipment_request_id`),
  KEY `sport_equipment_assignments_team_id_status_index` (`team_id`,`status`),
  KEY `sport_equipment_assignments_equipment_item_id_status_index` (`equipment_item_id`,`status`),
  KEY `sport_equipment_assignments_coach_user_id_status_index` (`coach_user_id`,`status`),
  KEY `sport_equipment_assignments_coach_user_id_index` (`coach_user_id`),
  KEY `sport_equipment_assignments_status_index` (`status`),
  KEY `sport_equipment_assignments_assigned_at_index` (`assigned_at`),
  KEY `sport_equipment_assignments_expected_return_at_index` (`expected_return_at`),
  KEY `sport_equipment_assignments_returned_at_index` (`returned_at`),
  KEY `sport_equipment_assignments_assigned_by_user_id_index` (`assigned_by_user_id`),
  KEY `sport_equipment_assignments_returned_by_user_id_index` (`returned_by_user_id`),
  CONSTRAINT `sport_equipment_assignments_assigned_by_user_id_foreign` FOREIGN KEY (`assigned_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_equipment_assignments_coach_user_id_foreign` FOREIGN KEY (`coach_user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `sport_equipment_assignments_equipment_item_id_foreign` FOREIGN KEY (`equipment_item_id`) REFERENCES `sport_equipment_items` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `sport_equipment_assignments_equipment_request_id_foreign` FOREIGN KEY (`equipment_request_id`) REFERENCES `sport_equipment_requests` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `sport_equipment_assignments_returned_by_user_id_foreign` FOREIGN KEY (`returned_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_equipment_assignments_team_id_foreign` FOREIGN KEY (`team_id`) REFERENCES `sport_teams` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sport_equipment_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sport_equipment_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `equipment_code` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `unit` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_quantity` int unsigned NOT NULL DEFAULT '0',
  `available_quantity` int unsigned NOT NULL DEFAULT '0',
  `minimum_stock_level` int unsigned NOT NULL DEFAULT '0',
  `storage_location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_by_user_id` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by_user_id` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sport_equipment_items_equipment_code_unique` (`equipment_code`),
  KEY `sport_equipment_items_category_index` (`category`),
  KEY `sport_equipment_items_minimum_stock_level_index` (`minimum_stock_level`),
  KEY `sport_equipment_items_status_index` (`status`),
  KEY `sport_equipment_items_created_by_user_id_index` (`created_by_user_id`),
  KEY `sport_equipment_items_updated_by_user_id_index` (`updated_by_user_id`),
  CONSTRAINT `sport_equipment_items_created_by_user_id_foreign` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_equipment_items_updated_by_user_id_foreign` FOREIGN KEY (`updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sport_equipment_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sport_equipment_requests` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `request_code` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `equipment_item_id` bigint unsigned NOT NULL,
  `coach_user_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `team_id` bigint unsigned NOT NULL,
  `requested_quantity` int unsigned NOT NULL,
  `approved_quantity` int unsigned DEFAULT NULL,
  `issued_quantity` int unsigned NOT NULL DEFAULT '0',
  `returned_quantity` int unsigned NOT NULL DEFAULT '0',
  `damaged_quantity` int unsigned NOT NULL DEFAULT '0',
  `missing_quantity` int unsigned NOT NULL DEFAULT '0',
  `purpose` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `required_date` date NOT NULL,
  `expected_return_date` date NOT NULL,
  `status` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `admin_note` text COLLATE utf8mb4_unicode_ci,
  `rejected_reason` text COLLATE utf8mb4_unicode_ci,
  `reviewed_by_user_id` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reviewed_at` datetime DEFAULT NULL,
  `issued_by_user_id` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issued_at` datetime DEFAULT NULL,
  `returned_by_user_id` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `returned_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sport_equipment_requests_request_code_unique` (`request_code`),
  KEY `sport_equipment_requests_equipment_item_id_foreign` (`equipment_item_id`),
  KEY `sport_equipment_requests_team_id_foreign` (`team_id`),
  KEY `sport_equipment_requests_coach_user_id_index` (`coach_user_id`),
  KEY `sport_equipment_requests_required_date_index` (`required_date`),
  KEY `sport_equipment_requests_expected_return_date_index` (`expected_return_date`),
  KEY `sport_equipment_requests_status_index` (`status`),
  KEY `sport_equipment_requests_reviewed_by_user_id_index` (`reviewed_by_user_id`),
  KEY `sport_equipment_requests_reviewed_at_index` (`reviewed_at`),
  KEY `sport_equipment_requests_issued_by_user_id_index` (`issued_by_user_id`),
  KEY `sport_equipment_requests_issued_at_index` (`issued_at`),
  KEY `sport_equipment_requests_returned_by_user_id_index` (`returned_by_user_id`),
  KEY `sport_equipment_requests_returned_at_index` (`returned_at`),
  CONSTRAINT `sport_equipment_requests_coach_user_id_foreign` FOREIGN KEY (`coach_user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `sport_equipment_requests_equipment_item_id_foreign` FOREIGN KEY (`equipment_item_id`) REFERENCES `sport_equipment_items` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `sport_equipment_requests_issued_by_user_id_foreign` FOREIGN KEY (`issued_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_equipment_requests_returned_by_user_id_foreign` FOREIGN KEY (`returned_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_equipment_requests_reviewed_by_user_id_foreign` FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_equipment_requests_team_id_foreign` FOREIGN KEY (`team_id`) REFERENCES `sport_teams` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sport_match_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sport_match_events` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tournament_id` bigint unsigned DEFAULT NULL,
  `match_id` bigint unsigned NOT NULL,
  `team_id` bigint unsigned NOT NULL,
  `squad_id` bigint unsigned DEFAULT NULL,
  `squad_player_id` bigint unsigned DEFAULT NULL,
  `related_squad_player_id` bigint unsigned DEFAULT NULL,
  `player_name_snapshot` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jersey_number_snapshot` smallint unsigned DEFAULT NULL,
  `position_snapshot` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `player_id` bigint unsigned DEFAULT NULL,
  `assist_player_id` bigint unsigned DEFAULT NULL,
  `player_in_id` bigint unsigned DEFAULT NULL,
  `player_out_id` bigint unsigned DEFAULT NULL,
  `event_type` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `minute` smallint unsigned NOT NULL DEFAULT '0',
  `stoppage_minute` smallint unsigned DEFAULT NULL,
  `side` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `extra_time_minute` smallint unsigned DEFAULT NULL,
  `period` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_by_user_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sport_match_events_team_id_foreign` (`team_id`),
  KEY `sport_match_events_player_id_foreign` (`player_id`),
  KEY `sport_match_events_event_type_index` (`event_type`),
  KEY `sport_match_events_created_by_user_id_index` (`created_by_user_id`),
  KEY `sport_match_events_tournament_id_foreign` (`tournament_id`),
  KEY `sport_match_events_assist_player_id_foreign` (`assist_player_id`),
  KEY `sport_match_events_player_in_id_foreign` (`player_in_id`),
  KEY `sport_match_events_player_out_id_foreign` (`player_out_id`),
  KEY `sport_match_events_squad_id_foreign` (`squad_id`),
  KEY `sport_match_events_squad_player_id_foreign` (`squad_player_id`),
  KEY `sport_match_events_related_squad_player_id_foreign` (`related_squad_player_id`),
  KEY `sport_match_events_timeline_index` (`match_id`,`minute`,`extra_time_minute`,`created_at`),
  CONSTRAINT `sport_match_events_assist_player_id_foreign` FOREIGN KEY (`assist_player_id`) REFERENCES `sport_players` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_match_events_created_by_user_id_foreign` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_match_events_match_id_foreign` FOREIGN KEY (`match_id`) REFERENCES `sport_matches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sport_match_events_player_id_foreign` FOREIGN KEY (`player_id`) REFERENCES `sport_players` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_match_events_player_in_id_foreign` FOREIGN KEY (`player_in_id`) REFERENCES `sport_players` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_match_events_player_out_id_foreign` FOREIGN KEY (`player_out_id`) REFERENCES `sport_players` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_match_events_related_squad_player_id_foreign` FOREIGN KEY (`related_squad_player_id`) REFERENCES `sport_match_squad_players` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_match_events_squad_id_foreign` FOREIGN KEY (`squad_id`) REFERENCES `sport_match_squads` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_match_events_squad_player_id_foreign` FOREIGN KEY (`squad_player_id`) REFERENCES `sport_match_squad_players` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_match_events_team_id_foreign` FOREIGN KEY (`team_id`) REFERENCES `sport_teams` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sport_match_events_tournament_id_foreign` FOREIGN KEY (`tournament_id`) REFERENCES `sport_tournaments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sport_match_squad_players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sport_match_squad_players` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `squad_id` bigint unsigned NOT NULL,
  `match_id` bigint unsigned NOT NULL,
  `team_id` bigint unsigned NOT NULL,
  `player_id` bigint unsigned NOT NULL,
  `player_name_snapshot` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `jersey_number_snapshot` int unsigned DEFAULT NULL,
  `position_snapshot` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(24) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'reserve',
  `eligibility_status` varchar(24) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'eligible',
  `is_eligible` tinyint(1) NOT NULL DEFAULT '1',
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `selected_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sport_match_squad_players_squad_id_player_id_unique` (`squad_id`,`player_id`),
  KEY `sport_match_squad_players_match_id_foreign` (`match_id`),
  KEY `sport_match_squad_players_team_id_foreign` (`team_id`),
  KEY `sport_match_squad_players_player_id_foreign` (`player_id`),
  KEY `sport_match_squad_players_role_index` (`role`),
  KEY `sport_match_squad_players_eligibility_status_index` (`eligibility_status`),
  CONSTRAINT `sport_match_squad_players_match_id_foreign` FOREIGN KEY (`match_id`) REFERENCES `sport_matches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sport_match_squad_players_player_id_foreign` FOREIGN KEY (`player_id`) REFERENCES `sport_players` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sport_match_squad_players_squad_id_foreign` FOREIGN KEY (`squad_id`) REFERENCES `sport_match_squads` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sport_match_squad_players_team_id_foreign` FOREIGN KEY (`team_id`) REFERENCES `sport_teams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sport_match_squads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sport_match_squads` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `match_id` bigint unsigned NOT NULL,
  `team_id` bigint unsigned NOT NULL,
  `selected_by_user_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(24) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `locked_at` datetime DEFAULT NULL,
  `submitted_at` datetime DEFAULT NULL,
  `approved_by_user_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sport_match_squads_match_id_team_id_unique` (`match_id`,`team_id`),
  KEY `sport_match_squads_team_id_foreign` (`team_id`),
  KEY `sport_match_squads_selected_by_user_id_index` (`selected_by_user_id`),
  KEY `sport_match_squads_status_index` (`status`),
  KEY `sport_match_squads_approved_by_user_id_index` (`approved_by_user_id`),
  CONSTRAINT `sport_match_squads_approved_by_user_id_foreign` FOREIGN KEY (`approved_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_match_squads_match_id_foreign` FOREIGN KEY (`match_id`) REFERENCES `sport_matches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sport_match_squads_selected_by_user_id_foreign` FOREIGN KEY (`selected_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_match_squads_team_id_foreign` FOREIGN KEY (`team_id`) REFERENCES `sport_teams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sport_matches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sport_matches` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `match_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `home_team_id` bigint unsigned DEFAULT NULL,
  `away_team_id` bigint unsigned DEFAULT NULL,
  `tournament_id` bigint unsigned DEFAULT NULL,
  `group_id` bigint unsigned DEFAULT NULL,
  `knockout_round_id` bigint unsigned DEFAULT NULL,
  `competition_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `match_type` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `round_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tournament_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `venue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scheduled_at` datetime DEFAULT NULL,
  `matchday` int unsigned NOT NULL DEFAULT '0',
  `started_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `approval_status` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'approved',
  `approved_by_user_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `rejection_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `current_period` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `home_score` int unsigned NOT NULL DEFAULT '0',
  `away_score` int unsigned NOT NULL DEFAULT '0',
  `extra_time_home_score` int unsigned NOT NULL DEFAULT '0',
  `extra_time_away_score` int unsigned NOT NULL DEFAULT '0',
  `penalty_home_score` int unsigned NOT NULL DEFAULT '0',
  `penalty_away_score` int unsigned NOT NULL DEFAULT '0',
  `winner_team_id` bigint unsigned DEFAULT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `metadata` json DEFAULT NULL,
  `created_by_user_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requested_by_role` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sport_matches_match_code_unique` (`match_code`),
  KEY `sport_matches_home_team_id_foreign` (`home_team_id`),
  KEY `sport_matches_away_team_id_foreign` (`away_team_id`),
  KEY `sport_matches_scheduled_at_index` (`scheduled_at`),
  KEY `sport_matches_status_index` (`status`),
  KEY `sport_matches_created_by_user_id_index` (`created_by_user_id`),
  KEY `sport_matches_tournament_id_foreign` (`tournament_id`),
  KEY `sport_matches_group_id_foreign` (`group_id`),
  KEY `sport_matches_knockout_round_id_foreign` (`knockout_round_id`),
  KEY `sport_matches_winner_team_id_foreign` (`winner_team_id`),
  KEY `sport_matches_match_type_index` (`match_type`),
  KEY `sport_matches_approval_status_index` (`approval_status`),
  KEY `sport_matches_approved_by_user_id_index` (`approved_by_user_id`),
  CONSTRAINT `sport_matches_approved_by_user_id_foreign` FOREIGN KEY (`approved_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_matches_away_team_id_foreign` FOREIGN KEY (`away_team_id`) REFERENCES `sport_teams` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sport_matches_created_by_user_id_foreign` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_matches_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `sport_tournament_groups` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_matches_home_team_id_foreign` FOREIGN KEY (`home_team_id`) REFERENCES `sport_teams` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sport_matches_knockout_round_id_foreign` FOREIGN KEY (`knockout_round_id`) REFERENCES `sport_tournament_knockout_rounds` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_matches_tournament_id_foreign` FOREIGN KEY (`tournament_id`) REFERENCES `sport_tournaments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_matches_winner_team_id_foreign` FOREIGN KEY (`winner_team_id`) REFERENCES `sport_teams` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sport_player_team_memberships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sport_player_team_memberships` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `team_id` bigint unsigned NOT NULL,
  `player_id` bigint unsigned NOT NULL,
  `status` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `joined_at` timestamp NULL DEFAULT NULL,
  `left_at` timestamp NULL DEFAULT NULL,
  `suspension_until` timestamp NULL DEFAULT NULL,
  `injury_notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_by_user_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by_user_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sport_player_team_memberships_player_status_index` (`player_id`,`status`),
  KEY `sport_player_team_memberships_team_status_index` (`team_id`,`status`),
  KEY `sport_player_team_memberships_status_index` (`status`),
  KEY `sport_player_team_memberships_created_by_user_id_index` (`created_by_user_id`),
  KEY `sport_player_team_memberships_updated_by_user_id_index` (`updated_by_user_id`),
  CONSTRAINT `sport_player_team_memberships_created_by_user_id_foreign` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_player_team_memberships_player_id_foreign` FOREIGN KEY (`player_id`) REFERENCES `sport_players` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sport_player_team_memberships_team_id_foreign` FOREIGN KEY (`team_id`) REFERENCES `sport_teams` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sport_player_team_memberships_updated_by_user_id_foreign` FOREIGN KEY (`updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sport_players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sport_players` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `player_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `jersey_number` int unsigned DEFAULT NULL,
  `position` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `team_id` bigint unsigned DEFAULT NULL,
  `division` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `age` int unsigned DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `height_cm` int unsigned DEFAULT NULL,
  `weight_kg` decimal(6,2) DEFAULT NULL,
  `preferred_foot` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `blood_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `village` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commune` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `province` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `current_school` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `grade_year` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `primary_position` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registration_status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'registered',
  `approval_status` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'approved',
  `roster_status` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'inactive',
  `disciplinary_status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `injury_status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL,
  `status_notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_by_user_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approved_by_user_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `rejection_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `matches_played` int unsigned NOT NULL DEFAULT '0',
  `goals_scored` int unsigned NOT NULL DEFAULT '0',
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sport_players_player_code_unique` (`player_code`),
  KEY `sport_players_team_id_foreign` (`team_id`),
  KEY `sport_players_approval_status_index` (`approval_status`),
  KEY `sport_players_created_by_user_id_index` (`created_by_user_id`),
  KEY `sport_players_approved_by_user_id_index` (`approved_by_user_id`),
  KEY `sport_players_roster_status_index` (`roster_status`),
  KEY `sport_players_disciplinary_status_index` (`disciplinary_status`),
  KEY `sport_players_injury_status_index` (`injury_status`),
  CONSTRAINT `sport_players_approved_by_user_id_foreign` FOREIGN KEY (`approved_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_players_created_by_user_id_foreign` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_players_team_id_foreign` FOREIGN KEY (`team_id`) REFERENCES `sport_teams` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sport_playing_styles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sport_playing_styles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sport_playing_styles_name_unique` (`name`),
  KEY `sport_playing_styles_status_index` (`status`),
  KEY `sport_playing_styles_created_at_index` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sport_standings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sport_standings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tournament_id` bigint unsigned NOT NULL,
  `team_id` bigint unsigned NOT NULL,
  `played` int unsigned NOT NULL DEFAULT '0',
  `wins` int unsigned NOT NULL DEFAULT '0',
  `draws` int unsigned NOT NULL DEFAULT '0',
  `losses` int unsigned NOT NULL DEFAULT '0',
  `goals_for` int unsigned NOT NULL DEFAULT '0',
  `goals_against` int unsigned NOT NULL DEFAULT '0',
  `goal_difference` int NOT NULL DEFAULT '0',
  `points` int unsigned NOT NULL DEFAULT '0',
  `rank_position` int unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sport_standings_tournament_id_team_id_unique` (`tournament_id`,`team_id`),
  KEY `sport_standings_team_id_foreign` (`team_id`),
  KEY `sport_standings_tournament_id_rank_position_index` (`tournament_id`,`rank_position`),
  CONSTRAINT `sport_standings_team_id_foreign` FOREIGN KEY (`team_id`) REFERENCES `sport_teams` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sport_standings_tournament_id_foreign` FOREIGN KEY (`tournament_id`) REFERENCES `sport_tournaments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sport_teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sport_teams` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `division_id` bigint unsigned DEFAULT NULL,
  `playing_style_id` bigint unsigned DEFAULT NULL,
  `team_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `short_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coach_user_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coach_display_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `division` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `captain_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `players_count` int unsigned NOT NULL DEFAULT '0',
  `matches_count` int unsigned NOT NULL DEFAULT '0',
  `wins` int unsigned NOT NULL DEFAULT '0',
  `draws` int unsigned NOT NULL DEFAULT '0',
  `losses` int unsigned NOT NULL DEFAULT '0',
  `points` int unsigned NOT NULL DEFAULT '0',
  `venue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sport_teams_team_code_unique` (`team_code`),
  KEY `sport_teams_coach_user_id_index` (`coach_user_id`),
  KEY `sport_teams_division_id_foreign` (`division_id`),
  KEY `sport_teams_playing_style_id_foreign` (`playing_style_id`),
  CONSTRAINT `sport_teams_coach_user_id_foreign` FOREIGN KEY (`coach_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_teams_division_id_foreign` FOREIGN KEY (`division_id`) REFERENCES `sport_divisions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sport_teams_playing_style_id_foreign` FOREIGN KEY (`playing_style_id`) REFERENCES `sport_playing_styles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sport_tournament_group_teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sport_tournament_group_teams` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tournament_id` bigint unsigned NOT NULL,
  `group_id` bigint unsigned NOT NULL,
  `team_id` bigint unsigned NOT NULL,
  `seed` int unsigned DEFAULT NULL,
  `pot` int unsigned DEFAULT NULL,
  `position` int unsigned DEFAULT NULL,
  `status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'assigned',
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sport_tournament_group_teams_group_id_team_id_unique` (`group_id`,`team_id`),
  KEY `sport_tournament_group_teams_team_id_foreign` (`team_id`),
  KEY `sport_tournament_group_teams_tournament_id_group_id_index` (`tournament_id`,`group_id`),
  KEY `sport_tournament_group_teams_tournament_id_team_id_index` (`tournament_id`,`team_id`),
  CONSTRAINT `sport_tournament_group_teams_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `sport_tournament_groups` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sport_tournament_group_teams_team_id_foreign` FOREIGN KEY (`team_id`) REFERENCES `sport_teams` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sport_tournament_group_teams_tournament_id_foreign` FOREIGN KEY (`tournament_id`) REFERENCES `sport_tournaments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sport_tournament_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sport_tournament_groups` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tournament_id` bigint unsigned NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` int unsigned NOT NULL DEFAULT '1',
  `qualification_slots` int unsigned NOT NULL DEFAULT '0',
  `status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `finalized_at` timestamp NULL DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sport_tournament_groups_tournament_id_code_unique` (`tournament_id`,`code`),
  KEY `sport_tournament_groups_tournament_id_position_index` (`tournament_id`,`position`),
  KEY `sport_tournament_groups_tournament_id_status_index` (`tournament_id`,`status`),
  CONSTRAINT `sport_tournament_groups_tournament_id_foreign` FOREIGN KEY (`tournament_id`) REFERENCES `sport_tournaments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sport_tournament_knockout_rounds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sport_tournament_knockout_rounds` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tournament_id` bigint unsigned NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` int unsigned NOT NULL DEFAULT '1',
  `bracket_size` int unsigned NOT NULL DEFAULT '0',
  `status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `completed_at` timestamp NULL DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sport_tournament_knockout_rounds_tournament_id_code_unique` (`tournament_id`,`code`),
  KEY `sport_tournament_knockout_rounds_tournament_id_position_index` (`tournament_id`,`position`),
  KEY `sport_tournament_knockout_rounds_tournament_id_status_index` (`tournament_id`,`status`),
  CONSTRAINT `sport_tournament_knockout_rounds_tournament_id_foreign` FOREIGN KEY (`tournament_id`) REFERENCES `sport_tournaments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sport_tournament_teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sport_tournament_teams` (
  `tournament_id` bigint unsigned NOT NULL,
  `team_id` bigint unsigned NOT NULL,
  `joined_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  UNIQUE KEY `sport_tournament_teams_tournament_id_team_id_unique` (`tournament_id`,`team_id`),
  KEY `sport_tournament_teams_team_id_foreign` (`team_id`),
  CONSTRAINT `sport_tournament_teams_team_id_foreign` FOREIGN KEY (`team_id`) REFERENCES `sport_teams` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sport_tournament_teams_tournament_id_foreign` FOREIGN KEY (`tournament_id`) REFERENCES `sport_tournaments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sport_tournaments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sport_tournaments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tournament_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `season` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tournament_type` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'league',
  `status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `visibility` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'private',
  `registration_open_at` timestamp NULL DEFAULT NULL,
  `registration_close_at` timestamp NULL DEFAULT NULL,
  `starts_at` timestamp NULL DEFAULT NULL,
  `ends_at` timestamp NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `logo_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `banner_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `organizer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rules` json DEFAULT NULL,
  `settings` json DEFAULT NULL,
  `created_by_user_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sport_tournaments_tournament_code_unique` (`tournament_code`),
  UNIQUE KEY `sport_tournaments_slug_unique` (`slug`),
  KEY `sport_tournaments_created_by_user_id_index` (`created_by_user_id`),
  CONSTRAINT `sport_tournaments_created_by_user_id_foreign` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `sport_training_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sport_training_sessions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `session_code` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `team_id` bigint unsigned NOT NULL,
  `coach_user_id` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `training_type` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'technical',
  `focus` text COLLATE utf8mb4_unicode_ci,
  `venue` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `starts_at` datetime NOT NULL,
  `ends_at` datetime NOT NULL,
  `intensity` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  `status` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'scheduled',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_by_user_id` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by_user_id` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sport_training_sessions_session_code_unique` (`session_code`),
  KEY `sport_training_sessions_created_by_user_id_foreign` (`created_by_user_id`),
  KEY `sport_training_sessions_updated_by_user_id_foreign` (`updated_by_user_id`),
  KEY `sport_training_sessions_team_id_starts_at_index` (`team_id`,`starts_at`),
  KEY `sport_training_sessions_coach_user_id_starts_at_index` (`coach_user_id`,`starts_at`),
  KEY `sport_training_sessions_status_starts_at_index` (`status`,`starts_at`),
  CONSTRAINT `sport_training_sessions_coach_user_id_foreign` FOREIGN KEY (`coach_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_training_sessions_created_by_user_id_foreign` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sport_training_sessions_team_id_foreign` FOREIGN KEY (`team_id`) REFERENCES `sport_teams` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sport_training_sessions_updated_by_user_id_foreign` FOREIGN KEY (`updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
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


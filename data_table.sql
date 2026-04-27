-- HFCCF auth schema aligned to the current frontend system.
-- Database target: MySQL / MariaDB
--
-- This file is based on the actual Vue auth model in:
-- - src/mocks/users.json
-- - src/services/auth.js
-- - src/services/mappers/userMapper.js
-- - src/constants/roles.js
--
-- Important:
-- 1. User IDs in this system are strings like `usr_001`, not bigint IDs.
-- 2. The role code `adminscholaship` is intentionally kept as-is because the
--    frontend currently uses that exact value.
-- 3. Sanctum-style tokens must therefore use a string `tokenable_id`.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `personal_access_tokens`;
DROP TABLE IF EXISTS `user_permissions`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `role_permissions`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `roles`;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `roles` (
  `code` VARCHAR(32) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `department` VARCHAR(32) NOT NULL,
  `sort_order` TINYINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `permissions` (
  `code` VARCHAR(64) NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `role_permissions` (
  `role_code` VARCHAR(32) NOT NULL,
  `permission_code` VARCHAR(64) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`role_code`, `permission_code`),
  CONSTRAINT `fk_role_permissions_role`
    FOREIGN KEY (`role_code`) REFERENCES `roles` (`code`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_role_permissions_permission`
    FOREIGN KEY (`permission_code`) REFERENCES `permissions` (`code`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `users` (
  `id` VARCHAR(16) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `username` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(32) DEFAULT NULL,
  `role_code` VARCHAR(32) NOT NULL,
  `department` VARCHAR(32) NOT NULL,
  `status` ENUM('active', 'pending', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
  `avatar` VARCHAR(2048) DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL,
  `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
  `last_login_at` TIMESTAMP NULL DEFAULT NULL,
  `remember_token` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_role_code_index` (`role_code`),
  KEY `users_status_index` (`status`),
  KEY `users_department_index` (`department`),
  CONSTRAINT `fk_users_role`
    FOREIGN KEY (`role_code`) REFERENCES `roles` (`code`)
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_permissions` (
  `user_id` VARCHAR(16) NOT NULL,
  `permission_code` VARCHAR(64) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `permission_code`),
  CONSTRAINT `fk_user_permissions_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_user_permissions_permission`
    FOREIGN KEY (`permission_code`) REFERENCES `permissions` (`code`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `personal_access_tokens` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` VARCHAR(255) NOT NULL DEFAULT 'App\\Models\\User',
  `tokenable_id` VARCHAR(16) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `token` VARCHAR(64) NOT NULL,
  `abilities` TEXT NULL,
  `last_used_at` TIMESTAMP NULL DEFAULT NULL,
  `expires_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_index` (`tokenable_type`, `tokenable_id`),
  CONSTRAINT `fk_personal_access_tokens_user`
    FOREIGN KEY (`tokenable_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` (`code`, `name`, `department`, `sort_order`) VALUES
  ('superadmin', 'Super Admin', 'Operations', 1),
  ('adminenglish', 'English Admin', 'Education', 2),
  ('adminpreschool', 'Preschool Admin', 'Education', 3),
  ('adminscholaship', 'Scholarship Admin', 'Education', 4),
  ('adminsport', 'Sport Admin', 'Sports', 5),
  ('teacher-english', 'English Teacher', 'Education', 6),
  ('teacher-preschool', 'Preschool Teacher', 'Education', 7),
  ('teacher-scholarship', 'Scholarship Teacher', 'Education', 8),
  ('coach', 'Coach', 'Sports', 9);

INSERT INTO `permissions` (`code`, `name`) VALUES
  ('all:*', 'Full system access'),
  ('athletes:read', 'Read athletes'),
  ('dashboard:read', 'Read dashboard'),
  ('programs:write', 'Manage programs'),
  ('reports:read', 'Read reports'),
  ('settings:read', 'Read settings'),
  ('tasks:read', 'Read tasks'),
  ('tasks:write', 'Manage tasks'),
  ('training:write', 'Manage training'),
  ('users:read', 'Read users'),
  ('users:write', 'Manage users');

INSERT INTO `role_permissions` (`role_code`, `permission_code`) VALUES
  ('superadmin', 'all:*'),

  ('adminenglish', 'dashboard:read'),
  ('adminenglish', 'users:read'),
  ('adminenglish', 'reports:read'),
  ('adminenglish', 'programs:write'),

  ('adminpreschool', 'dashboard:read'),
  ('adminpreschool', 'users:read'),
  ('adminpreschool', 'users:write'),
  ('adminpreschool', 'reports:read'),
  ('adminpreschool', 'settings:read'),

  ('adminscholaship', 'dashboard:read'),
  ('adminscholaship', 'users:read'),
  ('adminscholaship', 'users:write'),
  ('adminscholaship', 'reports:read'),
  ('adminscholaship', 'settings:read'),

  ('adminsport', 'dashboard:read'),
  ('adminsport', 'users:read'),
  ('adminsport', 'reports:read'),
  ('adminsport', 'programs:write'),

  ('coach', 'dashboard:read'),
  ('coach', 'athletes:read'),
  ('coach', 'training:write'),

  ('teacher-english', 'dashboard:read'),
  ('teacher-english', 'tasks:read'),
  ('teacher-english', 'tasks:write'),

  ('teacher-preschool', 'dashboard:read'),
  ('teacher-preschool', 'tasks:read'),
  ('teacher-preschool', 'tasks:write'),

  ('teacher-scholarship', 'dashboard:read'),
  ('teacher-scholarship', 'tasks:read'),
  ('teacher-scholarship', 'tasks:write');

-- Seed login accounts aligned to the current mock system.
-- Passwords are bcrypt hashes of the frontend mock passwords.
INSERT INTO `users` (
  `id`,
  `first_name`,
  `last_name`,
  `username`,
  `email`,
  `phone`,
  `role_code`,
  `department`,
  `status`,
  `avatar`,
  `password`,
  `last_login_at`,
  `created_at`,
  `updated_at`
) VALUES
  (
    'usr_001',
    'Vanna',
    'Nop',
    'Vanna Nop',
    'superadmin01@hfccf.org',
    '+855 12 301 001',
    'superadmin',
    'Operations',
    'active',
    'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
    '$2y$10$VDxiTyF8hTrUu9rcWfcAveVDiHxBP5NdngXzfVCalxnrOt8oqlLOG',
    '2026-03-04 04:15:00',
    '2026-02-01 08:00:00',
    '2026-02-01 08:00:00'
  ),
  (
    'usr_016',
    'Sovann',
    'Lim',
    'Sovann Lim',
    'preschool.admin01@hfccf.org',
    '+855 12 316 016',
    'adminpreschool',
    'Education',
    'active',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    '$2y$10$DL4pVR9wQwhWbiB.UqWUteKxr.mA0nELKCblW1LWNGTxV6w.fLKaG',
    '2026-03-03 04:15:00',
    '2026-02-16 08:00:00',
    '2026-02-16 08:00:00'
  ),
  (
    'usr_031',
    'Sokun',
    'Nop',
    'Sokun Nop',
    'scholarship.admin01@hfccf.org',
    '+855 12 331 031',
    'adminscholaship',
    'Education',
    'active',
    'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
    '$2y$10$JFyQX2264zF7398Hhf7.zOXyVQutg2T/pMZ0yJ5KZTp2c.NMNpI9a',
    '2026-03-02 04:15:00',
    '2026-02-04 08:00:00',
    '2026-02-04 08:00:00'
  ),
  (
    'usr_046',
    'Sophea',
    'Lim',
    'Sophea Lim',
    'english.admin01@hfccf.org',
    '+855 12 346 046',
    'adminenglish',
    'Education',
    'active',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    '$2y$10$FPHRt1Qo.Bqdz66ebsxok.HowfnX23ivq95NXFFltbQRINlnmsH2O',
    '2026-03-01 04:15:00',
    '2026-02-19 08:00:00',
    '2026-02-19 08:00:00'
  ),
  (
    'usr_061',
    'Pisey',
    'Nop',
    'Pisey Nop',
    'sport.admin01@hfccf.org',
    '+855 12 361 061',
    'adminsport',
    'Sports',
    'active',
    'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
    '$2y$10$.ABQclzC/hcDA76xiptxeuNmMQBppVFkhRJXnLo2Mr9JFTBG0/s2a',
    '2026-03-08 04:15:00',
    '2026-02-07 08:00:00',
    '2026-02-07 08:00:00'
  ),
  (
    'usr_076',
    'Rina',
    'Lim',
    'Rina Lim',
    'coach01@hfccf.org',
    '+855 12 376 076',
    'coach',
    'Sports',
    'active',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    '$2y$10$0xolL2LnIuMQXe7W0l1.nu4vjDUgK1X38Ne./LJhk0tFxXrnzZ8fK',
    '2026-03-07 04:15:00',
    '2026-02-22 08:00:00',
    '2026-02-22 08:00:00'
  ),
  (
    'usr_091',
    'Sreypov',
    'Nop',
    'Sreypov Nop',
    'teacher.english01@hfccf.org',
    '+855 12 391 091',
    'teacher-english',
    'Education',
    'active',
    'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
    '$2y$10$ZhQvc5g8xmR798XPkHtX.OJAFPU20VZqVjqwmu1KMCZWrfGY416hy',
    '2026-03-06 04:15:00',
    '2026-02-10 08:00:00',
    '2026-02-10 08:00:00'
  ),
  (
    'usr_106',
    'Vannak',
    'Lim',
    'Vannak Lim',
    'teacher.preschool01@hfccf.org',
    '+855 12 406 106',
    'teacher-preschool',
    'Education',
    'active',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    '$2y$10$8Yhy10mQzt0AS9hkzIrF4.wvhAr3spix6cJqfUTzd89RmBC.GRAXe',
    '2026-03-05 04:15:00',
    '2026-02-25 08:00:00',
    '2026-02-25 08:00:00'
  ),
  (
    'usr_121',
    'Nita',
    'Nop',
    'Nita Nop',
    'teacher.scholarship01@hfccf.org',
    '+855 12 421 121',
    'teacher-scholarship',
    'Education',
    'active',
    'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
    '$2y$10$XVIt6GQJliG6e6phQumQeeD0gbWdEzH/fEUSeetq.8Ttj6Gxj1BWG',
    '2026-03-04 04:15:00',
    '2026-02-13 08:00:00',
    '2026-02-13 08:00:00'
  );

-- Seed direct user permissions from the role defaults so API responses can
-- expose permission arrays without custom per-user grants yet.
INSERT INTO `user_permissions` (`user_id`, `permission_code`)
SELECT `u`.`id`, `rp`.`permission_code`
FROM `users` AS `u`
INNER JOIN `role_permissions` AS `rp`
  ON `rp`.`role_code` = `u`.`role_code`;

-- Query shape to match the frontend user model:
-- SELECT
--   u.id,
--   u.first_name AS firstName,
--   u.last_name AS lastName,
--   u.username,
--   u.email,
--   u.phone,
--   u.role_code AS role,
--   u.department,
--   u.status,
--   u.avatar,
--   u.created_at AS createdAt,
--   u.last_login_at AS lastLoginAt,
--   JSON_ARRAYAGG(up.permission_code) AS role_permission
-- FROM users u
-- LEFT JOIN user_permissions up ON up.user_id = u.id
-- GROUP BY u.id;

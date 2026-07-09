# HFCCF Backend Technical Reference

## 1. Document Purpose
This document records the implemented backend architecture of HFCCF as it exists in the current repository. It is intended as thesis source material and is limited to evidence-supported behavior.

## 2. System Backend Overview
HFCCF backend is a Laravel 13 API application with module-oriented controllers, service classes, request validation, Eloquent models, and schema-managed persistence. The backend serves staff-facing system users only and treats students, parents, and guardians as domain records rather than login identities.

## 3. Programming Language and Runtime
- Language: PHP
- Runtime version: `PHP 8.3.30`
- Framework version: `Laravel Framework 13.6.0`
- Composer runtime: `2.8.8`

## 4. Core Technology Stack

| Package | Resolved version | Category | Actual HFCCF usage | Thesis relevance |
| --- | --- | --- | --- | --- |
| `laravel/framework` | `13.6.0` | Core framework | HTTP controllers, routing, ORM, queues, validation, auth | Backend architecture |
| `laravel/sanctum` | `4.3.2` | Authentication | Bearer-token login and API session handling | Security design |
| `league/flysystem-aws-s3-v3` | `3.0.0` | Storage | S3/R2-compatible object storage configuration | File storage |
| `laravel/tinker` | `3.0.2` | Development tool | Interactive backend inspection | Development workflow |
| `laravel/pint` | `1.29.1` | Code quality | PHP formatting | Code quality |
| `laravel/pail` | `1.2.6` | Debugging | Log inspection | Development workflow |
| `phpunit/phpunit` | `12.5.23` | Testing | Feature/unit tests | Testing architecture |
| `fakerphp/faker` | `1.24.1` | Testing data | Factories and seeded test data | Test support |
| `mockery/mockery` | `1.6.12` | Testing doubles | Mocking in tests | Test support |
| `nunomaduro/collision` | `8.9.4` | Dev tooling | Improved CLI error output | Dev experience |

## 5. Laravel Architecture
The backend follows a conventional Laravel API layout with domain controllers under `app/Http/Controllers/Api`, request validation in `app/Http/Requests`, services in `app/Services`, and system helpers in `app/Support`. Routing is centralized in `routes/api.php`, while `routes/web.php` remains minimal.

`AppServiceProvider` bootstraps application-wide rate limiters, model observers, and database-safety checks.

## 6. Backend Project Structure

| Directory | Role |
| --- | --- |
| `app/Http/Controllers` | API controllers organized by domain |
| `app/Http/Requests` | Form request validation |
| `app/Http/Resources` | JSON serialization for API responses |
| `app/Jobs` | Background jobs |
| `app/Models` | Eloquent models and relationships |
| `app/Observers` | Eloquent observers |
| `app/Providers` | Application bootstrapping |
| `app/Services` | Domain services and business logic |
| `app/Support` | Shared helpers, guards, and utilities |
| `config` | Database, auth, queue, mail, session, filesystem, and domain config |
| `database/migrations` | Schema source of record |
| `database/seeders` | Reference data and seed logic |
| `routes` | API, console, and web routing |
| `tests` | Feature and unit tests |

## 7. Complete Backend Module Inventory

| Module | Status | Evidence |
| --- | --- | --- |
| Auth and user management | Active and implemented | `AuthController`, `UserController`, `User` model |
| Roles and permissions | Active and implemented | `RoleController`, role/permission tables |
| Notifications | Active and implemented | `NotificationController`, notification tables |
| Audit logs | Active and implemented | `AuditLogController`, `AuditLog` model |
| Locations | Active and implemented | `CambodiaLocationController`, location models |
| Preschool | Active and implemented | Preschool controllers, services, models, routes |
| Sport | Active and implemented | Sport controllers, services, models, routes |
| English | Active and implemented | English controllers and models |
| Scholarship | Active and implemented | Scholarship controllers and models |
| Assessment | Active and implemented | Assessment controllers, services, models |
| DSAM | Active and implemented | DSAM controllers, models, and routes |
| Queue and jobs | Active and implemented | `jobs`, `failed_jobs`, jobs in `app/Jobs` |
| Safety and governance | Active and implemented | `DatabaseSafetyGuard`, safety tests |

## 8. API Architecture
The API is JSON-first and uses a consistent envelope:
- `success`
- `message`
- `data`

Pagination responses are standardized by `App\Support\ApiResponse`. Controllers often return paginated `items` plus `pagination` metadata, which keeps the frontend service layer predictable.

## 9. Route Organization
`routes/api.php` contains the full domain route tree:
- authentication routes under `/auth`
- shared location routes under `/locations`
- user management routes
- notification routes
- audit log routes
- preschool routes
- assessment routes
- DSAM routes
- sport routes

This single route file is the clearest source for the backend module inventory.

## 10. Controller Layer
Representative controllers include:
- `AuthController`
- `UserController`
- `NotificationController`
- `AuditLogController`
- `Preschool*Controller` classes for preschool business areas
- `Sport*Controller` classes for sport business areas
- `Assessment*Controller` classes for assessment and form workflows
- `Dsam*Controller` classes for DSAM flows

The controllers are thin where possible and delegate complex domain behavior to service classes.

## 11. Request Validation
Validation is split between:
- dedicated form request classes for structured business actions
- inline validation for lighter controller operations

This matches the repository style: important writes use request classes, while some listing or simple read filters use controller-level validation.

## 12. Service and Domain Logic Layer
The service layer is substantial and is a primary sign that HFCCF is not just controller-driven.

| Service area | Examples |
| --- | --- |
| Auth and user admin | `AdminPasswordResetService` |
| Notification | `NotificationService`, `SportNotificationDispatcher` |
| Audit | `AuditLogService` |
| Image | `ImageProcessingService` |
| Preschool | billing, guardians, health, workflows, analytics, reports, operations |
| Sport | approvals, coach assignment, match eligibility, standings, lifecycle |
| Assessment | form, scoring, submission, export, print, lifecycle |
| DSAM | academic-year, form, submission, and profile support |

## 13. Support Classes
`app/Support` contains the shared operational logic that makes the backend safe and thesis-relevant:
- `ApiResponse`
- `DatabaseSafetyGuard`
- `ImageStorage`
- Cambodia location lookup/import helpers
- preschool academic lifecycle, workflow, guardian, attendance, analytics, report, and operations services
- sport match/coach/player support services

## 14. Data Access and Eloquent ORM
The backend uses Eloquent for the majority of data access. In the current codebase:
- models define relationships that mirror the live database schema
- string-based IDs are used for users
- soft deletes are common in master data and operational tables
- query scopes and eager loading are used to avoid N+1 behavior in dashboard and report endpoints

## 15. Model Relationship Architecture
Relationships are used heavily across the codebase:
- `belongsTo` for staff ownership, role, department, and class/team links
- `hasMany` for history, submissions, events, and records
- `belongsToMany` for permissions and some roster-style associations
- polymorphic or resource-like access where documents, exports, or attachments are involved

The user model uses string identifiers and is the central staff identity record.

## 16. Database Architecture
The live schema uses MySQL/MariaDB with utf8mb4 support. The schema reference files validated earlier show the current architecture includes:
- shared auth tables
- staff RBAC tables
- notification tables
- audit tables
- preschool domain tables
- sport domain tables
- English, Scholarship, Assessment, and DSAM tables

This is a real multi-module operational schema, not a toy demo schema.

## 17. Migration and Schema Management
The repository contains a large migration history beginning with auth and core user tables and extending through preschool, scholarship, english, sport, and tournament foundation tables. Schema safety is enforced by `DatabaseSafetyGuard`, which blocks destructive commands unless the target is an isolated testing database.

## 18. Authentication Architecture
Authentication is staff-only:
- login occurs through `AuthController@login`
- password reset uses OTP verification
- tokens are issued through Sanctum
- profile and password changes are authenticated API actions
- logout revokes the current token

The backend explicitly rejects guardian login attempts.

## 19. Laravel Sanctum Integration
Sanctum is used as a token-based API auth layer:
- bearer tokens are generated on login
- tokens are time-limited
- expired tokens are pruned daily via a console schedule
- the frontend stores and reuses the token for authenticated API calls

## 20. Authorization and RBAC
RBAC is implemented through roles, permissions, and domain/scoped access.

Verified authenticated roles:
- `superadmin`
- `adminenglish`
- `adminpreschool`
- `adminscholarship`
- `adminsport`
- `teacher-english`
- `teacher-preschool`
- `teacher-scholarship`
- `coach`

Role and permission data are backed by the `roles`, `permissions`, `role_permissions`, `user_permissions`, `role_scopes`, `departments`, and `domain_codes` tables.

## 21. User Account Architecture
User accounts are staff accounts only. The `UserController` creates, updates, lists, and deletes staff users, and user IDs are string-based (`usr_###`). Password reset, avatar upload, role assignment, and permission synchronization are all staff-account behaviors.

## 22. Staff and Data-Record Separation
The repository clearly separates staff users from domain records:
- students are records, not login identities
- parents are records, not login identities
- guardians are records, not login identities
- guardian portal accounts exist as compatibility artifacts but do not enable active guardian login

This separation is enforced in backend login logic, not just in frontend navigation.

## 23. Notification Architecture
Notifications are first-class backend records with:
- notification master records
- recipient rows
- target rows

The `NotificationController` supports listing, unread counts, creation, read/dismiss toggles, and bulk read actions.

## 24. Workflow Architecture
Preschool workflow support includes definitions, instances, steps, events, approvals, sync runs, and sync items. The backend also includes workflow services for observability and timeline behavior.

## 25. Approval Architecture
Approvals are explicit in both Preschool and Sport:
- Preschool workflow approvals
- Sport player approvals
- Sport match approvals
- Sport coach-team assignment reviews

This supports review-oriented operations rather than silent state changes.

## 26. Automation Architecture
Preschool automation is represented by automation tasks, scheduled checks, workflow sync runs, and task services. The backend scheduler also runs daily operational checks.

## 27. File Storage Architecture
The backend is configured for:
- local private storage
- public storage
- S3-compatible object storage
- R2-compatible object storage

The `ImageStorage` helper centralizes avatar/media persistence.

## 28. Cloud Object Storage
`config/filesystems.php` supports AWS S3 and Cloudflare R2 through environment variables. The codebase uses this for image and avatar handling without exposing credentials.

## 29. Image Processing
`ImageProcessingService` and `ProcessUploadedImage` show that image workflows are deliberate backend functions. Avatar uploads are stored via `ImageStorage` and can be deleted when replaced or removed.

## 30. Queue and Background Jobs
Queue configuration uses the database driver by default. Relevant queued work includes:
- `ProcessUploadedImage`
- `GenerateAssessmentExportJob`

The queue schema includes `jobs` and `failed_jobs`, and `artisan` schedules prune and preschool automation tasks.

## 31. Reporting and Export
Reporting is implemented as a real backend capability, not only a frontend view layer. It includes:
- preschool reporting and snapshots
- assessment reports and exports
- sport standings and tournament statistics
- audit log reporting

## 32. Audit Logging
Audit logging is an active platform concern. `AuditLogController` and the `audit_logs` table support domain, action, entity, and actor tracking.

## 33. API Response and Error Handling
`ApiResponse` standardizes successful and failed JSON replies, including paginated responses. This reduces controller inconsistency and makes the API easier for the frontend to consume.

## 34. Security Controls
Implemented security controls include:
- `auth:sanctum` API protection
- rate limiting for login, OTP, and general API traffic
- guarded password-change flow
- token revocation on logout and password reset
- explicit guardian-login rejection
- environment-sensitive database safety checks

## 35. Environment Safety
`DatabaseSafetyGuard` blocks destructive database commands unless the application is clearly using a safe isolated test database. This is an important operational safeguard for thesis evaluation and repository safety.

## 36. Database Safety
The application listens for command start events and checks the command against the guard before execution. This protects the primary database from commands such as `migrate:fresh`, `migrate:refresh`, and `db:wipe`.

## 37. Testing Architecture
`phpunit.xml` uses:
- an in-memory sqlite database for tests
- `APP_ENV=testing`
- cachedless test execution
- `sync` queue and `array` session/mail drivers

The repository contains a broad feature test suite covering Preschool, Sport, auth, password reset, safety, and module-specific API behavior.

## 38. CI Architecture
The backend GitHub Actions workflow runs on PHP 8.3, 8.4, and 8.5, installs Composer dependencies, copies `.env.example`, generates the app key, and runs `php artisan test`.

## 39. Composer Production Dependencies

| Package | Version | Category | Actual HFCCF usage |
| --- | --- | --- | --- |
| `laravel/framework` | `13.6.0` | Core framework | API, routing, ORM, validation, queues |
| `laravel/sanctum` | `4.3.2` | Authentication | Bearer token auth |
| `league/flysystem-aws-s3-v3` | `3.0.0` | Storage | S3/R2 object storage |
| `laravel/tinker` | `3.0.2` | Dev/runtime tooling | Interactive inspection |

## 40. Composer Development Dependencies

| Package | Version | Category | Actual HFCCF usage |
| --- | --- | --- | --- |
| `fakerphp/faker` | `1.24.1` | Test data | Factories and seeded records |
| `laravel/pail` | `1.2.6` | Debugging | Log inspection |
| `laravel/pint` | `1.29.1` | Code quality | Formatting |
| `mockery/mockery` | `1.6.12` | Testing | Mocks |
| `nunomaduro/collision` | `8.9.4` | CLI UX | Better exception display |
| `phpunit/phpunit` | `12.5.23` | Testing | Feature/unit suite |

## 41. Environment Variable Reference

| Variable | Purpose | Used by |
| --- | --- | --- |
| `APP_ENV` | Environment name | Safety guard, runtime branching |
| `APP_URL` | Application base URL | Filesystem URLs, mail local domain |
| `DB_CONNECTION` | Default database connection | Database and safety guard |
| `DB_DATABASE` | Database name | Database and safety guard |
| `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD` | Database connection settings | `config/database.php` |
| `DB_CHARSET`, `DB_COLLATION` | Charset and collation | `config/database.php` |
| `SESSION_DRIVER` | Session backend | `config/session.php` |
| `QUEUE_CONNECTION` | Queue backend | `config/queue.php` |
| `MAIL_MAILER` | Mail backend | `config/mail.php` |
| `FILESYSTEM_DISK` | Default storage disk | `config/filesystems.php` |
| `FILESYSTEM_IMAGE_DISK` | Image storage disk | `config/filesystems.php` |
| `AWS_*` and `R2_*` | Cloud storage credentials and endpoints | `config/filesystems.php` |
| `SANCTUM_*` | Token and stateful SPA settings | `config/sanctum.php` |
| `PRESCHOOL_WORKFLOW_OBSERVABILITY_*` | Preschool observability thresholds | `config/preschool.php` |

## 42. Backend Design Patterns
Observed patterns include:
- controller per domain area
- request validation classes for business writes
- service classes for complex domain logic
- shared response helper
- audit and safety services at the infrastructure layer
- eager-loaded Eloquent graphs for dashboards and reports

## 43. Database Design Patterns
The schema and code show:
- string primary keys for user accounts
- soft deletes in many master and operational tables
- pivot tables for permissions and relationships
- audit and workflow history tables instead of overwriting history
- separate infrastructure tables for queue, notifications, and tokens

## 44. Technical Strengths
- Clear separation between staff identity and domain data records
- Good use of request validation and service classes
- Safety guard for destructive operations
- Strong module boundaries in controllers and routes
- Rich domain models for Preschool and Sport

## 45. Technical Limitations and Risks
- Some architectural areas are large and route-heavy, especially Preschool and Sport.
- Guardian portal compatibility artifacts still exist, so documentation must clearly distinguish them from active login support.
- The backend is feature-rich enough that schema and route drift need periodic review.

## 46. Thesis-Ready Summary
HFCCF backend is a Laravel 13 API that combines staff-only authentication, module-based domain routing, service-driven business logic, and a safety-oriented database and queue architecture. It is suitable for a thesis discussion of multi-module web system design because the implementation is explicit, testable, and easy to trace from route to controller to model to schema.

## 47. Thesis Extraction Guide

| Thesis Section | Recommended Document Sections | Notes |
| --- | --- | --- |
| System Architecture | 2, 5, 7, 8, 9, 10 | Describe the API shell and module routing |
| Technology Stack | 3, 4, 39, 40 | Use resolved versions and actual usage |
| Development Environment | 37, 38, 41 | Include test and CI architecture |
| Security | 18, 19, 20, 22, 34, 35, 36 | Emphasize staff-only auth and safety guard |
| Testing | 37, 38 | PHPUnit and GitHub Actions |
| Database | 16, 17, 43 | Use schema-backed design patterns |
| Deployment | 27, 28, 30, 38, 41 | Storage, queue, and environment variables |

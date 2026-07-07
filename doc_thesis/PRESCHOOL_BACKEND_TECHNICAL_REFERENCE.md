# HFCCF Preschool Backend Technical Reference

## 1. Document Purpose
This document describes the implemented Preschool backend architecture as it exists in the repository. It focuses on current Preschool behavior, not planned future workflows.

## 2. Preschool Backend Overview
The Preschool backend is the most developed HFCCF domain module. It provides APIs for students, guardians, guardian governance, teachers, classes, attendance, billing, health, assessments, reports, settings, workflows, operations, and automation.

## 3. Preschool Domain Actors

| Actor | Backend role | Responsibilities |
| --- | --- | --- |
| Preschool admin | `adminpreschool` | Full operational management |
| Preschool teacher | `teacher-preschool` | Student, attendance, schedule, report, and health-adjacent reads |
| Super admin | `superadmin` | Delegated command-center and review surfaces |
| Guardian | data record only | No active login |

## 4. Preschool Backend Technology Usage
- Laravel controllers for HTTP endpoints
- Form request validation for write operations
- Eloquent models for all Preschool entities
- Services and support classes for workflow, billing, health, communication, and analytics
- Resource classes for JSON output
- Observer support for health records

## 5. Preschool API Architecture
The Preschool API is built around controller groups under `/api/preschool`. It uses:
- JSON envelope responses
- authenticated staff-only access
- fine-grained route grouping by area
- service delegation for complex flows

The route set is evidence of a production-domain implementation, not a scaffold.

## 6. Route Organization
Major Preschool route groups include:
- dashboard
- teachers
- class levels and classes
- students and guardians
- attendance and attendance sessions
- health and health alerts
- guardian communications and governance
- billing, invoices, and receipts
- schedules and school calendar events
- forms and assessments
- reporting and analytics
- settings and operations
- workflow definitions, instances, approvals, and sync
- academic lifecycle and report periods

## 7. Controller Architecture
Key Preschool controllers include:
- `PreschoolDashboardController`
- `PreschoolStudentController`
- `PreschoolGuardianController`
- `PreschoolGuardianCommunicationController`
- `PreschoolGuardianGovernanceController`
- `PreschoolAttendanceController`
- `PreschoolAttendanceSessionController`
- `PreschoolPaymentController`
- `PreschoolInvoiceController`
- `PreschoolReceiptController`
- `PreschoolAssessment*Controller` classes
- `PreschoolWorkflow*Controller` classes
- `PreschoolOperationsController`
- `PreschoolReportingController`

## 8. Request Validation
Preschool write endpoints use request classes for structured validation, especially for:
- student creation/update
- guardian and guardian-link actions
- attendance and scheduling
- billing
- workflow actions
- assessments and forms

This avoids controller bloat and keeps domain rules explicit.

## 9. Service Layer

| Service area | Examples |
| --- | --- |
| Enrollment | `PreschoolEnrollmentService` |
| Guardian | `PreschoolGuardianService`, `PreschoolStudentGuardianService` |
| Guardian communication | `PreschoolGuardianCommunicationService` |
| Guardian governance | `PreschoolGuardianGovernanceService`, `PreschoolGuardianIssueLifecycleService` |
| Health | `PreschoolHealthAlertService`, `PreschoolHealthAuditService` |
| Billing | `PreschoolBillingService` |
| Workflow | `PreschoolWorkflowService`, `PreschoolWorkflowApprovalService`, `PreschoolWorkflowSyncService` |
| Operations | `PreschoolOperationsService` |
| Analytics and reports | `PreschoolAnalyticsService`, `PreschoolReportService`, `PreschoolReportSnapshotService` |
| Settings | `PreschoolSettingsBackboneService`, `PreschoolSettingsDashboardService` |

## 10. Support and Domain Logic Classes
The `app/Support` directory contains the deeper domain logic for Preschool:
- attendance configuration and session history services
- academic lifecycle services
- schedule conflict and teacher schedule services
- class code and classroom report services
- snapshot archive and export governance services
- guardian portal invitation and access services
- institutional integrity and reconstruction services
- lifecycle audit and guard services

## 11. Preschool Model Architecture
Preschool models mirror the schema reference files and live database structure. The model set includes:
- academic year and term tables
- classes and class levels
- students and guardians
- student-guardian pivot links
- attendance records and sessions
- billing, invoices, and receipts
- health profiles, alerts, incidents, allergies, vaccination, medication, and audit tables
- assessment settings, weights, categories, templates, and submissions
- workflow definitions, instances, events, approvals, sync runs, and steps
- report snapshots and export records

## 12. Model Relationships
Preschool model relationships are rich and normalized:
- student to guardians through pivot rows
- student to classes
- class to teacher
- attendance record to student, class, and recorder
- guardian to communication timeline and governance issues
- billing entities to students and classes
- workflow records to source records and approval events

## 13. Preschool Database Domain
The Preschool schema is substantial and includes both exclusive and shared tables. It contains:
- student, guardian, class, attendance, schedule, health, billing, assessment, workflow, and reporting tables
- shared auth and RBAC tables
- shared notification and audit tables
- shared location tables for Cambodia administrative divisions

The database reference file created earlier is the best machine-readable source for table-level claims.

## 14. Shared Tables Used by Preschool
Shared dependencies include:
- `users`
- `organizations`
- `user_statuses`
- `roles`
- `permissions`
- `role_permissions`
- `user_permissions`
- `role_scopes`
- `departments`
- `domain_codes`
- `notifications`
- `notification_recipients`
- `notification_targets`
- `audit_logs`
- `deleted_users`
- `password_reset_otps`
- `personal_access_tokens`
- `jobs`
- `failed_jobs`
- `academic_years`
- `cambodia_provinces`
- `cambodia_districts`
- `cambodia_communes`
- `cambodia_villages`

## 15. Preschool-Exclusive Tables
Preschool-exclusive tables include the `preschool_*` family:
- students, guardians, classes, schedules, attendance, billing, assessments, reports, workflows, operations, settings, and health records

## 16. Enrollment and Admission Architecture
Enrollment is not a placeholder. The backend contains:
- enrollment application persistence
- decision logs
- documents
- class assignment flows
- billing kickoff logic
- student creation from approved applications

This is a completed business process.

## 17. Student Record Architecture
Students are represented as domain records with:
- profile data
- attendance history
- guardian links
- health data
- assessment data
- billing data

The backend treats student identity as operational school data, not authentication data.

## 18. Guardian Architecture
Guardians are domain records with:
- contact data
- relationships to students
- communications
- governance issues
- remediation logs

The backend exposes guardian management APIs, but not guardian authentication.

## 19. Guardian Governance Architecture
Guardian governance is an active backend feature with:
- duplicate detection
- consistency reports
- remediation actions
- issue lifecycle management
- sync and dashboard summary support

Status: implemented.

## 20. Guardian Communication Architecture
The backend records guardian communication timelines and supports:
- manual notes
- automated alerts
- send, acknowledge, and cancel actions
- communication history views by student or guardian

Status: implemented.

## 21. Guardian Portal Compatibility Status
Status: partially implemented as compatibility infrastructure, not as active login.

Evidence:
- `PreschoolGuardianPortalController` exists
- route endpoints exist for portal account listing, invites, and revocation
- `AuthController@login` explicitly rejects the `guardian` role
- the frontend has no active guardian portal route

Recommendation:
- document guardian portal account management as dormant compatibility support, not an active user portal.

## 22. Teacher Architecture
Teacher-specific routes and controller methods provide:
- my students
- my classes
- my attendance
- teacher schedule
- teacher report access
- teacher classroom resources

Status: implemented.

## 23. Class Architecture
Classes and class levels are implemented with:
- class CRUD
- class level CRUD and restore/deactivate actions
- class-student membership
- teacher assignment
- classroom resources
- class schedule support

Status: implemented.

## 24. Schedule Architecture
Preschool schedule support includes:
- schedule management
- schedule details
- class schedules
- teacher schedules
- school calendar events

Status: implemented.

## 25. Attendance Architecture
Attendance includes:
- attendance records
- attendance sessions
- attendance alerts
- dashboard summaries
- teacher and admin views

Status: implemented.

## 26. Attendance Session Architecture
Attendance sessions are treated as a first-class business entity, not only as derived report data. The backend includes dedicated models, controllers, services, and summary views.

Status: implemented.

## 27. Payment Architecture
Preschool billing includes:
- payment records
- payment status tracking
- overdue and pending summaries
- payment workflows and reports

Status: implemented.

## 28. Invoice and Receipt Architecture
Invoices and receipts are separate entities with explicit controllers and UI/API support. This is appropriate for accounting-style separation of charges and payment confirmation.

Status: implemented.

## 29. Assessment Architecture
Preschool assessments are implemented as a configurable subdomain with:
- assessment settings
- categories
- weights
- grading scales
- report periods
- student assessments

Status: implemented.

## 30. Assessment Template Persistence
Assessment design data is persisted through the shared assessment architecture and Preschool settings. The backend supports template-like persistence through the assessment subsystem and forms workflow.

Status: implemented.

## 31. Assessment Versioning and Review Metadata
The repository contains versioning and review-related artifacts for forms and assessments, including version tables and review workflows. This supports controlled evolution of assessment forms rather than destructive editing.

Status: implemented.

## 32. Health and Medical Record Architecture
Health records are a major Preschool backend surface:
- medical profiles
- allergies
- vaccination records
- medication records
- health incidents
- health contacts
- health check logs

Status: implemented.

## 33. Health Audit Architecture
Health audit logging is explicit through:
- `PreschoolStudentHealthAuditController`
- health audit models and services
- an observer that monitors health-related model changes

Status: implemented.

## 34. Health Alert Lifecycle
The backend supports health alerts, alert summaries, and guardian follow-up logic. Alerts are integrated into operations, reports, and communications.

Status: implemented.

## 35. Academic Lifecycle Architecture
Academic years, terms, report periods, and lifecycle audit logic are implemented. This supports a structured academic calendar rather than ad hoc date fields.

Status: implemented.

## 36. Settings Architecture
Settings are split into:
- backbone settings
- dashboard settings
- academic settings
- attendance settings
- payment settings
- assessment settings
- health settings
- preferences settings

Status: implemented.

## 37. Operations Architecture
Operations APIs and services aggregate:
- attendance
- billing
- guardians
- health
- workflows
- reports
- risk and status views

Status: implemented.

## 38. Notification Integration
Preschool notifications are integrated through:
- the global notification subsystem
- Preschool notification controllers and services
- notification rule services

Status: implemented.

## 39. Automation Task Architecture
Automation task handling exists through dedicated controllers, services, and scheduled jobs. It is used for operational checks and workflow support rather than being an isolated UI feature.

Status: partially implemented.

## 40. Workflow Definition Architecture
Workflow definitions are first-class records with a dedicated controller, service layer, and model set. They define the structure for Preschool workflow instances and approvals.

Status: implemented.

## 41. Workflow Runtime Architecture
Runtime workflow behavior is represented through:
- workflow instances
- workflow events
- workflow steps
- workflow sync runs
- workflow sync run items

Status: implemented.

## 42. Approval Architecture
Approval behavior is explicit in the Preschool workflow layer. The backend tracks approval state, transitions, and approval metadata rather than collapsing everything into a single status column.

Status: implemented.

## 43. Workflow Observability
Observability support exists through dedicated services and controller endpoints for:
- overdue items
- recent activity
- sync visibility
- timeline data

Status: implemented.

## 44. Workflow Sync Architecture
Workflow sync runs and sync run items show that the module supports synchronization/replication of workflow state as a real backend concern.

Status: implemented.

## 45. Reports and Analytics
Preschool reporting includes:
- academic lifecycle reports
- attendance reports
- assessment reports
- health reports
- payment reports
- enrollment reports
- guardian reports
- classroom reports
- report snapshots and exports
- analytics summaries

Status: implemented.

## 46. Preschool RBAC
The backend enforces Preschool access by staff role and route grouping. Teachers get narrower read-focused access; admins get full operational access. Guardian login is explicitly rejected.

## 47. Audit Logging
Audit logging is available through the global audit subsystem and Preschool lifecycle audit features.

## 48. Queue and Background Processing
Preschool uses the queue system for background jobs such as image processing and assessment export. The queue driver is database-backed in the main application configuration.

## 49. Preschool Security Controls
Observed controls include:
- `auth:sanctum`
- role- and route-based authorization
- rate limiting
- guarded password changes
- database safety guard
- explicit guardian-login rejection

## 50. Preschool Backend Testing
The repository contains dedicated Preschool feature tests for:
- dashboard
- enrollment
- attendance
- guardian workflows
- health
- reports
- workflows
- settings
- operations

These tests passed in the current validation run.

## 51. Implemented vs Partial vs Legacy Feature Matrix

| Feature class | Count | Examples |
| --- | --- | --- |
| Implemented | 25 | Students, guardians, classes, attendance, health, billing, assessments, workflows, reports |
| Partial | 4 | Guardian portal compatibility, automation task surface, some review-only governance screens, compatibility aliases |
| Legacy | 2 | Older route names and compatibility artifacts retained for navigation stability |

## 52. Technical Strengths
- Strong domain decomposition
- Mature workflow and governance design
- Real academic and health data handling
- Staff-only security model
- Traceable route-to-controller-to-service design

## 53. Technical Limitations and Risks
- The module is wide and operationally dense, so documentation must distinguish current behavior from compatibility artifacts.
- Guardian portal support exists only as management infrastructure.
- Some features are intentionally review-heavy, which can be mistaken for inactivity if route evidence is not read carefully.

## 54. Thesis-Ready Preschool Backend Summary
The Preschool backend is a realistic example of a domain-heavy Laravel module. It is suitable for a thesis because it demonstrates layered business logic, staff-only security, auditability, workflow management, and a normalized database design.

## 55. Thesis Extraction Guide

| Thesis Section | Recommended Document Sections | Notes |
| --- | --- | --- |
| Preschool Requirements | 2, 3, 16-45 | Functional scope and actors |
| Preschool System Design | 5, 6, 7, 8, 9, 10 | Route and service structure |
| Preschool Implementation | 16-45 | Core implementation evidence |
| Preschool Database Design | 13-15, 29-31, 32-35 | Link features to schema |
| Preschool Security | 21, 46, 49, 53 | Guardian portal and staff-only auth |
| Preschool Testing | 50, 51 | Targeted and full-suite evidence |

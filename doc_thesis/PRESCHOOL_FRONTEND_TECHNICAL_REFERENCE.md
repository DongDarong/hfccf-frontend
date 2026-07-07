# HFCCF Preschool Frontend Technical Reference

## 1. Document Purpose
This document describes the implemented Preschool frontend as it currently exists in the repository. It focuses on the Preschool admin and teacher surfaces, including compatibility routes, and distinguishes implemented behavior from scaffold-only or legacy UI.

## 2. Preschool Module Overview
The Preschool frontend is the largest feature area in HFCCF. It provides admin and teacher routes for student management, guardians, classes, attendance, schedules, health, billing, assessments, reports, workflows, operations, analytics, and settings.

The module is used by:
- `adminpreschool`
- `teacher-preschool`
- `superadmin` for delegated command-center surfaces

Guardians are represented as domain data only; there is no active guardian login surface.

## 3. Preschool Users and Actors

| Actor | Frontend role | Current UI access |
| --- | --- | --- |
| Preschool admin | `adminpreschool` | Full Preschool operational surfaces |
| Preschool teacher | `teacher-preschool` | Teacher dashboard, students, schedules, attendance, reports, resources, health |
| Super admin | `superadmin` | Delegated command-center surfaces reusing Preschool operational pages |
| Guardian | `guardian` compatibility constant only | No active portal route |

## 4. Technologies Used by the Preschool Frontend
- Vue 3 composition API pages and component composition
- Vue Router route guards with access metadata
- Pinia for module-local state where needed
- PrimeVue inputs, dialogs, tables, cards, and overlays
- Tailwind utility styling with local CSS modules
- Vue I18n for English and Khmer locale content
- Axios-based module API services
- `jspdf`, `html-to-image`, and `qrcode` for export and ID-card surfaces

## 5. Preschool Frontend Architecture
The module is split into two primary route trees:
- admin routes under `src/modules/preschool/admin/pages`
- teacher routes under `src/modules/preschool/teacher/pages`

The frontend uses route metadata rather than hard-coded role checks. `defineAppRoute()` attaches access rules, and the router only allows access when the current user matches the rule.

## 6. Directory and Module Structure

| Directory | Role |
| --- | --- |
| `src/modules/preschool/routes.js` | Preschool route map |
| `src/modules/preschool/admin/pages` | Admin pages |
| `src/modules/preschool/admin/components` | Preschool-specific shared components |
| `src/modules/preschool/admin/composables` | Page-local logic |
| `src/modules/preschool/admin/services` | Admin feature services |
| `src/modules/preschool/admin/stores` | Local store modules |
| `src/modules/preschool/teacher/pages` | Teacher pages |
| `src/modules/preschool/services` | Shared module API services |
| `src/modules/preschool/composables` | Shared module composables |
| `src/modules/preschool/stores` | Preschool module store(s) |
| `src/modules/preschool/shared` | Shared Preschool feature assets |

## 7. Preschool Route Architecture
Preschool routes are grouped by operational surface:
- dashboard
- students
- users/teachers
- classes
- attendance
- schedules
- guardian communications and governance
- health
- billing
- forms and assessments
- reports and analytics
- workflows and approvals
- settings

The route file also contains compatibility aliases such as older `/module/preschool-admin/...` paths redirected to the current canonical routes.

## 8. Admin Route Architecture
Admin routes are the primary operational surface. They cover:
- dashboard
- student list, create, edit, and profile
- teacher management
- classes and class details
- attendance dashboard, history, alerts, sessions, ID cards, and profiles
- health records and student health profiles
- guardian communications and governance
- payments, invoices, and receipts
- schedules and classroom resources
- forms, assessment builder, and report management
- analytics, reports, snapshots, governance, and operations

## 9. Teacher Route Architecture
Teacher routes expose a narrowed staff view:
- dashboard
- my students
- my schedule
- attendance
- report access
- classroom resources
- health overview

Teachers use the same backend domain but do not get administrative write access to setup, governance, or billing surfaces.

## 10. SuperAdmin Operational Surface Integration
Superadmin integration is explicit and currently implemented through shared Preschool operational pages:
- Preschool operations center
- workflow approval center
- selected Preschool command-center views reused under the global domain

This is a deliberate reuse pattern rather than a separate superadmin-only Preschool module.

## 11. Preschool Sidebar and Navigation
Preschool navigation is populated from the sidebar JSON section for Preschool and then filtered by access rules. The navigation exposes the same major operational areas as the route tree:
- dashboard
- student management
- teachers
- classes
- attendance
- schedules
- forms
- assessments
- reports
- workflows
- settings
- health
- guardians
- operations

## 12. Dashboard Architecture
`PreschoolDashboard.vue` is the module landing page. It aggregates:
- student counts
- class counts
- teacher counts
- attendance today
- payment status summaries
- health alerts
- recent attendance
- upcoming classes

The dashboard is role-aware:
- admins see the full Preschool summary
- teachers see a filtered subset based on their classes

Status: implemented.

## 13. Enrollment and Admission UI
The enrollment area includes:
- create enrollment application
- enrollment management
- review dialogs
- class assignment
- document checklist
- timeline and decision panels

Status: implemented.

## 14. Student Management UI
The student area includes:
- student list
- create/edit form
- student profile
- communication and health summary sections
- payment summary sections

Status: implemented.

## 15. Guardian Data Architecture
Guardian data is treated as a Preschool business entity, not a login identity. The UI exposes:
- guardian records
- guardian communications
- guardian governance review
- guardian remediation and integrity surfaces
- guardian contact analytics and reports

Status: implemented.

## 16. Guardian Governance UI
Guardian governance is a distinct admin workflow surface with:
- issue review
- diff analysis
- governance cases
- integrity checking
- remediation logs
- recovery and archival actions

Status: implemented.

## 17. Teacher Management UI
Teacher management includes:
- teacher list
- teacher create/edit/view pages
- teacher schedule page
- teacher class and attendance surfaces

Status: implemented.

## 18. Class Management UI
The class area includes:
- classes management
- add class flow
- class details
- class schedule
- classroom resources

Status: implemented.

## 19. Schedule Management UI
Schedule features include:
- schedule management
- schedule details
- class schedules
- teacher schedules
- schedule history support in the backend-facing data flow

Status: implemented, with some schedule-history behavior surfaced indirectly through reports and operational views.

## 20. Attendance Architecture
Attendance is a major Preschool feature and includes:
- management dashboard
- attendance students
- attendance history
- attendance alerts
- attendance calendar
- attendance profiles
- attendance ID cards
- attendance sessions

Status: implemented.

## 21. Attendance Session UI
Attendance session details and history are first-class pages. They are also reused by teacher routes, which shows that teacher access is a read-focused subset of the admin model.

Status: implemented.

## 22. Payment Architecture
Payment handling is implemented through:
- payment management
- summary cards
- filters
- reports

Status: implemented.

## 23. Invoice and Receipt UI
The module includes:
- invoice detail pages
- receipt view pages
- payment table and invoice table components

Status: implemented.

## 24. Assessment Architecture
The Preschool assessment surface includes:
- dashboard
- form list
- form builder
- reports
- settings
- scoring manager
- print designer
- tracker and submission views

Status: implemented.

## 25. Assessment Form Builder Integration
The assessment builder uses feature-local components and composables:
- question palette
- canvas
- settings panels
- autosave and wizard logic
- form builder store

Status: implemented.

## 26. Health and Medical Records UI
Health features include:
- health records dashboard
- student health profile
- health settings
- health-related summary sections in student profiles and operations

Status: implemented.

## 27. Health Alert Workflow UI
Health alerts are visible in:
- attendance dashboards
- health dashboards
- operations center
- report surfaces

Status: implemented.

## 28. Guardian Communication UI
The communication surface includes:
- guardian communication dashboard
- student communication timelines
- guardian communication timelines
- mark-sent, acknowledge, and cancel actions

Status: implemented.

## 29. Forms Architecture
Forms are used both as operational Preschool forms and as assessment-related building blocks. The module includes:
- forms dashboard
- manage page
- review page
- builder integration

Status: implemented.

## 30. Classroom Resource UI
Classroom resources are surfaced in:
- class details
- teacher resources
- admin classroom resources page

Status: implemented.

## 31. Reports and Analytics UI
Preschool reporting is broad:
- attendance reports
- assessment reports
- health reports
- payment reports
- enrollment reports
- guardian reports
- classroom reports
- lifecycle audit
- report snapshots
- export governance

Analytics includes:
- attendance
- sessions
- alerts
- students
- teachers
- guardian contacts

Status: implemented.

## 32. Settings UI
Settings are split into:
- academic
- attendance
- payments
- assessments
- health
- preferences
- general Preschool dashboard

Status: implemented.

## 33. Academic Lifecycle UI
Academic lifecycle surfaces are implemented through:
- academic settings
- terms and report periods
- lifecycle audit
- academic context cards in the dashboard

Status: implemented.

## 34. Executive Operations UI
The operations center is a real Preschool surface that aggregates:
- attendance
- payments
- guardian communications
- health
- workflows
- risks

Status: implemented.

## 35. Workflow and Approval UI
Workflow UI includes:
- approval center
- workflow details
- workflow timeline
- pending approvals
- my assignments
- overdue workflows

Status: implemented.

## 36. Workflow Observability UI
Observability is explicit in the UI:
- workflow queue
- recent updates
- timeline preview
- operational risk panels

Status: implemented.

## 37. Workflow Sync UI
Sync-run details and sync management are exposed through dedicated pages and route aliases. This indicates a real operational workflow sync feature rather than a stub.

Status: implemented.

## 38. Automation Task UI
Automation appears in the Preschool operations and workflow surfaces, plus notification automation center views.

Status: partially implemented. The UI exists, but the codebase shows it as an operational support surface rather than a large standalone automation product.

## 39. Unified Notification Integration
Preschool notifications are integrated via:
- the global notifications module
- Preschool-specific notification route aliases
- notification automation center
- operations links into notification-related work items

Status: implemented.

## 40. Preschool API Service Layer
Relevant module services include:
- `preschoolApi.js`
- `cambodiaLocationService.js`
- `preschoolAttendanceConfigurationService.js`
- support utilities for schedules and report data

These services normalize backend payloads for forms, reports, and location pickers.

## 41. Preschool State Management
The Preschool module uses localized state where required:
- `assessmentStore.js`
- feature-local composables and page-local state objects

Status: implemented.

## 42. Preschool Composables
The Preschool module uses composables extensively for page behavior:
- assessment data and filters
- report data
- classroom and schedule helpers
- operations and workflow helpers
- student profile actions

Status: implemented.

## 43. Preschool Shared Components
Shared Preschool components cover:
- dashboard summary cards
- class detail cards
- student profile sections
- attendance components
- workflow cards
- health panels
- guardian communication timeline

Status: implemented.

## 44. Preschool EN/KH Localization
Preschool text is localized through the shared Vue I18n setup. The module has extensive locale keys for dashboard, enrollment, attendance, health, reports, and operations.

Status: implemented.

## 45. Preschool Frontend RBAC
Access is controlled by:
- Preschool domain
- admin and staff scopes
- route metadata
- sidebar access filtering

Teacher routes are intentionally narrower than admin routes. Guardian access is not exposed as a live portal.

## 46. Preschool Error and Loading States
The module relies on the shared HTTP client for normalized errors and uses local loading states in the pages and composables. This keeps page code responsive during long report or workflow requests.

## 47. Preschool Frontend Testing
Preschool unit and module tests are present under `src/tests/unit/modules/preschool` and the repository has targeted coverage for Preschool services and routes.

## 48. Implemented vs Partial vs Legacy Feature Matrix

| Feature class | Count | Examples |
| --- | --- | --- |
| Implemented | 24 | Dashboard, students, guardians, classes, attendance, billing, assessments, reports, health, workflows |
| Partial | 4 | Automation task surface, placeholder settings UI, compatibility redirects, review-only snapshot/export screens |
| Legacy/compatibility | 3 | Older route aliases and compatibility views preserved for navigation stability |

## 49. Technical Strengths
- Rich real-world Preschool domain coverage
- Strong separation between admin and teacher access
- Good operational depth for attendance, health, and workflows
- Reusable report and analytics surfaces
- Shared location pickers and communication flows

## 50. Technical Limitations and Risks
- The module is large and route-dense, which increases documentation and maintenance effort.
- Some surfaces remain compatibility-oriented rather than primary navigation.
- Guardian portal artifacts must be documented carefully as disabled compatibility, not active end-user login.

## 51. Thesis-Ready Preschool Frontend Summary
The Preschool frontend is a mature module-level implementation built around an admin and teacher split. It is suitable for a thesis discussion of domain-oriented frontend design, because it shows how a single SPA can expose a broad business workflow while preserving access control and feature separation.

## 52. Thesis Extraction Guide

| Thesis Section | Recommended Document Sections | Notes |
| --- | --- | --- |
| Preschool Requirements | 2, 3, 13-39 | Covers functional breadth |
| Preschool System Design | 5, 6, 7, 8, 9, 10, 11 | Explains route and shell design |
| Preschool Implementation | 12-47 | Main evidence for actual UI behavior |
| Preschool Database Design | 15, 22, 23, 24, 26, 27, 28 | Link UI to data-driven features |
| Preschool Security | 3, 45, 50 | Guardian portal disabled, role-based routing |
| Preschool Testing | 47, 48 | Test surface and feature classification |

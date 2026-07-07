# HFCCF Sport Backend Technical Reference

## 1. Document Purpose
This document describes the implemented Sport backend architecture as it exists in the repository. It focuses on current Sport behavior and avoids describing planned architecture as if it were already implemented.

## 2. Sport Backend Overview
The Sport backend is a fully implemented domain module with APIs for teams, players, coaches, attendance, match management, match squads, approvals, tournaments, standings, match events, and coach-team assignment workflows.

## 3. Sport Domain Actors

| Actor | Backend role | Responsibilities |
| --- | --- | --- |
| Sport admin | `adminsport` | Full Sport administration |
| Coach | `coach` | Team rosters, squad selection, requests, coach dashboard |
| Super admin | `superadmin` | Delegated audit/reporting and command-center surfaces |

## 4. Sport Backend Technology Usage
- Laravel controllers and routes for HTTP APIs
- Eloquent models for the sport domain
- service classes for approvals, eligibility, standings, squads, tournaments, and match events
- request validation for writes
- JSON response helper support

## 5. Sport API Architecture
The Sport API is grouped under `/api/sport` and is split into admin and coach-facing routes. It exposes:
- dashboard endpoints
- coaches and coach-team assignment endpoints
- teams and player endpoints
- attendance endpoints
- match and match-event endpoints
- match squad endpoints
- approval endpoints
- tournament endpoints

## 6. Route Organization
Sport route groups are implemented for:
- dashboard
- attendance
- coaches
- teams
- divisions
- playing styles
- players
- matches
- match squads and events
- coach requests
- approvals
- tournaments, groups, fixtures, knockout, results, and statistics

## 7. Controller Architecture
Key Sport controllers include:
- `SportDashboardController`
- `SportCoachController`
- `SportTeamController`
- `SportPlayerController`
- `SportMatchController`
- `SportMatchEventController`
- `SportMatchSquadController`
- `SportAttendanceController`
- `SportApprovalController`
- `SportAdminCoachTeamAssignmentController`
- tournament controller set for list, groups, fixtures, knockout, results, and statistics

## 8. Request Validation
Sport write endpoints use request validation classes and/or controller validation for:
- team creation and updates
- player creation and lifecycle changes
- coach assignment changes
- match creation and status updates
- match event write operations
- tournament creation and updates

## 9. Service Layer

| Service area | Examples |
| --- | --- |
| Coach assignment | `SportCoachAssignmentService`, `SportCoachTeamController` support |
| Player lifecycle | `SportPlayerLifecycleService` |
| Player eligibility | `SportPlayerEligibilityService` |
| Match eligibility | `SportMatchEligibilityService` |
| Match squads | `SportMatchSquadService`, `SportMatchSquadValidationService` |
| Match events | `SportMatchEventService`, `SportMatchEventValidationService`, `SportMatchTimelineService` |
| Scores and standings | `SportMatchScoreService`, `SportStandingsService` |
| Approvals | `SportApprovalService` |
| Coach requests | `SportCoachRequestService` |
| Team rosters | `SportTeamRosterService`, `SportPlayerMembershipService` |

## 10. Sport Model Architecture
Sport models are present for:
- players
- teams
- coaches
- attendance records
- divisions
- match events
- match squads
- match squad players
- player-team memberships
- standings
- tournaments
- tournament groups
- tournament teams
- tournament knockout rounds
- tournament group teams

## 11. Model Relationships
Sport relationships include:
- team to coach
- player to team
- player to membership history
- match to home and away teams
- match to tournament
- match to squad and match events
- tournament to teams, groups, matches, and standings

## 12. Sport Database Domain
The Sport schema is not speculative. It contains:
- player, team, coach, attendance, division, playing style, match, squad, event, standings, and tournament tables
- approval and coach-team assignment tables
- shared auth, RBAC, audit, notification, queue, and password-reset tables

The schema reference files previously validated are the definitive table-level source.

## 13. Shared Tables Used by Sport
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
- `coach_team_assignments`

## 14. Sport-Exclusive Tables
Sport-exclusive tables include:
- attendance records
- divisions
- match events
- match squads
- match squad players
- matches
- player-team memberships
- players
- playing styles
- standings
- teams
- tournament group teams
- tournament groups
- tournament knockout rounds
- tournament teams
- tournaments

## 15. Player Architecture
Players are a first-class entity with:
- CRUD APIs
- lifecycle updates
- suspension, injury, release, archive, and status changes
- eligibility checks
- membership history

Status: implemented.

## 16. Team Architecture
Teams include:
- CRUD operations
- roster management
- coach linkage
- tournament team linkage

Status: implemented.

## 17. Coach Architecture
Coach support includes:
- CRUD operations
- coach-team assignments
- coach dashboard
- coach match and request views

Status: implemented.

## 18. Class and Training Group Architecture
The repository does not expose a separate Sport class model analogous to Preschool classes. Training is represented through schedules, teams, and coach-facing training views.

Status: partially implemented as scheduling and roster workflows rather than a standalone class subsystem.

## 19. Schedule Architecture
Sport schedule handling is represented through:
- training schedules
- coach training schedules
- attendance-related scheduling

Status: implemented.

## 20. Training Session Architecture
Training-session behavior exists in the coach and admin UI, but the backend model is closer to scheduled training and attendance records than a standalone session entity.

Status: partially implemented.

## 21. Attendance Architecture
Attendance is implemented with:
- attendance record APIs
- attendance dashboard support
- coach and player attendance views

Status: implemented.

## 22. Performance Tracking Architecture
Performance tracking is represented through:
- player lifecycle changes
- match events
- standings
- tournament statistics

Status: implemented, but distributed across the match/tournament stack.

## 23. Tournament Architecture
Tournament is a major implemented subdomain. It includes:
- tournament CRUD
- team assignment
- standings
- groups
- fixtures
- results
- statistics
- knockout brackets

Status: implemented.

## 24. Tournament Rule Architecture
The tournament module includes services and components for qualification, tie-breaks, fixtures, round-robin logic, knockout generation, and statistics. This indicates actual rule logic rather than simple CRUD.

Status: implemented.

## 25. Team Registration Architecture
Teams are linked into tournaments and coach workflows. Registration-like behavior is present through team creation, assignment, and tournament enrollment APIs.

Status: implemented.

## 26. Group Stage Architecture
Group-stage behavior is implemented through tournament group APIs, group teams, draw operations, and group-finalize endpoints.

Status: implemented.

## 27. Manual Draw Architecture
Manual draw support is represented in the tournament group route and frontend surface. It is a real operational feature.

Status: implemented.

## 28. Automatic Draw Architecture
Automatic or generated group logic exists in the tournament service layer and frontend generation helpers.

Status: implemented.

## 29. Match Architecture
Matches are implemented as a full backend subdomain with:
- CRUD
- status updates
- home/away teams
- tournament links
- squad links
- event timelines

Status: implemented.

## 30. Score and Result Architecture
Score and result behavior is implemented through:
- match result entry
- score calculation services
- result update routes
- result output pages

Status: implemented.

## 31. Standings Architecture
Standings are a first-class implemented feature with both persisted standings data and service-backed ranking calculations.

## 32. Reporting Architecture
Sport reporting is distributed through:
- tournament statistics
- standings
- match summaries
- attendance history
- approval views

Status: implemented.

## 33. Notification Integration
Sport uses the shared notification infrastructure for alerts and workflow visibility. The backend also includes sport-specific notification dispatch support.

Status: implemented.

## 34. Settings Integration
Sport does not expose a large standalone settings subsystem in the way Preschool does. Configuration is mostly handled through route-driven feature forms and shared application settings.

Status: limited and partially implemented.

## 35. Sport RBAC
Sport routes are restricted by role and scope:
- admins access administrative routes
- coaches access coach routes
- superadmins access delegated command-center routes

This is enforced in routing and controller authorization.

## 36. Audit Logging
Audit logging exists as a shared system feature and is also used for Sports governance and reporting needs.

## 37. Queue and Background Processing
Sport does not currently show a large sport-specific queue subsystem. Instead, it uses the shared queue infrastructure when background work is needed by the platform.

Status: limited, shared infrastructure only.

## 38. Sport Security Controls
Observed controls include:
- `auth:sanctum`
- role-based route access
- fine-grained approval workflows
- controller-level authorization gates
- shared rate limiting and auth/session controls

## 39. Sport Backend Testing
The repository contains dedicated Sport tests for:
- sport API
- coach-team management
- player lifecycle
- match eligibility
- match event timeline
- tournament foundation
- audit/notification foundations

These tests passed in the current validation run.

## 40. Implemented vs Partial vs Planned Feature Matrix

| Feature class | Count | Examples |
| --- | --- | --- |
| Implemented | 18 | Players, teams, coaches, attendance, matches, squads, events, tournaments, standings |
| Partial | 3 | Training-session abstraction, class-like training groups, settings as limited shared configuration |
| Planned or not implemented | 0 | No separate planned-only Sport backend surface was found in current repository evidence |

## 41. Technical Strengths
- Tournament logic is real and well supported
- Match events and squads are modeled explicitly
- Coach workflows are separate from admin workflows
- The module is rich enough to support thesis discussion of sports administration software

## 42. Technical Limitations and Risks
- Training/class abstraction is not represented as a separate backend entity set.
- Some features are expressed through schedule and roster workflows instead of a dedicated session model.
- The module is large enough that documentation must separate implemented tournament logic from adjacent support helpers.

## 43. Thesis-Ready Sport Backend Summary
The Sport backend is a complete domain module with practical tournament, match, coach, and player workflows. It is suitable for thesis writing because it demonstrates a real operational feature set with clear route, service, and model boundaries.

## 44. Thesis Extraction Guide

| Thesis Section | Recommended Document Sections | Notes |
| --- | --- | --- |
| Sport Requirements | 2, 3, 15-34 | Functional scope and actors |
| Sport System Design | 5, 6, 7, 8, 9, 10, 11 | Route and domain design |
| Sport Implementation | 15-34 | Core implemented behavior |
| Sport Database Design | 12-14, 23-31 | Link features to schema |
| Sport Security | 35, 38 | Role-based access and approval gates |
| Sport Testing | 39, 40 | Module-specific test coverage |

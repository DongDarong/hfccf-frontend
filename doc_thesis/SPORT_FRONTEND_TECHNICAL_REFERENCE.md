# HFCCF Sport Frontend Technical Reference

## 1. Document Purpose
This document describes the implemented Sport frontend as it exists in the repository. It is limited to confirmed implementation and explicitly distinguishes that from unimplemented or scaffold-only surfaces.

## 2. Sport Module Overview
The Sport frontend is a substantial module with admin, coach, and tournament-oriented views. It covers players, teams, coaches, attendance, divisions, playing styles, matches, match squads, approvals, and tournament workflows.

## 3. Sport Users and Actors

| Actor | Frontend role | Current UI access |
| --- | --- | --- |
| Sport admin | `adminsport` | Full sport administration |
| Coach | `coach` | Coach dashboard, teams, roster, squad selection, requests |
| Super admin | `superadmin` | Delegated command-center and reporting surfaces |

## 4. Technologies Used by the Sport Frontend
- Vue 3 composition API
- Vue Router with guarded routes
- Pinia and localized composables where feature state is needed
- PrimeVue tables, dialogs, cards, badges, and form controls
- Tailwind styling and local CSS
- Axios-based sport API services
- Vue I18n for bilingual text
- PDF/image export helpers where tournament or report workflows require them

## 5. Sport Frontend Architecture
Sport uses two user-facing shells:
- admin routes under `src/modules/sport/admin/pages`
- coach routes under `src/modules/sport/coach/pages`

Tournament routes are a nested module inside Sport and represent the clearest sign that this is a mature feature area, not a placeholder.

## 6. Sport Directory Structure

| Directory | Role |
| --- | --- |
| `src/modules/sport/routes.js` | Sport route map |
| `src/modules/sport/admin/pages` | Admin pages |
| `src/modules/sport/coach/pages` | Coach pages |
| `src/modules/sport/tournament` | Tournament feature module |
| `src/modules/sport/services` | Module API service layer |
| `src/modules/sport/services/api` | Feature-specific API helpers |
| `src/modules/sport/constants` | Shared constants |
| `src/modules/sport/match-events` | Match event UI helpers |
| `src/modules/sport/match-squads` | Match squad UI helpers |

## 7. Sport Route Architecture
Sport routes are grouped by:
- dashboard
- attendance
- users/coaches
- teams
- divisions
- playing styles
- players
- matches
- training schedule
- coach workflow
- approvals
- tournaments

The module also contains route-driven approval and request flows.

## 8. AdminSport Navigation
Admin navigation covers:
- dashboard
- attendance and attendance history
- coaches
- teams
- divisions
- playing styles
- players
- matches and results
- training schedule
- coach-team assignments
- player approvals
- match approvals
- player lifecycle
- tournament workflows

## 9. Coach Navigation
Coach navigation exposes a narrower operational surface:
- coach dashboard
- my teams
- team roster
- team players
- match squad selection
- player request
- match request
- request history
- training schedule

Status: implemented.

## 10. Dashboard Architecture
The Sport dashboard is implemented for both admin and coach roles:
- admin dashboard aggregates teams, players, matches, coaches, tournaments, and events
- coach dashboard shows assigned teams and recent matches

Status: implemented.

## 11. Player Management UI
Player management includes:
- player list
- add player
- player lifecycle management
- player status and eligibility flows
- player approval surfaces

Status: implemented.

## 12. Team Management UI
Team management includes:
- team list
- add team
- team roster
- team detail pages
- team highlights and summary cards

Status: implemented.

## 13. Coach Management UI
Coach management includes:
- coach list
- add coach
- coach detail views
- coach-team assignment surfaces

Status: implemented.

## 14. Class and Training Group UI
The repository does not show a standalone Sport class module in the way Preschool has classes. Instead, training schedules and team rosters are the implemented analogs. This is an important distinction for thesis writing.

Status: partially implemented as training-group scheduling rather than a separate class subsystem.

## 15. Schedule Architecture
Sport scheduling is implemented through:
- training schedule
- coach training schedule
- attendance-related scheduling views

Status: implemented.

## 16. Training Session UI
Training sessions are represented through schedule and coach-facing surfaces rather than a separate named "session" page tree.

Status: partially implemented.

## 17. Attendance UI
Attendance includes:
- attendance dashboard
- attendance players
- attendance coaches
- attendance history
- attendance ID card

Status: implemented.

## 18. Performance Tracking UI
Performance tracking is visible through:
- player lifecycle pages
- match events
- tournament statistics
- standings and match result views

Status: implemented, but distributed across match and tournament surfaces rather than a single performance dashboard.

## 19. Tournament UI
Tournament is a major Sport feature and is fully represented in the frontend:
- tournament list
- tournament create page
- tournament detail page
- groups page
- fixtures page
- knockout page
- results page
- standings page

Status: implemented.

## 20. Tournament Configuration
Tournament configuration includes:
- tournament settings summary
- round and group control panels
- fixture generation controls
- knockout settings and validation panels

Status: implemented.

## 21. Team Registration and Assignment
Sport team registration and assignment is represented through:
- tournament team selection
- coach-team assignment review
- team roster editing
- match squad selection

Status: implemented.

## 22. Group Drawing Architecture
Group drawing is a real implemented feature. The tournament module includes:
- draw controls
- draw preview
- seed panel
- group grid
- validation

Status: implemented.

## 23. Match Management UI
Match management includes:
- match list
- add/edit match
- match results entry
- match event timeline
- match squad review
- match eligibility views

Status: implemented.

## 24. Results and Standings UI
Results and standings are implemented through dedicated pages and tournament subcomponents, including scoring and ranking helpers.

Status: implemented.

## 25. Reports and Analytics UI
Sport reporting is available through:
- tournament statistics
- standings
- result summaries
- attendance history
- coach and player operational views

Status: implemented.

## 26. Notification Integration
The Sport frontend consumes the global notifications system and also uses sport-specific operational surfaces that feed into the broader dashboard and approval workflow.

Status: implemented.

## 27. Settings Integration
Sport does not expose a large standalone settings tree comparable to Preschool. Configuration is mostly represented through feature forms, constants, and the shared application settings areas.

Status: limited and partially implemented.

## 28. Sport API Service Layer
Relevant module services include:
- `sportApi.js`
- `services/api/sportDashboardApi.js`
- `services/api/sportPlayersApi.js`
- `services/api/sportTeamsApi.js`
- `services/api/sportMatchesApi.js`
- `services/api/sportTournamentsApi.js`
- `services/api/sportAttendanceApi.js`
- `services/api/sportCoachesApi.js`
- tournament API helpers and mappers

This is a strong sign of an API-rich module rather than a mock-only shell.

## 29. Sport State Management
The Sport module does not currently show a large dedicated store directory. State is mostly managed through:
- page-local composables
- API mappers
- route-local helpers

Status: implemented through composables and helper modules rather than a central sport store.

## 30. Sport Composables
The Sport module uses many composables under tournament and match-squad logic, including:
- tournament catalog, fixtures, group draw, knockout, results, standings, statistics
- match event and squad helpers
- player lifecycle and eligibility helpers

Status: implemented.

## 31. Sport Shared Components
Sport shared components include:
- tournament fixtures and result components
- match timeline and event badges
- squad selection components
- team and player summary cards
- standings tables
- statistics panels

Status: implemented.

## 32. Sport EN/KH Localization
Sport uses the shared i18n system. The module has locale strings for:
- dashboard
- players
- teams
- coaches
- attendance
- matches
- tournaments
- approvals

Status: implemented.

## 33. Sport Frontend RBAC
RBAC is domain- and scope-based:
- `adminsport` sees the administrative surfaces
- `coach` sees coach surfaces
- `superadmin` sees delegated global surfaces

The route and sidebar layers hide inaccessible items rather than rendering them and then blocking interaction later.

## 34. Error and Loading States
Sport pages rely on the shared HTTP client for normalized errors and use local loading states within each page and composable. This is appropriate for a workflow-heavy module with match and tournament operations.

## 35. Sport Frontend Testing
Sport has dedicated module test coverage under `src/tests/unit/modules/sport` plus feature coverage for the shared HTTP/access layers that Sport uses.

## 36. Implemented vs Partial vs Planned Feature Matrix

| Feature class | Count | Examples |
| --- | --- | --- |
| Implemented | 17 | Players, teams, coaches, attendance, matches, tournament list/detail/groups/fixtures/results/standings, approvals |
| Partial | 3 | Training-group abstraction, performance tracking as distributed surfaces, settings as limited shared configuration |
| Planned or not implemented | 0 | No separate planned-only Sport surface was found in the current repository evidence |

## 37. Technical Strengths
- Tournament architecture is concrete and complete
- Coach and admin roles are cleanly separated
- Match events and squad review are well structured
- The feature set is rich enough for a real sports administration thesis case study

## 38. Technical Limitations and Risks
- Sport state is spread across route-local helpers and tournament composables rather than one central store.
- There is no separate standalone "competition" module; competition behavior is represented through tournaments, matches, and standings.
- Some schedule and performance concepts are surfaced through adjacent workflows rather than a dedicated page tree.

## 39. Thesis-Ready Sport Frontend Summary
The Sport frontend is a domain-rich module with real tournament and match workflows. It is suitable for thesis discussion because it demonstrates how a modern SPA can organize an advanced feature area without collapsing it into a single monolithic page.

## 40. Thesis Extraction Guide

| Thesis Section | Recommended Document Sections | Notes |
| --- | --- | --- |
| Sport Requirements | 2, 3, 11-27 | Functional scope and actors |
| Sport System Design | 5, 6, 7, 8, 9, 10 | Route and shell design |
| Sport Implementation | 11-35 | Main implementation evidence |
| Sport Database Design | 19-24, 28, 30 | Link UI to tournament and match data |
| Sport Security | 3, 33 | Role-based routing and access control |
| Sport Testing | 35, 36 | Test coverage and implementation classification |

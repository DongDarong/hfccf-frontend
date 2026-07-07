# HFCCF Frontend Technical Reference

## 1. Document Purpose
This document describes the implemented frontend architecture of HFCCF as it exists in the current repository. It is written as thesis source material and focuses on verified implementation rather than intended design.

## 2. System Frontend Overview
HFCCF is a Vue 3 single-page application with module-based routing, module-local state, shared access control, and a shared sidebar/navigation system. The frontend is organized by domain rather than by page type alone. The implementation supports the following major areas:

| Module | Status | Evidence |
| --- | --- | --- |
| Auth | Active and implemented | `src/modules/auth`, `src/services/auth.js`, auth routes |
| Dashboard | Active and implemented | `src/modules/dashboard` |
| Notifications | Active and implemented | `src/modules/notifications`, `/module/notifications` |
| Reports | Active and implemented | `src/modules/reports` |
| Governance | Active and implemented | `src/modules/governance` |
| Super Admin | Active and implemented | `src/modules/super-admin` |
| English | Active and implemented | `src/modules/english` |
| Preschool | Active and implemented | `src/modules/preschool` |
| Scholarship | Active and implemented | `src/modules/scholarship` |
| Sport | Active and implemented | `src/modules/sport` |
| Settings | Active and implemented | `src/modules/settings` |
| Assessment | Active and implemented | `src/modules/assessment` |
| DSAM | Active and implemented | `src/modules/dsam` |

## 3. Programming Languages and File Types
The frontend is primarily JavaScript and Vue Single File Components.

| File type | Role in HFCCF |
| --- | --- |
| `.vue` | UI pages, layouts, shared components, feature components |
| `.js` | Router, services, composables, config, utilities |
| `.ts` | Selected constants and helper files within feature modules |
| `.json` | Sidebar sections, locale bundles, mock and static config data |
| `.css` | Global styles and module-specific presentation |

## 4. Core Technology Stack

| Package | Resolved version | Category | Actual HFCCF usage | Thesis relevance |
| --- | --- | --- | --- | --- |
| `vue` | `3.5.30` | Core framework | Component rendering, reactivity, composition API | Frontend architecture |
| `vue-router` | `5.0.3` | Routing | Module route composition and guarded navigation | Navigation design |
| `pinia` | `3.0.4` | State management | Global auth/user store and module-local stores | State design |
| `primevue` | `4.5.4` | UI components | Forms, dialogs, tables, badges, cards, overlays | UI implementation |
| `primeicons` | `7.0.0` | Icons | Icon font for UI affordances | UI design |
| `@primeuix/themes` | `2.0.3` | UI theme | PrimeVue theme preset (`HopePreset`) | Visual system |
| `tailwindcss` | `4.2.1` | Styling | Utility-first styling and custom component classes | Styling architecture |
| `@tailwindcss/vite` | `4.2.1` | Styling integration | Tailwind plugin inside Vite | Build pipeline |
| `axios` | `1.13.6` | HTTP/API | Backend API client with interceptors and token handling | API communication |
| `vue-i18n` | `11.3.0` | Internationalization | English and Khmer locale bundles | Multilingual UI |
| `html-to-image` | `1.11.13` | File handling | Canvas/image export workflows | Export and reporting |
| `jspdf` | `4.2.1` | File handling | PDF generation in report and print flows | Export and reporting |
| `qrcode` | `1.5.4` | File handling | QR code rendering for cards and attendance surfaces | Document generation |
| `vite` | `7.3.2` | Build tool | Development server and production build | Build architecture |

## 5. Runtime and Development Environment
- Node.js runtime: `v22.20.0`
- npm runtime: `10.9.3`
- Package manager: npm
- Development server: Vite dev server
- Build output: Vite production bundles with manual chunking
- Frontend API base URL is configured through `VITE_API_BASE_URL`
- In development, Vite proxies `/api` to the backend host

## 6. Vue Application Architecture
The application is a single root Vue app created in `src/main.js`. It uses:
- `createPinia()` for state management
- PrimeVue for UI widgets
- Vue I18n for English and Khmer localization
- Vue Router for guarded route navigation
- a session watcher that forces logout after inactivity

`src/App.vue` contains only the root `RouterView` and global overlay components, which keeps the shell thin and delegates actual feature rendering to routed module pages.

## 7. Application Entry Point and Initialization
`src/main.js` performs the following runtime setup:
- loads global CSS and PrimeIcons
- mounts Pinia
- configures PrimeVue with a custom preset and dark-mode disabled
- installs confirmation and toast services
- installs i18n and the router
- mounts the application into `#app`
- starts the auto-logout watcher
- redirects expired sessions back to the login route

It also enforces secure origin usage outside local development by redirecting non-local HTTP traffic to HTTPS.

## 8. Frontend Project Structure

| Directory | Role |
| --- | --- |
| `src/assets` | Global CSS, icons, and static asset wiring |
| `src/components` | Shared UI and navigation components |
| `src/composables` | Shared composables such as language handling |
| `src/constants` | Roles, access scopes, and shared constants |
| `src/data` | Sidebar navigation data and other static JSON config |
| `src/i18n` | Locale initialization and message bundles |
| `src/layouts` | Main, auth, and admin layouts |
| `src/mocks` | Mock data used by feature development and tests |
| `src/modules` | Domain modules such as preschool and sport |
| `src/router` | Router bootstrap and route validation |
| `src/services` | Shared HTTP, auth, and access-control services |
| `src/shared` | Shared UI/logic used across modules |
| `src/store` | Global Pinia store(s) |
| `src/tests` | Vitest setup and test suites |
| `src/theme` | PrimeVue theme preset |
| `src/utils` | Shared utilities and security helpers |

## 9. Complete Module Inventory
| Module | Status | Notes |
| --- | --- | --- |
| Auth | Implemented | Login, password reset, profile update |
| Dashboard | Implemented | Global dashboard, calendar, notifications |
| Notifications | Implemented | Global notification inbox and creator |
| Reports | Implemented | Global attendance, student performance, training, audit reports |
| Governance | Implemented | Review, risk, audit, and investigation surfaces |
| Super Admin | Implemented | Admin management and command-center surfaces |
| English | Implemented | Admin and teacher surfaces |
| Preschool | Implemented | Admin and teacher operations |
| Scholarship | Implemented | Admin and teacher surfaces |
| Sport | Implemented | Admin, coach, and tournament surfaces |
| Settings | Implemented | Profile and website settings |
| Assessment | Implemented | Form builder, submissions, reports, scoring, audit logs |
| DSAM | Implemented | Form templates, submissions, wizard, and student profile/history |

## 10. Routing Architecture
Routes are assembled from module route arrays and validated before router creation:
- `src/modules/auth/routes`
- `src/modules/dashboard/routes`
- `src/modules/notifications/routes`
- `src/modules/reports/routes`
- `src/modules/governance/routes`
- `src/modules/super-admin/routes`
- `src/modules/english/routes`
- `src/modules/preschool/routes`
- `src/modules/scholarship/routes`
- `src/modules/sport/routes`
- `src/modules/settings/routes`
- `src/modules/assessment/routes/assessment.routes`
- `src/modules/dsam/routes/dsam.routes`

`defineAppRoute()` normalizes access metadata. `routeValidator.js` warns in development when access rules are malformed.

## 11. Route Guards and Access Control
The router applies these checks before navigation:
- session validity
- password-change enforcement
- guest-only route blocking
- role, domain, and scope authorization
- inactivity-based auto logout

The access-control model uses:
- domains: `global`, `english`, `preschool`, `scholarship`, `sport`
- scopes: `super_admin`, `admin`, `staff`, `portal`
- roles: staff roles plus a `guardian` role constant

Important limitation: the `guardian` role exists in the frontend role map for compatibility, but the current backend rejects guardian login and the frontend does not expose a guardian portal route.

## 12. Layout Architecture
The application uses three top-level layouts:
- `MainLayout.vue` for authenticated application pages
- `AuthLayout.vue` for login and recovery flows
- `AdminLayout.vue` for administrative shells where needed

The routed modules provide the actual page shell and feature-specific layout content.

## 13. Navigation and Sidebar Architecture
Navigation is data-driven and assembled from section JSON files:
- `main.json`
- `super-admin.json`
- `english.json`
- `preschool.json`
- `scholarship.json`
- `sport.json`
- `dsam.json`

`buildSidebarSections()` filters items by access rule and route validity. This means navigation is derived from authorized routes instead of hard-coded UI branching.

## 14. State Management Architecture
The frontend uses a small global Pinia store and module-local state where needed.

| Store | Role |
| --- | --- |
| `src/store/userStore.js` | Global authenticated user/session store |
| Module-local stores | Feature-specific state in assessment, preschool, sport, and related modules |

The global store synchronizes with `src/services/auth.js` and reacts to auth state changes through a browser event.

## 15. Pinia Store Organization
`userStore` is the primary global store. It tracks:
- current user
- authentication state
- permissions
- loading state
- login/logout/profile refresh actions

Module stores are intentionally localized to their domain because most complex state lives in route-scoped feature workflows, not in a single cross-cutting store.

## 16. Composable Architecture
Shared composables are limited; most logic lives beside the feature that uses it.

| Location | Role |
| --- | --- |
| `src/composables/useLanguage.js` | Language switching and locale persistence |
| Module composables | Workflow, form, list, and dashboard logic beside each feature |

This favors local reasoning and keeps Preschool and Sport workflows close to their pages.

## 17. Shared Component Architecture
Shared UI components are concentrated in `src/components`.

| Group | Examples |
| --- | --- |
| Navigation | Sidebar, navbar, breadcrumb, header section |
| UI | Buttons, badges, alerts, feedback widgets |
| Forms | Reusable form controls and wrappers |
| Display | Avatar, footer, status and badge helpers |

The navigation components are the most structural shared layer because they assemble the sidebar from role-aware config.

## 18. UI Component and Styling Architecture
The frontend mixes:
- PrimeVue component primitives
- Tailwind utility classes
- local CSS modules
- a custom PrimeVue theme preset

`vite.config.js` keeps PrimeVue styles in a separate cascade layer so Tailwind and local styles can override them predictably. Dark mode is disabled because the current theme only defines light tokens.

## 19. API Communication Architecture
`src/services/http.js` is the central HTTP client:
- validates the API base URL
- enforces HTTP/HTTPS safety
- injects Bearer tokens when the request targets the trusted API origin
- clears auth storage on `401`
- normalizes errors into consistent client-side messages

`src/services/api.js` provides payload unwrapping, query building, and error-message helpers used by module API clients.

## 20. Axios Configuration and Interceptors
The HTTP client uses one request interceptor and one response interceptor.

Request behavior:
- adds `X-Requested-With: XMLHttpRequest`
- attaches `Authorization: Bearer {token}` for trusted same-origin or configured API-origin calls

Response behavior:
- clears local auth storage when the backend returns `401`
- normalizes network, validation, and server errors

## 21. Authentication Architecture
Authentication is staff-only and token-based from the frontend perspective.
- login posts to `/auth/login`
- password reset uses OTP verification
- password change uses `/auth/change-password`
- profile updates use `/auth/me`
- logout revokes the current token through `/auth/logout`

The frontend stores authenticated state in session or local storage depending on the remember-me choice.

## 22. Session Management
Session behavior is explicit and client-side:
- token and user payload are stored in browser storage
- activity timestamps are refreshed on use
- inactivity timeout is 12 hours
- auto logout runs in the browser and listens to user activity and storage events

This is a convenience/session layer on top of backend Sanctum tokens, not a separate identity system.

## 23. Frontend RBAC
RBAC is route-driven and sidebar-driven.
- Routes declare required domains, scopes, and roles
- Sidebar items are hidden when the current user cannot access them
- Super admin routes are isolated to the global domain

The frontend role model is aligned with staff roles only:
`superadmin`, `adminenglish`, `adminpreschool`, `adminscholarship`, `adminsport`, `teacher-english`, `teacher-preschool`, `teacher-scholarship`, `coach`

`guardian` is present as a compatibility constant but is not an active authenticated role in the application.

## 24. Authenticated Role Matrix

| Role | Domain | Scope | Frontend status |
| --- | --- | --- | --- |
| `superadmin` | global | super_admin | Active |
| `adminenglish` | english | admin | Active |
| `adminpreschool` | preschool | admin | Active |
| `adminscholarship` | scholarship | admin | Active |
| `adminsport` | sport | admin | Active |
| `teacher-english` | english | staff | Active |
| `teacher-preschool` | preschool | staff | Active |
| `teacher-scholarship` | scholarship | staff | Active |
| `coach` | sport | staff | Active |
| `guardian` | preschool | portal | Compatibility-only, not active |

## 25. Internationalization Architecture
The frontend uses `vue-i18n` with:
- `en` messages
- `kh` messages
- locale persistence in `localStorage`
- automatic document locale updates

This is a practical bilingual implementation, not a generic multi-language framework.

## 26. English and Khmer Locale Architecture
Locale bundles are loaded from `src/i18n/en` and `src/i18n/kh`. The active locale is normalized before it is applied to Vue I18n and to the document element. This supports Khmer text rendering and keeps the UI language consistent with the browser session.

## 27. Unified Notification Architecture
Notifications are represented in the frontend as:
- a global dashboard inbox
- a notifications module for create and inbox workflows
- module surfaces inside Preschool operations and workflows

The frontend does not own notification persistence; it consumes the backend notification tables and APIs.

## 28. Form and Validation Architecture
The application uses a mix of:
- native form validation
- component-level validation logic
- module-specific composables and constants
- backend validation feedback surfaced through normalized HTTP errors

Most complex forms live in Preschool and Sport modules, where validation is encoded close to the page or form component.

## 29. File and Image Handling
File-related dependencies are used for real UI features:
- `html-to-image` for rendering dashboard or report snapshots
- `jspdf` for PDF export flows
- `qrcode` for QR and ID-card surfaces

The frontend also supports avatar uploads in admin flows through multipart form submission.

## 30. Error and Loading-State Architecture
The HTTP layer normalizes errors, and feature pages keep their own loading flags. This avoids duplicated error parsing across modules and keeps the presentation layer focused on UI state instead of transport state.

## 31. Frontend Security Controls
Implemented controls include:
- HTTPS enforcement outside local development
- safe API URL parsing
- same-origin or trusted-origin token attachment
- session expiry handling
- route access checks by domain and scope
- storage clearing on `401`

This is defense-in-depth for the browser tier, not a substitute for backend authorization.

## 32. Testing Architecture
Vitest is configured with:
- `jsdom` environment
- shared setup file that stubs `matchMedia` and clears browser storage between tests
- coverage collection for services, composables, constants, and sidebar config

This supports unit testing of auth, access control, and shared UI logic.

## 33. Code Quality Tools
The frontend uses:
- ESLint 10
- `eslint-plugin-vue`
- `eslint-plugin-oxlint`
- `oxlint`
- Prettier

The CI workflow runs lint and build on push and pull request events.

## 34. Build Architecture
Vite is configured with:
- Vue and Tailwind plugins
- manual chunking for large vendor groups
- security headers in dev and preview
- `/api` proxying to the Laravel backend
- image-origin proxying for canvas export support

The build currently succeeds, with a chunk-size warning only.

## 35. Production Dependencies
The production dependency set is intentionally focused on runtime UI and API behavior:
- Vue, Router, Pinia
- PrimeVue and PrimeIcons
- Tailwind and Vite integration
- Axios
- Vue I18n
- export helpers (`html-to-image`, `jspdf`, `qrcode`)

## 36. Development Dependencies
The development stack includes:
- ESLint and Vue linting
- oxlint
- Vitest and Vue Test Utils
- jsdom
- Prettier
- Vite Vue devtools
- npm-run-all2 for script composition

## 37. Environment Variable Reference

| Variable | Purpose | Used by |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Backend API base URL | `src/services/http.js`, `vite.config.js` |
| `VITE_IMAGE_PUBLIC_ORIGIN` | Trusted image origin for exports | `vite.config.js`, security helpers |
| `VITE_IMAGE_PUBLIC_URL` | Public image URL hint | `vite.config.js`, security helpers |

## 38. Frontend Design Patterns
Observed implementation patterns include:
- module-based routing
- route metadata for access control
- data-driven sidebar generation
- route-name compatibility redirects
- feature-local composables
- thin application bootstrap
- consistent API response unwrapping

## 39. Technical Strengths
- Clear domain separation by module
- Explicit route and sidebar access control
- Bilingual frontend support
- Practical session expiry handling
- Shared HTTP normalization that reduces repeated error handling
- Build-time chunking that keeps vendor dependencies organized

## 40. Technical Limitations and Risks
- Large Sport and Preschool feature areas are heavily page-driven, so the module boundaries are clear but verbose.
- The frontend still contains compatibility role constants for guardian/portal scenarios even though active guardian login is disabled.
- Build output includes a chunk-size warning.

## 41. Thesis-Ready Summary
HFCCF frontend is a Vue 3 SPA that uses module-based routing, role-aware navigation, centralized auth/session handling, and a bilingual UI stack. The design is appropriate for a thesis discussion of modular frontend architecture because the implementation is concrete, layered, and easy to trace from router to page to API service.

## 42. Thesis Extraction Guide

| Thesis Section | Recommended Document Sections | Notes |
| --- | --- | --- |
| System Architecture | 2, 6, 8, 10, 11, 12, 13 | Describes shell, routing, and access model |
| Technology Stack | 4, 5, 33, 34, 35, 36 | Use resolved versions and actual usage |
| Development Environment | 5, 37 | Covers Node, npm, and env vars |
| Security | 11, 21, 22, 31 | Focus on route, token, and origin controls |
| Testing | 32, 33 | Vitest and lint automation |
| Database | 19, 27 | Frontend consumes backend schema through APIs |
| Deployment | 5, 34, 37 | Vite build and environment variables |

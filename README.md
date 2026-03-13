# HFCCF Frontend

Frontend dashboard application for HFCCF, built with Vue 3 and Vite.

## Stack

- Vue 3
- Vite
- Vue Router
- Pinia
- Vue I18n
- Tailwind CSS 4
- Axios

## Requirements

- Node.js: `^20.19.0 || >=22.12.0`
- npm

## Setup

```sh
npm ci
```

## Run Locally

```sh
npm run dev
```

The app uses mock authentication data from [src/mocks/users.json](/D:/Thesis2026/frontend/hfccf-frontend/src/mocks/users.json).

## Routing

- Routes now live in `src/router/routes/*`, grouped by namespace (`baseRoutes`, `moduleRoutes`, `teacherRoutes`, `userRoutes`) so you can scope changes to a folder.
- Paths include their module folder (`/module/super-admin/dashboard`, `/module/english-admin/users`, `/module/sport-admin/coach`, etc.) to keep URLs aligned with their source areas.
- `src/router/index.js` still stitches the arrays together and enforces the auth/role guard plus session touching before any view renders.

## Mock Roles

Current mock roles include:

- `superadmin`
- `adminenglish`
- `adminpreschool`
- `adminscholaship`
- `adminsport`
- `teacher-english`
- `teacher-preschool`
- `teacher-scholarship`
- `coach`

Note: some route guards and dashboard resolution logic still use older role assumptions for teachers, so if you add or rename roles you may also need to update:

- [src/router/index.js](/D:/Thesis2026/frontend/hfccf-frontend/src/router/index.js)
- [src/pages/module/MainDashboard.vue](/D:/Thesis2026/frontend/hfccf-frontend/src/pages/module/MainDashboard.vue)
- [src/components/ui/SidebarBrandHeader.vue](/D:/Thesis2026/frontend/hfccf-frontend/src/components/ui/SidebarBrandHeader.vue)

## Security Notes

The frontend currently includes:

- client-side session expiry handling
- HTTPS enforcement outside local development
- hardened Axios defaults for authenticated requests
- CSP and browser security headers via Vite config

This is still frontend-side protection. Real production auth should be enforced by the backend.

## Available Scripts

```sh
# start dev server
npm run dev

# build production bundle
npm run build

# preview production build locally
npm run preview

# run all linters with auto-fix
npm run lint

# run only oxlint with auto-fix
npm run lint:oxlint

# run only eslint with auto-fix and cache
npm run lint:eslint

# format source files with prettier
npm run format
```

## Project Areas

- `src/pages/auth`: login flow
- `src/pages/module`: dashboards and role-specific pages
- `src/components/layout`: navbar, sidebar, layout primitives
- `src/components/ui`: shared UI components
- `src/services`: auth and HTTP services
- `src/i18n`: English and Khmer translations
- `src/mocks`: mock user data
- `src/components/icons`: new theme icons (`Users`, `Class`, `Ball`, `Team`, `Players`, `Attendance`, `Reports`, `Inventory`, `Performance`, `Training`, `Tournaments`, `Matches`) that power the refreshed navigation and module tiles

## CI

GitHub Actions workflow: [`.github/workflows/main.yml`](.github/workflows/main.yml)

The CI pipeline runs on push to `main` and on pull requests:

1. Install dependencies with `npm ci`
2. Run `npm run lint`
3. Fail if lint auto-fixes changed tracked files (`git diff --exit-code`)
4. Run `npm run build`

## References

- [Vue 3](https://vuejs.org/)
- [Vite](https://vite.dev/)
- [Vue Router](https://router.vuejs.org/)

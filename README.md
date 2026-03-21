# HFCCF Frontend

Frontend dashboard application for HFCCF, built with Vue 3 and Vite.

## Stack

- Vue 3
- Vite
- Vue Router
- Pinia
- Vue I18n
- PrimeVue 4
- PrimeIcons
- Tailwind CSS 4
- Axios

## Requirements

- Node.js: `^20.19.0 || >=22.12.0`
- npm

## Setup

```sh
npm ci
```

If `npm ci` fails because of the current peer dependency mismatch between `vite@8` and `@tailwindcss/vite@4.2.1`, use:

```sh
npm install --legacy-peer-deps
```

## Run Locally

```sh
npm run dev
```

The app uses mock authentication data from [src/mocks/users.json](/D:/Thesis2026/frontend/hfccf-frontend/src/mocks/users.json).

## PrimeVue

PrimeVue is installed and configured globally in [src/main.js](/D:/Thesis2026/frontend/hfccf-frontend/src/main.js) with:

- `primevue`
- `@primeuix/themes`
- `primeicons`
- `Aura` theme preset

Example usage:

```vue
<script setup>
import Button from 'primevue/button'
</script>

<template>
  <Button label="Save" icon="pi pi-check" />
</template>
```

## Routing

- Root router setup lives in [src/router/index.js](/D:/Thesis2026/frontend/hfccf-frontend/src/router/index.js).
- Feature routes are defined inside modules such as [src/modules/auth/routes.js](/D:/Thesis2026/frontend/hfccf-frontend/src/modules/auth/routes.js), [src/modules/students/routes.js](/D:/Thesis2026/frontend/hfccf-frontend/src/modules/students/routes.js), and [src/modules/users/routes.js](/D:/Thesis2026/frontend/hfccf-frontend/src/modules/users/routes.js).
- Layout wrappers live in [src/layouts](/D:/Thesis2026/frontend/hfccf-frontend/src/layouts).

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

If you add or rename roles, review route guards, navigation, and dashboard selection logic in the router and user module.

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

## Project Structure

- `src/assets`: global styles, icons, images
- `src/components`: shared reusable UI components
- `src/composables`: shared composables
- `src/i18n`: English and Khmer translations
- `src/layouts`: app layouts
- `src/mocks`: mock data
- `src/modules`: feature modules such as `auth`, `students`, `training`, `users`, `settings`, `classes`, and `reports`
- `src/router`: root router setup
- `src/services`: shared API and auth utilities
- `src/store`: global state

Recommended module shape:

```text
src/modules/<feature>/
|- components/
|- pages/
|- services/
|- routes.js
\- index.js
```

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
- [PrimeVue](https://primevue.org/)

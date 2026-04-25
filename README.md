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

Recommended Node version:

```sh
node -v
# v22.12.0 or newer is recommended
```

On Windows, use `nvm-windows` if you need to update or switch Node versions:

```sh
nvm install 22.12.0
nvm use 22.12.0
node -v
npm -v
```

## Setup

After cloning or pulling the project, install dependencies from `package-lock.json`:

```sh
npm ci
```

If `npm ci` fails because of the current peer dependency mismatch between `vite@8` and `@tailwindcss/vite@4.2.1`, use:

```sh
npm install --legacy-peer-deps
```

Do not commit or push `node_modules`. Each team member installs dependencies locally.

## Team Pull Checklist

When a team member pulls the latest project:

```sh
git pull
node -v
npm ci
npm run dev
```

If dependencies changed and the app behaves unexpectedly, reinstall cleanly:

```sh
Remove-Item -Recurse -Force node_modules
npm ci
```

If `npm ci` fails because of peer dependency resolution, use:

```sh
npm install --legacy-peer-deps
```

Before pushing work, run:

```sh
npm run lint
npm run build
```

## Environment

The app can run with mock data without a backend API.

The frontend now uses the Laravel products API through `VITE_API_BASE_URL`.

Development defaults are committed in [.env.development](/D:/Thesis2026/frontend/hfccf-frontend/.env.development):

```env
VITE_API_BASE_URL=http://hfccf-backend.test/api
```

If you need a different backend host locally, create a local `.env` file:

```env
VITE_API_BASE_URL=http://hfccf-backend.test/api
```

For production, `VITE_API_BASE_URL` must use HTTPS.

## Run Locally

```sh
npm run dev
```

The app uses mock authentication data from [src/mocks/users.json](/D:/Thesis2026/frontend/hfccf-frontend/src/mocks/users.json).

The products module is available after login at `/module/products`.

If the browser reports CORS errors while calling `http://hfccf-backend.test/api/products`, update the Laravel backend to allow the Vite origin. Typical Laravel changes:

```php
// config/cors.php
'paths' => ['api/*', 'sanctum/csrf-cookie'],

'allowed_methods' => ['*'],

'allowed_origins' => ['http://localhost:5173', 'http://127.0.0.1:5173'],

'allowed_headers' => ['*'],
```

```env
# backend .env
APP_URL=http://hfccf-backend.test
```

If `hfccf-backend.test` does not resolve on this machine, fix the local hostname or use a reachable backend URL in `VITE_API_BASE_URL`.

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
- Feature routes are defined inside modules such as [src/modules/auth/routes.js](/D:/Thesis2026/frontend/hfccf-frontend/src/modules/auth/routes.js), `src/modules/dashboard/routes.js`, `src/modules/super-admin/routes.js`, `src/modules/english/routes.js`, `src/modules/preschool/routes.js`, `src/modules/scholarship/routes.js`, and `src/modules/sport/routes.js`.
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
- `src/modules`: feature modules such as `auth`, `dashboard`, `super-admin`, `english`, `preschool`, `scholarship`, and `sport`
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

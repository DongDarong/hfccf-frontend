# hfccf-frontend/

Frontend application built with Vue 3 and Vite.

## Requirements

- Node.js: `^20.19.0 || >=22.12.0`
- npm

## Setup

```sh
npm ci
```

## Available scripts

```sh
# start dev server
npm run dev

# build production bundle
npm run build

# run all linters with auto-fix
npm run lint

# run only oxlint with auto-fix
npm run lint:oxlint

# run only eslint with auto-fix and cache
npm run lint:eslint

# preview production build locally
npm run preview

# format source files with prettier
npm run format
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

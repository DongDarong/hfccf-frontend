import { afterEach } from 'vitest'

// jsdom persists localStorage/sessionStorage between tests in the same file.
// Clear both after every test to prevent cross-test state contamination.
afterEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

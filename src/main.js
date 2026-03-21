import './assets/css/main.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import App from './App.vue'
import i18n from './i18n'
import router from './router'
import { startAutoLogoutWatcher } from './services/auth'

function enforceSecureOrigin() {
  if (typeof window === 'undefined') return
  if (import.meta.env.DEV) return
  if (window.location.protocol === 'https:') return

  const hostname = window.location.hostname
  const isLocal =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname.endsWith('.local')

  if (isLocal) return

  const secureUrl = `https://${window.location.host}${window.location.pathname}${window.location.search}${window.location.hash}`
  window.location.replace(secureUrl)
}

enforceSecureOrigin()

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(i18n)
app.use(router)

app.mount('#app')

const stopAutoLogoutWatcher = startAutoLogoutWatcher({
  onExpire: () => {
    if (router.currentRoute.value.name !== 'login') {
      router.push({ name: 'login' })
    }
  },
})

window.addEventListener(
  'beforeunload',
  () => {
    stopAutoLogoutWatcher()
  },
  { once: true },
)



import { createI18n } from 'vue-i18n'

import enDashboard from './en/dashboard'
import khDashboard from './kh/dashboard'
import enAuth from './en/auth'
import khAuth from './kh/auth'

const savedLocale = localStorage.getItem('locale')
const locale = savedLocale === 'kh' ? 'kh' : 'en'

const messages = {
  en: {
    ...enDashboard,
    auth: enAuth,
  },
  kh: {
    ...khDashboard,
    auth: khAuth,
  },
}

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en',
  messages,
})

export default i18n

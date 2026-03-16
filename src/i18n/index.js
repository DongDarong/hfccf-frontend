import { createI18n } from 'vue-i18n'
import enMessages from './en/dashboard'
import khMessages from './kh/dashboard'

const savedLocale = localStorage.getItem('locale')
const locale = savedLocale === 'kh' ? 'kh' : 'en'

const messages = {
  en: enMessages,
  kh: khMessages,
}

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en',
  messages,
})

export default i18n



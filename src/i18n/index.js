import { createI18n } from 'vue-i18n'
import { messages } from './messages'

const savedLocale = localStorage.getItem('locale')
const locale = savedLocale || 'en'

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en',
  messages,
})

export default i18n

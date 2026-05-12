import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useNavbarLocale() {
  const { t, locale } = useI18n()

  const currentLocale = computed({
    get: () => locale.value,
    set: (value) => {
      const next = value === 'kh' ? 'kh' : 'en'

      locale.value = next
      localStorage.setItem('locale', next)
    },
  })

  const isKh = computed(() => locale.value === 'kh')

  const calendarLabel = computed(() => {
    return isKh.value ? 'កាលវិភាគ' : 'Calendar'
  })

  const localeOptions = [
    {
      label: 'EN',
      value: 'en',
    },
    {
      label: 'KH',
      value: 'kh',
    },
  ]

  return {
    t,
    currentLocale,
    isKh,
    calendarLabel,
    localeOptions,
  }
}

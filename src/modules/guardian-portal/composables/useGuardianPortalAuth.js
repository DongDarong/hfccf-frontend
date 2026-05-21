import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { applyAuthenticatedSession } from '@/services/auth'
import {
  activateGuardianPortalInvitation,
  fetchGuardianPortalMe,
} from '@/modules/guardian-portal/services/api/guardianPortalApi'

/**
 * Guardian invitation activation is intentionally isolated from the normal
 * staff login flow so portal access can be revoked without touching users.
 */
export function useGuardianPortalAuth() {
  const router = useRouter()
  const { t } = useI18n()

  const form = reactive({
    token: '',
    password: '',
    passwordConfirmation: '',
  })

  const loading = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')
  const profile = ref(null)

  const isFormValid = computed(() => {
    const token = String(form.token || '').trim()
    return Boolean(token) && String(form.password || '').length >= 8 && form.password === form.passwordConfirmation
  })

  async function activateInvitation() {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
      const payload = await activateGuardianPortalInvitation({
        token: String(form.token || '').trim(),
        password: form.password,
        password_confirmation: form.passwordConfirmation,
      })

      applyAuthenticatedSession({
        token: payload.token,
        user: payload.user,
        remember: false,
      })

      successMessage.value = t('guardianPortal.activation.success')
      await router.push({ name: 'guardian-portal-dashboard' })
    } catch (error) {
      errorMessage.value = error?.message || t('guardianPortal.activation.errors.unableToActivate')
    } finally {
      loading.value = false
    }
  }

  async function loadProfile() {
    loading.value = true
    errorMessage.value = ''

    try {
      profile.value = await fetchGuardianPortalMe()
      return profile.value
    } catch (error) {
      errorMessage.value = error?.message || t('guardianPortal.common.unableToLoad')
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    t,
    form,
    loading,
    errorMessage,
    successMessage,
    profile,
    isFormValid,
    activateInvitation,
    loadProfile,
  }
}

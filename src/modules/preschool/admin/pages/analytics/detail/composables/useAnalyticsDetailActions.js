import { useRouter } from 'vue-router'

export function useAnalyticsDetailActions(backRouteName = 'dashboard-preschool-admin-analytics') {
  const router = useRouter()

  function goBack() {
    return router.push({ name: backRouteName })
  }

  return {
    goBack,
  }
}

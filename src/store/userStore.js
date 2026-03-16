import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getCurrentUser, isAuthenticated, logout } from '@/services/auth'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(getCurrentUser())

  const authenticated = computed(() => isAuthenticated())

  function refresh() {
    currentUser.value = getCurrentUser()
  }

  function clear() {
    logout()
    currentUser.value = null
  }

  return {
    authenticated,
    currentUser,
    clear,
    refresh,
  }
})



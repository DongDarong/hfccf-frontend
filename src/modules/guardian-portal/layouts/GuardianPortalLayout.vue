<script setup>
import Button from 'primevue/button'
import { useRouter } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'
import { useUserStore } from '@/store/userStore'

const authStore = useUserStore()
const router = useRouter()
const { language, setLanguage, t } = useLanguage()

async function logout() {
  await authStore.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.08),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef6fb_100%)]">
    <header class="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div class="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div class="min-w-0">
          <p class="text-xs font-black uppercase tracking-[0.24em] text-sky-700">
            {{ t('guardianPortal.layout.portalLabel') }}
          </p>
          <h1 class="truncate text-lg font-black text-slate-950">
            {{ t('guardianPortal.layout.title') }}
          </h1>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-black uppercase text-slate-600 transition hover:border-sky-300 hover:text-sky-800"
            @click="setLanguage(language === 'EN' ? 'KH' : 'EN')"
          >
            {{ language }}
          </button>
          <Button :label="t('guardianPortal.layout.logout')" severity="secondary" outlined @click="logout" />
        </div>
      </div>
    </header>

    <main class="mx-auto w-full max-w-7xl px-4 py-5">
      <slot />
    </main>
  </div>
</template>

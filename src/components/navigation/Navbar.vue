<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Select from 'primevue/select'
import Button from 'primevue/button'

import Calendar from '@/assets/icons/Calendar.vue'
import Notification from '@/assets/icons/Notification.vue'

import { useNavbarLocale } from '@/components/navigation/composables/useNavbarLocale'
import { localePt, menuButtonPt } from '@/components/navigation/config/navbar.config'

defineOptions({
  name: 'MainNavbar',
})

const router = useRouter()

const {
  t,
  currentLocale,
  isKh,
  calendarLabel,
  localeOptions,
} = useNavbarLocale()

/**
 * Keep the notification badge stable until a shared notifications source exists.
 * This matches the current dashboard notification seed and prevents render warnings.
 */
const unreadNotificationsCount = computed(() => 3)

function goToRoute(name) {
  router.push({ name })
}
</script>

<template>
  <nav
    class="flex h-full w-full items-center justify-between gap-4 rounded-none border-0 bg-transparent px-0 py-0 shadow-none [app-region:no-drag] [-webkit-app-region:no-drag] max-[768px]:gap-3 max-[480px]:gap-2 max-[360px]:gap-1.5"
  >
    <div class="flex min-w-0 flex-1 items-center gap-3 max-[480px]:gap-2 max-[360px]:gap-1.5">
      <RouterLink
        :to="{ name: 'dashboard' }"
        class="flex min-w-0 flex-1 items-center gap-3 rounded-xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand-200 max-[600px]:gap-2 max-[430px]:flex-none"
        aria-label="HFCCF dashboard"
      >
        <img
          src="@/assets/images/logo.jpg"
          alt="HFCCF logo"
          class="h-14 w-14 shrink-0 object-contain brightness-[1.05] contrast-[1.02] max-[768px]:h-12 max-[768px]:w-12 max-[600px]:h-11 max-[600px]:w-11 max-[480px]:h-10 max-[480px]:w-10 max-[360px]:h-9 max-[360px]:w-9"
        />

        <div
          class="flex min-w-0 max-w-[30rem] flex-col justify-center max-[900px]:max-w-[42vw] max-[600px]:max-w-[38vw] max-[430px]:hidden"
          :class="{ 'translate-y-px': !isKh }"
        >
          <span
            class="truncate text-[1.02rem] leading-[1.1] font-black text-surface-900 max-[768px]:text-[0.96rem] max-[600px]:text-[0.88rem] max-[480px]:text-[0.8rem]"
            :class="{
              'font-[Noto_Sans_Khmer,_Khmer_OS_Siemreap,_Khmer_OS_Battambang,_Leelawadee_UI,_sans-serif] text-[0.92rem] leading-[1.18] font-bold text-[#0b3f58] tracking-normal max-[768px]:text-[0.86rem] max-[600px]:text-[0.78rem]':
                isKh,
            }"
          >
            {{ t('nav.brand.orgTop') }}
          </span>

          <span
            class="truncate text-[0.78rem] leading-[1.1] text-surface-500 max-[768px]:text-[0.72rem] max-[600px]:hidden"
            :class="{
              'font-[Noto_Sans_Khmer,_Khmer_OS_Siemreap,_Khmer_OS_Battambang,_Leelawadee_UI,_sans-serif] text-[0.78rem] leading-[1.16] text-[#1d6c8f] max-[768px]:text-[0.7rem]':
                isKh,
            }"
          >
            {{ t('nav.brand.orgBottom') }}
          </span>
        </div>
      </RouterLink>
    </div>

    <div class="flex shrink-0 items-center gap-2 max-[768px]:gap-1.5 max-[480px]:gap-1">
      <Button
        type="button"
        severity="secondary"
        text
        rounded
        class="icon-btn max-[480px]:hidden"
        :pt="menuButtonPt"
        :aria-label="calendarLabel"
        @click="goToRoute('calendar')"
      >
        <template #icon>
          <Calendar :size="18" />
        </template>
      </Button>

      <Button
        type="button"
        severity="secondary"
        text
        rounded
        class="icon-btn icon-btn--notification"
        :pt="menuButtonPt"
        :aria-label="t('common.notifications')"
        @click="goToRoute('notifications')"
      >
        <template #icon>
          <div class="relative flex items-center justify-center">
            <Notification :size="18" />

            <span
              v-if="unreadNotificationsCount > 0"
              class="absolute -top-2 -right-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-white bg-hope-red px-1 text-[0.62rem] leading-none font-bold text-white shadow-[0_6px_12px_-8px_rgba(237,28,36,0.8)] max-[480px]:-top-1.5 max-[480px]:-right-1.5 max-[480px]:h-3.5 max-[480px]:min-w-3.5 max-[480px]:text-[0.55rem]"
            >
              {{ unreadNotificationsCount }}
            </span>
          </div>
        </template>
      </Button>

      <Select
        v-model="currentLocale"
        :options="localeOptions"
        option-label="label"
        option-value="value"
        class="locale-switcher max-[360px]:hidden"
        :pt="localePt"
        aria-label="Language Switcher"
      />
    </div>
  </nav>
</template>

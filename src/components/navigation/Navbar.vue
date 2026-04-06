<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Aavtar from '@/components/navigation/Aavtar.vue'
import Calendar from '@/assets/icons/Calendar.vue'
import Notification from '@/assets/icons/Notification.vue'

defineOptions({
  name: 'MainNavbar',
})

const emit = defineEmits(['toggle-sidebar'])
const { t, locale } = useI18n()

const currentLocale = computed({
  get: () => locale.value,
  set: (value) => {
    // Constrain locale values and persist selection across reloads.
    const next = value === 'kh' ? 'kh' : 'en'
    locale.value = next
    localStorage.setItem('locale', next)
  },
})

const isKh = computed(() => locale.value === 'kh')

const localeOptions = [
  { label: 'EN', value: 'en' },
  { label: 'KH', value: 'kh' },
]
const menuButtonPt = {
  root: {
    class: [
      '!h-[38px]',
      '!w-[38px]',
      '!border',
      '!border-surface-300',
      '!bg-white',
      '!text-surface-700',
      'transition-all',
      'duration-200',
      'hover:enabled:!border-brand-400',
      'hover:enabled:!bg-slate-100',
      'hover:enabled:!text-sky-800',
      'focus-visible:!outline-none',
      'focus-visible:!shadow-focus',
      'max-md:!h-[34px]',
      'max-md:!w-[34px]',
      'max-[420px]:!h-8',
      'max-[420px]:!w-8',
    ],
  },
}
const localePt = {
  root: {
    class: '!rounded-full !border-surface-300 !bg-white',
  },
  label: {
    class: '!px-[0.65rem] !py-[0.3rem] !text-[0.78rem] !font-bold !tracking-[0.03em] !text-surface-900',
  },
}

function onToggleSidebar() {
  emit('toggle-sidebar')
}
</script>

<template>
  <nav class="flex h-full items-center justify-between gap-3 py-[0.15rem] [app-region:no-drag] [-webkit-app-region:no-drag]">
    <div class="flex min-w-0 items-center gap-[0.65rem]">
      <Button
        type="button"
        icon="pi pi-bars"
        severity="secondary"
        text
        rounded
        class="menu-btn !flex lg:!hidden"
        :pt="menuButtonPt"
        aria-label="Open sidebar"
        @click="onToggleSidebar"
      />

      <div class="flex min-w-0 items-center gap-[0.7rem]">
        <img src="@/assets/images/logo.jpg" alt="HFCCF logo" class="h-9 w-[72px] shrink-0 object-contain max-[540px]:h-8 max-[540px]:w-16 max-[420px]:h-7 max-[420px]:w-14" />
        <div class="flex min-w-0 flex-col justify-center" :class="{ 'translate-y-px': !isKh }">
          <span
            class="whitespace-nowrap text-[1.08rem] leading-[1.1] font-extrabold text-surface-900 max-[420px]:hidden"
            :class="{
              'font-[Noto_Sans_Khmer,_Khmer_OS_Siemreap,_Khmer_OS_Battambang,_Leelawadee_UI,_sans-serif] whitespace-normal text-[0.95rem] leading-[1.25] font-bold text-[#0b3f58] tracking-normal max-[420px]:block max-[420px]:text-[0.82rem]': isKh,
            }"
          >{{ t('nav.brand.orgTop') }}</span>
          <span
            class="whitespace-nowrap text-[0.82rem] leading-[1.1] text-surface-600 max-[540px]:hidden"
            :class="{
              'font-[Noto_Sans_Khmer,_Khmer_OS_Siemreap,_Khmer_OS_Battambang,_Leelawadee_UI,_sans-serif] whitespace-normal text-[0.82rem] leading-[1.2] text-[#1d6c8f] max-[540px]:block max-[540px]:text-[0.74rem] max-[420px]:hidden': isKh,
            }"
          >{{ t('nav.brand.orgBottom') }}</span>
        </div>
      </div>
    </div>

    <div class="flex shrink-0 items-center gap-3 max-md:gap-[0.45rem] max-[540px]:gap-[0.35rem]">
      <Button
        type="button"
        severity="secondary"
        text
        rounded
        class="icon-btn"
        :pt="menuButtonPt"
        aria-label="Calendar"
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
      >
        <template #icon>
          <div class="relative flex items-center justify-center">
            <Notification :size="18" />
            <span class="absolute -top-2 -right-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-white bg-hope-red px-1 text-[0.62rem] leading-none font-bold text-white">4</span>
          </div>
        </template>
      </Button>

      <Select
        v-model="currentLocale"
        :options="localeOptions"
        option-label="label"
        option-value="value"
        class="locale-switcher"
        :pt="localePt"
        aria-label="Language Switcher"
      />

      <Aavtar name="HFCCF User" size="sm" status="online" />
    </div>
  </nav>
</template>






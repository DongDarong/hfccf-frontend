<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Calendar from '@/assets/icons/Calendar.vue'
import Notification from '@/assets/icons/Notification.vue'

defineOptions({
  name: 'MainNavbar',
})
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
      '!h-10',
      '!w-10',
      '!border-transparent',
      '!bg-transparent',
      '!text-surface-700',
      'transition-all',
      'duration-200',
      'hover:enabled:-translate-y-px',
      'hover:enabled:!bg-slate-100/80',
      'hover:enabled:!text-brand-700',
      'focus-visible:!outline-none',
      'focus-visible:!ring-2',
      'focus-visible:!ring-brand-200',
      'max-md:!h-9',
      'max-md:!w-9',
      'max-[420px]:!h-8',
      'max-[420px]:!w-8',
    ],
  },
}
const localePt = {
  root: {
    class: [
      '!rounded-full',
      '!border-transparent',
      '!bg-transparent',
      'transition-all',
      'duration-200',
      'hover:!bg-slate-100/80',
      'focus-within:!ring-2',
      'focus-within:!ring-brand-200',
    ],
  },
  label: {
    class: '!px-3 !py-1.5 !text-[0.76rem] !font-extrabold !tracking-[0.08em] !text-surface-900',
  },
  dropdown: {
    class: '!w-8 !text-surface-500',
  },
}
</script>

<template>
  <nav
    class="flex h-full w-full items-center justify-between gap-4 rounded-none border-0 bg-transparent px-0 py-0 shadow-none [app-region:no-drag] [-webkit-app-region:no-drag] max-md:gap-3 max-[540px]:gap-2"
  >
    <div class="flex min-w-0 items-center gap-[0.65rem]">
      <div class="flex min-w-0 items-center gap-3 max-[540px]:gap-2">
        <img
          src="@/assets/images/logo.jpg"
          alt="HFCCF logo"
          class="h-16 w-16 shrink-0 scale-115 object-contain brightness-[1.05] contrast-[1.02] max-[640px]:h-14 max-[640px]:w-14 max-[540px]:h-12 max-[540px]:w-12 max-[420px]:h-10 max-[420px]:w-10"
        />
        <div
          class="flex min-w-0 flex-col justify-center max-[540px]:gap-0.5"
          :class="{ 'translate-y-px': !isKh }"
        >
          <span
            class="whitespace-nowrap text-[1.02rem] leading-[1.1] font-black text-surface-900 max-[540px]:text-[0.92rem] max-[420px]:hidden"
            :class="{
              'font-[Noto_Sans_Khmer,_Khmer_OS_Siemreap,_Khmer_OS_Battambang,_Leelawadee_UI,_sans-serif] whitespace-normal text-[0.92rem] leading-[1.22] font-bold text-[#0b3f58] tracking-normal max-[540px]:text-[0.84rem] max-[420px]:block max-[420px]:text-[0.78rem]':
                isKh,
            }"
            >{{ t('nav.brand.orgTop') }}</span
          >
          <span
            class="whitespace-nowrap text-[0.78rem] leading-[1.1] text-surface-500 max-[640px]:text-[0.72rem] max-[540px]:hidden"
            :class="{
              'font-[Noto_Sans_Khmer,_Khmer_OS_Siemreap,_Khmer_OS_Battambang,_Leelawadee_UI,_sans-serif] whitespace-normal text-[0.78rem] leading-[1.18] text-[#1d6c8f] max-[540px]:block max-[540px]:text-[0.72rem] max-[420px]:hidden':
                isKh,
            }"
            >{{ t('nav.brand.orgBottom') }}</span
          >
        </div>
      </div>
    </div>

    <div class="flex shrink-0 items-center gap-2 max-md:gap-1.5 max-[540px]:gap-1">
      <Button
        type="button"
        severity="secondary"
        text
        rounded
        class="icon-btn max-[540px]:hidden"
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
            <span
              class="absolute -top-2 -right-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-white bg-hope-red px-1 text-[0.62rem] leading-none font-bold text-white shadow-[0_6px_12px_-8px_rgba(237,28,36,0.8)]"
              >4</span
            >
          </div>
        </template>
      </Button>

      <Select
        v-model="currentLocale"
        :options="localeOptions"
        option-label="label"
        option-value="value"
        class="locale-switcher max-[420px]:hidden"
        :pt="localePt"
        aria-label="Language Switcher"
      />
    </div>
  </nav>
</template>

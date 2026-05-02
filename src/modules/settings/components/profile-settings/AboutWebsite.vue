<script setup>
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

const { language } = useLanguage()
const isKh = computed(() => language.value === 'KH')

// Keep all display copy together because this component is informational and has no form state.
const content = computed(() => ({
  title: isKh.value ? 'អំពីគេហទំព័រ' : 'About Website',
  description: isKh.value
    ? 'ទិដ្ឋភាពសង្ខេបអំពីវេទិកា ស្ថានភាពប្រព័ន្ធ និងព័ត៌មានជំនួយសម្រាប់អ្នកប្រើប្រាស់។'
    : 'A quick summary of the platform, current system status, and help information for users.',
  items: [
    {
      label: isKh.value ? 'វេទិកា' : 'Platform',
      value: 'HFCCF Frontend',
    },
    {
      label: isKh.value ? 'កំណែ' : 'Version',
      value: 'v1.0.0',
    },
    {
      label: isKh.value ? 'ស្ថានភាព' : 'Status',
      value: isKh.value ? 'កំពុងដំណើរការ' : 'Operational',
    },
  ],
  noteTitle: isKh.value ? 'ព័ត៌មានជំនួយ' : 'Support Note',
  note: isKh.value
    ? 'ប្រសិនបើមានបញ្ហាក្នុងការចូលប្រើ ឬការផ្លាស់ប្តូរការកំណត់ សូមទាក់ទងអ្នកគ្រប់គ្រងប្រព័ន្ធ។'
    : 'If you have trouble accessing features or changing settings, contact your system administrator.',
}))
</script>

<template>
  <section
    class="about-website-card overflow-hidden rounded-[1.1rem] border border-surface-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.92)_100%)] shadow-[0_12px_30px_-20px_rgba(15,23,42,0.55),inset_0_1px_0_rgba(255,255,255,0.9)]"
  >
    <header
      class="border-b border-surface-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-4 pt-4 pb-[0.85rem] sm:px-[1.15rem] sm:pt-[1.05rem] sm:pb-[0.9rem]"
    >
      <h3 class="m-0 text-base leading-tight font-extrabold text-surface-900">
        {{ content.title }}
      </h3>
      <p class="mt-[0.32rem] text-[0.86rem] leading-[1.5] text-surface-600">
        {{ content.description }}
      </p>
    </header>

    <div class="grid gap-4 p-4 sm:px-[1.15rem] sm:py-[1.1rem]">
      <!-- Use a compact stat list so the website details are easy to scan beside editable settings forms. -->
      <div class="grid gap-3">
        <div
          v-for="item in content.items"
          :key="item.label"
          class="flex items-center justify-between rounded-xl border border-surface-200 bg-white px-4 py-3"
        >
          <span class="text-sm font-semibold text-surface-700">{{ item.label }}</span>
          <span class="text-sm font-bold text-surface-900">{{ item.value }}</span>
        </div>
      </div>

      <div class="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3">
        <p class="text-sm font-bold text-sky-900">{{ content.noteTitle }}</p>
        <p class="mt-1 text-sm leading-6 text-sky-800">{{ content.note }}</p>
      </div>
    </div>
  </section>
</template>

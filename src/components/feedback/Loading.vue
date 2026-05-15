<script setup>
import { computed } from 'vue'
import ProgressSpinner from 'primevue/progressspinner'
import { useLanguage } from '@/composables/useLanguage'

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  tone: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'neutral'].includes(value),
  },
})

const { t } = useLanguage()
const resolvedLabel = computed(() => props.label || t('common.loading'))
const spinnerSize = computed(() => {
  if (props.size === 'sm') return '1.1rem'
  if (props.size === 'lg') return '1.6rem'
  return '1.3rem'
})
const toneClass = computed(() =>
  props.tone === 'neutral' ? 'text-hope-dark' : 'text-brand-500',
)
const spinnerPt = computed(() => ({
  root: {
    class: '!inline-flex',
  },
  spinner: {
    class: '!stroke-current',
  },
}))
</script>

<template>
  <div
    class="inline-flex w-full items-center justify-center gap-2.5 font-bold uppercase tracking-[0.08em]"
    :class="toneClass"
    role="status"
    aria-live="polite"
  >
    <ProgressSpinner
      class="loading__spinner"
      stroke-width="6"
      fill="transparent"
      animation-duration=".8s"
      :style="{ width: spinnerSize, height: spinnerSize }"
      :pt="spinnerPt"
    />
    <span class="text-[0.74rem] leading-none">{{ resolvedLabel }}</span>
  </div>
</template>

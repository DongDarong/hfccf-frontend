<script setup>
import { computed } from 'vue'
import Tag from 'primevue/tag'
import { useLanguage } from '@/composables/useLanguage'

const props = defineProps({
  status: {
    type: String,
    default: 'neutral',
  },
  label: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md',
  },
  dot: {
    type: Boolean,
    default: true,
  },
})

const { t } = useLanguage()

function toStatusKey(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
}

const normalizedStatus = computed(() => String(props.status || 'neutral').trim().toLowerCase() || 'neutral')
const statusLabel = computed(() => {
  if (props.label.trim()) {
    const key = `common.status.${toStatusKey(props.label)}`
    const translated = t(key)
    return translated !== key ? translated : props.label
  }

  const key = `common.status.${toStatusKey(normalizedStatus.value)}`
  const localized = t(key)
  return localized !== key ? localized : normalizedStatus.value
})

const severity = computed(() => {
  if (['success', 'active'].includes(normalizedStatus.value)) return 'success'
  if (['warning', 'inactive'].includes(normalizedStatus.value)) return 'warn'
  if (['error', 'suspended'].includes(normalizedStatus.value)) return 'danger'
  if (normalizedStatus.value === 'info' || normalizedStatus.value === 'pending') return 'info'
  return 'secondary'
})
</script>

<template>
  <Tag :value="statusLabel" :severity="severity" rounded class="ui-tag" :class="`ui-tag--${size}`">
    <template v-if="dot" #icon>
      <span class="ui-tag__dot" aria-hidden="true"></span>
    </template>
  </Tag>
</template>

<style scoped>
:deep(.ui-tag.p-tag) {
  gap: 0.35rem;
  font-weight: 700;
}

.ui-tag__dot {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 999px;
  background: currentColor;
}
</style>

<script setup>
import { computed } from 'vue'
import { useLanguage } from '../../composables/useLanguage'

const props = defineProps({
  role: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'sm',
    validator: (value) => ['sm', 'md'].includes(value),
  },
})
const { t } = useLanguage()

const normalizedRole = computed(() => String(props.role ?? '').trim().toLowerCase())

function toRoleKey(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
}

const roleLabel = computed(() => {
  if (!normalizedRole.value) return '-'
  const key = `common.role.${toRoleKey(normalizedRole.value)}`
  const translated = t(key)
  if (translated !== key) return translated
  return normalizedRole.value.charAt(0).toUpperCase() + normalizedRole.value.slice(1)
})

const roleClass = computed(() => {
  if (normalizedRole.value === 'admin') return 'bg-cyan-50 text-cyan-700 ring-cyan-200'
  if (normalizedRole.value === 'coach') return 'bg-amber-50 text-amber-700 ring-amber-200'
  if (normalizedRole.value === 'player') return 'bg-rose-50 text-rose-700 ring-rose-200'
  return 'bg-gray-100 text-gray-700 ring-gray-200'
})

const sizeClass = computed(() => {
  if (props.size === 'md') return 'px-3 py-1.5 text-xs'
  return 'px-2.5 py-1 text-[11px] sm:text-xs'
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-full font-semibold ring-1 ring-inset whitespace-nowrap',
      roleClass,
      sizeClass,
    ]"
  >
    {{ roleLabel }}
  </span>
</template>

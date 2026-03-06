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
  // Normalize role names into a predictable translation key format.
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
  // Human-readable fallback when no translation exists.
  return normalizedRole.value.charAt(0).toUpperCase() + normalizedRole.value.slice(1)
})

// Centralized mapping keeps role color semantics consistent across the app.
const ROLE_BADGE_STYLES = {
  superadmin: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  coach: 'bg-amber-50 text-amber-700 ring-amber-200',
  teacher: 'bg-lime-50 text-lime-700 ring-lime-200',
  adminpreschool: 'bg-cyan-50 text-cyan-700 ring-cyan-200',
  adminscholaship: 'bg-cyan-50 text-cyan-700 ring-cyan-200',
  adminenglish: 'bg-cyan-50 text-cyan-700 ring-cyan-200',
  adminsport: 'bg-cyan-50 text-cyan-700 ring-cyan-200',
}

const roleClass = computed(() => ROLE_BADGE_STYLES[normalizedRole.value] || 'bg-gray-100 text-gray-700 ring-gray-200')

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

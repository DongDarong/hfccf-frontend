<script setup>
import { computed } from 'vue'
import Tag from 'primevue/tag'
import { useLanguage } from '@/composables/useLanguage'

const props = defineProps({
  role: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'sm',
  },
})

const { t } = useLanguage()

function toRoleKey(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
}

function humanizeRole(value) {
  return String(value ?? '')
    .trim()
    .split(/[\s-]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

const normalizedRole = computed(() => String(props.role || '').trim().toLowerCase())
const roleLabel = computed(() => {
  if (!normalizedRole.value) return '-'
  const key = `common.role.${toRoleKey(normalizedRole.value)}`
  const translated = t(key)
  return translated !== key ? translated : humanizeRole(normalizedRole.value)
})

const severity = computed(() => {
  if (normalizedRole.value === 'superadmin') return 'contrast'
  if (normalizedRole.value.includes('sport') || normalizedRole.value === 'coach') return 'danger'
  if (normalizedRole.value.includes('scholarship')) return 'warn'
  if (normalizedRole.value.includes('english')) return 'info'
  if (normalizedRole.value.includes('preschool') || normalizedRole.value === 'teacher') return 'success'
  return 'secondary'
})
</script>

<template>
  <Tag :value="roleLabel" rounded :severity="severity" class="ui-role-tag" />
</template>

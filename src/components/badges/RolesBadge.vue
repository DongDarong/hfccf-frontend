<script setup>
import { computed } from 'vue'
import Tag from 'primevue/tag'
import { useLanguage } from '@/composables/useLanguage'
import { ROLES, isTeacherRole } from '@/constants/roles'

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

const sizeClass = computed(() => {
  if (props.size === 'xs') return '!px-2 !py-0.5 !text-[0.62rem]'
  if (props.size === 'md') return '!px-3 !py-1.5 !text-[0.75rem]'
  if (props.size === 'lg') return '!px-3.5 !py-1.5 !text-[0.8rem]'
  return '!px-2.5 !py-1 !text-[0.7rem]'
})

const toneClass = computed(() => {
  if (normalizedRole.value === ROLES.SUPER_ADMIN) {
    return [
      '!border-indigo-200',
      '!bg-indigo-50',
      '!text-indigo-800',
      'shadow-[0_8px_18px_-14px_rgba(79,70,229,0.38)]',
    ]
  }

  if (normalizedRole.value.includes('sport') || normalizedRole.value === ROLES.COACH) {
    return [
      '!border-rose-200',
      '!bg-rose-50',
      '!text-rose-800',
      'shadow-[0_8px_18px_-14px_rgba(225,29,72,0.28)]',
    ]
  }

  if (
    normalizedRole.value.includes('scholarship') ||
    normalizedRole.value === ROLES.ADMIN_SCHOLARSHIP
  ) {
    return [
      '!border-amber-200',
      '!bg-amber-50',
      '!text-amber-800',
      'shadow-[0_8px_18px_-14px_rgba(245,158,11,0.28)]',
    ]
  }

  if (normalizedRole.value.includes('english')) {
    return [
      '!border-brand-200',
      '!bg-brand-50',
      '!text-brand-800',
      'shadow-[0_8px_18px_-14px_rgba(0,174,239,0.28)]',
    ]
  }

  if (normalizedRole.value.includes('preschool') || isTeacherRole(normalizedRole.value)) {
    return [
      '!border-lime-200',
      '!bg-lime-50',
      '!text-lime-800',
      'shadow-[0_8px_18px_-14px_rgba(101,163,13,0.28)]',
    ]
  }

  return [
    '!border-surface-200',
    '!bg-surface-50',
    '!text-surface-700',
    'shadow-[0_8px_18px_-16px_rgba(15,23,42,0.16)]',
  ]
})

const rolePt = computed(() => ({
  root: {
    class: [
      '!inline-flex',
      '!items-center',
      '!rounded-full',
      '!border',
      '!font-semibold',
      '!tracking-[0.03em]',
      '!leading-none',
      ...toneClass.value,
      sizeClass.value,
    ],
  },
  label: {
    class: '!leading-none',
  },
}))
</script>

<template>
  <Tag :value="roleLabel" rounded class="ui-role-tag" :pt="rolePt" />
</template>

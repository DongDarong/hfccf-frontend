<script setup>
import { computed } from 'vue'
import { useLanguage } from '../../composables/useLanguage'

const props = defineProps({
  permission: {
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

function toPermissionKey(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
}

const permissionLabel = computed(() => {
  const value = String(props.permission ?? '').trim()
  if (!value) return '-'
  const key = `common.permission.${toPermissionKey(value)}`
  const translated = t(key)
  return translated !== key ? translated : value
})

const sizeClass = computed(() => {
  if (props.size === 'md') return 'px-3 py-1.5 text-xs'
  return 'px-2.5 py-1 text-[11px] sm:text-xs'
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-full bg-gray-100 font-medium text-gray-700 ring-1 ring-inset ring-gray-200 whitespace-nowrap',
      sizeClass,
    ]"
  >
    {{ permissionLabel }}
  </span>
</template>

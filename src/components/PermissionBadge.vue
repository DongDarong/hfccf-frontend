<script setup>
import { computed } from 'vue'
import Tag from 'primevue/tag'
import { useLanguage } from '@/composables/useLanguage'

const props = defineProps({
  permission: {
    type: String,
    default: '',
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
</script>

<template>
  <Tag :value="permissionLabel" rounded severity="secondary" />
</template>

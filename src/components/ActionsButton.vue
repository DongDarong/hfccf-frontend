<script setup>
import { computed, ref } from 'vue'
import Menu from 'primevue/menu'
import PrimeButton from 'primevue/button'
import { useLanguage } from '@/composables/useLanguage'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  viewLabel: String,
  editLabel: String,
  deleteLabel: String,
  disabled: Boolean,
})

const emit = defineEmits(['view', 'edit', 'delete', 'action'])
const { t } = useLanguage()
const menu = ref(null)

const labels = computed(() => ({
  view: props.viewLabel || t('common.view'),
  edit: props.editLabel || t('common.edit'),
  delete: props.deleteLabel || t('common.delete'),
}))

const menuItems = computed(() => [
  {
    label: labels.value.view,
    icon: 'pi pi-eye',
    command: () => onAction('view'),
  },
  {
    label: labels.value.edit,
    icon: 'pi pi-pencil',
    command: () => onAction('edit'),
  },
  {
    label: labels.value.delete,
    icon: 'pi pi-trash',
    command: () => onAction('delete'),
  },
])

function onAction(type) {
  emit(type, props.item)
  emit('action', { type, item: props.item })
}
</script>

<template>
  <div class="inline-flex">
    <PrimeButton
      icon="pi pi-ellipsis-h"
      text
      rounded
      severity="secondary"
      :disabled="disabled"
      aria-haspopup="true"
      aria-controls="row_actions_menu"
      @click="menu.toggle($event)"
    />
    <Menu ref="menu" id="row_actions_menu" :model="menuItems" popup />
  </div>
</template>

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
const menuId = `row-actions-menu-${Math.random().toString(36).slice(2, 10)}`

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

function toggleMenu(event) {
  menu.value?.toggle(event)
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
      :aria-controls="menuId"
      @click="toggleMenu"
    />
    <Menu ref="menu" :id="menuId" :model="menuItems" popup class="actions-button-menu" />
  </div>
</template>

<style>
.actions-button-menu.p-menu {
  min-width: 11rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.95rem;
  background: #ffffff !important;
  box-shadow: 0 14px 30px -22px rgba(15, 23, 42, 0.16);
  overflow: hidden;
}

.actions-button-menu .p-menu-list {
  padding: 0.35rem;
  background: #ffffff;
}

.actions-button-menu .p-menu-item-content {
  border-radius: 0.7rem;
}

.actions-button-menu .p-menu-item-link {
  gap: 0.7rem;
  border-radius: 0.7rem;
  color: #0f172a;
  padding: 0.7rem 0.85rem;
}

.actions-button-menu .p-menu-item:not(.p-disabled) .p-menu-item-content:hover {
  background: #f8fafc;
}

.actions-button-menu .p-menu-item-icon {
  color: #64748b;
}
</style>

<script setup>
import { computed } from 'vue'
import Select from 'primevue/select'
import Button from '@/components/Button.vue'
import { useLanguage } from '@/composables/useLanguage'

const props = defineProps({
  roleFilter: {
    type: String,
    default: '',
  },
  statusFilter: {
    type: String,
    default: '',
  },
  roleOptions: {
    type: Array,
    default: () => [],
  },
  statusOptions: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showRoleFilter: {
    type: Boolean,
    default: true,
  },
  showStatusFilter: {
    type: Boolean,
    default: true,
  },
  showClearButton: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:roleFilter', 'update:statusFilter', 'clear'])
const { t } = useLanguage()

const hasRoleOptions = computed(() => props.showRoleFilter && props.roleOptions.length > 0)
const hasStatusOptions = computed(() => props.showStatusFilter && props.statusOptions.length > 0)
const hasActiveFilters = computed(() => Boolean(props.roleFilter || props.statusFilter))

function normalizeKey(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
}

function roleLabel(role) {
  const key = `common.role.${normalizeKey(role)}`
  const localized = t(key)
  return localized !== key ? localized : role
}

function statusLabel(status) {
  const key = `common.status.${normalizeKey(status)}`
  const localized = t(key)
  return localized !== key ? localized : status
}

const mappedRoleOptions = computed(() => [
  { label: t('common.allRoles'), value: '' },
  ...props.roleOptions.map((role) => ({
    label: roleLabel(role),
    value: role,
  })),
])

const mappedStatusOptions = computed(() => [
  { label: t('common.allStatus'), value: '' },
  ...props.statusOptions.map((status) => ({
    label: statusLabel(status),
    value: status,
  })),
])

function clearFilters() {
  emit('update:roleFilter', '')
  emit('update:statusFilter', '')
  emit('clear')
}
</script>

<template>
  <div class="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
    <Select
      v-if="hasRoleOptions"
      input-id="userRoleFilter"
      :model-value="roleFilter"
      :options="mappedRoleOptions"
      option-label="label"
      option-value="value"
      :disabled="disabled"
      append-to="self"
      class="ui-filter-select w-full sm:w-40"
      @update:model-value="emit('update:roleFilter', $event)"
    />

    <Select
      v-if="hasStatusOptions"
      input-id="userStatusFilter"
      :model-value="statusFilter"
      :options="mappedStatusOptions"
      option-label="label"
      option-value="value"
      :disabled="disabled"
      append-to="self"
      class="ui-filter-select w-full sm:w-44"
      @update:model-value="emit('update:statusFilter', $event)"
    />

    <Button
      v-if="showClearButton"
      type="button"
      variant="outline"
      size="md"
      :disabled="disabled || !hasActiveFilters"
      @click="clearFilters"
    >
      {{ t('common.clear') }}
    </Button>
  </div>
</template>

<style scoped>
:deep(.ui-filter-select.p-select) {
  min-height: 2.9rem;
  border-radius: 0.9rem;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  box-shadow: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

:deep(.ui-filter-select .p-select-label) {
  display: flex;
  align-items: center;
  min-height: 2.9rem;
  background: transparent;
  padding-top: 0.8rem;
  padding-bottom: 0.8rem;
  padding-left: 0.9rem;
  padding-right: 0.9rem;
  font-size: 0.9rem;
  color: #0f172a;
}

:deep(.ui-filter-select .p-select-label.p-placeholder) {
  color: #94a3b8;
}

:deep(.ui-filter-select .p-select-dropdown) {
  width: 2.8rem;
  background: transparent;
  color: #64748b;
}

:deep(.ui-filter-select:not(.p-disabled):hover) {
  border-color: #94a3b8;
  background: #ffffff;
}

:deep(.ui-filter-select.p-focus) {
  border-color: #38bdf8;
  box-shadow: 0 0 0 2px rgba(125, 211, 252, 0.2);
}

:deep(.ui-filter-select .p-select-overlay) {
  margin-top: 0.3rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.9rem;
  background: #ffffff;
  box-shadow: 0 12px 24px -18px rgba(15, 23, 42, 0.16);
}

:deep(.ui-filter-select .p-select-list-container) {
  background: #ffffff;
  padding: 0.35rem;
}

:deep(.ui-filter-select .p-select-option) {
  border-radius: 0.65rem;
  background: #ffffff;
  color: #0f172a;
}

:deep(.ui-filter-select .p-select-option:hover) {
  background: #f8fafc;
}

:deep(.ui-filter-select .p-select-option.p-select-option-selected) {
  background: rgba(56, 189, 248, 0.12);
  color: #0369a1;
}

@media (max-width: 639px) {
  :deep(.ui-filter-select.p-select) {
    min-height: 2.75rem;
  }

  :deep(.ui-filter-select .p-select-label) {
    min-height: 2.75rem;
    font-size: 0.88rem;
  }
}
</style>

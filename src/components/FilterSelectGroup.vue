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
:deep(.ui-filter-select .p-select-label) {
  padding-top: 0.8rem;
  padding-bottom: 0.8rem;
  font-size: 0.9rem;
}

:deep(.ui-filter-select.p-select) {
  border-radius: 0.9rem;
  border-color: #cbd5e1;
}
</style>

<script setup>
import { computed } from 'vue'
import { useLanguage } from '../../composables/useLanguage'

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

function onRoleChange(event) {
  emit('update:roleFilter', event.target.value)
}

function onStatusChange(event) {
  emit('update:statusFilter', event.target.value)
}

function clearFilters() {
  emit('update:roleFilter', '')
  emit('update:statusFilter', '')
  emit('clear')
}
</script>

<template>
  <div class="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
    <select
      v-if="hasRoleOptions"
      id="userRoleFilter"
      class="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[var(--color-base)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-base)_16%,white)] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 sm:w-40"
      :value="roleFilter"
      :disabled="disabled"
      @change="onRoleChange"
    >
      <option value="">{{ t('common.allRoles') }}</option>
      <option v-for="role in roleOptions" :key="role" :value="role">{{ roleLabel(role) }}</option>
    </select>

    <select
      v-if="hasStatusOptions"
      id="userStatusFilter"
      class="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-[var(--color-base)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--color-base)_16%,white)] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 sm:w-44"
      :value="statusFilter"
      :disabled="disabled"
      @change="onStatusChange"
    >
      <option value="">{{ t('common.allStatus') }}</option>
      <option v-for="status in statusOptions" :key="status" :value="status">
        {{ statusLabel(status) }}
      </option>
    </select>

    <button
      v-if="showClearButton"
      type="button"
      class="w-full rounded-xl border px-3.5 py-3 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      :class="
        hasActiveFilters
          ? 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
          : 'border-slate-200 bg-slate-100 text-slate-400'
      "
      :disabled="disabled || !hasActiveFilters"
      @click="clearFilters"
    >
      {{ t('common.clear') }}
    </button>
  </div>
</template>

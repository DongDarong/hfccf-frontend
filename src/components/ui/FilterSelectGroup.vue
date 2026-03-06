<script setup>
import { useLanguage } from '../../composables/useLanguage'

defineProps({
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
})

const emit = defineEmits(['update:roleFilter', 'update:statusFilter', 'clear'])
const { t } = useLanguage()

function normalizeKey(value) {
  // Keep translation lookups stable across source values (e.g. "Super Admin" -> "super_admin").
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
}

function roleLabel(role) {
  const key = `common.role.${normalizeKey(role)}`
  const localized = t(key)
  // Fall back to the raw API/display value if no locale key is defined.
  return localized !== key ? localized : role
}

function statusLabel(status) {
  const key = `common.status.${normalizeKey(status)}`
  const localized = t(key)
  // Fall back to the raw API/display value if no locale key is defined.
  return localized !== key ? localized : status
}

function onRoleChange(event) {
  emit('update:roleFilter', event.target.value)
}

function onStatusChange(event) {
  emit('update:statusFilter', event.target.value)
}

function clearFilters() {
  // Emit both model updates + explicit clear event for parent-side side effects.
  emit('update:roleFilter', '')
  emit('update:statusFilter', '')
  emit('clear')
}
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
    <select
      id="userRoleFilter"
      class="w-full sm:w-32 bg-white border border-gray-300 text-gray-600 text-sm rounded-xl focus:ring-hope-cyan focus:border-hope-cyan block px-3 sm:px-4 py-2.5 outline-none shadow-sm"
      :value="roleFilter"
      :disabled="disabled"
      @change="onRoleChange"
    >
      <option value="">{{ t('common.allRoles') }}</option>
      <option v-for="role in roleOptions" :key="role" :value="role">{{ roleLabel(role) }}</option>
    </select>

    <select
      id="userStatusFilter"
      class="w-full sm:w-36 bg-white border border-gray-300 text-gray-600 text-sm rounded-xl focus:ring-hope-cyan focus:border-hope-cyan block px-3 sm:px-4 py-2.5 outline-none shadow-sm"
      :value="statusFilter"
      :disabled="disabled"
      @change="onStatusChange"
    >
      <option value="">{{ t('common.allStatus') }}</option>
      <option v-for="status in statusOptions" :key="status" :value="status">{{ statusLabel(status) }}</option>
    </select>

    <button
      type="button"
      class="w-full sm:w-auto rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
      :disabled="disabled"
      @click="clearFilters"
    >
      {{ t('common.clear') }}
    </button>
  </div>
</template>

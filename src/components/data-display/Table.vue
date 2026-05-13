<script setup>
/**
 * UsersTable
 * --------------------------------------------------------------------------
 * Shared data table for user-style records.
 *
 * Features:
 * - PrimeVue DataTable wrapper
 * - Loading / empty states
 * - Dynamic columns
 * - User avatar fallback
 * - Role / permission / status badges
 * - Menu or icon-button row actions
 * --------------------------------------------------------------------------
 */

import { computed, ref, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Loading from '@/components/feedback/Loading.vue'
import StatusBadge from '@/components/badges/StatusBadge.vue'
import RolesBadge from '@/components/badges/RolesBadge.vue'
import PermissionBadge from '@/components/badges/PermissionBadge.vue'
import ActionsButton from '@/components/buttons/ActionsButton.vue'
import Button from '@/components/buttons/Button.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getAvatarInitials, resolveAvatarSource } from '@/utils/avatar'

defineOptions({
  name: 'UsersTable',
})

const props = defineProps({
  users: {
    type: Array,
    default: () => [],
  },
  rows: {
    type: Array,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  emptyText: {
    type: String,
    default: '',
  },
  columns: {
    type: Array,
    default: () => [],
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  actionStyle: {
    type: String,
    default: 'menu',
    validator: (value) => ['menu', 'buttons'].includes(value),
  },
  sortField: {
    type: String,
    default: '',
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
  serverSide: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['view', 'edit', 'delete', 'sort'])

const { t } = useLanguage()

/**
 * Track rows with broken avatar URLs.
 */
const avatarStates = ref({})

/**
 * Use rows when provided, otherwise fallback to users.
 */
const resolvedRows = computed(() =>
  Array.isArray(props.rows) ? props.rows : props.users,
)

const resolvedEmptyText = computed(() =>
  props.emptyText || t('users.table.empty') || 'No rows found.',
)

const loadingLabel = computed(() =>
  t('users.loadingUsers') || 'Loading data',
)

const useButtonActions = computed(() =>
  props.actionStyle === 'buttons',
)

/**
 * Keep permission columns compact so rows do not grow excessively tall.
 */
const MAX_VISIBLE_PERMISSIONS = 3

/**
 * PrimeVue table styling.
 */
const tablePt = computed(() => ({
  root: {
    class: '!overflow-hidden !rounded-2xl !border !border-surface-200 !bg-white',
  },
  tableContainer: {
    class: '!bg-white',
  },
  table: {
    class: '!bg-white',
  },
  headerRow: {
    class: '!bg-slate-50',
  },
  headerCell: {
    class:
      '!border-b !border-surface-200 !bg-slate-50 !px-4 !py-3.5 !text-[0.75rem] !font-bold !tracking-[0.06em] !text-surface-600 uppercase md:!px-4',
  },
  bodyRow: ({ context }) => ({
    class: context?.stripedRows
      ? 'odd:!bg-white even:!bg-sky-50/30 hover:!bg-brand-50/60 transition-colors'
      : 'hover:!bg-brand-50/60 transition-colors',
  }),
  bodyCell: {
    class: '!border-b !border-slate-100 !bg-transparent !px-4 !py-3.5 !text-surface-700 md:!px-4',
  },
  loadingOverlay: {
    class: '!bg-white/80 backdrop-blur-[1px]',
  },
  emptyMessage: {
    class: '!bg-white',
  },
}))

/**
 * Default table columns.
 */
const defaultColumns = computed(() => [
  { key: 'number', label: t('common.table.number'), align: 'left' },
  { key: 'user', label: t('common.table.user'), align: 'left' },
  { key: 'email', label: t('common.table.email'), align: 'left' },
  { key: 'role', label: t('common.table.role'), align: 'left' },
  { key: 'permission', label: t('common.table.permission'), align: 'left' },
  { key: 'status', label: t('common.table.status'), align: 'left' },
  { key: 'phone', label: t('common.table.phone'), align: 'left' },
  { key: 'actions', label: t('common.table.actions'), align: 'right' },
])

const resolvedColumns = computed(() =>
  props.columns.length ? props.columns : defaultColumns.value,
)

const resolvedSortField = computed(() => String(props.sortField || '').trim())
const resolvedSortOrder = computed(() => Number(props.sortOrder) || 0)

/**
 * Normalize row status for StatusBadge tone.
 */
function statusType(row) {
  const value = String(row?.status || '').trim().toLowerCase()

  if (value === 'active') return 'success'
  if (value === 'pending') return 'info'
  if (value === 'inactive') return 'warning'
  if (value === 'suspended') return 'error'

  return 'info'
}

/**
 * Resolve permissions from array or comma-separated string.
 */
function permissionList(row) {
  const explicit = Array.isArray(row?.permissions) ? row.permissions : []

  if (explicit.length) {
    return explicit
  }

  return String(row?.permission || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
}

/**
 * Limit the permission badges rendered in the table cell.
 */
function visiblePermissions(row) {
  return permissionList(row).slice(0, MAX_VISIBLE_PERMISSIONS)
}

/**
 * Count how many permissions are hidden behind the compact overflow badge.
 */
function hiddenPermissionCount(row) {
  return Math.max(permissionList(row).length - MAX_VISIBLE_PERMISSIONS, 0)
}

/**
 * Tooltip text for the overflow badge.
 */
function hiddenPermissionLabel(row) {
  return permissionList(row)
    .slice(MAX_VISIBLE_PERMISSIONS)
    .join(', ')
}

/**
 * Format username with @ prefix.
 */
function usernameLabel(username) {
  const value = String(username || '').trim()

  if (!value) return '-'

  return value.startsWith('@') ? value : `@${value}`
}

/**
 * Stable avatar cache key.
 */
function avatarKey(row) {
  return String(row?.id || row?.email || row?.username || row?.name || '')
}

/**
 * Resolve avatar source unless image failed before.
 */
function avatarSrc(row) {
  const key = avatarKey(row)

  if (key && avatarStates.value[key]?.error) {
    return ''
  }

  return resolveAvatarSource(row?.avatar || row?.avatarUrl || row?.profileImage || row?.photo)
}

/**
 * Determine whether the avatar image should be shown for a row.
 */
function shouldShowImage(row) {
  const key = avatarKey(row)
  const state = key ? avatarStates.value[key] || {} : {}

  return Boolean(avatarSrc(row)) && Boolean(state.loaded) && !state.error
}

/**
 * Build initials from display name.
 */
function userInitials(row) {
  return getAvatarInitials(row?.name, '?')
}

/**
 * Generic plain cell value.
 */
function plainValue(row, column) {
  const field = column?.field || column?.key
  const value = row?.[field]
  const normalized = String(value ?? '').trim()

  return normalized || '-'
}

/**
 * Format date/time values for human-readable display.
 */
function formatDateTime(value) {
  const normalized = String(value ?? '').trim()

  if (!normalized) return '-'

  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) {
    return normalized
  }

  return date.toLocaleString()
}

/**
 * Mark avatar image as broken.
 */
function onAvatarError(row) {
  const key = avatarKey(row)

  if (!key) return

  avatarStates.value = {
    ...avatarStates.value,
    [key]: {
      loaded: false,
      error: true,
    },
  }
}

/**
 * Mark avatar image as ready once the browser has loaded it.
 */
function onAvatarLoad(row) {
  const key = avatarKey(row)

  if (!key) return

  avatarStates.value = {
    ...avatarStates.value,
    [key]: {
      loaded: true,
      error: false,
    },
  }
}

/**
 * Clear avatar error cache when table data changes.
 */
watch(
  () => resolvedRows.value,
  () => {
    avatarStates.value = {}
  },
  { deep: true },
)

function onSort(event) {
  if (!props.serverSide) return

  emit('sort', event)
}
</script>

<template>
  <DataTable
    :value="resolvedRows"
    :data-key="rowKey"
    :loading="loading"
    :lazy="serverSide"
    :sort-field="resolvedSortField || undefined"
    :sort-order="resolvedSortOrder"
    striped-rows
    removable-sort
    class="ui-data-table"
    :pt="tablePt"
    @sort="onSort"
  >
    <!-- Empty state -->
    <template #empty>
      <div class="px-4 py-7 text-center text-sm text-surface-500">
        {{ resolvedEmptyText }}
      </div>
    </template>

    <!-- Loading state -->
    <template #loading>
      <div class="px-4 py-8">
        <div class="flex justify-center">
          <Loading
            :label="loadingLabel"
            size="md"
          />
        </div>
      </div>
    </template>

    <Column
      v-for="column in resolvedColumns"
      :key="column.key"
      :field="column.field || column.key"
      :header="column.label"
      :sortable="Boolean(column.sortable)"
      :sort-field="column.sortField || column.field || column.key"
      :pt="{
        headerCell: {
          class: column.align === 'right' ? 'text-right' : 'text-left',
        },
        bodyCell: {
          class: column.align === 'right' ? 'text-right' : 'text-left',
        },
      }"
    >
      <template #body="{ data, index }">
        <!-- Row number -->
        <template v-if="column.key === 'number'">
          <span class="text-[12px] font-semibold text-surface-700 sm:text-sm">
            {{ data?.rowNumber || index + 1 }}
          </span>
        </template>

        <!-- User profile cell -->
        <template v-else-if="column.key === 'user'">
          <div class="flex items-center gap-3">
            <div class="ui-user-avatar">
              <span
                v-if="!shouldShowImage(data)"
                class="ui-user-avatar__initials"
              >
                {{ userInitials(data) }}
              </span>

              <img
                v-if="avatarSrc(data)"
                :src="avatarSrc(data)"
                :alt="`${data.name || 'User'} avatar`"
                class="ui-user-avatar__image"
                :class="{ 'ui-user-avatar__image--visible': shouldShowImage(data) }"
                @load="onAvatarLoad(data)"
                @error="onAvatarError(data)"
              >
            </div>

            <div class="min-w-0">
              <div class="truncate text-[13px] font-semibold leading-5 text-surface-900 sm:text-sm">
                {{ data.name || '-' }}
              </div>

              <div class="text-[11px] text-surface-500 sm:text-xs">
                ID: {{ data.id || '-' }}
              </div>

              <div class="truncate text-[11px] text-surface-600 sm:text-xs">
                {{ usernameLabel(data.username) }}
              </div>
            </div>
          </div>
        </template>

        <!-- Role badge -->
        <template v-else-if="column.key === 'role'">
          <RolesBadge :role="data.role" />
        </template>

        <!-- Permission badges -->
        <template v-else-if="column.key === 'permission'">
          <div class="flex flex-wrap gap-1">
            <PermissionBadge
              v-for="permission in visiblePermissions(data)"
              :key="permission"
              :permission="permission"
            />

            <span
              v-if="!permissionList(data).length"
              class="text-[11px] text-surface-400"
            >
              -
            </span>

            <span
              v-else-if="hiddenPermissionCount(data) > 0"
              class="inline-flex items-center rounded-full border border-surface-200 bg-surface-100 px-2 py-0.5 text-[0.68rem] font-semibold leading-none tracking-[0.02em] text-surface-600"
              :title="hiddenPermissionLabel(data)"
            >
              +{{ hiddenPermissionCount(data) }} more
            </span>
          </div>
        </template>

        <!-- Status badge -->
        <template v-else-if="column.key === 'status'">
          <StatusBadge
            :status="statusType(data)"
            :label="String(data.status ?? 'Unknown')"
            size="sm"
          />
        </template>

        <!-- Created at -->
        <template v-else-if="column.key === 'created_at'">
          <span class="text-[12px] text-surface-700 sm:text-sm">
            {{ formatDateTime(data.createdAt || data.created_at) }}
          </span>
        </template>

        <!-- Row actions -->
        <template v-else-if="column.key === 'actions'">
          <div
            v-if="useButtonActions"
            class="ui-data-table__row-actions"
          >
            <Button
              type="button"
              icon="pi pi-eye"
              rounded="full"
              variant="ghost"
              size="sm"
              class="ui-data-table__row-action"
              aria-label="View"
              @click="emit('view', data)"
            />

            <Button
              type="button"
              icon="pi pi-pencil"
              rounded="full"
              variant="ghost"
              size="sm"
              class="ui-data-table__row-action"
              aria-label="Edit"
              @click="emit('edit', data)"
            />

            <Button
              type="button"
              icon="pi pi-trash"
              rounded="full"
              variant="ghost"
              size="sm"
              class="ui-data-table__row-action ui-data-table__row-action--danger"
              aria-label="Delete"
              @click="emit('delete', data)"
            />
          </div>

          <ActionsButton
            v-else
            :item="data"
            @view="emit('view', data)"
            @edit="emit('edit', data)"
            @delete="emit('delete', data)"
          />
        </template>

        <!-- Default plain cell -->
        <template v-else>
          <span class="text-[12px] text-surface-700 sm:text-sm">
            {{ plainValue(data, column) }}
          </span>
        </template>
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>
/**
 * User avatar style.
 */
.ui-user-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  background: linear-gradient(
    135deg,
    var(--brand-primary-500) 0%,
    var(--brand-primary-700) 100%
  );
  color: #ffffff;
  box-shadow: 0 10px 18px -14px rgba(0, 174, 239, 0.55);
  border-radius: 9999px;
  overflow: hidden;
  flex-shrink: 0;
}

.ui-user-avatar__initials {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.ui-user-avatar__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.ui-user-avatar__image--visible {
  opacity: 1;
}

/**
 * Inline action buttons container.
 */
.ui-data-table__row-actions {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.35rem;
}

/**
 * Inline action button sizing.
 */
.ui-data-table__row-action {
  width: 2.15rem;
  height: 2.15rem;
}

/**
 * Delete action color.
 */
.ui-data-table__row-action--danger {
  color: #b42318;
}

.ui-data-table__row-action :deep(.p-button-icon) {
  font-size: 0.8rem;
}
</style>

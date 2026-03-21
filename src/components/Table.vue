<script setup>
import { computed, ref, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Avatar from 'primevue/avatar'
import Loading from '@/components/Loading.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import RolesBadge from '@/components/RolesBadge.vue'
import PermissionBadge from '@/components/PermissionBadge.vue'
import ActionsButton from '@/components/ActionsButton.vue'
import { useLanguage } from '@/composables/useLanguage'

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
})

const emit = defineEmits(['view', 'edit', 'delete'])
const { t } = useLanguage()
const hasImageError = ref({})

const resolvedRows = computed(() => (Array.isArray(props.rows) ? props.rows : props.users))
const resolvedEmptyText = computed(() => props.emptyText || t('users.table.empty') || 'No rows found.')
const loadingLabel = computed(() => t('users.loadingUsers') || 'Loading data')
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
const resolvedColumns = computed(() => (props.columns.length ? props.columns : defaultColumns.value))

function statusType(row) {
  const value = String(row?.status ?? '').toLowerCase()
  if (value === 'active') return 'success'
  if (value === 'pending') return 'pending'
  if (value === 'inactive') return 'warning'
  if (value === 'suspended') return 'error'
  return 'info'
}

function permissionList(row) {
  const explicit = Array.isArray(row?.permissions) ? row.permissions : []
  if (explicit.length) return explicit
  return String(row?.permission ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
}

function usernameLabel(username) {
  const value = String(username ?? '').trim()
  if (!value) return '-'
  return value.startsWith('@') ? value : `@${value}`
}

function avatarSrc(row) {
  const key = row?.id || row?.email || row?.username || row?.name
  if (hasImageError.value[key]) return ''
  return String(row?.avatar || row?.avatarUrl || row?.profileImage || row?.photo || '').trim()
}

function userInitials(row) {
  const name = String(row?.name ?? '').trim()
  if (!name) return '?'
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || '?'
  )
}

function plainValue(row, column) {
  const field = column?.field || column?.key
  const value = row?.[field]
  const normalized = String(value ?? '').trim()
  return normalized || '-'
}

function onAvatarError(row) {
  const key = row?.id || row?.email || row?.username || row?.name
  hasImageError.value = { ...hasImageError.value, [key]: true }
}

watch(
  () => resolvedRows.value,
  () => {
    hasImageError.value = {}
  },
  { deep: true },
)
</script>

<template>
  <DataTable
    :value="resolvedRows"
    :data-key="rowKey"
    :loading="loading"
    striped-rows
    removable-sort
    class="ui-data-table"
  >
    <template #empty>
      <div class="px-4 py-7 text-center text-sm text-gray-500">
        {{ resolvedEmptyText }}
      </div>
    </template>

    <template #loading>
      <div class="px-4 py-8">
        <div class="flex justify-center">
          <Loading :label="loadingLabel" size="md" />
        </div>
      </div>
    </template>

    <Column
      v-for="column in resolvedColumns"
      :key="column.key"
      :field="column.field || column.key"
      :header="column.label"
      :pt="{
        headerCell: { class: column.align === 'right' ? 'text-right' : 'text-left' },
        bodyCell: { class: column.align === 'right' ? 'text-right' : 'text-left' },
      }"
    >
      <template #body="{ data, index }">
        <template v-if="column.key === 'number'">
          <span class="text-[12px] font-semibold text-gray-700 sm:text-sm">
            {{ data?.rowNumber || index + 1 }}
          </span>
        </template>

        <template v-else-if="column.key === 'user'">
          <div class="flex items-center gap-3">
            <Avatar
              :label="avatarSrc(data) ? undefined : userInitials(data)"
              :image="avatarSrc(data) || undefined"
              shape="circle"
              class="ui-user-avatar"
              @image-error="onAvatarError(data)"
            />
            <div>
              <div class="text-[13px] font-semibold leading-5 text-gray-900 sm:text-sm">
                {{ data.name || '-' }}
              </div>
              <div class="text-[11px] text-gray-500 sm:text-xs">
                ID: {{ data.id || '-' }}
              </div>
              <div class="text-[11px] text-gray-600 sm:text-xs">
                {{ usernameLabel(data.username) }}
              </div>
            </div>
          </div>
        </template>

        <template v-else-if="column.key === 'role'">
          <RolesBadge :role="data.role" />
        </template>

        <template v-else-if="column.key === 'permission'">
          <div class="flex flex-wrap gap-1">
            <PermissionBadge
              v-for="permission in permissionList(data)"
              :key="permission"
              :permission="permission"
            />
            <span v-if="!permissionList(data).length" class="text-[11px] text-gray-400">-</span>
          </div>
        </template>

        <template v-else-if="column.key === 'status'">
          <StatusBadge :status="statusType(data)" :label="String(data.status ?? 'Unknown')" size="sm" />
        </template>

        <template v-else-if="column.key === 'actions'">
          <ActionsButton
            :item="data"
            @view="emit('view', data)"
            @edit="emit('edit', data)"
            @delete="emit('delete', data)"
          />
        </template>

        <template v-else>
          <span class="text-[12px] text-gray-700 sm:text-sm">{{ plainValue(data, column) }}</span>
        </template>
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>
:deep(.ui-data-table.p-datatable) {
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  overflow: hidden;
}

:deep(.ui-data-table .p-datatable-thead > tr > th) {
  background: #f8fafc;
  color: #4b5563;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

:deep(.ui-data-table .p-datatable-tbody > tr > td) {
  padding: 0.9rem 1rem;
}

:deep(.ui-user-avatar.p-avatar) {
  width: 2.75rem;
  height: 2.75rem;
  background: linear-gradient(135deg, var(--hope-o-cyan-blue) 0%, #0087b8 100%);
  color: #fff;
}
</style>

<script setup>
import { computed } from 'vue'
import LoadingSpinner from '../common/LoadingSpinner.vue'
import UsersTableRow from './TableRow.vue'
import { useLanguage } from '../../composables/useLanguage'

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

const resolvedRows = computed(() => (Array.isArray(props.rows) ? props.rows : props.users))
const resolvedEmptyText = computed(
  () => props.emptyText || t('users.table.empty') || 'No rows found.',
)
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
const resolvedColumns = computed(() =>
  props.columns.length ? props.columns : defaultColumns.value,
)

function headerClass(column) {
  const align = column?.align === 'right' ? 'text-right' : 'text-left'
  return `px-3 sm:px-4 md:px-6 py-3 ${align} text-[11px] sm:text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap`
}

function resolveRowKey(row, index) {
  const preferredKey = String(props.rowKey || 'id').trim()
  return row?.[preferredKey] || row?.id || row?.email || row?.name || `row-${index}`
}
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-100 text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th v-for="column in resolvedColumns" :key="column.key" :class="headerClass(column)">
              {{ column.label }}
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-100 bg-white">
          <tr v-if="props.loading">
            <td :colspan="resolvedColumns.length" class="px-4 py-8">
              <div class="flex justify-center">
                <LoadingSpinner :label="loadingLabel" size="md" />
              </div>
            </td>
          </tr>

          <tr v-else-if="!resolvedRows.length">
            <td
              :colspan="resolvedColumns.length"
              class="px-4 py-7 text-center text-sm text-gray-500"
            >
              {{ resolvedEmptyText }}
            </td>
          </tr>

          <template v-else>
            <UsersTableRow
              v-for="(row, index) in resolvedRows"
              :key="resolveRowKey(row, index)"
              :user="row"
              :row="row"
              :row-number="
                Number.isFinite(row?.rowNumber) && row.rowNumber > 0 ? row.rowNumber : index + 1
              "
              :columns="resolvedColumns"
              @view="emit('view', $event)"
              @edit="emit('edit', $event)"
              @delete="emit('delete', $event)"
            />
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

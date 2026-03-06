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
  loading: {
    type: Boolean,
    default: false,
  },
  emptyText: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['view', 'edit', 'delete'])
const { t } = useLanguage()
// Parent can override empty text; otherwise use i18n with a safe hardcoded fallback.
const resolvedEmptyText = computed(
  () => props.emptyText || t('users.table.empty') || 'No users found.',
)
// Screen-reader label for spinner, localized when available.
const loadingLabel = computed(() => t('users.loadingUsers') || 'Loading users')
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-100 text-sm">
        <thead class="bg-gray-50">
        <tr>
          <th class="px-3 sm:px-4 md:px-6 py-3 text-left text-[11px] sm:text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">{{ t('common.table.number') }}</th>
          <th class="px-3 sm:px-4 md:px-6 py-3 text-left text-[11px] sm:text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">{{ t('common.table.user') }}</th>
          <th class="px-3 sm:px-4 md:px-6 py-3 text-left text-[11px] sm:text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">{{ t('common.table.email') }}</th>
          <th class="px-3 sm:px-4 md:px-6 py-3 text-left text-[11px] sm:text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">{{ t('common.table.role') }}</th>
          <th class="px-3 sm:px-4 md:px-6 py-3 text-left text-[11px] sm:text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">{{ t('common.table.permission') }}</th>
          <th class="px-3 sm:px-4 md:px-6 py-3 text-left text-[11px] sm:text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">{{ t('common.table.status') }}</th>
          <th class="px-3 sm:px-4 md:px-6 py-3 text-left text-[11px] sm:text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">{{ t('common.table.phone') }}</th>
          <th class="px-3 sm:px-4 md:px-6 py-3 text-right text-[11px] sm:text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">{{ t('common.table.actions') }}</th>
        </tr>
      </thead>

        <tbody class="divide-y divide-gray-100 bg-white">
        <!-- Render order: loading state -> empty state -> data rows. -->
        <tr v-if="props.loading">
          <td colspan="8" class="px-4 py-8">
            <div class="flex justify-center">
              <LoadingSpinner :label="loadingLabel" size="md" />
            </div>
          </td>
        </tr>

        <tr v-else-if="!props.users.length">
          <td colspan="8" class="px-4 py-7 text-center text-sm text-gray-500">
            {{ resolvedEmptyText }}
          </td>
        </tr>

          <UsersTableRow
            v-for="(user, index) in props.users"
            :key="user.id || user.email || user.name"
            :user="user"
            :row-number="index + 1"
            @view="emit('view', $event)"
            @edit="emit('edit', $event)"
            @delete="emit('delete', $event)"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

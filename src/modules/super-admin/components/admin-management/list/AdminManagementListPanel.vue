<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SearchFilterBar from '@/components/forms/SearchFilterBar.vue'
import Table from '@/components/data-display/Table.vue'
import Loading from '@/components/feedback/Loading.vue'

defineOptions({
  name: 'AdminManagementListPanel',
})

const { t } = useI18n()

const props = defineProps({
  refreshLabel: {
    type: String,
    default: '',
  },
  searchQuery: {
    type: String,
    default: '',
  },
  roleFilter: {
    type: String,
    default: '',
  },
  statusFilter: {
    type: String,
    default: '',
  },
  searchPlaceholder: {
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
  users: {
    type: Array,
    default: () => [],
  },
  emptyText: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadingLabel: {
    type: String,
    default: '',
  },
})

const emit = defineEmits([
  'update:searchQuery',
  'update:roleFilter',
  'update:statusFilter',
  'edit',
  'delete',
  'refresh',
  'clear',
])

const pageCountLabel = computed(() =>
  t('users.manageAdmins.accountsInView', { count: Array.isArray(props.users) ? props.users.length : 0 }),
)
</script>

<template>
  <section class="rounded-2xl border border-surface-200/90 bg-white p-4 shadow-[0_22px_56px_-40px_rgba(15,23,42,0.42)] md:p-5">
    <div class="mb-4 flex justify-end">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-slate-500 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800"
        @click="emit('refresh')"
      >
        <i class="pi pi-sync" aria-hidden="true"></i>
        {{ refreshLabel }}
      </button>
    </div>

    <SearchFilterBar
      class="w-full"
      :search-query="searchQuery"
      :role-filter="roleFilter"
      :status-filter="statusFilter"
      :search-placeholder="searchPlaceholder"
      :role-options="roleOptions"
      :status-options="statusOptions"
      @update:search-query="emit('update:searchQuery', $event)"
      @update:role-filter="emit('update:roleFilter', $event)"
      @update:status-filter="emit('update:statusFilter', $event)"
      @clear="emit('clear')"
    />

    <div class="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/60">
      <div class="flex flex-col gap-2 border-b border-slate-200/80 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
            {{ t('users.manageAdmins.title') }}
          </p>
          <p class="mt-1 text-[0.82rem] font-medium text-cyan-700">
            {{ pageCountLabel }}
          </p>
        </div>
        <p class="text-[0.78rem] leading-5 text-slate-500">
          {{ t('users.manageAdmins.toolbarNote') }}
        </p>
      </div>

      <div class="min-h-[16rem] p-3 md:p-4">
        <Loading
          v-if="loading"
          class="rounded-2xl border border-dashed border-slate-200 bg-white/90 py-8"
          :label="loadingLabel"
          size="md"
        />

        <template v-else>
          <Table
            :users="users"
            :empty-text="emptyText"
            @edit="emit('edit', $event)"
            @delete="emit('delete', $event)"
          />
        </template>
      </div>
    </div>
  </section>
</template>

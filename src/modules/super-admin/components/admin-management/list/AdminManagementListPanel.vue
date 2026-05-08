<script setup>
import SearchFilterBar from '@/components/forms/SearchFilterBar.vue'
import Table from '@/components/data-display/Table.vue'
import Pagination from '@/components/data-display/Pagination.vue'
import Loading from '@/components/feedback/Loading.vue'

defineOptions({
  name: 'AdminManagementListPanel',
})

defineProps({
  title: {
    type: String,
    default: '',
  },
  note: {
    type: String,
    default: '',
  },
  recordsText: {
    type: String,
    default: '',
  },
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
  currentPage: {
    type: Number,
    default: 1,
  },
  totalPages: {
    type: Number,
    default: 1,
  },
  totalCount: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits([
  'update:searchQuery',
  'update:roleFilter',
  'update:statusFilter',
  'update:currentPage',
  'edit',
  'delete',
  'refresh',
  'clear',
])
</script>

<template>
  <section class="rounded-2xl border border-surface-200/90 bg-white p-4 shadow-[0_22px_56px_-40px_rgba(15,23,42,0.42)] md:p-5">
    <div class="mb-4 flex flex-col gap-2 border-b border-slate-100 pb-4">
      <div class="flex items-center justify-between gap-3">
        <p class="text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
          {{ title }}
        </p>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-slate-500 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800"
          @click="emit('refresh')"
        >
          <i class="pi pi-sync" aria-hidden="true"></i>
          {{ refreshLabel }}
        </button>
      </div>
      <p class="text-[0.9rem] leading-6 text-slate-600">
        {{ note }}
      </p>
      <p v-if="recordsText" class="text-[0.84rem] font-semibold text-cyan-700">
        {{ recordsText }}
      </p>
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

    <div class="mt-4 min-h-[16rem]">
      <Loading
        v-if="loading"
        class="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 py-8"
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

        <div v-if="totalPages > 1" class="mt-4 flex justify-end">
          <Pagination
            :model-value="currentPage"
            :total-pages="totalPages"
            :disabled="!totalCount"
            @update:model-value="emit('update:currentPage', $event)"
          />
        </div>
      </template>
    </div>
  </section>
</template>

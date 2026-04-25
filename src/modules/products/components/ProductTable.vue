<script setup>
import { computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from '@/components/buttons/Button.vue'
import ActionsButton from '@/components/buttons/ActionsButton.vue'
import Loading from '@/components/feedback/Loading.vue'
import Pagination from '@/components/data-display/Pagination.vue'
import { createDefaultPagination } from '@/modules/products/services/productService'
import {
  formatProductPrice,
  formatProductStock,
  truncateProductText,
} from '@/modules/products/utils/productFormatters'

defineOptions({
  name: 'ProductTable',
})

const props = defineProps({
  products: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: Object,
    default: () => createDefaultPagination(),
  },
  deletingId: {
    type: [Number, String],
    default: null,
  },
})

const emit = defineEmits(['create', 'view', 'edit', 'delete', 'page-change'])

const safePagination = computed(() => ({
  ...createDefaultPagination(),
  ...props.pagination,
}))

const summaryLabel = computed(() => {
  if (!safePagination.value.total) {
    return 'No products available yet.'
  }

  const { from, to, total } = safePagination.value
  return `Showing ${from || 1}-${to || props.products.length} of ${total} products`
})

const tablePt = computed(() => ({
  root: {
    class: '!overflow-hidden !rounded-[1.35rem] !border !border-surface-200 !bg-white',
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
      '!border-b !border-surface-200 !bg-slate-50 !px-4 !py-3.5 !text-left !text-[0.73rem] !font-black !tracking-[0.08em] !text-surface-600 uppercase',
  },
  bodyRow: {
    class: 'hover:!bg-brand-50/50 transition-colors',
  },
  bodyCell: {
    class: '!border-b !border-slate-100 !bg-transparent !px-4 !py-3.5 !align-top !text-surface-700',
  },
  loadingOverlay: {
    class: '!bg-white/80',
  },
  emptyMessage: {
    class: '!bg-white',
  },
}))
</script>

<template>
  <section
    class="overflow-hidden rounded-[1.5rem] border border-surface-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.92)_100%)] shadow-[0_18px_40px_-32px_rgba(15,23,42,0.24)]"
  >
    <header
      class="flex flex-col gap-4 border-b border-surface-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-4 py-4 sm:px-5"
    >
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="space-y-1">
          <h3 class="text-lg font-extrabold text-surface-900">Product catalog</h3>
          <p class="text-sm leading-6 text-surface-600">
            {{ summaryLabel }}
          </p>
        </div>

        <Button type="button" variant="primary" @click="emit('create')">
          Create product
        </Button>
      </div>
    </header>

    <DataTable
      :value="products"
      data-key="id"
      :loading="loading"
      striped-rows
      removable-sort
      class="ui-products-table"
      :pt="tablePt"
    >
      <template #empty>
        <div class="flex flex-col items-center gap-3 px-4 py-10 text-center">
          <div
            class="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"
          >
            <i class="pi pi-box text-xl" />
          </div>
          <div class="space-y-1">
            <h4 class="text-base font-extrabold text-surface-900">No products found</h4>
            <p class="max-w-xl text-sm leading-6 text-surface-500">
              The Laravel API returned an empty product collection. Create the first product to
              start managing inventory from the frontend.
            </p>
          </div>
          <Button type="button" variant="outline" @click="emit('create')">
            Add the first product
          </Button>
        </div>
      </template>

      <template #loading>
        <div class="px-4 py-10">
          <Loading label="Loading products" size="md" />
        </div>
      </template>

      <Column field="id" header="ID" sortable>
        <template #body="{ data }">
          <span class="text-sm font-bold text-surface-700">#{{ data.id ?? '--' }}</span>
        </template>
      </Column>

      <Column field="name" header="Name" sortable>
        <template #body="{ data }">
          <div class="space-y-1">
            <button
              type="button"
              class="text-left text-sm font-extrabold text-surface-900 transition hover:text-brand-700"
              @click="emit('view', data)"
            >
              {{ data.name || '--' }}
            </button>
            <p class="text-xs leading-5 text-surface-500">
              {{ truncateProductText(data.description, 84) }}
            </p>
          </div>
        </template>
      </Column>

      <Column field="price" header="Price" sortable>
        <template #body="{ data }">
          <span class="text-sm font-bold text-surface-900">
            {{ formatProductPrice(data.price) }}
          </span>
        </template>
      </Column>

      <Column field="stock" header="Stock" sortable>
        <template #body="{ data }">
          <span class="inline-flex rounded-full bg-lime-50 px-3 py-1 text-xs font-black text-lime-700">
            {{ formatProductStock(data.stock) }}
          </span>
        </template>
      </Column>

      <Column header="Actions">
        <template #body="{ data }">
          <ActionsButton
            :item="data"
            :disabled="deletingId === data.id"
            @view="emit('view', data)"
            @edit="emit('edit', data)"
            @delete="emit('delete', data)"
          />
        </template>
      </Column>
    </DataTable>

    <footer
      v-if="safePagination.total > 0"
      class="flex flex-col gap-3 border-t border-surface-200 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between"
    >
      <p class="text-sm text-surface-500">
        Page {{ safePagination.currentPage }} of {{ safePagination.lastPage }}
      </p>

      <Pagination
        :model-value="safePagination.currentPage"
        :total-pages="safePagination.lastPage"
        :disabled="loading"
        @change="emit('page-change', $event)"
      />
    </footer>
  </section>
</template>

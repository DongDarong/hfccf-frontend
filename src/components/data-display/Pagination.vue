<script setup>
import { computed } from 'vue'
import Paginator from 'primevue/paginator'

defineOptions({
  name: 'UiPagination',
})

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  maxVisible: {
    type: Number,
    default: 5,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const rows = 1
const first = computed(() => (Math.max(props.modelValue, 1) - 1) * rows)
const totalRecords = computed(() => Math.max(props.totalPages, 1) * rows)

function onPage(event) {
  const next = Math.floor(event.first / rows) + 1
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <Paginator
    :first="first"
    :rows="rows"
    :total-records="totalRecords"
    :page-link-size="maxVisible"
    :template="{
      default: 'PrevPageLink PageLinks NextPageLink',
    }"
    class="ui-pagination"
    :pt="{
      root: { class: disabled ? 'pointer-events-none opacity-50' : '' },
    }"
    @page="onPage"
  />
</template>

<style scoped>
:deep(.ui-pagination.p-paginator) {
  padding: 0;
  border: 0;
  background: transparent;
  justify-content: flex-end;
}

:deep(.ui-pagination .p-paginator-page),
:deep(.ui-pagination .p-paginator-prev),
:deep(.ui-pagination .p-paginator-next) {
  min-width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.75rem;
  border: 1px solid #d7e0ea;
  background: #fff;
  color: #1d1d1b;
}

:deep(.ui-pagination .p-paginator-page.p-highlight) {
  background: var(--hope-o-cyan-blue);
  color: #fff;
  border-color: var(--hope-o-cyan-blue);
}
</style>

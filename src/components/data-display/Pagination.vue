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
const paginationPt = computed(() => ({
  root: {
    class: [
      '!border-0',
      '!bg-transparent',
      '!p-0',
      '!justify-end',
      props.disabled ? 'pointer-events-none opacity-50' : '',
    ],
  },
  content: { class: '!gap-2' },
  pages: { class: '!gap-2' },
  pageButton: {
    class: [
      '!min-h-9',
      '!min-w-9',
      '!rounded-xl',
      '!border',
      '!border-surface-300',
      '!bg-white',
      '!text-hope-dark',
      '!shadow-sm',
      'transition-all',
      'duration-200',
      'hover:enabled:!border-brand-300',
      'hover:enabled:!bg-brand-50',
      'hover:enabled:!text-brand-700',
      'focus-visible:!outline-none',
      'focus-visible:!shadow-focus',
    ],
  },
  previousPageButton: {
    class: [
      '!min-h-9',
      '!min-w-9',
      '!rounded-xl',
      '!border',
      '!border-surface-300',
      '!bg-white',
      '!text-surface-600',
      '!shadow-sm',
      'transition-all',
      'duration-200',
      'hover:enabled:!border-brand-300',
      'hover:enabled:!bg-brand-50',
      'hover:enabled:!text-brand-700',
      'focus-visible:!outline-none',
      'focus-visible:!shadow-focus',
    ],
  },
  nextPageButton: {
    class: [
      '!min-h-9',
      '!min-w-9',
      '!rounded-xl',
      '!border',
      '!border-surface-300',
      '!bg-white',
      '!text-surface-600',
      '!shadow-sm',
      'transition-all',
      'duration-200',
      'hover:enabled:!border-brand-300',
      'hover:enabled:!bg-brand-50',
      'hover:enabled:!text-brand-700',
      'focus-visible:!outline-none',
      'focus-visible:!shadow-focus',
    ],
  },
}))

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
    :pt="paginationPt"
    @page="onPage"
  />
</template>

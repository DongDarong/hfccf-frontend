<script setup>
import { computed } from 'vue'

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

const currentPage = computed(() => {
  const page = Number(props.modelValue) || 1
  return Math.min(Math.max(page, 1), Math.max(props.totalPages, 1))
})

const isFirstPage = computed(() => currentPage.value <= 1)
const isLastPage = computed(() => currentPage.value >= props.totalPages)

const pageItems = computed(() => {
  const total = Math.max(props.totalPages, 1)
  const visible = Math.max(props.maxVisible, 3)

  if (total <= visible) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const sideCount = Math.floor((visible - 3) / 2)
  let start = Math.max(2, currentPage.value - sideCount)
  let end = Math.min(total - 1, currentPage.value + sideCount)

  const targetLength = visible - 2
  while (end - start + 1 < targetLength) {
    if (start > 2) start--
    else if (end < total - 1) end++
    else break
  }

  const items = [1]
  if (start > 2) items.push('...')
  for (let i = start; i <= end; i++) items.push(i)
  if (end < total - 1) items.push('...')
  items.push(total)

  return items
})

function setPage(page) {
  if (props.disabled) return
  const next = Math.min(Math.max(page, 1), props.totalPages)
  if (next === currentPage.value) return
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <nav class="pagination" aria-label="Pagination">
    <button type="button" class="page-btn" :disabled="disabled || isFirstPage" @click="setPage(currentPage - 1)">
      Previous
    </button>

    <ul class="page-list">
      <li v-for="item in pageItems" :key="`${item}-${currentPage}`">
        <span v-if="item === '...'" class="page-ellipsis">...</span>
        <button
          v-else
          type="button"
          class="page-btn"
          :class="{ 'page-btn--active': item === currentPage }"
          :disabled="disabled"
          @click="setPage(item)"
        >
          {{ item }}
        </button>
      </li>
    </ul>

    <button type="button" class="page-btn" :disabled="disabled || isLastPage" @click="setPage(currentPage + 1)">
      Next
    </button>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.page-list {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.page-btn {
  min-width: 2.25rem;
  height: 2.25rem;
  padding: 0 0.75rem;
  border-radius: 0.6rem;
  border: 1px solid #d7e0ea;
  background: #ffffff;
  color: #1d1d1b;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.page-btn:hover:not(:disabled) {
  border-color: #00aeef;
  color: #006f99;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn--active {
  border-color: #00aeef;
  background: #00aeef;
  color: #ffffff;
}

.page-ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  color: #64748b;
}
</style>

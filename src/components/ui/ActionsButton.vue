<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useLanguage } from '../../composables/useLanguage'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  compact: {
    type: Boolean,
    default: false,
  },
  align: {
    type: String,
    default: 'right',
    validator: (value) => ['left', 'right'].includes(value),
  },
  viewLabel: {
    type: String,
    default: '',
  },
  editLabel: {
    type: String,
    default: '',
  },
  deleteLabel: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['view', 'edit', 'delete', 'action'])
const { t } = useLanguage()

const isOpen = ref(false)
const root = ref(null)
const firstActionButton = ref(null)
const menuId = `actions-menu-${Math.random().toString(36).slice(2, 10)}`
const instanceId = `actions-instance-${Math.random().toString(36).slice(2, 10)}`

const labels = computed(() => ({
  view: props.viewLabel || t('common.view'),
  edit: props.editLabel || t('common.edit'),
  delete: props.deleteLabel || t('common.delete'),
}))
const triggerAriaLabel = computed(() => `${labels.value.view} / ${labels.value.edit} / ${labels.value.delete}`)

const menuPositionClass = computed(() =>
  props.align === 'left' ? 'left-0 origin-top-left' : 'right-0 origin-top-right',
)

function toggleMenu() {
  if (props.disabled) return
  isOpen.value = !isOpen.value

  if (isOpen.value) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('actions-menu-open', { detail: { instanceId } }),
      )
    }
    nextTick(() => {
      firstActionButton.value?.focus()
    })
  }
}

function closeMenu() {
  isOpen.value = false
}

function onAction(type) {
  emit(type, props.item)
  emit('action', { type, item: props.item })
  closeMenu()
}

function onWindowClick(event) {
  if (!root.value) return
  if (!root.value.contains(event.target)) {
    closeMenu()
  }
}

function onWindowKeydown(event) {
  if (event.key === 'Escape' && isOpen.value) {
    closeMenu()
  }
}

function onOtherMenuOpen(event) {
  const openedInstanceId = event?.detail?.instanceId
  if (openedInstanceId && openedInstanceId !== instanceId && isOpen.value) {
    closeMenu()
  }
}

onMounted(() => {
  if (typeof window === 'undefined') return
  window.addEventListener('click', onWindowClick)
  window.addEventListener('keydown', onWindowKeydown)
  window.addEventListener('actions-menu-open', onOtherMenuOpen)
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', onWindowClick)
    window.removeEventListener('keydown', onWindowKeydown)
    window.removeEventListener('actions-menu-open', onOtherMenuOpen)
  }
})
</script>

<template>
  <div ref="root" class="relative inline-flex">
    <button
      type="button"
      class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
      :class="compact ? 'h-8 w-8' : 'h-9 w-9'"
      :disabled="disabled"
      :aria-expanded="isOpen"
      :aria-controls="menuId"
      aria-haspopup="menu"
      :aria-label="triggerAriaLabel"
      @click.stop="toggleMenu"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h.01M12 12h.01M18 12h.01" />
      </svg>
    </button>

    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="scale-95 opacity-0"
      enter-to-class="scale-100 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        :id="menuId"
        role="menu"
        class="absolute z-50 mt-2 min-w-[140px] rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg"
        :class="menuPositionClass"
      >
        <button
          ref="firstActionButton"
          type="button"
          role="menuitem"
          class="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
          @click.stop="onAction('view')"
        >
          {{ labels.view }}
        </button>
        <button
          type="button"
          role="menuitem"
          class="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-sky-700 transition hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
          @click.stop="onAction('edit')"
        >
          {{ labels.edit }}
        </button>
        <button
          type="button"
          role="menuitem"
          class="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-red-700 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
          @click.stop="onAction('delete')"
        >
          {{ labels.delete }}
        </button>
      </div>
    </transition>
  </div>
</template>

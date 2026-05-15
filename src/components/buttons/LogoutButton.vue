<script setup>
import { computed, ref } from 'vue'
import PrimeButton from 'primevue/button'
import AlertQuestion from '@/components/alerts/AlertQuestion.vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'UiLogoutButton',
})

const props = defineProps({
  collapsed: { type: Boolean, default: false },
  block: { type: Boolean, default: true },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value),
  },
  variant: { type: String, default: 'ghost' },
  rounded: { type: String, default: '2xl' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  showConfirm: { type: Boolean, default: true },
  label: { type: String, default: '' },
  confirmType: {
    type: String,
    default: 'warning',
    validator: (value) => ['danger', 'warning', 'info'].includes(value),
  },
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  confirmText: { type: String, default: '' },
  cancelText: { type: String, default: '' },
})

const emit = defineEmits(['logout', 'cancel', 'click'])

const { t } = useLanguage()
const isConfirmOpen = ref(false)

/**
 * Helper: safely resolve translation with fallback
 */
function translate(key, fallback) {
  const value = t(key)
  return value && value !== key ? value : fallback
}

/**
 * Labels
 */
const resolvedLabel = computed(() =>
  props.label || translate('common.logout', 'Logout')
)

const resolvedTitle = computed(() =>
  props.title || translate('common.logout', 'Logout')
)

const resolvedMessage = computed(() =>
  props.message || translate('common.logoutConfirm', 'Are you sure you want to logout?')
)

const resolvedConfirmText = computed(() =>
  props.confirmText || translate('common.logout', 'Logout')
)

const resolvedCancelText = computed(() =>
  props.cancelText || translate('common.cancel', 'Cancel')
)

/**
 * 🔥 FIXED: caption fallback logic
 */
const resolvedCaption = computed(() => {
  if (props.collapsed) return ''
  return translate('dashboard.nav.logoutCaption', 'End current session')
})

/**
 * Layout
 */
const computedSize = computed(() => (props.collapsed ? 'sm' : props.size))
const shouldBlock = computed(() => (props.collapsed ? false : props.block))

const roundedClass = computed(() => {
  if (props.rounded === 'full') return '!rounded-full'
  if (props.rounded === 'md') return '!rounded-md'
  if (props.rounded === 'lg') return '!rounded-lg'
  if (props.rounded === 'xl') return '!rounded-xl'
  return '!rounded-2xl'
})

const sizeClass = computed(() => {
  if (computedSize.value === 'xs') return '!min-h-8 !px-2.5 !py-1.5 !text-xs'
  if (computedSize.value === 'sm') return '!min-h-9.5 !px-3 !py-2 !text-sm'
  if (computedSize.value === 'lg') return '!min-h-12 !px-4.5 !py-3 !text-base'
  if (computedSize.value === 'xl') return '!min-h-13 !px-5 !py-3.5 !text-base'
  return '!min-h-11 !px-4 !py-2.5 !text-sm'
})

const rootClass = computed(() => {
  const classes = [
    'logout-button',
    'group',
    '!inline-flex',
    '!items-center',
    '!gap-0',
    '!border',
    '!font-bold',
    '!transition-all',
    '!duration-200',
    'focus-visible:!outline-none',
    'focus-visible:!shadow-focus',
    'active:enabled:scale-[0.98]',
    'disabled:!cursor-not-allowed',
    'disabled:!opacity-60',
    'disabled:!shadow-none',
    roundedClass.value,
    sizeClass.value,
  ]

  if (props.collapsed) {
    classes.push(
      '!h-11',
      '!w-11',
      '!min-w-0',
      '!justify-center',
      '!border-rose-200',
      '!bg-white',
      '!p-0',
      '!text-rose-700'
    )
  } else {
    classes.push(
      '!justify-start',
      '!border-rose-200',
      '!bg-rose-50',
      '!text-rose-700',
      '!px-3',
      '!py-2.5'
    )
  }

  if (shouldBlock.value) classes.push('w-full')
  return classes
})

const iconShellClass = computed(() => [
  'inline-flex',
  'h-8.5',
  'w-8.5',
  'flex-none',
  'items-center',
  'justify-center',
  'rounded-xl',
  'border',
  'border-rose-200',
  'bg-white',
  'text-rose-600',
  'transition-colors',
  'duration-200',
  'group-hover:border-rose-300',
  'group-hover:text-rose-700',
])

const buttonPt = computed(() => ({
  root: { class: rootClass.value },
  label: {
    class: [
      'inline-flex',
      'w-full',
      'items-center',
      props.collapsed ? 'justify-center' : 'justify-start',
    ],
  },
}))

/**
 * Actions
 */
function onClick() {
  if (props.disabled || props.loading) return
  emit('click')

  if (props.showConfirm) {
    isConfirmOpen.value = true
    return
  }

  emit('logout')
}

function onConfirm() {
  isConfirmOpen.value = false
  emit('logout')
}

function onCancel() {
  isConfirmOpen.value = false
  emit('cancel')
}
</script>

<template>
  <div class="logout-button-wrap" :class="collapsed ? 'inline-flex' : 'w-full px-1'">
    <PrimeButton
      type="button"
      :disabled="disabled"
      :loading="loading"
      :pt="buttonPt"
      :aria-label="resolvedLabel"
      @click="onClick"
    >
      <span :class="iconShellClass" aria-hidden="true">
        <i class="pi pi-sign-out text-[1rem]"></i>
      </span>

      <span v-if="!collapsed" class="ml-2 flex flex-col">
        <span class="font-bold text-rose-700">
          {{ resolvedLabel }}
        </span>
        <span class="text-xs text-slate-500">
          {{ resolvedCaption }}
        </span>
      </span>

      <span v-else class="sr-only">{{ resolvedLabel }}</span>
    </PrimeButton>

    <AlertQuestion
      :show="isConfirmOpen"
      :title="resolvedTitle"
      :message="resolvedMessage"
      :confirm-text="resolvedConfirmText"
      :cancel-text="resolvedCancelText"
      :type="confirmType"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </div>
</template>

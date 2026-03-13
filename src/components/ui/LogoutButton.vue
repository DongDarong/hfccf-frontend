<script setup>
import { computed, ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import AlertQuestion from '@/components/ui/AlertQuestion.vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'UiLogoutButton',
})

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
  block: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value),
  },
  variant: {
    type: String,
    default: 'danger',
  },
  rounded: {
    type: String,
    default: 'xl',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showConfirm: {
    type: Boolean,
    default: true,
  },
  label: {
    type: String,
    default: '',
  },
  confirmType: {
    type: String,
    default: 'warning',
    validator: (value) => ['danger', 'warning', 'info'].includes(value),
  },
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
  confirmText: {
    type: String,
    default: '',
  },
  cancelText: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['logout', 'cancel', 'click'])
const { t } = useLanguage()
const isConfirmOpen = ref(false)

const resolvedLabel = computed(() => props.label || t('common.logout'))
const resolvedTitle = computed(() => props.title || t('common.logout'))
const resolvedMessage = computed(() => props.message || t('common.logoutConfirm'))
const resolvedConfirmText = computed(() => props.confirmText || t('common.logout'))
const resolvedCancelText = computed(() => props.cancelText || t('common.cancel'))
// Collapsed sidebar uses compact sizing and non-block button width.
const computedSize = computed(() => (props.collapsed ? 'sm' : props.size))
const shouldBlock = computed(() => (props.collapsed ? false : props.block))

function onClick() {
  if (props.disabled || props.loading) return
  emit('click')

  // Optional confirmation step before dispatching logout.
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
  <div :class="collapsed ? 'inline-flex' : 'w-full'">
    <Button
      :variant="variant"
      :size="computedSize"
      :rounded="rounded"
      :block="shouldBlock"
      :disabled="disabled"
      :loading="loading"
      :class="{ '!px-2.5': collapsed }"
      @click="onClick"
    >
      <template #iconLeft>
        <svg
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      </template>
      <span v-if="!collapsed">{{ resolvedLabel }}</span>
      <span v-else class="sr-only">{{ resolvedLabel }}</span>
    </Button>

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

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>

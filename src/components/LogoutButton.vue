<script setup>
import { computed, ref } from 'vue'
import Button from '@/components/Button.vue'
import AlertQuestion from '@/components/AlertQuestion.vue'
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
const resolvedCaption = computed(() => (props.collapsed ? '' : 'End current session'))
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
      class="logout-button"
      :class="collapsed ? 'logout-button--collapsed !px-2.5' : 'logout-button--expanded'"
      @click="onClick"
    >
      <template #iconLeft>
        <span class="logout-button__icon-shell" aria-hidden="true">
          <svg
            class="logout-button__icon h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </span>
      </template>
      <span v-if="!collapsed" class="logout-button__content">
        <span class="logout-button__label">{{ resolvedLabel }}</span>
        <span class="logout-button__caption">{{ resolvedCaption }}</span>
      </span>
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
.logout-button {
  position: relative;
}

.logout-button__content {
  display: inline-flex;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.1;
}

.logout-button__icon-shell {
  display: inline-flex;
  height: 1.9rem;
  width: 1.9rem;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: color-mix(in srgb, currentColor 10%, white);
}

.logout-button__icon {
  flex: 0 0 auto;
}

.logout-button__label {
  letter-spacing: 0.01em;
  font-weight: 800;
}

.logout-button__caption {
  margin-top: 0.15rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: #64748b;
}

.logout-button--expanded {
  justify-content: flex-start;
}

.logout-button--collapsed {
  min-width: 2.9rem;
  justify-content: center;
}

.logout-button--collapsed .logout-button__icon-shell {
  height: 1.7rem;
  width: 1.7rem;
}

.logout-button--collapsed :deep(.ui-button__label) {
  display: none;
}

.logout-button:deep(.ui-button.p-button) {
  min-height: 3rem;
}

.logout-button--expanded:deep(.ui-button.p-button) {
  padding-top: 0.7rem;
  padding-bottom: 0.7rem;
}

.logout-button--expanded:deep(.ui-button.p-button .p-button-icon) {
  margin-top: 0;
}

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

@media (max-width: 640px) {
  .logout-button__caption {
    font-size: 0.68rem;
  }
}
</style>


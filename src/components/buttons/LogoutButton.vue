<script setup>
import { computed, ref } from 'vue'
import Button from '@/components/buttons/Button.vue'
import AlertQuestion from '@/components/alerts/AlertQuestion.vue'
import LogoutIcon from '@/assets/icons/Logout.vue'
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
    default: 'ghost',
  },
  rounded: {
    type: String,
    default: '2xl',
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
const resolvedCaption = computed(() => (props.collapsed ? '' : t('dashboard.nav.logoutCaption') || 'End current session'))
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
  <div :class="collapsed ? 'inline-flex' : 'w-full px-1.5'">
    <Button
      :variant="variant"
      :size="computedSize"
      :rounded="rounded"
      :block="shouldBlock"
      :disabled="disabled"
      :loading="loading"
      class="logout-button transition-all duration-300"
      :class="
        collapsed
          ? 'logout-button--collapsed !h-12 !w-12 !min-w-0 !justify-center !p-0 mx-auto'
          : 'logout-button--expanded !min-h-[3.8rem] !justify-start !px-3.5 !py-2.5'
      "
      @click="onClick"
    >
      <template #iconLeft>
        <span
          class="logout-button__icon-shell inline-flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--hope-red)_10%,transparent)] text-hope-red transition-colors duration-200 group-hover:bg-[color-mix(in_srgb,var(--hope-red)_18%,transparent)]"
          aria-hidden="true"
        >
          <LogoutIcon :size="20" class="logout-button__icon" />
        </span>
      </template>
      <span
        v-if="!collapsed"
        class="logout-button__content ml-1 inline-flex min-w-0 flex-col items-start leading-tight"
      >
        <span class="logout-button__label text-[0.92rem] font-extrabold tracking-tight text-slate-800">
          {{ resolvedLabel }}
        </span>
        <span class="logout-button__caption mt-0.5 text-[0.7rem] font-medium text-slate-500">
          {{ resolvedCaption }}
        </span>
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

.logout-button--expanded {
  background: transparent !important;
  border-color: transparent !important;
}

.logout-button--expanded:hover {
  background: color-mix(in srgb, var(--color-base) 6%, rgb(214, 116, 116)) !important;
  border-color: color-mix(in srgb, var(--color-base) 12%, white) !important;
}

.logout-button--collapsed {
  background: white !important;
  border-color: #f1f5f9 !important;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05);
}

.logout-button--collapsed:hover {
  background: color-mix(in srgb, var(--hope-red) 8%, white) !important;
  border-color: color-mix(in srgb, var(--hope-red) 20%, white) !important;
  color: var(--hope-red) !important;
}

.logout-button--collapsed:hover .logout-button__icon-shell {
  background: white !important;
}

.logout-button:deep(.ui-button__label) {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.logout-button--collapsed :deep(.ui-button__label) {
  justify-content: center;
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
</style>



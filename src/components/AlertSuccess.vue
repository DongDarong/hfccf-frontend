<script setup>
import { computed, onUnmounted, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from '@/components/Button.vue'
import { useLanguage } from '@/composables/useLanguage'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
  buttonText: {
    type: String,
    default: '',
  },
  autoClose: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['close'])
const { t } = useLanguage()

let timeout = null

const resolvedTitle = computed(() => props.title || t('common.success'))
const resolvedMessage = computed(() => props.message || t('common.actionCompleted'))
const resolvedButtonText = computed(() => props.buttonText || t('common.continue'))
const dialogPt = computed(() => ({
  root: { class: 'alert-success-dialog' },
  content: { class: 'alert-success-dialog__content' },
  mask: { class: 'alert-success-dialog__mask' },
}))

function handleClose() {
  emit('close')
}

watch(
  () => props.show,
  (newShow) => {
    if (timeout) clearTimeout(timeout)
    if (newShow && props.autoClose > 0) {
      timeout = setTimeout(handleClose, props.autoClose)
    }
  },
)

onUnmounted(() => {
  if (timeout) clearTimeout(timeout)
})
</script>

<template>
  <Dialog
    :visible="show"
    modal
    :closable="false"
    :draggable="false"
    :dismissable-mask="true"
    class="ui-dialog ui-dialog--success"
    :pt="dialogPt"
    @update:visible="handleClose"
  >
    <div class="alert-success flex flex-col items-center text-center">
      <div class="alert-success__badge">
        <div class="alert-success__badge-ring">
          <i class="pi pi-check text-[1.7rem]" />
        </div>
      </div>

      <div class="alert-success__content">
        <p class="alert-success__eyebrow">Completed successfully</p>
        <h3 class="alert-success__title">{{ resolvedTitle }}</h3>
        <p class="alert-success__message">{{ resolvedMessage }}</p>
      </div>

      <div class="alert-success__actions">
        <Button class="w-full" type="button" variant="success" @click="handleClose">
          {{ resolvedButtonText }}
        </Button>
      </div>
    </div>
  </Dialog>
</template>

<style>
.alert-success {
  position: relative;
}

.alert-success__badge {
  margin-bottom: 1.25rem;
  display: flex;
  height: 5.75rem;
  width: 5.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: linear-gradient(180deg, #ecfdf5 0%, #d1fae5 100%);
}

.alert-success__badge-ring {
  display: flex;
  height: 4.25rem;
  width: 4.25rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: linear-gradient(180deg, #22c55e 0%, #16a34a 100%);
  color: #ffffff;
  box-shadow: 0 14px 28px -18px rgba(34, 197, 94, 0.55);
}

.alert-success__content {
  width: 100%;
}

.alert-success__eyebrow {
  margin: 0 0 0.45rem;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #16a34a;
}

.alert-success__title {
  margin: 0;
  font-size: 1.45rem;
  font-weight: 800;
  line-height: 1.2;
  color: #0f172a;
}

.alert-success__message {
  margin: 0.8rem 0 0;
  font-size: 0.96rem;
  line-height: 1.7;
  color: #64748b;
}

.alert-success__actions {
  margin-top: 1.75rem;
  width: 100%;
}

.alert-success-dialog.p-dialog,
.ui-dialog--success.p-dialog {
  border-radius: 1.65rem;
  border: 1px solid #e2e8f0;
  background:
    radial-gradient(circle at top, rgba(34, 197, 94, 0.08), transparent 32%),
    linear-gradient(180deg, #ffffff 0%, #f8fafc 100%) !important;
  color: #0f172a !important;
  box-shadow: 0 24px 56px -28px rgba(15, 23, 42, 0.2);
  overflow: hidden;
}

.alert-success-dialog__content,
.ui-dialog--success .p-dialog-content {
  border-radius: 1.65rem;
  background: transparent !important;
  padding: 2.1rem 1.85rem 1.75rem;
}

.alert-success-dialog__mask,
.p-dialog-mask:has(.ui-dialog--success) {
  background: rgba(248, 250, 252, 0.78) !important;
  backdrop-filter: none;
}

@media (max-width: 640px) {
  .alert-success-dialog.p-dialog,
  .ui-dialog--success.p-dialog {
    width: min(92vw, 28rem);
    border-radius: 1.35rem;
  }

  .alert-success-dialog__content,
  .ui-dialog--success .p-dialog-content {
    border-radius: 1.35rem;
    padding: 1.5rem 1.1rem 1.25rem;
  }

  .alert-success__badge {
    margin-bottom: 1rem;
    height: 5rem;
    width: 5rem;
  }

  .alert-success__badge-ring {
    height: 3.65rem;
    width: 3.65rem;
  }

  .alert-success__title {
    font-size: 1.25rem;
  }

  .alert-success__message {
    font-size: 0.92rem;
    line-height: 1.6;
  }

  .alert-success__actions {
    margin-top: 1.35rem;
  }
}
</style>

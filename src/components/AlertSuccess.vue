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
    @update:visible="handleClose"
  >
    <div class="flex flex-col items-center text-center">
      <div class="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
        <i class="pi pi-check text-3xl" />
      </div>
      <h3 class="text-xl font-extrabold text-slate-900">{{ resolvedTitle }}</h3>
      <p class="mt-2 text-[15px] leading-relaxed text-slate-500">{{ resolvedMessage }}</p>
      <Button class="mt-8 w-full" type="button" variant="success" @click="handleClose">
        {{ resolvedButtonText }}
      </Button>
    </div>
  </Dialog>
</template>

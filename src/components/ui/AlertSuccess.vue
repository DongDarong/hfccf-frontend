<script setup>
import { computed, onUnmounted, watch } from 'vue'
import { useLanguage } from '../../composables/useLanguage'

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
    default: 0, // 0 means no auto-close, otherwise milliseconds
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
    if (newShow && props.autoClose > 0) {
      // Auto-dismiss is opt-in and controlled by millisecond prop.
      timeout = setTimeout(handleClose, props.autoClose)
    } else if (!newShow) {
      if (timeout) clearTimeout(timeout)
    }
  },
)

onUnmounted(() => {
  if (timeout) clearTimeout(timeout)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px]" @click="handleClose" />

        <!-- Modal Content -->
        <Transition
          enter-active-class="transition duration-500 ease-out"
          enter-from-class="opacity-0 scale-90 translate-y-8"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="show"
            class="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-8 text-center shadow-2xl transition-all"
          >
            <!-- Success Icon with Animation Container -->
            <div class="mb-6 flex justify-center">
              <div
                class="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500"
              >
                <!-- Outer Ring Animation -->
                <div
                  class="absolute inset-0 animate-ping rounded-full bg-emerald-100 opacity-20"
                ></div>

                <svg
                  class="h-10 w-10 relative z-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="3"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                    class="path-check"
                  />
                </svg>
              </div>
            </div>

            <div class="space-y-2">
              <h3 class="text-xl font-extrabold text-slate-900">{{ resolvedTitle }}</h3>
              <p class="text-[15px] leading-relaxed text-slate-500">{{ resolvedMessage }}</p>
            </div>

            <div class="mt-8">
              <button
                type="button"
                class="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-600 hover:shadow-emerald-300 active:scale-[0.98]"
                @click="handleClose"
              >
                {{ resolvedButtonText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.path-check {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: dash 0.6s ease-in-out forwards;
  animation-delay: 0.2s;
}

@keyframes dash {
  from {
    stroke-dashoffset: 100;
  }
  to {
    stroke-dashoffset: 0;
  }
}
</style>

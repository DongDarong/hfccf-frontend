<script setup>
import { computed } from 'vue'
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
})

defineEmits(['close'])

const { t } = useLanguage()

const resolvedTitle = computed(() => props.title || t('common.errorOccurred'))
const resolvedMessage = computed(() => props.message || t('common.errorTryAgain'))
const resolvedButtonText = computed(() => props.buttonText || t('common.close'))
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
      <div v-if="show" class="fixed inset-0 z-[120] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px]" @click="$emit('close')" />

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
            <!-- Error Icon Container -->
            <div class="mb-6 flex justify-center">
              <div class="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-[var(--hope-p-vibrant-red)]">
                <!-- Pulse Effect -->
                <div class="absolute inset-0 animate-pulse rounded-full bg-red-100 opacity-40"></div>
                
                <svg
                  class="h-10 w-10 relative z-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
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
                class="inline-flex w-full items-center justify-center rounded-2xl bg-[var(--hope-p-vibrant-red)] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-100 transition-all hover:brightness-90 hover:shadow-red-200 active:scale-[0.98]"
                @click="$emit('close')"
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

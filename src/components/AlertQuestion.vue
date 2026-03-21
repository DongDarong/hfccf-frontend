<script setup>
import { computed } from 'vue'
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
  confirmText: {
    type: String,
    default: '',
  },
  cancelText: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'danger', // 'danger' | 'warning' | 'info'
  },
})

defineEmits(['confirm', 'cancel'])
const { t } = useLanguage()

// Provide sane translated defaults while still supporting per-usage custom copy.
const resolvedTitle = computed(() => props.title || t('common.areYouSure'))
const resolvedMessage = computed(() => props.message || t('common.actionCannotBeUndone'))
const resolvedConfirmText = computed(() => props.confirmText || t('common.confirm'))
const resolvedCancelText = computed(() => props.cancelText || t('common.cancel'))
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
      <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" @click="$emit('cancel')" />

        <!-- Modal Content -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="show"
            class="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all"
          >
            <!-- Icon / Header -->
            <div class="mb-4 flex items-center gap-4">
              <div
                class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
                :class="{
                  'bg-red-50 text-red-600': type === 'danger',
                  'bg-amber-50 text-amber-600': type === 'warning',
                  'bg-blue-50 text-blue-600': type === 'info',
                }"
              >
                <svg
                  v-if="type === 'danger' || type === 'warning'"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-slate-900">{{ resolvedTitle }}</h3>
                <p class="text-sm text-slate-500">{{ resolvedMessage }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                class="inline-flex w-full items-center justify-center rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-200 sm:w-auto"
                @click="$emit('cancel')"
              >
                {{ resolvedCancelText }}
              </button>
              <button
                type="button"
                class="inline-flex w-full items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all sm:w-auto"
                :class="{
                  'bg-red-600 hover:bg-red-700 shadow-red-200': type === 'danger',
                  'bg-amber-600 hover:bg-amber-700 shadow-amber-200': type === 'warning',
                  'bg-blue-600 hover:bg-blue-700 shadow-blue-200': type === 'info',
                }"
                @click="$emit('confirm')"
              >
                {{ resolvedConfirmText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>



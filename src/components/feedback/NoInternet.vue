<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import Button from '@/components/buttons/Button.vue'

defineOptions({
  name: 'NoInternetState',
})

const props = defineProps({
  showWhenOnline: {
    type: Boolean,
    default: false,
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'No Internet Connection',
  },
  message: {
    type: String,
    default: 'Please check your network and try again.',
  },
  buttonText: {
    type: String,
    default: 'Try Again',
  },
})

const emit = defineEmits(['retry', 'online', 'offline'])
const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true)

// Inverse mode lets this component render online state banners when needed.
const shouldShow = computed(() => (props.showWhenOnline ? isOnline.value : !isOnline.value))

function syncConnectionStatus() {
  if (typeof navigator === 'undefined') return
  const next = navigator.onLine
  if (next === isOnline.value) return
  isOnline.value = next
  emit(next ? 'online' : 'offline')
}

function onRetry() {
  syncConnectionStatus()
  emit('retry', isOnline.value)
}

onMounted(() => {
  syncConnectionStatus()
  window.addEventListener('online', syncConnectionStatus)
  window.addEventListener('offline', syncConnectionStatus)
})

onBeforeUnmount(() => {
  window.removeEventListener('online', syncConnectionStatus)
  window.removeEventListener('offline', syncConnectionStatus)
})
</script>

<template>
  <section
    v-if="shouldShow"
    class="w-full p-4"
    :class="fullscreen ? 'grid min-h-screen place-items-center bg-[var(--color-surface)]' : ''"
    role="status"
    aria-live="polite"
  >
    <div
      class="mx-auto max-w-[420px] rounded-2xl border border-rose-200 bg-white p-5 text-center shadow-[0_10px_24px_rgba(237,28,36,0.08)]"
    >
      <div
        class="mx-auto mb-3 inline-grid h-12 w-12 place-items-center rounded-full bg-rose-50 text-hope-red"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8.53 16.11a6 6 0 016.95 0M5.76 13.34a10 10 0 0112.48 0M3 10.58a14 14 0 0118 0M1 1l22 22"
          />
        </svg>
      </div>

      <h3 class="m-0 text-lg font-extrabold text-surface-900">{{ title }}</h3>
      <p class="mt-2 mb-4 text-[0.92rem] text-surface-600">{{ message }}</p>

      <Button type="button" class="mt-2" block @click="onRetry">
        {{ buttonText }}
      </Button>
    </div>
  </section>
</template>




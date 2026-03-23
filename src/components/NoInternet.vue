<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import Button from '@/components/Button.vue'

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
    class="no-internet"
    :class="{ 'no-internet--fullscreen': fullscreen }"
    role="status"
    aria-live="polite"
  >
    <div class="no-internet__card">
      <div class="no-internet__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8.53 16.11a6 6 0 016.95 0M5.76 13.34a10 10 0 0112.48 0M3 10.58a14 14 0 0118 0M1 1l22 22"
          />
        </svg>
      </div>

      <h3 class="no-internet__title">{{ title }}</h3>
      <p class="no-internet__message">{{ message }}</p>

      <Button type="button" class="mt-2" block @click="onRetry">
        {{ buttonText }}
      </Button>
    </div>
  </section>
</template>

<style scoped>
.no-internet {
  width: 100%;
  padding: 1rem;
}

.no-internet--fullscreen {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: var(--hope-background-light);
}

.no-internet__card {
  max-width: 420px;
  margin-inline: auto;
  border: 1px solid #f9c4c6;
  background: #fff;
  border-radius: 1rem;
  padding: 1.25rem;
  text-align: center;
  box-shadow: 0 10px 24px rgba(237, 28, 36, 0.08);
}

.no-internet__icon {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 0.75rem;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: var(--hope-p-vibrant-red);
  background: #fff0f1;
}

.no-internet__icon svg {
  width: 1.5rem;
  height: 1.5rem;
}

.no-internet__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 800;
  color: #20232a;
}

.no-internet__message {
  margin: 0.5rem 0 1rem;
  font-size: 0.92rem;
  color: #4b5563;
}
</style>



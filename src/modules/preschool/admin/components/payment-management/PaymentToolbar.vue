<script setup>
import Button from '@/components/buttons/Button.vue'

defineOptions({
  name: 'PaymentToolbar',
})

defineProps({
  eyebrow: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  clearLabel: {
    type: String,
    default: 'Clear',
  },
})

defineEmits(['clear'])
</script>

<template>
  <div class="payment-toolbar">
    <div>
      <p class="payment-toolbar__eyebrow">{{ eyebrow }}</p>
      <h2 class="payment-toolbar__title">{{ title }}</h2>
    </div>

    <Button type="button" variant="outline" size="md" rounded="xl" @click="$emit('clear')">
      {{ clearLabel }}
    </Button>
  </div>
</template>

<style scoped>
.payment-toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.payment-toolbar__eyebrow {
  margin: 0;
  color: #64748b;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.payment-toolbar__title {
  margin: 0.35rem 0 0;
  color: #0f172a;
  font-size: 1.2rem;
  font-weight: 900;
  line-height: 1.25;
}

@media (max-width: 640px) {
  .payment-toolbar {
    flex-direction: column;
  }
}
</style>

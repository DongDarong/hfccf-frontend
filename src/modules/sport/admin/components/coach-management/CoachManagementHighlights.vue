<script setup>
defineOptions({
  name: 'CoachManagementHighlights',
})

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  isKh: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div :class="isKh ? 'coach-highlights coach-highlights--kh' : 'coach-highlights'">
    <div v-for="item in items" :key="item.label" class="coach-highlights__item">
      <span class="coach-highlights__label">{{ item.label }}</span>
      <strong class="coach-highlights__value">{{ item.value }}</strong>
    </div>
  </div>
</template>

<style scoped>
.coach-highlights {
  display: grid;
  gap: 0.85rem;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.coach-highlights__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  background: rgba(255, 255, 255, 0.82);
}

.coach-highlights__label {
  color: #475569;
  font-size: 0.82rem;
  font-weight: 600;
}

.coach-highlights__value {
  color: #0f172a;
  font-size: 1.05rem;
  font-weight: 800;
}

.coach-highlights--kh .coach-highlights__label {
  font-family:
    'Noto Sans Khmer', 'Khmer OS Siemreap', 'Khmer OS Battambang', 'Leelawadee UI', sans-serif;
  font-size: 0.92rem;
  line-height: 1.65;
}
</style>

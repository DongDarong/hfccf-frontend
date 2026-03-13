<script setup>
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/layout/HeaderSection.vue'

defineOptions({
  name: 'RoleDashboardLayout',
})

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <MainLayout>
    <section class="dashboard-page">
      <HeaderSection :title="props.title" :subtitle="props.subtitle" />
    </section>
  </MainLayout>
</template>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>

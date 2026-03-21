<script setup>
import MainLayout from '@/layouts/MainLayout.vue'
</script>

<template>
  <MainLayout>
    <template #default>
      <section class="admin-layout-shell">
        <slot />
      </section>
    </template>
  </MainLayout>
</template>

<style scoped>
.admin-layout-shell {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
</style>

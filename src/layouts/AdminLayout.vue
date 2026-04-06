<script setup>
import MainLayout from '@/layouts/MainLayout.vue'
</script>

<template>
  <MainLayout>
    <template #default>
      <section class="flex flex-col gap-5">
        <slot />
      </section>
    </template>
  </MainLayout>
</template>

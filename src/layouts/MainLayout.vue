<script setup>
import { RouterView } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
</script>

<template>
  <div class="app-shell">
    <Navbar />

    <div class="app-body">
      <Sidebar class="app-sidebar" />

      <main class="app-main">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-body {
  display: grid;
  grid-template-columns: 260px 1fr;
  flex: 1;
  min-height: 0;
}

.app-sidebar {
  min-height: 100%;
}

.app-main {
  padding: 1.5rem;
}

@media (max-width: 900px) {
  .app-body {
    grid-template-columns: 1fr;
  }

  .app-sidebar {
    border-right: 0;
    border-bottom: 1px solid #dbe1e8;
  }
}
</style>

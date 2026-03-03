<script setup>
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <aside class="sidebar">
    <h2 class="sidebar-title">{{ t('nav.navigation') }}</h2>

    <nav class="sidebar-nav">
      <RouterLink to="/">{{ t('nav.dashboard') }}</RouterLink>
      <RouterLink to="/about">{{ t('nav.about') }}</RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  background: #ffffff;
  border-right: 1px solid #dbe1e8;
  padding: 1rem;
}

.sidebar-title {
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #4b5563;
  margin: 0 0 0.75rem;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sidebar-nav a {
  text-decoration: none;
  color: #1d1d1b;
  padding: 0.5rem 0.625rem;
  border-radius: 8px;
}

.sidebar-nav a.router-link-exact-active {
  background: #8dc63f;
  color: #1d1d1b;
  font-weight: 600;
}
</style>

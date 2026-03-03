<script setup>
import { RouterLink } from 'vue-router'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const currentLocale = computed({
  get: () => locale.value,
  set: (value) => {
    locale.value = value
    localStorage.setItem('locale', value)
  },
})
</script>

<template>
  <header class="navbar">
    <div class="brand">{{ t('app.brand') }}</div>

    <div class="navbar-actions">
      <nav class="navbar-links">
        <RouterLink to="/">{{ t('nav.home') }}</RouterLink>
        <RouterLink to="/about">{{ t('nav.about') }}</RouterLink>
      </nav>

      <label class="locale-switcher">
        <span>{{ t('app.language') }}</span>
        <select v-model="currentLocale">
          <option value="en">EN</option>
          <option value="kh">KH</option>
        </select>
      </label>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1rem;
  background: #ffffff;
  border-bottom: 1px solid #dbe1e8;
}

.brand {
  font-weight: 700;
  letter-spacing: 0.02em;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar-links {
  display: flex;
  gap: 0.75rem;
}

.navbar-links a {
  text-decoration: none;
  color: #1d1d1b;
  padding: 0.375rem 0.625rem;
  border-radius: 8px;
}

.navbar-links a.router-link-exact-active {
  background: #00aeef;
  color: #ffffff;
}

.locale-switcher {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.locale-switcher select {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.3rem 0.5rem;
  background: #ffffff;
}

@media (max-width: 760px) {
  .navbar {
    flex-direction: column;
    align-items: stretch;
  }

  .navbar-actions {
    justify-content: space-between;
    width: 100%;
  }
}
</style>

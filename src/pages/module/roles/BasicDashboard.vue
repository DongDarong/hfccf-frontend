<script setup>
import { useI18n } from 'vue-i18n'
import RoleDashboardLayout from './RoleDashboardLayout.vue'

const { t } = useI18n()
const cards = [{ title: 'Dashboard access', value: 'Active', label: 'Limited overview', status: 'info' }]
</script>

<template>
  <RoleDashboardLayout
    :title="t('nav.dashboard')"
    :subtitle="t('pages.homeDescription')"
    :cards="cards"
    spotlight-title="Welcome"
    spotlight-text="Your role has basic dashboard access. Contact a Super Admin for expanded modules."
    :actions="['Review your assigned tasks']"
  />
</template>

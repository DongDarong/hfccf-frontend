<script setup>
import { RouterLink } from 'vue-router'
import PreschoolDashboardActivity from '@/modules/preschool/admin/components/dashboard/PreschoolDashboardActivity.vue'
import AppButton from '@/components/ui/AppButton.vue'

defineOptions({
  name: 'DashboardOperationsSection',
})

defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  recentActivityItems: {
    type: Array,
    default: () => [],
  },
  recentActivityEmptyText: {
    type: String,
    default: '',
  },
  recentActivityViewAllText: {
    type: String,
    default: '',
  },
  recentActivityViewAllTo: {
    type: [String, Object],
    default: null,
  },
  upcomingSchedulesTitle: {
    type: String,
    required: true,
  },
  upcomingSchedulesSubtitle: {
    type: String,
    required: true,
  },
  upcomingSchedulesEmptyText: {
    type: String,
    default: '',
  },
  upcomingSchedulesViewAllText: {
    type: String,
    default: '',
  },
  upcomingSchedulesViewAllTo: {
    type: [String, Object],
    default: null,
  },
  classroomSummaryTitle: {
    type: String,
    required: true,
  },
  classroomSummarySubtitle: {
    type: String,
    required: true,
  },
  classroomSummaryViewAllText: {
    type: String,
    default: '',
  },
  classroomSummaryViewAllTo: {
    type: [String, Object],
    default: null,
  },
  shortcutsTitle: {
    type: String,
    required: true,
  },
  shortcutsSubtitle: {
    type: String,
    required: true,
  },
  upcomingClasses: {
    type: Array,
    default: () => [],
  },
  classroomSummaryItems: {
    type: Array,
    default: () => [],
  },
  shortcutActions: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="preschool-dashboard-page__section">
    <div class="preschool-dashboard-page__section-header">
      <div>
        <h2 class="preschool-dashboard-page__section-title">{{ title }}</h2>
        <p class="preschool-dashboard-page__section-subtitle">{{ subtitle }}</p>
      </div>
    </div>
    <div class="preschool-dashboard-page__operations-grid">
      <PreschoolDashboardActivity
        :items="recentActivityItems"
        :empty-text="recentActivityEmptyText"
        :max-items="3"
        :view-all-text="recentActivityViewAllText"
        :view-all-to="recentActivityViewAllTo"
      />

      <article class="preschool-dashboard-page__panel">
        <div class="preschool-dashboard-page__panel-header">
          <div>
            <h3 class="preschool-dashboard-page__panel-title">{{ upcomingSchedulesTitle }}</h3>
            <p class="preschool-dashboard-page__panel-subtitle">{{ upcomingSchedulesSubtitle }}</p>
          </div>
          <RouterLink
            :to="upcomingSchedulesViewAllTo"
            class="preschool-dashboard-page__panel-link"
          >
            {{ upcomingSchedulesViewAllText }}
          </RouterLink>
        </div>
        <div v-if="upcomingClasses.length === 0" class="preschool-dashboard-page__empty">
          {{ upcomingSchedulesEmptyText }}
        </div>
        <div v-else class="preschool-dashboard-page__class-list">
          <article
            v-for="item in upcomingClasses"
            :key="item.title"
            class="preschool-dashboard-page__class-item"
          >
            <div>
              <p class="preschool-dashboard-page__class-title">{{ item.title }}</p>
              <p class="preschool-dashboard-page__class-text">{{ item.text }}</p>
            </div>
            <span class="preschool-dashboard-page__class-count">{{ item.students }}</span>
          </article>
        </div>
      </article>

      <article class="preschool-dashboard-page__panel">
        <div class="preschool-dashboard-page__panel-header">
          <div>
            <h3 class="preschool-dashboard-page__panel-title">{{ classroomSummaryTitle }}</h3>
            <p class="preschool-dashboard-page__panel-subtitle">{{ classroomSummarySubtitle }}</p>
          </div>
          <RouterLink
            :to="classroomSummaryViewAllTo"
            class="preschool-dashboard-page__panel-link"
          >
            {{ classroomSummaryViewAllText }}
          </RouterLink>
        </div>
        <div class="preschool-dashboard-page__summary-grid">
          <article
            v-for="item in classroomSummaryItems"
            :key="item.label"
            class="preschool-dashboard-page__summary-item"
          >
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </article>
        </div>
      </article>

      <article class="preschool-dashboard-page__panel">
        <div class="preschool-dashboard-page__panel-header">
          <div>
            <h3 class="preschool-dashboard-page__panel-title">{{ shortcutsTitle }}</h3>
            <p class="preschool-dashboard-page__panel-subtitle">{{ shortcutsSubtitle }}</p>
          </div>
        </div>
        <div class="preschool-dashboard-page__shortcut-grid">
          <AppButton
            v-for="shortcut in shortcutActions"
            :key="shortcut.label"
            type="button"
            variant="outline"
            size="sm"
            rounded="xl"
            @click="shortcut.click"
          >
            {{ shortcut.label }}
          </AppButton>
        </div>
      </article>
    </div>
  </section>
</template>

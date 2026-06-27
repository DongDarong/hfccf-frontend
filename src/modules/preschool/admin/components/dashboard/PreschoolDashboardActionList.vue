<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import StatusBadge from '@/components/badges/StatusBadge.vue'

defineOptions({
  name: 'PreschoolDashboardActionList',
})

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    default: () => [],
  },
  emptyText: {
    type: String,
    default: '',
  },
})

const normalizedItems = computed(() =>
  (Array.isArray(props.items) ? props.items : []).map((item) => (
    typeof item === 'string'
      ? {
        label: item,
        detail: '',
        value: '',
        tone: 'info',
        priority: '',
        priorityLabel: '',
        actionLabel: '',
        actionTo: null,
      }
      : {
        label: item.label || item.title || '',
        detail: item.detail || item.text || '',
        value: item.value ?? '',
        tone: item.tone || 'info',
        priority: item.priority || '',
        priorityLabel: item.priorityLabel || item.priority || '',
        actionLabel: item.actionLabel || '',
        actionTo: item.actionTo || null,
      }
  )),
)
</script>

<template>
  <section class="preschool-dashboard-action-list">
    <div class="preschool-dashboard-action-list__header">
      <h3 class="preschool-dashboard-action-list__title">{{ props.title }}</h3>
      <span class="preschool-dashboard-action-list__count">{{ normalizedItems.length }}</span>
    </div>
    <div v-if="normalizedItems.length === 0" class="preschool-dashboard-action-list__empty">
      {{ props.emptyText }}
    </div>
    <ul v-else class="preschool-dashboard-action-list__list">
      <li
        v-for="item in normalizedItems"
        :key="`${item.label}-${item.detail}-${item.value}`"
        class="preschool-dashboard-action-list__item"
        :data-tone="item.tone"
      >
        <span class="preschool-dashboard-action-list__bullet" aria-hidden="true"></span>
        <div class="preschool-dashboard-action-list__content">
          <div class="preschool-dashboard-action-list__meta">
            <span class="preschool-dashboard-action-list__label">{{ item.label }}</span>
            <StatusBadge
              v-if="item.priorityLabel"
              :status="item.tone"
              :label="item.priorityLabel"
              :translate-label="false"
              size="sm"
              :dot="false"
            />
          </div>
          <span v-if="item.detail" class="preschool-dashboard-action-list__detail">{{ item.detail }}</span>
          <RouterLink
            v-if="item.actionTo"
            :to="item.actionTo"
            class="preschool-dashboard-action-list__action"
          >
            {{ item.actionLabel }}
          </RouterLink>
        </div>
        <span v-if="item.value !== ''" class="preschool-dashboard-action-list__value">{{ item.value }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.preschool-dashboard-action-list {
  padding: 1.35rem;
  border-radius: 1.35rem;
  border: 1px solid #dbe6f2;
  background: #ffffff;
  box-shadow: 0 18px 45px -36px rgba(15, 23, 42, 0.45);
}

.preschool-dashboard-action-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.preschool-dashboard-action-list__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
}

.preschool-dashboard-action-list__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  min-height: 2rem;
  padding: 0 0.6rem;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.84rem;
  font-weight: 800;
}

.preschool-dashboard-action-list__list {
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.preschool-dashboard-action-list__item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  color: #334155;
  line-height: 1.6;
  padding: 0.85rem 0.95rem;
  border-radius: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.preschool-dashboard-action-list__bullet {
  width: 0.7rem;
  height: 0.7rem;
  margin-top: 0.35rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%);
  flex-shrink: 0;
}

.preschool-dashboard-action-list__content {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
  min-width: 0;
}

.preschool-dashboard-action-list__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.preschool-dashboard-action-list__label {
  color: #0f172a;
  font-weight: 700;
}

.preschool-dashboard-action-list__detail {
  color: #64748b;
  font-size: 0.9rem;
}

.preschool-dashboard-action-list__action {
  align-self: flex-start;
  color: #1d4ed8;
  font-size: 0.86rem;
  font-weight: 800;
  text-decoration: none;
}

.preschool-dashboard-action-list__action:hover {
  text-decoration: underline;
}

.preschool-dashboard-action-list__value {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.6rem;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.85rem;
  font-weight: 800;
}

.preschool-dashboard-action-list__empty {
  margin-top: 1rem;
  color: #64748b;
  font-size: 0.92rem;
}
</style>

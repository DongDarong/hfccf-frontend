<script setup>
import { RouterLink } from 'vue-router'

defineOptions({ name: 'PreschoolFormsDashboardCard' })

defineProps({
  card: {
    type: Object,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  workspace: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <RouterLink
    :to="card.route"
    class="forms-dashboard-card"
    :class="`forms-dashboard-card--${card.accent}`"
    :aria-label="`${title}. ${description}`"
  >
    <span class="forms-dashboard-card__icon">
      <i :class="['pi', card.icon]" aria-hidden="true" />
    </span>

    <span class="forms-dashboard-card__content">
      <span class="forms-dashboard-card__workspace">{{ workspace }}</span>
      <span class="forms-dashboard-card__title">{{ title }}</span>
      <span class="forms-dashboard-card__description">{{ description }}</span>
    </span>

    <i class="pi pi-arrow-right forms-dashboard-card__arrow" aria-hidden="true" />
  </RouterLink>
</template>

<style scoped>
.forms-dashboard-card {
  position: relative;
  overflow: hidden;
  display: flex;
  min-height: 11.5rem;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 1.25rem;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 1), rgba(248, 250, 252, 0.9));
  box-shadow: 0 18px 42px -30px rgba(15, 23, 42, 0.42);
  color: inherit;
  text-align: left;
  text-decoration: none;
  transition:
    transform 0.14s ease,
    box-shadow 0.14s ease,
    border-color 0.14s ease;
}

.forms-dashboard-card::after {
  position: absolute;
  right: -2.5rem;
  bottom: -3.5rem;
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  background: currentColor;
  content: '';
  opacity: 0.025;
  transition: transform 0.2s ease;
}

.forms-dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 48px -28px rgba(15, 23, 42, 0.4);
}

.forms-dashboard-card:hover::after {
  transform: scale(1.15);
}

.forms-dashboard-card:focus-visible {
  outline: 3px solid rgba(79, 70, 229, 0.3);
  outline-offset: 3px;
}

.forms-dashboard-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.9rem;
  flex: none;
  font-size: 1.15rem;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.55);
}

.forms-dashboard-card__content {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 0.32rem;
}

.forms-dashboard-card__workspace {
  color: #94a3b8;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.065em;
  text-transform: uppercase;
}

.forms-dashboard-card__title {
  color: #0f172a;
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.35;
}

.forms-dashboard-card__description {
  color: #64748b;
  font-size: 0.8rem;
  line-height: 1.5;
}

.forms-dashboard-card__arrow {
  align-self: flex-end;
  flex: none;
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  background: #fff;
  color: #94a3b8;
  font-size: 0.7rem;
  transition:
    color 0.14s ease,
    transform 0.14s ease,
    border-color 0.14s ease;
}

.forms-dashboard-card:hover .forms-dashboard-card__arrow {
  border-color: currentColor;
  color: inherit;
  transform: translateX(3px);
}

@media (max-width: 580px) {
  .forms-dashboard-card {
    min-height: 9.5rem;
    padding: 1rem;
  }
}

.forms-dashboard-card--violet .forms-dashboard-card__icon { background: #ede9fe; color: #6d28d9; }
.forms-dashboard-card--violet:hover { border-color: #c4b5fd; }
.forms-dashboard-card--sky .forms-dashboard-card__icon { background: #e0f2fe; color: #0369a1; }
.forms-dashboard-card--sky:hover { border-color: #7dd3fc; }
.forms-dashboard-card--emerald .forms-dashboard-card__icon { background: #d1fae5; color: #047857; }
.forms-dashboard-card--emerald:hover { border-color: #6ee7b7; }
.forms-dashboard-card--amber .forms-dashboard-card__icon { background: #fef3c7; color: #92400e; }
.forms-dashboard-card--amber:hover { border-color: #fcd34d; }
.forms-dashboard-card--indigo .forms-dashboard-card__icon { background: #e0e7ff; color: #4338ca; }
.forms-dashboard-card--indigo:hover { border-color: #a5b4fc; }
.forms-dashboard-card--green .forms-dashboard-card__icon { background: #dcfce7; color: #15803d; }
.forms-dashboard-card--green:hover { border-color: #86efac; }
.forms-dashboard-card--teal .forms-dashboard-card__icon { background: #ccfbf1; color: #0f766e; }
.forms-dashboard-card--teal:hover { border-color: #5eead4; }
.forms-dashboard-card--cyan .forms-dashboard-card__icon { background: #cffafe; color: #0e7490; }
.forms-dashboard-card--cyan:hover { border-color: #67e8f9; }
.forms-dashboard-card--rose .forms-dashboard-card__icon { background: #ffe4e6; color: #be123c; }
.forms-dashboard-card--rose:hover { border-color: #fda4af; }
.forms-dashboard-card--slate .forms-dashboard-card__icon { background: #f1f5f9; color: #475569; }
.forms-dashboard-card--slate:hover { border-color: #cbd5e1; }
</style>

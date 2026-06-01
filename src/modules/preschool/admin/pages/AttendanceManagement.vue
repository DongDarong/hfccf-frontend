<script setup>
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({ name: 'PreschoolAdminAttendanceManagementPage' })

const { t } = useLanguage()
const router = useRouter()

const CARDS = [
  {
    key: 'students',
    icon: 'pi-users',
    accent: 'card--violet',
    route: 'dashboard-preschool-admin-attendance-students',
  },
  {
    key: 'teachers',
    icon: 'pi-id-card',
    accent: 'card--sky',
    route: 'dashboard-preschool-admin-attendance-teachers',
  },
  {
    key: 'history',
    icon: 'pi-history',
    accent: 'card--slate',
    route: 'dashboard-preschool-admin-attendance-history',
  },
]
</script>

<template>
  <MainLayout>
    <section class="space-y-6">
      <HeaderSection
        :title="t('preschoolAttendanceHubPage.title')"
        :subtitle="t('preschoolAttendanceHubPage.subtitle')"
      />

      <div class="grid gap-4 sm:grid-cols-3">
        <button
          v-for="card in CARDS"
          :key="card.key"
          type="button"
          class="att-card"
          :class="card.accent"
          @click="router.push({ name: card.route })"
        >
          <div class="att-card__icon-wrap">
            <i :class="['pi', card.icon]" aria-hidden="true" />
          </div>
          <div class="att-card__body">
            <h3 class="att-card__title">{{ t(`preschoolAttendanceHubPage.cards.${card.key}.title`) }}</h3>
            <p class="att-card__desc">{{ t(`preschoolAttendanceHubPage.cards.${card.key}.description`) }}</p>
          </div>
          <i class="pi pi-arrow-right att-card__arrow" aria-hidden="true" />
        </button>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.att-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 1.25rem;
  border: 1px solid #e2e8f0;
  background: #fff;
  text-align: left;
  box-shadow: 0 14px 36px -28px rgba(15, 23, 42, 0.3);
  transition: transform 0.14s ease, box-shadow 0.14s ease, border-color 0.14s ease;
  cursor: pointer;
  width: 100%;
}

.att-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 48px -28px rgba(15, 23, 42, 0.4);
}

.att-card__icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 0.85rem;
  flex-shrink: 0;
  font-size: 1.15rem;
}

.att-card__body { flex: 1; min-width: 0; }

.att-card__title {
  margin: 0 0 0.3rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
}

.att-card__desc {
  margin: 0;
  font-size: 0.82rem;
  color: #64748b;
  line-height: 1.5;
}

.att-card__arrow {
  font-size: 0.8rem;
  color: #cbd5e1;
  align-self: center;
  flex-shrink: 0;
  transition: color 0.14s, transform 0.14s;
}

.att-card:hover .att-card__arrow { color: #94a3b8; transform: translateX(3px); }

.card--violet .att-card__icon-wrap { background: #ede9fe; color: #6d28d9; }
.card--violet:hover { border-color: #c4b5fd; }

.card--sky .att-card__icon-wrap { background: #e0f2fe; color: #0369a1; }
.card--sky:hover { border-color: #7dd3fc; }

.card--slate .att-card__icon-wrap { background: #f1f5f9; color: #475569; }
.card--slate:hover { border-color: #cbd5e1; }
</style>

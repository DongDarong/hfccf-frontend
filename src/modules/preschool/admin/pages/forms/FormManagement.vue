<script setup>
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'
import { FM_HUB_SECTIONS } from './formManagementData'

defineOptions({ name: 'PreschoolAdminFormManagementPage' })

const { t } = useLanguage()
const router = useRouter()
</script>

<template>
  <MainLayout>
    <section class="fm-page">
      <HeaderSection
        :title="t('preschoolScaffold.formManagement.hub.title')"
        :subtitle="t('preschoolScaffold.formManagement.hub.subtitle')"
      />

      <div class="fm-sections">
        <div
          v-for="section in FM_HUB_SECTIONS"
          :key="section.id"
          class="fm-section"
        >
          <header class="fm-section__header">
            <span class="fm-section__label">{{ t(section.labelKey) }}</span>
            <span class="fm-section__sep" aria-hidden="true" />
            <span class="fm-section__caption">{{ t(section.captionKey) }}</span>
          </header>

          <div class="fm-grid">
            <button
              v-for="card in section.cards"
              :key="card.key"
              type="button"
              class="fm-card"
              :class="`fm-card--${card.accent}`"
              @click="router.push(card.route)"
            >
              <span class="fm-card__icon-wrap">
                <i :class="['pi', card.icon]" aria-hidden="true" />
              </span>

              <span class="fm-card__body">
                <span class="fm-card__title">{{ t(card.titleKey) }}</span>
                <span class="fm-card__desc">{{ t(card.descriptionKey) }}</span>
              </span>

              <i class="pi pi-arrow-right fm-card__arrow" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
/* ─── Page shell ─────────────────────────────────────────── */
.fm-page {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.fm-sections {
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
  padding-top: 0.75rem;
}

/* ─── Section header ────────────────────────────────────── */
.fm-section__header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.875rem;
}

.fm-section__label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.075em;
  text-transform: uppercase;
  color: #94a3b8;
  white-space: nowrap;
}

.fm-section__sep {
  flex: 1;
  height: 1px;
  background: #f1f5f9;
}

.fm-section__caption {
  font-size: 0.75rem;
  color: #cbd5e1;
  white-space: nowrap;
}

/* ─── Responsive card grid ──────────────────────────────── */
.fm-grid {
  display: grid;
  gap: 0.875rem;
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 1100px) {
  .fm-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 580px) {
  .fm-grid { grid-template-columns: 1fr; }
  .fm-section__sep,
  .fm-section__caption { display: none; }
}

/* ─── Card base ─────────────────────────────────────────── */
.fm-card {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem 1.05rem 1rem 1.05rem;
  min-height: 7.75rem;
  border-radius: 1.125rem;
  border: 1px solid #e2e8f0;
  background: #fff;
  text-align: left;
  width: 100%;
  cursor: pointer;
  position: relative;
  box-shadow:
    0 1px 2px 0 rgba(15, 23, 42, 0.04),
    0 4px 16px -8px rgba(15, 23, 42, 0.1);
  transition:
    transform     0.15s ease,
    box-shadow    0.15s ease,
    border-color  0.15s ease;
}

.fm-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 4px 6px -2px rgba(15, 23, 42, 0.06),
    0 16px 36px -12px rgba(15, 23, 42, 0.18);
}

.fm-card:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}

/* ─── Card icon ─────────────────────────────────────────── */
.fm-card__icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.875rem;
  flex-shrink: 0;
  font-size: 1.05rem;
}

/* ─── Card body ─────────────────────────────────────────── */
.fm-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
  min-width: 0;
}

.fm-card__title {
  display: block;
  font-size: 0.875rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
}

.fm-card__desc {
  display: block;
  font-size: 0.775rem;
  color: #64748b;
  line-height: 1.55;
}

/* ─── Arrow ─────────────────────────────────────────────── */
.fm-card__arrow {
  font-size: 0.7rem;
  color: #cbd5e1;
  flex-shrink: 0;
  transition: transform 0.15s ease, color 0.15s ease;
}

.fm-card:hover .fm-card__arrow {
  transform: translateX(3px);
  color: #94a3b8;
}

/* ─── Color accents ─────────────────────────────────────── */
/* purple */
.fm-card--purple .fm-card__icon-wrap { background: #f3e8ff; color: #7c3aed; }
.fm-card--purple:hover { border-color: #c4b5fd; }

/* blue */
.fm-card--blue .fm-card__icon-wrap { background: #dbeafe; color: #1d4ed8; }
.fm-card--blue:hover { border-color: #93c5fd; }

/* green */
.fm-card--green .fm-card__icon-wrap { background: #dcfce7; color: #15803d; }
.fm-card--green:hover { border-color: #86efac; }

/* orange */
.fm-card--orange .fm-card__icon-wrap { background: #ffedd5; color: #c2410c; }
.fm-card--orange:hover { border-color: #fdba74; }

/* indigo */
.fm-card--indigo .fm-card__icon-wrap { background: #e0e7ff; color: #3730a3; }
.fm-card--indigo:hover { border-color: #a5b4fc; }

/* amber */
.fm-card--amber .fm-card__icon-wrap { background: #fef3c7; color: #b45309; }
.fm-card--amber:hover { border-color: #fde68a; }

/* emerald */
.fm-card--emerald .fm-card__icon-wrap { background: #d1fae5; color: #065f46; }
.fm-card--emerald:hover { border-color: #6ee7b7; }

/* teal */
.fm-card--teal .fm-card__icon-wrap { background: #ccfbf1; color: #0f766e; }
.fm-card--teal:hover { border-color: #5eead4; }

/* cyan */
.fm-card--cyan .fm-card__icon-wrap { background: #cffafe; color: #0e7490; }
.fm-card--cyan:hover { border-color: #67e8f9; }

/* pink */
.fm-card--pink .fm-card__icon-wrap { background: #fce7f3; color: #be185d; }
.fm-card--pink:hover { border-color: #f9a8d4; }

/* gray */
.fm-card--gray .fm-card__icon-wrap { background: #f1f5f9; color: #475569; }
.fm-card--gray:hover { border-color: #cbd5e1; }

/* slate */
.fm-card--slate .fm-card__icon-wrap {
  background: #f8fafc;
  color: #334155;
  border: 1px solid #e8edf2;
}
.fm-card--slate:hover { border-color: #94a3b8; }
</style>

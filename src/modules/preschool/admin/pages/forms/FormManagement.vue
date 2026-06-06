<script setup>
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'
import FormsDashboardCard from '@/modules/preschool/admin/components/form-management/FormsDashboardCard.vue'
import { FM_HUB_SECTIONS } from './formManagementData'

defineOptions({ name: 'PreschoolAdminFormManagementPage' })

const { t } = useLanguage()
</script>

<template>
  <MainLayout>
    <section class="forms-dashboard">
      <HeaderSection
        :title="t('formsModuleDashboard.title')"
        :subtitle="t('formsModuleDashboard.subtitle')"
      />

      <div class="forms-dashboard__intro">
        <div class="forms-dashboard__intro-mark" aria-hidden="true">
          <i class="pi pi-file-edit" />
        </div>
        <div class="forms-dashboard__intro-copy">
          <span class="forms-dashboard__eyebrow">{{ t('formsModuleDashboard.title') }}</span>
          <h2>{{ t('formsModuleDashboard.subtitle') }}</h2>
        </div>
        <div class="forms-dashboard__progress" aria-hidden="true">
          <span
            v-for="section in FM_HUB_SECTIONS"
            :key="section.id"
            :class="`forms-dashboard__progress-dot forms-dashboard__progress-dot--${section.id}`"
          >
            {{ section.step }}
          </span>
        </div>
      </div>

      <div class="forms-dashboard__workflow">
        <section
          v-for="section in FM_HUB_SECTIONS"
          :key="section.id"
          class="forms-dashboard__section"
          :class="`forms-dashboard__section--${section.id}`"
          :aria-labelledby="`forms-section-${section.id}`"
        >
          <header class="forms-dashboard__section-header">
            <span class="forms-dashboard__step">{{ section.step }}</span>
            <span class="forms-dashboard__section-copy">
              <span class="forms-dashboard__section-kicker">
                {{ t('formsModuleDashboard.step') }} {{ section.step }}
              </span>
              <h2 :id="`forms-section-${section.id}`">
                {{ t(section.labelKey) }}
              </h2>
              <p>{{ t(section.captionKey) }}</p>
            </span>
          </header>

          <div class="forms-dashboard__grid">
            <FormsDashboardCard
              v-for="card in section.cards"
              :key="card.key"
              :card="card"
              :title="t(card.titleKey)"
              :description="t(card.descriptionKey)"
              :workspace="t(section.workspaceKey)"
            />
          </div>

          <span
            v-if="section.step < FM_HUB_SECTIONS.length"
            class="forms-dashboard__connector"
            aria-hidden="true"
          >
            <i class="pi pi-arrow-right" />
          </span>
        </section>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.forms-dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.forms-dashboard__intro {
  position: relative;
  display: flex;
  overflow: hidden;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.4rem;
  border: 1px solid #dbeafe;
  border-radius: 1.35rem;
  background:
    radial-gradient(circle at 88% 10%, rgba(56, 189, 248, 0.16), transparent 28%),
    linear-gradient(135deg, #f8fbff 0%, #eff6ff 52%, #f8fafc 100%);
  box-shadow: 0 18px 45px -34px rgba(30, 64, 175, 0.55);
}

.forms-dashboard__intro::after {
  position: absolute;
  right: -2rem;
  bottom: -3.5rem;
  width: 10rem;
  height: 10rem;
  border: 1.75rem solid rgba(255, 255, 255, 0.55);
  border-radius: 50%;
  content: '';
}

.forms-dashboard__intro-mark {
  position: relative;
  z-index: 1;
  display: grid;
  width: 3.25rem;
  height: 3.25rem;
  place-items: center;
  border: 1px solid rgba(147, 197, 253, 0.7);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.82);
  color: #2563eb;
  flex: none;
  font-size: 1.25rem;
  box-shadow: 0 10px 25px -18px rgba(37, 99, 235, 0.8);
}

.forms-dashboard__intro-copy {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.forms-dashboard__eyebrow {
  color: #2563eb;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.forms-dashboard__intro-copy h2 {
  max-width: 52rem;
  margin: 0;
  color: #1e293b;
  font-size: clamp(0.95rem, 1.6vw, 1.15rem);
  font-weight: 700;
  line-height: 1.45;
}

.forms-dashboard__progress {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-left: auto;
  padding-right: 0.5rem;
}

.forms-dashboard__progress-dot {
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border: 1px solid currentColor;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.78);
  font-size: 0.7rem;
  font-weight: 800;
}

.forms-dashboard__progress-dot--manage { color: #7c3aed; }
.forms-dashboard__progress-dot--build { color: #059669; }
.forms-dashboard__progress-dot--review { color: #4f46e5; }

.forms-dashboard__workflow {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
}

.forms-dashboard__section {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

.forms-dashboard__section-header {
  display: flex;
  min-height: 4.65rem;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0 0.25rem;
}

.forms-dashboard__step {
  display: grid;
  width: 2.25rem;
  height: 2.25rem;
  place-items: center;
  border-radius: 0.75rem;
  flex: none;
  font-size: 0.78rem;
  font-weight: 800;
}

.forms-dashboard__section--manage .forms-dashboard__step {
  background: #ede9fe;
  color: #6d28d9;
}

.forms-dashboard__section--build .forms-dashboard__step {
  background: #d1fae5;
  color: #047857;
}

.forms-dashboard__section--review .forms-dashboard__step {
  background: #e0e7ff;
  color: #4338ca;
}

.forms-dashboard__section-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.forms-dashboard__section-kicker {
  margin-bottom: 0.1rem;
  color: #94a3b8;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.forms-dashboard__section-copy h2 {
  margin: 0;
  color: #1e293b;
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1.35;
}

.forms-dashboard__section-copy p {
  margin: 0.18rem 0 0;
  color: #64748b;
  font-size: 0.76rem;
  line-height: 1.45;
}

.forms-dashboard__grid {
  display: flex;
  flex: 1;
}

.forms-dashboard__connector {
  position: absolute;
  z-index: 2;
  top: 8.6rem;
  right: -0.9rem;
  display: grid;
  width: 1.8rem;
  height: 1.8rem;
  place-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  background: #fff;
  color: #94a3b8;
  font-size: 0.62rem;
  box-shadow: 0 7px 18px -12px rgba(15, 23, 42, 0.55);
}

@media (max-width: 960px) {
  .forms-dashboard__workflow {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .forms-dashboard__section-header {
    min-height: auto;
  }

  .forms-dashboard__connector {
    top: auto;
    right: 50%;
    bottom: -1.15rem;
    transform: translateX(50%) rotate(90deg);
  }
}

@media (max-width: 580px) {
  .forms-dashboard {
    gap: 1.15rem;
  }

  .forms-dashboard__intro {
    align-items: flex-start;
    padding: 1rem;
  }

  .forms-dashboard__intro-mark {
    width: 2.75rem;
    height: 2.75rem;
  }

  .forms-dashboard__progress {
    display: none;
  }
}
</style>

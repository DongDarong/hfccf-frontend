<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'
import { assessmentFormApi } from '@/modules/assessment/services/assessmentFormApi'

defineOptions({ name: 'PreschoolAdminFormManagementPage' })

const { t } = useLanguage()

const assessmentForms = ref([])
const isLoading = ref(false)

const CARDS = [
  {
    key: 'dashboard',
    icon: 'pi-chart-bar',
    accent: 'card--violet',
    to: { name: 'assessment-dashboard' },
  },
  {
    key: 'forms',
    icon: 'pi-book',
    accent: 'card--blue',
    to: { name: 'assessment-form-list' },
  },
  {
    key: 'newForm',
    icon: 'pi-plus-circle',
    accent: 'card--emerald',
    to: { name: 'assessment-form-create' },
  },
  {
    key: 'submissions',
    icon: 'pi-list',
    accent: 'card--amber',
    to: { name: 'assessment-submission-list' },
  },
  {
    key: 'wizard',
    icon: 'pi-star',
    accent: 'card--indigo',
    to: { name: 'assessment-wizard' },
  },
  {
    key: 'scoring',
    icon: 'pi-sliders-h',
    accent: 'card--orange',
    requiresFormId: true,
    routeName: 'assessment-scoring',
  },
  {
    key: 'printDesigner',
    icon: 'pi-print',
    accent: 'card--rose',
    requiresFormId: true,
    routeName: 'assessment-print-designer',
  },
  {
    key: 'reports',
    icon: 'pi-chart-line',
    accent: 'card--sky',
    to: { name: 'assessment-reports' },
  },
  {
    key: 'auditLogs',
    icon: 'pi-history',
    accent: 'card--slate',
    to: { name: 'assessment-audit-logs' },
  },
]

const primaryFormId = computed(() => String(assessmentForms.value[0]?.id || '').trim())
const formCount = computed(() => assessmentForms.value.length)

const cards = computed(() =>
  CARDS.map((card) => {
    const titleKey = `preschoolScaffold.formManagement.cards.${card.key}.title`
    const descKey = `preschoolScaffold.formManagement.cards.${card.key}.description`
    const to = card.requiresFormId
      ? primaryFormId.value
        ? { name: card.routeName, params: { id: primaryFormId.value } }
        : { name: 'assessment-form-list' }
      : card.to
    return { ...card, title: t(titleKey), description: t(descKey), to }
  }),
)

async function loadAssessmentForms() {
  isLoading.value = true
  try {
    const response = await assessmentFormApi.list({ page: 1, perPage: 5, search: '', status: '' })
    assessmentForms.value = Array.isArray(response?.data) ? response.data : response?.items || []
  } catch {
    assessmentForms.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  void loadAssessmentForms()
})
</script>

<template>
  <MainLayout>
    <section class="fm-page">
      <HeaderSection
        :title="t('preschoolScaffold.formManagement.title')"
        :subtitle="t('preschoolScaffold.formManagement.subtitle')"
      />

      <!-- Forms availability banner -->
      <div v-if="!isLoading" class="fm-banner" :class="formCount ? 'fm-banner--info' : 'fm-banner--warn'">
        <i :class="['pi', formCount ? 'pi-check-circle' : 'pi-exclamation-triangle', 'fm-banner__icon']" />
        <span>
          {{
            formCount
              ? t('preschoolScaffold.formManagement.formsAvailable', { count: formCount })
              : t('preschoolScaffold.formManagement.noForms')
          }}
        </span>
      </div>
      <div v-else class="fm-banner fm-banner--loading">
        <i class="pi pi-spin pi-spinner fm-banner__icon" />
        <span>{{ t('preschoolScaffold.formManagement.loading') }}</span>
      </div>

      <!-- Card grid -->
      <div class="fm-grid">
        <RouterLink
          v-for="card in cards"
          :key="card.key"
          :to="card.to"
          class="fm-card-link"
        >
          <div class="fm-card" :class="card.accent">
            <div class="fm-card__icon-wrap">
              <i :class="['pi', card.icon]" aria-hidden="true" />
            </div>
            <div class="fm-card__body">
              <h3 class="fm-card__title">{{ card.title }}</h3>
              <p class="fm-card__desc">{{ card.description }}</p>
            </div>
            <i class="pi pi-arrow-right fm-card__arrow" aria-hidden="true" />
          </div>
        </RouterLink>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.fm-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ── Banner ──────────────────────────────────────────────────────────── */
.fm-banner {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border-radius: 1rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.fm-banner--info {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
}

.fm-banner--warn {
  background: #fffbeb;
  border: 1px solid #fde68a;
  color: #92400e;
}

.fm-banner--loading {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  color: #64748b;
}

.fm-banner__icon { font-size: 0.95rem; }

/* ── Card grid ───────────────────────────────────────────────────────── */
.fm-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.fm-card-link {
  display: block;
  text-decoration: none;
}

.fm-card {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1.1rem 1.1rem 1.1rem 1rem;
  border-radius: 1.15rem;
  border: 1px solid #e2e8f0;
  background: #fff;
  box-shadow: 0 14px 36px -28px rgba(15, 23, 42, 0.3);
  transition: transform 0.14s ease, box-shadow 0.14s ease, border-color 0.14s ease;
  cursor: pointer;
}

.fm-card-link:hover .fm-card,
.fm-card-link:focus-visible .fm-card {
  transform: translateY(-2px);
  box-shadow: 0 20px 48px -28px rgba(15, 23, 42, 0.4);
}

.fm-card__icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  flex-shrink: 0;
  font-size: 1.05rem;
}

.fm-card__body { flex: 1; min-width: 0; }

.fm-card__title {
  margin: 0 0 0.25rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
}

.fm-card__desc {
  margin: 0;
  font-size: 0.82rem;
  color: #64748b;
  line-height: 1.5;
}

.fm-card__arrow {
  font-size: 0.75rem;
  color: #cbd5e1;
  align-self: center;
  flex-shrink: 0;
  transition: color 0.14s, transform 0.14s;
}

.fm-card-link:hover .fm-card__arrow {
  color: #94a3b8;
  transform: translateX(2px);
}

/* ── Colour accents ──────────────────────────────────────────────────── */
.card--violet .fm-card__icon-wrap { background: #ede9fe; color: #6d28d9; }
.card--violet:hover { border-color: #c4b5fd; }

.card--blue .fm-card__icon-wrap { background: #dbeafe; color: #1d4ed8; }
.card--blue:hover { border-color: #93c5fd; }

.card--emerald .fm-card__icon-wrap { background: #d1fae5; color: #065f46; }
.card--emerald:hover { border-color: #6ee7b7; }

.card--amber .fm-card__icon-wrap { background: #fef3c7; color: #92400e; }
.card--amber:hover { border-color: #fcd34d; }

.card--indigo .fm-card__icon-wrap { background: #e0e7ff; color: #4338ca; }
.card--indigo:hover { border-color: #a5b4fc; }

.card--orange .fm-card__icon-wrap { background: #ffedd5; color: #c2410c; }
.card--orange:hover { border-color: #fdba74; }

.card--rose .fm-card__icon-wrap { background: #ffe4e6; color: #be123c; }
.card--rose:hover { border-color: #fda4af; }

.card--sky .fm-card__icon-wrap { background: #e0f2fe; color: #0369a1; }
.card--sky:hover { border-color: #7dd3fc; }

.card--slate .fm-card__icon-wrap { background: #f1f5f9; color: #475569; }
.card--slate:hover { border-color: #cbd5e1; }

/* Hover border colour: accent class is on fm-card, so :hover applies to fm-card */
.fm-card.card--violet:hover { border-color: #c4b5fd; }
.fm-card.card--blue:hover { border-color: #93c5fd; }
.fm-card.card--emerald:hover { border-color: #6ee7b7; }
.fm-card.card--amber:hover { border-color: #fcd34d; }
.fm-card.card--indigo:hover { border-color: #a5b4fc; }
.fm-card.card--orange:hover { border-color: #fdba74; }
.fm-card.card--rose:hover { border-color: #fda4af; }
.fm-card.card--sky:hover { border-color: #7dd3fc; }
.fm-card.card--slate:hover { border-color: #cbd5e1; }
</style>

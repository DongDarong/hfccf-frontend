<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import Card from 'primevue/card'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'
import { assessmentFormApi } from '@/modules/assessment/services/assessmentFormApi'

defineOptions({
  name: 'PreschoolAdminFormManagementPage',
})

const { t, te } = useLanguage()

const assessmentForms = ref([])
const isLoading = ref(false)

const launcherCards = [
  {
    key: 'dashboard',
    title: 'Assessment Dashboard',
    descriptionKey: 'preschoolScaffold.formManagement.cards.dashboard.description',
    fallbackDescription: 'Review the overall assessment progress and quick metrics.',
    to: { name: 'assessment-dashboard' },
  },
  {
    key: 'forms',
    title: 'Form Library',
    descriptionKey: 'preschoolScaffold.formManagement.cards.forms.description',
    fallbackDescription: 'Open the form library to manage assessment templates.',
    to: { name: 'assessment-form-list' },
  },
  {
    key: 'new-form',
    title: 'Create Form',
    descriptionKey: 'preschoolScaffold.formManagement.cards.newForm.description',
    fallbackDescription: 'Start a new assessment form from scratch.',
    to: { name: 'assessment-form-create' },
  },
  {
    key: 'submissions',
    title: 'Submissions',
    descriptionKey: 'preschoolScaffold.formManagement.cards.submissions.description',
    fallbackDescription: 'Inspect assessment submissions and completion records.',
    to: { name: 'assessment-submission-list' },
  },
  {
    key: 'wizard',
    title: 'Assessment Wizard',
    descriptionKey: 'preschoolScaffold.formManagement.cards.wizard.description',
    fallbackDescription: 'Launch the guided assessment workflow.',
    to: { name: 'assessment-wizard' },
  },
  {
    key: 'scoring',
    title: 'Scoring Manager',
    descriptionKey: 'preschoolScaffold.formManagement.cards.scoring.description',
    fallbackDescription: 'Adjust scoring rules for the selected assessment form.',
    requiresFormId: true,
    routeName: 'assessment-scoring',
  },
  {
    key: 'print-designer',
    title: 'Print Designer',
    descriptionKey: 'preschoolScaffold.formManagement.cards.printDesigner.description',
    fallbackDescription: 'Design the printable output for the selected assessment form.',
    requiresFormId: true,
    routeName: 'assessment-print-designer',
  },
  {
    key: 'reports',
    title: 'Reports',
    descriptionKey: 'preschoolScaffold.formManagement.cards.reports.description',
    fallbackDescription: 'Review reporting insights and generated summaries.',
    to: { name: 'assessment-reports' },
  },
  {
    key: 'audit-logs',
    title: 'Audit Logs',
    descriptionKey: 'preschoolScaffold.formManagement.cards.auditLogs.description',
    fallbackDescription: 'Track changes and activity across the assessment module.',
    to: { name: 'assessment-audit-logs' },
  },
]

function safeText(key, fallback) {
  return te(key) ? t(key) : fallback
}

const primaryFormId = computed(() => String(assessmentForms.value[0]?.id || '').trim())

const launchCards = computed(() =>
  launcherCards.map((card) => {
    if (!card.requiresFormId) {
      return {
        ...card,
        description: safeText(card.descriptionKey, card.fallbackDescription),
        to: card.to,
      }
    }

    const id = primaryFormId.value
    return {
      ...card,
      description: safeText(card.descriptionKey, card.fallbackDescription),
      to: id ? { name: card.routeName, params: { id } } : { name: 'assessment-form-list' },
    }
  }),
)

async function loadAssessmentForms() {
  isLoading.value = true
  try {
    const response = await assessmentFormApi.list({
      page: 1,
      perPage: 1,
      search: '',
      status: '',
    })
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
    <section class="preschool-form-management-page">
      <HeaderSection
        title="Form Management"
        subtitle="Jump into the assessment tools you need most."
      />

      <div class="preschool-form-management-page__intro">
        <p>
          Select a card to open the matching Assessment workspace. Scoring and print tools will
          use the first available assessment form when one exists.
        </p>
      </div>

      <div v-if="isLoading" class="preschool-form-management-page__loading">
        Loading assessment tools...
      </div>

      <div class="preschool-form-management-page__grid">
        <RouterLink
          v-for="card in launchCards"
          :key="card.key"
          :to="card.to"
          class="preschool-form-management-page__link group"
        >
          <Card class="preschool-form-management-page__card">
            <template #content>
              <div class="preschool-form-management-page__card-content">
                <div class="preschool-form-management-page__card-icon">
                  <i class="pi pi-folder-open" aria-hidden="true"></i>
                </div>

                <div class="preschool-form-management-page__card-copy">
                  <h3>{{ card.title }}</h3>
                  <p>{{ card.description }}</p>
                </div>
              </div>
            </template>
          </Card>
        </RouterLink>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.preschool-form-management-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preschool-form-management-page__intro {
  border-radius: 1.25rem;
  border: 1px solid #dbeafe;
  background: linear-gradient(180deg, #eff6ff 0%, #ffffff 100%);
  padding: 1rem 1.1rem;
  color: #1e3a8a;
  font-size: 0.95rem;
  line-height: 1.55;
}

.preschool-form-management-page__loading {
  border-radius: 1rem;
  border: 1px dashed #cbd5e1;
  background: #fff;
  color: #475569;
  padding: 1rem;
}

.preschool-form-management-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.preschool-form-management-page__link {
  display: block;
  text-decoration: none;
}

.preschool-form-management-page__card {
  height: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 1.15rem;
  background: #fff;
  box-shadow: 0 18px 40px -34px rgba(15, 23, 42, 0.35);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease;
}

.preschool-form-management-page__link:hover .preschool-form-management-page__card,
.preschool-form-management-page__link:focus-visible .preschool-form-management-page__card {
  transform: translateY(-2px);
  border-color: #93c5fd;
  box-shadow: 0 22px 50px -34px rgba(37, 99, 235, 0.45);
}

.preschool-form-management-page__card-content {
  display: flex;
  gap: 0.9rem;
  align-items: flex-start;
}

.preschool-form-management-page__card-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 0.9rem;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #2563eb;
  flex: none;
}

.preschool-form-management-page__card-copy h3 {
  margin: 0 0 0.35rem;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 800;
}

.preschool-form-management-page__card-copy p {
  margin: 0;
  color: #475569;
  font-size: 0.92rem;
  line-height: 1.5;
}
</style>

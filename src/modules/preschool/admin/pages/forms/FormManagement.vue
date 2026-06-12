<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'
import FormManagementHero from '@/modules/preschool/admin/components/form-management/FormManagementHero.vue'
import FormManagementSection from '@/modules/preschool/admin/components/form-management/FormManagementSection.vue'
import { FORM_MANAGEMENT_PAGE_CARDS } from './formManagementData'

defineOptions({
  name: 'PreschoolAdminFormManagementPage',
})

const { t, te } = useLanguage()
const router = useRouter()

function safeText(key, fallback) {
  return te(key) ? t(key) : fallback
}

const heroSummary = computed(() =>
  safeText(
    'preschoolScaffold.formManagement.pages.overview.summary',
    'Choose a section below to open the forms, build, or review workspace.',
  ),
)

const pageCards = computed(() =>
  FORM_MANAGEMENT_PAGE_CARDS.map((card) => ({
    ...card,
    title: safeText(card.titleKey, 'Form'),
    description: safeText(card.descriptionKey, card.fallbackDescription),
  })),
)

const startCard = computed(() => pageCards.value.find(c => c.category === 'start'))
const workflowCards = computed(() => pageCards.value.filter(c => c.category === 'workflow'))

const quickLinks = computed(() => [
  {
    label: safeText('preschoolScaffold.formManagement.cards.dashboard.title', 'Dashboard'),
    action: () => router.push({ name: 'assessment-dashboard' }),
    icon: 'pi pi-chart-bar',
  },
  {
    label: safeText('preschoolScaffold.formManagement.cards.forms.title', 'Forms'),
    action: () => router.push({ name: 'assessment-form-list' }),
    icon: 'pi pi-folder-open',
  },
  {
    label: safeText('preschoolScaffold.formManagement.pages.manage.title', 'Manage'),
    action: () => router.push({ name: 'dashboard-preschool-admin-forms-manage' }),
    icon: 'pi pi-folder-open',
  },
])
</script>

<template>
  <MainLayout>
    <section class="preschool-form-management-page">
      <HeaderSection
        :title="safeText('preschoolScaffold.formManagement.title', 'Form Management')"
        :subtitle="safeText('preschoolScaffold.formManagement.subtitle', 'Create, organize, review, and manage Preschool forms.')"
      />

      <FormManagementHero
        :eyebrow="safeText('preschoolScaffold.formManagement.eyebrow', 'Form overview')"
        :title="safeText('preschoolScaffold.formManagement.title', 'Form Management')"
        :description="safeText('preschoolScaffold.formManagement.description', 'Manage the launch points for form builders, recent forms, submissions, and review tools.')"
        :meta-label="safeText('preschoolScaffold.formManagement.hero.metricForms', 'Launcher ready')"
        :meta-note="heroSummary"
        :quick-links="quickLinks"
      />

      <!-- START HERE Section -->
      <FormManagementSection
        v-if="startCard"
        :eyebrow="'GET STARTED'"
        :title="'Overview & Quick Access'"
        grid-class="preschool-form-management-section__grid--one"
        :cards="[startCard]"
      />

      <!-- WORKFLOW Section -->
      <FormManagementSection
        :eyebrow="'WORKFLOW'"
        :title="'Sequential Process'"
        :subtitle="'Follow these steps: Create → Manage → Review'"
        grid-class="preschool-form-management-section__grid--three"
        :cards="workflowCards"
        is-workflow
      />
    </section>
  </MainLayout>
</template>

<style scoped>
.preschool-form-management-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>

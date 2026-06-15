<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { useAssessmentData } from '@/modules/preschool/composables/useAssessmentData'
import { useAssessmentReports } from '@/modules/preschool/composables/useAssessmentReports'
import AssessmentPageHeader from '@/modules/preschool/admin/components/assessment/AssessmentPageHeader.vue'
import AssessmentDashboardHero from '@/modules/preschool/admin/components/assessment/AssessmentDashboardHero.vue'
import AssessmentMetricGrid from '@/modules/preschool/admin/components/assessment/AssessmentMetricGrid.vue'
import AssessmentWorkspaceNavigation from '@/modules/preschool/admin/components/assessment/AssessmentWorkspaceNavigation.vue'
import AssessmentRiskSummary from '@/modules/preschool/admin/components/assessment/AssessmentRiskSummary.vue'
import StatCard from '@/modules/preschool/components/assessment-summary/StatCard.vue'
import {
  PRESCHOOL_ASSESSMENT_NAV_CARDS,
  PRESCHOOL_ASSESSMENT_PAGE_FLOW,
  PRESCHOOL_ASSESSMENT_ROUTE_NAMES,
} from './constants/preschoolAssessmentWorkspace'

defineOptions({
  name: 'PreschoolAssessmentDashboard',
})

const router = useRouter()
const { loadAllLookupData, categories } = useAssessmentData()
const { summaryStats, categoryPerformanceArray, highRiskStudents } = useAssessmentReports()

onMounted(async () => {
  await loadAllLookupData()
})

const statCards = computed(() => [
  {
    iconClass: 'pi pi-chart-bar',
    label: 'Total Assessments',
    value: summaryStats.value.total,
    color: 'blue',
    clickable: true,
  },
  {
    iconClass: 'pi pi-check-circle',
    label: 'Completed',
    value: summaryStats.value.completed,
    color: 'emerald',
    clickable: true,
  },
  {
    iconClass: 'pi pi-hourglass',
    label: 'Pending',
    value: summaryStats.value.pending,
    color: 'amber',
    clickable: true,
  },
  {
    iconClass: 'pi pi-star',
    label: 'Average Score',
    value: summaryStats.value.average || '-',
    unit: '/100',
    color: 'purple',
  },
])

const topCategories = computed(() =>
  categoryPerformanceArray.value.slice(0, 3).map(category => ({
    iconClass: 'pi pi-bullseye',
    label: category.categoryName,
    value: category.average,
    unit: '/100',
    color: 'blue',
  }))
)

const riskMetrics = computed(() => [
  {
    iconClass: 'pi pi-exclamation-triangle',
    label: 'High Risk',
    value: highRiskStudents.value.length,
    color: 'red',
  },
  {
    iconClass: 'pi pi-tags',
    label: 'Categories',
    value: categories.value.length,
    color: 'emerald',
  },
])

const groupedWorkspaceCards = computed(() => {
  const groups = new Map()

  PRESCHOOL_ASSESSMENT_NAV_CARDS.forEach((card) => {
    if (!groups.has(card.group)) {
      groups.set(card.group, [])
    }
    groups.get(card.group).push(card)
  })

  return Array.from(groups.entries()).map(([group, cards]) => ({ group, cards }))
})

const quickStartSteps = computed(() => PRESCHOOL_ASSESSMENT_PAGE_FLOW)

function navigateTo(routeName) {
  router.push({ name: routeName })
}

function statClicked() {
  navigateTo(PRESCHOOL_ASSESSMENT_ROUTE_NAMES.list)
}
</script>

<template>
  <MainLayout>
    <div class="space-y-8">
      <AssessmentPageHeader
        title="Assessment Dashboard"
        subtitle="Track and manage Preschool assessment work from a central workspace."
      />

      <AssessmentDashboardHero
        :workflow-steps="quickStartSteps"
        @create="navigateTo(PRESCHOOL_ASSESSMENT_ROUTE_NAMES.list)"
        @reports="navigateTo(PRESCHOOL_ASSESSMENT_ROUTE_NAMES.reports)"
        @settings="navigateTo(PRESCHOOL_ASSESSMENT_ROUTE_NAMES.settings)"
        @navigate="navigateTo"
      />

      <AssessmentWorkspaceNavigation :sections="groupedWorkspaceCards" />

      <AssessmentMetricGrid
        title="Key Metrics"
        :stats="statCards"
        @click="statClicked"
      />

      <section v-if="topCategories.length > 0" class="space-y-4">
        <h3 class="text-xl font-bold text-slate-900">Top Assessment Categories</h3>
        <div class="grid gap-4 md:grid-cols-3">
          <StatCard
            v-for="category in topCategories"
            :key="category.label"
            :icon="category.label"
            :icon-class="category.iconClass"
            :label="category.label"
            :value="category.value"
            :unit="category.unit"
            :color="category.color"
          />
        </div>
      </section>

      <AssessmentRiskSummary
        title="Risk Analysis"
        :metrics="riskMetrics"
        :high-risk-count="highRiskStudents.length"
        show-high-risk-details
        @view-details="navigateTo(PRESCHOOL_ASSESSMENT_ROUTE_NAMES.list)"
      />
    </div>
  </MainLayout>
</template>

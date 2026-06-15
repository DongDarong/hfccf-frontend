<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import { useAssessmentData } from '@/modules/preschool/composables/useAssessmentData'
import { useAssessmentReports } from '@/modules/preschool/composables/useAssessmentReports'
import StatCard from '@/modules/preschool/components/assessment-summary/StatCard.vue'
import AssessmentWorkspaceCard from './components/AssessmentWorkspaceCard.vue'
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
      <HeaderSection
        title="Assessment Dashboard"
        subtitle="Track and manage Preschool assessment work from a central workspace."
      />

      <section class="rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-6 shadow-sm">
        <div class="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <div class="space-y-4">
            <p class="text-sm font-semibold uppercase tracking-[0.22em] text-sky-600">
              Preschool Assessment Workspace
            </p>
            <h2 class="text-3xl font-bold text-slate-900">
              Organize assessment capture, review, reports, and settings in one place.
            </h2>
            <p class="max-w-2xl text-base leading-7 text-slate-600">
              Start from the dashboard, move into student assessments, then review performance
              trends and configure the module without jumping across unrelated screens.
            </p>

            <div class="flex flex-wrap gap-3">
              <Button
                label="Create Assessment"
                icon="pi pi-plus"
                @click="navigateTo(PRESCHOOL_ASSESSMENT_ROUTE_NAMES.list)"
              />
              <Button
                label="Open Reports"
                icon="pi pi-chart-bar"
                variant="secondary"
                @click="navigateTo(PRESCHOOL_ASSESSMENT_ROUTE_NAMES.reports)"
              />
              <Button
                label="Workspace Settings"
                icon="pi pi-cog"
                variant="secondary"
                @click="navigateTo(PRESCHOOL_ASSESSMENT_ROUTE_NAMES.settings)"
              />
            </div>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
            <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Workflow
            </p>
            <div class="mt-4 space-y-3">
              <div
                v-for="step in quickStartSteps"
                :key="step.key"
                class="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700">
                  {{ step.key.slice(0, 1).toUpperCase() }}
                </div>
                <div>
                  <p class="font-semibold text-slate-900">{{ step.title }}</p>
                  <p class="text-sm leading-6 text-slate-600">{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="space-y-4">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h3 class="text-xl font-bold text-slate-900">Workspace Navigation</h3>
            <p class="text-sm text-slate-600">
              Centralized entry points for the Preschool assessment module.
            </p>
          </div>
        </div>

        <div class="space-y-6">
          <div v-for="section in groupedWorkspaceCards" :key="section.group" class="space-y-3">
            <h4 class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              {{ section.group }}
            </h4>
            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <AssessmentWorkspaceCard
                v-for="card in section.cards"
                :key="card.routeName"
                :title="card.title"
                :description="card.description"
                :route-name="card.routeName"
                :icon-class="card.iconClass"
                :group="card.group"
              />
            </div>
          </div>
        </div>
      </section>

      <section class="space-y-4">
        <h3 class="text-xl font-bold text-slate-900">Key Metrics</h3>
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            v-for="stat in statCards"
            :key="stat.label"
            :icon="stat.label"
            :icon-class="stat.iconClass"
            :label="stat.label"
            :value="stat.value"
            :unit="stat.unit"
            :color="stat.color"
            :clickable="stat.clickable"
            @click="statClicked"
          />
        </div>
      </section>

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

      <section class="space-y-4">
        <h3 class="text-xl font-bold text-slate-900">Risk Analysis</h3>
        <div class="grid gap-4 md:grid-cols-2">
          <StatCard
            v-for="metric in riskMetrics"
            :key="metric.label"
            :icon="metric.label"
            :icon-class="metric.iconClass"
            :label="metric.label"
            :value="metric.value"
            :color="metric.color"
          />
        </div>

        <div v-if="highRiskStudents.length > 0" class="rounded-2xl border border-red-200 bg-red-50 p-5">
          <h4 class="font-semibold text-red-900">High Risk Students</h4>
          <p class="mt-2 text-sm text-red-800">
            {{ highRiskStudents.length }} student(s) scoring below 60 need attention.
          </p>
          <Button
            label="View Details"
            icon="pi pi-arrow-right"
            size="sm"
            variant="secondary"
            class="mt-3"
            @click="navigateTo(PRESCHOOL_ASSESSMENT_ROUTE_NAMES.list)"
          />
        </div>
      </section>
    </div>
  </MainLayout>
</template>

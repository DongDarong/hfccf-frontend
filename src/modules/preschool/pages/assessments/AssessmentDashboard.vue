<script setup>
import { onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import { useRouter } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'
import { useAssessmentData } from '@/modules/preschool/composables/useAssessmentData'
import { useAssessmentReports } from '@/modules/preschool/composables/useAssessmentReports'
import SummaryCard from '@/modules/preschool/components/assessment-summary/SummaryCard.vue'
import StatCard from '@/modules/preschool/components/assessment-summary/StatCard.vue'

defineOptions({
  name: 'PreschoolAssessmentDashboard',
})

const router = useRouter()
const { t } = useLanguage()
const { loadAllLookupData, assessments, categories } = useAssessmentData()
const { summaryStats, statusDistribution, categoryPerformanceArray, highRiskStudents } = useAssessmentReports()

onMounted(async () => {
  await loadAllLookupData()
})

const statCards = computed(() => [
  {
    icon: '📊',
    label: 'Total Assessments',
    value: summaryStats.value.total,
    color: 'blue',
    clickable: true,
  },
  {
    icon: '✅',
    label: 'Completed',
    value: summaryStats.value.completed,
    color: 'emerald',
    clickable: true,
  },
  {
    icon: '⏳',
    label: 'Pending',
    value: summaryStats.value.pending,
    color: 'amber',
    clickable: true,
  },
  {
    icon: '⭐',
    label: 'Average Score',
    value: summaryStats.value.average || '-',
    unit: '/100',
    color: 'purple',
  },
])

const topCategories = computed(() =>
  categoryPerformanceArray.value.slice(0, 3).map(cat => ({
    icon: '🎯',
    label: cat.categoryName,
    value: cat.average,
    unit: '/100',
    color: 'blue',
  }))
)

const riskMetrics = computed(() => [
  {
    icon: '⚠️',
    label: 'High Risk',
    value: highRiskStudents.value.length,
    color: 'red',
  },
  {
    icon: '📈',
    label: 'Categories',
    value: categories.value.length,
    color: 'emerald',
  },
])

function navigateTo(routeName) {
  router.push({ name: routeName })
}

function statClicked(stat) {
  if (stat.clickable) {
    router.push({ name: 'preschool-assessment-list' })
  }
}
</script>

<template>
  <MainLayout>
    <div class="space-y-8">
      <!-- Header -->
      <HeaderSection
        title="📊 Assessment Dashboard"
        subtitle="Track and manage student assessments with comprehensive analytics"
      />

      <!-- Hero Section -->
      <div class="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-6">
        <div class="space-y-4">
          <h2 class="text-2xl font-bold text-blue-900">Welcome to Assessment Hub</h2>
          <p class="text-blue-800">
            Manage student assessments, track progress, and identify areas for improvement.
          </p>

          <!-- Quick Action Buttons -->
          <div class="flex flex-wrap gap-3">
            <Button
              label="➕ Create Assessment"
              icon="pi pi-plus"
              @click="navigateTo('preschool-assessment-list')"
            />
            <Button
              label="📈 View Reports"
              icon="pi pi-chart-bar"
              variant="secondary"
              @click="navigateTo('preschool-assessment-reports')"
            />
            <Button
              label="⚙️ Settings"
              icon="pi pi-cog"
              variant="secondary"
              @click="navigateTo('preschool-assessment-settings')"
            />
          </div>
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="space-y-4">
        <h3 class="text-xl font-bold text-gray-900">📈 Key Metrics</h3>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            v-for="stat in statCards"
            :key="stat.label"
            :icon="stat.icon"
            :label="stat.label"
            :value="stat.value"
            :unit="stat.unit"
            :color="stat.color"
            :clickable="stat.clickable"
            @click="statClicked(stat)"
          />
        </div>
      </div>

      <!-- Top Performing Categories -->
      <div v-if="topCategories.length > 0" class="space-y-4">
        <h3 class="text-xl font-bold text-gray-900">🎯 Top Assessment Categories</h3>
        <div class="grid gap-4 sm:grid-cols-3">
          <StatCard
            v-for="cat in topCategories"
            :key="cat.label"
            :icon="cat.icon"
            :label="cat.label"
            :value="cat.value"
            :unit="cat.unit"
            :color="cat.color"
          />
        </div>
      </div>

      <!-- Risk Analysis Section -->
      <div class="space-y-4">
        <h3 class="text-xl font-bold text-gray-900">⚠️ Risk Analysis</h3>
        <div class="grid gap-4 sm:grid-cols-2">
          <StatCard
            v-for="metric in riskMetrics"
            :key="metric.label"
            :icon="metric.icon"
            :label="metric.label"
            :value="metric.value"
            :color="metric.color"
            :clickable="metric.clickable"
          />
        </div>

        <!-- High Risk Students Alert -->
        <div v-if="highRiskStudents.length > 0" class="rounded-lg border border-red-200 bg-red-50 p-4">
          <h4 class="font-semibold text-red-900">🚨 High Risk Students</h4>
          <p class="mt-2 text-sm text-red-800">
            {{ highRiskStudents.length }} student(s) scoring below 60 need attention
          </p>
          <Button
            label="View Details"
            icon="pi pi-arrow-right"
            size="sm"
            variant="secondary"
            class="mt-3"
            @click="navigateTo('preschool-assessment-list')"
          />
        </div>
      </div>

      <!-- Quick Start Guide -->
      <div class="space-y-4">
        <h3 class="text-xl font-bold text-gray-900">🎯 Quick Start Guide</h3>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="(step, index) in [
              { icon: '1️⃣', title: 'Create', desc: 'New assessment' },
              { icon: '2️⃣', title: 'Track', desc: 'Student progress' },
              { icon: '3️⃣', title: 'Analyze', desc: 'Performance data' },
              { icon: '4️⃣', title: 'Improve', desc: 'Learning outcomes' },
            ]"
            :key="index"
            class="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 text-center"
          >
            <div class="text-3xl">{{ step.icon }}</div>
            <h4 class="mt-2 font-semibold text-gray-900">{{ step.title }}</h4>
            <p class="text-sm text-gray-600">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import { computed } from 'vue'
</script>

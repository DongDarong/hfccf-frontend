<script setup>
import { onMounted, computed } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useAssessmentData } from '@/modules/preschool/composables/useAssessmentData'
import { useAssessmentReports } from '@/modules/preschool/composables/useAssessmentReports'
import StatCard from '@/modules/preschool/components/assessment-summary/StatCard.vue'
import ProgressIndicator from '@/modules/preschool/components/assessment-summary/ProgressIndicator.vue'

defineOptions({
  name: 'PreschoolAssessmentReportsPage',
})

const { loadAllLookupData, categories } = useAssessmentData()
const {
  summaryStats,
  statusDistribution,
  ratingDistribution,
  categoryPerformanceArray,
  studentPerformanceArray,
  topPerformers,
  highRiskStudents,
  assessmentTimeline,
  periodComparison,
  getRiskPercentage,
  getImprovementTrend,
} = useAssessmentReports()

onMounted(async () => {
  await loadAllLookupData()
})

const summaryCards = computed(() => [
  {
    icon: '📊',
    label: 'Total Assessments',
    value: summaryStats.value.total,
    color: 'blue',
  },
  {
    icon: '✅',
    label: 'Completed',
    value: summaryStats.value.completed,
    color: 'emerald',
  },
  {
    icon: '⭐',
    label: 'Average Score',
    value: summaryStats.value.average || '-',
    unit: '/100',
    color: 'purple',
  },
  {
    icon: '📈',
    label: 'Median Score',
    value: summaryStats.value.median || '-',
    unit: '/100',
    color: 'amber',
  },
])

const riskCards = computed(() => [
  {
    icon: '⭐',
    label: 'Excellent (80+)',
    value: summaryStats.value.riskAnalysis?.excellent || 0,
    percentage: getRiskPercentage('excellent'),
    color: 'blue',
  },
  {
    icon: '👍',
    label: 'Good (70-79)',
    value: summaryStats.value.riskAnalysis?.good || 0,
    percentage: getRiskPercentage('good'),
    color: 'emerald',
  },
  {
    icon: '👌',
    label: 'Fair (60-69)',
    value: summaryStats.value.riskAnalysis?.fair || 0,
    percentage: getRiskPercentage('fair'),
    color: 'amber',
  },
  {
    icon: '⚠️',
    label: 'At Risk (<60)',
    value: summaryStats.value.riskAnalysis?.atRisk || 0,
    percentage: getRiskPercentage('at-risk'),
    color: 'red',
  },
])

const improvementTrend = computed(() => getImprovementTrend())
</script>

<template>
  <MainLayout>
    <div class="space-y-8">
      <!-- Header -->
      <HeaderSection
        title="📈 Assessment Reports"
        subtitle="Comprehensive analytics and performance insights"
      />

      <!-- Summary Statistics -->
      <div class="space-y-4">
        <h3 class="text-xl font-bold text-gray-900">📊 Summary Statistics</h3>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            v-for="card in summaryCards"
            :key="card.label"
            :icon="card.icon"
            :label="card.label"
            :value="card.value"
            :unit="card.unit"
            :color="card.color"
          />
        </div>
      </div>

      <!-- Risk Analysis -->
      <div class="space-y-4">
        <h3 class="text-xl font-bold text-gray-900">⚠️ Risk Level Distribution</h3>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="card in riskCards"
            :key="card.label"
            :class="[
              'rounded-lg border p-4',
              card.color === 'blue' ? 'border-blue-200 bg-blue-50' :
              card.color === 'emerald' ? 'border-emerald-200 bg-emerald-50' :
              card.color === 'amber' ? 'border-amber-200 bg-amber-50' :
              'border-red-200 bg-red-50'
            ]"
          >
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <span class="text-2xl">{{ card.icon }}</span>
                <span class="text-xs font-semibold text-gray-600">{{ card.label }}</span>
              </div>

              <div class="text-3xl font-bold text-gray-900">{{ card.value }}</div>

              <div class="text-xs text-gray-600">
                {{ card.percentage }}% of total
              </div>

              <!-- Progress Bar -->
              <ProgressIndicator
                :current="card.value"
                :total="summaryStats.total"
                show-percentage
                :color="card.color"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Category Performance -->
      <div class="space-y-4">
        <h3 class="text-xl font-bold text-gray-900">🎯 Category Performance</h3>
        <DataTable
          :value="categoryPerformanceArray"
          striped-rows
          show-gridlines
          responsive-layout="scroll"
          class="w-full"
        >
          <Column field="categoryName" header="Category" />
          <Column field="count" header="Assessments" />
          <Column field="average" header="Average Score">
            <template #body="{ data }">
              <span class="font-bold text-blue-700">{{ data.average }}/100</span>
            </template>
          </Column>
          <Column field="highest" header="Highest" />
          <Column field="lowest" header="Lowest" />
          <Column header="Quality Distribution">
            <template #body="{ data }">
              <div class="space-y-1 text-xs">
                <div class="flex justify-between">
                  <span>⭐ Excellent:</span>
                  <span class="font-semibold">{{ data.excellentCount }}</span>
                </div>
                <div class="flex justify-between">
                  <span>👍 Good:</span>
                  <span class="font-semibold">{{ data.goodCount }}</span>
                </div>
                <div class="flex justify-between">
                  <span>👌 Fair:</span>
                  <span class="font-semibold">{{ data.fairCount }}</span>
                </div>
                <div class="flex justify-between">
                  <span>⚠️ Needs Improvement:</span>
                  <span class="font-semibold">{{ data.needsImprovementCount }}</span>
                </div>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Top Performers -->
      <div class="space-y-4">
        <h3 class="text-xl font-bold text-gray-900">🏆 Top Performers</h3>
        <DataTable
          :value="topPerformers(5)"
          striped-rows
          show-gridlines
          responsive-layout="scroll"
          class="w-full"
        >
          <Column header="Rank">
            <template #body="{ index }">
              <span class="font-bold text-amber-600">{{ index + 1 }}</span>
            </template>
          </Column>
          <Column field="studentName" header="Student" />
          <Column field="average" header="Average Score">
            <template #body="{ data }">
              <span class="inline-block rounded-lg bg-blue-100 px-3 py-1 font-bold text-blue-700">
                {{ data.average }}/100
              </span>
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- At Risk Students -->
      <div v-if="highRiskStudents.length > 0" class="space-y-4">
        <h3 class="text-xl font-bold text-gray-900">🚨 High Risk Students</h3>
        <DataTable
          :value="highRiskStudents"
          striped-rows
          show-gridlines
          responsive-layout="scroll"
          class="w-full"
        >
          <Column field="student.fullName" header="Student" />
          <Column field="category.name" header="Category" />
          <Column field="assessmentDate" header="Date">
            <template #body="{ data }">
              {{ data.assessmentDate ? new Date(data.assessmentDate).toLocaleDateString() : '-' }}
            </template>
          </Column>
          <Column field="score" header="Score">
            <template #body="{ data }">
              <span class="inline-block rounded-lg bg-red-100 px-3 py-1 font-bold text-red-700">
                {{ data.score }}
              </span>
            </template>
          </Column>
          <Column field="rating" header="Rating" />
          <Column field="observation" header="Observation">
            <template #body="{ data }">
              <span class="max-w-sm text-sm text-gray-600">
                {{ data.observation?.substring(0, 50) }}{{ data.observation?.length > 50 ? '...' : '' }}
              </span>
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Period Comparison -->
      <div class="space-y-4">
        <h3 class="text-xl font-bold text-gray-900">📅 Period Comparison</h3>
        <DataTable
          :value="periodComparison"
          striped-rows
          show-gridlines
          responsive-layout="scroll"
          class="w-full"
        >
          <Column field="period" header="Period" />
          <Column field="count" header="Assessments" />
          <Column field="average" header="Average Score" />
          <Column header="Rating Distribution">
            <template #body="{ data }">
              <div class="flex gap-1 text-xs">
                <span class="rounded bg-blue-100 px-2 py-1 text-blue-700">⭐ {{ data.excellent }}</span>
                <span class="rounded bg-emerald-100 px-2 py-1 text-emerald-700">👍 {{ data.good }}</span>
                <span class="rounded bg-amber-100 px-2 py-1 text-amber-700">👌 {{ data.fair }}</span>
                <span class="rounded bg-red-100 px-2 py-1 text-red-700">⚠️ {{ data.needsImprovement }}</span>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Improvement Trend -->
      <div v-if="improvementTrend" class="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
        <h3 class="font-bold text-emerald-900">📈 Improvement Trend</h3>
        <div class="mt-4 text-center">
          <div class="text-4xl font-bold text-emerald-700">
            {{ improvementTrend.improved ? '↑' : '↓' }} {{ improvementTrend.change }}
          </div>
          <p class="mt-2 text-emerald-800">
            <span v-if="improvementTrend.improved" class="font-semibold">Improvement detected:</span>
            <span v-else class="font-semibold">Decline detected:</span>
            {{ improvementTrend.percentage }}% change over assessment periods
          </p>
        </div>
      </div>

      <!-- Export Options -->
      <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 class="font-semibold text-gray-900">💾 Export Reports</h3>
        <div class="mt-3 flex flex-wrap gap-2">
          <Button
            label="📊 Export PDF"
            icon="pi pi-file-pdf"
            size="sm"
            variant="secondary"
          />
          <Button
            label="📈 Export Excel"
            icon="pi pi-file-excel"
            size="sm"
            variant="secondary"
          />
          <Button
            label="📋 Export CSV"
            icon="pi pi-file-csv"
            size="sm"
            variant="secondary"
          />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

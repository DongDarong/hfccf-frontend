<script setup>
import { computed, onMounted } from 'vue'
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
  riskAnalysis,
  categoryPerformanceArray,
  highRiskStudents,
  periodComparison,
  getRiskPercentage,
  getImprovementTrend,
  exportData,
} = useAssessmentReports()

onMounted(async () => {
  await loadAllLookupData()
})

const summaryCards = computed(() => [
  {
    iconClass: 'pi pi-chart-bar',
    label: 'Total Assessments',
    value: summaryStats.value.total,
    color: 'blue',
  },
  {
    iconClass: 'pi pi-check-circle',
    label: 'Completed',
    value: summaryStats.value.completed,
    color: 'emerald',
  },
  {
    iconClass: 'pi pi-star',
    label: 'Average Score',
    value: summaryStats.value.average || '-',
    unit: '/100',
    color: 'purple',
  },
  {
    iconClass: 'pi pi-chart-line',
    label: 'Median Score',
    value: summaryStats.value.median || '-',
    unit: '/100',
    color: 'amber',
  },
])

const riskCards = computed(() => [
  {
    iconClass: 'pi pi-star',
    label: 'Excellent (80+)',
    value: riskAnalysis.value.excellent || 0,
    percentage: getRiskPercentage('excellent'),
    color: 'blue',
  },
  {
    iconClass: 'pi pi-thumbs-up',
    label: 'Good (70-79)',
    value: riskAnalysis.value.good || 0,
    percentage: getRiskPercentage('good'),
    color: 'emerald',
  },
  {
    iconClass: 'pi pi-minus-circle',
    label: 'Fair (60-69)',
    value: riskAnalysis.value.fair || 0,
    percentage: getRiskPercentage('fair'),
    color: 'amber',
  },
  {
    iconClass: 'pi pi-exclamation-triangle',
    label: 'At Risk (<60)',
    value: riskAnalysis.value.atRisk || 0,
    percentage: getRiskPercentage('at-risk'),
    color: 'red',
  },
])

const categoryColumns = computed(() => [
  { field: 'categoryName', header: 'Category' },
  { field: 'count', header: 'Assessments' },
  { field: 'average', header: 'Average Score' },
  { field: 'highest', header: 'Highest' },
  { field: 'lowest', header: 'Lowest' },
])

const improvementTrend = computed(() => getImprovementTrend())
</script>

<template>
  <MainLayout>
    <div class="space-y-8">
      <HeaderSection
        title="Assessment Reports"
        subtitle="Review performance, risk distribution, and trends across the Preschool assessment workspace."
      />

      <section class="space-y-4">
        <h3 class="text-xl font-bold text-slate-900">Summary Statistics</h3>
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            v-for="card in summaryCards"
            :key="card.label"
            :icon="card.label"
            :icon-class="card.iconClass"
            :label="card.label"
            :value="card.value"
            :unit="card.unit"
            :color="card.color"
          />
        </div>
      </section>

      <section class="space-y-4">
        <h3 class="text-xl font-bold text-slate-900">Risk Level Distribution</h3>
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article
            v-for="card in riskCards"
            :key="card.label"
            :class="[
              'rounded-2xl border p-4 shadow-sm',
              card.color === 'blue' ? 'border-blue-200 bg-blue-50' :
              card.color === 'emerald' ? 'border-emerald-200 bg-emerald-50' :
              card.color === 'amber' ? 'border-amber-200 bg-amber-50' :
              'border-red-200 bg-red-50',
            ]"
          >
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <i :class="[card.iconClass, 'text-lg text-slate-700']" />
                <span class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                  {{ card.label }}
                </span>
              </div>
              <div class="text-3xl font-bold text-slate-900">{{ card.value }}</div>
              <div class="text-xs text-slate-600">{{ card.percentage }}% of total</div>
              <ProgressIndicator
                :current="card.value"
                :total="summaryStats.total"
                show-percentage
                :color="card.color"
              />
            </div>
          </article>
        </div>
      </section>

      <section class="space-y-4">
        <h3 class="text-xl font-bold text-slate-900">Category Performance</h3>
        <DataTable
          :value="categoryPerformanceArray"
          striped-rows
          show-gridlines
          responsive-layout="scroll"
          class="w-full"
        >
          <Column
            v-for="column in categoryColumns"
            :key="column.field"
            :field="column.field"
            :header="column.header"
          />
          <Column header="Score Range">
            <template #body="{ data }">
              <span class="font-bold text-blue-700">
                {{ data.average }}/100
              </span>
            </template>
          </Column>
          <Column header="Quality Mix">
            <template #body="{ data }">
              <div class="space-y-1 text-xs">
                <div class="flex justify-between">
                  <span>Excellent</span>
                  <span class="font-semibold">{{ data.excellentCount }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Good</span>
                  <span class="font-semibold">{{ data.goodCount }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Fair</span>
                  <span class="font-semibold">{{ data.fairCount }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Needs Improvement</span>
                  <span class="font-semibold">{{ data.needsImprovementCount }}</span>
                </div>
              </div>
            </template>
          </Column>
        </DataTable>
      </section>

      <section class="space-y-4">
        <h3 class="text-xl font-bold text-slate-900">Top Risk Students</h3>
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
          <Column field="score" header="Score" />
          <Column field="rating" header="Rating" />
          <Column field="observation" header="Observation">
            <template #body="{ data }">
              <span class="max-w-sm text-sm text-slate-600">
                {{ data.observation?.substring(0, 60) }}{{ data.observation?.length > 60 ? '...' : '' }}
              </span>
            </template>
          </Column>
        </DataTable>
      </section>

      <section class="space-y-4">
        <h3 class="text-xl font-bold text-slate-900">Period Comparison</h3>
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
          <Column header="Rating Mix">
            <template #body="{ data }">
              <div class="flex flex-wrap gap-2 text-xs">
                <span class="rounded bg-blue-100 px-2 py-1 text-blue-700">Excellent {{ data.excellent }}</span>
                <span class="rounded bg-emerald-100 px-2 py-1 text-emerald-700">Good {{ data.good }}</span>
                <span class="rounded bg-amber-100 px-2 py-1 text-amber-700">Fair {{ data.fair }}</span>
                <span class="rounded bg-red-100 px-2 py-1 text-red-700">Needs Improvement {{ data.needsImprovement }}</span>
              </div>
            </template>
          </Column>
        </DataTable>
      </section>

      <section v-if="improvementTrend" class="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <h3 class="font-bold text-emerald-900">Improvement Trend</h3>
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
      </section>

      <section class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h3 class="font-semibold text-slate-900">Export Reports</h3>
        <div class="mt-3 flex flex-wrap gap-2">
          <Button
            label="Export PDF"
            icon="pi pi-file-pdf"
            size="sm"
            variant="secondary"
          />
          <Button
            label="Export Excel"
            icon="pi pi-file-excel"
            size="sm"
            variant="secondary"
          />
          <Button
            label="Export CSV"
            icon="pi pi-file-csv"
            size="sm"
            variant="secondary"
          />
          <Button
            label="Copy Data"
            icon="pi pi-copy"
            size="sm"
            variant="secondary"
          />
        </div>
        <p class="mt-3 text-sm text-slate-600">
          {{ exportData.length }} finalized assessment row(s) are ready for export.
        </p>
      </section>
    </div>
  </MainLayout>
</template>

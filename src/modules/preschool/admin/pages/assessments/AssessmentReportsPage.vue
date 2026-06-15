<script setup>
import { computed, onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import Button from '@/components/buttons/Button.vue'
import { useAssessmentData } from '@/modules/preschool/composables/useAssessmentData'
import { useAssessmentReports } from '@/modules/preschool/composables/useAssessmentReports'
import AssessmentPageHeader from '@/modules/preschool/admin/components/assessment/AssessmentPageHeader.vue'
import AssessmentReportSections from '@/modules/preschool/admin/components/assessment/AssessmentReportSections.vue'

defineOptions({
  name: 'PreschoolAssessmentReportsPage',
})

const { loadAllLookupData } = useAssessmentData()
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
  { iconClass: 'pi pi-chart-bar', label: 'Total Assessments', value: summaryStats.value.total, color: 'blue' },
  { iconClass: 'pi pi-check-circle', label: 'Completed', value: summaryStats.value.completed, color: 'emerald' },
  { iconClass: 'pi pi-star', label: 'Average Score', value: summaryStats.value.average || '-', unit: '/100', color: 'purple' },
  { iconClass: 'pi pi-chart-line', label: 'Median Score', value: summaryStats.value.median || '-', unit: '/100', color: 'amber' },
])

const riskCards = computed(() => [
  { iconClass: 'pi pi-star', label: 'Excellent (80+)', value: riskAnalysis.value.excellent || 0, percentage: getRiskPercentage('excellent'), color: 'blue' },
  { iconClass: 'pi pi-thumbs-up', label: 'Good (70-79)', value: riskAnalysis.value.good || 0, percentage: getRiskPercentage('good'), color: 'emerald' },
  { iconClass: 'pi pi-minus-circle', label: 'Fair (60-69)', value: riskAnalysis.value.fair || 0, percentage: getRiskPercentage('fair'), color: 'amber' },
  { iconClass: 'pi pi-exclamation-triangle', label: 'At Risk (<60)', value: riskAnalysis.value.atRisk || 0, percentage: getRiskPercentage('at-risk'), color: 'red' },
])

const improvementTrend = computed(() => getImprovementTrend())
</script>

<template>
  <MainLayout>
    <div class="space-y-8">
      <AssessmentPageHeader
        title="Assessment Reports"
        subtitle="Review performance, risk distribution, and trends across the Preschool assessment workspace."
      />

      <AssessmentReportSections
        :summary-cards="summaryCards"
        :risk-cards="riskCards"
        :category-performance-array="categoryPerformanceArray"
        :high-risk-students="highRiskStudents"
        :period-comparison="periodComparison"
        :summary-total="summaryStats.total"
        :improvement-trend="improvementTrend"
        :export-count="exportData.length"
      >
        <template #export-actions>
          <Button label="Export PDF" icon="pi pi-file-pdf" size="sm" variant="secondary" />
          <Button label="Export Excel" icon="pi pi-file-excel" size="sm" variant="secondary" />
          <Button label="Export CSV" icon="pi pi-file-csv" size="sm" variant="secondary" />
          <Button label="Copy Data" icon="pi pi-copy" size="sm" variant="secondary" />
        </template>
      </AssessmentReportSections>
    </div>
  </MainLayout>
</template>

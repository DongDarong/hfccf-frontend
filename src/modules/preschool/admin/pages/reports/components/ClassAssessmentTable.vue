<script setup>
import { computed } from 'vue'
import Avatar from 'primevue/avatar'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useLanguage } from '@/composables/useLanguage'

const props = defineProps({
  students: {
    type: Array,
    default: () => [],
  },
})

const { t } = useLanguage()

const tableData = computed(() => {
  return props.students.map(item => {
    const student = item.student || item
    const assessments = item.assessments || []

    const completedCount = assessments.filter(
      a => a.status === 'finalized' || a.status === 'published'
    ).length
    const draftCount = assessments.filter(a => a.status === 'draft').length

    const validScores = assessments
      .filter(a => a.score !== null && a.score !== undefined)
      .map(a => Number(a.score))

    const averageScore = validScores.length > 0
      ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)
      : null

    return {
      id: student.id,
      student,
      assessments,
      totalAssessments: assessments.length,
      completed: completedCount,
      draft: draftCount,
      averageScore,
    }
  })
})
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
      {{ t('preschoolAssessmentReportPage.classReport') || 'Class Assessment Report' }}
    </h2>

    <div class="overflow-x-auto">
      <DataTable
        :value="tableData"
        size="small"
        striped-rows
        responsive-layout="scroll"
        :rows="20"
        paginator
      >
        <!-- Student Name -->
        <Column :header="t('preschoolAssessmentReportPage.table.student') || 'Student'">
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <Avatar
                :image="data.student.avatarUrl"
                :label="data.student.firstName?.charAt(0) || ''"
                shape="circle"
                size="small"
              />
              <div>
                <p class="text-sm font-medium text-slate-900">{{ data.student.fullName }}</p>
                <p class="text-xs text-slate-600">{{ data.student.studentCode || data.student.publicId }}</p>
              </div>
            </div>
          </template>
        </Column>

        <!-- Total Assessments -->
        <Column field="totalAssessments" :header="t('preschoolAssessmentReportPage.table.total') || 'Total'">
          <template #body="{ data }">
            <span class="inline-block rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
              {{ data.totalAssessments }}
            </span>
          </template>
        </Column>

        <!-- Completed -->
        <Column field="completed" :header="t('preschoolAssessmentReportPage.table.completed') || 'Completed'">
          <template #body="{ data }">
            <span class="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
              {{ data.completed }}
            </span>
          </template>
        </Column>

        <!-- Draft -->
        <Column field="draft" :header="t('preschoolAssessmentReportPage.table.draft') || 'Draft'">
          <template #body="{ data }">
            <span class="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
              {{ data.draft }}
            </span>
          </template>
        </Column>

        <!-- Average Score -->
        <Column field="averageScore" :header="t('preschoolAssessmentReportPage.table.average') || 'Average'">
          <template #body="{ data }">
            <span class="text-sm text-slate-900">{{ data.averageScore || '—' }}</span>
          </template>
        </Column>

        <!-- Completion Rate -->
        <Column :header="t('preschoolAssessmentReportPage.table.completionRate') || 'Completion'">
          <template #body="{ data }">
            <span class="text-sm text-slate-900">
              {{ data.totalAssessments > 0 ? Math.round((data.completed / data.totalAssessments) * 100) : 0 }}%
            </span>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Empty State -->
    <div v-if="students.length === 0" class="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <i class="pi pi-inbox text-2xl text-slate-300" />
      <p class="mt-2 text-sm text-slate-500">
        {{ t('preschoolAssessmentReportPage.messages.noStudents') || 'No students found' }}
      </p>
    </div>
  </div>
</template>

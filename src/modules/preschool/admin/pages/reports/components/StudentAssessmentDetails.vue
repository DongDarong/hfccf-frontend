<script setup>
import { computed } from 'vue'
import Avatar from 'primevue/avatar'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useLanguage } from '@/composables/useLanguage'
import AssessmentSummaryCards from './AssessmentSummaryCards.vue'

const props = defineProps({
  student: {
    type: Object,
    required: true,
  },
  assessments: {
    type: Array,
    default: () => [],
  },
})

const { t } = useLanguage()

const latestAssessment = computed(() => {
  return props.assessments && props.assessments.length > 0 ? props.assessments[0] : null
})
</script>

<template>
  <div class="space-y-6">
    <!-- Report Header -->
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex gap-4 md:col-span-2">
        <Avatar
          :image="student.avatarUrl"
          :label="student.firstName?.charAt(0) || ''"
          size="large"
          shape="circle"
          class="flex-shrink-0"
        />
        <div>
          <h3 class="text-lg font-bold text-slate-900">{{ student.fullName }}</h3>
          <p class="mt-1 text-sm text-slate-600">
            <strong>Code:</strong> {{ student.studentCode || student.publicId }}
          </p>
          <p class="text-sm text-slate-600">
            <strong>Class:</strong> {{ student.classes?.[0]?.name || '—' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <AssessmentSummaryCards :assessments="assessments" />

    <!-- Latest Assessment -->
    <div v-if="latestAssessment" class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {{ t('preschoolAssessmentReportPage.latestAssessment') || 'Latest Assessment' }}
      </h2>

      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <p class="text-xs font-semibold uppercase text-slate-500">
            {{ t('preschoolAssessmentReportPage.table.assessment') || 'Assessment' }}
          </p>
          <p class="mt-1 text-sm text-slate-900">{{ latestAssessment.category?.name || latestAssessment.categoryName || '—' }}</p>
        </div>

        <div>
          <p class="text-xs font-semibold uppercase text-slate-500">
            {{ t('preschoolAssessmentReportPage.table.date') || 'Date' }}
          </p>
          <p class="mt-1 text-sm text-slate-900">{{ latestAssessment.assessment_date || latestAssessment.assessmentDate || '—' }}</p>
        </div>

        <div>
          <p class="text-xs font-semibold uppercase text-slate-500">
            {{ t('preschoolAssessmentReportPage.table.score') || 'Score' }}
          </p>
          <p class="mt-1 text-sm text-slate-900">{{ latestAssessment.score || '—' }}</p>
        </div>

        <div>
          <p class="text-xs font-semibold uppercase text-slate-500">
            {{ t('preschoolAssessmentReportPage.table.rating') || 'Rating' }}
          </p>
          <p class="mt-1 text-sm text-slate-900">{{ latestAssessment.rating || '—' }}</p>
        </div>

        <div>
          <p class="text-xs font-semibold uppercase text-slate-500">
            {{ t('preschoolAssessmentReportPage.table.status') || 'Status' }}
          </p>
          <div class="mt-1">
            <span
              :class="[
                'inline-block rounded-full px-2 py-1 text-xs font-semibold',
                latestAssessment.status === 'finalized'
                  ? 'bg-green-100 text-green-800'
                  : latestAssessment.status === 'draft'
                    ? 'bg-blue-100 text-blue-800'
                    : latestAssessment.status === 'archived'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800',
              ]"
            >
              {{ latestAssessment.status }}
            </span>
          </div>
        </div>

        <div>
          <p class="text-xs font-semibold uppercase text-slate-500">
            {{ t('preschoolAssessmentReportPage.table.teacher') || 'Teacher' }}
          </p>
          <p class="mt-1 text-sm text-slate-900">{{ latestAssessment.teacherName || latestAssessment.teacher || '—' }}</p>
        </div>
      </div>

      <!-- Teacher Comment -->
      <div v-if="latestAssessment.teacher_comment || latestAssessment.teacherComment" class="mt-4 border-t border-slate-200 pt-4">
        <p class="text-xs font-semibold uppercase text-slate-500">
          {{ t('preschoolAssessmentReportPage.table.comment') || 'Comment' }}
        </p>
        <p class="mt-2 text-sm text-slate-700">{{ latestAssessment.teacher_comment || latestAssessment.teacherComment }}</p>
      </div>
    </div>

    <!-- Assessment History Table -->
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {{ t('preschoolAssessmentReportPage.history') || 'Assessment History' }}
      </h2>

      <div class="overflow-x-auto">
        <DataTable
          :value="assessments"
          size="small"
          striped-rows
          responsive-layout="scroll"
          :rows="10"
          paginator
        >
          <!-- Assessment Name -->
          <Column field="category.name" :header="t('preschoolAssessmentReportPage.table.assessment') || 'Assessment'">
            <template #body="{ data }">
              {{ data.category?.name || data.categoryName || '—' }}
            </template>
          </Column>

          <!-- Date -->
          <Column field="assessment_date" :header="t('preschoolAssessmentReportPage.table.date') || 'Date'">
            <template #body="{ data }">
              {{ data.assessment_date || data.assessmentDate || '—' }}
            </template>
          </Column>

          <!-- Score -->
          <Column field="score" :header="t('preschoolAssessmentReportPage.table.score') || 'Score'" />

          <!-- Rating -->
          <Column field="rating" :header="t('preschoolAssessmentReportPage.table.rating') || 'Rating'" />

          <!-- Status -->
          <Column field="status" :header="t('preschoolAssessmentReportPage.table.status') || 'Status'">
            <template #body="{ data }">
              <span
                :class="[
                  'inline-block rounded-full px-2 py-1 text-xs font-semibold',
                  data.status === 'finalized'
                    ? 'bg-green-100 text-green-800'
                    : data.status === 'draft'
                      ? 'bg-blue-100 text-blue-800'
                      : data.status === 'archived'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800',
                ]"
              >
                {{ data.status }}
              </span>
            </template>
          </Column>

          <!-- Teacher -->
          <Column field="teacherName" :header="t('preschoolAssessmentReportPage.table.teacher') || 'Teacher'">
            <template #body="{ data }">
              {{ data.teacherName || data.teacher || '—' }}
            </template>
          </Column>

          <!-- Comment -->
          <Column field="teacher_comment" :header="t('preschoolAssessmentReportPage.table.comment') || 'Comment'">
            <template #body="{ data }">
              <span v-if="data.teacher_comment || data.teacherComment" class="text-sm text-slate-600">
                {{ (data.teacher_comment || data.teacherComment).substring(0, 50) }}...
              </span>
              <span v-else class="text-sm text-slate-400">—</span>
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Empty State -->
      <div v-if="assessments.length === 0" class="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <i class="pi pi-inbox text-2xl text-slate-300" />
        <p class="mt-2 text-sm text-slate-500">
          {{ t('preschoolAssessmentReportPage.messages.noAssessments') || 'No assessments found' }}
        </p>
      </div>
    </div>
  </div>
</template>

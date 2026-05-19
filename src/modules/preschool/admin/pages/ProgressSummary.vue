<script setup>
// Keep the summary page focused on finalized progress so the later Preschool
// reports phase can reuse the same layout and backend summary contract.
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Dropdown from 'primevue/dropdown'
import { useLanguage } from '@/composables/useLanguage'
import { usePreschoolAssessments } from '@/modules/preschool/composables/usePreschoolAssessments'
import { usePreschoolProgressSummary } from '@/modules/preschool/composables/usePreschoolProgressSummary'
import ProgressSummaryCard from '@/modules/preschool/shared/components/assessment/ProgressSummaryCard.vue'
import ProgressTrendList from '@/modules/preschool/shared/components/assessment/ProgressTrendList.vue'

defineOptions({
  name: 'PreschoolProgressSummaryPage',
})

const route = useRoute()
const router = useRouter()
const { t } = useLanguage()

const { studentOptions, loadLookupData, selectedStudentId, setSelectedStudentId } = usePreschoolAssessments()
const { categories, errorMessage, loadProgressSummary, loading, recentAssessments, summary } = usePreschoolProgressSummary()
const selectedStudentLabel = ref('')

const summaryCards = computed(() => [
  {
    title: t('preschoolProgressSummaryPage.cards.total.title'),
    value: summary.value.totalAssessments ?? 0,
    caption: t('preschoolProgressSummaryPage.cards.total.caption'),
  },
  {
    title: t('preschoolProgressSummaryPage.cards.finalized.title'),
    value: summary.value.finalizedAssessments ?? 0,
    caption: t('preschoolProgressSummaryPage.cards.finalized.caption'),
  },
  {
    title: t('preschoolProgressSummaryPage.cards.draft.title'),
    value: summary.value.draftAssessments ?? 0,
    caption: t('preschoolProgressSummaryPage.cards.draft.caption'),
  },
  {
    title: t('preschoolProgressSummaryPage.cards.average.title'),
    value: summary.value.averageScore ?? '-',
    caption: t('preschoolProgressSummaryPage.cards.average.caption'),
  },
])

function onBack() {
  router.push({ name: 'dashboard-preschool-assessments', query: selectedStudentId.value ? { studentId: selectedStudentId.value } : {} })
}

async function applySummary() {
  const studentId = selectedStudentId.value
  const selected = studentOptions.value.find((item) => String(item.value) === String(studentId))
  selectedStudentLabel.value = selected?.label || ''
  await loadProgressSummary(studentId)
}

onMounted(async () => {
  const studentId = String(route.query.studentId || '').trim()
  if (studentId) {
    setSelectedStudentId(studentId)
  }

  await loadLookupData()

  if (selectedStudentId.value) {
    await applySummary()
  }
})
</script>

<template>
  <MainLayout>
    <section class="preschool-progress-summary-page">
      <HeaderSection :title="t('preschoolProgressSummaryPage.title')" :subtitle="t('preschoolProgressSummaryPage.subtitle')" />

      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
          <label class="space-y-2 text-sm font-medium text-slate-700">
            <span>{{ t('preschoolProgressSummaryPage.filters.student') }}</span>
            <Dropdown
              :model-value="selectedStudentId"
              :options="studentOptions"
              option-label="label"
              option-value="value"
              class="w-full"
              :placeholder="t('preschoolProgressSummaryPage.placeholders.student')"
              @update:model-value="setSelectedStudentId"
            />
          </label>
          <div class="flex items-end gap-2">
            <Button type="button" variant="primary" size="md" rounded="xl" :loading="loading" @click="applySummary">
              {{ t('preschoolProgressSummaryPage.actions.refresh') }}
            </Button>
            <Button type="button" variant="ghost" size="md" rounded="xl" @click="onBack">
              {{ t('common.actions.back') }}
            </Button>
          </div>
        </div>
      </div>

      <div
        v-if="errorMessage"
        class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
      >
        {{ errorMessage }}
      </div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ProgressSummaryCard
          v-for="card in summaryCards"
          :key="card.title"
          :title="card.title"
          :value="card.value"
          :caption="card.caption"
        />
      </div>

      <div v-if="selectedStudentLabel" class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        {{ t('preschoolProgressSummaryPage.selectedStudent', { name: selectedStudentLabel }) }}
      </div>

      <ProgressTrendList :items="categories" />

      <div class="rounded-2xl border border-slate-200 bg-white">
        <div class="border-b border-slate-200 px-4 py-3">
          <h3 class="text-sm font-semibold text-slate-900">{{ t('preschoolProgressSummaryPage.recentTitle') }}</h3>
        </div>
        <div v-if="loading" class="px-4 py-8 text-sm text-slate-500">
          {{ t('preschoolProgressSummaryPage.loading') }}
        </div>
        <div v-else-if="!recentAssessments.length" class="px-4 py-8 text-sm text-slate-500">
          {{ t('preschoolProgressSummaryPage.emptyRecent') }}
        </div>
        <ul v-else class="divide-y divide-slate-100">
          <li v-for="item in recentAssessments" :key="item.id" class="px-4 py-3 text-sm text-slate-600">
            <strong class="text-slate-900">{{ item.periodLabel || '-' }}</strong>
            <span class="ml-2">{{ item.categoryName || item.category?.name || '-' }}</span>
            <span class="ml-2">{{ item.assessmentDate || '-' }}</span>
            <span class="ml-2">{{ item.score ?? '-' }}</span>
          </li>
        </ul>
      </div>
    </section>
  </MainLayout>
</template>

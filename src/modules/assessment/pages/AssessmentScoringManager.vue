<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useLanguage } from '@/composables/useLanguage'
import { assessmentFormApi } from '../services/assessmentFormApi'
import { useToast } from 'primevue/usetoast'

defineOptions({ name: 'AssessmentScoringManagerPage' })

const route = useRoute()
const { t } = useLanguage()
const toast = useToast()

const scoringRules = ref([])
const riskLevels   = ref([])
const isLoading    = ref(false)

async function load() {
  isLoading.value = true
  try {
    const res = await assessmentFormApi.getScoring(route.params.id)
    scoringRules.value = res.data.data?.scoring_rules ?? []
    riskLevels.value   = res.data.data?.risk_levels ?? []
  } finally {
    isLoading.value = false
  }
}

async function save() {
  await assessmentFormApi.updateScoring(route.params.id, {
    scoring_rules: scoringRules.value,
    risk_levels:   riskLevels.value,
  })
  toast.add({ severity: 'success', summary: t('common.success'), life: 3000 })
}

onMounted(load)
</script>

<template>
  <MainLayout>
    <div class="flex flex-col gap-6">
      <HeaderSection :title="t('scoring.title')">
        <template #actions>
          <Button :label="t('common.save')" icon="pi pi-save" @click="save" />
        </template>
      </HeaderSection>

      <!-- Scoring rules -->
      <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-100 px-5 py-3.5">
          <h3 class="text-sm font-semibold text-slate-800">{{ t('scoring.scoringRules') }}</h3>
        </div>
        <DataTable :value="scoringRules" :loading="isLoading">
          <template #empty>
            <div class="py-10 text-center text-sm text-slate-400">
              <i class="pi pi-list-check mb-3 block text-3xl" />
              {{ t('scoring.noRules') }}
            </div>
          </template>
          <Column field="rule_type" :header="t('scoring.ruleType')" />
          <Column field="max_score"  :header="t('scoring.maxScore')" />
          <Column field="pass_score" :header="t('scoring.passScore')" />
          <Column field="weight"     :header="t('scoring.weight')" />
        </DataTable>
      </div>

      <!-- Risk levels -->
      <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-100 px-5 py-3.5">
          <h3 class="text-sm font-semibold text-slate-800">{{ t('scoring.riskLevels') }}</h3>
        </div>
        <DataTable :value="riskLevels" :loading="isLoading">
          <template #empty>
            <div class="py-10 text-center text-sm text-slate-400">
              <i class="pi pi-chart-bar mb-3 block text-3xl" />
              {{ t('scoring.noRiskLevels') }}
            </div>
          </template>
          <Column field="level_name" :header="t('scoring.levelName')" />
          <Column field="min_score"  :header="t('scoring.minScore')" />
          <Column field="max_score"  :header="t('scoring.maxScore')" />
          <Column :header="t('scoring.color')">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <span class="h-4 w-4 rounded-full" :style="{ background: data.color }" />
                <span class="text-sm text-slate-700">{{ data.color }}</span>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </MainLayout>
</template>

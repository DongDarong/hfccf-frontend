<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'
import http from '@/services/http'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import Paginator from 'primevue/paginator'
import Tag from 'primevue/tag'
import { useToast } from 'primevue/usetoast'
import { dsamFormApi } from '../services/dsamFormApi'
import { dsamCoreApi } from '../services/dsamCoreApi'
import { dsamSubmissionApi } from '../services/dsamSubmissionApi'
import RiskBadge from '../components/shared/RiskBadge.vue'

defineOptions({ name: 'DsamSubmissionListPage' })

const router = useRouter()
const toast  = useToast()
const { t }  = useLanguage()

const items   = ref([])
const loading = ref(false)
const total   = ref(0)

// ── Filters & pagination ──────────────────────────────────────────────────────

const search   = ref('')
const page     = ref(1)
const perPage  = ref(20)

const filters = ref({ status: null, risk_level: null })

const statusOptions  = ['draft','in_progress','submitted','under_review','approved','rejected'].map(v => ({ label: v.replace('_',' '), value: v }))
const riskOptions    = ['low','medium','high','critical'].map(v => ({ label: v, value: v }))
const perPageOptions = [10, 20, 50, 100].map(v => ({ label: `${v} / page`, value: v }))
const statusSeverity = { draft: 'secondary', in_progress: 'warn', submitted: 'info', under_review: 'warn', approved: 'success', rejected: 'danger' }

// Reset to page 1 whenever a filter or search changes
watch([search, filters], () => { page.value = 1 }, { deep: true })

let searchDebounce = null
watch(search, () => {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(load, 350)
})

// ── Start Assessment dialog ───────────────────────────────────────────────────

const showDialog    = ref(false)
const dlgLoading    = ref(false)
const dlgStarting   = ref(false)
const formOptions   = ref([])
const yearOptions   = ref([])
const studentOptions = ref([])
const dlgForm    = ref(null)
const dlgYear    = ref(null)
const dlgStudent = ref(null)

async function openStartDialog() {
  showDialog.value = true
  dlgForm.value    = null
  dlgYear.value    = null
  dlgStudent.value = null

  if (formOptions.value.length && yearOptions.value.length && studentOptions.value.length) return

  dlgLoading.value = true
  try {
    const [formsRes, yearsRes, studentsRes] = await Promise.all([
      dsamFormApi.list({ status: 'published', per_page: 100 }),
      dsamCoreApi.academicYears(),
      http.get('/preschool/students', { params: { per_page: 200, status: 'active' } }),
    ])
    formOptions.value    = (formsRes.data.data ?? []).map(f => ({ label: f.name, value: f.id }))
    yearOptions.value    = (yearsRes.data.data ?? []).map(y => ({ label: y.name, value: y.id }))
    studentOptions.value = (studentsRes.data.data ?? []).map(s => ({
      label: `${s.full_name ?? [s.first_name, s.last_name].filter(Boolean).join(' ')} (${s.student_code ?? s.id})`,
      value: s.id,
    }))
  } catch {
    toast.add({ severity: 'error', summary: t('dsamSubmissions.startDialog.loadError'), life: 4000 })
    showDialog.value = false
  } finally {
    dlgLoading.value = false
  }
}

async function startAssessment() {
  if (!dlgForm.value || !dlgYear.value || !dlgStudent.value) return
  dlgStarting.value = true
  try {
    const res = await dsamSubmissionApi.create({
      form_template_id: dlgForm.value,
      student_id:       dlgStudent.value,
      academic_year_id: dlgYear.value,
    })
    showDialog.value = false
    router.push({ name: 'dsam-wizard', query: { submission: res.data.data.uuid } })
  } catch (e) {
    toast.add({ severity: 'error', summary: t('dsamSubmissions.startDialog.startError'), detail: e?.response?.data?.message ?? e.message, life: 5000 })
  } finally {
    dlgStarting.value = false
  }
}

// ── List ──────────────────────────────────────────────────────────────────────

async function load() {
  loading.value = true
  try {
    const params = { page: page.value, per_page: perPage.value }
    if (search.value.trim())        params.search     = search.value.trim()
    if (filters.value.status)       params.status     = filters.value.status
    if (filters.value.risk_level)   params.risk_level = filters.value.risk_level
    const res = await dsamSubmissionApi.list(params)
    items.value = res.data.data ?? []
    total.value = res.data.meta?.total ?? items.value.length
  } finally {
    loading.value = false
  }
}

function onPageChange(event) {
  page.value    = event.page + 1   // PrimeVue Paginator is 0-indexed
  perPage.value = event.rows
  load()
}

function onFilterChange() {
  page.value = 1
  load()
}

onMounted(load)
</script>

<template>
  <MainLayout>
    <div class="flex flex-col gap-6">
      <HeaderSection :title="t('dsamSubmissions.title')">
        <template #actions>
          <Button :label="t('dsamSubmissions.startAssessment')" icon="pi pi-plus" @click="openStartDialog" />
        </template>
      </HeaderSection>

      <!-- Search + Filters -->
      <div class="flex flex-wrap gap-3">
        <span class="p-input-icon-left flex-1 min-w-48">
          <i class="pi pi-search text-slate-400" />
          <InputText
            v-model="search"
            :placeholder="t('dsamSubmissions.searchPlaceholder')"
            class="w-full pl-8"
          />
        </span>
        <Select
          v-model="filters.status"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          :placeholder="t('dsamSubmissions.allStatuses')"
          show-clear
          class="w-44"
          @change="onFilterChange"
        />
        <Select
          v-model="filters.risk_level"
          :options="riskOptions"
          option-label="label"
          option-value="value"
          :placeholder="t('dsamSubmissions.allRiskLevels')"
          show-clear
          class="w-44"
          @change="onFilterChange"
        />
        <Select
          v-model="perPage"
          :options="perPageOptions"
          option-label="label"
          option-value="value"
          class="w-32"
          @change="onFilterChange"
        />
      </div>

      <!-- Result count -->
      <div class="flex items-center justify-between -mt-3">
        <p class="text-xs text-slate-400">
          {{ total }} {{ total !== 1 ? t('dsamSubmissions.results', total) : t('dsamSubmissions.results', 1) }}
          <template v-if="search.trim()"> {{ t('dsamSubmissions.resultsFor', { term: search.trim() }) }}</template>
        </p>
      </div>

      <DataTable
        :value="items"
        :loading="loading"
        class="rounded-xl border border-slate-200 bg-white shadow-sm"
      >
        <template #empty>
          <div class="py-12 text-center text-sm text-slate-400">
            <i class="pi pi-inbox mb-3 text-3xl block" />
            {{ t('dsamSubmissions.empty') }}
          </div>
        </template>

        <Column :header="t('dsamShared.cols.student')">
          <template #body="{ data }">
            <button
              class="text-left hover:text-violet-700 transition-colors"
              @click="data.student?.id && router.push({ name: 'dsam-student-profile', params: { id: data.student.id } })"
            >
              <p class="font-medium text-slate-800 hover:underline">{{ data.student?.full_name }}</p>
              <p class="text-xs text-slate-400">{{ data.student?.student_code }}</p>
            </button>
          </template>
        </Column>
        <Column :header="t('dsamShared.cols.form')">
          <template #body="{ data }">
            <span class="text-sm text-slate-700">{{ data.form_template?.name }}</span>
          </template>
        </Column>
        <Column :header="t('dsamShared.cols.year')" field="academic_year.name" />
        <Column :header="t('dsamShared.cols.status')">
          <template #body="{ data }">
            <Tag :severity="statusSeverity[data.status] ?? 'secondary'" :value="t('dsamShared.statuses.' + data.status) || data.status?.replace('_', ' ')" />
          </template>
        </Column>
        <Column :header="t('dsamShared.cols.score')">
          <template #body="{ data }">
            {{ data.score_percentage != null ? data.score_percentage.toFixed(1) + '%' : '—' }}
          </template>
        </Column>
        <Column :header="t('dsamShared.cols.risk')">
          <template #body="{ data }">
            <RiskBadge :level="data.risk_level" size="sm" />
          </template>
        </Column>
        <Column :header="t('dsamShared.cols.updated')">
          <template #body="{ data }">
            <span class="text-xs text-slate-400">
              {{ data.updated_at ? new Date(data.updated_at).toLocaleDateString() : '—' }}
            </span>
          </template>
        </Column>
        <Column :header="t('dsamShared.cols.actions')">
          <template #body="{ data }">
            <div class="flex gap-1">
              <Button
                v-if="data.can_edit"
                icon="pi pi-pencil"
                size="sm"
                severity="secondary"
                :title="t('dsamShared.actions.continue')"
                @click="router.push({ name: 'dsam-wizard', query: { submission: data.uuid } })"
              />
              <Button
                icon="pi pi-eye"
                size="sm"
                severity="secondary"
                :title="t('dsamShared.actions.view')"
                @click="router.push({ name: 'dsam-submission-detail', params: { id: data.uuid } })"
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <!-- Paginator -->
      <Paginator
        v-if="total > perPage"
        :rows="perPage"
        :total-records="total"
        :first="(page - 1) * perPage"
        :rows-per-page-options="[10, 20, 50, 100]"
        class="rounded-xl border border-slate-200 bg-white shadow-sm"
        @page="onPageChange"
      />
    </div>

    <!-- Start Assessment Dialog -->
    <Dialog
      v-model:visible="showDialog"
      :header="t('dsamSubmissions.startDialog.header')"
      :style="{ width: '28rem' }"
      :modal="true"
      :closable="!dlgStarting"
    >
      <div v-if="dlgLoading" class="flex justify-center py-8 text-slate-400">
        <i class="pi pi-spin pi-spinner text-2xl" />
      </div>

      <div v-else class="flex flex-col gap-4 pt-1">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-700">{{ t('dsamSubmissions.startDialog.formLabel') }}</label>
          <Select
            v-model="dlgForm"
            :options="formOptions"
            option-label="label"
            option-value="value"
            :placeholder="t('dsamSubmissions.startDialog.formPlaceholder')"
            class="w-full"
            filter
          />
          <p v-if="!formOptions.length" class="mt-1 text-xs text-amber-600">
            {{ t('dsamSubmissions.startDialog.noForms') }}
          </p>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-700">{{ t('dsamSubmissions.startDialog.yearLabel') }}</label>
          <Select
            v-model="dlgYear"
            :options="yearOptions"
            option-label="label"
            option-value="value"
            :placeholder="t('dsamSubmissions.startDialog.yearPlaceholder')"
            class="w-full"
          />
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-700">{{ t('dsamSubmissions.startDialog.studentLabel') }}</label>
          <Select
            v-model="dlgStudent"
            :options="studentOptions"
            option-label="label"
            option-value="value"
            :placeholder="t('dsamSubmissions.startDialog.studentPlaceholder')"
            class="w-full"
            filter
          />
        </div>
      </div>

      <template #footer>
        <Button :label="t('dsamShared.actions.cancel')" severity="secondary" :disabled="dlgStarting" @click="showDialog = false" />
        <Button
          :label="t('dsamSubmissions.startDialog.start')"
          icon="pi pi-play"
          :loading="dlgStarting"
          :disabled="!dlgForm || !dlgYear || !dlgStudent"
          @click="startAssessment"
        />
      </template>
    </Dialog>
  </MainLayout>
</template>

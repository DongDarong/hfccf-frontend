<script setup>
// Keep the Preschool lifecycle audit surface isolated so admins can review
// locks, overrides, and blocked writes without mixing that history into the
// reporting or settings pages.
import { computed, onMounted, ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import StatusBadge from '@/components/badges/StatusBadge.vue'
import Select from 'primevue/select'
import { useLanguage } from '@/composables/useLanguage'
import { usePreschoolReports } from '@/modules/preschool/composables/usePreschoolReports'
import { fetchLifecycleAuditLogs } from '@/modules/preschool/services/api/preschoolLifecycleAuditApi'

defineOptions({
  name: 'PreschoolLifecycleAuditPage',
})

const { t } = useLanguage()
const { loadReportPeriodOptions, reportPeriods } = usePreschoolReports()

const loading = ref(false)
const auditLogs = ref([])
const pagination = ref({ page: 1, perPage: 20, total: 0, totalPages: 1 })
const errorMessage = ref('')
const filters = ref({
  actionType: '',
  entityType: '',
  reportPeriodId: '',
})

const actionOptions = computed(() => [
  { label: t('preschoolLifecycleAuditPage.actions.all'), value: '' },
  { label: t('preschoolLifecycleAuditPage.actions.writeBlocked'), value: 'write.blocked' },
  { label: t('preschoolLifecycleAuditPage.actions.overrideAttempt'), value: 'override.attempt' },
  { label: t('preschoolLifecycleAuditPage.actions.overrideApproved'), value: 'override.approved' },
  { label: t('preschoolLifecycleAuditPage.actions.reportPeriodCreated'), value: 'report_period.created' },
  { label: t('preschoolLifecycleAuditPage.actions.reportPeriodFinalized'), value: 'report_period.finalized' },
  { label: t('preschoolLifecycleAuditPage.actions.reportPeriodLocked'), value: 'report_period.locked' },
  { label: t('preschoolLifecycleAuditPage.actions.reportPeriodArchived'), value: 'report_period.archived' },
  { label: t('preschoolLifecycleAuditPage.actions.reportPeriodActivated'), value: 'report_period.activated' },
  { label: t('preschoolLifecycleAuditPage.actions.academicYearClosed'), value: 'academic_year.closed' },
  { label: t('preschoolLifecycleAuditPage.actions.academicYearOpened'), value: 'academic_year.activated' },
  { label: t('preschoolLifecycleAuditPage.actions.termClosed'), value: 'academic_term.closed' },
  { label: t('preschoolLifecycleAuditPage.actions.termOpened'), value: 'academic_term.activated' },
])

const entityOptions = computed(() => [
  { label: t('preschoolLifecycleAuditPage.entities.all'), value: '' },
  { label: t('preschoolLifecycleAuditPage.entities.academicTerm'), value: 'academic_term' },
  { label: t('preschoolLifecycleAuditPage.entities.reportPeriod'), value: 'report_period' },
  { label: t('preschoolLifecycleAuditPage.entities.assessment'), value: 'assessment' },
  { label: t('preschoolLifecycleAuditPage.entities.attendance'), value: 'attendance' },
  { label: t('preschoolLifecycleAuditPage.entities.schedule'), value: 'schedule' },
  { label: t('preschoolLifecycleAuditPage.entities.assignment'), value: 'assignment' },
  { label: t('preschoolLifecycleAuditPage.entities.academicYear'), value: 'academic_year' },
])

const reportPeriodOptions = computed(() => [
  { label: t('preschoolLifecycleAuditPage.filters.allReportPeriods'), value: '' },
  ...reportPeriods.value.map((period) => ({
    label: period.label,
    value: String(period.id || period.label || ''),
    raw: period,
  })),
])

async function loadAuditLogs(page = 1) {
  loading.value = true
  errorMessage.value = ''

  try {
    const payload = await fetchLifecycleAuditLogs({
      page,
      perPage: pagination.value.perPage,
      actionType: filters.value.actionType,
      entityType: filters.value.entityType,
      reportPeriodId: filters.value.reportPeriodId,
    })

    auditLogs.value = payload.items || []
    pagination.value = payload.pagination || pagination.value
  } catch (error) {
    auditLogs.value = []
    errorMessage.value = error?.message || t('preschoolLifecycleAuditPage.loadingError')
  } finally {
    loading.value = false
  }
}

function refresh() {
  return loadAuditLogs(1)
}

function changePage(delta) {
  const nextPage = Math.min(
    Math.max((pagination.value.page || 1) + delta, 1),
    pagination.value.totalPages || 1,
  )

  return loadAuditLogs(nextPage)
}

function tone(actionType) {
  const normalized = String(actionType || '').toLowerCase()
  if (normalized === 'override.approved') return 'success'
  if (normalized === 'override.attempt' || normalized === 'write.blocked') return 'error'
  if (normalized.startsWith('report_period.')) return 'warning'
  return 'info'
}

function formatActor(item) {
  const actor = item.actor || {}
  const name = `${actor.firstName || ''} ${actor.lastName || ''}`.trim()
  return name || item.actorRole || '-'
}

function formatContext(item) {
  const parts = []
  if (item.academicYearId) parts.push(`${t('preschoolLifecycleAuditPage.context.academicYear')}: ${item.academicYearId}`)
  if (item.termId) parts.push(`${t('preschoolLifecycleAuditPage.context.term')}: ${item.termId}`)
  if (item.reportPeriodId) parts.push(`${t('preschoolLifecycleAuditPage.context.reportPeriod')}: ${item.reportPeriodId}`)
  return parts.length ? parts.join(' | ') : '-'
}

onMounted(async () => {
  await loadReportPeriodOptions()
  await loadAuditLogs()
})
</script>

<template>
  <MainLayout>
    <section class="space-y-4">
      <HeaderSection
        :title="t('preschoolLifecycleAuditPage.title')"
        :subtitle="t('preschoolLifecycleAuditPage.subtitle')"
      />

      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="grid gap-3 md:grid-cols-3 xl:grid-cols-4">
          <label class="space-y-2 text-sm font-medium text-slate-700">
            <span>{{ t('preschoolLifecycleAuditPage.filters.actionType') }}</span>
            <Select
              v-model="filters.actionType"
              :options="actionOptions"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </label>
          <label class="space-y-2 text-sm font-medium text-slate-700">
            <span>{{ t('preschoolLifecycleAuditPage.filters.entityType') }}</span>
            <Select
              v-model="filters.entityType"
              :options="entityOptions"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </label>
          <label class="space-y-2 text-sm font-medium text-slate-700">
            <span>{{ t('preschoolLifecycleAuditPage.filters.reportPeriod') }}</span>
            <Select
              v-model="filters.reportPeriodId"
              :options="reportPeriodOptions"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </label>

          <div class="flex items-end gap-2">
            <Button type="button" variant="primary" size="md" rounded="xl" :loading="loading" @click="refresh">
              {{ t('preschoolLifecycleAuditPage.actions.refresh') }}
            </Button>
          </div>
        </div>
      </div>

      <div v-if="errorMessage" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ errorMessage }}
      </div>

      <div v-if="loading" class="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-sm text-slate-500">
        {{ t('preschoolLifecycleAuditPage.loading') }}
      </div>

      <div v-else-if="!auditLogs.length" class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-sm text-slate-500">
        {{ t('preschoolLifecycleAuditPage.empty') }}
      </div>

      <div v-else class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200 text-sm">
            <thead class="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th class="px-4 py-3">{{ t('preschoolLifecycleAuditPage.columns.action') }}</th>
                <th class="px-4 py-3">{{ t('preschoolLifecycleAuditPage.columns.entity') }}</th>
                <th class="px-4 py-3">{{ t('preschoolLifecycleAuditPage.columns.actor') }}</th>
                <th class="px-4 py-3">{{ t('preschoolLifecycleAuditPage.columns.context') }}</th>
                <th class="px-4 py-3">{{ t('preschoolLifecycleAuditPage.columns.reason') }}</th>
                <th class="px-4 py-3">{{ t('preschoolLifecycleAuditPage.columns.createdAt') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr v-for="item in auditLogs" :key="item.id">
                <td class="px-4 py-3">
                  <StatusBadge :status="tone(item.actionType)" :label="item.actionType" :translate-label="false" :dot="false" size="sm" />
                  <div class="mt-1 text-xs font-medium text-slate-900">
                    {{ t(`preschoolLifecycleAuditPage.actions.${item.actionType}`) || item.actionType }}
                  </div>
                </td>
                <td class="px-4 py-3 text-slate-600">
                  <div class="space-y-1">
                    <p>{{ t(`preschoolLifecycleAuditPage.entities.${item.entityType}`) || item.entityType }}</p>
                    <p class="text-xs text-slate-500">#{{ item.entityId || '-' }}</p>
                  </div>
                </td>
                <td class="px-4 py-3 text-slate-600">{{ formatActor(item) }}</td>
                <td class="px-4 py-3 text-slate-600">{{ formatContext(item) }}</td>
                <td class="px-4 py-3 text-slate-600">{{ item.lockReason || item.overrideReason || '-' }}</td>
                <td class="px-4 py-3 text-slate-600">{{ item.createdAt || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-500">
          <div class="space-y-1">
            <span class="block">
              {{ t('preschoolLifecycleAuditPage.pagination.summary', { total: pagination.total || auditLogs.length }) }}
            </span>
            <span class="block">
              {{ t('preschoolLifecycleAuditPage.pagination.page', { page: pagination.page || 1, totalPages: pagination.totalPages || 1 }) }}
            </span>
          </div>
          <div class="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="md"
              rounded="xl"
              :disabled="(pagination.page || 1) <= 1 || loading"
              @click="changePage(-1)"
            >
              {{ t('preschoolLifecycleAuditPage.pagination.previous') }}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="md"
              rounded="xl"
              :disabled="(pagination.page || 1) >= (pagination.totalPages || 1) || loading"
              @click="changePage(1)"
            >
              {{ t('preschoolLifecycleAuditPage.pagination.next') }}
            </Button>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>


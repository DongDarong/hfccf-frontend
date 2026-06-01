<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import { useLanguage } from '@/composables/useLanguage'
import { formatDate } from '@/utils/date'
import {
  fetchPreschoolAttendance,
  fetchPreschoolClasses,
} from '@/modules/preschool/services/preschoolApi'

defineOptions({ name: 'PreschoolAdminAttendanceHistoryPage' })

const { t } = useLanguage()
const router = useRouter()

const records = ref([])
const classOptions = ref([])
const loading = ref(false)
const errorMessage = ref('')
const currentPage = ref(1)
const pagination = ref({ currentPage: 1, lastPage: 1, total: 0 })

const filters = ref({ search: '', classId: '', status: '', date: '' })

const statusOptions = computed(() => [
  { label: t('preschoolAdminAttendancePage.status.present'), value: 'present' },
  { label: t('preschoolAdminAttendancePage.status.absent'), value: 'absent' },
  { label: t('preschoolAdminAttendancePage.status.late'), value: 'late' },
  { label: t('preschoolAdminAttendancePage.status.excused'), value: 'excused' },
])

const STATUS_STYLE = {
  present: 'bg-emerald-50 text-emerald-700',
  absent: 'bg-rose-50 text-rose-700',
  late: 'bg-amber-50 text-amber-700',
  excused: 'bg-sky-50 text-sky-700',
}

async function loadClasses() {
  try {
    const res = await fetchPreschoolClasses({ page: 1, perPage: 100 })
    classOptions.value = (res.items || []).map((c) => ({ label: c.name, value: c.id }))
  } catch {
    classOptions.value = []
  }
}

async function loadRecords(page = 1) {
  loading.value = true
  errorMessage.value = ''
  try {
    const res = await fetchPreschoolAttendance({
      page,
      perPage: 20,
      search: filters.value.search,
      classId: filters.value.classId,
      status: filters.value.status,
      attendanceDate: filters.value.date,
    })
    records.value = res.items || []
    const p = res.pagination || {}
    pagination.value = {
      currentPage: p.page || page,
      lastPage: p.totalPages || 1,
      total: p.total || records.value.length,
    }
    currentPage.value = pagination.value.currentPage
  } catch (e) {
    errorMessage.value = e?.message || t('preschoolAdminAttendanceHistoryPage.messages.loadFailed')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadClasses()
  await loadRecords()
})
</script>

<template>
  <MainLayout>
    <section class="space-y-4">
      <HeaderSection
        :title="t('preschoolAdminAttendanceHistoryPage.title')"
        :subtitle="t('preschoolAdminAttendanceHistoryPage.subtitle')"
      />

      <!-- Filters -->
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('preschoolAdminAttendanceHistoryPage.filters.search') }}</span>
            <input v-model="filters.search" type="search"
              class="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-300"
              :placeholder="t('preschoolAdminAttendanceHistoryPage.placeholders.search')">
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('preschoolAdminAttendanceHistoryPage.filters.class') }}</span>
            <select v-model="filters.classId" class="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-300">
              <option value="">{{ t('preschoolAdminAttendanceHistoryPage.filters.allClasses') }}</option>
              <option v-for="c in classOptions" :key="c.value" :value="c.value">{{ c.label }}</option>
            </select>
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('preschoolAdminAttendanceHistoryPage.filters.status') }}</span>
            <select v-model="filters.status" class="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-300">
              <option value="">{{ t('preschoolAdminAttendanceHistoryPage.filters.allStatuses') }}</option>
              <option v-for="s in statusOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('preschoolAdminAttendanceHistoryPage.filters.date') }}</span>
            <input v-model="filters.date" type="date" class="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-300">
          </label>
        </div>

        <div class="mt-3 flex gap-2">
          <Button type="button" variant="primary" size="md" rounded="xl" :loading="loading" @click="loadRecords(1)">
            {{ t('preschoolAdminAttendanceHistoryPage.actions.apply') }}
          </Button>
          <Button type="button" variant="ghost" size="md" rounded="xl" @click="router.push({ name: 'dashboard-preschool-admin-attendance' })">
            {{ t('preschoolAdminAttendanceHistoryPage.actions.back') }}
          </Button>
        </div>
      </div>

      <div v-if="errorMessage" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{{ errorMessage }}</div>

      <!-- Table -->
      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div v-if="loading" class="px-4 py-12 text-center text-sm text-slate-400">{{ t('preschoolReportsShared.loading') }}</div>
        <div v-else-if="!records.length" class="px-4 py-12 text-center text-sm text-slate-400">{{ t('preschoolAdminAttendanceHistoryPage.messages.empty') }}</div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-100 text-sm">
            <thead class="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th class="w-12 px-4 py-3 font-semibold">{{ t('preschoolAdminAttendanceHistoryPage.columns.no') }}</th>
                <th class="px-4 py-3 font-semibold">{{ t('preschoolAdminAttendanceHistoryPage.columns.student') }}</th>
                <th class="px-4 py-3 font-semibold">{{ t('preschoolAdminAttendanceHistoryPage.columns.class') }}</th>
                <th class="px-4 py-3 font-semibold">{{ t('preschoolAdminAttendanceHistoryPage.columns.date') }}</th>
                <th class="px-4 py-3 font-semibold">{{ t('preschoolAdminAttendanceHistoryPage.columns.status') }}</th>
                <th class="px-4 py-3 font-semibold">{{ t('preschoolAdminAttendanceHistoryPage.columns.note') }}</th>
                <th class="px-4 py-3 font-semibold">{{ t('preschoolAdminAttendanceHistoryPage.columns.recordedBy') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 bg-white">
              <tr v-for="(record, index) in records" :key="record.id">
                <td class="px-4 py-3 text-slate-400 tabular-nums">{{ (pagination.currentPage - 1) * 20 + index + 1 }}</td>
                <td class="px-4 py-3 font-medium text-slate-900">{{ record.studentName || '—' }}</td>
                <td class="px-4 py-3 text-slate-600">{{ record.className || '—' }}</td>
                <td class="px-4 py-3 text-slate-600">{{ formatDate(record.attendanceDate) || record.attendanceDate || '—' }}</td>
                <td class="px-4 py-3">
                  <span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="STATUS_STYLE[record.status] || 'bg-slate-100 text-slate-600'">
                    {{ t(`preschoolAdminAttendancePage.status.${record.status}`) || record.status || '—' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-slate-500">{{ record.note || '—' }}</td>
                <td class="px-4 py-3 text-slate-500">{{ record.recordedByName || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.lastPage > 1" class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
          <span class="text-xs text-slate-500">
            {{ t('preschoolAdminAttendanceHistoryPage.pagination.summary', { page: pagination.currentPage, lastPage: pagination.lastPage, total: pagination.total }) }}
          </span>
          <div class="flex gap-2">
            <Button type="button" variant="ghost" size="sm" rounded="xl" :disabled="pagination.currentPage <= 1 || loading" @click="loadRecords(pagination.currentPage - 1)">
              {{ t('preschoolAdminAttendanceHistoryPage.pagination.previous') }}
            </Button>
            <Button type="button" variant="ghost" size="sm" rounded="xl" :disabled="pagination.currentPage >= pagination.lastPage || loading" @click="loadRecords(pagination.currentPage + 1)">
              {{ t('preschoolAdminAttendanceHistoryPage.pagination.next') }}
            </Button>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

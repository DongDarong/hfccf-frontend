<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { useLanguage } from '@/composables/useLanguage'
import {
  fetchPreschoolTeachers,
  savePreschoolTeacherAttendance,
} from '@/modules/preschool/services/preschoolApi'

defineOptions({ name: 'PreschoolAdminTeacherAttendancePage' })

const { t } = useLanguage()
const toast = useToast()
const router = useRouter()

const selectedDate = ref(new Date().toISOString().slice(0, 10))
const saveUnavailable = ref(false)
const teachers = ref([])
const attendanceMap = ref({})
const loading = ref(false)
const saving = ref(false)
const errorMessage = ref('')

const statusOptions = computed(() => [
  { value: 'present', short: t('preschoolAttendanceStatus.presentShort'), label: t('preschoolAttendanceStatus.present'), active: 'border-emerald-300 bg-emerald-50 text-emerald-700', ring: 'ring-emerald-200' },
  { value: 'absent',  short: t('preschoolAttendanceStatus.absentShort'),  label: t('preschoolAttendanceStatus.absent'),  active: 'border-rose-300 bg-rose-50 text-rose-700',       ring: 'ring-rose-200' },
  { value: 'late',    short: t('preschoolAttendanceStatus.lateShort'),    label: t('preschoolAttendanceStatus.late'),    active: 'border-amber-300 bg-amber-50 text-amber-700',    ring: 'ring-amber-200' },
  { value: 'excused', short: t('preschoolAttendanceStatus.excusedShort'), label: t('preschoolAttendanceStatus.excused'), active: 'border-sky-300 bg-sky-50 text-sky-700',          ring: 'ring-sky-200' },
])

const markedCount = computed(() => Object.values(attendanceMap.value).filter((e) => e.status).length)
const summary = computed(() => t('preschoolAdminTeacherAttendancePage.summary', { marked: markedCount.value, total: teachers.value.length }))

function shiftDate(days) {
  const d = new Date(selectedDate.value)
  d.setDate(d.getDate() + days)
  selectedDate.value = d.toISOString().slice(0, 10)
}

function buildMap(teacherList) {
  const map = {}
  for (const teacher of teacherList) map[teacher.id] = { status: '', note: '', existingId: null }
  return map
}

function markAll(status) {
  for (const id of Object.keys(attendanceMap.value)) attendanceMap.value[id].status = status
}

function clearAll() {
  for (const id of Object.keys(attendanceMap.value)) { attendanceMap.value[id].status = ''; attendanceMap.value[id].note = '' }
}

function toggleStatus(teacherId, value) {
  if (!attendanceMap.value[teacherId]) return
  attendanceMap.value[teacherId].status = attendanceMap.value[teacherId].status === value ? '' : value
}

async function loadDay() {
  loading.value = true
  errorMessage.value = ''
  try {
    const res = await fetchPreschoolTeachers({ page: 1, perPage: 100 })
    teachers.value = res.items || []
    attendanceMap.value = buildMap(teachers.value)
  } catch (e) {
    errorMessage.value = e?.message || t('preschoolAdminTeacherAttendancePage.messages.loadFailed')
  } finally { loading.value = false }
}

async function saveAll() {
  if (!selectedDate.value) return
  saving.value = true
  try {
    const tasks = teachers.value.filter((t) => attendanceMap.value[t.id]?.status).map((teacher) => {
      const entry = attendanceMap.value[teacher.id]
      return savePreschoolTeacherAttendance({
        ...(entry.existingId ? { id: entry.existingId } : {}),
        teacher_id: teacher.id, attendance_date: selectedDate.value,
        status: entry.status, note: entry.note || '',
      })
    })
    await Promise.all(tasks)
    toast.add({ severity: 'success', summary: t('preschoolAdminTeacherAttendancePage.messages.saved'), life: 3000 })
    await loadDay()
  } catch (e) {
    const is404 = e?.response?.status === 404 || String(e?.message || '').includes('404')
    if (is404) saveUnavailable.value = true
    else toast.add({ severity: 'error', summary: t('preschoolAdminTeacherAttendancePage.messages.saveFailed'), life: 4000 })
  } finally { saving.value = false }
}

onMounted(loadDay)
</script>

<template>
  <MainLayout>
    <Toast />
    <section class="space-y-4">
      <HeaderSection :title="t('preschoolAdminTeacherAttendancePage.title')" :subtitle="t('preschoolAdminTeacherAttendancePage.subtitle')" />

      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex flex-wrap items-end gap-3">
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('preschoolAdminTeacherAttendancePage.filters.date') }}</span>
            <div class="flex items-center gap-1">
              <button type="button" class="flex h-10 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40" :disabled="loading" @click="shiftDate(-1)">‹</button>
              <input v-model="selectedDate" type="date" class="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-300" :disabled="loading" @change="loadDay">
              <button type="button" class="flex h-10 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40" :disabled="loading" @click="shiftDate(1)">›</button>
            </div>
          </label>
          <Button type="button" variant="ghost" size="md" rounded="xl" :disabled="loading" @click="selectedDate = new Date().toISOString().slice(0, 10); loadDay()">Today</Button>
          <Button type="button" variant="ghost" size="md" rounded="xl" @click="router.push({ name: 'dashboard-preschool-admin-attendance' })">{{ t('preschoolAdminTeacherAttendancePage.actions.back') }}</Button>
        </div>
      </div>

      <div v-if="errorMessage" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{{ errorMessage }}</div>
      <div v-if="loading" class="rounded-2xl border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-400">{{ t('preschoolReportsShared.loading') }}</div>
      <div v-else-if="!teachers.length" class="rounded-2xl border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-400">{{ t('preschoolAdminTeacherAttendancePage.messages.noTeachers') }}</div>

      <div v-else class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <span class="text-sm text-slate-500">{{ summary }}</span>
          <div class="flex flex-wrap gap-2">
            <Button type="button" variant="ghost" size="sm" rounded="xl" :disabled="saving" @click="markAll('present')">{{ t('preschoolAdminTeacherAttendancePage.actions.markAllPresent') }}</Button>
            <Button type="button" variant="ghost" size="sm" rounded="xl" :disabled="saving" @click="markAll('absent')">{{ t('preschoolAdminTeacherAttendancePage.actions.markAllAbsent') }}</Button>
            <Button type="button" variant="ghost" size="sm" rounded="xl" :disabled="saving" @click="clearAll">{{ t('preschoolAdminTeacherAttendancePage.actions.clearAll') }}</Button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-100 text-sm">
            <thead class="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th class="px-4 py-3 font-semibold">{{ t('preschoolAdminTeacherAttendancePage.columns.teacher') }}</th>
                <th class="px-4 py-3 font-semibold">{{ t('preschoolAdminTeacherAttendancePage.columns.status') }}</th>
                <th class="px-4 py-3 font-semibold">{{ t('preschoolAdminTeacherAttendancePage.columns.note') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 bg-white">
              <tr v-for="(teacher, index) in teachers" :key="teacher.id" :class="index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'">
                <td class="px-4 py-3">
                  <p class="font-medium text-slate-900">{{ teacher.displayName || teacher.name || teacher.username }}</p>
                  <p v-if="teacher.roleCode" class="text-xs text-slate-400">{{ teacher.roleCode }}</p>
                </td>
                <td class="px-4 py-3">
                  <div class="flex gap-1">
                    <button v-for="opt in statusOptions" :key="opt.value" type="button"
                      class="min-w-[2.2rem] rounded-lg border px-2 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2"
                      :class="attendanceMap[teacher.id]?.status === opt.value ? `${opt.active} ${opt.ring}` : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-600'"
                      :title="opt.label" @click="toggleStatus(teacher.id, opt.value)">
                      {{ opt.short }}
                    </button>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <input v-model="attendanceMap[teacher.id].note" type="text"
                    class="w-full min-w-[140px] rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 placeholder:text-slate-300 focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-200"
                    :placeholder="t('preschoolAdminTeacherAttendancePage.placeholders.note')">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
          <p v-if="saveUnavailable" class="text-xs text-amber-600">Teacher attendance saving is not yet available on the backend.</p>
          <p v-else class="text-xs text-slate-400">{{ t('preschoolAdminTeacherAttendancePage.messages.skippedNote') }}</p>
          <Button type="button" variant="primary" size="md" rounded="xl" :loading="saving" :disabled="saving || markedCount === 0 || saveUnavailable" @click="saveAll">
            {{ saving ? t('preschoolAdminTeacherAttendancePage.actions.saving') : t('preschoolAdminTeacherAttendancePage.actions.save') }}
          </Button>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

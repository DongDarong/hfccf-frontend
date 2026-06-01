<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import { useLanguage } from '@/composables/useLanguage'
import {
  fetchSportAttendance,
  fetchSportCoaches,
  saveSportCoachAttendance,
} from '@/modules/sport/services/sportApi'

defineOptions({
  name: 'SportAdminAttendanceCoachesPage',
})

const { t } = useLanguage()
const router = useRouter()
const toast = useToast()

const selectedDate = ref(new Date().toISOString().slice(0, 10))
const coaches = ref([])
const attendanceMap = ref({})
const loading = ref(false)
const saving = ref(false)
const errorMessage = ref('')

const statusOptions = computed(() => [
  { value: 'present', label: t('sportAttendanceStatus.present'), short: t('sportAttendanceStatus.presentShort'), active: 'border-emerald-300 bg-emerald-50 text-emerald-700', ring: 'ring-emerald-200' },
  { value: 'absent', label: t('sportAttendanceStatus.absent'), short: t('sportAttendanceStatus.absentShort'), active: 'border-rose-300 bg-rose-50 text-rose-700', ring: 'ring-rose-200' },
  { value: 'late', label: t('sportAttendanceStatus.late'), short: t('sportAttendanceStatus.lateShort'), active: 'border-amber-300 bg-amber-50 text-amber-700', ring: 'ring-amber-200' },
  { value: 'excused', label: t('sportAttendanceStatus.excused'), short: t('sportAttendanceStatus.excusedShort'), active: 'border-sky-300 bg-sky-50 text-sky-700', ring: 'ring-sky-200' },
])

const markedCount = computed(() => Object.values(attendanceMap.value).filter((entry) => entry.status).length)
const summary = computed(() => t('sportAdminCoachAttendancePage.summary', { marked: markedCount.value, total: coaches.value.length }))

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function shiftDate(days) {
  const date = new Date(selectedDate.value)
  date.setDate(date.getDate() + days)
  selectedDate.value = date.toISOString().slice(0, 10)
}

function buildMap(coachList, existingRecords) {
  const map = {}

  for (const coach of coachList) {
    const existing = existingRecords.find((record) => String(record.coachId) === String(coach.id))

    map[coach.id] = {
      status: existing?.status || '',
      note: existing?.note || '',
      existingId: existing?.id || null,
    }
  }

  return map
}

async function loadDay() {
  loading.value = true
  errorMessage.value = ''

  try {
    const [coachesResponse, attendanceResponse] = await Promise.all([
      fetchSportCoaches({ page: 1, perPage: 200, status: 'active' }),
      fetchSportAttendance({
        attendanceType: 'coach',
        attendanceDate: selectedDate.value,
        page: 1,
        perPage: 200,
      }),
    ])

    coaches.value = coachesResponse.items || []
    attendanceMap.value = buildMap(coaches.value, attendanceResponse.items || [])
  } catch (error) {
    errorMessage.value = error?.message || t('sportAdminCoachAttendancePage.messages.loadFailed')
  } finally {
    loading.value = false
  }
}

function markAll(status) {
  for (const id of Object.keys(attendanceMap.value)) {
    attendanceMap.value[id].status = status
  }
}

function clearAll() {
  for (const id of Object.keys(attendanceMap.value)) {
    attendanceMap.value[id].status = ''
    attendanceMap.value[id].note = ''
  }
}

function toggleStatus(coachId, value) {
  if (!attendanceMap.value[coachId]) return
  attendanceMap.value[coachId].status = attendanceMap.value[coachId].status === value ? '' : value
}

async function saveAll() {
  if (!selectedDate.value) return

  saving.value = true

  try {
    const tasks = coaches.value
      .filter((coach) => attendanceMap.value[coach.id]?.status)
      .map((coach) => {
        const entry = attendanceMap.value[coach.id]

        return saveSportCoachAttendance({
          ...(entry.existingId ? { id: entry.existingId } : {}),
          coachId: coach.id,
          attendanceDate: selectedDate.value,
          status: entry.status,
          note: entry.note || '',
        })
      })

    await Promise.all(tasks)
    toast.add({ severity: 'success', summary: t('sportAdminCoachAttendancePage.messages.saved'), life: 3000 })
    await loadDay()
  } catch {
    toast.add({ severity: 'error', summary: t('sportAdminCoachAttendancePage.messages.saveFailed'), life: 4000 })
  } finally {
    saving.value = false
  }
}

watch(selectedDate, () => {
  void loadDay()
}, { immediate: true })
</script>

<template>
  <MainLayout>
    <Toast />
    <section class="sport-attendance-sheet">
      <HeaderSection
        :title="t('sportAdminCoachAttendancePage.title')"
        :subtitle="t('sportAdminCoachAttendancePage.subtitle')"
      />

      <div class="sport-attendance-sheet__controls">
        <label class="sport-attendance-sheet__field">
          <span class="sport-attendance-sheet__label">{{ t('sportAdminCoachAttendancePage.filters.date') }}</span>
          <div class="sport-attendance-sheet__date">
            <button type="button" class="sport-attendance-sheet__nav" :disabled="loading" @click="shiftDate(-1)">&#8249;</button>
            <input v-model="selectedDate" type="date" class="sport-attendance-sheet__date-input" :disabled="loading" />
            <button type="button" class="sport-attendance-sheet__nav" :disabled="loading" @click="shiftDate(1)">&#8250;</button>
          </div>
        </label>

        <Button type="button" variant="ghost" size="md" rounded="xl" :disabled="loading" @click="selectedDate = todayIso()">
          Today
        </Button>

        <Button type="button" variant="ghost" size="md" rounded="xl" @click="router.push({ name: 'dashboard-sport-admin-attendance' })">
          {{ t('sportAdminCoachAttendancePage.actions.back') }}
        </Button>
      </div>

      <div v-if="errorMessage" class="sport-attendance-sheet__error">
        {{ errorMessage }}
      </div>

      <div v-else-if="loading" class="sport-attendance-sheet__empty">
        {{ t('preschoolReportsShared.loading') }}
      </div>

      <div v-else-if="!coaches.length" class="sport-attendance-sheet__empty">
        {{ t('sportAdminCoachAttendancePage.messages.noCoaches') }}
      </div>

      <div v-else class="sport-attendance-sheet__panel">
        <div class="sport-attendance-sheet__topbar">
          <span class="sport-attendance-sheet__summary">{{ summary }}</span>
          <div class="sport-attendance-sheet__actions">
            <Button type="button" variant="ghost" size="sm" rounded="xl" :disabled="saving" @click="markAll('present')">
              {{ t('sportAdminCoachAttendancePage.actions.markAllPresent') }}
            </Button>
            <Button type="button" variant="ghost" size="sm" rounded="xl" :disabled="saving" @click="markAll('absent')">
              {{ t('sportAdminCoachAttendancePage.actions.markAllAbsent') }}
            </Button>
            <Button type="button" variant="ghost" size="sm" rounded="xl" :disabled="saving" @click="clearAll">
              {{ t('sportAdminCoachAttendancePage.actions.clearAll') }}
            </Button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="sport-attendance-sheet__table">
            <thead>
              <tr>
                <th>{{ t('sportAdminCoachAttendancePage.columns.coach') }}</th>
                <th>{{ t('sportAdminCoachAttendancePage.columns.status') }}</th>
                <th>{{ t('sportAdminCoachAttendancePage.columns.note') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(coach, index) in coaches" :key="coach.id" :class="index % 2 === 0 ? 'is-even' : 'is-odd'">
                <td>
                  <p class="sport-attendance-sheet__person">{{ coach.displayName || coach.name || coach.username }}</p>
                  <p v-if="coach.roleCode" class="sport-attendance-sheet__meta">{{ coach.roleCode }}</p>
                </td>
                <td>
                  <div class="sport-attendance-sheet__status-group">
                    <button
                      v-for="option in statusOptions"
                      :key="option.value"
                      type="button"
                      class="sport-attendance-sheet__status-btn"
                      :class="attendanceMap[coach.id]?.status === option.value ? `${option.active} ${option.ring}` : ''"
                      :disabled="loading || saving"
                      :title="option.label"
                      @click="toggleStatus(coach.id, option.value)"
                    >
                      {{ option.short }}
                    </button>
                  </div>
                </td>
                <td>
                  <input
                    v-model="attendanceMap[coach.id].note"
                    type="text"
                    class="sport-attendance-sheet__note"
                    :placeholder="t('sportAdminCoachAttendancePage.placeholders.note')"
                    :disabled="loading || saving"
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="sport-attendance-sheet__footer">
          <p class="sport-attendance-sheet__footer-note">
            {{ t('sportAdminCoachAttendancePage.messages.skippedNote') }}
          </p>
          <Button
            type="button"
            variant="primary"
            size="md"
            rounded="xl"
            :loading="saving"
            :disabled="saving || markedCount === 0"
            @click="saveAll"
          >
            {{ saving ? t('sportAdminCoachAttendancePage.actions.saving') : t('sportAdminCoachAttendancePage.actions.save') }}
          </Button>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

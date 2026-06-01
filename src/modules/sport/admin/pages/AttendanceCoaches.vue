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
const heroStats = computed(() => [
  {
    key: 'date',
    label: t('sportAdminCoachAttendancePage.filters.date'),
    value: selectedDate.value,
  },
  {
    key: 'coaches',
    label: t('sportAdminCoachAttendancePage.columns.coach'),
    value: `${coaches.value.length}`,
  },
  {
    key: 'progress',
    label: 'Progress',
    value: `${markedCount.value}/${coaches.value.length}`,
  },
])

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
      fetchSportCoaches({ page: 1, perPage: 100, status: 'active' }),
      fetchSportAttendance({
        attendanceType: 'coach',
        attendanceDate: selectedDate.value,
        page: 1,
        perPage: 100,
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

      <div class="att-hero">
        <div class="att-hero__copy">
          <p class="att-hero__eyebrow">Coaches</p>
          <h2 class="att-hero__title">{{ t('sportAdminCoachAttendancePage.title') }}</h2>
          <p class="att-hero__text">{{ t('sportAdminCoachAttendancePage.subtitle') }}</p>
        </div>

        <div class="att-hero__stats">
          <div v-for="stat in heroStats" :key="stat.key" class="att-stat">
            <p class="att-stat__value">{{ stat.value }}</p>
            <p class="att-stat__label">{{ stat.label }}</p>
          </div>
        </div>
      </div>

      <div class="sport-attendance-sheet__controls att-toolbar">
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

      <div v-else class="sport-attendance-sheet__panel att-panel">
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

<style scoped>
.sport-attendance-sheet {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 0.75rem;
}

.att-hero {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.2rem 1.25rem;
  border-radius: 1.45rem;
  border: 1px solid #dbe7f3;
  background:
    radial-gradient(circle at top right, rgba(125, 211, 252, 0.18), transparent 22%),
    radial-gradient(circle at bottom left, rgba(167, 243, 208, 0.15), transparent 24%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(247, 250, 252, 0.98) 100%);
  box-shadow: 0 26px 70px -46px rgba(15, 23, 42, 0.52);
}

.att-hero__copy {
  flex: 1 1 300px;
  min-width: 0;
}

.att-hero__eyebrow {
  margin: 0 0 0.35rem;
  color: #0f766e;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.att-hero__title {
  margin: 0 0 0.35rem;
  color: #0f172a;
  font-size: clamp(1.35rem, 2vw, 1.8rem);
  font-weight: 800;
  line-height: 1.1;
}

.att-hero__text {
  margin: 0;
  max-width: 56ch;
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.6;
}

.att-hero__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
  flex: 0 1 420px;
  width: 100%;
}

.att-stat {
  padding: 0.9rem 0.95rem;
  border-radius: 1rem;
  border: 1px solid #dce6f2;
  background: rgba(255, 255, 255, 0.84);
}

.att-stat__value {
  margin: 0 0 0.2rem;
  color: #0f172a;
  font-size: 1.2rem;
  font-weight: 800;
  line-height: 1.1;
  word-break: break-word;
}

.att-stat__label {
  margin: 0;
  color: #64748b;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.sport-attendance-sheet__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  align-items: end;
  padding: 1rem 1.15rem;
  border-radius: 1.25rem;
  border: 1px solid #dce6f2;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
  box-shadow: 0 20px 54px -42px rgba(15, 23, 42, 0.45);
}

.att-toolbar {
  position: relative;
}

.sport-attendance-sheet__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.sport-attendance-sheet__label {
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.sport-attendance-sheet__date {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.sport-attendance-sheet__nav {
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 0.75rem;
  border: 1px solid #dbe4f0;
  background: #fff;
  color: #475569;
  font-size: 1.1rem;
  font-weight: 700;
}

.sport-attendance-sheet__date-input {
  height: 2.55rem;
  border-radius: 0.75rem;
  border: 1px solid #dbe4f0;
  padding: 0 0.85rem;
  color: #0f172a;
  background: #fff;
}

.sport-attendance-sheet__empty,
.sport-attendance-sheet__error {
  padding: 1rem 1.15rem;
  border-radius: 1.1rem;
  border: 1px solid #dbe4f0;
  background: #fff;
  color: #64748b;
  font-size: 0.92rem;
}

.sport-attendance-sheet__error {
  border-color: #fecdd3;
  background: #fff1f2;
  color: #be123c;
}

.sport-attendance-sheet__panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 1.1rem;
  border-radius: 1.3rem;
  border: 1px solid #dce6f2;
  background:
    radial-gradient(circle at top left, rgba(186, 230, 253, 0.16), transparent 24%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%);
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.5);
}

.att-panel {
  position: relative;
}

.sport-attendance-sheet__topbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.sport-attendance-sheet__summary {
  color: #475569;
  font-size: 0.92rem;
  font-weight: 600;
}

.sport-attendance-sheet__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.sport-attendance-sheet__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 760px;
}

.sport-attendance-sheet__table thead {
  background: #f8fafc;
  color: #64748b;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
}

.sport-attendance-sheet__table th,
.sport-attendance-sheet__table td {
  padding: 0.85rem 0.95rem;
  text-align: left;
  border-bottom: 1px solid #eef2f7;
}

.sport-attendance-sheet__table tbody tr.is-even {
  background: #fff;
}

.sport-attendance-sheet__table tbody tr.is-odd {
  background: #f8fafc;
}

.sport-attendance-sheet__person {
  margin: 0;
  color: #0f172a;
  font-weight: 700;
}

.sport-attendance-sheet__meta {
  margin: 0.2rem 0 0;
  color: #94a3b8;
  font-size: 0.74rem;
}

.sport-attendance-sheet__status-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.sport-attendance-sheet__status-btn {
  min-width: 2.15rem;
  padding: 0.35rem 0.45rem;
  border-radius: 0.55rem;
  border: 1px solid #dbe4f0;
  background: #fff;
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 700;
}

.sport-attendance-sheet__note {
  width: 100%;
  min-width: 160px;
  height: 2.35rem;
  border-radius: 0.65rem;
  border: 1px solid #dbe4f0;
  padding: 0 0.75rem;
  font-size: 0.8rem;
  color: #0f172a;
}

.sport-attendance-sheet__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border-top: 1px solid #eef2f7;
  padding-top: 0.9rem;
}

.sport-attendance-sheet__footer-note {
  margin: 0;
  color: #94a3b8;
  font-size: 0.78rem;
}
</style>

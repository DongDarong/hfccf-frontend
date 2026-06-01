<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Select from 'primevue/select'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import { useLanguage } from '@/composables/useLanguage'
import {
  fetchSportAttendance,
  fetchSportPlayers,
  fetchSportTeams,
  saveSportPlayerAttendance,
} from '@/modules/sport/services/sportApi'

defineOptions({
  name: 'SportAdminAttendancePlayersPage',
})

const { t } = useLanguage()
const router = useRouter()
const toast = useToast()

const selectedTeamId = ref('')
const selectedDate = ref(new Date().toISOString().slice(0, 10))
const teamOptions = ref([])
const players = ref([])
const attendanceMap = ref({})
const loading = ref(false)
const teamsLoading = ref(false)
const saving = ref(false)
const errorMessage = ref('')

const statusOptions = computed(() => [
  { value: 'present', label: t('sportAttendanceStatus.present'), short: t('sportAttendanceStatus.presentShort'), active: 'border-emerald-300 bg-emerald-50 text-emerald-700', ring: 'ring-emerald-200' },
  { value: 'absent', label: t('sportAttendanceStatus.absent'), short: t('sportAttendanceStatus.absentShort'), active: 'border-rose-300 bg-rose-50 text-rose-700', ring: 'ring-rose-200' },
  { value: 'late', label: t('sportAttendanceStatus.late'), short: t('sportAttendanceStatus.lateShort'), active: 'border-amber-300 bg-amber-50 text-amber-700', ring: 'ring-amber-200' },
  { value: 'excused', label: t('sportAttendanceStatus.excused'), short: t('sportAttendanceStatus.excusedShort'), active: 'border-sky-300 bg-sky-50 text-sky-700', ring: 'ring-sky-200' },
])

const markedCount = computed(() => Object.values(attendanceMap.value).filter((entry) => entry.status).length)
const summary = computed(() => t('sportAdminPlayerAttendancePage.summary', { marked: markedCount.value, total: players.value.length }))

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function shiftDate(days) {
  const date = new Date(selectedDate.value)
  date.setDate(date.getDate() + days)
  selectedDate.value = date.toISOString().slice(0, 10)
}

function buildMap(playerList, existingRecords) {
  const map = {}

  for (const player of playerList) {
    const existing = existingRecords.find((record) => String(record.playerId) === String(player.id))

    map[player.id] = {
      status: existing?.status || '',
      note: existing?.note || '',
      existingId: existing?.id || null,
    }
  }

  return map
}

async function loadTeams() {
  teamsLoading.value = true
  try {
    const response = await fetchSportTeams({ page: 1, perPage: 100, status: 'active' })
    teamOptions.value = (response.items || []).map((team) => ({
      label: team.name || team.shortName || team.teamCode || `Team ${team.id}`,
      value: String(team.id),
    }))

    if (!selectedTeamId.value && teamOptions.value.length) {
      selectedTeamId.value = String(teamOptions.value[0].value)
    }
  } catch {
    teamOptions.value = []
  } finally {
    teamsLoading.value = false
  }
}

async function loadDay() {
  if (!selectedTeamId.value || !selectedDate.value) return

  loading.value = true
  errorMessage.value = ''

  try {
    const [playersResponse, attendanceResponse] = await Promise.all([
      fetchSportPlayers({ teamId: selectedTeamId.value, page: 1, perPage: 100 }),
      fetchSportAttendance({
        attendanceType: 'player',
        teamId: selectedTeamId.value,
        attendanceDate: selectedDate.value,
        page: 1,
        perPage: 100,
      }),
    ])

    players.value = playersResponse.items || []
    attendanceMap.value = buildMap(players.value, attendanceResponse.items || [])
  } catch (error) {
    errorMessage.value = error?.message || t('sportAdminPlayerAttendancePage.messages.loadFailed')
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

function toggleStatus(playerId, value) {
  if (!attendanceMap.value[playerId]) return
  attendanceMap.value[playerId].status = attendanceMap.value[playerId].status === value ? '' : value
}

async function saveAll() {
  if (!selectedTeamId.value || !selectedDate.value) return

  saving.value = true

  try {
    const tasks = players.value
      .filter((player) => attendanceMap.value[player.id]?.status)
      .map((player) => {
        const entry = attendanceMap.value[player.id]

        return saveSportPlayerAttendance({
          ...(entry.existingId ? { id: entry.existingId } : {}),
          teamId: selectedTeamId.value,
          playerId: player.id,
          attendanceDate: selectedDate.value,
          status: entry.status,
          note: entry.note || '',
        })
      })

    await Promise.all(tasks)
    toast.add({ severity: 'success', summary: t('sportAdminPlayerAttendancePage.messages.saved'), life: 3000 })
    await loadDay()
  } catch {
    toast.add({ severity: 'error', summary: t('sportAdminPlayerAttendancePage.messages.saveFailed'), life: 4000 })
  } finally {
    saving.value = false
  }
}

watch([selectedTeamId, selectedDate], () => {
  if (selectedTeamId.value && selectedDate.value) {
    void loadDay()
  }
}, { immediate: true })

onMounted(() => {
  void loadTeams()
})
</script>

<template>
  <MainLayout>
    <Toast />
    <section class="sport-attendance-sheet">
      <HeaderSection
        :title="t('sportAdminPlayerAttendancePage.title')"
        :subtitle="t('sportAdminPlayerAttendancePage.subtitle')"
      />

      <div class="sport-attendance-sheet__controls">
        <label class="sport-attendance-sheet__field">
          <span class="sport-attendance-sheet__label">{{ t('sportAdminPlayerAttendancePage.filters.team') }}</span>
          <Select
            v-model="selectedTeamId"
            :options="teamOptions"
            option-label="label"
            option-value="value"
            :placeholder="t('sportAdminPlayerAttendancePage.placeholders.team')"
            :disabled="loading || teamsLoading"
            class="min-w-[220px]"
          />
        </label>

        <label class="sport-attendance-sheet__field">
          <span class="sport-attendance-sheet__label">{{ t('sportAdminPlayerAttendancePage.filters.date') }}</span>
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
          {{ t('sportAdminPlayerAttendancePage.actions.back') }}
        </Button>
      </div>

      <div v-if="!selectedTeamId" class="sport-attendance-sheet__empty">
        {{ t('sportAdminPlayerAttendancePage.messages.selectTeam') }}
      </div>

      <div v-else-if="errorMessage" class="sport-attendance-sheet__error">
        {{ errorMessage }}
      </div>

      <div v-else-if="loading" class="sport-attendance-sheet__empty">
        {{ t('preschoolReportsShared.loading') }}
      </div>

      <div v-else-if="!players.length" class="sport-attendance-sheet__empty">
        {{ t('sportAdminPlayerAttendancePage.messages.noPlayers') }}
      </div>

      <div v-else class="sport-attendance-sheet__panel">
        <div class="sport-attendance-sheet__topbar">
          <span class="sport-attendance-sheet__summary">{{ summary }}</span>
          <div class="sport-attendance-sheet__actions">
            <Button type="button" variant="ghost" size="sm" rounded="xl" :disabled="saving" @click="markAll('present')">
              {{ t('sportAdminPlayerAttendancePage.actions.markAllPresent') }}
            </Button>
            <Button type="button" variant="ghost" size="sm" rounded="xl" :disabled="saving" @click="markAll('absent')">
              {{ t('sportAdminPlayerAttendancePage.actions.markAllAbsent') }}
            </Button>
            <Button type="button" variant="ghost" size="sm" rounded="xl" :disabled="saving" @click="clearAll">
              {{ t('sportAdminPlayerAttendancePage.actions.clearAll') }}
            </Button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="sport-attendance-sheet__table">
            <thead>
              <tr>
                <th>{{ t('sportAdminPlayerAttendancePage.columns.player') }}</th>
                <th>{{ t('sportAdminPlayerAttendancePage.columns.status') }}</th>
                <th>{{ t('sportAdminPlayerAttendancePage.columns.note') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(player, index) in players" :key="player.id" :class="index % 2 === 0 ? 'is-even' : 'is-odd'">
                <td>
                  <p class="sport-attendance-sheet__person">{{ player.fullName || player.name }}</p>
                  <p v-if="player.playerCode" class="sport-attendance-sheet__meta">{{ player.playerCode }}</p>
                </td>
                <td>
                  <div class="sport-attendance-sheet__status-group">
                    <button
                      v-for="option in statusOptions"
                      :key="option.value"
                      type="button"
                      class="sport-attendance-sheet__status-btn"
                      :class="attendanceMap[player.id]?.status === option.value ? `${option.active} ${option.ring}` : ''"
                      :disabled="loading || saving"
                      :title="option.label"
                      @click="toggleStatus(player.id, option.value)"
                    >
                      {{ option.short }}
                    </button>
                  </div>
                </td>
                <td>
                  <input
                    v-model="attendanceMap[player.id].note"
                    type="text"
                    class="sport-attendance-sheet__note"
                    :placeholder="t('sportAdminPlayerAttendancePage.placeholders.note')"
                    :disabled="loading || saving"
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="sport-attendance-sheet__footer">
          <p class="sport-attendance-sheet__footer-note">
            {{ t('sportAdminPlayerAttendancePage.messages.skippedNote') }}
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
            {{ saving ? t('sportAdminPlayerAttendancePage.actions.saving') : t('sportAdminPlayerAttendancePage.actions.save') }}
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
  gap: 1.1rem;
}

.sport-attendance-sheet__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  align-items: end;
  padding: 1rem 1.15rem;
  border-radius: 1.25rem;
  border: 1px solid #dce6f2;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
  box-shadow: 0 20px 54px -42px rgba(15, 23, 42, 0.45);
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
  font-size: 1rem;
  font-weight: 700;
}

.sport-attendance-sheet__date-input {
  height: 2.4rem;
  border-radius: 0.75rem;
  border: 1px solid #dbe4f0;
  padding: 0 0.8rem;
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

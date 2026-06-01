<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Select from 'primevue/select'
import Toast from 'primevue/toast'
import StatusBadge from '@/components/badges/StatusBadge.vue'
import Button from '@/components/buttons/Button.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useToast } from 'primevue/usetoast'
import { useLanguage } from '@/composables/useLanguage'
import { fetchSportAttendance, fetchSportTeams } from '@/modules/sport/services/sportApi'

defineOptions({
  name: 'SportAdminAttendanceHistoryPage',
})

const { t } = useLanguage()
const router = useRouter()
const toast = useToast()

const selectedType = ref('player')
const selectedTeamId = ref('')
const searchQuery = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const teamOptions = ref([])
const records = ref([])
const loading = ref(false)
const teamsLoading = ref(false)
const errorMessage = ref('')
const resultCount = computed(() => records.value.length)
const activeFiltersCount = computed(() => {
  return [
    selectedType.value !== 'player',
    selectedTeamId.value !== '',
    searchQuery.value.trim() !== '',
    dateFrom.value !== '',
    dateTo.value !== '',
  ].filter(Boolean).length
})

const typeOptions = computed(() => [
  { label: t('sportAttendanceType.player'), value: 'player' },
  { label: t('sportAttendanceType.coach'), value: 'coach' },
])

function teamLabel(teamId) {
  const match = teamOptions.value.find((option) => String(option.value) === String(teamId))
  return match?.label || ''
}

function statusLabel(status) {
  const key = String(status || '').trim().toLowerCase()
  if (key === 'present') return t('sportAttendanceStatus.present')
  if (key === 'absent') return t('sportAttendanceStatus.absent')
  if (key === 'late') return t('sportAttendanceStatus.late')
  if (key === 'excused') return t('sportAttendanceStatus.excused')
  return key || '-'
}

function typeLabel(type) {
  if (String(type || '').trim().toLowerCase() === 'coach') {
    return t('sportAttendanceType.coach')
  }
  return t('sportAttendanceType.player')
}

async function loadTeams() {
  teamsLoading.value = true
  try {
    const response = await fetchSportTeams({ page: 1, perPage: 100, status: 'active' })
    teamOptions.value = (response.items || []).map((team) => ({
      label: team.name || team.shortName || team.teamCode || `Team ${team.id}`,
      value: String(team.id),
    }))
  } catch {
    teamOptions.value = []
  } finally {
    teamsLoading.value = false
  }
}

async function loadHistory() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetchSportAttendance({
      attendanceType: selectedType.value,
      teamId: selectedTeamId.value,
      search: searchQuery.value,
      dateFrom: dateFrom.value,
      dateTo: dateTo.value,
      page: 1,
      perPage: 100,
    })

    records.value = response.items || []
  } catch (error) {
    errorMessage.value = error?.message || t('sportAdminAttendanceHistoryPage.messages.loadFailed')
    toast.add({ severity: 'error', summary: t('sportAdminAttendanceHistoryPage.messages.loadFailed'), life: 4000 })
  } finally {
    loading.value = false
  }
}

function resetFilters() {
  selectedType.value = 'player'
  selectedTeamId.value = ''
  searchQuery.value = ''
  dateFrom.value = ''
  dateTo.value = ''
}

const heroStats = computed(() => [
  {
    key: 'type',
    label: t('sportAdminAttendanceHistoryPage.filters.type'),
    value: typeLabel(selectedType.value),
  },
  {
    key: 'filters',
    label: 'Active filters',
    value: `${activeFiltersCount.value}`,
  },
  {
    key: 'records',
    label: 'Results',
    value: `${resultCount.value}`,
  },
])

watch([selectedType, selectedTeamId, dateFrom, dateTo], () => {
  void loadHistory()
}, { immediate: true })

onMounted(() => {
  void loadTeams()
})
</script>

<template>
  <MainLayout>
    <Toast />
    <section class="sport-attendance-history">
      <HeaderSection
        :title="t('sportAdminAttendanceHistoryPage.title')"
        :subtitle="t('sportAdminAttendanceHistoryPage.subtitle')"
      />

      <div class="att-hero">
        <div class="att-hero__copy">
          <p class="att-hero__eyebrow">History</p>
          <h2 class="att-hero__title">{{ t('sportAdminAttendanceHistoryPage.title') }}</h2>
          <p class="att-hero__text">{{ t('sportAdminAttendanceHistoryPage.subtitle') }}</p>
        </div>

        <div class="att-hero__stats">
          <div v-for="stat in heroStats" :key="stat.key" class="att-stat">
            <p class="att-stat__value">{{ stat.value }}</p>
            <p class="att-stat__label">{{ stat.label }}</p>
          </div>
        </div>
      </div>

      <div class="sport-attendance-history__filters att-toolbar">
        <label class="sport-attendance-history__field">
          <span class="sport-attendance-history__label">{{ t('sportAdminAttendanceHistoryPage.filters.type') }}</span>
          <Select
            v-model="selectedType"
            :options="typeOptions"
            option-label="label"
            option-value="value"
            :placeholder="t('sportAdminAttendanceHistoryPage.placeholders.type')"
            class="min-w-[180px]"
          />
        </label>

        <label class="sport-attendance-history__field">
          <span class="sport-attendance-history__label">{{ t('sportAdminAttendanceHistoryPage.filters.team') }}</span>
          <Select
            v-model="selectedTeamId"
            :options="teamOptions"
            option-label="label"
            option-value="value"
            :placeholder="t('sportAdminAttendanceHistoryPage.placeholders.team')"
            :disabled="teamsLoading"
            class="min-w-[220px]"
          />
        </label>

        <label class="sport-attendance-history__field">
          <span class="sport-attendance-history__label">{{ t('sportAdminAttendanceHistoryPage.filters.from') }}</span>
          <input v-model="dateFrom" type="date" class="sport-attendance-history__input">
        </label>

        <label class="sport-attendance-history__field">
          <span class="sport-attendance-history__label">{{ t('sportAdminAttendanceHistoryPage.filters.to') }}</span>
          <input v-model="dateTo" type="date" class="sport-attendance-history__input">
        </label>

        <label class="sport-attendance-history__field sport-attendance-history__field--wide">
          <span class="sport-attendance-history__label">{{ t('sportAdminAttendanceHistoryPage.filters.search') }}</span>
          <input
            v-model="searchQuery"
            type="search"
            class="sport-attendance-history__input"
            :placeholder="t('sportAdminAttendanceHistoryPage.placeholders.search')"
            @keyup.enter="loadHistory"
          >
        </label>

        <Button type="button" variant="primary" size="md" rounded="xl" :disabled="loading" @click="loadHistory">
          {{ t('sportAdminAttendanceHistoryPage.actions.apply') }}
        </Button>

        <Button type="button" variant="ghost" size="md" rounded="xl" :disabled="loading" @click="resetFilters">
          {{ t('sportAdminAttendanceHistoryPage.actions.reset') }}
        </Button>

        <Button type="button" variant="ghost" size="md" rounded="xl" @click="router.push({ name: 'dashboard-sport-admin-attendance' })">
          {{ t('sportAdminAttendanceHistoryPage.actions.back') }}
        </Button>
      </div>

      <div v-if="errorMessage" class="sport-attendance-history__error">
        {{ errorMessage }}
      </div>

      <div v-else-if="loading" class="sport-attendance-history__empty">
        {{ t('preschoolReportsShared.loading') }}
      </div>

      <div v-else-if="!records.length" class="sport-attendance-history__empty">
        {{ t('sportAdminAttendanceHistoryPage.messages.noRecords') }}
      </div>

      <div v-else class="sport-attendance-history__panel att-panel">
        <div class="overflow-x-auto">
          <table class="sport-attendance-history__table">
            <thead>
              <tr>
                <th>{{ t('sportAdminAttendanceHistoryPage.columns.date') }}</th>
                <th>{{ t('sportAdminAttendanceHistoryPage.columns.type') }}</th>
                <th>{{ t('sportAdminAttendanceHistoryPage.columns.team') }}</th>
                <th>{{ t('sportAdminAttendanceHistoryPage.columns.person') }}</th>
                <th>{{ t('sportAdminAttendanceHistoryPage.columns.status') }}</th>
                <th>{{ t('sportAdminAttendanceHistoryPage.columns.note') }}</th>
                <th>{{ t('sportAdminAttendanceHistoryPage.columns.recordedBy') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(record, index) in records" :key="record.id || `${record.attendanceDate}-${index}`" :class="index % 2 === 0 ? 'is-even' : 'is-odd'">
                <td>{{ record.attendanceDate || '-' }}</td>
                <td>{{ typeLabel(record.attendanceType) }}</td>
                <td>{{ record.teamName || teamLabel(record.teamId) || '-' }}</td>
                <td>{{ record.personName || record.playerName || record.coachName || '-' }}</td>
                <td>
                  <StatusBadge
                    :status="record.status"
                    :label="statusLabel(record.status)"
                    :translate-label="false"
                    size="sm"
                  />
                </td>
                <td>{{ record.note || '-' }}</td>
                <td>{{ record.recordedByName || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.sport-attendance-history {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
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

.sport-attendance-history__filters {
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

.sport-attendance-history__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.sport-attendance-history__field--wide {
  min-width: 260px;
  flex: 1 1 260px;
}

.sport-attendance-history__label {
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.sport-attendance-history__input {
  height: 2.55rem;
  border-radius: 0.75rem;
  border: 1px solid #dbe4f0;
  padding: 0 0.85rem;
  color: #0f172a;
  background: #fff;
}

.sport-attendance-history__empty,
.sport-attendance-history__error {
  padding: 1rem 1.15rem;
  border-radius: 1.1rem;
  border: 1px solid #dbe4f0;
  background: #fff;
  color: #64748b;
  font-size: 0.92rem;
}

.sport-attendance-history__error {
  border-color: #fecdd3;
  background: #fff1f2;
  color: #be123c;
}

.sport-attendance-history__panel {
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

.sport-attendance-history__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 920px;
}

.sport-attendance-history__table thead {
  background: #f8fafc;
  color: #64748b;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
}

.sport-attendance-history__table th,
.sport-attendance-history__table td {
  padding: 0.85rem 0.95rem;
  text-align: left;
  border-bottom: 1px solid #eef2f7;
}

.sport-attendance-history__table tbody tr.is-even {
  background: #fff;
}

.sport-attendance-history__table tbody tr.is-odd {
  background: #f8fafc;
}

.sport-attendance-history__table tbody tr:hover {
  background: #eff6ff;
}
</style>

<script setup>
import { computed, onMounted, ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import Card from 'primevue/card'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useLanguage } from '@/composables/useLanguage'
import html2pdf from 'html2pdf.js'
import * as XLSX from 'xlsx'
import {
  fetchSportDivisions,
  fetchSportTeams,
  fetchSportPlayers,
} from '@/modules/sport/services/sportApi'
import { fetchSportTournaments } from '@/modules/sport/services/api/sportTournamentsApi'

defineOptions({
  name: 'SportAdminReportsPage',
})

const { t } = useLanguage()

// State
const loading = ref(false)
const reportType = ref('overview')
const dateFrom = ref(null)
const dateTo = ref(null)
const selectedDivision = ref(null)
const selectedTeam = ref(null)
const selectedTournament = ref(null)

const reportGenerated = ref(false)
const errorMessage = ref('')
const exportLoading = ref(false)

// Data
const divisions = ref([])
const teams = ref([])
const tournaments = ref([])
const players = ref([])
const matchesData = ref([])
const statisticsData = ref({})

// Computed
const reportTitle = computed(() => {
  const titles = {
    overview: t('sportAdminReports.types.overview') || 'Overview Report',
    matches: t('sportAdminReports.types.matches') || 'Matches Report',
    standings: t('sportAdminReports.types.standings') || 'Standings Report',
    players: t('sportAdminReports.types.players') || 'Player Statistics',
    attendance: t('sportAdminReports.types.attendance') || 'Attendance Report',
  }
  return titles[reportType.value] || 'Sports Report'
})

const canGenerate = computed(() => {
  return dateFrom.value && dateTo.value
})

const filteredMatches = computed(() => {
  let filtered = matchesData.value || []

  if (selectedDivision.value) {
    filtered = filtered.filter(m => m.divisionId === selectedDivision.value)
  }
  if (selectedTeam.value) {
    filtered = filtered.filter(m => m.homeTeamId === selectedTeam.value || m.awayTeamId === selectedTeam.value)
  }
  if (selectedTournament.value) {
    filtered = filtered.filter(m => m.tournamentId === selectedTournament.value)
  }

  return filtered
})

// Methods
async function loadFilterData() {
  try {
    loading.value = true
    const [divsResponse, teamsResponse, tournamentsResponse, playersResponse] = await Promise.allSettled([
      fetchSportDivisions(),
      fetchSportTeams(),
      fetchSportTournaments(),
      fetchSportPlayers(),
    ])

    if (divsResponse.status === 'fulfilled') {
      divisions.value = (divsResponse.value.items || []).map(d => ({
        label: d.name,
        value: d.id,
      }))
    }

    if (teamsResponse.status === 'fulfilled') {
      teams.value = (teamsResponse.value.items || []).map(t => ({
        label: t.name,
        value: t.id,
      }))
    }

    if (tournamentsResponse.status === 'fulfilled') {
      tournaments.value = (tournamentsResponse.value.items || []).map(t => ({
        label: t.name,
        value: t.id,
      }))
    }

    if (playersResponse.status === 'fulfilled') {
      players.value = (playersResponse.value.items || []).map(p => ({
        label: `${p.firstName} ${p.lastName}`,
        value: p.id,
      }))
    }
  } catch (error) {
    errorMessage.value = t('sportAdminReports.errors.loadFailed') || 'Failed to load filter options'
    console.error('Error loading filter data:', error)
  } finally {
    loading.value = false
  }
}

async function generateReport() {
  try {
    loading.value = true
    errorMessage.value = ''

    // Build report based on type
    // Simulate fetching report data
    // In real implementation, call backend API
    matchesData.value = [
      {
        id: '1',
        homeTeamId: selectedTeam.value || 't1',
        awayTeamId: 't2',
        homeTeam: 'Team A',
        awayTeam: 'Team B',
        homeScore: 3,
        awayScore: 2,
        date: '2026-07-15',
        divisionId: selectedDivision.value || 'd1',
        tournamentId: selectedTournament.value,
        status: 'completed',
      },
      {
        id: '2',
        homeTeamId: 't3',
        awayTeamId: 't4',
        homeTeam: 'Team C',
        awayTeam: 'Team D',
        homeScore: 1,
        awayScore: 1,
        date: '2026-07-14',
        divisionId: selectedDivision.value || 'd1',
        tournamentId: selectedTournament.value,
        status: 'completed',
      },
    ]

    statisticsData.value = {
      totalMatches: 10,
      completedMatches: 8,
      upcomingMatches: 2,
      totalTeams: 4,
      totalPlayers: 50,
      averageAttendance: 85,
    }

    reportGenerated.value = true
  } catch (error) {
    errorMessage.value = t('sportAdminReports.errors.generateFailed') || 'Failed to generate report'
    console.error('Error generating report:', error)
  } finally {
    loading.value = false
  }
}

async function exportReport(format) {
  try {
    exportLoading.value = true

    // Build filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `SportReport_${reportType.value}_${timestamp}`

    if (format === 'pdf') {
      await exportToPdf(filename)
    } else if (format === 'excel') {
      exportToExcel(filename)
    } else if (format === 'print') {
      window.print()
    }
  } catch (error) {
    errorMessage.value = t('sportAdminReports.errors.exportFailed') || 'Failed to export report'
    console.error('Error exporting report:', error)
  } finally {
    exportLoading.value = false
  }
}

async function exportToPdf(filename) {
  const element = document.querySelector('.sport-admin-reports__report-content')
  if (!element) {
    throw new Error('Report content not found')
  }

  const options = {
    margin: 10,
    filename: `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
  }

  await html2pdf().set(options).from(element).save()
}

function exportToExcel(filename) {
  const workbook = XLSX.utils.book_new()

  // Statistics sheet
  const statsData = [
    ['Metric', 'Value'],
    ['Total Matches', statisticsData.value.totalMatches || 0],
    ['Completed Matches', statisticsData.value.completedMatches || 0],
    ['Upcoming Matches', statisticsData.value.upcomingMatches || 0],
    ['Total Teams', statisticsData.value.totalTeams || 0],
    ['Total Players', statisticsData.value.totalPlayers || 0],
    ['Average Attendance', statisticsData.value.averageAttendance || 0],
  ]
  const statsSheet = XLSX.utils.aoa_to_sheet(statsData)
  XLSX.utils.book_append_sheet(workbook, statsSheet, 'Statistics')

  // Matches sheet
  if (filteredMatches.value && filteredMatches.value.length > 0) {
    const matchesSheetData = filteredMatches.value.map(m => [
      m.homeTeam || '',
      m.awayTeam || '',
      `${m.homeScore || 0} - ${m.awayScore || 0}`,
      m.date || '',
      m.status || '',
    ])
    matchesSheetData.unshift(['Home Team', 'Away Team', 'Score', 'Date', 'Status'])

    const matchesSheet = XLSX.utils.aoa_to_sheet(matchesSheetData)
    XLSX.utils.book_append_sheet(workbook, matchesSheet, 'Matches')
  }

  // Report metadata sheet
  const metaData = [
    ['Report Information'],
    ['Type', reportType.value || 'N/A'],
    ['Generated On', new Date().toLocaleString()],
    ['From Date', dateFrom.value ? new Date(dateFrom.value).toLocaleDateString() : 'N/A'],
    ['To Date', dateTo.value ? new Date(dateTo.value).toLocaleDateString() : 'N/A'],
  ]
  const metaSheet = XLSX.utils.aoa_to_sheet(metaData)
  XLSX.utils.book_append_sheet(workbook, metaSheet, 'Report Info')

  // Write file
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}

// Lifecycle
onMounted(() => {
  loadFilterData()
})
</script>

<template>
  <MainLayout>
    <section class="sport-admin-reports">
      <HeaderSection
        :title="t('sportAdminReports.title') || 'Sport Reports'"
        :subtitle="t('sportAdminReports.subtitle') || 'Generate and analyze sports data reports'"
      />

      <!-- Filter Section -->
      <Card class="sport-admin-reports__filters">
        <template #title>{{ t('sportAdminReports.filters.title') || 'Report Filters' }}</template>
        <template #content>
          <div class="filters-grid">
            <!-- Date Range -->
            <div class="filter-group">
              <label>{{ t('sportAdminReports.filters.dateFrom') || 'From Date' }}</label>
              <DatePicker
                v-model="dateFrom"
                :placeholder="t('sportAdminReports.filters.selectDate') || 'Select date'"
                date-format="yy-mm-dd"
              />
            </div>

            <div class="filter-group">
              <label>{{ t('sportAdminReports.filters.dateTo') || 'To Date' }}</label>
              <DatePicker
                v-model="dateTo"
                :placeholder="t('sportAdminReports.filters.selectDate') || 'Select date'"
                date-format="yy-mm-dd"
              />
            </div>

            <!-- Division -->
            <div class="filter-group">
              <label>{{ t('sportAdminReports.filters.division') || 'Division' }}</label>
              <Select
                v-model="selectedDivision"
                :options="divisions"
                option-label="label"
                option-value="value"
                :placeholder="t('sportAdminReports.filters.selectDivision') || 'Select division'"
              />
            </div>

            <!-- Team -->
            <div class="filter-group">
              <label>{{ t('sportAdminReports.filters.team') || 'Team' }}</label>
              <Select
                v-model="selectedTeam"
                :options="teams"
                option-label="label"
                option-value="value"
                :placeholder="t('sportAdminReports.filters.selectTeam') || 'Select team'"
              />
            </div>

            <!-- Tournament -->
            <div class="filter-group">
              <label>{{ t('sportAdminReports.filters.tournament') || 'Tournament' }}</label>
              <Select
                v-model="selectedTournament"
                :options="tournaments"
                option-label="label"
                option-value="value"
                :placeholder="t('sportAdminReports.filters.selectTournament') || 'Select tournament'"
              />
            </div>

            <!-- Report Type -->
            <div class="filter-group">
              <label>{{ t('sportAdminReports.filters.reportType') || 'Report Type' }}</label>
              <Select
                v-model="reportType"
                :options="[
                  { label: t('sportAdminReports.types.overview') || 'Overview', value: 'overview' },
                  { label: t('sportAdminReports.types.matches') || 'Matches', value: 'matches' },
                  { label: t('sportAdminReports.types.standings') || 'Standings', value: 'standings' },
                  { label: t('sportAdminReports.types.players') || 'Players', value: 'players' },
                  { label: t('sportAdminReports.types.attendance') || 'Attendance', value: 'attendance' },
                ]"
                option-label="label"
                option-value="value"
              />
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <!-- Generate Button -->
          <div class="filter-actions">
            <Button
              :label="t('sportAdminReports.actions.generate') || 'Generate Report'"
              :disabled="!canGenerate || loading"
              :loading="loading"
              @click="generateReport"
            />
            <Button
              v-if="reportGenerated"
              outlined
              :label="t('sportAdminReports.actions.clearFilters') || 'Clear Filters'"
              @click="() => {
                reportGenerated = false
                selectedDivision = null
                selectedTeam = null
                selectedTournament = null
              }"
            />
          </div>
        </template>
      </Card>

      <!-- Report Display -->
      <div v-if="reportGenerated" class="sport-admin-reports__report">
        <!-- Report Content (for PDF export) -->
        <div class="sport-admin-reports__report-content">
          <!-- Report Header -->
          <div class="report-header">
          <h2>{{ reportTitle }}</h2>
          <div class="report-meta">
            <span v-if="dateFrom">{{ t('sportAdminReports.report.from') || 'From' }}: {{ dateFrom.toLocaleDateString() }}</span>
            <span v-if="dateTo">{{ t('sportAdminReports.report.to') || 'To' }}: {{ dateTo.toLocaleDateString() }}</span>
          </div>
        </div>

        <!-- Statistics Cards -->
        <div class="statistics-grid">
          <div class="stat-card">
            <div class="stat-label">{{ t('sportAdminReports.stats.totalMatches') || 'Total Matches' }}</div>
            <div class="stat-value">{{ statisticsData.totalMatches || 0 }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">{{ t('sportAdminReports.stats.completedMatches') || 'Completed' }}</div>
            <div class="stat-value">{{ statisticsData.completedMatches || 0 }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">{{ t('sportAdminReports.stats.totalTeams') || 'Total Teams' }}</div>
            <div class="stat-value">{{ statisticsData.totalTeams || 0 }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">{{ t('sportAdminReports.stats.totalPlayers') || 'Total Players' }}</div>
            <div class="stat-value">{{ statisticsData.totalPlayers || 0 }}</div>
          </div>
        </div>

        <!-- Report Tabs -->
        <TabView>
          <!-- Matches Tab -->
          <TabPanel :header="t('sportAdminReports.tabs.matches') || 'Matches'">
            <DataTable :value="filteredMatches" striped-rows>
              <Column field="homeTeam" :header="t('sportAdminReports.table.homeTeam') || 'Home Team'" />
              <Column field="awayTeam" :header="t('sportAdminReports.table.awayTeam') || 'Away Team'" />
              <Column field="homeScore" :header="t('sportAdminReports.table.score') || 'Score'"
                :body="(rowData) => `${rowData.homeScore} - ${rowData.awayScore}`" />
              <Column field="date" :header="t('sportAdminReports.table.date') || 'Date'" />
              <Column field="status" :header="t('sportAdminReports.table.status') || 'Status'" />
            </DataTable>
          </TabPanel>

          <!-- Standings Tab -->
          <TabPanel :header="t('sportAdminReports.tabs.standings') || 'Standings'">
            <p>{{ t('sportAdminReports.noData') || 'Standings data will appear here' }}</p>
          </TabPanel>

          <!-- Players Tab -->
          <TabPanel :header="t('sportAdminReports.tabs.players') || 'Players'">
            <p>{{ t('sportAdminReports.noData') || 'Player statistics will appear here' }}</p>
          </TabPanel>

          <!-- Attendance Tab -->
          <TabPanel :header="t('sportAdminReports.tabs.attendance') || 'Attendance'">
            <p>{{ t('sportAdminReports.noData') || 'Attendance data will appear here' }}</p>
          </TabPanel>
        </TabView>
        </div>

        <!-- Export Actions -->
        <div class="export-actions">
          <Button
            outlined
            icon="pi pi-file-pdf"
            :label="t('sportAdminReports.export.pdf') || 'Export as PDF'"
            :loading="exportLoading"
            @click="exportReport('pdf')"
          />
          <Button
            outlined
            icon="pi pi-file"
            :label="t('sportAdminReports.export.excel') || 'Export as Excel'"
            :loading="exportLoading"
            @click="exportReport('excel')"
          />
          <Button
            outlined
            icon="pi pi-print"
            :label="t('sportAdminReports.export.print') || 'Print Report'"
            @click="exportReport('print')"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <p>{{ t('sportAdminReports.emptyState') || 'Select filters and generate a report to view data' }}</p>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.sport-admin-reports {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0;
}

.sport-admin-reports__filters {
  border-radius: 1rem;
  border: 1px solid #e5ecf2;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  font-size: 0.85rem;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.error-message {
  padding: 1rem;
  background: #fef2f2;
  border-left: 4px solid #ef4444;
  color: #991b1b;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.filter-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.sport-admin-reports__report {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-radius: 1rem;
  border: 1px solid #e5ecf2;
}

.report-header h2 {
  margin: 0;
  color: #0f172a;
  font-size: 1.5rem;
  font-weight: 700;
}

.report-meta {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: #64748b;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 1rem;
  border: 1px solid #e5ecf2;
  text-align: center;
}

.stat-label {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
}

.export-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  background: white;
  border-radius: 1rem;
  border: 1px solid #e5ecf2;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 1rem;
  border: 1px solid #e5ecf2;
  color: #64748b;
}

:deep(.p-card) {
  border-radius: 1rem;
  border: 1px solid #e5ecf2;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
}

:deep(.p-tabview) {
  background: white;
  border-radius: 1rem;
  border: 1px solid #e5ecf2;
}

:deep(.p-datatable) {
  border: none;
  background: transparent;
}

@media (max-width: 768px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }

  .report-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .report-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .statistics-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .export-actions {
    flex-direction: column;
  }

  :deep(.p-button) {
    width: 100%;
  }
}
</style>

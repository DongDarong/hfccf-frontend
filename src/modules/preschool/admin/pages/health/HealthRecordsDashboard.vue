<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import { useLanguage } from '@/composables/useLanguage'
import { fetchPreschoolDashboard, fetchPreschoolStudents } from '@/modules/preschool/services/preschoolApi'
import { fetchHealthDashboardSummary, fetchStudentHealthSummary } from '@/modules/preschool/services/api/preschoolHealthApi'
import { resolveAvatarSource } from '@/utils/avatar'

defineOptions({
  name: 'PreschoolHealthRecordsDashboardPage',
})

const { t } = useLanguage()
const router = useRouter()

const dashboard = ref({
  summary: {
    healthAlerts: 0,
    students: 0,
    classes: 0,
  },
})
const healthAlerts = ref({
  summary: {
    criticalIncidents: 0,
    severeAllergies: 0,
    missingEmergencyContacts: 0,
    overdueVaccinations: 0,
    medicationReminders: 0,
    unresolvedItems: 0,
  },
  items: [],
  unresolvedCriticalItems: [],
})
const students = ref([])
const selectedStudentId = ref('')
const selectedStudentSummary = ref(null)
const search = ref('')
const loading = ref(false)
const summaryLoading = ref(false)
const errorMessage = ref('')

const selectedStudent = computed(() => students.value.find((student) => String(student.id) === String(selectedStudentId.value)) || null)

const summaryCards = computed(() => [
  {
    label: t('preschoolHealthPage.dashboard.healthAlerts'),
    value: dashboard.value.summary?.healthAlerts ?? 0,
    note: t('preschoolHealthPage.dashboard.healthAlertsNote'),
  },
  {
    label: t('preschoolHealthPage.dashboard.students'),
    value: dashboard.value.summary?.students ?? 0,
    note: t('preschoolHealthPage.dashboard.studentsNote'),
  },
  {
    label: t('preschoolHealthPage.dashboard.classes'),
    value: dashboard.value.summary?.classes ?? 0,
    note: t('preschoolHealthPage.dashboard.classesNote'),
  },
])

const alertCards = computed(() => [
  {
    label: t('preschoolHealthPage.dashboard.criticalIncidents'),
    value: healthAlerts.value.summary?.criticalIncidents ?? 0,
    note: t('preschoolHealthPage.dashboard.criticalIncidentsNote'),
  },
  {
    label: t('preschoolHealthPage.dashboard.severeAllergies'),
    value: healthAlerts.value.summary?.severeAllergies ?? 0,
    note: t('preschoolHealthPage.dashboard.severeAllergiesNote'),
  },
  {
    label: t('preschoolHealthPage.dashboard.missingContacts'),
    value: healthAlerts.value.summary?.missingEmergencyContacts ?? 0,
    note: t('preschoolHealthPage.dashboard.missingContactsNote'),
  },
  {
    label: t('preschoolHealthPage.dashboard.overdueVaccinations'),
    value: healthAlerts.value.summary?.overdueVaccinations ?? 0,
    note: t('preschoolHealthPage.dashboard.overdueVaccinationsNote'),
  },
])

const studentRows = computed(() => students.value.map((student) => ({
  ...student,
  avatarUrl: resolveAvatarSource(student.avatarUrl || ''),
  fullName: student.fullName || student.name || '-',
  className: Array.isArray(student.classes) && student.classes.length
    ? student.classes.map((item) => item?.name || item?.code || '').filter(Boolean).join(', ')
    : student.className || student.class?.name || student.class?.code || '-',
})))

async function loadDashboard() {
  try {
    const [dashboardPayload, healthPayload] = await Promise.all([
      fetchPreschoolDashboard(),
      fetchHealthDashboardSummary(),
    ])

    dashboard.value = dashboardPayload
    healthAlerts.value = healthPayload
  } catch (error) {
    errorMessage.value = error?.message || t('preschoolHealthPage.messages.loadFailed')
  }
}

async function loadStudents() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetchPreschoolStudents({
      page: 1,
      perPage: 100,
      search: search.value,
      status: 'active',
    })

    students.value = response.items || []
    if (!selectedStudentId.value && students.value.length) {
      selectedStudentId.value = String(students.value[0].id)
    }
  } catch (error) {
    students.value = []
    errorMessage.value = error?.message || t('preschoolHealthPage.messages.loadFailed')
  } finally {
    loading.value = false
  }
}

async function loadSelectedStudentSummary() {
  const studentId = String(selectedStudentId.value || '').trim()
  if (!studentId) {
    selectedStudentSummary.value = null
    return
  }

  summaryLoading.value = true
  try {
    selectedStudentSummary.value = await fetchStudentHealthSummary(studentId)
  } catch (error) {
    selectedStudentSummary.value = null
    errorMessage.value = error?.message || t('preschoolHealthPage.messages.summaryFailed')
  } finally {
    summaryLoading.value = false
  }
}

function openStudentProfile(studentId) {
  const id = String(studentId || '').trim()
  if (!id) return
  router.push({ name: 'dashboard-preschool-admin-health-student', params: { id } })
}

watch(search, () => {
  loadStudents()
})

watch(selectedStudentId, () => {
  loadSelectedStudentSummary()
})

onMounted(async () => {
  await Promise.all([
    loadDashboard(),
    loadStudents(),
  ])
})
</script>

<template>
  <MainLayout>
    <section class="health-dashboard-page">
      <HeaderSection
        :title="t('preschoolHealthPage.dashboard.title')"
        :subtitle="t('preschoolHealthPage.dashboard.subtitle')"
      />

      <div class="health-dashboard-page__hero">
        <div class="health-dashboard-page__hero-copy">
          <p class="health-dashboard-page__eyebrow">{{ t('preschoolHealthPage.dashboard.eyebrow') }}</p>
          <h2 class="health-dashboard-page__hero-title">{{ t('preschoolHealthPage.dashboard.heroTitle') }}</h2>
          <p class="health-dashboard-page__hero-subtitle">
            {{ t('preschoolHealthPage.dashboard.heroSubtitle') }}
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          size="md"
          rounded="xl"
          :label="t('preschoolHealthPage.dashboard.openProfile')"
          :disabled="!selectedStudentId"
          @click="openStudentProfile(selectedStudentId)"
        />
      </div>

      <div class="health-dashboard-page__grid">
        <article v-for="card in summaryCards" :key="card.label" class="health-dashboard-page__stat">
          <p class="health-dashboard-page__stat-label">{{ card.label }}</p>
          <p class="health-dashboard-page__stat-value">{{ card.value }}</p>
          <p class="health-dashboard-page__stat-note">{{ card.note }}</p>
        </article>
      </div>

      <div class="health-dashboard-page__alerts-grid">
        <article v-for="card in alertCards" :key="card.label" class="health-dashboard-page__alert-card">
          <p class="health-dashboard-page__alert-card-label">{{ card.label }}</p>
          <p class="health-dashboard-page__alert-card-value">{{ card.value }}</p>
          <p class="health-dashboard-page__alert-card-note">{{ card.note }}</p>
        </article>
      </div>

      <div v-if="errorMessage" class="health-dashboard-page__state health-dashboard-page__state--error">
        {{ errorMessage }}
      </div>

      <div class="health-dashboard-page__workspace">
        <div class="health-dashboard-page__list">
          <div class="health-dashboard-page__list-header">
            <div>
              <p class="health-dashboard-page__section-eyebrow">{{ t('preschoolHealthPage.dashboard.studentListEyebrow') }}</p>
              <h3 class="health-dashboard-page__section-title">{{ t('preschoolHealthPage.dashboard.studentListTitle') }}</h3>
            </div>
            <input
              v-model="search"
              class="health-dashboard-page__search"
              type="search"
              :placeholder="t('preschoolHealthPage.dashboard.searchPlaceholder')"
            />
          </div>

          <div v-if="loading" class="health-dashboard-page__state">
            <i class="pi pi-spin pi-spinner" />
          </div>

          <div v-else class="health-dashboard-page__student-list">
            <button
              v-for="student in studentRows"
              :key="student.id"
              type="button"
              class="health-dashboard-page__student-row"
              :class="{ 'health-dashboard-page__student-row--active': String(student.id) === String(selectedStudentId) }"
              @click="selectedStudentId = String(student.id)"
            >
              <img
                v-if="student.avatarUrl"
                :src="student.avatarUrl"
                :alt="student.fullName"
                class="health-dashboard-page__avatar"
              />
              <div v-else class="health-dashboard-page__avatar health-dashboard-page__avatar--fallback">
                {{ (student.fullName || '?').charAt(0) }}
              </div>

              <div class="health-dashboard-page__student-copy">
                <div class="health-dashboard-page__student-name">{{ student.fullName }}</div>
                <div class="health-dashboard-page__student-meta">
                  {{ student.publicId || student.studentCode || '-' }} - {{ student.className }}
                </div>
              </div>

              <span class="health-dashboard-page__student-arrow">-&gt;</span>
            </button>
          </div>
        </div>

        <div class="health-dashboard-page__summary">
          <div class="health-dashboard-page__summary-header">
            <div>
              <p class="health-dashboard-page__section-eyebrow">{{ t('preschoolHealthPage.dashboard.summaryEyebrow') }}</p>
              <h3 class="health-dashboard-page__section-title">
                {{ selectedStudent?.fullName || t('preschoolHealthPage.dashboard.noStudentSelected') }}
              </h3>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              rounded="xl"
              :label="t('preschoolHealthPage.dashboard.viewProfile')"
              :disabled="!selectedStudentId"
              @click="openStudentProfile(selectedStudentId)"
            />
          </div>

          <div v-if="summaryLoading" class="health-dashboard-page__state">
            <i class="pi pi-spin pi-spinner" />
          </div>

          <template v-else-if="selectedStudentSummary">
            <div class="health-dashboard-page__chips">
              <span class="health-dashboard-page__chip">{{ t('preschoolHealthPage.summary.allergies') }}: {{ selectedStudentSummary.counts.allergies }}</span>
              <span class="health-dashboard-page__chip">{{ t('preschoolHealthPage.summary.vaccinations') }}: {{ selectedStudentSummary.counts.vaccinations }}</span>
              <span class="health-dashboard-page__chip">{{ t('preschoolHealthPage.summary.medications') }}: {{ selectedStudentSummary.counts.medications }}</span>
              <span class="health-dashboard-page__chip">{{ t('preschoolHealthPage.summary.incidents') }}: {{ selectedStudentSummary.counts.incidents }}</span>
              <span class="health-dashboard-page__chip">{{ t('preschoolHealthPage.summary.contacts') }}: {{ selectedStudentSummary.counts.emergencyContacts }}</span>
            </div>

            <div class="health-dashboard-page__section">
              <h4 class="health-dashboard-page__subheading">{{ t('preschoolHealthPage.dashboard.unresolvedCriticalItems') }}</h4>
              <div v-if="!healthAlerts.unresolvedCriticalItems.length" class="health-dashboard-page__empty">
                {{ t('preschoolHealthPage.messages.noCriticalItems') }}
              </div>
              <div v-else class="health-dashboard-page__alert-list">
                <article v-for="item in healthAlerts.unresolvedCriticalItems.slice(0, 5)" :key="item.id" class="health-dashboard-page__alert">
                  <div>
                    <p class="health-dashboard-page__alert-title">{{ item.title || item.incident_type || item.allergy_name || t('preschoolHealthPage.summary.alert') }}</p>
                    <p class="health-dashboard-page__alert-meta">
                      {{ item.message || item.notes || item.status || '-' }}
                    </p>
                  </div>
                  <span class="health-dashboard-page__alert-badge" :data-severity="item.severity || 'high'">
                    {{ t(`preschoolHealthPage.severity.${item.severity || 'high'}`) }}
                  </span>
                </article>
              </div>
            </div>

            <div class="health-dashboard-page__section">
              <h4 class="health-dashboard-page__subheading">{{ t('preschoolHealthPage.dashboard.recentAlerts') }}</h4>
              <div v-if="selectedStudentSummary.incidents.length === 0" class="health-dashboard-page__empty">
                {{ t('preschoolHealthPage.messages.noAlerts') }}
              </div>
              <div v-else class="health-dashboard-page__alert-list">
                <article v-for="incident in selectedStudentSummary.incidents.slice(0, 5)" :key="incident.id" class="health-dashboard-page__alert">
                  <div>
                    <p class="health-dashboard-page__alert-title">{{ incident.incident_type || incident.type || incident.name || t('preschoolHealthPage.summary.incident') }}</p>
                    <p class="health-dashboard-page__alert-meta">
                      {{ incident.incident_date || incident.date || '-' }} - {{ incident.severity || t('preschoolHealthPage.status.unknown') }}
                    </p>
                  </div>
                  <span class="health-dashboard-page__alert-badge">{{ incident.status || t('preschoolHealthPage.status.recorded') }}</span>
                </article>
              </div>
            </div>
          </template>

          <div v-else class="health-dashboard-page__empty">
            {{ t('preschoolHealthPage.dashboard.emptyState') }}
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.health-dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.health-dashboard-page__hero,
.health-dashboard-page__summary,
.health-dashboard-page__list,
.health-dashboard-page__stat {
  border: 1px solid #dbe3ef;
  border-radius: 1.25rem;
  background: #fff;
  box-shadow: 0 18px 36px -30px rgba(15, 23, 42, 0.45);
}

.health-dashboard-page__hero {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, #0f2e63 0%, #12356f 45%, #0f2a58 100%);
  color: #fff;
}

.health-dashboard-page__eyebrow,
.health-dashboard-page__section-eyebrow {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #93c5fd;
}

.health-dashboard-page__hero-title,
.health-dashboard-page__section-title {
  margin: 0.25rem 0 0;
  font-size: 1.35rem;
  font-weight: 800;
  color: inherit;
}

.health-dashboard-page__hero-subtitle {
  margin: 0.4rem 0 0;
  max-width: 52rem;
  color: rgba(255, 255, 255, 0.86);
}

.health-dashboard-page__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.85rem;
}

.health-dashboard-page__alerts-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.85rem;
}

.health-dashboard-page__stat {
  padding: 1rem 1.05rem;
}

.health-dashboard-page__stat-label {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #64748b;
}

.health-dashboard-page__stat-value {
  margin: 0.35rem 0 0;
  font-size: 1.8rem;
  font-weight: 800;
  color: #0f172a;
}

.health-dashboard-page__stat-note {
  margin: 0.2rem 0 0;
  font-size: 0.85rem;
  color: #64748b;
}

.health-dashboard-page__alert-card {
  padding: 1rem 1.05rem;
  border: 1px solid #dbe3ef;
  border-radius: 1.25rem;
  background: #fff;
  box-shadow: 0 18px 36px -30px rgba(15, 23, 42, 0.45);
}

.health-dashboard-page__alert-card-label {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #64748b;
}

.health-dashboard-page__alert-card-value {
  margin: 0.35rem 0 0;
  font-size: 1.8rem;
  font-weight: 800;
  color: #b91c1c;
}

.health-dashboard-page__alert-card-note {
  margin: 0.2rem 0 0;
  font-size: 0.85rem;
  color: #64748b;
}

.health-dashboard-page__workspace {
  display: grid;
  grid-template-columns: minmax(320px, 0.95fr) minmax(0, 1.35fr);
  gap: 1rem;
  align-items: start;
}

.health-dashboard-page__list,
.health-dashboard-page__summary {
  padding: 1rem;
}

.health-dashboard-page__list-header,
.health-dashboard-page__summary-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.9rem;
}

.health-dashboard-page__search {
  min-width: 16rem;
  border-radius: 0.9rem;
  border: 1px solid #cbd5e1;
  padding: 0.65rem 0.85rem;
}

.health-dashboard-page__student-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  max-height: 28rem;
  overflow: auto;
}

.health-dashboard-page__student-row {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 0.75rem 0.85rem;
  background: linear-gradient(180deg, #fff 0%, #f8fafc 100%);
  text-align: left;
  cursor: pointer;
}

.health-dashboard-page__student-row--active {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12);
}

.health-dashboard-page__avatar {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 9999px;
  object-fit: cover;
  background: #e2e8f0;
  flex-shrink: 0;
}

.health-dashboard-page__avatar--fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1d4ed8;
  font-weight: 800;
}

.health-dashboard-page__student-copy {
  min-width: 0;
  flex: 1;
}

.health-dashboard-page__student-name {
  font-weight: 700;
  color: #0f172a;
}

.health-dashboard-page__student-meta {
  margin-top: 0.15rem;
  font-size: 0.82rem;
  color: #64748b;
}

.health-dashboard-page__student-arrow {
  color: #7c3aed;
  font-size: 1.1rem;
  font-weight: 800;
}

.health-dashboard-page__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.health-dashboard-page__chip,
.health-dashboard-page__alert-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.7rem;
  border-radius: 9999px;
  background: #eef2ff;
  color: #4338ca;
  font-size: 0.78rem;
  font-weight: 800;
}

.health-dashboard-page__alert-badge[data-severity='critical'] {
  background: #fee2e2;
  color: #991b1b;
}

.health-dashboard-page__alert-badge[data-severity='high'] {
  background: #fef3c7;
  color: #92400e;
}

.health-dashboard-page__section {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.health-dashboard-page__subheading {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 800;
  color: #0f172a;
}

.health-dashboard-page__alert-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.health-dashboard-page__alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.8rem 0.85rem;
  border-radius: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.health-dashboard-page__alert-title {
  margin: 0;
  font-weight: 700;
  color: #0f172a;
}

.health-dashboard-page__alert-meta {
  margin: 0.2rem 0 0;
  font-size: 0.82rem;
  color: #64748b;
}

.health-dashboard-page__empty,
.health-dashboard-page__state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 5rem;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px dashed #cbd5e1;
  background: #f8fafc;
  color: #64748b;
}

.health-dashboard-page__state--error {
  border-color: #fecaca;
  background: #fff1f2;
  color: #b91c1c;
}

@media (max-width: 1024px) {
  .health-dashboard-page__workspace,
  .health-dashboard-page__grid,
  .health-dashboard-page__alerts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .health-dashboard-page__hero,
  .health-dashboard-page__list-header,
  .health-dashboard-page__summary-header {
    flex-direction: column;
  }

  .health-dashboard-page__search {
    min-width: 0;
    width: 100%;
  }
}
</style>

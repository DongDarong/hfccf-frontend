<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import { useLanguage } from '@/composables/useLanguage'
import { fetchPreschoolClass, fetchPreschoolStudents } from '@/modules/preschool/services/preschoolApi'

defineOptions({
  name: 'PreschoolTeacherMyClassDetailPage',
})

const { t } = useLanguage()
const router = useRouter()
const route = useRoute()

const classData = ref(null)
const students = ref([])
const loading = ref(false)
const error = ref('')

const classId = computed(() => route.params.classId)

async function loadData() {
  if (!classId.value) {
    error.value = t('preschoolTeacherPage.classDetail.classRequired')
    return
  }

  loading.value = true
  error.value = ''

  try {
    const [classResponse, studentsResponse] = await Promise.all([
      fetchPreschoolClass(classId.value),
      fetchPreschoolStudents({ classId: classId.value, perPage: 1000 }),
    ])

    classData.value = classResponse
    students.value = studentsResponse.items || []
  } catch (err) {
    if (err?.response?.status === 404) {
      error.value = t('preschoolTeacherPage.classDetail.classNotFound')
    } else {
      error.value = t('preschoolTeacherPage.classDetail.loadError')
    }
  } finally {
    loading.value = false
  }
}

function handleBack() {
  router.push({ name: 'dashboard-preschool-teacher-classes' })
}

function openAttendance() {
  router.push({
    name: 'dashboard-preschool-teacher-attendance',
    query: { classId: classId.value },
  })
}

function openGrades() {
  router.push({
    name: 'dashboard-preschool-teacher-grades',
    query: { classId: classId.value },
  })
}

function openMyStudents() {
  router.push({
    name: 'dashboard-preschool-teacher-students',
    query: { classId: classId.value },
  })
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <MainLayout>
    <section class="class-detail-page">
      <!-- Header -->
      <HeaderSection
        :title="classData?.name || t('preschoolTeacherPage.classDetail.title')"
        :subtitle="classData?.code || ''"
      />

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <i class="pi pi-spin pi-spinner" />
        <p>{{ t('preschoolTeacherPage.classDetail.loading') }}</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <i class="pi pi-exclamation-triangle" />
        <p>{{ error }}</p>
        <Button
          type="button"
          variant="secondary"
          size="md"
          rounded="lg"
          :label="t('common.back')"
          @click="handleBack"
        />
      </div>

      <!-- Content -->
      <template v-else-if="classData">
        <!-- Class Information Card -->
        <div class="info-card">
          <h3 class="card-title">{{ t('preschoolTeacherPage.classDetail.classInfo') }}</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">{{ t('preschoolTeacherPage.classDetail.name') }}</span>
              <span class="info-value">{{ classData.name || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ t('preschoolTeacherPage.classDetail.code') }}</span>
              <span class="info-value info-code">{{ classData.code || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ t('preschoolTeacherPage.classDetail.capacity') }}</span>
              <span class="info-value">{{ classData.students_count || 0 }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ t('preschoolTeacherPage.classDetail.level') }}</span>
              <span class="info-value">{{ classData.level || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ t('preschoolTeacherPage.classDetail.year') }}</span>
              <span class="info-value">{{ classData.academic_year || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ t('preschoolTeacherPage.classDetail.status') }}</span>
              <span :class="['info-value', 'status-badge', `status-${classData.status}`]">
                {{ classData.status || '-' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="actions-card">
          <h3 class="card-title">{{ t('preschoolTeacherPage.classDetail.quickActions') }}</h3>
          <div class="actions-grid">
            <Button
              type="button"
              variant="secondary"
              size="md"
              rounded="lg"
              :label="t('preschoolTeacherPage.classDetail.openAttendance')"
              icon="pi pi-clipboard-check"
              @click="openAttendance"
            />
            <Button
              type="button"
              variant="secondary"
              size="md"
              rounded="lg"
              :label="t('preschoolTeacherPage.classDetail.openGrades')"
              icon="pi pi-chart-bar"
              @click="openGrades"
            />
            <Button
              type="button"
              variant="secondary"
              size="md"
              rounded="lg"
              :label="t('preschoolTeacherPage.classDetail.openStudents')"
              icon="pi pi-users"
              @click="openMyStudents"
            />
          </div>
        </div>

        <!-- Students List -->
        <div class="students-card">
          <h3 class="card-title">{{ t('preschoolTeacherPage.classDetail.studentsList') }}</h3>
          <div v-if="students.length === 0" class="empty-students">
            <p>{{ t('preschoolTeacherPage.classDetail.noStudents') }}</p>
          </div>
          <div v-else class="students-table-wrapper">
            <table class="students-table">
              <thead>
                <tr>
                  <th>{{ t('preschoolTeacherPage.classDetail.studentCode') }}</th>
                  <th>{{ t('preschoolTeacherPage.classDetail.studentName') }}</th>
                  <th>{{ t('preschoolTeacherPage.classDetail.gender') }}</th>
                  <th>{{ t('preschoolTeacherPage.classDetail.dob') }}</th>
                  <th>{{ t('preschoolTeacherPage.classDetail.status') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="student in students" :key="student.id">
                  <td class="code-cell">{{ student.publicId || student.studentCode || '-' }}</td>
                  <td class="name-cell">{{ student.fullName || '-' }}</td>
                  <td>{{ student.gender || '-' }}</td>
                  <td>{{ student.dateOfBirth || '-' }}</td>
                  <td>
                    <span :class="['status-badge', `status-${student.status}`]">
                      {{ student.status || '-' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <!-- Back Button -->
      <div class="action-buttons">
        <Button
          type="button"
          variant="secondary"
          size="md"
          rounded="lg"
          :label="t('common.back')"
          @click="handleBack"
        />
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.class-detail-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  text-align: center;
  gap: 1rem;
  color: #64748b;
  box-shadow: 0 12px 32px -24px rgba(15, 23, 42, 0.3);
}

.loading-state i,
.error-state i {
  font-size: 2.5rem;
  color: #cbd5e1;
}

.error-state i {
  color: #dc2626;
}

.error-state p {
  margin: 0;
  font-size: 0.95rem;
  color: #dc2626;
}

.card-title {
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
}

.info-card,
.actions-card,
.students-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 12px 32px -24px rgba(15, 23, 42, 0.3);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.info-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.info-value {
  font-size: 0.95rem;
  color: #0f172a;
  font-weight: 500;
}

.info-code {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.85rem;
}

.status-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  width: fit-content;
}

.status-active {
  background: #dcfce7;
  color: #166534;
}

.status-inactive,
.status-archived {
  background: #f3f4f6;
  color: #6b7280;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.students-table-wrapper {
  overflow-x: auto;
}

.students-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.students-table thead {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.students-table th {
  padding: 0.9rem;
  text-align: left;
  font-weight: 600;
  color: #0f172a;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.students-table tbody tr {
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s ease;
}

.students-table tbody tr:hover {
  background: #f8fafc;
}

.students-table td {
  padding: 0.9rem;
  color: #0f172a;
}

.code-cell {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.85rem;
  color: #64748b;
}

.name-cell {
  font-weight: 500;
  color: #1d4ed8;
}

.empty-students {
  padding: 2rem;
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

@media (max-width: 640px) {
  .info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .students-table {
    font-size: 0.8rem;
  }

  .students-table th,
  .students-table td {
    padding: 0.6rem;
  }
}
</style>

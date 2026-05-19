<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Table from '@/components/data-display/Table.vue'
import Pagination from '@/components/data-display/Pagination.vue'
import { fetchMyPreschoolAttendance } from '@/modules/preschool/services/preschoolApi'

defineOptions({
  name: 'PreschoolTeacherAttendancePage',
})

const attendance = ref([])
const loading = ref(false)
const errorMessage = ref('')
const searchQuery = ref('')
const statusFilter = ref('')
const attendanceDate = ref('')
const currentPage = ref(1)
const pagination = ref({ page: 1, perPage: 10, total: 0, totalPages: 1 })

const statusOptions = ['present', 'absent', 'late', 'excused']

const tableColumns = [
  { key: 'number', label: 'No.', align: 'left' },
  { key: 'studentName', label: 'Student', align: 'left' },
  { key: 'className', label: 'Class', align: 'left' },
  { key: 'attendanceDate', label: 'Date', align: 'left' },
  { key: 'status', label: 'Status', align: 'left' },
  { key: 'note', label: 'Note', align: 'left' },
]

const mappedAttendance = computed(() =>
  attendance.value.map((row) => ({
    ...row,
    studentName: row.studentName || '-',
    className: row.className || '-',
    attendanceDate: row.attendanceDate || '-',
  })),
)

async function loadAttendance() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetchMyPreschoolAttendance({
      page: currentPage.value,
      perPage: pagination.value.perPage || 10,
      search: searchQuery.value,
      status: statusFilter.value,
      attendanceDate: attendanceDate.value,
    })

    attendance.value = response.items || []
    pagination.value = response.pagination || pagination.value
  } catch (error) {
    attendance.value = []
    errorMessage.value = error?.message || 'Failed to load attendance.'
  } finally {
    loading.value = false
  }
}

watch([searchQuery, statusFilter, attendanceDate], () => {
  currentPage.value = 1
  loadAttendance()
})

watch(currentPage, () => {
  loadAttendance()
})

onMounted(() => {
  loadAttendance()
})
</script>

<template>
  <MainLayout>
    <section class="attendance-page">
      <HeaderSection
        title="Preschool Attendance"
        subtitle="Track attendance for your assigned preschool classes."
      />

      <div class="attendance-page__panel">
        <div class="attendance-page__filters">
          <input
            v-model="searchQuery"
            class="attendance-page__input"
            type="search"
            placeholder="Search attendance"
          >
          <select v-model="statusFilter" class="attendance-page__input">
            <option value="">All status</option>
            <option v-for="option in statusOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
          <input
            v-model="attendanceDate"
            class="attendance-page__input"
            type="date"
          >
        </div>

        <div
          v-if="errorMessage"
          class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {{ errorMessage }}
        </div>

        <Table
          :rows="mappedAttendance"
          :columns="tableColumns"
          :loading="loading"
          empty-text="No attendance records found."
        />

        <div v-if="pagination.totalPages > 1" class="flex justify-end">
          <Pagination v-model="currentPage" :total-pages="pagination.totalPages" class="mt-2" />
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.attendance-page {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.attendance-page__panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid #dce6f2;
  background:
    radial-gradient(circle at top left, rgba(186, 230, 253, 0.18), transparent 24%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%);
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.5);
}

.attendance-page__filters {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.attendance-page__input {
  width: 100%;
  min-height: 2.7rem;
  border-radius: 0.8rem;
  border: 1px solid #d4dde8;
  background: #fcfdff;
  padding: 0.6rem 0.8rem;
  color: #0f172a;
}

@media (max-width: 900px) {
  .attendance-page__filters {
    grid-template-columns: 1fr;
  }
}
</style>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Table from '@/components/data-display/Table.vue'
import Pagination from '@/components/data-display/Pagination.vue'
import { fetchMyPreschoolStudents } from '@/modules/preschool/services/preschoolApi'

defineOptions({
  name: 'PreschoolTeacherMyStudentsPage',
})

const students = ref([])
const loading = ref(false)
const errorMessage = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const pagination = ref({ page: 1, perPage: 10, total: 0, totalPages: 1 })

const tableColumns = [
  { key: 'number', label: 'No.', align: 'left' },
  { key: 'student', label: 'Student', align: 'left' },
  { key: 'studentCode', label: 'Code', align: 'left' },
  { key: 'gender', label: 'Gender', align: 'left' },
  { key: 'status', label: 'Status', align: 'left' },
  { key: 'classesCount', label: 'Classes', align: 'left' },
]

const mappedStudents = computed(() =>
  students.value.map((student) => ({
    ...student,
    student: student.fullName || student.name || '-',
    classesCount: student.classesCount || student.classes?.length || 0,
  })),
)

async function loadStudents() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetchMyPreschoolStudents({
      page: currentPage.value,
      perPage: pagination.value.perPage || 10,
    })

    students.value = response.items || []
    pagination.value = response.pagination || pagination.value
  } catch (error) {
    students.value = []
    errorMessage.value = error?.message || 'Failed to load students.'
  } finally {
    loading.value = false
  }
}

watch(currentPage, () => {
  loadStudents()
})

onMounted(() => {
  loadStudents()
})
</script>

<template>
  <MainLayout>
    <section class="student-info-page">
      <HeaderSection
        title="My Preschool Students"
        subtitle="Students assigned to your preschool classes."
      />

      <div class="student-info-page__panel">
        <input
          v-model="searchQuery"
          class="student-info-page__input"
          type="search"
          placeholder="Search students"
        >

        <div
          v-if="errorMessage"
          class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {{ errorMessage }}
        </div>

        <Table
          :rows="mappedStudents"
          :columns="tableColumns"
          :loading="loading"
          empty-text="No students found."
        />

        <div v-if="pagination.totalPages > 1" class="flex justify-end">
          <Pagination v-model="currentPage" :total-pages="pagination.totalPages" class="mt-2" />
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.student-info-page {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.student-info-page__panel {
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

.student-info-page__input {
  width: 100%;
  min-height: 2.7rem;
  border-radius: 0.8rem;
  border: 1px solid #d4dde8;
  background: #fcfdff;
  padding: 0.6rem 0.8rem;
  color: #0f172a;
}

@media (max-width: 640px) {
  .student-info-page__panel {
    padding: 1.1rem;
  }
}
</style>

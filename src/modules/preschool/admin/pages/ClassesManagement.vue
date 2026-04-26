<script setup>
import { computed, ref, watch } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import SearchFilterBar from '@/components/forms/SearchFilterBar.vue'
import Pagination from '@/components/data-display/Pagination.vue'
import Button from '@/components/buttons/Button.vue'
import ClassTable from '@/modules/classes/components/ClassTable.vue'

defineOptions({
  name: 'PreschoolAdminClassesManagementPage',
})

const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = 6

const roleOptions = ['Nursery', 'Kindergarten A', 'Kindergarten B', 'Prep']
const statusOptions = ['Active', 'Pending', 'Closed']

const classRows = ref([
  {
    id: 'preschool-class-1',
    code: 'PS-NUR-01',
    name: 'Morning Nursery',
    teacher: 'Srey Pov',
    level: 'Nursery',
    schedule: 'Mon-Fri, 8:00 AM',
    students: 18,
    status: 'Active',
  },
  {
    id: 'preschool-class-2',
    code: 'PS-KA-02',
    name: 'Kindergarten A Blue',
    teacher: 'Dara',
    level: 'Kindergarten A',
    schedule: 'Mon-Fri, 9:30 AM',
    students: 22,
    status: 'Active',
  },
  {
    id: 'preschool-class-3',
    code: 'PS-KB-01',
    name: 'Kindergarten B Red', 
    teacher: 'Malis',
    level: 'Kindergarten B',
    schedule: 'Mon-Fri, 1:00 PM',
    students: 20,
    status: 'Pending',
  },
  {
    id: 'preschool-class-4',
    code: 'PS-PRE-01',
    name: 'Prep Readiness Group',
    teacher: 'Sokha',
    level: 'Prep',
    schedule: 'Mon-Fri, 2:30 PM',
    students: 16,
    status: 'Active',
  },
  {
    id: 'preschool-class-5',
    code: 'PS-NUR-02',
    name: 'Afternoon Nursery',
    teacher: 'Chanthy',
    level: 'Nursery',
    schedule: 'Mon-Fri, 1:30 PM',
    students: 17,
    status: 'Closed',
  },
  {
    id: 'preschool-class-6',
    code: 'PS-KA-03',
    name: 'Kindergarten A Green',
    teacher: 'Pisey',
    level: 'Kindergarten A',
    schedule: 'Sat, 8:30 AM',
    students: 14,
    status: 'Active',
  },
  {
    id: 'preschool-class-7',
    code: 'PS-KB-02',
    name: 'Kindergarten B Yellow',
    teacher: 'Ratha',
    level: 'Kindergarten B',
    schedule: 'Sat, 10:00 AM',
    students: 15,
    status: 'Pending',
  },
])

const filteredClasses = computed(() => {
  const query = String(searchQuery.value || '')
    .trim()
    .toLowerCase()

  return classRows.value.filter((item) => {
    let isMatch = true

    if (query) {
      const haystack =
        `${item.code} ${item.name} ${item.teacher} ${item.level} ${item.schedule}`.toLowerCase()
      isMatch = haystack.includes(query)
    }

    if (isMatch && roleFilter.value) {
      isMatch = String(item.level).toLowerCase() === String(roleFilter.value).toLowerCase()
    }

    if (isMatch && statusFilter.value) {
      isMatch = String(item.status).toLowerCase() === String(statusFilter.value).toLowerCase()
    }

    return isMatch
  })
})

const totalPages = computed(() => Math.max(Math.ceil(filteredClasses.value.length / pageSize), 1))
const paginatedClasses = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredClasses.value.slice(start, start + pageSize)
})

watch(
  () => filteredClasses.value.length,
  () => {
    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
  },
)

function onAddClass() {
  console.log('Add Preschool class')
}

function onViewClass(item) {
  console.log('View Preschool class', item)
}

function onEditClass(item) {
  console.log('Edit Preschool class', item)
}

function onDeleteClass(item) {
  const id = String(item?.id || '').trim()
  if (!id) return
  classRows.value = classRows.value.filter((row) => row.id !== id)
}
</script>

<template>
  <MainLayout>
    <section class="preschool-classes-page">
      <HeaderSection
        title="Preschool Classes"
        subtitle="Manage class groups, assigned teachers, and schedule coverage."
      />

      <div class="preschool-classes-page__panel">
        <div class="preschool-classes-page__actions">
          <Button
            variant="primary"
            size="lg"
            rounded="full"
            class="preschool-classes-page__add-button"
            @click="onAddClass"
          >
            <template #iconLeft>
              <i class="pi pi-plus text-sm" aria-hidden="true" />
            </template>
            Add Class
          </Button>
        </div>

        <SearchFilterBar
          class="w-full"
          v-model:searchQuery="searchQuery"
          v-model:roleFilter="roleFilter"
          v-model:statusFilter="statusFilter"
          :role-options="roleOptions"
          :status-options="statusOptions"
        />

        <ClassTable
          :classes="paginatedClasses"
          empty-text="No Preschool classes found."
          @view="onViewClass"
          @edit="onEditClass"
          @delete="onDeleteClass"
        />

        <div v-if="totalPages > 1" class="flex justify-end">
          <Pagination v-model="currentPage" :total-pages="totalPages" class="mt-2" />
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.preschool-classes-page {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.preschool-classes-page__panel {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(248, 250, 252, 0.96) 100%);
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.45);
}

.preschool-classes-page__actions {
  display: flex;
  justify-content: flex-end;
}

.preschool-classes-page__add-button {
  min-width: 10rem;
  box-shadow: 0 18px 30px -22px rgba(0, 174, 239, 0.55);
}

.preschool-classes-page__add-button :deep(.p-button-label) {
  font-weight: 800;
  letter-spacing: 0.01em;
}

.preschool-classes-page__add-button :deep(.p-button-icon) {
  font-size: 0.95rem;
}
</style>

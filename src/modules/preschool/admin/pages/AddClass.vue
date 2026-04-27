<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Form from '@/components/forms/Form.vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'
import AlertError from '@/components/alerts/AlertError.vue'
import AdminSummaryCards from '@/modules/super-admin/components/admin-management/AdminSummaryCards.vue'
import AdminChecklistPanel from '@/modules/super-admin/components/admin-management/AdminChecklistPanel.vue'
import AddClassIntro from '@/modules/preschool/admin/components/add-class/AddClassIntro.vue'
import AddClassFormFields from '@/modules/preschool/admin/components/add-class/AddClassFormFields.vue'
import AddClassFormActions from '@/modules/preschool/admin/components/add-class/AddClassFormActions.vue'
import { findClassRowById, upsertClassRow } from '@/modules/preschool/admin/utils/classStorage'

defineOptions({
  name: 'PreschoolAdminAddClassPage',
})

const router = useRouter()
const route = useRoute()

const classesDirectoryPath = '/module/preschool-admin/classes'
const levelOptions = ['Nursery', 'Kindergarten A', 'Kindergarten B', 'Prep']
const statusOptions = ['Active', 'Pending', 'Closed']

const form = reactive({
  code: '',
  name: '',
  teacher: '',
  level: levelOptions[0],
  schedule: '',
  students: 0,
  status: statusOptions[0],
  room: '',
  notes: '',
})

const isSubmitting = ref(false)
const errorMessage = ref('')
const showSuccess = ref(false)
const showError = ref(false)
const mode = computed(() => {
  if (route.query.mode === 'view') return 'view'
  if (route.query.mode === 'edit' || Boolean(route.query.id)) return 'edit'
  return 'add'
})
const isViewMode = computed(() => mode.value === 'view')
const isEditMode = computed(() => mode.value === 'edit')
const isFormLocked = computed(() => isSubmitting.value || isViewMode.value)

const pageTitle = computed(() => {
  if (isViewMode.value) return 'Class Details'
  if (isEditMode.value) return 'Update Class'
  return 'Add Class'
})
const pageSubtitle = computed(() => {
  if (isViewMode.value) return 'Review the class profile, teacher assignment, and schedule.'
  if (isEditMode.value) return 'Update the class profile, teacher assignment, and schedule.'
  return 'Create a preschool class and assign its schedule, teacher, and status.'
})

const summaryCards = computed(() => [
  {
    id: 'class-level',
    title: 'Level',
    value: form.level || '-',
    label: 'Selected learning stage',
    status: 'info',
    statusLabel: 'Info',
    surfaceClass: 'bg-cyan-50/80 border-cyan-200',
  },
  {
    id: 'class-students',
    title: 'Students',
    value: Number(form.students || 0),
    label: 'Planned enrollment',
    status: Number(form.students || 0) > 0 ? 'success' : 'warning',
    statusLabel: Number(form.students || 0) > 0 ? 'Success' : 'Warning',
    surfaceClass: 'bg-lime-50/80 border-lime-200',
  },
  {
    id: 'class-status',
    title: 'Status',
    value: form.status || '-',
    label: 'Initial class state',
    status: String(form.status || '').toLowerCase(),
    statusLabel: form.status || '',
    surfaceClass: 'bg-amber-50/80 border-amber-200',
  },
  {
    id: 'class-schedule',
    title: 'Schedule',
    value: form.schedule.trim() || 'Pending',
    label: 'Teaching time slot',
    status: form.schedule.trim() ? 'success' : 'warning',
    statusLabel: form.schedule.trim() ? 'Ready' : 'Pending',
    surfaceClass: 'bg-rose-50/80 border-rose-200',
  },
])

const checklistItems = computed(() => [
  {
    title: 'Identity',
    text: 'Set a class code and class name that are easy for staff to recognize.',
  },
  {
    title: 'Assignment',
    text: 'Choose the level, teacher, and room before publishing the class.',
  },
  {
    title: 'Schedule',
    text: 'Confirm the teaching schedule and expected student count.',
  },
  {
    title: 'Review',
    text: 'Check the class status and notes before saving.',
  },
])

function resetFeedback() {
  errorMessage.value = ''
  showError.value = false
}

function normalizeNumber(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function validateForm() {
  if (!form.code.trim()) return 'Class code is required.'
  if (!form.name.trim()) return 'Class name is required.'
  if (!form.teacher.trim()) return 'Teacher name is required.'
  if (!form.level) return 'Class level is required.'
  if (!form.schedule.trim()) return 'Schedule is required.'
  if (normalizeNumber(form.students) < 0) return 'Student count cannot be negative.'
  if (!form.status) return 'Class status is required.'
  return ''
}

async function goBackToClasses() {
  await router.push(classesDirectoryPath)
}

async function goToEditMode() {
  const id = String(route.query.id || '').trim()
  if (!id) return
  await router.push({ path: '/module/preschool-admin/classes/add', query: { mode: 'edit', id } })
}

async function onSubmit() {
  if (isViewMode.value) return

  resetFeedback()

  const validationError = validateForm()
  if (validationError) {
    errorMessage.value = validationError
    showError.value = true
    return
  }

  isSubmitting.value = true

  try {
    await new Promise((resolve) => setTimeout(resolve, 700))
    upsertClassRow({
      id: isEditMode.value ? String(route.query.id || '').trim() : '',
      code: form.code.trim(),
      name: form.name.trim(),
      teacher: form.teacher.trim(),
      level: form.level,
      schedule: form.schedule.trim(),
      students: normalizeNumber(form.students),
      status: form.status,
      room: form.room.trim(),
      notes: form.notes.trim(),
    })
    showSuccess.value = true
  } catch {
    errorMessage.value = isEditMode.value
      ? 'Failed to update the class.'
      : 'Failed to create the class.'
    showError.value = true
  } finally {
    isSubmitting.value = false
  }
}

function onErrorClose() {
  showError.value = false
}

async function onSuccessClose() {
  showSuccess.value = false
  await goBackToClasses()
}

function populateFromClass(item) {
  form.code = item.code || ''
  form.name = item.name || ''
  form.teacher = item.teacher || ''
  form.level = item.level || levelOptions[0]
  form.schedule = item.schedule || ''
  form.students = Number(item.students || 0)
  form.status = item.status || statusOptions[0]
  form.room = item.room || ''
  form.notes = item.notes || ''
}

onMounted(() => {
  if (mode.value === 'add') return

  const id = String(route.query.id || '').trim()
  const found = findClassRowById(id)
  if (!found) return
  populateFromClass(found)
})
</script>

<template>
  <MainLayout>
    <section class="add-class-page">
      <HeaderSection :title="pageTitle" :subtitle="pageSubtitle" />

      <AdminSummaryCards :cards="summaryCards" />

      <div class="add-class-page__layout">
        <Form
          class="add-class-page__form"
          :title="pageTitle"
          description="Complete the class profile, assignment details, and schedule information."
          cancel-text="Cancel"
          :loading="isSubmitting"
          :disabled="isViewMode"
          :show-cancel="true"
          @submit="onSubmit"
          @cancel="goBackToClasses"
        >
          <AddClassIntro />

          <AddClassFormFields
            :level-options="levelOptions"
            :status-options="statusOptions"
            :code="form.code"
            :name="form.name"
            :teacher="form.teacher"
            :level="form.level"
            :schedule="form.schedule"
            :students="form.students"
            :status="form.status"
            :room="form.room"
            :notes="form.notes"
            :is-locked="isFormLocked"
            @update:code="form.code = $event"
            @update:name="form.name = $event"
            @update:teacher="form.teacher = $event"
            @update:level="form.level = $event"
            @update:schedule="form.schedule = $event"
            @update:students="form.students = $event"
            @update:status="form.status = $event"
            @update:room="form.room = $event"
            @update:notes="form.notes = $event"
          />

          <template v-if="isViewMode || isEditMode" #actions>
            <AddClassFormActions
              :is-submitting="isSubmitting"
              :is-view-mode="isViewMode"
              :is-edit-mode="isEditMode"
              @back="goBackToClasses"
              @edit="goToEditMode"
            />
          </template>
        </Form>

        <div class="add-class-page__rail">
          <AdminChecklistPanel
            title="Class Setup Checklist"
            description="Review the essentials before creating the class."
            :items="checklistItems"
            highlight-label="Selected Level"
            :highlight-value="form.level"
          />
        </div>
      </div>
    </section>

    <AlertError
      :show="showError"
      title="Validation Error"
      :message="errorMessage"
      button-text="Close"
      @close="onErrorClose"
    />

    <AlertSuccess
      :show="showSuccess"
      :title="isEditMode ? 'Class Updated' : 'Class Created'"
      :message="
        isEditMode
          ? 'The preschool class has been updated successfully.'
          : 'The preschool class has been created successfully.'
      "
      button-text="Back to Classes"
      @close="onSuccessClose"
    />
  </MainLayout>
</template>

<style scoped>
.add-class-page {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.add-class-page__layout {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(300px, 0.95fr);
  gap: 1rem;
  align-items: start;
}

.add-class-page__form {
  display: block;
}

.add-class-page__rail {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: sticky;
  top: 1rem;
}

@media (max-width: 1120px) {
  .add-class-page__layout {
    grid-template-columns: 1fr;
  }

  .add-class-page__rail {
    position: static;
  }
}

</style>

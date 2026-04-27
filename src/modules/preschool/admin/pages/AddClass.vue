<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Form from '@/components/forms/Form.vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'
import AlertError from '@/components/alerts/AlertError.vue'
import AdminSummaryCards from '@/modules/super-admin/components/admin-management/AdminSummaryCards.vue'
import AdminChecklistPanel from '@/modules/super-admin/components/admin-management/AdminChecklistPanel.vue'

defineOptions({
  name: 'PreschoolAdminAddClassPage',
})

const router = useRouter()

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

const pageTitle = computed(() => 'Add Class')
const pageSubtitle = computed(() => 'Create a preschool class and assign its schedule, teacher, and status.')

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

async function onSubmit() {
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
    showSuccess.value = true
  } catch {
    errorMessage.value = 'Failed to create the class.'
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
          :show-cancel="true"
          @submit="onSubmit"
          @cancel="goBackToClasses"
        >
          <section class="add-class-page__intro">
            <p class="add-class-page__eyebrow">Preschool Class</p>
            <h3 class="add-class-page__intro-title">Class setup</h3>
            <p class="add-class-page__intro-text">
              Register a class, assign the teacher, and prepare the schedule before enrollment opens.
            </p>
          </section>

          <div class="add-class-page__fields">
            <label class="add-class-page__field add-class-page__field--half">
              <span class="add-class-page__label">Class Code</span>
              <input v-model="form.code" type="text" placeholder="PS-NUR-03" />
            </label>

            <label class="add-class-page__field add-class-page__field--half">
              <span class="add-class-page__label">Class Name</span>
              <input v-model="form.name" type="text" placeholder="Morning Nursery Blue" />
            </label>

            <label class="add-class-page__field add-class-page__field--half">
              <span class="add-class-page__label">Teacher</span>
              <input v-model="form.teacher" type="text" placeholder="Teacher name" />
            </label>

            <label class="add-class-page__field add-class-page__field--half">
              <span class="add-class-page__label">Level</span>
              <select v-model="form.level">
                <option v-for="option in levelOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </label>

            <label class="add-class-page__field add-class-page__field--half">
              <span class="add-class-page__label">Schedule</span>
              <input v-model="form.schedule" type="text" placeholder="Mon-Fri, 8:00 AM" />
            </label>

            <label class="add-class-page__field add-class-page__field--half">
              <span class="add-class-page__label">Students</span>
              <input v-model="form.students" type="number" min="0" placeholder="0" />
            </label>

            <label class="add-class-page__field add-class-page__field--half">
              <span class="add-class-page__label">Status</span>
              <select v-model="form.status">
                <option v-for="option in statusOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </label>

            <label class="add-class-page__field add-class-page__field--half">
              <span class="add-class-page__label">Room</span>
              <input v-model="form.room" type="text" placeholder="Room A1" />
            </label>

            <label class="add-class-page__field add-class-page__field--full">
              <span class="add-class-page__label">Notes</span>
              <textarea
                v-model="form.notes"
                rows="4"
                placeholder="Optional notes about the class, materials, or scheduling."
              />
            </label>
          </div>
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
      title="Class Created"
      message="The preschool class has been created successfully."
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

.add-class-page__intro {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem 1.1rem;
  border: 1px solid #dbeafe;
  border-radius: 1rem;
  background: linear-gradient(135deg, rgba(224, 242, 254, 0.7) 0%, rgba(255, 255, 255, 0.96) 100%);
}

.add-class-page__eyebrow {
  margin: 0;
  color: #0f6f8f;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.add-class-page__intro-title {
  margin: 0;
  color: #0f172a;
  font-size: 1.15rem;
  font-weight: 800;
}

.add-class-page__intro-text {
  margin: 0;
  color: #475569;
  font-size: 0.92rem;
  line-height: 1.6;
}

.add-class-page__fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.95rem;
}

.add-class-page__field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.add-class-page__field--half {
  grid-column: span 1;
}

.add-class-page__field--full {
  grid-column: 1 / -1;
}

.add-class-page__label {
  color: #334155;
  font-size: 0.84rem;
  font-weight: 700;
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

@media (max-width: 720px) {
  .add-class-page__fields {
    grid-template-columns: 1fr;
  }
}
</style>

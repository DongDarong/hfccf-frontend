<template>
  <div class="space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div class="space-y-2">
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {{ t('preschoolGuardianCommunicationPage.hero.kicker') }}
          </p>
          <h1 class="text-3xl font-bold text-slate-900">
            {{ t('preschoolGuardianCommunicationPage.title') }}
          </h1>
          <p class="max-w-3xl text-sm leading-6 text-slate-600">
            {{ t('preschoolGuardianCommunicationPage.hero.subtitle') }}
          </p>
        </div>

        <AppButton variant="ghost" @click="router.push({ name: 'dashboard-preschool-admin-students' })">
          {{ t('common.actions.back') }}
        </AppButton>
      </div>

      <div class="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <div
          v-for="card in summaryCards"
          :key="card.label"
          class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
        >
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {{ card.label }}
          </p>
          <p class="mt-2 text-2xl font-bold text-slate-900">
            {{ card.value }}
          </p>
        </div>
      </div>
    </section>

    <div class="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <div class="space-y-6">
        <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-lg font-semibold text-slate-900">
                {{ t('preschoolGuardianCommunicationPage.contactForm.title') }}
              </h2>
              <p class="mt-1 text-sm text-slate-500">
                {{ t('preschoolGuardianCommunicationPage.contactForm.subtitle') }}
              </p>
            </div>
            <AppBadge variant="staff">
              {{ currentStaffLabel }}
            </AppBadge>
          </div>

          <form class="mt-5 space-y-4" @submit.prevent="handleSubmit">
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">
                {{ t('preschoolGuardianCommunicationPage.labels.student') }}
              </label>
              <select
                v-model="selectedStudentId"
                :disabled="loadingStudents"
                class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
              >
                <option value="">
                  {{ loadingStudents ? t('preschoolGuardianCommunicationPage.messages.loading') : t('preschoolGuardianCommunicationPage.messages.selectStudent') }}
                </option>
                <option v-for="student in studentOptions" :key="student.id" :value="student.id">
                  {{ student.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">
                {{ t('preschoolGuardianCommunicationPage.labels.guardian') }}
              </label>
              <select
                v-model="form.guardianId"
                :disabled="!guardianOptions.length"
                class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none disabled:bg-slate-100"
              >
                <option value="">
                  {{ guardianPlaceholder }}
                </option>
                <option v-for="guardian in guardianOptions" :key="guardian.id" :value="guardian.id">
                  {{ guardian.label }}
                </option>
              </select>
              <p class="mt-1 text-xs text-slate-500">
                {{ guardianHelpText }}
              </p>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-700">
                  {{ t('preschoolGuardianCommunicationPage.labels.channel') }}
                </label>
                <select
                  v-model="form.contactMethod"
                  class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                >
                  <option value="">
                    {{ t('preschoolGuardianCommunicationPage.messages.selectOption') }}
                  </option>
                  <option v-for="option in contactMethodOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium text-slate-700">
                  {{ t('preschoolGuardianCommunicationPage.labels.reason') }}
                </label>
                <select
                  v-model="form.reasonTopic"
                  class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                >
                  <option value="">
                    {{ t('preschoolGuardianCommunicationPage.messages.selectOption') }}
                  </option>
                  <option v-for="option in reasonOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">
                {{ t('preschoolGuardianCommunicationPage.labels.summary') }}
              </label>
              <textarea
                v-model="form.discussionSummary"
                rows="5"
                class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                :placeholder="t('preschoolGuardianCommunicationPage.messages.summaryPlaceholder')"
              />
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-700">
                  {{ t('preschoolGuardianCommunicationPage.labels.outcome') }}
                </label>
                <select
                  v-model="form.outcome"
                  class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                >
                  <option value="">
                    {{ t('preschoolGuardianCommunicationPage.messages.selectOption') }}
                  </option>
                  <option v-for="option in outcomeOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium text-slate-700">
                  {{ t('preschoolGuardianCommunicationPage.labels.priority') }}
                </label>
                <select
                  v-model="form.followUpPriority"
                  class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                >
                  <option v-for="option in priorityOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-700">
                  {{ t('preschoolGuardianCommunicationPage.labels.followUpRequired') }}
                </label>
                <select
                  v-model="form.followUpRequired"
                  class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                >
                  <option :value="false">{{ t('preschoolGuardianCommunicationPage.binary.no') }}</option>
                  <option :value="true">{{ t('preschoolGuardianCommunicationPage.binary.yes') }}</option>
                </select>
              </div>

              <div v-if="form.followUpRequired">
                <label class="mb-1 block text-sm font-medium text-slate-700">
                  {{ t('preschoolGuardianCommunicationPage.labels.followUpDate') }}
                </label>
                <input
                  v-model="form.followUpDate"
                  type="date"
                  class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                />
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p class="font-medium text-slate-900">
                {{ t('preschoolGuardianCommunicationPage.labels.followUpDate') }}:
                <span class="font-normal text-slate-600">
                  {{ form.followUpRequired ? (form.followUpDate || t('preschoolGuardianCommunicationPage.messages.selectFollowUpDate')) : 'N/A' }}
                </span>
              </p>
              <p class="mt-1 font-medium text-slate-900">
                {{ t('preschoolGuardianCommunicationPage.messages.previewLabel') }}:
              </p>
              <p class="mt-1 whitespace-pre-line text-sm leading-6 text-slate-600">
                {{ contactPreview }}
              </p>
            </div>

            <div v-if="formErrors.length" class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              <ul class="list-disc space-y-1 pl-5">
                <li v-for="error in formErrors" :key="error">
                  {{ error }}
                </li>
              </ul>
            </div>

            <div v-if="submitMessage" class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              {{ submitMessage }}
            </div>

            <div class="flex flex-wrap gap-3">
              <AppButton type="submit">
                {{ t('preschoolGuardianCommunicationPage.actions.saveContactLog') }}
              </AppButton>
              <AppButton type="button" variant="ghost" @click="resetForm">
                {{ t('common.reset') }}
              </AppButton>
            </div>
          </form>
        </section>

        <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-semibold text-slate-900">
                {{ t('preschoolGuardianCommunicationPage.labels.studentRoster') }}
              </h2>
              <p class="mt-1 text-sm text-slate-500">
                {{ t('preschoolGuardianCommunicationPage.messages.studentRosterHint') }}
              </p>
            </div>
            <span class="text-sm font-medium text-slate-500">
              {{ filteredStudentOptions.length }}
            </span>
          </div>

          <div class="mt-4">
            <input
              v-model="studentSearch"
              type="search"
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
              :placeholder="t('preschoolGuardianCommunicationPage.messages.searchStudents')"
            />
          </div>

          <div class="mt-4 max-h-[26rem] space-y-2 overflow-y-auto pr-1">
            <p v-if="loadingStudents" class="rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-500">
              {{ t('preschoolGuardianCommunicationPage.messages.loading') }}
            </p>
            <button
              v-for="student in filteredStudentOptions"
              :key="student.id"
              type="button"
              class="w-full rounded-2xl border px-4 py-3 text-left transition-colors"
              :class="student.id === selectedStudentId
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50'"
              @click="selectStudent(student.id)"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="truncate font-semibold">
                    {{ student.label }}
                  </p>
                  <p class="mt-1 text-xs opacity-75">
                    {{ student.guardianLabel }}
                  </p>
                </div>
                <AppBadge variant="info" class="shrink-0">
                  {{ student.communicationCount }}
                </AppBadge>
              </div>
            </button>
          </div>
        </section>
      </div>

      <GuardianCommunicationTimeline
        :items="filteredCommunications"
        :loading="loadingCommunications"
        :title="t('preschoolGuardianCommunicationPage.timelineTitle')"
        :subtitle="t('preschoolGuardianCommunicationPage.timelineSubtitle')"
        show-actions
        @sent="handleMarkCompleted"
        @acknowledged="handleMarkFollowedUp"
        @cancelled="handleCloseLog"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import GuardianCommunicationTimeline from '@/modules/preschool/admin/components/guardian/GuardianCommunicationTimeline.vue'
import {
  buildGuardianContactLogMessage,
  isOverdueFollowUp,
  isToday,
  normalizeText,
  parseGuardianContactLogMessage
} from '@/modules/preschool/admin/pages/guardian/contactLogUtils'
import { useUserStore } from '@/store/userStore'
import {
  acknowledgeGuardianCommunication,
  cancelGuardianCommunication,
  createStudentGuardianCommunication,
  fetchGuardianCommunications,
  markGuardianCommunicationSent
} from '@/modules/preschool/services/api/preschoolGuardianCommunicationApi'
import { fetchPreschoolStudents } from '@/modules/preschool/services/preschoolApi'

const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()

const loadingStudents = ref(false)
const loadingCommunications = ref(false)
const students = ref([])
const communications = ref([])
const studentSearch = ref('')
const selectedStudentId = ref('')
const submitMessage = ref('')
const formErrors = ref([])

const form = reactive({
  guardianId: '',
  contactMethod: '',
  reasonTopic: '',
  discussionSummary: '',
  outcome: '',
  followUpRequired: false,
  followUpDate: '',
  followUpPriority: 'medium'
})

const contactMethodOptions = computed(() => ([
  { value: 'phone-call', label: t('preschoolGuardianCommunicationPage.contactMethods.phoneCall') },
  { value: 'telegram', label: t('preschoolGuardianCommunicationPage.contactMethods.telegram') },
  { value: 'messenger', label: t('preschoolGuardianCommunicationPage.contactMethods.messenger') },
  { value: 'sms', label: t('preschoolGuardianCommunicationPage.contactMethods.sms') },
  { value: 'email', label: t('preschoolGuardianCommunicationPage.contactMethods.email') },
  { value: 'face-to-face', label: t('preschoolGuardianCommunicationPage.contactMethods.faceToFace') },
  { value: 'home-visit', label: t('preschoolGuardianCommunicationPage.contactMethods.homeVisit') },
  { value: 'other', label: t('preschoolGuardianCommunicationPage.contactMethods.other') }
]))

const reasonOptions = computed(() => ([
  { value: 'attendance', label: t('preschoolGuardianCommunicationPage.reasons.attendance') },
  { value: 'health', label: t('preschoolGuardianCommunicationPage.reasons.health') },
  { value: 'payment', label: t('preschoolGuardianCommunicationPage.reasons.payment') },
  { value: 'enrollment', label: t('preschoolGuardianCommunicationPage.reasons.enrollment') },
  { value: 'behaviour', label: t('preschoolGuardianCommunicationPage.reasons.behaviour') },
  { value: 'pickup', label: t('preschoolGuardianCommunicationPage.reasons.pickup') },
  { value: 'emergency', label: t('preschoolGuardianCommunicationPage.reasons.emergency') },
  { value: 'academic', label: t('preschoolGuardianCommunicationPage.reasons.academic') },
  { value: 'general', label: t('preschoolGuardianCommunicationPage.reasons.general') },
  { value: 'other', label: t('preschoolGuardianCommunicationPage.reasons.other') }
]))

const outcomeOptions = computed(() => ([
  { value: 'guardian-acknowledged', label: t('preschoolGuardianCommunicationPage.outcomes.guardianAcknowledged') },
  { value: 'follow-up-requested', label: t('preschoolGuardianCommunicationPage.outcomes.guardianRequestedFollowUp') },
  { value: 'guardian-unreachable', label: t('preschoolGuardianCommunicationPage.outcomes.guardianUnreachable') },
  { value: 'appointment-scheduled', label: t('preschoolGuardianCommunicationPage.outcomes.appointmentScheduled') },
  { value: 'issue-resolved', label: t('preschoolGuardianCommunicationPage.outcomes.issueResolved') },
  { value: 'other', label: t('preschoolGuardianCommunicationPage.outcomes.other') }
]))

const priorityOptions = computed(() => ([
  { value: 'low', label: t('preschoolGuardianCommunicationPage.severity.low') },
  { value: 'medium', label: t('preschoolGuardianCommunicationPage.severity.medium') },
  { value: 'high', label: t('preschoolGuardianCommunicationPage.severity.high') }
]))

const currentStaffLabel = computed(() => {
  const user = userStore.currentUser || {}
  return user.fullName || user.name || user.email || t('common.unknown')
})

const selectedStudent = computed(() => students.value.find(student => String(student.id) === String(selectedStudentId.value)) || null)

const guardianOptions = computed(() => {
  const student = selectedStudent.value
  const guardians = student?.guardians || student?.guardian ? [].concat(student.guardians || student.guardian) : []

  return guardians
    .filter(Boolean)
    .map((guardian, index) => ({
      id: guardian.id || guardian.guardianId || guardian.userId || `${index}`,
      label: [guardian.fullName || guardian.name || guardian.displayName, guardian.phone || guardian.mobile]
        .filter(Boolean)
        .join(' • ') || t('preschoolGuardianCommunicationPage.messages.noGuardianData'),
      raw: guardian
    }))
})

const guardianPlaceholder = computed(() =>
  guardianOptions.value.length
    ? t('preschoolGuardianCommunicationPage.messages.selectGuardian')
    : t('preschoolGuardianCommunicationPage.messages.noGuardianData')
)

const guardianHelpText = computed(() =>
  guardianOptions.value.length
    ? t('preschoolGuardianCommunicationPage.messages.guardianHelp')
    : t('preschoolGuardianCommunicationPage.messages.noGuardianData')
)

const studentOptions = computed(() =>
  students.value.map(student => ({
    id: String(student.id),
    label: [student.fullName || student.name || `${student.firstName || ''} ${student.lastName || ''}`.trim(), student.publicId || student.studentCode || student.code]
      .filter(Boolean)
      .join(' — ') || t('common.unknown'),
    guardianLabel: student.guardianName || student.primaryGuardianName || t('preschoolGuardianCommunicationPage.messages.noGuardianData'),
    communicationCount: communications.value.filter(item => String(item.studentId) === String(student.id)).length
  }))
)

const filteredStudentOptions = computed(() => {
  const query = normalizeText(studentSearch.value).toLowerCase()
  if (!query) {
    return studentOptions.value
  }

  return studentOptions.value.filter(student =>
    student.label.toLowerCase().includes(query) ||
    student.guardianLabel.toLowerCase().includes(query)
  )
})

const filteredCommunications = computed(() => {
  const studentId = selectedStudentId.value
  return communications.value.filter(item => !studentId || String(item.studentId) === String(studentId))
})

const contactPreview = computed(() => {
  const method = contactMethodOptions.value.find(option => option.value === form.contactMethod)?.label || t('preschoolGuardianCommunicationPage.messages.selectOption')
  const reason = reasonOptions.value.find(option => option.value === form.reasonTopic)?.label || t('preschoolGuardianCommunicationPage.messages.selectOption')
  const outcome = outcomeOptions.value.find(option => option.value === form.outcome)?.label || t('preschoolGuardianCommunicationPage.messages.selectOption')
  const studentLabel = studentOptions.value.find(option => option.id === selectedStudentId.value)?.label || t('preschoolGuardianCommunicationPage.messages.selectStudent')

  return [
    `${studentLabel}`,
    `${method} · ${reason}`,
    form.discussionSummary,
    `${t('preschoolGuardianCommunicationPage.labels.outcome')}: ${outcome}`,
    `${t('preschoolGuardianCommunicationPage.labels.followUpRequired')}: ${form.followUpRequired ? t('preschoolGuardianCommunicationPage.binary.yes') : t('preschoolGuardianCommunicationPage.binary.no')}`,
    form.followUpRequired ? `${t('preschoolGuardianCommunicationPage.labels.followUpDate')}: ${form.followUpDate || t('preschoolGuardianCommunicationPage.messages.selectFollowUpDate')}` : '',
    `${t('preschoolGuardianCommunicationPage.labels.staffMember')}: ${currentStaffLabel.value}`
  ].filter(Boolean).join('\n')
})

const summaryCards = computed(() => {
  const items = filteredCommunications.value
  const today = items.filter(item => isToday(item.createdAt || item.created_at || item.updatedAt || item.updated_at)).length
  const parsed = items.map(item => parseGuardianContactLogMessage(item.message))
  const followUps = items.filter((item, index) => parsed[index]?.followUpRequired || item.followUpRequired).length
  const completed = items.filter(item => ['sent', 'acknowledged', 'resolved', 'closed'].includes(String(item.status || '').toLowerCase())).length
  const overdue = items.filter((item, index) => isOverdueFollowUp(item, parsed[index])).length

  return [
    { label: t('preschoolGuardianCommunicationPage.metrics.totalContacts'), value: items.length },
    { label: t('preschoolGuardianCommunicationPage.metrics.today'), value: today },
    { label: t('preschoolGuardianCommunicationPage.metrics.followUpRequired'), value: followUps },
    { label: t('preschoolGuardianCommunicationPage.metrics.completed'), value: completed },
    { label: t('preschoolGuardianCommunicationPage.metrics.overdueFollowUps'), value: overdue }
  ]
})

function unwrapList(response) {
  if (Array.isArray(response)) {
    return response
  }

  return response?.data?.items || response?.data || response?.items || response?.records || []
}

function resetForm() {
  form.guardianId = guardianOptions.value[0]?.id || ''
  form.contactMethod = ''
  form.reasonTopic = ''
  form.discussionSummary = ''
  form.outcome = ''
  form.followUpRequired = false
  form.followUpDate = ''
  form.followUpPriority = 'medium'
  formErrors.value = []
  submitMessage.value = ''
}

async function loadStudents() {
  loadingStudents.value = true

  try {
    const response = await fetchPreschoolStudents({ perPage: 200 })
    students.value = unwrapList(response)

    if (!selectedStudentId.value && students.value.length) {
      selectedStudentId.value = String(students.value[0].id)
    }
  } finally {
    loadingStudents.value = false
  }
}

async function loadCommunications() {
  loadingCommunications.value = true

  try {
    const response = await fetchGuardianCommunications({
      studentId: selectedStudentId.value || undefined
    })

    communications.value = unwrapList(response)
  } finally {
    loadingCommunications.value = false
  }
}

function selectStudent(studentId) {
  selectedStudentId.value = String(studentId)
}

function validateForm() {
  const errors = []

  if (!selectedStudentId.value) {
    errors.push(t('preschoolGuardianCommunicationPage.validation.studentRequired'))
  }

  if (!form.contactMethod) {
    errors.push(t('preschoolGuardianCommunicationPage.validation.contactMethodRequired'))
  }

  if (!form.reasonTopic) {
    errors.push(t('preschoolGuardianCommunicationPage.validation.reasonRequired'))
  }

  if (!normalizeText(form.discussionSummary)) {
    errors.push(t('preschoolGuardianCommunicationPage.validation.summaryRequired'))
  }

  if (!form.outcome) {
    errors.push(t('preschoolGuardianCommunicationPage.validation.outcomeRequired'))
  }

  if (form.followUpRequired && !form.followUpDate) {
    errors.push(t('preschoolGuardianCommunicationPage.validation.followUpDateRequired'))
  }

  formErrors.value = errors
  return errors.length === 0
}

async function handleSubmit() {
  if (!validateForm()) {
    return
  }

  try {
    const guardian = guardianOptions.value.find(option => option.id === form.guardianId)
    const method = contactMethodOptions.value.find(option => option.value === form.contactMethod)?.label || form.contactMethod
    const reason = reasonOptions.value.find(option => option.value === form.reasonTopic)?.label || form.reasonTopic
    const outcome = outcomeOptions.value.find(option => option.value === form.outcome)?.label || form.outcome

    const message = buildGuardianContactLogMessage({
      student: studentOptions.value.find(option => option.id === selectedStudentId.value)?.label || '',
      guardian: guardian?.label || '',
      method,
      reason,
      summary: form.discussionSummary,
      outcome,
      followUpRequired: form.followUpRequired,
      followUpDate: form.followUpDate,
      priority: form.followUpPriority
    }, {}, currentStaffLabel.value)

    await createStudentGuardianCommunication({
      studentId: selectedStudentId.value,
      guardianId: form.guardianId || undefined,
      sourceType: 'manual_note',
      channel: form.contactMethod,
      subject: form.reasonTopic,
      message,
      severity: form.followUpPriority,
      status: 'queued'
    })

    submitMessage.value = t('preschoolGuardianCommunicationPage.messages.saveSuccess')
    resetForm()
    await loadCommunications()
  } catch {
    submitMessage.value = t('preschoolGuardianCommunicationPage.messages.saveFailed')
  }
}

async function handleMarkCompleted(item) {
  await markGuardianCommunicationSent(item.id)
  await loadCommunications()
}

async function handleMarkFollowedUp(item) {
  await acknowledgeGuardianCommunication(item.id)
  await loadCommunications()
}

async function handleCloseLog(item) {
  await cancelGuardianCommunication(item.id)
  await loadCommunications()
}

watch(selectedStudentId, async (value) => {
  const student = students.value.find(entry => String(entry.id) === String(value))
  form.guardianId = guardianOptions.value[0]?.id || student?.guardianId || ''
  await loadCommunications()
})

watch(guardianOptions, () => {
  if (!guardianOptions.value.length) {
    form.guardianId = ''
    return
  }

  if (!guardianOptions.value.some(option => option.id === form.guardianId)) {
    form.guardianId = guardianOptions.value[0].id
  }
}, { immediate: true })

onMounted(async () => {
  await loadStudents()
  resetForm()
  await loadCommunications()
})
</script>

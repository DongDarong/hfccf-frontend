<script setup>
// Governance cases turn diff, integrity, export, and reconstruction findings
// into owned review work items so administrators can resolve institutional
// risk without mutating immutable Preschool history.
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import { useLanguage } from '@/composables/useLanguage'
import { usePreschoolAcademicLifecycle } from '@/modules/preschool/composables/usePreschoolAcademicLifecycle'
import { fetchPreschoolClasses, fetchPreschoolStudents } from '@/modules/preschool/services/preschoolApi'
import { fetchReportPeriods } from '@/modules/preschool/services/api/preschoolReportsApi'
import {
  addGovernanceCaseEvidence,
  assignGovernanceCase,
  closeGovernanceCase,
  createGovernanceCase,
  escalateGovernanceCase,
  fetchGovernanceCase,
  fetchGovernanceCaseAssignees,
  fetchGovernanceCases,
  reopenGovernanceCase,
  resolveGovernanceCase,
} from '@/modules/preschool/services/api/preschoolGovernanceCasesApi'
import GovernanceCaseAssignmentPanel from '@/modules/preschool/shared/components/governance-cases/GovernanceCaseAssignmentPanel.vue'
import GovernanceCaseDetailPanel from '@/modules/preschool/shared/components/governance-cases/GovernanceCaseDetailPanel.vue'
import GovernanceCaseEvidenceList from '@/modules/preschool/shared/components/governance-cases/GovernanceCaseEvidenceList.vue'
import GovernanceCaseResolutionPanel from '@/modules/preschool/shared/components/governance-cases/GovernanceCaseResolutionPanel.vue'
import GovernanceCaseSummaryCards from '@/modules/preschool/shared/components/governance-cases/GovernanceCaseSummaryCards.vue'
import GovernanceCaseTable from '@/modules/preschool/shared/components/governance-cases/GovernanceCaseTable.vue'
import GovernanceCaseTimeline from '@/modules/preschool/shared/components/governance-cases/GovernanceCaseTimeline.vue'

defineOptions({
  name: 'PreschoolGovernanceCasesPage',
})

const router = useRouter()
const { t } = useLanguage()
const { academicYears, terms, loadAcademicLifecycle } = usePreschoolAcademicLifecycle()

const loading = ref(false)
const detailLoading = ref(false)
const assigneeLoading = ref(false)
const createLoading = ref(false)
const assignmentLoading = ref(false)
const evidenceLoading = ref(false)
const resolutionLoading = ref(false)
const errorMessage = ref('')
const detailError = ref('')

const listPayload = ref({
  items: [],
  pagination: {},
  summary: {},
  options: {},
})

const detailPayload = ref({
  record: null,
  events: [],
  evidence: [],
  timeline: [],
  summary: {},
  options: {},
})

const assigneeOptions = ref([])
const classOptions = ref([])
const studentOptions = ref([])
const reportPeriodOptions = ref([])
const selectedCaseId = ref('')

const filters = ref({
  academicYearId: '',
  termId: '',
  reportPeriodId: '',
  classId: '',
  studentId: '',
  ownerUserId: '',
  reviewerUserId: '',
  escalationOfficerUserId: '',
  status: '',
  severity: '',
  sourceType: '',
  sourceReference: '',
  isUrgent: '',
  dueFrom: '',
  dueTo: '',
  createdFrom: '',
  createdTo: '',
  updatedFrom: '',
  updatedTo: '',
  search: '',
})

const createForm = ref({
  title: '',
  summary: '',
  sourceType: 'manual_review',
  sourceReference: '',
  severity: 'medium',
  riskScore: 50,
  status: 'open',
  isUrgent: false,
  urgentReason: '',
  ownerUserId: '',
  reviewerUserId: '',
  escalationOfficerUserId: '',
  dueDate: '',
  academicYearId: '',
  termId: '',
  reportPeriodId: '',
  classId: '',
  studentId: '',
  latestNote: '',
  resolutionNote: '',
})

const assignmentForm = ref({
  ownerUserId: '',
  reviewerUserId: '',
  escalationOfficerUserId: '',
  status: '',
  dueDate: '',
  note: '',
})

const evidenceForm = ref({
  evidenceType: 'manual_note',
  evidenceReference: '',
  evidenceLabel: '',
  evidenceDescription: '',
  metadataText: '',
})

const resolutionForm = ref({
  resolutionNote: '',
  closureNote: '',
  reopenReason: '',
  escalationReason: '',
})

const selectedRecord = computed(() => detailPayload.value.record || listPayload.value.items.find((item) => String(item.id) === String(selectedCaseId.value)) || null)

const summaryCards = computed(() => listPayload.value.summary || {})

const sourceLabelMap = computed(() => ({
  governance_diff: t('preschoolGovernanceCasesPage.sources.governanceDiff'),
  integrity_warning: t('preschoolGovernanceCasesPage.sources.integrityWarning'),
  export_mismatch: t('preschoolGovernanceCasesPage.sources.exportMismatch'),
  lifecycle_anomaly: t('preschoolGovernanceCasesPage.sources.lifecycleAnomaly'),
  reconstruction_inconsistency: t('preschoolGovernanceCasesPage.sources.reconstructionInconsistency'),
  manual_review: t('preschoolGovernanceCasesPage.sources.manualReview'),
}))

const severityLabelMap = computed(() => ({
  low: t('preschoolGovernanceCasesPage.severities.low'),
  medium: t('preschoolGovernanceCasesPage.severities.medium'),
  high: t('preschoolGovernanceCasesPage.severities.high'),
  critical: t('preschoolGovernanceCasesPage.severities.critical'),
}))

const statusLabelMap = computed(() => ({
  open: t('preschoolGovernanceCasesPage.statuses.open'),
  under_review: t('preschoolGovernanceCasesPage.statuses.underReview'),
  investigating: t('preschoolGovernanceCasesPage.statuses.investigating'),
  awaiting_evidence: t('preschoolGovernanceCasesPage.statuses.awaitingEvidence'),
  escalated: t('preschoolGovernanceCasesPage.statuses.escalated'),
  resolved: t('preschoolGovernanceCasesPage.statuses.resolved'),
  closed: t('preschoolGovernanceCasesPage.statuses.closed'),
}))

const sourceOptions = computed(() => {
  const items = listPayload.value.options?.sourceOptions
  if (Array.isArray(items) && items.length) {
    return items.map((item) => ({ label: item.label || item.value, value: item.value }))
  }

  return [
    { label: sourceLabelMap.value.governance_diff, value: 'governance_diff' },
    { label: sourceLabelMap.value.integrity_warning, value: 'integrity_warning' },
    { label: sourceLabelMap.value.export_mismatch, value: 'export_mismatch' },
    { label: sourceLabelMap.value.lifecycle_anomaly, value: 'lifecycle_anomaly' },
    { label: sourceLabelMap.value.reconstruction_inconsistency, value: 'reconstruction_inconsistency' },
    { label: sourceLabelMap.value.manual_review, value: 'manual_review' },
  ]
})

const severityOptions = computed(() => {
  const items = listPayload.value.options?.severityOptions
  if (Array.isArray(items) && items.length) {
    return items.map((item) => ({ label: item.label || item.value, value: item.value }))
  }

  return [
    { label: severityLabelMap.value.low, value: 'low' },
    { label: severityLabelMap.value.medium, value: 'medium' },
    { label: severityLabelMap.value.high, value: 'high' },
    { label: severityLabelMap.value.critical, value: 'critical' },
  ]
})

const statusOptions = computed(() => {
  const items = listPayload.value.options?.statusOptions
  if (Array.isArray(items) && items.length) {
    return items.map((item) => ({ label: item.label || item.value, value: item.value }))
  }

  return [
    { label: statusLabelMap.value.open, value: 'open' },
    { label: statusLabelMap.value.underReview, value: 'under_review' },
    { label: statusLabelMap.value.investigating, value: 'investigating' },
    { label: statusLabelMap.value.awaitingEvidence, value: 'awaiting_evidence' },
    { label: statusLabelMap.value.escalated, value: 'escalated' },
    { label: statusLabelMap.value.resolved, value: 'resolved' },
    { label: statusLabelMap.value.closed, value: 'closed' },
  ]
})

const workflowStatusOptions = computed(() => {
  const items = listPayload.value.options?.workflowStatusOptions
  if (Array.isArray(items) && items.length) {
    return items.map((item) => ({ label: item.label || item.value, value: item.value }))
  }

  return statusOptions.value.filter((item) => ['open', 'under_review', 'investigating', 'awaiting_evidence'].includes(item.value))
})

const academicYearOptions = computed(() => [
  { label: t('preschoolGovernanceCasesPage.filters.allAcademicYears'), value: '' },
  ...academicYears.value.map((year) => ({
    label: year.label || year.code || `#${year.id}`,
    value: String(year.id || ''),
  })),
])

const termOptions = computed(() => [
  { label: t('preschoolGovernanceCasesPage.filters.allTerms'), value: '' },
  ...terms.value.map((term) => ({
    label: term.label || term.name || term.code || `#${term.id}`,
    value: String(term.id || ''),
  })),
])

const reportPeriodOptionsList = computed(() => [
  { label: t('preschoolGovernanceCasesPage.filters.allReportPeriods'), value: '' },
  ...reportPeriodOptions.value.map((period) => ({
    label: period.label,
    value: String(period.value),
  })),
])

const classOptionsList = computed(() => [
  { label: t('preschoolGovernanceCasesPage.filters.allClasses'), value: '' },
  ...classOptions.value.map((item) => ({
    label: item.label,
    value: String(item.value),
  })),
])

const studentOptionsList = computed(() => [
  { label: t('preschoolGovernanceCasesPage.filters.allStudents'), value: '' },
  ...studentOptions.value.map((item) => ({
    label: item.label,
    value: String(item.value),
  })),
])

const assigneeSelectOptions = computed(() => [
  { label: t('preschoolGovernanceCasesPage.filters.allAssignees'), value: '' },
  ...assigneeOptions.value.map((item) => ({
    label: item.label,
    value: item.value,
  })),
])

const caseTableColumns = computed(() => ({
  case: t('preschoolGovernanceCasesPage.table.columns.case'),
  severity: t('preschoolGovernanceCasesPage.table.columns.severity'),
  status: t('preschoolGovernanceCasesPage.table.columns.status'),
  owner: t('preschoolGovernanceCasesPage.table.columns.owner'),
  dueDate: t('preschoolGovernanceCasesPage.table.columns.dueDate'),
  source: t('preschoolGovernanceCasesPage.table.columns.source'),
  updatedAt: t('preschoolGovernanceCasesPage.table.columns.updatedAt'),
}))

const detailLabels = computed(() => ({
  caseLabel: t('preschoolGovernanceCasesPage.detail.caseLabel'),
  riskScore: t('preschoolGovernanceCasesPage.detail.riskScore'),
  severity: t('preschoolGovernanceCasesPage.detail.severity'),
  source: t('preschoolGovernanceCasesPage.detail.source'),
  owner: t('preschoolGovernanceCasesPage.detail.owner'),
  reviewer: t('preschoolGovernanceCasesPage.detail.reviewer'),
  escalationOfficer: t('preschoolGovernanceCasesPage.detail.escalationOfficer'),
  dueDate: t('preschoolGovernanceCasesPage.detail.dueDate'),
  academicContext: t('preschoolGovernanceCasesPage.detail.academicContext'),
  assignmentContext: t('preschoolGovernanceCasesPage.detail.assignmentContext'),
  statusSummary: t('preschoolGovernanceCasesPage.detail.statusSummary'),
  createdBy: t('preschoolGovernanceCasesPage.detail.createdBy'),
  updatedAt: t('preschoolGovernanceCasesPage.detail.updatedAt'),
  summary: t('preschoolGovernanceCasesPage.detail.summary'),
  latestNote: t('preschoolGovernanceCasesPage.detail.latestNote'),
  eventsCount: t('preschoolGovernanceCasesPage.detail.eventsCount'),
  evidenceCount: t('preschoolGovernanceCasesPage.detail.evidenceCount'),
  timelineCount: t('preschoolGovernanceCasesPage.detail.timelineCount'),
  createdAt: t('preschoolGovernanceCasesPage.detail.createdAt'),
  resolutionTimeline: t('preschoolGovernanceCasesPage.detail.resolutionTimeline'),
  resolvedAt: t('preschoolGovernanceCasesPage.detail.resolvedAt'),
  closedAt: t('preschoolGovernanceCasesPage.detail.closedAt'),
  sourceContext: t('preschoolGovernanceCasesPage.detail.sourceContext'),
  noSummary: t('preschoolGovernanceCasesPage.detail.noSummary'),
  noNotes: t('preschoolGovernanceCasesPage.detail.noNotes'),
  noSourceContext: t('preschoolGovernanceCasesPage.detail.noSourceContext'),
}))

const timelineLabels = computed(() => ({
  actor: t('preschoolGovernanceCasesPage.timeline.actor'),
  status: t('preschoolGovernanceCasesPage.timeline.status'),
  context: t('preschoolGovernanceCasesPage.timeline.context'),
  eventType: t('preschoolGovernanceCasesPage.timeline.eventType'),
  noDescription: t('preschoolGovernanceCasesPage.timeline.noDescription'),
  recordedAt: t('preschoolGovernanceCasesPage.timeline.recordedAt'),
}))

const evidenceLabels = computed(() => ({
  title: t('preschoolGovernanceCasesPage.evidence.title'),
  subtitle: t('preschoolGovernanceCasesPage.evidence.subtitle'),
  reference: t('preschoolGovernanceCasesPage.evidence.reference'),
  creator: t('preschoolGovernanceCasesPage.evidence.creator'),
  evidenceType: t('preschoolGovernanceCasesPage.evidence.evidenceType'),
  evidenceReference: t('preschoolGovernanceCasesPage.evidence.evidenceReference'),
  evidenceLabel: t('preschoolGovernanceCasesPage.evidence.evidenceLabel'),
  evidenceDescription: t('preschoolGovernanceCasesPage.evidence.evidenceDescription'),
  metadata: t('preschoolGovernanceCasesPage.evidence.metadata'),
  addEvidence: t('preschoolGovernanceCasesPage.evidence.addEvidence'),
  evidenceTypePlaceholder: t('preschoolGovernanceCasesPage.evidence.placeholders.evidenceType'),
  evidenceReferencePlaceholder: t('preschoolGovernanceCasesPage.evidence.placeholders.evidenceReference'),
  evidenceLabelPlaceholder: t('preschoolGovernanceCasesPage.evidence.placeholders.evidenceLabel'),
  evidenceDescriptionPlaceholder: t('preschoolGovernanceCasesPage.evidence.placeholders.evidenceDescription'),
  metadataPlaceholder: t('preschoolGovernanceCasesPage.evidence.placeholders.metadata'),
  noDescription: t('preschoolGovernanceCasesPage.evidence.noDescription'),
}))

const assignmentLabels = computed(() => ({
  title: t('preschoolGovernanceCasesPage.assignment.title'),
  subtitle: t('preschoolGovernanceCasesPage.assignment.subtitle'),
  owner: t('preschoolGovernanceCasesPage.assignment.owner'),
  reviewer: t('preschoolGovernanceCasesPage.assignment.reviewer'),
  escalationOfficer: t('preschoolGovernanceCasesPage.assignment.escalationOfficer'),
  status: t('preschoolGovernanceCasesPage.assignment.status'),
  dueDate: t('preschoolGovernanceCasesPage.assignment.dueDate'),
  note: t('preschoolGovernanceCasesPage.assignment.note'),
  notePlaceholder: t('preschoolGovernanceCasesPage.assignment.notePlaceholder'),
  save: t('preschoolGovernanceCasesPage.assignment.save'),
  currentOwner: t('preschoolGovernanceCasesPage.assignment.currentOwner'),
  escalate: t('preschoolGovernanceCasesPage.resolution.escalate'),
  escalationReason: t('preschoolGovernanceCasesPage.resolution.escalationReason'),
  escalationReasonPlaceholder: t('preschoolGovernanceCasesPage.resolution.escalationReasonPlaceholder'),
}))

const resolutionLabels = computed(() => ({
  title: t('preschoolGovernanceCasesPage.resolution.title'),
  subtitle: t('preschoolGovernanceCasesPage.resolution.subtitle'),
  resolutionNote: t('preschoolGovernanceCasesPage.resolution.resolutionNote'),
  resolutionNotePlaceholder: t('preschoolGovernanceCasesPage.resolution.resolutionNotePlaceholder'),
  closureNote: t('preschoolGovernanceCasesPage.resolution.closureNote'),
  closureNotePlaceholder: t('preschoolGovernanceCasesPage.resolution.closureNotePlaceholder'),
  reopenReason: t('preschoolGovernanceCasesPage.resolution.reopenReason'),
  reopenReasonPlaceholder: t('preschoolGovernanceCasesPage.resolution.reopenReasonPlaceholder'),
  escalationReason: t('preschoolGovernanceCasesPage.resolution.escalationReason'),
  escalationReasonPlaceholder: t('preschoolGovernanceCasesPage.resolution.escalationReasonPlaceholder'),
  resolve: t('preschoolGovernanceCasesPage.resolution.resolve'),
  close: t('preschoolGovernanceCasesPage.resolution.close'),
  reopen: t('preschoolGovernanceCasesPage.resolution.reopen'),
}))

const createLabels = computed(() => ({
  title: t('preschoolGovernanceCasesPage.create.title'),
  subtitle: t('preschoolGovernanceCasesPage.create.subtitle'),
  caseTitle: t('preschoolGovernanceCasesPage.create.caseTitle'),
  summary: t('preschoolGovernanceCasesPage.create.summary'),
  sourceType: t('preschoolGovernanceCasesPage.create.sourceType'),
  sourceReference: t('preschoolGovernanceCasesPage.create.sourceReference'),
  severity: t('preschoolGovernanceCasesPage.create.severity'),
  riskScore: t('preschoolGovernanceCasesPage.create.riskScore'),
  status: t('preschoolGovernanceCasesPage.create.status'),
  urgent: t('preschoolGovernanceCasesPage.create.urgent'),
  urgentReason: t('preschoolGovernanceCasesPage.create.urgentReason'),
  owner: t('preschoolGovernanceCasesPage.create.owner'),
  reviewer: t('preschoolGovernanceCasesPage.create.reviewer'),
  escalationOfficer: t('preschoolGovernanceCasesPage.create.escalationOfficer'),
  dueDate: t('preschoolGovernanceCasesPage.create.dueDate'),
  academicYear: t('preschoolGovernanceCasesPage.create.academicYear'),
  term: t('preschoolGovernanceCasesPage.create.term'),
  reportPeriod: t('preschoolGovernanceCasesPage.create.reportPeriod'),
  class: t('preschoolGovernanceCasesPage.create.class'),
  student: t('preschoolGovernanceCasesPage.create.student'),
  latestNote: t('preschoolGovernanceCasesPage.create.latestNote'),
  createCase: t('preschoolGovernanceCasesPage.create.createCase'),
  reset: t('preschoolGovernanceCasesPage.create.reset'),
  sourceContext: t('preschoolGovernanceCasesPage.create.sourceContext'),
  placeholders: {
    title: t('preschoolGovernanceCasesPage.create.placeholders.title'),
    sourceReference: t('preschoolGovernanceCasesPage.create.placeholders.sourceReference'),
    urgentReason: t('preschoolGovernanceCasesPage.create.placeholders.urgentReason'),
  },
}))

const filterLabels = computed(() => ({
  title: t('preschoolGovernanceCasesPage.filters.title'),
  subtitle: t('preschoolGovernanceCasesPage.filters.subtitle'),
  academicYear: t('preschoolGovernanceCasesPage.filters.academicYear'),
  term: t('preschoolGovernanceCasesPage.filters.term'),
  reportPeriod: t('preschoolGovernanceCasesPage.filters.reportPeriod'),
  class: t('preschoolGovernanceCasesPage.filters.class'),
  student: t('preschoolGovernanceCasesPage.filters.student'),
  owner: t('preschoolGovernanceCasesPage.filters.owner'),
  reviewer: t('preschoolGovernanceCasesPage.filters.reviewer'),
  escalationOfficer: t('preschoolGovernanceCasesPage.filters.escalationOfficer'),
  status: t('preschoolGovernanceCasesPage.filters.status'),
  severity: t('preschoolGovernanceCasesPage.filters.severity'),
  sourceType: t('preschoolGovernanceCasesPage.filters.sourceType'),
  sourceReference: t('preschoolGovernanceCasesPage.filters.sourceReference'),
  urgent: t('preschoolGovernanceCasesPage.filters.urgent'),
  dueFrom: t('preschoolGovernanceCasesPage.filters.dueFrom'),
  dueTo: t('preschoolGovernanceCasesPage.filters.dueTo'),
  createdFrom: t('preschoolGovernanceCasesPage.filters.createdFrom'),
  createdTo: t('preschoolGovernanceCasesPage.filters.createdTo'),
  updatedFrom: t('preschoolGovernanceCasesPage.filters.updatedFrom'),
  updatedTo: t('preschoolGovernanceCasesPage.filters.updatedTo'),
  search: t('preschoolGovernanceCasesPage.filters.search'),
  allAcademicYears: t('preschoolGovernanceCasesPage.filters.allAcademicYears'),
  allTerms: t('preschoolGovernanceCasesPage.filters.allTerms'),
  allReportPeriods: t('preschoolGovernanceCasesPage.filters.allReportPeriods'),
  allClasses: t('preschoolGovernanceCasesPage.filters.allClasses'),
  allStudents: t('preschoolGovernanceCasesPage.filters.allStudents'),
  allAssignees: t('preschoolGovernanceCasesPage.filters.allAssignees'),
  allStatuses: t('preschoolGovernanceCasesPage.filters.allStatuses'),
  allSeverities: t('preschoolGovernanceCasesPage.filters.allSeverities'),
  allSourceTypes: t('preschoolGovernanceCasesPage.filters.allSourceTypes'),
  allUrgentStates: t('preschoolGovernanceCasesPage.filters.allUrgentStates'),
  searchPlaceholder: t('preschoolGovernanceCasesPage.filters.searchPlaceholder'),
  sourceReferencePlaceholder: t('preschoolGovernanceCasesPage.filters.sourceReferencePlaceholder'),
}))

function sourceContextPayload(form = {}) {
  return {
    academicYearId: form.academicYearId || '',
    termId: form.termId || '',
    reportPeriodId: form.reportPeriodId || '',
    classId: form.classId || '',
    studentId: form.studentId || '',
  }
}

function normalizeNullableBoolean(value) {
  if (value === '' || value === null || typeof value === 'undefined') {
    return ''
  }

  return value === true || value === 'true' || value === 1 || value === '1'
}

function toNullableNumber(value) {
  if (value === '' || value === null || typeof value === 'undefined') {
    return null
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function normalizeAssigneeItem(item) {
  return {
    label: item.displayName || item.username || item.email || `#${item.id}`,
    value: item.id,
    raw: item,
  }
}

function parseMetadataText(text) {
  const value = String(text || '').trim()
  if (!value) {
    return {}
  }

  try {
    return JSON.parse(value)
  } catch {
    return { note: value }
  }
}

function buildListQuery() {
  return {
    page: 1,
    perPage: 20,
    academicYearId: filters.value.academicYearId,
    termId: filters.value.termId,
    reportPeriodId: filters.value.reportPeriodId,
    classId: filters.value.classId,
    studentId: filters.value.studentId,
    ownerUserId: filters.value.ownerUserId,
    reviewerUserId: filters.value.reviewerUserId,
    escalationOfficerUserId: filters.value.escalationOfficerUserId,
    status: filters.value.status,
    severity: filters.value.severity,
    sourceType: filters.value.sourceType,
    sourceReference: filters.value.sourceReference,
    isUrgent: filters.value.isUrgent,
    dueFrom: filters.value.dueFrom,
    dueTo: filters.value.dueTo,
    createdFrom: filters.value.createdFrom,
    createdTo: filters.value.createdTo,
    updatedFrom: filters.value.updatedFrom,
    updatedTo: filters.value.updatedTo,
    search: filters.value.search,
  }
}

async function loadLookupOptions() {
  assigneeLoading.value = true

  try {
    const [classesResponse, studentsResponse, reportPeriodsResponse, assigneesResponse] = await Promise.all([
      fetchPreschoolClasses({ page: 1, perPage: 100 }),
      fetchPreschoolStudents({ page: 1, perPage: 100 }),
      fetchReportPeriods(),
      fetchGovernanceCaseAssignees(),
    ])

    classOptions.value = (classesResponse.items || []).map((item) => ({
      label: item.name || item.code || `#${item.id}`,
      value: item.id,
      raw: item,
    }))

    studentOptions.value = (studentsResponse.items || []).map((item) => ({
      label: `${item.fullName || item.name}${(item.publicId || item.studentCode) ? ` (${item.publicId || item.studentCode})` : ''}`,
      value: item.id,
      raw: item,
    }))

    reportPeriodOptions.value = (reportPeriodsResponse || []).map((period) => ({
      label: `${period.label || period.periodLabel || period.period_label}${period.status ? ` (${period.status})` : ''}`,
      value: period.id,
      raw: period,
    }))

    assigneeOptions.value = (assigneesResponse.items || []).map(normalizeAssigneeItem)
  } catch {
    classOptions.value = []
    studentOptions.value = []
    reportPeriodOptions.value = []
    assigneeOptions.value = []
  } finally {
    assigneeLoading.value = false
  }
}

async function loadCases(selectFirst = false) {
  loading.value = true
  errorMessage.value = ''

  try {
    listPayload.value = await fetchGovernanceCases(buildListQuery())

    const firstItem = listPayload.value.items[0] || null
    const selectedExists = listPayload.value.items.some((item) => String(item.id) === String(selectedCaseId.value))

    if ((selectFirst || !selectedCaseId.value || !selectedExists) && firstItem) {
      await loadCaseDetail(firstItem.id)
    }
  } catch (error) {
    listPayload.value = {
      items: [],
      pagination: {},
      summary: {},
      options: {},
    }
    errorMessage.value = error?.message || t('preschoolGovernanceCasesPage.errors.loadCases')
  } finally {
    loading.value = false
  }
}

async function loadCaseDetail(caseId) {
  if (!caseId) {
    selectedCaseId.value = ''
    detailPayload.value = {
      record: null,
      events: [],
      evidence: [],
      timeline: [],
      summary: {},
      options: {},
    }
    return
  }

  detailLoading.value = true
  detailError.value = ''

  try {
    detailPayload.value = await fetchGovernanceCase(caseId)
    selectedCaseId.value = String(detailPayload.value.record?.id || caseId)

    assignmentForm.value = {
      ownerUserId: detailPayload.value.record?.owner?.id || '',
      reviewerUserId: detailPayload.value.record?.reviewer?.id || '',
      escalationOfficerUserId: detailPayload.value.record?.escalationOfficer?.id || '',
      status: detailPayload.value.record?.status || '',
      dueDate: detailPayload.value.record?.dueDate || '',
      note: detailPayload.value.record?.latestNote || '',
    }

    resolutionForm.value = {
      resolutionNote: detailPayload.value.record?.resolutionNote || '',
      closureNote: detailPayload.value.record?.latestNote || '',
      reopenReason: '',
      escalationReason: '',
    }

    evidenceForm.value = {
      evidenceType: 'manual_note',
      evidenceReference: '',
      evidenceLabel: '',
      evidenceDescription: '',
      metadataText: '',
    }
  } catch (error) {
    detailPayload.value = {
      record: null,
      events: [],
      evidence: [],
      timeline: [],
      summary: {},
      options: {},
    }
    detailError.value = error?.message || t('preschoolGovernanceCasesPage.errors.loadDetail')
  } finally {
    detailLoading.value = false
  }
}

function selectCase(record) {
  if (!record?.id) return
  return loadCaseDetail(record.id)
}

async function refreshAll() {
  await Promise.all([
    loadCases(Boolean(selectedCaseId.value)),
    loadLookupOptions(),
  ])
}

function resetFilters() {
  filters.value = {
    academicYearId: '',
    termId: '',
    reportPeriodId: '',
    classId: '',
    studentId: '',
    ownerUserId: '',
    reviewerUserId: '',
    escalationOfficerUserId: '',
    status: '',
    severity: '',
    sourceType: '',
    sourceReference: '',
    isUrgent: '',
    dueFrom: '',
    dueTo: '',
    createdFrom: '',
    createdTo: '',
    updatedFrom: '',
    updatedTo: '',
    search: '',
  }
  return loadCases(true)
}

async function submitCreateCase() {
  createLoading.value = true
  errorMessage.value = ''

  try {
    const payload = {
      title: createForm.value.title,
      summary: createForm.value.summary,
      source_type: createForm.value.sourceType,
      source_reference: createForm.value.sourceReference,
      source_context: sourceContextPayload(createForm.value),
      severity: createForm.value.severity,
      risk_score: toNullableNumber(createForm.value.riskScore) ?? 0,
      status: createForm.value.status,
      is_urgent: normalizeNullableBoolean(createForm.value.isUrgent),
      urgent_reason: createForm.value.urgentReason,
      owner_user_id: createForm.value.ownerUserId || null,
      reviewer_user_id: createForm.value.reviewerUserId || null,
      escalation_officer_user_id: createForm.value.escalationOfficerUserId || null,
      due_date: createForm.value.dueDate || null,
      academic_year_id: createForm.value.academicYearId || null,
      term_id: createForm.value.termId || null,
      report_period_id: createForm.value.reportPeriodId || null,
      class_id: createForm.value.classId || null,
      student_id: createForm.value.studentId || null,
      latest_note: createForm.value.latestNote,
      resolution_note: createForm.value.resolutionNote,
    }

    const response = await createGovernanceCase(payload)
    detailPayload.value = response
    selectedCaseId.value = String(response.record?.id || '')
    await loadCases(false)
    await loadCaseDetail(selectedCaseId.value)
  } catch (error) {
    errorMessage.value = error?.message || t('preschoolGovernanceCasesPage.errors.createCase')
  } finally {
    createLoading.value = false
  }
}

async function submitAssignment() {
  if (!selectedRecord.value?.id) return

  assignmentLoading.value = true
  errorMessage.value = ''

  try {
    const payload = {
      owner_user_id: assignmentForm.value.ownerUserId || null,
      reviewer_user_id: assignmentForm.value.reviewerUserId || null,
      escalation_officer_user_id: assignmentForm.value.escalationOfficerUserId || null,
      due_date: assignmentForm.value.dueDate || null,
      status: assignmentForm.value.status || null,
      note: assignmentForm.value.note || null,
    }

    detailPayload.value = await assignGovernanceCase(selectedRecord.value.id, payload)
    await loadCases(false)
  } catch (error) {
    errorMessage.value = error?.message || t('preschoolGovernanceCasesPage.errors.assignCase')
  } finally {
    assignmentLoading.value = false
  }
}

async function submitEvidence() {
  if (!selectedRecord.value?.id) return

  evidenceLoading.value = true
  errorMessage.value = ''

  try {
    const payload = {
      evidence_type: evidenceForm.value.evidenceType,
      evidence_reference: evidenceForm.value.evidenceReference || null,
      evidence_label: evidenceForm.value.evidenceLabel || null,
      evidence_description: evidenceForm.value.evidenceDescription || null,
      metadata: parseMetadataText(evidenceForm.value.metadataText),
    }

    detailPayload.value = await addGovernanceCaseEvidence(selectedRecord.value.id, payload)
    evidenceForm.value = {
      evidenceType: 'manual_note',
      evidenceReference: '',
      evidenceLabel: '',
      evidenceDescription: '',
      metadataText: '',
    }
    await loadCases(false)
  } catch (error) {
    errorMessage.value = error?.message || t('preschoolGovernanceCasesPage.errors.addEvidence')
  } finally {
    evidenceLoading.value = false
  }
}

async function submitResolution(action) {
  if (!selectedRecord.value?.id) return

  resolutionLoading.value = true
  errorMessage.value = ''

  try {
    if (action === 'resolve') {
      detailPayload.value = await resolveGovernanceCase(selectedRecord.value.id, {
        resolution_note: resolutionForm.value.resolutionNote,
      })
    } else if (action === 'close') {
      detailPayload.value = await closeGovernanceCase(selectedRecord.value.id, {
        note: resolutionForm.value.closureNote,
      })
    } else if (action === 'escalate') {
      detailPayload.value = await escalateGovernanceCase(selectedRecord.value.id, {
        reason: resolutionForm.value.escalationReason || resolutionForm.value.resolutionNote || '',
        escalation_officer_user_id: assignmentForm.value.escalationOfficerUserId || null,
        due_date: assignmentForm.value.dueDate || null,
      })
    } else if (action === 'reopen') {
      detailPayload.value = await reopenGovernanceCase(selectedRecord.value.id, {
        reason: resolutionForm.value.reopenReason,
      })
    }

    await loadCases(false)
  } catch (error) {
    errorMessage.value = error?.message || t('preschoolGovernanceCasesPage.errors.resolution')
  } finally {
    resolutionLoading.value = false
  }
}

function goToGovernanceReview() {
  router.push({ name: 'dashboard-preschool-admin-governance-review' })
}

function goToGovernanceDiffAnalysis() {
  router.push({ name: 'dashboard-preschool-admin-governance-diff' })
}

function goToReconstruction() {
  router.push({ name: 'dashboard-preschool-admin-reconstruction' })
}

function goToExportGovernance() {
  router.push({ name: 'dashboard-preschool-admin-export-governance' })
}

function goToSnapshotArchive() {
  router.push({ name: 'dashboard-preschool-admin-report-snapshots' })
}

onMounted(async () => {
  await loadAcademicLifecycle()
  await loadLookupOptions()
  await loadCases(true)
})
</script>

<template>
  <MainLayout>
    <section class="space-y-4">
      <HeaderSection
        :title="t('preschoolGovernanceCasesPage.title')"
        :subtitle="t('preschoolGovernanceCasesPage.subtitle')"
      />

      <div class="flex flex-wrap gap-2">
        <Button type="button" variant="ghost" size="md" rounded="xl" @click="goToGovernanceReview">
          {{ t('preschoolGovernanceCasesPage.actions.openGovernanceReview') }}
        </Button>
        <Button type="button" variant="ghost" size="md" rounded="xl" @click="goToGovernanceDiffAnalysis">
          {{ t('preschoolGovernanceCasesPage.actions.openGovernanceDiff') }}
        </Button>
        <Button type="button" variant="ghost" size="md" rounded="xl" @click="goToReconstruction">
          {{ t('preschoolGovernanceCasesPage.actions.openReconstruction') }}
        </Button>
        <Button type="button" variant="ghost" size="md" rounded="xl" @click="goToExportGovernance">
          {{ t('preschoolGovernanceCasesPage.actions.openExportGovernance') }}
        </Button>
        <Button type="button" variant="ghost" size="md" rounded="xl" @click="goToSnapshotArchive">
          {{ t('preschoolGovernanceCasesPage.actions.openSnapshotArchive') }}
        </Button>
        <Button type="button" variant="secondary" size="md" rounded="xl" :loading="loading || detailLoading || assigneeLoading" @click="refreshAll">
          {{ t('preschoolGovernanceCasesPage.actions.refresh') }}
        </Button>
      </div>

      <div v-if="errorMessage" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ errorMessage }}
      </div>
      <div v-if="detailError" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {{ detailError }}
      </div>

      <GovernanceCaseSummaryCards
        :summary="summaryCards"
        :title-map="{
          openCases: t('preschoolGovernanceCasesPage.summary.openCases'),
          underReviewCases: t('preschoolGovernanceCasesPage.summary.underReviewCases'),
          escalatedCases: t('preschoolGovernanceCasesPage.summary.escalatedCases'),
          criticalCases: t('preschoolGovernanceCasesPage.summary.criticalCases'),
          overdueCases: t('preschoolGovernanceCasesPage.summary.overdueCases'),
          resolvedCases: t('preschoolGovernanceCasesPage.summary.resolvedCases'),
        }"
      />

      <div class="grid gap-4 xl:grid-cols-[1fr_1.1fr]">
        <div class="space-y-4">
          <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div class="space-y-1">
              <h3 class="text-sm font-semibold text-slate-900">{{ t('preschoolGovernanceCasesPage.create.title') }}</h3>
              <p class="text-sm text-slate-500">{{ t('preschoolGovernanceCasesPage.create.subtitle') }}</p>
            </div>

            <div class="mt-4 grid gap-3 md:grid-cols-2">
              <label class="space-y-2 text-sm md:col-span-2">
                <span class="font-medium text-slate-700">{{ createLabels.caseTitle }}</span>
                <InputText
                  v-model="createForm.title"
                  class="w-full"
                  :placeholder="createLabels.placeholders.title"
                />
              </label>

              <label class="space-y-2 text-sm md:col-span-2">
                <span class="font-medium text-slate-700">{{ createLabels.summary }}</span>
                <Textarea
                  v-model="createForm.summary"
                  class="w-full"
                  rows="3"
                  :auto-resize="true"
                  :placeholder="t('preschoolGovernanceCasesPage.create.placeholders.summary')"
                />
              </label>

              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ createLabels.sourceType }}</span>
                <Select v-model="createForm.sourceType" :options="sourceOptions" option-label="label" option-value="value" class="w-full" />
              </label>
              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ createLabels.sourceReference }}</span>
                <InputText v-model="createForm.sourceReference" class="w-full" :placeholder="createLabels.placeholders.sourceReference" />
              </label>

              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ createLabels.severity }}</span>
                <Select v-model="createForm.severity" :options="severityOptions" option-label="label" option-value="value" class="w-full" />
              </label>
              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ createLabels.riskScore }}</span>
                <InputText v-model="createForm.riskScore" type="number" min="0" max="100" class="w-full" />
              </label>

              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ createLabels.status }}</span>
                <Select v-model="createForm.status" :options="statusOptions" option-label="label" option-value="value" class="w-full" />
              </label>
              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ createLabels.urgent }}</span>
                <Select
                  v-model="createForm.isUrgent"
                  :options="[
                    { label: t('preschoolGovernanceCasesPage.boolean.true'), value: true },
                    { label: t('preschoolGovernanceCasesPage.boolean.false'), value: false },
                  ]"
                  option-label="label"
                  option-value="value"
                  class="w-full"
                />
              </label>

              <label class="space-y-2 text-sm md:col-span-2">
                <span class="font-medium text-slate-700">{{ createLabels.urgentReason }}</span>
                <Textarea
                  v-model="createForm.urgentReason"
                  class="w-full"
                  rows="2"
                  :auto-resize="true"
                  :placeholder="createLabels.placeholders.urgentReason"
                />
              </label>

              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ createLabels.academicYear }}</span>
                <Select v-model="createForm.academicYearId" :options="academicYearOptions" option-label="label" option-value="value" class="w-full" />
              </label>
              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ createLabels.term }}</span>
                <Select v-model="createForm.termId" :options="termOptions" option-label="label" option-value="value" class="w-full" />
              </label>

              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ createLabels.reportPeriod }}</span>
                <Select v-model="createForm.reportPeriodId" :options="reportPeriodOptionsList" option-label="label" option-value="value" class="w-full" />
              </label>
              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ createLabels.class }}</span>
                <Select v-model="createForm.classId" :options="classOptionsList" option-label="label" option-value="value" class="w-full" />
              </label>

              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ createLabels.student }}</span>
                <Select v-model="createForm.studentId" :options="studentOptionsList" option-label="label" option-value="value" class="w-full" />
              </label>
              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ createLabels.dueDate }}</span>
                <InputText v-model="createForm.dueDate" type="date" class="w-full" />
              </label>

              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ createLabels.owner }}</span>
                <Select v-model="createForm.ownerUserId" :options="assigneeSelectOptions" option-label="label" option-value="value" class="w-full" :loading="assigneeLoading" />
              </label>
              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ createLabels.reviewer }}</span>
                <Select v-model="createForm.reviewerUserId" :options="assigneeSelectOptions" option-label="label" option-value="value" class="w-full" :loading="assigneeLoading" />
              </label>

              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ createLabels.escalationOfficer }}</span>
                <Select v-model="createForm.escalationOfficerUserId" :options="assigneeSelectOptions" option-label="label" option-value="value" class="w-full" :loading="assigneeLoading" />
              </label>
              <label class="space-y-2 text-sm md:col-span-2">
                <span class="font-medium text-slate-700">{{ createLabels.latestNote }}</span>
                <Textarea
                  v-model="createForm.latestNote"
                  class="w-full"
                  rows="2"
                  :auto-resize="true"
                  :placeholder="t('preschoolGovernanceCasesPage.create.placeholders.latestNote')"
                />
              </label>
            </div>

            <div class="mt-4 flex flex-wrap items-center justify-end gap-2">
              <Button type="button" variant="secondary" size="md" rounded="xl" @click="resetFilters">
                {{ createLabels.reset }}
              </Button>
              <Button type="button" variant="primary" size="md" rounded="xl" :loading="createLoading" @click="submitCreateCase">
                {{ createLabels.createCase }}
              </Button>
            </div>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div class="space-y-1">
              <h3 class="text-sm font-semibold text-slate-900">{{ filterLabels.title }}</h3>
              <p class="text-sm text-slate-500">{{ filterLabels.subtitle }}</p>
            </div>

            <div class="mt-4 grid gap-3 md:grid-cols-2">
              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ filterLabels.academicYear }}</span>
                <Select v-model="filters.academicYearId" :options="academicYearOptions" option-label="label" option-value="value" class="w-full" />
              </label>
              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ filterLabels.term }}</span>
                <Select v-model="filters.termId" :options="termOptions" option-label="label" option-value="value" class="w-full" />
              </label>

              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ filterLabels.reportPeriod }}</span>
                <Select v-model="filters.reportPeriodId" :options="reportPeriodOptionsList" option-label="label" option-value="value" class="w-full" />
              </label>
              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ filterLabels.class }}</span>
                <Select v-model="filters.classId" :options="classOptionsList" option-label="label" option-value="value" class="w-full" />
              </label>

              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ filterLabels.student }}</span>
                <Select v-model="filters.studentId" :options="studentOptionsList" option-label="label" option-value="value" class="w-full" />
              </label>
              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ filterLabels.owner }}</span>
                <Select v-model="filters.ownerUserId" :options="assigneeSelectOptions" option-label="label" option-value="value" class="w-full" :loading="assigneeLoading" />
              </label>

              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ filterLabels.reviewer }}</span>
                <Select v-model="filters.reviewerUserId" :options="assigneeSelectOptions" option-label="label" option-value="value" class="w-full" :loading="assigneeLoading" />
              </label>
              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ filterLabels.escalationOfficer }}</span>
                <Select v-model="filters.escalationOfficerUserId" :options="assigneeSelectOptions" option-label="label" option-value="value" class="w-full" :loading="assigneeLoading" />
              </label>

              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ filterLabels.status }}</span>
                <Select v-model="filters.status" :options="statusOptions" option-label="label" option-value="value" class="w-full" />
              </label>
              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ filterLabels.severity }}</span>
                <Select v-model="filters.severity" :options="severityOptions" option-label="label" option-value="value" class="w-full" />
              </label>

              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ filterLabels.sourceType }}</span>
                <Select v-model="filters.sourceType" :options="sourceOptions" option-label="label" option-value="value" class="w-full" />
              </label>
              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ filterLabels.sourceReference }}</span>
                <InputText v-model="filters.sourceReference" class="w-full" :placeholder="filterLabels.sourceReferencePlaceholder" />
              </label>

              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ filterLabels.urgent }}</span>
                <Select
                  v-model="filters.isUrgent"
                  :options="[
                    { label: filterLabels.allUrgentStates, value: '' },
                    { label: t('preschoolGovernanceCasesPage.boolean.true'), value: true },
                    { label: t('preschoolGovernanceCasesPage.boolean.false'), value: false },
                  ]"
                  option-label="label"
                  option-value="value"
                  class="w-full"
                />
              </label>
              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ filterLabels.search }}</span>
                <InputText v-model="filters.search" class="w-full" :placeholder="filterLabels.searchPlaceholder" />
              </label>

              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ filterLabels.dueFrom }}</span>
                <InputText v-model="filters.dueFrom" type="date" class="w-full" />
              </label>
              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ filterLabels.dueTo }}</span>
                <InputText v-model="filters.dueTo" type="date" class="w-full" />
              </label>

              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ filterLabels.createdFrom }}</span>
                <InputText v-model="filters.createdFrom" type="date" class="w-full" />
              </label>
              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ filterLabels.createdTo }}</span>
                <InputText v-model="filters.createdTo" type="date" class="w-full" />
              </label>

              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ filterLabels.updatedFrom }}</span>
                <InputText v-model="filters.updatedFrom" type="date" class="w-full" />
              </label>
              <label class="space-y-2 text-sm">
                <span class="font-medium text-slate-700">{{ filterLabels.updatedTo }}</span>
                <InputText v-model="filters.updatedTo" type="date" class="w-full" />
              </label>
            </div>

            <div class="mt-4 flex flex-wrap items-center justify-end gap-2">
              <Button type="button" variant="secondary" size="md" rounded="xl" @click="resetFilters">
                {{ t('preschoolGovernanceCasesPage.actions.clearFilters') }}
              </Button>
              <Button type="button" variant="primary" size="md" rounded="xl" :loading="loading" @click="loadCases(true)">
                {{ t('preschoolGovernanceCasesPage.actions.applyFilters') }}
              </Button>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold text-slate-900">{{ t('preschoolGovernanceCasesPage.table.title') }}</h3>
              <p class="text-xs text-slate-500">{{ listPayload.pagination?.total ?? 0 }} {{ t('preschoolGovernanceCasesPage.table.records') }}</p>
            </div>
            <GovernanceCaseTable
              :items="listPayload.items"
              :selected-case-id="selectedCaseId"
              :columns="caseTableColumns"
              :empty-label="t('preschoolGovernanceCasesPage.table.empty')"
              :source-label-map="sourceLabelMap"
              :status-label-map="statusLabelMap"
              :severity-label-map="severityLabelMap"
              @select-case="selectCase"
            />
          </div>
        </div>

        <div class="space-y-4">
          <GovernanceCaseDetailPanel
            :record="selectedRecord || {}"
            :detail="detailPayload"
            :labels="detailLabels"
            :source-label-map="sourceLabelMap"
            :status-label-map="statusLabelMap"
            :severity-label-map="severityLabelMap"
          />

          <GovernanceCaseAssignmentPanel
            v-model="assignmentForm"
            :record="selectedRecord || {}"
            :assignee-options="assigneeSelectOptions"
            :status-options="workflowStatusOptions"
            :labels="assignmentLabels"
            :loading="assignmentLoading"
            :disabled="!selectedRecord"
            @assign="submitAssignment"
          />

          <GovernanceCaseEvidenceList
            v-model="evidenceForm"
            :items="detailPayload.evidence"
            :labels="evidenceLabels"
            :loading="evidenceLoading"
            :disabled="!selectedRecord"
            :empty-label="t('preschoolGovernanceCasesPage.evidence.empty')"
            @add-evidence="submitEvidence"
          />

          <GovernanceCaseResolutionPanel
            v-model="resolutionForm"
            :record="selectedRecord || {}"
            :labels="resolutionLabels"
            :loading="resolutionLoading"
            :disabled="!selectedRecord"
            @escalate="submitResolution('escalate')"
            @resolve="submitResolution('resolve')"
            @close="submitResolution('close')"
            @reopen="submitResolution('reopen')"
          />

          <GovernanceCaseTimeline
            :title="t('preschoolGovernanceCasesPage.timeline.title')"
            :subtitle="t('preschoolGovernanceCasesPage.timeline.subtitle')"
            :items="detailPayload.timeline"
            :labels="timelineLabels"
            :empty-label="t('preschoolGovernanceCasesPage.timeline.empty')"
          />
        </div>
      </div>
    </section>
  </MainLayout>
</template>

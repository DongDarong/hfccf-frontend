<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import Textarea from 'primevue/textarea'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import Pagination from '@/components/data-display/Pagination.vue'
import StatsCards from '@/components/data-display/StatsCards.vue'
import StatusBadge from '@/components/badges/StatusBadge.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getApiErrorMessage } from '@/services/api'
import { fetchCoachTeams } from '@/modules/sport/services/api/sportCoachTeamsApi'
import {
  approveSportEquipmentRequest,
  createCoachEquipmentRequest,
  createSportEquipmentItem,
  fetchCoachEquipmentItems,
  fetchCoachEquipmentRequests,
  fetchSportEquipmentItems,
  fetchSportEquipmentRequests,
  issueSportEquipmentRequest,
  rejectSportEquipmentRequest,
  returnSportEquipmentRequest,
  updateSportEquipmentItem,
} from '@/modules/sport/services/sportApi'

defineOptions({
  name: 'SportEquipmentManagementPage',
})

const route = useRoute()
const toast = useToast()
const { t, language } = useLanguage()

const isCoachRoute = computed(() => route.name === 'dashboard-sport-coach-equipment')
const isAdminRoute = computed(() => route.name === 'dashboard-sport-admin-equipment')
const isKh = computed(() => language.value === 'KH')

const tabs = computed(() => (isCoachRoute.value
  ? [
      { id: 'available', label: t('sportEquipment.tabs.available') },
      { id: 'my-requests', label: t('sportEquipment.tabs.myRequests') },
    ]
  : [
      { id: 'inventory', label: t('sportEquipment.tabs.inventory') },
      { id: 'requests', label: t('sportEquipment.tabs.requests') },
    ]))

const pageTitle = computed(() => (isCoachRoute.value ? t('sportEquipment.titles.coach') : t('sportEquipment.titles.admin')))
const pageSubtitle = computed(() => (isCoachRoute.value ? t('sportEquipment.subtitles.coach') : t('sportEquipment.subtitles.admin')))

function createPagination() {
  return {
    page: 1,
    perPage: 10,
    total: 0,
    totalPages: 1,
  }
}

function createEquipmentForm() {
  return {
    equipmentCode: '',
    name: '',
    category: '',
    description: '',
    unit: '',
    totalQuantity: 0,
    availableQuantity: 0,
    minimumStockLevel: 0,
    storageLocation: '',
    status: 'active',
  }
}

function createCoachRequestForm() {
  return {
    equipmentItemId: '',
    teamId: '',
    requestedQuantity: 1,
    purpose: '',
    requiredDate: '',
    expectedReturnDate: '',
  }
}

function createRequestActionForm() {
  return {
    approvedQuantity: 1,
    issuedQuantity: 1,
    returnedQuantity: 0,
    damagedQuantity: 0,
    missingQuantity: 0,
    adminNote: '',
    rejectionReason: '',
  }
}

const equipmentItems = ref([])
const equipmentSummary = ref({})
const equipmentPagination = ref(createPagination())
const equipmentLoading = ref(false)
const equipmentError = ref('')
const equipmentSearch = ref('')
const equipmentCategory = ref('')
const equipmentStatusFilter = ref('')
const equipmentStockFilter = ref('')
const equipmentPage = ref(1)

const equipmentRequests = ref([])
const equipmentRequestSummary = ref({})
const equipmentRequestPagination = ref(createPagination())
const equipmentRequestLoading = ref(false)
const equipmentRequestError = ref('')
const equipmentRequestSearch = ref('')
const equipmentRequestStatusFilter = ref('')
const equipmentRequestPage = ref(1)

const coachItems = ref([])
const coachItemSummary = ref({})
const coachItemPagination = ref(createPagination())
const coachItemLoading = ref(false)
const coachItemError = ref('')
const coachItemSearch = ref('')
const coachItemCategory = ref('')
const coachItemStockFilter = ref('')
const coachItemPage = ref(1)

const coachRequests = ref([])
const coachRequestSummary = ref({})
const coachRequestPagination = ref(createPagination())
const coachRequestLoading = ref(false)
const coachRequestError = ref('')
const coachRequestSearch = ref('')
const coachRequestStatusFilter = ref('')
const coachRequestPage = ref(1)

const coachTeams = ref([])
const coachTeamsLoading = ref(false)
const coachTeamsError = ref('')

const activeTab = ref(isCoachRoute.value ? 'available' : 'inventory')

const equipmentDialogVisible = ref(false)
const equipmentDialogMode = ref('create')
const equipmentSaving = ref(false)
const equipmentDialogError = ref('')
const selectedEquipment = ref(null)
const equipmentForm = reactive(createEquipmentForm())

const coachRequestDialogVisible = ref(false)
const coachRequestSaving = ref(false)
const coachRequestDialogError = ref('')
const selectedCoachEquipment = ref(null)
const coachRequestForm = reactive(createCoachRequestForm())

const requestActionDialogVisible = ref(false)
const requestActionMode = ref('approve')
const requestActionSaving = ref(false)
const requestActionDialogError = ref('')
const selectedRequest = ref(null)
const requestActionForm = reactive(createRequestActionForm())

const currentTableError = computed(() => {
  if (isCoachRoute.value) {
    return activeTab.value === 'available' ? coachItemError.value : coachRequestError.value
  }

  return activeTab.value === 'inventory' ? equipmentError.value : equipmentRequestError.value
})

const currentTableLoading = computed(() => {
  if (isCoachRoute.value) {
    return activeTab.value === 'available' ? coachItemLoading.value : coachRequestLoading.value
  }

  return activeTab.value === 'inventory' ? equipmentLoading.value : equipmentRequestLoading.value
})

const currentSummary = computed(() => {
  if (isCoachRoute.value) {
    return activeTab.value === 'available' ? coachItemSummary.value : coachRequestSummary.value
  }

  return activeTab.value === 'inventory' ? equipmentSummary.value : equipmentRequestSummary.value
})

const currentSummaryCards = computed(() => {
  if (isCoachRoute.value && activeTab.value === 'available') {
    return [
      { id: 'active', title: t('sportEquipment.summary.activeItems'), value: currentSummary.value.totalActiveItems ?? 0, label: t('sportEquipment.summary.activeItems'), status: 'info' },
      { id: 'available', title: t('sportEquipment.summary.availableItems'), value: currentSummary.value.availableItems ?? 0, label: t('sportEquipment.summary.availableItems'), status: 'success' },
      { id: 'low-stock', title: t('sportEquipment.summary.lowStockItems'), value: currentSummary.value.lowStockItems ?? 0, label: t('sportEquipment.summary.lowStockItems'), status: 'warning' },
      { id: 'out-of-stock', title: t('sportEquipment.summary.outOfStockItems'), value: currentSummary.value.outOfStockItems ?? 0, label: t('sportEquipment.summary.outOfStockItems'), status: 'error' },
    ]
  }

  if (isCoachRoute.value) {
    return [
      { id: 'requests', title: t('sportEquipment.summary.totalRequests'), value: currentSummary.value.totalRequests ?? 0, label: t('sportEquipment.summary.totalRequests'), status: 'info' },
      { id: 'pending', title: t('sportEquipment.summary.pendingRequests'), value: currentSummary.value.pendingRequests ?? 0, label: t('sportEquipment.summary.pendingRequests'), status: 'warning' },
      { id: 'approved', title: t('sportEquipment.summary.approvedRequests'), value: currentSummary.value.approvedRequests ?? 0, label: t('sportEquipment.summary.approvedRequests'), status: 'success' },
      { id: 'issued', title: t('sportEquipment.summary.issuedRequests'), value: currentSummary.value.issuedRequests ?? 0, label: t('sportEquipment.summary.issuedRequests'), status: 'info' },
    ]
  }

  if (activeTab.value === 'inventory') {
    return [
      { id: 'active', title: t('sportEquipment.summary.activeItems'), value: currentSummary.value.totalActiveItems ?? 0, label: t('sportEquipment.summary.activeItems'), status: 'info' },
      { id: 'available', title: t('sportEquipment.summary.availableItems'), value: currentSummary.value.availableItems ?? 0, label: t('sportEquipment.summary.availableItems'), status: 'success' },
      { id: 'low-stock', title: t('sportEquipment.summary.lowStockItems'), value: currentSummary.value.lowStockItems ?? 0, label: t('sportEquipment.summary.lowStockItems'), status: 'warning' },
      { id: 'out-of-stock', title: t('sportEquipment.summary.outOfStockItems'), value: currentSummary.value.outOfStockItems ?? 0, label: t('sportEquipment.summary.outOfStockItems'), status: 'error' },
    ]
  }

  return [
    { id: 'requests', title: t('sportEquipment.summary.totalRequests'), value: currentSummary.value.totalRequests ?? 0, label: t('sportEquipment.summary.totalRequests'), status: 'info' },
    { id: 'pending', title: t('sportEquipment.summary.pendingRequests'), value: currentSummary.value.pendingRequests ?? 0, label: t('sportEquipment.summary.pendingRequests'), status: 'warning' },
    { id: 'approved', title: t('sportEquipment.summary.approvedRequests'), value: currentSummary.value.approvedRequests ?? 0, label: t('sportEquipment.summary.approvedRequests'), status: 'success' },
    { id: 'returned', title: t('sportEquipment.summary.returnedRequests'), value: currentSummary.value.returnedRequests ?? 0, label: t('sportEquipment.summary.returnedRequests'), status: 'success' },
  ]
})

const itemStatusOptions = computed(() => [
  { label: t('common.all'), value: '' },
  { label: t('sportEquipment.statuses.active'), value: 'active' },
  { label: t('sportEquipment.statuses.inactive'), value: 'inactive' },
])

const stockOptions = computed(() => [
  { label: t('common.all'), value: '' },
  { label: t('sportEquipment.statuses.lowStock'), value: 'low' },
  { label: t('sportEquipment.statuses.outOfStock'), value: 'out' },
  { label: t('sportEquipment.statuses.active'), value: 'available' },
])

const requestStatusOptions = computed(() => [
  { label: t('common.all'), value: '' },
  { label: t('sportEquipment.statuses.pending'), value: 'pending' },
  { label: t('sportEquipment.statuses.approved'), value: 'approved' },
  { label: t('sportEquipment.statuses.issued'), value: 'issued' },
  { label: t('sportEquipment.statuses.returned'), value: 'returned' },
  { label: t('sportEquipment.statuses.rejected'), value: 'rejected' },
])

const coachTeamOptions = computed(() => coachTeams.value.map((team) => ({
  label: team.name || team.shortName || team.teamCode || `Team ${team.id}`,
  value: String(team.id),
})))

const equipmentCategoryOptions = computed(() => {
  const source = isCoachRoute.value ? coachItems.value : equipmentItems.value
  const categories = Array.from(new Set(source.map((item) => String(item.category || '').trim()).filter(Boolean)))

  return [
    { label: t('common.all'), value: '' },
    ...categories.map((category) => ({ label: category, value: category })),
  ]
})

const coachCategoryOptions = computed(() => {
  const categories = Array.from(new Set(coachItems.value.map((item) => String(item.category || '').trim()).filter(Boolean)))

  return [
    { label: t('common.all'), value: '' },
    ...categories.map((category) => ({ label: category, value: category })),
  ]
})

function statusTone(status) {
  const value = String(status || '').toLowerCase()

  if (['active', 'approved', 'issued', 'returned', 'available'].includes(value)) return 'success'
  if (['pending', 'low', 'watch'].includes(value)) return 'warning'
  if (['rejected', 'inactive', 'out', 'out_of_stock'].includes(value)) return 'danger'
  return 'info'
}

function resolveItemState(item = {}) {
  if (String(item.status || '').toLowerCase() !== 'active') {
    return { tone: 'danger', label: t('sportEquipment.statuses.inactive') }
  }

  if (item.isOutOfStock) {
    return { tone: 'danger', label: t('sportEquipment.statuses.outOfStock') }
  }

  if (item.isLowStock) {
    return { tone: 'warning', label: t('sportEquipment.statuses.lowStock') }
  }

  return { tone: 'success', label: t('sportEquipment.statuses.active') }
}

function formatDate(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  return new Intl.DateTimeFormat(isKh.value ? 'km-KH' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function resetReactive(target, source) {
  Object.keys(target).forEach((key) => {
    delete target[key]
  })

  Object.assign(target, source)
}

function openEquipmentDialog(mode, item = null) {
  selectedEquipment.value = item
  equipmentDialogMode.value = mode
  equipmentDialogError.value = ''
  resetReactive(equipmentForm, createEquipmentForm())

  if (item) {
    resetReactive(equipmentForm, {
      equipmentCode: item.equipmentCode || '',
      name: item.name || '',
      category: item.category || '',
      description: item.description || '',
      unit: item.unit || '',
      totalQuantity: Number(item.totalQuantity ?? 0),
      availableQuantity: Number(item.availableQuantity ?? 0),
      minimumStockLevel: Number(item.minimumStockLevel ?? 0),
      storageLocation: item.storageLocation || '',
      status: item.status || 'active',
    })
  }

  equipmentDialogVisible.value = true
}

function openCoachRequestDialog(item) {
  selectedCoachEquipment.value = item
  coachRequestDialogError.value = ''
  resetReactive(coachRequestForm, createCoachRequestForm())
  coachRequestForm.equipmentItemId = String(item.id)

  if (coachTeamOptions.value.length === 1) {
    coachRequestForm.teamId = coachTeamOptions.value[0].value
  } else {
    coachRequestForm.teamId = ''
  }

  coachRequestDialogVisible.value = true
}

function openRequestActionDialog(mode, request) {
  selectedRequest.value = request
  requestActionMode.value = mode
  requestActionDialogError.value = ''
  resetReactive(requestActionForm, createRequestActionForm())

  if (mode === 'approve') {
    requestActionForm.approvedQuantity = Number(request.requestedQuantity ?? 1)
  } else if (mode === 'issue') {
    requestActionForm.issuedQuantity = Number(request.approvedQuantity ?? request.requestedQuantity ?? 1)
  } else if (mode === 'return') {
    requestActionForm.returnedQuantity = Number(request.issuedQuantity ?? 0)
    requestActionForm.damagedQuantity = 0
    requestActionForm.missingQuantity = 0
  }

  requestActionDialogVisible.value = true
}

function closeEquipmentDialog() {
  equipmentDialogVisible.value = false
  selectedEquipment.value = null
}

function closeCoachRequestDialog() {
  coachRequestDialogVisible.value = false
  selectedCoachEquipment.value = null
}

function closeRequestActionDialog() {
  requestActionDialogVisible.value = false
  selectedRequest.value = null
}

async function loadCoachTeams() {
  if (!isCoachRoute.value) return

  coachTeamsLoading.value = true
  coachTeamsError.value = ''

  try {
    const response = await fetchCoachTeams({ page: 1, perPage: 100, status: 'active' })
    coachTeams.value = response.items || []
    if (coachTeams.value.length === 1 && !coachRequestForm.teamId) {
      coachRequestForm.teamId = String(coachTeams.value[0].id)
    }
  } catch (error) {
    coachTeams.value = []
    coachTeamsError.value = getApiErrorMessage(error, t('sportEquipment.messages.loadFailed'))
  } finally {
    coachTeamsLoading.value = false
  }
}

async function loadInventory() {
  equipmentLoading.value = true
  equipmentError.value = ''

  try {
    const response = await fetchSportEquipmentItems({
      page: equipmentPage.value,
      perPage: equipmentPagination.value.perPage,
      search: equipmentSearch.value,
      category: equipmentCategory.value,
      status: equipmentStatusFilter.value,
      stock: equipmentStockFilter.value,
    })

    equipmentItems.value = response.items || []
    equipmentPagination.value = response.pagination || createPagination()
    equipmentSummary.value = response.summary || {}
  } catch (error) {
    equipmentItems.value = []
    equipmentPagination.value = createPagination()
    equipmentSummary.value = {}
    equipmentError.value = getApiErrorMessage(error, t('sportEquipment.messages.loadFailed'))
  } finally {
    equipmentLoading.value = false
  }
}

async function loadEquipmentRequests() {
  equipmentRequestLoading.value = true
  equipmentRequestError.value = ''

  try {
    const response = await fetchSportEquipmentRequests({
      page: equipmentRequestPage.value,
      perPage: equipmentRequestPagination.value.perPage,
      search: equipmentRequestSearch.value,
      status: equipmentRequestStatusFilter.value,
    })

    equipmentRequests.value = response.items || []
    equipmentRequestPagination.value = response.pagination || createPagination()
    equipmentRequestSummary.value = response.summary || {}
  } catch (error) {
    equipmentRequests.value = []
    equipmentRequestPagination.value = createPagination()
    equipmentRequestSummary.value = {}
    equipmentRequestError.value = getApiErrorMessage(error, t('sportEquipment.messages.loadFailed'))
  } finally {
    equipmentRequestLoading.value = false
  }
}

async function loadCoachEquipment() {
  coachItemLoading.value = true
  coachItemError.value = ''

  try {
    const response = await fetchCoachEquipmentItems({
      page: coachItemPage.value,
      perPage: coachItemPagination.value.perPage,
      search: coachItemSearch.value,
      category: coachItemCategory.value,
      stock: coachItemStockFilter.value,
    })

    coachItems.value = response.items || []
    coachItemPagination.value = response.pagination || createPagination()
    coachItemSummary.value = response.summary || {}
  } catch (error) {
    coachItems.value = []
    coachItemPagination.value = createPagination()
    coachItemSummary.value = {}
    coachItemError.value = getApiErrorMessage(error, t('sportEquipment.messages.loadFailed'))
  } finally {
    coachItemLoading.value = false
  }
}

async function loadCoachRequests() {
  coachRequestLoading.value = true
  coachRequestError.value = ''

  try {
    const response = await fetchCoachEquipmentRequests({
      page: coachRequestPage.value,
      perPage: coachRequestPagination.value.perPage,
      search: coachRequestSearch.value,
      status: coachRequestStatusFilter.value,
    })

    coachRequests.value = response.items || []
    coachRequestPagination.value = response.pagination || createPagination()
    coachRequestSummary.value = response.summary || {}
  } catch (error) {
    coachRequests.value = []
    coachRequestPagination.value = createPagination()
    coachRequestSummary.value = {}
    coachRequestError.value = getApiErrorMessage(error, t('sportEquipment.messages.loadFailed'))
  } finally {
    coachRequestLoading.value = false
  }
}

async function loadCurrentTab() {
  if (isCoachRoute.value) {
    if (activeTab.value === 'available') {
      await loadCoachEquipment()
      return
    }

    await loadCoachRequests()
    return
  }

  if (activeTab.value === 'inventory') {
    await loadInventory()
    return
  }

  await loadEquipmentRequests()
}

async function initializePage() {
  activeTab.value = isCoachRoute.value ? 'available' : 'inventory'
  equipmentPage.value = 1
  equipmentRequestPage.value = 1
  coachItemPage.value = 1
  coachRequestPage.value = 1

  if (isCoachRoute.value) {
    await loadCoachTeams()
  }

  await loadCurrentTab()
}

function switchTab(tabId) {
  if (activeTab.value === tabId) return
  activeTab.value = tabId
  void loadCurrentTab()
}

async function saveEquipment() {
  equipmentSaving.value = true
  equipmentDialogError.value = ''

  try {
    const payload = {
      equipmentCode: equipmentForm.equipmentCode || undefined,
      name: equipmentForm.name,
      category: equipmentForm.category,
      description: equipmentForm.description || undefined,
      unit: equipmentForm.unit,
      totalQuantity: Number(equipmentForm.totalQuantity || 0),
      availableQuantity: Number(equipmentForm.availableQuantity || 0),
      minimumStockLevel: Number(equipmentForm.minimumStockLevel || 0),
      storageLocation: equipmentForm.storageLocation || undefined,
      status: equipmentForm.status,
    }

    if (equipmentDialogMode.value === 'create') {
      await createSportEquipmentItem(payload)
      toast.add({ severity: 'success', summary: t('sportEquipment.messages.saved'), life: 3000 })
    } else if (selectedEquipment.value) {
      await updateSportEquipmentItem(selectedEquipment.value.id, payload)
      toast.add({ severity: 'success', summary: t('sportEquipment.messages.saved'), life: 3000 })
    }

    closeEquipmentDialog()
    await loadInventory()
  } catch (error) {
    equipmentDialogError.value = getApiErrorMessage(error, t('sportEquipment.messages.saveFailed'))
  } finally {
    equipmentSaving.value = false
  }
}

async function toggleEquipmentStatus(item) {
  try {
    await updateSportEquipmentItem(item.id, {
      status: String(item.status || '').toLowerCase() === 'active' ? 'inactive' : 'active',
    })
    toast.add({ severity: 'success', summary: t('sportEquipment.messages.saved'), life: 2500 })
    await loadInventory()
  } catch (error) {
    equipmentError.value = getApiErrorMessage(error, t('sportEquipment.messages.saveFailed'))
  }
}

async function saveCoachRequest() {
  coachRequestSaving.value = true
  coachRequestDialogError.value = ''

  try {
    await createCoachEquipmentRequest({
      equipmentItemId: coachRequestForm.equipmentItemId,
      teamId: coachRequestForm.teamId,
      requestedQuantity: Number(coachRequestForm.requestedQuantity || 0),
      purpose: coachRequestForm.purpose,
      requiredDate: coachRequestForm.requiredDate,
      expectedReturnDate: coachRequestForm.expectedReturnDate,
    })

    toast.add({ severity: 'success', summary: t('sportEquipment.messages.requestSubmitted'), life: 3000 })
    closeCoachRequestDialog()
    await loadCoachRequests()
  } catch (error) {
    coachRequestDialogError.value = getApiErrorMessage(error, t('sportEquipment.messages.requestFailed'))
  } finally {
    coachRequestSaving.value = false
  }
}

async function saveRequestAction() {
  requestActionSaving.value = true
  requestActionDialogError.value = ''

  try {
    const requestId = selectedRequest.value?.id
    if (!requestId) return

    if (requestActionMode.value === 'approve') {
      await approveSportEquipmentRequest(requestId, {
        approvedQuantity: Number(requestActionForm.approvedQuantity || 0),
        adminNote: requestActionForm.adminNote || undefined,
      })
      toast.add({ severity: 'success', summary: t('sportEquipment.messages.approved'), life: 3000 })
    } else if (requestActionMode.value === 'reject') {
      await rejectSportEquipmentRequest(requestId, {
        rejectedReason: requestActionForm.rejectionReason,
        adminNote: requestActionForm.adminNote || undefined,
      })
      toast.add({ severity: 'success', summary: t('sportEquipment.messages.rejected'), life: 3000 })
    } else if (requestActionMode.value === 'issue') {
      await issueSportEquipmentRequest(requestId, {
        issuedQuantity: Number(requestActionForm.issuedQuantity || 0),
        adminNote: requestActionForm.adminNote || undefined,
      })
      toast.add({ severity: 'success', summary: t('sportEquipment.messages.issued'), life: 3000 })
    } else if (requestActionMode.value === 'return') {
      await returnSportEquipmentRequest(requestId, {
        returnedQuantity: Number(requestActionForm.returnedQuantity || 0),
        damagedQuantity: Number(requestActionForm.damagedQuantity || 0),
        missingQuantity: Number(requestActionForm.missingQuantity || 0),
        adminNote: requestActionForm.adminNote || undefined,
      })
      toast.add({ severity: 'success', summary: t('sportEquipment.messages.returned'), life: 3000 })
    }

    closeRequestActionDialog()
    await loadEquipmentRequests()
  } catch (error) {
    requestActionDialogError.value = getApiErrorMessage(error, t('sportEquipment.messages.loadFailed'))
  } finally {
    requestActionSaving.value = false
  }
}

function equipmentRowNumber(index) {
  return (equipmentPagination.value.page - 1) * equipmentPagination.value.perPage + index + 1
}

function requestRowNumber(index) {
  return (equipmentRequestPagination.value.page - 1) * equipmentRequestPagination.value.perPage + index + 1
}

function coachEquipmentRowNumber(index) {
  return (coachItemPagination.value.page - 1) * coachItemPagination.value.perPage + index + 1
}

function coachRequestRowNumber(index) {
  return (coachRequestPagination.value.page - 1) * coachRequestPagination.value.perPage + index + 1
}

watch(
  () => route.name,
  () => {
    void initializePage()
  },
  { immediate: true },
)
</script>

<template>
  <MainLayout>
    <Toast />
    <section :class="['sport-equipment-page', { 'sport-equipment-page--kh': isKh }]">
      <HeaderSection :title="pageTitle" :subtitle="pageSubtitle" />

      <div class="sport-equipment-page__tabs">
        <Button
          v-for="tab in tabs"
          :key="tab.id"
          :label="tab.label"
          :text="activeTab !== tab.id"
          :severity="activeTab === tab.id ? 'primary' : 'secondary'"
          :active="activeTab === tab.id"
          @click="switchTab(tab.id)"
        />
      </div>

      <p
        v-if="isCoachRoute && !coachTeamsLoading && !coachTeams.length"
        class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
      >
        {{ t('sportEquipment.messages.noAssignedTeams') }}
      </p>

      <p
        v-if="currentTableError"
        class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ currentTableError }}
      </p>

      <StatsCards
        :cards="currentSummaryCards"
        :loading="currentTableLoading"
        :error="currentTableError"
      />

      <Card v-if="isAdminRoute && activeTab === 'inventory'" class="sport-equipment-card">
        <template #title>{{ t('sportEquipment.tabs.inventory') }}</template>
        <template #content>
          <div class="sport-equipment-page__filters">
            <InputText v-model="equipmentSearch" :placeholder="t('sportEquipment.fields.name')" class="sport-equipment-page__field" />
            <Dropdown v-model="equipmentCategory" :options="equipmentCategoryOptions" option-label="label" option-value="value" :placeholder="t('sportEquipment.fields.category')" class="sport-equipment-page__field" />
            <Dropdown v-model="equipmentStatusFilter" :options="itemStatusOptions" option-label="label" option-value="value" :placeholder="t('sportEquipment.fields.status')" class="sport-equipment-page__field" />
            <Dropdown v-model="equipmentStockFilter" :options="stockOptions" option-label="label" option-value="value" :placeholder="t('sportEquipment.statuses.lowStock')" class="sport-equipment-page__field" />
            <Button :label="t('sportEquipment.buttons.search')" @click="loadInventory" />
            <Button :label="t('sportEquipment.buttons.addEquipment')" @click="openEquipmentDialog('create')" />
          </div>

          <div v-if="!equipmentLoading && !equipmentItems.length" class="sport-equipment-page__empty">
            {{ t('sportEquipment.messages.noEquipment') }}
          </div>

          <DataTable v-else :value="equipmentItems" data-key="id" striped-rows :loading="equipmentLoading">
            <Column :header="t('common.table.number')" style="width: 4rem;">
              <template #body="{ index }">
                {{ equipmentRowNumber(index) }}
              </template>
            </Column>
            <Column :header="t('sportEquipment.fields.name')">
              <template #body="{ data }">
                <div class="font-medium text-slate-900">{{ data.name }}</div>
                <div class="text-xs text-slate-500">{{ data.equipmentCode }}</div>
              </template>
            </Column>
            <Column :header="t('sportEquipment.fields.category')" field="category" />
            <Column :header="t('sportEquipment.fields.totalQuantity')" field="totalQuantity" />
            <Column :header="t('sportEquipment.fields.availableQuantity')" field="availableQuantity" />
            <Column :header="t('sportEquipment.fields.minimumStock')" field="minimumStockLevel" />
            <Column :header="t('sportEquipment.fields.unit')" field="unit" />
            <Column :header="t('sportEquipment.fields.status')">
              <template #body="{ data }">
                <StatusBadge :status="resolveItemState(data).tone" :label="resolveItemState(data).label" size="sm" />
              </template>
            </Column>
            <Column :header="t('common.actions')">
              <template #body="{ data }">
                <div class="flex flex-wrap gap-2">
                  <Button size="small" text :label="t('common.actions.view')" @click="openEquipmentDialog('view', data)" />
                  <Button size="small" text :label="t('common.actions.edit')" @click="openEquipmentDialog('edit', data)" />
                  <Button
                    size="small"
                    text
                    :label="String(data.status).toLowerCase() === 'active' ? t('sportEquipment.buttons.deactivate') : t('sportEquipment.buttons.activate')"
                    @click="toggleEquipmentStatus(data)"
                  />
                </div>
              </template>
            </Column>
          </DataTable>

          <div v-if="equipmentPagination.totalPages > 1" class="mt-4">
            <Pagination v-model="equipmentPage" :total-pages="equipmentPagination.totalPages" @change="loadInventory" />
          </div>
        </template>
      </Card>

      <Card v-else-if="isAdminRoute && activeTab === 'requests'" class="sport-equipment-card">
        <template #title>{{ t('sportEquipment.tabs.requests') }}</template>
        <template #content>
          <div class="sport-equipment-page__filters">
            <InputText v-model="equipmentRequestSearch" :placeholder="t('sportEquipment.fields.purpose')" class="sport-equipment-page__field" />
            <Dropdown v-model="equipmentRequestStatusFilter" :options="requestStatusOptions" option-label="label" option-value="value" :placeholder="t('sportEquipment.fields.status')" class="sport-equipment-page__field" />
            <Button :label="t('sportEquipment.buttons.search')" @click="loadEquipmentRequests" />
          </div>

          <div v-if="!equipmentRequestLoading && !equipmentRequests.length" class="sport-equipment-page__empty">
            {{ t('sportEquipment.messages.noRequests') }}
          </div>

          <DataTable v-else :value="equipmentRequests" data-key="id" striped-rows :loading="equipmentRequestLoading">
            <Column :header="t('common.table.number')" style="width: 4rem;">
              <template #body="{ index }">
                {{ requestRowNumber(index) }}
              </template>
            </Column>
            <Column :header="t('sportEquipment.fields.coach')">
              <template #body="{ data }">
                {{ data.coach?.firstName || data.coach?.username || data.coachUserId }}
              </template>
            </Column>
            <Column :header="t('sportEquipment.fields.team')">
              <template #body="{ data }">
                {{ data.team?.name || data.teamId }}
              </template>
            </Column>
            <Column :header="t('sportEquipment.fields.name')">
              <template #body="{ data }">
                {{ data.item?.name || data.equipmentItemId }}
              </template>
            </Column>
            <Column :header="t('sportEquipment.fields.requestedQuantity')" field="requestedQuantity" />
            <Column :header="t('sportEquipment.fields.requiredDate')">
              <template #body="{ data }">
                {{ formatDate(data.requiredDate) }}
              </template>
            </Column>
            <Column :header="t('sportEquipment.fields.status')">
              <template #body="{ data }">
                <StatusBadge :status="statusTone(data.status)" :label="t(`sportEquipment.statuses.${String(data.status || '').toLowerCase()}`) || data.status" size="sm" />
              </template>
            </Column>
            <Column :header="t('common.actions')">
              <template #body="{ data }">
                <div class="flex flex-wrap gap-2">
                  <Button
                    v-if="String(data.status).toLowerCase() === 'pending'"
                    size="small"
                    text
                    :label="t('sportEquipment.buttons.approve')"
                    @click="openRequestActionDialog('approve', data)"
                  />
                  <Button
                    v-if="String(data.status).toLowerCase() === 'pending'"
                    size="small"
                    text
                    :label="t('sportEquipment.buttons.reject')"
                    @click="openRequestActionDialog('reject', data)"
                  />
                  <Button
                    v-if="String(data.status).toLowerCase() === 'approved'"
                    size="small"
                    text
                    :label="t('sportEquipment.buttons.issue')"
                    @click="openRequestActionDialog('issue', data)"
                  />
                  <Button
                    v-if="String(data.status).toLowerCase() === 'issued'"
                    size="small"
                    text
                    :label="t('sportEquipment.buttons.return')"
                    @click="openRequestActionDialog('return', data)"
                  />
                </div>
              </template>
            </Column>
          </DataTable>

          <div v-if="equipmentRequestPagination.totalPages > 1" class="mt-4">
            <Pagination v-model="equipmentRequestPage" :total-pages="equipmentRequestPagination.totalPages" @change="loadEquipmentRequests" />
          </div>
        </template>
      </Card>

      <Card v-else-if="isCoachRoute && activeTab === 'available'" class="sport-equipment-card">
        <template #title>{{ t('sportEquipment.tabs.available') }}</template>
        <template #content>
          <div class="sport-equipment-page__filters">
            <InputText v-model="coachItemSearch" :placeholder="t('sportEquipment.fields.name')" class="sport-equipment-page__field" />
            <Dropdown v-model="coachItemCategory" :options="coachCategoryOptions" option-label="label" option-value="value" :placeholder="t('sportEquipment.fields.category')" class="sport-equipment-page__field" />
            <Dropdown v-model="coachItemStockFilter" :options="stockOptions" option-label="label" option-value="value" :placeholder="t('sportEquipment.statuses.lowStock')" class="sport-equipment-page__field" />
            <Button :label="t('sportEquipment.buttons.search')" @click="loadCoachEquipment" />
          </div>

          <div v-if="!coachItemLoading && !coachItems.length" class="sport-equipment-page__empty">
            {{ t('sportEquipment.messages.noEquipment') }}
          </div>

          <DataTable v-else :value="coachItems" data-key="id" striped-rows :loading="coachItemLoading">
            <Column :header="t('common.table.number')" style="width: 4rem;">
              <template #body="{ index }">
                {{ coachEquipmentRowNumber(index) }}
              </template>
            </Column>
            <Column :header="t('sportEquipment.fields.name')">
              <template #body="{ data }">
                <div class="font-medium text-slate-900">{{ data.name }}</div>
                <div class="text-xs text-slate-500">{{ data.equipmentCode }}</div>
              </template>
            </Column>
            <Column :header="t('sportEquipment.fields.category')" field="category" />
            <Column :header="t('sportEquipment.fields.availableQuantity')" field="availableQuantity" />
            <Column :header="t('sportEquipment.fields.minimumStock')" field="minimumStockLevel" />
            <Column :header="t('sportEquipment.fields.unit')" field="unit" />
            <Column :header="t('sportEquipment.fields.status')">
              <template #body="{ data }">
                <StatusBadge :status="resolveItemState(data).tone" :label="resolveItemState(data).label" size="sm" />
              </template>
            </Column>
            <Column :header="t('common.actions')">
              <template #body="{ data }">
                <Button
                  size="small"
                  :label="t('sportEquipment.buttons.requestEquipment')"
                  :disabled="Number(data.availableQuantity || 0) <= 0 || !coachTeamOptions.length"
                  @click="openCoachRequestDialog(data)"
                />
              </template>
            </Column>
          </DataTable>

          <div v-if="coachItemPagination.totalPages > 1" class="mt-4">
            <Pagination v-model="coachItemPage" :total-pages="coachItemPagination.totalPages" @change="loadCoachEquipment" />
          </div>
        </template>
      </Card>

      <Card v-else-if="isCoachRoute && activeTab === 'my-requests'" class="sport-equipment-card">
        <template #title>{{ t('sportEquipment.tabs.myRequests') }}</template>
        <template #content>
          <div class="sport-equipment-page__filters">
            <InputText v-model="coachRequestSearch" :placeholder="t('sportEquipment.fields.purpose')" class="sport-equipment-page__field" />
            <Dropdown v-model="coachRequestStatusFilter" :options="requestStatusOptions" option-label="label" option-value="value" :placeholder="t('sportEquipment.fields.status')" class="sport-equipment-page__field" />
            <Button :label="t('sportEquipment.buttons.search')" @click="loadCoachRequests" />
          </div>

          <div v-if="!coachRequestLoading && !coachRequests.length" class="sport-equipment-page__empty">
            {{ t('sportEquipment.messages.noRequests') }}
          </div>

          <DataTable v-else :value="coachRequests" data-key="id" striped-rows :loading="coachRequestLoading">
            <Column :header="t('common.table.number')" style="width: 4rem;">
              <template #body="{ index }">
                {{ coachRequestRowNumber(index) }}
              </template>
            </Column>
            <Column :header="t('sportEquipment.fields.name')">
              <template #body="{ data }">
                {{ data.item?.name || data.equipmentItemId }}
              </template>
            </Column>
            <Column :header="t('sportEquipment.fields.team')">
              <template #body="{ data }">
                {{ data.team?.name || data.teamId }}
              </template>
            </Column>
            <Column :header="t('sportEquipment.fields.requestedQuantity')" field="requestedQuantity" />
            <Column :header="t('sportEquipment.fields.approvedQuantity')" field="approvedQuantity" />
            <Column :header="t('sportEquipment.fields.issuedQuantity')" field="issuedQuantity" />
            <Column :header="t('sportEquipment.fields.returnedQuantity')" field="returnedQuantity" />
            <Column :header="t('sportEquipment.fields.requiredDate')">
              <template #body="{ data }">
                {{ formatDate(data.requiredDate) }}
              </template>
            </Column>
            <Column :header="t('sportEquipment.fields.expectedReturnDate')">
              <template #body="{ data }">
                {{ formatDate(data.expectedReturnDate) }}
              </template>
            </Column>
            <Column :header="t('sportEquipment.fields.status')">
              <template #body="{ data }">
                <StatusBadge :status="statusTone(data.status)" :label="t(`sportEquipment.statuses.${String(data.status || '').toLowerCase()}`) || data.status" size="sm" />
              </template>
            </Column>
            <Column :header="t('sportEquipment.fields.adminNote')">
              <template #body="{ data }">
                <span class="text-sm text-slate-600">{{ data.adminNote || data.rejectionReason || '—' }}</span>
              </template>
            </Column>
          </DataTable>

          <div v-if="coachRequestPagination.totalPages > 1" class="mt-4">
            <Pagination v-model="coachRequestPage" :total-pages="coachRequestPagination.totalPages" @change="loadCoachRequests" />
          </div>
        </template>
      </Card>
    </section>

    <Dialog
      v-model:visible="equipmentDialogVisible"
      modal
      :header="equipmentDialogMode === 'view'
        ? t('sportEquipment.buttons.viewEquipment')
        : equipmentDialogMode === 'edit'
          ? t('sportEquipment.buttons.editEquipment')
          : t('sportEquipment.buttons.addEquipment')"
      class="sport-equipment-dialog"
      :style="{ width: 'min(42rem, 94vw)' }"
    >
      <div class="space-y-3">
        <p v-if="equipmentDialogError" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {{ equipmentDialogError }}
        </p>

        <label class="sport-equipment-page__label">
          <span>{{ t('sportEquipment.fields.equipmentCode') }}</span>
          <InputText v-model="equipmentForm.equipmentCode" :disabled="equipmentDialogMode === 'view'" />
        </label>
        <label class="sport-equipment-page__label">
          <span>{{ t('sportEquipment.fields.name') }}</span>
          <InputText v-model="equipmentForm.name" :disabled="equipmentDialogMode === 'view'" />
        </label>
        <label class="sport-equipment-page__label">
          <span>{{ t('sportEquipment.fields.category') }}</span>
          <InputText v-model="equipmentForm.category" :disabled="equipmentDialogMode === 'view'" />
        </label>
        <label class="sport-equipment-page__label">
          <span>{{ t('sportEquipment.fields.unit') }}</span>
          <InputText v-model="equipmentForm.unit" :disabled="equipmentDialogMode === 'view'" />
        </label>
        <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
          <label class="sport-equipment-page__label">
            <span>{{ t('sportEquipment.fields.totalQuantity') }}</span>
            <InputNumber v-model="equipmentForm.totalQuantity" :min="0" :disabled="equipmentDialogMode === 'view'" />
          </label>
          <label class="sport-equipment-page__label">
            <span>{{ t('sportEquipment.fields.availableQuantity') }}</span>
            <InputNumber v-model="equipmentForm.availableQuantity" :min="0" :disabled="equipmentDialogMode === 'view'" />
          </label>
          <label class="sport-equipment-page__label">
            <span>{{ t('sportEquipment.fields.minimumStock') }}</span>
            <InputNumber v-model="equipmentForm.minimumStockLevel" :min="0" :disabled="equipmentDialogMode === 'view'" />
          </label>
        </div>
        <label class="sport-equipment-page__label">
          <span>{{ t('sportEquipment.fields.storageLocation') }}</span>
          <InputText v-model="equipmentForm.storageLocation" :disabled="equipmentDialogMode === 'view'" />
        </label>
        <label class="sport-equipment-page__label">
          <span>{{ t('sportEquipment.fields.status') }}</span>
          <Dropdown v-model="equipmentForm.status" :options="itemStatusOptions" option-label="label" option-value="value" :disabled="equipmentDialogMode === 'view'" />
        </label>
        <label class="sport-equipment-page__label">
          <span>{{ t('sportEquipment.fields.description') }}</span>
          <Textarea v-model="equipmentForm.description" rows="3" auto-resize :disabled="equipmentDialogMode === 'view'" />
        </label>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button text :label="t('common.cancel')" @click="closeEquipmentDialog" />
          <Button
            v-if="equipmentDialogMode !== 'view'"
            :loading="equipmentSaving"
            :label="t('sportEquipment.buttons.save')"
            @click="saveEquipment"
          />
        </div>
      </template>
    </Dialog>

    <Dialog
      v-model:visible="coachRequestDialogVisible"
      modal
      :header="t('sportEquipment.buttons.requestEquipment')"
      class="sport-equipment-dialog"
      :style="{ width: 'min(40rem, 94vw)' }"
    >
      <div class="space-y-3">
        <p v-if="coachRequestDialogError" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {{ coachRequestDialogError }}
        </p>
        <label class="sport-equipment-page__label">
          <span>{{ t('sportEquipment.fields.team') }}</span>
          <Dropdown v-model="coachRequestForm.teamId" :options="coachTeamOptions" option-label="label" option-value="value" :disabled="coachTeamsLoading" />
        </label>
        <label class="sport-equipment-page__label">
          <span>{{ t('sportEquipment.fields.name') }}</span>
          <InputText :model-value="selectedCoachEquipment?.name || ''" disabled />
        </label>
        <label class="sport-equipment-page__label">
          <span>{{ t('sportEquipment.fields.requestedQuantity') }}</span>
          <InputNumber v-model="coachRequestForm.requestedQuantity" :min="1" />
        </label>
        <label class="sport-equipment-page__label">
          <span>{{ t('sportEquipment.fields.purpose') }}</span>
          <Textarea v-model="coachRequestForm.purpose" rows="3" auto-resize />
        </label>
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label class="sport-equipment-page__label">
            <span>{{ t('sportEquipment.fields.requiredDate') }}</span>
            <InputText v-model="coachRequestForm.requiredDate" type="date" />
          </label>
          <label class="sport-equipment-page__label">
            <span>{{ t('sportEquipment.fields.expectedReturnDate') }}</span>
            <InputText v-model="coachRequestForm.expectedReturnDate" type="date" />
          </label>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button text :label="t('common.cancel')" @click="closeCoachRequestDialog" />
          <Button :loading="coachRequestSaving" :label="t('sportEquipment.buttons.requestEquipment')" @click="saveCoachRequest" />
        </div>
      </template>
    </Dialog>

    <Dialog
      v-model:visible="requestActionDialogVisible"
      modal
      :header="requestActionMode === 'approve'
        ? t('sportEquipment.buttons.approve')
        : requestActionMode === 'reject'
          ? t('sportEquipment.buttons.reject')
          : requestActionMode === 'issue'
            ? t('sportEquipment.buttons.issue')
            : t('sportEquipment.buttons.return')"
      class="sport-equipment-dialog"
      :style="{ width: 'min(40rem, 94vw)' }"
    >
      <div class="space-y-3">
        <p v-if="requestActionDialogError" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {{ requestActionDialogError }}
        </p>

        <template v-if="requestActionMode === 'approve'">
          <label class="sport-equipment-page__label">
            <span>{{ t('sportEquipment.fields.approvedQuantity') }}</span>
            <InputNumber v-model="requestActionForm.approvedQuantity" :min="1" />
          </label>
        </template>

        <template v-else-if="requestActionMode === 'reject'">
          <label class="sport-equipment-page__label">
            <span>{{ t('sportEquipment.fields.rejectionReason') }}</span>
            <Textarea v-model="requestActionForm.rejectionReason" rows="3" auto-resize />
          </label>
        </template>

        <template v-else-if="requestActionMode === 'issue'">
          <label class="sport-equipment-page__label">
            <span>{{ t('sportEquipment.fields.issuedQuantity') }}</span>
            <InputNumber v-model="requestActionForm.issuedQuantity" :min="1" />
          </label>
        </template>

        <template v-else>
          <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
            <label class="sport-equipment-page__label">
              <span>{{ t('sportEquipment.fields.returnedQuantity') }}</span>
              <InputNumber v-model="requestActionForm.returnedQuantity" :min="0" />
            </label>
            <label class="sport-equipment-page__label">
              <span>{{ t('sportEquipment.fields.damagedQuantity') }}</span>
              <InputNumber v-model="requestActionForm.damagedQuantity" :min="0" />
            </label>
            <label class="sport-equipment-page__label">
              <span>{{ t('sportEquipment.fields.missingQuantity') }}</span>
              <InputNumber v-model="requestActionForm.missingQuantity" :min="0" />
            </label>
          </div>
        </template>

        <label class="sport-equipment-page__label">
          <span>{{ t('sportEquipment.fields.adminNote') }}</span>
          <Textarea v-model="requestActionForm.adminNote" rows="3" auto-resize />
        </label>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button text :label="t('common.cancel')" @click="closeRequestActionDialog" />
          <Button :loading="requestActionSaving" :label="requestActionMode === 'approve'
            ? t('sportEquipment.buttons.approve')
            : requestActionMode === 'reject'
              ? t('sportEquipment.buttons.reject')
              : requestActionMode === 'issue'
                ? t('sportEquipment.buttons.issue')
                : t('sportEquipment.buttons.return')" @click="saveRequestAction" />
        </div>
      </template>
    </Dialog>
  </MainLayout>
</template>

<style scoped>
.sport-equipment-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sport-equipment-page--kh {
  font-family:
    'Noto Sans Khmer',
    'Khmer OS Siemreap',
    'Khmer OS Battambang',
    'Leelawadee UI',
    sans-serif;
}

.sport-equipment-page__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.sport-equipment-page__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.sport-equipment-page__field {
  min-width: 12rem;
  flex: 1 1 12rem;
}

.sport-equipment-card {
  border-radius: 1.5rem;
  border: 1px solid #dbe6f4;
  box-shadow: 0 24px 48px -38px rgba(15, 23, 42, 0.45);
}

.sport-equipment-page__empty {
  border-radius: 1rem;
  border: 1px dashed #cbd5e1;
  background: #f8fafc;
  color: #64748b;
  padding: 1rem;
}

.sport-equipment-page__label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.9rem;
  color: #334155;
}
</style>

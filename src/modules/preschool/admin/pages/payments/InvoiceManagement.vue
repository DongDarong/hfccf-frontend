<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Dialog from 'primevue/dialog'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Pagination from '@/components/data-display/Pagination.vue'
import AlertQuestion from '@/components/alerts/AlertQuestion.vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'
import PaymentFilters from '@/modules/preschool/admin/components/payment-management/PaymentFilters.vue'
import PaymentSummaryCards from '@/modules/preschool/admin/components/payment-management/PaymentSummaryCards.vue'
import InvoiceTable from '@/modules/preschool/admin/components/payment-management/InvoiceTable.vue'
import PaymentToolbar from '@/modules/preschool/admin/components/payment-management/PaymentToolbar.vue'
import Button from '@/components/buttons/Button.vue'
import { useLanguage } from '@/composables/useLanguage'
import { normalizeDateForInput } from '@/utils/date'
import {
  fetchPreschoolClasses,
  fetchPreschoolStudents,
} from '@/modules/preschool/services/preschoolApi'
import {
  cancelPreschoolInvoice,
  createPreschoolInvoice,
  deletePreschoolInvoice,
  downloadPreschoolInvoiceExport,
  fetchPreschoolInvoices,
  updatePreschoolInvoice,
} from '@/modules/preschool/services/api/preschoolPaymentApi'
import {
  fetchFeeTypes as fetchConfiguredFeeTypes,
  fetchPaymentSettings as fetchConfiguredPaymentSettings,
} from '@/modules/preschool/services/api/preschoolPaymentConfigurationApi'
import { PAGE_SIZE, DEFAULT_PAGINATION } from './constants/paymentManagementConstants'
import {
  buildClassOptions,
  buildStudentOptions,
  normalize,
} from './utils/paymentManagementHelpers'
import {
  DEFAULT_INVOICE_FORM,
  DEFAULT_INVOICE_ITEM,
  buildInvoiceColumns,
  mapInvoice,
  normalizeInvoicePayload,
} from './utils/invoiceManagementHelpers'

defineOptions({
  name: 'PreschoolAdminInvoiceManagementPage',
})

const { t } = useLanguage()
const router = useRouter()

const invoiceRows = ref([])
const searchQuery = ref('')
const classFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const selectedInvoice = ref(null)
const isDeleteOpen = ref(false)
const isCancelOpen = ref(false)
const showSuccess = ref(false)
const successMessage = ref('')
const loading = ref(false)
const errorMessage = ref('')
const pagination = ref({ ...DEFAULT_PAGINATION })
const classOptions = ref([])
const studentOptions = ref([])
const invoiceModalOpen = ref(false)
const invoiceModalMode = ref('create')
const invoiceSaving = ref(false)
const invoiceItems = ref([DEFAULT_INVOICE_ITEM()])
const configuredFeeTypes = ref([])
const configuredPaymentSettings = ref({ invoicePrefix: 'INV', nextInvoiceNumber: 1 })
const exportLoading = ref(false)
const exportFormat = ref('')
const invoiceErrorMessage = ref('')

const invoiceForm = reactive({ ...DEFAULT_INVOICE_FORM() })

const invoiceColumns = computed(() => buildInvoiceColumns(t))

const classOptionLabelMap = computed(() =>
  classOptions.value.reduce((carry, item) => {
    carry[String(item.value)] = item.label
    return carry
  }, {}),
)

const studentOptionLabelMap = computed(() =>
  studentOptions.value.reduce((carry, item) => {
    carry[String(item.value)] = item.label
    return carry
  }, {}),
)

const totalInvoiceAmount = computed(() =>
  invoiceRows.value.reduce((sum, row) => sum + Number(row.totalAmount || 0), 0),
)

const totalInvoiceBalance = computed(() =>
  invoiceRows.value.reduce((sum, row) => sum + Number(row.balanceDue || 0), 0),
)

const totalInvoiceCount = computed(() => Number(pagination.value.total || invoiceRows.value.length || 0))

const draftInvoiceCount = computed(
  () => invoiceRows.value.filter((row) => normalize(row.status) === 'draft').length,
)

const overdueInvoiceCount = computed(
  () => invoiceRows.value.filter((row) => normalize(row.status) === 'overdue').length,
)

const invoiceSummaryCards = computed(() => [
  {
    id: 'invoice-total',
    label: t('preschoolInvoiceManagementPage.summary.total'),
    value: totalInvoiceCount.value,
    tone: 'info',
    icon: 'pi pi-file',
  },
  {
    id: 'invoice-amount',
    label: t('preschoolPaymentManagementPage.invoiceLabels.total'),
    value: `$${totalInvoiceAmount.value.toFixed(2)}`,
    tone: 'success',
    icon: 'pi pi-wallet',
  },
  {
    id: 'invoice-balance',
    label: t('preschoolPaymentManagementPage.invoiceLabels.balance'),
    value: `$${totalInvoiceBalance.value.toFixed(2)}`,
    tone: 'warning',
    icon: 'pi pi-exclamation-circle',
  },
  {
    id: 'invoice-overdue',
    label: t('preschoolPaymentManagementPage.invoiceStatus.overdue'),
    value: overdueInvoiceCount.value,
    tone: 'danger',
    icon: 'pi pi-times-circle',
  },
  {
    id: 'invoice-draft',
    label: t('preschoolPaymentManagementPage.invoiceStatus.draft'),
    value: draftInvoiceCount.value,
    tone: 'warning',
    icon: 'pi pi-pencil',
  },
])

const invoiceStatusOptions = ['draft', 'issued', 'partial', 'paid', 'overdue', 'cancelled']

const invoiceVisibleRangeLabel = computed(() => {
  const total = Number(pagination.value.total || 0)
  if (!total) return t('preschoolInvoiceManagementPage.messages.noResults')

  const perPage = Number(pagination.value.perPage || PAGE_SIZE || 1)
  const page = Number(pagination.value.page || currentPage.value || 1)
  const start = Math.min((page - 1) * perPage + 1, total)
  const end = Math.min(page * perPage, total)

  return t('preschoolInvoiceManagementPage.toolbar.range', {
    start,
    end,
    total,
  })
})

async function loadClasses() {
  try {
    const response = await fetchPreschoolClasses({ perPage: 100 })
    classOptions.value = buildClassOptions(response.items || [])
  } catch {
    classOptions.value = []
  }
}

async function loadStudents() {
  try {
    const response = await fetchPreschoolStudents({ perPage: 100 })
    studentOptions.value = buildStudentOptions(response.items || [])
  } catch {
    studentOptions.value = []
  }
}

async function loadPaymentConfiguration() {
  try {
    const [settings, feeTypesResponse] = await Promise.all([
      fetchConfiguredPaymentSettings(),
      fetchConfiguredFeeTypes(),
    ])

    configuredPaymentSettings.value = settings || { invoicePrefix: 'INV', nextInvoiceNumber: 1 }
    configuredFeeTypes.value = Array.isArray(feeTypesResponse?.items) ? feeTypesResponse.items : []
  } catch {
    configuredPaymentSettings.value = { invoicePrefix: 'INV', nextInvoiceNumber: 1 }
    configuredFeeTypes.value = []
  }
}

async function loadInvoices() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetchPreschoolInvoices({
      page: currentPage.value,
      perPage: PAGE_SIZE,
      search: searchQuery.value,
      classId: classFilter.value,
      status: statusFilter.value,
    })

    invoiceRows.value = (response.items || []).map((row) => mapInvoice(row, classOptionLabelMap.value, studentOptionLabelMap.value))
    pagination.value = response.pagination || pagination.value
  } catch (error) {
    invoiceRows.value = []
    errorMessage.value = error?.message || t('preschoolInvoiceManagementPage.messages.loadFailed')
  } finally {
    loading.value = false
  }
}

function triggerDownload(blob, filename) {
  const url = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.URL.revokeObjectURL(url)
}

function clearFilters() {
  searchQuery.value = ''
  classFilter.value = ''
  statusFilter.value = ''
}

function openCreateInvoiceModal() {
  invoiceModalMode.value = 'create'
  selectedInvoice.value = null

  const prefix = String(configuredPaymentSettings.value.invoicePrefix || 'INV').trim() || 'INV'
  const nextNumber = Number(configuredPaymentSettings.value.nextInvoiceNumber || 1)
  const invoiceNumber = `${prefix}-${new Date().getFullYear()}-${String(nextNumber).padStart(5, '0')}`
  const defaultFeeType = configuredFeeTypes.value[0]

  Object.assign(invoiceForm, {
    ...DEFAULT_INVOICE_FORM(),
    invoice_number: invoiceNumber,
  })

  invoiceItems.value = [
    defaultFeeType
      ? {
        description: defaultFeeType.name || '',
        quantity: 1,
        unit_price: Number(defaultFeeType.defaultAmount || 0),
        sort_order: 1,
      }
      : DEFAULT_INVOICE_ITEM(),
  ]

  invoiceModalOpen.value = true
}

function openEditInvoiceModal(row) {
  invoiceModalMode.value = 'edit'
  selectedInvoice.value = row
  Object.assign(invoiceForm, {
    student_id: row.studentId || '',
    class_id: row.classId || '',
    academic_year_id: row.academicYearId || '',
    term_id: row.termId || '',
    invoice_number: row.invoiceNumber || '',
    issue_date: normalizeDateForInput(row.issueDate || row.issue_date || ''),
    due_date: normalizeDateForInput(row.dueDate || row.due_date || ''),
    discount_amount: row.discountAmount || 0,
  })
  invoiceItems.value = Array.isArray(row.items) && row.items.length
    ? row.items.map((item, index) => ({
      description: item.description || '',
      quantity: item.quantity || 1,
      unit_price: item.unitPrice || 0,
      sort_order: item.sortOrder || index + 1,
    }))
    : [DEFAULT_INVOICE_ITEM()]
  invoiceModalOpen.value = true
}

function addInvoiceItem() {
  invoiceItems.value.push({
    ...DEFAULT_INVOICE_ITEM(),
    sort_order: invoiceItems.value.length + 1,
  })
}

function removeInvoiceItem(index) {
  invoiceItems.value.splice(index, 1)
  if (!invoiceItems.value.length) {
    invoiceItems.value = [DEFAULT_INVOICE_ITEM()]
  }
  invoiceItems.value = invoiceItems.value.map((item, itemIndex) => ({
    ...item,
    sort_order: itemIndex + 1,
  }))
}

function closeInvoiceModal() {
  invoiceModalOpen.value = false
  invoiceSaving.value = false
}

async function onSaveInvoice() {
  invoiceSaving.value = true
  invoiceErrorMessage.value = ''

  try {
    const payload = normalizeInvoicePayload(invoiceForm, invoiceItems.value)
    if (invoiceModalMode.value === 'edit' && selectedInvoice.value?.id) {
      await updatePreschoolInvoice(selectedInvoice.value.id, payload)
      successMessage.value = t('preschoolInvoiceManagementPage.messages.updateSuccess')
    } else {
      await createPreschoolInvoice(payload)
      successMessage.value = t('preschoolInvoiceManagementPage.messages.createSuccess')
    }

    showSuccess.value = true
    closeInvoiceModal()
    await loadInvoices()
  } catch (error) {
    invoiceErrorMessage.value = error?.message || t('preschoolInvoiceManagementPage.messages.saveFailed')
  } finally {
    invoiceSaving.value = false
  }
}

function onViewInvoice(row) {
  router.push({ name: 'dashboard-preschool-admin-invoice-detail', params: { id: row.id } })
}

function onEditInvoice(row) {
  if (normalize(row.status) !== 'draft') {
    invoiceErrorMessage.value = t('preschoolInvoiceManagementPage.messages.saveFailed')
    return
  }
  openEditInvoiceModal(row)
}

function onAddPayment(row) {
  if (!row?.id) return
  router.push({ name: 'dashboard-preschool-admin-payment', query: { invoiceId: row.id } })
}

function onDeleteInvoice(row) {
  selectedInvoice.value = row
  isDeleteOpen.value = true
}

function onCancelInvoice(row) {
  selectedInvoice.value = row
  isCancelOpen.value = true
}

function onCloseDelete() {
  isDeleteOpen.value = false
  selectedInvoice.value = null
}

function onCloseCancel() {
  isCancelOpen.value = false
  selectedInvoice.value = null
}

async function onConfirmDeleteInvoice() {
  try {
    await deletePreschoolInvoice(selectedInvoice.value?.id)
    successMessage.value = t('preschoolInvoiceManagementPage.messages.deleteSuccess')
    showSuccess.value = true
    onCloseDelete()
    await loadInvoices()
  } catch (error) {
    invoiceErrorMessage.value = error?.message || t('preschoolInvoiceManagementPage.messages.saveFailed')
  }
}

async function onConfirmCancelInvoice() {
  try {
    await cancelPreschoolInvoice(selectedInvoice.value?.id)
    successMessage.value = t('preschoolInvoiceManagementPage.messages.cancelSuccess')
    showSuccess.value = true
    onCloseCancel()
    await loadInvoices()
  } catch (error) {
    invoiceErrorMessage.value = error?.message || t('preschoolInvoiceManagementPage.messages.saveFailed')
  }
}

async function onDownloadInvoice(row, format = 'pdf') {
  const invoiceId = row?.id
  if (!invoiceId) return

  exportLoading.value = true
  exportFormat.value = format
  invoiceErrorMessage.value = ''

  try {
    const file = await downloadPreschoolInvoiceExport(invoiceId, format)
    if (file?.blob) {
      triggerDownload(file.blob, file.filename)
    }
  } catch (error) {
    invoiceErrorMessage.value = error?.message || t('preschoolInvoiceManagementPage.messages.exportFailed')
  } finally {
    exportLoading.value = false
    exportFormat.value = ''
  }
}

watch([searchQuery, classFilter, statusFilter], () => {
  currentPage.value = 1
  loadInvoices()
})

watch(currentPage, () => {
  loadInvoices()
})

onMounted(async () => {
  await Promise.all([loadClasses(), loadStudents(), loadPaymentConfiguration(), loadInvoices()])
})
</script>

<template>
  <MainLayout>
    <section class="payment-management-page">
      <HeaderSection
        :title="t('preschoolInvoiceManagementPage.title')"
        :subtitle="t('preschoolInvoiceManagementPage.subtitle')"
      />

      <PaymentSummaryCards :cards="invoiceSummaryCards" />

      <div class="payment-management-page__panel">
        <PaymentToolbar
          :eyebrow="t('preschoolInvoiceManagementPage.toolbar.eyebrow')"
          :title="invoiceVisibleRangeLabel"
          :clear-label="t('preschoolInvoiceManagementPage.toolbar.clear')"
          :add-label="t('preschoolInvoiceManagementPage.toolbar.add')"
          @clear="clearFilters"
          @add="openCreateInvoiceModal"
        />

        <PaymentFilters
          v-model:searchQuery="searchQuery"
          v-model:classFilter="classFilter"
          v-model:statusFilter="statusFilter"
          :class-options="classOptions"
          :status-options="invoiceStatusOptions"
          :search-placeholder="t('preschoolInvoiceManagementPage.searchPlaceholder')"
          :all-classes-label="t('common.allClasses')"
          :all-status-label="t('common.allStatus')"
        />

        <div
          v-if="errorMessage"
          class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {{ errorMessage }}
        </div>

        <div v-if="exportLoading" class="payment-management-page__inline-help">
          {{ t('preschoolInvoiceManagementPage.messages.exporting') }}
        </div>

        <InvoiceTable
          :invoices="invoiceRows"
          :columns="invoiceColumns"
          :loading="loading"
          :empty-text="t('preschoolInvoiceManagementPage.messages.noResults')"
          @view="onViewInvoice"
          @edit="onEditInvoice"
          @delete="onDeleteInvoice"
          @cancel="onCancelInvoice"
          @download-pdf="onDownloadInvoice($event, 'pdf')"
          @download-excel="onDownloadInvoice($event, 'xlsx')"
          @add-payment="onAddPayment"
        />

        <div v-if="pagination.totalPages > 1" class="flex justify-end">
          <Pagination v-model="currentPage" :total-pages="pagination.totalPages" class="mt-2" />
        </div>
      </div>
    </section>

    <Dialog
      v-model:visible="invoiceModalOpen"
      :header="invoiceModalMode === 'edit' ? t('preschoolPaymentManagementPage.actions.editInvoice') : t('preschoolPaymentManagementPage.actions.createInvoice')"
      modal
      class="payment-management-page__dialog payment-management-page__dialog--wide"
    >
      <div class="payment-management-page__dialog-grid">
        <div class="payment-management-page__field">
          <label for="invoice-student-id" class="form-label">{{ t('preschoolPaymentManagementPage.dialog.formLabels.student') }}</label>
          <select id="invoice-student-id" v-model="invoiceForm.student_id" class="payment-management-page__input">
            <option value="">{{ t('preschoolPaymentManagementPage.dialog.student') }}</option>
            <option v-for="option in studentOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="payment-management-page__field">
          <label for="invoice-class-id" class="form-label">{{ t('preschoolPaymentManagementPage.dialog.formLabels.class') }}</label>
          <select id="invoice-class-id" v-model="invoiceForm.class_id" class="payment-management-page__input">
            <option value="">{{ t('preschoolPaymentManagementPage.dialog.class') }}</option>
            <option v-for="option in classOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="payment-management-page__field">
          <label for="invoice-number" class="form-label">{{ t('preschoolPaymentManagementPage.invoiceLabels.number') }}</label>
          <input id="invoice-number" v-model="invoiceForm.invoice_number" class="payment-management-page__input" type="text" :placeholder="t('preschoolPaymentManagementPage.invoiceLabels.number')" />
        </div>
        <div class="payment-management-page__field">
          <label for="invoice-issue-date" class="form-label">{{ t('preschoolPaymentManagementPage.invoiceLabels.issueDate') }}</label>
          <input id="invoice-issue-date" v-model="invoiceForm.issue_date" class="payment-management-page__input" type="date" />
        </div>
        <div class="payment-management-page__field">
          <label for="invoice-due-date" class="form-label">{{ t('preschoolPaymentManagementPage.invoiceLabels.dueDate') }}</label>
          <input id="invoice-due-date" v-model="invoiceForm.due_date" class="payment-management-page__input" type="date" />
        </div>
        <div class="payment-management-page__field">
          <label for="invoice-total-amount" class="form-label">{{ t('preschoolPaymentManagementPage.invoiceLabels.total') }}</label>
          <input id="invoice-total-amount" v-model="invoiceForm.discount_amount" class="payment-management-page__input" type="number" step="0.01" min="0" :placeholder="t('preschoolPaymentManagementPage.invoiceLabels.balance')" />
        </div>
      </div>

      <div class="payment-management-page__invoice-items">
        <div class="payment-management-page__invoice-items-header">
          <h3>{{ t('preschoolPaymentManagementPage.invoiceSection.items') }}</h3>
          <Button type="button" variant="secondary" size="sm" rounded="xl" @click="addInvoiceItem">
            {{ t('preschoolPaymentManagementPage.actions.addInvoiceItem') }}
          </Button>
        </div>

        <div v-for="(item, index) in invoiceItems" :key="`${item.sort_order}-${index}`" class="payment-management-page__invoice-item">
          <div class="payment-management-page__field">
            <label :for="`invoice-item-${index}-description`" class="form-label">{{ t('preschoolPaymentManagementPage.invoiceLabels.description') }}</label>
            <input :id="`invoice-item-${index}-description`" v-model="item.description" class="payment-management-page__input" type="text" :placeholder="t('preschoolPaymentManagementPage.invoiceLabels.description')" />
          </div>
          <div class="payment-management-page__field">
            <label :for="`invoice-item-${index}-quantity`" class="form-label">{{ t('preschoolPaymentManagementPage.invoiceLabels.quantity') }}</label>
            <input :id="`invoice-item-${index}-quantity`" v-model="item.quantity" class="payment-management-page__input" type="number" min="0" step="0.01" :placeholder="t('preschoolPaymentManagementPage.invoiceLabels.quantity')" />
          </div>
          <div class="payment-management-page__field">
            <label :for="`invoice-item-${index}-unit-price`" class="form-label">{{ t('preschoolPaymentManagementPage.invoiceLabels.unitPrice') }}</label>
            <input :id="`invoice-item-${index}-unit-price`" v-model="item.unit_price" class="payment-management-page__input" type="number" min="0" step="0.01" :placeholder="t('preschoolPaymentManagementPage.invoiceLabels.unitPrice')" />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            rounded="xl"
            :disabled="invoiceItems.length === 1"
            @click="removeInvoiceItem(index)"
          >
            {{ t('preschoolPaymentManagementPage.actions.removeInvoiceItem') }}
          </Button>
        </div>
      </div>

      <div
        v-if="invoiceErrorMessage"
        class="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
      >
        {{ invoiceErrorMessage }}
      </div>

      <template #footer>
        <Button type="button" variant="outline" rounded="xl" @click="closeInvoiceModal">{{ t('preschoolPaymentManagementPage.dialog.cancel') }}</Button>
        <Button type="button" variant="primary" rounded="xl" :loading="invoiceSaving" :disabled="invoiceSaving" @click="onSaveInvoice">
          {{ t('preschoolPaymentManagementPage.dialog.save') }}
        </Button>
      </template>
    </Dialog>

    <AlertQuestion
      :show="isDeleteOpen"
      :title="t('preschoolPaymentManagementPage.alerts.deleteTitle')"
      :message="t('preschoolPaymentManagementPage.alerts.deleteMessage', { name: selectedInvoice?.invoiceNumber || t('preschoolPaymentManagementPage.alerts.deleteFallback') })"
      :confirm-text="t('common.delete')"
      :cancel-text="t('common.cancel')"
      type="danger"
      @confirm="onConfirmDeleteInvoice"
      @cancel="onCloseDelete"
    />

    <AlertQuestion
      :show="isCancelOpen"
      :title="t('preschoolPaymentManagementPage.actions.cancelInvoice')"
      :message="t('preschoolPaymentManagementPage.alerts.cancelInvoiceMessage', { name: selectedInvoice?.invoiceNumber || t('preschoolPaymentManagementPage.alerts.deleteFallback') })"
      :confirm-text="t('preschoolPaymentManagementPage.actions.cancelInvoice')"
      :cancel-text="t('common.cancel')"
      type="warning"
      @confirm="onConfirmCancelInvoice"
      @cancel="onCloseCancel"
    />

    <AlertSuccess
      :show="showSuccess"
      :title="t('preschoolInvoiceManagementPage.alerts.successTitle')"
      :message="successMessage"
      :button-text="t('preschoolInvoiceManagementPage.alerts.close')"
      @close="showSuccess = false"
    />
  </MainLayout>
</template>

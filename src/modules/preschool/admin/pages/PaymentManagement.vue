<script setup>
// Keep tuition-management copy locale-driven so the screen stays stable and
// can be regression-tested for EN/KH parity instead of hardcoded English.
import { computed, onMounted, reactive, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Pagination from '@/components/data-display/Pagination.vue'
import AlertQuestion from '@/components/alerts/AlertQuestion.vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'
import PaymentFilters from '@/modules/preschool/admin/components/payment-management/PaymentFilters.vue'
import PaymentSummaryCards from '@/modules/preschool/admin/components/payment-management/PaymentSummaryCards.vue'
import PaymentTable from '@/modules/preschool/admin/components/payment-management/PaymentTable.vue'
import PaymentToolbar from '@/modules/preschool/admin/components/payment-management/PaymentToolbar.vue'
import Button from '@/components/buttons/Button.vue'
import { useLanguage } from '@/composables/useLanguage'
import { fetchPreschoolClasses, fetchPreschoolPayments, fetchPreschoolStudents, createPreschoolPayment, updatePreschoolPayment, deletePreschoolPayment } from '@/modules/preschool/services/preschoolApi'

defineOptions({
  name: 'PreschoolAdminPaymentManagementPage',
})

const { t } = useLanguage()

const paymentRows = ref([])
const searchQuery = ref('')
const classFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const selectedPayment = ref(null)
const isDeleteOpen = ref(false)
const showSuccess = ref(false)
const successMessage = ref('')
const pageSize = 10
const loading = ref(false)
const errorMessage = ref('')
const pagination = ref({ page: 1, perPage: pageSize, total: 0, totalPages: 1 })
const classOptions = ref([])
const studentOptions = ref([])
const modalOpen = ref(false)
const modalMode = ref('create')
const paymentSaving = ref(false)

const form = reactive({
  student_id: '',
  class_id: '',
  payment_reference: '',
  amount: '',
  currency: 'USD',
  payment_method: 'cash',
  payment_status: 'pending',
  paid_at: '',
  due_date: '',
  note: '',
})

const statusOptions = computed(() => [
  { label: t('preschoolPaymentManagementPage.options.paid'), value: 'paid' },
  { label: t('preschoolPaymentManagementPage.options.pending'), value: 'pending' },
  { label: t('preschoolPaymentManagementPage.options.overdue'), value: 'overdue' },
  { label: t('preschoolPaymentManagementPage.options.cancelled'), value: 'cancelled' },
])
const methodOptions = computed(() => [
  { label: t('preschoolPaymentManagementPage.options.cash'), value: 'cash' },
  { label: t('preschoolPaymentManagementPage.options.mobilePayment'), value: 'mobile_payment' },
  { label: t('preschoolPaymentManagementPage.options.bankTransfer'), value: 'bank_transfer' },
  { label: t('preschoolPaymentManagementPage.options.card'), value: 'card' },
  { label: t('preschoolPaymentManagementPage.options.other'), value: 'other' },
])
const tableColumns = computed(() => [
  { key: 'number', label: t('preschoolPaymentManagementPage.columns.no'), align: 'left' },
  { key: 'studentName', label: t('preschoolPaymentManagementPage.columns.student'), align: 'left' },
  { key: 'className', label: t('preschoolPaymentManagementPage.columns.class'), align: 'left' },
  { key: 'amountLabel', label: t('preschoolPaymentManagementPage.columns.amount'), align: 'left' },
  { key: 'paymentMethod', label: t('preschoolPaymentManagementPage.columns.method'), align: 'left' },
  { key: 'dueDate', label: t('preschoolPaymentManagementPage.columns.dueDate'), align: 'left' },
  { key: 'paymentStatus', label: t('preschoolPaymentManagementPage.columns.status'), align: 'left' },
  { key: 'actions', label: t('preschoolPaymentManagementPage.columns.actions'), align: 'right' },
])

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

function formatMoney(row) {
  return `${Number(row.amount || 0).toFixed(2)} ${row.currency || 'USD'}`
}

function normalize(value) {
  return String(value ?? '').trim().toLowerCase()
}

const paidAmount = computed(() =>
  paymentRows.value
    .filter((row) => normalize(row.paymentStatus) === 'paid')
    .reduce((sum, row) => sum + Number(row.amount || 0), 0),
)
const totalPaymentCount = computed(() => Number(pagination.value.total || paymentRows.value.length || 0))
const pendingCount = computed(
  () => paymentRows.value.filter((row) => normalize(row.paymentStatus) === 'pending').length,
)
const overdueCount = computed(
  () => paymentRows.value.filter((row) => normalize(row.paymentStatus) === 'overdue').length,
)

const summaryCards = computed(() => [
  {
    id: 'total',
    label: t('preschoolPaymentManagementPage.summary.total'),
    value: totalPaymentCount.value,
    tone: 'info',
    icon: 'pi pi-receipt',
  },
  {
    id: 'paid',
    label: t('preschoolPaymentManagementPage.summary.collected'),
    value: `$${paidAmount.value.toFixed(2)}`,
    tone: 'success',
    icon: 'pi pi-check-circle',
  },
  {
    id: 'pending',
    label: t('preschoolPaymentManagementPage.summary.pending'),
    value: pendingCount.value,
    tone: 'warning',
    icon: 'pi pi-clock',
  },
  {
    id: 'overdue',
    label: t('preschoolPaymentManagementPage.summary.overdue'),
    value: overdueCount.value,
    tone: 'danger',
    icon: 'pi pi-exclamation-triangle',
  },
])

const visibleRangeLabel = computed(() => {
  const total = Number(pagination.value.total || 0)
  if (!total) return t('preschoolPaymentManagementPage.messages.noResults')

  const perPage = Number(pagination.value.perPage || pageSize || 1)
  const page = Number(pagination.value.page || currentPage.value || 1)
  const start = Math.min((page - 1) * perPage + 1, total)
  const end = Math.min(page * perPage, total)

  return t('preschoolPaymentManagementPage.toolbar.range', {
    start,
    end,
    total,
  })
})

function mapPayment(row) {
  return {
    ...row,
    studentName: row.studentName || studentOptionLabelMap.value[String(row.studentId)] || '-',
    className: row.className || classOptionLabelMap.value[String(row.classId)] || '-',
    amountLabel: formatMoney(row),
    status: row.paymentStatus || row.status || '-',
  }
}

async function loadClasses() {
  try {
    const response = await fetchPreschoolClasses({ perPage: 100 })
    classOptions.value = (response.items || []).map((item) => ({
      label: `${item.code} - ${item.name}`,
      value: item.id,
    }))
  } catch {
    classOptions.value = []
  }
}

async function loadStudents() {
  try {
    const response = await fetchPreschoolStudents({ perPage: 100 })
    studentOptions.value = (response.items || []).map((item) => ({
      label: item.fullName || item.name || item.publicId || item.studentCode || item.id,
      value: item.id,
    }))
  } catch {
    studentOptions.value = []
  }
}

async function loadPayments() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetchPreschoolPayments({
      page: currentPage.value,
      perPage: pageSize,
      search: searchQuery.value,
      classId: classFilter.value,
      paymentStatus: statusFilter.value,
    })

    paymentRows.value = (response.items || []).map(mapPayment)
    pagination.value = response.pagination || pagination.value
  } catch (error) {
    paymentRows.value = []
    errorMessage.value = error?.message || t('preschoolPaymentManagementPage.messages.loadFailed')
  } finally {
    loading.value = false
  }
}

function clearFilters() {
  searchQuery.value = ''
  classFilter.value = ''
  statusFilter.value = ''
}

function openCreateModal() {
  modalMode.value = 'create'
  selectedPayment.value = null
  form.student_id = ''
  form.class_id = ''
  form.payment_reference = ''
  form.amount = ''
  form.currency = 'USD'
  form.payment_method = 'cash'
  form.payment_status = 'pending'
  form.paid_at = ''
  form.due_date = ''
  form.note = ''
  modalOpen.value = true
}

function openEditModal(row) {
  modalMode.value = 'edit'
  selectedPayment.value = row
  form.student_id = row.studentId || row.student_id || ''
  form.class_id = row.classId || row.class_id || ''
  form.payment_reference = row.paymentReference || row.payment_reference || ''
  form.amount = row.amount || ''
  form.currency = row.currency || 'USD'
  form.payment_method = row.paymentMethod || 'cash'
  form.payment_status = row.paymentStatus || 'pending'
  form.paid_at = row.paidAt || ''
  form.due_date = row.dueDate || ''
  form.note = row.note || ''
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  paymentSaving.value = false
}

function normalizePayload() {
  return {
    student_id: form.student_id,
    class_id: form.class_id,
    payment_reference: form.payment_reference.trim(),
    amount: Number(form.amount || 0),
    currency: form.currency,
    payment_method: form.payment_method,
    payment_status: form.payment_status,
    paid_at: form.paid_at || null,
    due_date: form.due_date || null,
    note: form.note.trim(),
  }
}

async function onSavePayment() {
  paymentSaving.value = true
  errorMessage.value = ''

  try {
    const payload = normalizePayload()
    if (modalMode.value === 'edit' && selectedPayment.value?.id) {
      await updatePreschoolPayment(selectedPayment.value.id, payload)
      successMessage.value = t('preschoolPaymentManagementPage.messages.updateSuccess')
    } else {
      await createPreschoolPayment(payload)
      successMessage.value = t('preschoolPaymentManagementPage.messages.createSuccess')
    }

    showSuccess.value = true
    closeModal()
    await loadPayments()
  } catch (error) {
    errorMessage.value = error?.message || t('preschoolPaymentManagementPage.messages.saveFailed')
  } finally {
    paymentSaving.value = false
  }
}

function onViewPayment(row) {
  openEditModal(row)
}

function onEditPayment(row) {
  openEditModal(row)
}

function onDeletePayment(row) {
  selectedPayment.value = row
  isDeleteOpen.value = true
}

function onCancelDelete() {
  isDeleteOpen.value = false
  selectedPayment.value = null
}

async function onConfirmDelete() {
  try {
    await deletePreschoolPayment(selectedPayment.value?.id)
    successMessage.value = t('preschoolPaymentManagementPage.messages.deleteSuccess')
    showSuccess.value = true
    onCancelDelete()
    await loadPayments()
  } catch (error) {
    errorMessage.value = error?.message || t('preschoolPaymentManagementPage.messages.saveFailed')
  }
}

watch([searchQuery, classFilter, statusFilter], () => {
  currentPage.value = 1
  loadPayments()
})

watch(currentPage, () => {
  loadPayments()
})

onMounted(async () => {
  await Promise.all([loadClasses(), loadStudents(), loadPayments()])
})
</script>

<template>
  <MainLayout>
    <section class="payment-management-page">
      <HeaderSection
        :title="t('preschoolPaymentManagementPage.title')"
        :subtitle="t('preschoolPaymentManagementPage.subtitle')"
      />

      <PaymentSummaryCards :cards="summaryCards" />

      <div class="payment-management-page__panel">
        <PaymentToolbar
          :eyebrow="t('preschoolPaymentManagementPage.toolbar.eyebrow')"
          :title="visibleRangeLabel"
          :clear-label="t('preschoolPaymentManagementPage.toolbar.clear')"
          :add-label="t('preschoolPaymentManagementPage.toolbar.add')"
          @clear="clearFilters"
          @add="openCreateModal"
        />

        <PaymentFilters
          v-model:searchQuery="searchQuery"
          v-model:classFilter="classFilter"
          v-model:statusFilter="statusFilter"
          :class-options="classOptions"
          :status-options="statusOptions"
          :search-placeholder="t('preschoolPaymentManagementPage.searchPlaceholder')"
          :all-classes-label="t('common.allClasses')"
          :all-status-label="t('common.allStatus')"
        />

        <div
          v-if="errorMessage"
          class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {{ errorMessage }}
        </div>

        <PaymentTable
          :payments="paymentRows"
          :columns="tableColumns"
          :loading="loading"
          :empty-text="t('preschoolPaymentManagementPage.messages.noResults')"
          @view="onViewPayment"
          @edit="onEditPayment"
          @delete="onDeletePayment"
        />

        <div v-if="pagination.totalPages > 1" class="flex justify-end">
          <Pagination v-model="currentPage" :total-pages="pagination.totalPages" class="mt-2" />
        </div>
      </div>
    </section>

    <Dialog v-model:visible="modalOpen" :header="modalMode === 'edit' ? t('preschoolPaymentManagementPage.dialog.editTitle') : t('preschoolPaymentManagementPage.dialog.createTitle')" modal class="payment-management-page__dialog">
      <div class="payment-management-page__dialog-grid">
        <select v-model="form.student_id" class="payment-management-page__input">
          <option value="">{{ t('preschoolPaymentManagementPage.dialog.student') }}</option>
          <option v-for="option in studentOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <select v-model="form.class_id" class="payment-management-page__input">
          <option value="">{{ t('preschoolPaymentManagementPage.dialog.class') }}</option>
          <option v-for="option in classOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <input v-model="form.payment_reference" class="payment-management-page__input" type="text" :placeholder="t('preschoolPaymentManagementPage.dialog.reference')" />
        <input v-model="form.amount" class="payment-management-page__input" type="number" step="0.01" min="0" :placeholder="t('preschoolPaymentManagementPage.dialog.amount')" />
        <input v-model="form.currency" class="payment-management-page__input" type="text" :placeholder="t('preschoolPaymentManagementPage.dialog.currency')" />
        <select v-model="form.payment_method" class="payment-management-page__input">
          <option v-for="method in methodOptions" :key="method.value" :value="method.value">
            {{ method.label }}
          </option>
        </select>
        <select v-model="form.payment_status" class="payment-management-page__input">
          <option v-for="status in statusOptions" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
        <input v-model="form.paid_at" class="payment-management-page__input" type="date" />
        <input v-model="form.due_date" class="payment-management-page__input" type="date" />
        <textarea v-model="form.note" class="payment-management-page__input payment-management-page__dialog-full" rows="3" :placeholder="t('preschoolPaymentManagementPage.dialog.note')"></textarea>
      </div>

      <template #footer>
        <Button type="button" variant="outline" rounded="xl" @click="closeModal">{{ t('preschoolPaymentManagementPage.dialog.cancel') }}</Button>
        <Button type="button" variant="primary" rounded="xl" :loading="paymentSaving" :disabled="paymentSaving" @click="onSavePayment">
          {{ t('preschoolPaymentManagementPage.dialog.save') }}
        </Button>
      </template>
    </Dialog>

    <AlertQuestion
      :show="isDeleteOpen"
      :title="t('preschoolPaymentManagementPage.alerts.deleteTitle')"
      :message="t('preschoolPaymentManagementPage.alerts.deleteMessage', { name: selectedPayment?.studentName || t('preschoolPaymentManagementPage.alerts.deleteFallback') })"
      :confirm-text="t('common.delete')"
      :cancel-text="t('common.cancel')"
      type="danger"
      @confirm="onConfirmDelete"
      @cancel="onCancelDelete"
    />

    <AlertSuccess
      :show="showSuccess"
      :title="t('preschoolPaymentManagementPage.alerts.successTitle')"
      :message="successMessage"
      :button-text="t('preschoolPaymentManagementPage.alerts.close')"
      @close="showSuccess = false"
    />
  </MainLayout>
</template>

<style scoped>
.payment-management-page {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.payment-management-page__panel {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid #dce6f2;
  background:
    radial-gradient(circle at top left, rgba(186, 230, 253, 0.18), transparent 24%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%);
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.5);
}

.payment-management-page__dialog-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  min-width: min(100vw - 2rem, 48rem);
}

.payment-management-page__dialog-full {
  grid-column: 1 / -1;
}

.payment-management-page__input {
  width: 100%;
  min-height: 2.7rem;
  border-radius: 0.8rem;
  border: 1px solid #d4dde8;
  background: #fcfdff;
  padding: 0.6rem 0.8rem;
  color: #0f172a;
}

@media (max-width: 640px) {
  .payment-management-page__panel {
    padding: 1.1rem;
  }
}

@media (max-width: 900px) {
  .payment-management-page__dialog-grid {
    grid-template-columns: 1fr;
    min-width: 0;
  }
}
</style>

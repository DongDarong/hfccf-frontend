<script setup>
import { computed, ref, watch } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Pagination from '@/components/data-display/Pagination.vue'
import AlertQuestion from '@/components/alerts/AlertQuestion.vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'
import PaymentFilters from '@/modules/preschool/admin/components/payment-management/PaymentFilters.vue'
import PaymentSummaryCards from '@/modules/preschool/admin/components/payment-management/PaymentSummaryCards.vue'
import PaymentTable from '@/modules/preschool/admin/components/payment-management/PaymentTable.vue'
import PaymentToolbar from '@/modules/preschool/admin/components/payment-management/PaymentToolbar.vue'

defineOptions({
  name: 'PreschoolAdminPaymentManagementPage',
})

const paymentRows = ref([
  {
    id: 'pay-001',
    student: 'Sok Dara',
    className: 'Morning Nursery',
    guardian: 'Chan Srey',
    amount: 45,
    currency: 'USD',
    method: 'Cash',
    dueDate: '2026-05-10',
    paidAt: '2026-05-07',
    status: 'Paid',
  },
  {
    id: 'pay-002',
    student: 'Malis Nita',
    className: 'Kindergarten A Blue',
    guardian: 'Sok Vannak',
    amount: 45,
    currency: 'USD',
    method: 'Mobile Payment',
    dueDate: '2026-05-12',
    paidAt: '',
    status: 'Pending',
  },
  {
    id: 'pay-003',
    student: 'Rina Pov',
    className: 'Kindergarten B Red',
    guardian: 'Pich Dara',
    amount: 50,
    currency: 'USD',
    method: 'Bank Transfer',
    dueDate: '2026-05-03',
    paidAt: '',
    status: 'Overdue',
  },
  {
    id: 'pay-004',
    student: 'Vanna Lim',
    className: 'Prep Readiness Group',
    guardian: 'Mean Sophea',
    amount: 50,
    currency: 'USD',
    method: 'Cash',
    dueDate: '2026-05-18',
    paidAt: '',
    status: 'Pending',
  },
  {
    id: 'pay-005',
    student: 'Srey Roth',
    className: 'Afternoon Nursery',
    guardian: 'Kim Sokha',
    amount: 45,
    currency: 'USD',
    method: 'Cash',
    dueDate: '2026-05-05',
    paidAt: '2026-05-04',
    status: 'Paid',
  },
])

const searchQuery = ref('')
const classFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const selectedPayment = ref(null)
const isDeleteOpen = ref(false)
const showSuccess = ref(false)
const successMessage = ref('')
const pageSize = 6

const classOptions = ['Morning Nursery', 'Kindergarten A Blue', 'Kindergarten B Red', 'Prep Readiness Group', 'Afternoon Nursery']
const statusOptions = ['Paid', 'Pending', 'Overdue', 'Cancelled']
const tableColumns = [
  { key: 'number', label: 'No.', align: 'left' },
  { key: 'student', label: 'Student', align: 'left' },
  { key: 'className', label: 'Class', align: 'left' },
  { key: 'amountLabel', label: 'Amount', align: 'left' },
  { key: 'method', label: 'Method', align: 'left' },
  { key: 'dueDate', label: 'Due Date', align: 'left' },
  { key: 'status', label: 'Status', align: 'left' },
  { key: 'actions', label: 'Actions', align: 'right' },
]

function normalize(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
}

function formatMoney(row) {
  return `${Number(row.amount || 0).toFixed(2)} ${row.currency || 'USD'}`
}

const filteredPayments = computed(() => {
  const query = normalize(searchQuery.value)

  return paymentRows.value.filter((row) => {
    let isMatch = true

    if (query) {
      const haystack = normalize(
        `${row.id} ${row.student} ${row.className} ${row.guardian} ${row.method} ${row.status}`,
      )
      isMatch = haystack.includes(query)
    }

    if (isMatch && classFilter.value) {
      isMatch = normalize(row.className) === normalize(classFilter.value)
    }

    if (isMatch && statusFilter.value) {
      isMatch = normalize(row.status) === normalize(statusFilter.value)
    }

    return isMatch
  })
})

const totalPages = computed(() => Math.max(Math.ceil(filteredPayments.value.length / pageSize), 1))
const paginatedPayments = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredPayments.value.slice(start, start + pageSize).map((row, index) => ({
    ...row,
    rowNumber: start + index + 1,
    amountLabel: formatMoney(row),
  }))
})

const paidAmount = computed(() =>
  paymentRows.value
    .filter((row) => normalize(row.status) === 'paid')
    .reduce((sum, row) => sum + Number(row.amount || 0), 0),
)
const pendingCount = computed(
  () => paymentRows.value.filter((row) => normalize(row.status) === 'pending').length,
)
const overdueCount = computed(
  () => paymentRows.value.filter((row) => normalize(row.status) === 'overdue').length,
)

const summaryCards = computed(() => [
  {
    id: 'total',
    label: 'Total Records',
    value: paymentRows.value.length,
    tone: 'info',
    icon: 'pi pi-receipt',
  },
  {
    id: 'paid',
    label: 'Collected',
    value: `$${paidAmount.value.toFixed(2)}`,
    tone: 'success',
    icon: 'pi pi-check-circle',
  },
  {
    id: 'pending',
    label: 'Pending',
    value: pendingCount.value,
    tone: 'warning',
    icon: 'pi pi-clock',
  },
  {
    id: 'overdue',
    label: 'Overdue',
    value: overdueCount.value,
    tone: 'danger',
    icon: 'pi pi-exclamation-triangle',
  },
])

const visibleRangeLabel = computed(() => {
  if (!filteredPayments.value.length) return 'No payment records found.'
  const start = (currentPage.value - 1) * pageSize + 1
  const end = Math.min(currentPage.value * pageSize, filteredPayments.value.length)
  return `Showing ${start}-${end} of ${filteredPayments.value.length} payment records`
})

watch(
  () => filteredPayments.value.length,
  () => {
    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
  },
)

watch([searchQuery, classFilter, statusFilter], () => {
  currentPage.value = 1
})

function clearFilters() {
  searchQuery.value = ''
  classFilter.value = ''
  statusFilter.value = ''
}

function onViewPayment(row) {
  successMessage.value = `${row.student} payment is ${row.status}.`
  showSuccess.value = true
}

function onEditPayment(row) {
  selectedPayment.value = row
  successMessage.value = `${row.student} payment is ready to edit.`
  showSuccess.value = true
}

function onDeletePayment(row) {
  selectedPayment.value = row
  isDeleteOpen.value = true
}

function onCancelDelete() {
  isDeleteOpen.value = false
  selectedPayment.value = null
}

function onConfirmDelete() {
  const id = String(selectedPayment.value?.id || '')
  paymentRows.value = paymentRows.value.filter((row) => row.id !== id)
  successMessage.value = 'Payment record deleted successfully.'
  showSuccess.value = true
  onCancelDelete()
}
</script>

<template>
  <MainLayout>
    <section class="payment-management-page">
      <HeaderSection
        title="Payment Management"
        subtitle="Track preschool tuition payments, pending balances, and overdue records."
      />

      <PaymentSummaryCards :cards="summaryCards" />

      <div class="payment-management-page__panel">
        <PaymentToolbar
          eyebrow="Preschool Payments"
          :title="visibleRangeLabel"
          clear-label="Clear"
          @clear="clearFilters"
        />

        <PaymentFilters
          v-model:searchQuery="searchQuery"
          v-model:classFilter="classFilter"
          v-model:statusFilter="statusFilter"
          :class-options="classOptions"
          :status-options="statusOptions"
          search-placeholder="Search by student, guardian, class, or payment id"
        />

        <PaymentTable
          :payments="paginatedPayments"
          :columns="tableColumns"
          empty-text="No preschool payment records found."
          @view="onViewPayment"
          @edit="onEditPayment"
          @delete="onDeletePayment"
        />

        <div v-if="totalPages > 1" class="flex justify-end">
          <Pagination v-model="currentPage" :total-pages="totalPages" class="mt-2" />
        </div>
      </div>
    </section>

    <AlertQuestion
      :show="isDeleteOpen"
      title="Delete payment?"
      :message="`Delete ${selectedPayment?.student || 'this payment'} record? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      type="danger"
      @confirm="onConfirmDelete"
      @cancel="onCancelDelete"
    />

    <AlertSuccess
      :show="showSuccess"
      title="Success"
      :message="successMessage"
      button-text="Close"
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

@media (max-width: 640px) {
  .payment-management-page__panel {
    padding: 1.1rem;
  }
}
</style>

<script setup>
// Classroom Resources — tracks books, toys, equipment, and supplies for each
// preschool classroom. State is held in-memory until a backend endpoint exists.
import { computed, reactive, ref } from 'vue'
import Dialog from 'primevue/dialog'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Table from '@/components/data-display/Table.vue'
import Button from '@/components/buttons/Button.vue'
import AlertQuestion from '@/components/alerts/AlertQuestion.vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'PreschoolAdminClassroomResourcesPage',
})

const { t } = useLanguage()

// ── filters ──────────────────────────────────────────────────────────────────
const searchQuery = ref('')
const categoryFilter = ref('')
const conditionFilter = ref('')

// ── modal state ───────────────────────────────────────────────────────────────
const modalOpen = ref(false)
const modalMode = ref('create')
const saving = ref(false)
const editingId = ref(null)

// ── alert state ───────────────────────────────────────────────────────────────
const showSuccess = ref(false)
const successMessage = ref('')
const deleteTarget = ref(null)
const deleteOpen = ref(false)

// ── form ──────────────────────────────────────────────────────────────────────
const form = reactive({
  name: '',
  category: '',
  quantity: 0,
  condition: 'good',
  notes: '',
})

const formError = ref('')

// ── resource list (in-memory until API is available) ─────────────────────────
let nextId = 1
const resources = ref([])

// ── options ───────────────────────────────────────────────────────────────────
const categoryOptions = computed(() => [
  { label: t('preschoolClassroomResources.categories.books'), value: 'books' },
  { label: t('preschoolClassroomResources.categories.toys'), value: 'toys' },
  { label: t('preschoolClassroomResources.categories.equipment'), value: 'equipment' },
  { label: t('preschoolClassroomResources.categories.supplies'), value: 'supplies' },
  { label: t('preschoolClassroomResources.categories.digital'), value: 'digital' },
])

const conditionOptions = computed(() => [
  { label: t('preschoolClassroomResources.conditions.good'), value: 'good' },
  { label: t('preschoolClassroomResources.conditions.fair'), value: 'fair' },
  { label: t('preschoolClassroomResources.conditions.poor'), value: 'poor' },
])

// ── table columns ─────────────────────────────────────────────────────────────
const tableColumns = computed(() => [
  { key: 'number', label: t('preschoolClassroomResources.columns.no'), align: 'left' },
  { key: 'name', label: t('preschoolClassroomResources.columns.name'), align: 'left' },
  { key: 'categoryLabel', label: t('preschoolClassroomResources.columns.category'), align: 'left' },
  { key: 'quantity', label: t('preschoolClassroomResources.columns.quantity'), align: 'left' },
  { key: 'conditionLabel', label: t('preschoolClassroomResources.columns.condition'), align: 'left' },
  { key: 'notes', label: t('preschoolClassroomResources.columns.notes'), align: 'left' },
  { key: 'actions', label: t('preschoolClassroomResources.columns.actions'), align: 'right' },
])

// ── derived data ──────────────────────────────────────────────────────────────
const filteredResources = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return resources.value.filter((r) => {
    const matchesSearch = !q || r.name.toLowerCase().includes(q) || r.notes.toLowerCase().includes(q)
    const matchesCategory = !categoryFilter.value || r.category === categoryFilter.value
    const matchesCondition = !conditionFilter.value || r.condition === conditionFilter.value
    return matchesSearch && matchesCategory && matchesCondition
  })
})

const mappedResources = computed(() =>
  filteredResources.value.map((r, i) => ({
    ...r,
    number: i + 1,
    categoryLabel: t(`preschoolClassroomResources.categories.${r.category}`),
    conditionLabel: t(`preschoolClassroomResources.conditions.${r.condition}`),
    notes: r.notes || '—',
  })),
)

// ── summary counts ────────────────────────────────────────────────────────────
const summaryTotal = computed(() => resources.value.length)
const summaryGood = computed(() => resources.value.filter((r) => r.condition === 'good').length)
const summaryAttention = computed(() => resources.value.filter((r) => r.condition !== 'good').length)

// ── form helpers ──────────────────────────────────────────────────────────────
function resetForm() {
  form.name = ''
  form.category = 'books'
  form.quantity = 0
  form.condition = 'good'
  form.notes = ''
  formError.value = ''
}

function validateForm() {
  if (!form.name.trim()) {
    formError.value = t('preschoolClassroomResources.messages.nameMissing')
    return false
  }
  if (form.quantity < 0) {
    formError.value = t('preschoolClassroomResources.messages.quantityInvalid')
    return false
  }
  formError.value = ''
  return true
}

// ── modal actions ─────────────────────────────────────────────────────────────
function openCreateModal() {
  modalMode.value = 'create'
  editingId.value = null
  resetForm()
  modalOpen.value = true
}

function openEditModal(resource) {
  modalMode.value = 'edit'
  editingId.value = resource.id
  form.name = resource.name
  form.category = resource.category
  form.quantity = resource.quantity
  form.condition = resource.condition
  form.notes = resource.notes === '—' ? '' : resource.notes
  formError.value = ''
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  editingId.value = null
  saving.value = false
}

function onSave() {
  if (!validateForm()) return

  saving.value = true
  if (modalMode.value === 'edit') {
    // Update existing entry in-place
    const idx = resources.value.findIndex((r) => r.id === editingId.value)
    if (idx !== -1) {
      resources.value[idx] = { ...resources.value[idx], ...form }
    }
    successMessage.value = t('preschoolClassroomResources.messages.updateSuccess')
  } else {
    // Append new entry with a stable local id
    resources.value.push({ id: nextId++, ...form })
    successMessage.value = t('preschoolClassroomResources.messages.createSuccess')
  }
  saving.value = false
  showSuccess.value = true
  closeModal()
}

// ── delete actions ────────────────────────────────────────────────────────────
function onDelete(resource) {
  // Use the original row from resources, not the mapped copy
  deleteTarget.value = resources.value.find((r) => r.id === resource.id) ?? resource
  deleteOpen.value = true
}

function confirmDelete() {
  resources.value = resources.value.filter((r) => r.id !== deleteTarget.value?.id)
  successMessage.value = t('preschoolClassroomResources.messages.deleteSuccess')
  showSuccess.value = true
  deleteOpen.value = false
  deleteTarget.value = null
}
</script>

<template>
  <MainLayout>
    <section class="classroom-resources">
      <HeaderSection
        :title="t('preschoolClassroomResources.title')"
        :subtitle="t('preschoolClassroomResources.subtitle')"
      />

      <!-- summary strip -->
      <div class="classroom-resources__summary">
        <div class="classroom-resources__summary-card">
          <span class="classroom-resources__summary-value">{{ summaryTotal }}</span>
          <span class="classroom-resources__summary-label">{{ t('preschoolClassroomResources.summary.total') }}</span>
        </div>
        <div class="classroom-resources__summary-card classroom-resources__summary-card--good">
          <span class="classroom-resources__summary-value">{{ summaryGood }}</span>
          <span class="classroom-resources__summary-label">{{ t('preschoolClassroomResources.summary.goodCondition') }}</span>
        </div>
        <div class="classroom-resources__summary-card classroom-resources__summary-card--warn">
          <span class="classroom-resources__summary-value">{{ summaryAttention }}</span>
          <span class="classroom-resources__summary-label">{{ t('preschoolClassroomResources.summary.needsAttention') }}</span>
        </div>
      </div>

      <!-- main panel -->
      <div class="classroom-resources__panel">

        <!-- toolbar -->
        <div class="classroom-resources__toolbar">
          <Button type="button" variant="primary" size="md" rounded="xl" @click="openCreateModal">
            {{ t('preschoolClassroomResources.addButton') }}
          </Button>
        </div>

        <!-- filters -->
        <div class="classroom-resources__filters">
          <input
            v-model="searchQuery"
            class="classroom-resources__input"
            type="search"
            :placeholder="t('preschoolClassroomResources.searchPlaceholder')"
          />
          <select v-model="categoryFilter" class="classroom-resources__input">
            <option value="">{{ t('preschoolClassroomResources.filters.allCategories') }}</option>
            <option v-for="opt in categoryOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
          <select v-model="conditionFilter" class="classroom-resources__input">
            <option value="">{{ t('preschoolClassroomResources.filters.allConditions') }}</option>
            <option v-for="opt in conditionOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>

        <!-- resource table -->
        <Table
          :rows="mappedResources"
          :columns="tableColumns"
          :loading="false"
          :empty-text="searchQuery || categoryFilter || conditionFilter
            ? t('preschoolClassroomResources.messages.noResults')
            : t('preschoolClassroomResources.messages.empty')"
          @edit="openEditModal"
          @delete="onDelete"
        />
      </div>
    </section>

    <!-- add / edit dialog -->
    <Dialog
      v-model:visible="modalOpen"
      :header="modalMode === 'edit'
        ? t('preschoolClassroomResources.dialog.editTitle')
        : t('preschoolClassroomResources.dialog.createTitle')"
      modal
      class="classroom-resources__dialog"
    >
      <div class="classroom-resources__form">

        <!-- name -->
        <div class="classroom-resources__field">
          <label class="classroom-resources__label">{{ t('preschoolClassroomResources.dialog.name') }}</label>
          <input
            v-model="form.name"
            class="classroom-resources__input"
            type="text"
            :placeholder="t('preschoolClassroomResources.dialog.namePlaceholder')"
          />
        </div>

        <!-- category + condition side by side -->
        <div class="classroom-resources__row">
          <div class="classroom-resources__field">
            <label class="classroom-resources__label">{{ t('preschoolClassroomResources.dialog.category') }}</label>
            <select v-model="form.category" class="classroom-resources__input">
              <option v-for="opt in categoryOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
          <div class="classroom-resources__field">
            <label class="classroom-resources__label">{{ t('preschoolClassroomResources.dialog.condition') }}</label>
            <select v-model="form.condition" class="classroom-resources__input">
              <option v-for="opt in conditionOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- quantity -->
        <div class="classroom-resources__field">
          <label class="classroom-resources__label">{{ t('preschoolClassroomResources.dialog.quantity') }}</label>
          <input
            v-model.number="form.quantity"
            class="classroom-resources__input"
            type="number"
            min="0"
          />
        </div>

        <!-- notes -->
        <div class="classroom-resources__field">
          <label class="classroom-resources__label">{{ t('preschoolClassroomResources.dialog.notes') }}</label>
          <textarea
            v-model="form.notes"
            class="classroom-resources__input"
            rows="3"
            :placeholder="t('preschoolClassroomResources.dialog.notesPlaceholder')"
          />
        </div>

        <!-- inline validation error -->
        <p v-if="formError" class="classroom-resources__form-error">{{ formError }}</p>
      </div>

      <template #footer>
        <Button type="button" variant="outline" rounded="xl" @click="closeModal">
          {{ t('preschoolClassroomResources.dialog.cancel') }}
        </Button>
        <Button type="button" variant="primary" rounded="xl" :loading="saving" :disabled="saving" @click="onSave">
          {{ t('preschoolClassroomResources.dialog.save') }}
        </Button>
      </template>
    </Dialog>

    <!-- delete confirmation -->
    <AlertQuestion
      :show="deleteOpen"
      :title="t('preschoolClassroomResources.alerts.deleteTitle')"
      :message="t('preschoolClassroomResources.alerts.deleteMessage', {
        name: deleteTarget?.name || t('preschoolClassroomResources.alerts.deleteFallback'),
      })"
      :confirm-text="t('common.delete')"
      :cancel-text="t('common.cancel')"
      type="danger"
      @confirm="confirmDelete"
      @cancel="deleteOpen = false"
    />

    <!-- success notification -->
    <AlertSuccess
      :show="showSuccess"
      :title="t('preschoolClassroomResources.alerts.successTitle')"
      :message="successMessage"
      :button-text="t('preschoolClassroomResources.alerts.close')"
      @close="showSuccess = false"
    />
  </MainLayout>
</template>

<style scoped>
.classroom-resources {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

/* summary strip */
.classroom-resources__summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.classroom-resources__summary-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  padding: 1rem 1.25rem;
  border-radius: 1.25rem;
  border: 1px solid #dce6f2;
  background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%);
}

.classroom-resources__summary-card--good {
  border-color: #bbf7d0;
  background: linear-gradient(180deg, rgba(240,253,244,0.95) 0%, rgba(220,252,231,0.6) 100%);
}

.classroom-resources__summary-card--warn {
  border-color: #fde68a;
  background: linear-gradient(180deg, rgba(255,251,235,0.95) 0%, rgba(254,243,199,0.6) 100%);
}

.classroom-resources__summary-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
}

.classroom-resources__summary-label {
  font-size: 0.75rem;
  color: #64748b;
  text-align: center;
}

/* main panel */
.classroom-resources__panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid #dce6f2;
  background:
    radial-gradient(circle at top left, rgba(186, 230, 253, 0.18), transparent 24%),
    linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%);
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.5);
}

.classroom-resources__toolbar {
  display: flex;
  justify-content: flex-end;
}

.classroom-resources__filters {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 0.75rem;
}

/* shared input style */
.classroom-resources__input {
  width: 100%;
  min-height: 2.7rem;
  border-radius: 0.8rem;
  border: 1px solid #d4dde8;
  background: #fcfdff;
  padding: 0.6rem 0.8rem;
  color: #0f172a;
  font-size: 0.875rem;
}

/* dialog form */
.classroom-resources__form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-width: min(100vw - 2rem, 30rem);
}

.classroom-resources__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.classroom-resources__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.classroom-resources__label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #475569;
}

.classroom-resources__form-error {
  font-size: 0.8rem;
  color: #e11d48;
  margin: 0;
}

@media (max-width: 768px) {
  .classroom-resources__filters,
  .classroom-resources__summary {
    grid-template-columns: 1fr;
  }

  .classroom-resources__row {
    grid-template-columns: 1fr;
  }
}
</style>

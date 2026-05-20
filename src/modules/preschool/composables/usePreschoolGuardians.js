// Keep guardian CRUD state in one composable so the admin page can manage
// reusable contacts without inlining HTTP or mutation logic in the template.
// Keep fallback copy in the locale layer so EN/KH guardian errors stay aligned
// instead of drifting into hardcoded English-only runtime messages.
import { reactive, ref } from 'vue'
import { useLanguage } from '@/composables/useLanguage'
import {
  archiveGuardian,
  createGuardian,
  fetchGuardians,
  updateGuardian,
} from '@/modules/preschool/services/api/preschoolGuardianApi'

function normalizeText(value) {
  return String(value ?? '').trim()
}

function createDefaultGuardianForm() {
  return {
    full_name: '',
    phone: '',
    secondary_phone: '',
    email: '',
    address: '',
    occupation: '',
    national_id: '',
    status: 'active',
    notes: '',
  }
}

export function usePreschoolGuardians() {
  const { t } = useLanguage()
  const loading = ref(false)
  const saving = ref(false)
  const errorMessage = ref('')
  const guardians = ref([])
  const pagination = ref({ page: 1, perPage: 10, total: 0, totalPages: 1 })
  const searchQuery = ref('')
  const selectedStatus = ref('')
  const currentPage = ref(1)
  const selectedGuardian = ref(null)
  const dialogOpen = ref(false)
  const dialogMode = ref('create')
  const guardianForm = reactive(createDefaultGuardianForm())

  function resetGuardianForm() {
    Object.assign(guardianForm, createDefaultGuardianForm())
  }

  function openCreateGuardian() {
    dialogMode.value = 'create'
    selectedGuardian.value = null
    resetGuardianForm()
    dialogOpen.value = true
  }

  function openEditGuardian(guardian) {
    dialogMode.value = 'edit'
    selectedGuardian.value = guardian || null
    Object.assign(guardianForm, createDefaultGuardianForm(), {
      full_name: guardian?.fullName || '',
      phone: guardian?.phone || '',
      secondary_phone: guardian?.secondaryPhone || '',
      email: guardian?.email || '',
      address: guardian?.address || '',
      occupation: guardian?.occupation || '',
      national_id: guardian?.nationalId || '',
      status: guardian?.status || 'active',
      notes: guardian?.notes || '',
    })
    dialogOpen.value = true
  }

  function closeGuardianDialog() {
    dialogOpen.value = false
    selectedGuardian.value = null
    resetGuardianForm()
  }

  async function loadGuardians(params = {}) {
    loading.value = true
    errorMessage.value = ''

    try {
      const response = await fetchGuardians({
        page: params.page ?? currentPage.value,
        perPage: params.perPage ?? pagination.value.perPage ?? 10,
        search: params.search ?? searchQuery.value,
        status: params.status ?? selectedStatus.value,
      })

      guardians.value = response.items || []
      pagination.value = response.pagination || pagination.value
    } catch (error) {
      guardians.value = []
      pagination.value = { page: 1, perPage: 10, total: 0, totalPages: 1 }
      errorMessage.value = error?.message || t('preschoolGuardiansPage.errors.load')
    } finally {
      loading.value = false
    }
  }

  async function saveGuardian() {
    saving.value = true
    errorMessage.value = ''

    try {
      const payload = {
        full_name: normalizeText(guardianForm.full_name),
        phone: normalizeText(guardianForm.phone),
        secondary_phone: normalizeText(guardianForm.secondary_phone) || null,
        email: normalizeText(guardianForm.email) || null,
        address: normalizeText(guardianForm.address) || null,
        occupation: normalizeText(guardianForm.occupation) || null,
        national_id: normalizeText(guardianForm.national_id) || null,
        status: normalizeText(guardianForm.status) || 'active',
        notes: normalizeText(guardianForm.notes) || null,
      }

      const guardian = dialogMode.value === 'edit' && selectedGuardian.value?.id
        ? await updateGuardian(selectedGuardian.value.id, payload)
        : await createGuardian(payload)

      await loadGuardians()
      closeGuardianDialog()

      return guardian
    } catch (error) {
      errorMessage.value = error?.response?.data?.message || error?.message || t('preschoolGuardiansPage.errors.save')
      throw error
    } finally {
      saving.value = false
    }
  }

  async function archiveSelectedGuardian(guardianId = selectedGuardian.value?.id) {
    const id = String(guardianId || '').trim()
    if (!id) return false

    saving.value = true
    errorMessage.value = ''

    try {
      const result = await archiveGuardian(id)
      await loadGuardians()
      return result
    } catch (error) {
      errorMessage.value = error?.response?.data?.message || error?.message || t('preschoolGuardiansPage.errors.archive')
      throw error
    } finally {
      saving.value = false
    }
  }

  function setSearchQuery(value) {
    searchQuery.value = String(value ?? '')
  }

  function setSelectedStatus(value) {
    selectedStatus.value = String(value ?? '')
  }

  function setCurrentPage(value) {
    currentPage.value = Math.max(Number(value) || 1, 1)
  }

  return {
    archiveSelectedGuardian,
    closeGuardianDialog,
    currentPage,
    dialogMode,
    dialogOpen,
    errorMessage,
    guardianForm,
    guardians,
    loadGuardians,
    loading,
    openCreateGuardian,
    openEditGuardian,
    pagination,
    saveGuardian,
    saving,
    searchQuery,
    selectedGuardian,
    selectedStatus,
    setCurrentPage,
    setSearchQuery,
    setSelectedStatus,
  }
}

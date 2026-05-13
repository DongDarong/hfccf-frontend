import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { deleteAdminUser, listAdminUsers } from '@/modules/super-admin/services/adminUsersApi'
import {
  buildStatusBadges,
  buildSummaryCards,
  filterAdmins,
  paginateAdmins,
} from '@/modules/super-admin/utils/adminManagement.helpers'

/**
 * Encapsulate the page state so the ManageAdmins view stays focused on layout only.
 */
export function useAdminManagement({ pageSize = 10 } = {}) {
  const { t } = useI18n()

  const admins = ref([])
  const searchQuery = ref('')
  const roleFilter = ref('')
  const statusFilter = ref('')
  const currentPage = ref(1)
  const isLoading = ref(false)
  const isDeleteOpen = ref(false)
  const selectedUserId = ref('')
  const selectedUserName = ref('')
  const showSuccess = ref(false)
  const successMessage = ref('')
  const showError = ref(false)
  const errorMessage = ref('')

  const filteredAdmins = computed(() =>
    filterAdmins(admins.value, {
      searchQuery: searchQuery.value,
      roleFilter: roleFilter.value,
      statusFilter: statusFilter.value,
    }),
  )

  const totalPages = computed(() => Math.max(Math.ceil(filteredAdmins.value.length / pageSize), 1))

  const paginatedAdmins = computed(() =>
    paginateAdmins(filteredAdmins.value, currentPage.value, pageSize),
  )

  const summaryCards = computed(() =>
    buildSummaryCards(t, admins.value, toolbarNote.value, addButtonLabel.value),
  )

  const statusBadges = computed(() => buildStatusBadges(t, filteredAdmins.value))

  const pageTitle = computed(() => t('users.manageAdmins.title'))
  const pageSubtitle = computed(() => t('users.manageAdmins.summary'))
  const searchPlaceholder = computed(() => t('users.manageAdmins.searchPlaceholder'))
  const addButtonLabel = computed(() => t('users.manageAdmins.addButton'))
  const toolbarNote = computed(() => t('users.manageAdmins.toolbarNote'))
  const refreshButtonLabel = computed(() => t('common.refresh'))
  const toolbarCountText = computed(() =>
    t('users.manageAdmins.accountsInView', { count: filteredAdmins.value.length }),
  )
  const tableEmptyText = computed(() => t('users.manageAdmins.tableEmpty'))
  const loadingLabel = computed(() => t('users.manageAdmins.loading'))

  const deleteConfirmTitle = computed(() => t('users.deleteConfirmTitle') || 'Delete admin?')
  const deleteConfirmText = computed(() => t('users.deleteConfirmText') || 'Delete')
  const cancelLabel = computed(() => t('common.cancel') || 'Cancel')
  const deleteConfirmMessage = computed(() => {
    const name = selectedUserName.value || 'this admin'
    const translated = t('users.deleteConfirmMessage', { name })

    return translated !== 'users.deleteConfirmMessage'
      ? translated
      : `Are you sure you want to delete ${name}?`
  })

  /**
   * Load the admin list from the existing API service.
   */
  async function loadAdmins() {
    isLoading.value = true
    showError.value = false
    errorMessage.value = ''

    try {
      admins.value = await listAdminUsers()
    } catch (error) {
      errorMessage.value = error?.message || 'Unable to load admin accounts right now.'
      showError.value = true
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Keep the delete flow identical to the current page behavior.
   */
  async function onConfirmDelete() {
    isLoading.value = true
    showError.value = false
    errorMessage.value = ''

    try {
      await deleteAdminUser(selectedUserId.value)
      admins.value = await listAdminUsers()
      successMessage.value = t('users.manageAdmins.removeSuccess')
      showSuccess.value = true
    } catch (error) {
      errorMessage.value = error?.message || 'Unable to delete admin right now.'
      showError.value = true
    } finally {
      isLoading.value = false
    }

    isDeleteOpen.value = false
    selectedUserId.value = ''
    selectedUserName.value = ''
  }

  /**
   * Open the delete confirmation dialog with the selected admin details.
   */
  function onDeleteAdmin(admin) {
    selectedUserId.value = admin?.id || ''
    selectedUserName.value = admin?.name || ''
    isDeleteOpen.value = true
  }

  /**
   * Close the delete dialog and clear transient selection state.
   */
  function onCancelDelete() {
    isDeleteOpen.value = false
    selectedUserId.value = ''
    selectedUserName.value = ''
  }

  /**
   * Reset the search and filter controls, then return to page one.
   */
  function onClearFilters() {
    searchQuery.value = ''
    roleFilter.value = ''
    statusFilter.value = ''
    currentPage.value = 1
  }

  watch(
    () => filteredAdmins.value.length,
    () => {
      if (currentPage.value > totalPages.value) {
        currentPage.value = totalPages.value
      }
    },
  )

  onMounted(() => {
    void loadAdmins()
  })

  return {
    admins,
    searchQuery,
    roleFilter,
    statusFilter,
    currentPage,
    isLoading,
    isDeleteOpen,
    selectedUserId,
    selectedUserName,
    showSuccess,
    successMessage,
    showError,
    errorMessage,
    pageTitle,
    pageSubtitle,
    searchPlaceholder,
    addButtonLabel,
    toolbarNote,
    refreshButtonLabel,
    toolbarCountText,
    tableEmptyText,
    loadingLabel,
    summaryCards,
    statusBadges,
    filteredAdmins,
    paginatedAdmins,
    totalPages,
    deleteConfirmTitle,
    deleteConfirmText,
    cancelLabel,
    deleteConfirmMessage,
    loadAdmins,
    onConfirmDelete,
    onDeleteAdmin,
    onCancelDelete,
    onClearFilters,
  }
}

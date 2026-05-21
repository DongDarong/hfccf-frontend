import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { usePreschoolGuardianRemediation } from '@/modules/preschool/composables/usePreschoolGuardianRemediation'
import * as remediationApi from '@/modules/preschool/services/api/preschoolGuardianRemediationApi'

vi.mock('@/composables/useLanguage', () => ({
  useLanguage: () => ({ t: (key) => key }),
}))

vi.mock('@/modules/preschool/services/api/preschoolGuardianRemediationApi', () => ({
  fetchRemediationLogs: vi.fn(),
  markIssueReviewed: vi.fn(),
  setPrimaryGuardian: vi.fn(),
  clearInvalidPrimary: vi.fn(),
  clearInvalidEmergencyContact: vi.fn(),
  reconcileLegacyFields: vi.fn(),
  archiveDuplicateCandidate: vi.fn(),
  archiveOrphanGuardian: vi.fn(),
}))

beforeEach(() => vi.clearAllMocks())

describe('usePreschoolGuardianRemediation', () => {
  it('loads remediation logs and updates state', async () => {
    remediationApi.fetchRemediationLogs.mockResolvedValueOnce({
      items: [{ id: 1, action: 'mark_reviewed', issueType: 'student_no_active_guardian' }],
      meta: { currentPage: 1, lastPage: 1, perPage: 25, total: 1 },
    })

    const { loadLogs, loading, logs } = usePreschoolGuardianRemediation()
    const promise = loadLogs()
    expect(loading.value).toBe(true)
    await promise
    await nextTick()

    expect(loading.value).toBe(false)
    expect(logs.value.items).toHaveLength(1)
    expect(logs.value.meta.total).toBe(1)
  })

  it('sets error message when logs load fails', async () => {
    remediationApi.fetchRemediationLogs.mockRejectedValueOnce(new Error('Network error'))

    const { errorMessage, loadLogs } = usePreschoolGuardianRemediation()
    await loadLogs()
    await nextTick()

    expect(errorMessage.value).toBeTruthy()
  })

  it('calls markIssueReviewed API and returns true on success', async () => {
    remediationApi.markIssueReviewed.mockResolvedValueOnce({ id: 10 })

    const { doMarkReviewed } = usePreschoolGuardianRemediation()
    const result = await doMarkReviewed({ issue_type: 'student_no_active_guardian' })

    expect(result).toBe(true)
    expect(remediationApi.markIssueReviewed).toHaveBeenCalledOnce()
  })

  it('sets error and returns false when action fails', async () => {
    remediationApi.clearInvalidPrimary.mockRejectedValueOnce(
      Object.assign(new Error('fail'), { response: { data: { message: 'API error' } } }),
    )

    const { doClearInvalidPrimary, errorMessage } = usePreschoolGuardianRemediation()
    const result = await doClearInvalidPrimary({ relationship_id: 1 })

    expect(result).toBe(false)
    expect(errorMessage.value).toBe('API error')
  })

  it('calls correct API for each action', async () => {
    remediationApi.setPrimaryGuardian.mockResolvedValueOnce({})
    remediationApi.clearInvalidPrimary.mockResolvedValueOnce({})
    remediationApi.clearInvalidEmergencyContact.mockResolvedValueOnce({})
    remediationApi.reconcileLegacyFields.mockResolvedValueOnce({})
    remediationApi.archiveDuplicateCandidate.mockResolvedValueOnce({})
    remediationApi.archiveOrphanGuardian.mockResolvedValueOnce({})

    const {
      doSetPrimary,
      doClearInvalidPrimary,
      doClearInvalidEmergencyContact,
      doReconcileLegacyFields,
      doArchiveDuplicateCandidate,
      doArchiveOrphanGuardian,
    } = usePreschoolGuardianRemediation()

    await doSetPrimary({ student_id: 1, relationship_id: 2 })
    await doClearInvalidPrimary({ relationship_id: 3 })
    await doClearInvalidEmergencyContact({ relationship_id: 4 })
    await doReconcileLegacyFields({ student_id: 5, confirmed: true })
    await doArchiveDuplicateCandidate({ relationship_id: 6 })
    await doArchiveOrphanGuardian({ guardian_id: 7, confirmed: true })

    expect(remediationApi.setPrimaryGuardian).toHaveBeenCalledOnce()
    expect(remediationApi.clearInvalidPrimary).toHaveBeenCalledOnce()
    expect(remediationApi.clearInvalidEmergencyContact).toHaveBeenCalledOnce()
    expect(remediationApi.reconcileLegacyFields).toHaveBeenCalledOnce()
    expect(remediationApi.archiveDuplicateCandidate).toHaveBeenCalledOnce()
    expect(remediationApi.archiveOrphanGuardian).toHaveBeenCalledOnce()
  })

  it('clearMessages resets error and success', () => {
    const { clearMessages, errorMessage, successMessage } = usePreschoolGuardianRemediation()
    errorMessage.value = 'error'
    successMessage.value = 'success'
    clearMessages()
    expect(errorMessage.value).toBe('')
    expect(successMessage.value).toBe('')
  })
})

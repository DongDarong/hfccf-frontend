import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { usePreschoolGuardianGovernance } from '@/modules/preschool/composables/usePreschoolGuardianGovernance'
import * as governanceApi from '@/modules/preschool/services/api/preschoolGuardianGovernanceApi'

vi.mock('@/composables/useLanguage', () => ({
  useLanguage: () => ({ t: (key) => key }),
}))

vi.mock('@/modules/preschool/services/api/preschoolGuardianGovernanceApi', () => ({
  fetchGovernanceIssues: vi.fn(),
  fetchGovernanceIssue: vi.fn(),
  fetchStaleIssues: vi.fn(),
  fetchRecurringIssues: vi.fn(),
  syncGovernanceIssues: vi.fn(),
  acknowledgeIssue: vi.fn(),
  assignIssue: vi.fn(),
  resolveIssue: vi.fn(),
  dismissIssue: vi.fn(),
}))

beforeEach(() => vi.clearAllMocks())

describe('usePreschoolGuardianGovernance', () => {
  it('loads governance issues and updates state', async () => {
    governanceApi.fetchGovernanceIssues.mockResolvedValueOnce({
      items: [{ id: 1, issueType: 'student_no_active_guardian', severity: 'critical', status: 'detected' }],
      meta: { currentPage: 1, lastPage: 1, perPage: 25, total: 1 },
    })

    const { loadIssues, loading, issues } = usePreschoolGuardianGovernance()
    const promise = loadIssues()
    expect(loading.value).toBe(true)
    await promise
    await nextTick()

    expect(loading.value).toBe(false)
    expect(issues.value.items).toHaveLength(1)
    expect(issues.value.meta.total).toBe(1)
  })

  it('sets error message when issues load fails', async () => {
    governanceApi.fetchGovernanceIssues.mockRejectedValueOnce(new Error('Network error'))

    const { errorMessage, loadIssues } = usePreschoolGuardianGovernance()
    await loadIssues()
    await nextTick()

    expect(errorMessage.value).toBeTruthy()
  })

  it('sync returns true and sets success message', async () => {
    governanceApi.syncGovernanceIssues.mockResolvedValueOnce({ created: 3, updated: 1, skipped: 0 })

    const { doSync, successMessage } = usePreschoolGuardianGovernance()
    const result = await doSync()

    expect(result).toBe(true)
    expect(successMessage.value).toBeTruthy()
  })

  it('sync returns false and sets error on failure', async () => {
    governanceApi.syncGovernanceIssues.mockRejectedValueOnce(
      Object.assign(new Error('fail'), { response: { data: { message: 'Sync error' } } }),
    )

    const { doSync, errorMessage } = usePreschoolGuardianGovernance()
    const result = await doSync()

    expect(result).toBe(false)
    expect(errorMessage.value).toBe('Sync error')
  })

  it('acknowledge calls API and returns updated issue', async () => {
    const updated = { id: 5, status: 'acknowledged' }
    governanceApi.acknowledgeIssue.mockResolvedValueOnce(updated)

    const { doAcknowledge } = usePreschoolGuardianGovernance()
    const result = await doAcknowledge(5)

    expect(result).toEqual(updated)
    expect(governanceApi.acknowledgeIssue).toHaveBeenCalledWith(5, {})
  })

  it('assign calls API with payload', async () => {
    const updated = { id: 6, status: 'assigned' }
    governanceApi.assignIssue.mockResolvedValueOnce(updated)

    const { doAssign } = usePreschoolGuardianGovernance()
    const result = await doAssign(6, { assigned_to_user_id: 'usr-01', notes: 'check this' })

    expect(result).toEqual(updated)
    expect(governanceApi.assignIssue).toHaveBeenCalledWith(6, {
      assigned_to_user_id: 'usr-01',
      notes: 'check this',
    })
  })

  it('resolve calls API and sets success', async () => {
    governanceApi.resolveIssue.mockResolvedValueOnce({ id: 7, status: 'resolved' })

    const { doResolve, successMessage } = usePreschoolGuardianGovernance()
    const result = await doResolve(7, { notes: 'Fixed.' })

    expect(result).not.toBeNull()
    expect(successMessage.value).toBeTruthy()
  })

  it('dismiss calls API with notes', async () => {
    governanceApi.dismissIssue.mockResolvedValueOnce({ id: 8, status: 'dismissed' })

    const { doDismiss } = usePreschoolGuardianGovernance()
    await doDismiss(8, { notes: 'Not applicable.' })

    expect(governanceApi.dismissIssue).toHaveBeenCalledWith(8, { notes: 'Not applicable.' })
  })

  it('action failure sets error and returns null', async () => {
    governanceApi.resolveIssue.mockRejectedValueOnce(
      Object.assign(new Error('fail'), { response: { data: { message: 'Cannot resolve' } } }),
    )

    const { doResolve, errorMessage } = usePreschoolGuardianGovernance()
    const result = await doResolve(9, {})

    expect(result).toBeNull()
    expect(errorMessage.value).toBe('Cannot resolve')
  })

  it('clearMessages resets error and success', () => {
    const { clearMessages, errorMessage, successMessage } = usePreschoolGuardianGovernance()
    errorMessage.value = 'error'
    successMessage.value = 'success'
    clearMessages()
    expect(errorMessage.value).toBe('')
    expect(successMessage.value).toBe('')
  })

  it('updates currentIssue after lifecycle action when IDs match', async () => {
    const updated = { id: 10, status: 'acknowledged' }
    governanceApi.acknowledgeIssue.mockResolvedValueOnce(updated)

    const { currentIssue, doAcknowledge } = usePreschoolGuardianGovernance()
    currentIssue.value = { id: 10, status: 'detected' }

    await doAcknowledge(10)
    expect(currentIssue.value.status).toBe('acknowledged')
  })
})

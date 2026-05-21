import http from '@/services/http'
import { unwrapApiData } from '@/services/api'
import {
  normalizeGovernanceIssue,
  normalizeGovernanceIssueList,
} from './preschoolGuardianGovernanceMappers'

export async function fetchGovernanceIssues(params = {}, options = {}) {
  const response = await http.get('/preschool/guardians/governance/issues', {
    params,
    signal: options.signal,
  })
  const payload = unwrapApiData(response) || {}
  return {
    items: normalizeGovernanceIssueList(payload.data || payload),
    meta: response.data?.meta || {},
  }
}

export async function fetchGovernanceIssue(id) {
  const response = await http.get(`/preschool/guardians/governance/issues/${id}`)
  return normalizeGovernanceIssue(unwrapApiData(response) || {})
}

export async function syncGovernanceIssues() {
  const response = await http.post('/preschool/guardians/governance/sync')
  return unwrapApiData(response)
}

export async function fetchGovernanceDashboard() {
  const response = await http.get('/preschool/guardians/governance/dashboard-summary')
  return unwrapApiData(response)
}

export async function fetchStaleIssues(params = {}, options = {}) {
  const response = await http.get('/preschool/guardians/governance/stale-issues', {
    params,
    signal: options.signal,
  })
  const payload = unwrapApiData(response) || {}
  return {
    items: normalizeGovernanceIssueList(payload.data || payload),
    meta: response.data?.meta || {},
  }
}

export async function fetchRecurringIssues(params = {}, options = {}) {
  const response = await http.get('/preschool/guardians/governance/recurring-issues', {
    params,
    signal: options.signal,
  })
  const payload = unwrapApiData(response) || {}
  return {
    items: normalizeGovernanceIssueList(payload.data || payload),
    meta: response.data?.meta || {},
  }
}

export async function acknowledgeIssue(id, payload = {}) {
  const response = await http.post(
    `/preschool/guardians/governance/issues/${id}/acknowledge`,
    payload,
  )
  return normalizeGovernanceIssue(unwrapApiData(response) || {})
}

export async function assignIssue(id, payload) {
  const response = await http.post(
    `/preschool/guardians/governance/issues/${id}/assign`,
    payload,
  )
  return normalizeGovernanceIssue(unwrapApiData(response) || {})
}

export async function resolveIssue(id, payload = {}) {
  const response = await http.post(
    `/preschool/guardians/governance/issues/${id}/resolve`,
    payload,
  )
  return normalizeGovernanceIssue(unwrapApiData(response) || {})
}

export async function dismissIssue(id, payload) {
  const response = await http.post(
    `/preschool/guardians/governance/issues/${id}/dismiss`,
    payload,
  )
  return normalizeGovernanceIssue(unwrapApiData(response) || {})
}

// Keep guardian integrity requests in a dedicated API module so the staff-only
// audit UI can stay read-only and avoid leaking the underlying backend routes.
import http from '@/services/http'
import { unwrapApiData } from '@/services/api'
import {
  normalizeIntegrityDuplicateGroup,
  normalizeIntegrityDuplicateSummary,
  normalizeIntegrityReport,
} from './preschoolGuardianIntegrityMappers'

export async function fetchGuardianDuplicates(options = {}) {
  const response = await http.get('/preschool/guardians/duplicates', {
    signal: options.signal,
  })

  const payload = unwrapApiData(response) || {}

  return {
    summary: normalizeIntegrityDuplicateSummary(payload.summary || {}),
    items: Array.isArray(payload.items) ? payload.items.map(normalizeIntegrityDuplicateGroup) : [],
    generatedAt: payload.generatedAt || payload.generated_at || '',
    raw: payload,
  }
}

export async function fetchGuardianConsistencyReport(options = {}) {
  const response = await http.get('/preschool/guardians/consistency-report', {
    signal: options.signal,
  })

  return normalizeIntegrityReport(unwrapApiData(response) || {})
}

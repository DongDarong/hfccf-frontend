import http from '@/services/http'
import {
  buildQueryParams,
  unwrapApiData,
} from './sportApiUtils'

function formatReportDateParam(value) {
  if (!value) return ''
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value).slice(0, 10)
}

export async function fetchSportMatchesReport(params = {}, options = {}) {
  const response = await http.get('/sport/reports/matches', {
    params: buildQueryParams({
      date_from: formatReportDateParam(params.dateFrom),
      date_to: formatReportDateParam(params.dateTo),
      division_id: params.divisionId || '',
      team_id: params.teamId || '',
      tournament_id: params.tournamentId || '',
    }),
    signal: options.signal,
  })

  const data = unwrapApiData(response) || {}
  const summary = data.summary || {}

  return {
    filters: data.filters || {},
    summary: {
      totalMatches: Number(summary.total_matches ?? 0),
      completedMatches: Number(summary.completed_matches ?? 0),
      upcomingMatches: Number(summary.upcoming_matches ?? 0),
    },
    matches: Array.isArray(data.matches)
      ? data.matches.map((row) => ({
          matchId: Number(row.match_id ?? 0),
          homeTeamId: Number(row.home_team_id ?? 0),
          awayTeamId: Number(row.away_team_id ?? 0),
          homeTeam: String(row.home_team ?? ''),
          awayTeam: String(row.away_team ?? ''),
          homeScore: Number(row.home_score ?? 0),
          awayScore: Number(row.away_score ?? 0),
          scheduledAt: row.scheduled_at ?? null,
          status: String(row.status ?? ''),
          tournamentId: Number(row.tournament_id ?? 0),
          tournamentName: String(row.tournament_name ?? ''),
          divisionId: Number(row.division_id ?? 0),
          divisionName: String(row.division_name ?? ''),
        }))
      : [],
  }
}

function resolveAttachmentFilename(headers = {}, fallback = 'SportReport_matches.pdf') {
  const disposition = String(headers['content-disposition'] || headers['Content-Disposition'] || '')
  const match = disposition.match(/filename="?([^";]+)"?/i)
  return match?.[1] || fallback
}

export async function downloadSportMatchesReportPdf(params = {}, options = {}) {
  const response = await http.get('/sport/reports/matches/download', {
    params: buildQueryParams({
      date_from: formatReportDateParam(params.dateFrom),
      date_to: formatReportDateParam(params.dateTo),
      division_id: params.divisionId || '',
      team_id: params.teamId || '',
      tournament_id: params.tournamentId || '',
    }),
    responseType: 'blob',
    signal: options.signal,
  })

  return {
    blob: response.data,
    filename: resolveAttachmentFilename(response.headers, params.filename || 'SportReport_matches.pdf'),
    mimeType: String(response.headers?.['content-type'] || ''),
  }
}

export async function downloadSportMatchesReportExcel(params = {}, options = {}) {
  const response = await http.get('/sport/reports/matches/download/excel', {
    params: buildQueryParams({
      date_from: formatReportDateParam(params.dateFrom),
      date_to: formatReportDateParam(params.dateTo),
      division_id: params.divisionId || '',
      team_id: params.teamId || '',
      tournament_id: params.tournamentId || '',
    }),
    responseType: 'blob',
    signal: options.signal,
  })

  return {
    blob: response.data,
    filename: resolveAttachmentFilename(response.headers, params.filename || 'SportReport_matches.xlsx'),
    mimeType: String(response.headers?.['content-type'] || ''),
  }
}

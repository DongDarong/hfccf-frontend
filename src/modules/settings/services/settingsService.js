import http from '@/services/api'

export function getSettings(config = {}) {
  return http.get('/settings', config)
}



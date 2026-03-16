import http from '@/services/api'

export function listStudents(config = {}) {
  return http.get('/students', config)
}



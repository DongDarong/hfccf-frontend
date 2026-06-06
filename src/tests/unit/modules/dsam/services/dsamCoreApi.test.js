import { beforeEach, describe, expect, it, vi } from 'vitest'
import http from '@/services/http'
import { dsamCoreApi } from '@/modules/dsam/services/dsamCoreApi'

vi.mock('@/services/http', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}))

function ok(data) {
  return { data: { success: true, data } }
}

beforeEach(() => vi.clearAllMocks())

describe('dsamCoreApi', () => {
  it('dashboard passes params to GET /dsam/dashboard', async () => {
    http.get.mockResolvedValueOnce(ok({ kpi: {} }))
    await dsamCoreApi.dashboard({ academic_year_id: 3 })
    expect(http.get).toHaveBeenCalledWith('/dsam/dashboard', { params: { academic_year_id: 3 } })
  })

  it('dashboard with no params', async () => {
    http.get.mockResolvedValueOnce(ok({ kpi: {} }))
    await dsamCoreApi.dashboard({})
    expect(http.get).toHaveBeenCalledWith('/dsam/dashboard', { params: {} })
  })

  it('academicYears fetches academic years list', async () => {
    http.get.mockResolvedValueOnce(ok([]))
    await dsamCoreApi.academicYears()
    expect(http.get).toHaveBeenCalledWith('/dsam/academic-years', { params: undefined })
  })

  it('academicYears passes params', async () => {
    http.get.mockResolvedValueOnce(ok([]))
    await dsamCoreApi.academicYears({ active: true })
    expect(http.get).toHaveBeenCalledWith('/dsam/academic-years', { params: { active: true } })
  })

  it('schools fetches schools list', async () => {
    http.get.mockResolvedValueOnce(ok([]))
    await dsamCoreApi.schools()
    expect(http.get).toHaveBeenCalledWith('/dsam/schools', { params: undefined })
  })

  it('getProfile fetches student profile', async () => {
    http.get.mockResolvedValueOnce(ok({ id: 7, name: 'Alice' }))
    await dsamCoreApi.getProfile(7)
    expect(http.get).toHaveBeenCalledWith('/dsam/students/7/profile')
  })

  it('saveProfile puts profile data', async () => {
    http.put.mockResolvedValueOnce(ok({ id: 7 }))
    await dsamCoreApi.saveProfile(7, { notes: 'Updated' })
    expect(http.put).toHaveBeenCalledWith('/dsam/students/7/profile', { notes: 'Updated' })
  })

  it('listHistories fetches student histories', async () => {
    http.get.mockResolvedValueOnce(ok([]))
    await dsamCoreApi.listHistories(7)
    expect(http.get).toHaveBeenCalledWith('/dsam/students/7/histories')
  })

  it('addHistory posts new history entry', async () => {
    http.post.mockResolvedValueOnce(ok({ id: 100 }))
    await dsamCoreApi.addHistory(7, { note: 'First visit' })
    expect(http.post).toHaveBeenCalledWith('/dsam/students/7/histories', { note: 'First visit' })
  })
})

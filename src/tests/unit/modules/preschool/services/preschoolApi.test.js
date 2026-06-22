import { beforeEach, describe, expect, it, vi } from 'vitest'
import http from '@/services/http'
import {
  fetchPreschoolStudent,
  fetchPreschoolStudents,
} from '@/modules/preschool/services/preschoolApi'

vi.mock('@/services/http', () => ({
  default: {
    get: vi.fn(),
  },
}))

function stubResponse(data) {
  return { data: { success: true, message: 'ok', data } }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('preschool student api normalization', () => {
  it('normalizes avatar urls from alternate student list shapes', async () => {
    http.get.mockResolvedValueOnce(
      stubResponse({
        items: [
          {
            id: 1,
            full_name: 'Alice Student',
            avatarUrl: '/uploads/alice-full-list.jpg',
          },
        ],
        pagination: { page: 1, per_page: 10, total: 1, last_page: 1 },
      }),
    )

    await expect(
      fetchPreschoolStudents({ page: 1, perPage: 10 }),
    ).resolves.toMatchObject({
      items: [
        {
          id: 1,
          fullName: 'Alice Student',
          avatarUrl: '/uploads/alice-full-list.jpg',
          avatar: '/uploads/alice-full-list.jpg',
          profilePhotoUrl: '/uploads/alice-full-list.jpg',
        },
      ],
    })

    http.get.mockResolvedValueOnce(
      stubResponse({
        items: [
          {
            id: 2,
            full_name: 'Alice Student',
            media: {
              url: '/uploads/alice-filtered.jpg',
            },
          },
        ],
        pagination: { page: 1, per_page: 10, total: 1, last_page: 1 },
      }),
    )

    await expect(
      fetchPreschoolStudents({ page: 1, perPage: 10, status: 'active' }),
    ).resolves.toMatchObject({
      items: [
        {
          id: 2,
          fullName: 'Alice Student',
          avatarUrl: '/uploads/alice-filtered.jpg',
          avatar: '/uploads/alice-filtered.jpg',
          profilePhotoUrl: '/uploads/alice-filtered.jpg',
        },
      ],
    })
  })

  it('falls back to an empty avatar url when the student has no image fields', async () => {
    http.get.mockResolvedValueOnce(
      stubResponse({
        student: {
          id: 3,
          first_name: 'No',
          last_name: 'Photo',
        },
      }),
    )

    await expect(fetchPreschoolStudent(3)).resolves.toMatchObject({
      id: 3,
      fullName: 'No Photo',
      avatarUrl: '',
    })
  })
})

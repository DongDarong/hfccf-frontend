import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Breadcrumb from '@/components/navigation/Breadcrumb.vue'
import enBreadcrumb from '@/i18n/en/breadcrumb'
import { createTestI18n, createTestRouter } from '@/tests/helpers/mount'

describe('Breadcrumb', () => {
  it('renders the enrollment create breadcrumb trail', async () => {
    const router = createTestRouter([
      {
        path: '/module/preschool-admin',
        name: 'dashboard-preschool-admin',
        component: { template: '<div />' },
      },
      {
        path: '/module/preschool-admin/enrollments',
        name: 'dashboard-preschool-admin-enrollments',
        component: { template: '<div />' },
      },
      {
        path: '/module/preschool-admin/enrollments/create',
        name: 'dashboard-preschool-admin-enrollments-create',
        component: { template: '<div />' },
      },
    ])

    await router.push({ name: 'dashboard-preschool-admin-enrollments-create' })
    await router.isReady()

    const wrapper = mount(Breadcrumb, {
      global: {
        plugins: [
          createTestI18n({ en: enBreadcrumb }),
          router,
        ],
      },
    })

    expect(wrapper.text()).toContain('Preschool')
    expect(wrapper.text()).toContain('Enrollment')
    expect(wrapper.text()).toContain('New Application')
    expect(wrapper.findAll('a')).toHaveLength(2)
  })

  it('renders the guardian communication breadcrumb trail', async () => {
    const router = createTestRouter([
      {
        path: '/module/preschool-admin',
        name: 'dashboard-preschool-admin',
        component: { template: '<div />' },
      },
      {
        path: '/module/preschool-admin/guardians/communications',
        name: 'dashboard-preschool-admin-guardian-communications',
        component: { template: '<div />' },
      },
    ])

    await router.push({ name: 'dashboard-preschool-admin-guardian-communications' })
    await router.isReady()

    const wrapper = mount(Breadcrumb, {
      global: {
        plugins: [
          createTestI18n({ en: enBreadcrumb }),
          router,
        ],
      },
    })

    expect(wrapper.text()).toContain('Preschool')
    expect(wrapper.text()).toContain('Guardian Communication')
    expect(wrapper.findAll('a')).toHaveLength(1)
  })
})

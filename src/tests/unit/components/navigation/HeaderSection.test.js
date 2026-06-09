import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../helpers/mount'
import HeaderSection from '@/components/navigation/HeaderSection.vue'

const messages = {
  en: {
    common: {
      dashboardOverview:         'Dashboard Overview',
      dashboardOverviewSubtitle: 'Welcome to your dashboard.',
    },
  },
}

// Breadcrumb has router dependency — stub it out.
const componentStubs = {
  Breadcrumb: { template: '<nav class="breadcrumb-stub" />' },
}

function mount(props = {}) {
  return mountWithPlugins(HeaderSection, {
    props,
    messages,
    global: { stubs: componentStubs },
  })
}

describe('HeaderSection', () => {
  it('renders the breadcrumb stub', () => {
    expect(mount().find('.breadcrumb-stub').exists()).toBe(true)
  })

  it('shows custom title when provided', () => {
    expect(mount({ title: 'Student Management' }).find('h2').text()).toBe('Student Management')
  })

  it('falls back to i18n title when no title prop', () => {
    expect(mount().find('h2').text()).toBe('Dashboard Overview')
  })

  it('shows custom subtitle when provided', () => {
    expect(mount({ subtitle: 'Manage all students here.' }).find('p').text()).toContain('Manage all students here.')
  })

  it('falls back to i18n subtitle when no subtitle prop', () => {
    expect(mount().find('p').text()).toContain('Welcome to your dashboard.')
  })
})

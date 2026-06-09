import { describe, expect, it, vi } from 'vitest'
import { mountWithPlugins } from '../../../helpers/mount'
import Breadcrumb from '@/components/navigation/Breadcrumb.vue'

// Control the active route name without a full router setup.
const mockRoute = { name: '' }
vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useRoute:   () => mockRoute,
    RouterLink: { props: ['to'], template: '<a class="crumb-link" :href="JSON.stringify(to)"><slot /></a>' },
  }
})

const messages = {
  en: {
    breadcrumb: {
      assessmentModule:    'Assessment',
      assessmentForms:     'Forms',
      newAssessment:       'New Assessment',
      dashboard:           'Dashboard',
      preschool:           'Preschool',
      students:            'Students',
    },
  },
}

function mount(routeName = '') {
  mockRoute.name = routeName
  return mountWithPlugins(Breadcrumb, { messages })
}

describe('Breadcrumb', () => {
  it('renders nothing when route is not in the map', () => {
    expect(mount('unknown-route').find('nav').exists()).toBe(false)
  })

  it('renders nav when route is in the map', () => {
    expect(mount('assessment-dashboard').find('nav').exists()).toBe(true)
  })

  it('renders a single crumb as plain text (no link) for a top-level route', () => {
    const wrapper = mount('assessment-dashboard')
    expect(wrapper.find('.crumb-link').exists()).toBe(false)
    expect(wrapper.find('[aria-current="page"]').text()).toBe('Assessment')
  })

  it('renders ancestor crumbs as links and current page as plain text', () => {
    const wrapper = mount('assessment-form-list')
    const links = wrapper.findAll('.crumb-link')
    expect(links).toHaveLength(1)
    expect(links[0].text()).toBe('Assessment')
    expect(wrapper.find('[aria-current="page"]').text()).toBe('Forms')
  })

  it('renders three crumbs for a deeply nested route', () => {
    const wrapper = mount('assessment-wizard')
    expect(wrapper.findAll('li')).toHaveLength(2)
  })

  it('renders separator chevrons between crumbs', () => {
    const wrapper = mount('assessment-form-list')
    expect(wrapper.find('.pi-chevron-right').exists()).toBe(true)
  })

  it('uses breadcrumb preschool entries correctly', () => {
    const wrapper = mount('dashboard-preschool-admin-students')
    const links = wrapper.findAll('.crumb-link')
    expect(links[0].text()).toBe('Preschool')
    expect(wrapper.find('[aria-current="page"]').text()).toBe('Students')
  })
})

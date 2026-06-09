import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../helpers/mount'
import FilterSelectGroup from '@/components/forms/FilterSelectGroup.vue'

const messages = {
  en: {
    common: {
      allRoles:    'All Roles',
      allStatus:   'All Status',
      allDivisions:'All Divisions',
      allTeams:    'All Teams',
      clear:       'Clear',
      role:   { admin: 'Admin' },
      status: { active: 'Active' },
    },
  },
}

const buttonStub = {
  props: ['disabled'],
  template: '<button :disabled="disabled" v-bind="$attrs"><slot /></button>',
}

function mount(props = {}) {
  return mountWithPlugins(FilterSelectGroup, {
    props,
    messages,
    global: { stubs: { Button: buttonStub } },
  })
}

describe('FilterSelectGroup', () => {
  it('hides role filter when showRoleFilter is false', () => {
    const wrapper = mount({ showRoleFilter: false, roleOptions: ['admin'] })
    expect(wrapper.findAll('select')).toHaveLength(0)
  })

  it('shows role filter when roleOptions are provided', () => {
    const wrapper = mount({ roleOptions: ['admin'] })
    expect(wrapper.findAll('select')).toHaveLength(1)
  })

  it('shows status filter when statusOptions are provided', () => {
    const wrapper = mount({ showRoleFilter: false, statusOptions: ['active'] })
    expect(wrapper.findAll('select')).toHaveLength(1)
  })

  it('shows division filter when showDivisionFilter and divisionOptions are set', () => {
    const wrapper = mount({ showRoleFilter: false, showStatusFilter: false, showDivisionFilter: true, divisionOptions: ['A'] })
    expect(wrapper.findAll('select')).toHaveLength(1)
  })

  it('emits update:roleFilter when role select changes', async () => {
    const wrapper = mount({ roleOptions: ['admin'] })
    await wrapper.findComponent({ name: 'Select' }).vm.$emit('update:modelValue', 'admin')
    expect(wrapper.emitted('update:roleFilter')?.[0]).toEqual(['admin'])
  })

  it('emits update:statusFilter when status select changes', async () => {
    const wrapper = mount({ showRoleFilter: false, statusOptions: ['active'] })
    await wrapper.findComponent({ name: 'Select' }).vm.$emit('update:modelValue', 'active')
    expect(wrapper.emitted('update:statusFilter')?.[0]).toEqual(['active'])
  })

  it('clear button is disabled when no active filters', () => {
    const wrapper = mount({ roleOptions: ['admin'] })
    const clearBtn = wrapper.find('button')
    expect(clearBtn.attributes('disabled')).toBeDefined()
  })

  it('clear button is enabled when a filter is active', () => {
    const wrapper = mount({ roleOptions: ['admin'], roleFilter: 'admin' })
    const clearBtn = wrapper.find('button')
    expect(clearBtn.attributes('disabled')).toBeUndefined()
  })

  it('emits clear and resets all filters when clear button clicked', async () => {
    const wrapper = mount({ roleOptions: ['admin'], roleFilter: 'admin' })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('clear')).toBeTruthy()
    expect(wrapper.emitted('update:roleFilter')?.[0]).toEqual([''])
    expect(wrapper.emitted('update:statusFilter')?.[0]).toEqual([''])
  })

  it('hides clear button when showClearButton is false', () => {
    const wrapper = mount({ showClearButton: false, roleOptions: ['admin'] })
    expect(wrapper.find('button').exists()).toBe(false)
  })
})

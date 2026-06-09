import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../helpers/mount'
import SearchFilterBar from '@/components/forms/SearchFilterBar.vue'

// Stub both child components to isolate the bar's own contract.
const searchInputStub = {
  props: ['modelValue', 'disabled', 'placeholder', 'inputClass'],
  emits: ['update:modelValue'],
  template: '<input class="search-input" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
}

const filterGroupStub = {
  props: ['roleFilter', 'statusFilter', 'roleOptions', 'statusOptions', 'disabled', 'showClearButton', 'showRoleFilter', 'showStatusFilter', 'showDivisionFilter', 'showTeamFilter', 'statusKeyPrefix', 'divisionOptions', 'teamOptions', 'divisionFilter', 'teamFilter'],
  emits: ['update:roleFilter', 'update:statusFilter', 'clear'],
  template: '<div class="filter-group"><button @click="$emit(\'clear\')">Clear</button></div>',
}

function mount(props = {}) {
  return mountWithPlugins(SearchFilterBar, {
    props,
    global: {
      stubs: {
        SearchInputField:  searchInputStub,
        FilterSelectGroup: filterGroupStub,
      },
    },
  })
}

describe('SearchFilterBar', () => {
  it('renders the search input', () => {
    expect(mount().find('.search-input').exists()).toBe(true)
  })

  it('renders the filter group', () => {
    expect(mount().find('.filter-group').exists()).toBe(true)
  })

  it('emits update:searchQuery when search input changes', async () => {
    const wrapper = mount({ searchQuery: '' })
    await wrapper.find('.search-input').setValue('maria')
    expect(wrapper.emitted('update:searchQuery')?.[0]).toEqual(['maria'])
  })

  it('emits clear and resets searchQuery when clear is triggered', async () => {
    const wrapper = mount({ searchQuery: 'test' })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('clear')).toBeTruthy()
    expect(wrapper.emitted('update:searchQuery')?.[0]).toEqual([''])
  })

  it('hides filter group when all filter toggles are false', () => {
    const wrapper = mount({
      showRoleFilter:     false,
      showDivisionFilter: false,
      showTeamFilter:     false,
      showStatusFilter:   false,
      showClearButton:    false,
    })
    expect(wrapper.find('.filter-group').exists()).toBe(false)
  })
})

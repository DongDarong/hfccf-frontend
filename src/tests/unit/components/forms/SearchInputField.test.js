import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../helpers/mount'
import SearchInputField from '@/components/forms/SearchInputField.vue'

const messages = {
  en: { users: { searchPlaceholder: 'Search users...' } },
}

const componentStubs = {
  IconField:  { props: ['iconPosition'], template: '<div><slot /></div>' },
  InputIcon:  { template: '<span class="pi pi-search" />' },
  InputText:  {
    props: ['modelValue', 'disabled', 'placeholder', 'type', 'pt', 'inputClass'],
    emits: ['update:modelValue'],
    template: '<input :value="modelValue" :disabled="disabled" :placeholder="placeholder" @input="$emit(\'update:modelValue\', $event.target.value)" />',
  },
}

function mount(props = {}) {
  return mountWithPlugins(SearchInputField, {
    props,
    messages,
    global: { stubs: componentStubs },
  })
}

describe('SearchInputField', () => {
  it('renders a label wrapping the input', () => {
    expect(mount().find('label').exists()).toBe(true)
  })

  it('renders the search input', () => {
    expect(mount().find('input').exists()).toBe(true)
  })

  it('uses i18n fallback placeholder when none provided', () => {
    expect(mount().find('input').attributes('placeholder')).toBe('Search users...')
  })

  it('uses custom placeholder when provided', () => {
    expect(mount({ placeholder: 'Find a student' }).find('input').attributes('placeholder')).toBe('Find a student')
  })

  it('emits update:modelValue when input changes', async () => {
    const wrapper = mount({ modelValue: '' })
    await wrapper.find('input').setValue('john')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['john'])
  })

  it('passes the modelValue to the input', () => {
    expect(mount({ modelValue: 'hello' }).find('input').element.value).toBe('hello')
  })

  it('disables the input when disabled prop is true', () => {
    expect(mount({ disabled: true }).find('input').attributes('disabled')).toBeDefined()
  })

  it('sr-only span renders the placeholder for accessibility', () => {
    const wrapper = mount({ placeholder: 'Custom hint' })
    expect(wrapper.find('.sr-only').text()).toContain('Custom hint')
  })
})

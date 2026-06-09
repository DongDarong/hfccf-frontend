import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../helpers/mount'
import TableEmptyState from '@/components/data-display/components/TableEmptyState.vue'

function mount(props = {}) {
  return mountWithPlugins(TableEmptyState, { props })
}

describe('TableEmptyState', () => {
  it('renders the text prop', () => {
    expect(mount({ text: 'No records found.' }).text()).toContain('No records found.')
  })

  it('renders empty string when no text provided', () => {
    expect(mount().text().trim()).toBe('')
  })

  it('applies expected layout classes', () => {
    const wrapper = mount({ text: 'Empty' })
    expect(wrapper.classes()).toContain('text-center')
  })
})

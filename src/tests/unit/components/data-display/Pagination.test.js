import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../helpers/mount'
import Pagination from '@/components/data-display/Pagination.vue'

// Paginator stub emits 'page' event with a configurable first value via data-first-target.
const paginatorStub = {
  props: ['first', 'rows', 'totalRecords', 'pageLinkSize', 'template', 'pt'],
  emits: ['page'],
  template: `
    <div data-testid="paginator" :data-first="first" :data-total="totalRecords">
      <button class="prev" @click="$emit('page', { first: first > 0 ? first - 1 : 0 })">Prev</button>
      <button class="next" @click="$emit('page', { first: first + 1 })">Next</button>
    </div>
  `,
}

function mount(props = {}) {
  return mountWithPlugins(Pagination, {
    props: { totalPages: 5, ...props },
    global: { stubs: { Paginator: paginatorStub } },
  })
}

describe('Pagination', () => {
  it('renders the Paginator', () => {
    expect(mount().find('[data-testid="paginator"]').exists()).toBe(true)
  })

  it('computes first as (page-1)*1 and totalRecords as totalPages', () => {
    const wrapper = mount({ modelValue: 3, totalPages: 10 })
    const paginator = wrapper.find('[data-testid="paginator"]')
    expect(paginator.attributes('data-first')).toBe('2')
    expect(paginator.attributes('data-total')).toBe('10')
  })

  it('emits update:modelValue and change when next page is triggered', async () => {
    const wrapper = mount({ modelValue: 1, totalPages: 5 })
    await wrapper.find('.next').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
    expect(wrapper.emitted('change')?.[0]).toEqual([2])
  })

  it('does not emit when navigating to the current page', async () => {
    // modelValue=1, first=0; clicking prev sends first=0-1=-1 → max(-1,0)=0 → page=1 same as current
    const wrapper = mount({ modelValue: 1, totalPages: 5 })
    await wrapper.find('.prev').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('does not emit when disabled', async () => {
    const wrapper = mount({ modelValue: 1, totalPages: 5, disabled: true })
    await wrapper.find('.next').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('clamps modelValue to at least 1', () => {
    const wrapper = mount({ modelValue: -5, totalPages: 3 })
    expect(wrapper.find('[data-testid="paginator"]').attributes('data-first')).toBe('0')
  })

  it('clamps totalPages to at least 1', () => {
    const wrapper = mount({ modelValue: 1, totalPages: 0 })
    expect(wrapper.find('[data-testid="paginator"]').attributes('data-total')).toBe('1')
  })
})

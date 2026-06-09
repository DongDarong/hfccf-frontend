import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../helpers/mount'
import TableActions from '@/components/data-display/components/TableActions.vue'

const actionsStub = {
  props: ['item', 'showView', 'showEdit', 'showDelete'],
  emits: ['view', 'edit', 'delete'],
  template: `
    <div>
      <button class="btn-view"   @click="$emit('view',   item)">View</button>
      <button class="btn-edit"   @click="$emit('edit',   item)">Edit</button>
      <button class="btn-delete" @click="$emit('delete', item)">Delete</button>
    </div>
  `,
}

const item = { id: 1, name: 'Test Record' }

function mount(props = {}) {
  return mountWithPlugins(TableActions, {
    props: { item, ...props },
    global: { stubs: { ActionsButton: actionsStub } },
  })
}

describe('TableActions', () => {
  it('renders without errors', () => {
    expect(mount().exists()).toBe(true)
  })

  it('emits view with item when view action triggered', async () => {
    const wrapper = mount()
    await wrapper.find('.btn-view').trigger('click')
    expect(wrapper.emitted('view')?.[0]).toEqual([item])
  })

  it('emits edit with item when edit action triggered', async () => {
    const wrapper = mount()
    await wrapper.find('.btn-edit').trigger('click')
    expect(wrapper.emitted('edit')?.[0]).toEqual([item])
  })

  it('emits delete with item when delete action triggered', async () => {
    const wrapper = mount()
    await wrapper.find('.btn-delete').trigger('click')
    expect(wrapper.emitted('delete')?.[0]).toEqual([item])
  })
})

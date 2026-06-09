import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '../../../helpers/mount'
import TableRow from '@/components/data-display/TableRow.vue'

const componentStubs = {
  RolesBadge:      { props: ['role'], template: '<span data-role>{{ role }}</span>' },
  PermissionBadge: { props: ['permission'], template: '<span data-perm>{{ permission }}</span>' },
  StatusBadge:     { props: ['status', 'label', 'size'], template: '<span data-status>{{ label }}</span>' },
  ActionsButton:   {
    props: ['item', 'showView', 'showEdit', 'showDelete'],
    emits: ['view', 'edit', 'delete'],
    template: `
      <div>
        <button class="btn-view"   @click="$emit('view',   item)">View</button>
        <button class="btn-edit"   @click="$emit('edit',   item)">Edit</button>
        <button class="btn-delete" @click="$emit('delete', item)">Delete</button>
      </div>
    `,
  },
}

const defaultUser = {
  id:         'U001',
  name:       'Dara Chan',
  email:      'dara@example.com',
  role:       'adminpreschool',
  status:     'active',
  phone:      '+855 12 345 678',
  username:   'dara.chan',
  permission: 'view,edit',
}

function mount(userOverride = {}, columns = null) {
  const props = { user: { ...defaultUser, ...userOverride } }
  if (columns) props.columns = columns
  return mountWithPlugins(TableRow, {
    props,
    global: { stubs: componentStubs },
  })
}

describe('TableRow (UsersTableRow)', () => {
  it('renders user name', () => {
    expect(mount().text()).toContain('Dara Chan')
  })

  it('renders user email', () => {
    expect(mount().text()).toContain('dara@example.com')
  })

  it('renders role badge', () => {
    expect(mount().find('[data-role]').text()).toBe('adminpreschool')
  })

  it('renders status badge with resolved status label', () => {
    expect(mount().find('[data-status]').text()).toBe('active')
  })

  it('renders phone number', () => {
    expect(mount().text()).toContain('+855 12 345 678')
  })

  it('shows "-" when phone is missing', () => {
    const wrapper = mount({ phone: '' }, [{ key: 'phone', align: 'left' }])
    expect(wrapper.text()).toContain('-')
  })

  it('prefixes username with @', () => {
    expect(mount().text()).toContain('@dara.chan')
  })

  it('shows row number when rowNumber prop is given', () => {
    const wrapper = mountWithPlugins(TableRow, {
      props: { user: defaultUser, rowNumber: 7, columns: [{ key: 'number', align: 'left' }] },
      global: { stubs: componentStubs },
    })
    expect(wrapper.text()).toContain('7')
  })

  it('renders visible permission badges (up to 3)', () => {
    const wrapper = mount({ permission: 'view,edit,manage' }, [{ key: 'permission', align: 'left' }])
    expect(wrapper.findAll('[data-perm]')).toHaveLength(3)
  })

  it('shows overflow pill when more than 3 permissions', () => {
    const wrapper = mount({ permission: 'view,edit,manage,delete' }, [{ key: 'permission', align: 'left' }])
    expect(wrapper.text()).toContain('+1 more')
  })

  it('emits view when view action is triggered', async () => {
    const wrapper = mount({}, [{ key: 'actions', align: 'right' }])
    await wrapper.find('.btn-view').trigger('click')
    expect(wrapper.emitted('view')).toBeTruthy()
  })

  it('emits edit when edit action is triggered', async () => {
    const wrapper = mount({}, [{ key: 'actions', align: 'right' }])
    await wrapper.find('.btn-edit').trigger('click')
    expect(wrapper.emitted('edit')).toBeTruthy()
  })

  it('emits delete when delete action is triggered', async () => {
    const wrapper = mount({}, [{ key: 'actions', align: 'right' }])
    await wrapper.find('.btn-delete').trigger('click')
    expect(wrapper.emitted('delete')).toBeTruthy()
  })

  it('renders plain generic column value via resolvePlainValue', () => {
    const wrapper = mountWithPlugins(TableRow, {
      props: {
        user:    { ...defaultUser, school: 'Hope School' },
        columns: [{ key: 'school', align: 'left' }],
      },
      global: { stubs: componentStubs },
    })
    expect(wrapper.text()).toContain('Hope School')
  })
})

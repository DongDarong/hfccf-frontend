import { describe, expect, it } from 'vitest'
import { mountWithPlugins } from '@/tests/helpers/mount'
import PlayerTable from '@/modules/sport/admin/components/player-management/PlayerTable.vue'

const DataTableStub = {
  name: 'DataTable',
  inheritAttrs: false,
  props: ['value', 'dataKey', 'stripedRows', 'removableSort', 'class'],
  provide() {
    return {
      tableRows: Array.isArray(this.value) ? this.value : [],
    }
  },
  template: `
    <div data-testid="datatable">
      <slot />
    </div>
  `,
}

const ColumnStub = {
  name: 'Column',
  inheritAttrs: false,
  props: ['field', 'header', 'headerClass'],
  inject: ['tableRows'],
  template: `
    <div :data-col="field">
      <div v-for="(row, index) in tableRows" :key="index" data-testid="cell">
        <slot name="body" :data="row" />
      </div>
    </div>
  `,
}

function mountTable(players = []) {
  return mountWithPlugins(PlayerTable, {
    props: {
      players,
      t: (key) => key,
      emptyText: 'No players',
      currentPage: 1,
      totalPages: 1,
    },
    global: {
      stubs: {
        DataTable: DataTableStub,
        Column: ColumnStub,
        Avatar: {
          name: 'Avatar',
          props: ['image', 'label', 'shape'],
          template: '<div class="avatar-stub" :data-image="image" :data-label="label" />',
        },
        StatusBadge: { template: '<span class="status-stub" />' },
        Pagination: { template: '<div class="pagination-stub" />' },
        ActionsButton: { template: '<div class="actions-stub" />' },
      },
    },
  })
}

describe('PlayerTable', () => {
  it('passes the normalized player photo url into the avatar image prop', () => {
    const wrapper = mountTable([
      {
        id: 'player-1',
        name: 'Player One',
        photo: 'https://cdn.example.com/sport/players/player-1.jpg',
        position: 'Forward',
        team: 'Lions FC',
        division: 'Senior',
        matchesPlayed: 4,
        jerseyNumber: 7,
        age: 16,
        goalsScored: 2,
        status: 'active',
      },
    ])

    const avatar = wrapper.findComponent({ name: 'Avatar' })
    expect(avatar.props('image')).toBe('https://cdn.example.com/sport/players/player-1.jpg')
    expect(avatar.props('label')).toBe('PO')
  })
})

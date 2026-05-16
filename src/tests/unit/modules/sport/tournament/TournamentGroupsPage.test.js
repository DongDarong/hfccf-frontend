import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createTestI18n, createTestRouter } from '@/tests/helpers/mount'
import tournamentMessages from '@/i18n/en/sport/tournament'
import TournamentGroupsPage from '@/modules/sport/tournament/pages/TournamentGroupsPage.vue'
import { useTournamentCatalog } from '@/modules/sport/tournament/composables/useTournamentCatalog'

const messages = {
  en: {
    common: {
      cancel: 'Cancel',
      close: 'Close',
      errorOccurred: 'Error occurred',
    },
    ...tournamentMessages,
  },
}

const stubs = {
  MainLayout: { template: '<slot />' },
  HeaderSection: { props: ['title', 'subtitle'], template: '<header />' },
  TournamentStatusBadge: { props: ['state'], template: '<span />' },
  TournamentStateTimeline: { props: ['state', 'compact'], template: '<div />' },
  TournamentGroupSettings: { props: ['modelValue', 'disabled'], emits: ['update:modelValue'], template: '<section />' },
  TournamentGroupStats: { props: ['summary'], template: '<section />' },
  TournamentGroupDrawControls: {
    props: ['mode', 'canEdit', 'canFinalize', 'locked', 'issueCount', 'lastGeneratedAt'],
    emits: ['update:mode', 'preview', 'save', 'finalize', 'reset'],
    template: '<section />',
  },
  TournamentGroupAssignmentPanel: {
    props: ['teams', 'groupOptions', 'disabled'],
    emits: ['assign'],
    template: '<section />',
  },
  TournamentGroupGrid: {
    props: ['groups', 'editable', 'compact'],
    emits: ['remove-team'],
    template: '<section />',
  },
  TournamentGroupSeedPanel: { props: ['teams', 'seededMode'], template: '<section />' },
  TournamentDrawPreviewDialog: {
    props: ['visible', 'title', 'subtitle', 'groups', 'summary', 'warnings', 'canApply'],
    emits: ['update:visible', 'close', 'apply'],
    template: '<section />',
  },
  AlertError: { props: ['show', 'title', 'message', 'buttonText'], template: '<div />' },
  AlertSuccess: { props: ['show', 'title', 'message', 'buttonText'], template: '<div />' },
  Button: { props: ['label', 'disabled'], template: '<button />' },
}

function mountPage(params = {}) {
  const i18n = createTestI18n(messages)
  const pinia = createPinia()
  const router = createTestRouter([
    {
      path: '/module/sport-admin/tournaments/:id/groups',
      name: 'dashboard-sport-admin-tournaments-groups',
      component: { template: '<div />' },
    },
    {
      path: '/module/sport-admin/tournaments/:id',
      name: 'dashboard-sport-admin-tournaments-detail',
      component: { template: '<div />' },
    },
    {
      path: '/module/sport-admin/tournaments/:id/edit',
      name: 'dashboard-sport-admin-tournaments-edit',
      component: { template: '<div />' },
    },
    {
      path: '/module/sport-admin/tournaments',
      name: 'dashboard-sport-admin-tournaments',
      component: { template: '<div />' },
    },
  ])

  return (async () => {
    await router.push({ name: 'dashboard-sport-admin-tournaments-groups', params })
    await router.isReady()

    return mount(TournamentGroupsPage, {
      global: {
        plugins: [i18n, pinia, router],
        stubs,
      },
    })
  })()
}

describe('TournamentGroupsPage', () => {
  beforeEach(() => {
    useTournamentCatalog().resetTournamentCatalog()
  })

  it('renders the editable group draw page for registration closed tournaments', async () => {
    const wrapper = await mountPage({ id: 'tournament-002' })

    await nextTick()

    expect(wrapper.text()).toContain('HFCCF Inter-College Cup')
    expect(wrapper.text()).toContain('Group draw')
    expect(wrapper.find('.sport-tournament-groups__lock').exists()).toBe(false)
  })

  it('renders the locked state for finalized tournaments', async () => {
    const wrapper = await mountPage({ id: 'tournament-003' })

    await nextTick()

    expect(wrapper.text()).toContain('HFCCF School Games')
    expect(wrapper.find('.sport-tournament-groups__lock').exists()).toBe(true)
  })
})

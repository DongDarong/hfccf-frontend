import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createTestI18n, createTestRouter } from '@/tests/helpers/mount'
import tournamentMessages from '@/i18n/en/sport/tournament'
import TournamentCreatePage from '@/modules/sport/tournament/pages/TournamentCreatePage.vue'
import TournamentDetailPage from '@/modules/sport/tournament/pages/TournamentDetailPage.vue'
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
  Form: {
    props: ['title', 'description', 'showCancel'],
    emits: ['submit'],
    template: '<form><slot /><slot name="header" /><slot name="actions" /></form>',
  },
  AlertError: {
    props: ['show', 'title', 'message', 'buttonText'],
    template: '<div v-if="show" data-testid="alert-error" />',
  },
  AlertSuccess: {
    props: ['show', 'title', 'message', 'buttonText'],
    template: '<div v-if="show" data-testid="alert-success" />',
  },
  StatsCards: { props: ['cards'], template: '<div />' },
  TournamentFormSection: { props: ['title', 'subtitle'], template: '<section><slot /></section>' },
  TournamentMediaField: {
    props: ['title', 'subtitle', 'preview', 'disabled', 'accept'],
    emits: ['change', 'remove'],
    template: '<div />',
  },
  TournamentStatusBadge: { props: ['state', 'label', 'size'], template: '<span />' },
  TournamentQuickActions: { props: ['title', 'subtitle', 'actions'], emits: ['action'], template: '<div />' },
  TournamentStateTimeline: { props: ['state'], template: '<div />' },
  TournamentSettingsSummary: { props: ['tournament'], template: '<div />' },
  InputText: { props: ['modelValue', 'disabled'], template: '<input />' },
  InputNumber: { props: ['modelValue', 'disabled'], template: '<input />' },
  Select: { props: ['modelValue', 'disabled'], template: '<select />' },
  Textarea: { props: ['modelValue', 'disabled'], template: '<textarea />' },
}

function mountPage(component, routeName, routePath, params = {}) {
  const i18n = createTestI18n(messages)
  const pinia = createPinia()
  const router = createTestRouter([
    {
      path: routePath,
      name: routeName,
      component: { template: '<div />' },
    },
  ])

  return (async () => {
    await router.push({ name: routeName, params })
    await router.isReady()

    return mount(component, {
      global: {
        plugins: [i18n, pinia, router],
        stubs,
      },
    })
  })()
}

describe('Tournament pages', () => {
  beforeEach(() => {
    useTournamentCatalog().resetTournamentCatalog()
  })

  it('mounts the create page without invalid rounded prop warnings', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const wrapper = await mountPage(
      TournamentCreatePage,
      'dashboard-sport-admin-tournaments-create',
      '/module/sport-admin/tournaments/create',
    )

    await nextTick()

    const combined = [...warnSpy.mock.calls, ...errorSpy.mock.calls].flat().join(' ')
    expect(combined).not.toContain('Invalid prop: type check failed for prop "rounded"')
    expect(wrapper.find('.sport-tournament-form').exists()).toBe(true)

    warnSpy.mockRestore()
    errorSpy.mockRestore()
  })

  it('mounts the detail page without invalid rounded prop warnings', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const wrapper = await mountPage(
      TournamentDetailPage,
      'dashboard-sport-admin-tournaments-detail',
      '/module/sport-admin/tournaments/:id',
      { id: 'tournament-001' },
    )

    await nextTick()

    const combined = [...warnSpy.mock.calls, ...errorSpy.mock.calls].flat().join(' ')
    expect(combined).not.toContain('Invalid prop: type check failed for prop "rounded"')
    expect(wrapper.find('.sport-tournament-detail').exists()).toBe(true)

    warnSpy.mockRestore()
    errorSpy.mockRestore()
  })
})

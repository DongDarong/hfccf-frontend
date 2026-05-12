import { DOMAINS } from '@/constants/access'

export const EVENT_TYPE_OPTIONS = Object.freeze([
  { value: 'match', labelKey: 'match', color: '#00AEEF' },
  { value: 'training', labelKey: 'training', color: '#8DC63F' },
  { value: 'meeting', labelKey: 'meeting', color: '#FDC116' },
  { value: 'urgent', labelKey: 'urgent', color: '#ED1C24' },
])

const CALENDAR_TEAM_TARGETS = Object.freeze({
  [DOMAINS.ENGLISH]: [
    { id: 101, name: 'English Level 1', group: 'Morning class' },
    { id: 102, name: 'English Level 2', group: 'Afternoon class' },
    { id: 103, name: 'English Level 3', group: 'Exam preparation' },
    { id: 104, name: 'English Teachers', group: 'Staff' },
  ],
  [DOMAINS.PRESCHOOL]: [
    { id: 201, name: 'Nursery A', group: 'Preschool' },
    { id: 202, name: 'Nursery B', group: 'Preschool' },
    { id: 203, name: 'Kindergarten', group: 'Preschool' },
    { id: 204, name: 'Preschool Teachers', group: 'Staff' },
  ],
  [DOMAINS.SCHOLARSHIP]: [
    { id: 301, name: 'New Applicants', group: '2026 cycle' },
    { id: 302, name: 'Shortlisted Students', group: 'Review stage' },
    { id: 303, name: 'Current Scholars', group: 'Active support' },
    { id: 304, name: 'Scholarship Staff', group: 'Staff' },
  ],
  [DOMAINS.SPORT]: [
    { id: 1, name: 'U-18 Falcons', group: 'Girls Football' },
    { id: 2, name: 'Rising Strikers', group: 'Boys Football' },
    { id: 3, name: 'Cyan Court', group: 'Basketball' },
    { id: 4, name: 'Lime Sprinters', group: 'Athletics' },
    { id: 5, name: 'Red Defenders', group: 'Volleyball' },
    { id: 6, name: 'Yellow Tactics', group: 'Staff & Coaches' },
  ],
  [DOMAINS.GLOBAL]: [
    { id: 400, name: 'All Programs', group: 'Organization-wide' },
    { id: 401, name: 'English Program', group: 'Education' },
    { id: 402, name: 'Preschool Program', group: 'Education' },
    { id: 403, name: 'Scholarship Program', group: 'Education' },
    { id: 404, name: 'Sport Program', group: 'Athletics' },
    { id: 405, name: 'Operations Team', group: 'Administration' },
  ],
})

function createEventTypeList(t, domain, options = EVENT_TYPE_OPTIONS) {
  return options.map((item) => ({
    ...item,
    label: t(`pages.calendar.roles.${domain}.eventTypes.${item.labelKey}`),
  }))
}

function createRoleConfig({
  t,
  domain,
  eventTypes,
  targets,
  contextIcon,
  defaultContext,
  defaultType,
  targetIcon,
  defaultTargetIds,
}) {
  return {
    title: t(`pages.calendar.roles.${domain}.title`),
    createTitle: t(`pages.calendar.roles.${domain}.createTitle`),
    editTitle: t(`pages.calendar.roles.${domain}.editTitle`),
    description: t(`pages.calendar.roles.${domain}.description`),
    eventTypes,
    contextLabel: t(`pages.calendar.roles.${domain}.contextLabel`),
    contextPlaceholder: t(`pages.calendar.roles.${domain}.contextPlaceholder`),
    titlePlaceholder: t(`pages.calendar.roles.${domain}.titlePlaceholder`),
    notePlaceholder: t(`pages.calendar.roles.${domain}.notePlaceholder`),
    audienceLabel: t(`pages.calendar.roles.${domain}.audienceLabel`),
    audienceSearchPlaceholder: t(`pages.calendar.roles.${domain}.audienceSearchPlaceholder`),
    audienceEmptyLabel: t(`pages.calendar.roles.${domain}.audienceEmptyLabel`),
    upcomingTitle: t(`pages.calendar.roles.${domain}.upcomingTitle`),
    upcomingSubtitle: t(`pages.calendar.roles.${domain}.upcomingSubtitle`),
    upcomingEmptyLabel: t(`pages.calendar.roles.${domain}.upcomingEmptyLabel`),
    targetIcon,
    contextIcon,
    targetSummaryLabel: t('pages.calendar.summary.teamsInvolved'),
    defaultContext,
    defaultType,
    defaultTargetIds,
    targets,
  }
}

export function buildRoleCalendarConfig({ t }) {
  return {
    [DOMAINS.GLOBAL]: createRoleConfig({
      t,
      domain: DOMAINS.GLOBAL,
      eventTypes: createEventTypeList(t, DOMAINS.GLOBAL),
      contextIcon: 'pi pi-briefcase',
      defaultContext: t('pages.calendar.roles.global.defaultContext'),
      defaultType: 'meeting',
      defaultTargetIds: [400],
      targetIcon: 'pi pi-sitemap',
      targets: CALENDAR_TEAM_TARGETS[DOMAINS.GLOBAL],
    }),
    [DOMAINS.ENGLISH]: createRoleConfig({
      t,
      domain: DOMAINS.ENGLISH,
      eventTypes: createEventTypeList(t, DOMAINS.ENGLISH, [
        { value: 'training', labelKey: 'training', color: '#8DC63F' },
        { value: 'meeting', labelKey: 'meeting', color: '#FDC116' },
        { value: 'match', labelKey: 'match', color: '#00AEEF' },
        { value: 'urgent', labelKey: 'urgent', color: '#ED1C24' },
      ]),
      contextIcon: 'pi pi-building',
      defaultContext: t('pages.calendar.roles.english.defaultContext'),
      defaultType: 'training',
      targetIcon: 'pi pi-book',
      targets: CALENDAR_TEAM_TARGETS[DOMAINS.ENGLISH],
    }),
    [DOMAINS.PRESCHOOL]: createRoleConfig({
      t,
      domain: DOMAINS.PRESCHOOL,
      eventTypes: createEventTypeList(t, DOMAINS.PRESCHOOL, [
        { value: 'training', labelKey: 'training', color: '#8DC63F' },
        { value: 'meeting', labelKey: 'meeting', color: '#FDC116' },
        { value: 'match', labelKey: 'match', color: '#00AEEF' },
        { value: 'urgent', labelKey: 'urgent', color: '#ED1C24' },
      ]),
      contextIcon: 'pi pi-building',
      defaultContext: t('pages.calendar.roles.preschool.defaultContext'),
      defaultType: 'training',
      targetIcon: 'pi pi-home',
      targets: CALENDAR_TEAM_TARGETS[DOMAINS.PRESCHOOL],
    }),
    [DOMAINS.SCHOLARSHIP]: createRoleConfig({
      t,
      domain: DOMAINS.SCHOLARSHIP,
      eventTypes: createEventTypeList(t, DOMAINS.SCHOLARSHIP, [
        { value: 'meeting', labelKey: 'meeting', color: '#FDC116' },
        { value: 'match', labelKey: 'match', color: '#00AEEF' },
        { value: 'training', labelKey: 'training', color: '#8DC63F' },
        { value: 'urgent', labelKey: 'urgent', color: '#ED1C24' },
      ]),
      contextIcon: 'pi pi-id-card',
      defaultContext: t('pages.calendar.roles.scholarship.defaultContext'),
      defaultType: 'meeting',
      targetIcon: 'pi pi-users',
      targets: CALENDAR_TEAM_TARGETS[DOMAINS.SCHOLARSHIP],
    }),
    [DOMAINS.SPORT]: createRoleConfig({
      t,
      domain: DOMAINS.SPORT,
      eventTypes: createEventTypeList(t, DOMAINS.SPORT, [
        { value: 'match', labelKey: 'match', color: '#00AEEF' },
        { value: 'training', labelKey: 'training', color: '#8DC63F' },
        { value: 'meeting', labelKey: 'meeting', color: '#FDC116' },
        { value: 'urgent', labelKey: 'urgent', color: '#ED1C24' },
      ]),
      contextIcon: 'pi pi-flag',
      defaultContext: t('pages.calendar.roles.sport.defaultContext'),
      defaultType: 'match',
      targetIcon: 'pi pi-users',
      targets: CALENDAR_TEAM_TARGETS[DOMAINS.SPORT],
    }),
  }
}

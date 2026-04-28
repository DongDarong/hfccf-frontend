<script setup>
import { computed, ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useLanguage } from '@/composables/useLanguage'
import CalendarCard from '@/modules/dashboard/components/calendar/CalendarCard.vue'
import CalendarLayoutShell from '@/modules/dashboard/components/calendar/CalendarLayoutShell.vue'
import CalendarPageHeader from '@/modules/dashboard/components/calendar/CalendarPageHeader.vue'
import EventFormModal from '@/modules/dashboard/components/calendar/EventFormModal.vue'
import UpcomingEventsCard from '@/modules/dashboard/components/calendar/UpcomingEventsCard.vue'

const { language } = useLanguage()

const EVENT_TYPE_OPTIONS = [
  { value: 'match', label: 'Match', color: '#00AEEF' },
  { value: 'training', label: 'Training', color: '#8DC63F' },
  { value: 'meeting', label: 'Meeting', color: '#FDC116' },
  { value: 'urgent', label: 'Urgent', color: '#ED1C24' },
]

const teams = [
  { id: 1, name: 'U-18 Falcons', group: 'Girls Football' },
  { id: 2, name: 'Rising Strikers', group: 'Boys Football' },
  { id: 3, name: 'Cyan Court', group: 'Basketball' },
  { id: 4, name: 'Lime Sprinters', group: 'Athletics' },
  { id: 5, name: 'Red Defenders', group: 'Volleyball' },
  { id: 6, name: 'Yellow Tactics', group: 'Staff & Coaches' },
]

const now = new Date()
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
const currentMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))
const eventIdCounter = ref(7)
const events = ref(buildMockEvents(today))
const dialogVisible = ref(false)
const dialogMode = ref('create')
const editingEventId = ref(null)
const teamSearchQuery = ref('')
const formState = ref(createEmptyForm(formatDate(today)))

const typeLookup = computed(() =>
  Object.fromEntries(EVENT_TYPE_OPTIONS.map((item) => [item.value, item])),
)

const teamLookup = computed(() => Object.fromEntries(teams.map((team) => [team.id, team])))

const locale = computed(() => (language.value === 'KH' ? 'km-KH' : 'en-US'))
const pageTitle = computed(() =>
  language.value === 'KH' ? 'Schedule & Events' : 'Schedule & Events',
)
const pageSubtitle = computed(() =>
  language.value === 'KH'
    ? 'Plan training sessions, matches, meetings, and urgent sport activities.'
    : 'Plan training sessions, matches, meetings, and urgent sport activities.',
)
const addEventLabel = computed(() => (language.value === 'KH' ? 'Add Event' : 'Add Event'))
const upcomingTitle = computed(() =>
  language.value === 'KH' ? 'Upcoming Events' : 'Upcoming Events',
)
const upcomingSubtitle = computed(() =>
  language.value === 'KH'
    ? 'A quick monthly view of scheduled sessions, meetings, and match commitments.'
    : 'A quick monthly view of scheduled sessions, meetings, and match commitments.',
)

const monthLabel = computed(() =>
  new Intl.DateTimeFormat(locale.value, { month: 'long', year: 'numeric' }).format(currentMonth.value),
)

const weekdayLabels = computed(() => {
  const labels = []
  const monday = new Date(2026, 0, 5)

  for (let index = 0; index < 7; index += 1) {
    labels.push(
      new Intl.DateTimeFormat(locale.value, { weekday: 'short' })
        .format(addDays(monday, index))
        .toUpperCase(),
    )
  }

  return labels
})

const normalizedEvents = computed(() =>
  [...events.value]
    .map((event) => {
      const meta = typeLookup.value[event.type] || typeLookup.value.urgent
      const selectedTeams = event.teamIds.map((teamId) => teamLookup.value[teamId]).filter(Boolean)
      const teamLabel =
        selectedTeams.length > 1
          ? `${selectedTeams[0].name} +${selectedTeams.length - 1}`
          : selectedTeams[0]?.name || 'General group'

      return {
        ...event,
        typeLabel: meta.label,
        typeColor: meta.color,
        teamLabel,
        startsAt: new Date(`${event.date}T${event.time || '00:00'}:00`),
      }
    })
    .sort((left, right) => left.startsAt - right.startsAt),
)

const calendarDays = computed(() => {
  const monthStart = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), 1)
  const gridStart = startOfWeek(monthStart)

  return Array.from({ length: 42 }, (_, index) => {
    const dateValue = addDays(gridStart, index)
    const isoDate = formatDate(dateValue)

    return {
      key: `${isoDate}-${index}`,
      isoDate,
      dayNumber: dateValue.getDate(),
      inCurrentMonth: sameMonth(dateValue, currentMonth.value),
      isToday: sameDay(dateValue, today),
      events: normalizedEvents.value.filter((event) => event.date === isoDate),
    }
  })
})

const upcomingEvents = computed(() =>
  normalizedEvents.value.filter((event) => sameMonth(new Date(`${event.date}T00:00:00`), currentMonth.value)),
)

const legendItems = computed(() =>
  EVENT_TYPE_OPTIONS.map((item) => ({
    label: item.label,
    color: item.color,
  })),
)

const monthEvents = computed(() =>
  normalizedEvents.value.filter((event) => sameMonth(new Date(`${event.date}T00:00:00`), currentMonth.value)),
)

const summaryCards = computed(() => {
  const urgentCount = monthEvents.value.filter((event) => event.type === 'urgent').length
  const teamCount = new Set(monthEvents.value.flatMap((event) => event.teamIds)).size
  const matchCount = monthEvents.value.filter((event) => event.type === 'match').length

  return [
    {
      key: 'events',
      label: 'Monthly events',
      value: monthEvents.value.length,
      tone: 'cyan',
      icon: 'pi pi-calendar',
    },
    {
      key: 'matches',
      label: 'Matches',
      value: matchCount,
      tone: 'lime',
      icon: 'pi pi-flag',
    },
    {
      key: 'teams',
      label: 'Teams involved',
      value: teamCount,
      tone: 'yellow',
      icon: 'pi pi-users',
    },
    {
      key: 'urgent',
      label: 'Urgent items',
      value: urgentCount,
      tone: 'red',
      icon: 'pi pi-bolt',
    },
  ]
})

const nextEvent = computed(() => {
  const now = new Date()
  return (
    normalizedEvents.value.find((event) => new Date(`${event.date}T${event.time}:00`) >= now) ||
    normalizedEvents.value[0] ||
    null
  )
})

const nextEventDateLabel = computed(() => {
  if (!nextEvent.value) return 'No scheduled events yet'

  return new Intl.DateTimeFormat(locale.value, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${nextEvent.value.date}T00:00:00`))
})

function createEmptyForm(defaultDate) {
  return {
    type: 'match',
    comment: '',
    teamIds: [],
    title: '',
    tournament: '',
    date: defaultDate,
    time: '09:00',
  }
}

function buildMockEvents(baseDate) {
  const year = baseDate.getFullYear()
  const month = baseDate.getMonth()
  const currentDay = baseDate.getDate()

  return [
    {
      id: 1,
      type: 'training',
      title: 'Morning Conditioning Block',
      tournament: 'Youth Performance Camp',
      date: formatDate(new Date(year, month, Math.max(2, currentDay - 9))),
      time: '07:30',
      comment: 'Focus on sprint patterns and dynamic warm-up progressions.',
      teamIds: [4],
    },
    {
      id: 2,
      type: 'match',
      title: 'Falcons vs River Academy',
      tournament: 'EduSportPro Spring Cup',
      date: formatDate(new Date(year, month, Math.max(4, currentDay - 5))),
      time: '15:00',
      comment: 'Home fixture. Media check-in opens one hour before kickoff.',
      teamIds: [1],
    },
    {
      id: 3,
      type: 'meeting',
      title: 'Coach Strategy Review',
      tournament: 'Technical Department',
      date: formatDate(new Date(year, month, currentDay)),
      time: '10:15',
      comment: 'Review weekly player load and match preparation.',
      teamIds: [6],
    },
    {
      id: 4,
      type: 'urgent',
      title: 'Medical Clearance Follow-up',
      tournament: 'Player Welfare',
      date: formatDate(new Date(year, month, currentDay)),
      time: '16:30',
      comment: 'Confirm final roster availability before weekend fixtures.',
      teamIds: [1, 5],
    },
    {
      id: 5,
      type: 'training',
      title: 'Set Piece Training Session',
      tournament: 'Match Preparation',
      date: formatDate(new Date(year, month, Math.min(daysInMonth(year, month), currentDay + 3))),
      time: '08:45',
      comment: 'Shared session for defensive and attacking unit structure.',
      teamIds: [1, 2],
    },
    {
      id: 6,
      type: 'match',
      title: 'Community Showcase Match',
      tournament: 'EduSportPro Outreach Games',
      date: formatDate(new Date(year, month, Math.min(daysInMonth(year, month), currentDay + 8))),
      time: '17:30',
      comment: 'Cross-program exhibition with mixed team representation.',
      teamIds: [2, 3, 5],
    },
  ]
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function formatDate(dateValue) {
  const year = dateValue.getFullYear()
  const month = String(dateValue.getMonth() + 1).padStart(2, '0')
  const day = String(dateValue.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDays(dateValue, amount) {
  const next = new Date(dateValue)
  next.setDate(next.getDate() + amount)
  return next
}

function addMonths(dateValue, amount) {
  return new Date(dateValue.getFullYear(), dateValue.getMonth() + amount, 1)
}

function startOfWeek(dateValue) {
  const next = new Date(dateValue)
  const day = next.getDay()
  const diff = day === 0 ? -6 : 1 - day
  next.setDate(next.getDate() + diff)
  next.setHours(0, 0, 0, 0)
  return next
}

function sameDay(left, right) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  )
}

function sameMonth(left, right) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth()
}

function openCreateModal(date = formatDate(today)) {
  dialogMode.value = 'create'
  editingEventId.value = null
  teamSearchQuery.value = ''
  formState.value = createEmptyForm(date)
  dialogVisible.value = true
}

function openEditModal(eventItem) {
  dialogMode.value = 'edit'
  editingEventId.value = eventItem.id
  teamSearchQuery.value = ''
  formState.value = {
    type: eventItem.type,
    comment: eventItem.comment || '',
    teamIds: [...eventItem.teamIds],
    title: eventItem.title,
    tournament: eventItem.tournament,
    date: eventItem.date,
    time: eventItem.time,
  }
  dialogVisible.value = true
}

function closeModal() {
  dialogVisible.value = false
  editingEventId.value = null
  teamSearchQuery.value = ''
}

function updateFormField({ field, value }) {
  formState.value = {
    ...formState.value,
    [field]: value,
  }
}

function updateSelectedTeamIds(teamIds) {
  formState.value = {
    ...formState.value,
    teamIds,
  }
}

function updateDialogVisible(value) {
  dialogVisible.value = value
}

function updateTeamSearchQuery(value) {
  teamSearchQuery.value = value
}

function saveEvent() {
  const payload = {
    ...formState.value,
    title: formState.value.title.trim() || 'Untitled Event',
    tournament: formState.value.tournament.trim() || 'General Schedule',
    comment: formState.value.comment.trim(),
    time: formState.value.time || '09:00',
  }

  if (editingEventId.value !== null) {
    events.value = events.value.map((event) =>
      event.id === editingEventId.value ? { ...event, ...payload } : event,
    )
  } else {
    events.value = [
      ...events.value,
      {
        id: eventIdCounter.value,
        ...payload,
      },
    ]
    eventIdCounter.value += 1
  }

  closeModal()
}

function deleteEvent() {
  if (editingEventId.value === null) return
  events.value = events.value.filter((event) => event.id !== editingEventId.value)
  closeModal()
}

function goToPreviousMonth() {
  currentMonth.value = addMonths(currentMonth.value, -1)
}

function goToNextMonth() {
  currentMonth.value = addMonths(currentMonth.value, 1)
}

function goToToday() {
  currentMonth.value = new Date(today.getFullYear(), today.getMonth(), 1)
}
</script>

<template>
  <MainLayout>
    <CalendarLayoutShell>
      <template #header>
        <CalendarPageHeader
          :title="pageTitle"
          :subtitle="pageSubtitle"
          :action-label="addEventLabel"
          @action="openCreateModal()"
        />
      </template>

      <section class="calendar-dashboard">
        <article class="calendar-highlight">
          <div class="calendar-highlight__copy">
            <p class="calendar-highlight__eyebrow">Month snapshot</p>
            <h2 class="calendar-highlight__title">{{ monthLabel }}</h2>
            <p class="calendar-highlight__subtitle">
              Keep the full sport calendar in one place for training sessions, matches, staff meetings,
              and urgent operations follow-up.
            </p>
          </div>

          <div class="calendar-highlight__next">
            <span class="calendar-highlight__next-label">Next event</span>
            <strong class="calendar-highlight__next-title">
              {{ nextEvent?.title || 'No event scheduled' }}
            </strong>
            <span class="calendar-highlight__next-meta">
              {{ nextEventDateLabel }}
              <template v-if="nextEvent">
                <span class="calendar-highlight__separator">•</span>
                {{ nextEvent.time }}
                <span class="calendar-highlight__separator">•</span>
                {{ nextEvent.teamLabel }}
              </template>
            </span>
          </div>
        </article>

        <div class="calendar-stats">
          <article
            v-for="card in summaryCards"
            :key="card.key"
            class="calendar-stats__card"
            :class="`calendar-stats__card--${card.tone}`"
          >
            <span class="calendar-stats__icon">
              <i :class="card.icon" aria-hidden="true" />
            </span>
            <div>
              <p class="calendar-stats__label">{{ card.label }}</p>
              <p class="calendar-stats__value">{{ card.value }}</p>
            </div>
          </article>
        </div>

        <div class="calendar-dashboard__stack">
          <CalendarCard
            :month-label="monthLabel"
            :weekdays="weekdayLabels"
            :days="calendarDays"
            :legend-items="legendItems"
            @previous="goToPreviousMonth"
            @next="goToNextMonth"
            @today="goToToday"
            @add-event="openCreateModal"
            @select-event="openEditModal"
          />

          <UpcomingEventsCard
            :title="upcomingTitle"
            :subtitle="upcomingSubtitle"
            :events="upcomingEvents"
            :locale="locale"
            @select-event="openEditModal"
          />
        </div>
      </section>

      <EventFormModal
        :visible="dialogVisible"
        :mode="dialogMode"
        :form="formState"
        :event-types="EVENT_TYPE_OPTIONS"
        :teams="teams"
        :team-query="teamSearchQuery"
        @update:visible="updateDialogVisible"
        @update-field="updateFormField"
        @update:team-query="updateTeamSearchQuery"
        @update:selected-team-ids="updateSelectedTeamIds"
        @cancel="closeModal"
        @save="saveEvent"
        @delete="deleteEvent"
      />
    </CalendarLayoutShell>
  </MainLayout>
</template>

<style scoped>
.calendar-dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.calendar-highlight {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(18rem, 0.85fr);
  gap: 1rem;
  border: 1px solid #d9e5ec;
  border-radius: 1.4rem;
  padding: 1.15rem 1.2rem;
  background:
    radial-gradient(circle at top right, rgba(0, 174, 239, 0.12), transparent 28%),
    linear-gradient(180deg, #ffffff 0%, #f7fbfd 100%);
  box-shadow: 0 24px 38px -34px rgba(15, 23, 42, 0.24);
}

.calendar-highlight__eyebrow {
  margin: 0;
  color: #00aeef;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.calendar-highlight__title {
  margin: 0.45rem 0 0;
  color: #1d1d1b;
  font-size: clamp(1.35rem, 2vw, 1.75rem);
  font-weight: 900;
  line-height: 1.06;
}

.calendar-highlight__subtitle {
  margin: 0.6rem 0 0;
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.65;
  max-width: 40rem;
}

.calendar-highlight__next {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.28rem;
  border: 1px solid #dce8ef;
  border-radius: 1.15rem;
  padding: 1rem 1.05rem;
  background: rgba(255, 255, 255, 0.82);
}

.calendar-highlight__next-label {
  color: #00aeef;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.calendar-highlight__next-title {
  color: #1d1d1b;
  font-size: 1rem;
  font-weight: 900;
}

.calendar-highlight__next-meta {
  color: #64748b;
  font-size: 0.8rem;
  line-height: 1.55;
}

.calendar-highlight__separator {
  margin-inline: 0.35rem;
  color: #c4cdd6;
}

.calendar-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.9rem;
}

.calendar-stats__card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  border: 1px solid #dce5ec;
  border-radius: 1.15rem;
  padding: 0.95rem 1rem;
  background: #fff;
  box-shadow: 0 22px 34px -36px rgba(15, 23, 42, 0.35);
}

.calendar-stats__icon {
  width: 2.6rem;
  height: 2.6rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.95rem;
  font-size: 1rem;
}

.calendar-stats__card--cyan .calendar-stats__icon {
  background: #e9f9ff;
  color: #0089bc;
}

.calendar-stats__card--lime .calendar-stats__icon {
  background: #f0f8e2;
  color: #669a24;
}

.calendar-stats__card--yellow .calendar-stats__icon {
  background: #fff8de;
  color: #8c6500;
}

.calendar-stats__card--red .calendar-stats__icon {
  background: #ffeaec;
  color: #c71f1f;
}

.calendar-stats__label {
  margin: 0;
  color: #64748b;
  font-size: 0.74rem;
  font-weight: 700;
}

.calendar-stats__value {
  margin: 0.18rem 0 0;
  color: #1d1d1b;
  font-size: 1.3rem;
  font-weight: 900;
  line-height: 1;
}

.calendar-dashboard__stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

@media (max-width: 960px) {
  .calendar-highlight,
  .calendar-stats {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .calendar-highlight,
  .calendar-stats {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .calendar-highlight {
    padding: 1rem;
  }

  .calendar-stats__card {
    padding: 0.85rem 0.9rem;
  }
}
</style>

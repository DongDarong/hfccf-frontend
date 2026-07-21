<script setup>
// Keep the weekly timetable rendering isolated so management and read-only
// pages can reuse the same layout and empty-state behavior.
import ScheduleStatusBadge from './ScheduleStatusBadge.vue'
import AppStatusChip from '@/components/ui/AppStatusChip.vue'
import { getScheduleSessionStatusTone, normalizeScheduleSessionStatus } from './scheduleSessionOverlay'

const getStatusTone = (status) => getScheduleSessionStatusTone(status)
const normalizeSessionStatus = (status) => normalizeScheduleSessionStatus(status)

defineProps({
  dayLabel: {
    type: String,
    default: '',
  },
  entries: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadingLabel: {
    type: String,
    default: '',
  },
  emptyLabel: {
    type: String,
    default: '',
  },
  showActions: {
    type: Boolean,
    default: false,
  },
  editLabel: {
    type: String,
    default: '',
  },
  archiveLabel: {
    type: String,
    default: '',
  },
  sessionViewLabel: {
    type: String,
    default: '',
  },
  sessionActionLabel: {
    type: String,
    default: '',
  },
  noSessionLabel: {
    type: String,
    default: '',
  },
  showSessionActions: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['edit', 'archive', 'session-action', 'session-view'])
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between gap-3">
      <h3 class="text-lg font-semibold text-slate-900">{{ dayLabel }}</h3>
      <span class="text-sm text-slate-500">{{ entries.length }}</span>
    </div>

    <div
      v-if="loading"
      class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500"
    >
      {{ loadingLabel }}
    </div>

    <div v-else-if="!entries.length" class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
      {{ emptyLabel }}
    </div>

    <div v-else class="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table class="w-full">
        <thead>
          <tr class="border-b border-slate-200 bg-slate-50">
            <th class="px-4 py-3 text-left text-sm font-semibold text-slate-900">Class</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-slate-900">Time</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-slate-900">Teacher</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-slate-900">Room</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-slate-900">Session</th>
            <th v-if="showSessionActions || showActions" class="px-4 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in entries" :key="entry.id" class="border-b border-slate-200 transition-colors hover:bg-slate-50">
            <td class="px-4 py-3 text-sm text-slate-900 font-semibold">{{ entry.activityLabel }}</td>
            <td class="px-4 py-3 text-sm text-slate-600">{{ entry.startTime }} - {{ entry.endTime }}</td>
            <td class="px-4 py-3 text-sm text-slate-600">{{ entry.teacherName }}</td>
            <td class="px-4 py-3 text-sm text-slate-600">{{ entry.room || '-' }}</td>
            <td class="px-4 py-3 text-sm">
              <ScheduleStatusBadge :status="entry.status" :label="entry.status" />
            </td>
            <td class="px-4 py-3 text-sm">
              <AppStatusChip
                v-if="entry.session"
                :status="getStatusTone(entry.session?.status)"
                :label="entry.session?.statusLabel || entry.session?.status"
                :translate-label="false"
                size="xs"
              />
              <span v-else class="inline-flex items-center rounded-full border border-dashed border-slate-300 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-500">
                {{ noSessionLabel }}
              </span>
            </td>
            <td v-if="showSessionActions || showActions" class="px-4 py-3 text-sm">
              <div class="flex flex-wrap gap-2">
                <button
                  v-if="showSessionActions && entry.session?.actionLabel"
                  type="button"
                  class="px-3 py-1 rounded-lg text-xs font-semibold"
                  :class="[
                    entry.session?.actionTone === 'success' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  ]"
                  @click="emit('session-action', entry)"
                >
                  {{ entry.session?.actionLabel }}
                </button>
                <button
                  v-if="showSessionActions && sessionViewLabel && ['scheduled', 'open'].includes(normalizeSessionStatus(entry.session?.status))"
                  type="button"
                  class="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
                  @click="emit('session-view', entry)"
                >
                  {{ sessionViewLabel }}
                </button>
                <button
                  v-if="showActions && editLabel && entry.status !== 'archived'"
                  type="button"
                  class="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
                  @click="emit('edit', entry)"
                >
                  {{ editLabel }}
                </button>
                <button
                  v-if="showActions && archiveLabel && entry.status !== 'archived'"
                  type="button"
                  class="px-3 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200"
                  @click="emit('archive', entry)"
                >
                  {{ archiveLabel }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

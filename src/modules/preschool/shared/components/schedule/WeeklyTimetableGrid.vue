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
            <th class="px-4 py-3 text-center text-sm font-semibold text-slate-900 w-12">No.</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-slate-900">Class</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-slate-900">Time</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-slate-900">Teacher</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-slate-900">Room</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-slate-900">Session</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in entries" :key="entry.id" class="border-b border-slate-200 transition-colors hover:bg-slate-50">
            <td class="px-4 py-3 text-center text-sm text-slate-600 font-semibold">{{ index + 1 }}</td>
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
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

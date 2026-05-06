<script setup>
/**
 * ResultListRow
 * Single responsive row for the result list. Emits `update-match` for the action button.
 */
import { computed } from 'vue'
import Button from '@/components/buttons/Button.vue'
import StatusBadge from '@/components/badges/StatusBadge.vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'ResultListRow',
})

const props = defineProps({
  match: {
    type: Object,
    required: true,
  },
  labels: {
    type: Object,
    required: true,
  },
  actionLabel: {
    type: String,
    required: true,
  },
})

defineEmits(['update-match'])

const { t } = useLanguage()
const reportText = computed(() => String(props.match?.report || '-'))
const teamsText = computed(() => `${props.match?.homeTeam || '-'} vs ${props.match?.awayTeam || '-'}`)
const statusLabel = computed(() => {
  const key = String(props.match?.status || '').trim().toLowerCase()
  const statusKey = `sportMatchesManagement.resultList.statusLabels.${key}`
  return t(statusKey)
})

function statusTone(status) {
  // Tone mapping is UI-only; backend can define canonical statuses later.
  const value = String(status || '')
  if (value === 'Finished') return 'success'
  if (value === 'Pending') return 'warning'
  if (value === 'Verified') return 'info'
  if (value === 'Rejected') return 'error'
  return 'neutral'
}
</script>

<template>
  <article
    class="grid gap-4 border-b border-slate-200/70 px-4 py-4 transition-colors hover:bg-slate-50/60 md:grid-cols-[minmax(220px,1.2fr)_140px_minmax(220px,1.2fr)_190px_140px_110px] md:items-center"
  >
    <div class="min-w-0 space-y-2">
      <p class="text-[0.72rem] font-extrabold tracking-[0.12em] uppercase text-slate-500">
        {{ match.competition }}
      </p>

      <div>
        <p class="font-black text-[#1D1D1B] break-words">
          {{ teamsText }}
        </p>
        <p class="mt-1 text-[0.86rem] text-slate-600 break-words">
          {{ match.venue }}
        </p>
      </div>
    </div>

    <div class="md:text-center">
      <div class="inline-flex rounded-xl bg-slate-900 px-3 py-1 text-[0.95rem] font-black text-white">
        {{ match.score }}
      </div>
    </div>

    <div class="min-w-0">
      <div class="space-y-1 md:hidden">
        <p class="text-[0.72rem] font-extrabold tracking-[0.12em] uppercase text-slate-500">
          {{ labels.report }}
        </p>
        <p class="text-[0.86rem] leading-6 text-slate-700 break-words">
          {{ reportText }}
        </p>
      </div>

      <p class="hidden text-[0.86rem] leading-6 text-slate-700 break-words line-clamp-2 md:block">
        {{ reportText }}
      </p>
    </div>

    <div class="min-w-0">
      <div class="space-y-1 md:hidden">
        <p class="text-[0.72rem] font-extrabold tracking-[0.12em] uppercase text-slate-500">
          {{ labels.schedule }}
        </p>
        <p class="text-[0.86rem] text-slate-700 break-words">
          {{ match.datetime }}
        </p>
      </div>

      <p class="hidden text-[0.86rem] text-slate-700 break-words md:block">
        {{ match.datetime }}
      </p>
    </div>

    <div class="md:justify-self-start">
      <!-- The row owns the visible status label so it can stay localized per language. -->
      <StatusBadge :status="statusTone(match.status)" :label="statusLabel" :translate-label="false" size="sm" />
    </div>

    <div class="flex md:justify-end">
      <Button
        type="button"
        variant="primary"
        size="sm"
        rounded="xl"
        :aria-label="`${actionLabel}: ${teamsText}`"
        @click="$emit('update-match', match)"
      >
        {{ actionLabel }}
      </Button>
    </div>
  </article>
</template>

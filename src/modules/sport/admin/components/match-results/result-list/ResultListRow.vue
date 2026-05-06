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
const homeTeam = computed(() => props.match?.homeTeam || '-')
const awayTeam = computed(() => props.match?.awayTeam || '-')

const statusLabel = computed(() => {
  const key = String(props.match?.status || '').trim().toLowerCase()
  const statusKey = `sportMatchesManagement.resultList.statusLabels.${key}`
  return t(statusKey)
})

const splitScore = computed(() => {
  const score = String(props.match?.score || '')
  if (!score || score === '- - -') return { home: '-', away: '-', isPending: true }
  const [home = '0', away = '0'] = score.split('-').map((s) => s.trim())
  return { home, away, isPending: false }
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
    class="grid gap-4 px-4 py-5 transition-all hover:bg-brand-primary-50/30 md:grid-cols-[minmax(240px,1.3fr)_100px_minmax(240px,1.1fr)_180px_130px_100px] md:items-center"
  >
    <!-- Match Info & Teams -->
    <div class="min-w-0 space-y-2.5">
      <div
        class="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-0.5 text-[0.68rem] font-bold tracking-wide uppercase text-slate-500"
      >
        <i class="pi pi-tag text-[0.6rem]"></i>
        {{ match.competition }}
      </div>

      <div class="space-y-1.5">
        <div class="flex items-center gap-2">
          <p class="truncate text-[0.95rem] font-bold text-slate-900" :title="homeTeam">
            {{ homeTeam }}
          </p>
          <span class="flex-shrink-0 text-[0.65rem] font-black text-slate-300 uppercase italic">vs</span>
          <p class="truncate text-[0.95rem] font-bold text-slate-900" :title="awayTeam">
            {{ awayTeam }}
          </p>
        </div>

        <div class="flex items-center gap-1.5 text-slate-500">
          <i class="pi pi-map-marker text-[0.75rem] text-slate-400"></i>
          <p class="truncate text-[0.8rem] leading-tight">
            {{ match.venue }}
          </p>
        </div>
      </div>
    </div>

    <!-- Score Center -->
    <div class="flex md:justify-center">
      <div
        class="flex h-10 w-24 items-center justify-between rounded-xl bg-slate-900 px-3 text-white shadow-[0_4px_12px_-4px_rgba(15,23,42,0.4)] transition-transform hover:scale-105"
      >
        <span class="w-6 text-center font-mono text-[1.05rem] font-black tracking-tighter">
          {{ splitScore.home }}
        </span>
        <span
          class="flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-700"
          :class="{ '!bg-brand-400 animate-pulse': !splitScore.isPending && match.status === 'Verified' }"
        ></span>
        <span class="w-6 text-center font-mono text-[1.05rem] font-black tracking-tighter">
          {{ splitScore.away }}
        </span>
      </div>
    </div>

    <!-- Match Report -->
    <div class="min-w-0">
      <div class="md:hidden">
        <p class="mb-1 text-[0.68rem] font-bold tracking-wider uppercase text-slate-400">
          {{ labels.report }}
        </p>
        <p class="text-[0.85rem] leading-relaxed text-slate-600">
          {{ reportText }}
        </p>
      </div>

      <p class="hidden text-[0.85rem] leading-relaxed text-slate-600 line-clamp-2 md:block">
        {{ reportText }}
      </p>
    </div>

    <!-- Schedule -->
    <div class="min-w-0">
      <div class="md:hidden">
        <p class="mb-1 text-[0.68rem] font-bold tracking-wider uppercase text-slate-400">
          {{ labels.schedule }}
        </p>
        <div class="flex items-center gap-2 text-slate-600">
          <i class="pi pi-calendar text-[0.8rem] text-brand-500"></i>
          <span class="text-[0.85rem] font-medium">{{ match.datetime }}</span>
        </div>
      </div>

      <div class="hidden items-center gap-2 text-slate-600 md:flex">
        <i class="pi pi-calendar text-[0.8rem] text-brand-500"></i>
        <span class="text-[0.85rem] font-medium">{{ match.datetime }}</span>
      </div>
    </div>

    <!-- Status -->
    <div class="md:justify-self-start">
      <StatusBadge :status="statusTone(match.status)" :label="statusLabel" :translate-label="false" size="sm" />
    </div>

    <!-- Quick Action -->
    <div class="flex md:justify-end">
      <Button
        type="button"
        variant="primary"
        size="sm"
        rounded="xl"
        class="h-9 px-4 text-xs font-bold uppercase tracking-wider"
        :aria-label="`${actionLabel}: ${homeTeam} vs ${awayTeam}`"
        @click="$emit('update-match', match)"
      >
        {{ actionLabel }}
      </Button>
    </div>
  </article>
</template>

<script setup>
/**
 * ResultListRow
 * Single responsive row for the result list. Emits `update-match` for the action button.
 */
import Button from '@/components/buttons/Button.vue'

defineOptions({
  name: 'ResultListRow',
})

defineProps({
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

function statusTone(status) {
  // Tone mapping is UI-only; backend can define canonical statuses later.
  const value = String(status || '')
  if (value === 'Finished') return 'bg-lime-50 text-lime-700 border-lime-200'
  if (value === 'Pending') return 'bg-amber-50 text-amber-700 border-amber-200'
  if (value === 'Verified') return 'bg-cyan-50 text-cyan-700 border-cyan-200'
  if (value === 'Rejected') return 'bg-rose-50 text-rose-700 border-rose-200'
  return 'bg-slate-50 text-slate-700 border-slate-200'
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
          {{ match.homeTeam }} vs {{ match.awayTeam }}
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
          {{ match.report || '—' }}
        </p>
      </div>

      <p class="hidden text-[0.86rem] leading-6 text-slate-700 break-words line-clamp-2 md:block">
        {{ match.report || '—' }}
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
      <span
        class="inline-flex items-center rounded-full border px-3 py-1 text-[0.78rem] font-extrabold"
        :class="statusTone(match.status)"
      >
        <span class="mr-2 inline-block h-2 w-2 rounded-full bg-current opacity-75" aria-hidden="true" />
        {{ match.status }}
      </span>
    </div>

    <div class="flex md:justify-end">
      <Button
        type="button"
        variant="primary"
        size="sm"
        rounded="xl"
        @click="$emit('update-match', match)"
      >
        {{ actionLabel }}
      </Button>
    </div>
  </article>
</template>

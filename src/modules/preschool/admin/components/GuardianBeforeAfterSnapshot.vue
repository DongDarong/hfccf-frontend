<template>
  <div v-if="before || after" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
    <div v-if="before" class="rounded border border-surface-200 dark:border-surface-700 p-3">
      <div class="text-xs font-semibold text-surface-500 uppercase mb-2">
        {{ t('preschoolGuardianRemediation.labels.before') }}
      </div>
      <pre class="text-xs whitespace-pre-wrap break-all text-surface-700 dark:text-surface-200">{{
        formatSnapshot(before)
      }}</pre>
    </div>
    <div v-if="after" class="rounded border border-surface-200 dark:border-surface-700 p-3">
      <div class="text-xs font-semibold text-surface-500 uppercase mb-2">
        {{ t('preschoolGuardianRemediation.labels.after') }}
      </div>
      <pre class="text-xs whitespace-pre-wrap break-all text-surface-700 dark:text-surface-200">{{
        formatSnapshot(after)
      }}</pre>
    </div>
  </div>
</template>

<script setup>
import { useLanguage } from '@/composables/useLanguage'

defineProps({
  before: { type: [Object, null], default: null },
  after: { type: [Object, null], default: null },
})

const { t } = useLanguage()

function formatSnapshot(snapshot) {
  try {
    return JSON.stringify(snapshot, null, 2)
  } catch {
    return String(snapshot)
  }
}
</script>

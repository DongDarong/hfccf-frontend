<template>
  <section class="space-y-4">
    <div>
      <h2 class="text-lg font-semibold text-slate-900">
        {{ title }}
      </h2>
      <p class="mt-1 text-sm text-slate-500">
        {{ subtitle }}
      </p>
    </div>

    <GuardianCommunicationTimeline
      :items="communications"
      :loading="loading"
      :title="timelineTitle"
      :subtitle="timelineSubtitle"
    />
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import GuardianCommunicationTimeline from '@/modules/preschool/admin/components/guardian/GuardianCommunicationTimeline.vue'

defineProps({
  communications: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const { t } = useI18n()

const title = computed(() => t('preschoolGuardianCommunicationPage.profile.contactHistory'))
const subtitle = computed(() => t('preschoolGuardianCommunicationPage.profile.recentContacts'))
const timelineTitle = computed(() => t('preschoolGuardianCommunicationPage.timelineTitle'))
const timelineSubtitle = computed(() => t('preschoolGuardianCommunicationPage.timelineSubtitle'))
</script>

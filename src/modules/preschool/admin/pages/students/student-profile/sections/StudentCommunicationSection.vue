<script setup>
import GuardianCommunicationTimeline from '@/modules/preschool/admin/components/guardian/GuardianCommunicationTimeline.vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'StudentCommunicationSection',
})

defineProps({
  communicationTimeline: {
    type: Object,
    default: null,
  },
})

const { t } = useLanguage()
</script>

<template>
  <div v-if="communicationTimeline" class="student-profile-page__communications">
    <GuardianCommunicationTimeline
      compact
      :title="t('preschoolGuardianCommunicationPage.timelineTitle')"
      :subtitle="t('preschoolGuardianCommunicationPage.timelineSubtitle')"
      :communications="communicationTimeline.items || []"
      :summary="communicationTimeline.summary || {}"
      :empty-text="t('preschoolGuardianCommunicationPage.messages.noCommunicationYet')"
    />
  </div>
</template>

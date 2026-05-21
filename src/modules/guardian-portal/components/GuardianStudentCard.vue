<script setup>
// Keep child cards reusable so the dashboard and student list can share the
// same read-only rendering contract without duplicating label logic.
import Button from 'primevue/button'
import Card from 'primevue/card'
import { useLanguage } from '@/composables/useLanguage'
import GuardianPortalStatusBadge from './GuardianPortalStatusBadge.vue'

defineOptions({
  name: 'GuardianStudentCard',
})

const { t } = useLanguage()

defineProps({
  student: {
    type: Object,
    default: () => ({}),
  },
  actionLabel: {
    type: String,
    default: '',
  },
})

defineEmits(['view'])
</script>

<template>
  <Card class="h-full border-slate-200 shadow-sm">
    <template #content>
      <div class="flex h-full flex-col gap-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-lg font-black text-slate-950">{{ student.fullName || t('guardianPortal.common.emptyValue') }}</p>
            <p class="text-sm text-slate-500">{{ student.studentCode || t('guardianPortal.common.emptyValue') }}</p>
          </div>
          <GuardianPortalStatusBadge :status="student.status" />
        </div>

        <div class="grid gap-2 text-sm text-slate-700">
          <p>{{ student.guardianName || t('guardianPortal.common.emptyValue') }}</p>
          <p>{{ student.guardianPhone || t('guardianPortal.common.emptyValue') }}</p>
          <p v-if="student.classes?.length" class="text-slate-500">
            {{ student.classes.map((item) => item.name).join(', ') }}
          </p>
        </div>

        <div class="mt-auto flex items-center justify-end">
          <Button
            severity="secondary"
            size="small"
            rounded
            :label="actionLabel || t('guardianPortal.common.viewChild')"
            @click="$emit('view', student)"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

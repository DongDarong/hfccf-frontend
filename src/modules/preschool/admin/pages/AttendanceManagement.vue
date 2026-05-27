<script setup>
// This admin attendance route remains an explicit scaffold until the full
// operational attendance manager is wired. Keeping the route visible avoids
// broken navigation while making it clear that the screen is not finished.
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import PreschoolPlaceholderState from '@/modules/preschool/shared/components/PreschoolPlaceholderState.vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'PreschoolAdminAttendanceManagementPage',
})

const { t } = useLanguage()
</script>

<template>
  <MainLayout>
    <section class="preschool-placeholder-page">
      <HeaderSection
        :title="t('preschoolScaffold.attendanceManagement.title')"
        :subtitle="t('preschoolScaffold.attendanceManagement.subtitle')"
      />

      <PreschoolPlaceholderState
        :eyebrow="t('preschoolScaffold.attendanceManagement.eyebrow')"
        :title="t('preschoolScaffold.attendanceManagement.title')"
        :subtitle="t('preschoolScaffold.attendanceManagement.subtitle')"
        :description="t('preschoolScaffold.attendanceManagement.description')"
      />
    </section>
  </MainLayout>
</template>

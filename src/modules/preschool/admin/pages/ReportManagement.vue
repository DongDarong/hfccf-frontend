<script setup>
// Keep Preschool reporting visible as a scaffold until a real backend workflow
// exists, which prevents the sidebar from advertising a fake feature.
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import PreschoolPlaceholderState from '@/modules/preschool/shared/components/PreschoolPlaceholderState.vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'PreschoolAdminReportManagementPage',
})

const { t } = useLanguage()
</script>

<template>
  <MainLayout>
    <section class="preschool-placeholder-page">
      <HeaderSection
        :title="t('preschoolScaffold.reportManagement.title')"
        :subtitle="t('preschoolScaffold.reportManagement.subtitle')"
      />

      <PreschoolPlaceholderState
        :eyebrow="t('preschoolScaffold.reportManagement.eyebrow')"
        :title="t('preschoolScaffold.reportManagement.title')"
        :subtitle="t('preschoolScaffold.reportManagement.subtitle')"
        :description="t('preschoolScaffold.reportManagement.description')"
      />
    </section>
  </MainLayout>
</template>

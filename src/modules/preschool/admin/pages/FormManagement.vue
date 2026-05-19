<template>
  <MainLayout>
    <section class="preschool-placeholder-page">
      <HeaderSection
        :title="t('preschoolScaffold.formManagement.title')"
        :subtitle="t('preschoolScaffold.formManagement.subtitle')"
      />

      <PreschoolPlaceholderState
        :eyebrow="t('preschoolScaffold.formManagement.eyebrow')"
        :title="t('preschoolScaffold.formManagement.title')"
        :subtitle="t('preschoolScaffold.formManagement.subtitle')"
        :description="t('preschoolScaffold.formManagement.description')"
      />
    </section>
  </MainLayout>
</template>

<script setup>
// Keep this route visible as a scaffold so navigation remains stable while the
// real Preschool workflow is still under construction.
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import PreschoolPlaceholderState from '@/modules/preschool/shared/components/PreschoolPlaceholderState.vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'PreschoolAdminFormManagementPage',
})

const { t } = useLanguage()
</script>

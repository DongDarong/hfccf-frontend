<script setup>
// This route is deliberately a wellbeing scaffold, not a clinical record
// screen. It keeps the teacher workflow visible without implying a medical
// system or exposing unfinished navigation as production-ready.
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import PreschoolPlaceholderState from '@/modules/preschool/shared/components/PreschoolPlaceholderState.vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'PreschoolTeacherHealthyPage',
})

const { t } = useLanguage()
</script>

<template>
  <MainLayout>
    <section class="preschool-placeholder-page">
      <HeaderSection
        :title="t('preschoolScaffold.healthy.title')"
        :subtitle="t('preschoolScaffold.healthy.subtitle')"
      />

      <PreschoolPlaceholderState
        :eyebrow="t('preschoolScaffold.healthy.eyebrow')"
        :title="t('preschoolScaffold.healthy.title')"
        :subtitle="t('preschoolScaffold.healthy.subtitle')"
        :description="t('preschoolScaffold.healthy.description')"
      />
    </section>
  </MainLayout>
</template>

<script setup>
// Keep the healthy habits route visible as a scaffold so the sidebar does not
// suggest a finished workflow before the Preschool content exists.
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

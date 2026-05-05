<script setup>
/**
 * SportAdminAddMatchPage
 * Placeholder shell for creating a new match record.
 *
 * The full match form will be introduced later; for now this page exists so the
 * Manage Matches "Add Match" action has a valid destination.
 */
import { computed } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'SportAdminAddMatchPage',
})

const { t, language } = useLanguage()
const isKh = computed(() => language.value === 'KH')

const pageTitle = computed(() => t('sportMatchesManagement.addTitle'))
const pageSubtitle = computed(() => t('sportMatchesManagement.addSubtitle'))
</script>

<template>
  <MainLayout>
    <section :class="isKh ? 'add-match-page add-match-page--kh' : 'add-match-page'">
      <HeaderSection :title="pageTitle" :subtitle="pageSubtitle" />

      <div class="add-match-page__shell">
        <p class="add-match-page__hint">
          {{ t('sportMatchesManagement.addPlaceholder') }}
        </p>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.add-match-page {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.add-match-page__shell {
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid #dce6f2;
  background:
    radial-gradient(circle at top left, rgba(186, 230, 253, 0.18), transparent 24%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%);
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.5);
}

.add-match-page__hint {
  margin: 0;
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.7;
}

.add-match-page--kh .add-match-page__shell {
  font-family:
    'Noto Sans Khmer', 'Khmer OS Siemreap', 'Khmer OS Battambang', 'Leelawadee UI', sans-serif;
}
</style>

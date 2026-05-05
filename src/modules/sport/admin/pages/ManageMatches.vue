<script setup>
/**
 * SportAdminManageMatchesPage
 * Placeholder page for match management (fixtures / live match feeds).
 * UI-only for now: future backend integration will use `sport_matches` and related tournament tables.
 */
import { computed, ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'
import MatchesSearchFilterBar from '@/modules/sport/admin/components/matches-management/MatchesSearchFilterBar.vue'

defineOptions({
  name: 'SportAdminManageMatchesPage',
})

const { t, language } = useLanguage()
const isKh = computed(() => language.value === 'KH')

const title = computed(() => t('sportMatchesManagement.title'))
const subtitle = computed(() => t('sportMatchesManagement.subtitle'))

// Filter state (UI-only until the matches table/list is implemented).
const searchQuery = ref('')
const competition = ref('')
const tournament = ref('')
const matchDateInput = ref('')

// Placeholder options: these will come from the backend/API later.
const competitionOptions = ['U-18 Premier', 'U-16 Elite', 'Senior Development']
const tournamentOptions = ['HFCCF Cup 2026', 'Friendly League']
</script>

<template>
  <MainLayout>
    <section :class="isKh ? 'manage-matches-page manage-matches-page--kh' : 'manage-matches-page'">
      <HeaderSection :title="title" :subtitle="subtitle" />

      <div class="manage-matches-page__shell">
        <MatchesSearchFilterBar
          v-model:searchQuery="searchQuery"
          v-model:competition="competition"
          v-model:tournament="tournament"
          v-model:matchDateInput="matchDateInput"
          :competition-options="competitionOptions"
          :tournament-options="tournamentOptions"
        />

        <!-- Keep the copy i18n-owned so future UI iterations won't hardcode strings. -->
        <p class="manage-matches-page__hint mt-5">
          {{ t('sportMatchesManagement.placeholder') }}
        </p>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.manage-matches-page {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.manage-matches-page__shell {
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid #dce6f2;
  background:
    radial-gradient(circle at top left, rgba(186, 230, 253, 0.18), transparent 24%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%);
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.5);
}

.manage-matches-page__hint {
  margin: 0;
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.7;
}

.manage-matches-page--kh .manage-matches-page__shell {
  font-family:
    'Noto Sans Khmer', 'Khmer OS Siemreap', 'Khmer OS Battambang', 'Leelawadee UI', sans-serif;
}
</style>

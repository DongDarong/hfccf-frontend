<script setup>
import { computed } from 'vue'
import { useLanguage } from '@/composables/useLanguage'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
})

const { t } = useLanguage()
// Allow parent overrides while keeping localized defaults for standalone usage.
const resolvedTitle = computed(() => props.title || t('common.dashboardOverview'))
const resolvedSubtitle = computed(() => props.subtitle || t('common.dashboardOverviewSubtitle'))
</script>

<template>
  <header class="header-section">
    <h2 class="header-section__title">{{ resolvedTitle }}</h2>
    <p class="header-section__subtitle">{{ resolvedSubtitle }}</p>
  </header>
</template>

<style scoped>
.header-section {
  margin-bottom: 1rem;
}

.header-section__title {
  margin: 0;
  font-size: clamp(1.35rem, 2.2vw, 1.95rem);
  font-weight: 800;
  color: var(--hope-dark);
}

.header-section__subtitle {
  margin: 0.35rem 0 0;
  font-size: 0.95rem;
  color: color-mix(in srgb, var(--hope-dark) 62%, white);
}

@media (max-width: 640px) {
  .header-section {
    margin-bottom: 0.7rem;
  }

  .header-section__title {
    font-size: 1.2rem;
    line-height: 1.25;
  }

  .header-section__subtitle {
    margin-top: 0.3rem;
    font-size: 0.84rem;
    line-height: 1.35;
  }
}

@media (max-width: 420px) {
  .header-section__title {
    font-size: 1.08rem;
  }

  .header-section__subtitle {
    font-size: 0.8rem;
  }
}
</style>



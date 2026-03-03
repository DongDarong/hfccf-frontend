<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section>
    <h1>{{ t('pages.aboutTitle') }}</h1>
    <p>{{ t('pages.aboutDescription') }}</p>
  </section>
</template>

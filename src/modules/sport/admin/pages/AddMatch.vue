<script setup>
/**
 * SportAdminAddMatchPage
 * Placeholder shell for creating a new match record.
 *
 * The full match form will be introduced later; for now this page exists so the
 * Manage Matches "Add Match" action has a valid destination.
 */
import { computed, ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Form from '@/components/forms/Form.vue'
import AlertSuccess from '@/components/alerts/AlertSuccess.vue'
import AlertError from '@/components/alerts/AlertError.vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'SportAdminAddMatchPage',
})

const { t, language } = useLanguage()
const isKh = computed(() => language.value === 'KH')

const pageTitle = computed(() => t('sportMatchesManagement.addTitle'))
const pageSubtitle = computed(() => t('sportMatchesManagement.addSubtitle'))
const isSubmitting = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const errorMessage = ref('')

const checklistItems = computed(() => [
  t('sportMatchesManagement.addChecklist.0'),
  t('sportMatchesManagement.addChecklist.1'),
  t('sportMatchesManagement.addChecklist.2'),
])

function resetFeedback() {
  errorMessage.value = ''
  showError.value = false
}

async function onSubmit() {
  resetFeedback()
  isSubmitting.value = true

  try {
    // Placeholder submit: the real match form will replace this shell later.
    await new Promise((resolve) => setTimeout(resolve, 700))
    showSuccess.value = true
  } catch {
    errorMessage.value = t('sportMatchesManagement.addFailed')
    showError.value = true
  } finally {
    isSubmitting.value = false
  }
}

function onErrorClose() {
  showError.value = false
}

function onSuccessClose() {
  showSuccess.value = false
}
</script>

<template>
  <MainLayout>
    <section :class="isKh ? 'add-match-page add-match-page--kh' : 'add-match-page'">
      <HeaderSection :title="pageTitle" :subtitle="pageSubtitle" />

      <div class="add-match-page__shell">
        <Form
          class="add-match-page__form"
          :title="pageTitle"
          :description="t('sportMatchesManagement.addPlaceholder')"
          :submit-text="t('sportMatchesManagement.actions.addButton')"
          :cancel-text="t('common.cancel')"
          :loading="isSubmitting"
          :show-cancel="false"
          @submit="onSubmit"
        >
          <div class="add-match-page__callout">
            <p class="add-match-page__hint">
              {{ t('sportMatchesManagement.addDescription') }}
            </p>
            <ul class="add-match-page__checklist">
              <li v-for="item in checklistItems" :key="item">{{ item }}</li>
            </ul>
          </div>
        </Form>
      </div>
    </section>

    <AlertError
      :show="showError"
      :title="t('sportMatchesManagement.addErrorTitle')"
      :message="errorMessage || t('common.errorTryAgain')"
      :button-text="t('common.close')"
      @close="onErrorClose"
    />

    <AlertSuccess
      :show="showSuccess"
      :title="t('sportMatchesManagement.addSuccessTitle')"
      :message="t('sportMatchesManagement.addSuccessMessage')"
      :button-text="t('common.close')"
      @close="onSuccessClose"
    />
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

.add-match-page__form {
  display: block;
}

.add-match-page__callout {
  display: grid;
  gap: 0.85rem;
}

.add-match-page__hint {
  margin: 0;
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.7;
}

.add-match-page__checklist {
  margin: 0;
  padding-left: 1.15rem;
  color: #334155;
  line-height: 1.7;
}

.add-match-page--kh .add-match-page__shell {
  font-family:
    'Noto Sans Khmer', 'Khmer OS Siemreap', 'Khmer OS Battambang', 'Leelawadee UI', sans-serif;
}
</style>

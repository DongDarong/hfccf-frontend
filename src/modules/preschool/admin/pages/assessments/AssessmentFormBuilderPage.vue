<script setup>
import { computed } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import Button from '@/components/buttons/Button.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import { useLanguage } from '@/composables/useLanguage'
import AssessmentPageHeader from '@/modules/preschool/admin/components/assessment/AssessmentPageHeader.vue'
import {
  PRESCHOOL_ASSESSMENT_FORM_BUILDER_CANVAS,
  PRESCHOOL_ASSESSMENT_FORM_BUILDER_SECTIONS,
  PRESCHOOL_ASSESSMENT_FORM_BUILDER_SETTINGS,
} from './constants/preschoolAssessmentFormBuilder'

defineOptions({
  name: 'PreschoolAssessmentFormBuilderPage',
})

const { t, te } = useLanguage()

function safeText(key, fallback) {
  return te(key) ? t(key) : fallback
}

const builderSections = computed(() =>
  PRESCHOOL_ASSESSMENT_FORM_BUILDER_SECTIONS.map(section => ({
    ...section,
    title: safeText(section.titleKey, section.titleFallback),
    description: safeText(section.descriptionKey, section.descriptionFallback),
  }))
)

const builderCanvas = computed(() =>
  PRESCHOOL_ASSESSMENT_FORM_BUILDER_CANVAS.map(item => ({
    ...item,
    title: safeText(item.titleKey, item.titleFallback),
    description: safeText(item.descriptionKey, item.descriptionFallback),
  }))
)

const builderSettings = computed(() =>
  PRESCHOOL_ASSESSMENT_FORM_BUILDER_SETTINGS.map(item => ({
    ...item,
    title: safeText(item.titleKey, item.titleFallback),
    description: safeText(item.descriptionKey, item.descriptionFallback),
  }))
)

const workspaceStats = computed(() => [
  {
    label: safeText('assessmentFormBuilder.stats.sections', 'Sections'),
    value: '3',
  },
  {
    label: safeText('assessmentFormBuilder.stats.questions', 'Questions'),
    value: '18',
  },
  {
    label: safeText('assessmentFormBuilder.stats.version', 'Version'),
    value: '2026.1',
  },
])
</script>

<template>
  <MainLayout>
    <section class="assessment-form-builder-page">
      <AssessmentPageHeader
        :title="safeText('assessmentFormBuilder.title', 'Form Builder')"
        :subtitle="safeText('assessmentFormBuilder.subtitle', 'Design assessment forms, scoring rubrics, and reusable question layouts.')"
      />

      <div class="assessment-form-builder-toolbar">
        <div class="assessment-form-builder-toolbar__meta">
          <span class="assessment-form-builder-toolbar__badge">
            {{ safeText('assessmentFormBuilder.badge', 'Preschool Assessment') }}
          </span>
          <div class="assessment-form-builder-toolbar__stats">
            <div
              v-for="stat in workspaceStats"
              :key="stat.label"
              class="assessment-form-builder-toolbar__stat"
            >
              <strong>{{ stat.value }}</strong>
              <span>{{ stat.label }}</span>
            </div>
          </div>
        </div>

        <div class="assessment-form-builder-toolbar__actions">
          <Button
            :label="safeText('assessmentFormBuilder.actions.saveDraft', 'Save Draft')"
            icon="pi pi-save"
            severity="secondary"
          />
          <Button
            :label="safeText('assessmentFormBuilder.actions.preview', 'Preview')"
            icon="pi pi-eye"
            severity="secondary"
          />
          <Button
            :label="safeText('assessmentFormBuilder.actions.publish', 'Publish')"
            icon="pi pi-send"
          />
        </div>
      </div>

      <div class="assessment-form-builder-grid">
        <aside class="assessment-form-builder-panel assessment-form-builder-panel--sidebar">
          <HeaderSection
            :title="safeText('assessmentFormBuilder.sidebar.title', 'Build Workspace')"
            :subtitle="safeText('assessmentFormBuilder.sidebar.subtitle', 'Start with sections, question libraries, and logic rules.')"
          />

          <div class="assessment-form-builder-stack">
            <article
              v-for="section in builderSections"
              :key="section.key"
              class="assessment-form-builder-card"
            >
              <div class="assessment-form-builder-card__header">
                <span class="assessment-form-builder-card__icon">
                  <i :class="section.icon" />
                </span>
                <div>
                  <h3>{{ section.title }}</h3>
                  <p>{{ section.description }}</p>
                </div>
              </div>
            </article>
          </div>
        </aside>

        <main class="assessment-form-builder-panel assessment-form-builder-panel--canvas">
          <HeaderSection
            :title="safeText('assessmentFormBuilder.canvas.title', 'Live Preview')"
            :subtitle="safeText('assessmentFormBuilder.canvas.subtitle', 'Drag questions into the preview and refine the flow here.')"
          />

          <div class="assessment-form-builder-canvas">
            <article
              v-for="item in builderCanvas"
              :key="item.key"
              class="assessment-form-builder-canvas__section"
            >
              <div class="assessment-form-builder-canvas__section-header">
                <h3>{{ item.title }}</h3>
                <span>{{ item.description }}</span>
              </div>
              <div class="assessment-form-builder-canvas__empty">
                <i class="pi pi-plus" />
                <p>{{ safeText('assessmentFormBuilder.canvas.empty', 'Drop questions here to start building the section.') }}</p>
              </div>
            </article>
          </div>
        </main>

        <aside class="assessment-form-builder-panel assessment-form-builder-panel--settings">
          <HeaderSection
            :title="safeText('assessmentFormBuilder.settings.title', 'Question Settings')"
            :subtitle="safeText('assessmentFormBuilder.settings.subtitle', 'Validation, scoring, and publishing controls.')"
          />

          <div class="assessment-form-builder-stack">
            <article
              v-for="item in builderSettings"
              :key="item.key"
              class="assessment-form-builder-card assessment-form-builder-card--settings"
            >
              <div class="assessment-form-builder-card__header">
                <div>
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.description }}</p>
                </div>
              </div>
            </article>
          </div>
        </aside>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.assessment-form-builder-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.assessment-form-builder-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 1.25rem;
  border: 1px solid #dbeafe;
  background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
}

.assessment-form-builder-toolbar__meta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.assessment-form-builder-toolbar__badge {
  display: inline-flex;
  align-self: flex-start;
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 0.8rem;
  font-weight: 700;
}

.assessment-form-builder-toolbar__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.assessment-form-builder-toolbar__stat {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.65rem 0.85rem;
  border-radius: 0.9rem;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  min-width: 110px;
}

.assessment-form-builder-toolbar__stat strong {
  font-size: 1.05rem;
  color: #0f172a;
}

.assessment-form-builder-toolbar__stat span {
  font-size: 0.78rem;
  color: #64748b;
}

.assessment-form-builder-toolbar__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.75rem;
}

.assessment-form-builder-grid {
  display: grid;
  grid-template-columns: minmax(240px, 280px) minmax(0, 1fr) minmax(240px, 280px);
  gap: 1rem;
}

.assessment-form-builder-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 1.25rem;
  border: 1px solid #dbeafe;
  background: #ffffff;
  padding: 1rem;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.05);
}

.assessment-form-builder-stack {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.assessment-form-builder-card {
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  padding: 0.9rem;
}

.assessment-form-builder-card__header {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.assessment-form-builder-card__icon {
  display: inline-flex;
  width: 2.5rem;
  height: 2.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.8rem;
  background: #eff6ff;
  color: #2563eb;
  flex-shrink: 0;
}

.assessment-form-builder-card h3,
.assessment-form-builder-canvas__section-header h3 {
  margin: 0;
  font-size: 0.98rem;
  color: #0f172a;
}

.assessment-form-builder-card p,
.assessment-form-builder-canvas__section-header span {
  margin: 0.25rem 0 0;
  font-size: 0.84rem;
  color: #64748b;
  line-height: 1.5;
}

.assessment-form-builder-canvas {
  display: grid;
  gap: 1rem;
}

.assessment-form-builder-canvas__section {
  border-radius: 1rem;
  border: 1px dashed #bfdbfe;
  background: linear-gradient(135deg, #f8fbff 0%, #ffffff 100%);
  padding: 1rem;
}

.assessment-form-builder-canvas__section-header {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-bottom: 0.85rem;
}

.assessment-form-builder-canvas__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  min-height: 120px;
  border-radius: 0.9rem;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #94a3b8;
  text-align: center;
  padding: 1rem;
}

.assessment-form-builder-canvas__empty i {
  font-size: 1.25rem;
  color: #3b82f6;
}

.assessment-form-builder-canvas__empty p {
  margin: 0;
  max-width: 24ch;
}

@media (max-width: 1200px) {
  .assessment-form-builder-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .assessment-form-builder-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .assessment-form-builder-toolbar__actions {
    justify-content: stretch;
  }
}
</style>

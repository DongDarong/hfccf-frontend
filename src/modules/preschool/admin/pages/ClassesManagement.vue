<script setup>
import { computed, ref, watch } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import SearchFilterBar from '@/components/forms/SearchFilterBar.vue'
import Pagination from '@/components/data-display/Pagination.vue'
import Button from 'primevue/button'
import ClassTable from '@/modules/classes/components/ClassTable.vue'
import { useLanguage } from '@/composables/useLanguage'

defineOptions({
  name: 'PreschoolAdminClassesManagementPage',
})

const { t, language } = useLanguage()
const isKh = computed(() => language.value === 'KH')

const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = 8

const roleOptions = ['Nursery', 'Kindergarten A', 'Kindergarten B', 'Prep']
const statusOptions = ['active', 'pending', 'closed']

const classRows = ref([
  {
    id: 'preschool-class-1',
    code: 'PS-NUR-01',
    name: 'Morning Nursery',
    teacher: 'Srey Pov',
    level: 'Nursery',
    schedule: 'Mon-Fri, 8:00 AM',
    students: 18,
    status: 'Active',
  },
  {
    id: 'preschool-class-2',
    code: 'PS-KA-02',
    name: 'Kindergarten A Blue',
    teacher: 'Dara',
    level: 'Kindergarten A',
    schedule: 'Mon-Fri, 9:30 AM',
    students: 22,
    status: 'Active',
  },
  {
    id: 'preschool-class-3',
    code: 'PS-KB-01',
    name: 'Kindergarten B Red',
    teacher: 'Malis',
    level: 'Kindergarten B',
    schedule: 'Mon-Fri, 1:00 PM',
    students: 20,
    status: 'Pending',
  },
  {
    id: 'preschool-class-4',
    code: 'PS-PRE-01',
    name: 'Prep Readiness Group',
    teacher: 'Sokha',
    level: 'Prep',
    schedule: 'Mon-Fri, 2:30 PM',
    students: 16,
    status: 'Active',
  },
  {
    id: 'preschool-class-5',
    code: 'PS-NUR-02',
    name: 'Afternoon Nursery',
    teacher: 'Chanthy',
    level: 'Nursery',
    schedule: 'Mon-Fri, 1:30 PM',
    students: 17,
    status: 'Closed',
  },
  {
    id: 'preschool-class-6',
    code: 'PS-KA-03',
    name: 'Kindergarten A Green',
    teacher: 'Pisey',
    level: 'Kindergarten A',
    schedule: 'Sat, 8:30 AM',
    students: 14,
    status: 'Active',
  },
  {
    id: 'preschool-class-7',
    code: 'PS-KB-02',
    name: 'Kindergarten B Yellow',
    teacher: 'Ratha',
    level: 'Kindergarten B',
    schedule: 'Sat, 10:00 AM',
    students: 15,
    status: 'Pending',
  },
])

function normalize(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
}

const filteredClasses = computed(() => {
  const query = normalize(searchQuery.value)

  return classRows.value.filter((item) => {
    let isMatch = true

    if (query) {
      const haystack = normalize(
        `${item.code} ${item.name} ${item.teacher} ${item.level} ${item.schedule}`,
      )
      isMatch = haystack.includes(query)
    }

    if (isMatch && roleFilter.value) {
      isMatch = normalize(item.level) === normalize(roleFilter.value)
    }

    if (isMatch && statusFilter.value) {
      isMatch = normalize(item.status) === normalize(statusFilter.value)
    }

    return isMatch
  })
})

const totalPages = computed(() => Math.max(Math.ceil(filteredClasses.value.length / pageSize), 1))
const paginatedClasses = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredClasses.value.slice(start, start + pageSize)
})

const totalClasses = computed(() => classRows.value.length)
const activeClasses = computed(
  () => classRows.value.filter((c) => normalize(c.status) === 'active').length,
)
const pendingClasses = computed(
  () => classRows.value.filter((c) => normalize(c.status) === 'pending').length,
)
const totalStudents = computed(() =>
  classRows.value.reduce((sum, c) => sum + Number(c.students || 0), 0),
)

const activeRateLabel = computed(() => {
  if (!totalClasses.value) return '0%'
  return `${Math.round((activeClasses.value / totalClasses.value) * 100)}%`
})

const summaryCards = computed(() => [
  {
    id: 'classes',
    title: t('preschoolClassesManagement.summary.total.title'),
    value: totalClasses.value,
    badge: t('preschoolClassesManagement.summary.total.badge', { count: totalClasses.value }),
    caption: t('preschoolClassesManagement.summary.total.caption'),
    tone: 'info',
    icon:
      'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  {
    id: 'active',
    title: t('preschoolClassesManagement.summary.active.title'),
    value: activeClasses.value,
    badge: t('preschoolClassesManagement.summary.active.badge', { rate: activeRateLabel.value }),
    caption: t('preschoolClassesManagement.summary.active.caption'),
    tone: 'success',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    id: 'pending',
    title: t('preschoolClassesManagement.summary.pending.title'),
    value: pendingClasses.value,
    badge: pendingClasses.value
      ? t('preschoolClassesManagement.summary.pending.badge')
      : t('preschoolClassesManagement.summary.pending.badgeClear'),
    caption: t('preschoolClassesManagement.summary.pending.caption'),
    tone: 'warning',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    id: 'students',
    title: t('preschoolClassesManagement.summary.students.title'),
    value: totalStudents.value,
    badge: t('preschoolClassesManagement.summary.students.badge'),
    caption: t('preschoolClassesManagement.summary.students.caption'),
    tone: 'danger',
    icon:
      'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  },
])

const highlightItems = computed(() => {
  const visibleStudents = filteredClasses.value.reduce(
    (sum, c) => sum + Number(c.students || 0),
    0,
  )
  const avgStudents = filteredClasses.value.length
    ? Math.round(visibleStudents / filteredClasses.value.length)
    : 0

  return [
    {
      label: t('preschoolClassesManagement.highlights.visibleClasses'),
      value: filteredClasses.value.length,
    },
    {
      label: t('preschoolClassesManagement.highlights.visibleStudents'),
      value: visibleStudents,
    },
    {
      label: t('preschoolClassesManagement.highlights.avgStudents'),
      value: avgStudents,
    },
  ]
})

const toolbarSummary = computed(() =>
  t('preschoolClassesManagement.toolbarSummary', { count: filteredClasses.value.length }),
)

const visibleRangeLabel = computed(() => {
  if (!filteredClasses.value.length) return t('preschoolClassesManagement.noResults')

  const start = (currentPage.value - 1) * pageSize + 1
  const end = Math.min(currentPage.value * pageSize, filteredClasses.value.length)
  return t('preschoolClassesManagement.visibleRange', {
    start,
    end,
    total: filteredClasses.value.length,
  })
})

watch(
  () => filteredClasses.value.length,
  () => {
    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
  },
)

function onAddClass() {
  console.log('Add Preschool class')
}

function onViewClass(item) {
  console.log('View Preschool class', item)
}

function onEditClass(item) {
  console.log('Edit Preschool class', item)
}

function onDeleteClass(item) {
  const id = String(item?.id || '').trim()
  if (!id) return
  classRows.value = classRows.value.filter((row) => row.id !== id)
}
</script>

<template>
  <MainLayout>
    <section
      :class="
        isKh ? 'preschool-classes-page preschool-classes-page--kh' : 'preschool-classes-page'
      "
    >
      <HeaderSection
        :title="t('preschoolClassesManagement.title')"
        :subtitle="t('preschoolClassesManagement.subtitle')"
      />

      <div class="preschool-classes-page__summary-grid">
        <article
          v-for="card in summaryCards"
          :key="card.id"
          class="preschool-classes-page__summary-card"
          :class="`preschool-classes-page__summary-card--${card.tone}`"
        >
          <div class="preschool-classes-page__summary-header">
            <div>
              <p class="preschool-classes-page__summary-title">{{ card.title }}</p>
              <p class="preschool-classes-page__summary-value">{{ card.value }}</p>
            </div>

            <span class="preschool-classes-page__summary-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path :d="card.icon" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>

          <p class="preschool-classes-page__summary-badge">{{ card.badge }}</p>
          <p class="preschool-classes-page__summary-caption">{{ card.caption }}</p>
        </article>
      </div>

      <div class="preschool-classes-page__shell">
        <div class="preschool-classes-page__toolbar">
          <div class="preschool-classes-page__toolbar-copy">
            <p class="preschool-classes-page__eyebrow">
              {{ t('preschoolClassesManagement.toolbarEyebrow') }}
            </p>
            <h2 class="preschool-classes-page__toolbar-title">{{ toolbarSummary }}</h2>
            <p class="preschool-classes-page__toolbar-text">{{ visibleRangeLabel }}</p>
          </div>

          <div class="preschool-classes-page__toolbar-actions">
            <div class="preschool-classes-page__spotlight">
              <span class="preschool-classes-page__spotlight-label">
                {{ t('preschoolClassesManagement.spotlightLabel') }}
              </span>
              <strong class="preschool-classes-page__spotlight-value">{{ activeClasses }}</strong>
            </div>

            <Button
              type="button"
              :label="t('preschoolClassesManagement.addButton')"
              icon="pi pi-plus"
              class="preschool-classes-page__add-button"
              @click="onAddClass"
            />
          </div>
        </div>

        <SearchFilterBar
          class="w-full"
          v-model:searchQuery="searchQuery"
          v-model:roleFilter="roleFilter"
          v-model:statusFilter="statusFilter"
          :role-options="roleOptions"
          :status-options="statusOptions"
          :search-placeholder="t('preschoolClassesManagement.searchPlaceholder')"
        />

        <div class="preschool-classes-page__highlights">
          <div
            v-for="item in highlightItems"
            :key="item.label"
            class="preschool-classes-page__highlight"
          >
            <span class="preschool-classes-page__highlight-label">{{ item.label }}</span>
            <strong class="preschool-classes-page__highlight-value">{{ item.value }}</strong>
          </div>
        </div>

        <ClassTable
          :classes="paginatedClasses"
          :empty-text="t('preschoolClassesManagement.tableEmpty')"
          @view="onViewClass"
          @edit="onEditClass"
          @delete="onDeleteClass"
        />

        <div v-if="totalPages > 1" class="flex justify-end">
          <Pagination v-model="currentPage" :total-pages="totalPages" class="mt-2" />
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.preschool-classes-page {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.preschool-classes-page__summary-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.preschool-classes-page__summary-card {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 100%;
  padding: 1.35rem;
  border-radius: 1.35rem;
  border: 1px solid #dbe6f4;
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.92), transparent 34%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(244, 248, 252, 0.98) 100%);
  box-shadow: 0 24px 48px -38px rgba(15, 23, 42, 0.45);
}

.preschool-classes-page__summary-card::after {
  content: '';
  position: absolute;
  inset: auto 1.35rem 0.9rem 1.35rem;
  height: 0.25rem;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.16;
}

.preschool-classes-page__summary-card--info {
  color: #0f6f8f;
}

.preschool-classes-page__summary-card--success {
  color: #2f7a42;
}

.preschool-classes-page__summary-card--warning {
  color: #9a5d09;
}

.preschool-classes-page__summary-card--danger {
  color: #b42318;
}

.preschool-classes-page__summary-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.9rem;
}

.preschool-classes-page__summary-title {
  margin: 0;
  color: #64748b;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.preschool-classes-page__summary-value {
  margin: 0.65rem 0 0;
  color: #0f172a;
  font-size: 2rem;
  line-height: 1;
  font-weight: 800;
}

.preschool-classes-page__summary-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.95rem;
  background: color-mix(in srgb, currentColor 12%, white);
  border: 1px solid color-mix(in srgb, currentColor 18%, white);
}

.preschool-classes-page__summary-icon svg {
  width: 1.15rem;
  height: 1.15rem;
}

.preschool-classes-page__summary-badge {
  margin: 0;
  display: inline-flex;
  align-self: flex-start;
  padding: 0.38rem 0.72rem;
  border-radius: 999px;
  background: color-mix(in srgb, currentColor 10%, white);
  color: color-mix(in srgb, currentColor 85%, black 10%);
  font-size: 0.78rem;
  font-weight: 700;
}

.preschool-classes-page__summary-caption {
  margin: 0;
  color: #475569;
  font-size: 0.88rem;
  line-height: 1.55;
}

.preschool-classes-page__shell {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid #dce6f2;
  background:
    radial-gradient(circle at top left, rgba(186, 230, 253, 0.18), transparent 24%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%);
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.5);
}

.preschool-classes-page__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.preschool-classes-page__toolbar-copy {
  min-width: 0;
}

.preschool-classes-page__eyebrow {
  margin: 0;
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.preschool-classes-page__toolbar-title {
  margin: 0.35rem 0 0;
  color: #0f172a;
  font-size: 1.4rem;
  line-height: 1.2;
  font-weight: 800;
}

.preschool-classes-page__toolbar-text {
  margin: 0.45rem 0 0;
  color: #475569;
  font-size: 0.92rem;
  line-height: 1.6;
}

.preschool-classes-page__spotlight {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.8rem 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(14, 116, 144, 0.16);
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(255, 255, 255, 0.94) 100%);
}

.preschool-classes-page__toolbar-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

.preschool-classes-page__add-button {
  min-height: 2.8rem;
  border-radius: 0.9rem;
  font-weight: 800;
}

.preschool-classes-page__spotlight-label {
  color: #0f6f8f;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.preschool-classes-page__spotlight-value {
  color: #0f172a;
  font-size: 1.3rem;
  line-height: 1;
  font-weight: 800;
}

.preschool-classes-page__highlights {
  display: grid;
  gap: 0.85rem;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.preschool-classes-page__highlight {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  background: rgba(255, 255, 255, 0.82);
}

.preschool-classes-page__highlight-label {
  color: #475569;
  font-size: 0.82rem;
  font-weight: 600;
}

.preschool-classes-page__highlight-value {
  color: #0f172a;
  font-size: 1.05rem;
  font-weight: 800;
}

.preschool-classes-page--kh .preschool-classes-page__summary-title,
.preschool-classes-page--kh .preschool-classes-page__summary-badge,
.preschool-classes-page--kh .preschool-classes-page__eyebrow,
.preschool-classes-page--kh .preschool-classes-page__spotlight-label,
.preschool-classes-page--kh .preschool-classes-page__highlight-label,
.preschool-classes-page--kh .preschool-classes-page__toolbar-text,
.preschool-classes-page--kh .preschool-classes-page__summary-caption {
  font-family:
    'Noto Sans Khmer', 'Khmer OS Siemreap', 'Khmer OS Battambang', 'Leelawadee UI', sans-serif;
}

.preschool-classes-page--kh .preschool-classes-page__summary-title,
.preschool-classes-page--kh .preschool-classes-page__eyebrow,
.preschool-classes-page--kh .preschool-classes-page__spotlight-label {
  text-transform: none;
  letter-spacing: 0.01em;
}

.preschool-classes-page--kh .preschool-classes-page__summary-caption,
.preschool-classes-page--kh .preschool-classes-page__toolbar-text,
.preschool-classes-page--kh .preschool-classes-page__highlight-label {
  font-size: 0.92rem;
  line-height: 1.65;
}

@media (max-width: 640px) {
  .preschool-classes-page__summary-card,
  .preschool-classes-page__shell {
    padding: 1.1rem;
  }

  .preschool-classes-page__toolbar-title {
    font-size: 1.2rem;
  }
}
</style>

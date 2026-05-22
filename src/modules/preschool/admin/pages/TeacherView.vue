<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Button from '@/components/buttons/Button.vue'
import StatusBadge from '@/components/data-display/StatusBadge.vue'
import { useLanguage } from '@/composables/useLanguage'
import { fetchPreschoolTeacher } from '@/modules/preschool/services/preschoolApi'
import { getAvatarInitials, resolveAvatarSource } from '@/utils/avatar'

defineOptions({
  name: 'PreschoolAdminTeacherViewPage',
})

const route = useRoute()
const router = useRouter()
const { t } = useLanguage()

const teacher = ref(null)
const loading = ref(false)
const errorMessage = ref('')

const teacherId = computed(() => String(route.params.id || '').trim())

const avatarSrc = computed(() => resolveAvatarSource(teacher.value?.avatar || teacher.value?.avatarUrl || ''))
const avatarInitials = computed(() => getAvatarInitials(teacher.value?.name || '', '?'))
const showImage = ref(false)

function onImgLoad() { showImage.value = true }
function onImgError() { showImage.value = false }

const permissions = computed(() => {
  const perms = teacher.value?.permissions
  if (Array.isArray(perms)) return perms
  return []
})

async function loadTeacher() {
  if (!teacherId.value) return
  loading.value = true
  errorMessage.value = ''
  try {
    const data = await fetchPreschoolTeacher(teacherId.value)
    teacher.value = data || null
  } catch (error) {
    errorMessage.value = error?.message || t('preschoolTeacherView.loadFailed')
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/module/preschool-admin/users')
}

function goEdit() {
  router.push({ path: '/module/preschool-admin/users/add', query: { mode: 'edit', id: teacherId.value } })
}

onMounted(loadTeacher)
</script>

<template>
  <MainLayout>
    <section class="teacher-view">
      <HeaderSection
        :title="t('preschoolTeacherView.title')"
        :subtitle="t('preschoolTeacherView.subtitle')"
      />

      <!-- loading skeleton -->
      <div v-if="loading" class="teacher-view__skeleton">
        <div class="teacher-view__skeleton-avatar" />
        <div class="teacher-view__skeleton-lines">
          <div class="teacher-view__skeleton-line teacher-view__skeleton-line--lg" />
          <div class="teacher-view__skeleton-line teacher-view__skeleton-line--sm" />
        </div>
      </div>

      <!-- error -->
      <div v-else-if="errorMessage" class="teacher-view__error">
        {{ errorMessage }}
      </div>

      <template v-else-if="teacher">

        <!-- profile card -->
        <div class="teacher-view__profile-card">
          <!-- avatar -->
          <div class="teacher-view__avatar-wrap">
            <div class="teacher-view__avatar">
              <span v-if="!showImage" class="teacher-view__avatar-initials">{{ avatarInitials }}</span>
              <img
                v-if="avatarSrc"
                :src="avatarSrc"
                :alt="teacher.name"
                class="teacher-view__avatar-img"
                :class="{ 'teacher-view__avatar-img--visible': showImage }"
                @load="onImgLoad"
                @error="onImgError"
              />
            </div>
          </div>

          <!-- identity -->
          <div class="teacher-view__identity">
            <h2 class="teacher-view__name">{{ teacher.name || teacher.fullName || '—' }}</h2>
            <p v-if="teacher.username" class="teacher-view__username">@{{ teacher.username }}</p>
            <div class="teacher-view__badges">
              <StatusBadge :status="teacher.status" :label="teacher.status" size="sm" />
              <span class="teacher-view__role-badge">{{ teacher.role || '—' }}</span>
            </div>
          </div>

          <!-- actions -->
          <div class="teacher-view__profile-actions">
            <Button variant="ghost" rounded="xl" size="sm" @click="goBack">
              <template #iconLeft>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="teacher-view__btn-icon">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </template>
              {{ t('preschoolTeacherView.actions.back') }}
            </Button>
            <Button variant="primary" rounded="xl" size="sm" @click="goEdit">
              {{ t('preschoolTeacherView.actions.edit') }}
              <template #iconRight>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="teacher-view__btn-icon">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </template>
            </Button>
          </div>
        </div>

        <!-- info grid -->
        <div class="teacher-view__grid">

          <!-- contact section -->
          <div class="teacher-view__section">
            <p class="teacher-view__section-title">{{ t('preschoolTeacherView.sections.contact') }}</p>
            <div class="teacher-view__field-list">
              <div class="teacher-view__field">
                <span class="teacher-view__field-label">{{ t('preschoolTeacherView.fields.email') }}</span>
                <a
                  v-if="teacher.email"
                  :href="`mailto:${teacher.email}`"
                  class="teacher-view__field-value teacher-view__field-value--link"
                >{{ teacher.email }}</a>
                <span v-else class="teacher-view__field-value teacher-view__field-value--empty">
                  {{ t('preschoolTeacherView.fields.noEmail') }}
                </span>
              </div>
              <div class="teacher-view__field">
                <span class="teacher-view__field-label">{{ t('preschoolTeacherView.fields.phone') }}</span>
                <a
                  v-if="teacher.phone"
                  :href="`tel:${teacher.phone}`"
                  class="teacher-view__field-value teacher-view__field-value--link"
                >{{ teacher.phone }}</a>
                <span v-else class="teacher-view__field-value teacher-view__field-value--empty">
                  {{ t('preschoolTeacherView.fields.noPhone') }}
                </span>
              </div>
            </div>
          </div>

          <!-- account section -->
          <div class="teacher-view__section">
            <p class="teacher-view__section-title">{{ t('preschoolTeacherView.sections.account') }}</p>
            <div class="teacher-view__field-list">
              <div class="teacher-view__field">
                <span class="teacher-view__field-label">{{ t('preschoolTeacherView.fields.username') }}</span>
                <span class="teacher-view__field-value">{{ teacher.username || '—' }}</span>
              </div>
              <div class="teacher-view__field">
                <span class="teacher-view__field-label">{{ t('preschoolTeacherView.fields.role') }}</span>
                <span class="teacher-view__field-value">{{ teacher.role || '—' }}</span>
              </div>
              <div class="teacher-view__field">
                <span class="teacher-view__field-label">{{ t('preschoolTeacherView.fields.status') }}</span>
                <StatusBadge :status="teacher.status" :label="teacher.status" size="sm" />
              </div>
            </div>
          </div>

          <!-- permissions section (full width) -->
          <div class="teacher-view__section teacher-view__section--full">
            <p class="teacher-view__section-title">{{ t('preschoolTeacherView.sections.permissions') }}</p>
            <div v-if="permissions.length" class="teacher-view__permissions">
              <span v-for="perm in permissions" :key="perm" class="teacher-view__perm-chip">
                {{ perm }}
              </span>
            </div>
            <p v-else class="teacher-view__field-value teacher-view__field-value--empty">
              {{ t('preschoolTeacherView.fields.noPermissions') }}
            </p>
          </div>
        </div>

      </template>
    </section>
  </MainLayout>
</template>

<style scoped>
.teacher-view {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* skeleton */
.teacher-view__skeleton {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.teacher-view__skeleton-avatar {
  width: 5rem;
  height: 5rem;
  border-radius: 9999px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  flex-shrink: 0;
}

.teacher-view__skeleton-lines {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.teacher-view__skeleton-line {
  border-radius: 0.5rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.teacher-view__skeleton-line--lg { height: 1.1rem; width: 45%; }
.teacher-view__skeleton-line--sm { height: 0.8rem; width: 28%; }

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* error */
.teacher-view__error {
  padding: 0.75rem 1rem;
  border-radius: 0.8rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
}

/* profile card */
.teacher-view__profile-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.75rem 2rem;
  border-radius: 1.5rem;
  border: 1px solid #e2e8f0;
  background:
    radial-gradient(circle at top left, rgba(186, 230, 253, 0.18), transparent 30%),
    linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(248,250,252,0.98) 100%);
  box-shadow: 0 25px 60px -40px rgba(15, 23, 42, 0.45);
}

/* avatar */
.teacher-view__avatar-wrap {
  flex-shrink: 0;
}

.teacher-view__avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #7dd3fc 0%, #0369a1 100%);
  box-shadow:
    0 0 0 3px #fff,
    0 0 0 5px #e0f2fe,
    0 16px 32px -16px rgba(3, 105, 161, 0.5);
  color: #fff;
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  overflow: hidden;
}

.teacher-view__avatar-initials {
  user-select: none;
}

.teacher-view__avatar-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 9999px;
  opacity: 0;
  transition: opacity 0.18s ease;
}

.teacher-view__avatar-img--visible {
  opacity: 1;
}

/* identity */
.teacher-view__identity {
  flex: 1;
  min-width: 0;
}

.teacher-view__name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
  margin: 0 0 0.15rem;
}

.teacher-view__username {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0 0 0.6rem;
}

.teacher-view__badges {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.teacher-view__role-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  background: #e0f2fe;
  color: #0369a1;
  border: 1px solid #bae6fd;
}

/* profile actions */
.teacher-view__profile-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-shrink: 0;
}

.teacher-view__btn-icon {
  width: 0.95rem;
  height: 0.95rem;
}

/* info grid */
.teacher-view__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.teacher-view__section {
  padding: 1.25rem 1.5rem;
  border-radius: 1.25rem;
  border: 1px solid #e2e8f0;
  background: linear-gradient(180deg, #fff 0%, #f8fafc 100%);
}

.teacher-view__section--full {
  grid-column: 1 / -1;
}

.teacher-view__section-title {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #0369a1;
  margin: 0 0 0.85rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0f2fe;
}

.teacher-view__field-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.teacher-view__field {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.teacher-view__field-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.teacher-view__field-value {
  font-size: 0.875rem;
  color: #0f172a;
  font-weight: 500;
}

.teacher-view__field-value--link {
  color: #0369a1;
  text-decoration: none;
}

.teacher-view__field-value--link:hover {
  text-decoration: underline;
}

.teacher-view__field-value--empty {
  color: #94a3b8;
  font-style: italic;
}

/* permissions */
.teacher-view__permissions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.teacher-view__perm-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.22rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 600;
  background: #f0f9ff;
  color: #0369a1;
  border: 1px solid #bae6fd;
}

@media (max-width: 768px) {
  .teacher-view__profile-card {
    flex-wrap: wrap;
    padding: 1.25rem;
    gap: 1rem;
  }

  .teacher-view__profile-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .teacher-view__grid {
    grid-template-columns: 1fr;
  }
}
</style>

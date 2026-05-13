<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import MainLayout from '@/layouts/MainLayout.vue'
import HeaderSection from '@/components/navigation/HeaderSection.vue'
import Loading from '@/components/feedback/Loading.vue'
import StatusBadge from '@/components/badges/StatusBadge.vue'
import RolesBadge from '@/components/badges/RolesBadge.vue'
import PermissionBadge from '@/components/badges/PermissionBadge.vue'
import { useLanguage } from '@/composables/useLanguage'
import { normalizeRole } from '@/constants/roles'
import { getAdminUser } from '@/modules/super-admin/services/adminUsersApi'
import { getAvatarInitials, resolveAvatarSource } from '@/utils/avatar'

defineOptions({
  name: 'SuperAdminViewUserPage',
})

const route = useRoute()
const router = useRouter()
const { t } = useLanguage()

const user = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')
const avatarLoaded = ref(false)
const avatarErrored = ref(false)

const userId = computed(() => String(route.params.id || '').trim())

function resolvedText(key, fallback) {
  const translated = t(key)

  return translated !== key ? translated : fallback
}

function formatDateTime(value) {
  const normalized = String(value || '').trim()

  if (!normalized) return '-'

  const date = new Date(normalized)

  if (Number.isNaN(date.getTime())) {
    return normalized
  }

  return date.toLocaleString()
}

function roleLabel(value) {
  const normalized = normalizeRole(value)
  const key = `common.role.${String(normalized || '').replace(/[\s-]+/g, '_').toLowerCase()}`
  const translated = t(key)

  return translated !== key ? translated : String(value || '-')
}

function statusLabel(value) {
  const key = `common.status.${String(value || '').replace(/[\s-]+/g, '_').toLowerCase()}`
  const translated = t(key)

  return translated !== key ? translated : String(value || '-')
}

function statusTone(value) {
  const key = String(value || '').trim().toLowerCase()

  if (key === 'active') return 'success'
  if (key === 'pending') return 'info'
  if (key === 'inactive') return 'warning'
  if (key === 'suspended') return 'error'

  return 'info'
}

const resolvedAvatar = computed(() => {
  if (avatarErrored.value) return ''

  return resolveAvatarSource(user.value?.avatar, { fallbackToAsset: true })
})

const shouldShowAvatar = computed(() =>
  Boolean(resolvedAvatar.value) && Boolean(avatarLoaded.value) && !avatarErrored.value,
)

const avatarInitials = computed(() => getAvatarInitials(user.value?.name, '?'))

const displayPermissions = computed(() =>
  Array.isArray(user.value?.permissions) ? user.value.permissions : [],
)

const pageTitle = computed(() =>
  user.value?.name || resolvedText('users.viewUser.title', 'View User'),
)

const pageSubtitle = computed(() =>
  resolvedText(
    'users.viewUser.subtitle',
    'Review the account profile, permissions, and activity details.',
  ),
)

const detailItems = computed(() => [
  {
    label: resolvedText('users.viewUser.fields.fullName', 'Full Name'),
    value: user.value?.name || '-',
  },
  {
    label: resolvedText('users.viewUser.fields.email', 'Email'),
    value: user.value?.email || '-',
  },
  {
    label: resolvedText('users.viewUser.fields.phone', 'Phone'),
    value: user.value?.phone || '-',
  },
  {
    label: resolvedText('users.viewUser.fields.role', 'Role'),
    value: roleLabel(user.value?.role),
  },
  {
    label: resolvedText('users.viewUser.fields.status', 'Status'),
    value: statusLabel(user.value?.status),
  },
  {
    label: resolvedText('users.viewUser.fields.department', 'Department'),
    value: user.value?.department || '-',
  },
  {
    label: resolvedText('users.viewUser.fields.createdAt', 'Created at'),
    value: formatDateTime(user.value?.createdAt),
  },
  {
    label: resolvedText('users.viewUser.fields.lastLogin', 'Last login'),
    value: formatDateTime(user.value?.lastLoginAt),
  },
])

async function loadUser() {
  const id = userId.value

  if (!id) {
    errorMessage.value = resolvedText(
      'users.viewUser.notFoundMessage',
      'The requested user could not be loaded.',
    )
    isLoading.value = false
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  avatarLoaded.value = false
  avatarErrored.value = false

  try {
    const result = await getAdminUser(id)
    user.value = result || null

    if (!result) {
      errorMessage.value = resolvedText(
        'users.viewUser.notFoundMessage',
        'The requested user could not be loaded.',
      )
    }
  } catch (error) {
    user.value = null
    errorMessage.value =
      error?.message ||
      resolvedText('users.viewUser.loadFailed', 'Unable to load user details right now.')
  } finally {
    isLoading.value = false
  }
}

function goBack() {
  router.push({ path: '/module/super-admin/users/manage' })
}

function goToEdit() {
  const id = userId.value
  if (!id) return

  router.push({ path: '/module/super-admin/users/add', query: { mode: 'edit', id } })
}

function onAvatarLoad() {
  avatarLoaded.value = true
}

function onAvatarError() {
  avatarErrored.value = true
  avatarLoaded.value = false
}

watch(userId, () => {
  void loadUser()
})

onMounted(() => {
  void loadUser()
})
</script>

<template>
  <MainLayout>
    <section class="view-user-page">
      <HeaderSection :title="pageTitle" :subtitle="pageSubtitle" />

      <Card
        v-if="isLoading"
        class="view-user-page__state"
      >
        <template #content>
          <Loading
            :label="resolvedText('users.loadingUsers', 'Loading user details...')"
            size="md"
          />
        </template>
      </Card>

      <Card
        v-else-if="errorMessage"
        class="view-user-page__state view-user-page__state--error"
      >
        <template #title>
          {{ resolvedText('users.viewUser.notFoundTitle', 'User not found') }}
        </template>

        <template #content>
          <div class="view-user-page__state-copy">
            <p>{{ errorMessage }}</p>

            <div class="view-user-page__state-actions">
              <Button
                type="button"
                severity="secondary"
                outlined
                @click="goBack"
              >
                {{ resolvedText('users.viewUser.backButton', 'Back to users') }}
              </Button>
            </div>
          </div>
        </template>
      </Card>

      <template v-else>
        <Card class="view-user-page__hero">
          <template #content>
            <div class="view-user-page__hero-grid">
              <div class="view-user-page__avatar-wrap">
                <div class="view-user-page__avatar">
                  <span v-if="!shouldShowAvatar" class="view-user-page__avatar-initials">
                    {{ avatarInitials }}
                  </span>

                  <img
                    v-if="resolvedAvatar"
                    :src="resolvedAvatar"
                    :alt="`${user?.name || 'User'} avatar`"
                    class="view-user-page__avatar-image"
                    :class="{ 'view-user-page__avatar-image--visible': shouldShowAvatar }"
                    @load="onAvatarLoad"
                    @error="onAvatarError"
                  >
                </div>
              </div>

              <div class="view-user-page__hero-content">
                <div class="view-user-page__identity">
                  <h1 class="view-user-page__name">{{ user?.name || '-' }}</h1>
                  <p class="view-user-page__email">{{ user?.email || '-' }}</p>
                </div>

                <div class="view-user-page__badges">
                  <RolesBadge :role="user?.role" />
                  <StatusBadge
                    :status="statusTone(user?.status)"
                    :label="statusLabel(user?.status)"
                    size="sm"
                  />
                </div>

                <div class="view-user-page__actions">
                  <Button
                    type="button"
                    severity="secondary"
                    outlined
                    @click="goBack"
                  >
                    {{ resolvedText('users.viewUser.backButton', 'Back to users') }}
                  </Button>

                  <Button
                    type="button"
                    @click="goToEdit"
                  >
                    {{ resolvedText('users.viewUser.editButton', 'Edit user') }}
                  </Button>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <div class="view-user-page__grid">
          <Card class="view-user-page__card">
            <template #title>
              {{ resolvedText('users.viewUser.detailsTitle', 'Account details') }}
            </template>

            <template #content>
              <div class="view-user-page__details">
                <div
                  v-for="item in detailItems"
                  :key="item.label"
                  class="view-user-page__detail-row"
                >
                  <span class="view-user-page__detail-label">{{ item.label }}</span>
                  <span class="view-user-page__detail-value">{{ item.value }}</span>
                </div>
              </div>
            </template>
          </Card>

          <Card class="view-user-page__card">
            <template #title>
              {{ resolvedText('users.viewUser.permissionsTitle', 'Permissions') }}
            </template>

            <template #content>
              <div class="view-user-page__permissions">
                <template v-if="displayPermissions.length">
                  <PermissionBadge
                    v-for="permission in displayPermissions"
                    :key="permission"
                    :permission="permission"
                  />
                </template>

                <p
                  v-else
                  class="view-user-page__empty"
                >
                  {{ resolvedText('users.viewUser.emptyPermissions', 'No permissions assigned.') }}
                </p>
              </div>
            </template>
          </Card>

          <Card class="view-user-page__card">
            <template #title>
              {{ resolvedText('users.viewUser.activityTitle', 'Activity') }}
            </template>

            <template #content>
              <div class="view-user-page__details">
                <div class="view-user-page__detail-row">
                  <span class="view-user-page__detail-label">
                    {{ resolvedText('users.viewUser.fields.createdAt', 'Created at') }}
                  </span>
                  <span class="view-user-page__detail-value">
                    {{ formatDateTime(user?.createdAt) }}
                  </span>
                </div>

                <div class="view-user-page__detail-row">
                  <span class="view-user-page__detail-label">
                    {{ resolvedText('users.viewUser.fields.lastLogin', 'Last login') }}
                  </span>
                  <span class="view-user-page__detail-value">
                    {{ formatDateTime(user?.lastLoginAt) }}
                  </span>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </template>
    </section>
  </MainLayout>
</template>

<style scoped>
.view-user-page {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.view-user-page__hero,
.view-user-page__card,
.view-user-page__state {
  border: 1px solid #e2e8f0;
  border-radius: 1.25rem;
  background: #ffffff;
  box-shadow: 0 18px 34px -34px rgba(15, 23, 42, 0.25);
}

.view-user-page__hero-grid {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 1.25rem;
  align-items: center;
}

.view-user-page__avatar-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-user-page__avatar {
  position: relative;
  width: 6rem;
  height: 6rem;
  overflow: hidden;
  border-radius: 9999px;
  background: linear-gradient(135deg, #0ea5e9, #155e75);
  box-shadow: 0 18px 34px -26px rgba(15, 23, 42, 0.45);
}

.view-user-page__avatar-initials {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.6rem;
  font-weight: 900;
  letter-spacing: 0.06em;
}

.view-user-page__avatar-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.view-user-page__avatar-image--visible {
  opacity: 1;
}

.view-user-page__hero-content {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.85rem;
}

.view-user-page__identity {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.view-user-page__name {
  margin: 0;
  color: #0f172a;
  font-size: 1.4rem;
  font-weight: 900;
}

.view-user-page__email {
  margin: 0;
  color: #64748b;
  font-size: 0.92rem;
}

.view-user-page__badges,
.view-user-page__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.view-user-page__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.view-user-page__details {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.view-user-page__detail-row {
  display: flex;
  flex-direction: column;
  gap: 0.18rem;
  padding: 0.7rem 0.8rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.95rem;
  background: #f8fafc;
}

.view-user-page__detail-label {
  color: #64748b;
  font-size: 0.73rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.view-user-page__detail-value {
  color: #0f172a;
  font-size: 0.92rem;
  font-weight: 700;
  word-break: break-word;
}

.view-user-page__permissions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.view-user-page__empty {
  margin: 0;
  color: #64748b;
  font-size: 0.92rem;
}

.view-user-page__state {
  padding: 0.4rem;
}

.view-user-page__state-copy {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.view-user-page__state-actions {
  display: flex;
  justify-content: flex-start;
}

.view-user-page__state--error {
  border-color: #fecaca;
}

@media (max-width: 1024px) {
  .view-user-page__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .view-user-page__hero-grid {
    grid-template-columns: 1fr;
    justify-items: start;
  }

  .view-user-page__avatar-wrap {
    justify-content: flex-start;
  }
}
</style>

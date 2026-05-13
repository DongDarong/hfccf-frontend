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

function firstNonEmpty(...values) {
  const value = values.find((item) => {
    if (item === null || item === undefined) return false
    return String(item).trim() !== ''
  })

  return value === undefined ? '' : value
}

function asText(value) {
  const normalized = String(value ?? '').trim()
  return normalized || '-'
}

function asOptionalText(value) {
  const normalized = String(value ?? '').trim()
  return normalized || ''
}

function toArray(value) {
  if (Array.isArray(value)) return value
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

function normalizePermissionList(raw = {}) {
  const combined = [
    ...toArray(raw.permissions),
    ...toArray(raw.role_permission),
    ...toArray(raw.rolePermission),
    ...toArray(raw.role_permissions),
  ]

  return [...new Set(combined.map((permission) => String(permission).trim()).filter(Boolean))]
}

function normalizeUser(raw = {}) {
  const firstName = firstNonEmpty(raw.firstName, raw.first_name)
  const lastName = firstNonEmpty(raw.lastName, raw.last_name)
  const username = firstNonEmpty(raw.username, raw.user_name, raw.id)
  const nameFromParts = [firstName, lastName].filter(Boolean).join(' ').trim()
  const name = firstNonEmpty(
    raw.name,
    raw.fullName,
    raw.full_name,
    nameFromParts,
    username,
    raw.email,
    raw.id,
  )
  const permissions = normalizePermissionList(raw)
  const role = asOptionalText(raw.role)
  const scope = asOptionalText(raw.scope)
  const domain = asOptionalText(raw.domain)
  const avatar = resolveAvatarSource(
    firstNonEmpty(raw.avatar, raw.avatarUrl, raw.profileImage, raw.photo),
  )

  return {
    id: firstNonEmpty(raw.id, raw.user_id),
    firstName: asOptionalText(firstName),
    lastName: asOptionalText(lastName),
    name: asOptionalText(name),
    fullName: asOptionalText(firstNonEmpty(raw.fullName, raw.full_name, name)),
    username: asOptionalText(username),
    email: asOptionalText(raw.email),
    phone: asOptionalText(raw.phone),
    role,
    roleLabel: roleLabel(role),
    scope,
    domain,
    departmentCode: asOptionalText(firstNonEmpty(raw.departmentCode, raw.department_code)),
    department: asOptionalText(raw.department),
    bio: asOptionalText(raw.bio),
    status: asOptionalText(raw.status),
    avatar,
    permissions,
    role_permission: permissions,
    rolePermission: permissions,
    role_permissions: permissions,
    createdAt: asOptionalText(firstNonEmpty(raw.createdAt, raw.created_at)),
    updatedAt: asOptionalText(firstNonEmpty(raw.updatedAt, raw.updated_at)),
    lastLoginAt: asOptionalText(firstNonEmpty(raw.lastLoginAt, raw.last_login_at)),
    emailVerifiedAt: asOptionalText(firstNonEmpty(raw.emailVerifiedAt, raw.email_verified_at)),
  }
}

function roleLabel(value) {
  const normalized = normalizeRole(value)
  const key = `common.role.${String(normalized || '').replace(/[\s-]+/g, '_').toLowerCase()}`
  const translated = t(key)

  return translated !== key ? translated : asText(value)
}

function statusLabel(value) {
  const key = `common.status.${String(value || '').replace(/[\s-]+/g, '_').toLowerCase()}`
  const translated = t(key)

  return translated !== key ? translated : asText(value)
}

function statusTone(value) {
  const key = String(value || '').trim().toLowerCase()

  if (key === 'active') return 'success'
  if (key === 'pending') return 'info'
  if (key === 'inactive') return 'warning'
  if (key === 'suspended') return 'error'

  return 'info'
}

function permissionLabel(permission) {
  const normalized = String(permission || '').trim()

  if (!normalized) return '-'
  if (normalized === 'all:*') return resolvedText('users.viewUser.fullAccess', 'Full access')

  return normalized
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

const normalizedUser = computed(() => normalizeUser(user.value || {}))

const pageTitle = computed(() =>
  normalizedUser.value.name || resolvedText('users.viewUser.title', 'View User'),
)

const pageSubtitle = computed(() =>
  resolvedText(
    'users.viewUser.subtitle',
    'Review the account profile, permissions, and activity details.',
  ),
)

const avatarSource = computed(() => normalizedUser.value.avatar)

const avatarInitials = computed(() =>
  getAvatarInitials(
    normalizedUser.value.fullName || normalizedUser.value.name || normalizedUser.value.username,
    '?',
  ),
)

const shouldShowAvatar = computed(() =>
  Boolean(avatarSource.value) && Boolean(avatarLoaded.value) && !avatarErrored.value,
)

const hasPermissions = computed(() => normalizedUser.value.permissions.length > 0)

const isFullAccess = computed(() =>
  normalizedUser.value.permissions.some((permission) => String(permission).trim() === 'all:*'),
)

const sectionCards = computed(() => [
  {
    key: 'profile-summary',
    title: resolvedText('users.viewUser.sections.profileSummary', 'Profile Summary'),
    rows: [
      { label: resolvedText('users.viewUser.fields.id', 'ID'), value: normalizedUser.value.id },
      {
        label: resolvedText('users.viewUser.fields.fullName', 'Full Name'),
        value: normalizedUser.value.fullName || normalizedUser.value.name,
      },
      {
        label: resolvedText('users.viewUser.fields.username', 'Username'),
        value: normalizedUser.value.username,
      },
      {
        label: resolvedText('users.viewUser.fields.avatar', 'Avatar'),
        value: normalizedUser.value.avatar ? resolvedText('users.viewUser.avatarPresent', 'Available') : '-',
      },
    ],
  },
  {
    key: 'account-details',
    title: resolvedText('users.viewUser.sections.accountDetails', 'Account Details'),
    rows: [
      { label: resolvedText('users.viewUser.fields.firstName', 'First name'), value: normalizedUser.value.firstName },
      { label: resolvedText('users.viewUser.fields.lastName', 'Last name'), value: normalizedUser.value.lastName },
      { label: resolvedText('users.viewUser.fields.department', 'Department'), value: normalizedUser.value.department },
      { label: resolvedText('users.viewUser.fields.departmentCode', 'Department code'), value: normalizedUser.value.departmentCode },
      { label: resolvedText('users.viewUser.fields.scope', 'Scope'), value: normalizedUser.value.scope },
      { label: resolvedText('users.viewUser.fields.domain', 'Domain'), value: normalizedUser.value.domain },
      { label: resolvedText('users.viewUser.fields.emailVerifiedAt', 'Email verified at'), value: formatDateTime(normalizedUser.value.emailVerifiedAt) },
      { label: resolvedText('users.viewUser.fields.updatedAt', 'Updated at'), value: formatDateTime(normalizedUser.value.updatedAt) },
    ],
  },
  {
    key: 'role-access',
    title: resolvedText('users.viewUser.sections.roleAccess', 'Role & Access'),
    rows: [
      { label: resolvedText('users.viewUser.fields.role', 'Role'), value: normalizedUser.value.roleLabel || roleLabel(normalizedUser.value.role) },
      { label: resolvedText('users.viewUser.fields.roleRaw', 'Role key'), value: normalizedUser.value.role },
      { label: resolvedText('users.viewUser.fields.status', 'Status'), value: statusLabel(normalizedUser.value.status) },
      { label: resolvedText('users.viewUser.fields.scope', 'Scope'), value: normalizedUser.value.scope },
      { label: resolvedText('users.viewUser.fields.domain', 'Domain'), value: normalizedUser.value.domain },
    ],
  },
  {
    key: 'contact-info',
    title: resolvedText('users.viewUser.sections.contactInformation', 'Contact Information'),
    rows: [
      { label: resolvedText('users.viewUser.fields.email', 'Email'), value: normalizedUser.value.email },
      { label: resolvedText('users.viewUser.fields.phone', 'Phone'), value: normalizedUser.value.phone },
    ],
  },
  {
    key: 'activity',
    title: resolvedText('users.viewUser.sections.activity', 'Activity'),
    rows: [
      { label: resolvedText('users.viewUser.fields.createdAt', 'Created at'), value: formatDateTime(normalizedUser.value.createdAt) },
      { label: resolvedText('users.viewUser.fields.updatedAt', 'Updated at'), value: formatDateTime(normalizedUser.value.updatedAt) },
      { label: resolvedText('users.viewUser.fields.lastLogin', 'Last login'), value: formatDateTime(normalizedUser.value.lastLoginAt) },
      { label: resolvedText('users.viewUser.fields.emailVerifiedAt', 'Email verified at'), value: formatDateTime(normalizedUser.value.emailVerifiedAt) },
    ],
  },
  {
    key: 'bio-notes',
    title: resolvedText('users.viewUser.sections.bioNotes', 'Bio / Notes'),
    rows: [
      { label: resolvedText('users.viewUser.fields.bio', 'Bio'), value: normalizedUser.value.bio },
    ],
  },
])

const permissionItems = computed(() => {
  if (!hasPermissions.value) {
    return []
  }

  return normalizedUser.value.permissions.map((permission) => ({
    key: permission,
    label: permissionLabel(permission),
  }))
})

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
                    v-if="avatarSource"
                    :src="avatarSource"
                    :alt="`${normalizedUser.name || 'User'} avatar`"
                    class="view-user-page__avatar-image"
                    :class="{ 'view-user-page__avatar-image--visible': shouldShowAvatar }"
                    @load="onAvatarLoad"
                    @error="onAvatarError"
                  >
                </div>
              </div>

              <div class="view-user-page__hero-content">
                <div class="view-user-page__identity">
                  <h1 class="view-user-page__name">
                    {{ normalizedUser.fullName || normalizedUser.name || '-' }}
                  </h1>
                  <p class="view-user-page__email">
                    {{ normalizedUser.username ? `@${normalizedUser.username}` : normalizedUser.email || '-' }}
                  </p>
                </div>

                <div class="view-user-page__badges">
                  <RolesBadge :role="normalizedUser.role" />
                  <StatusBadge
                    :status="statusTone(normalizedUser.status)"
                    :label="statusLabel(normalizedUser.status)"
                    size="sm"
                  />
                </div>

                <div class="view-user-page__actions">
                  <Button
                    type="button"
                    severity="secondary"
                    outlined
                    @click="loadUser"
                  >
                    {{ resolvedText('users.viewUser.refreshButton', 'Refresh') }}
                  </Button>

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
          <Card
            v-for="section in sectionCards"
            :key="section.key"
            class="view-user-page__card"
          >
            <template #title>
              {{ section.title }}
            </template>

            <template #content>
              <div
                v-if="section.key !== 'bio-notes'"
                class="view-user-page__details"
              >
                <div
                  v-for="item in section.rows"
                  :key="`${section.key}-${item.label}`"
                  class="view-user-page__detail-row"
                >
                  <span class="view-user-page__detail-label">{{ item.label }}</span>
                  <span class="view-user-page__detail-value">
                    {{ item.value || '-' }}
                  </span>
                </div>
              </div>

              <div
                v-else
                class="view-user-page__bio"
              >
                <p class="view-user-page__bio-text">
                  {{ normalizedUser.bio || '-' }}
                </p>
              </div>
            </template>
          </Card>

          <Card class="view-user-page__card">
            <template #title>
              {{ resolvedText('users.viewUser.permissionsTitle', 'Permissions') }}
            </template>

            <template #content>
              <div class="view-user-page__permissions">
                <template v-if="permissionItems.length">
                  <template v-if="isFullAccess">
                    <span
                      class="view-user-page__full-access"
                      :title="normalizedUser.permissions.join(', ')"
                    >
                      {{ resolvedText('users.viewUser.fullAccess', 'Full access') }}
                    </span>
                  </template>

                  <template v-else>
                    <PermissionBadge
                      v-for="permission in permissionItems"
                      :key="permission.key"
                      :permission="permission.label"
                    />
                  </template>
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
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

.view-user-page__full-access {
  display: inline-flex;
  align-items: center;
  border: 1px solid #dbeafe;
  border-radius: 9999px;
  background: #eff6ff;
  padding: 0.45rem 0.75rem;
  color: #1d4ed8;
  font-size: 0.72rem;
  font-weight: 800;
  line-height: 1;
}

.view-user-page__bio {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.view-user-page__bio-text {
  margin: 0;
  color: #0f172a;
  font-size: 0.92rem;
  line-height: 1.75;
  white-space: pre-line;
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

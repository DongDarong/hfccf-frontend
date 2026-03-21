<script setup>
import { computed, ref, watch } from 'vue'
import PrimeAvatar from 'primevue/avatar'
import { getCurrentUser } from '@/services/auth'
import users from '@/mocks/users.json'

defineOptions({
  name: 'UserAvatar',
})

const props = defineProps({
  name: String,
  username: String,
  avatar: String,
  initials: String,
  size: {
    type: String,
    default: 'md',
  },
  status: {
    type: String,
    default: 'online',
  },
  href: {
    type: String,
    default: '#profile',
  },
})

const currentUser = computed(() => getCurrentUser() || {})
const hasImageError = ref(false)

const matchedMockUser = computed(() => {
  const currentId = String(currentUser.value?.id || '').trim()
  const currentEmail = String(currentUser.value?.email || '').trim().toLowerCase()
  const currentUsername = String(currentUser.value?.username || '').trim().toLowerCase()

  return (
    users.find((user) => String(user.id || '').trim() === currentId) ||
    users.find((user) => String(user.email || '').trim().toLowerCase() === currentEmail) ||
    users.find((user) => String(user.username || '').trim().toLowerCase() === currentUsername) ||
    null
  )
})

const displayName = computed(() => {
  const firstName = String(currentUser.value?.firstName || '').trim()
  const lastName = String(currentUser.value?.lastName || '').trim()
  const fullName = `${lastName} ${firstName}`.trim()
  if (fullName) return fullName
  return props.name || String(currentUser.value?.username || '').trim() || 'Admin User'
})

const displayUsername = computed(() => {
  if (props.username) return props.username
  const role = String(currentUser.value?.role || '').trim()
  if (role) return role
  const email = String(currentUser.value?.email || '').trim()
  if (email.includes('@')) return email.split('@')[0]
  return email || 'user'
})

const resolvedAvatar = computed(() => {
  if (props.avatar) return props.avatar
  return (
    String(currentUser.value?.avatar || '').trim() || String(matchedMockUser.value?.avatar || '').trim()
  )
})

const displayAvatar = computed(() => (hasImageError.value ? '' : resolvedAvatar.value))

const displayInitials = computed(() => {
  if (props.initials) return props.initials
  return (
    displayName.value
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('') || 'AU'
  )
})

const avatarSize = computed(() => {
  if (props.size === 'sm') return 'normal'
  if (props.size === 'lg') return 'large'
  return 'normal'
})

watch(resolvedAvatar, () => {
  hasImageError.value = false
})
</script>

<template>
  <a :href="props.href" class="navbar-profile">
    <div class="navbar-profile__text">
      <div class="navbar-profile__name">{{ displayName }}</div>
      <div class="navbar-profile__username">{{ displayUsername }}</div>
    </div>
    <div class="navbar-profile__avatar-container">
      <PrimeAvatar
        :label="displayAvatar ? undefined : displayInitials"
        :image="displayAvatar || undefined"
        shape="circle"
        :size="avatarSize"
        class="navbar-profile__avatar"
        @image-error="hasImageError = true"
      />
      <div class="navbar-profile__status-dot" :class="`navbar-profile__status-dot--${status}`"></div>
    </div>
  </a>
</template>

<style scoped>
.navbar-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
  padding: 0.375rem 0.375rem 0.375rem 1rem;
  border-left: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  border-radius: 0.75rem;
  margin-left: 0.5rem;
}

.navbar-profile:hover {
  background: #f1f5f9;
}

.navbar-profile__text {
  text-align: right;
}

.navbar-profile__name {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;
}

.navbar-profile__username {
  font-size: 0.72rem;
  font-weight: 500;
  color: #64748b;
}

.navbar-profile__avatar-container {
  position: relative;
  display: flex;
}

:deep(.navbar-profile__avatar.p-avatar) {
  background: linear-gradient(135deg, var(--hope-o-cyan-blue) 0%, #0087b8 100%);
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 174, 239, 0.25);
}

.navbar-profile__status-dot {
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 10px;
  height: 10px;
  border: 2px solid #fff;
  border-radius: 50%;
}

.navbar-profile__status-dot--online {
  background: #22c55e;
}

.navbar-profile__status-dot--away {
  background: #f59e0b;
}

.navbar-profile__status-dot--offline {
  background: #94a3b8;
}
</style>

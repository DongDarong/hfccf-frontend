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
  padding: 0.35rem 0.35rem 0.35rem 1rem;
  border-left: 1px solid #e2e8f0;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 1rem;
  margin-left: 0.5rem;
}

.navbar-profile:hover {
  background: rgba(241, 245, 249, 0.8);
  transform: translateY(-1px);
}

.navbar-profile__text {
  text-align: right;
}

.navbar-profile__name {
  font-size: 0.88rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
}

.navbar-profile__username {
  font-size: 0.72rem;
  font-weight: 600;
  color: #64748b;
  letter-spacing: 0.02em;
}

.navbar-profile__avatar-container {
  position: relative;
  display: flex;
}

:deep(.navbar-profile__avatar.p-avatar) {
  background: linear-gradient(135deg, var(--hope-cyan) 0%, #0087b8 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 174, 239, 0.2);
  border: 2px solid #fff;
}

.navbar-profile__status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border: 2.5px solid #fff;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

@media (max-width: 640px) {
  .navbar-profile__text {
    display: none;
  }
  
  .navbar-profile {
    padding: 0.25rem;
    border-left: none;
    margin-left: 0;
  }
}
</style>


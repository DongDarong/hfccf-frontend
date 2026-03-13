<script setup>
import { computed, ref, watch } from 'vue'
import { getCurrentUser } from '@/services/auth'
import users from '@/mocks/users.json'

defineOptions({
  name: 'UserAvatar',
})

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  username: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
    default: '',
  },
  initials: {
    type: String,
    default: '',
  },
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
  const currentEmail = String(currentUser.value?.email || '')
    .trim()
    .toLowerCase()
  const currentUsername = String(currentUser.value?.username || '')
    .trim()
    .toLowerCase()

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

  if (props.name) return props.name

  return String(currentUser.value?.username || '').trim() || 'Admin User'
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

  const currentAvatar = String(currentUser.value?.avatar || '').trim()
  if (currentAvatar) return currentAvatar

  return String(matchedMockUser.value?.avatar || '').trim()
})

const displayAvatar = computed(() => {
  if (hasImageError.value) return ''
  return resolvedAvatar.value
})

const displayInitials = computed(() => {
  if (props.initials) return props.initials

  const words = displayName.value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')

  return words || 'AU'
})

const avatarSizeClass = computed(() => {
  const value = String(props.size || 'md').toLowerCase()
  if (value === 'sm') return 'navbar-profile__avatar--sm'
  if (value === 'lg') return 'navbar-profile__avatar--lg'
  return 'navbar-profile__avatar--md'
})

const statusClass = computed(() => {
  const value = String(props.status || 'online').toLowerCase()
  if (value === 'offline') return 'navbar-profile__status-dot--offline'
  if (value === 'away') return 'navbar-profile__status-dot--away'
  return 'navbar-profile__status-dot--online'
})

watch(resolvedAvatar, () => {
  hasImageError.value = false
})

function onImageError() {
  hasImageError.value = true
}
</script>

<template>
  <a :href="props.href" class="navbar-profile">
    <div class="navbar-profile__text">
      <div class="navbar-profile__name">{{ displayName }}</div>
      <div class="navbar-profile__username">{{ displayUsername }}</div>
    </div>
    <div class="navbar-profile__avatar-container">
      <div class="navbar-profile__avatar" :class="avatarSizeClass">
        <!-- Prefer avatar from props or matched mock user; fall back to initials. -->
        <img
          v-if="displayAvatar"
          :src="displayAvatar"
          :alt="`${displayName} avatar`"
          class="navbar-profile__avatar-image"
          @error="onImageError"
        >
        <span v-else>{{ displayInitials }}</span>
      </div>
      <div class="navbar-profile__status-dot" :class="statusClass"></div>
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

.navbar-profile__avatar {
  width: 38px;
  height: 38px;
  border-radius: 0.75rem;
  background: var(--hope-o-cyan-blue);
  background: linear-gradient(135deg, var(--hope-o-cyan-blue) 0%, #0087b8 100%);
  color: var(--hope-text-white);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 174, 239, 0.25);
  overflow: hidden;
}

.navbar-profile__avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.navbar-profile__avatar--sm {
  width: 34px;
  height: 34px;
  font-size: 0.75rem;
}

.navbar-profile__avatar--md {
  width: 38px;
  height: 38px;
  font-size: 0.85rem;
}

.navbar-profile__avatar--lg {
  width: 44px;
  height: 44px;
  font-size: 0.95rem;
}

.navbar-profile__status-dot {
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 10px;
  height: 10px;
  border: 2px solid var(--hope-text-white);
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

@media (max-width: 768px) {
  .navbar-profile__text {
    display: none;
  }

  .navbar-profile {
    border-left: 0;
    padding-left: 0.375rem;
    margin-left: 0;
  }
}

@media (max-width: 480px) {
  .navbar-profile__avatar {
    width: 34px;
    height: 34px;
    font-size: 0.75rem;
  }
}

@media (max-width: 360px) {
  .navbar-profile {
    padding-left: 0.25rem;
  }

  .navbar-profile__avatar {
    width: 30px;
    height: 30px;
    font-size: 0.7rem;
  }
}
</style>

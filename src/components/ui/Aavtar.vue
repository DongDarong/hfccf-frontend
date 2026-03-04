<script setup>
defineOptions({
  name: 'UserAvatar',
})

defineProps({
  name: {
    type: String,
    default: 'Admin User',
  },
  username: {
    type: String,
    default: 'user',
  },
  avatar: {
    type: String,
    default: '',
  },
  initials: {
    type: String,
    default: 'AU',
  },
})
</script>

<template>
  <a href="#profile" class="navbar-profile">
    <div class="navbar-profile__text">
      <div class="navbar-profile__name">{{ name }}</div>
      <div class="navbar-profile__username">{{ username }}</div>
    </div>
    <div class="navbar-profile__avatar-container">
      <div class="navbar-profile__avatar">
        <img
          v-if="avatar"
          :src="avatar"
          :alt="`${name} avatar`"
          class="navbar-profile__avatar-image"
        >
        <span v-else>{{ initials }}</span>
      </div>
      <div class="navbar-profile__status-dot"></div>
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

.navbar-profile__status-dot {
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 10px;
  height: 10px;
  background: #22c55e;
  border: 2px solid var(--hope-text-white);
  border-radius: 50%;
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

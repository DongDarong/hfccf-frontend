<script setup>
import { RouterLink } from 'vue-router'
import { computed } from 'vue'

const props = defineProps({
  to: {
    type: [String, Object],
    required: true,
  },
  exact: {
    type: Boolean,
    default: false,
  },
  activeClass: {
    type: String,
    default: 'sidebar-link--active',
  },
  inactiveClass: {
    type: String,
    default: '',
  },
})

const resolvedActiveClass = computed(() => props.activeClass || 'sidebar-link--active')
</script>

<template>
  <RouterLink v-slot="{ href, navigate, isActive, isExactActive }" :to="to" custom>
    <a
      :href="href"
      class="sidebar-link"
      :class="(exact ? isExactActive : isActive) ? resolvedActiveClass : inactiveClass"
      @click="navigate"
    >
      <slot :is-active="exact ? isExactActive : isActive" />
    </a>
  </RouterLink>
</template>

<style scoped>
.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #1d1d1b;
  padding: 0.5rem 0.625rem;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all 0.18s ease;
}

.sidebar-link:hover {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.sidebar-link--active {
  background: #ecfdf5;
  color: #065f46;
  border-color: #bbf7d0;
  font-weight: 600;
}
</style>

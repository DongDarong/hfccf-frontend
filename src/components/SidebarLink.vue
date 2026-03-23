<script setup>
import { RouterLink } from 'vue-router'
import { computed } from 'vue'

const props = defineProps({
  to: {
    type: [String, Object],
    required: true,
  },
  icon: {
    type: [Object, Function, String],
    default: null,
  },
  iconClass: {
    type: String,
    default: 'sidebar-link__icon',
  },
  collapsed: {
    type: Boolean,
    default: false,
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
  <!-- Use custom RouterLink slot to control exact anchor markup and active class logic. -->
  <RouterLink v-slot="{ href, navigate, isActive, isExactActive }" :to="to" custom>
    <a
      :href="href"
      class="sidebar-link"
      :class="[
        (exact ? isExactActive : isActive) ? resolvedActiveClass : inactiveClass,
        { 'sidebar-link--collapsed': collapsed },
      ]"
      @click="navigate"
    >
      <component :is="icon" v-if="icon" :class="iconClass" aria-hidden="true" />
      <slot :is-active="exact ? isExactActive : isActive" />
    </a>
  </RouterLink>
</template>

<style scoped>
.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.72rem;
  text-decoration: none;
  color: #475569;
  padding: 0.72rem 0.82rem;
  border-radius: 1rem;
  border: 1px solid transparent;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease,
    box-shadow 0.18s ease;
}

.sidebar-link__icon {
  width: 1.1rem;
  height: 1.1rem;
  flex-shrink: 0;
  overflow: visible;
  color: currentColor;
}

.sidebar-link--collapsed {
  justify-content: center;
  width: 3rem;
  min-width: 3rem;
  margin-inline: auto;
  padding-inline: 0.45rem;
}

.sidebar-link:hover {
  background: #ffffff;
  border-color: color-mix(in srgb, var(--color-base) 18%, white);
  color: #0f172a;
  box-shadow: 0 10px 22px -22px rgba(15, 23, 42, 0.12);
}

.sidebar-link--active {
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--color-base) 8%, white) 0%,
    color-mix(in srgb, var(--color-base) 16%, white) 100%
  );
  color: #0f172a;
  border-color: color-mix(in srgb, var(--color-base) 28%, white);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    0 14px 24px -24px color-mix(in srgb, var(--color-base) 40%, transparent);
  font-weight: 700;
}

.sidebar-link--active .sidebar-link__icon {
  color: var(--color-base);
}
</style>


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
  gap: 0.7rem;
  text-decoration: none;
  color: #334155;
  padding: 0.7rem 0.8rem;
  border-radius: 14px;
  border: 1px solid transparent;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease,
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
  padding-inline: 0.4rem;
}

.sidebar-link:hover {
  background: rgba(255, 255, 255, 0.88);
  border-color: color-mix(in srgb, var(--color-base) 24%, white);
  color: #0f172a;
  transform: translateX(2px);
}

.sidebar-link--active {
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--color-base) 10%, white) 0%,
    color-mix(in srgb, var(--color-base) 20%, white) 100%
  );
  color: #0f172a;
  border-color: color-mix(in srgb, var(--color-base) 38%, white);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    0 14px 28px -24px color-mix(in srgb, var(--color-base) 58%, transparent);
  font-weight: 700;
}

.sidebar-link--active .sidebar-link__icon {
  color: var(--color-base);
}
</style>

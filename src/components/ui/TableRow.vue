<script setup>
import { computed, ref, watch } from 'vue'
import StatusBadge from '../common/StatusBadge.vue'
import RolesBadge from '../common/RolesBadge.vue'
import PermissionBadge from '../common/PermissionBadge.vue'
import ActionsButton from '../ui/ActionsButton.vue'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({}),
  },
  rowNumber: {
    type: Number,
    default: null,
  },
})

const emit = defineEmits(['view', 'edit', 'delete'])
const hasImageError = ref(false)

const statusType = computed(() => {
  // Normalize backend status values into badge variants used by StatusBadge.
  const value = String(props.user?.status ?? '').toLowerCase()
  if (value === 'active') return 'success'
  if (value === 'pending') return 'pending'
  if (value === 'inactive') return 'warning'
  if (value === 'suspended') return 'error'
  return 'info'
})

const statusText = computed(() => String(props.user?.status ?? 'Unknown'))
const displayNumber = computed(() => {
  if (Number.isFinite(props.rowNumber) && props.rowNumber > 0) return props.rowNumber
  const parsed = Number.parseInt(String(props.user?.id ?? '').replace(/\D/g, ''), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
})

const userIdLabel = computed(() => {
  const value = String(props.user?.id ?? '').trim()
  return value || '-'
})

const permissionList = computed(() => {
  // Prefer explicit array payload; fallback supports legacy comma-delimited values.
  const explicit = Array.isArray(props.user?.permissions) ? props.user.permissions : []
  if (explicit.length) return explicit
  const fallback = String(props.user?.permission ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
  return fallback
})

function phoneLabel(phone) {
  const value = String(phone ?? '').trim()
  return value || '-'
}

function usernameLabel(username) {
  const value = String(username ?? '').trim()
  if (!value) return '-'
  return value.startsWith('@') ? value : `@${value}`
}

function avatarSrc(user) {
  const value = user?.avatar || user?.avatarUrl || user?.profileImage || user?.photo
  if (hasImageError.value) return ''
  return String(value ?? '').trim()
}

function userInitials(user) {
  const name = String(user?.name ?? '').trim()
  if (!name) return '?'
  const parts = name.split(/\s+/).filter(Boolean)
  const initials = parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
  return initials || '?'
}

function getInitialBadgeClass(role) {
  const normalized = String(role || '').toLowerCase()
  if (normalized === 'superadmin') return 'bg-indigo-600'
  if (normalized === 'coach') return 'bg-hope-yellow'
  if (normalized === 'teacher' || normalized === 'teacher-preschool' || normalized === 'adminpreschool') {
    return 'bg-hope-lime'
  }
  if (normalized === 'teacher-english' || normalized === 'adminenglish') return 'bg-hope-cyan'
  if (normalized === 'teacher-scholarship' || normalized === 'adminscholaship') return 'bg-hope-yellow'
  if (normalized === 'adminsport') return 'bg-hope-red'
  if (normalized.startsWith('admin')) return 'bg-hope-cyan'
  return 'bg-gray-400'
}

function avatarRingClass(role) {
  const normalized = String(role || '').toLowerCase()
  if (normalized === 'superadmin') return 'ring-indigo-300'
  if (normalized === 'coach') return 'ring-amber-300'
  if (normalized === 'teacher' || normalized === 'teacher-preschool' || normalized === 'adminpreschool') {
    return 'ring-lime-300'
  }
  if (normalized === 'teacher-english' || normalized === 'adminenglish') return 'ring-cyan-300'
  if (normalized === 'teacher-scholarship' || normalized === 'adminscholaship') return 'ring-yellow-300'
  if (normalized === 'adminsport') return 'ring-rose-300'
  if (normalized.startsWith('admin')) return 'ring-cyan-300'
  return 'ring-gray-300'
}

function avatarTextClass(role) {
  const normalized = String(role || '').toLowerCase()
  if (
    normalized === 'coach' ||
    normalized === 'teacher' ||
    normalized === 'teacher-preschool' ||
    normalized === 'teacher-scholarship'
  ) {
    return 'text-gray-900'
  }
  return 'text-white'
}

watch(
  () => props.user?.avatar,
  () => {
    hasImageError.value = false
  },
)

function onAvatarError() {
  hasImageError.value = true
}
</script>

<template>
  <tr class="transition-colors hover:bg-gray-50/80">
    <td class="px-3 py-3 text-[12px] font-semibold whitespace-nowrap text-gray-700 sm:px-4 sm:py-3.5 sm:text-sm md:px-6">
      {{ displayNumber || '-' }}
    </td>

    <td class="px-3 py-3 whitespace-nowrap sm:px-4 sm:py-3.5 md:px-6">
      <div class="flex items-center gap-3">
        <img
          v-if="avatarSrc(user)"
          :src="avatarSrc(user)"
          :alt="`${user.name || 'User'} avatar`"
          :class="['h-10 w-10 rounded-full object-cover ring-2', avatarRingClass(user.role)]"
          @error="onAvatarError"
        >
        <div
          v-else
          :class="[
            'flex h-10 w-10 items-center justify-center rounded-full text-[11px] font-semibold ring-2',
            getInitialBadgeClass(user.role),
            avatarRingClass(user.role),
            avatarTextClass(user.role),
          ]"
          :title="user.name || 'User'"
        >
          {{ userInitials(user) }}
        </div>
        <div>
          <div class="text-[13px] font-semibold leading-5 text-gray-900 sm:text-sm">
            {{ user.name || '-' }}
          </div>
          <div class="text-[11px] text-gray-500 sm:text-xs">
            ID: {{ userIdLabel }}
          </div>
          <div class="text-[11px] text-gray-600 sm:text-xs">
            {{ usernameLabel(user.username) }}
          </div>
        </div>
      </div>
    </td>

    <td class="px-3 py-3 text-[12px] whitespace-nowrap text-gray-700 sm:px-4 sm:py-3.5 sm:text-sm md:px-6">
      {{ user.email || '-' }}
    </td>

    <td class="px-3 py-3 whitespace-nowrap sm:px-4 sm:py-3.5 md:px-6">
      <RolesBadge :role="user.role" />
    </td>

    <td class="px-3 py-3 whitespace-nowrap sm:px-4 sm:py-3.5 md:px-6">
      <div class="flex flex-wrap gap-1">
        <PermissionBadge
          v-for="permission in permissionList"
          :key="permission"
          :permission="permission"
          size="sm"
        />
        <span v-if="!permissionList.length" class="text-[11px] text-gray-400">-</span>
      </div>
    </td>

    <td class="px-3 py-3 whitespace-nowrap sm:px-4 sm:py-3.5 md:px-6">
      <StatusBadge :status="statusType" :label="statusText" size="sm" />
    </td>

    <td class="px-3 py-3 text-[12px] whitespace-nowrap text-gray-700 sm:px-4 sm:py-3.5 sm:text-sm md:px-6">
      {{ phoneLabel(user.phone) }}
    </td>

    <td class="px-3 py-3 whitespace-nowrap text-right sm:px-4 sm:py-3.5 md:px-6">
      <ActionsButton
        :item="user"
        align="right"
        compact
        @view="emit('view', user)"
        @edit="emit('edit', user)"
        @delete="emit('delete', user)"
      />
    </td>
  </tr>
</template>

<script setup>
import { computed } from 'vue'
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

const statusType = computed(() => {
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
  return String(value ?? '').trim()
}

function userInitials(user) {
  const name = String(user?.name ?? '').trim()
  if (!name) return '?'
  const parts = name.split(/\s+/).filter(Boolean)
  const initials = parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('')
  return initials || '?'
}

function getInitialBadgeClass(role) {
  const normalized = String(role || '').toLowerCase()
  if (normalized === 'superadmin') return 'bg-indigo-600'
  if (normalized === 'coach') return 'bg-hope-yellow'
  if (normalized === 'teacher') return 'bg-hope-lime'
  if (normalized.startsWith('admin')) return 'bg-hope-cyan'
  return 'bg-gray-400'
}

function avatarRingClass(role) {
  const normalized = String(role || '').toLowerCase()
  if (normalized === 'superadmin') return 'ring-indigo-300'
  if (normalized === 'coach') return 'ring-amber-300'
  if (normalized === 'teacher') return 'ring-lime-300'
  if (normalized.startsWith('admin')) return 'ring-cyan-300'
  return 'ring-gray-300'
}

function avatarTextClass(role) {
  const normalized = String(role || '').toLowerCase()
  if (normalized === 'coach' || normalized === 'teacher') return 'text-gray-900'
  return 'text-white'
}

</script>

<template>
  <tr class="transition-colors hover:bg-gray-50/80">
    <td class="px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 text-[12px] sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
      {{ displayNumber || '-' }}
    </td>

    <td class="px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 whitespace-nowrap">
      <div class="flex items-center gap-3">
        <img
          v-if="avatarSrc(user)"
          :src="avatarSrc(user)"
          :alt="`${user.name || 'User'} avatar`"
          :class="[
            'h-10 w-10 rounded-full object-cover ring-2',
            avatarRingClass(user.role),
          ]"
        />
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
          <div class="text-[13px] sm:text-sm font-semibold leading-5 text-gray-900">
            {{ user.name || '-' }}
          </div>
          <div class="text-[11px] sm:text-xs text-gray-500">
            ID: {{ userIdLabel }}
          </div>
          <div class="text-[11px] sm:text-xs text-gray-600">
            {{ usernameLabel(user.username) }}
          </div>
        </div>
      </div>
    </td>

    <td class="px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 text-[12px] sm:text-sm text-gray-700 whitespace-nowrap">
      {{ user.email || '-' }}
    </td>

    <td class="px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 whitespace-nowrap">
      <RolesBadge :role="user.role" />
    </td>

    <td class="px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 whitespace-nowrap">
      <div class="flex flex-wrap gap-1">
        <PermissionBadge
          v-for="permission in permissionList"
          :key="permission"
          :permission="permission"
          size="sm"
        />
        <span v-if="!permissionList.length" class="text-[11px] text-gray-400">—</span>
      </div>
    </td>

    <td class="px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 whitespace-nowrap">
      <StatusBadge :status="statusType" :label="statusText" size="sm" />
    </td>

    <td class="px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 text-[12px] sm:text-sm text-gray-700 whitespace-nowrap">
      {{ phoneLabel(user.phone) }}
    </td>

    <td class="px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 whitespace-nowrap text-right">
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

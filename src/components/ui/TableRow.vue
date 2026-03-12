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
  row: {
    type: Object,
    default: null,
  },
  rowNumber: {
    type: Number,
    default: null,
  },
  columns: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['view', 'edit', 'delete'])
const hasImageError = ref(false)

const resolvedRow = computed(() => (props.row && typeof props.row === 'object' ? props.row : props.user))
const resolvedColumns = computed(() =>
  props.columns.length
    ? props.columns
    : [
        { key: 'number', align: 'left' },
        { key: 'user', align: 'left' },
        { key: 'email', align: 'left' },
        { key: 'role', align: 'left' },
        { key: 'permission', align: 'left' },
        { key: 'status', align: 'left' },
        { key: 'phone', align: 'left' },
        { key: 'actions', align: 'right' },
      ],
)

const statusType = computed(() => {
  const value = String(resolvedRow.value?.status ?? '').toLowerCase()
  if (value === 'active') return 'success'
  if (value === 'pending') return 'pending'
  if (value === 'inactive') return 'warning'
  if (value === 'suspended') return 'error'
  return 'info'
})

const statusText = computed(() => String(resolvedRow.value?.status ?? 'Unknown'))
const displayNumber = computed(() => {
  if (Number.isFinite(props.rowNumber) && props.rowNumber > 0) return props.rowNumber
  const parsed = Number.parseInt(String(resolvedRow.value?.id ?? '').replace(/\D/g, ''), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
})

const userIdLabel = computed(() => {
  const value = String(resolvedRow.value?.id ?? '').trim()
  return value || '-'
})

const permissionList = computed(() => {
  const explicit = Array.isArray(resolvedRow.value?.permissions) ? resolvedRow.value.permissions : []
  if (explicit.length) return explicit
  const fallback = String(resolvedRow.value?.permission ?? '')
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

function avatarSrc(row) {
  const value = row?.avatar || row?.avatarUrl || row?.profileImage || row?.photo
  if (hasImageError.value) return ''
  return String(value ?? '').trim()
}

function userInitials(row) {
  const name = String(row?.name ?? '').trim()
  if (!name) return '?'
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || '?'
  )
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

function resolvePlainValue(column) {
  const field = column?.field || column?.key
  const value = resolvedRow.value?.[field]
  const normalized = String(value ?? '').trim()
  return normalized || '-'
}

function cellClass(column) {
  const align = column?.align === 'right' ? 'text-right' : 'text-left'
  return `px-3 py-3 sm:px-4 sm:py-3.5 md:px-6 whitespace-nowrap ${align}`
}

watch(
  () => resolvedRow.value?.avatar,
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
    <td
      v-for="column in resolvedColumns"
      :key="column.key"
      :class="cellClass(column)"
    >
      <template v-if="column.key === 'number'">
        <span class="text-[12px] font-semibold text-gray-700 sm:text-sm">{{ displayNumber || '-' }}</span>
      </template>

      <template v-else-if="column.key === 'user'">
        <div class="flex items-center gap-3">
          <div
            :class="[
              'relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/70 bg-white shadow-sm ring-2',
              avatarRingClass(resolvedRow.role),
            ]"
          >
            <img
              v-if="avatarSrc(resolvedRow)"
              :src="avatarSrc(resolvedRow)"
              :alt="`${resolvedRow.name || 'User'} avatar`"
              class="h-full w-full object-cover"
              @error="onAvatarError"
            >
            <div
              v-else
              :class="[
                'flex h-full w-full items-center justify-center text-[11px] font-bold uppercase tracking-[0.08em]',
                getInitialBadgeClass(resolvedRow.role),
                avatarTextClass(resolvedRow.role),
              ]"
              :title="resolvedRow.name || 'User'"
            >
              {{ userInitials(resolvedRow) }}
            </div>
          </div>
          <div>
            <div class="text-[13px] font-semibold leading-5 text-gray-900 sm:text-sm">
              {{ resolvedRow.name || '-' }}
            </div>
            <div class="text-[11px] text-gray-500 sm:text-xs">
              ID: {{ userIdLabel }}
            </div>
            <div class="text-[11px] text-gray-600 sm:text-xs">
              {{ usernameLabel(resolvedRow.username) }}
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="column.key === 'email'">
        <span class="text-[12px] text-gray-700 sm:text-sm">{{ resolvedRow.email || '-' }}</span>
      </template>

      <template v-else-if="column.key === 'role'">
        <RolesBadge :role="resolvedRow.role" />
      </template>

      <template v-else-if="column.key === 'permission'">
        <div class="flex flex-wrap gap-1">
          <PermissionBadge
            v-for="permission in permissionList"
            :key="permission"
            :permission="permission"
            size="sm"
          />
          <span v-if="!permissionList.length" class="text-[11px] text-gray-400">-</span>
        </div>
      </template>

      <template v-else-if="column.key === 'status'">
        <StatusBadge :status="statusType" :label="statusText" size="sm" />
      </template>

      <template v-else-if="column.key === 'phone'">
        <span class="text-[12px] text-gray-700 sm:text-sm">{{ phoneLabel(resolvedRow.phone) }}</span>
      </template>

      <template v-else-if="column.key === 'actions'">
        <ActionsButton
          :item="resolvedRow"
          align="right"
          compact
          @view="emit('view', resolvedRow)"
          @edit="emit('edit', resolvedRow)"
          @delete="emit('delete', resolvedRow)"
        />
      </template>

      <template v-else>
        <span class="text-[12px] text-gray-700 sm:text-sm">{{ resolvePlainValue(column) }}</span>
      </template>
    </td>
  </tr>
</template>

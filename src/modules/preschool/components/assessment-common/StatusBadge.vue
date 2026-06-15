<script setup>
defineOptions({
  name: 'AssessmentStatusBadge',
})

defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['draft', 'finalized'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
})

const statusConfig = {
  draft: {
    label: 'Draft',
    icon: '✏️',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    dotColor: 'bg-amber-400',
  },
  finalized: {
    label: 'Finalized',
    icon: '✅',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    dotColor: 'bg-emerald-400',
  },
}

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
}

const config = statusConfig[props.status]
const sizeClass = sizeClasses[props.size]
</script>

<template>
  <div
    :class="[
      'inline-flex items-center gap-2 rounded-full border',
      config.bgColor,
      config.borderColor,
      config.textColor,
      sizeClass,
    ]"
  >
    <span :class="['flex-shrink-0', { 'text-xs': size === 'sm', 'text-sm': size !== 'sm' }]">
      {{ config.icon }}
    </span>
    <span class="font-medium">{{ config.label }}</span>
  </div>
</template>

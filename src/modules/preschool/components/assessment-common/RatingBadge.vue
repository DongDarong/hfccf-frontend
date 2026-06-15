<script setup>
defineOptions({
  name: 'AssessmentRatingBadge',
})

defineProps({
  rating: {
    type: String,
    required: true,
    validator: (value) => ['Excellent', 'Good', 'Fair', 'Needs Improvement'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
})

const ratingConfig = {
  Excellent: {
    icon: '⭐',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    dotColor: 'bg-blue-400',
  },
  Good: {
    icon: '👍',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    dotColor: 'bg-emerald-400',
  },
  Fair: {
    icon: '👌',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    dotColor: 'bg-amber-400',
  },
  'Needs Improvement': {
    icon: '⚠️',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    dotColor: 'bg-red-400',
  },
}

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
}

const config = ratingConfig[props.rating]
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
    <span class="font-medium">{{ rating }}</span>
  </div>
</template>

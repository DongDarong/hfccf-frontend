<script setup>
import AppButton from '@/components/ui/AppButton.vue'

defineOptions({
  name: 'UiButton',
  inheritAttrs: false,
})
</script>

<template>
  <AppButton v-bind="$attrs">
    <template v-if="$slots.iconLeft" #iconLeft>
      <slot name="iconLeft" />
    </template>
    <slot />
    <template v-if="$slots.iconRight" #iconRight>
      <slot name="iconRight" />
    </template>
  </AppButton>
</template>

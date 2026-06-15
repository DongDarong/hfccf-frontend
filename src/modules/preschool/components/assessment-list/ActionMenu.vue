<script setup>
import { computed, ref } from 'vue'
import Button from '@/components/buttons/Button.vue'
import Menu from 'primevue/menu'

defineOptions({
  name: 'AssessmentActionMenu',
})

const props = defineProps({
  assessment: {
    type: Object,
    required: true,
  },
  canEdit: {
    type: Boolean,
    default: false,
  },
  canFinalize: {
    type: Boolean,
    default: false,
  },
  canArchive: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['edit', 'finalize', 'archive', 'view'])

const menuRef = ref(null)

const items = computed(() => {
  const list = [
    {
      label: 'View details',
      icon: 'pi pi-eye',
      command: () => emit('view', props.assessment),
    },
  ]

  if (props.canEdit) {
    list.push({
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => emit('edit', props.assessment),
    })
  }

  if (props.canFinalize) {
    list.push({
      label: 'Finalize',
      icon: 'pi pi-check',
      command: () => emit('finalize', props.assessment),
    })
  }

  if (props.canArchive) {
    list.push(
      { separator: true },
      {
        label: 'Archive',
        icon: 'pi pi-trash',
        command: () => emit('archive', props.assessment),
      },
    )
  }

  return list
})

function toggle(event) {
  menuRef.value?.toggle(event)
}
</script>

<template>
  <div>
    <Button
      icon="pi pi-ellipsis-v"
      rounded="full"
      variant="text"
      size="sm"
      aria-label="Open assessment actions"
      @click="toggle"
    />

    <Menu
      ref="menuRef"
      :model="items"
      :popup="true"
    />
  </div>
</template>

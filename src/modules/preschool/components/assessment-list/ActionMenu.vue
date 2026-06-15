<script setup>
import Button from '@/components/buttons/Button.vue'
import Menu from 'primevue/menu'
import { ref } from 'vue'

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

const items = ref([
  {
    label: '👁️ View Details',
    icon: 'pi pi-eye',
    command: () => emit('view'),
  },
  {
    label: '✏️ Edit',
    icon: 'pi pi-pencil',
    command: () => emit('edit'),
    visible: props.canEdit,
  },
  {
    label: '✅ Finalize',
    icon: 'pi pi-check',
    command: () => emit('finalize'),
    visible: props.canFinalize,
  },
  {
    separator: true,
    visible: props.canArchive,
  },
  {
    label: '🗑️ Archive',
    icon: 'pi pi-trash',
    command: () => emit('archive'),
    visible: props.canArchive,
  },
])

const visibleItems = computed(() => items.value.filter(item => item.visible !== false))

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
      @click="toggle"
    />

    <Menu
      ref="menuRef"
      :model="visibleItems"
      :popup="true"
    />
  </div>
</template>

<script>
import { computed } from 'vue'
</script>

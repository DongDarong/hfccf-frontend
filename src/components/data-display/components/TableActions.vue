<script setup>
import ActionsButton from '@/components/buttons/ActionsButton.vue'
import Button from '@/components/buttons/Button.vue'

defineOptions({
  name: 'TableActions',
})

defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  actionStyle: {
    type: String,
    default: 'menu',
    validator: (value) => ['menu', 'buttons'].includes(value),
  },
  showViewAction: {
    type: Boolean,
    default: true,
  },
  showEditAction: {
    type: Boolean,
    default: true,
  },
  showDeleteAction: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['view', 'edit', 'delete'])
</script>

<template>
  <div
    v-if="actionStyle === 'buttons'"
    class="ui-data-table__row-actions"
  >
    <Button
      v-if="showViewAction"
      type="button"
      icon="pi pi-eye"
      rounded="full"
      variant="ghost"
      size="sm"
      class="ui-data-table__row-action"
      aria-label="View"
      @click="emit('view', item)"
    />

    <Button
      v-if="showEditAction"
      type="button"
      icon="pi pi-pencil"
      rounded="full"
      variant="ghost"
      size="sm"
      class="ui-data-table__row-action"
      aria-label="Edit"
      @click="emit('edit', item)"
    />

    <Button
      v-if="showDeleteAction"
      type="button"
      icon="pi pi-trash"
      rounded="full"
      variant="ghost"
      size="sm"
      class="ui-data-table__row-action ui-data-table__row-action--danger"
      aria-label="Delete"
      @click="emit('delete', item)"
    />
  </div>

  <ActionsButton
    v-else
    :item="item"
    :show-view="showViewAction"
    :show-edit="showEditAction"
    :show-delete="showDeleteAction"
    @view="emit('view', item)"
    @edit="emit('edit', item)"
    @delete="emit('delete', item)"
  />
</template>

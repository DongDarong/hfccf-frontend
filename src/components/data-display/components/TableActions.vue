<script setup>
import ActionsButton from '@/components/buttons/ActionsButton.vue'
import Button from '@/components/buttons/Button.vue'
import { useLanguage } from '@/composables/useLanguage'

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

const { t } = useLanguage()
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
      variant="outline"
      size="sm"
      class="ui-data-table__row-action ui-data-table__row-action--view"
      :aria-label="t('common.actions.view')"
      @click="emit('view', item)"
    />

    <Button
      v-if="showEditAction"
      type="button"
      icon="pi pi-pencil"
      rounded="full"
      variant="primary"
      size="sm"
      class="ui-data-table__row-action ui-data-table__row-action--edit"
      :aria-label="t('common.actions.edit')"
      @click="emit('edit', item)"
    />

    <Button
      v-if="showDeleteAction"
      type="button"
      icon="pi pi-trash"
      rounded="full"
      variant="danger"
      size="sm"
      class="ui-data-table__row-action ui-data-table__row-action--danger"
      :aria-label="t('common.actions.delete')"
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

<style scoped>
.ui-data-table__row-actions {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.ui-data-table__row-action {
  min-width: 4.1rem;
  justify-content: center;
  box-shadow: 0 8px 18px -16px rgba(15, 23, 42, 0.2);
}

.ui-data-table__row-action :deep(.ui-button__label) {
  font-size: 0.72rem;
}

.ui-data-table__row-action--view {
  color: #334155;
}

.ui-data-table__row-action--edit {
  min-width: 4.4rem;
}

.ui-data-table__row-action--danger {
  min-width: 4.7rem;
}

@media (max-width: 640px) {
  .ui-data-table__row-actions {
    gap: 0.35rem;
  }

  .ui-data-table__row-action {
    min-width: 0;
    width: 2.25rem;
  }

  .ui-data-table__row-action :deep(.ui-button__label) {
    display: none;
  }
}
</style>

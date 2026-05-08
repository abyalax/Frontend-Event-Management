<script setup lang="ts">
import { defineComponent, h } from 'vue';
import { Edit, Plus, Save, Trash2, X } from 'lucide-vue-next';
import { Button } from '~/layers/shared/app/components/ui/button';
import type { Event } from '~/layers/events/app/types';

interface Props {
  crud: {
    hasChanges: { value: boolean };
    isLoading: { value: boolean };
    isEditMode: { value: boolean };
    canEnableEdit: { value: boolean };
    selectedRows: { value: Event[] };
    canAddRow: { value: boolean };
    handleCancel: () => void;
    handleSave: () => void;
    disableEditMode: () => void;
    enableEditMode: () => void;
    handleBulkDelete: () => void;
    handleAdd: () => void;
  };
}

const props = defineProps<Props>();

const TopActions = defineComponent({
  setup() {
    return () =>
      h('div', { class: 'flex items-center gap-2' }, [
        // Cancel — shown when there are unsaved changes
        props.crud.hasChanges.value &&
          h(
            Button,
            {
              variant: 'outline',
              size: 'sm',
              onClick: props.crud.handleCancel,
              disabled: props.crud.isLoading.value,
            },
            () => [h(X, { class: 'w-4 h-4 mr-1' }), 'Cancel']
          ),

        // Save — enabled when there are pending changes
        h(
          Button,
          {
            variant: 'default',
            size: 'sm',
            disabled: !props.crud.hasChanges.value || props.crud.isLoading.value,
            onClick: props.crud.handleSave,
          },
          () => [props.crud.isLoading.value ? h('span', { class: 'animate-spin mr-1' }, '⟳') : h(Save, { class: 'w-4 h-4 mr-1' }), 'Save']
        ),

        // Edit — enabled when rows are selected
        h(
          Button,
          {
            variant: props.crud.isEditMode.value ? 'secondary' : 'outline',
            size: 'sm',
            disabled: !props.crud.canEnableEdit.value || props.crud.isLoading.value,
            onClick: props.crud.isEditMode.value ? props.crud.disableEditMode : props.crud.enableEditMode,
          },
          () => [h(Edit, { class: 'w-4 h-4 mr-1' }), props.crud.isEditMode.value ? 'Editing…' : 'Edit']
        ),

        // Delete selected — bulk delete existing rows
        props.crud.selectedRows.value.length > 0 &&
          h(
            Button,
            {
              variant: 'destructive',
              size: 'sm',
              disabled: props.crud.isLoading.value,
              onClick: props.crud.handleBulkDelete,
            },
            () => [h(Trash2, { class: 'w-4 h-4 mr-1' }), `Delete (${props.crud.selectedRows.value.length})`]
          ),

        // Add row
        h(
          Button,
          {
            variant: 'outline',
            size: 'sm',
            disabled: !props.crud.canAddRow.value || props.crud.isEditMode.value || props.crud.isLoading.value,
            onClick: props.crud.handleAdd,
          },
          () => [h(Plus, { class: 'w-4 h-4 mr-1' }), 'Add Event']
        ),
      ]);
  },
});
</script>

<template>
  <TopActions />
</template>

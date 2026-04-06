import GenericForm from '@/shared/components/form/GenericForm.vue';
import { usePreferredDialog } from './use-preferred-dialog';
import type { FormDefinition } from '@/shared/components/form/types';
import { ref } from 'vue';
import { useNotification } from './use-notification';

interface FormDialogConfig<T> {
  definition: FormDefinition<T>;
  modelValue: T;
  onSave: (data: T) => Promise<void>;
  mode?: 'create' | 'edit' | 'view';
  header: string;
}

export function useFormDialog() {
  const dialog = usePreferredDialog();
  const { showSaveError, showSaveSuccess } = useNotification();

  function openFormDialog<T extends Record<string, unknown>>(options: FormDialogConfig<T>) {
    const { definition, modelValue, onSave, mode, header } = options;
    const isSubmitting = ref(false);

    const dialogRef = dialog.open(
      GenericForm,
      {
        definition,
        modelValue,
        mode,
        submitting: isSubmitting.value,
      },
      {
        header,
        dialogSize: 'form',
      },
      () => {},
      {
        submit: async (...args: unknown[]) => {
          const values = args[0] as T;
          isSubmitting.value = true;
          dialogRef.updateProps({ submitting: true });
          try {
            await onSave(values);
            showSaveSuccess();
            dialogRef.close();
          } catch (error) {
            showSaveError(error instanceof Error ? error.message : String(error));
          } finally {
            isSubmitting.value = false;
            dialogRef.updateProps({ submitting: false });
          }
        },
      }
    );
    return dialogRef;
  }

  return { openFormDialog };
}

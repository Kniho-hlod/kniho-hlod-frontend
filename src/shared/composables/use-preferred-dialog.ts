import DialogHelper from '@/shared/components/DialogHelper.vue';
import { useDialog } from 'primevue/usedialog';
import { markRaw, reactive } from 'vue';
import type { Component } from 'vue';
import type { ComponentProps } from 'vue-component-type-helpers';
import type { DialogProps } from 'primevue/dialog';
import type { DynamicDialogOptions, DynamicDialogInstance } from 'primevue/dynamicdialogoptions';
import { DIALOG_SIZE_PRESETS } from '@/shared/utils/constants/preferred-dialog-config';
import type { DialogSizePreset } from '@/shared/utils/constants/preferred-dialog-config';
import { DEFAULT_DIALOG_CONFIG } from '@/shared/utils/constants/preferred-dialog-config';

type CustomEventHandlers = Record<string, (...args: unknown[]) => void>;

export interface ExtendedDialogInstance extends DynamicDialogInstance {
  updateProps: (newProps: Record<string, unknown>) => void;
}

export function usePreferredDialog() {
  const d = useDialog();

  return {
    open<C extends Component>(
      is: C,
      props: ComponentProps<C>,
      dialog: DialogProps & { dialogSize: DialogSizePreset },
      onClose?: DynamicDialogOptions['onClose'],
      eventHandlers?: CustomEventHandlers
    ): ExtendedDialogInstance {
      const { dialogSize, style, ...restDialog } = dialog;
      const presetStyle = dialogSize ? DIALOG_SIZE_PRESETS[dialogSize] : {};

      const reactiveProps = reactive({ ...props });

      const dialogRef = d.open(DialogHelper, {
        onClose,
        props: {
          ...DEFAULT_DIALOG_CONFIG,
          ...restDialog,
          style: {
            ...presetStyle,
            ...style,
          },
        },
        data: {
          is: markRaw(is),
          props: reactiveProps,
          eventHandlers: eventHandlers || {},
        },
      }) as ExtendedDialogInstance;

      dialogRef.updateProps = (newProps: Record<string, unknown>) => {
        Object.assign(reactiveProps, newProps);
      };

      return dialogRef;
    },
  };
}

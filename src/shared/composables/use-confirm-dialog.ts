import {
  CONFIRM_DIALOG_PRESET,
  type ConfirmDialogInput,
  type ConfirmDialogOptions,
} from '@/types/confirm-dialog-types';
import {
  CONFIRM_DIALOG_PRESETS,
  DEFAULT_CONFIRM_DIALOG_CONFIG,
} from '@/shared/utils/constants/confirm-dialog-config';
import { useConfirm } from 'primevue/useconfirm';
import { useNotification } from './use-notification';

export function useConfirmDialog() {
  const dialog = useConfirm();
  //  const { t } = useI18n();
  const { showSaveError, showSaveSuccess } = useNotification();

  function confirm(config: ConfirmDialogOptions): void {
    const preset = CONFIRM_DIALOG_PRESETS[config.preset];
    dialog.require({
      ...DEFAULT_CONFIRM_DIALOG_CONFIG,
      ...preset,
      header: preset.header,
      acceptLabel: preset.acceptLabel,
      ...config.dialogOptions,
    });
  }

  function confirmSave(input: ConfirmDialogInput) {
    confirm({
      preset: CONFIRM_DIALOG_PRESET.SAVE,
      dialogOptions: {
        message: input.text,
        accept: async () => {
          try {
            await input.handleConfirmCallback();
            showSaveSuccess('Úspěšně uloženo');
          } catch {
            showSaveError('Chyba při ukládání');
          }
        },
      },
    });
  }

  function confirmDelete(input: ConfirmDialogInput) {
    confirm({
      preset: CONFIRM_DIALOG_PRESET.DELETE,
      dialogOptions: {
        message: input.text,
        accept: async () => {
          try {
            await input.handleConfirmCallback();
            showSaveSuccess('Úspěšně smazáno');
          } catch {
            showSaveError('Chyba při mazání');
          }
        },
      },
    });
  }

  function confirmSend(input: ConfirmDialogInput) {
    confirm({
      preset: CONFIRM_DIALOG_PRESET.SEND,
      dialogOptions: {
        message: input.text,
        accept: async () => {
          try {
            await input.handleConfirmCallback();
            showSaveSuccess('Úspěšně odesláno');
          } catch {
            showSaveError('Chyba při odesílání');
          }
        },
      },
    });
  }

  return {
    confirmSave,
    confirmDelete,
    confirmSend,
  };
}

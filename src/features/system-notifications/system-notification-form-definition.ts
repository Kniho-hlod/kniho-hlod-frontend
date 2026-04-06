import type { FormDefinition } from '@/shared/components/form/types';
import type { CreateSystemNotificationDto } from '@/types/entities';

export const systemNotificationForm: FormDefinition<CreateSystemNotificationDto> = {
  gridClass: 'grid grid-cols-2 gap-4',
  fields: [
    {
      name: 'title',
      label: 'Název',
      type: 'text',
      required: true,
      colClass: 'col-span-2',
      validators: [
        (value) =>
          typeof value === 'string' && value.trim().length < 2
            ? 'Název musí mít alespoň 2 znaky'
            : null,
      ],
    },
    {
      name: 'message',
      label: 'Zpráva',
      type: 'textarea',
      required: true,
      colClass: 'col-span-2',
      rows: 3,
    },
    {
      name: 'severity',
      label: 'Typ',
      type: 'select',
      required: true,
      colClass: 'col-span-2',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Varování', value: 'warn' },
      ],
    },
    {
      name: 'activeFrom',
      label: 'Aktivní od',
      type: 'date',
      required: true,
      colClass: 'col-span-1',
    },
    {
      name: 'activeTo',
      label: 'Aktivní do',
      type: 'date',
      required: true,
      colClass: 'col-span-1',
      validators: [
        (value, form) => {
          if (!value || !form.activeFrom) return null;
          return new Date(value as string) <= new Date(form.activeFrom as string)
            ? 'Datum konce musí být po datu začátku'
            : null;
        },
      ],
    },
  ],
  submitLabel: 'Uložit oznámení',
  cancelLabel: 'Zrušit',
  showCancel: true,
};

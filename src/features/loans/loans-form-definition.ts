import type { FormDefinition } from '@/shared/components/form/types';
import type { Loan } from '@/types/entities';

export const loanForm: FormDefinition<Loan> = {
  gridClass: 'grid grid-cols-2 gap-4',
  fields: [
    {
      name: 'borrower',
      label: 'Vypůjčil si',
      type: 'text',
      required: true,
      placeholder: 'Zadejte jméno výpůjčitele',
      colClass: 'col-span-2',
      validators: [
        (value) => (value && value.length < 2 ? 'Jméno musí mít alespoň 2 znaky' : null),
      ],
    },
    {
      name: 'loanDate',
      label: 'Datum zapůjčení',
      type: 'date',
      required: true,
      colClass: 'col-span-1',
    },
    {
      name: 'returnDate',
      label: 'Datum vrácení',
      type: 'date',
      colClass: 'col-span-1',
    },
  ],
  submitLabel: 'Uložit výpůjčku',
  cancelLabel: 'Zrušit',
  showCancel: true,
};

import type { FormDefinition } from '@/shared/components/form/types';
import { Book } from '@/types/entities';

export const bookForm: FormDefinition<Book & {lendImmediately: boolean}> = {
  gridClass: 'grid grid-cols-2 gap-4',
  fields: [
    {
      name: 'title',
      label: 'Název',
      type: 'text',
      required: true,
      placeholder: 'Zadejte název knihy',
      colClass: 'col-span-1',
      validators: [
        (value) => (typeof value === 'string' && value.length < 3 ? 'Název musí mít alespoň 3 znaky' : null),
        (value) => (typeof value === 'string' && value.length > 100 ? 'Název nesmí být delší než 100 znaků' : null),
      ],
    },
    {
      name: 'author',
      label: 'Autor',
      type: 'text',
      required: true,
      placeholder: 'Zadejte jméno autora',
      colClass: 'col-span-1',
      validators: [
        (value) => (typeof value === 'string' && value.length < 2 ? 'Jméno autora musí mít alespoň 2 znaky' : null),
      ],
    },
    {
      name: 'description',
      label: 'Popis',
      type: 'textarea',
      placeholder: 'Zadejte popis knihy',
      hint: 'Nepovinný popis knihy pro lepší identifikaci',
      colClass: 'col-span-2',
    },
    {
      name: 'publicationYear',
      label: 'Rok vydání',
      type: 'number',
      placeholder: 'Zadejte rok vydání',
      colClass: 'col-span-1',
      validators: [
        (value) => {
          const year = value as number;
          return year && (year < 1000 || year > new Date().getFullYear())
            ? `Rok musí být mezi 1000 a ${new Date().getFullYear()}`
            : null;
        },
      ],
    },
    {
      name: 'isAvailable',
      label: 'Dostupná k zapůjčení',
      type: 'select',
      options: [
        { label: 'Ano', value: true },
        { label: 'Ne', value: false },
      ],
      required: true,
      colClass: 'col-span-1',
      validators: [(value) => (value === undefined ? 'Musíte vybrat dostupnost' : null)],
    },
    {
      name: 'lendImmediately',
      label: 'Ihned zapůjčit',
      type: 'checkbox',
      colClass: 'col-span-2',
    },
  ],
  submitLabel: 'Uložit knihu',
  cancelLabel: 'Zrušit',
  showCancel: true,
};

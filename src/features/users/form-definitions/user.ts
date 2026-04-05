import type { FormDefinition } from '@/shared/components/form/types';
import { CreateUserDto } from '@/types/entities';

export const userForm: FormDefinition<CreateUserDto> = {
  gridClass: 'grid grid-cols-2 gap-4',
  fields: [
    {
      name: 'username',
      label: 'Uživatelské jméno',
      type: 'text',
      required: true,
      colClass: 'col-span-1',
      validators: [
        (value) => (typeof value === 'string' && value.length < 3 ? 'Uživatelské jméno mít alespoň 3 znaky' : null),
        (value) => (typeof value === 'string' && value.length > 50 ? 'Uživatelské jméno nesmí být delší než 50 znaků' : null),
      ],
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      colClass: 'col-span-1',
    },
    {
      name: 'password',
      label: 'Heslo',
      type: 'password',
      required: true,
      colClass: 'col-span-1',
      validators: [
        (value) => (typeof value === 'string' && value.length < 8 ? 'Heslo musí mít alespoň 8 znaků' : null),
      ],
    },
    {
      name: 'role',
      label: 'Uživatelská role',
      type: 'select',
      required: true,
      colClass: 'col-span-1',
      options: [
        { label: 'Administrátor', value: 'admin' },
        { label: 'Uživatel', value: 'user' },
      ],
    },
  ],
  submitLabel: 'Uložit uživatele',
  cancelLabel: 'Zrušit',
  showCancel: true,
};

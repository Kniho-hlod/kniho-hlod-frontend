import type { FormDefinition } from '@/shared/components/form/types';
import { CreateUserDto } from '@/types/entities';

export const userForm: FormDefinition<CreateUserDto> = {
  fields: [
    {
      name: 'username',
      label: 'Uživatelské jméno',
      type: 'text',
      required: true,
      validators: [
        (value) => (value && value.length < 3 ? 'Uživatelské jméno mít alespoň 3 znaky' : null),
        (value) =>
          value && value.length > 50 ? 'Uživatelské jméno nesmí být delší než 50 znaků' : null,
      ],
    },
    {
      name: 'password',
      label: 'Heslo',
      type: 'password',
      required: true,
      validators: [
        (value) => (value && value.length < 6 ? ' Heslo musí mít alespoň 6 znaků' : null),
      ],
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
    },
    {
      name: 'role',
      label: 'Uživatelská role',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Administrátor',
          value: 'admin',
        },

        {
          label: 'Uživatel',
          value: 'user',
        },
      ],
    },
  ],
  submitLabel: 'Uložit uživatele',
  cancelLabel: 'Zrušit',
  showCancel: true,
};

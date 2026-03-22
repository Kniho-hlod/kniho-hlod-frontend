import { CreateUserDto } from '@/types/entities';
import type { FormDefinition } from '@/shared/components/form/types';

type RegistrationUser = CreateUserDto & {
  confirmPassword: string;
};

export const registrationForm: FormDefinition<RegistrationUser> = {
  fields: [
    {
      name: 'username',
      label: 'Uživatelské jméno',
      type: 'text',
      required: true,
      hint: 'Slouží pouze k oslovení.',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'Zadejte svůj email.',
      validators: [
        (value) =>
          value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Zadejte platný email' : null,
      ],
    },
    {
      name: 'password',
      label: 'Heslo',
      type: 'password',
      required: true,
      validators: [
        (value) => (value && value.length < 8 ? 'Heslo musí mít alespoň 8 znaků' : null),
      ],
    },
    {
      name: 'confirmPassword',
      label: 'Potvrzení hesla',
      type: 'password',
      required: true,
      validators: [
        (value, formData) =>
          formData && value !== formData.password ? 'Hesla se neshodují' : null,
      ],
      //nefunguje při použití useFormState, protože formData není dostupné v tomto kontextu
    },
  ],
  submitLabel: 'Registrovat',
  cancelLabel: 'Zrušit',
  showCancel: true,
};

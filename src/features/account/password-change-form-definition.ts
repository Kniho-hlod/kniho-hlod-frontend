import type { FormDefinition } from '@/shared/components/form/types';

export interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  [key: string]: unknown;
}

export const passwordChangeFormDefinition: FormDefinition<PasswordChangeForm> = {
  fields: [
    {
      name: 'currentPassword',
      label: 'Aktuální heslo',
      type: 'password',
      required: true,
      placeholder: 'Zadejte aktuální heslo',
      toggleMask: true,
    },
    {
      name: 'newPassword',
      label: 'Nové heslo',
      type: 'password',
      required: true,
      placeholder: 'Minimálně 8 znaků',
      toggleMask: true,
      validators: [
        (value) => (typeof value === 'string' && value.length < 8 ? 'Heslo musí mít alespoň 8 znaků' : null),
      ],
    },
    {
      name: 'confirmPassword',
      label: 'Potvrdit heslo',
      type: 'password',
      required: true,
      placeholder: 'Zopakujte nové heslo',
      toggleMask: true,
      validators: [
        (value, formData) => (value !== formData.newPassword ? 'Hesla se neshodují' : null),
      ],
    },
  ],
  submitLabel: 'Uložit heslo',
};

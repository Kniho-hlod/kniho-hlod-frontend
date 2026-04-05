import type { FormDefinition } from './types';

export function createResolver<T extends Record<string, unknown>>(definition: FormDefinition<T>) {
  return (options: { values: Record<string, unknown>; names?: string[] }) => {
    const { values } = options;
    const errors: Record<string, { message: string }[]> = {};

    for (const field of definition.fields) {
      if (field.type === 'custom') continue;

      const value = values[field.name];
      const fieldErrors: { message: string }[] = [];

      if (field.required) {
        const empty =
          value === undefined ||
          value === null ||
          value === '' ||
          (Array.isArray(value) && value.length === 0);
        if (empty) {
          fieldErrors.push({ message: `Pole ${field.label} je povinné` });
        }
      }

      if (fieldErrors.length === 0 && field.validators) {
        for (const validator of field.validators) {
          const msg = validator(value, values as unknown as T);
          if (msg) {
            fieldErrors.push({ message: msg });
            break;
          }
        }
      }

      if (fieldErrors.length > 0) {
        errors[field.name] = fieldErrors;
      }
    }

    return { values, errors };
  };
}

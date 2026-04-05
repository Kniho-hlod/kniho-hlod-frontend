export type FieldValidator<T = Record<string, unknown>> = (value: unknown, formData: T) => string | null;

export interface FormFieldScope {
  props: {
    onChange?: (...args: unknown[]) => void;
    onBlur?: () => void;
    [key: string]: unknown;
  };
  value: unknown;
  touched: boolean;
  dirty: boolean;
  pristine: boolean;
  valid: boolean;
  invalid: boolean;
  error: { message?: string } | null;
  errors: Array<{ message?: string }>;
}

interface BaseFieldDef<T> {
  name: keyof T & string;
  label: string;
  required?: boolean;
  hint?: string;
  validators?: FieldValidator<T>[];
  hidden?: boolean | ((model: T) => boolean);
  disabled?: (model: T) => boolean;
  colClass?: string;
}

export interface TextFieldDef<T> extends BaseFieldDef<T> {
  type: 'text' | 'email';
  placeholder?: string;
}

export interface PasswordFieldDef<T> extends BaseFieldDef<T> {
  type: 'password';
  placeholder?: string;
  feedback?: boolean;
  toggleMask?: boolean;
}

export interface NumberFieldDef<T> extends BaseFieldDef<T> {
  type: 'number';
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface SelectFieldDef<T> extends BaseFieldDef<T> {
  type: 'select';
  options: Array<{ label: string; value: unknown }>;
  placeholder?: string;
}

export interface DateFieldDef<T> extends BaseFieldDef<T> {
  type: 'date';
  dateFormat?: string;
  placeholder?: string;
}

export interface TextareaFieldDef<T> extends BaseFieldDef<T> {
  type: 'textarea';
  placeholder?: string;
  rows?: number;
}

export interface CheckboxFieldDef<T> extends BaseFieldDef<T> {
  type: 'checkbox';
}

export interface CustomFieldDef<T> extends BaseFieldDef<T> {
  type: 'custom';
}

export type FormFieldDefinition<T> =
  | TextFieldDef<T>
  | PasswordFieldDef<T>
  | NumberFieldDef<T>
  | SelectFieldDef<T>
  | DateFieldDef<T>
  | TextareaFieldDef<T>
  | CheckboxFieldDef<T>
  | CustomFieldDef<T>;

export interface FormDefinition<T> {
  fields: Array<FormFieldDefinition<T>>;
  gridClass?: string;
  submitLabel?: string;
  cancelLabel?: string;
  showCancel?: boolean;
  canSubmit?: (values: Partial<T>) => boolean;
}

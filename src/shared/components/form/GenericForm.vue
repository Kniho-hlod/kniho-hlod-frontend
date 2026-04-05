<script setup lang="ts">
import { Form, FormField } from '@primevue/forms';
import { computed, type Component } from 'vue';
import type { FormSubmitEvent } from '@primevue/forms';
import type { FormFieldScope } from './types';
import type { FormDefinition, FormFieldDefinition } from './types';
import { createResolver } from './create-resolver';
import FieldText from './fields/FieldText.vue';
import FieldNumber from './fields/FieldNumber.vue';
import FieldSelect from './fields/FieldSelect.vue';
import FieldTextarea from './fields/FieldTextarea.vue';
import FieldCheckbox from './fields/FieldCheckbox.vue';
import FieldDate from './fields/FieldDate.vue';
import FieldPassword from './fields/FieldPassword.vue';

type FormModel = Record<string, unknown>;

const fieldComponentMap: Record<string, Component> = {
  text: FieldText,
  email: FieldText,
  password: FieldPassword,
  number: FieldNumber,
  select: FieldSelect,
  textarea: FieldTextarea,
  checkbox: FieldCheckbox,
  date: FieldDate,
};

const props = defineProps<{
  definition: FormDefinition<FormModel>;
  modelValue: FormModel;
  mode?: 'create' | 'edit' | 'view';
  submitting?: boolean;
}>();

const emit = defineEmits<{
  submit: [value: FormModel];
  close: [];
}>();

const isViewOnly = computed(() => props.mode === 'view');

const resolver = computed(() => createResolver(props.definition));

const initialValues = computed(() => {
  const base: FormModel = { ...props.modelValue };
  for (const field of props.definition.fields) {
    if (!(field.name in base)) {
      base[field.name] = field.type === 'checkbox' ? false : null;
    }
    if (
      field.type === 'date' &&
      base[field.name] != null &&
      !(base[field.name] instanceof Date)
    ) {
      const parsed = new Date(base[field.name] as string | number);
      base[field.name] = isNaN(parsed.getTime()) ? null : parsed;
    }
  }
  return base;
});

function getFormValues(formState: Record<string, FormFieldScope>): FormModel {
  return Object.fromEntries(
    props.definition.fields.map((f) => [f.name, formState[f.name]?.value ?? props.modelValue?.[f.name]])
  );
}

function isFieldHidden(field: FormFieldDefinition<FormModel>, formState: Record<string, FormFieldScope>): boolean {
  if (field.hidden === undefined || field.hidden === false) return false;
  if (typeof field.hidden === 'function') {
    return field.hidden(getFormValues(formState));
  }
  return !!field.hidden;
}

function isFieldDisabled(field: FormFieldDefinition<FormModel>, formState: Record<string, FormFieldScope>): boolean {
  if (isViewOnly.value) return true;
  if (typeof field.disabled === 'function') {
    return field.disabled(getFormValues(formState));
  }
  return false;
}

function onSubmit(event: FormSubmitEvent): void {
  if (event.valid) {
    emit('submit', event.values as FormModel);
  }
}
</script>

<template>
  <Form
    v-slot="formState"
    :resolver="resolver"
    :initial-values="initialValues"
    :validate-on-blur="true"
    :validate-on-value-update="false"
    :validate-on-submit="true"
    @submit="onSubmit"
  >
    <div class="flex flex-col gap-4">
      <div :class="definition.gridClass ?? 'flex flex-col gap-4'">
        <template v-for="field in definition.fields" :key="field.name">

          <!-- Custom field: named slot -->
          <div
            v-if="field.type === 'custom' && !isFieldHidden(field, formState as unknown as Record<string, FormFieldScope>)"
            :class="field.colClass"
          >
            <slot :name="field.name" />
          </div>

          <!-- Standard fields -->
          <div
            v-else-if="field.type !== 'custom' && !isFieldHidden(field, formState as unknown as Record<string, FormFieldScope>) && !(isViewOnly && field.type === 'password')"
            :class="field.colClass"
          >
            <FormField v-slot="$field" :name="field.name">
              <component
                :is="fieldComponentMap[field.type]"
                :field="field"
                :field-state="$field"
                :disabled="isFieldDisabled(field, formState as unknown as Record<string, FormFieldScope>)"
              />
            </FormField>
          </div>

        </template>
      </div>

      <div v-if="!isViewOnly" class="form-actions">
        <Button
          type="submit"
          icon="pi pi-save"
          :label="definition.submitLabel ?? 'Uložit'"
          :loading="submitting"
          :disabled="submitting || definition.fields.filter(f => f.required).some(f => !(formState as unknown as Record<string, FormFieldScope>)[f.name]?.value) || (definition.canSubmit ? !definition.canSubmit(Object.fromEntries(definition.fields.map(f => [f.name, (formState as unknown as Record<string, FormFieldScope>)[f.name]?.value]))) : false)"
        />
      </div>
    </div>
  </Form>
</template>

<style scoped>
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>

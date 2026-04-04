<script setup lang="ts">
import { Form, FormField } from '@primevue/forms';
import { computed, type Component } from 'vue';
import type { FormDefinition } from './types';
import { createResolver } from './create-resolver';
import FieldText from './fields/FieldText.vue';
import FieldNumber from './fields/FieldNumber.vue';
import FieldSelect from './fields/FieldSelect.vue';
import FieldTextarea from './fields/FieldTextarea.vue';
import FieldCheckbox from './fields/FieldCheckbox.vue';
import FieldDate from './fields/FieldDate.vue';

const fieldComponentMap: Record<string, Component> = {
  text: FieldText,
  email: FieldText,
  password: FieldText,
  number: FieldNumber,
  select: FieldSelect,
  textarea: FieldTextarea,
  checkbox: FieldCheckbox,
  date: FieldDate,
};

const props = defineProps<{
  definition: FormDefinition<any>;
  modelValue: any;
  mode?: 'create' | 'edit' | 'view';
  submitting?: boolean;
}>();

const emit = defineEmits<{
  submit: [value: any];
  close: [];
}>();

const isViewOnly = computed(() => props.mode === 'view');

const resolver = computed(() => createResolver(props.definition));

const initialValues = computed(() => {
  const base = { ...props.modelValue };
  for (const field of props.definition.fields) {
    // Ensure every form field has an entry so PrimeVue Forms includes it in event.values
    if (!(field.name in base)) {
      base[field.name] = field.type === 'checkbox' ? false : null;
    }
    if (
      field.type === 'date' &&
      base[field.name] != null &&
      !(base[field.name] instanceof Date)
    ) {
      const parsed = new Date(base[field.name]);
      base[field.name] = isNaN(parsed.getTime()) ? null : parsed;
    }
  }
  return base;
});

function isFieldHidden(field: any, formState: any): boolean {
  if (field.hidden === undefined || field.hidden === false) return false;
  if (typeof field.hidden === 'function') {
    const values = Object.fromEntries(
      props.definition.fields.map((f: any) => [
        f.name,
        formState[f.name]?.value ?? props.modelValue?.[f.name],
      ])
    );
    return field.hidden(values);
  }
  return !!field.hidden;
}

function isFieldDisabled(field: any, formState: any): boolean {
  if (isViewOnly.value) return true;
  if (typeof field.disabled === 'function') {
    const values = Object.fromEntries(
      props.definition.fields.map((f: any) => [
        f.name,
        formState[f.name]?.value ?? props.modelValue?.[f.name],
      ])
    );
    return field.disabled(values);
  }
  return false;
}

function onSubmit(event: any) {
  if (event.valid) {
    emit('submit', event.values);
  }
}
</script>

<template>
  <Form
    :resolver="resolver"
    :initialValues="initialValues"
    :validateOnBlur="true"
    :validateOnValueUpdate="false"
    :validateOnSubmit="true"
    @submit="onSubmit"
    v-slot="formState"
  >
    <div class="flex flex-col gap-4">
      <div :class="definition.gridClass ?? 'flex flex-col gap-4'">
        <template v-for="field in definition.fields" :key="field.name">

          <!-- Custom field: named slot -->
          <div
            v-if="field.type === 'custom' && !isFieldHidden(field, formState)"
            :class="field.colClass"
          >
            <slot :name="field.name" />
          </div>

          <!-- Standard fields -->
          <div
            v-else-if="field.type !== 'custom' && !isFieldHidden(field, formState) && !(isViewOnly && field.type === 'password')"
            :class="field.colClass"
          >
            <FormField :name="field.name" v-slot="$field">
              <component
                :is="fieldComponentMap[field.type]"
                :field="field"
                :fieldState="$field"
                :disabled="isFieldDisabled(field, formState)"
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
          :disabled="submitting"
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

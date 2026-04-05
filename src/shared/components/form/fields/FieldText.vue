<script setup lang="ts">
import type { FormFieldScope } from '../types';
import type { TextFieldDef } from '../types';

defineProps<{
  field: TextFieldDef<Record<string, unknown>>;
  fieldState: FormFieldScope;
  disabled: boolean;
}>();
</script>

<template>
  <IftaLabel>
    <InputText
      :id="field.name"
      v-bind="(fieldState as unknown as Record<string, unknown>)"
      :type="field.type"
      :placeholder="field.placeholder"
      :disabled="disabled"
      :invalid="fieldState.invalid"
      variant="filled"
      fluid
    />
    <label :for="field.name">{{ field.label }}</label>
  </IftaLabel>
  <Message v-if="fieldState.invalid" severity="error" size="small" variant="simple">
    {{ fieldState.error?.message }}
  </Message>
  <small v-else-if="field.hint" class="hint-message">{{ field.hint }}</small>
</template>

<style scoped>
.hint-message {
  color: var(--p-text-muted-color, #666);
  font-size: 0.75rem;
}
</style>

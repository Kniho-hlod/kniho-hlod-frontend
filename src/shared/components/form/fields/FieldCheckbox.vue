<script setup lang="ts">
import type { FormFieldScope } from '../types';
import type { CheckboxFieldDef } from '../types';

defineProps<{
  field: CheckboxFieldDef<Record<string, unknown>>;
  fieldState: FormFieldScope;
  disabled: boolean;
}>();
</script>

<template>
  <div class="flex items-center gap-2">
    <Checkbox
      :id="field.name"
      v-bind="(fieldState as unknown as Record<string, unknown>)"
      :disabled="disabled"
      :invalid="fieldState.invalid"
      binary
    />
    <label :for="field.name">{{ field.label }}</label>
  </div>
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

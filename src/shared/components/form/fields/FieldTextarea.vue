<script setup lang="ts">
import type { TextareaFieldDef } from '../types';

defineProps<{
  field: TextareaFieldDef<any>;
  fieldState: any;
  disabled: boolean;
}>();
</script>

<template>
  <IftaLabel>
    <Textarea
      :id="field.name"
      v-bind="fieldState"
      :rows="field.rows ?? 3"
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

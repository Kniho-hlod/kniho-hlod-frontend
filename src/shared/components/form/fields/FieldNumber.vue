<script setup lang="ts">
import type { NumberFieldDef } from '../types';

defineProps<{
  field: NumberFieldDef<any>;
  fieldState: any;
  disabled: boolean;
}>();
</script>

<template>
  <IftaLabel>
    <InputNumber
      :id="field.name"
      :modelValue="fieldState.value"
      @value-change="(val) => fieldState.props.onChange({ target: { value: val } })"
      @blur="fieldState.props.onBlur"
      :min="field.min"
      :max="field.max"
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

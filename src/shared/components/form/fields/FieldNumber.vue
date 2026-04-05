<script setup lang="ts">
import { computed } from 'vue';
import type { FormFieldScope } from '../types';
import type { NumberFieldDef } from '../types';

const props = defineProps<{
  field: NumberFieldDef<Record<string, unknown>>;
  fieldState: FormFieldScope;
  disabled: boolean;
}>();

const numberValue = computed(() => (typeof props.fieldState.value === 'number' ? props.fieldState.value : null));
</script>

<template>
  <IftaLabel>
    <InputNumber
      :id="field.name"
      :model-value="numberValue"
      :min="field.min"
      :max="field.max"
      :placeholder="field.placeholder"
      :disabled="disabled"
      :invalid="fieldState.invalid"
      variant="filled"
      fluid
      @value-change="(val) => fieldState.props.onChange?.({ target: { value: val } })"
      @blur="() => fieldState.props.onBlur?.()"
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

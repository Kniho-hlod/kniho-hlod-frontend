<script setup lang="ts">
import { DatePicker } from 'primevue';
import type { DateFieldDef } from '../types';

defineProps<{
  field: DateFieldDef<any>;
  fieldState: any;
  disabled: boolean;
}>();
</script>

<template>
  <IftaLabel>
    <DatePicker
      :id="field.name"
      :modelValue="fieldState.value"
      @date-select="(val) => fieldState.props.onChange({ target: { value: val } })"
      @blur="fieldState.props.onBlur"
      :dateFormat="field.dateFormat ?? 'dd.mm.yy'"
      :placeholder="field.placeholder"
      :disabled="disabled"
      :invalid="fieldState.invalid"
      variant="filled"
      show-icon
      icon-display="input"
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

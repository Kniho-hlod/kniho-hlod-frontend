<script setup lang="ts">
import { DatePicker } from 'primevue';
import { computed } from 'vue';
import type { FormFieldScope } from '../types';
import type { DateFieldDef } from '../types';

const props = defineProps<{
  field: DateFieldDef<Record<string, unknown>>;
  fieldState: FormFieldScope;
  disabled: boolean;
}>();

const dateValue = computed(() => (props.fieldState.value instanceof Date ? props.fieldState.value : null));
</script>

<template>
  <IftaLabel>
    <DatePicker
      :id="field.name"
      :model-value="dateValue"
      :date-format="field.dateFormat ?? 'dd.mm.yy'"
      :placeholder="field.placeholder"
      :disabled="disabled"
      :invalid="fieldState.invalid"
      variant="filled"
      show-icon
      icon-display="input"
      fluid
      @date-select="(val) => fieldState.props.onChange?.({ target: { value: val } })"
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

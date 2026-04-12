<script setup lang="ts">
import type { DescriptionFieldDef } from '../types';

defineProps<{
  field: DescriptionFieldDef<Record<string, unknown>>;
}>();
</script>

<template>
  <div :class="field.class">{{ field.text }}</div>
</template>

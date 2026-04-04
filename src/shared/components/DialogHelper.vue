<script setup lang="ts">
import { computed, inject } from 'vue';
import type { Ref } from 'vue';
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions';

const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef')!;

// Vytvoření handleru pro custom události
const customEventHandlers = computed(() => {
  const handlers: Record<string, Function> = {};

  // Pokud jsou definované custom event handlery v dialogRef.data
  if (dialogRef.value.data.eventHandlers) {
    Object.keys(dialogRef.value.data.eventHandlers).forEach((eventName) => {
      handlers[eventName] = (...args: any[]) => {
        // Zavolání custom handleru s argumenty
        dialogRef.value.data.eventHandlers[eventName](...args);
      };
    });
  }

  return handlers;
});
</script>

<template>
  <component
    :is="dialogRef.data.is"
    v-bind="dialogRef.data.props"
    @close="dialogRef.close"
    v-on="customEventHandlers"
  />
</template>

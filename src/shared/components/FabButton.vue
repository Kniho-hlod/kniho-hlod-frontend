<script setup lang="ts">
defineProps<{ visible: boolean }>();
const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <button
    class="lg:hidden fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-primary-500 shadow-lg flex items-center justify-center text-white transition-all duration-200"
    :class="visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'"
    aria-label="Add new"
    @click="emit('click')"
  >
    <i class="pi pi-plus text-xl" aria-hidden="true"></i>
  </button>
</template>

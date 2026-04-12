
<script setup lang="ts">
import { useToastPosition } from '@/shared/composables/use-toast-position';

const { toastPosition } = useToastPosition();
</script>

<template>
  <router-view />
  <Toast :position="toastPosition" />
  <dynamic-dialog />
  <confirm-dialog />
</template>

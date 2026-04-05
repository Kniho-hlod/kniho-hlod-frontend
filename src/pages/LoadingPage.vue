<script setup lang="ts">
import ProgressBar from 'primevue/progressbar';
import { ref, onMounted } from 'vue';

const progress = ref(0);
const index = ref(0);

const loadingText = [
  'Hlodám vaše knížky...',
  'Naháním nepoddajné tituly...',
  'Vrtám se ve výpujčkách...',
];

onMounted(() => {
  const interval = setInterval(() => {
    if (progress.value < 100) {
      progress.value += 2;

      const step = Math.floor((progress.value / 100) * loadingText.length);

      index.value = Math.min(step, loadingText.length - 1);
    } else {
      clearInterval(interval);
      emit('all-loaded');
    }
  }, 60);
});

const emit = defineEmits<{
  'all-loaded': [];
}>();
</script>

<template>
  <Card class="opacity-95 w-[400px]">
    <template #title>
      <h2 class="mb-6 text-2xl font-semibold text-surface-800">{{ loadingText[index] }}</h2>
    </template>
    <template #content>
      <ProgressBar :value="progress" mode="indeterminate" class="w-full" style="height: 1rem" />
    </template>
  </Card>
  <div class="flex flex-col items-center justify-center"></div>
</template>

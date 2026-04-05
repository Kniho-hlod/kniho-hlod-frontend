<script setup lang="ts">
defineProps<{
  titleKey: string;
  icon: string;
  bookTitle: string;
  borrower: string;
  date: string;
  dateLabel: string;
}>();
</script>

<template>
  <Card>
    <template #content>
      <div class="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold mb-3 text-sm">
        <i :class="icon" />
        {{ titleKey }}
      </div>
      <p class="text-surface-800 font-bold">{{ bookTitle }}</p>
      <p class="text-surface-600 text-sm">{{ borrower }}</p>
      <p class="text-surface-400 text-xs mt-1">{{ dateLabel }}: {{ date }}</p>
    </template>
  </Card>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: number;
  color: string;
  icon: string;
  to?: string;
}>();
</script>

<template>
  <component :is="to ? 'RouterLink' : 'div'" :to="to" class="block no-underline">
    <Card class="overflow-hidden" :class="to ? 'cursor-pointer hover:shadow-md transition-shadow' : ''">
      <template #content>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-surface-500 text-xs font-medium uppercase tracking-wide mb-1">
              {{ label }}
            </p>
            <p class="text-3xl font-bold" :style="{ color }">{{ value }}</p>
          </div>
          <span
            class="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0"
            :style="{ backgroundColor: color }"
          >
            <i :class="icon" />
          </span>
        </div>
      </template>
    </Card>
  </component>
</template>

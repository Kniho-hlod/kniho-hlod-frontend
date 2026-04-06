<script setup lang="ts">
import { computed } from 'vue';
import type { CardAction, CardBadge } from './types';

const props = defineProps<{
  title: string;
  subtitle?: string;
  icon?: string;
  badge?: CardBadge;
  actions?: CardAction[];
}>();

const visibleActions = computed(() => (props.actions ?? []).filter((a) => a.visible !== false));
</script>

<template>
  <div
    class="bg-surface-0 rounded-xl shadow-sm border border-surface-100 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
  >
    <div class="flex items-start justify-between gap-2">
      <div class="flex items-center gap-2 min-w-0">
        <slot name="icon">
          <div
            v-if="icon"
            class="w-10 h-10 shrink-0 bg-surface-100 rounded-lg flex items-center justify-center"
          >
            <i :class="[icon, 'text-surface-500']"></i>
          </div>
        </slot>

        <div class="min-w-0">
          <p class="font-bold text-surface-800 truncate leading-tight">{{ title }}</p>
          <p v-if="subtitle" class="text-surface-500 text-xs truncate mt-0.5">{{ subtitle }}</p>
        </div>
      </div>

      <Tag v-if="badge" :severity="badge.severity" class="shrink-0">
        <template #default>
          <span class="flex items-center gap-1">
            <i v-if="badge.icon" :class="[badge.icon, 'text-xs']"></i>
            {{ badge.label }}
          </span>
        </template>
      </Tag>
    </div>

    <slot />

    <div v-if="visibleActions.length" class="flex gap-2 pt-1 border-t border-surface-100 justify-end">
      <Button
        v-for="(action, i) in visibleActions"
        :key="i"
        :icon="action.icon"
        :severity="action.severity ?? 'secondary'"
        :outlined="action.outlined !== false"
        :title="action.label"
        size="small"
        @click.stop="action.onClick()"
      />
    </div>
  </div>
</template>

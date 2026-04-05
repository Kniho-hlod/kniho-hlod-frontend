<script setup lang="ts">
import { formatValue, getNestedValue } from '@/shared/components/table/helpers';
import type { TableColumnDefinition } from '@/shared/components/table/types';
import type { Entity } from '@/types/entities';

defineProps<{
  columns: Array<TableColumnDefinition>;
  items: Array<Entity>;
  displayDetailOnly?: boolean;
  handleDetail?: (data?: Entity) => void;
  handleDelete?: (data?: Entity) => void;
  rowClass?: (data: Entity) => string | undefined;
}>();
</script>

<template>
  <DataTable :value="items" size="small" :row-class="rowClass">
    <template #empty>neni zaznamu</template>
    <Column v-if="handleDetail" class="w-0">
      <template v-if="!displayDetailOnly" #header>
        <Button size="small" icon="pi pi-plus" @click="handleDetail()" />
      </template>
      <template #body="{ data }">
        <Button size="small" outlined icon="pi pi-search" @click="handleDetail(data)" />
      </template>
    </Column>
    <Column v-if="handleDelete" class="w-0">
      <template #body="{ data }">
        <Button size="small" severity="danger" icon="pi pi-trash" @click="handleDelete(data)" />
      </template>
    </Column>
    <Column v-if="$slots['action-column']" class="w-0">
      <template #header>
        <slot name="action-column-header" />
      </template>
      <template #body="{ data }">
        <div class="flex gap-2">
          <slot name="action-column" :row="data" />
        </div>
      </template>
    </Column>
    <Column
      v-for="col in columns"
      :key="Array.isArray(col.field) ? col.field.join('.') : col.field"
      :field="Array.isArray(col.field) ? col.field.join('.') : col.field"
      :header="col.header"
    >
      <template #body="{ data }">
        {{ formatValue(getNestedValue(data as Record<string, unknown>, col.field), col) }}
      </template>
    </Column>
  </DataTable>
</template>

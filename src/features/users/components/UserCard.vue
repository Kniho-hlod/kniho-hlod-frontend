<script setup lang="ts">
import type { User } from '@/types/entities';
import { USER_ROLE_SEVERITY } from '@/shared/utils/constants/severity';
import type { UserRole } from '@/features/users/constants';
import GenericCard from '@/shared/components/card/GenericCard.vue';

const props = defineProps<{
  user: User;
}>();

const emit = defineEmits<{
  edit: [user: User];
  delete: [user: User];
}>();

const actions = [
  { icon: 'pi pi-pencil', severity: 'secondary' as const, onClick: () => emit('edit', props.user) },
  { icon: 'pi pi-trash', severity: 'danger' as const, onClick: () => emit('delete', props.user) },
];
</script>

<template>
  <GenericCard
    :title="user.username ?? ''"
    :subtitle="user.email"
    icon="pi pi-user"
    :badge="{ label: user.role, severity: USER_ROLE_SEVERITY[user.role as UserRole] }"
    :actions="actions"
  >
    <template #icon>
      <div class="w-10 h-10 rounded-full bg-surface-100 flex items-center justify-center shrink-0">
        <i class="pi pi-user text-surface-500"></i>
      </div>
    </template>
  </GenericCard>
</template>

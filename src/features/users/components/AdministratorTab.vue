<script setup lang="ts">
import { userForm } from '@/features/users/form-definitions/user';
import { useUserStore } from '@/features/users/store';
import { useBookStore } from '@/features/books/store';
import { useLoanStore } from '@/features/loans/store';
import { CreateUserDto, User } from '@/types/entities';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useFormDialog } from '@/shared/composables/use-form-dialog';
import { useConfirmDialog } from '@/shared/composables/use-confirm-dialog';
import { USER_ROLE_SEVERITY } from '@/shared/utils/constants/severity';
import type { UserRole } from '@/features/users/constants';

const { t } = useI18n();
const store = useUserStore();
const bookStore = useBookStore();
const loanStore = useLoanStore();

const users = computed(() => store.entities);

const stats = computed(() => [
  {
    label: t('admin.statUsers'),
    value: users.value.length,
    icon: 'pi pi-users',
    colorVar: 'var(--p-primary-600)',
    bgClass: 'bg-primary-50',
  },
  {
    label: t('admin.statBooks'),
    value: bookStore.entities.length,
    icon: 'pi pi-book',
    colorVar: 'var(--p-primary-500)',
    bgClass: 'bg-primary-50',
  },
  {
    label: t('admin.statLoans'),
    value: loanStore.entities.length,
    icon: 'pi pi-address-book',
    colorVar: 'var(--p-primary-400)',
    bgClass: 'bg-primary-50',
  },
  {
    label: t('admin.statActiveLoans'),
    value: loanStore.entities.filter((l) => !l.isReturned).length,
    icon: 'pi pi-calendar-clock',
    colorVar: 'var(--p-red-500)',
    bgClass: 'bg-red-50',
  },
]);

const searchQuery = ref('');

const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) return users.value;
  const q = searchQuery.value.toLowerCase();
  return users.value.filter(
    (u) => u.username?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
  );
});

const { openFormDialog } = useFormDialog();

function openDialog(data?: User): void {
  openFormDialog({
    definition: userForm,
    modelValue: (data as unknown as CreateUserDto) ?? new CreateUserDto(),
    onSave: async (content) => {
      await store.saveEntity(content as unknown as User);
    },
    mode: data ? 'view' : 'create',
    header: data ? t('admin.userDetail', { username: data.username }) : t('admin.newUser'),
  });
}

const { confirmDelete } = useConfirmDialog();

function deleteUser(data: User) {
  confirmDelete({
    text: t('admin.deleteConfirm'),
    handleConfirmCallback: async () => {
      await store.deleteEntity(data.id);
    },
  });
}

onMounted(() => {
  store.fetchEntities();
});
</script>

<template>
  <div class="grid gap-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-surface-800">{{ t('admin.title') }}</h1>
        <p class="text-surface-500 text-sm">{{ t('admin.subtitle') }}</p>
      </div>
      <Button
        :label="t('admin.newUser')"
        icon="pi pi-plus"
        size="small"
        class="self-start"
        @click="openDialog()"
      />
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-surface-0 rounded-xl p-4 shadow-sm border border-surface-100 flex items-center justify-between"
      >
        <div>
          <p class="text-surface-500 text-xs font-medium uppercase tracking-wide mb-1">
            {{ stat.label }}
          </p>
          <p class="text-2xl font-bold" :style="{ color: stat.colorVar }">{{ stat.value }}</p>
        </div>
        <div class="w-9 h-9 rounded-full flex items-center justify-center" :class="stat.bgClass">
          <i :class="stat.icon" :style="{ color: stat.colorVar }"></i>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="relative">
      <i
        class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none"
      ></i>
      <InputText
        v-model="searchQuery"
        :placeholder="t('admin.searchPlaceholder')"
        class="w-full pl-9"
      />
    </div>

    <!-- User cards -->
    <div v-if="filteredUsers.length === 0" class="text-center py-12 text-surface-400">
      <i class="pi pi-users text-4xl mb-3 block text-surface-200"></i>
      <p>{{ t('admin.empty') }}</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="user in filteredUsers"
        :key="user.id"
        class="bg-surface-0 rounded-xl shadow-sm border border-surface-100 p-4 flex flex-col gap-3"
      >
        <!-- User info -->
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-surface-100 flex items-center justify-center shrink-0"
          >
            <i class="pi pi-user text-surface-500"></i>
          </div>
          <div class="min-w-0 flex-1">
            <p class="font-semibold text-surface-800 truncate">{{ user.username }}</p>
            <p class="text-surface-400 text-xs truncate">{{ user.email }}</p>
          </div>
          <Tag :severity="USER_ROLE_SEVERITY[user.role as UserRole]" :value="user.role" class="shrink-0" />
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-1 border-t border-surface-100">
          <Button
            icon="pi pi-pencil"
            size="small"
            outlined
            severity="secondary"
            class="flex-1"
            @click="openDialog(user as User)"
          />
          <Button
            icon="pi pi-trash"
            size="small"
            outlined
            severity="danger"
            class="flex-1"
            @click="deleteUser(user as User)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

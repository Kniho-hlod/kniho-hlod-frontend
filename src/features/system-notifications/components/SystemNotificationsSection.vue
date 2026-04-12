<script setup lang="ts">
import { systemNotificationForm } from '@/features/system-notifications/system-notification-form-definition';
import { useSystemNotificationStore, type ExtendedSystemNotification } from '@/features/system-notifications/store';
import { CreateSystemNotificationDto, type SystemNotification } from '@/types/entities';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useFormDialog } from '@/shared/composables/use-form-dialog';
import { useConfirmDialog } from '@/shared/composables/use-confirm-dialog';

const { t } = useI18n();
const store = useSystemNotificationStore();
const { openFormDialog } = useFormDialog();
const { confirmDelete } = useConfirmDialog();

function openDialog(data?: ExtendedSystemNotification): void {
  openFormDialog({
    definition: systemNotificationForm,
    modelValue: (data as unknown as CreateSystemNotificationDto) ?? new CreateSystemNotificationDto(),
    onSave: async (content) => {
      await store.saveEntity(content);
    },
    mode: data ? 'view' : 'create',
    dialogSize: 'form',
    header: data ? t('systemNotifications.editTitle', { title: data.title }) : t('systemNotifications.newTitle'),
  });
}

function deleteNotification(data: SystemNotification): void {
  confirmDelete({
    text: t('systemNotifications.deleteConfirm'),
    handleConfirmCallback: async () => {
      await store.deleteEntity(data.id);
    },
  });
}

function formatDate(value: string | undefined): string {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function isActive(n: SystemNotification): boolean {
  const now = new Date();
  return new Date(n.activeFrom!) <= now && now <= new Date(n.activeTo!);
}

onMounted(() => {
  store.fetchEntities();
});
</script>

<template>
  <div class="grid gap-4">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 class="text-lg font-bold text-surface-800">{{ t('systemNotifications.title') }}</h2>
        <p class="text-surface-500 text-sm">{{ t('systemNotifications.subtitle') }}</p>
      </div>
      <Button
        :label="t('systemNotifications.new')"
        icon="pi pi-plus"
        size="small"
        class="self-start"
        @click="openDialog()"
      />
    </div>

    <!-- Empty state -->
    <div v-if="store.entities.length === 0" class="text-center py-8 text-surface-400">
      <i class="pi pi-bell text-3xl mb-2 block text-surface-200"></i>
      <p>{{ t('systemNotifications.empty') }}</p>
    </div>

    <!-- Notification cards -->
    <div v-else class="grid grid-cols-1 gap-3">
      <div
        v-for="notification in store.entities"
        :key="notification.id"
        class="bg-surface-0 rounded-xl p-4 shadow-sm border border-surface-100 flex items-start justify-between gap-4"
      >
        <div class="flex items-start gap-3 min-w-0">
          <i
            :class="notification.severity === 'warn' ? 'pi pi-exclamation-triangle text-yellow-500' : 'pi pi-info-circle text-blue-500'"
            class="mt-0.5 text-lg shrink-0"
          ></i>
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-semibold text-surface-800 truncate">{{ notification.title }}</span>
              <Tag
                v-if="isActive(notification)"
                value="Aktivní"
                severity="success"
                class="text-xs"
              />
            </div>
            <p class="text-surface-600 text-sm mt-0.5 line-clamp-2">{{ notification.message }}</p>
            <p class="text-surface-400 text-xs mt-1">
              {{ formatDate(notification.activeFrom) }} — {{ formatDate(notification.activeTo) }}
            </p>
          </div>
        </div>
        <div class="flex gap-1 shrink-0">
          <Button
            icon="pi pi-info-circle"
            text
            rounded
            size="small"
            :title="t('common.edit')"
            @click="openDialog(notification)"
          />
          <Button
            icon="pi pi-trash"
            text
            rounded
            size="small"
            severity="danger"
            :title="t('common.delete')"
            @click="deleteNotification(notification)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { authorizationStore } from '@/stores/authorization-store';
import { useAvatarUrl } from '@/shared/composables/use-avatar-url';
import { formatDate } from '@/shared/utils/date';

const { t } = useI18n();
const { loggedUser } = authorizationStore();

const avatarUrl = useAvatarUrl(loggedUser?.id);
</script>

<template>
  <Card>
    <template #content>
      <div class="flex items-center gap-4">
        <Avatar :image="avatarUrl" shape="circle" size="xlarge" class="shrink-0" />
        <div>
          <p class="text-surface-800 font-bold text-lg">{{ loggedUser?.username }}</p>
          <p class="text-surface-500 text-sm">{{ loggedUser?.email }}</p>
          <p class="text-surface-400 text-xs mt-1">
            {{ t('account.registeredAt') }}: {{ formatDate(loggedUser?.createdAt) || '—' }}
          </p>
        </div>
      </div>
    </template>
  </Card>
</template>

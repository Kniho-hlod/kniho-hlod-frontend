<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { getServices } from '@kniho-hlod/kniho-hlod-service';
import type { CreateUserDto } from '@/types/entities';
import { authorizationStore } from '@/stores/authorization-store';
import { useUserStore } from '@/features/users/store';
import { useFileStore } from '@/features/account/store';
import { useNotification } from '@/shared/composables/use-notification';
import { ref } from 'vue';
import { formatDate } from '@/shared/utils/date';

const { t } = useI18n();
const { loggedUser } = authorizationStore();
const userStore = useUserStore();
const fileStore = useFileStore();
const { showSaveSuccess, showSaveError } = useNotification();

const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);

function onFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0];
    previewUrl.value = URL.createObjectURL(selectedFile.value);
  }
}

async function uploadAvatar() {
  if (!selectedFile.value) return;

  const existing = fileStore.entities.find((img) => img.user === loggedUser?.id);
  if (existing) {
    await fileStore.deleteEntity(existing.id);
  }

  const meta = { name: selectedFile.value.name, user: loggedUser?.id };
  const savedMeta = await fileStore.saveEntity(meta as Parameters<typeof fileStore.saveEntity>[0]);
  if (!savedMeta) throw new Error('Failed to create file record');

  await getServices().files.upload(savedMeta.id, selectedFile.value);
  selectedFile.value = null;
  previewUrl.value = null;
  await fileStore.fetchEntities();
}

const editUsername = ref(loggedUser?.username ?? '');
const editEmail = ref(loggedUser?.email ?? '');
const isSaving = ref(false);

async function saveProfile() {
  if (!loggedUser?.id) return;
  isSaving.value = true;
  try {
    await userStore.saveEntity({
      ...(loggedUser as unknown as CreateUserDto),
      id: loggedUser.id,
      username: editUsername.value,
      email: editEmail.value,
    });
    if (selectedFile.value) {
      await uploadAvatar();
    }
    showSaveSuccess(t('common.save'), t('account.tabInfo'));
  } catch {
    showSaveError(t('common.save'), t('account.tabInfo'));
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <div class="grid gap-6">
    <div class="p-4 bg-surface-50 dark:bg-stone-800 rounded-xl">
      <p class="text-surface-700 dark:text-stone-200 font-medium text-sm mb-2">{{ t('account.avatar') }}</p>
      <div class="flex items-center gap-2 flex-wrap">
        <input
          id="avatarInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="onFileSelect"
        />
        <label
          for="avatarInput"
          class="px-3 py-1.5 text-sm border border-surface-200 rounded-lg cursor-pointer text-surface-600 dark:text-stone-300 hover:bg-surface-0 transition-colors"
        >
          <i class="pi pi-image mr-1.5"></i>
          {{ t('account.selectPhoto') }}
        </label>
        <span v-if="selectedFile" class="text-surface-400 text-xs">{{ selectedFile.name }}</span>
      </div>
    </div>

    <div class="grid gap-4">
      <div>
        <label class="block text-surface-700 dark:text-stone-200 font-medium mb-1.5 text-sm">
          {{ t('account.username') }}
        </label>
        <InputText v-model="editUsername" fluid />
      </div>
      <div>
        <label class="block text-surface-700 dark:text-stone-200 font-medium mb-1.5 text-sm">
          {{ t('account.email') }}
        </label>
        <InputText v-model="editEmail" type="email" fluid />
      </div>
      <div>
        <label class="block text-surface-700 dark:text-stone-200 font-medium mb-1.5 text-sm">
          {{ t('account.registeredAt') }}
        </label>
        <InputText :value="formatDate(loggedUser?.createdAt) || '—'" disabled fluid />
      </div>
    </div>

    <div class="flex justify-end">
      <Button
        :label="t('common.saveChanges')"
        icon="pi pi-check"
        :loading="isSaving"
        @click="saveProfile"
      />
    </div>
  </div>
</template>

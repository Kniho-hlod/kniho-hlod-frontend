<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { getServices } from '@eleansphere/kniho-hlod-service';
import { authorizationStore } from '@/stores/authorization-store';
import { useUserStore } from '@/features/users/store';
import { useFileStore } from '@/features/account/store';
import { useNotification } from '@/shared/composables/use-notification';
import { computed, onMounted, ref } from 'vue';
import { formatDate } from '@/shared/utils/date';

const { t } = useI18n();
const { loggedUser } = authorizationStore();
const userStore = useUserStore();
const fileStore = useFileStore();
const { showSaveSuccess, showSaveError } = useNotification();

// Avatar
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const currentAvatarUrl = ref<string | undefined>(undefined);
const isUploading = ref(false);

const hasAvatar = computed(
  () => !!(previewUrl.value || currentAvatarUrl.value)
);

function onFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0];
    previewUrl.value = URL.createObjectURL(selectedFile.value);
  }
}

async function uploadAvatar() {
  if (!selectedFile.value) return;
  isUploading.value = true;
  try {
    const meta = { name: selectedFile.value.name, user: loggedUser?.id };
    const savedMeta = await fileStore.saveEntity(meta as Parameters<typeof fileStore.saveEntity>[0]);
    if (!savedMeta) throw new Error('Failed to create file record');

    await getServices().files.upload(savedMeta.id, selectedFile.value);
    showSaveSuccess(t('common.save'), t('account.avatar'));
    selectedFile.value = null;
  } catch {
    showSaveError(t('common.save'), t('account.avatar'));
  } finally {
    isUploading.value = false;
  }
}

// Profile info editing
const editUsername = ref(loggedUser?.username ?? '');
const editEmail = ref(loggedUser?.email ?? '');
const isSaving = ref(false);

async function saveProfile() {
  if (!loggedUser?.id) return;
  isSaving.value = true;
  try {
    await userStore.saveEntity({ ...loggedUser, username: editUsername.value, email: editEmail.value });
    showSaveSuccess(t('common.save'), t('account.tabInfo'));
  } catch {
    showSaveError(t('common.save'), t('account.tabInfo'));
  } finally {
    isSaving.value = false;
  }
}

onMounted(async () => {
  const imageId = fileStore.entities.find((img) => img.user === loggedUser!.id)?.id;
  if (imageId) {
    try {
      currentAvatarUrl.value = getServices().files.getFileUrl(imageId);
    } catch {
      // non-critical
    }
  }
});
</script>

<template>
  <div class="grid gap-6">
    <!-- Avatar section -->
    <div class="flex items-center gap-5 p-4 bg-surface-50 rounded-xl">
      <Avatar
        size="xlarge"
        shape="circle"
        :image="previewUrl || currentAvatarUrl"
        :icon="hasAvatar ? undefined : 'pi pi-user'"
        class="shrink-0 !w-20 !h-20"
      />
      <div class="flex flex-col gap-2">
        <p class="text-surface-700 font-medium text-sm">{{ t('account.avatar') }}</p>
        <div class="flex items-center gap-2 flex-wrap">
          <input type="file" accept="image/*" @change="onFileSelect" class="hidden" id="avatarInput" />
          <label
            for="avatarInput"
            class="px-3 py-1.5 text-sm border border-surface-200 rounded-lg cursor-pointer text-surface-600 hover:bg-surface-0 transition-colors"
          >
            <i class="pi pi-image mr-1.5"></i>
            {{ t('account.selectPhoto') }}
          </label>
          <Button
            v-if="selectedFile"
            :label="t('common.upload')"
            icon="pi pi-upload"
            size="small"
            :loading="isUploading"
            @click="uploadAvatar"
          />
        </div>
        <p v-if="selectedFile" class="text-surface-400 text-xs">{{ selectedFile.name }}</p>
      </div>
    </div>

    <!-- Editable fields -->
    <div class="grid gap-4">
      <div>
        <label class="block text-surface-700 font-medium mb-1.5 text-sm">{{ t('account.username') }}</label>
        <InputText v-model="editUsername" fluid />
      </div>
      <div>
        <label class="block text-surface-700 font-medium mb-1.5 text-sm">{{ t('account.email') }}</label>
        <InputText v-model="editEmail" type="email" fluid />
      </div>
      <div>
        <label class="block text-surface-700 font-medium mb-1.5 text-sm">{{ t('account.registeredAt') }}</label>
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

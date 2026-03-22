<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { authorizationStore } from '@/stores/authorization-store'
import { useFileStore } from '@/features/account/store'
import { getServices } from '@eleansphere/kniho-hlod-service'
import { formatDate } from '@/shared/utils/date'

const { t } = useI18n()
const { loggedUser } = authorizationStore()

const avatarUrl = ref<string | undefined>(undefined)

onMounted(async () => {
  const fileStore = useFileStore()
  const imageId = fileStore.entities.find((img) => img.user === loggedUser!.id)?.id
  if (imageId) {
    try {
      avatarUrl.value = getServices().files.getFileUrl(imageId)
    } catch {
      // non-critical
    }
  }
})
</script>

<template>
  <Card>
    <template #content>
      <div class="flex items-center gap-4">
        <Avatar
          :image="avatarUrl"
          icon="pi pi-user"
          shape="circle"
          size="xlarge"
          class="shrink-0"
        />
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

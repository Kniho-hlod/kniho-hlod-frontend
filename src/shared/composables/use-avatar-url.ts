import { computed } from 'vue';
import { useFileStore } from '@/features/account/store';
import { getServices } from '@kniho-hlod/kniho-hlod-service';

export function useAvatarUrl(userId: string | undefined) {
  const fileStore = useFileStore();
  return computed(() => {
    if (!userId) return undefined;
    const imageId = fileStore.entities.find((img) => img.user === userId)?.id;
    if (!imageId) return undefined;
    try {
      return getServices().files.getFileUrl(imageId);
    } catch {
      return undefined;
    }
  });
}

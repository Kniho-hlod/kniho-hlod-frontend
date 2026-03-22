import { getServices } from '@eleansphere/kniho-hlod-service';
import { defineEntityStore } from '@/stores/entity-store';
import type { ProfileImage } from '@/types/entities';
import type { CreateExtendedEntity } from '@/types/store-definition';

type ExtendFile = {};

export type ExtendedFile = CreateExtendedEntity<ProfileImage, ExtendFile>;

export const useFileStore = defineEntityStore<ProfileImage, ExtendFile>(
  'profileImageStore',
  {},
  {
    service: {
      getAll: () => getServices().files.getAll(),
      getById: (id) => getServices().files.getById(id),
      create: (data) => getServices().files.create(data),
      remove: (id) => getServices().files.delete(id),
    },
  }
);

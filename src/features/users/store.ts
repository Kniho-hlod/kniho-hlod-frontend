import { getServices } from '@kniho-hlod/kniho-hlod-service';
import { defineEntityStore } from '@/stores/entity-store';
import type { User } from '@/types/entities';
import type { CreateExtendedEntity } from '@/types/store-definition';

type ExtendUser = {};

export type ExtendedUser = CreateExtendedEntity<User, ExtendUser>;

export const useUserStore = defineEntityStore<User, ExtendUser>(
  'userStore',
  {},
  {
    service: {
      getAll: (params) => getServices().users.getAll(params),
      getById: (id) => getServices().users.getById(id),
      create: (data) => getServices().users.create(data),
      update: (id, data) => getServices().users.update(id, data),
      remove: (id) => getServices().users.delete(id),
    },
  }
);

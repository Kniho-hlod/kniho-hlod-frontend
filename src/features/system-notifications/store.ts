import { getServices } from '@kniho-hlod/kniho-hlod-service';
import { defineEntityStore } from '@/stores/entity-store';
import type { SystemNotification } from '@/types/entities';
import type { CreateExtendedEntity } from '@/types/store-definition';

type ExtendSystemNotification = {};

export type ExtendedSystemNotification = CreateExtendedEntity<SystemNotification, ExtendSystemNotification>;

export const useSystemNotificationStore = defineEntityStore<SystemNotification, ExtendSystemNotification>(
  'systemNotificationStore',
  {},
  {
    service: {
      getAll: (params) => getServices().systemNotifications.getAll(params),
      getById: (id) => getServices().systemNotifications.getById(id),
      create: (data) => getServices().systemNotifications.create(data),
      update: (id, data) => getServices().systemNotifications.update(id, data),
      remove: (id) => getServices().systemNotifications.delete(id),
    },
  }
);

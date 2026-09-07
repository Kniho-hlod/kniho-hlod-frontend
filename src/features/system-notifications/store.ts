import { getServices } from '@kniho-hlod/kniho-hlod-service';
import { defineEntityStore } from '@/stores/entity-store';
import type { SystemNotification, CreateSystemNotificationDto, UpdateSystemNotificationDto } from '@/types/entities';
import type { CreateExtendedEntity } from '@/types/store-definition';

type ExtendSystemNotification = {};

export type ExtendedSystemNotification = CreateExtendedEntity<SystemNotification, ExtendSystemNotification>;

export const useSystemNotificationStore = defineEntityStore<
  SystemNotification,
  ExtendSystemNotification,
  CreateSystemNotificationDto,
  UpdateSystemNotificationDto
>(
  'systemNotificationStore',
  {},
  () => getServices().systemNotifications
);

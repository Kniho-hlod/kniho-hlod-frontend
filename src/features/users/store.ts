import { getServices } from '@kniho-hlod/kniho-hlod-service';
import { defineEntityStore } from '@/stores/entity-store';
import type { User, CreateUserDto } from '@/types/entities';
import type { CreateExtendedEntity } from '@/types/store-definition';

type ExtendUser = {};

export type ExtendedUser = CreateExtendedEntity<User, ExtendUser>;

export const useUserStore = defineEntityStore<User, ExtendUser, CreateUserDto>(
  'userStore',
  {},
  () => getServices().users
);

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import type {
  BaseEntity,
  CreateExtendedEntity,
  EntityExtension,
  EntityStoreConfig,
  PaginationParams,
} from '@/types/store-definition';

export function defineEntityStore<
  TEntity extends BaseEntity,
  TExtend = {},
  TCreate = TEntity,
  TUpdate = Partial<TCreate>,
>(
  storeName: string,
  extensions: { [K in keyof TExtend]: EntityExtension<TEntity, TExtend[K]> } = {} as {
    [K in keyof TExtend]: EntityExtension<TEntity, TExtend[K]>;
  },
  config: EntityStoreConfig<TEntity, TCreate, TUpdate>,
) {
  return defineStore(storeName, () => {
    const rawEntitiesMap = ref(new Map<string, TEntity>()) as Ref<Map<string, TEntity>>;
    const error = ref<string | null>(null);
    const isLoading = ref(false);
    const total = ref(0);

    function extendEntity(entity: TEntity): CreateExtendedEntity<TEntity, TExtend> {
      const extended = { ...entity } as CreateExtendedEntity<TEntity, TExtend>;
      for (const [key, extendFn] of Object.entries(extensions) as [
        string,
        EntityExtension<TEntity, unknown>,
      ][]) {
        try {
          (extended as Record<string, unknown>)[key] = extendFn(entity);
        } catch (err) {
          console.error(`Error extending entity ${entity.id} with ${key}:`, err);
        }
      }
      return extended;
    }

    const entities = computed<Array<CreateExtendedEntity<TEntity, TExtend>>>(() => {
      return Array.from(rawEntitiesMap.value.values()).map((entity) => extendEntity(entity));
    });

    async function fetchEntities(params?: PaginationParams): Promise<void> {
      error.value = null;
      isLoading.value = true;
      try {
        const response = await config.service.getAll(params);
        rawEntitiesMap.value = new Map(response.data.map((e) => [e.id, e]));
        total.value = response.total;
      } catch (err) {
        error.value = err instanceof Error ? err.message : String(err);
      } finally {
        isLoading.value = false;
      }
    }

    async function getEntity(
      id: string,
    ): Promise<CreateExtendedEntity<TEntity, TExtend> | null> {
      if (!config.service.getById) return null;
      error.value = null;
      isLoading.value = true;
      try {
        const entity = await config.service.getById(id);
        rawEntitiesMap.value.set(entity.id, entity);
        return extendEntity(entity);
      } catch (err) {
        error.value = err instanceof Error ? err.message : String(err);
        return null;
      } finally {
        isLoading.value = false;
      }
    }

    function getRawEntity(id: string): TEntity | null {
      return rawEntitiesMap.value.get(id) ?? null;
    }

    async function saveEntity(
      entityData: TCreate & { id?: string },
    ): Promise<CreateExtendedEntity<TEntity, TExtend> | undefined> {
      error.value = null;
      isLoading.value = true;
      try {
        let saved: TEntity;
        if (entityData.id) {
          if (!config.service.update) throw new Error('update not supported by this service');
          saved = await config.service.update(entityData.id, entityData as unknown as TUpdate);
        } else {
          if (!config.service.create) throw new Error('create not supported by this service');
          saved = await config.service.create(entityData);
        }
        rawEntitiesMap.value.set(saved.id, saved);
        return extendEntity(saved);
      } catch (err) {
        error.value = err instanceof Error ? err.message : String(err);
        return undefined;
      } finally {
        isLoading.value = false;
      }
    }

    async function deleteEntity(id: string): Promise<boolean> {
      if (!config.service.remove) return false;
      error.value = null;
      isLoading.value = true;
      try {
        await config.service.remove(id);
        rawEntitiesMap.value.delete(id);
        return true;
      } catch (err) {
        error.value = err instanceof Error ? err.message : String(err);
        return false;
      } finally {
        isLoading.value = false;
      }
    }

    return {
      entities,
      error,
      isLoading,
      total,
      fetchEntities,
      getEntity,
      getRawEntity,
      saveEntity,
      deleteEntity,
      getOrFetchEntity: async (id: string) => {
        const cached = rawEntitiesMap.value.get(id);
        return cached ? extendEntity(cached) : await getEntity(id);
      },
      refreshEntity: async (id: string) => await getEntity(id),
    };
  });
}

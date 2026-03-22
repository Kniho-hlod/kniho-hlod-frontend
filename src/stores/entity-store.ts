import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
  BaseEntity,
  CreateExtendedEntity,
  EntityExtension,
  EntityStoreConfig,
} from '@/types/store-definition';

export function defineEntityStore<TEntity extends BaseEntity, TExtend = {}>(
  storeName: string,
  extensions: { [K in keyof TExtend]: EntityExtension<TEntity, TExtend[K]> } = {} as any,
  config: EntityStoreConfig
) {
  return defineStore(storeName, () => {
    const rawEntitiesMap = ref(new Map<string, TEntity>());
    const error = ref<string | null>(null);
    const isLoading = ref(false);

    function extendEntity(entity: TEntity): CreateExtendedEntity<TEntity, TExtend> {
      const extended = { ...entity } as CreateExtendedEntity<TEntity, TExtend>;
      for (const [key, extendFn] of Object.entries(extensions)) {
        try {
          (extended as any)[key] = (extendFn as any)(entity);
        } catch (err) {
          console.error(`Error extending entity ${entity.id} with ${key}:`, err);
        }
      }
      return extended;
    }

    const entities = computed<Array<CreateExtendedEntity<TEntity, TExtend>>>(() => {
      return Array.from(rawEntitiesMap.value.values()).map((entity) =>
        extendEntity(entity as TEntity)
      );
    });

    async function fetchEntities() {
      error.value = null;
      isLoading.value = true;
      try {
        const data = (await config.service.getAll()) as TEntity[];
        rawEntitiesMap.value = new Map(data.map((e) => [e.id, e]));
      } catch (err) {
        error.value = (err as Error).message;
      } finally {
        isLoading.value = false;
      }
    }

    async function getEntity(id: string): Promise<CreateExtendedEntity<TEntity, TExtend> | null> {
      if (!config.service.getById) return null;
      error.value = null;
      isLoading.value = true;
      try {
        const entity = (await config.service.getById(id)) as TEntity;
        rawEntitiesMap.value.set(entity.id, entity);
        return extendEntity(entity);
      } catch (err) {
        error.value = (err as Error).message;
        return null;
      } finally {
        isLoading.value = false;
      }
    }

    function getRawEntity(id: string): TEntity | null {
      return (rawEntitiesMap.value.get(id) as TEntity) ?? null;
    }

    async function saveEntity(
      entityData: TEntity
    ): Promise<CreateExtendedEntity<TEntity, TExtend> | undefined> {
      error.value = null;
      isLoading.value = true;
      try {
        let saved: TEntity;
        if (entityData.id) {
          if (!config.service.update) throw new Error('update not supported by this service');
          saved = (await config.service.update(entityData.id, entityData)) as TEntity;
        } else {
          if (!config.service.create) throw new Error('create not supported by this service');
          saved = (await config.service.create(entityData)) as TEntity;
        }
        rawEntitiesMap.value.set(saved.id, saved);
        return extendEntity(saved);
      } catch (err) {
        error.value = (err as Error).message;
        return undefined;
      } finally {
        isLoading.value = false;
      }
    }

    async function deleteEntity(id: string) {
      if (!config.service.remove) return false;
      error.value = null;
      isLoading.value = true;
      try {
        await config.service.remove(id);
        rawEntitiesMap.value.delete(id);
        return true;
      } catch (err) {
        error.value = (err as Error).message;
        return false;
      } finally {
        isLoading.value = false;
      }
    }

    return {
      entities,
      error,
      isLoading,
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

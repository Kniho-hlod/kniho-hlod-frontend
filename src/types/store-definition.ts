// Base entity interface
export interface BaseEntity {
  id: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// Type to create extended entities with additional properties
export type CreateExtendedEntity<TEntity, TExtend = {}> = TEntity & TExtend;

// Type for extension function that resolves related entities
export type EntityExtension<TEntity, TResult> = (entity: TEntity) => TResult;

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface EntityServiceAdapter<TDto, TCreate = TDto, TUpdate = Partial<TCreate>> {
  getAll: (params?: PaginationParams) => Promise<{ data: TDto[]; total: number }>;
  getById?: (id: string) => Promise<TDto>;
  create?: (data: TCreate) => Promise<TDto>;
  update?: (id: string, data: TUpdate) => Promise<TDto>;
  remove?: (id: string) => Promise<void>;
}

export interface EntityStoreConfig<TDto, TCreate = TDto, TUpdate = Partial<TCreate>> {
  service: EntityServiceAdapter<TDto, TCreate, TUpdate>;
}

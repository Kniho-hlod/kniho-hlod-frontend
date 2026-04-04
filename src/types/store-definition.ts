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

export interface EntityServiceAdapter {
  getAll: (params?: PaginationParams) => Promise<{ data: any[]; total: number }>;
  getById?: (id: string) => Promise<any>;
  create?: (data: any) => Promise<any>;
  update?: (id: string, data: any) => Promise<any>;
  remove?: (id: string) => Promise<void>;
}

export interface EntityStoreConfig {
  service: EntityServiceAdapter;
}

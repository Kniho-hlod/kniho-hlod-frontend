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

/**
 * The slice of a generated entity service the store calls. `defineEntityStore` takes a getter for
 * one of these — pass `() => getServices().books` directly instead of hand-wrapping each method.
 * Every method is optional: a plain CRUD service supplies all of them, a read-only one supplies
 * `getAll` only, and an `extend`-ed service (typed loosely by entity-core as `{ [k]: any } & …`)
 * still structurally matches. The store guards each method before calling it.
 */
export interface EntityStoreService<TDto, TCreate = TDto, TUpdate = Partial<TCreate>> {
  getAll?(params?: PaginationParams): Promise<{ data: TDto[]; total: number }>;
  getById?(id: string): Promise<TDto>;
  create?(data: TCreate): Promise<TDto>;
  update?(id: string, data: TUpdate): Promise<TDto>;
  delete?(id: string): Promise<void>;
  // `extend`-ed services are typed by entity-core as `{ [k]: any } & { <custom methods> }`; the
  // index signature lets them match here without the weak-type check tripping.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [extra: string]: any;
}

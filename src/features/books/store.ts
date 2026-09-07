import { getServices } from '@kniho-hlod/kniho-hlod-service';
import { defineEntityStore } from '@/stores/entity-store';
import type { Book } from '@/types/entities';
import type { CreateExtendedEntity } from '@/types/store-definition';

type ExtendBook = {};

export type ExtendedBook = CreateExtendedEntity<Book, ExtendBook>;

export const useBookStore = defineEntityStore<Book, ExtendBook>(
  'bookStore',
  {},
  () => getServices().books
);

export function getAllBooks(): Array<ExtendedBook> {
  return useBookStore().entities;
}

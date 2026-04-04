export const BOOK_FILTER = {
  ALL: 'all',
  AVAILABLE: 'available',
  LENT: 'lent',
} as const;
export type BookFilter = (typeof BOOK_FILTER)[keyof typeof BOOK_FILTER];

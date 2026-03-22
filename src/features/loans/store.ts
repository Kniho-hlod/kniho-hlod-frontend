import { getServices } from '@eleansphere/kniho-hlod-service';
import { defineEntityStore } from '@/stores/entity-store';
import type { Book, Loan, User } from '@/types/entities';
import type { CreateExtendedEntity } from '@/types/store-definition';
import { useBookStore } from '@/features/books/store';
import { useUserStore } from '@/features/users/store';
import { authorizationStore } from '@/stores/authorization-store';
import { sortBy } from '@/shared/utils/date';

type ExtendLoan = {
  userEntity: User | null;
  bookEntity: Book | null;
};

export type ExtendedLoan = CreateExtendedEntity<Loan, ExtendLoan>;

export const useLoanStore = defineEntityStore<Loan, ExtendLoan>(
  'loanStore',
  {
    userEntity(target) {
      const userStore = useUserStore();
      return userStore.getRawEntity(target.ownerId) ?? null;
    },
    bookEntity(target) {
      const bookStore = useBookStore();
      return bookStore.getRawEntity(target.bookId) ?? null;
    },
  },
  {
    service: {
      getAll: () => getServices().loans.getAll(),
      getById: (id) => getServices().loans.getById(id),
      create: (data) => getServices().loans.create(data),
      update: (id, data) => getServices().loans.update(id, data),
      remove: (id) => getServices().loans.delete(id),
    },
  }
);

export function getAllLoans(userId: string): Array<ExtendedLoan> {
  const store = useLoanStore();
  return store.entities.filter((loan) => loan.ownerId === userId);
}

export function getActiveLoans(userId: string): Array<ExtendedLoan> {
  const store = useLoanStore();
  return store.entities.filter((loan) => loan.ownerId === userId && !loan.isReturned);
}

export function getLatestLoan(): ExtendedLoan {
  const { loggedUser } = authorizationStore();
  const activeLoans = getActiveLoans(loggedUser!.id);
  return sortBy(activeLoans, 'createdAt')[0];
}

export function getEarliestLoanReturn(): ExtendedLoan {
  const { loggedUser } = authorizationStore();
  const activeLoans = getActiveLoans(loggedUser!.id);
  return sortBy(activeLoans, 'returnDate')[0];
}

export function getOverdueLoans(userId: string): ExtendedLoan[] {
  const store = useLoanStore();
  const today = new Date();
  return store.entities.filter(
    (loan) =>
      loan.ownerId === userId &&
      !loan.isReturned &&
      loan.returnDate != null &&
      new Date(loan.returnDate) < today,
  );
}

export function getLoansForBook(bookId: string): ExtendedLoan[] {
  const store = useLoanStore();
  return store.entities.filter((loan) => loan.bookId === bookId);
}

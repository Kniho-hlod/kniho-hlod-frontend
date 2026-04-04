import { authorizationStore } from '@/stores/authorization-store';
import {
  getEarliestLoanReturn,
  getLatestLoan,
  getOverdueLoans,
  type ExtendedLoan,
} from '@/features/loans/store';
import { computed } from 'vue';

const { loggedUser } = authorizationStore();

export const overdueLoans = computed<ExtendedLoan[]>(() => {
  return getOverdueLoans();
});

export const lastBorrowedBook = computed<ExtendedLoan>(() => {
  return getLatestLoan();
});

export const earliestLoanReturn = computed<ExtendedLoan>(() => {
  return getEarliestLoanReturn();
});

export const LOAN_STATUS = {
  ACTIVE: 'active',
  OVERDUE: 'overdue',
  RETURNED: 'returned',
} as const;
export type LoanStatus = (typeof LOAN_STATUS)[keyof typeof LOAN_STATUS];

export const LOAN_TAB = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
} as const;
export type LoanTab = (typeof LOAN_TAB)[keyof typeof LOAN_TAB];

export const MS_PER_DAY = 86_400_000;

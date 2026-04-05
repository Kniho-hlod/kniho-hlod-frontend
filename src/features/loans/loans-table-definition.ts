import type { TableColumnDefinition } from '@/shared/components/table/types';
import type { ExtendedLoan } from '@/features/loans/store';
import { computed } from 'vue';

export function getTabsDefinition(active: Array<ExtendedLoan>, archived: Array<ExtendedLoan>) {
  const TABS = computed(() => [
    { title: 'Aktivní', value: '0', content: active, icon: 'pi pi-calendar-plus' },
    { title: 'Vrácené', value: '1', content: archived, icon: 'pi pi-history' },
  ]);
  return TABS.value;
}

export const TABLE_DEFINITION: Array<TableColumnDefinition> = [
  { field: ['bookEntity', 'title'], header: 'Kniha', type: 'text' },
  { field: ['borrower'], header: 'Vypůjčil si', type: 'text' },
  { field: ['loanDate'], header: 'Datum vypůjčení', type: 'date' },
  { field: ['returnDate'], header: 'Datum vrácení', type: 'date' },
  { field: ['isReturned'], header: 'Vrácena', type: 'boolean' },
];

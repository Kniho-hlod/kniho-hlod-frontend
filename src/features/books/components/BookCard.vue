<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ExtendedBook } from '@/features/books/store';
import { getLoansForBook } from '@/features/loans/store';
import { MS_PER_DAY } from '@/features/loans/constants';
import { BOOK_AVAILABILITY_SEVERITY } from '@/shared/utils/constants/severity';
import GenericCard from '@/shared/components/card/GenericCard.vue';
import type { CardBadge } from '@/shared/components/card/types';
import { usePermissions } from '@/shared/composables/use-permissions';
import { USER_ROLE } from '@/features/users/constants';

const props = defineProps<{
  book: ExtendedBook;
}>();

const emit = defineEmits<{
  edit: [book: ExtendedBook];
  delete: [book: ExtendedBook];
}>();

const { t } = useI18n();
const { isAllowed } = usePermissions();

const activeLoan = computed(() => {
  const loans = getLoansForBook(props.book.id);
  return loans.find((l) => !l.isReturned) ?? null;
});

const isOverdue = computed(() => {
  if (!activeLoan.value?.returnDate) return false;
  return new Date(activeLoan.value.returnDate) < new Date();
});

const overdueDays = computed(() => {
  if (!activeLoan.value?.returnDate) return 0;
  return Math.floor((Date.now() - new Date(activeLoan.value.returnDate).getTime()) / MS_PER_DAY);
});

const actions = computed(() => [
  { icon: 'pi pi-info-circle', severity: 'secondary' as const, onClick: () => emit('edit', props.book), visible: isAllowed([USER_ROLE.ADMIN, USER_ROLE.USER]) },
  { icon: 'pi pi-trash', severity: 'danger' as const, onClick: () => emit('delete', props.book), visible: isAllowed([USER_ROLE.ADMIN]) || (isAllowed([USER_ROLE.USER]) && !activeLoan.value) },
]);

const badge = computed<CardBadge>(() => {
  if (!activeLoan.value) {
    return { label: t('status.available'), severity: BOOK_AVAILABILITY_SEVERITY.available };
  }
  if (isOverdue.value) {
    return {
      label: t('status.overdue', { days: overdueDays.value }),
      severity: BOOK_AVAILABILITY_SEVERITY.overdue,
      icon: 'pi pi-exclamation-triangle',
    };
  }
  return {
    label: t('books.loanedTo', { name: activeLoan.value.borrower }),
    severity: BOOK_AVAILABILITY_SEVERITY.lent,
  };
});
</script>

<template>
  <GenericCard
    :title="book.title"
    :subtitle="book.author"
    icon="pi pi-book"
    :badge="badge"
    :actions="actions"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ExtendedLoan } from '@/features/loans/store';
import { MS_PER_DAY } from '@/features/loans/constants';
import { LOAN_STATUS_SEVERITY } from '@/shared/utils/constants/severity';
import { formatDate } from '@/shared/utils/date';
import GenericCard from '@/shared/components/card/GenericCard.vue';
import type { CardBadge } from '@/shared/components/card/types';

const props = defineProps<{
  loan: ExtendedLoan;
}>();

const emit = defineEmits<{
  detail: [loan: ExtendedLoan];
  delete: [loan: ExtendedLoan];
  markReturned: [loan: ExtendedLoan];
}>();

const { t } = useI18n();

const isOverdue = computed(() => {
  if (props.loan.isReturned || !props.loan.returnDate) return false;
  return new Date(props.loan.returnDate) < new Date();
});

const overdueDays = computed(() => {
  if (!props.loan.returnDate) return 0;
  return Math.floor((Date.now() - new Date(props.loan.returnDate).getTime()) / MS_PER_DAY);
});

const actions = computed(() => [
  {
    icon: 'pi pi-search',
    severity: 'secondary' as const,
    label: t('loans.detail'),
    onClick: () => emit('detail', props.loan),
  },
  {
    icon: 'pi pi-check',
    severity: 'success' as const,
    outlined: false,
    label: t('loans.markReturned'),
    visible: !props.loan.isReturned,
    onClick: () => emit('markReturned', props.loan),
  },
  { icon: 'pi pi-trash', severity: 'danger' as const, onClick: () => emit('delete', props.loan) },
]);

const badge = computed<CardBadge>(() => {
  if (props.loan.isReturned) {
    return { label: t('status.returned'), severity: LOAN_STATUS_SEVERITY.returned };
  }
  if (isOverdue.value) {
    return {
      label: t('status.overdue', { days: overdueDays.value }),
      severity: LOAN_STATUS_SEVERITY.overdue,
      icon: 'pi pi-exclamation-triangle',
    };
  }
  return { label: t('status.active'), severity: LOAN_STATUS_SEVERITY.active };
});
</script>

<template>
  <GenericCard
    :title="loan.bookEntity?.title ?? '—'"
    :subtitle="loan.bookEntity?.author"
    icon="pi pi-book"
    :badge="badge"
    :class="isOverdue ? 'border-red-200 bg-red-50/30' : ''"
    :actions="actions"
  >
    <!-- Borrower -->
    <div class="flex items-center gap-2 text-sm">
      <i class="pi pi-user text-surface-400 text-xs"></i>
      <span class="text-surface-600">{{ loan.borrower }}</span>
    </div>

    <!-- Dates -->
    <div class="grid grid-cols-2 gap-2 text-xs">
      <div class="bg-surface-50 rounded-lg px-3 py-2">
        <p class="text-surface-400 mb-0.5">{{ t('loans.loanDate') }}</p>
        <p class="font-medium text-surface-700">{{ formatDate(String(loan.loanDate)) }}</p>
      </div>
      <div class="rounded-lg px-3 py-2" :class="isOverdue ? 'bg-red-50' : 'bg-surface-50'">
        <p class="text-surface-400 mb-0.5">{{ t('loans.returnDate') }}</p>
        <p class="font-medium" :class="isOverdue ? 'text-red-600' : 'text-surface-700'">
          {{ loan.returnDate ? formatDate(String(loan.returnDate)) : t('loans.noDate') }}
        </p>
      </div>
    </div>
  </GenericCard>
</template>

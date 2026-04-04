<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { ExtendedLoan } from '@/features/loans/store';
import { MS_PER_DAY } from '@/features/loans/constants';
import { formatDate } from '@/shared/utils/date';

defineProps<{
  loan: ExtendedLoan;
}>();

const { t } = useI18n();

function overdueDays(returnDate: Date | string): number {
  return Math.floor((Date.now() - new Date(returnDate).getTime()) / MS_PER_DAY);
}
</script>

<template>
  <div class="text-sm mb-1">
    <span class="font-semibold">{{ loan.bookEntity?.title }}</span>
    &bull; {{ loan.borrower }} &bull;
    {{ formatDate(String(loan.returnDate!)) }}
    <Tag
      :value="t('overview.overdueDays', { days: overdueDays(loan.returnDate!) })"
      severity="danger"
      class="ml-1 !text-xs"
    />
  </div>
</template>

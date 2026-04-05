<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { getOverdueLoans, getUpcomingReturns } from '@/features/loans/store';
import { MS_PER_DAY } from '@/features/loans/constants';
import { formatDate } from '@/shared/utils/date';

const { t } = useI18n();

const overdueLoans = computed(() => getOverdueLoans());
const upcomingLoans = computed(() => getUpcomingReturns(7));

function overdueDays(returnDate: Date | string): number {
  return Math.floor((Date.now() - new Date(returnDate).getTime()) / MS_PER_DAY);
}

function daysLeft(returnDate: Date | string): number {
  return Math.ceil((new Date(returnDate).getTime() - Date.now()) / MS_PER_DAY);
}
</script>

<template>
  <div class="grid gap-6 max-w-2xl">
    <h1 class="text-2xl font-bold text-surface-800">{{ t('notifications.title') }}</h1>

    <!-- Overdue loans -->
    <section>
      <h2 class="text-base font-semibold text-surface-700 mb-3 flex items-center gap-2">
        <i class="pi pi-exclamation-triangle text-red-500"></i>
        {{ t('notifications.overdueTitle') }}
        <span
          v-if="overdueLoans.length"
          class="bg-red-500 text-white text-xs rounded-full px-2 py-0.5"
        >
          {{ overdueLoans.length }}
        </span>
      </h2>

      <p v-if="overdueLoans.length === 0" class="text-surface-400 text-sm">
        {{ t('notifications.noneOverdue') }}
      </p>

      <div v-else class="flex flex-col gap-2">
        <div
          v-for="loan in overdueLoans"
          :key="loan.id"
          class="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-4 py-3 dark:bg-red-950/30 dark:border-red-800/40"
        >
          <div>
            <p class="font-medium text-surface-800 text-sm">{{ loan.bookEntity?.title }}</p>
            <p class="text-surface-500 text-xs mt-0.5">
              {{ loan.borrower }} &bull; {{ t('loans.returnDate') }}: {{ formatDate(String(loan.returnDate)) }}
            </p>
          </div>
          <Tag
            :value="t('notifications.daysOverdue', { days: overdueDays(loan.returnDate!) })"
            severity="danger"
            class="shrink-0"
          />
        </div>
      </div>
    </section>

    <!-- Upcoming returns -->
    <section>
      <h2 class="text-base font-semibold text-surface-700 mb-1 flex items-center gap-2">
        <i class="pi pi-calendar-clock text-amber-500"></i>
        {{ t('notifications.upcomingTitle') }}
      </h2>
      <p class="text-surface-400 text-xs mb-3">{{ t('notifications.upcomingSubtitle') }}</p>

      <p v-if="upcomingLoans.length === 0" class="text-surface-400 text-sm">
        {{ t('notifications.noneUpcoming') }}
      </p>

      <div v-else class="flex flex-col gap-2">
        <div
          v-for="loan in upcomingLoans"
          :key="loan.id"
          class="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 dark:bg-amber-950/20 dark:border-amber-700/40"
        >
          <div>
            <p class="font-medium text-surface-800 text-sm">{{ loan.bookEntity?.title }}</p>
            <p class="text-surface-500 text-xs mt-0.5">
              {{ loan.borrower }} &bull; {{ t('loans.returnDate') }}: {{ formatDate(String(loan.returnDate)) }}
            </p>
          </div>
          <Tag
            :value="t('notifications.daysLeft', { days: daysLeft(loan.returnDate!) })"
            severity="warn"
            class="shrink-0"
          />
        </div>
      </div>
    </section>
  </div>
</template>

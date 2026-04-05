<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatDate } from '@/shared/utils/date';
import StatCard from '@/features/overview/components/StatCard.vue';
import OverdueCard from '@/features/overview/components/OverdueCard.vue';
import InfoCard from '@/features/overview/components/InfoCard.vue';
import { authorizationStore } from '@/stores/authorization-store';
import { getActiveLoans, getOverdueLoans, getLatestLoan, getEarliestLoanReturn } from '@/features/loans/store';
import { getAllBooks } from '@/features/books/store';

const { t } = useI18n();
const { loggedUser } = authorizationStore();
const haveLoans = computed(() => Boolean(getActiveLoans().length));
const overdueLoans = computed(() => getOverdueLoans());
const lastBorrowedBook = computed(() => getLatestLoan());
const earliestLoanReturn = computed(() => getEarliestLoanReturn());

const overviewStats = computed(() => [
  {
    label: t('overview.statBooks'),
    color: 'var(--p-primary-500)',
    value: getAllBooks().length,
    icon: 'pi pi-book',
    to: '/home/books',
  },
  {
    label: t('overview.statActiveLoans'),
    color: 'var(--p-primary-400)',
    value: getActiveLoans().length,
    icon: 'pi pi-address-book',
    to: '/home/loans',
  },
  {
    label: t('overview.statOverdue'),
    color: 'var(--p-red-500)',
    value: getOverdueLoans().length,
    icon: 'pi pi-exclamation-triangle',
  },
]);
</script>

<template>
  <div class="grid gap-6">
    <div>
      <h2 class="text-2xl font-bold text-surface-800 mb-1">
        {{ t('overview.welcome', { name: loggedUser?.username }) }}
      </h2>
      <p class="text-surface-500 text-sm">{{ t('overview.subtitle') }}</p>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        v-for="stat in overviewStats"
        :key="stat.label"
        :label="stat.label"
        :value="stat.value"
        :color="stat.color"
        :icon="stat.icon"
        :to="stat.to"
      />
    </div>

    <!-- Overdue alert -->
    <Message v-if="overdueLoans.length > 0" severity="error" :closable="false">
      <template #icon>
        <i class="pi pi-exclamation-triangle" />
      </template>
      <div>
        <p class="font-semibold mb-2">{{ t('overview.overdueTitle') }}</p>
        <OverdueCard v-for="loan in overdueLoans" :key="loan.id" :loan="loan" />
      </div>
    </Message>

    <!-- Info cards -->
    <div v-if="haveLoans" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoCard
        v-if="lastBorrowedBook"
        :title-key="t('overview.lastBorrowed')"
        icon="pi pi-book"
        :book-title="lastBorrowedBook.bookEntity?.title ?? ''"
        :borrower="t('overview.lentTo', { name: lastBorrowedBook.borrower })"
        :date="formatDate(String(lastBorrowedBook.loanDate))"
        :date-label="t('loans.loanDate')"
      />

      <InfoCard
        v-if="earliestLoanReturn"
        :title-key="t('overview.earliestReturn')"
        icon="pi pi-calendar-clock"
        :book-title="earliestLoanReturn.bookEntity?.title ?? ''"
        :borrower="t('overview.lentTo', { name: earliestLoanReturn.borrower })"
        :date="formatDate(String(earliestLoanReturn.returnDate))"
        :date-label="t('loans.returnDate')"
      />
    </div>

    <div v-if="!haveLoans" class="bg-surface-0 rounded-xl p-6 text-center text-surface-400">
      <i class="pi pi-book text-4xl mb-3 block text-surface-200"></i>
      <p class="font-medium">{{ t('overview.empty') }}</p>
    </div>
  </div>
</template>

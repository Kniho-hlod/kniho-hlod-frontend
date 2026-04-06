<script setup lang="ts">
import { loanForm } from '@/features/loans/loans-form-definition';
import { authorizationStore } from '@/stores/authorization-store';
import { useBookStore } from '@/features/books/store';
import { getActiveLoans, useLoanStore, type ExtendedLoan } from '@/features/loans/store';
import { Loan } from '@/types/entities';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { FormDefinition } from '@/shared/components/form/types';
import { useFormDialog } from '@/shared/composables/use-form-dialog';
import { useConfirmDialog } from '@/shared/composables/use-confirm-dialog';
import LoanCard from '@/features/loans/components/LoanCard.vue';
import { LOAN_TAB, type LoanTab } from '@/features/loans/constants';
import { usePagination } from '@/shared/composables/use-pagination';
import FabButton from '@/shared/components/FabButton.vue';
import { useFabScroll } from '@/shared/composables/use-fab-scroll';

const { t } = useI18n();
const store = useLoanStore();
const { loggedUser } = authorizationStore();

const activeLoans = computed<Array<ExtendedLoan>>(() => getActiveLoans());

const archivedLoans = computed<Array<ExtendedLoan>>(() =>
  store.entities.filter((loan) => loan.isReturned)
);

const bookStore = useBookStore();

const availableBooks = computed(() =>
  bookStore.entities
    .filter(
      (book) =>
        book.ownerId === loggedUser?.id && !store.entities.some((loan) => loan.bookId === book.id && !loan.isReturned)
    )
    .map((book) => ({ label: book.title, value: book.id }))
);

const editedLoanForm = computed<FormDefinition<Loan>>(() => ({
  ...loanForm,
  fields: [
    {
      name: 'bookId',
      label: t('loans.bookLabel'),
      type: 'select',
      required: true,
      placeholder: t('loans.selectBook'),
      options: availableBooks.value,
      colClass: 'col-span-2',
    },
    ...loanForm.fields,
  ],
}));

const { openFormDialog } = useFormDialog();

function openDialog(data?: ExtendedLoan): void {
  openFormDialog({
    definition: editedLoanForm.value,
    modelValue: data ?? new Loan(),
    onSave: async (content) => {
      await store.saveEntity({ ...content, ownerId: loggedUser!.id });
    },
    mode: data ? 'view' : 'create',
    header: data ? t('loans.detailTitle', { id: data.id }) : t('loans.new'),
  });
}

const { confirmDelete } = useConfirmDialog();

function deleteLoan(loan: ExtendedLoan): void {
  confirmDelete({
    text: t('loans.deleteConfirm'),
    handleConfirmCallback: async () => {
      await store.deleteEntity(loan.id);
    },
  });
}

function markAsReturned(loan: ExtendedLoan): void {
  if (!loan) return;
  store.saveEntity({ ...loan, isReturned: true });
}

const activeTab = ref<LoanTab>(LOAN_TAB.ACTIVE);

const searchQuery = ref('');

const filteredActiveLoans = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return activeLoans.value;
  return activeLoans.value.filter(
    (l) =>
      l.borrower?.toLowerCase().includes(q) ||
      l.bookEntity?.title?.toLowerCase().includes(q)
  );
});

const filteredArchivedLoans = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return archivedLoans.value;
  return archivedLoans.value.filter(
    (l) =>
      l.borrower?.toLowerCase().includes(q) ||
      l.bookEntity?.title?.toLowerCase().includes(q)
  );
});

const {
  paginated: pagedActiveLoans,
  total: totalActive,
  first: firstActive,
  onPageChange: onActivePageChange,
  reset: resetActive,
} = usePagination(() => filteredActiveLoans.value);

const {
  paginated: pagedArchivedLoans,
  total: totalArchived,
  first: firstArchived,
  onPageChange: onArchivedPageChange,
  reset: resetArchived,
} = usePagination(() => filteredArchivedLoans.value);

const { isVisible } = useFabScroll();

watch([searchQuery, activeTab], () => {
  resetActive();
  resetArchived();
});

const currentTab = computed(() =>
  activeTab.value === LOAN_TAB.ACTIVE
    ? {
        loans: pagedActiveLoans.value,
        total: totalActive.value,
        first: firstActive.value,
        onPageChange: onActivePageChange,
        empty: t('loans.emptyActive'),
        emptyIcon: 'pi pi-check-circle',
      }
    : {
        loans: pagedArchivedLoans.value,
        total: totalArchived.value,
        first: firstArchived.value,
        onPageChange: onArchivedPageChange,
        empty: t('loans.emptyArchived'),
        emptyIcon: 'pi pi-inbox',
      }
);
</script>

<template>
  <div class="grid gap-4">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <h1 class="text-2xl font-bold text-surface-800">{{ t('loans.title') }}</h1>
      <Button
        :label="t('loans.new')"
        icon="pi pi-plus"
        size="small"
        class="hidden lg:block self-start"
        @click="openDialog()"
      />
    </div>

    <!-- Search -->
    <div class="relative">
      <i class="pi pi-search absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none"></i>
      <InputText
        v-model="searchQuery"
        :placeholder="t('loans.searchPlaceholder')"
        fluid
      />
    </div>

    <!-- Tabs -->
    <div class="flex gap-2">
      <button
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all border"
        :class="
          activeTab === LOAN_TAB.ACTIVE
            ? 'bg-primary-500 text-white border-primary-500'
            : 'bg-surface-0 text-surface-600 border-surface-200 hover:bg-surface-50'
        "
        @click="activeTab = LOAN_TAB.ACTIVE"
      >
        <i class="pi pi-calendar-plus mr-1.5"></i>
        {{ t('loans.tabActive') }}
        <span
          v-if="activeLoans.length"
          class="ml-1.5 text-xs px-1.5 py-0.5 rounded-full"
          :class="
            activeTab === LOAN_TAB.ACTIVE
              ? 'bg-white/25 text-white'
              : 'bg-primary-100 text-primary-700'
          "
        >
          {{ activeLoans.length }}
        </span>
      </button>
      <button
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all border"
        :class="
          activeTab === LOAN_TAB.ARCHIVED
            ? 'bg-primary-500 text-white border-primary-500'
            : 'bg-surface-0 text-surface-600 border-surface-200 hover:bg-surface-50'
        "
        @click="activeTab = LOAN_TAB.ARCHIVED"
      >
        <i class="pi pi-history mr-1.5"></i>
        {{ t('loans.tabArchived') }}
      </button>
    </div>

    <!-- Loan cards -->
    <div v-if="currentTab.loans.length === 0" class="text-center py-12 text-surface-400">
      <i :class="currentTab.emptyIcon" class="text-4xl mb-3 block text-surface-200"></i>
      <p>{{ currentTab.empty }}</p>
    </div>
    <Card v-else>
      <template #content>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <LoanCard
            v-for="loan in currentTab.loans"
            :key="loan.id"
            :loan="loan"
            @detail="openDialog(loan)"
            @delete="deleteLoan(loan)"
            @mark-returned="markAsReturned(loan)"
          />
        </div>
        <template v-if="currentTab.total > 12">
          <Divider />
          <Paginator
            :first="currentTab.first"
            :rows="12"
            :total-records="currentTab.total"
            :rows-per-page-options="[12, 24, 48]"
            @page="currentTab.onPageChange"
          />
        </template>
      </template>
    </Card>

    <FabButton :visible="isVisible" @click="openDialog()" />
  </div>
</template>

<script setup lang="ts">
import { loanForm } from '@/features/loans/loans-form-definition';
import { authorizationStore } from '@/stores/authorization-store';
import { useBookStore } from '@/features/books/store';
import { getActiveLoans, useLoanStore, type ExtendedLoan } from '@/features/loans/store';
import { Loan } from '@/types/entities';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { FormDefinition } from '@/shared/components/form/types';
import { useFormDialog } from '@/shared/composables/use-form-dialog';
import { useConfirmDialog } from '@/shared/composables/use-confirm-dialog';
import LoanCard from '@/features/loans/components/LoanCard.vue';
import { LOAN_TAB, type LoanTab } from '@/features/loans/constants';

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
        book.ownerId === loggedUser?.id && !store.entities.some((loan) => loan.bookId === book.id)
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

function openDialog(data?: Loan): void {
  openFormDialog({
    definition: editedLoanForm.value,
    modelValue: data ?? new Loan(),
    onSave: async (content) => {
      await store.saveEntity({ ...content, ownerId: loggedUser!.id });
    },
    mode: data ? 'view' : 'create',
    header: data ? t('loans.detailTitle', { id: (data as Loan).id }) : t('loans.new'),
  });
}

const { confirmDelete } = useConfirmDialog();

function deleteLoan(loan: ExtendedLoan) {
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
        class="self-start"
        @click="openDialog()"
      />
    </div>

    <!-- Tabs -->
    <div class="flex gap-2">
      <button
        @click="activeTab = LOAN_TAB.ACTIVE"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all border"
        :class="
          activeTab === LOAN_TAB.ACTIVE
            ? 'bg-primary-500 text-white border-primary-500'
            : 'bg-surface-0 text-surface-600 border-surface-200 hover:bg-surface-50'
        "
      >
        <i class="pi pi-calendar-plus mr-1.5"></i>
        {{ t('loans.tabActive') }}
        <span
          v-if="activeLoans.length"
          class="ml-1.5 text-xs px-1.5 py-0.5 rounded-full"
          :class="activeTab === LOAN_TAB.ACTIVE ? 'bg-white/25 text-white' : 'bg-primary-100 text-primary-700'"
        >
          {{ activeLoans.length }}
        </span>
      </button>
      <button
        @click="activeTab = LOAN_TAB.ARCHIVED"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all border"
        :class="
          activeTab === LOAN_TAB.ARCHIVED
            ? 'bg-primary-500 text-white border-primary-500'
            : 'bg-surface-0 text-surface-600 border-surface-200 hover:bg-surface-50'
        "
      >
        <i class="pi pi-history mr-1.5"></i>
        {{ t('loans.tabArchived') }}
      </button>
    </div>

    <!-- Active loans card grid -->
    <template v-if="activeTab === LOAN_TAB.ACTIVE">
      <div v-if="activeLoans.length === 0" class="text-center py-12 text-surface-400">
        <i class="pi pi-check-circle text-4xl mb-3 block text-surface-200"></i>
        <p>{{ t('loans.emptyActive') }}</p>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <LoanCard
          v-for="loan in activeLoans"
          :key="loan.id"
          :loan="loan"
          @detail="openDialog(loan as unknown as Loan)"
          @delete="deleteLoan(loan)"
          @mark-returned="markAsReturned(loan)"
        />
      </div>
    </template>

    <!-- Archived loans card grid -->
    <template v-if="activeTab === LOAN_TAB.ARCHIVED">
      <div v-if="archivedLoans.length === 0" class="text-center py-12 text-surface-400">
        <i class="pi pi-inbox text-4xl mb-3 block text-surface-200"></i>
        <p>{{ t('loans.emptyArchived') }}</p>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <LoanCard
          v-for="loan in archivedLoans"
          :key="loan.id"
          :loan="loan"
          @detail="openDialog(loan as unknown as Loan)"
          @delete="deleteLoan(loan)"
          @mark-returned="markAsReturned(loan)"
        />
      </div>
    </template>
  </div>
</template>

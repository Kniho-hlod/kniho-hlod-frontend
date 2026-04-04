<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ExtendedBook } from '@/features/books/store';
import { getLoansForBook } from '@/features/loans/store';
import { formatDate } from '@/shared/utils/date';

const props = defineProps<{
  book: ExtendedBook;
}>();

const { t } = useI18n();

const loans = computed(() => getLoansForBook(props.book.id));
</script>

<template>
  <div class="grid gap-5">
    <!-- Book info -->
    <div class="flex gap-3 items-start">
      <div class="w-12 h-12 bg-surface-100 rounded-xl flex items-center justify-center shrink-0">
        <i class="pi pi-book text-surface-500 text-xl"></i>
      </div>
      <div>
        <h3 class="font-bold text-surface-800 text-lg leading-tight">{{ book.title }}</h3>
        <p v-if="book.author" class="text-surface-500 text-sm">{{ book.author }}</p>
        <p v-if="book.publicationYear" class="text-surface-400 text-xs mt-0.5">
          {{ book.publicationYear }}
        </p>
      </div>
    </div>

    <p v-if="book.description" class="text-surface-700 text-sm bg-surface-50 rounded-lg p-3">
      {{ book.description }}
    </p>

    <!-- Borrower History -->
    <div>
      <div class="flex items-center gap-2 mb-3">
        <i class="pi pi-history text-surface-500"></i>
        <span class="font-semibold text-surface-700">{{ t('books.history') }}</span>
      </div>

      <p v-if="loans.length === 0" class="text-surface-400 text-sm italic">
        {{ t('books.noHistory') }}
      </p>

      <div v-else class="grid gap-2">
        <div
          v-for="loan in loans"
          :key="loan.id"
          class="flex items-center justify-between bg-surface-50 rounded-lg px-3 py-2 text-sm"
        >
          <div>
            <span class="font-medium text-surface-700">{{ loan.borrower }}</span>
            <div class="text-surface-400 text-xs mt-0.5">
              {{ formatDate(String(loan.loanDate)) }}
              —
              {{ loan.returnDate ? formatDate(String(loan.returnDate)) : t('books.stillLent') }}
            </div>
          </div>
          <Tag v-if="loan.isReturned" severity="secondary" :value="t('status.returned')" />
          <Tag v-else severity="success" :value="t('status.active')" />
        </div>
      </div>
    </div>
  </div>
</template>

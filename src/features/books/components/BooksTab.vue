<script setup lang="ts">
import { useBookStore, type ExtendedBook } from '@/features/books/store';
import { Book } from '@/types/entities';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { bookForm } from '@/features/books/books-form-definition';
import { useLoanStore } from '@/features/loans/store';
import { useFormDialog } from '@/shared/composables/use-form-dialog';
import { useConfirmDialog } from '@/shared/composables/use-confirm-dialog';
import { authorizationStore } from '@/stores/authorization-store';
import BookCard from '@/features/books/components/BookCard.vue';
import BookDetailDialog from '@/features/books/components/BookDetailDialog.vue';
import { usePreferredDialog } from '@/shared/composables/use-preferred-dialog';
import { BOOK_FILTER, type BookFilter } from '@/features/books/constants';
import { usePagination } from '@/shared/composables/use-pagination';
import FabButton from '@/shared/components/FabButton.vue';
import { useFabScroll } from '@/shared/composables/use-fab-scroll';

const { t } = useI18n();
const store = useBookStore();
const loanStore = useLoanStore();
const { loggedUser } = authorizationStore();

const searchQuery = ref('');
const activeFilter = ref<BookFilter>(BOOK_FILTER.ALL);

const allBooks = computed<Array<ExtendedBook>>(() => {
  return store.entities.filter((book) => book.ownerId === loggedUser?.id);
});

const filteredBooks = computed<Array<ExtendedBook>>(() => {
  let books = allBooks.value;

  if (activeFilter.value === BOOK_FILTER.AVAILABLE) {
    books = books.filter(
      (b) => !loanStore.entities.some((l) => l.bookId === b.id && !l.isReturned)
    );
  } else if (activeFilter.value === BOOK_FILTER.LENT) {
    books = books.filter((b) => loanStore.entities.some((l) => l.bookId === b.id && !l.isReturned));
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    books = books.filter(
      (b) => b.title?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q)
    );
  }

  return books;
});

const { openFormDialog } = useFormDialog();
const dialog = usePreferredDialog();

function openEditDialog(data?: Book): void {
  openFormDialog({
    definition: bookForm,
    modelValue: data ?? { ...new Book() },
    onSave: async (content) => {
      await store.saveEntity({ ...content, ownerId: loggedUser!.id });
    },
    mode: data ? 'view' : 'create',
    header: data ? t('books.editTitle', { title: (data as Book).title }) : t('books.new'),
  });
}

function openDetail(book: ExtendedBook): void {
  dialog.open(
    BookDetailDialog,
    { book },
    {
      modal: true,
      header: t('books.detailTitle', { title: book.title }),
      dialogSize: 'form',
    }
  );
}

const { confirmDelete } = useConfirmDialog();

function deleteBook(data: Book): void {
  confirmDelete({
    text: t('books.deleteConfirm'),
    handleConfirmCallback: async () => {
      await store.deleteEntity(data.id);
    },
  });
}

const filterOptions = computed(() => [
  { label: t('books.filterAll'), value: BOOK_FILTER.ALL },
  { label: t('books.filterAvailable'), value: BOOK_FILTER.AVAILABLE },
  { label: t('books.filterLent'), value: BOOK_FILTER.LENT },
]);

const { paginated: pagedBooks, total, first, onPageChange, reset } = usePagination(() => filteredBooks.value);

const { isVisible } = useFabScroll();

watch([searchQuery, activeFilter], reset);

onMounted(() => {
  store.fetchEntities();
});
</script>

<template>
  <div class="grid gap-4">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <h1 class="text-2xl font-bold text-surface-800">{{ t('books.title') }}</h1>
      <div class="hidden lg:block">
        <Button
          :label="t('books.new')"
          icon="pi pi-plus"
          size="small"
          @click="openEditDialog()"
        />
      </div>
    </div>

    <!-- Search + Filter -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <i
          class="pi pi-search absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none"
        ></i>
        <InputText
          v-model="searchQuery"
          :placeholder="t('books.searchPlaceholder')"
          fluid
        />
      </div>
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="opt in filterOptions"
          :key="opt.value"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all border"
          :class="
            activeFilter === opt.value
              ? 'bg-primary-500 text-white border-primary-500'
              : 'bg-surface-0 text-surface-600 border-surface-200 hover:bg-surface-50'
          "
          @click="activeFilter = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="filteredBooks.length === 0" class="text-center py-12 text-surface-400">
      <i class="pi pi-book text-4xl mb-3 block text-surface-200"></i>
      <p>{{ t('books.empty') }}</p>
    </div>

    <template v-else>
      <!-- Card grid -->
       <Card>
        <template #content>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <BookCard
            v-for="book in pagedBooks"
            :key="book.id"
            :book="book"
            @edit="openDetail"
            @delete="deleteBook"
          />
        </div>
        <Divider />
        <!-- Pagination -->
        <Paginator
        v-if="total > 12"
        :first="first"
        :rows="12"
        :total-records="total"
        :rows-per-page-options="[12, 24, 48]"
        class="mt-2"
        @page="onPageChange"
        />
      </template>
    </Card>
  </template>

    <FabButton :visible="isVisible" @click="openEditDialog()" />
    </div>
</template>
  
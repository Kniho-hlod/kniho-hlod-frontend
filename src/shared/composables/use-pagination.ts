import { ref, computed } from 'vue';

export function usePagination<T>(items: () => T[], defaultPageSize = 12) {
  const first = ref(0);
  const pageSize = ref(defaultPageSize);

  const paginated = computed<T[]>(() => {
    return items().slice(first.value, first.value + pageSize.value);
  });

  const total = computed(() => items().length);

  function onPageChange(event: { first: number; rows: number }) {
    first.value = event.first;
    pageSize.value = event.rows;
  }

  function reset() {
    first.value = 0;
  }

  return { paginated, total, first, pageSize, onPageChange, reset };
}

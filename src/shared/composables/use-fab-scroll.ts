import { ref, onMounted, onUnmounted } from 'vue';

export function useFabScroll() {
  const isVisible = ref(true);
  let lastScrollTop = 0;
  let hideTimeout: ReturnType<typeof setTimeout> | null = null;
  let scrollEl: Element | null = null;

  function onScroll() {
    const current = scrollEl?.scrollTop ?? 0;
    if (current > lastScrollTop) {
      isVisible.value = false;
    }
    lastScrollTop = current;

    if (hideTimeout) clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      isVisible.value = true;
    }, 150);
  }

  onMounted(() => {
    scrollEl = document.querySelector('main');
    scrollEl?.addEventListener('scroll', onScroll, { passive: true });
  });

  onUnmounted(() => {
    scrollEl?.removeEventListener('scroll', onScroll);
    if (hideTimeout) clearTimeout(hideTimeout);
  });

  return { isVisible };
}

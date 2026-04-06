import { ref, onMounted, onUnmounted } from 'vue';

export function useFabScroll() {
  const isVisible = ref(true);
  let lastScrollY = 0;
  let hideTimeout: ReturnType<typeof setTimeout> | null = null;

  function onScroll() {
    const current = window.scrollY;
    if (current > lastScrollY) {
      isVisible.value = false;
    }
    lastScrollY = current;

    if (hideTimeout) clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      isVisible.value = true;
    }, 150);
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll);
    if (hideTimeout) clearTimeout(hideTimeout);
  });

  return { isVisible };
}

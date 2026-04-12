import { onUnmounted, readonly, ref, type Ref } from 'vue';

const MOBILE_BREAKPOINT = 768;

export function useToastPosition(): {toastPosition: Ref<Readonly<"top-right" | "top-center">>} {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

  const toastPosition = ref<'top-right' | 'top-center'>(
    mql.matches ? 'top-center' : 'top-right'
  );

  function onBreakpointChange(e: MediaQueryListEvent): void {
    toastPosition.value = e.matches ? 'top-center' : 'top-right';
  }

  mql.addEventListener('change', onBreakpointChange);

  onUnmounted(() => {
    mql.removeEventListener('change', onBreakpointChange);
  });

  return {
    toastPosition: readonly(toastPosition),
  };
}

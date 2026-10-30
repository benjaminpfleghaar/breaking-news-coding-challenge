import { onMounted, onUnmounted } from "vue";

export function useEventListener<K extends keyof HTMLElementEventMap>(
  target: HTMLElement | Document,
  event: K,
  callback: (e: HTMLElementEventMap[K]) => void,
  isMounted?: boolean,
) {
  const callbackFn = (e: Event) => callback(e as HTMLElementEventMap[K]);

  if (isMounted) {
    target.addEventListener(event, callbackFn);
  } else {
    onMounted(() => target.addEventListener(event, callbackFn));
  }

  onUnmounted(() => target.removeEventListener(event, callbackFn));
}

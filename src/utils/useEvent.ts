import { onMounted, onUnmounted } from "vue";

export function useEventListener<K extends keyof HTMLElementEventMap>(
  target: HTMLElement | Document,
  event: K,
  callback: (e: HTMLElementEventMap[K]) => void,
) {
  const callbackFn = (e: Event) => callback(e as HTMLElementEventMap[K]);

  onMounted(() => target.addEventListener(event, callbackFn));
  onUnmounted(() => target.removeEventListener(event, callbackFn));
}

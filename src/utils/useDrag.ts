import { onWatcherCleanup, ref, type Ref, watchPostEffect } from "vue";

export function useDrag(
  templateRef: Readonly<Ref<HTMLElement | null>>,
  initial: {
    startX: number;
    startY: number;
  },
) {
  const posX = ref(initial.startX);
  const posY = ref(initial.startY);

  watchPostEffect(() => {
    const element = templateRef.value;

    if (!element) {
      return;
    }

    let isDragging = false;
    let elementPosX: number, elementPosY: number;
    let pointerPosX: number, pointerPosY: number;

    function startDrag(e: MouseEvent) {
      isDragging = false;

      pointerPosX = e.clientX;
      pointerPosY = e.clientY;

      elementPosX = posX.value;
      elementPosY = posY.value;

      document.addEventListener("mousemove", moveDrag);
      document.addEventListener("mouseup", stopDrag);
    }

    function moveDrag(e: MouseEvent) {
      isDragging = true;

      posX.value = e.clientX - (pointerPosX - elementPosX);
      posY.value = e.clientY - (pointerPosY - elementPosY);
    }

    function stopDrag() {
      document.removeEventListener("mousemove", moveDrag);
      document.removeEventListener("mouseup", stopDrag);
    }

    function handleClick(e: MouseEvent) {
      if (isDragging) {
        e.preventDefault();
      }

      isDragging = false;
    }

    element.addEventListener("mousedown", startDrag);
    element.addEventListener("click", handleClick);

    onWatcherCleanup(() => {
      stopDrag();

      element.removeEventListener("mousedown", startDrag);
      element.removeEventListener("click", handleClick);
    });
  });

  return { posX, posY };
}

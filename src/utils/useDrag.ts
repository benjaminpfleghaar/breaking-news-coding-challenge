import { useEventListener } from "@/utils/useEvent.ts";

export function useDrag(el: HTMLElement | null) {
  if (!el) {
    return;
  }

  let isDragging = false;
  const element = el;

  let elementPosX: number, elementPosY: number;
  let pointerPosX: number, pointerPosY: number;

  function startDrag(e: MouseEvent) {
    pointerPosX = e.clientX;
    pointerPosY = e.clientY;

    elementPosX = element.offsetLeft;
    elementPosY = element.offsetTop;

    document.addEventListener("mousemove", moveDrag);
    document.addEventListener("mouseup", stopDrag);
  }

  function moveDrag(e: MouseEvent) {
    isDragging = true;

    element.style.left = `${e.clientX - (pointerPosX - elementPosX)}px`;
    element.style.top = `${e.clientY - (pointerPosY - elementPosY)}px`;
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

  useEventListener(element, "mousedown", startDrag, true);
  useEventListener(element, "click", handleClick, true);
}

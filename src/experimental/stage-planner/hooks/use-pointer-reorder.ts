import { useEffect, useRef, useState, type PointerEvent } from "react";

/** Native document listeners keep reordering active while pointer capture retargets events. */
export function usePointerReorder(ids: string[], selector: string, attribute: string, reorder: (from: string, to: string) => void) {
  const [dragging, setDragging] = useState<string | null>(null);
  const active = useRef<{ id: string; y: number; container: Element; pointerId: number } | null>(null);
  const latest = useRef({ ids, reorder });
  latest.current = { ids, reorder };
  useEffect(() => {
    const move = (e: globalThis.PointerEvent) => {
      const drag = active.current;
      if (!drag || e.pointerId !== drag.pointerId) return;
      const direction = e.clientY - drag.y;
      drag.y = e.clientY;
      const target = Array.from(drag.container.querySelectorAll(selector)).find((row) => {
        const box = row.getBoundingClientRect();
        return e.clientY >= box.top && e.clientY <= box.bottom;
      });
      const to = target?.getAttribute(attribute);
      const fromIndex = latest.current.ids.indexOf(drag.id);
      const toIndex = to ? latest.current.ids.indexOf(to) : -1;
      if (to && ((direction > 0 && toIndex > fromIndex) || (direction < 0 && toIndex < fromIndex))) latest.current.reorder(drag.id, to);
      const scroller = drag.container.closest("section")?.lastElementChild;
      if (scroller) {
        const box = scroller.getBoundingClientRect();
        if (e.clientY > box.bottom - 30) scroller.scrollTop += 16;
        else if (e.clientY < box.top + 30) scroller.scrollTop -= 16;
      }
    };
    const end = () => { active.current = null; setDragging(null); };
    document.addEventListener("pointermove", move, true);
    document.addEventListener("pointerup", end, true);
    document.addEventListener("pointercancel", end, true);
    return () => {
      document.removeEventListener("pointermove", move, true);
      document.removeEventListener("pointerup", end, true);
      document.removeEventListener("pointercancel", end, true);
    };
  }, [selector, attribute]);
  const start = (e: PointerEvent<HTMLButtonElement>, id: string, containerSelector: string) => {
    const container = e.currentTarget.closest(containerSelector);
    if (!container) return;
    e.preventDefault();
    container.setPointerCapture(e.pointerId);
    active.current = { id, y: e.clientY, container, pointerId: e.pointerId };
    setDragging(id);
  };
  return { dragging, start };
}
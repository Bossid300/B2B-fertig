import { useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { GRID, STAGE_PX, fitRoomSize, constrainToRoom, snapClamp, type Rect } from "../../lib/hub";

export interface CanvasItem {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  tooltip?: string | undefined;
  content: ReactNode;
  className: string;
}

export interface RoomBounds { w: number; h: number; cut: Rect | null }

interface Drag { id: string; mode: "move" | "resize"; offX: number; offY: number; x: number; y: number; w: number; h: number }

/**
 * Pointer-driven canvas: items snap to the grid and stay inside the bounds.
 * Without `room`, the bounds are the visible container. With `room`, a fixed-size
 * room (px, 1 m = GRID) is drawn and scaled down to fit; pointer math undoes the scale.
 */
export function SnapCanvas({ items, onMove, onDelete, onResize, selectedId, highlightedIds = [], onSelect, room, children, onAdd }: {
  items: CanvasItem[];
  onMove: (id: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
  onResize?: (id: string, w: number, h: number) => void;
  selectedId?: string | null;
  highlightedIds?: string[];
  onSelect?: (id: string | null) => void;
  room?: RoomBounds;
  children?: ReactNode;
  onAdd?: (type: string, point: { x: number; y: number }) => void;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = outer.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBox({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const bounds: RoomBounds = room ?? { w: box.w, h: box.h, cut: null };
  const scale = room && box.w > 0 ? Math.max(0.01, Math.min(1, (box.w - 16) / room.w, (box.h - 16) / room.h)) : 1;
  const ready = bounds.w > 0 && bounds.h > 0;
  const place = (r: Rect) => (ready ? constrainToRoom(r, bounds) : { x: r.x, y: r.y });

  const local = (e: React.PointerEvent) => {
    const r = inner.current?.getBoundingClientRect();
    if (!r) return { px: 0, py: 0 };
    return { px: (e.clientX - r.left) / scale, py: (e.clientY - r.top) / scale };
  };

  const down = (e: React.PointerEvent<HTMLDivElement>, it: CanvasItem) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    onSelect?.(it.id);
    const { px, py } = local(e);
    const mode = target.closest("[data-resize]") ? "resize" : "move";
    setDrag({ id: it.id, mode, offX: px - (mode === "move" ? it.x : it.x + it.w), offY: py - (mode === "move" ? it.y : it.y + it.h), x: it.x, y: it.y, w: it.w, h: it.h });
  };
  const move = (e: React.PointerEvent) => {
    if (!drag) return;
    const { px, py } = local(e);
    if (drag.mode === "resize") {
      const min = STAGE_PX.min;
      const requested = {
        w: Math.max(min, snapClamp(px - drag.offX - drag.x, Math.min(room ? bounds.w : STAGE_PX.maxW, bounds.w - drag.x))),
        h: Math.max(min, snapClamp(py - drag.offY - drag.y, Math.min(room ? bounds.h : STAGE_PX.maxW, bounds.h - drag.y))),
      };
      const { w, h } = room ? fitRoomSize(requested, bounds) : requested;
      const p = place({ x: drag.x, y: drag.y, w, h });
      if (w !== drag.w || h !== drag.h) {
        setDrag({ ...drag, ...p, w, h });
        onResize?.(drag.id, w, h);
      }
      return;
    }
    const p = place({ x: px - drag.offX, y: py - drag.offY, w: drag.w, h: drag.h });
    if (p.x !== drag.x || p.y !== drag.y) setDrag({ ...drag, ...p });
  };
  const up = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (drag.mode === "resize") onResize?.(drag.id, drag.w, drag.h);
    else onMove(drag.id, drag.x, drag.y);
    setDrag(null);
  };

  // Delete / Backspace removes the selected element unless the user is typing in a field.
  useEffect(() => {
    if (!selectedId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.closest("input, textarea, select, [contenteditable]") || t.isContentEditable)) return;
      e.preventDefault();
      onDelete(selectedId);
      onSelect?.(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, onDelete, onSelect]);

  return (
    <div ref={outer} onPointerDown={() => onSelect?.(null)}
      onDragOver={(e) => { if (onAdd && e.dataTransfer.types.includes("application/x-venue-type")) { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; } }}
      onDrop={(e) => {
        const type = e.dataTransfer.getData("application/x-venue-type");
        const r = inner.current?.getBoundingClientRect();
        if (!type || !r || !onAdd) return;
        e.preventDefault();
        onAdd(type, { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale });
      }}
      className={`relative h-full min-h-[220px] flex-1 overflow-hidden rounded-lg border border-border ${room ? "bg-background" : ""}`}>
      <div
        ref={inner}
        className={`grid-snap absolute ${room ? "top-2 left-2 rounded-sm outline-2 outline-mode/60" : "inset-0"}`}
        style={room ? { width: room.w, height: room.h, transform: `scale(${scale})`, transformOrigin: "0 0" } : undefined}
      >
        {room?.cut && (
          <div className="room-cutout pointer-events-none absolute border-b-2 border-l-2 border-mode/60"
            style={{ left: room.cut.x, top: room.cut.y, width: room.cut.w, height: room.cut.h }} />
        )}
        {children}
        {items.map((it) => {
          const active = drag?.id === it.id;
          const size = room ? fitRoomSize({ w: it.w, h: it.h }, bounds) : { w: it.w, h: it.h };
          const w = active ? drag.w : size.w;
          const h = active ? drag.h : size.h;
          const pos = active ? { x: drag.x, y: drag.y } : place({ x: it.x, y: it.y, w, h });
          const selected = selectedId === it.id;
          const highlighted = highlightedIds.includes(it.id);
          return (
            <div
              key={it.id}
              title={it.title}
              data-canvas-item={it.id}
              data-selected={selected}
              data-highlighted={highlighted}
              onPointerDown={(e) => down(e, { ...it, ...pos, w, h })}
              onPointerMove={move}
              onPointerUp={up}
              onPointerCancel={up}
              style={{ left: pos.x, top: pos.y, width: w, height: h, minWidth: 20, minHeight: 20, touchAction: "none" }}
              className={`group absolute select-none ${active ? "z-20 cursor-grabbing" : "z-10 cursor-grab"}`}
            >
              <div className={`relative flex h-full flex-col items-center justify-center overflow-hidden rounded-md border font-mono text-[10px] font-bold transition-[transform,box-shadow] duration-150 ${it.className} ${active && drag.mode === "move" ? "scale-105 glow-drag" : selected || highlighted ? "glow-drag" : "hover:brightness-125"}`}>
                {it.content}
              </div>
              {it.tooltip && !active && <div role="tooltip" className="pointer-events-none absolute left-0 top-full z-40 mt-2 hidden w-56 max-w-[75vw] whitespace-normal break-words rounded-md border border-mode bg-foreground p-2 text-xs font-medium text-background shadow-lg group-hover:block">{it.tooltip}</div>}
              {active && (
                <span className="pointer-events-none absolute -top-6 left-0 z-30 whitespace-nowrap rounded bg-mode px-1.5 py-0.5 font-mono text-[10px] font-bold text-mode-foreground">
                  {drag.mode === "move" ? `X ${pos.x / GRID} · Y ${pos.y / GRID}` : `${w / GRID}m × ${h / GRID}m`}
                </span>
              )}
              {selected && onResize && (
                <span data-resize title="Größe ändern" className="absolute -right-1.5 -bottom-1.5 h-3 w-3 cursor-nwse-resize rounded-sm border-2 border-mode bg-background print:hidden" />
              )}
              {!active && (
                <button type="button" onClick={() => { onDelete(it.id); if (selected) onSelect?.(null); }}
                  className={`absolute -top-2.5 -right-2.5 z-30 flex h-5 w-5 items-center justify-center rounded-full border border-destructive/60 bg-secondary text-muted-foreground transition-opacity hover:bg-destructive hover:text-destructive-foreground print:hidden ${selected ? "opacity-100" : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"}`}
                  aria-label="Löschen"><X size={11} /></button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

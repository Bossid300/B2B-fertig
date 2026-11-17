import { SnapCanvas, type CanvasItem } from "./SnapCanvas";
import { useState } from "react";
import { Map as MapIcon, Ruler, Speaker, Lightbulb, Truck, RotateCw, Trash2, MousePointer2, Plug, LockKeyhole, AudioLines, SlidersHorizontal, Columns3 } from "lucide-react";
import { Panel, Field, Btn } from "./ui";
import { AISLE_LABEL, DENSITY_LABEL, GRID, ROOM_SHAPES, VENUE_TYPES, schukoCount, normalizeVenue, constrainToRoom, estimateSeats, isSeating, nodeSeats, seatedTotal, type AisleMode, type SeatDensity, roomGeometry, type RoomShape, nodeMeters, nodeSizePx, uid, type VenueNode, type VenueState } from "../../lib/hub";
import { VENUE_TECH_FIELDS, isFixedTech, venueTechField, venueTechSpec, venueTechLabel, venueTechSummary, appendVenueTechSpec, type VenueTechField } from "../../lib/hub";

function TechIcon({ type }: { type: string }) {
  const Icon = type === "truss" ? Columns3 : type === "fixture" ? Lightbulb : type === "dimmer" ? Plug : type === "lightdesk" ? SlidersHorizontal : type === "sub" ? AudioLines : Speaker;
  return <Icon size={13} className="shrink-0" />;
}

const TONES: Record<string, string> = {
  accent: "border-mode bg-mode/20 text-mode",
  accent2: "border-mode-2 bg-mode-2/20 text-mode-2",
  muted: "border-muted-foreground/50 bg-secondary text-foreground",
  ok: "border-ok bg-ok/20 text-ok",
  warn: "border-warn bg-warn/20 text-warn",
  seat: "border-ok/70 bg-ok/10 text-ok",
};

export function VenueMode({ s: source, set: update }: { s: VenueState; set: (fn: (v: VenueState) => VenueState) => void }) {
  const s = normalizeVenue(source);
  const set = (fn: (v: VenueState) => VenueState) => update((v) => normalizeVenue(fn(normalizeVenue(v))));
  const f = (k: keyof VenueState) => ({
    value: s[k] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => set((v) => ({ ...v, [k]: e.target.value })),
  });
  const [sel, setSel] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<VenueTechField | null>(null);
  const selectNode = (id: string | null) => {
    setSel(id);
    const node = s.nodes.find((n) => n.id === id);
    setActiveField(node ? venueTechField(node) : null);
  };
  const selectField = (field: VenueTechField) => {
    setActiveField(field);
    setSel(s.nodes.find((n) => venueTechField(n) === field)?.id ?? null);
  };
  const add = (type: string, point?: { x: number; y: number }) => {
    if (!VENUE_TYPES[type]) return;
    const id = uid();
    set((v) => {
      const node: VenueNode = { id, type, x: 0, y: 0 };
      const size = nodeSizePx(node, v);
      const r = roomGeometry(v);
      const taken = v.nodes.map((n) => ({ ...nodeSizePx(n, v), x: n.x, y: n.y }));
      const hit = (x: number, y: number) =>
        (r.cut && x < r.cut.x + r.cut.w && x + size.w > r.cut.x && y < r.cut.y + r.cut.h && y + size.h > r.cut.y) ||
        taken.some((t) => x < t.x + t.w && x + size.w > t.x && y < t.y + t.h && y + size.h > t.y);
      // First free grid spot inside the room, scanning row by row.
      outer: for (let y = 0; y + size.h <= r.h; y += GRID)
        for (let x = 0; x + size.w <= r.w; x += GRID)
          if (!hit(x, y)) { node.x = x; node.y = y; break outer; }
      if (point) Object.assign(node, constrainToRoom({ ...point, ...size }, r));
      return { ...v, nodes: [...v.nodes, node] };
    });
    setSel(id);
    setActiveField(VENUE_TYPES[type]?.specField ?? null);
  };
  const patchNode = (id: string, p: Partial<VenueNode>) => set((v) => ({ ...v, nodes: v.nodes.map((n) => (n.id === id ? { ...n, ...p } : n)) }));
  /** Applies new meter dimensions; the stage writes through to the room parameters. */
  const setMeters = (n: VenueNode, w: number, d: number) => {
    if (n.type === "stage") set((v) => ({ ...v, stageW: String(w), stageD: String(d) }));
    else patchNode(n.id, { wM: w, dM: d });
  };
  const items: CanvasItem[] = s.nodes.map((n) => {
    const t = VENUE_TYPES[n.type] ?? VENUE_TYPES["stage"];
    if (!t) return { id: n.id, x: n.x, y: n.y, w: 40, h: 40, title: n.type, className: TONES["muted"] ?? "", content: n.type };
    const size = nodeSizePx(n, s);
    const m = nodeMeters(n, s);
    return {
      id: n.id, x: n.x, y: n.y, w: size.w, h: size.h, title: isFixedTech(n.type) ? `${venueTechSummary(n)} · Fest installiert` : n.label || t.label, tooltip: isFixedTech(n.type) ? `${venueTechSummary(n)} · Fest installiert` : undefined, className: `${TONES[t.tone] ?? ""} ${isFixedTech(n.type) ? "fixed-tech" : ""}`,
      content: isSeating(n.type) ? (
        <>
          <span className="seat-pattern pointer-events-none absolute inset-0 opacity-40" />
          {(n.aisle ?? "center") === "center" ? (
            <span className={`pointer-events-none absolute border-dashed border-current opacity-70 ${n.rot ? "inset-x-0 top-1/2 border-t-2" : "inset-y-0 left-1/2 border-l-2"}`} />
          ) : (
            <span className={`pointer-events-none absolute inset-0 border-dashed border-current opacity-70 ${n.rot ? "border-y-2" : "border-x-2"}`} />
          )}
          <span className="relative max-w-full truncate rounded bg-background/80 px-1">{n.label || t.short}</span>
          <span className="relative rounded bg-background/80 px-1 font-normal">ca. {nodeSeats(n, s)} Plätze</span>
        </>
      ) : isFixedTech(n.type) ? (
        <>
          <span className="flex max-w-full items-center gap-1 px-1"><TechIcon type={n.type} /><span className="truncate">{n.model || n.quantity ? venueTechLabel(n) : n.label || t.short}</span></span>
          <span className="flex items-center gap-0.5 text-[8px]"><LockKeyhole size={8} /> FEST</span>
          {size.w >= 80 && size.h >= 60 && <span className="max-w-full truncate px-1 font-normal">{n.techInfo}</span>}
        </>
      ) : (
        <>
          {n.type === "schuko" && <Plug size={12} className="shrink-0" />}
          <span className="max-w-full truncate px-1">{n.label || t.short}</span>
          {size.h >= 40 && size.w >= 60 && <span className="font-normal opacity-80">{m.w}m × {m.d}m</span>}
        </>
      ),
    };
  });
  const room = roomGeometry(s);
  const seated = seatedTotal(s);
  const selNode = s.nodes.find((n) => n.id === sel);
  const techField = (field: VenueTechField, multiline = false) => {
    const count = s.nodes.filter((n) => venueTechField(n) === field).length;
    const inputProps = { className: `field ${activeField === field ? "border-mode ring-1 ring-mode" : ""}`, value: s[field] ?? "", onFocus: () => selectField(field), onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set((v) => ({ ...v, [field]: e.target.value })) };
    return <div className="min-w-0">
      <div className="mb-1 flex items-center justify-between gap-2">
        <label htmlFor={`tech-${field}`} className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{VENUE_TECH_FIELDS[field]}</label>
        <Btn onClick={() => selectField(field)} title="Verknüpfte Technik im Raumplan auswählen" aria-label={`${VENUE_TECH_FIELDS[field]} im Raumplan auswählen`} className="shrink-0 px-1.5 py-0.5" tone={activeField === field ? "mode" : "ghost"}><MapIcon size={12} /><span>{count}</span></Btn>
      </div>
      <textarea id={`tech-${field}`} {...inputProps} rows={multiline ? 3 : 2} className={`${inputProps.className} resize-y`} />
    </div>;
  };

  return (
    <div className="h-full min-h-0 space-y-4 overflow-auto lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-4 lg:space-y-0 lg:overflow-hidden">
      <div className="grid min-h-0 grid-rows-[420px_auto_auto] gap-4 lg:grid-rows-[minmax(360px,1fr)_auto_auto] lg:overflow-auto">
        <Panel title="Floor Plan" icon={<MapIcon size={16} />} right={<span className="text-xs text-mode-2">{schukoCount(s.nodes)}× 230V Schuko</span>}>
          <div className="flex h-full min-h-[260px] gap-3">
            <div className="grid w-28 shrink-0 auto-rows-min gap-1.5 overflow-auto pr-1 sm:w-44">
              {([["Infrastruktur", undefined], ["Bestuhlung / Seating", "seating"], ["In-House Tontechnik", "audio"], ["In-House Licht & Rigging", "lighting"]] as const).map(([title, category]) => (
                <div key={title} className="grid gap-1.5">
                  <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
                  {Object.entries(VENUE_TYPES).filter(([, t]) => t.cat === category).map(([k, t]) => (
                    <Btn key={k} onClick={() => add(k)} draggable onDragStart={(e) => { e.dataTransfer.setData("application/x-venue-type", k); e.dataTransfer.effectAllowed = "copy"; }} className="items-start px-2 py-1 text-left" title={t.label}>
                      <span className="w-9 shrink-0 font-mono text-[9px] font-bold text-mode">{isFixedTech(k) ? <TechIcon type={k} /> : t.short}</span>{t.label}
                    </Btn>
                  ))}
                </div>
              ))}
            </div>
            <SnapCanvas
              items={items}
              onMove={(id, x, y) => set((v) => ({ ...v, nodes: v.nodes.map((n) => (n.id === id ? { ...n, x, y } : n)) }))}
              onDelete={(id) => set((v) => ({ ...v, nodes: v.nodes.filter((x) => x.id !== id) }))}
              room={room}
              onAdd={add}
              selectedId={sel}
              onSelect={selectNode}
              highlightedIds={activeField ? s.nodes.filter((n) => venueTechField(n) === activeField).map((n) => n.id) : []}
              onResize={(id, w, h) => {
                const n = s.nodes.find((x) => x.id === id);
                if (!n) return;
                const [wm, dm] = n.rot ? [h / GRID, w / GRID] : [w / GRID, h / GRID];
                setMeters(n, wm, dm);
              }}
            />
          </div>
        </Panel>
        <Panel title="Element-Eigenschaften" icon={<MousePointer2 size={16} />}>
          {selNode ? (
            <div className="grid grid-cols-2 items-end gap-3 md:grid-cols-[minmax(0,2fr)_6rem_6rem_auto_auto]">
              <div className="col-span-2 md:col-span-1">
                <Field label={`Bezeichnung (${VENUE_TYPES[selNode.type]?.label ?? selNode.type})`}>
                  <input className="field" placeholder={VENUE_TYPES[selNode.type]?.label} value={selNode.label ?? ""} onChange={(e) => patchNode(selNode.id, { label: e.target.value })} />
                </Field>
              </div>
              <Field label="Breite (m)">
                <input type="number" min={2} max={32} step={1} className="field font-mono" value={nodeMeters(selNode, s).w} onChange={(e) => setMeters(selNode, Math.max(0, Number(e.target.value)), nodeMeters(selNode, s).d)} />
              </Field>
              <Field label="Tiefe (m)">
                <input type="number" min={2} max={32} step={1} className="field font-mono" value={nodeMeters(selNode, s).d} onChange={(e) => setMeters(selNode, nodeMeters(selNode, s).w, Math.max(0, Number(e.target.value)))} />
              </Field>
              {isSeating(selNode.type) && (() => {
                const m = nodeMeters(selNode, s);
                const est = estimateSeats(selNode.type, m.w, m.d, selNode.density, selNode.aisle);
                return (
                  <div className="col-span-2 grid grid-cols-3 gap-3 md:col-span-5 md:order-last">
                    <Field label={`Plätze (Schätzung ${est})`}>
                      <div className="flex gap-1">
                        <input type="number" min={0} className="field font-mono" placeholder={String(est)} value={selNode.seats ?? ""}
                          onChange={(e) => patchNode(selNode.id, { seats: e.target.value === "" ? undefined : Math.max(0, Math.floor(Number(e.target.value))) })} />
                        {selNode.seats != null && <Btn onClick={() => patchNode(selNode.id, { seats: undefined })} title="Automatisch berechnen">Auto</Btn>}
                      </div>
                    </Field>
                    <Field label="Bestuhlungs-Dichte">
                      <select className="field" value={selNode.density ?? "normal"} onChange={(e) => patchNode(selNode.id, { density: e.target.value as SeatDensity })}>
                        {Object.entries(DENSITY_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                      </select>
                    </Field>
                    <Field label="Gang-Ausrichtung">
                      <select className="field" value={selNode.aisle ?? "center"} onChange={(e) => patchNode(selNode.id, { aisle: e.target.value as AisleMode })}>
                        {Object.entries(AISLE_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                      </select>
                    </Field>
                  </div>
                );
              })()}
              <Btn onClick={() => patchNode(selNode.id, { rot: !selNode.rot })} tone={selNode.rot ? "mode" : "ghost"}><RotateCw size={14} /> 90°</Btn>
              <Btn tone="danger" onClick={() => { set((v) => ({ ...v, nodes: v.nodes.filter((x) => x.id !== selNode.id) })); setSel(null); }}><Trash2 size={14} /></Btn>
              {isFixedTech(selNode.type) && <div className="col-span-2 grid gap-3 md:col-span-5 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                <Field label="Verknüpfter Technik-Eintrag">
                  <select className="field" value={venueTechField(selNode) ?? ""} onChange={(e) => {
                    const field = Object.keys(VENUE_TECH_FIELDS).find((key) => key === e.target.value) as VenueTechField | undefined;
                    patchNode(selNode.id, { specField: field ?? null });
                    setActiveField(field ?? null);
                  }}>
                    <option value="">Nicht verknüpft</option>
                    {Object.entries(VENUE_TECH_FIELDS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                  </select>
                </Field>
                <Field label="Gerätebezeichnung / Modell"><input className="field" value={selNode.model ?? ""} onChange={(e) => patchNode(selNode.id, { model: e.target.value })} /></Field>
                <Field label="Anzahl / Stückzahl"><input className="field" placeholder="2×" value={selNode.quantity ?? ""} onChange={(e) => patchNode(selNode.id, { quantity: e.target.value })} /></Field>
                <Field label="Zusatz-Info / DMX-Adresse"><input className="field" value={selNode.techInfo ?? ""} onChange={(e) => patchNode(selNode.id, { techInfo: e.target.value })} /></Field>
                <Btn tone="mode" disabled={!selNode.model?.trim() || !venueTechField(selNode)} onClick={() => set((v) => appendVenueTechSpec(v, selNode))}><Truck size={14} /> In Tech Specs übernehmen</Btn>
              </div>}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Element im Floor Plan anklicken, um Größe, Bezeichnung und Ausrichtung zu bearbeiten. Ecke unten rechts ziehen zum Skalieren.</p>
          )}
        </Panel>
        <Panel title="Raum-Parameter" icon={<Ruler size={16} />}>
          <div className="mb-3">
            <Field label="Raumform">
              <select aria-label="Raumform" className="field" value={s.shape ?? "rect"} onChange={(e) => {
                const shape = ROOM_SHAPES.find((r) => r.id === e.target.value);
                if (!shape) return;
                set((v) => ({ ...v, shape: shape.id, ...(shape.preset ? { roomL: shape.preset.L, roomW: shape.preset.W } : {}) }));
              }}>
                {ROOM_SHAPES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
            <Field label="Raumlänge (m)"><input type="number" min={8} max={120} step={1} className="field font-mono" {...f("roomL")} value={s.roomL ?? ""} /></Field>
            <Field label="Raumbreite (m)"><input type="number" min={6} max={120} step={1} className="field font-mono" {...f("roomW")} value={s.roomW ?? ""} /></Field>
            <Field label="Lichte Höhe (m)"><input type="number" min={0.1} step={0.1} className="field font-mono" {...f("roomH")} value={s.roomH ?? ""} /></Field>
            <Field label="Bühne Breite (m)"><input className="field font-mono" {...f("stageW")} /></Field>
            <Field label="Bühne Tiefe (m)"><input className="field font-mono" {...f("stageD")} /></Field>
            <Field label="Lichte Höhe Bühne (m)"><input className="field font-mono" {...f("stageH")} /></Field>
            <Field label="Kapazität stehend"><input className="field font-mono" {...f("capStanding")} /></Field>
            <Field label={seated.auto ? "Kapazität sitzend (auto)" : "Kapazität sitzend"}>
              {seated.auto
                ? <output className="field block font-mono font-bold text-ok" title="Summe aller Bestuhlungs-Blöcke">{seated.total}</output>
                : <input className="field font-mono" {...f("capSeated")} />}
            </Field>
            <div className="col-span-2 md:col-span-2"><Field label="Location-Name"><input className="field" {...f("name")} /></Field></div>
            <div className="col-span-3 md:col-span-2 self-end pb-1.5 font-mono text-[11px] text-muted-foreground">
              Plan: {room.w / GRID} × {room.h / GRID} m{room.cut ? ` · Aussparung ${room.cut.w / GRID} × ${room.cut.h / GRID} m` : ""}
            </div>
          </div>
        </Panel>
      </div>

      <div className="flex min-h-0 flex-col gap-4 lg:overflow-auto">
        <Panel title="Audio & PA" icon={<Speaker size={16} />} className="shrink-0">
          <div className="grid gap-3">
            {techField("pa")}
            <Field label="FOH Pult (fest)"><input className="field" {...f("foh")} /></Field>
            <Field label="Monitoring"><input className="field" {...f("monitors")} /></Field>
            <Field label="Multicore / Snake"><input className="field" {...f("snake")} /></Field>
          </div>
        </Panel>
        <Panel title="Licht & Rigging" icon={<Lightbulb size={16} />} className="shrink-0">
          <div className="grid gap-3">
            {techField("rigging")}
            {techField("lightConsole")}
            {techField("dimmerCity")}
            {techField("fixtures", true)}
          </div>
        </Panel>
        <Panel title="Logistik & Load-In" icon={<Truck size={16} />} className="shrink-0">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tür Breite (m)"><input className="field font-mono" {...f("doorW")} /></Field>
            <Field label="Tür Höhe (m)"><input className="field font-mono" {...f("doorH")} /></Field>
            <div className="col-span-2">
              <Field label="Zugang">
                <select className="field" {...f("access")}>
                  <option>Ebenerdig / Rampe</option><option>Lastenaufzug</option><option>Treppe</option>
                </select>
              </Field>
            </div>
            <div className="col-span-2"><Field label="Bus / Trailer Parken"><input className="field" {...f("parking")} /></Field></div>
            <div className="col-span-2"><Field label="Lärmschutz / Curfew"><input className="field" {...f("curfew")} /></Field></div>
          </div>
        </Panel>
      </div>
    </div>
  );
}


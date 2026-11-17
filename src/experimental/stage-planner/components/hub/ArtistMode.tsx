import { useState } from "react";
import { SnapCanvas, type CanvasItem } from "./SnapCanvas";
import { Setlist } from "./Setlist";
import { InputChannels } from "./InputChannels";
import { GripVertical, Plus, Trash2, ListMusic, LayoutGrid, Cable, Zap, X, Coffee, Star, RotateCw, ChevronDown, Plug } from "lucide-react";
import { Panel, Btn, BADGE_CLASS, StageLegend } from "./ui";
import { addArtistStage, artistInputs, createCustomStage, BADGE_COLORS, GRID, STAGE_TYPES, artistPowerSummary, artistSchukoTotal, schukoCount, nextRot, stageElSize, type StageEl, formatHMS, totalSetDuration, uid, type ArtistState, type Song, type Channel } from "../../lib/hub";


export function ArtistMode({ s, set }: { s: ArtistState; set: (fn: (a: ArtistState) => ArtistState) => void }) {
  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-4 overflow-auto lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:overflow-hidden">
      <Setlist s={s} set={set} />
      <div className="grid min-h-0 gap-4 max-lg:grid-rows-[600px_620px] lg:grid-rows-[minmax(0,1fr)_minmax(0,1fr)]">
        <StageCanvas s={s} set={set} />
        <InputList s={s} set={set} />
      </div>
    </div>
  );
}

function StageCanvas({ s, set }: { s: ArtistState; set: (fn: (a: ArtistState) => ArtistState) => void }) {
  const [sel, setSel] = useState<string | null>(null);
  const [customOpen, setCustomOpen] = useState(false);
  const [badge, setBadge] = useState("");
  const [name, setName] = useState("");
  const add = (type: string, custom?: StageEl) => {
    const t = STAGE_TYPES[type];
    if (!t && !custom) return;
    const id = custom?.id ?? uid();
    set((a) => {
      let point = { x: GRID, y: GRID };
      outer: for (let y = GRID; y <= 200; y += GRID)
        for (let x = GRID; x <= 400; x += GRID) {
          const occupied = a.stage.some((el) => {
            const size = stageElSize(el);
            return x < el.x + size.w && x + 40 > el.x && y < el.y + size.h && y + 40 > el.y;
          });
          if (!occupied) { point = { x, y }; break outer; }
        }
      return addArtistStage(a, { ...(custom ?? { id, type, channels: t?.channels() ?? [] }), ...point });
    });
    setSel(id);
  };
  const patch = (id: string, p: Partial<StageEl>) => set((a) => ({ ...a, stage: a.stage.map((el) => (el.id === id ? { ...el, ...p } : el)) }));
  const items: CanvasItem[] = s.stage.map((el) => {
    const t = STAGE_TYPES[el.type];
    const size = stageElSize(el);
    const vertical = el.rot === 90 || el.rot === 270;
    return {
      id: el.id, x: el.x, y: el.y, w: size.w, h: size.h, title: el.label || el.name || t?.label || el.type, tooltip: el.name || t?.label,
      className: BADGE_CLASS[el.color ?? (el.type === "schuko" ? "warn" : "mode")],
      content: <>{el.type === "schuko" && <Plug size={12} className="shrink-0" />}<span className={`max-h-full max-w-full truncate px-0.5 ${vertical && size.h > size.w ? "[writing-mode:vertical-rl]" : ""}`}>{el.label || el.badge || t?.short || el.type}</span></>,
    };
  });
  const selEl = s.stage.find((x) => x.id === sel);
  const selSize = selEl ? { w: Math.max(40, selEl.w ?? 40), h: Math.max(40, selEl.h ?? 40) } : null;

  return (
    <Panel title="Stage Rider Canvas" icon={<LayoutGrid size={16} />} right={<span className="text-xs text-muted-foreground">Klicken zum Hinzufügen · Ziehen · Ecke skalieren</span>}>
      <div className="flex h-full min-h-[220px] gap-3">
        <div className="flex w-36 shrink-0 flex-col gap-2 overflow-auto">
          <div className="grid auto-rows-min gap-1.5">
            {Object.entries(STAGE_TYPES).map(([k, t]) => (
              <Btn key={k} onClick={() => add(k)} className="items-start px-2 py-1 text-left">
                <span className="w-7 font-mono text-[10px] font-bold text-mode">{t.short}</span>{t.label}
              </Btn>
            ))}
            <Btn tone="mode" onClick={() => setCustomOpen((v) => !v)} className="px-2 text-left"><Plus size={12} /> Eigenes Element</Btn>
            {customOpen && <form aria-label="Eigenes Element erstellen" className="space-y-2 border-t border-border pt-2" onSubmit={(e) => { e.preventDefault(); const el = createCustomStage(badge, name); if (!el) return; add("custom", el); setBadge(""); setName(""); setCustomOpen(false); }}>
              <label className="block text-[10px] text-muted-foreground">Kürzel / Badge Code<input autoFocus required maxLength={4} className="field mt-1 font-mono" value={badge} onChange={(e) => setBadge(e.target.value.toUpperCase())} /></label>
              <label className="block text-[10px] text-muted-foreground">Bezeichnung / Full Name<input required className="field mt-1" value={name} onChange={(e) => setName(e.target.value)} /></label>
              <Btn tone="mode" disabled={!badge.trim() || !name.trim()} onClick={(e) => e.currentTarget.closest("form")?.requestSubmit()}><Plus size={12} /> Hinzufügen</Btn>
            </form>}
          </div>
          <details className="group rounded-md border border-border bg-panel">
            <summary className="flex cursor-pointer list-none items-center justify-between px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-mode">
              Legende / Abkürzungen <ChevronDown size={12} className="transition group-open:rotate-180" />
            </summary>
            <div className="border-t border-border p-2"><StageLegend compact stage={s.stage} /></div>
          </details>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {selEl && selSize && (
            <div className="flex flex-wrap items-end gap-2 rounded-md border border-mode/50 bg-panel p-2">
              <label className="min-w-32 flex-1">
                <span className="mb-0.5 block text-[10px] uppercase tracking-wider text-muted-foreground">Bezeichnung ({selEl.badge || STAGE_TYPES[selEl.type]?.short})</span>
                <input className="field" placeholder={selEl.badge || STAGE_TYPES[selEl.type]?.short} value={selEl.type === "custom" ? selEl.name ?? "" : selEl.label ?? ""} onChange={(e) => patch(selEl.id, selEl.type === "custom" ? { name: e.target.value } : { label: e.target.value })} />
              </label>
              {selEl.type === "custom" && <label className="w-20 text-[10px] text-muted-foreground">Kürzel<input aria-label="Kürzel bearbeiten" maxLength={4} className="field mt-1 font-mono" value={selEl.badge ?? ""} onChange={(e) => patch(selEl.id, { badge: e.target.value.toUpperCase() })} /></label>}
              <label className="w-16">
                <span className="mb-0.5 block text-[10px] uppercase tracking-wider text-muted-foreground">Breite</span>
                <input type="number" min={2} step={1} className="field font-mono" value={selSize.w / GRID} onChange={(e) => patch(selEl.id, { w: Math.max(40, Math.round(Number(e.target.value)) * GRID) })} />
              </label>
              <label className="w-16">
                <span className="mb-0.5 block text-[10px] uppercase tracking-wider text-muted-foreground">Höhe</span>
                <input type="number" min={2} step={1} className="field font-mono" value={selSize.h / GRID} onChange={(e) => patch(selEl.id, { h: Math.max(40, Math.round(Number(e.target.value)) * GRID) })} />
              </label>
              <div>
                <span className="mb-0.5 block text-[10px] uppercase tracking-wider text-muted-foreground">Farbe</span>
                <div className="flex gap-1">
                  {BADGE_COLORS.map((c) => (
                    <button key={c} onClick={() => patch(selEl.id, { color: c })} aria-label={`Farbe ${c}`}
                      className={`h-6 w-6 rounded border-2 ${BADGE_CLASS[c]} ${(selEl.color ?? "mode") === c ? "ring-2 ring-foreground ring-offset-1 ring-offset-background" : ""}`} />
                  ))}
                </div>
              </div>
              <Btn onClick={() => patch(selEl.id, { rot: nextRot(selEl.rot) })}><RotateCw size={14} /> {selEl.rot ?? 0}°</Btn>
              <Btn tone="danger" onClick={() => { set((a) => ({ ...a, inputChannels: artistInputs(a).filter((c) => c.stageId !== selEl.id), stage: a.stage.filter((x) => x.id !== selEl.id) })); setSel(null); }}><Trash2 size={14} /></Btn>
            </div>
          )}
          <SnapCanvas
            items={items}
            selectedId={sel}
            onSelect={setSel}
            onMove={(id, x, y) => patch(id, { x, y })}
            onResize={(id, w, h) => {
              const el = s.stage.find((x) => x.id === id);
              if (!el) return;
              const odd = el.rot === 90 || el.rot === 270;
              patch(id, odd ? { w: h, h: w } : { w, h });
            }}
            onDelete={(id) => set((a) => ({ ...a, inputChannels: artistInputs(a).filter((c) => c.stageId !== id), stage: a.stage.filter((x) => x.id !== id) }))}
          >
            <div className="pointer-events-none absolute inset-x-0 bottom-0 border-t-2 border-dashed border-mode/40 py-0.5 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Publikum / Front</div>
          </SnapCanvas>
        </div>
      </div>
    </Panel>
  );
}

function InputList({ s, set }: { s: ArtistState; set: (fn: (a: ArtistState) => ArtistState) => void }) {
  return (
    <Panel title="Input List & Monitoring" icon={<Cable size={16} />}>
      <InputChannels s={s} set={set} />

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
            Monitor-Mixes
            <Btn onClick={() => set((a) => ({ ...a, mixes: [...a.mixes, { id: uid(), name: `Mix ${a.mixes.length + 1}`, type: "Wedge", feed: "" }] }))}><Plus size={12} /></Btn>
          </div>
          <div className="space-y-1.5">
            {s.mixes.map((m) => (
              <div key={m.id} className="flex gap-1.5">
                <input className="field" value={m.name} onChange={(e) => set((a) => ({ ...a, mixes: a.mixes.map((x) => (x.id === m.id ? { ...x, name: e.target.value } : x)) }))} />
                <select className="field w-24" value={m.type} onChange={(e) => set((a) => ({ ...a, mixes: a.mixes.map((x) => (x.id === m.id ? { ...x, type: e.target.value as "IEM" | "Wedge" } : x)) }))}>
                  <option>IEM</option><option>Wedge</option>
                </select>
                <input className="field" placeholder="Feed" value={m.feed} onChange={(e) => set((a) => ({ ...a, mixes: a.mixes.map((x) => (x.id === m.id ? { ...x, feed: e.target.value } : x)) }))} />
                <button onClick={() => set((a) => ({ ...a, mixes: a.mixes.filter((x) => x.id !== m.id) }))} className="text-muted-foreground hover:text-destructive" aria-label="Entfernen"><X size={14} /></button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground"><Zap size={12} className="text-warn" /> Strombedarf</div>
          <div className="mb-3 space-y-2">
            <output className="block font-mono text-xs text-warn">{artistPowerSummary(s)}</output>
            <div className="flex flex-wrap items-end gap-2">
              <label className="min-w-24 flex-1 text-xs">230V Steckdosen
                <input aria-label="230V Steckdosen" type="number" min={0} step={1} className="field mt-1 font-mono" value={artistSchukoTotal(s)} onChange={(e) => set((a) => ({ ...a, schukoOutlets: e.target.value === "" ? undefined : Math.max(0, Math.floor(Number(e.target.value))) }))} />
              </label>
              <Btn title="Steckdosen aus Stage Plot zählen" tone={s.schukoOutlets == null ? "mode" : "ghost"} onClick={() => set((a) => ({ ...a, schukoOutlets: undefined }))}>Auto</Btn>
              <label className="min-w-24 flex-1 text-xs">Separate Stromkreise
                <input aria-label="Separate Stromkreise" type="number" min={0} step={1} placeholder="–" className="field mt-1 font-mono" value={s.schukoCircuits ?? ""} onChange={(e) => set((a) => ({ ...a, schukoCircuits: e.target.value === "" ? undefined : Math.max(0, Math.floor(Number(e.target.value))) }))} />
              </label>
            </div>
            <p className="text-xs text-muted-foreground">{schukoCount(s.stage)} Schuko-Punkte im Stage Plot</p>
            <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={s.separatePower ?? false} onChange={(e) => set((a) => ({ ...a, separatePower: e.target.checked }))} /> Getrennte Stromkreise für Ton/Licht</label>
          </div>
          <textarea className="field h-24 resize-none" value={s.power} onChange={(e) => set((a) => ({ ...a, power: e.target.value }))} />
        </div>
      </div>
    </Panel>
  );
}

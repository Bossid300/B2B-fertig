import { Fragment } from "react";
import { Plug } from "lucide-react";
import { StageLegend } from "./ui";
import { ROOM_SHAPES, artistPowerSummary, schukoCount, normalizeVenue, roomGeometry, nodeSizePx, nodeMeters, nodeSeats, seatedTotal, stageElSize, STAGE_TYPES, VENUE_TYPES, formatHMS, totalSetDuration, type HubState } from "../../lib/hub";
import { artistInputs, isFixedTech, venueTechSummary } from "../../lib/hub";

/** Read-only, high-contrast sheet used for both the print view and the profile embed preview. */
export function SpecSheet({ state }: { state: HubState }) {
  if (state.mode === "artist") {
    const a = state.artist;
    let n = 0;
    let songNo = 0;
    return (
      <div className="space-y-5 text-sm">
        <div className="flex items-baseline justify-between border-b-2 border-current pb-2">
          <h2 className="text-2xl font-bold">{a.name} — Tech Rider</h2>
          <span className="font-mono">Laufzeit {formatHMS(totalSetDuration(a.songs))}</span>
        </div>
        <section>
          <h3 className="mb-1 font-bold uppercase tracking-wider">Setlist</h3>
          <ol className="space-y-0.5 font-mono">
            {a.songs.map((s) => (
              <li key={s.id} className={s.kind !== "song" ? "font-bold uppercase" : ""}>
                {s.kind === "song" ? String(++songNo).padStart(2, "0") + "." : "——"} {s.title} {s.kind === "song" && `· ${s.duration} · ${s.key} · ${s.bpm} BPM`}{s.notes && ` · ${s.notes}`}
              </li>
            ))}
          </ol>
        </section>
        <section>
          <h3 className="mb-1 font-bold uppercase tracking-wider">Input List</h3>
          <table className="w-full border-collapse text-xs">
            <thead><tr className="border-b border-current text-left"><th>CH</th><th>Signal</th><th>Mic</th><th>48V</th><th>Stativ</th><th>Notizen</th></tr></thead>
            <tbody>
              {artistInputs(a).map((c) => (
                <tr key={c.id} className="border-b border-current/20"><td className="font-mono">{String(++n).padStart(2, "0")}</td><td>{c.label}</td><td>{c.mic}</td><td>{c.phantom ? "●" : ""}</td><td>{c.stand}</td><td>{c.notes}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="grid grid-cols-2 gap-4">
          <div><h3 className="font-bold uppercase tracking-wider">Monitor-Mixes</h3>{a.mixes.map((m) => <div key={m.id}>{m.name} ({m.type}) – {m.feed}</div>)}</div>
          <div><h3 className="font-bold uppercase tracking-wider">Strom</h3><p className="font-semibold">{artistPowerSummary(a)}</p><p>{schukoCount(a.stage)} Schuko-Punkte im Stage Plot</p><p>{a.power}</p></div>
        </section>
        <section className="break-inside-avoid">
          <h3 className="mb-1 font-bold uppercase tracking-wider">Stage Plot</h3>
          <div className="relative overflow-hidden border-2 border-current" style={{ height: Math.max(200, ...a.stage.map((e) => e.y + stageElSize(e).h + 20)) }}>
            {a.stage.map((e) => {
              const sz = stageElSize(e);
              return (
                <div key={e.id} title={e.name || STAGE_TYPES[e.type]?.label} className="absolute flex flex-col items-center justify-center overflow-hidden border-2 border-current text-center font-mono text-[9px] font-bold leading-tight"
                  style={{ left: e.x, top: e.y, width: sz.w, height: sz.h }}>
                  {e.type === "schuko" && <Plug size={12} />}
                  {e.label || e.badge || STAGE_TYPES[e.type]?.short || e.type}
                  {e.type === "schuko" && e.label && <span>230V</span>}
                </div>
              );
            })}
            <div className="absolute inset-x-0 bottom-0 border-t border-dashed border-current text-center text-[9px] uppercase tracking-[0.3em]">Publikum / Front</div>
          </div>
        </section>
        <section className="break-inside-avoid">
          <h3 className="mb-1 font-bold uppercase tracking-wider">Legende / Abkürzungen</h3>
          <StageLegend plain stage={a.stage} />
        </section>
      </div>
    );
  }
  const v = normalizeVenue(state.venue);
  const room = roomGeometry(v);
  const rows: [string, string][] = [
    ["Bühne", `${v.stageW} × ${v.stageD} m, lichte Höhe ${v.stageH} m`],
    ["Raum", `${v.roomL ?? "–"} × ${v.roomW ?? "–"} m, Höhe ${v.roomH ?? "–"} m · ${ROOM_SHAPES.find((r) => r.id === (v.shape ?? "rect"))!.label}`],
    ["Kapazität", `${v.capStanding} stehend / ${seatedTotal(v).total} sitzend`],
    ["Stromanschlüsse", `${schukoCount(v.nodes)}× 230V Schuko · ${v.nodes.filter((n) => n.type === "p16").length}× 16A CEE · ${v.nodes.filter((n) => n.type === "p32").length}× 32A CEE · ${v.nodes.filter((n) => n.type === "p63").length}× 63A CEE`],
    ["Main PA", v.pa], ["FOH Pult", v.foh], ["Monitoring", v.monitors], ["Multicore", v.snake],
    ["Rigging", v.rigging], ["Lichtpult", v.lightConsole], ["Dimmer City", v.dimmerCity ?? ""], ["Scheinwerfer", v.fixtures],
    ["Load-In Tür", `${v.doorW} × ${v.doorH} m · ${v.access}`], ["Parken", v.parking], ["Curfew", v.curfew],
    ["Floor Plan", v.nodes.map((n) => { const m = nodeMeters(n, v); const seats = nodeSeats(n, v); return `${isFixedTech(n.type) ? venueTechSummary(n) : n.label || VENUE_TYPES[n.type]?.label || n.type} (${m.w}×${m.d} m${seats ? `, ${seats} Plätze` : ""})${isFixedTech(n.type) ? " · FEST" : ""}`; }).join(" · ")],
  ];
  return (
    <div className="space-y-4 text-sm">
      <h2 className="border-b-2 border-current pb-2 text-2xl font-bold">{v.name} — Venue Spec Sheet</h2>
      <dl className="grid grid-cols-[10rem_1fr] gap-x-4 gap-y-1.5">
        {rows.map(([k, val]) => (<Fragment key={k}><dt className="font-bold uppercase tracking-wider text-xs">{k}</dt><dd>{val}</dd></Fragment>))}
      </dl>
      <section className="break-inside-avoid">
        <h3 className="mb-1 font-bold uppercase">Floor Plan · 230V = Schuko · FEST = Fest installiert</h3>
        <svg role="img" aria-label="Floor Plan mit Schuko-Steckdosen" viewBox={`0 0 ${room.w} ${room.h}`} className="max-h-96 w-full border-2 border-current">
          {room.cut && <rect {...room.cut} fill="currentColor" fillOpacity="0.15" />}
          {v.nodes.map((n) => {
            const size = nodeSizePx(n, v);
            return <g key={n.id}>
              <rect x={n.x} y={n.y} width={size.w} height={size.h} fill="none" stroke="currentColor" strokeWidth={n.type === "schuko" || isFixedTech(n.type) ? 3 : 1} />
              <text x={n.x + size.w / 2} y={n.y + size.h / 2} textAnchor="middle" dominantBaseline="middle" fill="currentColor" fontSize={9}>{n.type === "schuko" ? "230V" : isFixedTech(n.type) ? VENUE_TYPES[n.type]?.short : n.label || VENUE_TYPES[n.type]?.short || n.type}</text>
              {isFixedTech(n.type) && <><text x={n.x + size.w / 2} y={n.y + size.h / 2 + 11} textAnchor="middle" fill="currentColor" fontSize={7}>{n.quantity ? `${n.quantity.replace(/\s*[x×]\s*$/i, "")}× · ` : ""}FEST</text><title>{venueTechSummary(n)} · Fest installiert</title></>}
              {n.type === "schuko" && <title>230V Schuko · {n.label || "Steckdose"}</title>}
            </g>;
          })}
        </svg>
      </section>
    </div>
  );
}

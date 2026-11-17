import { usePointerReorder } from "../../hooks/use-pointer-reorder";
import { GripVertical, Plus, X } from "lucide-react";
import { artistInputs, reorderInputs, uid, type ArtistInput, type ArtistState } from "../../lib/hub";
import { Btn } from "./ui";

export function InputChannels({ s, set }: { s: ArtistState; set: (fn: (a: ArtistState) => ArtistState) => void }) {
  const rows = artistInputs(s);
  const change = (fn: (rows: ArtistInput[]) => ArtistInput[]) => set((a) => ({ ...a, inputChannels: fn(artistInputs(a)) }));
  const { dragging, start } = usePointerReorder(rows.map((row) => row.id), "[data-channel-id]", "data-channel-id", (from, to) => change((rows) => reorderInputs(rows, from, to)));
  const update = (id: string, patch: Partial<ArtistInput>) => change((rows) => rows.map((row) => row.id === id ? { ...row, ...patch } : row));
  return <>
    <div className="overflow-x-auto">
      <table aria-label="Input-Kanäle" className="w-full min-w-[620px] table-fixed text-xs">
        <thead className="bg-card text-left text-[10px] uppercase text-muted-foreground"><tr><th className="w-7" /><th className="w-14 py-2">CH</th><th className="w-[22%]">Signal</th><th className="w-[22%]">Mic / Transducer</th><th className="w-12">48V</th><th className="w-20">Stativ</th><th>Notizen</th><th className="w-7" /></tr></thead>
        <tbody>
          {rows.map((row, i) => <tr key={row.id} data-channel-id={row.id} className={`border-t border-border ${dragging === row.id ? "bg-mode/15" : ""}`}>
            <td><Btn title="Kanal verschieben" aria-label={`Kanal ${i + 1} verschieben`} className="touch-none cursor-grab p-0.5" onPointerDown={(e) => start(e, row.id, "tbody")} onKeyDown={(e) => { if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return; e.preventDefault(); const to = rows[i + (e.key === "ArrowUp" ? -1 : 1)]; if (to) change((rows) => reorderInputs(rows, row.id, to.id)); }}><GripVertical size={13} /></Btn></td>
            <td className="py-1 font-mono font-bold text-mode">CH {String(i + 1).padStart(2, "0")}</td>
            <td className="pr-1"><input aria-label={`Signal CH ${i + 1}`} className="field" value={row.label} onChange={(e) => update(row.id, { label: e.target.value })} /></td>
            <td className="pr-1"><input aria-label={`Mic CH ${i + 1}`} className="field" value={row.mic} onChange={(e) => update(row.id, { mic: e.target.value })} /></td>
            <td><Btn aria-label={`48V CH ${i + 1}`} aria-pressed={row.phantom} tone={row.phantom ? "mode" : "ghost"} className="px-1 py-1 font-mono text-[10px]" onClick={() => update(row.id, { phantom: !row.phantom })}>{row.phantom ? "ON" : "OFF"}</Btn></td>
            <td className="pr-1"><select aria-label={`Stativ CH ${i + 1}`} className="field" value={row.stand} onChange={(e) => update(row.id, { stand: e.target.value as ArtistInput["stand"] })}>{["Short", "Tall", "Boom", "—"].map((stand) => <option key={stand}>{stand}</option>)}</select></td>
            <td><input aria-label={`Notizen CH ${i + 1}`} className="field" value={row.notes} onChange={(e) => update(row.id, { notes: e.target.value })} /></td>
            <td><Btn title="Kanal löschen" aria-label={`Kanal ${i + 1} löschen`} tone="danger" className="p-0.5" onClick={() => change((rows) => rows.filter((channel) => channel.id !== row.id))}><X size={13} /></Btn></td>
          </tr>)}
        </tbody>
      </table>
    </div>
    <Btn tone="mode" className="mt-3" onClick={() => change((rows) => [...rows, { id: uid(), label: "", mic: "", phantom: false, stand: "—", notes: "" }])}><Plus size={14} /> Kanal hinzufügen</Btn>
  </>;
}
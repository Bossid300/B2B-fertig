import { useEffect, useRef, useState } from "react";
import { usePointerReorder } from "../../hooks/use-pointer-reorder";
import { Coffee, Copy, GripVertical, ListMusic, MoreHorizontal, Play, Plus, RotateCcw, Square, Star, Trash2, Rows3 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { convertSongMarker, duplicateSongs, formatHMS, parseDuration, reorderSongs, totalSetDuration, uid, type ArtistState, type Song } from "../../lib/hub";
import { Btn, Panel } from "./ui";

const KINDS: Record<Song["kind"], string> = { song: "Song", pause: "Pause / Break", encore: "Zugabe / Encore", separator: "Set-Trenner" };
const blank = (): Omit<Song, "id"> => ({ kind: "song", title: "", duration: "03:30", key: "", bpm: "", notes: "" });

function BreakTimer({ duration }: { duration: string }) {
  const seconds = parseDuration(duration);
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(false);
  useEffect(() => { setLeft(seconds); setRunning(false); }, [seconds]);
  useEffect(() => {
    if (!running) return;
    const end = Date.now() + left * 1000;
    const timer = window.setInterval(() => {
      const next = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setLeft(next);
      if (next === 0) setRunning(false);
    }, 200);
    return () => window.clearInterval(timer);
  }, [running]);
  return <div className="flex items-center gap-1.5">
    <output aria-label="Pause Countdown" className="w-20 font-mono text-xs text-mode-2">{formatHMS(left)}</output>
    <Btn aria-label={running ? "Countdown pausieren" : "Countdown starten"} title={running ? "Countdown pausieren" : "Countdown starten"} disabled={left === 0} onClick={() => setRunning((v) => !v)} className="p-1">{running ? <Square size={12} /> : <Play size={12} />}</Btn>
    <Btn aria-label="Countdown zurücksetzen" title="Countdown zurücksetzen" onClick={() => { setRunning(false); setLeft(seconds); }} className="p-1"><RotateCcw size={12} /></Btn>
  </div>;
}

export function Setlist({ s, set }: { s: ArtistState; set: (fn: (a: ArtistState) => ArtistState) => void }) {
  const [draft, setDraft] = useState(blank);
  const [selected, setSelected] = useState<string[]>([]);
  const titleInput = useRef<HTMLInputElement>(null);
  const addForm = useRef<HTMLFormElement>(null);
  const chosen = selected.filter((id) => s.songs.some((song) => song.id === id));
  const changeSongs = (fn: (songs: Song[]) => Song[]) => set((a) => ({ ...a, songs: fn(a.songs) }));
  const update = (id: string, patch: Partial<Song>) => changeSongs((songs) => songs.map((song) => song.id === id ? { ...song, ...patch } : song));
  const openQuick = () => { setDraft(blank()); addForm.current?.scrollIntoView({ block: "nearest" }); titleInput.current?.focus(); };
  const addMarker = (kind: Song["kind"]) => {
    const count = s.songs.filter((song) => song.kind === "separator").length + 1;
    changeSongs((songs) => [...songs, { ...blank(), id: uid(), kind, title: kind === "separator" ? `Set ${count}` : KINDS[kind], duration: kind === "pause" ? "02:00" : "00:00" }]);
  };
  const submit = () => {
    if (!draft.title.trim()) { titleInput.current?.focus(); return; }
    changeSongs((songs) => [...songs, { ...draft, title: draft.title.trim(), id: uid() }]);
    setDraft(blank());
    titleInput.current?.focus();
  };
  const reorder = (from: string, to: string) => changeSongs((songs) => reorderSongs(songs, from, to));
  const { dragging, start } = usePointerReorder(s.songs.map((song) => song.id), "[data-song-id]", "data-song-id", reorder);

  return <Panel title="Setlist-Planer" icon={<ListMusic size={16} />} className="h-[720px] min-h-0 lg:h-full" right={<div className="flex flex-wrap justify-end gap-1">
    <Btn onClick={openQuick} tone="mode"><Plus size={14} /> Song</Btn>
    <DropdownMenu><DropdownMenuTrigger asChild><Btn title="Marker hinzufügen" aria-label="Marker hinzufügen"><Plus size={14} /><Rows3 size={14} /></Btn></DropdownMenuTrigger>
      <DropdownMenuContent>{(["pause", "encore", "separator"] as const).map((kind) => <DropdownMenuItem key={kind} onSelect={() => addMarker(kind)}>{KINDS[kind]}</DropdownMenuItem>)}</DropdownMenuContent>
    </DropdownMenu>
  </div>}>
    <div className="mb-3 flex items-end justify-between border-b border-border pb-3">
      <div><div className="text-[11px] uppercase tracking-wider text-muted-foreground">Gesamtlaufzeit</div><output aria-label="Gesamtlaufzeit" className="font-mono text-3xl font-bold text-mode-2 text-glow">{formatHMS(totalSetDuration(s.songs))}</output></div>
      <div className="text-right text-xs text-muted-foreground">{s.songs.filter((song) => song.kind === "song").length} Songs<br />{s.songs.filter((song) => song.kind !== "song").length} Marker</div>
    </div>
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <label className="flex items-center gap-1.5 text-xs text-muted-foreground"><input type="checkbox" aria-label="Alle Zeilen auswählen" checked={s.songs.length > 0 && chosen.length === s.songs.length} onChange={(e) => setSelected(e.target.checked ? s.songs.map((song) => song.id) : [])} />{chosen.length ? `${chosen.length} ausgewählt` : "Alle"}</label>
      {chosen.length > 0 && <><Btn onClick={() => changeSongs((songs) => duplicateSongs(songs, chosen))} title="Auswahl duplizieren" aria-label="Auswahl duplizieren"><Copy size={13} /></Btn><Btn onClick={() => { changeSongs((songs) => songs.filter((song) => !chosen.includes(song.id))); setSelected([]); }} tone="danger" title="Auswahl löschen" aria-label="Auswahl löschen"><Trash2 size={13} /></Btn></>}
    </div>
    <ol aria-label="Setlist" className="space-y-2">
      {s.songs.map((song, i) => <li key={song.id} data-song-id={song.id} className={`rounded-lg border p-2 ${dragging === song.id ? "border-mode bg-secondary" : song.kind !== "song" ? "border-dashed border-mode-2/50 bg-panel" : "border-border bg-panel"}`}>
        <div className="flex min-w-0 items-center gap-1.5">
          <input type="checkbox" aria-label={`${song.title || "Zeile"} auswählen`} checked={chosen.includes(song.id)} onChange={(e) => setSelected((ids) => e.target.checked ? [...ids, song.id] : ids.filter((id) => id !== song.id))} />
          <Btn aria-label={`${song.title || "Zeile"} verschieben`} title="Verschieben" className="shrink-0 touch-none cursor-grab p-0.5" onPointerDown={(e) => start(e, song.id, "ol")} onKeyDown={(e) => { if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return; e.preventDefault(); const next = s.songs[i + (e.key === "ArrowUp" ? -1 : 1)]; if (next) reorder(song.id, next.id); }}><GripVertical size={15} /></Btn>
          <span className="w-5 shrink-0 font-mono text-[10px] text-muted-foreground">{song.kind === "song" ? String(s.songs.slice(0, i + 1).filter((x) => x.kind === "song").length).padStart(2, "0") : song.kind === "pause" ? "‖" : song.kind === "encore" ? "★" : "SET"}</span>
          <input aria-label="Titel bearbeiten" className="field min-w-0 flex-1" value={song.title} onChange={(e) => update(song.id, { title: e.target.value })} />
          <DropdownMenu><DropdownMenuTrigger asChild><Btn title="Zeilenaktionen" aria-label={`Aktionen für ${song.title || "Zeile"}`} className="shrink-0 p-1"><MoreHorizontal size={15} /></Btn></DropdownMenuTrigger><DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => changeSongs((songs) => duplicateSongs(songs, [song.id]))}><Copy />Duplizieren</DropdownMenuItem>
            <DropdownMenuSeparator />
            {(Object.keys(KINDS) as Song["kind"][]).filter((kind) => kind !== song.kind).map((kind) => <DropdownMenuItem key={kind} onSelect={() => changeSongs((songs) => songs.map((entry) => entry.id === song.id ? convertSongMarker(entry, kind) : entry))}>{kind === "song" ? "In Song umwandeln" : `In ${KINDS[kind]} umwandeln`}</DropdownMenuItem>)}
            <DropdownMenuSeparator /><DropdownMenuItem onSelect={() => changeSongs((songs) => songs.filter((entry) => entry.id !== song.id))}><Trash2 />Löschen</DropdownMenuItem>
          </DropdownMenuContent></DropdownMenu>
        </div>
        <div className="mt-2 grid grid-cols-[5rem_4rem_4rem_minmax(0,1fr)] items-center gap-1.5">
          {(song.kind === "song" || song.kind === "pause") && <input aria-label="Dauer bearbeiten" className="field font-mono" value={song.duration} placeholder="MM:SS" onChange={(e) => update(song.id, { duration: e.target.value })} />}
          {song.kind === "song" && <><input aria-label="Tonart bearbeiten" className="field" value={song.key} placeholder="Key" onChange={(e) => update(song.id, { key: e.target.value })} /><input aria-label="BPM bearbeiten" className="field" value={song.bpm} placeholder="BPM" onChange={(e) => update(song.id, { bpm: e.target.value })} /></>}
          <input aria-label="Notizen bearbeiten" className={`field min-w-0 ${song.kind === "song" ? "" : "col-span-3"}`} value={song.notes} placeholder="Notizen" onChange={(e) => update(song.id, { notes: e.target.value })} />
        </div>
        {song.kind === "pause" && <div className="mt-2"><BreakTimer duration={song.duration} /></div>}
      </li>)}
    </ol>
    <form ref={addForm} aria-label="Song hinzufügen" onSubmit={(e) => { e.preventDefault(); submit(); }} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submit(); } }} className="mt-4 border-t border-mode/50 pt-3">
      <div className="grid grid-cols-[minmax(0,1fr)_5rem] gap-2">
        <label className="min-w-0 text-[11px] text-muted-foreground">Songtitel<input ref={titleInput} className="field mt-1" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} /></label>
        <label className="text-[11px] text-muted-foreground">Dauer (MM:SS)<input className="field mt-1 font-mono" value={draft.duration} onChange={(e) => setDraft((d) => ({ ...d, duration: e.target.value }))} /></label>
        <label className="text-[11px] text-muted-foreground">Tonart (Key)<input className="field mt-1" value={draft.key} onChange={(e) => setDraft((d) => ({ ...d, key: e.target.value }))} /></label>
        <label className="text-[11px] text-muted-foreground">BPM<input className="field mt-1" value={draft.bpm} onChange={(e) => setDraft((d) => ({ ...d, bpm: e.target.value }))} /></label>
        <label className="col-span-2 text-[11px] text-muted-foreground">Notizen<input className="field mt-1" value={draft.notes} onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))} /></label>
      </div>
      <Btn tone="mode" onClick={submit} className="mt-2"><Plus size={14} /> Hinzufügen</Btn>
    </form>
  </Panel>;
}
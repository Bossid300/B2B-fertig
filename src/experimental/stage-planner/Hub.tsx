import { useState, useRef } from "react";

import {
  FileJson,
  Printer,
  Link2,
  Mic2,
  Building2,
  Download,
  Upload,
  X,
  Copy,
  Save
} from "lucide-react";

import { toast } from "sonner";

import { useHubStorage } from "./hooks/use-hub-storage";
import { ArtistMode } from "./components/hub/ArtistMode";
import { VenueMode } from "./components/hub/VenueMode";
import { SpecSheet } from "./components/hub/SpecSheet";
import { Btn } from "./components/hub/ui";
import { isHubState, HubState, Mode } from "./lib/hub";

export default function Hub() {
  
  const { state, setState, loaded, status, error, save } = useHubStorage();
  const [modal, setModal] = useState<null | "json" | "embed">(null);
  const setMode = (mode: Mode) => setState((s: any) => ({ ...s, mode }))


  return (
    <div data-mode={state.mode} className="h-screen">
      <div className="flex h-screen flex-col bg-background text-foreground print:hidden">
        <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-mode font-mono text-sm font-black text-mode-foreground glow-mode transition-colors duration-500">G</div>
            <div className="leading-tight">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">GigsDA</div>
              <h1 className="text-base font-bold">Rider & Spec Hub</h1>
            </div>
          </div>

          <div role="tablist" className="relative grid grid-cols-2 rounded-full border border-border bg-panel p-1">
            <span className={`absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-mode glow-mode transition-all duration-500 ${state.mode === "artist" ? "left-1" : "left-[calc(50%+3px)]"}`} />
            {([["artist", "Künstler-Modus", Mic2], ["venue", "Location-Modus", Building2]] as const).map(([m, label, Icon]) => (
              <button key={m} role="tab" aria-selected={state.mode === m} onClick={() => setMode(m)}
                className={`relative z-10 flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300 ${state.mode === m ? "text-mode-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Btn onClick={() => setModal("json")}><FileJson size={14} /> JSON</Btn>
            <Btn onClick={() => window.print()}><Printer size={14} /> PDF Druckansicht</Btn>
            <Btn onClick={() => setModal("embed")}><Link2 size={14} /> Profil-Embed</Btn>
            <div className="flex flex-wrap items-center gap-2">
              <span role="status" aria-live="polite" title={error ?? ""} className={`text-[11px] ${status === "saved" ? "text-ok" : status === "error" ? "text-destructive" : status === "dirty" ? "text-warn" : "text-muted-foreground"}`}>
                ● {status === "saved" ? "Gespeichert" : status === "error" ? "Speichern fehlgeschlagen" : status === "dirty" ? "Ungespeicherte Änderungen..." : "Wird geladen..."}
              </span>
              <Btn tone="mode" disabled={!loaded} onClick={() => {
                if (save()) toast.success("Layout & Specs erfolgreich gespeichert!");
                else toast.error("Speichern fehlgeschlagen. Bitte Browserspeicher prüfen und erneut versuchen.");
              }}><Save size={14} /> Speichern</Btn>
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 p-4">
          {state.mode === "artist" ? (
            <ArtistMode s={state.artist} set={(fn: any) => setState((s: any) => ({
  ...s,
  artist: fn(s.artist)
}))} />
          ) : (
            <VenueMode s={state.venue} set={(fn: any) => setState((s: any) => ({
  ...s,
  venue: fn(s.venue)
}))} />
          )}
        </main>
      </div>

      <div className="hidden bg-background p-8 text-foreground print:block print:bg-transparent print:text-inherit">
        <SpecSheet state={state} />
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm print:hidden" onClick={() => setModal(null)}>
          <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl border border-border bg-card glow-mode" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <h2 className="font-semibold">{modal === "json" ? "JSON Import / Export" : "GigsDA Profil-Embed Vorschau"}</h2>
              <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground" aria-label="Schließen"><X size={18} /></button>
            </div>
            <div className="overflow-auto p-5">
              {modal === "json" ? <JsonTools state={state} onLoad={(s) => { setState(s); setModal(null); }} /> : <Embed state={state} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function JsonTools({ state, onLoad }: { state: HubState; onLoad: (s: HubState) => void }) {
  const file = useRef<HTMLInputElement>(null);
  const [err, setErr] = useState("");
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `gigsda-${state.mode}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };
  const importJson = async (f: File) => {
    try {
      const p = JSON.parse(await f.text());
      if (!isHubState(p)) throw new Error();
      onLoad(p);
    } catch { setErr("Datei ist kein gültiges GigsDA-Projekt."); }
  };
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <button onClick={exportJson} className="flex flex-col items-center gap-2 rounded-lg border border-border bg-panel p-6 transition hover:border-mode hover:text-mode">
        <Download size={28} /><span className="font-semibold">Projekt exportieren</span><span className="text-xs text-muted-foreground">Künstler- & Location-Daten als .json</span>
      </button>
      <button onClick={() => file.current?.click()} className="flex flex-col items-center gap-2 rounded-lg border border-border bg-panel p-6 transition hover:border-mode hover:text-mode">
        <Upload size={28} /><span className="font-semibold">Projekt importieren</span><span className="text-xs text-muted-foreground">Gespeicherte .json wiederherstellen</span>
      </button>
      <input ref={file} type="file" accept="application/json,.json" hidden onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} />
      {err && <p className="text-sm text-destructive sm:col-span-2">{err}</p>}
    </div>
  );
}

function Embed({ state }: { state: HubState }) {
  const slug = (state.mode === "artist" ? state.artist.name : state.venue.name).toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const url = `https://gigsda.com/profile/${slug}/${state.mode === "artist" ? "rider" : "spec"}`;
  const [copied, setCopied] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input readOnly className="field font-mono text-xs" value={url} />
        <Btn tone="mode" onClick={() => { navigator.clipboard.writeText(url); setCopied(true); }}><Copy size={14} /> {copied ? "Kopiert" : "Kopieren"}</Btn>
      </div>
      <div className="rounded-lg border-2 border-mode bg-foreground p-6 text-background">
        <SpecSheet state={state} />
      </div>
    </div>
  );
}
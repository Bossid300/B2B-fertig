import React, { useState, useEffect } from 'react';
import { Sliders, Move, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import FahrplanMetrics from './FahrplanMetrics';

export default function StageSpecs({ onBack, progress, onNavigateToStep, onApproveSuccess, activeEvent }) {
  const [isApproved, setIsApproved] = useState(false);
  const [channels, setChannels] = useState([]);
  const [stageElements, setStageElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);

  // Holt die crewIds aus dem aktiven Event
  const crewIds = activeEvent && Array.isArray(activeEvent.crewIds) ? activeEvent.crewIds : [];

  // 📡 DYNAMISCHER KANAL- & BÜHNEN-GENERATOR (Basiert auf Schritt 1)
  useEffect(() => {
    // Grund-Setup: Winston Jud ist als Main-Act IMMER auf der Bühne
    let dynamicChannels = [
      { ch: 1, source: 'Vocals Winston', mic: 'Shure Beta 58A', status: 'bestätigt', crew: 'Jud-Winston' },
      { ch: 2, source: 'E-Guitar Winston', mic: 'Sennheiser e906', status: 'bestätigt', crew: 'Jud-Winston' },
      { ch: 3, source: 'Amp Winston', mic: 'DI-Box Active', status: 'bestätigt', crew: 'Jud-Winston' },
    ];

    let dynamicElements = [
      { id: 'vocals-winston', label: '🎤 Vocals (Winston)', x: 50, y: 70, color: 'bg-emerald-500/20 border-emerald-400 text-emerald-400' },
      { id: 'amp-winston', label: '🎸 Amp Winston', x: 30, y: 40, color: 'bg-purple-500/20 border-purple-400 text-purple-400' },
    ];

    // Wenn "The Neon Sparks" im Team sind -> HipHop-Mics und Bläser-Kanäle hinzufügen!
    if (crewIds.includes('spark')) {
      dynamicChannels.push(
        { ch: 4, source: 'Sparks MC Vocals', mic: 'Wireless Shure SM58', status: 'geprüft', crew: 'spark' },
        { ch: 5, source: 'Brass Sektion (Mix)', mic: 'Clip-Mic AKG', status: 'geprüft', crew: 'spark' }
      );
      dynamicElements.push(
        { id: 'mc-sparks', label: '🎤 MC (Neon Sparks)', x: 65, y: 70, color: 'bg-cyan-500/20 border-cyan-400 text-cyan-400' },
        { id: 'brass-sparks', label: '🎺 Brass Sektion', x: 75, y: 35, color: 'bg-amber-500/20 border-amber-400 text-amber-400' }
      );
    }

    // Wenn Systemtechniker "Daniel Klingelsberger" am Start ist -> Mess-Mikrofon patchen!
    if (crewIds.includes('luna')) {
      dynamicChannels.push({ ch: 6, source: 'Mess-Mic Daniel K.', mic: 'Beyerdynamic MM1', status: 'bestätigt', crew: 'luna' });
    }

    // Kanäle nach Kanalnummer sortieren
    setChannels(dynamicChannels.sort((a, b) => a.ch - b.ch));
    setStageElements(dynamicElements);
  }, [crewIds]);

  const handleApproveAll = () => {
    setIsApproved(true);
    if (typeof onApproveSuccess === 'function') {
      onApproveSuccess(); // Setzt Schritt 2 im globalen Fahrplan auf 100%
    }
  };

  const handleStageClick = (e) => {
    if (selectedElement === null) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - bounds.left) / bounds.width) * 100;
    const y = ((e.clientY - bounds.top) / bounds.height) * 100;

    setStageElements(stageElements.map(el => 
      el.id === selectedElement ? { ...el, x: Math.round(x), y: Math.round(y) } : el
    ));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 my-6 p-4 text-xs text-slate-300 font-mono animate-fade-in">
      
      {/* GLOBALER FAHRPLAN */}
      <FahrplanMetrics progress={progress} activeStep="stage" onNavigate={onNavigateToStep} />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl gap-4">
        <div>
          {activeEvent ? (
            <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-md inline-block mb-1.5">
              📍 Aktives Event: {activeEvent.title} ({activeEvent.date})
            </span>
          ) : (
            <span className="text-[10px] text-cyan-400 font-bold block mb-1">// Ebene 02: Rider-Check</span>
          )}
          <h2 className="text-xl font-bold text-white mt-0.5">StageSpecs & Bühnen-Patching</h2>
          <p className="text-slate-400 text-[11px]">Verifiziere die Kanalliste basierend auf deiner zugesagten Crew.</p>
        </div>
        <button type="button" onClick={onBack} className="bg-slate-950 border border-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">
          ‹ Zurück
        </button>
      </div>

      {/* TWO COLUMN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* KANALLISTE */}
        <div className="md:col-span-7 bg-slate-900/40 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Patchplan ({channels.length} Kanäle)
            </h3>
            <button 
              type="button" 
              onClick={handleApproveAll}
              className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-lg transition-all cursor-pointer ${
                isApproved 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-emerald-400 text-slate-950 hover:bg-emerald-300'
              }`}
            >
              {isApproved ? '✓ Rider verifiziert' : 'Rider absegnen 🔒'}
            </button>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {channels.map((c) => (
              <div key={c.ch} className="bg-slate-950/60 border border-slate-900 rounded-xl p-3 flex justify-between items-center text-[11px]">
                <div className="flex items-center gap-3">
                  <span className="text-slate-600 text-[10px]">CH {String(c.ch).padStart(2, '0')}</span>
                  <span className="text-white font-bold">{c.source}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-[10px]">{c.mic}</span>
                  <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-black ${
                    c.status === 'bestätigt' ? 'bg-emerald-950 text-emerald-400' : 'bg-cyan-950 text-cyan-400'
                  }`}>{c.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VISUELLE BÜHNE */}
        <div className="md:col-span-5 bg-slate-900/40 border border-slate-800 rounded-3xl p-5 space-y-3 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-xs font-bold text-white uppercase border-b border-slate-800/60 pb-2 flex items-center gap-1.5 tracking-wider">
              <Move className="w-3.5 h-3.5 text-purple-400" /> Equipment-Grid
            </h3>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {stageElements.map(el => (
                <button
                  key={el.id}
                  type="button"
                  onClick={() => setSelectedElement(el.id)}
                  className={`px-2 py-1 rounded-lg border text-[9px] uppercase transition-all cursor-pointer ${
                    selectedElement === el.id ? 'border-white bg-slate-800 text-white scale-105' : 'border-slate-800 text-slate-400 bg-slate-950/40'
                  }`}
                >
                  {el.label}
                </button>
              ))}
            </div>
          </div>

          <div onClick={handleStageClick} className="w-full aspect-square bg-slate-950 rounded-2xl border border-slate-900 relative overflow-hidden cursor-crosshair mt-2">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:20px_20px] opacity-40"></div>
            {stageElements.map(el => (
              <div
                key={el.id}
                style={{ left: `${el.x}%`, top: `${el.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 px-2 py-1 rounded-lg border text-[8px] font-black tracking-tight whitespace-nowrap transition-all duration-300 shadow-md ${el.color}`}
              >
                {el.label}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* WEITERLEITUNGSMASKIERUNG */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => onNavigateToStep && onNavigateToStep('contract')}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-6 h-11 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
        >
          Nächster Meilenstein: Zusage-Deal ➔
        </button>
      </div>

    </div>
  );
}

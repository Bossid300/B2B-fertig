import React, { useState } from 'react';
import { Building, MapPin, Star, Sliders, ArrowLeft, Zap, Utensils, Lightbulb, DollarSign, Scale } from 'lucide-react';

export default function LocationProfile({ onBack, onStartPlanning }) {
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [selectedTech, setSelectedTech] = useState(null);

  const venue = {
    name: "Backstage Halle",
    type: "LOCATION // CLUB & HALLE",
    location: "München, Deutschland",
    bio: "Legendärer Live-Club mit industriellem Vibe. Perfekt ausgestattet für Rock-, Metal- und Indie-Konzerte. Wir unterstützen die unkomplizierte Self-Organization von Nachwuchsbands.",
    stats: { events: 148, rating: "4.8", maxCapacity: 400 },
    
    // NEU: GAGEN- UND BUDGET STRUKTUR AUS DEM PDF
    budgetSpecs: [
      { label: "Standard-Festgage", value: "300 € - 600 € (Je nach Wochentag & Genre)" },
      { label: "Doordeal-Option", value: "70% Band / 30% Club (Ab dem 50. zahlenden Gast)" },
      { label: "Technik-Pauschale", value: "0 € — Haustechniker & PA sind immer im Club-Budget enthalten" }
    ]
  };

  const powerOutlets = [
    { id: 1, label: '🔴 CEE 32A', x: '15%', y: '20%', info: 'Für Licht-Dimmer / Main-Rack' },
    { id: 2, label: '🔵 CEE 16A', x: '15%', y: '50%', info: 'Reiner Sound-Starkstrom' },
    { id: 3, label: '🔌 Schuko 1', x: '40%', y: '30%', info: 'Backline Links (Gitarre)' },
    { id: 4, label: '🔌 Schuko 2', x: '50%', y: '20%', info: 'Drums Center (Schlagzeug)' }
  ];

  const techHardware = [
    { id: 1, label: '🔊 Main PA L', x: '10%', y: '85%', info: 'D&B Line-Array Hauptlautsprecher Links' },
    { id: 2, label: '🔊 Main PA R', x: '90%', y: '85%', info: 'D&B Line-Array Hauptlautsprecher Rechts' },
    { id: 4, label: '💡 Moving Head 1', x: '25%', y: '15%', info: 'Traverse Oben: Spot für Gitarrist' },
    { id: 6, label: '🔊 Stage Monitor', x: '50%', y: '70%', info: 'Boden-Monitor Box für Lead-Gesang' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 my-6 p-4">
      {/* CARD HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-cyan-400 to-emerald-400" />
        <div className="flex justify-between items-center mb-6">
          <button type="button" onClick={onBack} className="flex items-center gap-2 text-xs text-slate-500 hover:text-white"><ArrowLeft className="w-4 h-4" /> Zurück</button>
          <button type="button" onClick={onStartPlanning} className="bg-cyan-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl">📅 Gig anfragen</button>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-5 justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400"><Building /></div>
            <div>
              <h2 className="text-2xl font-black text-white">{venue.name}</h2>
              <p className="text-xs text-cyan-400 font-mono">{venue.type}</p>
            </div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-center text-xs font-mono">
            <span className="text-slate-400">Kapazität: </span><span className="text-emerald-400 font-bold">{venue.stats.maxCapacity} Pax</span>
          </div>
        </div>
      </div>

      {/* NEU: BUDGET TRANSPARENZ BOARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Finanz- & Budgetrahmen (Vorverhandlung)</h3>
            <p className="text-[10px] text-slate-500 font-mono">Transparente Konditionen für faire Gigs</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {venue.budgetSpecs.map((spec, i) => (
            <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">{spec.label}</span>
              <span className="text-xs font-bold text-emerald-400 font-mono block">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* DREI-SPALTEN INFOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <h4 className="font-bold text-white flex items-center gap-1 border-b border-slate-800 pb-1"><Zap className="w-3.5 h-3.5 text-amber-400" /> Strom-Specs</h4>
          <p className="text-slate-400">12x Schuko-Phasen auf Bühne verteilt. CEE 16A + CEE 32A Anschlüsse vorhanden.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <h4 className="font-bold text-white flex items-center gap-1 border-b border-slate-800 pb-1"><Sliders className="w-3.5 h-3.5 text-cyan-400" /> Ton & Licht</h4>
          <p className="text-slate-400">D&B Line-Array Sound-Anlage & 16x Moving Heads einsatzbereit vor Ort.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <h4 className="font-bold text-white flex items-center gap-1 border-b border-slate-800 pb-1"><Utensils className="w-3.5 h-3.5 text-emerald-400" /> Catering</h4>
          <p className="text-slate-400">Getränke/Snacks im Backstage-Raum. Warme Küche per Foodtruck extern erlaubt.</p>
        </div>
      </div>

      {/* VISUELLER STROMPLAN VISUELL */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" /> Visueller Stromverteilungsplan (Top-View)</h3>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl h-[160px] relative overflow-hidden bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:16px_16px]">
            {powerOutlets.map((o) => (
              <button
                key={o.id} type="button" onClick={() => setSelectedOutlet(selectedOutlet === o.id ? null : o.id)}
                style={{ top: o.y, left: o.x }}
                className={`absolute px-2 py-1 rounded-lg text-[9px] font-mono font-bold -translate-x-1/2 -translate-y-1/2 border ${selectedOutlet === o.id ? 'bg-amber-400 text-slate-950 border-amber-400 font-black z-10' : 'bg-slate-900 border-slate-700 text-slate-300'}`}
              >
                {o.label}
              </button>
            ))}
          </div>
          <div className="md:col-span-4 space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
            {powerOutlets.map((o) => (
              <button key={o.id} type="button" onClick={() => setSelectedOutlet(selectedOutlet === o.id ? null : o.id)} className={`w-full p-2 rounded-xl text-left border text-[11px] ${selectedOutlet === o.id ? 'bg-amber-400/10 border-amber-400 text-amber-400 font-bold' : 'bg-slate-950/40 border-slate-800 text-slate-500'}`}>
                <div>{o.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* INTERAKTIVER LICHT & AUDIO PLAN */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2"><Lightbulb className="w-4 h-4 text-cyan-400" /> Visueller Licht- & Tonbelegungsplan</h3>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl h-[160px] relative overflow-hidden bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:16px_16px]">
            {techHardware.map((t) => (
              <button
                key={t.id} type="button" onClick={() => setSelectedTech(selectedTech === t.id ? null : t.id)}
                style={{ top: t.y, left: t.x }}
                className={`absolute px-2 py-1 rounded-lg text-[9px] font-mono font-bold -translate-x-1/2 -translate-y-1/2 border ${selectedTech === t.id ? 'bg-cyan-400 text-slate-950 border-cyan-400 font-black z-10' : 'bg-slate-900 border-slate-700 text-blue-400'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="md:col-span-4 space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
            {techHardware.map((t) => (
              <button key={t.id} type="button" onClick={() => setSelectedTech(selectedTech === t.id ? null : t.id)} className={`w-full p-2 rounded-xl text-left border text-[11px] ${selectedTech === t.id ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 font-bold' : 'bg-slate-950/40 border-slate-800 text-slate-500'}`}>
                <div>{t.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

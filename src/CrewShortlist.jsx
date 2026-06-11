import React, { useState, useEffect } from 'react';
import FahrplanMetrics from './FahrplanMetrics';
import CommunityChat from './CommunityChat';

export default function CrewShortlist({ onBack, progress, onNavigateToStep, activeEvent, setFavorites }) {
  const radarDatabase = [
    { id: "Jud-Winston", name: "Winston Jud", role: "Künstler // Main-Act (Rock)" },
    { id: "spark", name: "The Neon Sparks", role: "Künstler // Support (HipHop)" },
    { id: "luna", name: "Daniel Klingelsberger", role: "Licht- & Tonsystemtechnik" },
    { id: "cyber", name: "Stadtpark OpenAir (Braunau)", role: "Location // Hauptbühne" },
    { id: "audiorent", name: "AudioRent Group", role: "PA & Tonsystem-Verleih" },
    { id: "backline", name: "Backline Support", role: "Instrumentenverleih" }
  ];

  const [statuses, setStatuses] = useState({});
  // ⚡ DIE CRASH-PROTECTION: Fängt leere Events beim ersten Laden der Kachel sicher ab!
  const crewIds = activeEvent?.crewIds && Array.isArray(activeEvent.crewIds) ? activeEvent.crewIds : [];
  const currentCrew = Array.isArray(radarDatabase) ? radarDatabase.filter(m => m && m.id && crewIds.includes(m.id)) : [];

  // 🚦 DER INTERAKTIVE VERHANDLUNGS-SIMULATOR
  useEffect(() => {
    currentCrew.forEach(member => {
      if (!statuses[member.id]) {
        setStatuses(prev => ({ ...prev, [member.id]: { state: 'pending', note: 'Anfrage läuft. Warte auf Rückmeldung...' } }));
        setTimeout(() => {
          const isAccepted = Math.random() > 0.3;
          setStatuses(prev => ({ ...prev, [member.id]: { state: isAccepted ? 'confirmed' : 'rejected', note: isAccepted ? '✓ Partner hat angenommen! Deal verriegelt.' : '✕ Partner hat abgelehnt.' } }));
        }, 4000);
      }
    });
  }, [crewIds]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 my-6 p-4 text-xs text-slate-300 font-mono animate-fade-in">
      
      {/* GLOBALER FAHRPLAN */}
      <FahrplanMetrics progress={progress} activeStep="shortlist" onNavigate={onNavigateToStep} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl gap-4">
        <div>
          {activeEvent ? (
            <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-md inline-block mb-1.5 whitespace-normal break-words max-w-full">
              📍 Aktives Event: {activeEvent.title} ({activeEvent.date})
            </span>
          ) : (
            <span className="text-[10px] text-cyan-400 font-bold block mb-1">// Ebene 01: Crew-Zentrale</span>
          )}
          <h2 className="text-xl font-bold text-white mt-0.5">Crew-Shortlist & Ampelstatus</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row md:flex-row gap-2 w-full md:w-auto shrink-0">
          <button type="button" onClick={() => onNavigateToStep('search')} className="w-full md:w-auto bg-cyan-400 text-slate-950 font-black px-4 h-10 rounded-xl text-[10px] uppercase animate-pulse flex items-center justify-center">📡 Crew im Radar suchen</button>
          <button type="button" onClick={onBack} className="w-full md:w-auto bg-slate-950 border border-slate-800 text-slate-300 px-4 h-10 rounded-xl text-xs font-bold flex items-center justify-center">‹ Dashboard</button>
        </div>
      </div>

      <div className="space-y-4">
        {currentCrew.length > 0 ? (
          currentCrew.map(member => {
            const current = statuses[member.id] || { state: 'pending', note: 'Signal verarbeitet...' };
            return (
              <div key={member.id} className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 shadow-xl">
                <div className="flex items-center gap-5 flex-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${current.state === 'confirmed' ? 'bg-emerald-500' : current.state === 'rejected' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'}`} />
                  <div>
                    <h4 className="text-sm font-black text-white">{member.name}</h4>
                    <p className="text-[10px] text-slate-500 uppercase">{member.role}</p>
                  </div>
                </div>
                <p className="text-slate-400 text-[10px] bg-slate-950/40 border border-slate-900 px-3 py-2 rounded-xl flex-1 max-w-md">// {current.note}</p>
                <button type="button" onClick={() => { if (typeof setFavorites === 'function') setFavorites(crewIds.filter(id => id !== member.id)); }} className="bg-slate-950 border border-slate-00 text-slate-600 hover:text-rose-400 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm">✕</button>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-slate-900/20 border border-dashed border-slate-900 rounded-3xl text-slate-600">Keine aktiven Buchungsanfragen gesendet. Klicke auf "Crew im Radar suchen".</div>
        )}
      </div>
    {/* 🔊 GIGSDA COMMUNITY FUNKRAUM */}
    <div className="mt-8 bg-slate-950/40 border border-slate-900/60 rounded-2xl p-4 shadow-xl">
      <div className="text-[9px] text-slate-500 uppercase tracking-widest font-black mb-3 border-b border-slate-900 pb-1.5">// GIGSDA COMMUNITY FUNKRAUM</div>
      <CommunityChat />
    </div>
    </div>
  );
}
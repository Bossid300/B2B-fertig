import React, { useState, useEffect } from 'react';
import CommunityChat from './CommunityChat'; // Falls euer Chat so heißt, ansonsten bleibt Daniels Import aktiv
import FahrplanMetrics from './FahrplanMetrics';

export default function CrewShortlist({ onBack, progress, onNavigateToStep, activeEvent }) {
  // 📡 REALTIME DB-INJEKTION: Holt die frisch hinzugefügten Favoriten aus dem Speicher
  const [dbCrew, setDbCrew] = useState([]);

  useEffect(() => {
    const loadRealtimeCrew = () => {
      try {
        const savedEvents = JSON.parse(localStorage.getItem('gigsda_events') || localStorage.getItem('gigsda_projects') || '[]');
        // Sucht das aktuell geöffnete Event anhand der übergebenen ID heraus
        const targetId = activeEvent?.id || activeEvent?.eventId || activeEvent?._id;
        const matchedEvent = savedEvents.find(ev => ev && (ev.id === targetId || ev.eventId === targetId || ev._id === targetId));
        
        if (matchedEvent && matchedEvent.crew) {
          setDbCrew(matchedEvent.crew);
        } else {
          setDbCrew([]);
        }
      } catch (e) {
        console.error("Fehler beim Live-Crew-Load:", e);
      }
    };

    loadRealtimeCrew();
    // Horcht auf unsere globalen Funksprüche, um die Liste in derselben Millisekunde upzudaten!
    window.addEventListener('request-sent', loadRealtimeCrew);
    window.addEventListener('route-change', loadRealtimeCrew);
    return () => {
      window.removeEventListener('request-sent', loadRealtimeCrew);
      window.removeEventListener('route-change', loadRealtimeCrew);
    };
  }, [activeEvent]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-950 border border-slate-900 rounded-3xl font-mono text-white shadow-2xl relative">
      {/* GLOBALER FAHRPLAN */}
      <FahrplanMetrics progress={progress} activeStep="shortlist" onNavigate={onNavigateToStep} />

      {/* HEADER BEREICH */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-900 pb-4 mb-6 gap-4">
        <div>
          <span className="text-[8px] bg-cyan-500/10 border border-cyan-500 text-cyan-400 font-bold px-2 py-0.5 rounded-md uppercase tracking-widest">
            // Ebene 01: Crew-Zentrale
          </span>
          <h2 className="text-xl font-bold text-white mt-0.5">Crew-Shortlist & Ampelstatus</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0 font-bold text-[9px] uppercase">
          <button 
            type="button" 
            onClick={() => onNavigateToStep('search')} 
            className="px-4 py-2 bg-cyan-500 text-slate-950 hover:bg-cyan-400 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            # CREW IM RADAR SUCHEN
          </button>
          <button 
            type="button" 
            onClick={onBack} 
            className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
          >
            ‹ Dashboard
          </button>
        </div>
      </div>

      {/* 📊 DYNAMISCHER CREW-INJEKTIONS-POOL (EXAKT IN DER ZENTRALEN BOX) */}
      <div className="space-y-4">
        {dbCrew && dbCrew.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono w-full text-left animate-fade-in">
            {dbCrew.map((member, idx) => {
              if (!member) return null;
              
              // 🟢🔴🟡 AMPELSTATUS LOGIK FÜR DAS B2B-DASHBOARD
              const status = (member.status || 'pending').trim().toLowerCase();
              let statusColor = "text-amber-400 border-amber-500/30 bg-amber-500/5";
              let statusLabel = "⏳ PENDING";

              if (status === 'accepted' || status === 'gebucht') {
                statusColor = "text-emerald-400 border-emerald-500/30 bg-emerald-500/5";
                statusLabel = "🟢 ACCEPTED";
              } else if (status === 'declined' || status === 'absage') {
                statusColor = "text-red-400 border-red-500/30 bg-red-500/5";
                statusLabel = "🔴 DECLINED";
              } else if (status === 'counter_offer' || status === 'gegenangebot') {
                statusColor = "text-cyan-400 border-cyan-500/30 bg-cyan-500/5";
                statusLabel = "⚡ COUNTER";
              }

              return (
                <div key={idx} className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-2xl relative overflow-hidden group">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[7px] bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-bold uppercase tracking-wider">
                        {member.role || 'Gewerk'}
                      </span>
                      <span className={`text-[7px] border px-1.5 py-0.5 rounded font-black tracking-widest uppercase ${statusColor}`}>
                        {statusLabel}
                      </span>
                    </div>
                    <h3 className="text-xs font-black text-white uppercase tracking-wide pt-1">
                      {member.name}
                    </h3>
                  </div>
                  <div className="text-[8px] text-slate-500 italic bg-slate-950 border border-slate-900/60 p-2 rounded-xl">
                    ✓ Aus Favoritenliste zugewiesen. Realtime B2B-Uhrwerk aktiv.
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-900/20 border border-slate-900/60 border-dashed rounded-3xl text-slate-600 text-[10px] font-mono uppercase tracking-widest">
            // Keine aktiven Buchungsanfragen gesendet. Klicke auf "Crew im Radar suchen".
          </div>
        )}
      </div>

      {/* 📡 GIGSDA COMMUNITY FUNKRAUM */}
      <div className="mt-8 bg-slate-950/40 border border-slate-900/60 rounded-2xl p-4 shadow-xl">
        <div className="text-[9px] text-slate-500 uppercase tracking-widest font-black mb-3 border-b border-slate-900 pb-1.5">
          // COMMUNITY CHAT AREA
        </div>
        <CommunityChat />
      </div>

    </div>
  );
}

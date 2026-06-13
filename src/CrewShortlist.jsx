import React, { useState, useEffect } from 'react';
import CommunityChat from './CommunityChat'; // Falls euer Chat so heißt, ansonsten bleibt Daniels Import aktiv
import FahrplanMetrics from './FahrplanMetrics';

export default function CrewShortlist({ onBack, progress, onNavigateToStep, activeEvent }) {
  // 📡 REALTIME DB-INJEKTION: Holt die frisch hinzugefügten Favoriten aus dem Speicher
  const [dbCrew, setDbCrew] = useState([]);

  // 📡 UNZERSTÖRBARER HIGH-SPEED LIVE-CREW LOAD (STRIKTE REAKTIVE EVENT-ISOLIERUNG)
  useEffect(() => {
    const loadRealtimeCrew = () => {
      try {
        const savedEvents = JSON.parse(localStorage.getItem('gigsda_events') || '[]');
        
        let targetId = activeEvent?.id || activeEvent?.eventId || activeEvent?._id;
        let targetTitle = activeEvent?.title || activeEvent?.name || "";
        
        // Holt das aktive Projekt frisch und reaktiv aus dem LocalStorage
        const activeData = localStorage.getItem('gigsda_active_event');
        if (activeData) {
          const parsedActive = JSON.parse(activeData);
          if (!targetId) targetId = parsedActive.id;
          if (!targetTitle) targetTitle = parsedActive.title;
        }

        const cleanTargetTitle = typeof targetTitle === 'string' ? targetTitle.trim().toLowerCase() : "";

        // 🚨 MESSSERSCHARFE TRENNUNG: Findet NUR das exakt passende Event über ID oder exakten Titel
        const matchedEvent = savedEvents.find(ev => {
          if (!ev) return false;
          
          const evId = ev.id || ev.eventId || ev._id;
          const evTitle = (ev.title || ev.name || "").trim().toLowerCase();
          
          const idMatch = targetId && evId && String(evId) === String(targetId);
          const titleMatch = cleanTargetTitle && evTitle && evTitle === cleanTargetTitle;
          
          return idMatch || titleMatch;
        });
        
        // Wenn das Event gefunden wurde, laden wir SEINE Crew. Wenn nicht, bleibt die Liste LEER!
        if (matchedEvent && matchedEvent.crew && Array.isArray(matchedEvent.crew)) {
          setDbCrew(matchedEvent.crew);
        } else {
          setDbCrew([]);
        }
      } catch (e) {
        console.error("Fehler beim projektspezifischen Live-Crew-Load:", e);
      }
    };

    loadRealtimeCrew();
    
    // Horcht auf unsere globalen Funksprüche, um die Kacheln live und reaktiv mitzureißen!
    window.addEventListener('request-sent', loadRealtimeCrew);
    window.addEventListener('route-change', loadRealtimeCrew);
    return () => {
      window.removeEventListener('request-sent', loadRealtimeCrew);
      window.removeEventListener('route-change', loadRealtimeCrew);
    };
  }, [activeEvent]);


    // 🗑️ REAKTIVE CANCELLATION ENGINE: Wirft ein Mitglied bei Ausfall sofort aus dem Projekt-Array!
  const handleRemoveMember = (memberName) => {
    if (!window.confirm(`Möchtest du ${memberName} wirklich aus diesem B2B-Projekt entfernen?`)) return;

    try {
      const savedEvents = JSON.parse(localStorage.getItem('gigsda_events') || '[]');
      
      // Holt die aktive Event-ID millimetergenau aus dem Speicher
      let targetId = activeEvent?.id || activeEvent?.eventId || activeEvent?._id;
      if (!targetId) {
        const activeData = localStorage.getItem('gigsda_active_event');
        if (activeData) {
          const parsedActive = JSON.parse(activeData);
          targetId = parsedActive.id;
        }
      }

      const eventIndex = savedEvents.findIndex(ev => ev && (ev.id === targetId || ev.eventId === targetId || ev._id === targetId));

      if (eventIndex > -1 && savedEvents[eventIndex].crew) {
        // Filtert das ausgewählte Mitglied knallhart aus der Crewliste heraus!
        savedEvents[eventIndex].crew = savedEvents[eventIndex].crew.filter(
          m => m && m.name && m.name.toLowerCase() !== memberName.toLowerCase()
        );

        // Schreibt den gesäuberten Stand zurück auf die Festplatte
        localStorage.setItem('gigsda_events', JSON.stringify(savedEvents));

        // Feuert die globalen Live-Funksprüche für die sofortige reaktive UI-Aktualisierung ohne F5!
        window.dispatchEvent(new CustomEvent('request-sent'));
        window.dispatchEvent(new CustomEvent('route-change'));
        
        console.log(`✓ B2B-Stornierung: ${memberName} wurde restlos aus dem Projekt gelöscht!`);
      }
    } catch (e) {
      console.error("Fehler beim Entfernen des Crew-Mitglieds:", e);
    }
  };


  return (
    <div className="max-w-4xl mx-auto space-y-6 my-6 p-4 text-xs text-slate-300 font-mono animate-fade-in">
      
      {/* 📊 GLOBALER B2B-FORTSCHRITTS-FAHRPLAN (DIREKT IM COCKPIT INTEGRIERT) */}
      <FahrplanMetrics progress={progress} activeStep="shortlist" onNavigate={onNavigateToStep} />


      {/* HEADER BEREICH */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl gap-4">
        <div>
          <span className="text-[8px] bg-cyan-500/10 border border-cyan-500 text-cyan-400 font-bold px-2 py-0.5 rounded-md uppercase tracking-widest">
            // Ebene 01: Crew-Zentrale
          </span>
          <h2 className="text-xl font-bold text-white mt-0.5">Crew-Shortlist & Ampelstatus</h2>
          {/* 🚨 REKTIVES PROJEKT-BADGE DIREKT UNTER DER ÜBERSCHRIFT */}
          <div className="bg-slate-950/90 border border-cyan-500/30 px-3 py-1.5 rounded-xl flex items-center gap-2 w-max shadow-[0_0_15px_rgba(6,182,212,0.05)] text-[10px]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
            </span>
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px]">// ACTIVE TARGET:</span>
            <span className="font-black text-cyan-400 uppercase tracking-wide">
              {(() => {
                try {
                  const activeData = localStorage.getItem('gigsda_active_event');
                  if (activeData) return JSON.parse(activeData).title || "WAYNESTOCK 2";
                } catch(e) {}
                return activeEvent?.title || activeEvent?.name || "WAYNESTOCK 2";
              })()}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0 font-bold text-[9px] uppercase">
          {/* 📡 DIE REPARIERTEN B2B EXPRESS-NAVIGATOREN */}
          <button 
            type="button" 
            onClick={() => {
              if (typeof onNavigateToStep === 'function') onNavigateToStep('search');
              else if (typeof setView === 'function') setView('search');
            }} 
            className="px-3 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            # RADAR SEARCH Explorer
          </button>

          {/* ⭐ SAUBERER UND ABGESICHERTER FAVORITEN-POOL NAVIGATOR */}
          <button 
            type="button" 
            onClick={() => {
              if (typeof onNavigateToStep === 'function') {
                onNavigateToStep('crewfavoriten'); // 🚨 DYNAMISCH: Trifft exakt Daniels Key aus Zeile 563!
              } else if (typeof setView === 'function') {
                setView('crewfavoriten'); 
              }
            }} 
            className="px-3 py-2 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-cyan-500/40 hover:border-cyan-400 text-cyan-400 hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.05)] font-bold font-mono"
          >
            ⭐ ZUM FAVORITEN-POOL
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
                  <div className="flex justify-between items-start pt-1 gap-2">
                    <h3 className="text-xs font-black text-white uppercase tracking-wide">
                      {member.name}
                    </h3>
                    
                    {/* ✕ REAKTIVER B2B-STORNO-HEBEL */}
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.name)}
                      className="text-[10px] text-slate-600 hover:text-red-400 font-bold px-1.5 py-0.5 rounded-md hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer font-mono shrink-0"
                      title="Aus Projekt stornieren"
                    >
                      ✕
                    </button>
                  </div>
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

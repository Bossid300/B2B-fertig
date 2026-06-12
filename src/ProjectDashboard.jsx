import React, { useState, useEffect } from 'react';
import ManagerOverview from './ManagerOverview';
import CreateEventForm from './CreateEventForm';
import CommunityChat from './CommunityChat';
import IncomingMessages from './IncomingMessages';


export default function ProjectDashboard({ onNavigateToStep, progress, onSelectEvent, events: propsEvents, onCreateEvent, ticketName }) {
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  
  // Lädt die Events direkt aus dem Speicher oder nutzt die 3 Standard-Shows
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('gigsda_events');
    return saved ? JSON.parse(saved) : [
      { id: "EVT-2026-01", title: "Winston Jud Live", type: "Clubshow", date: "Fr, 18. Sept 2026", doneProgress: 35, text: "Crew-Shortlist befüllt. Warte auf technischen Rider-Abgleich.", venue: "Backstage Halle", crewIds: ["Jud-Winston", "spark", "luna"] },
      { id: "EVT-2026-02", title: "Winston Jud OpenAir", type: "Festival", date: "Sa, 15. Aug 2026", doneProgress: 0, text: "Event frisch initialisiert. Starte die Crew-Suche im Radar.", venue: "Stadtpark Wiese, Braunau", crewIds: [] },
      { id: "EVT-2026-03", title: "Winston Jud @ The Jazz Cave", type: "Clubshow", date: "Sa, 10. Okt 2026", doneProgress: 100, text: "Alle Meilensteine verriegelt. Live-Countdown läuft im Netz.", venue: "The Jazz Cave", crewIds: ["Jud-Winston", "cyber"] }
    ];
  });

  // Hält den lokalen Zustand synchron mit der App.jsx Festplatte
  useEffect(() => {
    localStorage.setItem('gigsda_events', JSON.stringify(events));
  }, [events]);

  // 🗑️ LÖSCHT DAS EVENT NUN AUCH DIREKT VON DER FESTPLATTE
  const handleDelete = (eventId, e) => {
    e.stopPropagation();
    if (window.confirm("Möchtest du dieses Event wirklich unwiderruflich aus deinem Dashboard löschen? 🗑️")) {
      const remaining = events.filter(evt => evt.id !== eventId);
      setEvents(remaining);
      localStorage.setItem('gigsda_events', JSON.stringify(remaining));
    }
  };

  return (
    <div className="space-y-6 my-6 max-w-4xl mx-auto text-slate-300 text-xs font-mono animate-fade-in">
      
      {/* 📊 DIE NEUE MANAGER-KOMMANDOZENTRALE */}
      <ManagerOverview />
      {/* Ab hier folgt eure originale Überschrift "Übersicht deiner Events" und die .map-Schleife ... */}
      <div className="flex justify-between items-center border-b border-slate-900 pb-1.5 mb-4">
        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black">// Ubersicht deiner Events</span>
      </div>

      {isCreatingEvent ? (
        <CreateEventForm 
          onBack={() => setIsCreatingEvent(false)} 
          onCreateEvent={(newEvent) => {
            const fresh = {
              id: newEvent.id || "EVT-" + Date.now().toString().slice(-4),
              title: `${newEvent.title}`,
              date: newEvent.date,
              type: newEvent.category === 'Festivals' ? 'Festival' : newEvent.category === 'OpenAirs' ? 'Open Air' : 'Clubshow',
              text: `Event frisch angelegt. Starte die Crew-Suche im Radar.`,
              venue: newEvent.venue || "Stadtpark Wiese, Braunau",
              doneProgress: 0,
              crewIds: [] // Startet jungfräulich für sein eigenes Team!
            };
            
            // 💾 DER FESTPLATTEN-SPEICHER FÜR NEUE EVENTS
            const updatedList = [fresh, ...events];
            setEvents(updatedList);
            localStorage.setItem('gigsda_events', JSON.stringify(updatedList));

            // Synchronisiert das neue Event hoch zur Hauptleitung (App.jsx)
            if (onCreateEvent) onCreateEvent(fresh); 
            setIsCreatingEvent(false);
          }}
        />
      ) : (
        <>
                  {/* 🎛️ GLOBALER EXPRESS-ACCESS ZUR RIDER- & GEWERKEZENTRALE */}
        <button 
          type="button"
          onClick={() => {
            if (typeof onNavigateToStep === 'function') {
              onNavigateToStep('riderzentrale');
            } else if (typeof setView === 'function') {
              setView('riderzentrale');
            }
          }}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border border-cyan-500/40 hover:border-cyan-400 text-cyan-400 hover:text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-mono shadow-[0_0_15px_rgba(6,182,212,0.1)] mr-2"
        >
          <span>🎛️ RIDER- & GEWERKEZENTRALE</span>
        </button>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">// Backstage-Ebene</span>
                <h2 className="text-xl font-bold text-white mt-0.5">Übersicht deiner Events</h2>
              </div>
              <button type="button" onClick={() => setIsCreatingEvent(true)} className="bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl text-[11px] uppercase tracking-wider shadow-[0_0_15px_rgba(52,211,153,0.2)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                ✨ Neues Event erstellen
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {events.map((evt) => {
              // Dynamische Prozentberechnung basierend auf der echten Team-Auswahl für dieses Event
              const totalTeamSize = Array.isArray(evt.crewIds) ? evt.crewIds.length : 0;
              const dynamicProgress = totalTeamSize > 0 ? Math.min(100, Math.round((totalTeamSize / 4) * 100)) : 0;

              return (
                <div key={evt.id} className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-800 transition-all shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center font-black border text-xs ${
                      dynamicProgress === 100 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                    }`}>
                      {dynamicProgress}%
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase font-bold">#{evt.id} // {evt.type}</span>
                      <h4 className="text-sm font-black text-white mt-0.5">{evt.title}</h4>
                      <p className="text-[10px] text-slate-400 font-sans mt-0.5">📍 Ort: {evt.venue} ({evt.date})</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                    {/* DEIN ECHTER LÖSCH-HEBEL PRO EVENT */}
                    <button
                      type="button"
                      title="Dieses Event unwiderruflich löschen"
                      onClick={(e) => handleDelete(evt.id, e)}
                      className="bg-slate-950 border border-slate-900 text-slate-600 hover:text-rose-400 hover:border-rose-950/50 w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 font-mono font-bold text-sm shrink-0 cursor-pointer"
                    >
                      ✕
                    </button>

                    <button 
                      type="button"
                      // ⚡ DIE ABSOLUT CRASHSICHERE DATENBANK-BRÜCKE
                      onClick={() => {
                        try {
                          if (typeof onSelectEvent === 'function' && evt) {
                            onSelectEvent(evt);
                            
                            // 📡 Schaltet dieses Projekt plattformweit scharf für den Search-Explorer!
                            localStorage.setItem('gigsda_active_event', JSON.stringify({
                              id: evt.id || evt.eventId || evt._id,
                              title: evt.title || evt.name
                            }));
                          }
                          if (typeof onNavigateToStep === 'function') {
                            onNavigateToStep('shortlist'); 
                          }
                        } catch (error) {
                          console.error("Navigation blockiert:", error);
                          if (typeof onNavigateToStep === 'function') {
                            onNavigateToStep('projects'); // Fallback: Zurück zum sicheren Dashboard
                          }
                        }
                      }}
                      className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg transition-colors"
                    >
                      Konfigurieren ⚙️
                    </button>


                  </div>
                </div>
              );
            })}
          </div>

          {/* 🔊 GIGSDA COMMUNITY FUNKRAUM */}
          <div className="mt-8 bg-slate-950/40 border border-slate-900/60 rounded-2xl p-4 shadow-xl">
            <div className="text-[9px] text-slate-500 uppercase tracking-widest font-black mb-3 border-b border-slate-900 pb-1.5">// GIGSDA COMMUNITY FUNKRAUM</div>
            <CommunityChat />
          </div>
          <div>
          {/* 📥 DEIN NEUER POSTEINGANG (PERFEKT UNTER DER EVENT-LISTE PLATZIERT) */}
            <IncomingMessages />   
          </div>
        </>
      )}
    </div>
  );
}
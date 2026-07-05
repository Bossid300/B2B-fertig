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

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const loadRequests = () => {
      try {
        const data = JSON.parse(localStorage.getItem('gigsda_crew_requests') || '[]');
        setRequests(data);
      } catch (e) {
        console.error("Fehler beim Laden der Requests:", e);
      }
    };

    loadRequests();

    window.addEventListener('request-sent', loadRequests);
    return () => window.removeEventListener('request-sent', loadRequests);
  }, []);


  const currentUserName = localStorage.getItem('gigsda_user_name');
  const profiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');

  const currentProfile = profiles.find(p =>
    (p.name || '').toLowerCase() === (currentUserName || '').toLowerCase()
  );

  const currentUserId = currentProfile?.id;

  const visibleEvents = events.filter(evt =>
    !evt.ownerId || 
    evt.ownerId === currentUserId ||
    evt.crewIds?.includes(currentUserId)
  );

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
              const currentUserName = localStorage.getItem('gigsda_user_name');
              const profiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');
              const currentProfile = profiles.find(p =>
                (p.name || '').toLowerCase() === (currentUserName || '').toLowerCase()
              );
              const currentUserId = currentProfile?.id

              const fresh = {
              id: newEvent.id || "EVT-" + Date.now().toString().slice(-4),
              title: `${newEvent.title}`,
              date: newEvent.date,
              type: newEvent.category === 'Festivals' ? 'Festival' : newEvent.category === 'OpenAirs' ? 'Open Air' : 'Clubshow',
              text: `Event frisch angelegt. Starte die Crew-Suche im Radar.`,
              venue: newEvent.venue || "Stadtpark Wiese, Braunau",
              doneProgress: 0,
              ownerId: currentUserId,
              crewIds: [currentUserId]

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
            {visibleEvents.map((evt) => {
              const ownerName = (profiles || []).find(p =>
                (p.id || "").toLowerCase() === (evt.ownerId || "").toLowerCase()
              )?.name || "Unbekannt";

              const teamSize = evt.crewIds?.length || 0;
              // Dynamische Prozentberechnung basierend auf der echten Team-Auswahl für dieses Event
              const totalTeamSize = Array.isArray(evt.crewIds) ? evt.crewIds.length : 0;
              const dynamicProgress = totalTeamSize > 0 ? Math.min(100, Math.round((totalTeamSize / 4) * 100)) : 0;

              const openRequests = requests.filter(r =>
                (r.status === "pending" || r.status === "counter_offer") &&
                r.eventName === evt.title
              );

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
                      <p className="text-[10px] text-slate-400">
                        👥 {teamSize} Crew • von {ownerName}
                      </p>

                      <p className="text-[10px] text-slate-400">
                        📍 Ort: {evt.venue} ({evt.date})
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">

                    {/* 🔴 INCOMMING REQUEST KUGEL */}
                    {openRequests.length > 0 && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();

                          const el = document.getElementById('incoming-requests');

                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });

                            // 🔥 NEON RAHMEN (dein Style)
                            el.style.boxShadow = `
                              0 0 0 2px rgba(34,211,238,0.7),     /* cyan */
                              0 0 12px rgba(34,211,238,0.6),
                              0 0 20px rgba(236,72,153,0.4)       /* pink */
                            `;

                            setTimeout(() => {
                              el.style.boxShadow = '';
                            }, 2400);
                          }
                        }}

                        className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full animate-pulse cursor-pointer hover:scale-110 transition"
                      >
                        {openRequests.length}
                      </span>
                    )}

                    {/* 🎛️ TARGETED B2B ACCESS: WEIST JEDEM BUTTON REAKTIV SEIN EIGENES PROJEKT ZU */}
                    <button 
                      type="button"
                      onClick={() => {
                        // 📡 1. Holt die Variablen aus der aktuellen Zeile (Sicherheits-Fallback für alle Benennungen)
                        const currentEvt = typeof evt !== 'undefined' ? evt : (typeof event !== 'undefined' ? event : project);
                        
                        if (!currentEvt) {
                          alert("Fehler: Das Projekt-Objekt konnte in der Schleife nicht identifiziert werden.");
                          return;
                        }

                        const eventId = currentEvt.id || currentEvt.eventId || currentEvt._id;
                        const eventTitle = currentEvt.title || currentEvt.name || "B2B Event";

                        // 📡 2. Schaltet EXAKT dieses eine Projekt plattformweit im Speicher scharf!
                        localStorage.setItem('gigsda_active_event', JSON.stringify({
                          id: eventId,
                          title: eventTitle
                        }));
                        
                        // 📡 3. Löst Daniels originalen Event-Auswahl-Trigger aus, falls vorhanden
                        if (typeof onSelectEvent === 'function') {
                          onSelectEvent(currentEvt);
                        } else if (typeof setActiveEvent === 'function') {
                          setActiveEvent(currentEvt);
                        }

                        // 📡 4. Jagt das Navigations-Signal direkt zur RiderZentrale durch die Rohre
                        if (typeof onNavigateToStep === 'function') {
                          onNavigateToStep('riderzentrale');
                        } else if (typeof setView === 'function') {
                          setView('riderzentrale');
                        }
                      }}
                      className="px-3 py-1.5 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-cyan-500/40 hover:border-cyan-400 text-cyan-400 hover:text-white text-[9px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer font-mono mr-2 shadow-[0_0_10px_rgba(6,182,212,0.05)]"
                    >
                      🎛️ Rider & Gewerke
                    </button>

                    {/* DEIN ECHTER LÖSCH-HEBEL PRO EVENT */}
                    <button
                      type="button"
                      title="Dieses Event unwiderruflich löschen"
                      onClick={(e) => handleDelete(evt.id, e)}
                      className="bg-slate-950 border border-slate-900 text-slate-600 hover:text-rose-400 hover:border-rose-950/50 w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 font-mono font-bold text-sm shrink-0 cursor-pointer"
                    >
                      ✕
                    </button>

                    {/* ⚙️ DANIELS REPARIERTE TÜR ZUM EVENT: ÜBERGEBT ID UND ÖFFNET DIE CREWLISTE */}
                    <button 
                      type="button"
                      onClick={() => {
                        if (evt) {
                          const eventId = evt.id || evt.eventId || evt._id;
                          const eventTitle = evt.title || evt.name || "B2B Event";

                          // 📡 1. Schreibt haargenau die ID dieses Projekts reaktiv in den Speicher!
                          localStorage.setItem('gigsda_active_event', JSON.stringify({
                            id: eventId,
                            title: eventTitle
                          }));

                          // 📡 2. Zündet Daniels originalen Event-Wechsler im RAM
                          if (typeof onSelectEvent === 'function') {
                            onSelectEvent(evt);
                          }

                          // 📡 3. Öffnet die Crew-Shortlist-Ebene, genau wie du es gestern geplant hast!
                          if (typeof onNavigateToStep === 'function') {
                            onNavigateToStep('shortlist'); // oder Daniels Navigations-Key für eure Crew-Ansicht
                          } else if (typeof setView === 'function') {
                            setView('shortlist');
                          }
                        }
                      }}
                      className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer font-mono shadow-md flex items-center gap-1.5"
                    >
                      <span>KONFIGURIEREN ⚙️</span>
                    </button>



                  </div>
                </div>
              );
            })}
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
import React, { useState, useEffect, useRef } from 'react';
import ManagerOverview from './ManagerOverview';
import CreateEventForm from './CreateEventForm';
import CommunityChat from './CommunityChat';
import IncomingMessages from './IncomingMessages';

import { eventService } from './services/eventService';
import {
  getProfilesDb,
  getCrewRequests,
  saveEvent
} from './services/apiService';

export default function ProjectDashboard({ onNavigateToStep, progress, onSelectEvent, events: propsEvents, onCreateEvent, ticketName }) {
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  const skipNextEventSave = useRef(false);
  const hasMountedEvents = useRef(false);

  const [events, setEvents] = useState(() => {
    return eventService.getEvents();
  });

  useEffect(() => {
    const syncEvents = async () => {
      try {
        const dbEvents =
          await eventService.syncFromDb();

        console.log(
          'PROJECTDASHBOARD EVENTS SYNC DB ✅',
          dbEvents
        );

        skipNextEventSave.current = true;
        setEvents(dbEvents);
      } catch (e) {
        console.error(
          'PROJECTDASHBOARD EVENTS SYNC DB FEHLER ❌',
          e
        );
      }
    };

    syncEvents();
  }, []);


  useEffect(() => {
    if (!hasMountedEvents.current) {
      hasMountedEvents.current = true;
      return;
    }

    if (skipNextEventSave.current) {
      skipNextEventSave.current = false;
      return;
    }

    eventService.saveEvents(events);
  }, [events]);


const handleDelete = (eventId, e) => {
  e.stopPropagation();

  if (
    window.confirm(
      "Möchtest du dieses Event aus deinem aktiven Dashboard archivieren? Es bleibt als Referenz erhalten. 🗂️"
    )
  ) {
    const now = Date.now();

    const updated = events.map(evt => {
      if (evt.id !== eventId) return evt;

      return {
        ...evt,
        archived: true,
        archivedAt: now,
        archivedBy:
          currentProfileData?.id ||
          localStorage.getItem('gigsda_profile_id') ||
          '',
        changed: true,
        changedAt: now
      };
    });

    setEvents(updated);
    eventService.saveEvents(updated);

    window.dispatchEvent(
      new CustomEvent('route-change')
    );
  }
};


  const [requests, setRequests] = useState([]);
  const [currentProfileData, setCurrentProfileData] = useState(null);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data =
          await getCrewRequests();

        console.log(
          'PROJECTDASHBOARD REQUESTS DB ✅',
          data
        );

        setRequests(data);
      } catch (e) {
        console.error(
          "Fehler beim Laden der Requests:",
          e
        );
      }
    };

    loadRequests();

    window.addEventListener(
      'request-sent',
      loadRequests
    );

    window.addEventListener(
      'route-change',
      loadRequests
    );

    return () => {
      window.removeEventListener(
        'request-sent',
        loadRequests
      );

      window.removeEventListener(
        'route-change',
        loadRequests
      );
    };
  }, []);


  const currentUserName = localStorage.getItem('gigsda_user_name');
useEffect(() => {
  if (!currentUserName) return;

  getProfilesDb()
    .then(profiles => {
      const found = profiles.find(
        p =>
          p &&
          (p.name || p.user_name || p.display_name || '')
            .trim()
            .toLowerCase() ===
          currentUserName.trim().toLowerCase()
      );

      console.log(
        'PROJECTDASHBOARD PROFILE DB ✅',
        found
      );

      if (!found) return;

      const profileData =
        found?.profile_json
          ? JSON.parse(found.profile_json)
          : found;

      setCurrentProfileData(profileData);
    })
    .catch(console.error);
}, [currentUserName]);


const formatEventDateDe = (isoDate) => {
  if (!isoDate) return '';

  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    return isoDate;
  }

  const [year, month, day] = isoDate.split('-');

  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  const weekdays = [
    'So.',
    'Mo.',
    'Di.',
    'Mi.',
    'Do.',
    'Fr.',
    'Sa.'
  ];

  return `${weekdays[date.getDay()]} ${day}.${month}.${year}`;
};



const currentUserId =
  currentProfileData?.id;

const getEventSortValue = (ev) => {
  const rawDate =
    ev.event_date ||
    ev.date ||
    '';

  if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    return new Date(rawDate).getTime();
  }

  return Number.MAX_SAFE_INTEGER;
};

const visibleEvents = events
  .filter(ev =>
    ev &&
    ev.archived !== true &&
    (
      !currentUserId ||
      !ev.ownerId ||
      ev.ownerId === currentUserId ||
      ev.crewIds?.includes(currentUserId)
    )
  )
  .sort((a, b) =>
    getEventSortValue(a) - getEventSortValue(b)
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
              const currentUserId = currentProfileData?.id;

              const fresh = {
                id: newEvent.id || "EVT-" + Date.now().toString().slice(-4),
                title: `${newEvent.title}`,
                date: newEvent.date,
                type: newEvent.category === 'Festivals'
                  ? 'Festival'
                  : newEvent.category === 'OpenAirs'
                    ? 'Open Air'
                    : 'Clubshow',
                text: "Event frisch angelegt. Starte die Crew-Suche im Radar.",
                venue: newEvent.venue || "Stadtpark Wiese, Braunau",
                doneProgress: 0,
                ownerId: currentUserId,
                ownerName:
                  currentProfileData?.name ||
                  currentUserName ||
                  "Unbekannt",
                crewIds: [currentUserId],

              logistics: {
                setup: false,
                power: false,
                catering: false,
                security: false,
              }

            };
            
            // 💾 DER FESTPLATTEN-SPEICHER FÜR NEUE EVENTS
            const updatedList = [fresh, ...events];
            setEvents(updatedList);
            eventService.saveEvents(updatedList);

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
              const ownerName =
                evt.ownerId === currentUserId
                  ? currentProfileData?.name || currentUserName || "Unbekannt"
                  : evt.ownerName || "Unbekannt";

              const teamSize = evt.crewIds?.length || 0;
              
              const isOwner =
                evt.ownerId === currentUserId;

              // Dynamische Prozentberechnung basierend auf der echten Team-Auswahl für dieses Event
              const crewProgress =
                evt.crewIds?.length > 1 ? 100 : 50;

              const riderProgress =
                evt.crewIds?.length > 0
                  ? Math.round(
                      (
                        Object.values(evt.riderCenter || {})
                          .filter(r => r?.confirmed).length /
                        evt.crewIds.length
                      ) * 100
                    )
                  : 0;

              const dealProgress =
                evt.dealSent
                  ? Math.round(
                      (
                        Object.keys(evt.acceptedDeals || {}).length /
                        (evt.crewIds?.length || 1)
                      ) * 100
                    )
                  : 0;

              const plannerProgress =
                evt.plannerLocked ? 100 : 50;

              const promotionProgress =
                evt.promotionData?.title ? 100 : 0;

              const dynamicProgress = Math.round(
                (
                  crewProgress +
                  riderProgress +
                  dealProgress +
                  plannerProgress +
                  promotionProgress
                ) / 5
              );

const eventOpenRequests = requests.filter(r =>
  r &&
  (
    r.status === "pending" ||
    r.status === "counter_offer"
  ) &&
  (
    r.eventId === evt.id ||
    r.eventName === evt.title
  )
);

              return (
                  <div
                    key={evt.id}
                    className="
                      relative
                      overflow-hidden
                      bg-slate-900/40
                      border border-slate-900
                      rounded-3xl
                      p-5
                      flex flex-col sm:flex-row
                      justify-between
                      items-start sm:items-center
                      gap-4
                    "
                  style={{
                    backgroundImage: evt?.promotionData?.promoImage
                      ? `url(${evt.promotionData.promoImage})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  >

                  <div className="
                    absolute inset-0
                    bg-gradient-to-r
                    from-slate-950
                    via-slate-950/95
                    to-slate-950/25
                  "/>

                  <div className="relative z-10 flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center font-black border text-xs ${
                      dynamicProgress === 100 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                    }`}>
                      {dynamicProgress}%
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase font-bold">#{evt.id} // {evt.type}</span>
                      <h4 className="text-sm font-black text-white mt-0.5">
                        {evt.title}
                      </h4>
 
                      <p className="text-[10px] text-slate-400">
                        👥 {teamSize} Crew • von {ownerName}
                      </p>

                      <p className="text-[10px]">
                        {isOwner ? '👑 Owner' : '👥 Crew'}
                      </p>

                      <p className="text-[10px] text-slate-400">
                        📍 Ort: {evt.venue} ({formatEventDateDe(evt.date || evt.event_date)})
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative z-10 flex items-center gap-2">

                    {/* 🔴 INCOMMING REQUEST KUGEL */}
                    {eventOpenRequests.length > 0 && (
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
                        {eventOpenRequests.length}
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
                    {isOwner  && (                    
                    <button
                      type="button"
                      title="Dieses Event unwiderruflich löschen"
                      onClick={(e) => handleDelete(evt.id, e)}
                      className="bg-slate-950 border border-slate-900 text-slate-600 hover:text-rose-400 hover:border-rose-950/50 w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 font-mono font-bold text-sm shrink-0 cursor-pointer"
                    >
                      ✕
                    </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        const eventId = evt.id;
                        const eventTitle = evt.title;

                        localStorage.setItem(
                          'gigsda_active_event',
                          JSON.stringify({
                            id: eventId,
                            title: eventTitle
                          })
                        );

                        if (typeof onSelectEvent === 'function') {
                          onSelectEvent(evt);
                        }

                        if (typeof onNavigateToStep === 'function') {
                          onNavigateToStep('communitychat');
                        }
                      }}
                      className="px-3 py-1.5 bg-gradient-to-r from-cyan-600/20 to-emerald-600/20 border border-cyan-500/40 hover:border-cyan-400 text-cyan-400 hover:text-white text-[9px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer font-mono"
                    >
                      💬 Crew Chat
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
                      
                      <span>
                        {isOwner
                          ? '⚙️ VERWALTEN'
                          : '👁️ PROJEKTSTATUS'}
                      </span>

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
import React, { useState, useEffect } from 'react';
import { eventService } from './services/eventService';
import {
  getProfilesDb,
  getCrewRequests,
  updateCrewRequest
} from './services/apiService';


export default function CrewRequestCenter({ currentProfileName }) {
  const [requests, setRequests] = useState([]);
  const [counterText, setCounterText] = useState('');
  const [activeCounterId, setActiveCounterId] = useState(null);
  const [currentProfileId, setCurrentProfileId] = useState('');


useEffect(() => {
  if (!currentProfileName) return;

  getProfilesDb()
    .then(profiles => {
      const found = profiles.find(
        p =>
          p &&
          (p.name || p.user_name || p.display_name || '')
            .trim()
            .toLowerCase() ===
          currentProfileName.trim().toLowerCase()
      );

      if (!found) return;

      const profileData =
        found?.profile_json
          ? JSON.parse(found.profile_json)
          : found;

      setCurrentProfileId(profileData?.id || '');
    })
    .catch(console.error);
}, [currentProfileName]);


useEffect(() => {
  const loadRequests = async () => {
    try {
      const dbRequests =
        await getCrewRequests();

      const myRequests = dbRequests.filter(req => {
        if (!req) return false;

        const reqName =
          (req.requestedProfile || req.requestedProfileName || '')
            .trim()
            .toLowerCase();

        const me =
          (currentProfileName || '')
            .trim()
            .toLowerCase();

        const reqId =
          (req.requestedProfileId || '')
            .toLowerCase();

        const myId =
          (currentProfileId || '')
            .toLowerCase();

        return reqId === myId || reqName === me;
      });

      setRequests(myRequests);

    } catch (e) {
      console.error(
        "Fehler beim Laden der Crew-Anfragen:",
        e
      );
    }
  };

  loadRequests();

  window.addEventListener(
    'request-sent',
    loadRequests
  );

  return () => {
    window.removeEventListener(
      'request-sent',
      loadRequests
    );
  };
}, [currentProfileName, currentProfileId]);


const handleResponse = async (requestId, newStatus) => {
  try {
    const updatedAt = Date.now();

    const result = await updateCrewRequest(
      requestId,
      {
        status: newStatus,
        updatedAt
      }
    );

    const targetReq =
      requests.find(r => r.requestId === requestId) ||
      result?.request;

    if (targetReq) {
      const savedEvents = eventService.getEvents();

      let eventIndex = savedEvents.findIndex(ev =>
        ev &&
        (
          ev.id === targetReq.eventId ||
          ev.eventId === targetReq.eventId ||
          ev._id === targetReq.eventId ||
          ev.title === targetReq.eventName ||
          ev.name === targetReq.eventName
        )
      );

      if (eventIndex === -1 && savedEvents.length > 0) {
        eventIndex = 0;
      }

      if (eventIndex > -1 && savedEvents[eventIndex].crew) {
        const memberIndex =
          savedEvents[eventIndex].crew.findIndex(
            m =>
              m &&
              m.id === targetReq.requestedProfileId
          );

        if (memberIndex > -1) {
          savedEvents[eventIndex].crew[memberIndex] = {
            ...savedEvents[eventIndex].crew[memberIndex],
            status: newStatus,
            confirmed: false,
            changed: true,
            changedAt: updatedAt
          };

          eventService.saveEvents(savedEvents);
          const changedEvent =
  savedEvents[eventIndex];

if (changedEvent) {
  await eventService.saveEvent(changedEvent);
}
        }
      }
    }

    setRequests(prev =>
      prev.map(req =>
        req.requestId === requestId
          ? {
              ...req,
              status: newStatus,
              updatedAt
            }
          : req
      )
    );

    window.dispatchEvent(
      new CustomEvent('request-sent')
    );

    window.dispatchEvent(
      new CustomEvent('route-change')
    );

    alert(
      `B2B-Status erfolgreich auf ${newStatus.toUpperCase()} aktualisiert! ⚡`
    );

  } catch (e) {
    console.error(
      "Fehler beim Verarbeiten der B2B-Antwort:",
      e
    );
  }
};


  // 🟡 LOGIK FÜR DAS GEGENANGEBOT (COUNTER OFFER)
const handleCounterOfferSubmit = async (reqId) => {
  if (!counterText.trim()) {
    return alert(
      "Bitte gib eine kurze Notiz für das Gegenangebot ein!"
    );
  }

  try {
    const updatedAt = Date.now();

    const note =
      `GEGENANGEBOT: ${counterText}`;

    const result = await updateCrewRequest(
      reqId,
      {
        status: 'counter_offer',
        note,
        updatedAt
      }
    );

    setRequests(prev =>
      prev.map(r =>
        r.requestId === reqId
          ? {
              ...r,
              status: 'counter_offer',
              note,
              updatedAt
            }
          : r
      )
    );

    setActiveCounterId(null);
    setCounterText('');

    window.dispatchEvent(
      new CustomEvent('request-sent')
    );

    window.dispatchEvent(
      new CustomEvent('route-change')
    );

    alert(
      "Gegenangebot erfolgreich an den Veranstalter gefeuert! ⚡🟡"
    );

  } catch (e) {
    console.error(
      "Fehler beim Senden des Gegenangebots:",
      e
    );
  }
};

  // Wenn keine offenen Anfragen oder Gegenangebote da sind, schläft das Modul unsichtbar im Hintergrund
  return null;

  return (
    <div className="mb-6 space-y-3 font-mono animate-fade-in">
      <span className="text-[8px] text-amber-500 uppercase font-black tracking-widest block animate-pulse">
        ⚡ // B2B RADAR LIVE UPDATE: CREW BOOKING & NEGOTIATION STATE
      </span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requests.filter(r => r.status === 'pending' || r.status === 'counter_offer').map(req => {
          const isCounter = req.status === 'counter_offer';
          
          return (
            <div key={req.requestId} className="bg-slate-950 border border-amber-500/30 rounded-2xl p-4 space-y-3 flex flex-col justify-between shadow-[0_0_15px_rgba(245,158,11,0.05)]">
              
              <div className="space-y-2">
                <div className="flex justify-between items-center border-b border-slate-900 pb-1.5 text-[9px]">
                  <span className="text-amber-400 font-bold uppercase tracking-wider">
                    {isCounter ? `⚡ NEGOTIATION FROM: ${req.requestedProfile}` : `🏢 INCOMING FROM: ${req.requesterName}`}
                  </span>
                  <span className="text-slate-500">ID: {req.requestId}</span>
                </div>
                
                <h3 className="text-xs font-black text-white uppercase tracking-wide">
                  🎸 {req.eventName}
                </h3>
                <p className="text-[10px] text-cyan-400">
                  📅 Event-Termin: <span className="text-white font-bold">{req.date}</span>
                </p>
                {req.note && (
                  <p className="text-[9px] bg-slate-900/60 border border-amber-500/10 rounded-lg p-2 text-amber-400 font-bold leading-relaxed">
                    {req.note}
                  </p>
                )}
              </div>

              {/* GEGENANGEBOTS-TEXTFELD (NUR FÜR NEUE ANFRAGEN) */}
              {activeCounterId === req.requestId && (
                <div className="space-y-1.5 pt-2 border-t border-slate-900 animate-fade-in">
                  <label className="text-[7px] text-amber-400 block font-bold uppercase">Deine Konditionen / Notiz:</label>
                  <input 
                    type="text" 
                    value={counterText} 
                    onChange={(e) => setCounterText(e.target.value)}
                    placeholder="Gage, Tech-Specs oder Aufbauzeiten ändern..." 
                    className="w-full bg-slate-900 border border-amber-500/30 rounded-lg px-2 py-1 text-white text-[10px] outline-none focus:border-amber-500"
                  />
                  <div className="flex gap-1 justify-end pt-1">
                    <button onClick={() => setActiveCounterId(null)} className="px-2 py-0.5 bg-slate-900 text-slate-500 text-[8px] uppercase font-bold rounded border border-slate-800">Abbrechen</button>
                    <button onClick={() => handleCounterOfferSubmit(req.requestId)} className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[8px] uppercase font-bold rounded border border-amber-500/40">Senden ↗</button>
                  </div>
                </div>
              )}

              {/* REAKTIVE B2B VERHANDLUNGS-MATRIX BUTTONS */}
              {activeCounterId !== req.requestId && (
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-900 text-[9px] font-bold font-mono">
                  <button 
                    onClick={() => handleResponse(req.requestId, 'accepted')} 
                    className="py-1.5 bg-emerald-500/5 border border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-500/10 text-emerald-400 hover:text-white rounded-xl text-center transition-all cursor-pointer uppercase tracking-wider"
                  >
                    {isCounter ? '✓ AKZEPTIEREN' : '✓ ZUSAGEN'}
                  </button>
                  <button 
                    onClick={() => handleResponse(req.requestId, 'declined')} 
                    className="py-1.5 bg-red-500/5 border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 text-red-400 hover:text-white rounded-xl text-center transition-all cursor-pointer uppercase tracking-wider"
                  >
                    {isCounter ? '✕ ABLEHNEN' : '✕ ABSAGEN'}
                  </button>
                  
                  {!isCounter ? (
                    <button 
                      onClick={() => setActiveCounterId(req.requestId)} 
                      className="py-1.5 bg-amber-500/5 border border-amber-500/30 hover:border-amber-500 hover:bg-amber-500/10 text-amber-400 hover:text-white rounded-xl text-center transition-all cursor-pointer uppercase tracking-wider"
                    >
                      ⚡ COUNTER
                    </button>
                  ) : (
                    <div className="text-[7px] text-slate-500 flex items-center justify-center uppercase text-center font-bold tracking-widest border border-slate-900 rounded-xl bg-slate-900/20">
                      ⌛ WARTEN...
                    </div>
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}

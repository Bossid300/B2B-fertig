import React, { useState, useEffect } from 'react';

export default function CrewRequestCenter({ currentProfileName }) {
  const [requests, setRequests] = useState([]);
  const [counterText, setCounterText] = useState('');
  const [activeCounterId, setActiveCounterId] = useState(null);

  // 📡 HOOT ALLE INCOMING REQUESTS AUS DEM SPEICHER
  useEffect(() => {
    try {
      const savedRequests = JSON.parse(localStorage.getItem('gigsda_crew_requests') || '[]');
      
      // Falls die DB komplett leer ist, generieren wir zum Testen zwei fette Demo-Anfragen!
      if (savedRequests.length === 0) {
        const demoRequests = [
          {
            requestId: "REQ-4402",
            eventName: "Rock Night Braunau 2026",
            date: "14.11.2026",
            requestedProfile: currentProfileName || "Cater John",
            requesterName: "Arena Braunau",
            status: "pending",
            note: "Brauchen dringend deine Full-Service Unterstützung vor Ort!"
          },
          {
            requestId: "REQ-8911",
            eventName: "Cyberpunk Gala Open-Air",
            date: "22.08.2026",
            requestedProfile: currentProfileName || "Cater John",
            requesterName: "Innviertel Events GmbH",
            status: "pending",
            note: "Standard-B2B Konditionen laut Marktplatz-Tarif."
          }
        ];
        localStorage.setItem('gigsda_crew_requests', JSON.stringify(demoRequests));
        setRequests(demoRequests);
        // ⚡ Sendet den globalen B2B-Funkspruch an die App.jsx!
        window.dispatchEvent(new CustomEvent('request-sent'));

      } else {
        // Filtert nur die Anfragen, die exakt an DIESES geöffnete Profil gerichtet sind
        const myRequests = savedRequests.filter(req => {
          if (!req) return false;
          const reqName = (req.requestedProfile || '').trim().toLowerCase();
          const senderName = (req.requesterName || '').trim().toLowerCase();
          const me = (currentProfileName || '').trim().toLowerCase();

          return reqName === me || senderName === me;
        });
        setRequests(myRequests);
      }
    } catch (e) {
      console.error("Fehler beim Laden der Crew-Anfragen:", e);
    }
  }, [currentProfileName]);

  // 🟢 / 🔴 LOGIK FÜR DIREKTE ZUSAGE ODER ABSAGE
  const handleResponse = (reqId, newStatus) => {
    try {
      const allRequests = JSON.parse(localStorage.getItem('gigsda_crew_requests') || '[]');
      const index = allRequests.findIndex(r => r.requestId === reqId);
      
      if (index > -1) {
        allRequests[index].status = newStatus;
        localStorage.setItem('gigsda_crew_requests', JSON.stringify(allRequests));
        
        // Reaktives UI-Update
        setRequests(prev => prev.filter(r => r.requestId !== reqId));
        alert(`B2B-Status erfolgreich übermittelt: ${newStatus === 'accepted' ? 'ZUGESAGT! 🟢' : 'ABGESAGT! 🔴'}`);
      }
    } catch (e) {
      console.error("Fehler beim Speichern des Anfrage-Status:", e);
    }
  };

  // 🟡 LOGIK FÜR DAS GEGENANGEBOT (COUNTER OFFER)
  const handleCounterOfferSubmit = (reqId) => {
    if (!counterText.trim()) return alert("Bitte gib eine kurze Notiz für das Gegenangebot ein!");
    try {
      const allRequests = JSON.parse(localStorage.getItem('gigsda_crew_requests') || '[]');
      const index = allRequests.findIndex(r => r.requestId === reqId);
      
      if (index > -1) {
        allRequests[index].status = 'counter_offer';
        allRequests[index].note = `GEGENANGEBOT: ${counterText}`;
        localStorage.setItem('gigsda_crew_requests', JSON.stringify(allRequests));
        
        setRequests(prev => prev.filter(r => r.requestId !== reqId));
        setActiveCounterId(null);
        setCounterText('');
        alert("Gegenangebot erfolgreich an den Veranstalter gefeuert! ⚡🟡");
      }
    } catch (e) {
      console.error("Fehler beim Senden des Gegenangebots:", e);
    }
  };

  // Wenn keine offenen Anfragen oder Gegenangebote da sind, schläft das Modul unsichtbar im Hintergrund
  if (requests.filter(r => r.status === 'pending' || r.status === 'counter_offer').length === 0) return null;

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

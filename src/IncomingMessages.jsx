import React, { useEffect, useState } from 'react';

export default function IncomingMessages() {
  
  const handleUpdateStatus = (requestId, newStatus) => {
    try {
      const requests = JSON.parse(localStorage.getItem('gigsda_crew_requests') || '[]');
      const events = JSON.parse(localStorage.getItem('gigsda_events') || '[]');

      const request = requests.find(r => r.requestId === requestId);
      if (!request) return;

      // ✅ Request Status ändern
      const updatedRequests = requests.map(r =>
        r.requestId === requestId ? { ...r, status: newStatus } : r
      );

      localStorage.setItem('gigsda_crew_requests', JSON.stringify(updatedRequests));

      // ✅ Crew im Event updaten
      const event = events.find(ev => ev.title === request.eventName);
      if (event && event.crew) {
        event.crew = event.crew.map(member =>
          member.id === request.requestedProfileId
            ? { ...member, status: newStatus }
            : member
        );

        localStorage.setItem('gigsda_events', JSON.stringify(events));
      }

      // 🔥 UI refresh triggern
      window.dispatchEvent(new CustomEvent('request-sent'));

    } catch (e) {
      console.error('Fehler beim Status Update:', e);
    }
  };

  const [incomingRequests, setIncomingRequests] = useState([]);

  useEffect(() => {
    const loadRequests = () => {
      try {
        const requests = JSON.parse(localStorage.getItem('gigsda_crew_requests') || '[]');

        // aktueller User
        const currentUserName = localStorage.getItem('gigsda_user_name');

        const currentUser = {
          name: currentUserName
        };

        const profiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');
        const currentProfile = profiles.find(p =>
          (p.name || '').toLowerCase() === (currentUserName || '').toLowerCase()
        );
        const currentUserId = currentProfile?.id;
        const filtered = requests.filter(r =>
          r.requestedProfileId === currentUserId
        );
        setIncomingRequests(filtered);


      } catch (e) {
        console.error('Fehler beim Laden der Incoming Requests:', e);
      }
    };

    loadRequests();

    // live refresh wenn was passiert
    window.addEventListener('request-sent', loadRequests);
    window.addEventListener('route-change', loadRequests);

    return () => {
      window.removeEventListener('request-sent', loadRequests);
      window.removeEventListener('route-change', loadRequests);
    };

  }, []);

  return (
    <div id="incoming-requests" className="bg-slate-950 border border-slate-900 p-4 rounded-2xl text-white font-mono text-xs space-y-3 transition-all duration-500">

      {/* HEADER */}
      <div className="border-b border-slate-900 pb-2 flex justify-between items-center">
        <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest">
          // Incoming Crew Requests
        </span>
        <span className="text-[10px] text-slate-500">
          {incomingRequests.length} Offen
        </span>
      </div>

      {/* LISTE */}
      {incomingRequests.length > 0 ? (
        incomingRequests.map((req) => (
          <div
            key={req.requestId}
            className="bg-slate-900/20 border border-slate-800 rounded-xl p-3 space-y-2"
          >

            <div className="text-[9px] text-slate-500">
              📅 {req.eventName} • {req.date}
            </div>

            <div className="font-bold text-white uppercase text-[11px]">
              Anfrage von: {req.requesterName}
            </div>

            <div className="text-[10px] text-slate-400 italic">
              "{req.note}"
            </div>

            <div className="text-[8px] font-bold uppercase text-amber-400">
              STATUS: {req.status}
            </div>

            {/* 🔥 ACTION BUTTONS */}
            {(req.status === "pending" || req.status === "counter_offer") && (
              <div className="flex gap-2 pt-2">

                {/* ✅ ZUSAGEN */}
                <button
                  onClick={() => handleUpdateStatus(req.requestId, 'accepted')}
                  className="flex-1 text-[9px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg py-1 hover:bg-emerald-500/20"
                >
                  ✅ ZUSAGEN
                </button>

                {/* ❌ ABSAGEN */}
                <button
                  onClick={() => handleUpdateStatus(req.requestId, 'declined')}
                  className="flex-1 text-[9px] font-bold bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg py-1 hover:bg-red-500/20"
                >
                  ❌ ABSAGEN
                </button>

                {/* ⚡ COUNTER */}
                <button
                  onClick={() => handleUpdateStatus(req.requestId, 'counter_offer')}
                  className="flex-1 text-[9px] font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg py-1 hover:bg-cyan-500/20"
                >
                  ⚡ COUNTER
                </button>

              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center text-slate-600 text-[10px] uppercase py-6">
          // KEINE ANFRAGEN GEFUNDEN
        </div>
      )}
    </div>
  );
}
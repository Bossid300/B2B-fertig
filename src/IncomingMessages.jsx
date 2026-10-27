import React, { useEffect, useState } from 'react';
import { eventService } from './services/eventService';
import {
  getCrewRequests,
  updateCrewRequest,
  saveCrewRequest
} from './services/apiService';


export default function IncomingMessages() {
  
const handleUpdateStatus = async (requestId, newStatus) => {
  try {
    const updatedAt = Date.now();

    const result = await updateCrewRequest(
      requestId,
      {
        status: newStatus
      }
    );

    if (!result?.success) {
      throw new Error(result?.error || 'Request-Status konnte nicht aktualisiert werden');
    }

    const request =
      incomingRequests.find(r => r.requestId === requestId) ||
      result?.request;

    if (request) {
      const events = eventService.getEvents();

      const event = events.find(
        ev =>
          ev.id === request.eventId ||
          ev.title === request.eventName
      );

      if (event && event.crew) {
        const crewProfileId =
          request.requestType === 'counter' ||
          request.source === 'counter_offer'
            ? request.requesterProfileId
            : request.requestedProfileId;

        event.crew = event.crew.map(member =>
          member.id === crewProfileId
            ? {
                ...member,
                status: newStatus,
                confirmed: false,
                changed: true,
                changedAt: updatedAt
              }
            : member
        );

        eventService.saveEvents(events);
        if (event) {
  await eventService.saveEvent(event);
}
      }
    }

    setIncomingRequests(prev =>
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

    return true;
  } catch (e) {
    console.error(
      'Fehler beim Status Update:',
      e
    );
    return false;
  }
};

  const [incomingRequests, setIncomingRequests] = useState([]);
  const [counterRequestId, setCounterRequestId] =
    useState(null);

  const [counterText, setCounterText] =
    useState('');

    useEffect(() => {
      const loadRequests = async () => {
        try {
          const dbRequests =
            await getCrewRequests();

          const currentUserId =
              localStorage.getItem('gigsda_profile_id');

          const filtered = dbRequests.filter(r =>
            r &&
            r.requestedProfileId === currentUserId
          );
      setIncomingRequests(filtered);

    } catch (e) {
      console.error(
        'Fehler beim Laden der Incoming Requests:',
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

  const handleAcceptDeal = async (req) => {
    const updated = await handleUpdateStatus(
      req.requestId,
      'accepted'
    );
    if (!updated) return;

    const events = eventService.getEvents();
    const updatedEvents = events.map(event => {
      if (event.title !== req.eventName) {
        return event;
      }
      return {
        ...event,
        acceptedDeals: {
          ...(event.acceptedDeals || {}),
          [req.requestedProfileId]: true
        }
      };

    });
    eventService.saveEvents(updatedEvents);
    const acceptedEvent = updatedEvents.find(
      event => event.title === req.eventName
    );
    if (acceptedEvent) {
      await eventService.saveEvent(acceptedEvent);
    }

    window.dispatchEvent(
      new CustomEvent('request-sent')
    );
  };


const handleCounterOffer = async (
  req,
  counterText
) => {
  try {
    const now = Date.now();

    const newCounterRequest = {
      requestId:
        `COUNTER-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,

      requestType: 'counter',
      inReplyToRequestId: req.requestId,

      eventId:
        req.eventId || '',

      eventName:
        req.eventName,

      date:
        req.date,

      requesterProfileId:
        req.requestedProfileId,

      requesterProfileName:
        req.requestedProfileName,

      requesterName:
        req.requestedProfileName,

      requestedProfileId:
        req.requesterProfileId,

      requestedProfileName:
        req.requesterName,

      status:
        'pending',

      source:
        'counter_offer',

      createdAt:
        now,

      updatedAt:
        now,

      note:
        counterText
    };

    const saveResult =
      await saveCrewRequest(newCounterRequest);

    if (!saveResult?.success) {
      throw new Error(saveResult?.error || 'Gegenangebot konnte nicht erstellt werden');
    }

    setCounterRequestId(null);
    setCounterText('');

    window.dispatchEvent(
      new CustomEvent('request-sent')
    );

  } catch (e) {
    console.error(
      'Fehler beim Senden des Gegenangebots:',
      e
    );
  }
};

const openRequests = incomingRequests.filter(
  req => req.status === 'pending'
);


  return (
    <div id="incoming-requests" className="bg-slate-950 border border-slate-900 p-4 rounded-2xl text-white font-mono text-xs space-y-3 transition-all duration-500">

      {/* HEADER */}
      <div className="border-b border-slate-900 pb-2 flex justify-between items-center">
        <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest">
          // Projektanfragen & Bestätigungen
        </span>
        <span className="text-[10px] text-slate-500">
          {openRequests.length} Offen
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
            {req.status === 'pending' && (
              req.requestType === 'deal' ? (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleAcceptDeal(req)}
                    className="flex-1 text-[9px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg py-1 hover:bg-emerald-500/20"
                  >
                    ✅ DEAL BESTÄTIGEN
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(req.requestId, 'declined')}
                    className="flex-1 text-[9px] font-bold bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg py-1 hover:bg-red-500/20"
                  >
                    ❌ DEAL ABLEHNEN
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleUpdateStatus(req.requestId, 'accepted')}
                    className="flex-1 text-[9px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg py-1 hover:bg-emerald-500/20"
                  >
                    ✅ ZUSAGEN
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(req.requestId, 'declined')}
                    className="flex-1 text-[9px] font-bold bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg py-1 hover:bg-red-500/20"
                  >
                    ❌ ABSAGEN
                  </button>
                  <button
                    onClick={() => setCounterRequestId(req.requestId)}
                    className="flex-1 text-[9px] font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg py-1 hover:bg-cyan-500/20"
                  >
                    ⚡ COUNTER
                  </button>
                </div>
              )
            )}
            {req.status === 'accepted' && (
              <div className="flex-1 text-[9px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg py-1 text-center">
                {req.requestType === 'deal' ? '✅ Deal bestätigt' : '✅ Anfrage bestätigt'}
              </div>
            )}
            {req.status === 'counter_offer' && (
              <div className="flex-1 text-[9px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg py-1 text-center">
                ⚡ Gegenangebot gesendet – abgeschlossen
              </div>
            )}
            {req.status === 'declined' && (
              <div className="flex-1 text-[9px] font-bold bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg py-1 text-center">
                {req.requestType === 'deal' ? '❌ Deal abgelehnt' : '❌ Anfrage abgelehnt'}
              </div>
            )}
            {req.status === 'pending' && counterRequestId === req.requestId && (

              <div className="pt-3 space-y-2">

                <textarea
                  value={counterText}
                  onChange={(e) =>
                    setCounterText(e.target.value)
                  }
                  placeholder="Beschreibe deinen Gegenvorschlag..."
                  className="
                    w-full
                    bg-slate-950
                    border
                    border-slate-800
                    rounded-xl
                    p-3
                    text-white
                    text-xs
                  "
                />

                <button
                  onClick={() =>
                    handleCounterOffer(
                      req,
                      counterText
                    )
                  }
                  className="
                    w-full
                    bg-cyan-500/10
                    border
                    border-cyan-500/30
                    text-cyan-400
                    rounded-xl
                    py-2
                    text-[10px]
                    font-bold
                  "
                >
                  ⚡ Gegenvorschlag senden
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
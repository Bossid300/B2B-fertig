import React, { useEffect, useState } from 'react';
import { eventService } from './services/eventService';
import {
  getProfilesDb,
  getCrewRequests,
  updateCrewRequest
} from './services/apiService';


export default function IncomingMessages() {
  
const handleUpdateStatus = async (requestId, newStatus) => {
  try {
    const updatedAt = Date.now();

    const result = await updateCrewRequest(
      requestId,
      {
        status: newStatus,
        updatedAt
      }
    );

    console.log(
      'INCOMING REQUEST UPDATE DB ✅',
      result
    );

    // TEMP-BRÜCKE:
    // bleibt noch drin, solange CrewRequestCenter / Badge / alte Stellen
    // noch gigsda_crew_requests lesen
    const requests = JSON.parse(
      localStorage.getItem('gigsda_crew_requests') || '[]'
    );

    const request =
      requests.find(r => r.requestId === requestId) ||
      incomingRequests.find(r => r.requestId === requestId);

    const updatedRequests = requests.map(r =>
      r.requestId === requestId
        ? {
            ...r,
            status: newStatus,
            updatedAt
          }
        : r
    );

    localStorage.setItem(
      'gigsda_crew_requests',
      JSON.stringify(updatedRequests)
    );

    if (request) {
      const events = eventService.getEvents();

      const event = events.find(
        ev =>
          ev.id === request.eventId ||
          ev.title === request.eventName
      );

      if (event && event.crew) {
        event.crew = event.crew.map(member =>
          member.id === request.requestedProfileId
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

  } catch (e) {
    console.error(
      'Fehler beim Status Update:',
      e
    );
  }
};

  const [incomingRequests, setIncomingRequests] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [currentProfileData, setCurrentProfileData] = useState(null);

  useEffect(() => {
    const currentUserName =
      localStorage.getItem('gigsda_user_name') || '';

    getProfilesDb()
      .then(profiles => {
        const normalizedProfiles = profiles.map(profile => {
          let profileData = {};

          try {
            profileData =
              profile.profile_json
                ? JSON.parse(profile.profile_json)
                : {};
          } catch (e) {
            console.error(
              'INCOMINGMESSAGES JSON FEHLER ❌',
              e
            );
          }

          return {
            ...profile,
            ...profileData
          };
        });

        setAllProfiles(normalizedProfiles);

        const found = normalizedProfiles.find(
          p =>
            p &&
            (p.name || p.user_name || p.display_name || '')
              .trim()
              .toLowerCase() ===
            currentUserName.trim().toLowerCase()
        );

        console.log(
          'INCOMINGMESSAGES PROFILE DB ✅',
          found
        );

        setCurrentProfileData(found || null);
      })
      .catch(console.error);
  }, []);

  const [counterRequestId, setCounterRequestId] =
    useState(null);

  const [counterText, setCounterText] =
    useState('');

useEffect(() => {
  const loadRequests = async () => {
    try {
      const dbRequests =
        await getCrewRequests();

      console.log(
        'INCOMING REQUESTS DB ✅',
        dbRequests
      );

      // TEMP-FALLBACK:
      // bleibt noch drin, bis wirklich alle alten Requests aus localStorage weg sind
      const localRequests = JSON.parse(
        localStorage.getItem('gigsda_crew_requests') || '[]'
      );

      const mergedRequests = [
        ...dbRequests,
        ...localRequests.filter(localReq =>
          localReq &&
          !dbRequests.some(
            dbReq =>
              dbReq.requestId === localReq.requestId
          )
        )
      ];

      const currentUserId =
        currentProfileData?.id ||
        localStorage.getItem('gigsda_profile_id');

      const filtered = mergedRequests.filter(r =>
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
}, [currentProfileData]);

  const handleAcceptDeal = (req) => {
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
    handleUpdateStatus(
      req.requestId,
      'accepted'
    );
    window.dispatchEvent(
      new CustomEvent('request-sent')
    );
  };

  const handleCounterOffer = (
    req,
    counterText
  ) => {
    const requests = JSON.parse(
      localStorage.getItem(
        'gigsda_crew_requests'
      ) || '[]'
    );

    const requesterProfile = allProfiles.find(
      p =>
        (p.name || '').toLowerCase() ===
        (req.requesterName || '').toLowerCase()
    );

    const newCounterRequest = {
      requestId:
        `COUNTER-${Date.now()}`,

      requestType: 'counter',

      eventName: req.eventName,
      date: req.date,

      requesterName:
        req.requestedProfileName,

      requestedProfileId:
        requesterProfile?.id,

      status: 'pending',

      note: counterText
    };

    const updatedRequests = [
      ...requests,
      newCounterRequest
    ];

    localStorage.setItem(
      'gigsda_crew_requests',
      JSON.stringify(updatedRequests)
    );

    handleUpdateStatus(
      req.requestId,
      'counter_offer'
    );

    window.dispatchEvent(
      new CustomEvent('request-sent')
    );
  };









  const openRequests = incomingRequests.filter(
    req =>
      req.status === 'pending' ||
      req.status === 'counter_offer'
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
              {req.requestType === "deal" ? (
                req.status === "pending" ? (
                  <div className="flex gap-2 pt-2">

                    <button
                      onClick={() => handleAcceptDeal(req)}
                      className="
                        flex-1
                        text-[9px]
                        font-bold
                        bg-emerald-500/10
                        border
                        border-emerald-500/30
                        text-emerald-400
                        rounded-lg
                        py-1
                        hover:bg-emerald-500/20
                      "
                    >
                      ✅ DEAL BESTÄTIGEN
                    </button>

                    <button
                      className="
                        flex-1
                        text-[9px]
                        font-bold
                        bg-red-500/10
                        border
                        border-red-500/30
                        text-red-400
                        rounded-lg
                        py-1
                        hover:bg-red-500/20
                      "
                    >
                      ❌ DEAL ABLEHNEN
                    </button>

                  </div>
                ) : (
                  <div className="
                    flex-1
                    text-[9px]
                    font-bold
                    bg-emerald-500/10
                    border
                    border-emerald-500/30
                    text-emerald-400
                    rounded-lg
                    py-1
                    text-center
                  ">
                    ✅ Deal bestätigt
                  </div>
                )
            ) : (
              req.status === "pending" ||
              req.status === "counter_offer" ? (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() =>
                      handleUpdateStatus(req.requestId, 'accepted')
                    }
                    className="flex-1 text-[9px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg py-1 hover:bg-emerald-500/20"
                  >
                    ✅ ZUSAGEN
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(req.requestId, 'declined')
                    }
                    className="flex-1 text-[9px] font-bold bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg py-1 hover:bg-red-500/20"
                  >
                    ❌ ABSAGEN
                  </button>
                  <button
                    onClick={() => {
                      setCounterRequestId(req.requestId);

                    }}
                    className="flex-1 text-[9px] font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg py-1 hover:bg-cyan-500/20"
                  >
                    ⚡ COUNTER
                  </button>
                </div>

              ) : req.status === "accepted" ? (
                <div className="
                  flex-1
                  text-[9px]
                  font-bold
                  bg-emerald-500/10
                  border
                  border-emerald-500/30
                  text-emerald-400
                  rounded-lg
                  py-1
                  text-center
                ">
                  ✅ Anfrage bestätigt
                </div>
              ) : (
                <div className="
                  flex-1
                  text-[9px]
                  font-bold
                  bg-red-500/10
                  border
                  border-red-500/30
                  text-red-400
                  rounded-lg
                  py-1
                  text-center
                ">
                  ❌ Anfrage abgelehnt
                </div>
              )

            )}
            {counterRequestId === req.requestId && (

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
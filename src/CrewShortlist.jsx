import React, { useState, useEffect } from 'react';
import CommunityChat from './CommunityChat';
import FahrplanMetrics from './FahrplanMetrics';
import CrewCard from './components/cards/CrewCard';
import EventHeaderBox from "./components/EventHeaderBox";

import { eventService } from './services/eventService';
import { getProfilesDb } from './services/apiService';

export default function CrewShortlist({ 
  onBack, 
  progress, 
  setProgress, 
  onNavigateToStep, 
  activeEvent 
}) {

const addFromShortlist = (eventId, profileName) => {
  try {
    const savedEvents = eventService.getEvents();
    const targetProfile = allProfiles.find(
      p =>
        (p.name || '').toLowerCase() ===
        (profileName || '').toLowerCase()
    );
    if (!targetProfile) {
      console.warn(
        'CREWSHORTLIST Zielprofil nicht gefunden:',
        profileName
      );
      return;
    }
    const updated = savedEvents.map(evt => {
      const evtId =
        evt.id ||
        evt.eventId ||
        evt._id;

      if (String(evtId) === String(eventId)) {
        const updatedEvent = {
          ...evt,
          crewIds: Array.isArray(evt.crewIds)
            ? [...evt.crewIds]
            : []
        };
        if (!updatedEvent.crewIds.includes(targetProfile.id)) {
          updatedEvent.crewIds.push(targetProfile.id);
        }
        if (Array.isArray(updatedEvent.crew)) {
          updatedEvent.crew = updatedEvent.crew.map(member =>
            member.id === targetProfile.id
              ? {
                  ...member,
                  status: 'accepted',
                  confirmed: true,
                  changed: true,
                  changedAt: Date.now()
                }
              : member
          );
        }
        return updatedEvent;
      }
      return evt;
    });
    eventService.saveEvents(updated);
    window.dispatchEvent(
      new CustomEvent('request-sent')
    );
    window.dispatchEvent(
      new CustomEvent('route-change')
    );
eventService.saveEvents(updated);

const changedEvent =
  updated.find(evt => {
    const evtId =
      evt.id ||
      evt.eventId ||
      evt._id;

    return String(evtId) === String(eventId);
  });

if (changedEvent) {
  eventService.saveEvent(changedEvent);
}

window.dispatchEvent(
  new CustomEvent('request-sent')
);



  } catch (e) {
    console.error(
      'Fehler beim Übernehmen aus der Shortlist:',
      e
    );
  }
};

  
  const [allProfiles, setAllProfiles] = useState([]);
  const [currentProfileData, setCurrentProfileData] = useState(null);
  const currentUserName = localStorage.getItem('gigsda_user_name');

  useEffect(() => {
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
            console.error("CREWSHORTLIST JSON FEHLER ❌", e);
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
            (currentUserName || '')
              .trim()
              .toLowerCase()
        );

        console.log(
          'CREWSHORTLIST PROFILE DB ✅',
          found
        );

        setCurrentProfileData(found || null);
      })
      .catch(console.error);
  }, [currentUserName]);


  const [dbCrew, setDbCrew] = useState([]);
  const crewProfiles = dbCrew
  .map(member => {
    const profile = allProfiles.find(p => p.id === member.id);
    if (!profile) return null;

    return {
      ...profile,
      status: member.status,
      addedAt: member.addedAt
    };
  })
  .filter(Boolean);


  // 📡 UNZERSTÖRBARER HIGH-SPEED LIVE-CREW LOAD (STRIKTE REAKTIVE EVENT-ISOLIERUNG)
  useEffect(() => {
    const loadRealtimeCrew = () => {
      try {
        const savedEvents = eventService.getEvents();
        
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
        if (matchedEvent && Array.isArray(matchedEvent.crewIds)) {
          const resolvedCrew = matchedEvent.crew || [];

          setDbCrew(resolvedCrew);
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
      const savedEvents = eventService.getEvents();
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
      if (eventIndex > -1 && savedEvents[eventIndex].crewIds) {
        const targetProfile = allProfiles.find(
          p =>
            (p.name || '').toLowerCase() ===
            memberName.toLowerCase()
        );

        if (!targetProfile) {
          console.warn(
            'CREWSHORTLIST Remove: Profil nicht gefunden:',
            memberName
          );
          return;
        }

        savedEvents[eventIndex].crewIds =
          savedEvents[eventIndex].crewIds.filter(
            id => id !== targetProfile.id
          );

        if (savedEvents[eventIndex].crew) {
          const crewMember = savedEvents[eventIndex].crew.find(
            m => m.id === targetProfile.id
          );

          if (crewMember) {
            crewMember.status = "removed";
          }
        }

        const memberIndex = dbCrew.findIndex(
          m => m.id === targetProfile.id
        );

        if (memberIndex > -1) {
          dbCrew[memberIndex].status = "removed";
        }

        eventService.saveEvents(savedEvents);

        window.dispatchEvent(new CustomEvent('request-sent'));
        window.dispatchEvent(new CustomEvent('route-change'));
      }
    } catch (e) {
      console.error("Fehler beim Entfernen des Crew-Mitglieds:", e);
    }
  };

  const activeStub = JSON.parse(
    localStorage.getItem('gigsda_active_event') || 'null'
  );

  const events = eventService.getEvents();

  const currentUserId =
    currentProfileData?.id;

  const currentEvent =
    events.find(e => e.id === activeStub?.id);

  const isOwner =
    currentEvent?.ownerId === currentUserId;

  const crewMembers =
    (currentEvent?.crewIds || [])
      .map(id =>
        allProfiles.find(p => p.id === id)
      )
      .filter(Boolean);

  // STATUSBERECHNUNG FÜR FAHRPLANMETRICS
  const totalRequests =
    currentEvent?.crew?.length || 0;

  const crewCount =
    currentEvent?.crewIds?.length || 0;

  // STATUSBERECHNUNG FÜR BESTÄTIGTE RIDER
  const acceptedMembers = crewMembers;

  const hasOwner =
    !!currentEvent?.ownerId;

  const hasConfirmedMember =
    acceptedMembers.some(
      member =>
        member.id !== currentEvent?.ownerId
    );

  const fulfilledRoles =
    (hasOwner ? 1 : 0) +
    (hasConfirmedMember ? 1 : 0);

  const shortlistProgress =
    Math.round(
      (fulfilledRoles / 2) * 100
    );

  useEffect(() => {
    setProgress(prev => ({
      ...prev,
      shortlist: shortlistProgress
    }));
  }, [shortlistProgress, setProgress]);
  // ENDE STATUSBERECHNUNG

  const ownerName =
    allProfiles.find(
      p => p.id === currentEvent?.ownerId
    )?.name ||
    currentEvent?.ownerName ||
    "Unbekannt";


  return (
    <div className="max-w-4xl mx-auto space-y-6 my-6 p-4 text-xs text-slate-300 font-mono animate-fade-in">
      
      {/* 📊 GLOBALER B2B-FORTSCHRITTS-FAHRPLAN (DIREKT IM COCKPIT INTEGRIERT) */}
      <FahrplanMetrics progress={progress} activeStep="shortlist" onNavigate={onNavigateToStep} />


      {/* HEADER Crew-Short-List */}
      <EventHeaderBox
        activeEvent={activeEvent}
        promoImage={activeEvent?.promotionData?.promoImage}
        title="Crew-Shortlist"
        subtitle="Verifiziere Crew & Favoriten."
        isOwner={isOwner}
        ownerName={ownerName}
        onBack={onBack}
      />


    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl gap-4">
      <div>

          {/* 🚨 REKTIVES PROJEKT-BADGE DIREKT UNTER DER ÜBERSCHRIFT */}
          <div className="bg-slate-950/90 border border-cyan-500/30 px-3 py-1.5 rounded-xl flex items-center gap-2 w-max shadow-[0_0_15px_rgba(6,182,212,0.05)] text-[10px]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
            </span>
            <span className="text-slate-500 font-bold uppercase tracking-wider text-sm">
              // ACTIVE TARGET:
              </span>
            <span className="font-black text-sm text-cyan-400 uppercase tracking-wide">
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
          {isOwner && (
            <>
              <button
                type="button"
                onClick={() => {
                  if (typeof onNavigateToStep === 'function')
                    onNavigateToStep('search');
                  else if (typeof setView === 'function')
                    setView('search');
                }}
                className="bg-slate-950 border border-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                # RADAR SEARCH Explorer
              </button>

              <button
                type="button"
                onClick={() => {
                  if (typeof onNavigateToStep === 'function') {
                    onNavigateToStep('crewfavoriten');
                  } else if (typeof setView === 'function') {
                    setView('crewfavoriten');
                  }
                }}
                className="px-3 py-2 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-cyan-500/40 hover:border-cyan-400 text-cyan-400 hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.05)] font-bold font-mono"
              >
                ⭐ ZUM FAVORITEN-POOL
              </button>
            </>
          )}
        </div>
      </div>

      {/* 📊 DYNAMISCHER CREW-INJEKTIONS-POOL (EXAKT IN DER ZENTRALEN BOX) */}
      <div className="space-y-4">
        {crewProfiles && crewProfiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono w-full text-left animate-fade-in">
            {crewProfiles.map((member, idx) => {
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
              } else if (status === 'removed' || status === 'entfernt') {
                statusColor = "text-slate-400 border-slate-500/30 bg-slate-500/5";
                statusLabel = "⚪ ENTFERNT";
              }

              return (

                <CrewCard
                  key={idx}
                  member={member}
                  statusColor={statusColor}
                  statusLabel={statusLabel}
                  actionContent={(() => {
                  const activeStub = JSON.parse(
                    localStorage.getItem('gigsda_active_event') || 'null'
                  );

                  const events = eventService.getEvents();

                  const currentEvent = events.find(
                    e => e.id === activeStub?.id
                  );

                  const isInCrew =
                    currentEvent?.crewIds?.includes(member.id);

                  if (isInCrew) {
                    return (
                      <div className="text-[10px] bg-green-500/20 border border-green-400 px-2 py-1 rounded text-green-300">
                        ✅ In Crew
                      </div>
                    );
                  }

                  if (member.status === "removed") {
                    return (
                      <button
                        onClick={() => {
                          addFromShortlist(activeStub?.id, member.name);
                        }}
                        className="text-[10px] bg-slate-500/10 border border-slate-400 px-2 py-1 rounded text-slate-300"
                      >
                        ↩️ Erneut übernehmen
                      </button>
                    );
                  }

                  if (member.status === "declined") {
                    return (
                      <div className="text-[10px] bg-red-500/20 border border-red-400 px-2 py-1 rounded">
                        ❌ Anfrage abgelehnt
                      </div>
                    );
                  }

                  if (member.status === "counter_offer") {
                    return (
                      <div className="text-[10px] bg-cyan-500/20 border border-cyan-400 px-2 py-1 rounded">
                        ⚡ Gegenvorschlag erhalten
                      </div>
                    );
                  }

                  if (member.status !== "accepted") {
                    return (
                      <div className="text-[10px] bg-orange-500/20 border border-orange-400 px-2 py-1 rounded">
                        ⏳ Warten auf Zusage
                      </div>
                    );
                  }

                  return (
                    <button
                      onClick={() => {
                        addFromShortlist(activeStub?.id, member.name);
                      }}
                      className="text-[10px] bg-emerald-500/10 border border-emerald-400 px-2 py-1 rounded"
                    >
                      ➕ In Crew übernehmen
                    </button>
                  );
                })()}
                  onRemove={
                    isOwner
                      ? () => handleRemoveMember(member.name)
                      : null
                  }
                />

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

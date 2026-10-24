import React, { useState, useEffect } from 'react';
import { saveFavorite, deleteFavorite} from '../../../services/apiService';
import { eventService } from '../../../services/eventService';
import { saveCrewRequest} from '../../../services/apiService';
import ReportContentLink from '../../ReportContentLink';

export default function PortfolioActionBar({
    profile,
    isOwner,
    setView
}) {

  
    // FAVORITENLOGIK
    const [isFavorite, setIsFavorite] = useState(false);
    const ownerProfileId = localStorage.getItem('gigsda_profile_id');
    const favoriteKey = `gigsda_favorites_${ownerProfileId}`;

      useEffect(() => {
      const savedFavs = JSON.parse(
        localStorage.getItem(favoriteKey) || '[]'
      );
      setIsFavorite(
        savedFavs.includes(profile?.id)
      );
    }, [profile?.id, favoriteKey]);

    const toggleFavorite = () => {

      let savedFavs = JSON.parse(
        localStorage.getItem(favoriteKey) || '[]'
      );

      if (savedFavs.includes(profile.id)) {
        savedFavs =
          savedFavs.filter(
            f => f !== profile.id
          );
        deleteFavorite(
          ownerProfileId,
          profile.id
        ).catch(console.error);

        setIsFavorite(false);
      } else {
        savedFavs.push(profile.id);
        saveFavorite(
          ownerProfileId,
          profile.id
        ).catch(console.error);
        setIsFavorite(true);
      }
      localStorage.setItem(
        favoriteKey,
        JSON.stringify(savedFavs)
      );
      window.dispatchEvent(
        new Event('storage')
      );
    };


    // ANFRAGEN
    const [isRequestMaskOpen, setIsRequestMaskOpen] = useState(false);
    const [myProjects, setMyProjects] = useState([]);
    useEffect(() => {
      if (!isRequestMaskOpen) return;
      try {
        const currentProfileId =
          localStorage.getItem('gigsda_profile_id');
        const savedEvents =
          eventService.getEvents();
        const myEvents =
          savedEvents.filter(ev =>
            ev &&
            ev.archived !== true &&
            (
              ev.ownerId === currentProfileId ||
              ev.crewIds?.includes(currentProfileId)
            )
          );

        setMyProjects(myEvents);
      } catch (e) {
        console.error(e);
      }
    }, [isRequestMaskOpen]);



const submitB2BRequest = async (project) => {
  try {
    const now = Date.now();

    const requesterProfileId =
      localStorage.getItem('gigsda_profile_id') ||
      '';

    const requesterProfileName =
      localStorage.getItem('gigsda_user_name') ||
      'Veranstalter';

    const requestedProfileId =
        profile?.id || '';

    if (!requestedProfileId) {
      alert("Zielprofil konnte nicht eindeutig geladen werden.");
      return;
    }

    const newRequest = {
      requestId:
        "REQ-" + Math.floor(Math.random() * 9000 + 1000),

      eventId:
        project.id ||
        project.eventId ||
        project._id ||
        '',

      eventName:
        project.title ||
        project.name ||
        "B2B Event",

      date:
        project.date ||
        "Termin folgt",

      requestedProfileId:
        profile?.id || '',

      requestedProfileName:
        profile?.klarname ||
        profile?.name ||
        '',

      requestedProfileRole:
        profile?.role ||
        'Crew',

      requestedProfileCity:
        profile?.city ||
        '',

      requesterProfileId:
        requesterProfileId,

      requesterProfileName:
        requesterProfileName,

      requesterName:
        requesterProfileName,

      status: "pending",

      source: "profile_direct",

      createdAt: now,
      updatedAt: now,

      note:
        `Direktanfrage über Profil von ${
          profile?.klarname ||
          profile?.name ||
          ''
        }`
    };

    const saveResult =
      await saveCrewRequest(newRequest);

    const savedEvents = eventService.getEvents();

    const eventIndex = savedEvents.findIndex(ev =>
      ev &&
      (
        ev.id === newRequest.eventId ||
        ev.eventId === newRequest.eventId ||
        ev._id === newRequest.eventId ||
        ev.title === newRequest.eventName ||
        ev.name === newRequest.eventName
      )
    );

    if (eventIndex > -1) {
      if (!savedEvents[eventIndex].crew) {
        savedEvents[eventIndex].crew = [];
      }

      const alreadyInCrew =
        savedEvents[eventIndex].crew.some(
          member =>
            member &&
            member.id === requestedProfileId
        );

      if (!alreadyInCrew) {
        savedEvents[eventIndex].crew.push({
          id: requestedProfileId,
          name: newRequest.requestedProfileName,
          role: newRequest.requestedProfileRole,
          status: "pending",
          city: newRequest.requestedProfileCity,
          addedAt: new Date().toLocaleDateString('de-DE')
        });

        eventService.saveEvents(savedEvents);
      }
    }

    window.dispatchEvent(
      new CustomEvent('request-sent')
    );

    window.dispatchEvent(
      new CustomEvent('route-change')
    );

    alert(
      `B2B-Anfrage an ${newRequest.requestedProfileName} erfolgreich gesendet! ⚡`
    );

    setIsRequestMaskOpen(false);

  } catch (err) {
    console.error(
      "Fehler beim Senden der Profil-Direktanfrage:",
      err
    );
  }
};

const primaryBtn =
  "px-5 py-3 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition";

const secondaryBtn =
  "px-5 py-3 rounded-xl border border-slate-700 hover:border-cyan-500 hover:text-cyan-400 transition";

const manageBtn =
  "px-5 py-3 rounded-xl border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black transition";

    return (
    <div className="no-print flex gap-3 mt-6 flex-wrap">

      <button className={primaryBtn}>
        {profile?.role}
      </button>

      {profile?.lat && profile?.lng && (
        <a
          href={`https://www.google.com/maps?q=${profile.lat},${profile.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className={primaryBtn}
        >
          Route planen
        </a>
      )}



      <button
        onClick={toggleFavorite}
        className={secondaryBtn}
      >
        {isFavorite ? 'Favorisiert' : 'Favorit'}
      </button>

      <button
        onClick={() => setIsRequestMaskOpen(true)}
        className={secondaryBtn}
      >
        Anfrage
      </button>

      <ReportContentLink
        contentType="Profil / Portfolio"
        contentId={profile?.id}
        title={profile?.Klarname || profile?.display_name || profile?.name}
        className={secondaryBtn}
      />

      {profile?.website && (
        <a
          href={profile.website}
          target="_blank"
          rel="noopener noreferrer"
          className={secondaryBtn}
        >
          Website
        </a>
      )}

      {isOwner && (
        <button
          onClick={() => setView('userProfile')}
          className={manageBtn}
        >
          Verwalten
        </button>
      )}







      {/* B2B ANFRAGEMASKE */}
      {isRequestMaskOpen && (
        <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md p-6 font-mono text-sm text-slate-300 overflow-y-auto rounded-3xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-2">
            <h3 className="text-purple-400 text-sm tracking-widest font-bold uppercase">
              // ANFRAGE TERMINAL
            </h3>
            <button type="button" 
              onClick={() => setIsRequestMaskOpen(false)} 
              className="text-slate-500 hover:text-white cursor-pointer">
              ✕
            </button></div>
          <div className="space-y-4">
            <div className="p-4 bg-purple-950/10 border border-purple-900/30 rounded-xl text-sm text-purple-300">
            Wähle das Projekt aus, für das du{' '}
            <span className="text-white font-bold">
              {profile.Klarname || profile.display_name || profile.name}
            </span> anfragen möchtest.</div>
            <div className="grid grid-cols-1 gap-2 max-h-[180px] overflow-y-auto pr-1">
              {myProjects.length > 0 ? (myProjects.map((proj, idx) => (
                <button key={idx} type="button" 
                  onClick={() => submitB2BRequest(proj)} 
                  className="w-full text-left p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-white 
                  hover:border-purple-500 hover:bg-purple-950/10 transition-all cursor-pointer">
                  📐 Projekt: 
                  <span className="text-purple-400 font-bold">{proj.title || proj.name}</span>
                </button>
              ))) : (<div className="text-slate-500 text-sm">// KEINE AKTIVEN PROJEKTE GEFUNDEN</div>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Briefcase, Calendar, ChevronRight, X, Sparkles, Filter, ShieldCheck, Heart, User, Clock, ArrowRight } from 'lucide-react';
import FavoritenCard from './components/cards/FavoritenCard';

import { eventService } from './services/eventService';
import { distanceKm, geocodeAddress } from './services/geoService';
import SearchMap from './components/maps/SearchMap';

import { getProfilesDb, saveCrewRequest, getFavorites, deleteFavorite } from './services/apiService';

export default function CrewFavoritenListe({ onNavigate }) {
  const [favorites, setFavorites] = useState([]);
  const [filterRole, setFilterRole] = useState('all');
  const [allProfiles, setAllProfiles] = useState([]);
  const [currentProfileData, setCurrentProfileData] = useState(null);
  const currentProfileId = localStorage.getItem('gigsda_profile_id');
  const [selectedRole, setSelectedRole] = useState('Alle');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchRadius, setSearchRadius] = useState(500);
  const [baseLocation, setBaseLocation] = useState('Braunau');
  const [baseCoordinates, setBaseCoordinates] = useState(null);
  const [genreFilter, setGenreFilter] = useState('');
  const [formationFilter, setFormationFilter] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [selectedUser, setSelectedUser] = useState(null);

  // SYSTEM-ROLES FÜR DIE GEWERKE-FILTER MATRIX
  const ROLES_LIST = ['Alle', 'Künstler', 'Caterer', 'Verleiher', 'Location', 'Veranstalter', 'Techniker', 'Logistik', 'Security', 'Design'];

  useEffect(() => {
    const loadBaseCoordinates = async () => {
      if (!baseLocation?.trim()) return;
      try {
        const geo =
          await geocodeAddress(
            baseLocation
          );
        setBaseCoordinates(geo);
      } catch (e) {
        console.error(e);
      }
    };
    loadBaseCoordinates();
  }, [baseLocation]);

  // 📡 SAUBERE PROD-LEITUNG: Lädt nur echte, vom User gewählte Favoriten
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const dbFavs =
          await getFavorites(
            currentProfileId
          );
        const favoriteIds =
          dbFavs.map(
            fav => fav.favorite_profile_id
          );
        setFavorites(favoriteIds);
      } catch (e) {
        console.error(
          "Fehler beim Laden der Favoriten:",
          e
        );
      }
    };
    loadFavorites();
  }, []);


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
              'CREWFAVORITEN JSON FEHLER ❌',
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

        setCurrentProfileData(found || null);
      })
      .catch(console.error);
  }, []);

  const removeFavorite = async (id) => {
    try {
      await deleteFavorite(
        currentProfileId,
        id
      );
      const updated =
        favorites.filter(
          f => f !== id
        );
      setFavorites(updated);
    } catch (e) {
      console.error(
        'Fehler beim Entfernen:',
        e
      );
    }
  };

  const favoriteProfiles = favorites
    .map(favId => allProfiles.find(p => p.id === favId))
    .filter(Boolean);

  const filteredFavs =
  favoriteProfiles.filter(user => {

    const searchValue =
      searchTerm.toLowerCase();

    const matchesName =
      user.name
        ?.toLowerCase()
        .includes(searchValue);

    const matchesId =
      user.id
        ?.toLowerCase()
        .includes(searchValue);

    const matchesGenre =
      !genreFilter ||
      (user.genre || '')
        .toLowerCase()
        .includes(
          genreFilter.toLowerCase()
        );

    const matchesFormation =
      !formationFilter ||
      (user.formation || '')
        .toLowerCase()
        .includes(
          formationFilter.toLowerCase()
        );

    const matchesEventType =
      !eventTypeFilter ||
      (user.event_types || '')
        .toLowerCase()
        .includes(
          eventTypeFilter.toLowerCase()
        );

    const userRole =
      (
        user.role ||
        user.type ||
        ''
      ).toLowerCase();

    let matchesRole = false;

    if (selectedRole === 'Alle') {
      matchesRole = true;
    } else if (
      selectedRole === 'Caterer'
    ) {
      matchesRole =
        userRole.includes('cater');
    } else if (
      selectedRole === 'Verleiher'
    ) {
      matchesRole =
        userRole.includes('verleiher');
    } else if (
      selectedRole === 'Location'
    ) {
      matchesRole =
        userRole.includes('location');
    } else if (
      selectedRole === 'Veranstalter'
    ) {
      matchesRole =
        userRole.includes('veranstalter');
    } else if (
      selectedRole === 'Techniker'
    ) {
      matchesRole =
        userRole.includes('technik');
    } else if (
      selectedRole === 'Logistik'
    ) {
      matchesRole =
        userRole.includes('logistik');
    } else if (
      selectedRole === 'Security'
    ) {
      matchesRole =
        userRole.includes('security');
    } else if (
      selectedRole === 'Design'
    ) {
      matchesRole =
        userRole.includes('design');
    } else {
      matchesRole =
        userRole.includes(
          selectedRole.toLowerCase()
        );
    }

    const userDistance =
      baseCoordinates?.lat &&
      baseCoordinates?.lng &&
      user?.lat &&
      user?.lng
        ? distanceKm(
            baseCoordinates.lat,
            baseCoordinates.lng,
            user.lat,
            user.lng
          )
        : Number.MAX_VALUE;

    const matchesRadius =
      userDistance <= searchRadius;

    return (
      (matchesName || matchesId) &&
      matchesRole &&
      matchesRadius &&
      matchesGenre &&
      matchesFormation &&
      matchesEventType
    );
  });

  // 🏟️ STATE FÜR DIE PROJEKT-AUSWAHL
  const [events, setEvents] = useState([]);
  const [activeSelectFav, setActiveSelectFav] = useState(null); // Welcher Favorit wird gerade hinzugefügt?

  // Lade die aktuell erstellten Events des Veranstalters beim Start
  useEffect(() => {
    try {
      const savedEvents = eventService.getEvents();

  const currentProfileId =
    currentProfileData?.id ||
    localStorage.getItem('gigsda_profile_id');

  const myEvents = savedEvents.filter(
    ev =>
      ev &&
      ev.archived !== true &&
      (
        ev.ownerId === currentProfileId ||
        ev.crewIds?.includes(currentProfileId)
      )
  );

      setEvents(myEvents);

    } catch (e) {
      console.error("Fehler beim Event-Load:", e);
    }
 }, [activeSelectFav, currentProfileData]);


  // ⚡ INJIZIERT DEN FAVORITEN IN DIE CREWLISTE DES AUSGEWÄHLTEN EVENTS
  const handleAddFavToProject = async (eventId, fav) => {
    try {

        const savedEvents = eventService.getEvents();
        
        // 📡 Sucht das Event über die ID heraus
        let eventIndex = savedEvents.findIndex(ev => ev && (ev.id === eventId || ev.eventId === eventId || ev._id === eventId));

        // 🚨 AUTOMATISCHE INITIALISIERUNG: Falls das Event fehlt, erschaffen wir es blitzschnell live!
        if (eventIndex === -1) {
          let activeTitle = "WAYNESTOCK 2";
          try {
            const activeData = localStorage.getItem('gigsda_active_event');
            if (activeData) activeTitle = JSON.parse(activeData).title;
          } catch (e) {}

          const newEventPlaceholder = {
            id: eventId || "EVT-" + Math.floor(Math.random() * 9000 + 1000),
            title: activeTitle,
            name: activeTitle,
            date: new Date().toLocaleDateString('de-DE'),
            crew: []
          };
          savedEvents.push(newEventPlaceholder);
          eventIndex = savedEvents.length - 1;
        }

        // Sicherstellen, dass das gefundene/erstellte Event ein gültiges Crew-Array hat
        if (eventIndex > -1) {
          if (!savedEvents[eventIndex].crew) {
            savedEvents[eventIndex].crew = [];
          }

        // Doppelbuchungen im selben Event verhindern
        const alreadyInCrew = savedEvents[eventIndex].crew.some(member =>
          member && member.id === fav.id
        );

        if (alreadyInCrew) {
          alert(`${fav.name} ist bereits in der Crewliste dieses Projekts eingetragen!`);
          setActiveSelectFav(null);
          return;
        }

        // Neues B2B-Crewmitglied mit Standardstatus 'pending' anlegen
        const newCrewMember = {
          id: fav.id, // 🔥 DAS HINZUFÜGEN
          name: fav.name,
          role: fav.role,
          status: 'pending', // Startet offen für die Anfrage
          city: fav.city || '',
          addedAt: new Date().toLocaleDateString('de-DE')
        };

        savedEvents[eventIndex].crew.push(newCrewMember);
        
        // Speichern in den korrekten Keys (Sicherheits-Fallback für beide Schreibweisen)
        eventService.saveEvents(savedEvents);

        const changedEvent =
          savedEvents[eventIndex];

        if (changedEvent) {
          eventService.saveEvent(changedEvent);
        }
        
        // ⚡ ZÜNDET DEN REAKTIVEN LIVE-FUNKSPRUCH FÜR DANIELS DASHBOARD!
        window.dispatchEvent(new CustomEvent('request-sent'));
        window.dispatchEvent(new CustomEvent('route-change'));

        // Zusätzlich direkt eine Crew-Anfrage im globalen System anlegen!
        const now = Date.now();

        const requesterProfileId =
          currentProfileData?.id ||
          localStorage.getItem('gigsda_profile_id') ||
          '';

        const requesterProfileName =
          currentProfileData?.name ||
          localStorage.getItem('gigsda_user_name') ||
          "Veranstalter";

        const newRequest = {
          requestId:
            "REQ-" + Math.floor(Math.random() * 9000 + 1000),

          eventId:
            savedEvents[eventIndex].id,

          eventName:
            savedEvents[eventIndex].title ||
            savedEvents[eventIndex].name ||
            "B2B Event",

          date:
            savedEvents[eventIndex].date ||
            "Termin folgt",

          requestedProfileId:
            fav.id,

          requestedProfileName:
            fav.name,

          requestedProfileRole:
            fav.role ||
            fav.type ||
            "Crew",

          requestedProfileCity:
            fav.city ||
            fav.ort ||
            "",

          requesterProfileId:
            requesterProfileId,

          requesterProfileName:
            requesterProfileName,

          requesterName:
            requesterProfileName,

          status: "pending",

          source: "favorites",

          createdAt: now,
          updatedAt: now,

          note:
            "Automatisch über Crew-Favoritenliste hinzugefügt."
        };

        const saveResult =
          await saveCrewRequest(newRequest);

        window.dispatchEvent(new CustomEvent('request-sent'));

        alert(`✓ ${fav.name} wurde erfolgreich als ${fav.role} zum Projekt hinzugefügt und angefragt! ⚡`);
        setActiveSelectFav(null);
      }
    } catch (e) {
      console.error("Fehler beim Hinzufügen zum Projekt:", e);
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-950 border border-slate-900 rounded-3xl font-mono text-white shadow-2xl">
      
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-900 p-8 mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 p-6 text-slate-800 opacity-20 pointer-events-none">
          <Sparkles size={160} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="text-sm bg-amber-500/10 border border-amber-500 text-amber-400 font-bold px-2 py-0.5 rounded-md uppercase tracking-widest">
            ★ REAKTIVE MERKLISTE
          </span>

          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-2 bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Meine gespeicherten Favoriten
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-lg uppercase tracking-wide">
            Füge deine Favoriten Projekten hinzu.
          </p>
        </div>
      </div>  

      {/* 🎛️ FILTER-LEISTE */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {ROLES_LIST.map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`text-xs uppercase font-bold tracking-widest px-3 py-1.5 rounded-xl 
              border transition-all duration-300 cursor-pointer 
              ${
              selectedRole === role
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            {role === 'Alle' ? 'ALLES ANZEIGEN' : ` ${role}`}
          </button>
        ))}
      </div>

      {/* Zeile 1: Künstlersuche, Standort, Genre */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pt-6">
        
        {/* 1. Künstlersuche */}
        <div>
          <label className="text-xs font-mono text-slate-500 uppercase block mb-1.5">
            // Netzwerk durchsuchen
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Nach Namen suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
              w-full bg-slate-900/60 border border-slate-800 focus:border-cyan-500/50 
              rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all 
              placeholder:text-slate-600
              "
            />
          </div>
        </div>

        {/* 2. Basis-Standort */}
        <div>
          <label className="text-xs font-mono text-slate-500 uppercase block mb-1.5">
            // Basis-Standort
          </label>
          <input
            type="text"
            placeholder="z.B. Braunau, Linz..."
            value={baseLocation}
            onChange={(e) => setBaseLocation(e.target.value)}
            className="
            w-full bg-slate-900/60 border border-slate-800 
            focus:border-cyan-500/50 rounded-xl px-4 py-2.5 
            text-sm text-white focus:outline-none transition-all 
            placeholder:text-slate-600
            "
          />
        </div>

        {/* 3. Genre */}
        <div>
          <label className="text-xs font-mono text-slate-500 uppercase block mb-1.5">
            // Genre durchsuchen
          </label>
          <input
            type="text"
            placeholder="Genre Durchsuchen Text"
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="
            w-full bg-slate-900/60 border border-slate-800 focus:border-cyan-500/50 
            rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all 
            placeholder:text-slate-600
            "
          />
        </div>
      </div>


      {/* Zeile 2: Besetzung, Aktionsradius, Passend für (Type) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Besetzung */}
        <div>
          <label className="text-xs font-mono text-slate-500 uppercase block mb-1.5">
            // Besetzung
          </label>
          <select 
            value={formationFilter}
            onChange={(e) =>
              setFormationFilter(e.target.value)
            }
            className="
            w-full bg-slate-900/60 border border-slate-800 focus:border-cyan-500/50 
            rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none transition-all cursor-pointer appearance-none
            ">
            <option value="">Alle Formationen</option>
            <option value="solo">🎙 Solo-Act</option>
            <option value="duo">👥 Duo / Trio</option>
            <option value="band">🎸 Band / Musikgruppe</option>
            <option value="dj">🎧 DJ / Producer</option>
          </select>
        </div>

        {/* 2. Aktionsradius */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-mono text-slate-500 uppercase">
              // Aktionsradius
            </label>
            <span className="text-xs font-mono font-bold text-cyan-400">
              🛰️ {searchRadius} km
            </span>
          </div>
          <div className="pt-2">
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* 3. Passend für (Type) */}
        <div>
          <label className="text-xs font-mono text-slate-500 uppercase block mb-1.5">
            // Passend für
          </label>
          <select 
            value={eventTypeFilter}
            onChange={(e) =>
              setEventTypeFilter(e.target.value)
            }
            className="
            w-full bg-slate-900/60 border border-slate-800 focus:border-cyan-500/50 
            rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none transition-all cursor-pointer appearance-none
            ">
            <option value="">Jeder Event-Typ</option>
            <option value="club">Club / Festival</option>
            <option value="corporate">Firmenevent / Gala</option>
            <option value="wedding">Hochzeit / Privat</option>
            <option value="bar">Bar / Lounge</option>
          </select>
        </div>
      </div>


      {/* 💳 TREFFER */}
      <div className="
        mt-6
        mb-4
        inline-flex
        items-center
        gap-2
        px-3
        py-1
        rounded-xl
        border
        border-yellow-500/30
        bg-yellow-500/5
      ">
        <span className="animate-pulse">
          ⚡
        </span>

        <span className="
          text-yellow-400
          text-xs
          uppercase
          tracking-widest
          font-black
        ">
          {filteredFavs.length} TREFFER GEFUNDEN
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedUser(null);
              setViewMode('list');
            }}
            className={
              viewMode === 'list'
                ? 'px-3 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500 text-cyan-400 text-[10px]'
                : 'px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-[10px]'
            }
          >
            🗂️ LISTE
          </button>

          <button
            onClick={() => {
              setSelectedUser(null);
              setViewMode('map');
            }}
            className={
              viewMode === 'map'
                ? 'px-3 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500 text-cyan-400 text-[10px]'
                : 'px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-[10px]'
            }
          >
            🗺️ KARTE
          </button>
        </div>
      </div>


      {/* FAVORITEN GRID */}
      {viewMode === 'list' ? (

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredFavs.map(fav => (
            <FavoritenCard
              key={fav.id}
              fav={fav}
              activeSelectFav={activeSelectFav}
              events={events}
              onSelect={() => setActiveSelectFav(fav.name)}
              onAddToProject={(eventId) =>
                handleAddFavToProject(eventId, fav)
              }
              onRemove={() => removeFavorite(fav.id)}
              onCancel={() => setActiveSelectFav(null)}
            />
          ))}
        </div>

      ) : (
          <>
            <div className="relative">
              <SearchMap
                users={filteredFavs}
                center={baseCoordinates}
                onUserSelect={setSelectedUser}
              />
              {selectedUser && (
                <div className="absolute left-1/2 top-6 -translate-x-1/2 z-[9999] w-full max-w-lg px-4">
                  <div className="relative">

                    <button
                      onClick={() => setSelectedUser(null)}
                      className="absolute -top-3 -right-3 z-50"
                    >
                      ✕
                    </button>

                    <FavoritenCard
                      fav={selectedUser}
                      activeSelectFav={activeSelectFav}
                      events={events}
                      onSelect={() => setActiveSelectFav(selectedUser.name)}
                      onAddToProject={(eventId) =>
                        handleAddFavToProject(eventId, selectedUser)
                      }
                      onRemove={() => removeFavorite(selectedUser.id)}
                      onCancel={() => setSelectedUser(null)}
                    />

                  </div>
                </div>
              )}
            </div>
          </>
        )}


    </div>
  );
}
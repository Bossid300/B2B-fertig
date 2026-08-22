import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Briefcase, Calendar, ChevronRight, X, Sparkles, Filter, ShieldCheck, Heart, User, Clock, ArrowRight } from 'lucide-react';
import ProfileCard from './components/cards/ProfileCard';
import { getProfiles } from './services/apiService';
import { saveCrewRequest } from './services/apiService';
import { eventService } from './services/eventService';
import { distanceKm, geocodeAddress } from './services/geoService';
import SearchMap from './components/maps/SearchMap';

export default function SearchExplorer({ onNavigate, setFavorites, setActiveChat }) {
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchRadius, setSearchRadius] = useState(500); // 📡 Live-Suchumkreis
  const [selectedRole, setSelectedRole] = useState('Alle');
  const [activeRequestUser, setActiveRequestUser] = useState(null); // Sichert das Anfrage-Popup!
  const [requestText, setRequestText] = useState(''); // Speichert euren eingetippten Text
  const [baseLocation, setBaseLocation] = useState('Braunau');
  const [baseCoordinates, setBaseCoordinates] = useState(null);
  const [genreFilter, setGenreFilter] = useState('');
  const [formationFilter, setFormationFilter] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [profileView, setProfileView] = useState('live');
  const [viewMode, setViewMode] = useState('list');
  const [selectedUser, setSelectedUser] = useState(null);
  useEffect(() => {
  }, [selectedUser]);

  // 🏟️ ECHTZEIT-PROJEKTLISTE FÜR DIE EXPLORER-DIREKTANFRAGE
  const [events, setEvents] = useState([]);
  const [showProjectSelect, setShowProjectSelect] = useState(false);
  const [currentProfileData, setCurrentProfileData] = useState(null);
  const isLoggedIn = localStorage.getItem('gigsda_logged_in') === 'true';

  useEffect(() => {
    const loadBaseCoordinates = async () => {
      if (!baseLocation?.trim()) return;
      try {
        const geo =
          await geocodeAddress(
            baseLocation
          );
        setBaseCoordinates(
          geo
        );
      } catch (e) {
        console.error(e);
      }
    };
    loadBaseCoordinates();
  }, [baseLocation]);


  useEffect(() => {
    try {
      const savedEvents = eventService.getEvents();

      const currentProfileId =
        currentProfileData?.id ||
        localStorage.getItem('gigsda_profile_id');

      const myEvents = savedEvents.filter(ev =>
        ev &&
        ev.archived !== true &&
        (
          ev.ownerId === currentProfileId ||
          ev.crewIds?.includes(currentProfileId)
        )
      );

      setEvents(myEvents);
    } catch (e) {
      console.error(
        "Fehler beim Laden der Events im Explorer:",
        e
      );
    }
  }, [activeRequestUser, currentProfileData]);


  // ⚡ AUTOMATISCHE DIREKT-PROJEKT-BUCHUNG BEIM ABSENDEN (PERFEKT SYNCED!)
  const handleSendRequestToProject = async (eventId) => {
    try {
      const savedEvents = eventService.getEvents();
            const targetEvent = savedEvents.find(ev => ev && (ev.id === eventId || ev.eventId === eventId || ev._id === eventId));
      if (!targetEvent) return;
      const eventTitle = targetEvent.title || targetEvent.name || "B2B Event";
      // 📡 LIVE-SPEICHER-KOPPLUNG: Zwingt den Browser, sofort reaktiv auf dieses aktive Projekt umzuschalten!
      localStorage.setItem('gigsda_active_event', JSON.stringify({
        id: eventId,
        title: eventTitle
      }));
      const now = Date.now();
      const requesterProfileId =
        currentProfileData?.id ||
        localStorage.getItem('gigsda_profile_id') || '';
      const requesterProfileName =
        currentProfileData?.name ||
        localStorage.getItem('gigsda_user_name') || "Veranstalter";
      const newRequest = {
        requestId:
          "REQ-" + Math.floor(Math.random() * 9000 + 1000),
        eventId: eventId,
        eventName: eventTitle,
        date:
          targetEvent.date ||
          "Termin auf Anfrage",
        requestedProfileId:
          activeRequestUser.id,
        requestedProfileName:
          activeRequestUser.name,
        requestedProfileRole:
          activeRequestUser.role ||
          activeRequestUser.type ||
          activeRequestUser.gewerk ||
          "Crew",
        requestedProfileCity:
          activeRequestUser.city ||
          activeRequestUser.ort ||
          "",
        requesterProfileId:
          requesterProfileId,
        requesterProfileName:
          requesterProfileName,
        requesterName:
          requesterProfileName,
        status: "pending",
        source: "search_explorer",
        createdAt: now,
        updatedAt: now,
        note:
          requestText ||
          "Standard-B2B Konditionen laut Profil."
      };

      const saveResult =
        await saveCrewRequest(newRequest);

      let eventIndex = savedEvents.findIndex(ev => ev && (
        (eventId && (ev.id === eventId || ev.eventId === eventId || ev._id === eventId)) ||
        (eventTitle && (ev.title === eventTitle || ev.name === eventTitle))
      ));

      // 🚨 AUTOMATISCHE INITIALISIERUNG: 
      if (eventIndex === -1) {
        const newEventPlaceholder = {
          id: eventId || "EVT-" + Math.floor(Math.random() * 9000 + 1000),
          title: eventTitle,
          name: eventTitle,
          date: targetEvent?.date || new Date().toLocaleDateString('de-DE'),
          crew: []
        };
        savedEvents.push(newEventPlaceholder);
        eventIndex = savedEvents.length - 1;
      }

      if (eventIndex > -1) {
        if (!savedEvents[eventIndex].crew) {
          savedEvents[eventIndex].crew = [];
        }
        
        // Klongeschützte Namens-Extraktion
        const targetProfileName = activeRequestUser?.name || activeRequestUser?.user?.name || activeRequestUser?.username || "Crew-Mitglied";
        const targetProfileRole = activeRequestUser?.role || activeRequestUser?.gewerk || "Crew";
        const targetProfileCity = activeRequestUser?.city || activeRequestUser?.ort || "";
        const targetProfileId = activeRequestUser?.id;

        const alreadyInCrew = savedEvents[eventIndex].crew.some(m =>
          m && m.id === targetProfileId
        );

        if (!alreadyInCrew) {
          savedEvents[eventIndex].crew.push({
            id: targetProfileId,
            name: targetProfileName,
            role: targetProfileRole,
            status: 'pending',
            city: targetProfileCity,
            addedAt: new Date().toLocaleDateString('de-DE')
          });

          eventService.saveEvents(savedEvents);

          const changedEvent =
            savedEvents[eventIndex];

          if (changedEvent) {
            eventService.saveEvent(changedEvent);
          }
        }
      }

      // 3. Globale Funksprüche abfeuern, damit alles reaktiv ohne F5 mitspringt
      window.dispatchEvent(new CustomEvent('request-sent'));
      window.dispatchEvent(new CustomEvent('route-change'));

      // 4. UI zurücksetzen & Schließen
      setRequestText('');
      setShowProjectSelect(false);
      setActiveRequestUser(null);

      alert(`B2B-Crew-Anfrage für "${eventTitle}" erfolgreich übermittelt! ↗️⚡`);
    } catch (e) {
      console.error("Fehler beim Absenden der Direkt-Projekt-Anfrage:", e);
    }
  };





  useEffect(() => {

    getProfiles()
      .then(profiles => {

    const normalizedProfiles = profiles.map(profile => {
      
      let profileData = {};

      try {
        profileData =
          profile.profile_json
            ? JSON.parse(profile.profile_json)
            : {};
      } catch (e) {
        console.error("JSON FEHLER", e);
      }

      return {
        ...profile,
        ...profileData,
        role: profile.role,
        type: profile.type
      };
    });

    const currentUserName =
      localStorage.getItem('gigsda_user_name') || '';

    const currentProfile =
      normalizedProfiles.find(
        p =>
          p &&
          (p.name || p.user_name || p.display_name || '')
            .trim()
            .toLowerCase() ===
          currentUserName.trim().toLowerCase()
      );

    setCurrentProfileData(currentProfile || null);

    setAllUsers(
      normalizedProfiles.filter(
        user => user && user.name
      )
    );

      })
      .catch(err => {
        console.error("PROFILE API FEHLER ❌", err);
      });

  }, [onNavigate]);


const ROLES_LIST = ['Alle', 'Künstler', 'Caterer', 'Verleiher', 'Location', 'Veranstalter', 'Techniker', 'Logistik', 'Security', 'Design'];

  // 🗺️ DIE LIVE-ENTFERNUNGSMATRIX (Gemessen von eurer Heimatbasis Braunau)


  // ⚡ DIE ERWEITERTE FILTER-SCHLEIFE (Filtert nach Name, Rolle UND Radius!)
  const filteredUsers = allUsers.filter(user => {

    const matchesDemoMode =
      profileView === 'demo'
        ? user.is_demo === true
        : user.is_demo !== true;

    if (!matchesDemoMode) {
      return false;
    }

  const searchValue = searchTerm.toLowerCase();
  const matchesName =
    user.name?.toLowerCase().includes(searchValue);
  const matchesId =
    user.id?.toLowerCase().includes(searchValue);   
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


    // 1. Rollen-Filter (original von Daniel)
    const userRole = (user.role || user.type || 'Künstler').toLowerCase();
    let matchesRole = false;
    if (selectedRole === 'Alle') { matchesRole = true;

    } else if (selectedRole === 'Caterer') {
      matchesRole = userRole.includes('cater');
    } else if (selectedRole === 'Verleiher') {
      matchesRole = userRole.includes('verleiher');
    } else if (selectedRole === 'Location') {
      matchesRole = userRole.includes('location');
    } else if (selectedRole === 'Veranstalter') {
      matchesRole = userRole.includes('veranstalter');
    } else if (selectedRole === 'Techniker') {
      matchesRole = userRole.includes('technik');
    } else if (selectedRole === 'Logistik') {
      matchesRole = userRole.includes('logistik');
    } else if (selectedRole === 'Security') {
      matchesRole = userRole.includes('security');
    } else if (selectedRole === 'Design') {
      matchesRole = userRole.includes('design');
    } else {
      matchesRole = userRole.includes(selectedRole.toLowerCase());
    }

    // 2. 🛰️ DER REAKTIVE RADIUS-FILTER: Prüft die km-Distanz gegen den Schieberegler!
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


    const matchesRadius = userDistance <= searchRadius;

    return (matchesName || matchesId) &&
       matchesRole &&
       matchesRadius &&
       matchesGenre &&
       matchesFormation &&
       matchesEventType;
    });



return (
  <div className="max-w-7xl mx-auto p-6 text-white min-h-screen font-mono relative">

      {/* BANNER HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-900 p-8 mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 p-6 text-slate-800 opacity-20 pointer-events-none">
          <Sparkles size={160} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <ShieldCheck size={12} /> Gigsda Engine V3.0 Activated
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-2 bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">B2B Crew Explorer</h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-lg uppercase tracking-wide">
            Durchsuche das verifizierte Gigsda-Netzwerk nach Technikern, Künstlern und Allianzen für deine anstehenden Produktionen.
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
          {filteredUsers.length} TREFFER GEFUNDEN
        </span>


        <div className="flex items-center gap-2">

          <button
            onClick={() => setViewMode('list')}
            className={
              viewMode === 'list'
                ? 'px-3 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500 text-cyan-400 text-[10px]'
                : 'px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-[10px]'
            }
          >
            🗂️ LISTE
          </button>

          <button
            onClick={() => setViewMode('map')}
            className={
              viewMode === 'map'
                ? 'px-3 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500 text-cyan-400 text-[10px]'
                : 'px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-[10px]'
            }
          >
            🗺️ KARTE
          </button>

        </div>


        <button
          onClick={() =>
            setProfileView(
              profileView === 'live'
                ? 'demo'
                : 'live'
            )
          }
          className="flex items-center gap-2"
        >
          <span
            className={
              profileView === 'live'
                ? 'w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]'
                : 'w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'
            }
          />
        </button>

      </div>



      {/* 💳 VISITENKARTEN-GRID / KARTEN-ANSICHT */}
      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <ProfileCard
                key={`${user.id || 'user'}-${index}`}
                user={user}
                isGuest={!isLoggedIn}
                onProfile={() => {
                  localStorage.setItem(
                    'gigsda_active_guest_profile_id',
                    user.id
                  );
                  if (typeof setFavorites === 'function') {
                    setFavorites(user);
                  }
                }}
                onRequest={() => {
                  setActiveRequestUser(user);
                  setRequestText(
                    `Hallo ${user.name}, wir hätten Interesse an einer B2B-Zusammenarbeit für ein anstehendes Event in Region Gigsda!`
                  );
                }}
              />
            ))
          ) : (
            <div className="col-span-full bg-slate-900/10 border border-dashed border-slate-900 rounded-2xl p-12 text-center text-sm text-slate-600 font-mono">
              // KEINE PASSENDEN B2B-PARTNER GEFUNDEN 🧹
            </div>
          )}
        </div>

) : (

  <>
    <div className="relative">

      <SearchMap
        users={filteredUsers}
        center={baseCoordinates}
        onUserSelect={setSelectedUser}
      />

      {selectedUser && (

        <div
          className="
            absolute
            left-1/2
            top-6
            -translate-x-1/2
            z-50
            w-full
            max-w-lg
            px-4
          "
        >

          <div className="relative">

            <button
              onClick={() => setSelectedUser(null)}
              className="
                absolute
                -top-3
                -right-3
                z-[60]
                w-8
                h-8
                rounded-full
                bg-slate-950
                border
                border-cyan-500/30
                text-cyan-400
                hover:text-white
                hover:border-cyan-500
                font-bold
              "
            >
              ✕
            </button>

            <ProfileCard
              user={selectedUser}
              isGuest={!isLoggedIn}
              onProfile={() => {
                localStorage.setItem(
                  'gigsda_active_guest_profile_id',
                  selectedUser.id
                );

                if (typeof setFavorites === 'function') {
                  setFavorites(selectedUser);
                }
              }}
              onRequest={() => {
                setActiveRequestUser(selectedUser);

                setRequestText(
                  `Hallo ${selectedUser.name}, wir hätten Interesse an einer B2B-Zusammenarbeit für ein anstehendes Event in Region Gigsda!`
                );
              }}
            />

          </div>

        </div>

      )}

    </div>
  </>

)}

      
      
      {/* 🌌 DAS ECHTE NEON-ANFRAGETERMINAL (OVERLAY POPUP) */}
      {activeRequestUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 font-mono">
          <div className="bg-slate-950 border-2 border-cyan-500/30 rounded-2xl p-6 max-w-md w-full shadow-[0_0_50px_rgba(34,211,238,0.15)] relative animate-fade-in">
            
            {/* Header */}
            <div className="mb-4 border-b border-slate-900 pb-3">
              <span className="text-[8px] text-cyan-500 block tracking-widest font-black">// GIGSDA B2B PROTOCOL v2.6</span>
              <h2 className="text-sm font-black text-white uppercase tracking-wider mt-1">
                Anfrage an: <span className="text-cyan-400">{activeRequestUser.name}</span>
              </h2>
            </div>

            {/* Infobox */}
            <div className="bg-slate-900/40 border border-slate-900 p-2.5 rounded-xl mb-4 text-[9px] text-slate-400 flex flex-col gap-0.5">
              <p>📍 REGION: <strong className="text-slate-200">{activeRequestUser.city || 'Nicht hinterlegt'}</strong></p>
              <p>🗂️ SPARTE: <strong className="text-slate-200">{activeRequestUser.role || activeRequestUser.type || 'Künstler'}</strong></p>
            </div>

            {/* Nachrichtentext */}
            <div className="space-y-1.5 mb-5">
              <label className="text-[8px] text-slate-500 uppercase block font-black">// Nachrichtentext</label>
              <textarea
                rows="4"
                value={requestText}
                onChange={(e) => setRequestText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/40 rounded-xl p-3 text-xs outline-none text-white font-mono resize-none placeholder-slate-600"
              />
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-2 border-t border-slate-900 pt-4">
              <button
                onClick={() => setActiveRequestUser(null)}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-[10px] font-bold uppercase py-2 rounded-xl transition-all duration-300 cursor-pointer text-center"
              >
                ✕ ABBRECHEN
              </button>
              {/* 🏟️ REAKTIVE PROJEKT-AUSWAHL-MATRIX DIREKT IM RADAR-POPUP */}
              <div className="pt-2 font-mono text-[9px] w-full space-y-2">
                <span className="text-[7px] text-cyan-400 block font-black uppercase tracking-widest">// WÄHLE DAS ZIEL-PROJEKT FÜR DIE ANFRAGE:</span>
                
                {events.length === 0 ? (
                  <div className="text-center py-4 border border-dashed border-slate-900 rounded-xl text-slate-600 uppercase text-[8px]">
                    // Keine aktiven Events im Dashboard gefunden.
                  </div>
                ) : (
                  <div className="max-h-32 overflow-y-auto space-y-1 pr-1 border border-slate-900 p-1.5 rounded-xl bg-slate-950/40">
                    {events.map(ev => {
                      if (!ev) return null;
                      return (
                        <button 
                          key={ev.id || ev.eventId || ev._id} 
                          onClick={() => handleSendRequestToProject(ev.id || ev.eventId || ev._id)}
                          className="w-full text-left px-3 py-2 bg-slate-900 hover:bg-cyan-500/10 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white rounded-xl text-[9px] transition-all truncate cursor-pointer block font-bold"
                        >
                          📅 {ev.title || ev.name || "Unbenanntes Event"}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

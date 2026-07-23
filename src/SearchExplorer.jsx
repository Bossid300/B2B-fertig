import React, { useState, useEffect } from 'react';
import ProfileCard from './components/cards/ProfileCard';

export default function SearchExplorer({ onNavigate, setFavorites, setActiveChat }) {
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchRadius, setSearchRadius] = useState(500); // 📡 Live-Suchumkreis
  const [selectedRole, setSelectedRole] = useState('Alle');
  const [activeRequestUser, setActiveRequestUser] = useState(null); // Sichert das Anfrage-Popup!
  const [requestText, setRequestText] = useState(''); // Speichert euren eingetippten Text
  
  // 🏟️ ECHTZEIT-PROJEKTLISTE FÜR DIE EXPLORER-DIREKTANFRAGE
  const [events, setEvents] = useState([]);
  const [showProjectSelect, setShowProjectSelect] = useState(false);

  const isLoggedIn =
  localStorage.getItem('gigsda_logged_in') === 'true';

  useEffect(() => {
    try {
      const savedEvents = JSON.parse(
        localStorage.getItem('gigsda_events') || '[]'
      );

      const currentProfileId =
        localStorage.getItem('gigsda_profile_id');

      const myEvents = savedEvents.filter(
        ev => ev.ownerId === currentProfileId
      );

      setEvents(myEvents);
    } catch (e) {
      console.error("Fehler beim Laden der Events im Explorer:", e);
    }
  }, [activeRequestUser]);

  // ⚡ AUTOMATISCHE DIREKT-PROJEKT-BUCHUNG BEIM ABSENDEN (PERFEKT SYNCED!)
  const handleSendRequestToProject = (eventId) => {
    try {
      const allRequests = JSON.parse(localStorage.getItem('gigsda_crew_requests') || '[]');
      const savedEvents = JSON.parse(localStorage.getItem('gigsda_events') || '[]');
      
      const targetEvent = savedEvents.find(ev => ev && (ev.id === eventId || ev.eventId === eventId || ev._id === eventId));
      if (!targetEvent) return;

      const eventTitle = targetEvent.title || targetEvent.name || "B2B Event";

      // 📡 LIVE-SPEICHER-KOPPLUNG: Zwingt den Browser, sofort reaktiv auf dieses aktive Projekt umzuschalten!
      localStorage.setItem('gigsda_active_event', JSON.stringify({
        id: eventId,
        title: eventTitle
      }));

      // 1. Schreibt die Anfrage sauber in gigsda_crew_requests für das goldene Fenster
      const newRequest = {
        requestId: "REQ-" + Math.floor(Math.random() * 9000 + 1000),
        eventName: eventTitle,
        date: targetEvent.date || "Termin auf Anfrage",
        requestedProfileId: activeRequestUser.id,
        requestedProfileName: activeRequestUser.name,
        requesterName: localStorage.getItem('gigsda_user_name') || "Veranstalter",
        status: "pending",
        note: requestText || "Standard-B2B Konditionen laut Profil."
      };
      allRequests.push(newRequest);
      localStorage.setItem('gigsda_crew_requests', JSON.stringify(allRequests));

      // 2. Schleust den Partner zeitgleich direkt als "pending" in das Event-Crew-Array ein!
      // 2. Schleust den Partner zeitgleich direkt als "pending" in das Event-Crew-Array ein!
      // 📡 UNZERSTÖRBARE DOPPEL-BRÜCKE: Findet das Projekt oder legt es vollautomatisch neu an!
      let eventIndex = savedEvents.findIndex(ev => ev && (
        (eventId && (ev.id === eventId || ev.eventId === eventId || ev._id === eventId)) ||
        (eventTitle && (ev.title === eventTitle || ev.name === eventTitle))
      ));

      // 🚨 AUTOMATISCHE INITIALISIERUNG: Falls das Event in gigsda_events fehlt, erschaffen wir es live!
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
        console.log(`📡 B2B-AutoCreation: Projekt "${eventTitle}" wurde frisch in gigsda_events verankert!`);
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

          localStorage.setItem('gigsda_events', JSON.stringify(savedEvents));
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


  // 📁 REINER LOCALSTORAGE-FILTER: Holt nur eure echten Profile frisch von der Festplatte
  useEffect(() => {
    const localProfiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');
    // Filtert leere Einträge heraus und sorgt dafür, dass die Live-Daten (Stadt, Genre) geladen werden
    setAllUsers(localProfiles.filter(user => user && user.name));
  }, [onNavigate]); // Aktualisiert sich auch beim Zurückwechseln aus dem Profil

const ROLES_LIST = ['Alle', 'Künstler', 'Caterer', 'Rental', 'Location', 'Veranstalter', 'Techniker', 'Logistik', 'Security', 'Design'];

  // 🗺️ DIE LIVE-ENTFERNUNGSMATRIX (Gemessen von eurer Heimatbasis Braunau)
  const getDistanceTo = (city) => {
    const target = (city || '').toLowerCase().trim();
    if (target.includes('braunau')) return 0;   // Direkt vor Ort
    if (target.includes('altötting')) return 28; // ca. 28 km entfernt
    if (target.includes('linz')) return 120;     // ca. 120 km entfernt
    if (target.includes('wien')) return 290;     // ca. 290 km entfernt
    return 45; // Fallback für unbekannte Städte im Bezirk
  };

  // ⚡ DIE ERWEITERTE FILTER-SCHLEIFE (Filtert nach Name, Rolle UND Radius!)
  const filteredUsers = allUsers.filter(user => {
  const searchValue = searchTerm.toLowerCase();
  const matchesName =
    user.name?.toLowerCase().includes(searchValue);
  const matchesId =
    user.id?.toLowerCase().includes(searchValue);   
  
  
    // 1. Rollen-Filter (original von Daniel)
    const userRole = (user.role || user.type || 'Künstler').toLowerCase();
    let matchesRole = false;
    if (selectedRole === 'Alle') {
      matchesRole = true;
    } else if (selectedRole === 'Caterer') {
      matchesRole = userRole.includes('cater');
    } else if (selectedRole === 'Rental') {
      matchesRole = userRole.includes('rental') || userRole.includes('material');
    } else if (selectedRole === 'Location') {
      matchesRole = userRole.includes('location') || userRole.includes('club');
    } else if (selectedRole === 'Veranstalter') {
      matchesRole = userRole.includes('veranstalter') || userRole.includes('promoter');
    } else if (selectedRole === 'Techniker') {
      matchesRole = userRole.includes('technik') || userRole.includes('crew');
    } else {
      matchesRole = userRole.includes(selectedRole.toLowerCase());
    }

    // 2. 🛰️ DER REAKTIVE RADIUS-FILTER: Prüft die km-Distanz gegen den Schieberegler!
    const userDistance = getDistanceTo(user.location || user.city);
    const matchesRadius = userDistance <= searchRadius;

    return (matchesName || matchesId) &&
       matchesRole &&
       matchesRadius;
    });

  return (
    <div className="p-6 bg-slate-950 text-white min-h-screen font-mono relative">
      
      {/* 🌌 HEADER SEKTION */}
      <div className="mb-8">
        <h1 className="text-xl font-black text-cyan-400 uppercase tracking-wider mb-2">// B2B REGIONAL-RADAR</h1>
        <p className="text-xs text-slate-400">Durchsuche das zweiseitige Industrie-Netzwerk punktgenau nach Partnern.</p>
      </div>

      {/* 🎛️ FILTER-LEISTE */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-900 pb-4">
        {ROLES_LIST.map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-xl border transition-all duration-300 cursor-pointer ${
              selectedRole === role
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            {role === 'Alle' ? '// ALLES ANZEIGEN' : `// ${role}`}
          </button>
        ))}
      </div>

      {/* 🎛️ SMART-KOMBI: SUCHE & REICHWEITENSKALA IN DANIELS ORIGINAL-STYLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-3xl font-mono">
        
        {/* Linke Seite: Nach Namen suchen */}
        <div className="flex flex-col justify-end">
          <label className="text-[8px] text-slate-500 uppercase font-black mb-1.5">// Nach Partner suchen</label>
          <input
            type="text"
            placeholder="Nach Namen suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs outline-none text-white placeholder-slate-600 h-[38px]"
          />
        </div>

        {/* Rechte Seite: Perfekt angeglichene Reichweitenskala */}
        <div className="flex flex-col justify-end">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[8px] text-slate-500 uppercase font-black">// Such-Umkreis</label>
            <span className="text-[10px] text-cyan-400 font-bold tracking-wider font-mono">
              🛰️ {searchRadius} KM
            </span>
          </div>
          
          {/* Gleicher Kasten wie das Suchfeld daneben */}
          <div className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 flex items-center gap-3 h-[38px]">
            <span className="text-[8px] text-slate-600 font-mono font-bold">500KM</span>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              className="flex-grow bg-slate-950 h-1 rounded-none appearance-none cursor-pointer border border-slate-950
                accent-cyan-500
                [&::-webkit-slider-thumb]:appearance-none 
                [&::-webkit-slider-thumb]:h-2 
                [&::-webkit-slider-thumb]:w-2 
                [&::-webkit-slider-thumb]:bg-cyan-400 
                [&::-webkit-slider-thumb]:border 
                [&::-webkit-slider-thumb]:border-cyan-500 
                [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(34,211,238,0.6)] 
                [&::-webkit-slider-thumb]:transition-all 
                [&::-webkit-slider-thumb]:duration-150
                [&::-webkit-slider-thumb]:hover:scale-125
                [&::-moz-range-thumb]:h-2 
                [&::-moz-range-thumb]:w-2 
                [&::-moz-range-thumb]:bg-cyan-400 
                [&::-moz-range-thumb]:border 
                [&::-moz-range-thumb]:border-cyan-500 
                [&::-moz-range-thumb]:rounded-none
                [&::-moz-range-thumb]:shadow-[0_0_6px_rgba(34,211,238,0.6)]"
            />
            <span className="text-[8px] text-slate-600 font-mono font-bold">100KM</span>
          </div>
        </div>

      </div>

      {/* 💳 VISITENKARTEN-GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.length > 0 ? (

          filteredUsers.map((user, index) => (
            <ProfileCard
              key={`${user.id || 'user'}-${index}`}
              user={user}
              isGuest={!isLoggedIn}
              onProfile={() => {
                if (typeof setFavorites === 'function') {
                  setFavorites(user.name);
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
          <div className="col-span-full bg-slate-900/10 border border-dashed border-slate-900 rounded-2xl p-12 text-center text-xs text-slate-600 font-mono">
            // KEINE PASSENDEN B2B-PARTNER GEFUNDEN 🧹
          </div>
        )}
      </div>
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

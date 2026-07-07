import React, { useState, useEffect } from 'react';

export default function CrewFavoritenListe({ onNavigate }) {
  const [favorites, setFavorites] = useState([]);
  const [filterRole, setFilterRole] = useState('all');
  const [allProfiles, setAllProfiles] = useState([]);


  // SYSTEM-ROLES FÜR DIE GEWERKE-FILTER MATRIX
  const ROLES_LIST = ['all', 'Künstler', 'Catering', 'Rental', 'Location', 'Techniker', 'Logistik', 'Security', 'Design'];

  // 📡 SAUBERE PROD-LEITUNG: Lädt nur echte, vom User gewählte Favoriten
  useEffect(() => {
    try {
      const savedFavs = JSON.parse(localStorage.getItem('gigsda_favorites') || '[]');
      setFavorites(savedFavs);
    } catch (e) { 
      console.error("Fehler beim Laden der Favoriten:", e); 
    }
  }, []);

  useEffect(() => {
    try {
      const storedProfiles = JSON.parse(
        localStorage.getItem('gigsda_profiles') || '[]'
      );

      setAllProfiles(storedProfiles);


    } catch (e) {
      console.error("Fehler beim Laden der Profile:", e);
    }
  }, []);

  const removeFavorite = (id) => {
    const updated = favorites.filter(f => f !== id);
    localStorage.setItem('gigsda_favorites', JSON.stringify(updated));
    setFavorites(updated);
  };

  const favoriteProfiles = favorites
    .map(favId => allProfiles.find(p => p.id === favId))
    .filter(Boolean);

  const filteredFavs = favoriteProfiles.filter(
    f => filterRole === 'all' || f.role === filterRole
  );

  // 🏟️ STATE FÜR DIE PROJEKT-AUSWAHL
  const [events, setEvents] = useState([]);
  const [activeSelectFav, setActiveSelectFav] = useState(null); // Welcher Favorit wird gerade hinzugefügt?

  // Lade die aktuell erstellten Events des Veranstalters beim Start
  useEffect(() => {
    try {
      const savedEvents = JSON.parse(localStorage.getItem('gigsda_events') || '[]');
      setEvents(savedEvents);
    } catch (e) { console.error("Fehler beim Event-Load:", e); }
  }, [activeSelectFav]);

  // ⚡ INJIZIERT DEN FAVORITEN IN DIE CREWLISTE DES AUSGEWÄHLTEN EVENTS
  const handleAddFavToProject = (eventId, fav) => {
    try {
        const savedEvents = JSON.parse(localStorage.getItem('gigsda_events') || '[]');
        
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
          console.log(`📡 Favoriten-AutoCreation: Projekt "${activeTitle}" wurde frisch angelegt!`);
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
        localStorage.setItem('gigsda_events', JSON.stringify(savedEvents));

        // ⚡ ZÜNDET DEN REAKTIVEN LIVE-FUNKSPRUCH FÜR DANIELS DASHBOARD!
        window.dispatchEvent(new CustomEvent('request-sent'));
        window.dispatchEvent(new CustomEvent('route-change'));

        // Zusätzlich direkt eine Crew-Anfrage im globalen System anlegen!
        const allRequests = JSON.parse(localStorage.getItem('gigsda_crew_requests') || '[]');
        allRequests.push({
          requestId: "REQ-" + Math.floor(Math.random() * 9000 + 1000),
          eventName: savedEvents[eventIndex].title || savedEvents[eventIndex].name || "B2B Event",
          date: savedEvents[eventIndex].date || "Termin folgt",
          requestedProfileId: fav.id,
          requestedProfileName: fav.name,
          requesterName: localStorage.getItem('gigsda_user_name') || "Veranstalter",
          status: "pending",
          note: `Automatisch über Crew-Favoritenliste hinzugefügt.`
        });
        localStorage.setItem('gigsda_crew_requests', JSON.stringify(allRequests));

        // Globalen Funkspruch feuern, damit alle Dashboards live updaten!
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
      <div className="h-24 w-full rounded-2xl bg-gradient-to-r from-amber-500/10 to-slate-900 border border-slate-800 p-4 flex justify-between items-center mb-6">
        <div>
          <span className="text-[8px] bg-amber-500/10 border border-amber-500 text-amber-400 font-bold px-2 py-0.5 rounded-md uppercase tracking-widest">
            ★ REAKTIVE MERKLISTE
          </span>
          <h1 className="text-base font-black uppercase text-white mt-1">Meine gespeicherten Favoriten</h1>
        </div>
        <button onClick={() => onNavigate('projects')} className="text-[9px] bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white px-3 py-1.5 rounded-xl transition-all cursor-pointer">
          ✕ ZURÜCK
        </button>
      </div>

      {/* FILTER MATRIX */}
      <div className="flex flex-wrap gap-1.5 pb-4 border-b border-slate-900 text-[8px] font-bold uppercase mb-4">
        {ROLES_LIST.map(role => (
          <button key={role} onClick={() => setFilterRole(role)} className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${filterRole === role ? 'bg-amber-500/20 text-amber-400 border-amber-500' : 'bg-slate-950 text-slate-400 border-slate-900 hover:border-slate-800'}`}>
            {role === 'all' ? '🌐 ALLE' : role.toUpperCase()}
          </button>
        ))}
      </div>

      {/* FAVORITEN GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredFavs.map(fav => (
          <div key={fav.name} className="bg-slate-900/20 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[7px] bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-bold uppercase">{fav.role}</span>
              <h3 className="text-xs font-black text-white uppercase mt-1">{fav.name}</h3>
              <p className="text-[8px] text-slate-500">📍 {fav.city}</p>
              <p className="text-[9px] text-slate-400 italic mt-2">"{fav.note || 'Keine Notiz hinterlegt.'}"</p>
            </div>


              {/* ➕ REAKTIVE PROJEKT-ANREIHUNG */}
              <div className="pt-1 font-mono text-[9px]">
                {activeSelectFav === fav.name ? (
                  <div className="bg-slate-950 border border-amber-500/20 rounded-xl p-2 space-y-1.5 animate-fade-in">
                    <span className="text-[6px] text-amber-400 block font-black uppercase">// WÄHLE DAS ZIEL-PROJEKT:</span>
                    {events.length === 0 ? (
                      <p className="text-slate-600 text-[8px] italic">// Keine aktiven Events im Speicher gefunden.</p>
                    ) : (
                      <div className="max-h-24 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                        {events.map(ev => (
                          <button 
                            key={ev.id} 
                            onClick={() => handleAddFavToProject(ev.id, fav)}
                            className="w-full text-left px-2 py-1 bg-slate-900 hover:bg-amber-500/10 border border-slate-800 text-slate-300 hover:text-white rounded text-[8px] transition-all truncate cursor-pointer block"
                          >
                            📅 {ev.title || ev.name || "Unbenanntes Event"}
                          </button>
                        ))}
                      </div>
                    )}
                    <button onClick={() => setActiveSelectFav(null)} className="w-full text-center text-[7px] text-slate-500 font-bold uppercase mt-1">Abbrechen</button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setActiveSelectFav(fav.name)}
                    className="w-full py-1.5 bg-cyan-500/5 border border-cyan-500/20 hover:border-cyan-500 hover:text-white text-cyan-400 rounded-xl transition-all cursor-pointer font-bold uppercase tracking-wider text-center"
                  >
                    ➕ Zum Projekt hinzufügen
                  </button>
                )}
              </div>



            <button onClick={() => removeFavorite(fav.id)} className="w-full py-1 bg-red-500/5 border border-red-500/20 hover:border-red-500 hover:text-white text-red-400 text-[8px] font-bold uppercase rounded-lg transition-all cursor-pointer">
              ✕ ENTFERNEN
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
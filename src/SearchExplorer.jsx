import React, { useState, useEffect } from 'react';

export default function SearchExplorer({ onNavigate, setFavorites, setActiveChat }) {
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchRadius, setSearchRadius] = useState(50); // 📡 Live-Suchumkreis
  const [selectedRole, setSelectedRole] = useState('Alle');
  const [activeRequestUser, setActiveRequestUser] = useState(null); // Sichert das Anfrage-Popup!
  const [requestText, setRequestText] = useState(''); // Speichert euren eingetippten Text
  
  // ⚡ DAS DIGITALE B2B-SENDE-UHRWERK FÜR CREW-ANFRAGEN
  const handleSendCrewRequest = () => {
    if (!activeRequestUser || !activeRequestUser.name) {
      alert("Fehler: Kein gültiger Benutzer für die Anfrage ausgewählt!");
      return;
    }

    try {
      // 1. Holt die bereits existierenden Anfragen aus dem Speicher
      const allRequests = JSON.parse(localStorage.getItem('gigsda_crew_requests') || '[]');
      
      // 2. Erstellt das neue, saubere B2B-Anfrage-Objekt
      const newRequest = {
        requestId: "REQ-" + Math.floor(Math.random() * 9000 + 1000), // Eindeutige ID
        eventName: "B2B Marktplatz-Kooperation", // Standard-Eventname oder dynamisch
        date: "Datum auf Anfrage",
        requestedProfile: activeRequestUser.name, // Der Empfänger (z. B. "Winston Jud")
        requesterName: localStorage.getItem('gigsda_user_name') || "Unbekannter Absender", // Wer ist eingeloggt?
        status: "pending", // 🚨 WICHTIG: Startet immer im Status offen!
        note: requestText || "Standard-B2B Konditionen laut Profil."
      };
      
      // 3. Schiebt die neue Anfrage in die Liste und speichert sie ab
      allRequests.push(newRequest);
      localStorage.setItem('gigsda_crew_requests', JSON.stringify(allRequests));
      
      // 4. Feuert den globalen Live-Funkspruch ab, damit die App.jsx sofort anspringt
      window.dispatchEvent(new CustomEvent('request-sent'));
      
      // 5. Maske zurücksetzen & schließen
      setRequestText('');
      setActiveRequestUser(null);
      
      alert(`B2B-Crew-Anfrage erfolgreich an ${newRequest.requestedProfile} übermittelt! ↗️⚡`);
    } catch (e) {
      console.error("Fehler beim Absenden der Crew-Anfrage:", e);
    }
  };


  // 📁 REINER LOCALSTORAGE-FILTER: Holt nur eure echten Profile frisch von der Festplatte
  useEffect(() => {
    const localProfiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');
    // Filtert leere Einträge heraus und sorgt dafür, dass die Live-Daten (Stadt, Genre) geladen werden
    setAllUsers(localProfiles.filter(user => user && user.name));
  }, [onNavigate]); // Aktualisiert sich auch beim Zurückwechseln aus dem Profil

  const ROLES_LIST = ['Alle', 'Künstler', 'Caterer', 'Rental', 'Location', 'Veranstalter', 'Techniker'];

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
    const matchesName = user.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
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

    return matchesName && matchesRole && matchesRadius;
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
            <span className="text-[8px] text-slate-600 font-mono font-bold">600KM</span>
            <input
              type="range"
              min="5"
              max="500"
              step="5"
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
            <div 
              key={`${user.id || 'user'}-${index}`} 
              className="bg-slate-950 border border-slate-900 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col group hover:border-slate-800 transition-all duration-300 min-h-[300px]"
            >
              {/* OBERES BANNER-BILD */}
              <div className="h-24 w-full relative overflow-hidden bg-slate-900">
                <img 
                  // 🔒 DER UNZERSTÖRBARE BANNER-LINK: Holt das echte slide1_url direkt aus eurem Datenbank-Eintrag!
                  src={user.slide1_url || user.bannerUrl || 'https://unsplash.com'} 
                  alt="Banner" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 text-[8px] bg-slate-950/90 border border-slate-800/80 text-cyan-400 font-bold px-2 py-0.5 rounded-md tracking-wider uppercase backdrop-blur-sm z-10">
                  {user.role || user.type || 'Künstler'}
                </span>
              </div>

              {/* AVATARBILD */}
              <div className="absolute top-12 left-4 z-20">
                <div className="w-16 h-16 rounded-full border-2 border-slate-950 overflow-hidden bg-slate-900 shadow-xl">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-black text-slate-600 bg-slate-900">
                      {user.name?.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* TEXT-KÖRPER */}
              <div className="p-4 pt-7 flex-grow flex flex-col justify-between pl-4">
                <div className="mb-4">
                  <h3 className="text-sm font-black uppercase text-white tracking-wide group-hover:text-cyan-400 transition-colors">
                    {user.name}
                  </h3>
                  <p className="text-[9px] text-slate-600 uppercase mt-0.5">// MEMBER-ID: {user.id || 'N/A'}</p>
                </div>

                {/* 🔒 UNZERSTÖRBARE LIVE-VARIABLEN: Holt die echten Werte direkt aus gigsda_profiles! */}
                <div className="pt-3 border-t border-slate-900 flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>STADT: <strong className="text-slate-200">{user.city || 'Nicht hinterlegt'}</strong></span>
                  <span>GENRE: <strong className="text-slate-200">{user.genre || 'Allround'}</strong></span>
                </div>

                {/* BUTTONS */}
                <div className="grid grid-cols-2 gap-2 mt-5 pt-3 border-t border-slate-900/60">
                  <button
                    onClick={() => {
                      if (typeof setFavorites === 'function') {
                        setFavorites(user.name); // Schickt den Namen reaktiv an Daniels echte Weiche!
                      }
                    }}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-[10px] font-bold uppercase py-2 rounded-xl transition-all duration-300 cursor-pointer text-center"
                  >
                    PROFIL
                  </button>

                  {/* 📬 SCHIESST DAS ECHTE OVERLAY-POPUP AUF */}
                  <button
                    onClick={() => {
                      setActiveRequestUser(user);
                      setRequestText(`Hallo ${user.name}, wir hätten Interesse an einer B2B-Zusammenarbeit für ein anstehendes Event in Region Gigsda!`);
                    }}
                    className="bg-cyan-500/5 border border-cyan-500/20 hover:border-cyan-500/50 text-cyan-400 text-[10px] font-bold uppercase py-2 rounded-xl transition-all duration-300 cursor-pointer text-center tracking-wider w-full animate-pulse"
                  >
                    ANFRAGEN ✎
                  </button>


                </div>
              </div>
            </div>
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
              <button
                onClick={handleSendCrewRequest}
                className="bg-cyan-500/10 border border-cyan-500/40 hover:border-cyan-500 text-cyan-400 hover:text-white text-[10px] font-bold uppercase tracking-wider py-1.5 rounded-xl transition-all cursor-pointer text-center font-mono"
              >
                SENDEN ⚡
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

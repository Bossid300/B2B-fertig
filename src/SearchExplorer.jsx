import React, { useState, useEffect } from 'react';

export default function SearchExplorer({ onNavigate, setFavorites }) {
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('Alle');

  // 📁 REINER LOCALSTORAGE-FILTER: Holt nur eure echten Profile frisch von der Festplatte
  useEffect(() => {
    const localProfiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');
    // Filtert leere Einträge heraus und sorgt dafür, dass die Live-Daten (Stadt, Genre) geladen werden
    setAllUsers(localProfiles.filter(user => user && user.name));
  }, [onNavigate]); // Aktualisiert sich auch beim Zurückwechseln aus dem Profil

  const ROLES_LIST = ['Alle', 'Künstler', 'Caterer', 'Rental', 'Location', 'Veranstalter', 'Techniker'];

  // ⚡ DIE FILTER-SCHLEIFE (Nutzt stur 'role' und fängt Schreibweisen sicher ab)
  const filteredUsers = allUsers.filter(user => {
    const matchesName = user.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Liest die Rolle aus der Registrierung ('role') oder den alten 'type'
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

    return matchesName && matchesRole;
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

      {/* 🔍 SUCHE */}
      <div className="mb-8 relative max-w-md">
        <input
          type="text"
          placeholder="Nach Namen suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs outline-none text-white placeholder-slate-600"
        />
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

                  <button
                    onClick={() => alert(`Anfrage-Dialog für ${user.name} bereit! ✎`)}
                    className="bg-cyan-500/5 border border-cyan-500/20 hover:border-cyan-500/50 text-cyan-400 text-[10px] font-bold uppercase py-2 rounded-xl transition-all duration-300 cursor-pointer text-center"
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

    </div>
  );
}

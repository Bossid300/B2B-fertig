import React from 'react';

export default function GlobalNavigation({ view, setView, onLogout }) {
  // 📡 Holt die echten Login-Daten des angemeldeten Users direkt von der Festplatte
  const regRole = localStorage.getItem('gigsda_reg_role') || "Gast";
  const userName = localStorage.getItem('gigsda_user_name') || "User";

  // 📡 UNZERSTÖRBARER INTERNER ROUTING-HEBEL
  const triggerNav = (targetView) => {
    if (typeof setView === 'function') {
      setView(targetView);
    }
  };

  return (
    <>
      {/* 👥 ULTRA-MODERNES RECHTSBÜNDIGES COCKPIT-MENÜ */}
      <div className="flex items-center gap-6 font-sans text-sm font-medium tracking-wide ml-auto shrink-0 select-none">
        
        {/* 👤 REAKTIVER AVATAR-LINK (JETZT ZU 100% AUF DANIELS AVATARURL GEEICHT!) */}
        <button
          type="button"
          onClick={() => {
            console.log("📡 Avatar geklickt -> Öffne Winstons originales userProfile...");
            if (typeof setView === 'function') {
              setView('userProfile'); 
            }
          }}
          className="relative flex items-center justify-center group cursor-pointer transform hover:scale-105 active:scale-95 transition-all duration-200 bg-transparent border-none p-0 outline-none shrink-0"
          title="Mein Profil öffnen"
        >
          <div className="absolute inset-0 bg-cyan-500/30 rounded-full filter blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 scale-110"></div>
          
          <img 
            src={(() => {
              try {
                const currentAct = localStorage.getItem('gigsda_user_name') || "";
                const savedProfiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');
                
                // Scannt die Datenbank exakt nach Winstons Namen ab
                const matched = savedProfiles.find(p => p && p.name && p.name.trim().toLowerCase() === currentAct.trim().toLowerCase());
                
                // 🚨 DER ENTSCHEIDENDE LIVE-FIX: Greift haargenau Daniels echtes Feld "avatarUrl"!
                if (matched && matched.avatarUrl && matched.avatarUrl.trim() !== "") {
                  return matched.avatarUrl;
                }
              } catch (e) {
                console.error("Fehler beim avatarUrl Pull:", e);
              }
              // Absolut sicherer High-Res Künstler-Fallback
              return "https://unsplash.com";
            })()} 
            alt="User Avatar" 
            className="w-8 h-8 rounded-full object-cover border-2 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)] relative z-10 filter brightness-105"
          />
        </button>

        {/* BUTTON 1: SEARCH EXPLORER */}
        <button 
          type="button" 
          onClick={() => triggerNav('radar')} 
          className={`hover:text-white transition-colors duration-150 cursor-pointer uppercase font-mono text-[10px] font-black tracking-wider ${view === 'radar' ? 'text-white font-bold' : 'text-slate-300'}`}
        >
          🗣️ Search Explorer
        </button>

        {/* BUTTON 2: EVENT-RADAR */}
        <button 
          type="button" 
          onClick={() => triggerNav('guestEvents')} 
          className={`hover:text-white transition-colors duration-150 cursor-pointer uppercase font-mono text-[10px] font-black tracking-wider ${view === 'guestEvents' ? 'text-white font-bold' : 'text-slate-300'}`}
        >
          🏃 Event-Radar
        </button>

        {/* BUTTON 3: PROJEKTE */}
        <button 
          type="button" 
          onClick={() => triggerNav('projects')} 
          className={`hover:text-white transition-colors duration-150 cursor-pointer uppercase font-mono text-[10px] font-black tracking-wider ${view === 'dashboard' ? 'text-white font-bold' : 'text-slate-300'}`}
        >
          📁 Projekte
        </button>

      </div>

      {/* 🚨 DANIELS SYSTEM-BADGES & SYSTEM-EXIT (REPARIERT!) */}
      <div className="flex items-center gap-3 shrink-0 font-mono text-[10px] pl-2 border-l border-slate-800/80">
        <span className="hidden sm:inline-block text-slate-500 font-bold uppercase tracking-wider">ROLE:</span>
        <span className="bg-purple-500/10 border border-purple-500/30 text-purple-400 font-black px-2.5 py-1 rounded-md uppercase tracking-wide animate-pulse">
          {regRole}
        </span>
        
        {/* 🚨 UNZERSTÖRBARER DIREKT-LÖSCH-EXIT: CLEANT DIE FESTPLATTE IMMUN GEGEN JEDEN APP-CRASH */}
        <button
          type="button"
          onClick={() => {
            console.log("🚨 Notfall-Exit: Säubere LocalStorage eigenständig...");
            try {
              // 📡 1. ERZWUNGENER DIREKT-Schnitt: Löscht alle Flags ohne Umwege zuerst von der Festplatte!
              localStorage.removeItem('gigsda_logged_in');
              localStorage.removeItem('gigsda_user_name');
              localStorage.removeItem('gigsda_reg_role');
              
              // Zwingt die Ansichten unzerstörbar zurück auf den Gast-Modus
              localStorage.setItem('gigsda_current_view', 'landing');
              localStorage.setItem('gigsda_current_chat', '');
              
              // 📡 2. Versucht Daniels States im RAM sauber mitzuziehen, falls möglich
              if (typeof setView === 'function') {
                setView('landing');
              }
              if (typeof onLogout === 'function') {
                onLogout();
              }
            } catch (err) {
              console.error("Mitziehen blockiert, fahre mit hartem Reset fort...", err);
            }

            // 📡 3. Der unbestechliche Seiten-Reset: Schreibt die Tabelle final blitzblank neu!
            window.location.reload();
          }}
          className="px-2.5 py-1 bg-red-950/20 hover:bg-red-600 border border-red-500/30 hover:border-red-400 text-red-400 hover:text-white font-black uppercase tracking-widest rounded-md transition-all duration-200 cursor-pointer shadow-md"
        >
          [ Exit ]
        </button>

      </div>
    </>
  );
}

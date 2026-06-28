import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function GlobalNavigation({ view, setView, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Holt die echten Login-Daten direkt von der Festplatte
  const regRole = localStorage.getItem('gigsda_reg_role') || "Gast";
  const userName = localStorage.getItem('gigsda_user_name') || "User";
  
  // UNZERSTÖRBARER INTERNER ROUTING-HEBEL
  const triggerNav = (targetView) => {
    if (typeof setView === 'function') {
      setView(targetView);
    }
    setIsOpen(false); // Schließt das Menü auf dem Handy nach dem Klick
  };

  const handleLogoutClick = (e) => {
    e.stopPropagation();
    localStorage.removeItem('gigsda_logged_in');
    localStorage.removeItem('gigsda_user_name');
    localStorage.removeItem('gigsda_reg_role');
    if (typeof setView === 'function') setView('landing');
    if (typeof onLogout === 'function') onLogout();
    window.location.reload();
  };

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 font-mono p-2">
      
      {/* ── MOBILE BAR & LOGO BEREICH ── */}
      <div className="flex items-center justify-between w-full sm:w-auto shrink-0 gap-2">
        
        {/* REAKTIVER AVATAR-LINK (JETZT ZU 100% AUF DANIELS AVATARURL GEEICHT!) */}
        <button
          type="button"
          onClick={() => triggerNav('userProfile')}
          className="relative flex items-center justify-center group cursor-pointer transform hover:scale-105 active:scale-95 transition-all duration-300"
          title="Mein Profil öffnen"
        >
          <div className="absolute inset-0 bg-cyan-500/30 rounded-full filter blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300" />
          
          <img
            src={(() => {
              try {
                const currentAct = localStorage.getItem('gigsda_user_name') || "";
                const savedProfiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');
                
                // Scannt die Datenbank exakt nach Winstons Namen ab
                const matched = savedProfiles.find(p => p && p.name && p.name.trim().toLowerCase() === currentAct.trim().toLowerCase());
                
                // DER ENTSCHEIDENDE LIVE-FIX: Greift haargenau Daniels echtes Feld "avatarUrl"!
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
            className="w-8 h-8 rounded-full object-cover border-2 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)] relative z-10"
          />
        </button>

        {/* RECHTE BUTTONS: Exit & Burger */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handleLogoutClick} 
            className="px-2.5 py-1 bg-red-950/20 border border-red-900/30 text-red-400 rounded-md text-[10px] uppercase font-black hover:bg-red-900/20 transition-all cursor-pointer"
          >
            [ Exit ]
          </button>
          
          <button 
            type="button"
            onClick={() => setIsOpen(!isOpen)} 
            className="sm:hidden p-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            {isOpen ? <X size={14} /> : <Menu size={14} />}
          </button>
        </div>

      </div>

      {/* ── DESKTOP NAVIGATIONS-BUTTONS (RECHTSBÜNDIG) ── */}
      <div className="hidden sm:flex items-center gap-6 ml-auto select-none">
        <NavButtons view={view} triggerNav={triggerNav} />
      </div>

      {/* ── MOBILE DROPDOWN ── */}
      {isOpen && (
        <div className="sm:hidden w-full flex flex-col gap-1.5 mt-1 border-t border-slate-900 pt-2 animate-fadeIn">
          <NavButtons view={view} triggerNav={triggerNav} mobile />
        </div>
      )}

    </div>
  );
}

// Hilfskomponente für die Nav-Buttons (Desktop & Mobile)
const NavButtons = ({ view, triggerNav, mobile }) => {
  const baseClass = mobile 
    ? "w-full text-left px-3 py-2 rounded-xl text-[10px] font-mono tracking-widest border border-slate-900 uppercase" 
    : "hover:text-white uppercase text-[10px] font-black tracking-wider transition-all cursor-pointer font-mono";
    
  const activeClass = "bg-purple-500/10 border-purple-500/40 text-purple-400 font-bold";
  const inactiveClass = "text-slate-400 border-transparent";
  
  return (
    <>
      <button onClick={() => triggerNav('artists')} className={`${baseClass} ${view === 'artists' ? activeClass : inactiveClass}`}>🔍 Matrix-Suche</button>
      <button onClick={() => triggerNav('radar')} className={`${baseClass} ${view === 'radar' ? activeClass : inactiveClass}`}>🗣 Search</button>
      <button onClick={() => triggerNav('guestEvents')} className={`${baseClass} ${view === 'guestEvents' ? activeClass : inactiveClass}`}>🏃 Events</button>
      <button onClick={() => triggerNav('projects')} className={`${baseClass} ${view === 'projects' ? activeClass : inactiveClass}`}>📁 Projekte</button>

    </>
  );
};

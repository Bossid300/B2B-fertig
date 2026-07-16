import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function GlobalNavigation({ view, setView, onLogout }) {
  // Lokaler Zustand für das mobile Aufklapp-Menü (Burger)
  const [isOpen, setIsOpen] = useState(false);
  
  const triggerNav = (targetView) => {
    if (typeof setView === 'function') {
      setView(targetView);
    }
    setIsOpen(false);
  };

  const [incomingCount, setIncomingCount] = useState(0);

  const regRole = localStorage.getItem('gigsda_reg_role') || "Gast";
  const userName = localStorage.getItem('gigsda_user_name') || "User";

  // ✅ Badge zählen
  useEffect(() => {
    const checkRequests = () => {
      try {
        const requests = JSON.parse(localStorage.getItem('gigsda_crew_requests') || '[]');
        const profiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');

        const currentProfile = profiles.find(p =>
          (p.name || '').toLowerCase() === userName.toLowerCase()
        );

        const currentUserId = currentProfile?.id;

        const open = requests.filter(r =>
          (r.status === 'pending' || r.status === 'counter_offer') &&
          r.requestedProfileId === currentUserId
        );

        setIncomingCount(open.length);
      } catch (e) {
        console.error("Badge Fehler:", e);
      }
    };

    checkRequests();
    window.addEventListener('request-sent', checkRequests);
    return () => window.removeEventListener('request-sent', checkRequests);
  }, [userName]);

  
  // ✅ Exit-Button: Entfernt alle relevanten LocalStorage-Einträge und lädt die Seite neu
  const handleLogoutClick = (e) => {
    e.stopPropagation();

    localStorage.removeItem('gigsda_logged_in');
    localStorage.removeItem('gigsda_user_name');
    localStorage.removeItem('gigsda_reg_role');

    // 🔥 DAS IST DER FIX:
    localStorage.setItem('gigsda_current_view', 'landing');

    window.location.reload();
  };


  // ✅ Avatar holen (sauber, ohne Crashes)
  const getAvatar = () => {
    try {
      const savedProfiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');
      const matched = savedProfiles.find(p =>
        p && p.name && p.name.toLowerCase() === userName.toLowerCase()
      );
      return matched?.avatarUrl || "https://via.placeholder.com/32";
    } catch {
      return "https://via.placeholder.com/32";
    }
  };

  // Dein originaler, flacher Desktop-Look ohne klobige Rahmen
  const desktopBase = "uppercase text-xs font-black tracking-wider transition-all cursor-pointer font-mono";
  const activeClass = "text-purple-400 font-bold";
  const inactiveClass = "text-slate-400 hover:text-white";

  // Der saubere Mobile-Style für die ausgeklappten Punkte untereinander
  const mobileBase = "w-full text-left px-3 py-2 rounded-xl text-[10px] font-mono tracking-widest border border-slate-900 uppercase";
  
  return (
    <div className="no-print w-full backdrop-blur-md border-slate-900 shadow-xl select-none sticky top-0 z-50 font-mono">
      <div className="w-full max-w-7xl mx-auto px-4 py-1.0 flex items-center justify-between sm:justify-end gap-6">

      {/* NAV */}
        <div className="hidden sm:flex items-center gap-6 select-none ml-auto shrink-0">
        <span
          onClick={() => triggerNav('artists')}
          className={`${desktopBase} ${view === 'artists' ? activeClass : inactiveClass}`}
        >
          🔍 MATRIX
        </span>
                <span
          onClick={() => triggerNav('radar')}
          className={`${desktopBase} ${view === 'radar' ? activeClass : inactiveClass}`}
        >
          💬 SEARCH
        </span>
                <span
          onClick={() => triggerNav('guestEvents')}
          className={`${desktopBase} ${view === 'guestEvents' ? activeClass : inactiveClass}`}
        >
          📅 EVENTS
        </span>
                <span
          onClick={() => triggerNav('projects')}
          className={`${desktopBase} ${view === 'projects' ? activeClass : inactiveClass}`}
        >
          📁 PROJEKTE
        </span>
      </div>

      {/* RECHTS */}
      <div className="flex items-center gap-3 ml-auto">

        {/* ✅ AVATAR + BADGE FIX */}
        <div style={{ position: 'relative', display: 'inline-block' }}>

          <button
            onClick={() => triggerNav('userProfile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <img
              src={getAvatar()}
              alt="avatar"
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: '2px solid cyan',
                objectFit: 'cover'
              }}
            />
          </button>

          {/* 🔴 BADGE */}
          {incomingCount > 0 && (
            <span
              onClick={(e) => {
                e.stopPropagation();

                // 🔥 1. gehe ins Projekte Dashboard
                if (typeof setView === 'function') {
                  setView('projects');
                }

                // 🔥 2. nach kurzer Zeit scrollen
                setTimeout(() => {
                  const el = document.getElementById('incoming-requests');

                  if (el) {
                    el.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });

                    // 🔥 dein Neon Effekt
                    el.style.boxShadow = `
                      0 0 0 2px rgba(34,211,238,0.7),
                      0 0 12px rgba(34,211,238,0.6),
                      0 0 20px rgba(236,72,153,0.4)
                    `;

                    setTimeout(() => {
                      el.style.boxShadow = '';
                    }, 1200);
                  }
                }, 400);
              }}


              className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse cursor-pointer"            >
              {incomingCount}
            </span>

          )}

        </div>

        {/* EXIT */}
        <button
          onClick={handleLogoutClick}
          className="px-3 py-1 text-xs border border-red-500 text-red-400 rounded hover:bg-red-500/10"
        >
          EXIT
        </button>

          {/* DIE VIER STRICHE (BURGER-BUTTON): Nur sichtbar auf Handys */}
          <button 
            type="button"
            onClick={() => setIsOpen(!isOpen)} 
            className="sm:hidden p-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            {isOpen ? <X size={14} /> : <Menu size={14} />}
          </button>
      </div>

    </div>
    {/* ── MOBILE DROP-DOWN (KLAPPT SAUBER UNTEREINANDER RECHTSBÜNDIG AUF) ── */}
      {isOpen && (
        <div className="sm:hidden w-full bg-slate-950 border-t border-slate-900 p-3 flex flex-col gap-1.5 animate-fadeIn">
          <button onClick={() => triggerNav('artists')} className={`${mobileBase} ${view === 'artists' ? "bg-purple-500/10 border-purple-500/40 text-purple-400 font-bold" : "text-slate-400 border-transparent"}`}>
            🔍 MATRIX
          </button>
          <button onClick={() => triggerNav('radar')} className={`${mobileBase} ${view === 'radar' ? "bg-purple-500/10 border-purple-500/40 text-purple-400 font-bold" : "text-slate-400 border-transparent"}`}>
            💬 SEARCH
          </button>
          <button onClick={() => triggerNav('guestEvents')} className={`${mobileBase} ${view === 'guestEvents' ? "bg-purple-500/10 border-purple-500/40 text-purple-400 font-bold" : "text-slate-400 border-transparent"}`}>
            📅 EVENTS
          </button>
          <button onClick={() => triggerNav('projects')} className={`${mobileBase} ${view === 'projects' ? "bg-purple-500/10 border-purple-500/40 text-purple-400 font-bold" : "text-slate-400 border-transparent"}`}>
            📁 PROJEKTE
          </button>
        </div>
      )}
  </div>

  );
}
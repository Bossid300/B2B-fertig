import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function GlobalNavigation({ view, setView, onLogout }) {

  const [isOpen, setIsOpen] = useState(false);
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

  const triggerNav = (targetView) => {
    if (typeof setView === 'function') {
      setView(targetView);
    }
    setIsOpen(false);
  };
  // ✅ Exit-Button: Entfernt alle relevanten LocalStorage-Einträge und lädt die Seite neu
  const handleLogoutClick = () => {
    localStorage.removeItem('gigsda_logged_in');
    localStorage.removeItem('gigsda_user_name');
    localStorage.removeItem('gigsda_reg_role');
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

  return (
<div className="w-full relative flex items-center p-3 bg-slate-950">
      {/* NAV */}
      <div className="hidden sm:flex gap-6 mx-auto">
        <span onClick={() => triggerNav('artists')} className="cursor-pointer hover:text-white">🔍 MATRIX</span>
        <span onClick={() => triggerNav('radar')} className="cursor-pointer hover:text-white">💬 SEARCH</span>
        <span onClick={() => triggerNav('guestEvents')} className="cursor-pointer hover:text-white">📅 EVENTS</span>
        <span onClick={() => triggerNav('projects')} className="cursor-pointer hover:text-white">📁 PROJEKTE</span>
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

        {/* BURGER */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

      </div>

    </div>
  );
}
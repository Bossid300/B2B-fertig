import UserProfile from './UserProfile';
import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import LoginRegisterMask from './LoginRegisterMask';
import ProjectDashboard from './ProjectDashboard';
import CrewShortlist from './CrewShortlist';
import StageSpecs from './StageSpecs';
import ContractCenter from './ContractCenter';
import TeamVoting from './TeamVoting';
import EventPlanner from './EventPlanner';
import LiveCountdown from './LiveCountdown';
import ProfileSettings from './ProfileSettings';
import GuestNavigation from './GuestNavigation';
import WhatIsGigsda from './WhatIsGigsda';
import GuestEvents from './GuestEvents';
import SearchExplorer from './SearchExplorer';
 
export default function App() {
  // ⚡ BROWSER-SAFE SESSION MEMORY
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('gigsda_logged_in') === 'true';
  });
 
  // 🛰️ EIGENE LEITUNG FÜR DEN GAST-SUCHER (VERGISS JEDE ANDERE VARIABLE!)
  const [activeGuestArtist, setActiveGuestArtist] = useState('');
 
  const [ticketName, setTicketName] = useState(() => {
    return localStorage.getItem('gigsda_user_name') || 'Gast';
  });

    useEffect(() => {
    const savedName = localStorage.getItem('gigsda_user_name');
    if (isLoggedIn && savedName) {
      setTicketName(savedName);
    } else if (!isLoggedIn) {
      setTicketName('Gast');
    }
  }, [isLoggedIn]);
 
  // 🔒 INTELLIGENTER ROUTER-SPEICHER: Merkt sich den Bildschirm auch bei F5!
  const [view, setViewWithStorage] = useState(() => localStorage.getItem('gigsda_current_view') || 'landing');
  
  const setView = (newView) => {
    localStorage.setItem('gigsda_current_view', newView);
    setViewWithStorage(newView);
  };

  const [successBanner, setSuccessBanner] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);
  const [isRegInitial, setIsRegInitial] = useState(false);
  // 🔴 SIMULATION: Rote Billardkugel für den Dashboard-Posteingang
  const [hasNotifications, setHasNotifications] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setHasNotifications(Math.random() > 0.4);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

 
  // Deine geschützte Multi-Event-Datenbank mit dem crewIds-Array
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('gigsda_events');
    return saved ? JSON.parse(saved) : [
      { 
        id: "EVT-2026-01", 
        title: "Winston Jud Live", 
        type: "Clubshow", 
        date: "Fr, 18. Sept 2026", 
        doneProgress: 35, 
        venue: "Backstage Halle",
        text: "Crew-Shortlist befüllt. Warte auf technischen Rider-Abgleich.",
        crewIds: ["Jud-Winston", "spark", "luna"]
      },
      { 
        id: "EVT-2026-02", 
        title: "Winston Jud OpenAir", 
        type: "Festival", 
        date: "Sa, 15. Aug 2026", 
        doneProgress: 0, 
        venue: "Stadtpark Wiese, Braunau",
        text: "Event frisch initialisiert. Starte die Crew-Suche im Radar.",
        crewIds: [] 
      },
      { 
        id: "EVT-2026-03", 
        title: "Winston Jud @ The Jazz Cave", 
        type: "Clubshow", 
        date: "Sa, 10. Okt 2026", 
        doneProgress: 100, 
        venue: "The Jazz Cave",
        text: "Alle Meilensteine verriegelt. Live-Countdown läuft im Netz.",
        crewIds: ["Jud-Winston", "cyber"] 
      }
    ];
  });
 
  const [progress, setProgress] = useState({
    shortlist: 0,
    stage: 0,
    contract: 0,
    voting: 0,
    planner: 0,
    countdown: 25
  });
 
  // DANIELS DAUMENTASTEN-SCHUTZ
  useEffect(() => {
    window.history.pushState({ view: view }, '', '');
    const handlePopState = (event) => {
      if (event.state && event.state.view) setView(event.state.view);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [view]);
 
  // 📡 DER FEHLENDE LOGIN-EMPFÄNGER
  const handleLoginUser = (name, role) => {
    const existingUsers = JSON.parse(localStorage.getItem('gigsda_users')) || [];
    const newUser = {
      id: "USR-" + Date.now().toString().slice(-4),
      name: name,
      role: role || 'Veranstalter',
      registeredAt: new Date().toLocaleDateString()
    };
 
    // Nur speichern, wenn der User nicht schon existiert
    if (!existingUsers.some(u => u.name.toLowerCase() === name.toLowerCase())) {
      localStorage.setItem('gigsda_users', JSON.stringify([...existingUsers, newUser]));
    }
 
    // 💾 SPEICHERT DIE AKTIVE SESSION FÜR DEN BROWSER
    localStorage.setItem('gigsda_logged_in', 'true');
    localStorage.setItem('gigsda_user_name', name);
 
    setTicketName(name);
    setIsLoggedIn(true);
    setView('projects');
  };
 
 
  // FUNKTION: Aktualisiert die Crew exklusiv für das aktive Event im Master-Array
  const handleUpdateCrewForEvent = (newCrewIds) => {
    if (!activeEvent) return;
 
    const updatedEvents = events.map(evt => {
      if (evt.id === activeEvent.id) {
        const updatedEvent = { ...evt, crewIds: newCrewIds };
        setActiveEvent(updatedEvent); // Aktualisiert den Fokus live mit
        return updatedEvent;
      }
      return evt;
    });
 
    setEvents(updatedEvents);
    localStorage.setItem('gigsda_events', JSON.stringify(updatedEvents));
  };
 
  // 💥 FUNKTION 1: DAS INTELLIGENTE LOGIN (NUR DIESE EINE VERSION STEHEN LASSEN!)
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const inputName = loginName.trim();
    if (!inputName) {
      setErrorMsg('Bitte gib deine Künstler-ID oder deinen Namen ein!');
      return;
    }
    if (inputName.toLowerCase() === 'winston jud') {
      setErrorMsg('');
      onLoginSuccess('Winston Jud', 'Veranstalter');
      return;
    }
    const registeredUsers = JSON.parse(localStorage.getItem('gigsda_users')) || [];
    const matchedUser = registeredUsers.find(user => user.name.toLowerCase() === inputName.toLowerCase());
    if (matchedUser) {
      setErrorMsg('');
      onLoginSuccess(matchedUser.name, matchedUser.role);
    } else {
      setErrorMsg(`Der Name "${inputName}" ist im Gigsda-Protokoll nicht registriert. Bitte erstelle zuerst ein Konto!`);
    }
  };
 
 
  const triggerGate = (message) => {
    if (isLoggedIn) {
      setSuccessBanner(message);
      return;
    }
    setView('login');
  };
 
  // 📡 GIGSDA SIGNAL-EMPFÄNGER: Horcht auf die Profil-Bearbeiten-Buttons
  useEffect(() => {
    const handleProfileRoute = (e) => {
      if (e.detail === 'profileSettings') {
        setView('profileSettings'); // Schaltet den Haupt-Router sofort um!
      }
    };
    window.addEventListener('route-change', handleProfileRoute);
    return () => window.removeEventListener('route-change', handleProfileRoute);
  }, []);
 
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 antialiased overflow-x-hidden flex flex-col justify-between font-mono">
 
      {/* BACKGROUND GLOW */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-20%] w-[60%] aspect-square rounded-full bg-purple-900/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[-20%] w-[50%] aspect-square rounded-full bg-cyan-900/10 blur-[120px]" />
      </div>
 
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-between">
 
        {/* ========================================================================= */}
        {/* NAVIGATIONSMENÜ & LOGO-HEADER                                             */}
        {/* ========================================================================= */}
        <header className="w-full border-b border-slate-900/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div onClick={() => setView(isLoggedIn ? 'projects' : 'landing')} className="flex items-center gap-2 cursor-pointer group">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-slate-950 font-black text-xs shadow-[0_0_10px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-all">G</div>
              <span className="font-mono font-black text-xs tracking-widest text-white uppercase group-hover:text-cyan-400 transition-colors">Gigsda // Protocol</span>
            </div>
 
            {/* ⚡ INTELLIGENTE HEADER-NAVIGATION WEICHE */}
            {/* 📡 GAST MENÜ: REISST NUR AUF WENN DER USER AUSGELOGGT IST */}
            {!isLoggedIn && <GuestNavigation setView={setView} view={view} />}
 
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider">
              {isLoggedIn ? (
                <>
                  <button 
                    type="button" 
                    onClick={() => { setView('projects'); setHasNotifications(false); }} 
                    className={`px-2.5 py-1 rounded-lg border font-black transition-all cursor-pointer text-xs font-mono uppercase tracking-wider ${
                      view === 'projects' 
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' 
                      : 'bg-slate-950/40 text-slate-400 border-slate-900 hover:border-slate-800'
                      }`}
                  > 
                    🧑‍💻 Meine Projekte 
                    {hasNotifications && <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse" />}
                  </button>

                  <button 
                    type="button" 
                    onClick={() => setView('search')} 
                    className={`px-2.5 py-1 rounded-lg border font-black transition-all cursor-pointer text-xs font-mono uppercase tracking-wider ${
                      view === 'search' 
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                        : 'bg-slate-950/40 text-slate-400 border-slate-900 hover:border-slate-800'
                      }`}
                  >
                    📡 Radar
                  </button>

                   {/* 🔍 NEUER LINK: guestEvents (EVENT-SUCHE) FÜR EINGELOGGTE USER */}
                  <button
                    type="button"
                    onClick={() => setView('guestEvents')}
                    className={`px-2.5 py-1 rounded-lg border font-black transition-all cursor-pointer text-xs font-mono uppercase tracking-wider ${
                      view === 'guestEvents'
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                        : 'bg-slate-950/40 text-slate-400 border-slate-900 hover:border-slate-800'
                      }`}
                  >
                    🔍 Event-Radar
                  </button>

                  {/* 🧑‍💻 DEIN NEUER INTERAKTIVER PROFIL-BUTTON (Zeigt den echten Usernamen an) */}
                  <button 
                    type="button" 
                    onClick={() => setView('userProfile')} 
                    className={`px-3 py-1 rounded-lg border font-black transition-all cursor-pointer ${view === 'profile' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-slate-950 border-slate-900 text-cyan-400 hover:border-cyan-500/40 shadow-md'}`}
                  >
                    🧑‍💻 {ticketName}
                  </button>
 
                  <button 
                    type="button" 
                    onClick={() => { 
                      localStorage.removeItem('gigsda_logged_in');
                      localStorage.removeItem('gigsda_user_name');
                      setIsLoggedIn(false); 
                      setTicketName('Gast'); 
                      setView('landing'); 
                    }} 
                    className="text-rose-500 hover:text-rose-400 px-1 font-bold cursor-pointer"
                  >
                    [ Exit ]
                  </button>
                </>
              ) : (
                <>
                  <button type="button" onClick={() => setView('landing')} className={`px-2 py-1 cursor-pointer ${view === 'landing' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'}`}>Startseite</button>
 
                  {/* Für uneingeloggte Nutzer steht oben nur noch der saubere Login-Button */}
                  <button 
                    type="button" 
                    onClick={() => { setIsRegInitial(false); setView('login'); }} 
                    className="bg-cyan-400 text-slate-950 font-black px-3 py-1 rounded-lg hover:bg-cyan-300 transition-colors cursor-pointer"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
 
          </div>
        </header>
 
        {/* ========================================================================= */}
        {/* MAIN ROUTER PORT                                                          */}
        {/* ========================================================================= */}
        <main className="flex-grow w-full px-4 py-6">
 
          {view === 'landing' && !isLoggedIn && (
            <LandingPage 
              onEnterCenter={(selectedCity) => {
                // Merkt sich die gesuchte Stadt temporär im System
                setTicketName(`Gast (${selectedCity})`);
                // Leitet den Gast schnurgerade weiter in deine Event-Liste
                setView('guestEvents'); 
              }} 
              onCreateAccount={(passName) => {
                setIsRegInitial(true);
                setView('login');
              }} 
            />
          )}
 
          {view === 'login' && !isLoggedIn && (
            <LoginRegisterMask 
              isRegisteringInitial={view === 'register'}
              onLoginSuccess={(name) => {
                // 🔐 DER UNZERSTÖRBARE BEFREIUNGSSCHLAG:
                // Brennt deinen echten Login-Namen (Winston) in den Speicher und fegt den "Gast" vom Platz!
                localStorage.setItem('gigsda_user_name', name);
                localStorage.setItem('gigsda_logged_in', 'true');
                
                setIsLoggedIn(true);
                setView('projects'); // ➔ Direkt ab auf euer echtes Projekt-Dashboard!
              }} 
            />

          )}


 
          {/* 📑 GAST-WEICHE 1: WAS IST GIGSDA? */}
          {view === 'whatIsGigsda' && <WhatIsGigsda />}

          {/* 🎫 GAST-EVENTS ROUTE: SCHALTET DIE ÖFFENTLICHE EVENT-LISTE FREI */}
          {view === 'guestEvents' && (
            <GuestEvents 
              onBack={() => setView('landing')} 
              onNavigate={setView}
            />
          )}

          {/* 🔍 GAST-SUCHER (REPARIERT) */}
          {view === 'radar' && !isLoggedIn && (
            <SearchExplorer 
              onBack={() => setView('landing')} 
              setFavorites={(artistView) => {
                // ⚡ DIE RETTUNG: Schreibt den Namen in die Variable, die das Profilboard hören kann!
                setActiveGuestArtist(artistView); 
                setView('profile');
              }}
            />
          )}

          {/* 🔍 KÜNSTLER-RADAR FÜR EINGELOGGTE USER (DATENLEITUNG KORRIGIERT) */}
          {view === 'radar' && isLoggedIn && (
            <SearchExplorer 
              onBack={() => setView('projects')} 
              setFavorites={(artistView) => {
                // ⚡ DIE RETTUNG: Schreibt den Namen in die Variable, die das Profilboard hören kann!
                setActiveGuestArtist(artistView); 
                setView('profile');
              }}
            />
          )}

          {/* 🔍 SUCHER-WEICHE: ÖFFNET IMMER DAS ANGEKLICKTE PROFIL SCHREIBGESCHÜTZT */}
          {view === 'profile' && activeGuestArtist && (
            <UserProfile 
              ticketName={activeGuestArtist} 
              onBack={() => setView('radar')} 
              isOwner={false} // <-- Keine Rechte für Fremde!
            />
          )}

          {/* 🎸 KÜNSTLER-WEICHE: ÖFFNET DEIN EIGENES PROFIL MIT EDIT-RECHTEN */}
          {view === 'userProfile' && isLoggedIn && (
            <UserProfile 
              ticketName={ticketName} 
              onBack={() => setView('projects')} 
              isOwner={true} // <-- Volle Edit-Rechte für dich selbst!
            />
          )}

          {/* ⚡ DIE ECHTE DIREKTLEITUNG ZU DEINEN PROFILE-SETTINGS */}
          {view === 'profileSettings' && isLoggedIn && (
            <ProfileSettings 
              onSaveSuccess={() => setView('profile')} 
              onBack={() => setView('profile')} 
            />
          )}
 
          {view === 'projects' && isLoggedIn && (
            <ProjectDashboard 
              ticketName={ticketName} 
              onNavigateToStep={setView} 
              progress={progress} 
            />
          )}

          {view === 'shortlist' && isLoggedIn && (
            <CrewShortlist onBack={() => setView('projects')} progress={progress} activeEvent={events.find(e => e.id === activeEvent?.id) || activeEvent} onNavigateToStep={setView} setFavorites={handleUpdateCrewForEvent} />
          )}
 
          {view === 'stage' && isLoggedIn && (
            <StageSpecs onBack={() => setView('shortlist')} progress={progress} activeEvent={events.find(e => e.id === activeEvent?.id) || activeEvent} onNavigateToStep={setView} onApproveSuccess={() => setProgress(prev => ({ ...prev, stage: 100 }))} />
          )}
 
          {view === 'contract' && isLoggedIn && (
            <ContractCenter onBack={() => setView('projects')} progress={progress} activeEvent={events.find(e => e.id === activeEvent?.id) || activeEvent} onNavigateToStep={setView} onContractSigned={() => setProgress(prev => ({ ...prev, contract: 100 }))} />
          )}
 
          {view === 'voting' && isLoggedIn && (
            <TeamVoting onBack={() => setView('projects')} progress={progress} activeEvent={events.find(e => e.id === activeEvent?.id) || activeEvent} onNavigateToStep={setView} onVoteSuccess={() => setProgress(prev => ({ ...prev, voting: 100 }))} />
          )}
 
          {view === 'planner' && isLoggedIn && (
            <EventPlanner onBack={() => setView('projects')} progress={progress} activeEvent={events.find(e => e.id === activeEvent?.id) || activeEvent} onNavigateToStep={setView} onStepSuccess={() => setProgress(prev => ({ ...prev, planner: 100 }))} />
          )}
 
          {view === 'countdown' && isLoggedIn && (
            <LiveCountdown onBack={() => setView('projects')} progress={progress} activeEvent={events.find(e => e.id === activeEvent?.id) || activeEvent} onNavigateToStep={setView} setProgress={setProgress} onTriggerGate={triggerGate} />
          )}
 
          {/* 🔍 KÜNSTLER-SUCHE FÜR EINGELOGGTE USER (PROFIL-WEICHE REPARIERT) */}
          {view === 'search' && (
            <SearchExplorer 
              onBack={() => setView('shortlist')} 
              isGuest={!isLoggedIn} 
              onTriggerGate={triggerGate} 
              favorites={activeEvent ? (events.find(e => e.id === activeEvent.id)?.crewIds || []) : []} 
              
              // ⚡ DIE RETTUNG: Wenn im Sucher handleProfileClick feuert, 
              // beamen wir den User direkt auf das schreibgeschützte Portfolio!
              setFavorites={(artistView) => {
                setActiveGuestArtist(artistView);
                setView('profile');
              }}
            />
          )}

 
        </main>
 
        {/* ========================================================================= */}
        {/* FOOTER                                                                    */}
        {/* ========================================================================= */}
        <footer className="w-full border-t border-slate-900/60 bg-slate-950 py-3 text-center text-[9px] text-slate-600 mt-12">
          GIGSDA PROTOCOL V2.6 // OPERATOR: <span className="text-cyan-400 font-bold">{ticketName}</span> // RECHTSGÜLTIG GESICHERT
        </footer>
      </div>
 
      {/* ERFOLGS BANNER */}
      {successBanner && (
        <div onClick={() => setSuccessBanner(null)} className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 text-center space-y-4">
            <h3 className="text-sm font-black text-emerald-400 uppercase font-mono tracking-tight">Signal gefeuert!</h3>
            <p className="text-[11px] text-slate-300 font-sans">{successBanner}</p>
            <button type="button" onClick={() => setSuccessBanner(null)} className="w-full bg-emerald-500 text-slate-950 font-mono font-black text-[10px] uppercase h-10 rounded-xl">✓ Bestätigen</button>
          </div>
        </div>
      )}
 
    </div>
  );
}

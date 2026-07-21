import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import LoginRegisterMask from './LoginRegisterMask';
import ProjectDashboard from './ProjectDashboard';
import CrewShortlist from './CrewShortlist';
import StageSpecs from './StageSpecs';
import ContractCenter from './ContractCenter';
import TeamVoting from './TeamVoting';
import EventPlanner from './EventPlanner';
import EventPromotion from './EventPromotion';
import LiveCountdown from './LiveCountdown';
import ProfileSettings from './ProfileSettings';
// 👈 Lade Navigation
import GuestNavigation from './GuestNavigation';
import GlobalNavigation from './GlobalNavigation';

import WhatIsGigsda from './WhatIsGigsda';
import GuestEvents from './GuestEvents';
import SearchExplorer from './SearchExplorer.jsx';
import ArtistSearchPage from './components/ArtistSearchPage'; // Pfad anpassen, falls im Unterordner
import UniversalSearchPage from './components/UniversalSearchPage'; // Pfad anpassen, falls im Unterordner

// 👈 Lade Profile
import UserProfile from './UserProfile'; // 👈 Temporärer Import zum Anschauen
import LocationProfile from './LocationProfile'; // 👈 Temporärer Import zum Anschauen
import VerleiherProfile from './VerleiherProfile'; // 🔌 Schaltet das Rental-Cockpit im System frei!
import TechnikerProfile from './TechnikerProfile'; // 🎛️ Schaltet das Crew-Cockpit im System frei!
import CaterProfile from './CaterProfile'; // 🔒 Schaltet das vollwertige Gastro-Profil frei!
import VeranstalterProfile from './VeranstalterProfile'; // 💼 Schaltet das Orga-Cockpit im System frei!
import LogistikProfile from './LogistikProfile';   // 🚛 Schaltet das Cargo- & Shuttle-Cockpit frei
import SecurityProfile from './SecurityProfile';   // 🛡️ Schaltet das Sicherheitsdienst-Cockpit frei
import DesignProfile from './DesignProfile';       // 🎭 Schaltet das Stage-Design- & Deko-Cockpit frei
import FanProfile from './FanProfile'; // 👈 Schaltet die Fan-Zentrale im System frei!


import CrewRequestCenter from './CrewRequestCenter'; // 👈 Das B2B-Uhrwerk laden
import CrewFavoritenListe from './CrewFavoritenListe'; // ⭐ Schaltet die Favoriten-Matrix frei!
import RiderZentrale from './RiderZentrale'; // 🎛️ Schaltet das geteilte B2B-Rider-Uhrwerk plattformweit frei!
import CommunityChat from './CommunityChat';

import { initialUsers, initialProfiles } from './data/mockData';
import ArtistPortfolio from "./components/ArtistPortfolio";
 
export default function App() {
    // 📡 REAKTIVER CREW-ALARM EMPFÄNGER
  const [hasPendingRequests, setHasPendingRequests] = useState(false);

  const checkPendingRequests = () => {
    try {
      const savedReqs = JSON.parse(localStorage.getItem('gigsda_crew_requests') || '[]');
      
      const currentUserName = (localStorage.getItem('gigsda_user_name') || '').trim().toLowerCase();
      
      const hasPending = savedReqs.some(r => {
        if (!r) return false;
        
        const reqName = (r.requestedProfile || '').trim().toLowerCase();
        const senderName = (r.requesterName || '').trim().toLowerCase();
        const reqStatus = (r.status || '').trim().toLowerCase();
        
        // 🟢 WEG 1: Ich bin der angefragte Partner (Empfänger) und die Anfrage ist neu
        const isIncomingPending = (reqName === currentUserName && reqStatus === 'pending');
        
        // 🟡 WEG 2: Ich bin der Absender (Veranstalter) und der Partner hat mir ein Gegenangebot geschickt
        const isOutgoingCounter = (senderName === currentUserName && reqStatus === 'counter_offer');
        
        return isIncomingPending || isOutgoingCounter;
      });
      
      setHasPendingRequests(hasPending);
    } catch (e) {
      setHasPendingRequests(false);
    }
  };






      {/* F5 Session Recovery */}
      useEffect(() => {
        const storedActiveEvent =
          JSON.parse(localStorage.getItem("gigsda_active_event"));

        const events =
          JSON.parse(localStorage.getItem("gigsda_events")) || [];

        if (storedActiveEvent?.id) {
          const restoredEvent = events.find(
            e => e.id === storedActiveEvent.id
          );

        if (restoredEvent) {

          setActiveEvent(restoredEvent);

          const countdownProgress = Math.round(
            (
              (
                restoredEvent.crewIds?.length > 0
                  ? 100
                  : 0
              )
              +
              (
                restoredEvent.crewIds?.length > 0
                  ? Math.round(
                      (
                        Object.values(
                          restoredEvent.riderCenter || {}
                        ).filter(
                          rider => rider?.confirmed
                        ).length /
                        restoredEvent.crewIds.length
                      ) * 100
                    )
                  : 0
              )
              +
              (
                restoredEvent.dealSent
                  ? Math.round(
                      (
                        Object.keys(
                          restoredEvent.acceptedDeals || {}
                        ).length /
                        (
                          restoredEvent.crewIds?.length || 1
                        )
                      ) * 100
                    )
                  : 0
              )
              +
              (
                restoredEvent.plannerLocked
                  ? 100
                  : 50
              )
              +
              (
                restoredEvent.promotionData?.title
                  ? 100
                  : 0
              )
            ) / 5
          );

          setProgress({
            shortlist:
              Math.round(
                (
                  (
                    restoredEvent.ownerId
                      ? 1
                      : 0
                  )
                  +
                  (
                    (restoredEvent.crewIds || []).some(
                      id => id !== restoredEvent.ownerId
                    )
                      ? 1
                      : 0
                  )
                ) / 2 * 100
              ),

            stage:
              restoredEvent.crewIds?.length > 0
                ? Math.round(
                    (
                      Object.values(
                        restoredEvent.riderCenter || {}
                      ).filter(
                        rider => rider?.confirmed
                      ).length /
                      restoredEvent.crewIds.length
                    ) * 100
                  )
                : 0,

            contract:
              restoredEvent.dealSent
                ? Math.round(
                    (
                      Object.keys(
                        restoredEvent.acceptedDeals || {}
                      ).length /
                      (
                        restoredEvent.crewIds?.length || 1
                      )
                    ) * 100
                  )
                : 0,

            planner:
              restoredEvent.plannerLocked
                ? 100
                : 50,

            promotion:
              restoredEvent.promotionData?.title
                ? 100
                : 0,

            countdown: countdownProgress
            
          });

        }
        }
      }, []);












  // Horcht auf das globale Sendesignal der Plattform
  useEffect(() => {
    checkPendingRequests(); // Einmal direkt beim Start prüfen

      // === GIGSDA CORE AUTO-INITIALISIERUNG AUS VS CODE ===
    const storedProfiles = localStorage.getItem('gigsda_profiles');
    if (!storedProfiles || JSON.parse(storedProfiles).length === 0) {
      localStorage.setItem('gigsda_profiles', JSON.stringify(initialProfiles));
    }
    window.addEventListener('request-sent', checkPendingRequests);
    window.addEventListener('route-change', checkPendingRequests);
    return () => {
      window.removeEventListener('request-sent', checkPendingRequests);
      window.removeEventListener('route-change', checkPendingRequests);
    };
  }, []);

  // ⚡ BROWSER-SAFE SESSION MEMORY
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('gigsda_logged_in') === 'true';
  });

  useEffect(() => {
    const session = JSON.parse(
      localStorage.getItem("gigsda_session") || "null"
    );

    if (!session?.profileId) return;

    const profiles = JSON.parse(
      localStorage.getItem("gigsda_profiles") || "[]"
    );

    const currentProfile = profiles.find(
      p => p.id === session.profileId
    );

    if (!currentProfile) return;

    setTicketName(currentProfile.name);
    setIsLoggedIn(true);

    localStorage.setItem(
      "gigsda_user_name",
      currentProfile.name
    );

    localStorage.setItem(
      "gigsda_logged_in",
      "true"
    );
  }, []);
  
  // 🛰️ EIGENE LEITUNG FÜR DEN GAST-SUCHER (VERGISS JEDE ANDERE VARIABLE!)
  const [activeGuestArtist, setActiveGuestArtist] = useState('');
 
  const [ticketName, setTicketName] = useState(() => {
    return localStorage.getItem('gigsda_user_name') || 'Gast';
  });

    useEffect(() => {
    const savedName = localStorage.getItem('gigsda_user_name');
      if (savedName) {
        setTicketName(savedName);
      } else {
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
        ownerId: "GIGS-7677",    // 🔥 wer hat es erstellt
        crewIds: ["GIGS-3344"]
      },
      { 
        id: "EVT-2026-02", 
        title: "Winston Jud OpenAir", 
        type: "Festival", 
        date: "Sa, 15. Aug 2026", 
        doneProgress: 0, 
        venue: "Stadtpark Wiese, Braunau",
        text: "Event frisch initialisiert. Starte die Crew-Suche im Radar.",
        ownerId: "GIGS-7677",    // 🔥 wer hat es erstellt
        crewIds: ["GIGS-3344"] 
      },
      { 
        id: "EVT-2026-03", 
        title: "Winston Jud @ The Jazz Cave", 
        type: "Clubshow", 
        date: "Sa, 10. Okt 2026", 
        doneProgress: 100, 
        venue: "The Jazz Cave",
        text: "Alle Meilensteine verriegelt. Live-Countdown läuft im Netz.",
        ownerId: "GIGS-7677",    // 🔥 wer hat es erstellt
        crewIds: ["GIGS-3344"] 
      }
    ];
  });
 

  const [progress, setProgress] = useState({
    shortlist: 0,
    stage: 0,
    contract: 0,
    voting: 0,
    planner: 0,
    promotion: 0,
    countdown: 0
  });

  useEffect(() => {
    
    const countdownReady =
      progress.shortlist === 100 &&
      progress.stage === 100 &&
      progress.contract === 100 &&
      progress.planner === 100 &&
      progress.promotion === 100;


    setProgress(prev => ({
      ...prev,
      countdown:
        Math.round(
          (
            prev.shortlist +
            prev.stage +
            prev.contract +
            prev.planner +
            prev.promotion
          ) / 5
        )
    }));

  }, [
    progress.shortlist,
    progress.stage,
    progress.contract,
    progress.planner,
    progress.promotion
  ]);


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
    const newUser = {
      id: "USR-" + Date.now().toString().slice(-4),
      name: name,
      role: role || 'Veranstalter',
      registeredAt: new Date().toLocaleDateString()
    };
 
    // Nur speichern, wenn der User nicht schon existiert
    if (!existingUsers.some(u => u.name.toLowerCase() === name.toLowerCase()))
 
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
 

  useEffect(() => {

    const handleActiveEventUpdated = () => {

      const storedEvent = JSON.parse(
        localStorage.getItem("gigsda_active_event")
      );

      if (storedEvent) {
        setActiveEvent(storedEvent);
      }

    };

    window.addEventListener(
      "active-event-updated",
      handleActiveEventUpdated
    );

    return () => {
      window.removeEventListener(
        "active-event-updated",
        handleActiveEventUpdated
      );
    };

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
        {/* 🌌 TEMPORÄRER VERGLEICHS-HEADER: KOMPLETT FLACH UND TIEFSCHWARZ OHNE NEON-RAHMEN */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0b0f19] border-b border-slate-900/60 shadow-lg font-mono">
          <div className="w-full bg-[#0b0f19]/95 backdrop-blur-md rounded-b-[14px]">
            {/* 🚨 DANIELS ORIGINALER ZENTRIER-CONTAINER: REPARIERT DAS LAYOUT DER RESTLICHEN SEITE! */}
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
              
              {/* 🌌 REAKTIVES INTERAKTIVES NAVBAR-LOGO MIT GAST-LINK & HOVER-EFFEKT */}
              <button
                type="button"
                onClick={() => {
                  // 📡 DER LIVE-RÜCKFLUG: Schießt den Gast-Router sofort zurück auf die Landingpage!
                  if (typeof setView === 'function') {
                    setView('landing');
                  } else if (typeof setCurrentView === 'function') {
                    setCurrentView('landing');
                  }
                }}
                className="relative flex items-center justify-center select-none mr-2 shrink-0 group transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] bg-transparent border-none p-0 cursor-pointer outline-none"
                title="Zurück zur Startseite"
              >
                {/* 📡 INTERAKTIVE HOVER-AURA: Leuchtet nur auf, wenn die Maus drüberstreift! */}
                <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/5 rounded-xl filter blur-sm scale-110 transition-all duration-300"></div>
                
                {/* DAS LOGO */}
                <img 
                  src="/2026/logos/gigsda-logo-2.svg" 
                  alt="Gigsda Logo" 
                  className="h-6 w-auto object-contain relative z-10 opacity-90 brightness-100 group-hover:opacity-100 group-hover:brightness-125 transition-all duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentNode.insertAdjacentHTML('beforeend', `
                      <div class="h-6 w-6 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center font-sans font-black text-[10px] text-white">G</div>
                    `);
                  }}
                />
              </button>


              {/* 📡 REAKTIVE COCKPIT-WEICHE */}
              {localStorage.getItem('gigsda_logged_in') === 'true' ? (
                <GlobalNavigation view={view} setView={setView} />
              ) : (
                <GuestNavigation view={view} setView={setView} />
              )}

            </div>
          </div>
        </header>


       {/* 📡 AUTOMATISCHES CREW-REQUEST-CENTER (BLITZT BEI NEUEN ANFRAGEN & GEGENANGEBOTEN GANZ OBEN AUF) */}
      {view === 'projects' && isLoggedIn && (
        <div className="max-w-4xl mx-auto px-6 pt-4">
          <CrewRequestCenter currentProfileName={ticketName} />
        </div>
      )}
        {/* ========================================================================= */}
        {/* MAIN ROUTER PORT                                                          */}
        {/* ========================================================================= */}
        <main className="w-full pt-24 min-h-screen bg-[#070913] text-white">
 
          {view === 'landing' && (
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

          {/* ========================================================================= */}
          {/* 🏟️ INTERAKTIVE 10-WEGE ROLLER-WEICHE: DAS KOMPLETTE GIGSDA-B2B-UNIVERSUM */}
          {view === 'profile' && activeGuestArtist && (
            (() => {
              const savedProfiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');
              const currentProfile = savedProfiles.find(p => p && p.name && p.name.trim().toLowerCase() === activeGuestArtist.trim().toLowerCase());
              
              if (currentProfile?.role === 'Location') { return <LocationProfile ticketName={activeGuestArtist} onNavigate={setView} />; }
              else if (currentProfile?.role === 'Fan') { return <FanProfile ticketName={activeGuestArtist} onNavigate={setView} />; }
              else if (currentProfile?.role === 'Material' || currentProfile?.role === 'Verleiher') { return <VerleiherProfile ticketName={activeGuestArtist} onNavigate={setView} />; }
              else if (currentProfile?.role === 'Techniker') { return <TechnikerProfile ticketName={activeGuestArtist} onNavigate={setView} />; }
              else if (currentProfile?.role === 'Catering') { return <CaterProfile ticketName={activeGuestArtist} onNavigate={setView} />; }
              else if (currentProfile?.role === 'Veranstalter') { return <VeranstalterProfile ticketName={activeGuestArtist} onNavigate={setView} />; }
              else if (currentProfile?.role === 'Logistik') { return <LogistikProfile ticketName={activeGuestArtist} onNavigate={setView} />; }
              else if (currentProfile?.role === 'Security') { return <SecurityProfile ticketName={activeGuestArtist} onNavigate={setView} />; }
              else if (currentProfile?.role === 'Design' || currentProfile?.role === 'Deko') { return <DesignProfile ticketName={activeGuestArtist} onNavigate={setView} />; }
              else { return <UserProfile ticketName={activeGuestArtist} onBack={() => setView('radar')} isOwner={false} />; }
            })()
          )}

          {view === 'userProfile' && isLoggedIn && (
            (() => {
              const savedProfiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');
              const currentProfile = savedProfiles.find(p => p && p.name && p.name.trim().toLowerCase() === ticketName.trim().toLowerCase());
              
              if (currentProfile?.role === 'Location') { return <LocationProfile ticketName={ticketName} onNavigate={setView} />; }
              else if (currentProfile?.role === 'Fan') { return <FanProfile ticketName={ticketName} onNavigate={setView} />; }
              else if (currentProfile?.role === 'Material' || currentProfile?.role === 'Verleiher') { return <VerleiherProfile ticketName={ticketName} onNavigate={setView} />; }
              else if (currentProfile?.role === 'Techniker') { return <TechnikerProfile ticketName={ticketName} onNavigate={setView} />; }
              else if (currentProfile?.role === 'Catering') { return <CaterProfile ticketName={ticketName} onNavigate={setView} />; }
              else if (currentProfile?.role === 'Veranstalter') { return <VeranstalterProfile ticketName={ticketName} onNavigate={setView} />; }
              else if (currentProfile?.role === 'Logistik') { return <LogistikProfile ticketName={ticketName} onNavigate={setView} />; }
              else if (currentProfile?.role === 'Security') { return <SecurityProfile ticketName={ticketName} onNavigate={setView} />; }
              else if (currentProfile?.role === 'Design' || currentProfile?.role === 'Deko') { return <DesignProfile ticketName={ticketName} onNavigate={setView} />; }
              else { return <UserProfile ticketName={ticketName} onBack={() => setView('projects')} isOwner={true} />; }
            })()
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
              currentProfileName={ticketName}
              onSelectEvent={setActiveEvent}
            />
          )}

          {/* 🎛️ REALTIME B2B RIDER & GEWERKE EXPRESS-PIPELINE (IMMUN GEGEN ID-FEHLER!) */}
          {view === 'riderzentrale' && (
            (() => {
              // 📡 Doppel-Sicherheits-Brücke: Vergleicht ID UND Titel parallel!
              let targetedEvent = activeEvent;
              try {
                const activeData = localStorage.getItem('gigsda_active_event');
                if (activeData) {
                  const parsedActive = JSON.parse(activeData);
                  const savedEvents = JSON.parse(localStorage.getItem('gigsda_events') || localStorage.getItem('gigsda_projects') || '[]');
                  
                  // Sucht erst nach der ID, und falls das fehlschlägt oder doppelt ist, nach dem exakten Titel!
                  const found = savedEvents.find(ev => ev && (
                    (ev.id && ev.id === parsedActive.id) || 
                    (ev.eventId && ev.eventId === parsedActive.id) || 
                    (ev._id && ev._id === parsedActive.id) ||
                    (ev.title && ev.title === parsedActive.title) ||
                    (ev.name && ev.name === parsedActive.title)
                  ));
                  
                  if (found) {
                    targetedEvent = found;
                  }
                }
              } catch (e) { console.error("Fehler in App.jsx Express-Weiche:", e); }


            return <RiderZentrale
              onBack={() => setView('projects')}
              activeEvent={targetedEvent}
              onNavigateToStep={setView}
              setFavorites={(artistView) => {

                setActiveGuestArtist(artistView);
                setView('profile');
              }}
            />;

            })()
          )}

          {/* ⭐ UNZERSTÖRBARE GIGSDA FAVORITEN POOL EXPRESS-PIPELINE */}
          {view === 'crewfavoriten' && (
            (() => {
              return <CrewFavoritenListe onNavigate={setView} 
              />;
            })()
          )}

          {view === 'communitychat' && isLoggedIn && (
            <CommunityChat
              onBack={() => setView('projects')}
            />
          )}

          {view === 'shortlist' && isLoggedIn && (
            <CrewShortlist onBack={() => setView('projects')} progress={progress} setProgress={setProgress} activeEvent={events.find(e => e.id === activeEvent?.id) || activeEvent} onNavigateToStep={setView} setFavorites={handleUpdateCrewForEvent} />
          )}
 
          {view === 'stage' && isLoggedIn && (
            <StageSpecs onBack={() => setView('shortlist')} progress={progress} setProgress={setProgress} activeEvent={events.find(e => e.id === activeEvent?.id) || activeEvent} onNavigateToStep={setView} onApproveSuccess={() => setProgress(prev => ({ ...prev, stage: 100 }))} />
          )}
 
          {view === 'contract' && isLoggedIn && (
            <ContractCenter onBack={() => setView('projects')} progress={progress} setProgress={setProgress} activeEvent={events.find(e => e.id === activeEvent?.id) || activeEvent} onNavigateToStep={setView} onContractSigned={() => setProgress(prev => ({ ...prev, contract: 100 }))} />
          )}
 
          {view === 'voting' && isLoggedIn && (
            <TeamVoting onBack={() => setView('projects')} progress={progress} activeEvent={events.find(e => e.id === activeEvent?.id) || activeEvent} onNavigateToStep={setView} onVoteSuccess={() => setProgress(prev => ({ ...prev, voting: 100 }))} />
          )}
 
          {view === 'planner' && isLoggedIn && (
            <EventPlanner onBack={() => setView('projects')} progress={progress} setProgress={setProgress} activeEvent={events.find(e => e.id === activeEvent?.id) || activeEvent} onNavigateToStep={setView} onStepSuccess={() => setProgress(prev => ({ ...prev, planner: 100 }))} />
          )}
 
          {view === 'countdown' && isLoggedIn && (
            <LiveCountdown onBack={() => setView('projects')} progress={progress} activeEvent={events.find(e => e.id === activeEvent?.id) || activeEvent} onNavigateToStep={setView} setProgress={setProgress} onTriggerGate={triggerGate} />
          )}
 
          {view === 'promotion' && isLoggedIn && (
            <EventPromotion
              onBack={() => setView('planner')}
              progress={progress}
              setProgress={setProgress}
              activeEvent={events.find(
                e => e.id === activeEvent?.id
              )}
              onNavigateToStep={setView}
            />
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

          {/* DIE UNIVERSELLE GIGSDA B2B MATRIXSUCHE IN APP.JSX */}
          {view === 'artists' && (
            <UniversalSearchPage 
              onNavigate={(name) => {
                setActiveGuestArtist(name); // Setzt den Namen exakt wie in Zeile 543
                setView('profile');          // Wechselt in dein funktionierendes Profil aus Zeile 544
              }}
              setView={setView}
            />
          )}


          {view === "artistPortfolio" && (
            <ArtistPortfolio />
          )}


 
        </main>
 
        {/* ========================================================================= */}
        {/* FOOTER                                                                    */}
        {/* ========================================================================= */}
        <footer className="w-full border-t border-slate-900/60 bg-slate-950 py-3 text-center text-xm text-slate-600 mt-12">
          GIGSDA PROTOCOL V2.6 // OPERATOR: 
          <span className="text-cyan-400 font-bold">{ticketName} </span> 
          // RECHTSGÜLTIG GESICHERT
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

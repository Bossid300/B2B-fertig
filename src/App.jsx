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

import GuestEvents from './GuestEvents';
import SearchExplorer from './SearchExplorer.jsx';
import ArtistSearchPage from './components/ArtistSearchPage'; // Pfad anpassen, falls im Unterordner
import UniversalSearchPage from './components/UniversalSearchPage'; // Pfad anpassen, falls im Unterordner


import TermsPage from './pages/info/TermsPage.jsx';
import PrivacyPage from './pages/info/PrivacyPage.jsx';
import ImpressumPage from './pages/info/ImpressumPage.jsx';
import AGBPage from './pages/info/AGBPage.jsx';

import WhatIsGigsda from './pages/info/WhatIsGigsda.jsx';
import EventsLocationsPage from './pages/info/EventsLocationsPage.jsx';
import SearchProtocolPage from './pages/info/SearchProtocolPage.jsx';
import OnboardingTutorial from './pages/info/OnboardingTutorial.jsx';

import SecurityPage from './pages/info/SecurityPage.jsx';
import PaymentMethodsPage from './pages/info/PaymentMethodsPage.jsx';
import EscrowProtectionPage from './pages/info/EscrowProtectionPage.jsx';
import FAQPage from './pages/info/FAQPage.jsx';

import AboutGigsda from './pages/info/AboutGigsda.jsx';
import ContactPage from './pages/info/ContactPage.jsx';
import CareerPage from './pages/info/CareerPage.jsx';



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
import GigsdaPass from "./components/GigsdaPass";
import PassPrintPage from './components/prints/PassPrintPage';

import { eventService } from './services/eventService';
import { progressService } from './services/progressService';

import CommunityAlertModal from './components/modals/CommunityAlertModal';
import {
  createProfile,
  getCrewRequests,
  getProfileById
} from './services/apiService';

import PricingPage from './PricingPage';
import BillingCenter from './components/BillingCenter';
import { getProfiles } from './services/apiService';

export default function App() {

    // 📡 REAKTIVER CREW-ALARM EMPFÄNGER
  const [hasPendingRequests, setHasPendingRequests] = useState(false);
  const checkPendingRequests = async () => {
    try {
      const dbRequests =
        await getCrewRequests();

      const currentUserName =
        (localStorage.getItem('gigsda_user_name') || '')
          .trim()
          .toLowerCase();

      const currentProfileId =
        localStorage.getItem('gigsda_profile_id') || '';

      const hasPending = dbRequests.some(r => {
        if (!r) return false;

        const requestedName =
          (r.requestedProfile || r.requestedProfileName || '')
            .trim()
            .toLowerCase();

        const requesterName =
          (r.requesterName || r.requesterProfileName || '')
            .trim()
            .toLowerCase();

        const reqStatus =
          (r.status || '')
            .trim()
            .toLowerCase();

        const isIncomingPending =
          (
            r.requestedProfileId === currentProfileId ||
            requestedName === currentUserName
          ) &&
          reqStatus === 'pending';

        const isOutgoingCounter =
          (
            r.requesterProfileId === currentProfileId ||
            requesterName === currentUserName
          ) &&
          reqStatus === 'counter_offer';

        return isIncomingPending || isOutgoingCounter;
      });

      setHasPendingRequests(hasPending);
    } catch (e) {
      console.error(
        'APP REQUEST ALARM DB FEHLER ❌',
        e
      );

      setHasPendingRequests(false);
    }
  };






      {/* F5 Session Recovery */}
      useEffect(() => {
        const storedActiveEvent =
          JSON.parse(localStorage.getItem("gigsda_active_event"));

        const events =
          eventService.getEvents();

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
  const [currentProfile, setCurrentProfile] = useState(null);
  useEffect(() => {
    const session = JSON.parse(
      localStorage.getItem("gigsda_session") || "null"
    );
    if (!session?.profileId) return;
    const loadSessionProfile = async () => {
      try {
        const profileResult = await getProfileById(
          session.profileId
        );
        const loadedProfile =
          profileResult?.profile;

        if (!loadedProfile) return;
        setCurrentProfile(
          loadedProfile
        );
        setTicketName(
          loadedProfile.name
        );
        setIsLoggedIn(true);
        localStorage.setItem(
          "gigsda_user_name",
          loadedProfile.name
        );
        localStorage.setItem(
          "gigsda_logged_in",
          "true"
        );
      } catch (e) {
        console.error(
          "SESSION PROFILE LOAD ERROR",
          e
        );
      }
    };

    loadSessionProfile();
  }, []);
  
  // 🛰️ EIGENE LEITUNG FÜR DEN GAST-SUCHER (VERGISS JEDE ANDERE VARIABLE!)
  const [activeGuestArtist, setActiveGuestArtist] = useState(
    () => localStorage.getItem('gigsda_active_guest_artist') || ''
  );
  const [activeGuestProfileId, setActiveGuestProfileId] =
  useState(
    () =>
      localStorage.getItem(
        'gigsda_active_guest_profile_id'
      ) || ''
  );
  const [guestProfile, setGuestProfile] = useState(null);

  useEffect(() => {

    const loadGuestProfile = async () => {

      const guestProfileId =
        localStorage.getItem(
          'gigsda_active_guest_profile_id'
        );

      if (!guestProfileId) return;

      try {

        const result =
          await getProfileById(
            guestProfileId
          );

        if (result?.profile) {
          setGuestProfile(
            result.profile
          );
        }

      } catch (e) {

        console.error(
          'GUEST PROFILE LOAD ERROR',
          e
        );

      }
    };

    loadGuestProfile();

  }, [activeGuestProfileId]);

useEffect(() => {
  const loadProfileFromQr = async () => {
    const params = new URLSearchParams(
      window.location.search
    );
    const portfolioId =
      params.get('portfolio');

    const refId =
      params.get('ref');

    if (refId) {
      localStorage.setItem(
        'gigsda_referrer',
        refId
      );
    }

    if (!portfolioId) return;
    const profiles =
      await getProfiles();
    const found = profiles.find(
      p => p && p.id === portfolioId
    );
    if (found) {
      setActiveGuestArtist(found.name);

      setActiveGuestProfileId(found.id);

      localStorage.setItem(
        'gigsda_active_guest_artist',
        found.name
      );

      localStorage.setItem(
        'gigsda_active_guest_profile_id',
        found.id
      );

      localStorage.setItem(
        'gigsda_portfolio_profile',
        found.id
      );
      setView('artistPortfolio');
    }
  };
  loadProfileFromQr();
}, []);








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

 
  const [events, setEvents] = useState(() => {
    return eventService.getEvents();
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
        const updatedEvent = {
          ...evt,
          crewIds: newCrewIds
        };

        setActiveEvent(updatedEvent);

        return updatedEvent;
      }

      return evt;
    });

    setEvents(updatedEvents);

    eventService.saveEvents(updatedEvents);

    const updatedEvent =
      updatedEvents.find(evt => evt.id === activeEvent.id);

    if (updatedEvent) {
      eventService.saveEvent(updatedEvent);
    }
  };
 

  // 📡 GIGSDA PUSH-Alarm: Community benachrichtigung
  const triggerGate = (message) => {
    if (isLoggedIn) {
      setCommunityAlert(message);
      return;
    }
    setView('login');
  };

  const [communityAlert,
  setCommunityAlert] =
  useState(null); 



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

      setEvents(eventService.getEvents());
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





  const freshActiveEvent =
    eventService
      .getEvents()
      .find(e => e.id === activeEvent?.id)
    || activeEvent;

  const progressFromService =
    progressService.getProgress(
      freshActiveEvent
    );




  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 
      selection:text-slate-950 antialiased overflow-x-hidden flex flex-col justify-between font-mono">
 
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
          <CrewRequestCenter 
           currentProfileId={currentProfile?.id}
          />
        </div>
      )}
        {/* ========================================================================= */}
        {/* MAIN ROUTER PORT                                                          */}
        {/* ========================================================================= */}
        <main className="w-full pt-13 min-h-screen bg-[#070913] text-white">
 
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
              setView={setView}
            />
          )}
 
          {view === 'login' && !isLoggedIn && (
            <LoginRegisterMask 
              isRegisteringInitial={view === 'register'}
              onLoginSuccess={(profile) => {
                setCurrentProfile(profile);
                localStorage.setItem(
                  'gigsda_user_name',
                  profile.name
                );
                localStorage.setItem(
                  'gigsda_logged_in',
                  'true'
                );
                setIsLoggedIn(true);
                setTicketName(
                  profile.name
                );
                setView('userProfile');
              }}
            />

          )}
 
          {/* 📑 GAST-WEICHE 1: WAS IST GIGSDA? */}
          {view === 'whatIsGigsda' && (
            <WhatIsGigsda setView={setView} />
          )}
          
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
                setActiveGuestArtist(
                  artistView.name
                );
                setActiveGuestProfileId(
                  artistView.id
                );
                localStorage.setItem(
                  'gigsda_active_guest_artist',
                  artistView.name
                );
                localStorage.setItem(
                  'gigsda_active_guest_profile_id',
                  artistView.id
                );
                setView('profile');
              }}
            />
          )}

          {/* 🔍 KÜNSTLER-RADAR FÜR EINGELOGGTE USER (DATENLEITUNG KORRIGIERT) */}
          {view === 'radar' && isLoggedIn && (
            <SearchExplorer 
              onBack={() => setView('projects')} 
              setFavorites={(artistView) => {
                setActiveGuestArtist(
                  artistView.name
                );
                setActiveGuestProfileId(
                  artistView.id
                );
                localStorage.setItem(
                  'gigsda_active_guest_artist',
                  artistView.name
                );
                localStorage.setItem(
                  'gigsda_active_guest_profile_id',
                  artistView.id
                );
                setView('profile');
              }}
            />
          )}

          {/* ========================================================================= */}
          {/* 🏟️ INTERAKTIVE 10-WEGE ROLLER-WEICHE: GAST                               */}
          {/* ========================================================================= */}
          {view === 'profile' && activeGuestArtist && (
            (() => {

              if (!guestProfile) {
                return (
                  <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-purple-400 animate-pulse">
                    // GIGSDA CORE INITIALISIERT PROFILMATRIX...
                  </div>
                );
              }

              if (guestProfile?.role === 'Location') {
                return (
                  <LocationProfile
                    currentProfileId={activeGuestProfileId}
                    onNavigate={setView}
                  />
                );
              }

              else if (guestProfile?.role === 'Fan') {
                return (
                  <FanProfile
                    currentProfileId={activeGuestProfileId}
                    onNavigate={setView}
                  />
                );
              }

              else if (
                guestProfile?.role === 'Material' ||
                guestProfile?.role === 'Verleiher'
              ) {
                return (
                  <VerleiherProfile
                    currentProfileId={activeGuestProfileId}
                    onNavigate={setView}
                  />
                );
              }

              else if (guestProfile?.role === 'Techniker') {
                return (
                  <TechnikerProfile
                    currentProfileId={activeGuestProfileId}
                    onNavigate={setView}
                  />
                );
              }

              else if (guestProfile?.role === 'Catering') {
                return (
                  <CaterProfile
                    currentProfileId={activeGuestProfileId}
                    onNavigate={setView}
                  />
                );
              }

              else if (guestProfile?.role === 'Veranstalter') {
                return (
                  <VeranstalterProfile
                    currentProfileId={activeGuestProfileId}
                    onNavigate={setView}
                  />
                );
              }

              else if (guestProfile?.role === 'Logistik') {
                return (
                  <LogistikProfile
                    currentProfileId={activeGuestProfileId}
                    onNavigate={setView}
                  />
                );
              }

              else if (guestProfile?.role === 'Security') {
                return (
                  <SecurityProfile
                    currentProfileId={activeGuestProfileId}
                    onNavigate={setView}
                  />
                );
              }

              else if (
                guestProfile?.role === 'Design' ||
                guestProfile?.role === 'Deko'
              ) {
                return (
                  <DesignProfile
                    currentProfileId={activeGuestProfileId}
                    onNavigate={setView}
                  />
                );
              }

              return (
                <UserProfile
                  currentProfileId={activeGuestProfileId}
                  onBack={() => setView('radar')}
                  isOwner={false}
                  setView={setView}
                />
              );

            })()
          )}

          {/* ========================================================================= */}
          {/* 🏟️ INTERAKTIVE 10-WEGE ROLLER-WEICHE: ROLLEN                             */}
          {/* ========================================================================= */}
          {view === 'userProfile' && isLoggedIn && (
            (() => {

              if (!currentProfile) {
                return (
                  <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-purple-400 animate-pulse">
                    // GIGSDA CORE INITIALISIERT PROFILMATRIX...
                  </div>
                );
              }

              if (currentProfile.role === 'Location') {
                return (
                  <LocationProfile
                    currentProfileId={currentProfile?.id}
                    onNavigate={setView}
                  />
                );
              }

              else if (currentProfile.role === 'Fan') {
                return (
                  <FanProfile
                    currentProfileId={currentProfile?.id}
                    onNavigate={setView}
                  />
                );
              }

              else if (
                currentProfile.role === 'Material' ||
                currentProfile.role === 'Verleiher'
              ) {
                return (
                  <VerleiherProfile
                    currentProfileId={currentProfile?.id}
                    onNavigate={setView}
                  />
                );
              }

              else if (currentProfile.role === 'Techniker') {
                return (
                  <TechnikerProfile
                    currentProfileId={currentProfile?.id}
                    onNavigate={setView}
                  />
                );
              }

              else if (currentProfile.role === 'Catering') {
                return (
                  <CaterProfile
                    currentProfileId={currentProfile?.id}
                    onNavigate={setView}
                  />
                );
              }

              else if (currentProfile.role === 'Veranstalter') {
                return (
                  <VeranstalterProfile
                    currentProfileId={currentProfile?.id}
                    onNavigate={setView}
                  />
                );
              }

              else if (currentProfile.role === 'Logistik') {
                return (
                  <LogistikProfile
                    currentProfileId={currentProfile?.id}
                    onNavigate={setView}
                  />
                );
              }

              else if (currentProfile.role === 'Security') {
                return (
                  <SecurityProfile
                    currentProfileId={currentProfile?.id}
                    onNavigate={setView}
                  />
                );
              }

              else if (
                currentProfile.role === 'Design' ||
                currentProfile.role === 'Deko'
              ) {
                return (
                  <DesignProfile
                    currentProfileId={currentProfile?.id}
                    onNavigate={setView}
                  />
                );
              }

              return (
                <UserProfile
                  currentProfileId={currentProfile?.id}
                  onBack={() => setView('projects')}
                  isOwner={true}
                  setView={setView}
                />
              );

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
              onNavigateToStep={setView}
              progress={progress}
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
                  const savedEvents = eventService.getEvents();
                  
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
                localStorage.setItem('gigsda_active_guest_artist', artistView);
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
            <CrewShortlist
              onBack={() => setView('projects')}
              progress={progressFromService}
              setProgress={setProgress}
              activeEvent={freshActiveEvent}
              onNavigateToStep={setView}
              setFavorites={handleUpdateCrewForEvent}
            />
          )}
 
          {view === 'stage' && isLoggedIn && (
            <StageSpecs
              onBack={() => setView('shortlist')}
              progress={progressFromService}
              setProgress={setProgress}
              activeEvent={freshActiveEvent}
              onNavigateToStep={setView}
              onApproveSuccess={() => setProgress(prev => ({ ...prev, stage: 100 }))
              }
            />
          )}
 
          {view === 'contract' && isLoggedIn && (
            <ContractCenter 
              onBack={() => setView('projects')} 
              progress={progressFromService} 
              setProgress={setProgress} 
              activeEvent={freshActiveEvent} 
              onNavigateToStep={setView} 
              onContractSigned={() => setProgress(prev => ({ ...prev, contract: 100 }))} 
            />
          )}
 
          {view === 'voting' && isLoggedIn && (
            <TeamVoting 
              onBack={() => setView('projects')} 
              activeEvent={freshActiveEvent} 
              onNavigateToStep={setView} 
              onVoteSuccess={() => setProgress(prev => ({ ...prev, voting: 100 }))} 
            />
          )}
 
          {view === 'planner' && isLoggedIn && (
            <EventPlanner 
              onBack={() => setView('projects')} 
              progress={progressFromService}
              setProgress={setProgress} 
              activeEvent={freshActiveEvent}
              onNavigateToStep={setView} 
              onStepSuccess={() => setProgress(prev => ({ ...prev, planner: 100 }))} 
            />
          )}
 
          {view === 'countdown' && isLoggedIn && (
            <LiveCountdown 
              onBack={() => setView('projects')} 
              progress={progressFromService}
              activeEvent={freshActiveEvent}
              onNavigateToStep={setView} 
              setProgress={setProgress} onTriggerGate={triggerGate} 
            />
          )}
 
          {view === 'promotion' && isLoggedIn && (
            <EventPromotion
              onBack={() => setView('planner')}
              progress={progressFromService}
              setProgress={setProgress}
              activeEvent={freshActiveEvent}
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
                setActiveGuestArtist(
                  artistView.name
                );
                setActiveGuestProfileId(
                  artistView.id
                );
                localStorage.setItem(
                  'gigsda_active_guest_artist',
                  artistView.name
                );
                localStorage.setItem(
                  'gigsda_active_guest_profile_id',
                  artistView.id
                );
                setView('profile');
              }}
            />
          )}

          {/* DIE UNIVERSELLE GIGSDA B2B MATRIXSUCHE IN APP.JSX */}
          {view === 'artists' && (
            <UniversalSearchPage
              onNavigate={(name) => {
                setActiveGuestArtist(name);
                localStorage.setItem(
                  'gigsda_active_guest_artist',
                  name
                );
                setView('profile');
              }}
              setView={setView}
            />
          )}

          {view === "artistPortfolio" && (
            <ArtistPortfolio
              setView={setView}
            />
          )}

          {view === "gigsdaPass" && (
            <GigsdaPass 
              setView={setView}
            />
          )}
          {view === "passPrint" && (
            <PassPrintPage />
          )}

          {view === 'pricing' && (
            <PricingPage
              setView={setView}
            />
          )}


          {view === 'billing' && (
            <BillingCenter />
          )}

          {/* ========================================================================= */}
          {/* FOOTER UNTERSEITEN                                                        */}
          {/* ========================================================================= */}

          {view === 'terms' && (
            <TermsPage setView={setView} />
          )}
          {view === 'privacy' && (
            <PrivacyPage setView={setView} />
          )}
          {view === 'impressum' && (
            <ImpressumPage setView={setView} />
          )}
          {view === 'agb' && (
            <AGBPage setView={setView} />
          )}
          {/* ========================================================================= */}
          {view === 'eventlocation' && (
            <EventsLocationsPage setView={setView} />
          )}
          {view === 'searchprotocol' && (
            <SearchProtocolPage setView={setView} />
          )}
          {view === 'tutorial' && (
            <OnboardingTutorial setView={setView} />
          )}
          {/* ========================================================================= */}
          {view === 'security' && (
            <SecurityPage setView={setView} />
          )}
          {view === 'payment' && (
            <PaymentMethodsPage setView={setView} />
          )}
          {view === 'escrowprotection' && (
            <EscrowProtectionPage setView={setView} />
          )}
          {view === 'faq' && (
            <FAQPage setView={setView} />
          )}
          

          {view === 'about' && (
            <AboutGigsda setView={setView} />
          )}

          {view === 'contact' && (
            <ContactPage setView={setView} />
          )}
 
          {view === 'career' && (
            <CareerPage setView={setView} />
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
      {communityAlert && (
        <CommunityAlertModal
          message={communityAlert}
          onClose={() =>
            setCommunityAlert(null)
          }
        />
      )}

      
    </div>
  );
}

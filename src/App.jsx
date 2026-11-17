import { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import LoginRegisterMask from './LoginRegisterMask';
import ResetPasswordPage from "./pages/ResetPasswordPage";

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

import CalendarPage from './CalendarPage';

import GuestProjectsPage from './GuestProjectsPage';

import UniversalSearchPage from './components/UniversalSearchPage';

import Footer from "./Footer";

import TermsPage from './pages/info/TermsPage.jsx';
import PrivacyPage from './pages/info/PrivacyPage.jsx';
import ImpressumPage from './pages/info/ImpressumPage.jsx';
import AGBPage from './pages/info/AGBPage.jsx';
import DSAContactPage from './pages/info/DSAContactPage.jsx';

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
import Roadmap from './pages/info/Roadmap.jsx';


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

import CrewFavoritenListe from './CrewFavoritenListe'; // ⭐ Schaltet die Favoriten-Matrix frei!
import RiderZentrale from './RiderZentrale'; // 🎛️ Schaltet das geteilte B2B-Rider-Uhrwerk plattformweit frei!
import CommunityChat from './CommunityChat';

import { initialUsers, initialProfiles } from './data/mockData';
import PortfolioRouter from './components/portfolio/PortfolioRouter';
import SheetRouter from './components/sheets/SheetRouter';
import { getRoleSheet } from './components/sheets/roleSheetMap';

import GigsdaPass from "./components/GigsdaPass";


import PassPrintPage from './components/prints/PassPrintPage';
import PassChallengePage from "./pages/PassChallengePage";
import ChallengePrintPage from "./components/prints/ChallengePrintPage";

import { eventService } from './services/eventService';
import { progressService } from './services/progressService';

import CommunityAlertModal from './components/modals/CommunityAlertModal';
import {
  createProfile,
  getCrewRequests,
  getProfileById,
  getPublicProfiles
} from './services/apiService';

import PricingPage from './PricingPage';
import BillingCenter from './components/BillingCenter';

import BudgetPlanner from './components/BudgetPlanner';
import MediaLibraryPage from './components/MediaLibraryPage';
import ProjectWorkspace from './experimental/workspace/ProjectWorkspace.jsx';
import StagePlannerTest from './pages/StagePlannerTest.jsx';






const PATH_VIEWS = {
  '/events': 'guestEvents',
  '/portfolios': 'radar',
  '/calendar': 'calendar',
  '/workspace-test': 'workspaceTest',
  '/stage-planner-test': 'stagePlannerTest',
  '/impressum': 'impressum',
  '/datenschutz': 'privacy',
  '/agb': 'agb',
  '/dsa': 'dsa'
};

const VIEW_PATHS = {
  landing: '/',
  guestEvents: '/events',
  radar: '/portfolios',
  calendar: '/calendar',
  workspaceTest: '/workspace-test',
  stagePlannerTest: '/stage-planner-test',
  impressum: '/impressum',
  privacy: '/datenschutz',
  agb: '/agb',
  dsa: '/dsa'
};

const normalizePath = (path) =>
  path.length > 1 ? path.replace(/\/+$/, '') : path;

const getPortfolioIdFromPath = (path) => {
  const match = normalizePath(path).match(/^\/portfolio\/([^/]+)$/);
  if (!match) return null;

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
};

const getSheetIdFromPath = (path) => {
  const match = normalizePath(path).match(/^\/sheet\/([^/]+)$/);
  if (!match) return null;

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
};



export default function App() {
  return <GigsdaApp />;
}

function GigsdaApp() {

  const challengeId =
    new URLSearchParams(window.location.search)
      .get("challenge");

  const printChallengeId =
    new URLSearchParams(window.location.search)
      .get("printChallenge");
    if (printChallengeId) {
      return (
        <ChallengePrintPage
          challengeId={printChallengeId}
        />
      );
    }

  const [resetToken] = useState(
    () => new URLSearchParams(window.location.search).get('resetToken')
  );

  // 📡 REAKTIVER CREW-ALARM EMPFÄNGER
  const [hasPendingRequests, setHasPendingRequests] = useState(false);
  const [eventLinkError, setEventLinkError] = useState('');
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
        if (new URLSearchParams(window.location.search).get('event')) return;

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
  const [sheetProfile, setSheetProfile] = useState(null);
  const [sheetProfileError, setSheetProfileError] = useState(false);
  useEffect(() => {
    let cancelled = false;
    if (currentProfile?.id) return;

    const session = JSON.parse(
      localStorage.getItem("gigsda_session") || "null"
    );
    if (!session?.profileId) return;
    const restoredProfileId = String(session.profileId);
    const loadSessionProfile = async () => {
      try {
        const profileResult = await getProfileById(
          restoredProfileId
        );
        const loadedProfile =
          profileResult?.profile;

        const latestSession = JSON.parse(
          localStorage.getItem("gigsda_session") || "null"
        );
        if (
          cancelled ||
          String(latestSession?.profileId || '') !== restoredProfileId
        ) {
          return;
        }

        if (!loadedProfile || String(loadedProfile.id) !== restoredProfileId) {
          console.error(
            "SESSION PROFILE LOAD ERROR: Wiederhergestellte Profil-ID stimmt nicht überein.",
            restoredProfileId
          );
          return;
        }

        setCurrentProfile(
          loadedProfile
        );
        localStorage.setItem(
          "gigsda_session",
          JSON.stringify({
            ...latestSession,
            profileId: restoredProfileId
          })
        );
        localStorage.setItem(
          "gigsda_profile_id",
          restoredProfileId
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
        if (!cancelled) {
          console.error(
            "SESSION PROFILE LOAD ERROR",
            e
          );
        }
      }
    };

    loadSessionProfile();
    return () => {
      cancelled = true;
    };
  }, [currentProfile]);
  
  // 🛰️ EIGENE LEITUNG FÜR DEN GAST-SUCHER (VERGISS JEDE ANDERE VARIABLE!)

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
      setGuestProfile(null);

      const guestProfileId =
        localStorage.getItem(
          'gigsda_active_guest_profile_id'
        );

      if (!guestProfileId) return;

      try {

        const profiles = await getPublicProfiles();
        const profile = profiles.find(
          p => p && p.id === guestProfileId
        );

        if (profile) {
          setGuestProfile(
            profile
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
    setGuestProfile(null);
    const profiles =
      await getPublicProfiles();
    const found = profiles.find(
      p => p && p.id === portfolioId
    );
    if (found) {

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
      setView('portfolioRouter');
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
  const [view, setViewWithStorage] = useState(() => {
    const sheetId = getSheetIdFromPath(window.location.pathname);
    if (sheetId) {
      localStorage.setItem('gigsda_sheet_profile', sheetId);
      return 'sheetRouter';
    }

    const portfolioId = getPortfolioIdFromPath(window.location.pathname);
    if (portfolioId) {
      localStorage.setItem('gigsda_portfolio_profile', portfolioId);
      return 'portfolioRouter';
    }

    return (
      PATH_VIEWS[normalizePath(window.location.pathname)] ||
      localStorage.getItem('gigsda_current_view') ||
      'landing'
    );
  });

  const setView = (newView) => {
    localStorage.setItem('gigsda_current_view', newView);
    const portfolioId = localStorage.getItem('gigsda_portfolio_profile');
    const sheetId = localStorage.getItem('gigsda_sheet_profile');
    const path =
      newView === 'portfolioRouter' && portfolioId
        ? `/portfolio/${encodeURIComponent(portfolioId)}`
        : newView === 'sheetRouter' && sheetId
          ? `/sheet/${encodeURIComponent(sheetId)}`
        : VIEW_PATHS[newView] || '/';
    if (
      window.location.pathname !== path ||
      window.history.state?.view !== newView
    ) {
      window.history.pushState({ view: newView }, '', path);
    }
    setViewWithStorage(newView);
  };

  useEffect(() => {
    if (view !== 'sheetRouter') return;

    let cancelled = false;
    const profileId =
      getSheetIdFromPath(window.location.pathname) ||
      localStorage.getItem('gigsda_sheet_profile');
    setSheetProfile(null);
    setSheetProfileError(false);

    if (!profileId) {
      setSheetProfileError(true);
      return;
    }

    const loadSheetProfile = async () => {
      try {
        const result = await getProfileById(profileId);
        const row = result?.profile;
        if (!row || String(row.id) !== String(profileId)) {
          throw new Error('Das Profil für das Sheet wurde nicht gefunden.');
        }

        const profileData = row.profile_json
          ? JSON.parse(row.profile_json)
          : {};
        const loadedProfile = {
          ...row,
          ...profileData,
          id: row.id,
          role: row.role || profileData.role,
          type: row.type || profileData.type
        };
        delete loadedProfile.profile_json;

        if (!cancelled) setSheetProfile(loadedProfile);
      } catch (error) {
        console.error('SHEET PROFILE LOAD ERROR', error);
        if (!cancelled) setSheetProfileError(true);
      }
    };

    loadSheetProfile();
    return () => {
      cancelled = true;
    };
  }, [view]);


  const openSheet = (profileId) => {
    localStorage.setItem('gigsda_sheet_profile', profileId);
    setView('sheetRouter');
  };

  const openPortfolio = (profileId) => {
    localStorage.setItem('gigsda_portfolio_profile', profileId);
    setView('portfolioRouter');
  };

  const openProfile = (profileId) => {
    setActiveGuestProfileId(profileId);

    localStorage.setItem('gigsda_active_guest_profile_id',profileId);
    setView('profile');
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
    const linkedEventId =
      new URLSearchParams(window.location.search).get('event');
    if (!linkedEventId) return;

    const loadLinkedEvent = async () => {
      const loadedEvents = await eventService.syncFromDb();
      const linkedEvent = loadedEvents.find(event =>
        [event.id, event.eventId, event._id]
          .some(id => id != null && String(id) === linkedEventId)
      );

      if (!linkedEvent) {
        setEventLinkError('Event nicht gefunden');
        return;
      }

      setEvents(loadedEvents);
      setActiveEvent(linkedEvent);
      localStorage.setItem('gigsda_current_view', 'guestEvents');
      setViewWithStorage('guestEvents');
      localStorage.setItem(
        'gigsda_active_event',
        JSON.stringify({
          id: linkedEvent.id || linkedEvent.eventId || linkedEvent._id,
          title: linkedEvent.title || linkedEvent.name || ''
        })
      );
    };

    loadLinkedEvent();
  }, []);



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


  // Keep browser back/forward navigation in sync with the active view.
  useEffect(() => {
    const handlePopState = (event) => {
      const sheetId = getSheetIdFromPath(window.location.pathname);
      if (sheetId) {
        localStorage.setItem('gigsda_sheet_profile', sheetId);
      }

      const portfolioId = getPortfolioIdFromPath(window.location.pathname);
      if (portfolioId) {
        localStorage.setItem('gigsda_portfolio_profile', portfolioId);
      }

      const nextView = sheetId
        ? 'sheetRouter'
        : portfolioId
          ? 'portfolioRouter'
        : event.state?.view ||
          PATH_VIEWS[normalizePath(window.location.pathname)] ||
          'landing';
      localStorage.setItem('gigsda_current_view', nextView);
      setViewWithStorage(nextView);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
 
  // 📡 DER FEHLENDE LOGIN-EMPFÄNGER
  const handleLoginUser = (profile) => {
    const profileId = String(profile.id);
    const session = JSON.parse(
      localStorage.getItem("gigsda_session") || "null"
    );

    localStorage.setItem('gigsda_profile_id', profileId);
    localStorage.setItem(
      'gigsda_session',
      JSON.stringify({
        ...session,
        profileId
      })
    );
    localStorage.setItem('gigsda_user_name', profile.name);
    localStorage.setItem('gigsda_logged_in', 'true');

    setCurrentProfile(profile);
    setTicketName(profile.name);
    setIsLoggedIn(true);
    setView('userProfile');
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

  const isStandaloneSheetRoute =
    view === 'sheetRouter' &&
    Boolean(getSheetIdFromPath(window.location.pathname));
  const isSheetPrintRoute =
    isStandaloneSheetRoute &&
    new URLSearchParams(window.location.search).get('print') === '1';
  const isPortfolioPrintRoute =
    view === 'portfolioRouter' &&
    Boolean(getPortfolioIdFromPath(window.location.pathname)) &&
    new URLSearchParams(window.location.search).get('print') === '1';



useEffect(() => {
  if (resetToken) {
    setView("resetPassword");
  }
}, [resetToken]);





  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 
      selection:text-slate-950 antialiased overflow-x-hidden flex flex-col justify-between font-mono">
 
      {/* BACKGROUND GLOW */}
      {!isSheetPrintRoute && !isPortfolioPrintRoute && (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-20%] w-[60%] aspect-square rounded-full bg-purple-900/10 blur-[120px]" />
          <div className="absolute top-[20%] right-[-20%] w-[50%] aspect-square rounded-full bg-cyan-900/10 blur-[120px]" />
        </div>
      )}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-between">
 
        {/* ========================================================================= */}
        {/* NAVIGATIONSMENÜ & LOGO-HEADER                                             */}
        {/* ========================================================================= */}
        {/* 🌌 TEMPORÄRER VERGLEICHS-HEADER: KOMPLETT FLACH UND TIEFSCHWARZ OHNE NEON-RAHMEN */}
        {!isStandaloneSheetRoute && !isPortfolioPrintRoute && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0b0f19] border-b border-slate-900/60 shadow-lg font-mono">
          <div className="w-full bg-[#0b0f19]/95 backdrop-blur-md rounded-b-[14px]">
            {/* 🚨 DANIELS ORIGINALER ZENTRIER-CONTAINER: REPARIERT DAS LAYOUT DER RESTLICHEN SEITE! */}
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
              
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
                  src="/logos/gigsda-logo-2.svg" 
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
        )}


        {/* ========================================================================= */}
        {/* MAIN ROUTER PORT                                                          */}
        {/* ========================================================================= */}
        <main className={`w-full ${isStandaloneSheetRoute || isPortfolioPrintRoute ? '' : 'pt-13'} min-h-screen bg-[#070913] text-white`}>
          {eventLinkError && (
            <p role="alert" className="mx-auto max-w-4xl px-6 py-4 text-red-300">
              {eventLinkError}
            </p>
          )}
 
          {printChallengeId ? (

            <ChallengePrintPage />
          ) : challengeId ? (

            <PassChallengePage
              challengeId={challengeId}
            />

          ) : (
            <>


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
              onLoginSuccess={handleLoginUser}
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
              directEventId={new URLSearchParams(window.location.search).get('event')}
            />
          )}

          {/* 📁 GAST-PROJEKTE ROUTE */}
          {view === 'guestProjects' && (
            <GuestProjectsPage
              setView={setView}
            />
          )}

          {/* 🔍 GAST-SUCHER (REPARIERT) */}
          {view === 'radar' && !isLoggedIn && (
            <SearchExplorer 
              onBack={() => setView('landing')} 
              onOpenProfile={openProfile}
              onOpenPortfolio={openPortfolio}
              setFavorites={(profileId) => {

                setActiveGuestProfileId(profileId);

                localStorage.setItem(
                  'gigsda_active_guest_profile_id',
                  profileId
                );

                setView('profile');
              }}
            />
          )}

          {/* 🔍 KÜNSTLER-RADAR FÜR EINGELOGGTE USER (DATENLEITUNG KORRIGIERT) */}
          {view === 'radar' && isLoggedIn && (
            <SearchExplorer 
              onBack={() => setView('projects')} 
              onOpenProfile={openProfile}
              onOpenPortfolio={openPortfolio}
              setFavorites={(artistView) => {

                setActiveGuestProfileId(
                  artistView.id
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
          {view === 'profile' && activeGuestProfileId && (
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
                    setView={setView}
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
                    setView={setView}
                  />
                );
              }

              else if (currentProfile.role === 'Fan') {
                return (
                  <FanProfile
                    currentProfileId={currentProfile?.id}
                    setView={setView}
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
                    setView={setView}
                  />
                );
              }

              else if (currentProfile.role === 'Techniker') {
                return (
                  <TechnikerProfile
                    currentProfileId={currentProfile?.id}
                    setView={setView}
                  />
                );
              }

              else if (currentProfile.role === 'Catering') {
                return (
                  <CaterProfile
                    currentProfileId={currentProfile?.id}
                    setView={setView}
                  />
                );
              }

              else if (currentProfile.role === 'Veranstalter') {
                return (
                  <VeranstalterProfile
                    currentProfileId={currentProfile?.id}
                    setView={setView}
                  />
                );
              }

              else if (currentProfile.role === 'Logistik') {
                return (
                  <LogistikProfile
                    currentProfileId={currentProfile?.id}
                    setView={setView}
                  />
                );
              }

              else if (currentProfile.role === 'Security') {
                return (
                  <SecurityProfile
                    currentProfileId={currentProfile?.id}
                    setView={setView}
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
                    setView={setView}
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

          {view === 'mediaLibrary' && isLoggedIn && (
            <MediaLibraryPage />
          )}

          {view === 'workspaceTest' && (
            <ProjectWorkspace />
          )}
 
          {view === 'stagePlannerTest' && (
            <StagePlannerTest />
          )}

          {view === 'projects' && isLoggedIn && (
            <ProjectDashboard
              onNavigateToStep={setView}
              progress={progress}
              onSelectEvent={setActiveEvent}
              setView={setView}
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
              setFavorites={(profileId) => {

                setActiveGuestProfileId(profileId);

                localStorage.setItem(
                  'gigsda_active_guest_profile_id',
                  profileId
                );

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
              onOpenProfile={openProfile}
              onOpenPortfolio={openPortfolio}
              isGuest={!isLoggedIn} 
              onTriggerGate={triggerGate} 
              favorites={activeEvent ? (events.find(e => e.id === activeEvent.id)?.crewIds || []) : []} 
              
              // ⚡ DIE RETTUNG: Wenn im Sucher handleProfileClick feuert, 
              // beamen wir den User direkt auf das schreibgeschützte Portfolio!
              setFavorites={(artistView) => {
                setActiveGuestProfileId(
                  artistView.id
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

                // TODO:
                // UniversalSearch auf Profile-ID migrieren

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

          {view === 'sheetRouter' && (
            sheetProfile ? (
              (() => {
                const SheetComponent = getRoleSheet(
                  sheetProfile.role || sheetProfile.type
                );

                return SheetComponent ? (
                  <SheetRouter
                    profile={sheetProfile}
                    SheetComponent={SheetComponent}
                    roleLabel={sheetProfile.role || sheetProfile.type || 'Profil'}
                    printMode={isSheetPrintRoute}
                    backLabel="Zurück zum Profil"
                    onBack={() =>
                      setView(
                        localStorage.getItem('gigsda_sheet_return_view') ||
                          'userProfile'
                      )
                    }
                    setView={setView}
                  />
                ) : (
                  <div className="min-h-[50vh] bg-slate-900 px-4 py-12">
                    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center text-slate-300">
                      Für diese Profilrolle ist kein Sheet verfügbar.
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="min-h-[50vh] flex items-center justify-center px-4">
                <div className="max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center shadow-xl">
                  <h1 className="text-xl font-bold text-white">
                    {sheetProfileError
                      ? 'Profil konnte nicht geladen werden'
                      : 'Profil wird geladen'}
                  </h1>
                  {sheetProfileError && (
                    <button
                      type="button"
                      onClick={() =>
                        setView(
                          localStorage.getItem('gigsda_sheet_return_view') ||
                            'userProfile'
                        )
                      }
                      className="mt-6 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-5 py-2.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
                    >
                      Zurück zum Profil
                    </button>
                  )}
                </div>
              </div>
            )
          )}

          {view === 'portfolioRouter' && (
            <PortfolioRouter
              onBack={() => setView('radar')}
              setView={setView}
              printMode={isPortfolioPrintRoute}
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

          {view === 'budgetplanner' && (
            <BudgetPlanner
              setView={setView}
              currentProfileId={currentProfile?.id}
            />
          )}
          
          {view === 'calendar' && (
            <CalendarPage
              setView={setView}
              currentProfileId={currentProfile?.id}
              currentProfileType={currentProfile?.role}
              isGuest={!currentProfile?.id}
            />
          )}

          {view === "resetPassword" && (
            <ResetPasswordPage
              resetToken={resetToken}
              onLogin={() => {
                const url = new URL(window.location.href);
                url.searchParams.delete('resetToken');
                window.history.replaceState({}, '', url);
                setView('login');
              }}
            />
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
          {view === 'dsa' && (
            <DSAContactPage />
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
 
          {view === 'roadmap' && (
            <Roadmap setView={setView} />
          )}
</>
)}

        </main>
 

        {!isStandaloneSheetRoute && !isPortfolioPrintRoute && <Footer setView={setView} />}


        {/* ========================================================================= */}
        {/* FOOTER                                                                    */}
        {/* ========================================================================= */}
        {!isStandaloneSheetRoute && !isPortfolioPrintRoute && (
        <footer className="w-full border-t border-slate-900/60 bg-slate-950 py-3 text-center text-xm text-slate-600 mt-12">
          GIGSDA PROTOCOL V1.0 // OPERATOR: 
          <span className="text-cyan-400 font-bold"> {ticketName} </span> 
        </footer>
        )}
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

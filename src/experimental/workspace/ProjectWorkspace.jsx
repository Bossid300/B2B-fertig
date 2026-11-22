import { useEffect, useMemo, useState } from 'react';
import { getEvents, getFavorites, getPublicProfiles, saveEvent } from '../../services/apiService.js';
import { eventService } from '../../services/eventService.js';
import WorkspaceCanvas from './WorkspaceCanvas.jsx';
import WorkspaceDetailsPanel from './components/WorkspaceDetailsPanel.jsx';
import EventInfoBlock from './components/EventInfoBlock.jsx';
import WorkspaceTabContainer from './WorkspaceTabContainer.jsx';
import PortfolioRouter from '../../components/portfolio/PortfolioRouter.jsx';
import SheetRouter from '../../components/sheets/SheetRouter.jsx';
import CreateEventForm from '../../CreateEventForm.jsx';
import EventPromotion from '../../EventPromotion.jsx';
import './workspace.css';

import UserProfile from '../../UserProfile.jsx';
import LocationProfile from '../../LocationProfile.jsx';
import VerleiherProfile from '../../VerleiherProfile.jsx';
import TechnikerProfile from '../../TechnikerProfile.jsx';
import CaterProfile from '../../CaterProfile.jsx';
import VeranstalterProfile from '../../VeranstalterProfile.jsx';
import LogistikProfile from '../../LogistikProfile.jsx';
import SecurityProfile from '../../SecurityProfile.jsx';
import DesignProfile from '../../DesignProfile.jsx';
import FanProfile from '../../FanProfile.jsx';

const ignorePromotionProgress = () => {};

function parseProfile(profile) {
  if (!profile?.profile_json) return profile || {};

  try {
    const data = typeof profile.profile_json === 'string'
      ? JSON.parse(profile.profile_json)
      : profile.profile_json;
    return { ...profile, ...(data || {}), id: profile.id };
  } catch (error) {
    console.error('Workspace: Profilinformationen konnten nicht gelesen werden.', error);
    return profile;
  }
}

function readActiveEvent() {
  try {
    return JSON.parse(localStorage.getItem('gigsda_active_event') || 'null');
  } catch (error) {
    console.error('Workspace: Aktives Event konnte nicht ausgelesen werden.', error);
    return null;
  }
}

function getProfileEventStatus(profile, activeEvent, favoriteIds) {
  const profileId = String(profile.id);
  const crewMember = (activeEvent?.crew || []).find(
    (member) => member?.id != null && String(member.id) === profileId
  );
  const memberStatus = String(crewMember?.status || '').trim().toLowerCase();

  // Abgesagt
  if (['rejected', 'abgesagt', 'declined', 'cancelled'].includes(memberStatus)) {
    return 'Abgesagt';
  }

  // Bestätigt
  if (
    crewMember?.confirmed === true ||
    ['accepted', 'confirmed', 'gebucht'].includes(memberStatus) ||
    activeEvent?.acceptedDeals?.[profileId] === true
  ) {
    return 'Bestätigt';
  }

  // In Verhandlung
  if (
    ['counter_offer', 'gegenangebot', 'negotiation', 'in_verhandlung'].includes(memberStatus)
  ) {
    return 'In Verhandlung';
  }

  // Angefragt
  if (['pending', 'angefragt', 'requested'].includes(memberStatus)) {
    return 'Angefragt';
  }

  // Interessant (Default für Crew)
  return 'Interessant';
}

function getDrawerStatusIndicator(profiles, profileStatuses) {
  if (!profiles || profiles.length === 0) return 'gray';
  
  let hasRed = false;    // Offene Einträge
  let hasYellow = false; // Laufende Vorgänge

  for (const profile of profiles) {
    const status = profileStatuses?.get(String(profile.id)) || 'Nicht zugeordnet';
    
    // ROT: Offene Einträge (Nicht zugeordnet, Favorit, Interessant)
    if (['Nicht zugeordnet', 'Favorit', 'Interessant'].includes(status)) {
      hasRed = true;
    }
    // GELB: Laufende Vorgänge (Angefragt, In Verhandlung)
    else if (['Angefragt', 'In Verhandlung', 'Gegenangebot', 'Pending'].includes(status)) {
      hasYellow = true;
    }
    // GRÜN: Bestätigt (bleibt grün)
  }

  // Schlechtester Status gewinnt
  if (hasRed) return 'red';
  if (hasYellow) return 'yellow';
  return 'green';
}



export default function ProjectWorkspace({
  onOpenProfile,
  onOpenPortfolio
}) {
  const [profiles, setProfiles] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [activeEventRef, setActiveEventRef] = useState(() => readActiveEvent());
  const [openSheetProfile, setOpenSheetProfile] = useState(null);
  const [openPortfolioProfile, setOpenPortfolioProfile] = useState(null);
  const [openProfileModal, setOpenProfileModal] = useState(null);
  const [openEventCreation, setOpenEventCreation] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('events');
  const [promotionEventId, setPromotionEventId] = useState(null);
  const [promotionCheckTarget, setPromotionCheckTarget] = useState(null);
  const [promotionPreviewTarget, setPromotionPreviewTarget] = useState(null);

  useEffect(() => {
    // Höre auf Änderungen in localStorage (für externe Updates)
    const handleStorageChange = () => {
      setActiveEventRef(readActiveEvent());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const profileId = localStorage.getItem('gigsda_profile_id');

    async function loadWorkspaceData() {
      try {
        const [publicProfiles, eventList, favorites] = await Promise.all([
          getPublicProfiles(),
          getEvents(),
          profileId ? getFavorites(profileId) : Promise.resolve([])
        ]);

        if (cancelled) return;
        setProfiles(publicProfiles.map(parseProfile));
        setEvents(eventList);
        setFavoriteIds(favorites.map((item) => String(item.favorite_profile_id)));
      } catch (error) {
        console.error('Workspace: Daten konnten nicht geladen werden.', error);
        if (!cancelled) setLoadError('Die Workspace-Daten konnten nicht geladen werden.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadWorkspaceData();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeEvent = useMemo(() => {
    if (!activeEventRef?.id) return null;
    return events.find((event) =>
      [event.id, event.eventId, event._id]
        .some((id) => id != null && String(id) === String(activeEventRef.id))
    ) || null;
  }, [activeEventRef, events]);

  const favorites = useMemo(() => {
    const favoriteIdSet = new Set(favoriteIds);
    return profiles.filter((profile) => favoriteIdSet.has(String(profile.id)));
  }, [favoriteIds, profiles]);

  const crew = useMemo(() => {
    const crewIdSet = new Set((activeEvent?.crewIds || []).map(String));
    return profiles.filter((profile) => crewIdSet.has(String(profile.id)));
  }, [activeEvent, profiles]);

  const profileStatuses = useMemo(() => new Map(
    profiles.map((profile) => [
      String(profile.id),
      getProfileEventStatus(profile, activeEvent, favoriteIds)
    ])
  ), [activeEvent, favoriteIds, profiles]);

  const eventTitle =
    activeEvent?.title ||
    activeEvent?.name ||
    activeEventRef?.title ||
    'Kein aktives Event ausgewählt';

  const drawerStatus = useMemo(() => {
    const allProfiles = [...profiles];
    return getDrawerStatusIndicator(allProfiles, profileStatuses);
  }, [profiles, profileStatuses]);

  const handleEventSelect = (event) => {
    console.log('Event Details anzeigen:', event.title || event.id);
    setSelectedEvent(event);
    setSelectedProfile(null);
    setSelectedCardId(null);
  };

  const handleProfileSelect = (profile) => {
    console.log('Profil Details anzeigen:', profile.name || profile.id);
    setSelectedProfile(profile);
    setSelectedEvent(null);
    setSelectedCardId(null);
  };

  const handleEventOpen = (event) => {
    console.log('Event öffnen:', event.title || event.id);
    localStorage.setItem('gigsda_active_event', JSON.stringify(event));
    setActiveEventRef(event);
    setSelectedEvent(event);
  };

  const handleSheetOpen = (profile) => {
    console.log('Sheet öffnen für:', profile.name);
    setOpenSheetProfile(profile);
  };

  const handleProfileOpen = (profile) => {
      setOpenProfileModal(profile);
  };
  
  const handlePortfolioOpen = (profile) => {
    console.log('Portfolio öffnen für:', profile.name);
    setOpenPortfolioProfile(profile);
  };

  const handleEventCreate = () => {
    setEditingEvent(null);
    setOpenEventCreation(true);
  };

  const handleEventEdit = (event) => {
    setEditingEvent(event);
    setOpenEventCreation(true);
  };

  const handleEventCreationClose = () => {
    setOpenEventCreation(false);
    setEditingEvent(null);
  };

  const handleTabChange = (tab) => {
    if (tab === 'promotion' && activeEvent && String(promotionEventId) !== String(activeEvent.id)) {
      try {
        const cachedEvents = eventService.getEvents();
        eventService.saveEvents(cachedEvents.some((item) => String(item.id) === String(activeEvent.id))
          ? cachedEvents.map((item) => String(item.id) === String(activeEvent.id) ? activeEvent : item)
          : [activeEvent, ...cachedEvents]);
        setPromotionEventId(activeEvent.id);
      } catch (error) {
        console.error('Workspace: Promotion konnte nicht geöffnet werden.', error);
        window.alert('Die Promotion konnte nicht geöffnet werden. Bitte versuche es erneut.');
        return;
      }
    }
    setActiveTab(tab);
  };

  const handlePromotionSaved = (event) => {
    setEvents((current) => current.map((item) =>
      String(item.id) === String(event.id) ? event : item
    ));
    setSelectedEvent((current) =>
      current && String(current.id) === String(event.id) ? event : current
    );
    const currentActiveEvent = readActiveEvent();
    if (currentActiveEvent && String(currentActiveEvent.id) === String(event.id)) {
      localStorage.setItem('gigsda_active_event', JSON.stringify(event));
      setActiveEventRef(event);
    }
  };

  const handleEventSave = async (event) => {
    const updatedEvent = { ...event, updatedAt: Date.now() };
    const cachedEvents = eventService.getEvents();
    const result = await saveEvent({ ...updatedEvent, updateOnly: true });
    if (!result.success) {
      throw new Error(result.error || 'Das Event konnte nicht gespeichert werden.');
    }

    setEvents((current) => current.map((item) =>
      String(item.id) === String(updatedEvent.id) ? updatedEvent : item
    ));
    setSelectedEvent(updatedEvent);
    eventService.saveEvents(cachedEvents.some((item) => String(item.id) === String(updatedEvent.id))
      ? cachedEvents.map((item) => String(item.id) === String(updatedEvent.id) ? updatedEvent : item)
      : [updatedEvent, ...cachedEvents]);
    if (activeEventRef && String(activeEventRef.id) === String(updatedEvent.id)) {
      localStorage.setItem('gigsda_active_event', JSON.stringify(updatedEvent));
      setActiveEventRef(updatedEvent);
    }
    handleEventCreationClose();
  };

  return (
    <div className="workspace-app mt-2">
      <WorkspaceTabContainer
        events={events}
        loading={loading}
        loadError={loadError}
        onEventSelect={handleEventSelect}
        onProfileSelect={handleProfileSelect}
        activeEvent={activeEventRef}
        profiles={profiles}
        favoriteIds={favoriteIds}
        profileStatuses={profileStatuses}
        onCreateEvent={handleEventCreate}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        promotionCheckRef={setPromotionCheckTarget}
      />
      <div className="workspace-main">
        <header className="workspace-header">
          <EventInfoBlock event={activeEvent} crew={crew} profiles={profiles} />
        </header>
        <div className="workspace-workbench">
          <WorkspaceCanvas
            activeEvent={activeEvent}
            profiles={profiles}
            selectedCardId={selectedCardId}
            profileStatuses={profileStatuses}
            onProfileSelect={(profile, cardId) => {
              setSelectedProfile(profile);
              setSelectedCardId(cardId);
            }}
            onEventOpen={handleEventOpen}
            hidden={activeTab === 'promotion'}
          />
          {activeEvent && String(activeEvent.id) === String(promotionEventId) && (
            <div className="workspace-promotion-container" style={{ display: activeTab === 'promotion' ? undefined : 'none' }}>
              <EventPromotion
                key={activeEvent.id}
                activeEvent={activeEvent}
                workspace
                setProgress={ignorePromotionProgress}
                onPromotionSaved={handlePromotionSaved}
                promotionCheckTarget={promotionCheckTarget}
                promotionPreviewTarget={promotionPreviewTarget}
              />
            </div>
          )}
          {activeTab !== 'promotion' && (
            <WorkspaceDetailsPanel 
              profile={selectedProfile} 
              event={selectedEvent}
              showEventPreview={activeTab === 'events'}
              onEventEdit={handleEventEdit}
              onSheetOpen={handleSheetOpen}
              onPortfolioOpen={handlePortfolioOpen}
              onProfileOpen={handleProfileOpen}
              allProfiles={profiles}
            />
          )}
          <aside
            ref={setPromotionPreviewTarget}
            className="workspace-details"
            style={{ display: activeTab === 'promotion' ? undefined : 'none' }}
            aria-label="Promotion-Vorschau"
          />
        </div>
      </div>

      {openSheetProfile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'auto'
        }}>
          <div style={{
            position: 'relative',
            width: '90%',
            maxHeight: '90vh',
            backgroundColor: 'transparent'
          }}>
            <button
              onClick={() => setOpenSheetProfile(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: 0,
                backgroundColor: 'transparent',
                border: 'none',
                color: '#67e8f9',
                fontSize: '28px',
                cursor: 'pointer',
                zIndex: 1001
              }}
            >
              ✕
            </button>
            <SheetRouter 
              profile={openSheetProfile.profile} 
              SheetComponent={openSheetProfile.SheetComponent}
              roleLabel={openSheetProfile.roleLabel}
              onBack={() => setOpenSheetProfile(null)}
            />
          </div>
        </div>
      )}

      {openPortfolioProfile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'auto'
        }}>
          <div style={{
            position: 'relative',
            width: '90%',
            maxHeight: '90vh',
            backgroundColor: 'transparent'
          }}>
            <button
              onClick={() => setOpenPortfolioProfile(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: 0,
                backgroundColor: 'transparent',
                border: 'none',
                color: '#67e8f9',
                fontSize: '28px',
                cursor: 'pointer',
                zIndex: 1001
              }}
            >
              ✕
            </button>
            <PortfolioRouter 
              profileId={openPortfolioProfile.id} 
              onBack={() => setOpenPortfolioProfile(null)}
            />
          </div>
        </div>
      )}

      {openEventCreation && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'auto'
        }}>
          <div style={{
            position: 'relative',
            width: '90%',
            maxHeight: '90vh',
            backgroundColor: 'transparent'
          }}>
            <button
              onClick={handleEventCreationClose}
              style={{
                position: 'absolute',
                top: '-40px',
                right: 0,
                backgroundColor: 'transparent',
                border: 'none',
                color: '#67e8f9',
                fontSize: '28px',
                cursor: 'pointer',
                zIndex: 1001
              }}
            >
              ✕
            </button>
            <CreateEventForm 
              event={editingEvent}
              onBack={handleEventCreationClose}
              onSaveEvent={handleEventSave}
              onCreateEvent={(newEvent) => {
                handleEventCreationClose();
                // Reload events
                getEvents().then(data => setEvents(data || [])).catch(() => {});
              }}
            />
          </div>
        </div>
      )}

      {openProfileModal && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-6">

          <button
            onClick={() => setOpenProfileModal(null)}
            className="absolute top-4 right-4 z-[10000] bg-slate-900 border border-cyan-500/30 rounded-full w-10 h-10"
          >
            ✕
          </button>

          <div className="w-full h-full max-w-6xl overflow-auto rounded-2xl">
            {(() => {
              const profileProps = {
                currentProfileId: openProfileModal.id,
                isOwner: false,
                onBack: () => setOpenProfileModal(null)
              };

              if (openProfileModal.role === 'Location') {
                return <LocationProfile {...profileProps} />;
              }

              if (openProfileModal.role === 'Fan') {
                return <FanProfile {...profileProps} />;
              }

              if (
                openProfileModal.role === 'Material' ||
                openProfileModal.role === 'Verleiher'
              ) {
                return <VerleiherProfile {...profileProps} />;
              }

              if (openProfileModal.role === 'Techniker') {
                return <TechnikerProfile {...profileProps} />;
              }

              if (openProfileModal.role === 'Catering') {
                return <CaterProfile {...profileProps} />;
              }

              if (openProfileModal.role === 'Veranstalter') {
                return <VeranstalterProfile {...profileProps} />;
              }

              if (openProfileModal.role === 'Logistik') {
                return <LogistikProfile {...profileProps} />;
              }

              if (openProfileModal.role === 'Security') {
                return <SecurityProfile {...profileProps} />;
              }

              if (
                openProfileModal.role === 'Design' ||
                openProfileModal.role === 'Deko'
              ) {
                return <DesignProfile {...profileProps} />;
              }

              return <UserProfile {...profileProps} />;
            })()}
          </div>

        </div>
      )}
    </div>
  );
}

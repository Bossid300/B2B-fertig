import { useEffect, useMemo, useState } from 'react';
import { getEvents, getFavorites, getPublicProfiles } from '../../services/apiService.js';
import WorkspaceCanvas from './WorkspaceCanvas.jsx';
import WorkspaceDetailsPanel from './components/WorkspaceDetailsPanel.jsx';
import EventInfoBlock from './components/EventInfoBlock.jsx';
import WorkspaceDrawer from './WorkspaceDrawer.jsx';
import './workspace.css';

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

export default function ProjectWorkspace() {
  const [activeEventRef] = useState(readActiveEvent);
  const [profiles, setProfiles] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [drawerCollapsed, setDrawerCollapsed] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);

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

  return (
    <div className="workspace-app">
      <WorkspaceDrawer
        collapsed={drawerCollapsed}
        onToggle={() => setDrawerCollapsed((value) => !value)}
        favorites={favorites}
        profiles={profiles}
        crew={crew}
        loading={loading}
        loadError={loadError}
        hasActiveEvent={Boolean(activeEvent)}
        profileStatuses={profileStatuses}
        drawerStatus={drawerStatus}
        onProfileSelect={(profile) => {
          setSelectedProfile(profile);
          setSelectedCardId(null);
        }}
      />
      <div className="workspace-main">
        <header className="workspace-header">
          <div>
            <p className="workspace-eyebrow">GIGSDA · EXPERIMENT</p>
            <h1>Projekt Workspace</h1>
          </div>
          <EventInfoBlock event={activeEvent} crew={crew} profiles={profiles} />
        </header>
        <div className="workspace-workbench">
          <WorkspaceCanvas
            activeEvent={activeEvent}
            selectedCardId={selectedCardId}
            profileStatuses={profileStatuses}
            onProfileSelect={(profile, cardId) => {
              setSelectedProfile(profile);
              setSelectedCardId(cardId);
            }}
          />
          <WorkspaceDetailsPanel profile={selectedProfile} />
        </div>
      </div>
    </div>
  );
}

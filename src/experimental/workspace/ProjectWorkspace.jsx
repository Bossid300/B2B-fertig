import { useEffect, useMemo, useState } from 'react';
import { getEvents, getFavorites, getPublicProfiles } from '../../services/apiService.js';
import WorkspaceCanvas from './WorkspaceCanvas.jsx';
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

export default function ProjectWorkspace() {
  const [activeEventRef] = useState(readActiveEvent);
  const [profiles, setProfiles] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [drawerCollapsed, setDrawerCollapsed] = useState(false);

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

  const eventTitle =
    activeEvent?.title ||
    activeEvent?.name ||
    activeEventRef?.title ||
    'Kein aktives Event ausgewählt';

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
      />
      <div className="workspace-main">
        <header className="workspace-header">
          <div>
            <p className="workspace-eyebrow">GIGSDA · EXPERIMENT</p>
            <h1>Projekt Workspace</h1>
          </div>
          <div className="workspace-event">
            <span>EVENT</span>
            <strong>{eventTitle}</strong>
          </div>
        </header>
        <WorkspaceCanvas />
      </div>
    </div>
  );
}

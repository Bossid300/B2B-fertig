import { useMemo, useState } from 'react';
import { Heart, Search, Users } from 'lucide-react';

const CREW_TABS = [
  { id: 'favorites', label: 'Favoriten', Icon: Heart },
  { id: 'search', label: 'Suche', Icon: Search },
  { id: 'crew', label: 'Crew', Icon: Users }
];

function profileName(profile) {
  return profile.name || profile.display_name || profile.user_name || profile.project_name || 'Unbenanntes Profil';
}

function profileCategory(profile) {
  return profile.role || profile.type || profile.gewerk || 'Kategorie nicht angegeben';
}

function getStatusIndicator(profile, profileStatuses) {
  const statusMap = profileStatuses || new Map();
  const status = statusMap instanceof Map 
    ? statusMap.get(String(profile.id))
    : statusMap[String(profile.id)];
  
  const normalizedStatus = status || 'Nicht zugeordnet';
  // ROT: Offene Einträge
  if (['Nicht zugeordnet', 'Favorit', 'Interessant'].includes(normalizedStatus)) return 'red';
  // GELB: Laufende Vorgänge
  if (['Angefragt', 'In Verhandlung', 'Gegenangebot', 'Pending'].includes(normalizedStatus)) return 'yellow';

  if (['Zusage'].includes(normalizedStatus)) return 'yellow';
  
  // GRÜN: Bestätigt
  if (['Bestätigt', 'Gebucht'].includes(normalizedStatus)) return 'green';
  return 'gray';
}

function getCrewStatusGroup(profile, profileStatuses) {
  const statusMap = profileStatuses || new Map();
  const status = statusMap instanceof Map
    ? statusMap.get(String(profile.id))
    : statusMap[String(profile.id)];
  
  const normalizedStatus = status || 'Nicht zugeordnet';
  if (['Zusage'].includes(normalizedStatus)) return 'Zusage';
  if (['Bestätigt', 'Gebucht'].includes(normalizedStatus)) return 'Bestätigt';
  if (['In Verhandlung', 'Gegenangebot'].includes(normalizedStatus)) return 'Verhandlung';
  if (['Angefragt', 'Pending'].includes(normalizedStatus)) return 'Angefragt';
  if (['Nicht benötigt', 'Removed'].includes(normalizedStatus)) return 'Nicht benötigt';
  return 'Interessant';
}

export default function CrewTab({
  activeEvent,
  profiles = [],
  requests = [],
  favoriteIds = [],
  profileStatuses = {},
  onProfileSelect
}) {
  const [activeTabLocal, setActiveTabLocal] = useState('crew');
  const [search, setSearch] = useState('');

  if (!activeEvent) return null;

  // Konvertiere favoriteIds zu Map für Kompatibilität
  const favoritesMap = new Map(favoriteIds.map(id => [String(id), true]));

  // Hole Favoriten und Crew aus Profilen
  const favorites = profiles.filter(profile => {
      if (!favoritesMap.has(String(profile.id))) {
          return false;
      }

      const status = profileStatuses?.get(String(profile.id));

      return ![
          'Angefragt',
          'Verhandlung',
          'Zusage',
          'Bestätigt'
      ].includes(status);
  });
  const crew = (activeEvent.crew || [])
      .map(crewMember => {
          const profile = profiles.find(
              p => String(p.id) === String(crewMember.id)
          );

          return profile || crewMember;
      })
      .filter(Boolean);

  const eventRequests = requests.filter(
      r => String(r.eventId) === String(activeEvent?.id)
  );

  const requestProfiles = eventRequests
      .map(request =>
          profiles.find(
              p => String(p.id) === String(request.requestedProfileId)
          )
      )
      .filter(Boolean);

  const uniqueRequestProfiles = Array.from(
    new Map(
        requestProfiles.map(profile => [
            String(profile.id),
            profile
        ])
    ).values()
  );

  const crewIds = new Set(
      crew.map(profile => String(profile.id))
  );

  const combinedCrew = [
      ...crew,
      ...uniqueRequestProfiles.filter(
          profile => !crewIds.has(String(profile.id))
      )
  ];       

  const visibleProfiles = useMemo(() => {
    const source = activeTabLocal === 'favorites'
      ? favorites
      : activeTabLocal === 'crew'
        ? combinedCrew
        : profiles;
    const term = search.trim().toLocaleLowerCase();
    if (activeTabLocal !== 'search' || !term) return source;

    return source.filter((profile) =>
      [profileName(profile), profileCategory(profile), profile.city, profile.ort]
        .filter(Boolean)
        .some((value) => String(value).toLocaleLowerCase().includes(term))
    );
  }, [activeTabLocal, combinedCrew, favorites, profiles, search]);

  return (
    <div className="workspace-tab-panel workspace-crew-panel">
      <nav className="workspace-tabs" aria-label="Crew Bereiche">
        {CREW_TABS.map(({ id, label, Icon }) => (
          <button
            type="button"
            key={id}
            className={`workspace-tab${activeTabLocal === id ? ' is-active' : ''}`}
            onClick={() => setActiveTabLocal(id)}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {activeTabLocal === 'search' && (
        <label className="workspace-search">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Profile durchsuchen"
            aria-label="Profile durchsuchen"
          />
        </label>
      )}

      <p className="workspace-drawer__hint">
        {activeTabLocal === 'search'
          ? 'Öffentliche Profile · zum Ablegen ziehen'
          : 'Karte auf die Arbeitsfläche ziehen'}
      </p>

      <div className="workspace-profile-list">
        {/* CREW TAB: Mit Gruppierung */}
        {activeTabLocal === 'crew' && visibleProfiles.length > 0 && (
          <div className="workspace-profile-groups">
            {['Interessant', 'Angefragt', 'Verhandlung', 'Zusage', 'Bestätigt', 'Nicht benötigt'].map((groupName) => {
              const groupProfiles = visibleProfiles.filter(p => getCrewStatusGroup(p, profileStatuses) === groupName);
              if (groupProfiles.length === 0) return null;

              return (
                <div key={groupName} className="workspace-profile-group">
                  <h4 className="workspace-profile-group__title">{groupName}</h4>
                  {groupProfiles.map((profile) => (
                    <button
                      type="button"
                      className="workspace-source-card"
                      key={profile.id}
                      draggable
                      onClick={() => onProfileSelect?.(profile)}
                      onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = 'copyMove';
                        event.dataTransfer.setData('application/x-gigsda-workspace', JSON.stringify({
                          type: 'profile',
                          profile
                        }));
                      }}
                    >
                      <div className="workspace-source-card__wrapper">
                        {profile.avatarMediaUrl || profile.avatarUrl ? (
                          <img
                            className="workspace-source-card__avatar"
                            src={profile.avatarMediaUrl || profile.avatarUrl}
                            alt=""
                          />
                        ) : (
                          <span className="workspace-source-card__avatar workspace-source-card__avatar--empty">
                            {profileName(profile).slice(0, 1).toUpperCase()}
                          </span>
                        )}
                        <span className="workspace-source-card__text">
                          <strong>{profileName(profile)}</strong>
                          <span>{profileCategory(profile)}</span>
                        </span>
                      </div>
                      <span 
                        className={`workspace-source-card__status workspace-source-card__status--${getStatusIndicator(profile, profileStatuses)}`} 
                      />
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* FAVORITEN & SUCHE TAB: Ohne Gruppierung, ohne Statuspunkte */}
        {(activeTabLocal === 'favorites' || activeTabLocal === 'search') && visibleProfiles.length > 0 && (
          <div>
            {visibleProfiles.map((profile) => (
              <button
                type="button"
                className="workspace-source-card"
                key={profile.id}
                draggable
                onClick={() => onProfileSelect?.(profile)}
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = 'copyMove';
                  event.dataTransfer.setData('application/x-gigsda-workspace', JSON.stringify({
                    type: 'profile',
                    profile
                  }));
                }}
              >
                <div className="workspace-source-card__wrapper">
                  {profile.avatarMediaUrl || profile.avatarUrl ? (
                    <img
                      className="workspace-source-card__avatar"
                      src={profile.avatarMediaUrl || profile.avatarUrl}
                      alt=""
                    />
                  ) : (
                    <span className="workspace-source-card__avatar workspace-source-card__avatar--empty">
                      {profileName(profile).slice(0, 1).toUpperCase()}
                    </span>
                  )}
                  <span className="workspace-source-card__text">
                    <strong>{profileName(profile)}</strong>
                    <span>{profileCategory(profile)}</span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {visibleProfiles.length === 0 && (
          <p className="workspace-empty">
            {activeTabLocal === 'favorites'
              ? 'Keine Favoriten gefunden.'
              : activeTabLocal === 'crew'
                ? 'Für dieses Event ist keine Crew hinterlegt.'
                : activeTabLocal === 'search'
                  ? 'Keine passenden Profile gefunden.'
                  : 'Keine Profile verfügbar.'}
          </p>
        )}
      </div>
    </div>
  );
}


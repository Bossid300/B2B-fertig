import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Search, Users } from 'lucide-react';

const TABS = [
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
  const status = profileStatuses?.get(String(profile.id)) || 'Nicht zugeordnet';
  
  // ROT: Offene Einträge
  if (['Nicht zugeordnet', 'Favorit', 'Interessant'].includes(status)) return 'red';
  
  // GELB: Laufende Vorgänge
  if (['Angefragt', 'In Verhandlung', 'Gegenangebot', 'Pending'].includes(status)) return 'yellow';
  
  // GRÜN: Bestätigt
  if (['Bestätigt', 'Gebucht'].includes(status)) return 'green';
  
  return 'gray';
}

function getCrewStatusGroup(profile, profileStatuses) {
  const status = profileStatuses?.get(String(profile.id)) || 'Nicht zugeordnet';
  
  if (['Bestätigt', 'Gebucht'].includes(status)) return 'Bestätigt';
  if (['In Verhandlung', 'Gegenangebot'].includes(status)) return 'Verhandlung';
  if (['Angefragt', 'Pending'].includes(status)) return 'Angefragt';
  return 'Interessant';
}

export default function WorkspaceDrawer({
  collapsed,
  onToggle,
  favorites,
  profiles,
  crew,
  loading,
  loadError,
  hasActiveEvent,
  profileStatuses,
  drawerStatus,
  onProfileSelect
}) {
  const [activeTab, setActiveTab] = useState('favorites');
  const [search, setSearch] = useState('');

  const visibleProfiles = useMemo(() => {
    const source = activeTab === 'favorites'
      ? favorites
      : activeTab === 'crew'
        ? crew
        : profiles;
    const term = search.trim().toLocaleLowerCase();
    if (activeTab !== 'search' || !term) return source;

    return source.filter((profile) =>
      [profileName(profile), profileCategory(profile), profile.city, profile.ort]
        .filter(Boolean)
        .some((value) => String(value).toLocaleLowerCase().includes(term))
    );
  }, [activeTab, crew, favorites, profiles, search]);

  return (
    <aside className={`workspace-drawer${collapsed ? ' is-collapsed' : ''}`}>
      <div className="workspace-drawer__top">
        {!collapsed && <span className="workspace-drawer__title">SCHUBLADE</span>}
        <button
          type="button"
          className="workspace-icon-button"
          onClick={onToggle}
          aria-label={collapsed ? 'Schublade öffnen' : 'Schublade einklappen'}
          title={collapsed ? 'Schublade öffnen' : 'Schublade einklappen'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        <span className={`workspace-drawer__status workspace-drawer__status--${drawerStatus}`} title={`Status: ${drawerStatus}`} />
      </div>

      {!collapsed && (
        <>
          <nav className="workspace-tabs" aria-label="Schubladenbereiche">
            {TABS.map(({ id, label, Icon }) => (
              <button
                type="button"
                key={id}
                className={`workspace-tab${activeTab === id ? ' is-active' : ''}`}
                onClick={() => setActiveTab(id)}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          {activeTab === 'search' && (
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
            {activeTab === 'search'
              ? 'Öffentliche Profile · zum Ablegen ziehen'
              : 'Karte auf die Arbeitsfläche ziehen'}
          </p>

          <div className="workspace-profile-list">
            {loading && <p className="workspace-empty">Daten werden geladen …</p>}
            {!loading && loadError && <p className="workspace-error" role="alert">{loadError}</p>}
            {!loading && !loadError && activeTab === 'crew' && !hasActiveEvent && (
              <p className="workspace-empty">Kein aktives Event ausgewählt.</p>
            )}

            {/* CREW TAB: Mit Gruppierung */}
            {!loading && !loadError && activeTab === 'crew' && visibleProfiles.length > 0 && (
              <div className="workspace-profile-groups">
                {['Interessant', 'Angefragt', 'Verhandlung', 'Bestätigt'].map((groupName) => {
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
                          <span className={`workspace-source-card__status workspace-source-card__status--${getStatusIndicator(profile, profileStatuses)}`} />
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}

            {/* FAVORITEN & SUCHE TAB: Ohne Gruppierung, ohne Statuspunkte */}
            {!loading && !loadError && (activeTab === 'favorites' || activeTab === 'search') && visibleProfiles.length > 0 && (
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

            {!loading && !loadError && visibleProfiles.length === 0 && (
              <p className="workspace-empty">
                {activeTab === 'favorites'
                  ? 'Keine Favoriten gefunden.'
                  : activeTab === 'crew' && hasActiveEvent
                    ? 'Für dieses Event ist keine Crew hinterlegt.'
                    : activeTab === 'search'
                      ? 'Keine passenden Profile gefunden.'
                      : 'Keine Profile verfügbar.'}
              </p>
            )}
          </div>
        </>
      )}
    </aside>
  );
}

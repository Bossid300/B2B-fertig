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

export default function WorkspaceDrawer({
  collapsed,
  onToggle,
  favorites,
  profiles,
  crew,
  loading,
  loadError,
  hasActiveEvent
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
            {!loading && !loadError && visibleProfiles.map((profile) => (
              <button
                type="button"
                className="workspace-source-card"
                key={profile.id}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = 'copyMove';
                  event.dataTransfer.setData('application/x-gigsda-workspace', JSON.stringify({
                    type: 'profile',
                    profile
                  }));
                }}
              >
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
              </button>
            ))}
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

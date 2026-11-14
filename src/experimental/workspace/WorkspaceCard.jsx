function profileName(profile) {
  return profile.name || profile.display_name || profile.user_name || profile.project_name || 'Unbenanntes Profil';
}

export default function WorkspaceCard({ profile, style, onDragStart }) {
  const category = profile.role || profile.type || profile.gewerk || 'Kategorie nicht angegeben';
  const status = profile.status || profile.availability || profile.verfuegbarkeit || 'Nicht angegeben';
  const avatar = profile.avatarMediaUrl || profile.avatarUrl;

  return (
    <article
      className="workspace-card"
      style={style}
      draggable
      onDragStart={onDragStart}
      aria-label={`${profileName(profile)} auf der Arbeitsfläche`}
    >
      <div className="workspace-card__accent" />
      <div className="workspace-card__identity">
        {avatar ? (
          <img className="workspace-card__avatar" src={avatar} alt="" />
        ) : (
          <span className="workspace-card__avatar workspace-card__avatar--empty">
            {profileName(profile).slice(0, 1).toUpperCase()}
          </span>
        )}
        <div>
          <h2>{profileName(profile)}</h2>
          <p>{category}</p>
        </div>
      </div>
      <div className="workspace-card__status">
        <span />
        Status: {status}
      </div>
      <p className="workspace-card__drag-hint">Ziehen zum Verschieben</p>
    </article>
  );
}

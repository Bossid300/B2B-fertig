function profileName(profile) {
  return profile.name || profile.display_name || profile.user_name || profile.project_name || 'Unbenanntes Profil';
}

function canDeleteCard(status) {
  // Nur "Interessant" Status darf gelöscht werden
  return status === 'Interessant';
}

export default function WorkspaceCard({ 
  profile, 
  status, 
  eventTitle, 
  selected, 
  style, 
  onClick, 
  onDragStart, 
  onDelete 
}) {
  const category = profile.role || profile.type || profile.gewerk || 'Kategorie nicht angegeben';
  const avatar = profile.avatarMediaUrl || profile.avatarUrl;
  const isDeletable = canDeleteCard(status);

  return (
    <article
      className={`workspace-card ${selected ? 'is-selected' : ''}`}
      style={style}
      draggable
      onClick={onClick}
      onDragStart={onDragStart}
      aria-label={`${profileName(profile)} auf der Arbeitsfläche`}
    >
      <div className="workspace-card__accent" />
      
      {isDeletable && (
        <button
          className="workspace-card__delete"
          onClick={(event) => {
            event.stopPropagation();
            onDelete?.();
          }}
          title="Karte entfernen"
          aria-label="Karte entfernen"
        >
          ✕
        </button>
      )}
      
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
<span
  className={`workspace-source-card__status workspace-source-card__status--${
    status === 'Bestätigt'
      ? 'green'
      : ['Angefragt', 'Verhandlung', 'Zusage'].includes(status)
        ? 'yellow'
        : 'red'
  }`}
/>
        Status: {status}
      </div>
      {eventTitle && (
        <div className="workspace-card__event">
          <span className="workspace-card__event-label">Event</span>
          <span className="workspace-card__event-value">{eventTitle}</span>
        </div>
      )}
      <p className="workspace-card__drag-hint">Ziehen zum Verschieben</p>
    </article>
  );
}

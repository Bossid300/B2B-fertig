import PortfolioRouter from '../../../components/portfolio/PortfolioRouter';
import SheetRouter from '../../../components/sheets/SheetRouter';
import { getRoleSheet } from '../../../components/sheets/roleSheetMap';
import EventCard from '../../../components/cards/EventCard.jsx';
import ProfileCard from '../../../components/cards/ProfileCard';
import { saveCrewRequest } from '../../../services/apiService';

function profileName(profile) {
  return profile.name || profile.display_name || profile.user_name || profile.project_name || 'Unbenanntes Profil';
}

function getCrewMemberNames(event, allProfiles = []) {
  if (!event?.crew || event.crew.length === 0) return 'Keine Crew';
  
  const crewMembers = event.crew.map(member => {
    if (typeof member === 'string') {
      const profile = allProfiles.find(p => String(p.id) === String(member));
      return profile ? profileName(profile) : `Profil ${member}`;
    }
    return member.name || profileName(member);
  });
  
  return crewMembers.join(', ');
}

export default function WorkspaceDetailsPanel({ 
  profile, 
  event,
  workspaceStatus,
  onAddToCrew,
  onNotNeeded,
  onEventEdit,
  onSheetOpen,
  onPortfolioOpen,
  onProfileOpen,
  showEventPreview = false,
  allProfiles = [] 
}) {

  const ACTIONS = ['DETAILS', 'SHEET', 'PORTFOLIO', 'CHAT'];

  if (workspaceStatus === 'Interessant') {
      ACTIONS.push('ANFRAGE');
      ACTIONS.push('FAVORIT');
  }

  if (workspaceStatus === 'Zusage') {
      ACTIONS.push('IN CREW');
      ACTIONS.push('NICHT BENÖTIGT');
  }

  // FALLBACK: Wenn kein Profil und kein Event: leer
  if (!profile && !event) {
    return (
      <aside className="workspace-details" aria-label="Projektmappe">
        <div className="workspace-details__empty">
          <span className="workspace-details__empty-icon" aria-hidden="true">+</span>
          <h2>Objekt auswählen</h2>
          <p>Klicke eine Karte auf dem Workspace an, um die Detailmappe zu öffnen.</p>
        </div>
      </aside>
    );
  }


  // PRIORITÄT: Wenn Profil ausgewählt ist, zeige Profil-Details
  if (profile) {
    const name = profileName(profile);
    const category = profile.role || profile.type || profile.gewerk || 'Nicht angegeben';
    const location = profile.city || profile.ort || profile.location || profile.standort || 'Nicht angegeben';
    const status = profile.status || profile.availability || profile.verfuegbarkeit || 'Nicht angegeben';
    const description =
      profile.short_description ||
      profile.shortDescription ||
      profile.bio ||
      profile.description ||
      profile.about ||
      'Keine Kurzbeschreibung vorhanden.';
    const avatar = profile.avatarMediaUrl || profile.avatarUrl;

    const handleSheetClick = () => {
      const role = String(category).trim().toLowerCase();
      const SheetComponent = getRoleSheet(role);
      onSheetOpen?.({ profile, SheetComponent, roleLabel: category });
    };

    const handlePortfolioClick = () => {
      onPortfolioOpen?.(profile);
    };

    const handleProfileClick = () => {
        onProfileOpen?.(profile);
    }

    const handleActionClick = async (action) => {
      if (action === 'IN CREW') {
          onAddToCrew?.(profile);
          return;
      }
      if (action === 'NICHT BENÖTIGT') {
          onNotNeeded?.(profile);
          return;
      }
      if (action === 'SHEET') {
        handleSheetClick();
      } else if (action === 'PORTFOLIO') {
        handlePortfolioClick();
      } else if (action === 'DETAILS') {
        handleProfileClick();
      } else if (action === 'ANFRAGE') {
          if (!event || !profile) return;
          const requesterProfileId =
              localStorage.getItem('gigsda_profile_id') || '';
          const requesterProfileName =
              localStorage.getItem('gigsda_user_name') || 'Veranstalter';
          const now = Date.now();
          const newRequest = {
              requestId: 'REQ-' + Math.floor(Math.random() * 9000 + 1000),
              eventId: event.id,
              eventName: event.title,
              date: event.date || 'Termin auf Anfrage',
              requestedProfileId: profile.id,
              requestedProfileName: profile.name,
              requestedProfileRole:
                  profile.role ||
                  profile.type ||
                  profile.gewerk ||
                  'Crew',
              requestedProfileCity:
                  profile.city ||
                  profile.ort ||
                  '',
              requesterProfileId,
              requesterProfileName,
              requesterName: requesterProfileName,
              status: 'pending',
              note: `Hallo ${profile.name},
              wir möchten dich gerne für unser Event "${event.title}" anfragen.
              Rolle: ${profile.role || profile.type || profile.gewerk || 'Crew'}
              Viele Grüße
              ${requesterProfileName}`,
              source: 'workspace',
              createdAt: now,
              updatedAt: now
          };
          await saveCrewRequest(newRequest);
          alert(`Anfrage an ${profile.name} gesendet`);
      }
    };

    return (
      <>
        <aside className="workspace-details" aria-label={`Projektmappe: ${name}`}>
          
          <header className="workspace-details__header">
            <div>
              <p className="workspace-details__eyebrow">PROJEKT WORKSPACE</p>
              <h2>DETAILMAPPE</h2>
            </div>
            <span className="workspace-details__file-mark" aria-hidden="true">01</span>
          </header>
          <ProfileCard
            user={profile}
            isGuest={false}
            onProfile={() => handleActionClick('DETAILS')}
            onPortfolio={() => handleActionClick('PORTFOLIO')}
            onRequest={() => handleActionClick('ANFRAGE')}
          />
          <div className="workspace-details__content">
            <div className="workspace-details__identity">
              {avatar ? (
                <img className="workspace-details__avatar" src={avatar} alt="" />
              ) : (
                <span className="workspace-details__avatar workspace-details__avatar--empty">
                  {name.slice(0, 1).toUpperCase()}
                </span>
              )}
              <div>
                <h3>{name}</h3>
                <p>{category}</p>
              </div>
            </div>

            <dl className="workspace-details__facts">
              <div>
                <dt>Kategorie</dt>
                <dd>{category}</dd>
              </div>
              <div>
                <dt>Standort</dt>
                <dd>{location}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd><span className="workspace-details__status-dot" />{status}</dd>
              </div>
            </dl>

            <section className="workspace-details__description">
              <h4>KURZBESCHREIBUNG</h4>
              <p>{description}</p>
            </section>

            <section className="workspace-details__actions">
              <h4>AKTIONEN</h4>
              <div className="workspace-details__action-grid">
                {ACTIONS.map((action) => (
                  <button
                    type="button"
                    key={action}
                    onClick={() => handleActionClick(action)}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </aside>
      </>
    );
  }

  // FALLBACK: Wenn nur Event ausgewählt ist, zeige Event-Details
  if (event) {
    const eventName = event.title || 'Unbenanntes Event';
    const eventDate = event.date ? new Date(event.date).toLocaleDateString('de-DE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : 'Kein Datum';
    const eventLocation = event.location || event.city || 'Kein Ort';
    const eventOwner = event.owner || event.organizer || 'Nicht angegeben';
    const eventStatus = event.status || 'Geplant';
    const eventCrew = getCrewMemberNames(event, allProfiles);
    const eventDescription = event.description || event.info || 'Keine Beschreibung vorhanden.';
    const promo = event.promotionData || {};
    const promoLocation = [
      promo.venueName,
      promo.street,
      [promo.zip, promo.city].filter(Boolean).join(' ')
    ].filter(Boolean).join(', ');
    const cardEvent = {
      ...event,
      title: promo.title || event.title,
      category: promo.category || event.category || event.type || event.event_type,
      shortDescription: promo.shortDescription,
      description: promo.description || event.description,
      slide1_url: promo.promoImage || event.slide1_url,
      entryTime: promo.entryTime,
      startTime: promo.startTime,
      endTime: promo.endTime,
      ticketPrice: promo.ticketPrice,
      ticketStatus: promo.ticketStatus,
      fsk: promo.fsk,
      lineup: promo.lineup,
      amenities: promo.amenities,
      city: promoLocation || event.venue || event.location || event.city || ''
    };

    return (
      <aside className="workspace-details" aria-label={`Projektmappe: ${eventName}`}>
        <header className="workspace-details__header">
          <div>
            <p className="workspace-details__eyebrow">EVENT DETAILS</p>
            <h2>{eventName}</h2>
          </div>
          <span className="workspace-details__file-mark" aria-hidden="true">📅</span>
        </header>

        <div className="workspace-details__content">
          {showEventPreview && (
            <section className="workspace-promotion__preview mb-4" aria-label="Eventvorschau">
              <EventCard key={event.id} event={cardEvent} />
            </section>
          )}
          <div className="workspace-details__event-info">
            <div className="workspace-details__info-row">
              <label>Datum</label>
              <span>{eventDate}</span>
            </div>
            <div className="workspace-details__info-row">
              <label>Ort</label>
              <span>{eventLocation}</span>
            </div>
            <div className="workspace-details__info-row">
              <label>Veranstalter</label>
              <span>{eventOwner}</span>
            </div>
            <div className="workspace-details__info-row">
              <label>Status</label>
              <span>{eventStatus}</span>
            </div>
            <div className="workspace-details__info-row">
              <label>Crew</label>
              <span>{eventCrew}</span>
            </div>
            <div className="workspace-details__info-section">
              <label>Beschreibung</label>
              <p className="workspace-details__description">{eventDescription}</p>
            </div>
          </div>

          <div className="workspace-details__actions">
            <button
              type="button"
              className="workspace-details__action-btn workspace-details__action-btn--primary"
              onClick={() => onEventEdit?.(event)}
            >
              Bearbeiten
            </button>
            <button
              type="button"
              className="workspace-details__action-btn"
              disabled
              title="Noch nicht verfügbar"
            >
              Duplizieren
            </button>
            <button
              type="button"
              className="workspace-details__action-btn"
              disabled
              title="Noch nicht verfügbar"
            >
              Archivieren
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return null;
}

import { useState } from 'react';
import PortfolioRouter from '../../../components/portfolio/PortfolioRouter';
import SheetRouter from '../../../components/sheets/SheetRouter';
import { getRoleSheet } from '../../../components/sheets/roleSheetMap';

function profileName(profile) {
  return profile.name || profile.display_name || profile.user_name || profile.project_name || 'Unbenanntes Profil';
}

const ACTIONS = ['DETAILS', 'SHEET', 'PORTFOLIO', 'CHAT', 'ANFRAGE', 'FAVORIT'];

export default function WorkspaceDetailsPanel({ profile }) {
  const [openSheet, setOpenSheet] = useState(false);
  const [openPortfolio, setOpenPortfolio] = useState(false);

  if (!profile) {
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
    if (SheetComponent) {
      console.log('Opening sheet for role:', role, 'Profile:', profile);
      setOpenSheet(true);
    } else {
      console.warn('No sheet component found for role:', role);
    }
  };

  const handlePortfolioClick = () => {
    console.log('Opening portfolio for profile:', profile);
    setOpenPortfolio(true);
  };

  const handleCloseSheet = () => {
    setOpenSheet(false);
  };

  const handleClosePortfolio = () => {
    setOpenPortfolio(false);
  };

  const handleActionClick = (action) => {
    if (action === 'SHEET') {
      handleSheetClick();
    } else if (action === 'PORTFOLIO') {
      handlePortfolioClick();
    } else {
      console.log(action, profile);
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

      {/* Sheet Modal */}
      {openSheet && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-6">
          <button
            onClick={handleCloseSheet}
            className="absolute top-4 right-4 z-[10000] bg-slate-900 border border-cyan-500/30 rounded-full w-10 h-10"
          >
            ✕
          </button>
          <div className="w-full h-full overflow-auto rounded-2xl">
            {(() => {
              const SheetComponent = getRoleSheet(String(category).trim().toLowerCase());
              return SheetComponent ? (
                <SheetRouter
                  profile={profile}
                  onBack={handleCloseSheet}
                  SheetComponent={SheetComponent}
                  roleLabel={category}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-slate-900">
                  <p className="text-slate-300">Kein Sheet für diese Rolle verfügbar</p>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Portfolio Modal */}
      {openPortfolio && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-6">
          <button
            onClick={handleClosePortfolio}
            className="absolute top-4 right-4 z-[10000] bg-slate-900 border border-cyan-500/30 rounded-full w-10 h-10"
          >
            ✕
          </button>
          <div className="w-full h-full overflow-auto rounded-2xl">
            <PortfolioRouter
              profileId={profile.id}
              onBack={handleClosePortfolio}
            />
          </div>
        </div>
      )}
    </>
  );
}

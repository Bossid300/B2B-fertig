import { useState } from 'react';

const TABS = [
  { id: 'profil', label: 'Profil' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'angebot', label: 'Angebot' },
  { id: 'verwaltung', label: 'Verwaltung' }
];

export default function ProfileSectionTabs({
  currentProfileId,
  isOwner,
  profile,
  portfolio,
  offer,
  management
}) {
  const [activeTab, setActiveTab] = useState('profil');
  const canManage = Boolean(
    isOwner ||
    currentProfileId === localStorage.getItem('gigsda_profile_id')
  );
  const visibleTabs = TABS.filter(
    tab => tab.id !== 'verwaltung' || (canManage && management)
  );
  const selectedTab =
    activeTab === 'verwaltung' && !canManage ? 'profil' : activeTab;
  return (
    <>
      <nav
        role="tablist"
        aria-label="Profilbereiche"
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
      >
        {visibleTabs.map(tab => (
          <button
            key={tab.id}
            id={`profile-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={selectedTab === tab.id}
            aria-controls="profile-tabpanel"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-xl border px-4 py-3 font-sans text-sm font-semibold transition-colors ${
              selectedTab === tab.id
                ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-600 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <section
        id="profile-tabpanel"
        role="tabpanel"
        aria-labelledby={`profile-tab-${selectedTab}`}
        className="space-y-6"
      >
        <div className="profile-box-content" hidden={selectedTab !== 'profil'}>{profile}</div>
        <div className="profile-box-content" hidden={selectedTab !== 'portfolio'}>{portfolio}</div>
        <div className="profile-box-content" hidden={selectedTab !== 'angebot'}>{offer}</div>
        {canManage && management && (
          <div className="profile-box-content" hidden={selectedTab !== 'verwaltung'}>{management}</div>
        )}
      </section>
    </>
  );
}

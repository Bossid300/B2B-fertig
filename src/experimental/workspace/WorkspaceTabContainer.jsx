import EventsTab from './tabs/EventsTab.jsx';
import CrewTab from './tabs/CrewTab.jsx';
import BudgetTab from './tabs/BudgetTab.jsx';
import CommunicationTab from './tabs/CommunicationTab.jsx';
import DocumentsTab from './tabs/DocumentsTab.jsx';

export default function WorkspaceTabContainer({
  events = [],
  loading,
  loadError,
  onEventSelect,
  onProfileSelect,
  activeEvent,
  profiles = [],
  favoriteIds = [],
  profileStatuses = {},
  onCreateEvent,
  activeTab,
  onTabChange,
  promotionCheckRef
}) {
  // Tabs sind immer sichtbar, aber nur Events sind vor der Eventöffnung aktiv
  const availableTabs = [
    { id: 'events', label: 'Events', alwaysVisible: true },
    { id: 'promotion', label: 'Promotion', alwaysVisible: activeEvent },
    { id: 'crew', label: 'Crew', alwaysVisible: activeEvent },
    { id: 'budget', label: 'Budget', alwaysVisible: activeEvent },
    { id: 'communication', label: 'Kommunikation', alwaysVisible: activeEvent },
    { id: 'documents', label: 'Dokumente', alwaysVisible: activeEvent }
  ];

  const visibleTabs = availableTabs.filter(tab => tab.alwaysVisible);

  return (
    <div className="workspace-tab-container">
      <div className="workspace-tabs-header">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`workspace-tab ${activeTab === tab.id ? 'is-active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="workspace-tabs-content">
        <div ref={promotionCheckRef} style={{ display: activeTab === 'promotion' ? undefined : 'none' }} />
        {activeTab === 'events' && (
          <EventsTab
            events={events}
            loading={loading}
            loadError={loadError}
            onEventSelect={onEventSelect}
            onCreateEvent={onCreateEvent}
          />
        )}

        {activeTab === 'crew' && activeEvent && (
          <CrewTab
            activeEvent={activeEvent}
            profiles={profiles}
            favoriteIds={favoriteIds}
            profileStatuses={profileStatuses}
            onProfileSelect={onProfileSelect}
          />
        )}

        {activeTab === 'budget' && activeEvent && (
          <BudgetTab />
        )}

        {activeTab === 'communication' && activeEvent && (
          <CommunicationTab />
        )}

        {activeTab === 'documents' && activeEvent && (
          <DocumentsTab />
        )}
      </div>
    </div>
  );
}

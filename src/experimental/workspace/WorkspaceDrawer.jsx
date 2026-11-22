import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Plus } from 'lucide-react';
import EventToolsDrawer from './components/EventToolsDrawer.jsx';

export default function WorkspaceDrawer({
  collapsed,
  onToggle,
  events = [],
  loading,
  loadError,
  onEventSelect,
  activeEvent
}) {
  const [search, setSearch] = useState('');
  const [eventsExpanded, setEventsExpanded] = useState(true);

  // Kategorisiere Events nach Status
  const categorizedEvents = useMemo(() => {
    const now = new Date();
    
    const categories = {
      'In Planung': [],
      'Bevorstehend': [],
      'Archiv': []
    };

    events.forEach(event => {
      const eventDate = event.date ? new Date(event.date) : null;
      
      // "In Planung" - Keine Daten oder Datum in der Zukunft, aber mehr als 7 Tage weg
      if (!eventDate || eventDate.getTime() - now.getTime() > 7 * 24 * 60 * 60 * 1000) {
        categories['In Planung'].push(event);
      }
      // "Bevorstehend" - Datum zwischen heute und 7 Tage in der Zukunft
      else if (eventDate.getTime() >= now.getTime() && eventDate.getTime() - now.getTime() <= 7 * 24 * 60 * 60 * 1000) {
        categories['Bevorstehend'].push(event);
      }
      // "Archiv" - Datum liegt in der Vergangenheit
      else if (eventDate && eventDate.getTime() < now.getTime()) {
        categories['Archiv'].push(event);
      }
    });

    return categories;
  }, [events]);

  // Filtere Events basierend auf Suchbegriff
  const filteredEvents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return categorizedEvents;

    const result = { 'In Planung': [], 'Bevorstehend': [], 'Archiv': [] };
    Object.entries(categorizedEvents).forEach(([category, eventList]) => {
      result[category] = eventList.filter(event =>
        (event.title || '').toLowerCase().includes(term) ||
        (event.location || '').toLowerCase().includes(term) ||
        (event.city || '').toLowerCase().includes(term)
      );
    });
    return result;
  }, [categorizedEvents, search]);

  return (
    <aside className={`workspace-drawer${collapsed ? ' is-collapsed' : ''}`}>
      <div className="workspace-drawer__top">
        {!collapsed && <span className="workspace-drawer__title">EVENTS</span>}
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
          {/* EVENTS SECTION */}
          <div className="workspace-drawer__section">
            <button
              type="button"
              className="workspace-drawer__section-header"
              onClick={() => setEventsExpanded(!eventsExpanded)}
            >
              <ChevronDown
                size={18}
                className={`workspace-drawer__section-chevron ${eventsExpanded ? 'is-expanded' : ''}`}
              />
              <span>EVENTS</span>
            </button>

            {eventsExpanded && (
              <>
                <div className="workspace-drawer__header">
                  <button
                    type="button"
                    className="workspace-drawer__btn-create"
                    title="Neues Event erstellen"
                  >
                    <Plus size={16} />
                    <span>Event erstellen</span>
                  </button>
                </div>

                <div className="workspace-event-search">
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Events durchsuchen"
                    aria-label="Events durchsuchen"
                  />
                </div>

                <div className="workspace-event-list">
                  {loading && <p className="workspace-empty">Events werden geladen …</p>}
                  {!loading && loadError && <p className="workspace-error" role="alert">{loadError}</p>}

                  {!loading && !loadError && Object.entries(filteredEvents).map(([category, categoryEvents]) => {
                    if (categoryEvents.length === 0) return null;

                    return (
                      <div key={category} className="workspace-event-category">
                        <h3 className="workspace-event-category__title">{category}</h3>
                        <div className="workspace-event-cards">
                          {categoryEvents.map((event) => (
                            <button
                              type="button"
                              key={event.id || event._id}
                              className="workspace-event-card"
                              onClick={() => onEventSelect?.(event)}
                              draggable
                              onDragStart={(dragEvent) => {
                                dragEvent.dataTransfer.effectAllowed = 'move';
                                dragEvent.dataTransfer.setData('application/x-gigsda-workspace', JSON.stringify({
                                  type: 'event',
                                  event: event
                                }));
                              }}
                            >
                              <div className="workspace-event-card__title">{event.title || 'Unbenanntes Event'}</div>
                              <div className="workspace-event-card__date">
                                {event.date ? new Date(event.date).toLocaleDateString('de-DE') : 'Kein Datum'}
                              </div>
                              <div className="workspace-event-card__location">
                                {event.location || event.city || 'Kein Ort'}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {!loading && !loadError && Object.values(filteredEvents).every(cat => cat.length === 0) && (
                    <p className="workspace-empty">Keine Events gefunden.</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* EVENT TOOLS SECTION */}
          {activeEvent && (
            <div className="workspace-drawer__section">
              <EventToolsDrawer event={activeEvent} />
            </div>
          )}
        </>
      )}
    </aside>
  );
}

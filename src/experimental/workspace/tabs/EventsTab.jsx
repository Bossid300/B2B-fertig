import { useMemo, useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';

export default function EventsTab({
  events = [],
  loading,
  loadError,
  onEventSelect,
  onCreateEvent
}) {
  const [search, setSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({
    'In Planung': true,
    'Bevorstehend': true,
    'Archiv': false
  });

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
    <div className="workspace-tab-panel">
      <div className="workspace-drawer__header">
        <button
          type="button"
          className="workspace-drawer__btn-create"
          title="Neues Event erstellen"
          onClick={() => onCreateEvent?.()}
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

          const isExpanded = expandedCategories[category];

          return (
            <div key={category} className="workspace-event-category">
              <button
                type="button"
                className="workspace-event-category__title"
                onClick={() => setExpandedCategories(prev => ({
                  ...prev,
                  [category]: !prev[category]
                }))}
              >
                <ChevronDown 
                  size={16} 
                  style={{
                    transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                    transition: 'transform 180ms ease'
                  }}
                />
                {category}
              </button>
              {isExpanded && (
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
              )}
            </div>
          );
        })}

        {!loading && !loadError && Object.values(filteredEvents).every(cat => cat.length === 0) && (
          <p className="workspace-empty">Keine Events gefunden.</p>
        )}
      </div>
    </div>
  );
}

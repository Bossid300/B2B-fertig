import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function EventToolsDrawer({ event }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!event) return null;

  const handleToolClick = (toolName) => {
    console.log(`${toolName} ausgewählt`);
  };

  const tools = [
    { id: 'communication', label: 'Kommunikation' },
    { id: 'deals', label: 'Deals' },
    { id: 'promotion', label: 'Promotion' },
    { id: 'budget', label: 'Budget' },
    { id: 'documents', label: 'Dokumente' }
  ];

  return (
    <div className="workspace-event-tools-drawer">
      <button
        type="button"
        className="workspace-event-tools-drawer__header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <ChevronDown
          size={18}
          className={`workspace-event-tools-drawer__chevron ${isExpanded ? 'is-expanded' : ''}`}
        />
        <span className="workspace-event-tools-drawer__title">{event.title}</span>
      </button>

      {isExpanded && (
        <div className="workspace-event-tools-drawer__content">
          <div className="workspace-event-tools-drawer__section">
            <div className="workspace-event-tools-drawer__subsection">
              <button
                type="button"
                className="workspace-event-tools-drawer__item"
                onClick={() => handleToolClick('Crew')}
              >
                Crew
              </button>
              <button
                type="button"
                className="workspace-event-tools-drawer__item"
                onClick={() => handleToolClick('Suche')}
              >
                Suche
              </button>
              <button
                type="button"
                className="workspace-event-tools-drawer__item"
                onClick={() => handleToolClick('Favoriten')}
              >
                Favoriten
              </button>
            </div>

            <div className="workspace-event-tools-drawer__separator" />

            <div className="workspace-event-tools-drawer__subsection">
              <div className="workspace-event-tools-drawer__label">Werkzeuge</div>
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  className="workspace-event-tools-drawer__item"
                  onClick={() => handleToolClick(tool.label)}
                >
                  {tool.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

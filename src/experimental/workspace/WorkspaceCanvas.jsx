import { useRef, useMemo, useState } from 'react';
import WorkspaceCard from './WorkspaceCard.jsx';

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getStatusGroup(status) {
  if (status === 'Bestätigt') return 'Bestätigt';
  if (status === 'Verhandlung' || status === 'In Verhandlung') return 'Verhandlung';
  if (status === 'Angefragt') return 'Angefragt';
  if (status === 'Abgesagt') return 'Abgesagt';
  return 'Interessant';
}

function getCategory(profile) {
  return profile?.role || 'Sonstige';
}

export default function WorkspaceCanvas({ selectedCardId, profileStatuses, onProfileSelect, activeEvent }) {
  const canvasRef = useRef(null);
  const [cards, setCards] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [sortMode, setSortMode] = useState(null); // null | 'status' | 'category'

  const groupedCards = useMemo(() => {
    if (sortMode === 'status') {
      const groups = {
        Interessant: [],
        Angefragt: [],
        Verhandlung: [],
        Bestätigt: [],
        Abgesagt: []
      };

      cards.forEach((card) => {
        const status = profileStatuses?.get(String(card.profile.id)) || 'Interessant';
        const group = getStatusGroup(status);
        groups[group].push(card);
      });

      return groups;
    }

    if (sortMode === 'category') {
      const groups = {};

      cards.forEach((card) => {
        const category = getCategory(card.profile);
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(card);
      });

      return groups;
    }

    return null;
  }, [cards, profileStatuses, sortMode]);

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);

    const canvas = canvasRef.current;
    if (!canvas) return;

    let payload;
    try {
      payload = JSON.parse(event.dataTransfer.getData('application/x-gigsda-workspace'));
    } catch (error) {
      console.error('Workspace: Die gezogene Karte konnte nicht gelesen werden.', error);
      return;
    }

    const bounds = canvas.getBoundingClientRect();
    
    // Kartengröße: 240px breite + Padding
    const CARD_WIDTH = 240;
    const CARD_HEIGHT = 260;
    const PADDING = 16;
    
    // Mausposition relativ zum Canvas-Viewport
    let left = event.clientX - bounds.left + canvas.scrollLeft - (CARD_WIDTH / 2);
    let top = event.clientY - bounds.top + canvas.scrollTop - (CARD_HEIGHT / 2);
    
    // In den sichtbaren Bereich begrenzen
    left = clamp(left, PADDING, canvas.scrollWidth - CARD_WIDTH - PADDING);
    top = clamp(top, PADDING, canvas.scrollHeight - CARD_HEIGHT - PADDING);

    if (payload?.type === 'profile' && payload.profile?.id != null) {
      setCards((current) => [
        ...current,
        {
          instanceId: `${payload.profile.id}-${Date.now()}-${current.length}`,
          profile: payload.profile,
          left,
          top,
          eventId: activeEvent?.id,
          eventTitle: activeEvent?.title,
          placedAt: new Date().toISOString()
        }
      ]);
      return;
    }

    if (payload?.type === 'instance' && payload.instanceId) {
      setCards((current) => current.map((card) =>
        card.instanceId === payload.instanceId
          ? { ...card, left, top }
          : card
      ));
    }
  };

  const handleDeleteCard = (instanceId) => {
    setCards((current) => current.filter((card) => card.instanceId !== instanceId));
  };

  return (
    <section
      className={`workspace-canvas${isDragOver ? ' is-drag-over' : ''}`}
      ref={canvasRef}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        setIsDragOver(true);
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsDragOver(false);
      }}
      onDrop={handleDrop}
      aria-label="Freie Arbeitsfläche"
    >
      {cards.length > 0 && (
        <div className="workspace-canvas__toolbar">
          <button
            className={`workspace-canvas__sort-btn${sortMode === 'status' ? ' is-active' : ''}`}
            onClick={() => setSortMode(sortMode === 'status' ? null : 'status')}
            title="Nach Status sortieren"
          >
            📊 Status
          </button>
          <button
            className={`workspace-canvas__sort-btn${sortMode === 'category' ? ' is-active' : ''}`}
            onClick={() => setSortMode(sortMode === 'category' ? null : 'category')}
            title="Nach Kategorie sortieren"
          >
            🗂 Kategorie
          </button>
        </div>
      )}

      {cards.length === 0 && (
        <div className="workspace-canvas__empty">
          <span>ARBEITSFLÄCHE</span>
          <p>Ziehe Profile aus der Schublade hierher.</p>
        </div>
      )}
      
      {cards.length > 0 && sortMode && (
        <div className="workspace-canvas__groups">
          {(sortMode === 'status' 
            ? ['Interessant', 'Angefragt', 'Verhandlung', 'Bestätigt', 'Abgesagt']
            : Object.keys(groupedCards).sort()
          ).map((groupName) => {
            const groupCards = groupedCards[groupName];
            if (groupCards.length === 0) return null;

            return (
              <div key={groupName} className="workspace-canvas__group">
                <h3 className="workspace-canvas__group-title">{groupName}</h3>
                <div className="workspace-canvas__group-cards">
                  {groupCards.map((card) => (
                    <WorkspaceCard
                      key={card.instanceId}
                      profile={card.profile}
                      status={profileStatuses?.get(String(card.profile.id)) || 'Interessant'}
                      eventTitle={card.eventTitle}
                      selected={card.instanceId === selectedCardId}
                      onClick={() => onProfileSelect?.(card.profile, card.instanceId)}
                      onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = 'move';
                        event.dataTransfer.setData('application/x-gigsda-workspace', JSON.stringify({
                          type: 'instance',
                          instanceId: card.instanceId
                        }));
                      }}
                      onDelete={() => handleDeleteCard(card.instanceId)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cards.length > 0 && !sortMode && (
        <div className="workspace-canvas__freeform">
          {cards.map((card) => (
            <WorkspaceCard
              key={card.instanceId}
              profile={card.profile}
              status={profileStatuses?.get(String(card.profile.id)) || 'Interessant'}
              eventTitle={card.eventTitle}
              selected={card.instanceId === selectedCardId}
              style={{ left: card.left, top: card.top }}
              onClick={() => onProfileSelect?.(card.profile, card.instanceId)}
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('application/x-gigsda-workspace', JSON.stringify({
                  type: 'instance',
                  instanceId: card.instanceId
                }));
              }}
              onDelete={() => handleDeleteCard(card.instanceId)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

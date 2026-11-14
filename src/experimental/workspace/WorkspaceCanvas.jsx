import { useRef, useState } from 'react';
import WorkspaceCard from './WorkspaceCard.jsx';

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

export default function WorkspaceCanvas() {
  const canvasRef = useRef(null);
  const [cards, setCards] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);

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
    const left = clamp(
      event.clientX - bounds.left + canvas.scrollLeft - 120,
      16,
      canvas.clientWidth - 272
    );
    const top = Math.max(16, event.clientY - bounds.top + canvas.scrollTop - 48);

    if (payload?.type === 'profile' && payload.profile?.id != null) {
      setCards((current) => [
        ...current,
        {
          instanceId: `${payload.profile.id}-${Date.now()}-${current.length}`,
          profile: payload.profile,
          left,
          top
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
      {cards.length === 0 && (
        <div className="workspace-canvas__empty">
          <span>ARBEITSFLÄCHE</span>
          <p>Ziehe Profile aus der Schublade hierher.</p>
        </div>
      )}
      {cards.map((card) => (
        <WorkspaceCard
          key={card.instanceId}
          profile={card.profile}
          style={{ left: card.left, top: card.top }}
          onDragStart={(event) => {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('application/x-gigsda-workspace', JSON.stringify({
              type: 'instance',
              instanceId: card.instanceId
            }));
          }}
        />
      ))}
    </section>
  );
}

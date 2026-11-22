const AMENITY_OPTIONS = [
  { id: 'parking', label: '🅿️ Parkplätze' },
  { id: 'accessible', label: '♿ Barrierefrei' },
  { id: 'cloakroom', label: '🧥 Garderobe' },
  { id: 'foodtrucks', label: '🍔 Foodtrucks' },
  { id: 'card-payment', label: '💳 Kartenzahlung' },
  { id: 'outdoor', label: '🌳 Outdoor-Bereich' }
];

export function AmenitySelector({ promoData, setPromoData, disabled = false }) {
  const tags = promoData.amenityTags;
  const invalid = tags != null && !Array.isArray(tags);
  const selected = Array.isArray(tags) ? tags : [];

  const toggle = (id) => {
    setPromoData((current) => {
      const currentTags = current.amenityTags ?? [];
      return {
        ...current,
        amenityTags: currentTags.includes(id)
          ? currentTags.filter((tag) => tag !== id)
          : [...currentTags, id]
      };
    });
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Fan-Annehmlichkeiten auswählen">
        {AMENITY_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected.includes(option.id)}
            disabled={disabled || invalid}
            onClick={() => toggle(option.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60 ${
              selected.includes(option.id)
                ? 'border-cyan-400 bg-cyan-400/20 text-cyan-200'
                : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-cyan-400'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {invalid && <p role="alert" className="mt-2 text-sm text-rose-400">Die gespeicherten Annehmlichkeiten haben ein ungültiges Format und können nicht bearbeitet werden.</p>}
    </div>
  );
}

export function AmenityBadges({ tags }) {
  if (!Array.isArray(tags) || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((id, index) => (
        <span key={`${String(id)}-${index}`} className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200">
          {AMENITY_OPTIONS.find((option) => option.id === id)?.label || String(id)}
        </span>
      ))}
    </div>
  );
}

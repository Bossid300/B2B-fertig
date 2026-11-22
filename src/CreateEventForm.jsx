import { useState } from 'react';
import { geocodeAddress } from './services/geoService';

const CATEGORIES = [
  { id: 'Clubshows', label: 'Clubshow', icon: '🎛️' },
  { id: 'Festivals', label: 'Festival', icon: '🎪' },
  { id: 'OpenAirs', label: 'Open Air', icon: '☀️' }
];

const createEventId = () => 'EVT-' + Date.now().toString().slice(-4);

export default function CreateEventForm({ onBack, onCreateEvent, event, onSaveEvent }) {
  const initialCategory = event?.category || event?.type || event?.event_type;
  const categoryId = CATEGORIES.find(
    (item) => item.id === initialCategory || item.label === initialCategory
  )?.id || initialCategory;
  const categories = categoryId && !CATEGORIES.some((item) => item.id === categoryId)
    ? [...CATEGORIES, { id: categoryId, label: initialCategory, icon: '🎵' }]
    : CATEGORIES;
  const venueParts = (event?.venue || event?.location || '').split(',').map((part) => part.trim());
  const postalAddress = venueParts.length >= 2
    ? venueParts[venueParts.length - 1].match(/^(\d{4,5})\s+(.+)$/)
    : null;
  const initialVenueName = event?.venueName || venueParts[0] || '';
  const initialStreet = event?.street || event?.address || (postalAddress && venueParts.length >= 3 ? venueParts[1] : '');
  const initialZip = event?.zip || postalAddress?.[1] || '';
  const initialCity = event?.city || postalAddress?.[2] || '';
  const [category, setCategory] = useState(event ? categoryId || '' : 'Clubshows');
  const [title, setTitle] = useState(event?.title || event?.name || '');

  const [venueName, setVenueName] = useState(initialVenueName);
  const [street, setStreet] = useState(initialStreet);
  const [zip, setZip] = useState(initialZip);
  const [city, setCity] = useState(initialCity);

  const [calendarDate, setCalendarDate] = useState(event?.date || event?.event_date || '');
  const [time, setTime] = useState(event?.time || '20:00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Wandelt YYYY-MM-DD in DD.MM.YYYY um
  const formatDateDe = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    if (!year || !month || !day) return isoDate;
    return `${day}.${month}.${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !venueName.trim() || !calendarDate || !category || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const addressCandidates = [
        [street, [zip, city].filter(Boolean).join(' ')].filter(Boolean).join(', '),
        [zip, city].filter(Boolean).join(' '),
        city
      ].filter(Boolean);

      const addressChanged = !event ||
        street !== initialStreet ||
        zip !== initialZip ||
        city !== initialCity;
      let geo = event && !addressChanged ? { lat: event.lat, lng: event.lng } : null;
      if (addressChanged) {
        for (const address of addressCandidates) {
          geo = await geocodeAddress(address);
          if (geo) break;
        }
      }

      const values = {
        title,
        date: calendarDate,
        displayDate: formatDateDe(calendarDate),
        time,
        category,
        venueName,
        street,
        zip,
        city,
        venue: event && !addressChanged &&
          venueName === initialVenueName
          ? (event.venue || event.location || venueName)
          : [venueName, street, [zip, city].filter(Boolean).join(' ')].filter(Boolean).join(', '),
        lat: geo?.lat ?? null,
        lng: geo?.lng ?? null
      };

      if (event) {
        const categoryLabel = categories.find((item) => item.id === category).label;
        await onSaveEvent({
          ...event,
          ...values,
          name: title,
          event_date: calendarDate,
          category: categoryLabel,
          type: categoryLabel,
          event_type: categoryLabel,
          location: values.venue,
          ...(event.address != null ? { address: street } : {})
        });
      } else if (onCreateEvent) {
        await onCreateEvent({
          id: createEventId(),
          ...values,
          doneProgress: 0
        });
      }
    } catch (error) {
      console.error('Event konnte nicht gespeichert werden.', error);
      setSubmitError(error.message || 'Das Event konnte nicht gespeichert werden.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = title.trim() && venueName.trim() && calendarDate && category;

  return (
    <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl relative max-w-2xl mx-auto text-slate-200 animate-fade-in max-h-[90vh] overflow-y-auto">
      
      {/* HEADER */}
      <div className="flex justify-between items-start border-b border-slate-800 pb-5 mb-6">
        <div>
          <span className="inline-block text-xs font-mono text-cyan-400 font-semibold uppercase tracking-widest mb-1">
            // GIGSDA MANAGEMENT
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {event ? 'Event bearbeiten' : 'Neues Event anlegen'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Lege Eckdaten, Location und Zeitplan für die Produktion fest.
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 font-mono text-xs transition-colors cursor-pointer"
        >
          ✕ Schließen
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* BLOCK 1: WAS */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
            <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
              01 // Was (Event-Details)
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Event-Kategorie
            </label>
            <div className="grid grid-cols-3 gap-3">
              {categories.map((cat) => {
                const active = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                      active
                        ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Name des Events / Headliner <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              placeholder="z.B. Winston Jud Live in Concert"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-base text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
            />
          </div>
        </div>

        {/* BLOCK 2: WO */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.6)]" />
            <h3 className="text-xs font-mono text-purple-400 uppercase tracking-widest font-bold">
              02 // Wo (Location & Adresse)
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Name der Location <span className="text-purple-400">*</span>
            </label>
            <input
              type="text"
              placeholder="z.B. Burgkeller Bar"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Straße & Hausnummer
              </label>
              <input
                type="text"
                placeholder="z.B. Stadtplatz 61"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                PLZ
              </label>
              <input
                type="text"
                placeholder="84489"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-3 text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Ort
              </label>
              <input
                type="text"
                placeholder="Burghausen"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* BLOCK 3: WANN */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              <h3 className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">
                03 // Wann (Terminierung)
              </h3>
            </div>
            {calendarDate && (
              <span className="text-xs font-mono bg-amber-400/10 text-amber-300 border border-amber-400/30 px-2.5 py-1 rounded-lg">
                📅 {formatDateDe(calendarDate)} • {time} Uhr
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Datum (TT.MM.JJJJ) <span className="text-amber-400">*</span>
                </label>
                {calendarDate && (
                  <span className="text-[11px] font-mono text-amber-400 font-bold">
                    Ausgewählt: {formatDateDe(calendarDate)}
                  </span>
                )}
              </div>
              <input
                type="date"
                value={calendarDate}
                onChange={(e) => setCalendarDate(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 scheme-dark cursor-pointer transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Einlass / Beginn (Uhrzeit)
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 scheme-dark cursor-pointer transition-all"
              />
            </div>
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        {submitError && <p role="alert" className="text-sm text-red-400">{submitError}</p>}
        {event && !category && <p role="alert" className="text-sm text-amber-400">Bitte wähle eine Event-Kategorie.</p>}
        <div className="pt-2 flex flex-col-reverse sm:flex-row gap-3">
          <button
            type="button"
            onClick={onBack}
            className="sm:w-1/3 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 font-semibold rounded-xl h-12 transition-all text-sm cursor-pointer active:scale-[0.98]"
          >
            Abbrechen
          </button>

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="sm:w-2/3 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:brightness-110 text-slate-950 font-black h-12 rounded-xl transition-all text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/20 cursor-pointer active:scale-[0.98] disabled:opacity-35 disabled:pointer-events-none"
          >
            {isSubmitting ? 'Event wird gespeichert...' : event ? 'Änderungen speichern' : 'Event jetzt anlegen 💥'}
          </button>
        </div>

      </form>
    </div>
  );
}
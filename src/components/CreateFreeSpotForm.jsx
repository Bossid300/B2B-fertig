import React, { useEffect, useState } from 'react';

const CATEGORIES = [
  'Künstler',
  'Technik',
  'Verleih',
  'Catering',
  'Security',
  'Logistik',
  'Design',
  'Location',
  'Veranstalter',
  'Sonstiges',
];

const INITIAL_FORM = {
  title: '',
  date_from: '',
  date_to: '',
  location: '',
  region: '',
  category: '',
  description: '',
};

const inputClass = `
  w-full
  bg-[#030816]
  border border-slate-700
  rounded-xl
  px-4 py-3
  text-sm
  text-white
  placeholder:text-slate-600
  outline-none
  focus:border-pink-500
  focus:ring-1
  focus:ring-pink-500/30
  transition
`;

function Field({ label, required = false, children }) {
  return (
    <div className="block">
      <div className="text-xs font-bold text-slate-400 mb-2">
        {label}

        {required && (
          <span className="text-pink-400 ml-1">*</span>
        )}
      </div>

      {children}
    </div>
  );
}

export default function CreateFreeSpotForm({
  currentProfileId,
  onSubmit,
  onCancel,
  editSpot = null,
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editSpot) {
      setForm(INITIAL_FORM);
      return;
    }

    setForm({
      title: editSpot.title || '',
      date_from: editSpot.spot_date || '',
      date_to: '',
      location: editSpot.location || '',
      region: editSpot.region || '',
      category: editSpot.category || '',
      description: editSpot.description || '',
    });
  }, [editSpot]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentProfileId) {
      setError('Kein aktives Profil gefunden.');
      return;
    }

    if (!form.title.trim()) {
      setError('Bitte einen Titel eingeben.');
      return;
    }

    if (!form.date_from) {
      setError('Bitte ein Startdatum auswählen.');
      return;
    }

    if (form.date_to && form.date_to < form.date_from) {
      setError('Das Enddatum darf nicht vor dem Startdatum liegen.');
      return;
    }

    const freeSpot = {
      ...(editSpot?.id && { id: editSpot.id }),

      owner_id: currentProfileId,

      title: form.title.trim(),
      spot_date: form.date_from,

      location: form.location.trim(),
      region: form.region.trim(),
      category: form.category,
      description: form.description.trim(),

      visibility: 'registered',
    };

    try {
      setSaving(true);
      setError('');

      if (typeof onSubmit === 'function') {
        await onSubmit(freeSpot);
      }

      setForm(INITIAL_FORM);
    } catch (err) {
      console.error('FREE SPOT SAVE ERROR:', err);

      setError(
        err?.message ||
        'Free Spot konnte nicht gespeichert werden.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">

      <div
        className="
          bg-[#07101f]
          border border-pink-500/20
          rounded-2xl
          overflow-hidden
        "
      >

        {/* HEADER */}
        <div
          className="
            px-5
            sm:px-7
            py-5
            border-b border-slate-800
            flex
            items-start
            justify-between
            gap-4
          "
        >

          <div>
            <div
              className="
                text-[10px]
                uppercase
                tracking-[0.25em]
                text-pink-400
                mb-1
              "
            >
              GIGSDA FREE SPOT
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white">
              Free Spot erstellen
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Zeige anderen Mitgliedern, wann du verfügbar bist.
            </p>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="
                text-slate-500
                hover:text-white
                text-xl
                transition
                disabled:opacity-50
              "
            >
              ×
            </button>
          )}

        </div>


        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-7 space-y-6"
        >

          {/* TITEL */}
          <Field label="Titel" required>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                updateField('title', e.target.value)
              }
              placeholder="z. B. Verfügbar für Live-Gigs"
              maxLength={120}
              className={inputClass}
            />
          </Field>


          {/* ZEITRAUM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Field label="Verfügbar ab" required>
              <input
                type="date"
                value={form.date_from}
                onChange={(e) =>
                  updateField('date_from', e.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label="Verfügbar bis">
              <input
                type="date"
                value={form.date_to}
                min={form.date_from || undefined}
                onChange={(e) =>
                  updateField('date_to', e.target.value)
                }
                className={inputClass}
              />
            </Field>

          </div>


          {/* LOCATION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Field label="Ort">
              <input
                type="text"
                value={form.location}
                onChange={(e) =>
                  updateField('location', e.target.value)
                }
                placeholder="z. B. Braunau am Inn"
                className={inputClass}
              />
            </Field>

            <Field label="Region">
              <input
                type="text"
                value={form.region}
                onChange={(e) =>
                  updateField('region', e.target.value)
                }
                placeholder="z. B. Oberösterreich"
                className={inputClass}
              />
            </Field>

          </div>


          {/* KATEGORIE */}
          <Field label="Kategorie">

            <select
              value={form.category}
              onChange={(e) =>
                updateField('category', e.target.value)
              }
              className={inputClass}
            >
              <option value="">
                Kategorie auswählen
              </option>

         {CATEGORIES.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>

          </Field>


          {/* BESCHREIBUNG */}
          <Field label="Beschreibung">

            <textarea
              value={form.description}
              onChange={(e) =>
                updateField('description', e.target.value)
              }
              placeholder="Was möchtest du anbieten? Für welche Jobs oder Projekte bist du verfügbar?"
              rows={5}
              maxLength={1000}
              className={`${inputClass} resize-none`}
            />

            <div className="text-right text-[10px] text-slate-600 mt-1">
              {form.description.length} / 1000
            </div>

          </Field>


          {/* SICHTBARKEIT */}
          <div
            className="
              bg-pink-500/5
              border border-pink-500/20
              rounded-xl
              px-4 py-3
              flex gap-3
            "
          >
            <span>🔒</span>

            <div>
              <div className="text-sm font-semibold text-slate-200">
                Nur für registrierte Mitglieder
              </div>

              <div className="text-xs text-slate-500 mt-1">
                Dieser Free Spot erscheint im Mitgliederkalender.
              </div>
            </div>
          </div>


          {/* FEHLER */}
          {error && (
            <div
              className="
                border border-red-500/30
                bg-red-500/10
                text-red-300
                rounded-xl
                px-4 py-3
                text-sm
              "
            >
              {error}
            </div>
          )}


          {/* ACTIONS */}
          <div
            className="
              pt-4
              border-t border-slate-800
              flex
              flex-col-reverse
              sm:flex-row
              sm:justify-end
              gap-3
            "
          >

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={saving}
                className="
                  px-5 py-3
                  rounded-xl
                  border border-slate-700
                  text-slate-300
                  hover:border-slate-500
                  hover:text-white
                  disabled:opacity-50
                  transition
                "
              >
                Abbrechen
              </button>
            )}

            <button
              type="submit"
              disabled={saving}
              className="
                px-6 py-3
                rounded-xl
                font-bold
                text-white
                bg-gradient-to-r
                from-pink-500
                to-purple-600
                hover:from-pink-400
                hover:to-purple-500
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition
              "
            >
              {saving
                ? 'Wird gespeichert...'
                : '● Free Spot veröffentlichen'}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}
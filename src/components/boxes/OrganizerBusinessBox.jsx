import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { getProfilesDb, saveProfile } from '../../services/apiService';

const createEmptyForm = () => ({
  organizer_experience_years: '',
  organizer_visitors_total: '',
  organizer_target_capacities: '',
  organizer_payout_punctuality_percent: '',
  organizer_location_capacity: '',
  organizer_location_noise_protection: '',
  organizer_location_power: '',
  organizer_location_loading_zone: '',
  organizer_location_rental_model: '',
  organizer_acts_genres: '',
  organizer_acts_live_performance: '',
  organizer_acts_promotion: '',
  organizer_acts_b2b_standard: '',
  organizer_inhouse_ticketing_marketing: '',
  organizer_inhouse_authorities_security: '',
  organizer_inhouse_production_hospitality: '',
  organizer_deal_band_models: '',
  organizer_deal_location_models: '',
  organizer_deal_payout_security: '',
  organizer_deal_gema_fees: '',
  organizer_deal_liability: '',
  organizer_deal_b2b_settlement: '',
});

const SECTIONS = [
  {
    title: 'Event Erfahrung',
    fields: [
      { key: 'organizer_experience_years', label: 'Event-Erfahrung (Jahre)', type: 'number', unit: 'Jahre' },
      { key: 'organizer_visitors_total', label: 'Besucher gesamt', type: 'number' },
      { key: 'organizer_target_capacities', label: 'Ziel-Kapazitäten', type: 'textarea' },
      { key: 'organizer_payout_punctuality_percent', label: 'Pünktliche Auszahlung (%)', type: 'percent' },
    ],
  },
  {
    title: 'Was wir bei Locations suchen',
    fields: [
      { key: 'organizer_location_capacity', label: 'Kapazität', type: 'textarea' },
      { key: 'organizer_location_noise_protection', label: 'Lärmschutz', type: 'textarea' },
      { key: 'organizer_location_power', label: 'Strom', type: 'textarea' },
      { key: 'organizer_location_loading_zone', label: 'Ladezone', type: 'textarea' },
      { key: 'organizer_location_rental_model', label: 'Mietmodell', type: 'textarea' },
    ],
  },
  {
    title: 'Was wir bei Acts & Bands suchen',
    fields: [
      { key: 'organizer_acts_genres', label: 'Genres', type: 'textarea' },
      { key: 'organizer_acts_live_performance', label: 'Live-Performance', type: 'textarea' },
      { key: 'organizer_acts_promotion', label: 'Promotion', type: 'textarea' },
      { key: 'organizer_acts_b2b_standard', label: 'B2B Standard', type: 'textarea' },
    ],
  },
  {
    title: 'Inhouse Leistungsspektrum',
    fields: [
      { key: 'organizer_inhouse_ticketing_marketing', label: 'Ticketing & Marketing', type: 'textarea' },
      { key: 'organizer_inhouse_authorities_security', label: 'Behörden & Sicherheit', type: 'textarea' },
      { key: 'organizer_inhouse_production_hospitality', label: 'Produktion & Hospitality', type: 'textarea' },
    ],
  },
  {
    title: 'Vertrags- & Deal-Modelle',
    fields: [
      { key: 'organizer_deal_band_models', label: 'Band-Modelle', type: 'textarea' },
      { key: 'organizer_deal_location_models', label: 'Location-Modelle', type: 'textarea' },
      { key: 'organizer_deal_payout_security', label: 'Auszahlungssicherheit', type: 'textarea' },
      { key: 'organizer_deal_gema_fees', label: 'GEMA-Abgaben', type: 'textarea' },
      { key: 'organizer_deal_liability', label: 'Haftpflicht', type: 'textarea' },
      { key: 'organizer_deal_b2b_settlement', label: 'B2B Verrechnung', type: 'textarea' },
    ],
  },
];

const FIELD_CLASS =
  'w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-pink-500 focus:outline-none';

const getProfileData = (profile) => {
  if (!profile?.profile_json) return profile;

  const parsedProfile =
    typeof profile.profile_json === 'string'
      ? JSON.parse(profile.profile_json)
      : profile.profile_json;

  return { ...profile, ...parsedProfile, id: profile.id };
};

const getFormData = (profile) => ({
  ...createEmptyForm(),
  ...Object.fromEntries(
    Object.keys(createEmptyForm()).map((key) => [key, profile[key] ?? ''])
  ),
});

const hasValue = (value) =>
  value !== undefined && value !== null && String(value).trim() !== '';

function renderField(field, value, onChange) {
  const isTextarea = field.type === 'textarea';

  return isTextarea ? (
    <textarea
      id={field.key}
      name={field.key}
      rows={3}
      value={value}
      onChange={onChange}
      className={FIELD_CLASS}
    />
  ) : (
    <input
      id={field.key}
      name={field.key}
      type="number"
      min="0"
      max={field.type === 'percent' ? '100' : undefined}
      step={field.type === 'percent' ? 'any' : '1'}
      value={value}
      onChange={onChange}
      className={FIELD_CLASS}
    />
  );
}

export default function OrganizerBusinessBox({ currentProfileId, isOwner }) {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(createEmptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const canEdit =
    isOwner ||
    String(currentProfileId) === localStorage.getItem('gigsda_profile_id');

  useEffect(() => {
    let isActive = true;

    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const profiles = await getProfilesDb(currentProfileId);
        const found = profiles.find(
          (item) => String(item?.id) === String(currentProfileId)
        );

        if (!found) {
          throw new Error('Veranstalter-Profil konnte nicht gefunden werden.');
        }

        const loadedProfile = getProfileData(found);
        if (!isActive) return;

        setProfile(loadedProfile);
        setFormData(getFormData(loadedProfile));
        setError('');
      } catch (loadError) {
        console.error('Fehler beim Laden der Veranstalter-Daten:', loadError);
        if (isActive) {
          setError('Veranstalter-Daten konnten nicht geladen werden.');
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    loadProfile();
    return () => {
      isActive = false;
    };
  }, [currentProfileId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const profiles = await getProfilesDb(currentProfileId);
      const found = profiles.find(
        (item) => String(item?.id) === String(currentProfileId)
      );

      if (!found) {
        throw new Error('Veranstalter-Profil konnte vor dem Speichern nicht geladen werden.');
      }

      const latestProfile = getProfileData(found);
      const updatedProfile = { ...latestProfile, ...formData };
      const profileId =
        updatedProfile.id ||
        updatedProfile.profileId ||
        currentProfileId;
      const result = await saveProfile({
        profileId,
        profile: updatedProfile,
      });

      if (result?.success === false) {
        throw new Error(result.error || 'Veranstalter-Daten konnten nicht gespeichert werden.');
      }

      setProfile({ ...updatedProfile, id: profileId });
      setIsEditing(false);
    } catch (saveError) {
      console.error('Fehler beim Speichern der Veranstalter-Daten:', saveError);
      setError(saveError.message || 'Veranstalter-Daten konnten nicht gespeichert werden.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-pink-400 animate-pulse mt-4">
        // VERANSTALTER-DATEN WERDEN GELADEN...
      </div>
    );
  }

  if (!profile) {
    return (
      <div role="alert" className="w-full mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-red-400 mt-4">
        {error}
      </div>
    );
  }

  return (
    <section className="w-full mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl font-mono text-white mt-4">
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
        <span className="text-xs font-black tracking-widest uppercase text-slate-200">
          // Veranstalter-Business
        </span>
        {canEdit && !isEditing && (
          <button
            type="button"
            data-profile-edit-trigger
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-pink-400 text-[10px] font-black tracking-wider uppercase hover:border-pink-500 transition-all"
          >
            Daten bearbeiten
          </button>
        )}
      </div>

      {isEditing && canEdit ? (
        <form onSubmit={handleSave} className="space-y-6">
          {SECTIONS.map((section) => (
            <fieldset key={section.title} className="space-y-3">
              <legend className="mb-3 text-[10px] font-black uppercase tracking-widest text-pink-400">
                {section.title}
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {section.fields.map((field) => (
                  <label
                    key={field.key}
                    htmlFor={field.key}
                    className={`flex flex-col gap-1 text-xs text-slate-400 ${
                      field.type === 'textarea' ? 'sm:col-span-2' : ''
                    }`}
                  >
                    <span>{field.label}</span>
                    {renderField(field, formData[field.key], handleChange)}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}

          {error && <p role="alert" className="text-xs text-red-400">{error}</p>}

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-900">
            <button
              type="button"
              data-profile-action="cancel"
              onClick={() => {
                setFormData(getFormData(profile));
                setError('');
                setIsEditing(false);
              }}
              className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white uppercase text-[10px] font-black"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              data-profile-action="save"
              disabled={isSaving}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-pink-500 text-slate-950 hover:bg-pink-400 disabled:opacity-60 uppercase text-[10px] font-black tracking-wider"
            >
              <Save size={12} />
              {isSaving ? 'Speichert...' : 'Speichern'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {SECTIONS.map((section) => {
            const values = section.fields.filter((field) =>
              hasValue(formData[field.key])
            );

            return (
              <section key={section.title} className="space-y-2">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-pink-400">
                  {section.title}
                </h3>
                {values.length > 0 ? (
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {values.map((field) => (
                      <div key={field.key} className="min-w-0">
                        <dt className="text-slate-500">{field.label}</dt>
                        <dd className="text-slate-200 whitespace-pre-wrap break-words">
                          {formData[field.key]}
                          {field.type === 'number' && field.unit ? ` ${field.unit}` : ''}
                          {field.type === 'percent' ? '%' : ''}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-xs text-slate-500">Keine Angaben hinterlegt.</p>
                )}
              </section>
            );
          })}
          {error && <p role="alert" className="text-xs text-red-400">{error}</p>}
        </div>
      )}
    </section>
  );
}

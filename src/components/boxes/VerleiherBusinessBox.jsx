import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { getProfilesDb, saveProfile } from '../../services/apiService';

const createEmptyForm = () => ({
  verleiher_storage_area: '',
  verleiher_service_model: '',
  verleiher_own_fleet: '',
  verleiher_24_7_support: '',
  verleiher_portfolio_ton: '',
  verleiher_portfolio_pulte: '',
  verleiher_portfolio_licht: '',
  verleiher_portfolio_video: '',
  verleiher_portfolio_rigging: '',
  verleiher_electrical_inspection: '',
  verleiher_motors_hoists: '',
  verleiher_packaging: '',
  verleiher_fleet_standards: '',
  verleiher_dry_hire_1_day_factor: '',
  verleiher_dry_hire_1_day_conditions: '',
  verleiher_dry_hire_2_days_factor: '',
  verleiher_dry_hire_2_days_conditions: '',
  verleiher_dry_hire_3_4_days_factor: '',
  verleiher_dry_hire_3_4_days_conditions: '',
  verleiher_dry_hire_1_week_factor: '',
  verleiher_dry_hire_1_week_conditions: '',
  verleiher_material_handover: '',
  verleiher_emergency_support: '',
  verleiher_deposit: '',
  verleiher_payment_terms: '',
  verleiher_transport_costs: '',
  verleiher_insurance: '',
});

const SECTIONS = [
  {
    title: 'Mietpark & Service',
    fields: [
      { key: 'verleiher_storage_area', label: 'Lagerfläche (m²)', type: 'number' },
      {
        key: 'verleiher_service_model',
        label: 'Service-Modell',
        type: 'select',
        options: [
          ['dry_hire', 'Dry-Hire'],
          ['full_service', 'Full Service'],
          ['dry_hire_full_service', 'Dry-Hire + Full Service'],
        ],
      },
      {
        key: 'verleiher_own_fleet',
        label: 'Fuhrpark / Transport',
        type: 'select',
        options: [
          ['Eigene LKW', 'Eigene LKW'],
          ['Eigene Transporter', 'Eigene Transporter'],
          ['Spedition', 'Spedition'],
          ['Kein Fuhrpark', 'Kein Fuhrpark'],
        ],
        legacyValues: [['ja', 'Bisher Ja – bitte genauer auswählen'], ['nein', 'Bisher Nein – bitte genauer auswählen']],
      },
      {
        key: 'verleiher_24_7_support',
        label: 'Notfall-Support',
        type: 'select',
        options: [
          ['24/7 Hotline', '24/7 Hotline'],
          ['Bereitschaftsdienst', 'Bereitschaftsdienst'],
          ['Wochenend-Support', 'Wochenend-Support'],
          ['Support auf Anfrage', 'Support auf Anfrage'],
        ],
        legacyValues: [['ja', 'Bisher Ja – bitte genauer auswählen'], ['nein', 'Bisher Nein – bitte genauer auswählen']],
      },
    ],
  },
  {
    title: 'Mietpark-Portfolio',
    fields: [
      { key: 'verleiher_portfolio_ton', label: 'Ton', type: 'textarea' },
      { key: 'verleiher_portfolio_pulte', label: 'Pulte', type: 'textarea' },
      { key: 'verleiher_portfolio_licht', label: 'Licht', type: 'textarea' },
      { key: 'verleiher_portfolio_video', label: 'Video', type: 'textarea' },
      { key: 'verleiher_portfolio_rigging', label: 'Rigging', type: 'textarea' },
    ],
  },
  {
    title: 'Logistik & Prüfstandards',
    fields: [
      { key: 'verleiher_electrical_inspection', label: 'Elektrische Prüfung', type: 'textarea' },
      { key: 'verleiher_motors_hoists', label: 'Motoren & Hebezeuge', type: 'textarea' },
      { key: 'verleiher_packaging', label: 'Verpackung', type: 'textarea' },
      { key: 'verleiher_fleet_standards', label: 'Fuhrpark', type: 'textarea' },
    ],
  },
  {
    title: 'Dry-Hire-Staffelung',
    fields: [
      { key: 'verleiher_dry_hire_1_day_factor', label: '1 Einsatztag – Berechnungsfaktor', type: 'text' },
      { key: 'verleiher_dry_hire_1_day_conditions', label: '1 Einsatztag – Konditionen', type: 'textarea' },
      { key: 'verleiher_dry_hire_2_days_factor', label: '2 Einsatztage – Berechnungsfaktor', type: 'text' },
      { key: 'verleiher_dry_hire_2_days_conditions', label: '2 Einsatztage – Konditionen', type: 'textarea' },
      { key: 'verleiher_dry_hire_3_4_days_factor', label: '3–4 Einsatztage – Berechnungsfaktor', type: 'text' },
      { key: 'verleiher_dry_hire_3_4_days_conditions', label: '3–4 Einsatztage – Konditionen', type: 'textarea' },
      { key: 'verleiher_dry_hire_1_week_factor', label: '1 Woche – Berechnungsfaktor', type: 'text' },
      { key: 'verleiher_dry_hire_1_week_conditions', label: '1 Woche – Konditionen', type: 'textarea' },
    ],
  },
  {
    title: 'Mietbedingungen',
    fields: [
      { key: 'verleiher_material_handover', label: 'Materialausgabe', type: 'textarea' },
      { key: 'verleiher_emergency_support', label: '24/7 Notfall-Support', type: 'textarea' },
      { key: 'verleiher_deposit', label: 'Kaution / Sicherheitsleistung', type: 'textarea' },
      { key: 'verleiher_payment_terms', label: 'Zahlungsziel', type: 'textarea' },
      { key: 'verleiher_transport_costs', label: 'Transportkosten', type: 'textarea' },
      { key: 'verleiher_insurance', label: 'Versicherung', type: 'textarea' },
    ],
  },
];

const FIELD_CLASS =
  'w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-cyan-500 focus:outline-none';

const getProfileData = (profile) => {
  if (!profile?.profile_json) return profile;

  const parsedProfile =
    typeof profile.profile_json === 'string'
      ? JSON.parse(profile.profile_json)
      : profile.profile_json;

  return { ...profile, ...parsedProfile, id: profile.id };
};

const hasValue = (value) =>
  value !== undefined && value !== null && String(value).trim() !== '';

const getFormData = (profile) => ({
  ...createEmptyForm(),
  ...Object.fromEntries(
    Object.keys(createEmptyForm()).map((key) => [key, profile[key] ?? ''])
  ),
});

function renderField(field, value, onChange) {
  if (field.type === 'select') {
    return (
      <select
        id={field.key}
        name={field.key}
        value={value}
        onChange={onChange}
        className={FIELD_CLASS}
      >
        <option value="">Nicht angegeben</option>
        {field.legacyValues?.map(([optionValue, label]) => (
          <option key={optionValue} value={optionValue}>{label}</option>
        ))}
        {field.options.map(([optionValue, label]) => (
          <option key={optionValue} value={optionValue}>{label}</option>
        ))}
      </select>
    );
  }

  const Input = field.type === 'textarea' ? 'textarea' : 'input';
  return (
    <Input
      id={field.key}
      name={field.key}
      type={field.type === 'number' ? 'number' : undefined}
      min={field.type === 'number' ? '0' : undefined}
      step={field.type === 'number' ? 'any' : undefined}
      rows={field.type === 'textarea' ? 3 : undefined}
      value={value}
      onChange={onChange}
      className={FIELD_CLASS}
    />
  );
}

export default function VerleiherBusinessBox({ currentProfileId, isOwner }) {
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
          throw new Error('Verleiher-Profil konnte nicht gefunden werden.');
        }

        const loadedProfile = getProfileData(found);
        if (!isActive) return;

        setProfile(loadedProfile);
        setFormData(getFormData(loadedProfile));
        setError('');
      } catch (loadError) {
        console.error('Fehler beim Laden der Verleiher-Daten:', loadError);
        if (isActive) {
          setError('Verleiher-Daten konnten nicht geladen werden.');
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
        throw new Error('Verleiher-Profil konnte vor dem Speichern nicht geladen werden.');
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
        throw new Error(result.error || 'Verleiher-Daten konnten nicht gespeichert werden.');
      }

      setProfile({ ...updatedProfile, id: profileId });
      setIsEditing(false);
    } catch (saveError) {
      console.error('Fehler beim Speichern der Verleiher-Daten:', saveError);
      setError(saveError.message || 'Verleiher-Daten konnten nicht gespeichert werden.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-cyan-400 animate-pulse mt-4">
        // MIETPARK &amp; SERVICE WIRD GELADEN...
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
          // Verleiher-Business
        </span>
        {canEdit && !isEditing && (
          <button
            type="button"
            data-profile-edit-trigger
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 text-[10px] font-black tracking-wider uppercase hover:border-cyan-500 transition-all"
          >
            Daten bearbeiten
          </button>
        )}
      </div>

      {isEditing && canEdit ? (
        <form onSubmit={handleSave} className="space-y-6">
          {SECTIONS.map((section) => (
            <fieldset key={section.title} className="space-y-3">
              <legend className="mb-3 text-[10px] font-black uppercase tracking-widest text-cyan-400">
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
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-60 uppercase text-[10px] font-black tracking-wider"
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
                <h3 className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                  {section.title}
                </h3>
                {values.length > 0 ? (
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {values.map((field) => {
                      const value = formData[field.key];
                      const option = field.options?.find(
                        ([optionValue]) => optionValue === value
                      );
                      const legacyOption = field.legacyValues?.find(
                        ([optionValue]) => optionValue === value
                      );

                      return (
                        <div key={field.key} className="min-w-0">
                          <dt className="text-slate-500">{field.label}</dt>
                          <dd className="text-slate-200 whitespace-pre-wrap break-words">
                            {option?.[1] || (legacyOption ? 'Bitte Auswahl ergänzen' : value)}
                            {field.type === 'number' && ' m²'}
                          </dd>
                        </div>
                      );
                    })}
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

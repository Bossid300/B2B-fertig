import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { getProfilesDb, saveProfile } from '../../services/apiService';

const createEmptyForm = () => ({
  logistics_fleet_kpi: '',
  logistics_personnel_pool_kpi: '',
  logistics_operating_radius_kpi: '',
  logistics_hotline_kpi: '',
  logistics_company_dispatch: '',
  logistics_location_radius: '',
  logistics_fleet_capacity: '',
  logistics_personnel_pool: '',
  logistics_transport_insurance: '',
  logistics_contact_availability: '',
  logistics_equipment_backline_transport: '',
  logistics_stagehands_setup: '',
  logistics_forklift_handling: '',
  logistics_artist_vip_shuttle: '',
  logistics_returnables_storage: '',
  logistics_licenses_certificates: '',
  logistics_safety_occupational: '',
  logistics_loading_transport_equipment: '',
  logistics_on_site_communication: '',
  logistics_rate_stagehand: '',
  logistics_rate_crew_chief: '',
  logistics_rate_sprinter: '',
  logistics_rate_truck: '',
  logistics_transport_crew_inquiries: '',
});

const KPI_FIELDS = [
  { key: 'logistics_fleet_kpi', label: 'Fuhrpark', placeholder: 'z. B. 6 Fahrzeuge' },
  { key: 'logistics_personnel_pool_kpi', label: 'Personalpool', placeholder: 'z. B. 45' },
  { key: 'logistics_operating_radius_kpi', label: 'Einsatzradius', placeholder: 'z. B. DACH & EU Tourneen' },
  { key: 'logistics_hotline_kpi', label: '24/7 Hotline', placeholder: 'z. B. Ja' },
];

const SECTIONS = [
  {
    title: 'UNTERNEHMENSPROFIL & KAPAZITÄTEN',
    fields: [
      { key: 'logistics_company_dispatch', label: 'Unternehmen & Dispo', type: 'textarea' },
      { key: 'logistics_location_radius', label: 'Standort & Einsatzradius', type: 'textarea' },
      { key: 'logistics_fleet_capacity', label: 'Fuhrpark & Ladevolumen', type: 'textarea' },
      { key: 'logistics_personnel_pool', label: 'Personalpool (Hands/Fahrer)', type: 'textarea' },
      { key: 'logistics_transport_insurance', label: 'Transport- & Frachtversicherung', type: 'textarea' },
      { key: 'logistics_contact_availability', label: 'Kontakt & Erreichbarkeit', type: 'textarea' },
    ],
  },
  {
    title: 'LOGISTIK- & SUPPORTLEISTUNGEN',
    fields: [
      { key: 'logistics_equipment_backline_transport', label: 'Equipment- & Backline-Transporte', type: 'textarea' },
      { key: 'logistics_stagehands_setup', label: 'Stagehands & Auf-/Abbauhilfe', type: 'textarea' },
      { key: 'logistics_forklift_handling', label: 'Stapler- & Flurförderzeug-Logistik', type: 'textarea' },
      { key: 'logistics_artist_vip_shuttle', label: 'Artist-, VIP- & Crew-Shuttle', type: 'textarea' },
      { key: 'logistics_returnables_storage', label: 'Leergut- & Lager-Management', type: 'textarea' },
    ],
  },
  {
    title: 'QUALIFIKATIONEN & EIGENES LOGISTIK-EQUIPMENT',
    fields: [
      { key: 'logistics_licenses_certificates', label: 'Fahrer- & Bedienerscheine', type: 'textarea' },
      { key: 'logistics_safety_occupational', label: 'Sicherheit & Arbeitsschutz', type: 'textarea' },
      { key: 'logistics_loading_transport_equipment', label: 'Verlade- & Transportmittel', type: 'textarea' },
      { key: 'logistics_on_site_communication', label: 'Kommunikation vor Ort', type: 'textarea' },
    ],
  },
  {
    title: 'B2B-KONDITIONEN & KALKULATIONSBASIS',
    fields: [
      { key: 'logistics_rate_stagehand', label: 'Stagehand / Logistikhelfer', type: 'textarea' },
      { key: 'logistics_rate_crew_chief', label: 'Crew-Chief / Staplerfahrer', type: 'textarea' },
      { key: 'logistics_rate_sprinter', label: '3,5t Sprinter inkl. Fahrer', type: 'textarea' },
      { key: 'logistics_rate_truck', label: '7,5t / 12t LKW inkl. Fahrer', type: 'textarea' },
      { key: 'logistics_transport_crew_inquiries', label: 'Transport- & Crew-Anfragen', type: 'textarea' },
    ],
  },
];

const FIELD_CLASS =
  'w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-blue-500 focus:outline-none';

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
        {field.options.map(([optionValue, label]) => (
          <option key={optionValue} value={optionValue}>
            {label}
          </option>
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

export default function LogisticsBusinessBox({ currentProfileId, isOwner }) {
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
      setProfile(null);
      try {
        const profiles = await getProfilesDb(currentProfileId);
        const found = profiles.find(
          (item) => String(item?.id) === String(currentProfileId)
        );

        if (!found) {
          throw new Error('Logistik-Profil konnte nicht gefunden werden.');
        }

        const loadedProfile = getProfileData(found);
        if (!isActive) return;

        setProfile(loadedProfile);
        setFormData(getFormData(loadedProfile));
        setError('');
      } catch (loadError) {
        console.error('Fehler beim Laden der Logistik-Daten:', loadError);
        if (isActive) {
          setError('Logistik-Daten konnten nicht geladen werden.');
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
        throw new Error('Logistik-Profil konnte vor dem Speichern nicht geladen werden.');
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
        throw new Error(result.error || 'Logistik-Daten konnten nicht gespeichert werden.');
      }

      setProfile({ ...updatedProfile, id: profileId });
      setIsEditing(false);
    } catch (saveError) {
      console.error('Fehler beim Speichern der Logistik-Daten:', saveError);
      setError(saveError.message || 'Logistik-Daten konnten nicht gespeichert werden.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-blue-400 animate-pulse mt-4">
        // LOGISTIK-DATEN WERDEN GELADEN...
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
          // Logistik-Business
        </span>
        {canEdit && !isEditing && (
          <button
            type="button"
            data-profile-edit-trigger
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-blue-400 text-[10px] font-black tracking-wider uppercase hover:border-blue-500 transition-all"
          >
            Daten bearbeiten
          </button>
        )}
      </div>

      {isEditing && canEdit ? (
        <form onSubmit={handleSave} className="space-y-6">
          <fieldset className="space-y-3">
            <legend className="mb-3 text-[10px] font-black uppercase tracking-widest text-blue-400">
              KPI-Karten im LogisticsSheet
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {KPI_FIELDS.map((field) => (
                <label
                  key={field.key}
                  htmlFor={field.key}
                  className="flex flex-col gap-1 text-xs text-slate-400"
                >
                  <span>{field.label}</span>
                  <input
                    id={field.key}
                    name={field.key}
                    type="text"
                    value={formData[field.key]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={FIELD_CLASS}
                  />
                </label>
              ))}
            </div>
          </fieldset>

          {SECTIONS.map((section) => (
            <fieldset key={section.title} className="space-y-3">
              <legend className="mb-3 text-[10px] font-black uppercase tracking-widest text-blue-400">
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
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-500 text-slate-950 hover:bg-blue-400 disabled:opacity-60 uppercase text-[10px] font-black tracking-wider"
            >
              <Save size={12} />
              {isSaving ? 'Speichert...' : 'Speichern'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <section className="space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-400">
              KPI-Karten im LogisticsSheet
            </h3>
            {KPI_FIELDS.some((field) => hasValue(formData[field.key])) ? (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {KPI_FIELDS.filter((field) => hasValue(formData[field.key])).map((field) => (
                  <div key={field.key} className="min-w-0">
                    <dt className="text-slate-500">{field.label}</dt>
                    <dd className="text-slate-200 whitespace-pre-wrap break-words">
                      {formData[field.key]}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-xs text-slate-500">Keine Angaben hinterlegt.</p>
            )}
          </section>

          {SECTIONS.map((section) => {
            const values = section.fields.filter((field) =>
              hasValue(formData[field.key])
            );

            return (
              <section key={section.title} className="space-y-2">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                  {section.title}
                </h3>
                {values.length > 0 ? (
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {values.map((field) => {
                      const value = formData[field.key];
                      const option = field.options?.find(
                        ([optionValue]) => optionValue === value
                      );

                      return (
                        <div key={field.key} className="min-w-0">
                          <dt className="text-slate-500">{field.label}</dt>
                          <dd className="text-slate-200 whitespace-pre-wrap break-words">
                            {option?.[1] || value}
                            {field.type === 'number' && ' €'}
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

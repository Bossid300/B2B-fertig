import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { getProfilesDb, saveProfile } from '../../services/apiService';

const createEmptyForm = () => ({
  security_company_management: '',
  security_location_radius: '',
  security_staff_pool_scalability: '',
  security_personnel_pool: '',
  security_max_team_size: '',
  security_operating_radius: '',
  security_247_dispatch: '',
  security_authorizations: '',
  security_insurance: '',
  security_contact_availability: '',
  security_service_access_control: '',
  security_service_stage_backstage: '',
  security_service_vip_artist: '',
  security_service_site_security: '',
  security_service_concepts_authorities: '',
  security_qualification_personnel: '',
  security_communication: '',
  security_control_equipment: '',
  security_appearance_clothing: '',
  security_price_security_staff: '',
  security_price_shift_lead: '',
  security_price_night_watch_setup: '',
  security_minimum_assignment: '',
  security_payment_terms: '',
});

const SECTIONS = [
  {
    title: 'UNTERNEHMENSPROFIL & EINSATZKENNZAHLEN',
    fields: [
      { key: 'security_company_management', label: 'Unternehmen & Leitung' },
      { key: 'security_location_radius', label: 'Standort & Aktionsradius' },
      { key: 'security_staff_pool_scalability', label: 'Personalpool & Skalierbarkeit' },
      { key: 'security_personnel_pool', label: 'Personalpool' },
      { key: 'security_max_team_size', label: 'Maximale Teamgröße' },
      { key: 'security_operating_radius', label: 'Einsatzradius' },
      { key: 'security_247_dispatch', label: '24/7 Bereitschaft' },
      { key: 'security_authorizations', label: 'Behördliche Zulassung' },
      { key: 'security_insurance', label: 'Versicherungsschutz' },
      { key: 'security_contact_availability', label: 'Kontakt & Erreichbarkeit' },
    ],
  },
  {
    title: 'LEISTUNGSSPEKTRUM FÜR VERANSTALTER',
    fields: [
      { key: 'security_service_access_control', label: 'Einlass- & Zugangskontrollen', multiline: true },
      { key: 'security_service_stage_backstage', label: 'Bühnengraben & Backstage-Schutz', multiline: true },
      { key: 'security_service_vip_artist', label: 'VIP- & Artist-Begleitschutz', multiline: true },
      { key: 'security_service_site_security', label: 'Geländesicherung & Nachtwachen', multiline: true },
      { key: 'security_service_concepts_authorities', label: 'Sicherheitskonzepte & Behördenabstimmung', multiline: true },
    ],
  },
  {
    title: 'QUALIFIKATIONEN & TECHNISCHE AUSSTATTUNG',
    fields: [
      { key: 'security_qualification_personnel', label: 'Personal-Qualifikation', multiline: true },
      { key: 'security_communication', label: 'Kommunikation', multiline: true },
      { key: 'security_control_equipment', label: 'Kontroll-Equipment', multiline: true },
      { key: 'security_appearance_clothing', label: 'Auftreten & Dienstkleidung', multiline: true },
    ],
  },
  {
    title: 'B2B-KONDITIONEN & ABRECHNUNGSRAHMEN',
    fields: [
      { key: 'security_price_security_staff', label: 'Sicherheitsmitarbeiter (Preis)' },
      { key: 'security_price_shift_lead', label: 'Einsatzleiter / Schichtführer (Preis)' },
      { key: 'security_price_night_watch_setup', label: 'Nachtwache / Auf- & Abbau (Preis)' },
      { key: 'security_minimum_assignment', label: 'Mindesteinsatzzeit' },
      { key: 'security_payment_terms', label: 'Zahlungsziel' },
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

const getFormData = (profile) => ({
  ...createEmptyForm(),
  ...Object.fromEntries(
    Object.keys(createEmptyForm()).map((key) => [key, profile[key] ?? ''])
  ),
});

const hasValue = (value) =>
  value !== undefined && value !== null && String(value).trim() !== '';

export default function SecurityBusinessBox({ currentProfileId, isOwner }) {
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
          throw new Error('Security-Profil konnte nicht gefunden werden.');
        }

        const loadedProfile = getProfileData(found);
        if (!isActive) return;

        setProfile(loadedProfile);
        setFormData(getFormData(loadedProfile));
        setError('');
      } catch (loadError) {
        console.error('Fehler beim Laden der Security-Daten:', loadError);
        if (isActive) {
          setError('Security-Daten konnten nicht geladen werden.');
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
        throw new Error('Security-Profil konnte vor dem Speichern nicht geladen werden.');
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
        throw new Error(result.error || 'Security-Daten konnten nicht gespeichert werden.');
      }

      setProfile({ ...updatedProfile, id: profileId });
      setIsEditing(false);
    } catch (saveError) {
      console.error('Fehler beim Speichern der Security-Daten:', saveError);
      setError(saveError.message || 'Security-Daten konnten nicht gespeichert werden.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-cyan-400 animate-pulse mt-4">
        // SECURITY-DATEN WERDEN GELADEN...
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
          // Security-Business
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
                {section.fields.map((field) => {
                  const Input = field.multiline ? 'textarea' : 'input';
                  return (
                    <label
                      key={field.key}
                      htmlFor={field.key}
                      className={`flex flex-col gap-1 text-xs text-slate-400 ${
                        field.multiline ? 'sm:col-span-2' : ''
                      }`}
                    >
                      <span>{field.label}</span>
                      <Input
                        id={field.key}
                        name={field.key}
                        rows={field.multiline ? 3 : undefined}
                        value={formData[field.key]}
                        onChange={handleChange}
                        className={FIELD_CLASS}
                      />
                    </label>
                  );
                })}
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
                    {values.map((field) => (
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
            );
          })}
          {error && <p role="alert" className="text-xs text-red-400">{error}</p>}
        </div>
      )}
    </section>
  );
}

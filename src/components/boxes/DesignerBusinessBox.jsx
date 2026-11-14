import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { getProfilesDb, saveProfile } from '../../services/apiService';

const createEmptyForm = () => ({
  designer_experience_kpi: '',
  designer_disciplines_kpi: '',
  designer_formats_kpi: '',
  designer_references_kpi: '',
  designer_studio_creative_lead: '',
  designer_location_working_method: '',
  designer_core_disciplines: '',
  designer_professional_experience: '',
  designer_delivery_formats: '',
  designer_portfolio_link: '',
  designer_service_stage_set_design: '',
  designer_service_3d_visualization: '',
  designer_service_event_branding: '',
  designer_service_print_signage_site_graphics: '',
  designer_service_artist_release_design: '',
  designer_software_cad_light_previs: '',
  designer_software_3d_modelling_motion: '',
  designer_software_graphics_layout_print: '',
  designer_software_production_interface: '',
  designer_rate_hourly: '',
  designer_rate_daily: '',
  designer_package_event_key_visual_social_kit: '',
  designer_package_3d_stage_design_cad_plan: '',
});

const KPI_FIELDS = [
  {
    key: 'designer_experience_kpi',
    label: 'Berufserfahrung',
    placeholder: 'z. B. 9+ Jahre',
  },
  {
    key: 'designer_disciplines_kpi',
    label: 'Kern-Disziplinen',
    placeholder: 'z. B. 4',
  },
  {
    key: 'designer_formats_kpi',
    label: 'Lieferformate',
    placeholder: 'z. B. 6',
  },
  {
    key: 'designer_references_kpi',
    label: 'Referenzen',
    placeholder: 'z. B. 12',
  },
];

const SECTIONS = [
  {
    title: 'DESIGNER-PROFIL & ECKDATEN',
    fields: [
      { key: 'designer_studio_creative_lead', label: 'Studio & Creative Lead', multiline: true },
      { key: 'designer_location_working_method', label: 'Standort & Arbeitsweise', multiline: true },
      { key: 'designer_core_disciplines', label: 'Kern-Disziplinen', multiline: true },
      { key: 'designer_professional_experience', label: 'Berufserfahrung', multiline: true },
      { key: 'designer_delivery_formats', label: 'Lieferformate', multiline: true },
      { key: 'designer_portfolio_link', label: 'Portfolio-Link' },
    ],
  },
  {
    title: 'LEISTUNGSSPEKTRUM FÜR VERANSTALTER, BANDS & LOCATIONS',
    fields: [
      { key: 'designer_service_stage_set_design', label: 'Bühnen- & Set-Design (3D & CAD)', multiline: true },
      { key: 'designer_service_3d_visualization', label: 'Fotorealistische 3D-Visualisierung', multiline: true },
      { key: 'designer_service_event_branding', label: 'Event-Branding & Key-Visuals', multiline: true },
      { key: 'designer_service_print_signage_site_graphics', label: 'Print-, Wegeleit- & Gelände-Grafik', multiline: true },
      { key: 'designer_service_artist_release_design', label: 'Artist- & Release-Design', multiline: true },
    ],
  },
  {
    title: 'SOFTWARE-STACK & TECHNISCHE STANDARDS',
    fields: [
      { key: 'designer_software_cad_light_previs', label: 'CAD & Licht-Pre-Viz', multiline: true },
      { key: 'designer_software_3d_modelling_motion', label: '3D-Modelling & Motion', multiline: true },
      { key: 'designer_software_graphics_layout_print', label: 'Grafik, Layout & Print', multiline: true },
      { key: 'designer_software_production_interface', label: 'Produktions-Schnittstelle', multiline: true },
    ],
  },
  {
    title: 'B2B-KONDITIONEN & PAKETPREISE',
    fields: [
      { key: 'designer_rate_hourly', label: 'Stundensatz Design / CAD / Grafik' },
      { key: 'designer_rate_daily', label: 'Tagessatz Creative & CAD-Planung' },
      { key: 'designer_package_event_key_visual_social_kit', label: 'Paket: Event-Key-Visual & Social-Media-Kit', multiline: true },
      { key: 'designer_package_3d_stage_design_cad_plan', label: 'Paket: 3D-Stage-Design inkl. CAD-Plan', multiline: true },
    ],
  },
];

const FIELD_CLASS =
  'w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-violet-500 focus:outline-none';

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

export default function DesignerBusinessBox({ currentProfileId, isOwner }) {
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
          throw new Error('Designer-Profil konnte nicht gefunden werden.');
        }

        const loadedProfile = getProfileData(found);
        if (!isActive) return;

        setProfile(loadedProfile);
        setFormData(getFormData(loadedProfile));
        setError('');
      } catch (loadError) {
        console.error('Fehler beim Laden der Designer-Daten:', loadError);
        if (isActive) {
          setError('Designer-Daten konnten nicht geladen werden.');
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
        throw new Error('Designer-Profil konnte vor dem Speichern nicht geladen werden.');
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
        throw new Error(result.error || 'Designer-Daten konnten nicht gespeichert werden.');
      }

      setProfile({ ...updatedProfile, id: profileId });
      setIsEditing(false);
    } catch (saveError) {
      console.error('Fehler beim Speichern der Designer-Daten:', saveError);
      setError(saveError.message || 'Designer-Daten konnten nicht gespeichert werden.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-violet-400 animate-pulse mt-4">
        // DESIGNER-DATEN WERDEN GELADEN...
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
          // Designer-Business
        </span>
        {canEdit && !isEditing && (
          <button
            type="button"
            data-profile-edit-trigger
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-violet-400 text-[10px] font-black tracking-wider uppercase hover:border-violet-500 transition-all"
          >
            Daten bearbeiten
          </button>
        )}
      </div>

      {isEditing && canEdit ? (
        <form onSubmit={handleSave} className="space-y-6">
          <fieldset className="space-y-3">
            <legend className="mb-3 text-[10px] font-black uppercase tracking-widest text-violet-400">
              KPI-Karten
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
              <legend className="mb-3 text-[10px] font-black uppercase tracking-widest text-violet-400">
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
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-violet-500 text-slate-950 hover:bg-violet-400 disabled:opacity-60 uppercase text-[10px] font-black tracking-wider"
            >
              <Save size={12} />
              {isSaving ? 'Speichert...' : 'Speichern'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <section className="space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-violet-400">
              KPI-Karten
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
                <h3 className="text-[10px] font-black uppercase tracking-widest text-violet-400">
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

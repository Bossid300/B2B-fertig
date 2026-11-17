import { useEffect, useState } from 'react';
import { Save, X, Edit3 } from 'lucide-react';
import { getProfilesDb, saveProfile } from '../../services/apiService';

const KPI_FIELDS = [
  { key: 'fan_events_attended_kpi', label: 'Besuchte Events', type: 'number' },
  { key: 'fan_referred_members_kpi', label: 'Geworbene Mitglieder', type: 'number' },
  { key: 'fan_street_team_kpi', label: 'Street-Team', type: 'text' },
  { key: 'fan_supporter_level_kpi', label: 'Supporter-Level', type: 'text' },
];

const SECTIONS = [
  {
    title: 'FAN-STAMMDATEN & COMMUNITY-KENNZAHLEN',
    fields: [
      { key: 'fan_supporter_level_badges', label: 'Supporter-Level & Badges' },
      { key: 'fan_home_region_radius', label: 'Heimatregion & Radius' },
      { key: 'fan_mobility_carpooling', label: 'Mobilität & Carpooling' },
      { key: 'fan_community_network', label: 'Community-Netzwerk' },
      { key: 'fan_social_channels', label: 'Social-Kanäle' },
    ],
  },
  {
    title: 'MUSIK-DNA & EVENT-PRÄFERENZEN',
    fields: [
      { key: 'fan_main_genres', label: 'Haupt-Genres' },
      { key: 'fan_preferred_event_formats', label: 'Bevorzugte Event-Formate' },
      { key: 'fan_favorite_network_acts', label: 'Favorisierte Acts im Netzwerk' },
      { key: 'fan_regular_venues', label: 'Stamm-Locations' },
    ],
  },
  {
    title: 'STREET-TEAM & SUPPORTER-ANGEBOT',
    fields: [
      { key: 'fan_local_promotion_word_of_mouth', label: 'Lokale Promotion & Mundpropaganda' },
      { key: 'fan_pre_release_demo_feedback', label: 'Pre-Release & Demo-Feedback' },
      { key: 'fan_crowdfunding_early_bird_support', label: 'Crowdfunding & Early-Bird-Support' },
      { key: 'fan_volunteer_event_crew_support', label: 'Freiwillige Event-Hilfe (Crew-Support)' },
    ],
  },
  {
    title: 'COMMUNITY & EINLADUNGEN',
    fields: [
      { key: 'fan_networking_guest_list_invitations', label: 'Vernetzung & Gästelisten-Einladungen' },
      { key: 'fan_vip_passes_support_programs', label: 'VIP-Pässe & Supportprogramme' },
      { key: 'fan_community_activities', label: 'Community-Aktivitäten' },
    ],
  },
];

const createEmptyForm = () => ({
  ...Object.fromEntries(KPI_FIELDS.map(({ key }) => [key, ''])),
  ...Object.fromEntries(
    SECTIONS.flatMap((section) => section.fields.map(({ key }) => [key, '']))
  ),
});

const FIELD_CLASS =
  'w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:border-cyan-400 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 resize-y';

const KPI_INPUT_CLASS =
  'w-full text-center bg-slate-950/80 border border-slate-700 rounded-lg px-2 py-1.5 text-sm font-bold text-cyan-300 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all';

const getProfileData = (profile) => {
  if (!profile?.profile_json) return profile;

  const parsedProfile =
    typeof profile.profile_json === 'string'
      ? JSON.parse(profile.profile_json)
      : profile.profile_json;

  return { ...profile, ...parsedProfile, id: profile.id };
};

const getFormData = (profile) => {
  const emptyForm = createEmptyForm();
  return Object.fromEntries(
    Object.keys(emptyForm).map((key) => [key, profile[key] ?? ''])
  );
};

const hasValue = (value) =>
  value !== undefined && value !== null && String(value).trim() !== '';

export default function FanCommunityBox({ currentProfileId, isOwner }) {
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
          throw new Error('Fan-Profil konnte nicht gefunden werden.');
        }

        const loadedProfile = getProfileData(found);
        if (!isActive) return;

        setProfile(loadedProfile);
        setFormData(getFormData(loadedProfile));
        setError('');
      } catch (loadError) {
        console.error('Fehler beim Laden der Fan-Community-Daten:', loadError);
        if (isActive) {
          setError('Fan-Community-Daten konnten nicht geladen werden.');
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
        throw new Error('Fan-Profil konnte vor dem Speichern nicht geladen werden.');
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
        throw new Error(result.error || 'Fan-Community-Daten konnten nicht gespeichert werden.');
      }

      setProfile({ ...updatedProfile, id: profileId });
      setIsEditing(false);
    } catch (saveError) {
      console.error('Fehler beim Speichern der Fan-Community-Daten:', saveError);
      setError(saveError.message || 'Fan-Community-Daten konnten nicht gespeichert werden.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-cyan-400 animate-pulse mt-4">
        // FAN-COMMUNITY-DATEN WERDEN GELADEN...
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
    <section className="w-full mx-auto bg-slate-950 border border-slate-900/80 p-6 rounded-3xl shadow-2xl font-mono text-white mt-4 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-xs font-black tracking-widest uppercase text-slate-200">
            // Fan-Community
          </span>
        </div>
        {canEdit && !isEditing && (
          <button
            type="button"
            data-profile-edit-trigger
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-cyan-400 text-[10px] font-black tracking-wider uppercase hover:border-cyan-500 hover:bg-slate-900 transition-all shadow-sm"
          >
            <Edit3 size={12} />
            Daten bearbeiten
          </button>
        )}
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {KPI_FIELDS.map((field) => (
          <div
            key={field.key}
            className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 text-center flex flex-col justify-between transition-all hover:border-slate-700"
          >
            {isEditing && canEdit ? (
              <div className="mb-1">
                <input
                  id={field.key}
                  name={field.key}
                  form="fan-community-edit-form"
                  type={field.type}
                  min={field.type === 'number' ? '0' : undefined}
                  step={field.type === 'number' ? '1' : undefined}
                  value={formData[field.key]}
                  onChange={handleChange}
                  aria-label={field.label}
                  className={KPI_INPUT_CLASS}
                />
              </div>
            ) : (
              <div className="text-xl font-black text-cyan-300 tracking-tight mb-1">
                {hasValue(formData[field.key]) ? formData[field.key] : '–'}
              </div>
            )}
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {field.label}
            </div>
          </div>
        ))}
      </div>

      {isEditing && canEdit ? (
        <form id="fan-community-edit-form" onSubmit={handleSave} className="space-y-6">
          {SECTIONS.map((section) => (
            <fieldset key={section.title} className="space-y-3 bg-slate-900/20 border border-slate-900/80 p-4 rounded-2xl">
              <legend className="px-2 text-[10px] font-black uppercase tracking-widest text-cyan-400">
                {section.title}
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {section.fields.map((field) => (
                  <label
                    key={field.key}
                    htmlFor={field.key}
                    className="flex flex-col gap-1.5 text-xs text-slate-300 font-medium"
                  >
                    <span className="text-[11px] text-slate-400">{field.label}</span>
                    <textarea
                      id={field.key}
                      name={field.key}
                      rows={3}
                      value={formData[field.key]}
                      onChange={handleChange}
                      placeholder="Keine Angaben hinterlegt..."
                      className={FIELD_CLASS}
                    />
                  </label>
                ))}
              </div>
            </fieldset>
          ))}

          {error && <p role="alert" className="text-xs text-red-400 font-medium px-1">{error}</p>}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-900">
            <button
              type="button"
              data-profile-action="cancel"
              onClick={() => {
                setFormData(getFormData(profile));
                setError('');
                setIsEditing(false);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white hover:border-slate-700 uppercase text-[10px] font-black tracking-wider transition-all"
            >
              <X size={12} />
              Abbrechen
            </button>
            <button
              type="submit"
              data-profile-action="save"
              disabled={isSaving}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-60 uppercase text-[10px] font-black tracking-wider shadow-lg shadow-cyan-500/20 transition-all"
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
              <section key={section.title} className="space-y-3 bg-slate-900/20 border border-slate-900/60 p-4 rounded-2xl">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                  {section.title}
                </h3>
                {values.length > 0 ? (
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                    {values.map((field) => (
                      <div key={field.key} className="min-w-0 bg-slate-950/40 p-3 rounded-xl border border-slate-900/80">
                        <dt className="text-slate-400 font-medium text-[11px] mb-1">{field.label}</dt>
                        <dd className="text-slate-200 whitespace-pre-wrap break-words leading-relaxed">
                          {formData[field.key]}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-xs text-slate-600 italic">Keine Angaben hinterlegt.</p>
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
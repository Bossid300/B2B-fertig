import { useEffect, useState } from 'react';
import ProfileFormFields from './ProfileFormFields.jsx';
import { getProfilesDb, saveProfile } from './services/apiService.js';

export default function ProfileSettings({ onBack, currentData, onSaveSuccess }) {
  const [profileId] = useState(() => String(
    currentData?.id || localStorage.getItem('gigsda_profile_id') || ''
  ));
  const [profile, setProfile] = useState(currentData || {});
  const [formData, setFormData] = useState(currentData || {});
  const [isLoading, setIsLoading] = useState(!currentData && Boolean(profileId));
  const [isReady, setIsReady] = useState(Boolean(currentData));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(
    !currentData && !profileId ? 'Profil-ID fehlt; Profildaten können nicht geladen werden.' : ''
  );

  useEffect(() => {
    if (currentData || !profileId) return;

    let isCurrent = true;
    getProfilesDb(profileId)
      .then(rows => {
        if (!isCurrent) return;
        const found = rows.find(row => String(row.id) === profileId);
        if (!found) {
          throw new Error('Das eigene Profil konnte nicht gefunden werden.');
        }

        const profileData = typeof found.profile_json === 'string'
          ? JSON.parse(found.profile_json)
          : {};
        delete profileData.profile_json;
        const mergedProfile = { ...found, ...profileData, id: profileId };
        delete mergedProfile.profile_json;
        setProfile(mergedProfile);
        setFormData(mergedProfile);
        setIsReady(true);
      })
      .catch(loadError => {
        if (isCurrent) setError(loadError.message || 'Profildaten konnten nicht geladen werden.');
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [currentData, profileId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);
    try {
      if (!profileId) {
        throw new Error('Profil-ID fehlt; Änderungen können nicht gespeichert werden.');
      }
      if (!isReady) {
        throw new Error('Profildaten sind nicht vollständig geladen; Änderungen wurden nicht gespeichert.');
      }
      const result = await saveProfile({
        profileId,
        profile: { ...profile, ...formData, id: profileId }
      });
      if (result?.success !== true) {
        throw new Error(result?.error || 'Änderungen konnten nicht gespeichert werden.');
      }
      onSaveSuccess?.(formData);
      onBack?.();
    } catch (saveError) {
      setError(saveError.message || 'Änderungen konnten nicht gespeichert werden.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl my-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase">// op-input.html</span>
          <h2 className="text-base font-black text-white">Profileingabemaske (Backstage)</h2>
        </div>
        <button type="button" onClick={onBack} className="text-xs text-slate-500 hover:text-white">Abbrechen</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-3 text-sm text-rose-200">{error}</p>}
        {isLoading ? (
          <p className="py-6 text-center text-sm text-slate-400">Profildaten werden geladen ...</p>
        ) : !isReady ? (
          <p className="py-6 text-center text-sm text-slate-400">Profil konnte nicht geladen werden. Bitte erneut versuchen.</p>
        ) : (
          <>
        <ProfileFormFields formData={formData} setFormData={setFormData} />
        <div className="pt-2 flex justify-end">
          <button type="submit" disabled={isSaving} className="bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-black px-6 h-10 rounded-xl text-xs shadow-lg transition-transform hover:scale-105 disabled:cursor-wait disabled:opacity-60">
            {isSaving ? 'Speichert ...' : 'Änderungen speichern'}
          </button>
        </div>
          </>
        )}
      </form>
    </div>
  );
}

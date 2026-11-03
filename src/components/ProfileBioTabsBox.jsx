import { useState, useEffect } from 'react';
import { FileText, Save, BookOpen, Briefcase, User, Eye, EyeOff } from 'lucide-react';
import { saveProfile } from '../services/apiService';
import { getProfilesDb } from '../services/apiService';

export default function ProfileBioTabsBox({ currentProfileId, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showBio, setShowBio] = useState(true);
  const [fieldVisibility, setFieldVisibility] = useState({
    einleitung: true,
    karriere: true,
    privates: true
  });

  // Dreigeteilte Text-Matrix für die Wikipedia-Struktur
  const [textMatrix, setTextMatrix] = useState({
    einleitung: '',
    karriere: '',
    privates: ''
  });

  const canEdit = isOwner || currentProfileId === localStorage.getItem('gigsda_profile_id');

  // 1. DATABASE PIPELINE: Lädt die geteilten Texte live aus DB
  useEffect(() => {
    getProfilesDb(currentProfileId)
      .then(profiles => {

        const found = profiles.find(
          p => p?.id === currentProfileId
        );

        if (!found) return;
        const profileData =
          found.profile_json
            ? JSON.parse(found.profile_json)
            : found;
        setProfile(profileData);
        setShowBio(
          profileData.show_bio !== false
        );
        setFieldVisibility({
          einleitung: profileData.show_bio_einleitung !== false,
          karriere: profileData.show_bio_karriere !== false,
          privates: profileData.show_bio_privates !== false
        });
        setTextMatrix({
          einleitung:
            profileData.bio_einleitung || '',
          karriere:
            profileData.bio_karriere || '',
          privates:
            profileData.bio_privates || ''
        });
      })
      .catch(console.error);
    
  }, [currentProfileId, isEditing]);

  const handleTextChange = (tabKey, value) => {
    setTextMatrix(prev => ({ ...prev, [tabKey]: value }));
  };

  // 2. SAVE PIPELINE: Brennt die Felder permanent in die DB
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = {
        ...profile,
        bio_einleitung: textMatrix.einleitung,
        bio_karriere: textMatrix.karriere,
        bio_privates: textMatrix.privates,
        show_bio: showBio,
        show_bio_einleitung: fieldVisibility.einleitung,
        show_bio_karriere: fieldVisibility.karriere,
        show_bio_privates: fieldVisibility.privates
      };
      const profileId =
        updatedProfile.id ||
        updatedProfile.profileId ||
        localStorage.getItem(
          'gigsda_profile_id'
        );
      await saveProfile({
        profileId,
        profile: updatedProfile
      });
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (e) {
      console.error(
        "Fehler beim Speichern der Biografie:",
        e
      );
    }
  };

  const toggleFieldVisibility = (field) => {
    setFieldVisibility(prev => ({ ...prev, [field]: !prev[field] }));
  };
  const visibleToOthers = (field) => canEdit || fieldVisibility[field];
  const hasVisibleBio = [
    visibleToOthers('einleitung') && textMatrix.einleitung,
    visibleToOthers('karriere') && textMatrix.karriere,
    visibleToOthers('privates') && textMatrix.privates
  ].some(Boolean);

  if (!canEdit && (!showBio || !hasVisibleBio)) return null;

  return (
    <div className="profile-bio w-full mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl text-white mt-4">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
            <BookOpen className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h2 className="text-base font-semibold tracking-wide text-white">Biografie & Karriere</h2>
            <p className="mt-0.5 text-xs text-slate-400">Persönliche Einblicke und Werdegang</p>
          </div>
        </div>
        {!isEditing && canEdit && (
          <button
            data-profile-edit-trigger onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5"
          >
            <FileText size={14} /> Bearbeiten
          </button>
        )}
        {isEditing && canEdit && (
          <button
            type="button"
            onClick={() => setShowBio(!showBio)}
            aria-label={showBio ? 'Biografie für andere ausblenden' : 'Biografie für andere anzeigen'}
            title={showBio ? 'Biografie für andere sichtbar' : 'Biografie privat'}
            className="rounded-lg border border-slate-700 p-2 text-slate-300"
          >
            {showBio ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="space-y-4">
          {visibleToOthers('einleitung') && textMatrix.einleitung && <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4 sm:p-5">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-violet-200">
              <FileText size={15} /> Einleitung
            </div>
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
              {textMatrix.einleitung}
            </p>
          </div>}

          {visibleToOthers('karriere') && textMatrix.karriere && <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4 sm:p-5">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Briefcase size={15} /> Karriere
            </div>
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
              {textMatrix.karriere}
            </p>
          </div>}

          {visibleToOthers('privates') && textMatrix.privates && <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4 sm:p-5">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-200">
              <User size={15} /> Persönliches
            </div>
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
              {textMatrix.privates}
            </p>
          </div>}

        </div>
      ) : (
        // --- BEARBEITUNGS-MODUS: Alle 3 Textbereiche übersichtlich untereinander ---
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-[10px] font-bold text-amber-400 uppercase font-mono">// EINLEITUNG TEXT</label>
              <button type="button" onClick={() => toggleFieldVisibility('einleitung')} aria-label="Sichtbarkeit Einleitung umschalten" title="Sichtbarkeit Einleitung umschalten" className="text-slate-300">
                {fieldVisibility.einleitung ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            </div>
            <textarea
              value={textMatrix.einleitung}
              onChange={(e) => handleTextChange('einleitung', e.target.value)}
              rows={4}
              placeholder="Allgemeine Einleitung zum Künstler..."
              className="w-full bg-[#11192e]/40 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono resize-y"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono">// KARRIERE DETAILS</label>
              <button type="button" onClick={() => toggleFieldVisibility('karriere')} aria-label="Sichtbarkeit Karriere umschalten" title="Sichtbarkeit Karriere umschalten" className="text-slate-300">
                {fieldVisibility.karriere ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            </div>
            <textarea
              value={textMatrix.karriere}
              onChange={(e) => handleTextChange('karriere', e.target.value)}
              rows={4}
              placeholder="Musikalische Meilensteine, Alben, Gigs..."
              className="w-full bg-[#11192e]/40 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono resize-y"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono">// PRIVATES / INSIDE INFOS</label>
              <button type="button" onClick={() => toggleFieldVisibility('privates')} aria-label="Sichtbarkeit Persönliches umschalten" title="Sichtbarkeit Persönliches umschalten" className="text-slate-300">
                {fieldVisibility.privates ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            </div>
            <textarea
              value={textMatrix.privates}
              onChange={(e) => handleTextChange('privates', e.target.value)}
              rows={4}
              placeholder="Persönlicher Hintergrund, Herkunft..."
              className="w-full bg-[#11192e]/40 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono resize-y"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800/60">
            <button
              type="button"
              data-profile-action="cancel" onClick={() => setIsEditing(false)}
              className="flex items-center gap-1 px-4 py-1.5 border border-slate-700 text-slate-300 text-[10px] font-bold rounded-xl uppercase tracking-wider hover:bg-slate-800/40 transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit" data-profile-action="save"
              className="flex items-center gap-1 px-5 py-1.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-[10px] font-bold rounded-xl uppercase tracking-wider transition-colors shadow-md"
            ><Save size={12} /> Speichern</button>
          </div>
        </form>
      )}
    </div>
  );
}

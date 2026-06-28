import React, { useState, useEffect } from 'react';
import { FileText, Save, Eye, EyeOff, BookOpen, Briefcase, User } from 'lucide-react';

export default function ProfileBioTabsBox({ currentProfileName, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showBio, setShowBio] = useState(true);

  // Dreigeteilte Text-Matrix für die Wikipedia-Struktur
  const [textMatrix, setTextMatrix] = useState({
    einleitung: '',
    karriere: '',
    privates: ''
  });

  const targetUser = currentProfileName || localStorage.getItem('gigsda_user_name') || 'grober lackl';
  const canEdit = isOwner || targetUser.toLowerCase() === (localStorage.getItem('gigsda_user_name') || '').toLowerCase();

  // 1. DATABASE PIPELINE: Lädt die geteilten Texte live aus gigsda_profiles
  useEffect(() => {
    const savedProfiles = localStorage.getItem('gigsda_profiles');
    if (savedProfiles) {
      try {
        const allProfiles = JSON.parse(savedProfiles);
        if (Array.isArray(allProfiles)) {
          const found = allProfiles.find(
            p => p && (p.name || p.user_name || p.display_name)?.trim().toLowerCase() === targetUser.trim().toLowerCase()
          );
          if (found) {
            setProfile(found);
            setShowBio(found.show_bio !== false);
            setTextMatrix({
              einleitung: found.bio_einleitung || found.bio || '', 
              karriere: found.bio_karriere || '',
              privates: found.bio_privates || ''
            });
          }
        }
      } catch (e) {
        console.error("Fehler in der Gigsda Biografie-Pipeline:", e);
      }
    }
  }, [targetUser, isEditing]);

  const handleTextChange = (tabKey, value) => {
    setTextMatrix(prev => ({ ...prev, [tabKey]: value }));
  };

  // 2. SAVE PIPELINE: Brennt die Felder permanent in die DB
  const handleSave = (e) => {
    e.preventDefault();
    try {
      const savedProfiles = localStorage.getItem('gigsda_profiles');
      let allProfiles = savedProfiles ? JSON.parse(savedProfiles) : [];
      
      const profileIndex = allProfiles.findIndex(
        p => p && (p.name || p.user_name || p.display_name)?.trim().toLowerCase() === targetUser.trim().toLowerCase()
      );

      const updatedFields = {
        bio_einleitung: textMatrix.einleitung,
        bio_karriere: textMatrix.karriere,
        bio_privates: textMatrix.privates,
        show_bio: showBio
      };

      if (profileIndex !== -1) {
        allProfiles[profileIndex] = { ...allProfiles[profileIndex], ...updatedFields };
      } else {
        allProfiles.push({ name: targetUser, ...updatedFields });
      }

      localStorage.setItem('gigsda_profiles', JSON.stringify(allProfiles));
      setIsEditing(false);
    } catch (e) {
      console.error("Fehler beim Speichern der Biografie:", e);
    }
  };

  return (
    <div className="bg-[#0b111e] border border-slate-800 p-6 rounded-2xl max-w-4xl mx-auto my-4 shadow-xl">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 border-b border-slate-800/60 pb-3">
        <h2 className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400" /> // Profile Encyclopedia Record
        </h2>
        {!isEditing && canEdit && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-[10px] font-bold rounded-xl uppercase tracking-wider transition-all border border-slate-700"
          >
            <FileText size={10} /> Texte bearbeiten
          </button>
        )}
      </div>

      {!isEditing ? (
        // --- ANZEIGE-MODUS: Alle 3 Sektionen fest untereinander für perfekten Print-Export ---
        <div className="space-y-6">
          
          {/* SEKTION 1: EINLEITUNG */}
          <div className="p-4 bg-slate-900/10 border border-slate-800/40 rounded-xl space-y-2">
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <FileText size={12} /> // Einleitung
            </div>
            <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap font-sans">
              {textMatrix.einleitung || 'Keine Einleitung hinterlegt.'}
            </p>
          </div>

          {/* SEKTION 2: KARRIERE */}
          <div className="p-4 bg-slate-900/10 border border-slate-800/40 rounded-xl space-y-2">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Briefcase size={12} /> // Karriere
            </div>
            <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap font-sans">
              {textMatrix.karriere || 'Keine Karriere-Details angegeben.'}
            </p>
          </div>

          {/* SEKTION 3: PRIVATES */}
          <div className="p-4 bg-slate-900/10 border border-slate-800/40 rounded-xl space-y-2">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <User size={12} /> // Privates
            </div>
            <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap font-sans">
              {textMatrix.privates || 'Keine privaten Zusatz-Infos vorhanden.'}
            </p>
          </div>

        </div>
      ) : (
        // --- BEARBEITUNGS-MODUS: Alle 3 Textbereiche übersichtlich untereinander ---
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-amber-400 uppercase mb-1.5 font-mono">// EINLEITUNG TEXT</label>
            <textarea
              value={textMatrix.einleitung}
              onChange={(e) => handleTextChange('einleitung', e.target.value)}
              rows={4}
              placeholder="Allgemeine Einleitung zum Künstler..."
              className="w-full bg-[#11192e]/40 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono resize-y"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 font-mono">// KARRIERE DETAILS</label>
            <textarea
              value={textMatrix.karriere}
              onChange={(e) => handleTextChange('karriere', e.target.value)}
              rows={4}
              placeholder="Musikalische Meilensteine, Alben, Gigs..."
              className="w-full bg-[#11192e]/40 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono resize-y"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 font-mono">// PRIVATES / INSIDE INFOS</label>
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
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1 px-4 py-1.5 border border-slate-700 text-slate-300 text-[10px] font-bold rounded-xl uppercase tracking-wider hover:bg-slate-800/40 transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex items-center gap-1 px-5 py-1.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-[10px] font-bold rounded-xl uppercase tracking-wider transition-colors shadow-md"
            >
              <Save size={10} /> Speichern
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

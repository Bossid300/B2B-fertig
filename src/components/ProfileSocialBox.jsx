import React, { useState, useEffect } from 'react';
import { Share2, Save, Eye, EyeOff, Globe } from 'lucide-react';

export default function ProfileSocialBox({ currentProfileName, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showSocials, setShowSocials] = useState(true);
  const [formData, setFormData] = useState({
    social_instagram: '',
    social_linkedin: '',
    social_spotify: '',
    social_youtube: ''
  });

  const targetUser = currentProfileName || localStorage.getItem('gigsda_user_name') || 'grober lackl';
  const canEdit = isOwner || targetUser.toLowerCase() === (localStorage.getItem('gigsda_user_name') || '').toLowerCase();

  // 1. DATABASE PIPELINE: Lädt die Social-Links live aus gigsda_profiles
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
            setShowSocials(found.show_socials !== false);
            setFormData({
              social_instagram: found.social_instagram || '',
              social_linkedin: found.social_linkedin || '',
              social_spotify: found.social_spotify || '',
              social_youtube: found.social_youtube || ''
            });
          }
        }
      } catch (e) {
        console.error("Fehler in der Gigsda Social-Pipeline:", e);
      }
    }
  }, [targetUser, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. SAVE PIPELINE: Sichert die Social-Links permanent in die DB
  const handleSave = (e) => {
    e.preventDefault();
    const savedProfiles = localStorage.getItem('gigsda_profiles');
    if (!savedProfiles) return;

    try {
      let allProfiles = JSON.parse(savedProfiles);
      if (!Array.isArray(allProfiles)) return;

      allProfiles = allProfiles.map(p => {
        if (p && (p.name || p.user_name || p.display_name)?.trim().toLowerCase() === targetUser.trim().toLowerCase()) {
          return { 
            ...p, 
            ...formData, 
            show_socials: showSocials 
          };
        }
        return p;
      });

      localStorage.setItem('gigsda_profiles', JSON.stringify(allProfiles));
      alert("B2B Web- & Social-Radar erfolgreich eingebrannt! 💾🌐");
      setIsEditing(false);
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error("Fehler beim Sichern der Social-Daten:", e);
    }
  };

  if (!profile) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-purple-400 animate-pulse">
        // SOCIAL RADAR PROTOKOLL INITIALISIERT...
      </div>
    );
  }

  const isVisible = showSocials || canEdit;
  if (!isVisible) return null;

  const hasAnyLink = formData.social_instagram || formData.social_linkedin || formData.social_spotify || formData.social_youtube;

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl font-mono text-white select-none mt-4">
      
      {/* HEADER DER BOX */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Share2 size={14} className="text-cyan-400" />
          <span className="text-xs font-black tracking-widest uppercase">// B2B SOCIAL-RADAR & WEB-LINKS</span>
        </div>
        
        <div className="flex items-center gap-2">
          {canEdit && isEditing && (
            <button 
              type="button" 
              onClick={() => setShowSocials(!showSocials)} 
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${showSocials ? 'text-cyan-400 border-cyan-500/30 bg-cyan-950/10' : 'text-slate-600 border-slate-800 bg-slate-900'}`}
            >
              {showSocials ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>
          )}
          {canEdit && !isEditing && (
            <button 
              type="button" 
              onClick={() => setIsEditing(true)} 
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 text-[10px] font-black tracking-wider uppercase hover:border-cyan-500 transition-all cursor-pointer"
            >
              ✏️ Kanäle
            </button>
          )}
        </div>
      </div>

      {/* TERNARY WEICHE: ANZEIGE ODER EDITIEREN */}
      {!isEditing ? (
        <div className="space-y-2">
          {!hasAnyLink ? (
            <div className="p-4 bg-slate-900/10 border border-slate-900 rounded-xl text-center text-xs text-slate-600 font-mono uppercase tracking-wide">
              // NOCH KEINE DIGITALEN NETZWERK-KANÄLE HINTERLEGT
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {formData.social_instagram && (
                <a href={formData.social_instagram} target="_blank" rel="noreferrer" className="p-3 bg-slate-900/40 border border-slate-900 rounded-xl flex items-center gap-2.5 group hover:border-cyan-500/40 transition-all cursor-pointer">
                  <Globe size={14} className="text-pink-500 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wide truncate text-slate-300 group-hover:text-cyan-400 transition-all">Instagram</span>
                </a>
              )}
              {formData.social_linkedin && (
                <a href={formData.social_linkedin} target="_blank" rel="noreferrer" className="p-3 bg-slate-900/40 border border-slate-900 rounded-xl flex items-center gap-2.5 group hover:border-cyan-500/40 transition-all cursor-pointer">
                  <Globe size={14} className="text-blue-500 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wide truncate text-slate-300 group-hover:text-cyan-400 transition-all">LinkedIn</span>
                </a>
              )}
              {formData.social_spotify && (
                <a href={formData.social_spotify} target="_blank" rel="noreferrer" className="p-3 bg-slate-900/40 border border-slate-900 rounded-xl flex items-center gap-2.5 group hover:border-cyan-500/40 transition-all cursor-pointer">
                  <Globe size={14} className="text-emerald-500 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wide truncate text-slate-300 group-hover:text-cyan-400 transition-all">Spotify</span>
                </a>
              )}
              {formData.social_youtube && (
                <a href={formData.social_youtube} target="_blank" rel="noreferrer" className="p-3 bg-slate-900/40 border border-slate-900 rounded-xl flex items-center gap-2.5 group hover:border-cyan-500/40 transition-all cursor-pointer">
                  <Globe size={14} className="text-rose-500 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wide truncate text-slate-300 group-hover:text-cyan-400 transition-all">YouTube</span>
                </a>
              )}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="p-3 bg-slate-900/20 border border-slate-900 rounded-2xl space-y-3">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">// DIGITAL NETWORK CHANNELS REKURSION</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold">// INSTAGRAM PROFILE URL</span>
                <input type="text" name="social_instagram" value={formData.social_instagram || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono" placeholder="https://instagram.com" />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold">// LINKEDIN B2B URL</span>
                <input type="text" name="social_linkedin" value={formData.social_linkedin || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono" placeholder="https://linkedin.com" />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold">// SPOTIFY ARTIST / PLAYLIST URL</span>
                <input type="text" name="social_spotify" value={formData.social_spotify || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono" placeholder="https://spotify.com..." />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold">// YOUTUBE CHANNEL / VIDEO URL</span>
                <input type="text" name="social_youtube" value={formData.social_youtube || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono" placeholder="https://youtube.com..." />
              </div>
            </div>
          </div>

          {/* CONTROL STRIP */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-900">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white uppercase text-[10px] font-black cursor-pointer">Abbrechen</button>
            <button type="submit" className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-600 text-slate-950 hover:bg-cyan-500 uppercase text-[10px] font-black tracking-wider cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"><Save size={12} /> Kanäle Einbrennen ✓</button>
          </div>
        </form>
      )}
    </div>
  );
}

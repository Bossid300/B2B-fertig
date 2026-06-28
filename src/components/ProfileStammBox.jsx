import React, { useState, useEffect } from 'react';
import { Pencil, Save, User, Eye, EyeOff } from 'lucide-react';

export default function ProfileStammBox({ currentProfileName, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});

  const targetUser = currentProfileName || localStorage.getItem('gigsda_user_name') || 'grober lackl';
  const canEdit = isOwner || targetUser.toLowerCase() === (localStorage.getItem('gigsda_user_name') || '').toLowerCase();

  // 1. DATABASE PIPELINE: Lädt Stammdaten & Sichtbarkeits-Flags (Default: true)
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
            setFormData({
              role: found.role || 'Künstler',
              avatarUrl: found.avatarUrl || '',
              category: found.category || found.project_name || '',
              Klarname: found.Klarname || '',
              name: found.name || targetUser,
              vorname: found.vorname || '',
              nachname: found.nachname || '',
              plz: found.plz || '',
              city: found.city || '',
              street: found.street || '',
              phone: found.phone || '',
              email: found.email || '',
              website: found.website || '',
              genre: found.genre || '',
              id: found.id || '',
              ticketName: found.ticketName || targetUser,
              description: found.description || '',
              
              // Privacy Flags
              show_category: found.show_category !== false,
              show_Klarname: found.show_Klarname !== false,
              show_name: found.show_name !== false,
              show_name_real: found.show_name_real !== false,
              show_phone: found.show_phone !== false,
              show_email: found.show_email !== false,
              show_address: found.show_address !== false,
              show_website: found.show_website !== false,
              show_genre: found.show_genre !== false,
              show_description: found.show_description !== false,
              show_avatarUrl: found.show_avatarUrl !== false
            });
          }
        }
      } catch (e) {
        console.error("Fehler beim Laden der Gigsda-Stammdaten:", e);
      }
    }
  }, [targetUser, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleVisibility = (fieldName) => {
    setFormData(prev => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  // 2. SAVE PIPELINE: Brennt Daten & Augen-Zustände sicher in die DB
  const handleSave = (e) => {
    e.preventDefault();
    const savedProfiles = localStorage.getItem('gigsda_profiles');
    if (!savedProfiles) return;

    try {
      let allProfiles = JSON.parse(savedProfiles);
      if (!Array.isArray(allProfiles)) return;

      allProfiles = allProfiles.map(p => {
        if (p && (p.name || p.user_name || p.display_name)?.trim().toLowerCase() === targetUser.trim().toLowerCase()) {
          const updatedProfile = { ...p, ...formData };
          delete updatedProfile.project_name; 
          return updatedProfile;
        }
        return p;
      });

      localStorage.setItem('gigsda_profiles', JSON.stringify(allProfiles));
      
      if (targetUser.toLowerCase() === (localStorage.getItem('gigsda_user_name') || '').toLowerCase()) {
        if (formData.name) localStorage.setItem('gigsda_user_name', formData.name);
      }

      alert("Stammdaten & Sichtbarkeiten erfolgreich eingeregelt! 💾");
      setIsEditing(false);
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error("Fehler beim Brennen der Stammdaten:", e);
    }
  };

  if (!profile) {
    return (
      <div className="w-full max-w-5xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-purple-400 animate-pulse">
        // STAMMDATEN-PIPELINE WIRD INITIALISIERT...
      </div>
    );
  }

  const { 
    category, Klarname, name, vorname, nachname, plz, city, street, phone, email, website, genre, id, description, avatarUrl,
    show_category, show_Klarname, show_name, show_name_real, show_phone, show_email, show_address, show_website, show_genre, show_description, show_avatarUrl
  } = formData;

  const EyeToggle = ({ active, flagName }) => (
    <button
      type="button"
      onClick={() => toggleVisibility(flagName)}
      className={`p-2 rounded-xl border transition-all cursor-pointer ${
        active 
          ? 'bg-purple-950/20 border-purple-500/40 text-purple-400 hover:text-purple-300' 
          : 'bg-slate-900 border-slate-800 text-slate-600 hover:text-slate-500'
      }`}
    >
      {active ? <Eye size={13} /> : <EyeOff size={13} />}
    </button>
  );

  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl font-mono text-white relative select-none">
      
      {/* HEADER DER MATRIX */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <User size={14} className="text-purple-400" />
          <span className="text-xs font-black tracking-widest uppercase">// STAMMDATEN REGISTER (KONTOTYP-ID: {formData.role})</span>
        </div>
        
        {canEdit && !isEditing && (
          <button 
            type="button" 
            onClick={() => setIsEditing(true)} 
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-purple-400 text-[10px] font-black tracking-wider uppercase hover:border-purple-500 transition-all cursor-pointer"
          >
            ✏️ Bearbeiten
          </button>
        )}
      </div>

      {/* ── SEITE A: DIE REINE DISPLAY-ANSICHT (JETZT MIT LIVE-AVATAR BILD!) ── */}
      {!isEditing ? (
        <div className="space-y-4">
          
          {/* ── CYBER-AVATAR STREAM (RUND & LOGO-NEON-GLOW) ── */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-900/20 border border-slate-900 rounded-2xl mb-2 relative overflow-hidden group">
            
            {/* RUNDER NEON-FRAME (FARBVERLAUF AUS DEM LOGO MIT DEZENTEM GLOW-EFFEKT) */}
            <div className="relative w-16 h-16 shrink-0 rounded-full p-[2px] bg-gradient-to-r from-cyan-500 to-pink-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] transform transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-950">
                <img 
                  src={(typeof avatarUrl === 'string' && avatarUrl.trim() !== "") ? avatarUrl : "https://unsplash.com"} 
                  alt="Profil Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col text-center sm:text-left z-10">
              <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">// AVATAR CHANNEL</span>
              <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">{Klarname || 'User'}</span>
              {canEdit && (
                <div className="flex items-center gap-1.5 mt-1 text-[9px] text-slate-400 justify-center sm:justify-start">
                  {show_avatarUrl ? <Eye size={10} className="text-purple-400" /> : <EyeOff size={10} className="text-slate-600" />}
                  <span className="font-mono tracking-wide">{show_avatarUrl ? "IM NETZWERK SICHTBAR" : "PRIVAT / AUSGEBLENDET"}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs text-slate-400">
            <div className="flex justify-between items-center py-1 border-b border-slate-900/50">
              <span className="text-slate-500">KATEGORIE / BERUF:</span> 
              <div className="flex items-center gap-2">
                <span className="text-purple-400 font-bold uppercase">{category || 'Nicht hinterlegt'}</span>
                {canEdit && (show_category ? <Eye size={11} className="text-purple-500/50" /> : <EyeOff size={11} className="text-slate-700" />)}
              </div>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-900/50">
              <span className="text-slate-500">FIRMEN / KÜNSTLERNAME:</span> 
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">{Klarname || 'Nicht hinterlegt'}</span>
                {canEdit && (show_Klarname ? <Eye size={11} className="text-purple-500/50" /> : <EyeOff size={11} className="text-slate-700" />)}
              </div>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-900/50">
              <span className="text-slate-500">SYSTEM-NAME:</span> 
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">{name}</span>
                {canEdit && (show_name ? <Eye size={11} className="text-purple-500/50" /> : <EyeOff size={11} className="text-slate-700" />)}
              </div>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-900/50">
              <span className="text-slate-500">VORNAME / NACHNAME:</span> 
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">{vorname} {nachname || 'Nicht hinterlegt'}</span>
                {canEdit && (show_name_real ? <Eye size={11} className="text-purple-500/50" /> : <EyeOff size={11} className="text-slate-700" />)}
              </div>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-900/50">
              <span className="text-slate-500">TELEFON:</span> 
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">{phone || 'Nicht hinterlegt'}</span>
                {canEdit && (show_phone ? <Eye size={11} className="text-purple-500/50" /> : <EyeOff size={11} className="text-slate-700" />)}
              </div>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-900/50">
              <span className="text-slate-500">E-MAIL:</span> 
              <div className="flex items-center gap-2">
                <span className="text-purple-400">{email || 'Nicht hinterlegt'}</span>
                {canEdit && (show_email ? <Eye size={11} className="text-purple-500/50" /> : <EyeOff size={11} className="text-slate-700" />)}
              </div>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-900/50">
              <span className="text-slate-500">ADRESSE:</span> 
              <div className="flex items-center gap-2">
                <span className="text-white">{street ? `${street}, ${plz} ${city}` : 'Nicht hinterlegt'}</span>
                {canEdit && (show_address ? <Eye size={11} className="text-purple-500/50" /> : <EyeOff size={11} className="text-slate-700" />)}
              </div>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-900/50">
              <span className="text-slate-500">WEBSEITE:</span> 
              <div className="flex items-center gap-2">
                <a href={website} target="_blank" rel="noreferrer" className="text-purple-400 hover:underline">{website || 'Nicht hinterlegt'}</a>
                {canEdit && (show_website ? <Eye size={11} className="text-purple-500/50" /> : <EyeOff size={11} className="text-slate-700" />)}
              </div>
            </div>
            {genre && (
              <div className="flex justify-between items-center py-1 border-b border-slate-900/50">
                <span className="text-slate-500">GENRE / CORE-AUSRICHTUNG:</span> 
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold uppercase">{genre}</span>
                  {canEdit && (show_genre ? <Eye size={11} className="text-purple-500/50" /> : <EyeOff size={11} className="text-slate-700" />)}
                </div>
              </div>
            )}
            <div className="flex justify-between items-center py-1 border-b border-slate-900/50"><span className="text-slate-500">GIGSDA-ID:</span> <span className="text-slate-600 text-[10px] font-mono">{id || 'SYS-NEW'}</span></div>
          </div>
          {description && (
            <div className="p-3 bg-slate-900/30 border border-slate-900 rounded-xl mt-2 relative">
              <div className="flex justify-between items-center mb-1">
                <div className="text-[10px] text-slate-500 font-bold mb-1">BIOGRAFIE / BESCHREIBUNG</div>
                {canEdit && (show_description ? <Eye size={11} className="text-purple-500/50" /> : <EyeOff size={11} className="text-slate-700" />)}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{description}</p>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* LINKER BLOCK */}
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold">KATEGORIE / B2B-BERUFSBEZEICHNUNG</span>
                <div className="flex gap-2">
                  <input type="text" name="category" value={category || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-purple-500 font-mono" placeholder="e.g. Musiker/Songwriter" />
                  <EyeToggle active={show_category} flagName="show_category" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold">KLARNAME (INTERN)</span>
                <div className="flex gap-2">
                  <input type="text" name="Klarname" value={Klarname || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-purple-500 font-mono" placeholder="e.g. Bruce Wayne" />
                  <EyeToggle active={show_Klarname} flagName="show_Klarname" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 font-bold">REALNAME (VOR- / NACHNAME)</span>
                  <EyeToggle active={show_name_real} flagName="show_name_real" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" name="vorname" placeholder="Vorname" value={vorname || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-purple-500 font-mono" />
                  <input type="text" name="nachname" placeholder="Nachname" value={nachname || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-purple-500 font-mono" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 font-bold">STANDORT-ADRESSE</span>
                  <EyeToggle active={show_address} flagName="show_address" />
                </div>
                <input type="text" name="street" placeholder="Straße / Hausnr." value={street || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-purple-500 font-mono mb-2" />
                <div className="grid grid-cols-3 gap-2">
                  <input type="text" name="plz" placeholder="PLZ" value={plz || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-purple-500 font-mono" />
                  <input type="text" name="city" placeholder="Stadt" value={city || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-purple-500 font-mono col-span-2" />
                </div>
              </div>
            </div>

            {/* RECHTER BLOCK */}
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold">TELEFON DATENSTREAM</span>
                <div className="flex gap-2">
                  <input type="text" name="phone" value={phone || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-cyan-400 focus:outline-none focus:border-cyan-500 font-mono" placeholder="+43 ..." />
                  <EyeToggle active={show_phone} flagName="show_phone" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold">E-MAIL PORTAL</span>
                <div className="flex gap-2">
                  <input type="email" name="email" value={email || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-purple-400 focus:outline-none focus:border-purple-500 font-mono" />
                  <EyeToggle active={show_email} flagName="show_email" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold">WEBSEITE (URL)</span>
                <div className="flex gap-2">
                  <input type="text" name="website" value={website || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-purple-400 focus:outline-none focus:border-purple-500 font-mono" placeholder="https://..." />
                  <EyeToggle active={show_website} flagName="show_website" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold">GENRE / CORE-AUSRICHTUNG</span>
                <div className="flex gap-2">
                  <input type="text" name="genre" value={genre || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-emerald-400 focus:outline-none focus:border-emerald-500 font-mono" placeholder="e.g. Rock / Metal" />
                  <EyeToggle active={show_genre} flagName="show_genre" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-600 font-bold">AVATAR-BILD (URL-STREAM)</span>
                <div className="flex gap-2">
                  <input type="text" name="avatarUrl" value={avatarUrl || ''} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-500 text-[10px] focus:outline-none focus:border-slate-700 font-mono" />
                  <EyeToggle active={show_avatarUrl} flagName="show_avatarUrl" />
                </div>
              </div>
            </div>

          </div> {/* Schließt das grid-cols-2 div exakt ab! */}

          {/* PROFIL-BESCHREIBUNG & AUGE */}
          <div className="flex flex-col gap-1 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 font-bold">INFO-TEXT / PROFIL-BESCHREIBUNG</span>
              <EyeToggle active={show_description} flagName="show_description" />
            </div>
            <textarea name="description" value={description || ''} onChange={handleChange} rows={3} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-300 focus:outline-none focus:border-purple-500 font-mono text-xs resize-none" placeholder="Beschreibe dein B2B-Profil für das Gigsda-Netzwerk..." />
          </div>

          {/* CONTROL STRIP */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-900">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white uppercase text-[10px] font-black cursor-pointer">Abbrechen</button>
            <button type="submit" className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-500 uppercase text-[10px] font-black tracking-wider cursor-pointer shadow-[0_0_15px_rgba(147,51,234,0.3)]"><Save size={12} /> Speichern ✓</button>
          </div>
        </form>
      )}
    </div>
  );
}

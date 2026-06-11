import React, { useState, useEffect } from 'react';

export default function FanProfile({ ticketName, onNavigate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // 🔒 CRASH-SICHERER COCKPIT-SPEICHER FÜR DEN FAN
  const [localFields, setLocalFields] = useState({
    name: ticketName || '',
    project_name: '',      // Nickname (e.g. "RockFan94")
    vorname: '',
    nachname: '',
    city: '',
    plz: '',
    avatarUrl: '',
    bannerUrl: '',         // Lieblings-Festival / Band Hintergrund
    favorite_genres: '',   // Musik-Vorlieben
    attended_gigs: '0',    // Erlebte Gigs Zähler
    role: 'Fan'            // Fest verdrahtet
  });

  // 📡 REAKTIVER LOAD-MECHANISMUS
  useEffect(() => {
    try {
      const savedProfiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');
      const currentProj = savedProfiles.find(p => p && p.name && p.name.trim().toLowerCase() === (ticketName || "").trim().toLowerCase());
      
      const freshData = currentProj || { 
        id: "FAN-" + Math.floor(Math.random() * 9000 + 1000), 
        name: ticketName || '', 
        project_name: ticketName || '', 
        vorname: '', nachname: '', city: '', role: 'Fan',
        bannerUrl: '', favorite_genres: 'Rock, Pop', attended_gigs: '12'
      };
      
      setUserData(freshData);
      
      setLocalFields({
        ...freshData,
        name: ticketName || '',
        project_name: freshData?.project_name || ticketName || '',
        vorname: freshData?.vorname || '',
        nachname: freshData?.nachname || '',
        city: freshData?.city || '',
        plz: freshData?.plz || '',
        avatarUrl: freshData?.avatarUrl || '',
        bannerUrl: freshData?.bannerUrl || '',
        favorite_genres: freshData?.favorite_genres || '',
        attended_gigs: freshData?.attended_gigs || '0',
        role: 'Fan'
      });
    } catch (e) {
      console.error("Fehler beim Fan-Load:", e);
    }
  }, [ticketName]);

  const handleInplaceChange = (e) => {
    const { name, value } = e.target;
    setLocalFields(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    try {
      const savedProfiles = JSON.parse(localStorage.getItem('gigsda_profiles')) || [];
      const updatedProfile = { ...userData, ...localFields, name: ticketName };
      
      const index = savedProfiles.findIndex(p => p && p.name && p.name.trim().toLowerCase() === ticketName.toLowerCase());
      if (index > -1) { savedProfiles[index] = updatedProfile; } else { savedProfiles.push(updatedProfile); }
      
      localStorage.setItem('gigsda_profiles', JSON.stringify(savedProfiles));
      setUserData(updatedProfile);
      setIsEditing(false);
      alert("Fan-Zentrale erfolgreich aktualisiert! ⚡🎟️");
    } catch (e) {
      console.error("Fehler beim Speichern des Fans:", e);
    }
  };

  if (!userData) return <div className="p-6 text-xs text-slate-600 font-mono">// INITIALISIERE FAN-HUB...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-950 border border-slate-900 rounded-3xl font-mono text-white shadow-2xl relative">
      
      {/* 🌌 VISUELLES FAN-BANNER */}
      <div className="h-64 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/60 relative mb-6">
        <img 
          src={localFields.bannerUrl || 'https://unsplash.com'} 
          alt="Fan Banner" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute bottom-4 left-4 z-10">
          <span className="text-[8px] bg-purple-500/10 border border-purple-500 text-purple-400 font-bold px-2 py-0.5 rounded-md uppercase tracking-widest shadow-[0_0_10px_rgba(168,85,247,0.2)]">
            🎟️ {localFields.role}
          </span>
          <h1 className="text-lg font-black uppercase text-white tracking-wide mt-1">
            {localFields.project_name || 'Gigsda Supporter'}
          </h1>
        </div>
      </div>

      {/* SYMMETRISCHES 2-SPALTEN-LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* LINKS: EDITIEREN ODER TICKETS & CHRONIK ZEIGEN */}
        <div className="space-y-4">
          {isEditing ? (
            <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4 shadow-xl">
              <span className="text-[8px] text-purple-400 uppercase font-black tracking-widest block">// EDIT-MODE: FAN CENTRAL</span>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Fan-Nickname</label>
                  <input type="text" name="project_name" value={localFields.project_name} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-purple-500/30" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[8px] text-slate-600 uppercase block font-bold">Vorname</label>
                    <input type="text" name="vorname" value={localFields.vorname} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] text-slate-600 uppercase block font-bold">Nachname</label>
                    <input type="text" name="nachname" value={localFields.nachname} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Lieblings-Genres (Koma-getrennt)</label>
                  <input type="text" name="favorite_genres" value={localFields.favorite_genres} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-purple-500/30" placeholder="e.g. Rock, Techno, Metal" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Wohnort / Stadt</label>
                  <input type="text" name="city" value={localFields.city} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Banner-Bild URL</label>
                  <input type="text" name="bannerUrl" value={localFields.bannerUrl} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none" placeholder="https://..." />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900">
                <button type="button" onClick={() => { setLocalFields({ ...userData }); setIsEditing(false); }} className="px-3 py-1.5 bg-slate-900 border border-red-500/20 text-slate-400 hover:text-red-400 text-[10px] font-bold uppercase rounded-xl transition-all cursor-pointer">✕ CANCEL</button>
                <button type="button" onClick={handleSave} className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/40 text-purple-400 hover:text-white text-[10px] font-bold uppercase rounded-xl transition-all cursor-pointer">✓ SAVE</button>
              </div>
            </div>
          ) : (
            /* FAN INHALTS-DASHBOARD (MEINE TICKETS & HISTORY) */
            <div className="space-y-4">
              <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-4 space-y-3">
                <span className="text-[8px] text-purple-400 uppercase font-black tracking-widest block">// MY TICKETS</span>
                <div className="border border-dashed border-slate-900 rounded-xl p-6 text-center text-[10px] text-slate-600">
                  🎟️ KEINE AKTIVEN TICKETS GEBUCHT • JETZT EVENTS ENTDECKEN!
                </div>
              </div>
              <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-4 space-y-3">
                <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest block">// CONCERT HISTORY</span>
                <div className="text-[10px] text-slate-400 space-y-1">
                  <p className="text-slate-500">• 14.02.2026 - Rock Night @ Arena Braunau</p>
                  <p className="text-slate-500">• 24.11.2025 - Open Air Festival Region Gigsda</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RECHTS: DER SCHMALE UNUNTERSTRICHENE COCKPIT-STECKBRIEF */}
        <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 flex flex-col justify-between min-h-[350px]">
          <div className="space-y-3 font-mono">
            
            {/* Symmetrischer Header: Text links, runder Avatar rechts */}
            <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-2">
              <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest block">// FAN ACCOUNT STATE</span>
              
              {/* Runder Avatar als edle B2B-Kachel rechtsbündig */}
              <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0 shadow-lg">
                <img 
                  src={localFields.avatarUrl || 'https://unsplash.com'} 
                  alt="Fan Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Supporter: <span className="text-white ml-1 font-normal uppercase">{localFields.project_name || 'Gigsda Fan'}</span>
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Name: <span className="text-white ml-1 font-normal uppercase">{localFields.vorname || '-'} {localFields.nachname || ''}</span>
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Heimatort: <span className="text-white ml-1 font-normal uppercase">{localFields.city || 'Nicht hinterlegt'}</span>
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-purple-400">
              Fav-Genres: <span className="text-white ml-1 font-normal lowercase italic">{localFields.favorite_genres || 'Keine Angaben'}</span>
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-cyan-400">
              Erlebte Gigs: <span className="text-white ml-1 font-normal uppercase">{localFields.attended_gigs} Live-Events</span>
            </p>
          </div>

          {!isEditing && (
            <div className="pt-4">
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-[9px] font-bold uppercase py-1.5 rounded-xl transition-all cursor-pointer text-center tracking-wider font-mono"
              >
                ⚙️ SETTINGS EDITIEREN
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

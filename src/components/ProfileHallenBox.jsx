import React, { useState, useEffect } from 'react';
import { Layers, Plus, X, Save, Eye, EyeOff, Home, Users, Music, Lightbulb, Tv } from 'lucide-react';

export default function ProfileHallenBox({ currentProfileName, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showHallen, setShowHallen] = useState(true);
  
  // Startet laut Protokoll mit genau 1 Raum zum Beginn
  const [rooms, setRooms] = useState([
    { 
      id: '1', 
      name: 'GROSSER SAAL / HAUPTFLÄCHE', 
      size: '250',
      pax_bankett: '120',
      pax_steh: '200',
      pax_theater: '180',
      pax_uform: '40',
      img: 'https://unsplash.com',
      has_sound: true,
      has_light: true,
      has_video: false
    }
  ]);

  const targetUser = currentProfileName || localStorage.getItem('gigsda_user_name') || 'grober lackl';
  const canEdit = isOwner || targetUser.toLowerCase() === (localStorage.getItem('gigsda_user_name') || '').toLowerCase();

  // 1. DATABASE PIPELINE: Lädt das Hallenregister reaktiv aus gigsda_profiles
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
            setShowHallen(found.show_hallen !== false);
            if (Array.isArray(found.location_rooms) && found.location_rooms.length > 0) {
              setRooms(found.location_rooms);
            }
          }
        }
      } catch (e) {
        console.error("Fehler in der Gigsda Hallen-Pipeline:", e);
      }
    }
  }, [targetUser, isEditing]);

  const handleRoomChange = (idx, field, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[idx][field] = value;
    setRooms(updatedRooms);
  };

  // ➕ MULTI-ROOM EXPANSION TRIGGER
  const addRoom = () => {
    setRooms(prev => [
      ...prev,
      {
        id: 'RM-' + Math.floor(1000 + Math.random() * 9000),
        name: '',
        size: '',
        pax_bankett: '',
        pax_steh: '',
        pax_theater: '',
        pax_uform: '',
        img: '',
        has_sound: false,
        has_light: false,
        has_video: false
      }
    ]);
  };

  const removeRoom = (idxToRemove) => {
    setRooms(prev => prev.filter((_, idx) => idx !== idxToRemove));
  };

  // 2. SAVE PIPELINE: Brennt das Technik- & Raumprotokoll permanent in den Speicher
  const handleSave = (e) => {
    e.preventDefault();
    const savedProfiles = localStorage.getItem('gigsda_profiles');
    if (!savedProfiles) return;

    try {
      let allProfiles = JSON.parse(savedProfiles);
      if (!Array.isArray(allProfiles)) return;

      allProfiles = allProfiles.map(p => {
        if (p && (p.name || p.user_name || p.display_name)?.trim().toLowerCase() === targetUser.trim().toLowerCase()) {
          return { ...p, location_rooms: rooms, show_hallen: showHallen };
        }
        return p;
      });

      localStorage.setItem('gigsda_profiles', JSON.stringify(allProfiles));
      alert("B2B Raum- & Technikregister erfolgreich eingebrannt! 💾🏟️");
      setIsEditing(false);
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error(e);
    }
  };

  if (!profile) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-purple-400 animate-pulse">
        // CAPACITY & TECH ARCHITECTURE INITIALIZING...
      </div>
    );
  }

  const isVisible = showHallen || canEdit;
  if (!isVisible) return null;

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl font-mono text-white select-none mt-4">
      
      {/* HEADER DER BOX */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-5">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">// 3. KAPAZITÄTEN & BESTUHLUNGSVARIANTEN</span>
          <span className="text-xs font-black tracking-wider uppercase text-slate-200 mt-0.5">VERFÜGBARE RÄUMLICHKEITEN & TECH-AUSSTATTUNG</span>
        </div>
        
        <div className="flex items-center gap-2">
          {canEdit && isEditing && (
            <button 
              type="button" 
              onClick={() => setShowHallen(!showHallen)} 
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${showHallen ? 'text-cyan-400 border-cyan-500/30 bg-cyan-950/10' : 'text-slate-600 border-slate-800 bg-slate-900'}`}
            >
              {showHallen ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>
          )}
          {canEdit && !isEditing && (
            <button 
              type="button" 
              onClick={() => setIsEditing(true)} 
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 text-[10px] font-black tracking-wider uppercase hover:border-cyan-500 transition-all cursor-pointer"
            >
              ✏️ Bearbeiten
            </button>
          )}
        </div>
      </div>

      {/* TERNARY WEICHE: ANZEIGE ODER EDITIEREN */}
      {!isEditing ? (
        <div className="space-y-4">
          {rooms.map((room, idx) => (
            <div key={idx} className="p-4 bg-slate-900/10 border border-slate-900 rounded-2xl flex flex-col md:flex-row gap-5 items-center justify-between hover:border-slate-800 transition-all">
              
              {/* LINKE SEITE: DETAILS & BESTUHLUNGS-GRID */}
              <div className="flex-1 w-full space-y-4">
                
                {/* RAUM HEADER ZEILE */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900/50 pb-2 gap-2">
                  <div className="text-xs font-black text-white uppercase tracking-wide flex items-center gap-2">
                    🏢 RAUM {idx + 1}: {room.name || 'UNBENANNTER BEREICH'}
                  </div>
                  
                  {/* INLINE TECH INDICATORS */}
                  <div className="flex gap-1.5">
                    {room.has_sound && <span className="px-2 py-0.5 rounded bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-wider flex items-center gap-1"><Music size={8} /> Ton</span>}
                    {room.has_light && <span className="px-2 py-0.5 rounded bg-amber-950/30 border border-amber-500/20 text-amber-400 text-[8px] font-black uppercase tracking-wider flex items-center gap-1"><Lightbulb size={8} /> Licht</span>}
                    {room.has_video && <span className="px-2 py-0.5 rounded bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 text-[8px] font-black uppercase tracking-wider flex items-center gap-1"><Tv size={8} /> Video</span>}
                  </div>

                  <div className="px-2.5 py-0.5 rounded-md bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 text-[10px] font-black tracking-wide font-mono self-start sm:self-center">
                    {room.size || '0'} M²
                  </div>
                </div>

                {/* MATRIX DER BESTUHLUNGSVARIANTEN */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  {room.pax_bankett && room.pax_bankett !== '0' && room.pax_bankett !== '' && (
                    <div className="p-2.5 bg-slate-900/40 border border-slate-900 rounded-xl flex flex-col justify-center items-center">
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">🍷 BANKETT</span>
                      <span className="text-xs font-black text-white mt-1">{room.pax_bankett} <span className="text-[9px] text-slate-500 font-normal">Pax</span></span>
                    </div>
                  )}
                  {room.pax_steh && room.pax_steh !== '0' && room.pax_steh !== '' && (
                    <div className="p-2.5 bg-slate-900/40 border border-slate-900 rounded-xl flex flex-col justify-center items-center">
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">🕺 STEHEMPFANG</span>
                      <span className="text-xs font-black text-white mt-1">{room.pax_steh} <span className="text-[9px] text-slate-500 font-normal">Pax</span></span>
                    </div>
                  )}
                  {room.pax_theater && room.pax_theater !== '0' && room.pax_theater !== '' && (
                    <div className="p-2.5 bg-slate-900/40 border border-slate-900 rounded-xl flex flex-col justify-center items-center">
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">🎭 THEATER</span>
                      <span className="text-xs font-black text-white mt-1">{room.pax_theater} <span className="text-[9px] text-slate-500 font-normal">Pax</span></span>
                    </div>
                  )}
                  {room.pax_uform && room.pax_uform !== '0' && room.pax_uform !== '' && (
                    <div className="p-2.5 bg-slate-900/40 border border-slate-900 rounded-xl flex flex-col justify-center items-center">
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">🪑 U-FORM</span>
                      <span className="text-xs font-black text-white mt-1">{room.pax_uform} <span className="text-[9px] text-slate-500 font-normal">Pax</span></span>
                    </div>
                  )}
                </div>

              </div>

              {/* RECHTE SEITE: GROSSES BILD */}
              <div className="w-full md:w-56 h-32 bg-slate-950 rounded-2xl overflow-hidden border border-slate-900 shrink-0 shadow-lg">
                <img 
                  src={room.img && room.img.trim() !== '' ? room.img : 'https://unsplash.com'} 
                  alt="Layout Layout" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-all duration-500"
                />
              </div>

            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex flex-col gap-4">
            
            {/* INTERAKTIVE RAUM-INPUTS MATRIX */}
            {rooms.map((room, idx) => (
              <div key={room.id || idx} className="p-4 bg-slate-900/20 border border-slate-900 rounded-3xl space-y-3 relative">
                
                {/* LÖSCH-KREUZ */}
                {rooms.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeRoom(idx)} 
                    className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}

                <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest block">// CONFIGURATION MATRIZ FOR AREA #{idx + 1}</span>
                
                {/* STAMMDATEN DES RAUMS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <span className="text-[10px] text-slate-500 font-bold">// RAUMBEZEICHNUNG</span>
                    <input type="text" value={room.name || ''} onChange={(e) => handleRoomChange(idx, 'name', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono" placeholder="e.g. GROSSER SAAL" required />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-500 font-bold">// GRÖSSE (M²)</span>
                    <input type="number" value={room.size || ''} onChange={(e) => handleRoomChange(idx, 'size', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-cyan-400 focus:outline-none focus:border-cyan-500 font-mono" placeholder="e.g. 250" required />
                  </div>
                </div>

                {/* TECHNISCHE AUSSTATTUNG CHECKBOXEN */}
                <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl space-y-2">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">// INHOUSE TECHNIK-AUSSTATTUNG</span>
                  <div className="flex flex-wrap gap-4 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
                      <input type="checkbox" checked={!!room.has_sound} onChange={(e) => handleRoomChange(idx, 'has_sound', e.target.checked)} className="rounded bg-slate-900 border-slate-800 text-cyan-500 focus:ring-0 cursor-pointer w-4 h-4" />
                      <span>🔊 Professionelle Tonanlage</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
                      <input type="checkbox" checked={!!room.has_light} onChange={(e) => handleRoomChange(idx, 'has_light', e.target.checked)} className="rounded bg-slate-900 border-slate-800 text-cyan-500 focus:ring-0 cursor-pointer w-4 h-4" />
                      <span>💡 Lichtanlage / Scheinwerfer</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
                      <input type="checkbox" checked={!!room.has_video} onChange={(e) => handleRoomChange(idx, 'has_video', e.target.checked)} className="rounded bg-slate-900 border-slate-800 text-cyan-500 focus:ring-0 cursor-pointer w-4 h-4" />
                      <span>📺 Video / Beamer / LED-Wall</span>
                    </label>
                  </div>
                </div>

                {/* PAX-ZÄHLER DER 4 BESTUHLUNGSARTEN */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-slate-500 font-bold">// 🍷 PAX BANKETT</span>
                    <input type="number" value={room.pax_bankett || ''} onChange={(e) => handleRoomChange(idx, 'pax_bankett', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono" placeholder="0" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-slate-500 font-bold">// 🕺 PAX STEH-EMPFANG</span>
                    <input type="number" value={room.pax_steh || ''} onChange={(e) => handleRoomChange(idx, 'pax_steh', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono" placeholder="0" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-slate-500 font-bold">// 🎭 PAX THEATER</span>
                    <input type="number" value={room.pax_theater || ''} onChange={(e) => handleRoomChange(idx, 'pax_theater', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono" placeholder="0" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-slate-500 font-bold">// 🪑 PAX U-FORM</span>
                    <input type="number" value={room.pax_uform || ''} onChange={(e) => handleRoomChange(idx, 'pax_uform', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono" placeholder="0" />
                  </div>
                </div>

                {/* LAYOUT BILD URL */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 font-bold">// LAYOUT BILD URL</span>
                  <input type="text" value={room.img || ''} onChange={(e) => handleRoomChange(idx, 'img', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-400 focus:outline-none focus:border-cyan-500 font-mono" placeholder="https://unsplash.com..." />
                </div>

              </div>
            ))}

            {/* + EXTRA RAUM REGISTER ENGINE */}
            <button
              type="button"
              onClick={addRoom}
              className="w-full py-3 bg-slate-900/40 border border-slate-900 border-dashed rounded-2xl text-[10px] font-bold uppercase tracking-widest text-cyan-400 hover:border-cyan-500/50 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus size={12} /> + Weiteren Raum nachtragen
            </button>

          </div>

          {/* CONTROL STRIP */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-900">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white uppercase text-[10px] font-black cursor-pointer">Abbrechen</button>
            <button type="submit" className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-600 text-slate-950 hover:bg-cyan-500 uppercase text-[10px] font-black tracking-wider cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"><Save size={12} /> Register Einbrennen ✓</button>
          </div>
        </form>
      )}
    </div>
  );
}

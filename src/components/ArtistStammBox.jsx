import React, { useState, useEffect } from 'react';
import { Sliders, Music, Zap, Radio, Clock, Save, Edit2, X } from 'lucide-react';

export default function ArtistStammBox({ profileOwnerName, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    mainInstrument: '',
    subInstruments: '',
    genre: '',
    formation: 'solo',
    rider_monitors: '',
    rider_backline: '',
    setup_time: '',
    event_types: ''
  });

  // 1. Profildaten aus gigsda_profiles laden anhand des Namens
  useEffect(() => {
    if (!profileOwnerName) return;
    try {
      const storedProfiles = localStorage.getItem('gigsda_profiles');
      if (storedProfiles) {
        const profilesArray = JSON.parse(storedProfiles);
        const currentProfile = profilesArray.find(p => p.name === profileOwnerName);
        if (currentProfile) {
          setFormData({
            mainInstrument: currentProfile.mainInstrument || '',
            subInstruments: currentProfile.subInstruments || '',
            genre: currentProfile.genre || '',
            formation: currentProfile.formation || 'solo',
            rider_monitors: currentProfile.rider_monitors || '',
            rider_backline: currentProfile.rider_backline || '',
            setup_time: currentProfile.setup_time || '',
            event_types: currentProfile.event_types || ''
          });
        }
      }
    } catch (error) {
      console.error("Fehler beim Laden der ArtistStammBox:", error);
    }
  }, [profileOwnerName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. Speicher-Pipeline: Schreibt alle B2B-Felder direkt in gigsda_profiles
  const handleSave = (e) => {
    e.preventDefault();
    try {
      const storedProfiles = localStorage.getItem('gigsda_profiles');
      let profilesArray = storedProfiles ? JSON.parse(storedProfiles) : [];
      const profileIndex = profilesArray.findIndex(p => p.name === profileOwnerName);

      const updatedData = {
        name: profileOwnerName,
        mainInstrument: formData.mainInstrument,
        subInstruments: formData.subInstruments,
        genre: formData.genre,
        formation: formData.formation,
        rider_monitors: formData.rider_monitors,
        rider_backline: formData.rider_backline,
        setup_time: formData.setup_time !== '' ? Number(formData.setup_time) : '',
        event_types: formData.event_types
      };

      if (profileIndex !== -1) {
        profilesArray[profileIndex] = { ...profilesArray[profileIndex], ...updatedData };
      } else {
        profilesArray.push(updatedData);
      }

      localStorage.setItem('gigsda_profiles', JSON.stringify(profilesArray));
      setIsEditing(false);
      
      // Optionaler Reload, falls Suchergebnisse live reagieren müssen
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (error) {
      console.error("Fehler beim Speichern in ArtistStammBox:", error);
    }
  };

  const { 
    mainInstrument, 
    subInstruments, 
    genre, 
    formation, 
    rider_monitors, 
    rider_backline, 
    setup_time, 
    event_types 
  } = formData;

  return (
    <div className="bg-[#0b111e] border border-slate-800 p-6 rounded-xl max-w-4xl mx-auto my-4 shadow-xl">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 border-b border-slate-800/60 pb-3">
        <h2 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" /> // Musikalische Stammdaten & Tech-Specs
        </h2>
        {!isEditing && (isOwner || true) && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-4 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded uppercase tracking-wider transition-all border border-slate-700"
          >
            <Edit2 size={10} /> Bearbeiten
          </button>
        )}
      </div>

      {!isEditing ? (
        // --- ANZEIGE-MODUS (Edler B2B-Look wie deine Finanzbox) ---
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 1. Spalte: Musikalische Ausrichtung */}
          <div className="space-y-3 p-3 bg-slate-900/20 border border-slate-800/60 rounded-xl">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-800/40 pb-1 flex items-center gap-1">
              <Music size={11} className="text-indigo-400" /> Kern-Ausrichtung
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase">Hauptinstrument</span>
              <span className="text-white text-sm font-bold">{mainInstrument || 'Nicht angegeben'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase">Nebeninstrumente</span>
              <span className="text-slate-300 text-xs">{subInstruments || 'Keine Angabe'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase">Genre / Stil</span>
              <span className="text-emerald-400 text-xs font-semibold">{genre || 'Nicht definiert'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase">
                Eventtypen
              </span>
              <span className="text-indigo-400 text-xs font-semibold">
                {event_types || 'Nicht definiert'}
              </span>
            </div>
          </div>

          {/* 2. Spalte: Logistik & Struktur */}
          <div className="space-y-3 p-3 bg-slate-900/20 border border-slate-800/60 rounded-xl">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-800/40 pb-1 flex items-center gap-1">
              <Clock size={11} className="text-amber-400" /> Logistik & Struktur
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase">Formations-Typ (Suche)</span>
              <span className="text-amber-400 text-sm font-extrabold uppercase tracking-wide">
                {formation === 'band' ? '👥 Band / Gruppe' : '👤 Solo-Act'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase">Wechselzeit (Setup / Check)</span>
              <span className="text-white text-sm font-mono font-bold">
                {setup_time ? `${setup_time} Minuten` : 'Nicht spezifiziert'}
              </span>
            </div>
          </div>

          {/* 3. Spalte: Technische Key-Specs */}
          <div className="space-y-3 p-3 bg-slate-900/20 border border-slate-800/60 rounded-xl">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-800/40 pb-1 flex items-center gap-1">
              <Radio size={11} className="text-cyan-400" /> Tech-Rider Kompakt
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase">Monitoring (IEM)</span>
              <span className="text-cyan-400 text-xs font-medium font-mono">{rider_monitors || 'Keine Vorgabe'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase">Bühnenstrom / Backline</span>
              <span className="text-slate-300 text-xs font-mono">{rider_backline || 'Keine Vorgabe'}</span>
            </div>
          </div>

        </div>
      ) : (
        // --- BEARBEITUNGS-MODUS (Formular) ---
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Linke Box: Musikalische Eingaben */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">// HAUPTINSTRUMENT</label>
                <input
                  type="text"
                  name="mainInstrument"
                  value={mainInstrument}
                  onChange={handleChange}
                  placeholder="e.g. E-Gitarre"
                  className="w-full bg-[#11192e]/40 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">// NEBENINSTRUMENTE / TAGS</label>
                <input
                  type="text"
                  name="subInstruments"
                  value={subInstruments}
                  onChange={handleChange}
                  placeholder="e.g. Vocals, Keyboards"
                  className="w-full bg-[#11192e]/40 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">// GENRE / CORE-AUSRICHTUNG</label>
                <input
                  type="text"
                  name="genre"
                  value={genre}
                  onChange={handleChange}
                  placeholder="e.g. Rock/Rockig"
                  className="w-full bg-[#11192e]/40 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  // EVENTTYPEN (EINSATZ)
                </label>
                <input
                  type="text"
                  name="event_types"
                  value={formData.event_types || ""}
                  onChange={handleChange}
                  placeholder="z.B. club / festival / wedding"
                  className="w-full bg-[#11192e]/40 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

            </div>

            {/* Rechte Box: B2B- & Logistik-Eingaben */}
            <div className="space-y-4 bg-[#11192e]/30 p-4 rounded-xl border border-slate-800">
              <div>
                <label className="block text-[10px] font-bold text-amber-400 uppercase mb-1">// FORMATIONS-TYP (SUCH-RELEVANTER HEBEL)</label>
                <select
                  name="formation"
                  value={formation}
                  onChange={handleChange}
                  className="w-full bg-[#0b111e] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="solo">👤 Solo-Act / Alleine</option>
                  <option value="band">👥 Band / Musikgruppe</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">// TIMING: SETUP- & SOUNDCHECK-DAUER (MIN)</label>
                <input
                  type="number"
                  name="setup_time"
                  value={setup_time}
                  onChange={handleChange}
                  placeholder="e.g. 45"
                  className="w-full bg-[#0b111e] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-cyan-400 uppercase mb-1">// MONITORING-WUNSCH (IEM / WEDGES)</label>
                <input
                  type="text"
                  name="rider_monitors"
                  value={rider_monitors}
                  onChange={handleChange}
                  placeholder="e.g. IEM eigenen Sender mitbringen (E-Band)"
                  className="w-full bg-[#0b111e] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">// STROMBEDARF AN DER POSITION</label>
                <input
                  type="text"
                  name="rider_backline"
                  value={rider_backline}
                  onChange={handleChange}
                  placeholder="e.g. 2x 230V Schuko für Pedalboard"
                  className="w-full bg-[#0b111e] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800/60">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1 px-4 py-1.5 border border-slate-700 text-slate-300 text-[10px] font-bold rounded uppercase tracking-wider hover:bg-slate-800/40 transition-colors"
            >
              <X size={10} /> Abbrechen
            </button>
            <button
              type="submit"
              className="flex items-center gap-1 px-5 py-1.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-[10px] font-bold rounded uppercase tracking-wider transition-colors shadow-md"
            >
              <Save size={10} /> Speichern
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

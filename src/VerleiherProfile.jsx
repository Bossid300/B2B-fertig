import React, { useState, useEffect } from 'react';
import CrewRequestCenter from './CrewRequestCenter';
import ProfileHeaderBox from './components/ProfileHeaderBox'; // Ganz oben importieren

export default function VerleiherProfile({ ticketName, onNavigate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // 🔒 CRASH-SICHERER COCKPIT-SPEICHER FÜR REAKTIVE VERLEIHER-MEDIEN
  const [localFields, setLocalFields] = useState({
    name: ticketName || '',
    project_name: '',      // Firmenname (e.g. "Braunau Stage Tech")
    vorname: '', nachname: '', website: '', city: '', plz: '', street: '', phone: '', email: '',
    avatarUrl: '', 
    availability: '', 
    role: 'Material', // Fest auf Daniels System-ID verdrahtet
    
    // 🔌 SPECIFIC VERLEIHER FIELDS
    delivery_radius: '',   // Liefer-Reichweite
    audio_rent: '',        // Beschallung / PA
    light_rent: '',        // Beleuchtung / FX
    stage_rent: '',        // Bühnenbau / Traversen
    backline_rent: '',     // Backline (Drums, Amps)
    terms_conditions: ''   // Mietbedingungen & Kaution
  });

  // 📡 CRASH-SICHERER LOAD-MECHANISMUS
  useEffect(() => {
    try {
      const savedProfiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');
      const currentProj = savedProfiles.find(p => p && p.name && p.name.trim().toLowerCase() === (ticketName || "").trim().toLowerCase());
      
      const freshData = currentProj || { 
        id: "RENT-" + Math.floor(Math.random() * 9000 + 1000), 
        name: ticketName || '', project_name: '', vorname: '', nachname: '', website: '', city: '', role: 'Material', avatarUrl: ''
      };
      
      setUserData(freshData);
      
      setLocalFields({
        ...freshData,
        name: ticketName || '',
        project_name: freshData?.project_name || '',
        vorname: freshData?.vorname || '',
        nachname: freshData?.nachname || '',
        website: freshData?.website || '',
        city: freshData?.city || '',
        street: freshData?.street || '',
        plz: freshData?.plz || '',
        avatarUrl: freshData?.avatarUrl || '',
        availability: freshData?.availability || '',
        delivery_radius: freshData?.delivery_radius || '',
        audio_rent: freshData?.audio_rent || freshData?.audio_tech || '',
        light_rent: freshData?.light_rent || '',
        stage_rent: freshData?.stage_rent || '',
        backline_rent: freshData?.backline_rent || '',
        terms_conditions: freshData?.terms_conditions || '',
        role: 'Material'
      });
    } catch (e) { console.error("Fehler beim Verleiher-Load:", e); }
  }, [ticketName]);

  const handleInplaceChange = (e) => {
    const { name, value } = e.target;
    setLocalFields(prev => ({ ...prev, [name]: value }));
  };
  // ⭐ PRÜFT, OB DIESER VERLEIHER BEREITS EIN FAVORIT IST
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const savedFavs = JSON.parse(localStorage.getItem('gigsda_favorites') || '[]');
      const found = savedFavs.some(f => f && f.name && f.name.toLowerCase() === (ticketName || "").toLowerCase());
      setIsFavorite(found);
    } catch (e) { console.error(e); }
  }, [ticketName]);

  const handleToggleFavorite = () => {
    try {
      let savedFavs = JSON.parse(localStorage.getItem('gigsda_favorites') || '[]');
      if (isFavorite) {
        savedFavs = savedFavs.filter(f => f && f.name && f.name.toLowerCase() !== ticketName.toLowerCase());
        setIsFavorite(false);
        alert("Rental-Partner aus den B2B-Favoriten entfernt! ☆");
      } else {
        const newFav = {
          name: ticketName,
          role: 'Rental',
          city: localFields.city || 'Nicht hinterlegt',
          avatarUrl: localFields.avatarUrl || '',
          note: localFields.project_name ? `Equipment-Rental: ${localFields.project_name}` : 'Gemerkter Verleiher'
        };
        savedFavs.push(newFav);
        setIsFavorite(true);
        alert("Rental-Partner erfolgreich zu den Favoriten hinzugefügt! ★");
      }
      localStorage.setItem('gigsda_favorites', JSON.stringify(savedFavs));
    } catch (e) { console.error("Fehler beim Favoriten-Toggle:", e); }
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
      alert("B2B-Verleiher-Zentrale erfolgreich aktualisiert! 🔌⚡");
    } catch (e) { console.error("Fehler beim Speichern:", e); }
  };

  if (!userData) return <div className="p-6 text-xs text-slate-600 font-mono">// INITIALISIERE TECH-HUB...</div>;

  // 🪐 HIER STARTET EUER DESIGN-GERÜST:
  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-950 border border-slate-900 rounded-3xl font-mono text-white shadow-2xl relative">

      <CrewRequestCenter currentProfileName={ticketName} />
      {/* Absolut sicherer Aufruf in der VerleiherProfile.jsx: */}
      <ProfileHeaderBox
        currentProfileName={ticketName}
        localFields={localFields} // oder wie dein Daten-State in dieser Datei heißt
        isFavorite={isFavorite}
        handleToggleFavorite={handleToggleFavorite}
      />


      {/* 📊 ASYMMETRISCHES 2-SPALTEN-LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* LINKS: EDITIERUNG ODER REAKTIVE DATENANZEIGE */}
        <div className="space-y-4">
          {isEditing ? (
            <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4 shadow-xl">
              <span className="text-[8px] text-amber-400 uppercase font-black tracking-widest block">// EDIT-MODE: RENTAL PROTOCOL</span>
              
              {/* STAMMDATEN & TECH-INPUTS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Firmenname</label>
                  <input type="text" name="project_name" value={localFields.project_name || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Liefer-Radius (km)</label>
                  <input type="text" name="delivery_radius" value={localFields.delivery_radius || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Tontechnik / PA Verleih</label>
                  <input type="text" name="audio_rent" value={localFields.audio_rent || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Lichttechnik / Effekte Verleih</label>
                  <input type="text" name="light_rent" value={localFields.light_rent || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Bühne / Rigging / Traversen</label>
                  <input type="text" name="stage_rent" value={localFields.stage_rent || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Backline-Verleih (Instrumente)</label>
                  <input type="text" name="backline_rent" value={localFields.backline_rent || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Mietkonditionen, Kaution & Sperrfristen</label>
                  <textarea rows="2" name="terms_conditions" value={localFields.terms_conditions || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-[10px] outline-none resize-none font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900">
                <button type="button" onClick={() => { setLocalFields({ ...userData }); setIsEditing(false); }} className="px-3 py-1.5 bg-slate-900 border border-red-500/20 text-slate-400 text-[10px] font-bold uppercase rounded-xl">✕ CANCEL</button>
                <button type="button" onClick={handleSave} className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/40 text-amber-400 text-[10px] font-bold uppercase rounded-xl">✓ SAVE DETAILS</button>
              </div>
            </div>
          ) : (
            /* VERLEIHER SCHREIBSCHUTZ DATENBLÖCKE */
            <div className="space-y-4 font-mono text-[10px]">
              <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-4 space-y-3">
                <span className="text-[8px] text-amber-400 uppercase font-black block tracking-widest">// AVAILABLE EQUIPMENT SPECS</span>
                <p className="text-slate-400 font-bold uppercase">🎙️ Audio/PA: <span className="text-white font-normal lowercase block mt-0.5 ml-3">{localFields.audio_rent || 'Keine Angaben'}</span></p>
                <p className="text-slate-400 font-bold uppercase">💡 Licht/FX: <span className="text-white font-normal lowercase block mt-0.5 ml-3">{localFields.light_rent || 'Keine Angaben'}</span></p>
                <p className="text-slate-400 font-bold uppercase">🏗️ Bühne/Truss: <span className="text-white font-normal lowercase block mt-0.5 ml-3">{localFields.stage_rent || 'Keine Angaben'}</span></p>
                <p className="text-slate-400 font-bold uppercase">🎸 Backline: <span className="text-white font-normal lowercase block mt-0.5 ml-3">{localFields.backline_rent || 'Keine Angaben'}</span></p>
              </div>
              <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-4 space-y-1.5">
                <span className="text-[8px] text-slate-500 uppercase font-black block tracking-widest">// RENTAL CONDITIONS</span>
                <p className="text-slate-300 leading-relaxed">{localFields.terms_conditions || 'Mietbedingungen auf Anfrage.'}</p>
              </div>
            </div>
          )}
        </div>

        {/* RECHTS: STAMMDATENBOX MIT RECHTSBÜNDIGEM AVATAR */}
        <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 flex flex-col justify-between min-h-[350px]">
          <div className="space-y-3 font-mono">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-2">
              <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest block">// TECH SUPPLIER STATE</span>
              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0 shadow-lg">
                <img src={localFields.avatarUrl || 'https://unsplash.com'} alt="Supplier Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Verleih: <span className="text-white ml-1 font-normal uppercase">{localFields.project_name || 'Gigsda Supplier'}</span></p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-amber-400">Reichweite: <span className="text-white ml-1 font-normal uppercase">{localFields.delivery_radius ? `${localFields.delivery_radius} km Lieferumfang` : 'Nicht hinterlegt'}</span></p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Stadt: <span className="text-white ml-1 font-normal uppercase">{localFields.city || 'Nicht hinterlegt'}</span></p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kontakt: <span className="text-white ml-1 font-normal uppercase">{localFields.vorname} {localFields.nachname || ''}</span></p>
          </div>

          {!isEditing && (
            <div className="pt-4 space-y-2">
              <button 
                onClick={handleToggleFavorite}
                className={`w-full text-[9px] font-bold uppercase py-1.5 rounded-xl text-center border font-mono transition-all cursor-pointer tracking-wider ${isFavorite ? 'bg-amber-500/10 border-amber-500 text-amber-400 hover:bg-amber-500/20' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
              >
                {isFavorite ? '★ AUS FAVORITEN ENTFERNEN' : '☆ ZU DEN FAVORITEN'}
              </button>
              <button onClick={() => setIsEditing(true)} className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-[9px] font-bold uppercase py-1.5 rounded-xl text-center tracking-wider font-mono cursor-pointer">⚙️ RENTAL EDITIEREN</button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

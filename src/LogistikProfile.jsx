import React, { useState, useEffect } from 'react';
import CrewRequestCenter from './CrewRequestCenter';
import ProfileHeaderBox from './components/ProfileHeaderBox'; // Ganz oben importieren

export default function LogistikProfile({ ticketName, onNavigate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // 🔒 CRASH-SICHERER COCKPIT-SPEICHER FÜR DIE EVENT-LOGISTIK
  const [localFields, setLocalFields] = useState({
    name: ticketName || '',
    project_name: '',      // Firmenname (e.g. "Innviertel Tour-Logistik")
    vorname: '', nachname: '', website: '', city: '', plz: '', street: '', phone: '', email: '',
    avatarUrl: '', 
    availability: '', 
    role: 'Logistik', // Fest auf Daniels System-ID verdrahtet
    
    // 🚛 SPECIFIC LOGISTIK FIELDS
    fleet_specs: '',     // Fuhrpark (Nightliner, Sprinter, 7.5t LKW)
    cargo_capacity: '',  // Ladevolumen / Nutzlast
    shuttle_service: '', // VIP-Shuttle / Crew-Transport (Ja/Nein)
    customs_handling: '',// Zoll-Abwicklung / Carnet ATA Erfahrung (Ja/Nein)
    terms_conditions: '' // Mindestbuchung, Freikilometer & Kaution
  });

  // 📡 CRASH-SICHERER LOAD-MECHANISMUS
  useEffect(() => {
    try {
      const savedProfiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');
      const currentProj = savedProfiles.find(p => p && p.name && p.name.trim().toLowerCase() === (ticketName || "").trim().toLowerCase());
      
      const freshData = currentProj || { 
        id: "CARGO-" + Math.floor(Math.random() * 9000 + 1000), 
        name: ticketName || '', project_name: '', vorname: '', nachname: '', website: '', city: '', role: 'Logistik', avatarUrl: ''
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
        fleet_specs: freshData?.fleet_specs || '',
        cargo_capacity: freshData?.cargo_capacity || '',
        shuttle_service: freshData?.shuttle_service || '',
        customs_handling: freshData?.customs_handling || '',
        terms_conditions: freshData?.terms_conditions || '',
        role: 'Logistik'
      });
    } catch (e) { console.error("Fehler beim Logistik-Load:", e); }
  }, [ticketName]);

  const handleInplaceChange = (e) => {
    const { name, value } = e.target;
    setLocalFields(prev => ({ ...prev, [name]: value }));
  };
  // ⭐ PRÜFT, OB DIESE LOGISTIK BEREITS EIN FAVORIT IST
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
        alert("Logistiker aus den B2B-Favoriten entfernt! ☆");
      } else {
        const newFav = {
          name: ticketName,
          role: 'Logistik',
          city: localFields.city || 'Nicht hinterlegt',
          avatarUrl: localFields.avatarUrl || '',
          note: localFields.project_name ? `Tour-Cargo: ${localFields.project_name}` : 'Gemerkter Fracht-Service'
        };
        savedFavs.push(newFav);
        setIsFavorite(true);
        alert("Logistiker erfolgreich zu den Favoriten hinzugefügt! ★");
      }
      localStorage.setItem('gigsda_favorites', JSON.stringify(savedFavs));
    } catch (e) { console.error(e); }
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
      alert("B2B-Logistikprofil erfolgreich aktualisiert! 🚛⚡");
    } catch (e) { console.error("Fehler beim Speichern:", e); }
  };

  if (!userData) return <div className="p-6 text-xs text-slate-600 font-mono">// INITIALISIERE CARGO-HUB...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-950 border border-slate-900 rounded-3xl font-mono text-white shadow-2xl relative">


      <CrewRequestCenter currentProfileName={ticketName} />
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
              <span className="text-[8px] text-blue-400 uppercase font-black tracking-widest block">// EDIT-MODE: LOGISTICS SPECIFICATIONS</span>
              
              {/* LOGISTIK SPECIFIC INPUTS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Firmenname</label>
                  <input type="text" name="project_name" value={localFields.project_name || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-blue-500/30" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Verfügbarkeit / Einsatzgebiet</label>
                  <input type="text" name="availability" value={localFields.availability || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-blue-500/30" placeholder="e.g. EU-weit, regional OÖ" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Fuhrpark-Konfiguration (Nightliner, Trucks, Sprinter)</label>
                  <input type="text" name="fleet_specs" value={localFields.fleet_specs || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-blue-500/30" placeholder="e.g. 1x 18t Megaliner, 2x Mercedes Sprinter lang, 1x Nightliner" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Ladevolumen / Nutzlast</label>
                  <input type="text" name="cargo_capacity" value={localFields.cargo_capacity || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-blue-500/30" placeholder="e.g. bis zu 24 Tonnen / 90m³" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">VIP-Shuttle / Crew-Transport</label>
                  <input type="text" name="shuttle_service" value={localFields.shuttle_service || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-blue-500/30" placeholder="e.g. Ja, 2x VIP V-Klasse mit Fahrer" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Zoll-Abwicklung / Carnet ATA / UK-Grenzverkehr</label>
                  <input type="text" name="customs_handling" value={localFields.customs_handling || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-blue-500/30" placeholder="e.g. Volle Zollabwicklung für Schweiz, UK & Non-EU" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Mietkonditionen, Freikilometer & Stornosätze</label>
                  <textarea rows="2" name="terms_conditions" value={localFields.terms_conditions || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-[10px] outline-none resize-none font-mono focus:border-blue-500/30" placeholder="e.g. Inklusive 100 Freikilometer pro Einsatztag, Fahrer-Spesen exklusive." />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900">
                <button type="button" onClick={() => { setLocalFields({ ...userData }); setIsEditing(false); }} className="px-3 py-1.5 bg-slate-900 border border-red-500/20 text-slate-400 hover:text-red-400 text-[10px] font-bold uppercase rounded-xl transition-all cursor-pointer">✕ CANCEL</button>
                <button type="button" onClick={handleSave} className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/40 text-blue-400 hover:text-white text-[10px] font-bold uppercase rounded-xl transition-all cursor-pointer">✓ SAVE DETAILS</button>
              </div>
            </div>
          ) : (
            /* LOGISTIK SCHREIBSCHUTZ DATENBLÖCKE */
            <div className="space-y-4 font-mono text-[10px]">
              <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-4 space-y-3">
                <span className="text-[8px] text-blue-400 uppercase font-black block tracking-widest">// TRANSPORT & FLEET CAPACITY</span>
                <p className="text-slate-400 font-bold uppercase">Cargo/Fuhrpark: <span className="text-white font-normal block mt-0.5 ml-3">{localFields.fleet_specs || 'Keine Angaben'}</span></p>
                <p className="text-slate-400 font-bold uppercase">📦 Kapazität: <span className="text-white font-normal block mt-0.5 ml-3">{localFields.cargo_capacity || 'Keine Angaben'}</span></p>
                <p className="text-slate-400 font-bold uppercase">🚐 Shuttles: <span className="text-white font-normal block mt-0.5 ml-3">{localFields.shuttle_service || 'Keine Angaben'}</span></p>
                <p className="text-slate-400 font-bold uppercase">🛃 Zoll/Grenzverkehr: <span className="text-white font-normal block mt-0.5 ml-3">{localFields.customs_handling || 'Keine Angaben'}</span></p>
              </div>
              <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-4 space-y-1.5">
                <span className="text-[8px] text-slate-500 uppercase font-black block tracking-widest">// CARGO CONDITIONS</span>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{localFields.terms_conditions || 'Konditionen auf Anfrage.'}</p>
              </div>
            </div>
          )}
        </div>

        {/* RECHTS: STAMMDATENBOX MIT RECHTSBÜNDIGEM AVATAR */}
        <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 flex flex-col justify-between min-h-[350px]">
          <div className="space-y-3 font-mono">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-2">
              <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest block">// LOGISTICS ROUTING STATE</span>
              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0 shadow-lg">
                <img src={localFields.avatarUrl || 'https://unsplash.com'} alt="Logistik Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Logistik: <span className="text-white ml-1 font-normal uppercase">{localFields.project_name || 'Gigsda Logistik Partner'}</span></p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-blue-400">Gebiet: <span className="text-white ml-1 font-normal uppercase">{localFields.availability || 'Nicht hinterlegt'}</span></p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Stadt: <span className="text-white ml-1 font-normal uppercase">{localFields.city || 'Nicht hinterlegt'}</span></p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Disponent: <span className="text-white ml-1 font-normal uppercase">{localFields.vorname} {localFields.nachname || ''}</span></p>
          </div>

          {!isEditing && (
            <div className="pt-4 space-y-2">
              <button 
                onClick={handleToggleFavorite}
                className={`w-full text-[9px] font-bold uppercase py-1.5 rounded-xl text-center border font-mono transition-all cursor-pointer tracking-wider ${isFavorite ? 'bg-amber-500/10 border-amber-500 text-amber-400 hover:bg-amber-500/20' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
              >
                {isFavorite ? '★ AUS FAVORITEN ENTFERNEN' : '☆ ZU DEN FAVORITEN'}
              </button>
              <button onClick={() => setIsEditing(true)} className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-[9px] font-bold uppercase py-1.5 rounded-xl text-center tracking-wider font-mono cursor-pointer">⚙️ LOGISTIK EDITIEREN</button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

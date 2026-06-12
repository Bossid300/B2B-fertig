import React, { useState, useEffect } from 'react';

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
    bannerUrl: '',   // 🔒 Das Visitenkarten-Feld & Slide 1
    slide1_url: '',  // 🖼️ Slider Bild 2
    slide2_url: '',  // 🖼️ Slider Bild 3
    slide3_url: '',  // 🖼️ Slider Bild 4
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
        name: ticketName || '', project_name: '', vorname: '', nachname: '', website: '', city: '', role: 'Material',
        bannerUrl: '', slide1_url: '', slide2_url: '', slide3_url: '', avatarUrl: ''
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
        bannerUrl: freshData?.bannerUrl || '',
        slide1_url: freshData?.slide1_url || '',
        slide2_url: freshData?.slide2_url || '',
        slide3_url: freshData?.slide3_url || '',
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

  // 🎛️ DAS AKTUALISIERTE SLIDER-ARRAY (VISITENKARTE ALS ERSTES BILD)
  const slides = [
    localFields.bannerUrl || 'https://unsplash.com', 
    localFields.slide1_url || 'https://unsplash.com',
    localFields.slide2_url || 'https://unsplash.com',
    localFields.slide3_url || 'https://unsplash.com'
  ];

  const nextSlide = () => { setCurrentSlide((prev) => (prev + 1) % slides.length); };
  const prevSlide = () => { setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length); };

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
            
      {/* ========================================================================= */}
      {/* HEADER & ASSISTENT                                                        */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-purple-950/20 to-slate-900/20 border border-purple-500/10 rounded-3xl p-5 space-y-4 shadow-xl mb-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[8px] text-purple-400 font-bold uppercase tracking-widest block">// BACKSTAGE-PORTFOLIO CONTROLLER</span>
            <h3 className="text-sm font-black text-white uppercase tracking-tight mt-0.5">⭐ Gigsda All-In-One Board</h3>
          </div>
          <button type="button" onClick={() => onNavigate('radar')} className="bg-slate-900 border border-slate-800 text-white px-3 py-1 rounded-xl text-[10px] font-bold cursor-pointer print:hidden">‹ Dashboard</button>
        </div>
      </div>
            
      {/* 🌌 INTERAKTIVER CYBERPUNK-BILDER-SLIDER MIT PFEILEN */}
      <div className="h-44 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/60 relative mb-6 group">
        <img src={slides[currentSlide]} alt={`Rent Slide ${currentSlide + 1}`} className="w-full h-full object-cover opacity-30 transition-all duration-500" />
        
        {/* Pfeil Links */}
        <button onClick={prevSlide} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer font-black text-xs">‹</button>
        {/* Pfeil Rechts */}
        <button onClick={nextSlide} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer font-black text-xs">›</button>

        <div className="absolute bottom-4 left-4 z-10">
          <span className="text-[8px] bg-amber-500/10 border border-amber-500 text-amber-400 font-bold px-2 py-0.5 rounded-md uppercase tracking-widest shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            🔌 RENTAL / SUPPLIER
          </span>
          <h1 className="text-lg font-black uppercase text-white tracking-wide mt-1">{localFields.project_name || 'Unbenannter Verleih-Service'}</h1>
        </div>

        {/* Indikator-Striche */}
        <div className="absolute bottom-4 right-4 z-10 flex gap-1">
          {slides.map((_, idx) => (
            <div key={idx} className={`h-1 transition-all duration-300 ${idx === currentSlide ? 'w-4 bg-amber-400' : 'w-1 bg-slate-700'}`} />
          ))}
        </div>
      </div>

      {/* 📊 ASYMMETRISCHES 2-SPALTEN-LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* LINKS: EDITIERUNG ODER REAKTIVE DATENANZEIGE */}
        <div className="space-y-4">
          {isEditing ? (
            <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4 shadow-xl">
              <span className="text-[8px] text-amber-400 uppercase font-black tracking-widest block">// EDIT-MODE: RENTAL PROTOCOL</span>
              
              {/* 🌌 DIE 4 PROFIL-MEDIEN INPUTS DIREKT OBEN IN DER MASKE */}
              <div className="space-y-2 pb-3 border-b border-slate-900/60 font-mono">
                <span className="text-[8px] text-amber-500 uppercase block tracking-widest font-black">// PROFILMEDIEN & SLIDER-CONFIG</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[7px] text-slate-600 uppercase block font-bold">Profilbild / Avatar URL</label>
                    <input type="text" name="avatarUrl" value={localFields.avatarUrl || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[10px] outline-none focus:border-amber-500/30 font-mono" placeholder="URL für Tech-Ansprechpartner" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[7px] text-cyan-400 uppercase block font-bold">Visitenkarte & Slide 1 (bannerUrl)</label>
                    <input type="text" name="bannerUrl" value={localFields.bannerUrl || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[10px] outline-none focus:border-cyan-500/30 font-mono" placeholder="URL für Haupt-Visitenkarte" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[7px] text-slate-600 uppercase block font-bold">Slider Bild 2 (slide1_url)</label>
                    <input type="text" name="slide1_url" value={localFields.slide1_url || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[10px] outline-none focus:border-cyan-500/30 font-mono" placeholder="URL für Slide 2" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[7px] text-slate-600 uppercase block font-bold">Slider Bild 3 (slide2_url)</label>
                    <input type="text" name="slide2_url" value={localFields.slide2_url || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[10px] outline-none focus:border-cyan-500/30 font-mono" placeholder="URL für Slide 3" />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[7px] text-slate-600 uppercase block font-bold">Slider Bild 4 (slide3_url)</label>
                    <input type="text" name="slide3_url" value={localFields.slide3_url || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[10px] outline-none focus:border-cyan-500/30 font-mono" placeholder="URL für Slide 4" />
                  </div>
                </div>
              </div>

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

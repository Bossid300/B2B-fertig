import React, { useState, useEffect } from 'react';

export default function LocationProfile({ onBack, ticketName, onNavigate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // 🎛️ LOGIK FÜR DEN REAKTIVEN BILDER-SLIDER (Muss vor dem HTML leben)
  const [currentSlide, setCurrentSlide] = useState(0);

  // 🔒 CRASH-SICHERER COCKPIT-SPEICHER FÜR REAKTIVE LOCATION-MEDIEN
  const [localFields, setLocalFields] = useState({
    name: ticketName || '',
    project_name: '',
    vorname: '',
    nachname: '',
    website: '',
    city: '',
    plz: '',
    street: '',
    phone: '',
    email: '',
    avatarUrl: '',
    bannerUrl: '',   // 🔒 Das Visitenkarten-Feld
    slide1_url: '',  // 🖼️ Slider Bild 1
    slide2_url: '',  // 🖼️ Slider Bild 2
    slide3_url: '',  // 🖼️ Slider Bild 3
    availability: '',
    location_type: '',
    highlight: '',
    construction_year: '',
    total_area: '',
    role: 'Location',
    
    room1_area: '', room1_bankett: '', room1_steh: '', room1_theater: '', room1_uform: '',
    room2_area: '', room2_steh: '',
    audio_tech: '', video_tech: '', light_tech: '', internet_tech: '', climate_control: '', accessibility: '',
    gastro_type: '', drinks_service: '', staff_service: '', furniture_service: '', decor_service: '', terms_conditions: ''
  });

  // 📡 CRASH-SICHERER LOAD-MECHANISMUS
  useEffect(() => {
    try {
      const savedProfiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');
      const currentProj = savedProfiles.find(p => p && p.name && p.name.trim().toLowerCase() === (ticketName || "").trim().toLowerCase());
      
      const freshData = currentProj || { 
        id: "GIGS-" + Math.floor(Math.random() * 9000 + 1000), 
        name: ticketName || '', 
        project_name: '', vorname: '', nachname: '', website: '', city: '', role: 'Location',
        bannerUrl: '', slide1_url: '', slide2_url: '', slide3_url: ''
      };
      
      setUserData(freshData);
      
      setLocalFields({
        ...freshData,
        name: ticketName || '',
        project_name: freshData?.project_name || '',
        vorname: freshData?.vorname || '',
        nachname: freshData?.nachname || '',
        website: freshData?.website || '',
        city: freshData?.city || freshData?.location || '',
        street: freshData?.street || '',
        plz: freshData?.plz || '',
        avatarUrl: freshData?.avatarUrl || '',
        
        // 🔒 DIE 4 MEDIEN-LEITUNGEN KORREKT ANKOPPELN:
        bannerUrl: freshData?.bannerUrl || '',
        slide1_url: freshData?.slide1_url || '',
        slide2_url: freshData?.slide2_url || '',
        slide3_url: freshData?.slide3_url || '',

        availability: freshData?.availability || '',
        location_type: freshData?.location_type || '',
        highlight: freshData?.highlight || '',
        construction_year: freshData?.construction_year || '',
        total_area: freshData?.total_area || '',
        role: freshData?.role || 'Location',
        room1_area: freshData?.room1_area || '', room1_bankett: freshData?.room1_bankett || '', room1_steh: freshData?.room1_steh || '', room1_theater: freshData?.room1_theater || '', room1_uform: freshData?.room1_uform || '', room2_area: freshData?.room2_area || '', room2_steh: freshData?.room2_steh || '',
        audio_tech: freshData?.audio_tech || '', video_tech: freshData?.video_tech || '', light_tech: freshData?.light_tech || '', internet_tech: freshData?.internet_tech || '', climate_control: freshData?.climate_control || '', accessibility: freshData?.accessibility || '', gastro_type: freshData?.gastro_type || '', drinks_service: freshData?.drinks_service || '', staff_service: freshData?.staff_service || '', furniture_service: freshData?.furniture_service || '', decor_service: freshData?.decor_service || '', terms_conditions: freshData?.terms_conditions || ''
      });
    } catch (e) {
      console.error("Fehler beim reaktiven Location-Load:", e);
    }
  }, [ticketName]);

  // 🎛️ DAS AKTUALISIERTE SLIDER-ARRAY FÜR EUCH (BANNER ALS ERSTES BILD)
  const slides = [
    localFields.bannerUrl || 'https://unsplash.com', // Visitenkarte & Slide 1
    localFields.slide1_url || 'https://unsplash.com',
    localFields.slide2_url || 'https://unsplash.com',
    localFields.slide3_url || 'https://unsplash.com'
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };



  const handleInplaceChange = (e) => {
    const { name, value } = e.target;
    setLocalFields(prev => ({ ...prev, [name]: value }));
  };
  // ⭐ PRÜFT, OB DIESE LOCATION BEREITS EIN FAVORIT IST
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
        alert("Location aus den B2B-Favoriten entfernt! ☆");
      } else {
        const newFav = {
          name: ticketName,
          role: 'Location',
          city: localFields.city || 'Nicht hinterlegt',
          avatarUrl: localFields.avatarUrl || '',
          note: localFields.project_name ? `Event-Halle: ${localFields.project_name}` : 'Gemerkte Location'
        };
        savedFavs.push(newFav);
        setIsFavorite(true);
        alert("Location erfolgreich zu den Favoriten hinzugefügt! ★");
      }
      localStorage.setItem('gigsda_favorites', JSON.stringify(savedFavs));
    } catch (e) { console.error(e); }
  };
  const handleSave = () => {
    try {
      const savedProfiles = JSON.parse(localStorage.getItem('gigsda_profiles')) || [];
      const updatedProfile = { 
        ...userData, 
        ...localFields,
        name: ticketName
      };
      
      const index = savedProfiles.findIndex(p => p && p.name && p.name.trim().toLowerCase() === ticketName.toLowerCase());
      
      if (index > -1) {
        savedProfiles[index] = updatedProfile;
      } else {
        savedProfiles.push(updatedProfile);
      }
      
      localStorage.setItem('gigsda_profiles', JSON.stringify(savedProfiles));
      setUserData(updatedProfile);
      setIsEditing(false);
      
      alert("B2B-Locationprofil erfolgreich aktualisiert! 🏟️⚡");
    } catch (e) {
      console.error("Fehler beim Speichern der Location:", e);
    }
  };

  if (!userData) return <div className="p-6 text-xs text-slate-600 font-mono">// INITIALISIERE COCKPIT...</div>;

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
      
      {/* 🌌 INTERAKTIVER CYBERPUNK-BILDER-SLIDER (EXAKTES USERPROFILE-DESIGN) */}
      <div className="h-64 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/60 relative mb-6 group">
        
        {/* Das aktuell aktive Slide-Bild */}
        <img 
          src={slides[currentSlide]} 
          alt={`Location Slide ${currentSlide + 1}`} 
          className="w-full h-full object-cover opacity-50 transition-all duration-500 scale-100 group-hover:scale-102"
        />

        {/* Pfeil Links */}
        <button 
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-400 w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer font-black text-xs"
        >
          ‹
        </button>

        {/* Pfeil Rechts */}
        <button 
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-400 w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer font-black text-xs"
        >
          ›
        </button>

        {/* Overlay-Texte & Rollen-Badge am linken unteren Rand */}
        <div className="absolute bottom-4 left-4 z-10 font-mono">
          <span className="text-[8px] bg-cyan-500/10 border border-cyan-500 text-cyan-400 font-bold px-2 py-0.5 rounded-md uppercase tracking-widest shadow-[0_0_10px_rgba(34,211,238,0.1)]">
            🏟️ {localFields.role}
          </span>
          <h1 className="text-lg font-black uppercase text-white tracking-wide mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {localFields.project_name || 'Unbenannte Event-Location'}
          </h1>
        </div>

        {/* Slide-Indikatoren (Kleine Punkte unten rechts) */}
        <div className="absolute bottom-4 right-4 z-10 flex gap-1">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 transition-all duration-300 ${idx === currentSlide ? 'w-4 bg-cyan-400' : 'w-1 bg-slate-700'}`}
            />
          ))}
        </div>

      </div>


      <div className="w-full">
        {isEditing ? (
          /* 🛠️ STOCKWERK A: DIE INTERAKTIVEN EINGABEMASKEN */
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-6 shadow-xl font-mono">
            <span className="text-[8px] text-cyan-400 uppercase font-black tracking-widest block">// EDIT-MODE: LOCATION PROTOCOL</span>
            {/* 🌌 REAKTIVE INPUTS FÜR DIE 4 PROFIL-MEDIEN */}
            <div className="space-y-2 sm:col-span-2 pt-2 border-t border-slate-900/60 font-mono">
              <span className="text-[8px] text-slate-500 uppercase block tracking-widest font-black">// PROFILMEDIEN & SLIDER-CONFIG</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] text-cyan-400 uppercase block font-bold">Visitenkarten-Bild & Slide 1 (bannerUrl)</label>
                  <input type="text" name="bannerUrl" value={localFields.bannerUrl || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30 font-mono" placeholder="URL für Visitenkarte" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 block font-bold">Slider Bild 2 (slide1_url)</label>
                  <input type="text" name="slide1_url" value={localFields.slide1_url || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30 font-mono" placeholder="URL für Slide 2" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 block font-bold">Slider Bild 3 (slide2_url)</label>
                  <input type="text" name="slide2_url" value={localFields.slide2_url || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30 font-mono" placeholder="URL für Slide 3" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 block font-bold">Slider Bild 4 (slide3_url)</label>
                  <input type="text" name="slide3_url" value={localFields.slide3_url || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30 font-mono" placeholder="URL für Slide 4" />
                </div>
              </div>
            </div>

            {/* 1. TOPF: STAMMDATEN INPUTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[8px] text-slate-600 uppercase block font-bold">Location- / Clubname</label>
                <input type="text" name="project_name" value={localFields.project_name || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" placeholder="z. B. Eventhalle Braunau" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] text-slate-600 uppercase block font-bold">Verfügbarkeit</label>
                <input type="text" name="availability" value={localFields.availability || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" placeholder="z. B. Ganzjährig, Auf Anfrage" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] text-slate-600 uppercase block font-bold">Vorname (Kontaktperson)</label>
                <input type="text" name="vorname" value={localFields.vorname || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] text-slate-600 uppercase block font-bold">Nachname (Kontaktperson)</label>
                <input type="text" name="nachname" value={localFields.nachname || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[8px] text-slate-600 uppercase block font-bold">Homepage / URL</label>
                <input type="text" name="website" value={localFields.website || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" placeholder="https://deine-location.at" />
              </div>
              
              {/* Adressblock */}
              <div className="space-y-1 sm:col-span-2 grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Straße & Hausnummer</label>
                  <input type="text" name="street" value={localFields.street || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" />
                </div>
                <div>
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">PLZ</label>
                  <input type="text" name="plz" value={localFields.plz || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" />
                </div>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[8px] text-slate-600 uppercase block font-bold">Stadt / Ort</label>
                <input type="text" name="city" value={localFields.city || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" />
              </div>
            </div>

            {/* 2. TOPF: LOCATION-STECKBRIEF INPUTS */}
            <div className="mt-6 pt-4 border-t border-slate-900 space-y-4">
              <span className="text-[8px] text-cyan-400 uppercase font-black tracking-widest block">// EDIT-MODE: 2. LOCATION-STECKBRIEF</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Art der Location</label>
                  <input type="text" name="location_type" value={localFields.location_type || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" placeholder="z. B. Eventhalle, Schloss, Club" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Gesamtfläche (in m²)</label>
                  <input type="text" name="total_area" value={localFields.total_area || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" placeholder="z. B. 450" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Baujahr / Letzte Renovierung</label>
                  <input type="text" name="construction_year" value={localFields.construction_year || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" placeholder="z. B. 1994 / Rev. 2024" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Besonderes B2B Highlight</label>
                  <input type="text" name="highlight" value={localFields.highlight || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" placeholder="z. B. Historisches Deckengewölbe" />
                </div>
              </div>
            </div>

            {/* 3. TOPF: TABELLEN-INPUT FÜR KAPAZITÄTEN */}
            <div className="pt-4 border-t border-slate-900 space-y-3">
              <span className="text-[8px] text-amber-500 uppercase font-black tracking-widest block">// 3. KAPAZITÄTEN & BESTUHLUNGSVARIANTEN</span>
              <div className="space-y-3">
                <div className="bg-slate-900/40 p-3 border border-slate-900 rounded-xl space-y-2">
                  <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Raum 1: Großer Saal / Hauptfläche</span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <div>
                      <label className="text-[7px] text-slate-600 uppercase block font-bold">Fläche (m²)</label>
                      <input type="text" name="room1_area" value={localFields.room1_area || ''} onChange={handleInplaceChange} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-[10px] outline-none font-mono" placeholder="250" />
                    </div>
                    <div>
                      <label className="text-[7px] text-slate-600 uppercase block font-bold">Bankett</label>
                      <input type="text" name="room1_bankett" value={localFields.room1_bankett || ''} onChange={handleInplaceChange} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-[10px] outline-none font-mono" placeholder="120" />
                    </div>
                    <div>
                      <label className="text-[7px] text-slate-600 uppercase block font-bold">Stehempfang</label>
                      <input type="text" name="room1_steh" value={localFields.room1_steh || ''} onChange={handleInplaceChange} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-[10px] outline-none font-mono" placeholder="200" />
                    </div>
                    <div>
                      <label className="text-[7px] text-slate-600 uppercase block font-bold">Theater</label>
                      <input type="text" name="room1_theater" value={localFields.room1_theater || ''} onChange={handleInplaceChange} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-[10px] outline-none font-mono" placeholder="180" />
                    </div>
                    <div>
                      <label className="text-[7px] text-slate-600 uppercase block font-bold">U-Form</label>
                      <input type="text" name="room1_uform" value={localFields.room1_uform || ''} onChange={handleInplaceChange} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-[10px] outline-none font-mono" placeholder="40" />
                    </div>
                  </div>
                </div>
                <div className="bg-slate-900/40 p-3 border border-slate-900 rounded-xl space-y-2">
                  <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">Raum 2: Foyer / Nebenraum</span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <div>
                      <label className="text-[7px] text-slate-600 uppercase block font-bold">Fläche (m²)</label>
                      <input type="text" name="room2_area" value={localFields.room2_area || ''} onChange={handleInplaceChange} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-[10px] outline-none font-mono" placeholder="80" />
                    </div>
                    <div>
                      <label className="text-[7px] text-slate-600 uppercase block font-bold">Stehempfang</label>
                      <input type="text" name="room2_steh" value={localFields.room2_steh || ''} onChange={handleInplaceChange} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-[10px] outline-none font-mono" placeholder="50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. TOPF: TECHNISCHE AUSSTATTUNG INPUTS */}
            <div className="pt-4 border-t border-slate-900 space-y-3">
              <span className="text-[8px] text-cyan-400 uppercase font-black tracking-widest block">// EDIT-MODE: 4. TECHNISCHE AUSSTATTUNG</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Audio-Technik (Anlage, Mics, Pult)</label>
                  <input type="text" name="audio_tech" value={localFields.audio_tech || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Video- / Präsentationstechnik</label>
                  <input type="text" name="video_tech" value={localFields.video_tech || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Lichttechnik / Ambiente</label>
                  <input type="text" name="light_tech" value={localFields.light_tech || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Internet / Bandbreite</label>
                  <input type="text" name="internet_tech" value={localFields.internet_tech || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Klimatisierung</label>
                  <input type="text" name="climate_control" value={localFields.climate_control || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Barrierefreiheit / Aufzug</label>
                  <input type="text" name="accessibility" value={localFields.accessibility || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" />
                </div>
              </div>
            </div>

            {/* 5. TOPF: SERVICES & KULINARIK INPUTS */}
            <div className="pt-4 border-t border-slate-900 space-y-3">
              <span className="text-[8px] text-cyan-400 uppercase font-black tracking-widest block">// EDIT-MODE: 5. SERVICES & KULINARIK</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Catering (Partner, freie Wahl, Küche)</label>
                  <input type="text" name="gastro_type" value={localFields.gastro_type || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Getränke / Abrechnungsvarianten</label>
                  <input type="text" name="drinks_service" value={localFields.drinks_service || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Bereitgestelltes Personal</label>
                  <input type="text" name="staff_service" value={localFields.staff_service || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Inhouse-Möblierung / Loungemöbel</label>
                  <input type="text" name="furniture_service" value={localFields.furniture_service || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Dekoration / Raumgestaltung</label>
                  <input type="text" name="decor_service" value={localFields.decor_service || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" />
                </div>
              </div>
            </div>

            {/* 6. TOPF: RAHMENBEDINGUNGEN INPUT */}
            <div className="pt-4 border-t border-slate-900 space-y-2">
              <span className="text-[8px] text-amber-500 uppercase font-black tracking-widest block">// EDIT-MODE: 6. RAHMENBEDINGUNGEN</span>
              <label className="text-[8px] text-slate-600 uppercase block font-bold">Mietkonditionen, Kaution, Sperrstunden</label>
              <textarea rows="3" name="terms_conditions" value={localFields.terms_conditions || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-[10px] outline-none resize-none focus:border-amber-500/30 font-mono" placeholder="z. B. Sperrstunde ab 04:00 Uhr..." />
            </div>

            {/* FORM ACTIONS */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900">
              <button 
                type="button" 
                onClick={() => { setLocalFields({ ...userData }); setIsEditing(false); }} 
                className="px-4 py-2 bg-slate-900/80 border border-red-500/30 hover:border-red-500/60 text-slate-400 hover:text-red-400 text-[10px] font-bold uppercase rounded-xl transition-all cursor-pointer"
              >
                ✕ ABBRECHEN
              </button>
              <button 
                type="button" 
                onClick={handleSave} 
                className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/40 hover:border-cyan-500 text-cyan-400 hover:text-white text-[10px] font-bold uppercase rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.1)]"
              >
                ✓ DETAILS SPEICHERN
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* 📊 STOCKWERK B: DIE ANZEIGEFELDER (DEIN NEUES 2-SPALTEN-LAYOUT)           */
          /* ========================================================================= */
          <div className="space-y-6 animate-fade-in font-mono">
            
            {/* 🎛️ DIE NEUE ZWEI-SPALTEN-REIHE (PUNKT 1 LINKS / PUNKT 2 RECHTS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              
              {/* LINKS: PUNKT 1 - STAMMDATEN & KONTAKT */}
              <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest block">// 1. STAMMDATEN & KONTAKT</span>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Location: <span className="text-white ml-1 font-normal uppercase">{localFields.project_name || 'Nicht hinterlegt'}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Adresse: <span className="text-white ml-1 font-normal uppercase">{localFields.street} {localFields.plz} {localFields.city || 'Nicht hinterlegt'}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Website:{' '}
                    {localFields.website ? (
                      <a href={localFields.website.startsWith('http') ? localFields.website : `https://${localFields.website}`} target="_blank" rel="noopener noreferrer" className="text-white hover:text-cyan-400 ml-1 font-normal lowercase transition-colors underline">
                        {localFields.website} ↗
                      </a>
                    ) : (
                      <span className="text-slate-600 ml-1 font-normal">Keine Website</span>
                    )}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Kontakt: <span className="text-white ml-1 font-normal uppercase">{localFields.vorname} {localFields.nachname || 'Nicht hinterlegt'}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-cyan-400">
                    Verfügbar: <span className="text-white ml-1 font-normal uppercase">{localFields.availability || 'Nicht definiert'}</span>
                  </p>
                </div>
              </div>

              {/* RECHTS: PUNKT 2 - LOCATION-STECKBRIEF */}
              <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest block">// 2. LOCATION-STECKBRIEF</span>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Art der Location: <span className="text-white ml-1 font-normal uppercase">{localFields.location_type || 'Nicht hinterlegt'}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-cyan-400">
                    B2B-Highlight: <span className="text-white ml-1 font-normal lowercase italic">{localFields.highlight || 'Keine Angaben'}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Baujahr / Ren.: <span className="text-white ml-1 font-normal uppercase">{localFields.construction_year || 'Nicht angegeben'}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Gesamtfläche: <span className="text-white ml-1 font-normal uppercase">{localFields.total_area ? `${localFields.total_area} m²` : 'Nicht angegeben'}</span>
                  </p>
                </div>
                          {!isEditing && (
            <div className="pt-4 space-y-2">
              <button 
                onClick={handleToggleFavorite}
                className={`w-full text-[9px] font-bold uppercase py-1.5 rounded-xl text-center border font-mono transition-all cursor-pointer tracking-wider ${isFavorite ? 'bg-amber-500/10 border-amber-500 text-amber-400 hover:bg-amber-500/20' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
              >
                {isFavorite ? '★ AUS FAVORITEN ENTFERNEN' : '☆ ZU DEN FAVORITEN'}
              </button>
              <button onClick={() => setIsEditing(true)} className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-[9px] font-bold uppercase py-1.5 rounded-xl text-center tracking-wider font-mono cursor-pointer">⚙️ LOCATION EDITIEREN</button>
            </div>
          )}

              </div>

            </div>

            {/* 🏟️ DARUNTER: ANZEIGE PUNKT 3 (KAPAZITÄTEN & BESTUHLUNGSVARIANTEN) */}
            <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 space-y-4 shadow-xl">
              <div>
                <span className="text-[8px] text-amber-500 uppercase font-black tracking-widest block">// 3. KAPAZITÄTEN & BESTUHLUNGSVARIANTEN</span>
                <h2 className="text-xs font-black text-white uppercase tracking-wider mt-1">Verfügbare Räumlichkeiten & Bestuhlung</h2>
              </div>

              <div className="space-y-3">
                {localFields.room1_area && (
                  <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                      <span className="text-[10px] text-white font-bold uppercase tracking-wide">🏟️ Raum 1: Großer Saal / Hauptfläche</span>
                      <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/5 px-2 py-0.5 rounded border border-cyan-500/10">
                        {localFields.room1_area} M²
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1">
                      <div className="bg-slate-900/40 border border-slate-900/60 rounded-lg p-2">
                        <span className="text-[7px] text-slate-500 block uppercase font-bold">🍽️ Bankett</span>
                        <span className="text-xs font-black text-white">{localFields.room1_bankett || '-'} <span className="text-[8px] text-slate-600 font-normal">Pax</span></span>
                      </div>
                      <div className="bg-slate-900/40 border border-slate-900/60 rounded-lg p-2">
                        <span className="text-[7px] text-slate-500 block uppercase font-bold">🕺 Stehempfang</span>
                        <span className="text-xs font-black text-white">{localFields.room1_steh || '-'} <span className="text-[8px] text-slate-600 font-normal">Pax</span></span>
                      </div>
                      <div className="bg-slate-900/40 border border-slate-900/60 rounded-lg p-2">
                        <span className="text-[7px] text-slate-500 block uppercase font-bold">🎭 Theater</span>
                        <span className="text-xs font-black text-white">{localFields.room1_theater || '-'} <span className="text-[8px] text-slate-600 font-normal">Pax</span></span>
                      </div>
                      <div className="bg-slate-900/40 border border-slate-900/60 rounded-lg p-2">
                        <span className="text-[7px] text-slate-500 block uppercase font-bold">🪑 U-Form</span>
                        <span className="text-xs font-black text-white">{localFields.room1_uform || '-'} <span className="text-[8px] text-slate-600 font-normal">Pax</span></span>
                      </div>
                    </div>
                  </div>
                )}

                {localFields.room2_area && (
                  <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                      <span className="text-[10px] text-white font-bold uppercase tracking-wide">🥂 Raum 2: Foyer / Nebenraum</span>
                      <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/5 px-2 py-0.5 rounded border border-cyan-500/10">
                        {localFields.room2_area} M²
                      </span>
                    </div>
                    <div className="bg-slate-900/40 border border-slate-900/60 rounded-lg p-2 flex justify-between items-center px-4">
                      <span className="text-[8px] text-slate-500 uppercase font-bold">🥂 Stehempfang / Sektempfang</span>
                      <span className="text-xs font-black text-white">{localFields.room2_steh || '-'} <span className="text-[8px] text-slate-600 font-normal">Pax</span></span>
                    </div>
                  </div>
                )}

                {!localFields.room1_area && !localFields.room2_area && (
                  <div className="text-center p-6 border border-dashed border-slate-900 rounded-xl text-[10px] text-slate-600">
                    // KEINE RAUMDATEN INJEZIERT • KLICKE OBEN AUF EDITIEREN ⚙️
                  </div>
                )}
              </div>
            </div>

            {/* 🛰️ DARUNTER: ANZEIGE PUNKT 4 (TECHNISCHE INFRASTRUKTUR) */}
            <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 space-y-4 shadow-xl">
              <div>
                <span className="text-[8px] text-cyan-500 uppercase font-black tracking-widest block">// 4. TECHNISCHE AUSSTATTUNG & INFRASTRUKTUR</span>
                <h2 className="text-xs font-black text-white uppercase tracking-wider mt-1">Bühnen- & Haustechnik-Spezifikationen</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] font-mono">
                <div className="bg-slate-950/40 border border-slate-900/60 rounded-xl p-3">
                  <p className="text-slate-500 font-bold uppercase tracking-wider">🎙️ Audio-System:</p>
                  <p className="text-white font-normal mt-0.5">{localFields.audio_tech || 'Keine Angaben'}</p>
                </div>
                <div className="bg-slate-950/40 border border-slate-900/60 rounded-xl p-3">
                  <p className="text-slate-500 font-bold uppercase tracking-wider">📹 Video & Projektion:</p>
                  <p className="text-white font-normal mt-0.5">{localFields.video_tech || 'Keine Angaben'}</p>
                </div>
                <div className="bg-slate-950/40 border border-slate-900/60 rounded-xl p-3">
                  <p className="text-slate-500 font-bold uppercase tracking-wider">💡 Licht & Ambiente:</p>
                  <p className="text-white font-normal mt-0.5">{localFields.light_tech || 'Keine Angaben'}</p>
                </div>
                <div className="bg-slate-950/40 border border-slate-900/60 rounded-xl p-3">
                  <p className="text-slate-500 font-bold uppercase tracking-wider">🌐 B2B Netzwerk/Internet:</p>
                  <p className="text-white font-normal mt-0.5">{localFields.internet_tech || 'Keine Angaben'}</p>
                </div>
                <div className="bg-slate-950/40 border border-slate-900/60 rounded-xl p-3">
                  <p className="text-slate-500 font-bold uppercase tracking-wider">❄️ Klima- & Lüftungstechnik:</p>
                  <p className="text-white font-normal mt-0.5">{localFields.climate_control || 'Keine Angaben'}</p>
                </div>
                <div className="bg-slate-950/40 border border-slate-900/60 rounded-xl p-3">
                  <p className="text-slate-500 font-bold uppercase tracking-wider">♿ Barrierefreiheit:</p>
                  <p className="text-white font-normal mt-0.5">{localFields.accessibility || 'Keine Angaben'}</p>
                </div>
              </div>
            </div>

            {/* 🛰️ DARUNTER: ANZEIGE PUNKT 5 (SERVICES & KULINARIK) */}
            <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 space-y-4 shadow-xl">
              <div>
                <span className="text-[8px] text-cyan-500 uppercase font-black tracking-widest block">// 5. SERVICES & KULINARIK</span>
                <h2 className="text-xs font-black text-white uppercase tracking-wider mt-1">Gastronomie- & Event-Dienstleistungen</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] font-mono">
                <div className="bg-slate-950/40 border border-slate-900/60 rounded-xl p-3">
                  <p className="text-slate-500 font-bold uppercase tracking-wider">🍽️ Catering-Anbindung:</p>
                  <p className="text-white font-normal mt-0.5">{localFields.gastro_type || 'Keine Angaben'}</p>
                </div>
                <div className="bg-slate-950/40 border border-slate-900/60 rounded-xl p-3">
                  <p className="text-slate-500 font-bold uppercase tracking-wider">🥂 Getränke-Modus:</p>
                  <p className="text-white font-normal mt-0.5">{localFields.drinks_service || 'Keine Angaben'}</p>
                </div>
                <div className="bg-slate-950/40 border border-slate-900/60 rounded-xl p-3">
                  <p className="text-slate-500 font-bold uppercase tracking-wider">👔 Event-Personal:</p>
                  <p className="text-white font-normal mt-0.5">{localFields.staff_service || 'Keine Angaben'}</p>
                </div>
                <div className="bg-slate-950/40 border border-slate-900/60 rounded-xl p-3">
                  <p className="text-slate-500 font-bold uppercase tracking-wider">🪑 Möblierung & Inventar:</p>
                  <p className="text-white font-normal mt-0.5">{localFields.furniture_service || 'Keine Angaben'}</p>
                </div>
                <div className="bg-slate-950/40 border border-slate-900/60 rounded-xl p-3 sm:col-span-2">
                  <p className="text-slate-500 font-bold uppercase tracking-wider">✨ Dekoration & Floristik:</p>
                  <p className="text-white font-normal mt-0.5">{localFields.decor_service || 'Keine Angaben'}</p>
                </div>
              </div>
            </div>

            {/* 🛰️ DARUNTER: ANZEIGE PUNKT 6 (RAHMENBEDINGUNGEN & KONDITIONEN) */}
            <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 space-y-3 shadow-xl">
              <div>
                <span className="text-[8px] text-amber-500 uppercase font-black tracking-widest block">// 6. RAHMENBEDINGUNGEN & KONDITIONEN</span>
                <h2 className="text-xs font-black text-white uppercase tracking-wider mt-1">Rechtliche & Organisatorische Vereinbarungen</h2>
              </div>
              <div className="bg-slate-950/50 border border-slate-900/80 rounded-xl p-4 font-mono text-[10px] text-slate-300 leading-relaxed border-l-2 border-l-amber-500/40">
                {localFields.terms_conditions ? (
                  <p className="whitespace-pre-line">{localFields.terms_conditions}</p>
                ) : (
                  <p className="text-slate-600 italic">// Keine speziellen Rahmenbedingungen hinterlegt.</p>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

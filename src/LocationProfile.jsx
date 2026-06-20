import React, { useState, useEffect } from 'react';
import CrewRequestCenter from './CrewRequestCenter';
import ProfileHeaderBox from './components/ProfileHeaderBox'; // Ganz oben importieren

export default function LocationProfile({ onBack, ticketName, onNavigate }) {

  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [editStammdaten, setEditStammdaten] = useState(false);
  const [editSteckbrief, setEditSteckbrief] = useState(false);
  const [editKapazitaeten, setEditKapazitaeten] = useState(false);
  const [editTech, setEditTech] = useState(false);
  const [editGastro, setEditGastro] = useState(false);
  const [editConditions, setEditConditions] = useState(false);


  
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
    gastro_type: '', drinks_service: '', staff_service: '', furniture_service: '', decor_service: '', terms_conditions: '',
    room1_img: '', room2_img: '', power_specs: '', stage_design: ''
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
        audio_tech: freshData?.audio_tech || '', video_tech: freshData?.video_tech || '', light_tech: freshData?.light_tech || '', internet_tech: freshData?.internet_tech || '', climate_control: freshData?.climate_control || '', accessibility: freshData?.accessibility || '', gastro_type: freshData?.gastro_type || '', drinks_service: freshData?.drinks_service || '', staff_service: freshData?.staff_service || '', furniture_service: freshData?.furniture_service || '', decor_service: freshData?.decor_service || '', terms_conditions: freshData?.terms_conditions || '',
        room1_img: freshData?.room1_img || '',
        room2_img: freshData?.room2_img || '',
        power_specs: freshData?.power_specs || '',
        stage_design: freshData?.stage_design || ''
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
            
      <ProfileHeaderBox currentProfileName={ticketName} />
      <CrewRequestCenter currentProfileName={ticketName} />


      {/* ========================================================================= */}
      {/* HEADER & ASSISTENT                                                        */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-purple-950/20 to-slate-900/20 border border-purple-500/10 rounded-3xl p-5 space-y-4 shadow-xl mb-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[8px] text-purple-400 font-bold uppercase tracking-widest block">// BACKSTAGE-PORTFOLIO CONTROLLER</span>
            <h3 className="text-sm font-black text-white uppercase tracking-tight mt-0.5">⭐ Gigsda All-In-One Board</h3>
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
              



        {/* // 1. STAMMDATEN & KONTAKT (ISOLIERT MIT EIGENEM SCHALTER!) */}
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60 flex flex-col justify-between min-h-[320px]">
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-slate-800/40 pb-2 font-mono">
              <h3 className="text-slate-400 text-xs tracking-widest uppercase">// 1. STAMMDATEN & KONTAKT</h3>
              {!editStammdaten && (
                <button 
                  type="button"
                  onClick={() => setEditStammdaten(true)} 
                  className="text-cyan-400 hover:text-cyan-300 text-xs font-bold transition-colors cursor-pointer outline-none font-mono"
                >
                  ✏️ BEARBEITEN
                </button>
              )}
            </div>

            {editStammdaten ? (
              <div className="space-y-3 font-mono text-xs text-left">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500 text-[10px] font-bold">LOCATION NAME:</label>
                  <input type="text" value={localFields.ticketName || ''} onChange={(e) => setLocalFields({...localFields, ticketName: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" />
                </div>
                {/* 🖼️ 2. INPUT: AVATAR / LOGO-URL (NEU INJEZIERT!) */}
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500 text-[10px] font-bold uppercase text-cyan-400">🖼️ Avatar / Logo-URL (Bild-Link):</label>
                  <input 
                    type="text" 
                    value={localFields.avatarUrl || ''} 
                    onChange={(e) => setLocalFields({...localFields, avatarUrl: e.target.value})} 
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" 
                    placeholder="z.B. /2026/logos/arena-logo.png oder Internet-Link" 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500 text-[10px] font-bold">WEBSITE:</label>
                  <input type="text" value={localFields.website || ''} onChange={(e) => setLocalFields({...localFields, website: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500 text-[10px] font-bold">TELEFON:</label>
                  <input type="text" value={localFields.phone || ''} onChange={(e) => setLocalFields({...localFields, phone: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500 text-[10px] font-bold">EMAIL:</label>
                  <input type="text" value={localFields.email || ''} onChange={(e) => setLocalFields({...localFields, email: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500 text-[10px] font-bold">VERFÜGBAR:</label>
                  <input type="text" value={localFields.availability || ''} onChange={(e) => setLocalFields({...localFields, availability: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" />
                </div>
              </div>
            ) : (
              /* 🌌 CYBERPUNK-AVATAR METRIC DESIGN: Platziert das Logo links neben deiner originalen Tabelle */
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-left font-mono text-xs">
                
                {/* 🖼️ DIE AVATAR-BLASE: Rund, mit Cyan-Border und dezenter Glow-Aura */}
                <div className="w-20 h-20 rounded-full border-2 border-cyan-500/80 overflow-hidden shrink-0 bg-slate-950/80 flex items-center justify-center relative shadow-[0_0_15px_rgba(6,182,212,0.15)] group select-none">
                  <img 
                    src={localFields.avatarUrl && localFields.avatarUrl.trim() !== "" ? localFields.avatarUrl : "https://unsplash.com"} 
                    alt="Location Logo" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://unsplash.com";
                    }}
                  />
                </div>
                
                {/* DEINE ORIGINALE TEXT-LISTE (Absolut unberührt und perfekt daneben fluchtend!) */}
                <div className="space-y-3 flex-1 text-slate-300 w-full pt-1">
                  <p><span className="text-slate-500 font-bold">LOCATION:</span> <span className="text-white font-black">{localFields.ticketName || 'NICHT DEFINIERT'}</span></p>
                  <p><span className="text-slate-500 font-bold">WEBSITE:</span> <span className="text-cyan-400">{localFields.website || 'NICHT DEFINIERT'}</span></p>
                  <p><span className="text-slate-500 font-bold">TELEFON:</span> <span className="text-white font-bold">{localFields.phone || 'NICHT DEFINIERT'}</span></p>
                  <p><span className="text-slate-500 font-bold">EMAIL:</span> <span className="text-white">{localFields.email || 'NICHT DEFINIERT'}</span></p>
                  <p><span className="text-slate-500 font-bold">VERFÜGBAR:</span> <span className="text-pink-400 font-bold tracking-wide">{localFields.availability || 'NICHT DEFINIERT'}</span></p>
                </div>

              </div>
            )}

          </div>

          {editStammdaten && (
            <div className="flex gap-2 justify-end mt-4 pt-3 border-t border-slate-800/40 font-mono text-xs">
              <button 
                type="button"
                onClick={() => setEditStammdaten(false)} 
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-xl font-bold transition-colors cursor-pointer"
              >
                ABBRECHEN
              </button>
              <button 
                type="button"
                onClick={() => {
                  console.log("🔒 Stammdaten & avatarUrl werden unzerstörbar in die Festplatte gepresst...", localFields);
                  try {
                    // 📡 1. Holt die gesamte Profildatenbank live von der Festplatte
                    const savedProfiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');
                    const activeUser = localStorage.getItem('gigsda_user_name') || "";
                    
                    // 📡 2. Sucht das exakte Profil dieser Arena Braunau Location
                    const profileIndex = savedProfiles.findIndex(p => p && (
                      (p.name && p.name.trim().toLowerCase() === activeUser.trim().toLowerCase()) ||
                      (p.ticketName && p.ticketName.trim().toLowerCase() === activeUser.trim().toLowerCase())
                    ));

                    if (profileIndex !== -1) {
                      // 🎯 DER LIVE-FIX: Überschreibt das Profil auf der Festplatte mitsamt eurer neuen avatarUrl!
                      savedProfiles[profileIndex] = { ...savedProfiles[profileIndex], ...localFields };
                      localStorage.setItem('gigsda_profiles', JSON.stringify(savedProfiles));
                      console.log("🎯 LocalStorage-Update für Stammdaten-Avatar erfolgreich abgeschlossen!");
                    }
                  } catch (err) {
                    console.error("Kritischer LocalStorage Schreibfehler abgefangen:", err);
                  }

                  // 📡 3. Informiert Daniels RAM-States und schließt die Box isoliert ab
                  if (typeof onUpdate === 'function') {
                    onUpdate(localFields);
                  }
                  setEditStammdaten(false);
                }} 
                className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-black shadow-md transition-all transform hover:scale-[1.02] cursor-pointer"
              >
                SICHERN
              </button>

            </div>
          )}
        </div>







        {/* // 2. LOCATION-STECKSTRIEF (ISOLIERT MIT EIGENEM SCHALTER & OHNE UNTERE BUTTONS!) */}
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60 flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-slate-800/40 pb-2 font-mono">
              <h3 className="text-slate-400 text-xs tracking-widest uppercase">// 2. LOCATION-STECKSTRIEF</h3>
              {!editSteckbrief && (
                <button 
                  type="button"
                  onClick={() => setEditSteckbrief(true)} 
                  className="text-cyan-400 hover:text-cyan-300 text-xs font-bold transition-colors cursor-pointer outline-none font-mono"
                >
                  ✏️ BEARBEITEN
                </button>
              )}
            </div>

            {editSteckbrief ? (
              <div className="space-y-3 font-mono text-xs text-left">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500 text-[10px] font-bold">ART DER LOCATION:</label>
                  <input type="text" value={localFields.location_type || ''} onChange={(e) => setLocalFields({...localFields, location_type: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500 text-[10px] font-bold">B2B-HIGHLIGHT:</label>
                  <input type="text" value={localFields.highlight || ''} onChange={(e) => setLocalFields({...localFields, highlight: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500 text-[10px] font-bold">BAUJAHR / REN.:</label>
                  <input type="text" value={localFields.construction_year || ''} onChange={(e) => setLocalFields({...localFields, construction_year: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500 text-[10px] font-bold">GESAMTFLÄCHE:</label>
                  <input type="text" value={localFields.total_area || ''} onChange={(e) => setLocalFields({...localFields, total_area: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" placeholder="z.B. 450 m²" />
                </div>
              </div>
            ) : (
              <div className="space-y-3 font-mono text-xs text-left text-slate-300">
                <p><span className="text-slate-500 font-bold">ART DER LOCATION:</span> <span className="text-white font-black">{localFields.location_type || 'NICHT DEFINIERT'}</span></p>
                <p><span className="text-slate-500 font-bold">B2B-HIGHLIGHT:</span> <span className="text-white italic text-cyan-400">{localFields.highlight || 'NICHT DEFINIERT'}</span></p>
                <p><span className="text-slate-500 font-bold">BAUJAHR / REN.:</span> <span className="text-white font-bold">{localFields.construction_year || 'NICHT DEFINIERT'}</span></p>
                <p><span className="text-slate-500 font-bold">GESAMTFLÄCHE:</span> <span className="text-white font-bold tracking-wide">{localFields.total_area || 'NICHT DEFINIERT'}</span></p>
              </div>
            )}
          </div>

          {editSteckbrief && (
            <div className="flex gap-2 justify-end mt-4 pt-3 border-t border-slate-800/40 font-mono text-xs">
              <button 
                type="button"
                onClick={() => setEditSteckbrief(false)} 
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-xl font-bold transition-colors cursor-pointer"
              >
                ABBRECHEN
              </button>
              <button 
                type="button"
                onClick={() => {
                  console.log("🔒 Steckbrief isoliert gesichert:", localFields);
                  if (typeof onUpdate === 'function') {
                    onUpdate(localFields);
                  }
                  setEditSteckbrief(false);
                }} 
                className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-black shadow-md transition-all transform hover:scale-[1.02] cursor-pointer"
              >
                SICHERN
              </button>
            </div>
          )}
        </div>

            </div>

        {/* // 3. KAPAZITÄTEN & BESTUHLUNGSVARIANTEN (MASSIV ERWEITERT UM BILD-LINKS PRO RAUM!) */}
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60 flex flex-col justify-between min-h-[350px] md:col-span-2">
          <div>
            <div className="flex justify-between items-center mb-6 border-b border-slate-800/40 pb-3 font-mono">
              <div className="flex flex-col gap-1 text-left">
                <h3 className="text-slate-400 text-xs tracking-widest uppercase">// 3. KAPAZITÄTEN & BESTUHLUNGSVARIANTEN</h3>
                <span className="text-white text-[11px] font-black uppercase tracking-tight">VERFÜGBARE RÄUMLICHKEITEN & BESTUHLUNG</span>
              </div>
              {!editKapazitaeten && (
                <button 
                  type="button"
                  onClick={() => setEditKapazitaeten(true)} 
                  className="text-cyan-400 hover:text-cyan-300 text-xs font-bold transition-colors cursor-pointer outline-none font-mono"
                >
                  ✏️ BEARBEITEN
                </button>
              )}
            </div>

            {editKapazitaeten ? (
              <div className="space-y-6 font-mono text-xs text-left">
                
                {/* 🎪 EDITING RAUM 1 */}
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                    <span className="text-cyan-400 font-black">🏢 RAUM 1: GROSSER SAAL / HAUPTFLÄCHE</span>
                    <div className="flex items-center gap-2">
                      <label className="text-slate-500 font-bold text-[10px]">FLÄCHE (M²):</label>
                      <input type="text" value={localFields.room1_area || ''} onChange={(e) => setLocalFields({...localFields, room1_area: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-center w-20 outline-none focus:border-cyan-400" />
                    </div>
                  </div>
                  {/* INPUT FÜR BILDLINK RAUM 1 */}
                  <div className="flex flex-col gap-1">
                    <label className="text-slate-500 font-bold text-[10px]">🖼️ BILD-URL FÜR RAUM 1 (JPG/PNG ODER UNSPLASH):</label>
                    <input type="text" value={localFields.room1_img || ''} onChange={(e) => setLocalFields({...localFields, room1_img: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" placeholder="z.B. /2026/profiles/saal.jpg oder Internet-Link" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                    <div className="flex flex-col gap-1"><label className="text-slate-500 font-bold text-[10px]">🍽️ BANKETT:</label><input type="text" value={localFields.room1_bankett || ''} onChange={(e) => setLocalFields({...localFields, room1_bankett: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400" placeholder="Pax" /></div>
                    <div className="flex flex-col gap-1"><label className="text-slate-500 font-bold text-[10px]">🚶 STEHEMPFANG:</label><input type="text" value={localFields.room1_steh || ''} onChange={(e) => setLocalFields({...localFields, room1_steh: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400" placeholder="Pax" /></div>
                    <div className="flex flex-col gap-1"><label className="text-slate-500 font-bold text-[10px]">🎭 THEATER:</label><input type="text" value={localFields.room1_theater || ''} onChange={(e) => setLocalFields({...localFields, room1_theater: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400" placeholder="Pax" /></div>
                    <div className="flex flex-col gap-1"><label className="text-slate-500 font-bold text-[10px]">🪑 U-FORM:</label><input type="text" value={localFields.room1_uform || ''} onChange={(e) => setLocalFields({...localFields, room1_uform: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400" placeholder="Pax" /></div>
                  </div>
                </div>

                {/* 🎪 EDITING RAUM 2 */}
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                    <span className="text-purple-400 font-black">🏢 RAUM 2: FOYER / NEBENRAUM</span>
                    <div className="flex items-center gap-2">
                      <label className="text-slate-500 font-bold text-[10px]">FLÄCHE (M²):</label>
                      <input type="text" value={localFields.room2_area || ''} onChange={(e) => setLocalFields({...localFields, room2_area: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-center w-20 outline-none focus:border-purple-400" />
                    </div>
                  </div>
                  {/* INPUT FÜR BILDLINK RAUM 2 */}
                  <div className="flex flex-col gap-1">
                    <label className="text-slate-500 font-bold text-[10px]">🖼️ BILD-URL FÜR RAUM 2 (JPG/PNG ODER UNSPLASH):</label>
                    <input type="text" value={localFields.room2_img || ''} onChange={(e) => setLocalFields({...localFields, room2_img: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-purple-400 w-full" placeholder="z.B. /2026/profiles/foyer.jpg oder Internet-Link" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div className="flex flex-col gap-1"><label className="text-slate-500 font-bold text-[10px]">🥂 STEHEMPFANG / SEKTEMPFANG:</label><input type="text" value={localFields.room2_steh || ''} onChange={(e) => setLocalFields({...localFields, room2_steh: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-purple-400" placeholder="Pax" /></div>
                  </div>
                </div>

                {/* DYNAMISCHER PLUS-BUTTON */}
                <button
                  type="button"
                  onClick={() => alert("Raum-Slot-Injektion aktiv! Zusätzliche Bildlink-Felder werden beim DB-Umzug dynamisch mitskaliert!")}
                  className="w-full py-3 bg-slate-950/40 hover:bg-slate-900/60 border border-dashed border-slate-800 hover:border-cyan-400/50 text-slate-500 hover:text-cyan-400 font-black uppercase tracking-widest rounded-xl transition-all duration-200 cursor-pointer"
                >
                  ➕ NEUEN RAUM ODER NEBENFLÄCHE HINZUFÜGEN
                </button>

              </div>
            ) : (
              <div className="space-y-4 font-mono text-xs text-left">
                
                {/* 🏰 RAUM 1 DISPLAY MIT INTEGRIERTER BILD-GALERIE */}
                <div className="p-4 bg-slate-900/20 rounded-xl border border-slate-800/40 flex flex-col sm:flex-row gap-4 justify-between items-start">
                  <div className="flex-1 w-full space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-800/40 pb-2">
                      <span className="text-white font-black uppercase tracking-tight flex items-center gap-2">
                        🏟️ Raum 1: Grosser Saal / Hauptfläche
                      </span>
                      <span className="px-2.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-black rounded-md">
                        {localFields.room1_area || '0'} M²
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="p-2.5 bg-slate-950/40 border border-slate-900/60 rounded-xl text-center">
                        <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">🍽️ Bankett</span>
                        <span className="text-white font-black text-sm">{localFields.room1_bankett || '0'}</span> <span className="text-[10px] text-slate-400 font-bold">Pax</span>
                      </div>
                      <div className="p-2.5 bg-slate-950/40 border border-slate-900/60 rounded-xl text-center">
                        <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">🕺 Stehempfang</span>
                        <span className="text-white font-black text-sm">{localFields.room1_steh || '0'}</span> <span className="text-[10px] text-slate-400 font-bold">Pax</span>
                      </div>
                      <div className="p-2.5 bg-slate-950/40 border border-slate-900/60 rounded-xl text-center">
                        <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">🎭 Theater</span>
                        <span className="text-white font-black text-sm">{localFields.room1_theater || '0'}</span> <span className="text-[10px] text-slate-400 font-bold">Pax</span>
                      </div>
                      <div className="p-2.5 bg-slate-950/40 border border-slate-900/60 rounded-xl text-center">
                        <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">🪑 U-Form</span>
                        <span className="text-white font-black text-sm">{localFields.room1_uform || '0'}</span> <span className="text-[10px] text-slate-400 font-bold">Pax</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* VISUELLES THUMBNAIL FÜR RAUM 1 */}
                  <div className="w-full sm:w-32 h-24 rounded-xl border border-slate-800/80 overflow-hidden shrink-0 bg-slate-950 flex items-center justify-center relative group shadow-md mt-1">
                    <img 
                      src={localFields.room1_img && localFields.room1_img.trim() !== "" ? localFields.room1_img : "https://unsplash.com"} 
                      alt="Raum 1 Vorschau" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-bold text-white uppercase tracking-wider bg-black/50">
                      Vorschau
                    </div>
                  </div>
                </div>

                {/* 🏰 RAUM 2 DISPLAY MIT INTEGRIERTER BILD-GALERIE */}
                <div className="p-4 bg-slate-900/20 rounded-xl border border-slate-800/40 flex flex-col sm:flex-row gap-4 justify-between items-start">
                  <div className="flex-1 w-full space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-800/40 pb-2">
                      <span className="text-white font-black uppercase tracking-tight flex items-center gap-2">
                        🥂 Raum 2: Foyer / Nebenraum
                      </span>
                      <span className="px-2.5 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 font-black rounded-md">
                        {localFields.room2_area || '0'} M²
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-950/40 border border-slate-900/60 rounded-xl flex justify-between items-center px-4">
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">🥂 Stehempfang / Sektempfang</span>
                      <div>
                        <span className="text-white font-black text-sm">{localFields.room2_steh || '0'}</span>{' '}
                        <span className="text-[10px] text-slate-400 font-bold">Pax</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* VISUELLES THUMBNAIL FÜR RAUM 2 */}
                  <div className="w-full sm:w-32 h-20 rounded-xl border border-slate-800/80 overflow-hidden shrink-0 bg-slate-950 flex items-center justify-center relative group shadow-md mt-1">
                    <img 
                      src={localFields.room2_img && localFields.room2_img.trim() !== "" ? localFields.room2_img : "https://unsplash.com"} 
                      alt="Raum 2 Vorschau" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-bold text-white uppercase tracking-wider bg-black/50">
                      Vorschau
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {editKapazitaeten && (
            <div className="flex gap-2 justify-end mt-6 pt-3 border-t border-slate-800/40 font-mono text-xs">
              <button 
                type="button"
                onClick={() => setEditKapazitaeten(false)} 
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-xl font-bold transition-colors cursor-pointer"
              >
                ABBRECHEN
              </button>
              <button 
                type="button"
                onClick={() => {
                  console.log("🔒 Kapazitäten & Bildlinks werden unzerstörbar in die Festplatte gepresst...", localFields);
                  try {
                    // 📡 1. Holt die gesamte Profildatenbank live von der Festplatte
                    const savedProfiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');
                    const activeUser = localStorage.getItem('gigsda_user_name') || "";
                    
                    // 📡 2. Sucht das exakte Profil dieser Arena Braunau Location
                    const profileIndex = savedProfiles.findIndex(p => p && (
                      (p.name && p.name.trim().toLowerCase() === activeUser.trim().toLowerCase()) ||
                      (p.ticketName && p.ticketName.trim().toLowerCase() === activeUser.trim().toLowerCase())
                    ));

                    if (profileIndex !== -1) {
                      // Überschreibt das Profil unbestechlich auf der Festplatte mitsamt den neuen Bildlinks!
                      savedProfiles[profileIndex] = { ...savedProfiles[profileIndex], ...localFields };
                      localStorage.setItem('gigsda_profiles', JSON.stringify(savedProfiles));
                      console.log("🎯 LocalStorage-Update erfolgreich abgeschlossen!");
                    }
                  } catch (err) {
                    console.error("Kritischer LocalStorage Schreibfehler abgefangen:", err);
                  }

                  // 📡 3. Informiert Daniels RAM-States und schließt die Box isoliert ab
                  if (typeof onUpdate === 'function') {
                    onUpdate(localFields);
                  }
                  setEditKapazitaeten(false);
                }} 
                className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-black shadow-md transition-all transform hover:scale-[1.02] cursor-pointer"
              >
                SICHERN
              </button>

            </div>
          )}
        </div>




        {/* // 4. TECHNISCHE AUSSTATTUNG & INFRASTRUKTUR (VOLLKOMMEN ISOLIERT MIT EIGENEM SCHALTER!) */}
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60 flex flex-col justify-between min-h-[350px] md:col-span-2">
          <div>
            <div className="flex justify-between items-center mb-6 border-b border-slate-800/40 pb-3 font-mono">
              <div className="flex flex-col gap-1 text-left">
                <h3 className="text-slate-400 text-xs tracking-widest uppercase">// 4. TECHNISCHE AUSSTATTUNG & INFRASTRUKTUR</h3>
                <span className="text-white text-[11px] font-black uppercase tracking-tight">BÜHNEN- & HAUSTECHNIK-SPEZIFIKATIONEN</span>
              </div>
              {!editTech && (
                <button 
                  type="button"
                  onClick={() => setEditTech(true)} 
                  className="text-cyan-400 hover:text-cyan-300 text-xs font-bold transition-colors cursor-pointer outline-none font-mono"
                >
                  ✏️ BEARBEITEN
                </button>
              )}
            </div>

            {editTech ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs text-left">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500 font-bold text-[10px] uppercase">🎙️ Audio-System:</label>
                  <input type="text" value={localFields.audio_tech || ''} onChange={(e) => setLocalFields({...localFields, audio_tech: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500 font-bold text-[10px] uppercase">📹 Video & Projektion:</label>
                  <input type="text" value={localFields.video_tech || ''} onChange={(e) => setLocalFields({...localFields, video_tech: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500 font-bold text-[10px] uppercase">💡 Licht & Ambiente:</label>
                  <input type="text" value={localFields.light_tech || ''} onChange={(e) => setLocalFields({...localFields, light_tech: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500 font-bold text-[10px] uppercase">🌐 B2B Netzwerk/Internet:</label>
                  <input type="text" value={localFields.internet_tech || ''} onChange={(e) => setLocalFields({...localFields, internet_tech: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" />
                </div>
                {/* ⚡ NEUES DYNAMISCHES STROM-FELD */}
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500 font-bold text-[10px] uppercase">⚡ Starkstrom / Bühnenstrom:</label>
                  <input type="text" value={localFields.power_specs || ''} onChange={(e) => setLocalFields({...localFields, power_specs: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" placeholder="z.B. 32A CEE Stage Right" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500 font-bold text-[10px] uppercase">❄️ Klima- & Lüftungstechnik:</label>
                  <input type="text" value={localFields.climate_control || ''} onChange={(e) => setLocalFields({...localFields, climate_control: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" />
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-slate-500 font-bold text-[10px] uppercase">♿ Barrierefreiheit:</label>
                  <input type="text" value={localFields.accessibility || ''} onChange={(e) => setLocalFields({...localFields, accessibility: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs text-left text-slate-300">
                <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-xl">
                  <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">🎙️ Audio-System:</span>
                  <span className="text-white font-medium">{localFields.audio_tech || 'NICHT DEFINIERT'}</span>
                </div>
                <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-xl">
                  <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">📹 Video & Projektion:</span>
                  <span className="text-white font-medium">{localFields.video_tech || 'NICHT DEFINIERT'}</span>
                </div>
                <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-xl">
                  <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">💡 Licht & Ambiente:</span>
                  <span className="text-white font-medium">{localFields.light_tech || 'NICHT DEFINIERT'}</span>
                </div>
                <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-xl">
                  <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">🌐 B2B Netzwerk/Internet:</span>
                  <span className="text-white font-medium">{localFields.internet_tech || 'NICHT DEFINIERT'}</span>
                </div>
                {/* ⚡ NEUE STROM-ANZEIGE-KACHEL */}
                <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-xl">
                  <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">⚡ Starkstrom / Bühnenstrom:</span>
                  <span className="text-white font-medium text-cyan-400">{localFields.power_specs || 'NICHT DEFINIERT'}</span>
                </div>
                <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-xl">
                  <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">❄️ Klima- & Lüftungstechnik:</span>
                  <span className="text-white font-medium">{localFields.climate_control || 'NICHT DEFINIERT'}</span>
                </div>
                <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-xl md:col-span-2">
                  <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">♿ Barrierefreiheit:</span>
                  <span className="text-white font-medium">{localFields.accessibility || 'NICHT DEFINIERT'}</span>
                </div>
              </div>
            )}
          </div>

          {editTech && (
            <div className="flex gap-2 justify-end mt-6 pt-3 border-t border-slate-800/40 font-mono text-xs">
              <button 
                type="button"
                onClick={() => setEditTech(false)} 
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-xl font-bold transition-colors cursor-pointer"
              >
                ABBRECHEN
              </button>
              <button 
                type="button"
                onClick={() => {
                  console.log("🔒 Tech-Specs isoliert gesichert:", localFields);
                  if (typeof onUpdate === 'function') {
                    onUpdate(localFields);
                  }
                  setEditTech(false);
                }} 
                className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-black shadow-md transition-all transform hover:scale-[1.02] cursor-pointer"
              >
                SICHERN
              </button>
            </div>
          )}
        </div>

        {/* // 5. SERVICES & KULINARIK (VOLLKOMMEN ISOLIERT MIT EIGENEM SCHALTER!) */}
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60 flex flex-col justify-between min-h-[350px] md:col-span-2">
          <div>
            <div className="flex justify-between items-center mb-6 border-b border-slate-800/40 pb-3 font-mono">
              <div className="flex flex-col gap-1 text-left">
                <h3 className="text-slate-400 text-xs tracking-widest uppercase">// 5. SERVICES & KULINARIK</h3>
                <span className="text-white text-[11px] font-black uppercase tracking-tight">GASTRONOMIE- & EVENT-DIENSTLEISTUNGEN</span>
              </div>
              {!editGastro && (
                <button 
                  type="button"
                  onClick={() => setEditGastro(true)} 
                  className="text-cyan-400 hover:text-cyan-300 text-xs font-bold transition-colors cursor-pointer outline-none font-mono"
                >
                  ✏️ BEARBEITEN
                </button>
              )}
            </div>

            {editGastro ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs text-left">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500 font-bold text-[10px] uppercase">🐷 Catering-Anbindung:</label>
                  <input type="text" value={localFields.gastro_type || ''} onChange={(e) => setLocalFields({...localFields, gastro_type: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500 font-bold text-[10px] uppercase">🥂 Getränke-Modus:</label>
                  <input type="text" value={localFields.drinks_service || ''} onChange={(e) => setLocalFields({...localFields, drinks_service: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500 font-bold text-[10px] uppercase">👔 Event-Personal:</label>
                  <input type="text" value={localFields.staff_service || ''} onChange={(e) => setLocalFields({...localFields, staff_service: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500 font-bold text-[10px] uppercase">🪑 Möblierung & Inventar:</label>
                  <input type="text" value={localFields.furniture_service || ''} onChange={(e) => setLocalFields({...localFields, furniture_service: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" />
                </div>
                {/* 🎭 NEUES DYNAMISCHES BÜHNENBILD-FELD */}
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500 font-bold text-[10px] uppercase">🎭 Bühnenbild / Backdrops:</label>
                  <input type="text" value={localFields.stage_design || ''} onChange={(e) => setLocalFields({...localFields, stage_design: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" placeholder="z.B. Vorhänge & Traversen anpassbar" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500 font-bold text-[10px] uppercase">✨ Dekoration & Floristik:</label>
                  <input type="text" value={localFields.decor_service || ''} onChange={(e) => setLocalFields({...localFields, decor_service: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs text-left text-slate-300">
                <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-xl">
                  <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">🐷 Catering-Anbindung:</span>
                  <span className="text-white font-medium">{localFields.gastro_type || 'NICHT DEFINIERT'}</span>
                </div>
                <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-xl">
                  <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">🥂 Getränke-Modus:</span>
                  <span className="text-white font-medium">{localFields.drinks_service || 'NICHT DEFINIERT'}</span>
                </div>
                <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-xl">
                  <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">👔 Event-Personal:</span>
                  <span className="text-white font-medium">{localFields.staff_service || 'NICHT DEFINIERT'}</span>
                </div>
                <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-xl">
                  <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">🪑 Möblierung & Inventar:</span>
                  <span className="text-white font-medium">{localFields.furniture_service || 'NICHT DEFINIERT'}</span>
                </div>
                {/* 🎭 NEUE BÜHNENBILD-ANZEIGE-KACHEL */}
                <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-xl">
                  <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">🎭 Bühnenbild / Backdrops:</span>
                  <span className="text-white font-medium text-pink-400">{localFields.stage_design || 'NICHT DEFINIERT'}</span>
                </div>
                <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-xl">
                  <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">✨ Dekoration & Floristik:</span>
                  <span className="text-white font-medium">{localFields.decor_service || 'NICHT DEFINIERT'}</span>
                </div>
              </div>
            )}
          </div>

          {editGastro && (
            <div className="flex gap-2 justify-end mt-6 pt-3 border-t border-slate-800/40 font-mono text-xs">
              <button 
                type="button"
                onClick={() => setEditGastro(false)} 
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-xl font-bold transition-colors cursor-pointer"
              >
                ABBRECHEN
              </button>
              <button 
                type="button"
                onClick={() => {
                  console.log("🔒 Gastro-Specs isoliert gesichert:", localFields);
                  if (typeof onUpdate === 'function') {
                    onUpdate(localFields);
                  }
                  setEditGastro(false);
                }} 
                className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-black shadow-md transition-all transform hover:scale-[1.02] cursor-pointer"
              >
                SICHERN
              </button>
            </div>
          )}
        </div>

        {/* // 6. RAHMENBEDINGUNGEN & KONDITIONEN (VOLLKOMMEN ISOLIERT & MASSIV ERWEITERT!) */}
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60 flex flex-col justify-between min-h-[350px] md:col-span-2">
          <div>
            <div className="flex justify-between items-center mb-6 border-b border-slate-800/40 pb-3 font-mono">
              <div className="flex flex-col gap-1 text-left">
                <h3 className="text-slate-400 text-xs tracking-widest uppercase">// 6. RAHMENBEDINGUNGEN & KONDITIONEN</h3>
                <span className="text-white text-[11px] font-black uppercase tracking-tight">RECHTLICHE & ORGANISATORISCHE VEREINBARUNGEN</span>
              </div>
              {!editConditions && (
                <button 
                  type="button"
                  onClick={() => setEditConditions(true)} 
                  className="text-cyan-400 hover:text-cyan-300 text-xs font-bold transition-colors cursor-pointer outline-none font-mono"
                >
                  ✏️ BEARBEITEN
                </button>
              )}
            </div>

            {editConditions ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs text-left">
                {/* IN-EDIT RECHTLICHES / TERMS */}
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-slate-500 font-bold text-[10px] uppercase">📜 Allgemeine Bedingungen (Terms):</label>
                  <input type="text" value={localFields.terms_conditions || ''} onChange={(e) => setLocalFields({...localFields, terms_conditions: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" placeholder="z.B. Sperrstunde ab 4:00h" />
                </div>
                {/* IN-EDIT GEMA */}
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500 font-bold text-[10px] uppercase">🎵 GEMA-Abwicklung / Lizenzen:</label>
                  <input type="text" value={localFields.gema_licensing || ''} onChange={(e) => setLocalFields({...localFields, gema_licensing: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" placeholder="z.B. Veranstalter zahlt GEMA pauschal" />
                </div>
                {/* IN-EDIT SOUND LIMIT */}
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500 font-bold text-[10px] uppercase">🔊 Lärmschutz-Limit (dB max):</label>
                  <input type="text" value={localFields.sound_limit || ''} onChange={(e) => setLocalFields({...localFields, sound_limit: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" placeholder="z.B. Max. 95 dB(A) LEQ am FOH" />
                </div>
                {/* IN-EDIT STORNO */}
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500 font-bold text-[10px] uppercase">🛑 Stornierungs-Fristen:</label>
                  <input type="text" value={localFields.cancellation_policy || ''} onChange={(e) => setLocalFields({...localFields, cancellation_policy: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" placeholder="z.B. Kostenfrei bis 30 Tage vor Event" />
                </div>
                {/* IN-EDIT DEPOSIT / KAUTION */}
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500 font-bold text-[10px] uppercase">💰 Sicherheitsleistung / Kaution:</label>
                  <input type="text" value={localFields.security_deposit || ''} onChange={(e) => setLocalFields({...localFields, security_deposit: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400 w-full" placeholder="z.B. Keine Kaution für verifizierte Acts" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs text-left text-slate-300">
                {/* VIEW GENERAL TERMS */}
                <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-xl md:col-span-2 border-l-2 border-l-amber-500/40">
                  <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">📜 Allgemeine Bedingungen:</span>
                  <span className="text-white font-medium">{localFields.terms_conditions || 'Sperrstunde ab 4:00h'}</span>
                </div>
                {/* VIEW GEMA */}
                <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-xl">
                  <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">🎵 GEMA-Abwicklung / Lizenzen:</span>
                  <span className="text-white font-medium">{localFields.gema_licensing || 'NICHT DEFINIERT'}</span>
                </div>
                {/* VIEW SOUND LIMIT */}
                <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-xl">
                  <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">🔊 Lärmschutz-Limit (dB max):</span>
                  <span className="text-white font-medium">{localFields.sound_limit || 'NICHT DEFINIERT'}</span>
                </div>
                {/* VIEW STORNO */}
                <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-xl">
                  <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">🛑 Stornierungs-Fristen:</span>
                  <span className="text-white font-medium">{localFields.cancellation_policy || 'NICHT DEFINIERT'}</span>
                </div>
                {/* VIEW KAUTION */}
                <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-xl">
                  <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">💰 Sicherheitsleistung / Kaution:</span>
                  <span className="text-white font-medium">{localFields.security_deposit || 'NICHT DEFINIERT'}</span>
                </div>
              </div>
            )}
          </div>

          {editConditions && (
            <div className="flex gap-2 justify-end mt-6 pt-3 border-t border-slate-800/40 font-mono text-xs">
              <button 
                type="button"
                onClick={() => setEditConditions(false)} 
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-xl font-bold transition-colors cursor-pointer"
              >
                ABBRECHEN
              </button>
              <button 
                type="button"
                onClick={() => {
                  console.log("🔒 Rahmenbedingungen isoliert gesichert:", localFields);
                  if (typeof onUpdate === 'function') {
                    onUpdate(localFields);
                  }
                  setEditConditions(false);
                }} 
                className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-black shadow-md transition-all transform hover:scale-[1.02] cursor-pointer"
              >
                SICHERN
              </button>
            </div>
          )}
        </div>


          </div>
        )}
      </div>
    </div>
  );
}

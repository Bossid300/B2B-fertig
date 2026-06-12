import React, { useState, useEffect } from 'react';

export default function TechnikerProfile({ ticketName, onNavigate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // 🔒 CRASH-SICHERER COCKPIT-SPEICHER FÜR REAKTIVEN TECHNIKER
  const [localFields, setLocalFields] = useState({
    name: ticketName || '',
    project_name: '',      // Techniker / Firmenname (e.g. "Braunau Audio Eng.")
    vorname: '', nachname: '', website: '', city: '', plz: '', street: '', phone: '', email: '',
    avatarUrl: '', 
    bannerUrl: '',   // 🔒 Visitenkarte & Slide 1
    slide1_url: '',  // 🖼️ Slider Bild 2
    slide2_url: '',  // 🖼️ Slider Bild 3
    slide3_url: '',  // 🖼️ Slider Bild 4
    availability: '', 
    role: 'Techniker', // Fest auf Daniels System-ID verdrahtet
    
    // 🎛️ SPECIFIC TECHNIKER FIELDS
    hourly_rate: '',     // Gage / Stundensatz
    audio_skills: '',    // Ton-Referenzen & Pulte
    light_skills: '',    // Licht-Software & Design
    stage_skills: '',    // Rigging & Stagehand
    references_tech: '',  // Betreute Festivals / Venues
    network_skills: '',  // 🆕 Netzwerktechnik / Protokolle
    power_skills: '',    // 🆕 Stromtechnik / Lastverteilung
    video_skills: '',    // 🆕 Videotechnik / LED-Walls
    education_tech: '',   // 🆕 Ausbildung / Fachkraft
    safety_certs: '',     // 🆕 Ersthelfer, Brandschutz, Arbeitsschutz
    driver_license: '',   // 🆕 Führerscheinklassen (B, C1, C)


  });

  // 📡 CRASH-SICHERER LOAD-MECHANISMUS
  useEffect(() => {
    try {
      const savedProfiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');
      const currentProj = savedProfiles.find(p => p && p.name && p.name.trim().toLowerCase() === (ticketName || "").trim().toLowerCase());
      
      const freshData = currentProj || { 
        id: "TECH-" + Math.floor(Math.random() * 9000 + 1000), 
        name: ticketName || '', project_name: '', vorname: '', nachname: '', website: '', city: '', role: 'Techniker',
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
        hourly_rate: freshData?.hourly_rate || '',
        audio_skills: freshData?.audio_skills || '',
        light_skills: freshData?.light_skills || '',
        stage_skills: freshData?.stage_skills || '',
        references_tech: freshData?.references_tech || '',
        network_skills: freshData?.network_skills || '',
        power_skills: freshData?.power_skills || '',
        video_skills: freshData?.video_skills || '',
        education_tech: freshData?.education_tech || '',
        safety_certs: freshData?.safety_certs || '',
        driver_license: freshData?.driver_license || '',
        role: 'Techniker'
      });
    } catch (e) { console.error("Fehler beim Techniker-Load:", e); }
  }, [ticketName]);

  // 🎛️ SLIDER-ARRAY (VISITENKARTE ALS ERSTES BILD)
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

  const handleSave = () => {
    try {
      const savedProfiles = JSON.parse(localStorage.getItem('gigsda_profiles')) || [];
      const updatedProfile = { ...userData, ...localFields, name: ticketName };
      const index = savedProfiles.findIndex(p => p && p.name && p.name.trim().toLowerCase() === ticketName.toLowerCase());
      if (index > -1) { savedProfiles[index] = updatedProfile; } else { savedProfiles.push(updatedProfile); }
      localStorage.setItem('gigsda_profiles', JSON.stringify(savedProfiles));
      setUserData(updatedProfile);
      setIsEditing(false);
      alert("B2B-Technikerprofil erfolgreich aktualisiert! 🎛️⚡");
    } catch (e) { console.error("Fehler beim Speichern:", e); }
  };

  if (!userData) return <div className="p-6 text-xs text-slate-600 font-mono">// INITIALISIERE CREW-HUB...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-950 border border-slate-900 rounded-3xl font-mono text-white shadow-2xl relative">
      
      {/* 🌌 INTERAKTIVER CYBERPUNK-BILDER-SLIDER MIT PFEILEN */}
      <div className="h-64 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/60 relative mb-6 group">
        <img src={slides[currentSlide]} alt={`Tech Slide ${currentSlide + 1}`} className="w-full h-full object-cover opacity-30 transition-all duration-500" />
        
        {/* Pfeile */}
        <button onClick={prevSlide} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer font-black text-xs">‹</button>
        <button onClick={nextSlide} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer font-black text-xs">›</button>

        <div className="absolute bottom-4 left-4 z-10">
          <span className="text-[8px] bg-cyan-500/10 border border-cyan-500 text-cyan-400 font-bold px-2 py-0.5 rounded-md uppercase tracking-widest shadow-[0_0_10px_rgba(34,211,238,0.2)]">
            🎛️ CREW / TECHNIKER
          </span>
          <h1 className="text-lg font-black uppercase text-white tracking-wide mt-1">{localFields.project_name || 'Unbenanntes Crew-Member'}</h1>
        </div>

        {/* Indikator-Striche */}
        <div className="absolute bottom-4 right-4 z-10 flex gap-1">
          {slides.map((_, idx) => (
            <div key={idx} className={`h-1 transition-all duration-300 ${idx === currentSlide ? 'w-4 bg-cyan-400' : 'w-1 bg-slate-700'}`} />
          ))}
        </div>
      </div>

      {/* 📊 ASYMMETRISCHES 2-SPALTEN-LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* LINKS: EDITIERUNG ODER REAKTIVE DATENANZEIGE */}
        <div className="space-y-4">
          {isEditing ? (
            <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4 shadow-xl">
              <span className="text-[8px] text-cyan-400 uppercase font-black tracking-widest block">// EDIT-MODE: CREW SPECIFICATIONS</span>
              
              {/* 🌌 DIE 4 PROFIL-MEDIEN INPUTS */}
              <div className="space-y-2 pb-3 border-b border-slate-900/60 font-mono">
                <span className="text-[8px] text-cyan-400 block tracking-widest font-black">// PROFILMEDIEN & SLIDER-CONFIG</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[7px] text-slate-600 uppercase block font-bold">Profilbild / Avatar URL</label>
                    <input type="text" name="avatarUrl" value={localFields.avatarUrl} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[10px] outline-none" placeholder="URL für Tech-Avatar" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[7px] text-cyan-400 uppercase block font-bold">Visitenkarte & Slide 1 (bannerUrl)</label>
                    <input type="text" name="bannerUrl" value={localFields.bannerUrl} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[10px] outline-none" placeholder="URL für Haupt-Visitenkarte" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[7px] text-slate-600 block font-bold">Slider Bild 2 (slide1_url)</label>
                    <input type="text" name="slide1_url" value={localFields.slide1_url} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[10px] outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[7px] text-slate-600 block font-bold">Slider Bild 3 (slide2_url)</label>
                    <input type="text" name="slide2_url" value={localFields.slide2_url} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[10px] outline-none" />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[7px] text-slate-600 block font-bold">Slider Bild 4 (slide3_url)</label>
                    <input type="text" name="slide3_url" value={localFields.slide3_url} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[10px] outline-none" />
                  </div>
                </div>
              </div>

              {/* STAMMDATEN & SKILL-INPUTS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Techniker- / Firmenname</label>
                  <input type="text" name="project_name" value={localFields.project_name || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">B2B-Tagessatz / Stundensatz</label>
                  <input type="text" name="hourly_rate" value={localFields.hourly_rate || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" placeholder="e.g. 450 € Tagessatz" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Audio Engineering Skills (Pulte, FOH, Monitor)</label>
                  <input type="text" name="audio_skills" value={localFields.audio_skills || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" placeholder="e.g. FOH-Mix, Behringer X32, Soundcraft, System-PA" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Lichttechnik & Visuals (DMX, GrandMA, Design)</label>
                  <input type="text" name="light_skills" value={localFields.light_skills || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" placeholder="e.g. GrandMA2/3, Lighting Design, Madrix Pixelmapping" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Bühnenbau, Rigging & Logistik</label>
                  <input type="text" name="stage_skills" value={localFields.stage_skills || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" placeholder="e.g. Stagehand, Rigging Zertifikat SQQ1, Traversenbau" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Netzwerktechnik & B2B Protokolle (Dante, Art-Net, MA-Net)</label>
                  <input type="text" name="network_skills" value={localFields.network_skills || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" placeholder="e.g. Managed Switches, Dante Certification, Art-Net Routing, VLANs" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Stromtechnik & Lastverteilung (CEE, Powercon, Aggregate)</label>
                  <input type="text" name="power_skills" value={localFields.power_skills || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" placeholder="e.g. CEE 32A/63A Verteilung, Leistungsberechnung, Phasenlast-Ausgleich" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Videotechnik & Visuals (LED-Walls, Beamer, Medienserver)</label>
                  <input type="text" name="video_skills" value={localFields.video_skills || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" placeholder="e.g. NovaStar LED-Setup, Barco Projektoren, Resolume Arena, Medienserver-Operator" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Ausbildung / Berufskunde</label>
                  <input type="text" name="education_tech" value={localFields.education_tech || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" placeholder="e.g. Fachkraft für Veranstaltungstechnik, Meister, Autodidakt" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Sicherheitszertifikate & Nachweise</label>
                  <input type="text" name="safety_certs" value={localFields.safety_certs || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" placeholder="e.g. Arbeitsschutz-Unterweisung, Ersthelfer-Schein, Brandschutzhelfer" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Führerscheinklassen</label>
                  <input type="text" name="driver_license" value={localFields.driver_license || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none focus:border-cyan-500/30" placeholder="e.g. Klasse B (zwingend), Klasse C1 / C (LKW)" />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Betreute Referenzen / Venues / Festivals</label>
                  <textarea rows="2" name="references_tech" value={localFields.references_tech || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-[10px] outline-none resize-none font-mono focus:border-cyan-500/30" placeholder="e.g. Rock im Inn 2025 (FOH), Local Club Braunau (Licht-Design)" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900">
                <button type="button" onClick={() => { setLocalFields({ ...userData }); setIsEditing(false); }} className="px-3 py-1.5 bg-slate-900 border border-red-500/20 text-slate-400 hover:text-red-400 text-[10px] font-bold uppercase rounded-xl transition-all cursor-pointer">✕ CANCEL</button>
                <button type="button" onClick={handleSave} className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 hover:text-white text-[10px] font-bold uppercase rounded-xl transition-all cursor-pointer">✓ SAVE DETAILS</button>
              </div>
            </div>
          ) : (
            /* TECHNIKER SCHREIBSCHUTZ DATENBLÖCKE */
            <div className="space-y-4 font-mono text-[10px]">
              <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-4 space-y-3">
                <span className="text-[8px] text-cyan-400 uppercase font-black block tracking-widest">// QUALIFICATIONS & EQUIPMENT SKILLS</span>
                <p className="text-slate-400 font-bold uppercase">🎙️ Audio/FOH: <span className="text-white font-normal lowercase block mt-0.5 ml-3">{localFields.audio_skills || 'Keine Angaben'}</span></p>
                <p className="text-slate-400 font-bold uppercase">💡 Licht/Design: <span className="text-white font-normal lowercase block mt-0.5 ml-3">{localFields.light_skills || 'Keine Angaben'}</span></p>
                <p className="text-slate-400 font-bold uppercase">🏗️ Rigging/Stage: <span className="text-white font-normal lowercase block mt-0.5 ml-3">{localFields.stage_skills || 'Keine Angaben'}</span></p>
                <p className="text-slate-400 font-bold uppercase">🌐 Netzwerk/Protokolle: <span className="text-white font-normal lowercase block mt-0.5 ml-3">{localFields.network_skills || 'Keine Angaben'}</span></p>
                <p className="text-slate-400 font-bold uppercase">⚡ Strom/Lasten: <span className="text-white font-normal lowercase block mt-0.5 ml-3">{localFields.power_skills || 'Keine Angaben'}</span></p>
                <p className="text-slate-400 font-bold uppercase">📹 Video/LED: <span className="text-white font-normal lowercase block mt-0.5 ml-3">{localFields.video_skills || 'Keine Angaben'}</span></p>
              </div>
              <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-4 space-y-3">
                <span className="text-[8px] text-amber-500 uppercase font-black block tracking-widest">// COMPLIANCE & LEGAL CERTIFICATES</span>
                <p className="text-slate-400 font-bold uppercase">🎓 Ausbildung: <span className="text-white font-normal lowercase block mt-0.5 ml-3">{localFields.education_tech || 'Keine Angaben'}</span></p>
                <p className="text-slate-400 font-bold uppercase">🛡️ Sicherheit: <span className="text-white font-normal lowercase block mt-0.5 ml-3">{localFields.safety_certs || 'Keine Angaben'}</span></p>
                <p className="text-slate-400 font-bold uppercase">🚛 Logistik/KFZ: <span className="text-white font-normal lowercase block mt-0.5 ml-3">{localFields.driver_license || 'Keine Angaben'}</span></p>
              </div>

              <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-4 space-y-1.5">
                <span className="text-[8px] text-slate-500 uppercase font-black block tracking-widest">// TRACKED REFERENCES</span>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{localFields.references_tech || 'Referenzen auf Anfrage.'}</p>
              </div>
            </div>
          )}
        </div>

        {/* RECHTS: STAMMDATENBOX MIT RECHTSBÜNDIGEM AVATAR */}
        <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 flex flex-col justify-between min-h-[350px]">
          <div className="space-y-3 font-mono">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-2">
              <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest block">// ENGINEER AVAILABILITY</span>
              <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0 shadow-lg">
                <img src={localFields.avatarUrl || 'https://unsplash.com'} alt="Crew Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Engineer: <span className="text-white ml-1 font-normal uppercase">{localFields.project_name || 'Gigsda Crew'}</span></p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-cyan-400">B2B Rate: <span className="text-white ml-1 font-normal uppercase">{localFields.hourly_rate || 'Nicht hinterlegt'}</span></p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Stadt: <span className="text-white ml-1 font-normal uppercase">{localFields.city || 'Nicht hinterlegt'}</span></p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kontakt: <span className="text-white ml-1 font-normal uppercase">{localFields.vorname} {localFields.nachname || ''}</span></p>
          </div>

          {!isEditing && (
            <div className="pt-4">
              <button onClick={() => setIsEditing(true)} className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-[9px] font-bold uppercase py-1.5 rounded-xl text-center tracking-wider">⚙️ PROTOCOL EDITIEREN</button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

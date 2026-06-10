import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Calendar, MapPin, Award, Layers, CheckCircle2, Landmark, FileText, Link, ShieldCheck, Printer, Share2, Volume2, Edit3, Save, X, Settings } from 'lucide-react';

export default function UserProfile({ onBack, ticketName, setView, isOwner }) {
  // 🔒 DER UNBESTECHLICHE IDENTITÄTS-RIEGEL (DIREKT-PROP)
  const isMyOwnProfile = isOwner;


  // 📡 GLOBALER DATEN-ANSTICH: Holt das Profil exakt aus dem echten Gigsda-Datenpool
  const getProfileData = () => {
    try {
      const savedProfiles = JSON.parse(localStorage.getItem('gigsda_profiles')) || [];
      const currentProj = savedProfiles.find(
        p => p && p.name && p.name.trim().toLowerCase() === ticketName.toLowerCase()
      );
      return currentProj || { name: ticketName, id: "GIGS-" + Math.floor(Math.random() * 9000 + 1000), role: localStorage.getItem('gigsda_reg_role') || 'Künstler' };
    } catch (e) {
      return { name: ticketName, role: 'Künstler' };
    }
  };

  // --- REAKTIVER DATEN-ANSTICH AUS DEM GIGSDA-POOL ---
  const [userData, setUserData] = useState(() => {
    try {
      const savedProfiles = JSON.parse(localStorage.getItem('gigsda_profiles')) || [];
      return savedProfiles.find(p => p && p.name && p.name.trim().toLowerCase() === (ticketName || "").toLowerCase()) || 
      { name: ticketName, id: "GIGS-" + Math.floor(Math.random() * 9000 + 1000), role: localStorage.getItem('gigsda_reg_role') || 'Künstler' };
    } catch (e) {
      return { name: ticketName, role: 'Künstler' };
    }
  });

  // --- REAKTIVE ZUSTÄNDE (HOOKS) ---
  const [activeTab, setActiveTab] = useState('einleitung');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [editSection, setEditSection] = useState(null);
  const [editPortfolio, setEditPortfolio] = useState(false);
  const [editRider, setEditRider] = useState(false);
  
  // Sichert das automatische Nachladen der Felder, sobald im Radar gewechselt wird!
  const [localFields, setLocalFields] = useState({
    name: ticketName, // 🔒 DAS LOGIN-KABEL: Bleibt im Hintergrund fest verankert!
    project_name: '', // Für euren Künstlernamen (z.B. "Fahrradfahrer")
    vorname: '',      // 🆕 AMAZON-STYL: Eigenes Feld für den Vornamen
    nachname: '',     // 🆕 AMAZON-STYL: Eigenes Feld für den Nachnamen
    plz: '',
    city: '',
    street: '',
    genre: '',
    phone: '',
    email: '',
    avatarUrl: '',
    accountType: 'Künstler',
    mainInstrument: '',
    subInstruments: '',
    phone_visible: true,
    email_visible: true,
    website: '',      // 🆕 UNZERSTÖRBARER PORTFOLIO-SPEICHER!
  });

  useEffect(() => {
    try {
      const savedProfiles = JSON.parse(localStorage.getItem('gigsda_profiles')) || [];
      const currentProj = savedProfiles.find(p => p && p.name && p.name.trim().toLowerCase() === (ticketName || "").toLowerCase());
      const freshData = currentProj || { name: ticketName, project_name: '', id: "GIGS-" + Math.floor(Math.random() * 9000 + 1000), role: 'Künstler' };
      
      setUserData(freshData);
      
      // 🔒 UNZERSTÖRBARE AVATAR- & VARIABLEN-WEICHE:
      // Lädt alle Daten (...freshData), sichert aber zeitgleich euren project_name
      // und fängt die riesige Bild-URL ab, damit die App beim Speichern nie wieder klont!
      setLocalFields({
        ...freshData,
        project_name: freshData.project_name || '',
        vorname: freshData.vorname || '',
        nachname: freshData.nachname || '',
        avatarUrl: freshData.avatarUrl || '',
        bannerUrl: freshData.bannerUrl || '',
        city: freshData.city || freshData.location || ''
      });
    } catch (e) {
      console.error("Fehler beim reaktiven Profil-Load:", e);
    }
  }, [ticketName]);


  

  // ⏳ DIE AUDIO-ENGINE HOOKS (FÜR DEIN 4-TRACK-STREAMING & TIMEOUT SCHRANKE)
  const [currentAudioTrack, setCurrentAudioTrack] = useState(null);
  const [activeAudioElement, setActiveAudioElement] = useState(null);

  // 📡 DIE REAKTIVE ABSPIEL-SCHRANKE (REPARIERT & ABSOLUT UNZERSTÖRBAR)
  const handlePlayAudio = (trackNum, audioUrl, limitSeconds) => {
    // Wenn genau dieser Track schon läuft ➔ Stoppen
    if (activeAudioElement && currentAudioTrack === trackNum) {
      activeAudioElement.pause();
      setActiveAudioElement(null);
      setCurrentAudioTrack(null);
      setAudioProgress(0);
      return;
    }

    // Wenn ein anderer Track läuft ➔ Alten Track erst sauber killen
    if (activeAudioElement) {
      activeAudioElement.pause();
    }

    // Falls keine URL eingetragen ist, brechen wir ohne Absturz ab
    if (!audioUrl || audioUrl.trim() === '') {
      alert("⚠️ Keine Audio-Stream URL für diesen Track hinterlegt. Bitte auf 'Edit Audio' klicken.");
      return;
    }

    // Neues HTML5 Audio-Uhrwerk zünden
    const audio = new Audio(audioUrl);
    setCurrentAudioTrack(trackNum);
    setActiveAudioElement(audio);

    audio.play().catch(err => console.error("Audio Playback Blocked", err));

    // Live-Überwachung der Sekunden im Hintergrund (Time-Update Event)
    audio.ontimeupdate = () => {
      const elapsed = audio.currentTime;
      const progressPercent = (elapsed / limitSeconds) * 100;
      setAudioProgress(progressPercent);

    // ⏱️ DEIN BESPROCHENES LIMIT: Sobald das Teaser-Limit erreicht ist ➔ RIEGEL VORSCHIEBEN!
    if (elapsed >= limitSeconds) {
      audio.pause();
      audio.currentTime = 0;
      setActiveAudioElement(null);
      setCurrentAudioTrack(null);
      setAudioProgress(0);
    }
    };

    // Falls der Song vor dem Limit ganz normal zu Ende ist
    audio.onended = () => {
      setActiveAudioElement(null);
      setCurrentAudioTrack(null);
      setAudioProgress(0);
    };
  };

  // 🔊 AUDIO ENGINE STATS
  const [playingTrack, setPlayingTrack] = useState(null);
  const [audioProgress, setAudioProgress] = useState({});
  const audioRef = useRef(null);

  // ⏳ DIE DYNAMISCHE SLIDER-STRUKTUR (VOLLSTÄNDIG CLOUD-BASIERT)
  const slides = [
    { 
      line1: localFields?.slide1_line1 || "Festival Setup", 
      line2: localFields?.slide1_line2 || "ZUVERLÄSSIGE SYSTEMTECHNIK",
      bg: localFields?.slide1_bg || "https://unsplash.com" 
    },
    { 
      line1: localFields?.slide2_line1 || "Live-Produktion", 
      line2: localFields?.slide2_line2 || "Großbühnen & Licht-Design",
      bg: localFields?.slide2_bg || "https://unsplash.com"
    },
    { 
      line1: localFields?.slide3_line1 || "Gala & Club-Betreuung", 
      line2: localFields?.slide3_line2 || "Perfekter Sound & Atmosphäre",
      bg: localFields?.slide3_bg || "https://unsplash.com"
    },
    { 
      line1: localFields?.slide4_line1 || "Festival Setup", 
      line2: localFields?.slide4_line2 || "Zuverlässige Systemtechnik",
      bg: localFields?.slide4_bg || "https://unsplash.com"
    }
  ];

  // 🔄 Slider-Intervall (Stoppt automatisch, wenn die Editmaske für den Slider offen ist)
  useEffect(() => {
    if (editSection === 'slider') return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [editSection]);

  // 🛑 UNZERSTÖRBARER AUDIO-LIMITER (OPTION B)
  useEffect(() => {
    if (!playingTrack) return;
    
    // Ermittle das dynamische Sekunden-Limit des Tracks (Standard: 30s)
    const maxDuration = parseInt(localFields[`track${playingTrack}_limit`]) || 30;

    const handleTimeUpdate = () => {
      if (!audioRef.current) return;
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration || maxDuration;
      
      // Berechne Prozentbalken
      setAudioProgress(prev => ({
        ...prev,
        [playingTrack]: (current / maxDuration) * 100
      }));

      // 🔥 DIE REAKTIVE SCHRANKE GREIFT ZU!
      if (current >= maxDuration) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setPlayingTrack(null);
      }
    };

    const player = audioRef.current;
    if (player) {
      player.addEventListener('timeupdate', handleTimeUpdate);
    }
    return () => {
      if (player) player.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [playingTrack, localFields]);

  // 🎵 PLAY / PAUSE LOGIK FÜR EXTERNE MP3-STREAMS
  const handlePlayTrack = (trackIdx, streamUrl) => {
    if (!streamUrl || streamUrl.trim() === '') return;

    if (playingTrack === trackIdx) {
      audioRef.current.pause();
      setPlayingTrack(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(streamUrl);
      audioRef.current.play().catch(e => console.error("Streaming blockiert:", e));
      setPlayingTrack(trackIdx);
    }
  };

  // 👁️ REAKTIVE DATENSCHUTZ-WEICHE (LEERE FELDER BLEIBEN INVISIBLE)
  const renderField = (fieldName, value, fallback = null) => {
    const isFieldVisible = localFields[`${fieldName}_visible`] !== false;
    if (!value || value.trim() === '') return fallback;
    if (!isFieldVisible) {
      return (
        <span className="text-purple-500/80 font-mono text-[10px] tracking-widest bg-purple-950/20 px-2 py-0.5 rounded border border-purple-900/30">
          [VERSTECKT]
        </span>
      );
    }
    return <span className="text-white font-bold">{value}</span>;
  };

  const handleInplaceChange = (e) => {
    const { name, value } = e.target;
    setLocalFields(prev => ({ ...prev, [name]: value }));
  };

  // 💾 INPLACE-MASTER-SPEICHER OHNE INTERNEN REFRESH-ABSTURZ
  const handleInplaceSave = () => {
    try {
      const savedProfiles = JSON.parse(localStorage.getItem('gigsda_profiles')) || [];
      let exists = false;
      const updated = savedProfiles.map(p => {
        if (p && p.name && p.name.trim().toLowerCase() === ticketName.toLowerCase()) {
          exists = true;
          return { ...p, ...localFields };
        }
        return p;
      });
      if (!exists) updated.push(localFields);
      localStorage.setItem('gigsda_profiles', JSON.stringify(updated));
      setEditSection(null);
      setEditPortfolio(false);
      setEditRider(false);
      window.location.hash = Math.random().toString();
    } catch (err) {
      console.error("Cloud Engine Save Error", err);
    }
  };
  // 🔒 HIER EXAKT VOR DEM HTML-START EINBETTEN:
  const currentEditSection = isMyOwnProfile ? editSection : null;

  // 🔒 DER UNBESTECHLICHE IDENTITÄTS-RIEGEL (VÖLLIG ENTKOPPELT)
  const currentLoginUser = localStorage.getItem('gigsda_user') || "";
  const currentViewProfile = ticketName || "";
  
  const weAreTheOwner = currentLoginUser && currentViewProfile && 
                        currentLoginUser.trim().toLowerCase() === currentViewProfile.trim().toLowerCase();

  // 🪐 HIER STARTET EUER DESIGN-GERÜST:
  return (
    <div className="max-w-3xl mx-auto space-y-6 my-4 p-4 font-mono text-xs text-slate-300 animate-fade-in">
      
      {/* ========================================================================= */}
      {/* HEADER & ASSISTENT                                                        */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-purple-950/20 to-slate-900/20 border border-purple-500/10 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[8px] text-purple-400 font-bold uppercase tracking-widest block">// BACKSTAGE-PORTFOLIO CONTROLLER</span>
            <h3 className="text-sm font-black text-white uppercase tracking-tight mt-0.5">⭐ Gigsda All-In-One Board</h3>
          </div>
          <button type="button" onClick={onBack} className="bg-slate-900 border border-slate-800 text-white px-3 py-1 rounded-xl text-[10px] font-bold cursor-pointer print:hidden">‹ Cockpit</button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🖼️ SEKTION 2: REAKTIVER CLOUD-BILD-SLIDER WITH INPLACE-ENGINE (ALL 4)     */}
      {/* ========================================================================= */}
      <section 
        className="w-full h-64 rounded-3xl overflow-hidden relative border border-slate-900 shadow-2xl bg-slate-950 bg-cover bg-center transition-all duration-700"
        style={{ 
          // 📡 DYNAMISCHE HINTERGRUND-WEICHE: Rotiert live alle 4 eingetippten Web-Bilder!
          backgroundImage: `url('${
            slides[currentSlide]?.bg_url || 
            userData[`slide${currentSlide + 1}_url`] || 
            "/profiles/Jud-Winston/banner.jpg"
          }')` 
        }}
        >
        {/* Dunkler Cyber-Verlauf über dem Cloud-Bild für gestochen scharfe Lesbarkeit */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10 print:hidden" />

        {/* Oben rechts: Einheitlicher, dezenter Inplace-Edit-Stift (SCHRANKE ENTGEGENGELÖTET) */}
        {isMyOwnProfile && (
          <div className="absolute top-4 right-4 z-20 print:hidden">
            <button 
              type="button"
              onClick={() => setEditSection(editSection === 'slider' ? null : 'slider')}
              className="bg-slate-950/80 backdrop-blur-md border border-slate-800 hover:border-purple-500/40 text-slate-400 hover:text-purple-400 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer shadow-lg transition-colors"
            >
              <Edit3 className="w-3 h-3" /> {editSection === 'slider' ? 'Close' : 'Edit Slider'}
            </button>
          </div>
        )}
        {/* ⚡ DIE LIVE-TEXT-PROJECTION AUF DEM BANNER */}
        <div className="absolute bottom-6 left-6 space-y-1 z-10 text-left">
          <span className="text-[9px] text-cyan-400 font-bold tracking-widest block uppercase font-mono">
            // {localFields.genre || userData.genre || "REALTIME PORTFOLIO STREAM"}
          </span>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight font-sans print:text-black">
            {localFields.slide1_line1 || userData.slide1_line1 || userData.project_name || userData.name || "Gigsda Act"}
          </h1>
          <p className="text-xs text-slate-400 font-mono tracking-wide uppercase print:text-slate-700">
            ⚡ {localFields.slide1_line2 || userData.slide1_line2 || "LIVE CONFIG ACTIVE"} • 📍 {localFields.city || userData.city || "Region Gigsda"}
          </p>
        </div>


      </section>

      {/* ========================================================================= */}
      {/* ⚙️ INPLACE EDIT-MASK: VOLLSTÄNDIGE MATRIX FÜR ALLE 4 CLOUD-SLIDES         */}
      {/* ========================================================================= */}
        {editSection === 'slider' && isMyOwnProfile && (

        <div className="bg-slate-950 border border-slate-900 p-4 rounded-3xl space-y-3 animate-fade-in print:hidden">
          <div className="text-[9px] text-amber-400 font-bold uppercase tracking-widest">// CLOUD-BANNER TEXT & MEDIEN KONFIGURATION (VOLLSTÄNDIG)</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* CONFIG SLIDE 1 */}
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-950 space-y-2">
              <span className="text-cyan-400 text-[8px] font-black block">// SLIDE 1 CONFIGURATION</span>
              <div className="space-y-1">
                <label className="text-[8px] text-slate-500 uppercase block">Fette Hauptüberschrift</label>
                <input type="text" name="slide1_line1" value={localFields.slide1_line1 || ''} onChange={handleInplaceChange} placeholder="z.B. FESTIVAL SETUP" className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1 text-white text-[11px]" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] text-slate-500 uppercase block">Unterüberschrift (Cyan)</label>
                <input type="text" name="slide1_line2" value={localFields.slide1_line2 || ''} onChange={handleInplaceChange} placeholder="z.B. ZUVERLÄSSIGE SYSTEMTECHNIK" className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1 text-white text-[11px]" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] text-purple-400 uppercase block font-bold">Externe Internet-Bild URL</label>
                <input type="text" name="slide1_url" value={localFields.slide1_url || ''} onChange={handleInplaceChange} placeholder="https://unsplash.com... oder Cloud-Link" className="w-full bg-slate-950 border border-purple-500/20 rounded-lg px-2.5 py-1 text-purple-300 text-[11px]" />
              </div>
            </div>

            {/* CONFIG SLIDE 2 */}
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-950 space-y-2">
              <span className="text-cyan-400 text-[8px] font-black block">// SLIDE 2 CONFIGURATION</span>
              <div className="space-y-1">
                <label className="text-[8px] text-slate-500 uppercase block">Fette Hauptüberschrift</label>
                <input type="text" name="slide2_line1" value={localFields.slide2_line1 || ''} onChange={handleInplaceChange} placeholder="z.B. LIVE-PRODUKTION" className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1 text-white text-[11px]" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] text-slate-500 uppercase block">Unterüberschrift (Cyan)</label>
                <input type="text" name="slide2_line2" value={localFields.slide2_line2 || ''} onChange={handleInplaceChange} placeholder="z.B. GROSSBÜHNEN & LICHT-DESIGN" className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1 text-white text-[11px]" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] text-purple-400 uppercase block font-bold">Externe Internet-Bild URL</label>
                <input type="text" name="slide2_url" value={localFields.slide2_url || ''} onChange={handleInplaceChange} placeholder="https://..." className="w-full bg-slate-950 border border-purple-500/20 rounded-lg px-2.5 py-1 text-purple-300 text-[11px]" />
              </div>
            </div>

            {/* CONFIG SLIDE 3 */}
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-950 space-y-2">
              <span className="text-cyan-400 text-[8px] font-black block">// SLIDE 3 CONFIGURATION</span>
              <div className="space-y-1">
                <label className="text-[8px] text-slate-500 uppercase block">Fette Hauptüberschrift</label>
                <input type="text" name="slide3_line1" value={localFields.slide3_line1 || ''} onChange={handleInplaceChange} placeholder="z.B. GALA & CLUB-BETREUUNG" className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1 text-white text-[11px]" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] text-slate-500 uppercase block">Unterüberschrift (Cyan)</label>
                <input type="text" name="slide3_line2" value={localFields.slide3_line2 || ''} onChange={handleInplaceChange} placeholder="z.B. PERFEKTER SOUND & ATMOSPHÄRE" className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1 text-white text-[11px]" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] text-purple-400 uppercase block font-bold">Externe Internet-Bild URL</label>
                <input type="text" name="slide3_url" value={localFields.slide3_url || ''} onChange={handleInplaceChange} placeholder="https://..." className="w-full bg-slate-950 border border-purple-500/20 rounded-lg px-2.5 py-1 text-purple-300 text-[11px]" />
              </div>
            </div>

            {/* CONFIG SLIDE 4 */}
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-950 space-y-2">
              <span className="text-cyan-400 text-[8px] font-black block">// SLIDE 4 CONFIGURATION</span>
              <div className="space-y-1">
                <label className="text-[8px] text-slate-500 uppercase block">Fette Hauptüberschrift</label>
                <input type="text" name="slide4_line1" value={localFields.slide4_line1 || ''} onChange={handleInplaceChange} placeholder="z.B. FESTIVAL SETUP" className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1 text-white text-[11px]" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] text-slate-500 uppercase block">Unterüberschrift (Cyan)</label>
                <input type="text" name="slide4_line2" value={localFields.slide4_line2 || ''} onChange={handleInplaceChange} placeholder="z.B. ZUVERLÄSSIGE SYSTEMTECHNIK" className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1 text-white text-[11px]" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] text-purple-400 uppercase block font-bold">Externe Internet-Bild URL</label>
                <input type="text" name="slide4_url" value={localFields.slide4_url || ''} onChange={handleInplaceChange} placeholder="https://..." className="w-full bg-slate-950 border border-purple-500/20 rounded-lg px-2.5 py-1 text-purple-300 text-[11px]" />
              </div>
            </div>

          </div>
          <button type="button" onClick={handleInplaceSave} className="w-full bg-amber-400 text-slate-950 font-black h-8 rounded-xl uppercase tracking-wider text-[10px] cursor-pointer shadow-md transition-transform hover:scale-[1.005]">Cloud-Ticker einbrennen ✓</button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📋 SEKTION 3: TABS & PORTFOLIO                                            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* TABS-BOX MIT TEXT-EDIT-STIFT UND INTERNEM SPEICHER-HEBEL */}
        <div className="md:col-span-2 bg-slate-950/20 border border-slate-900 rounded-3xl p-4 shadow-xl space-y-4 relative print:border-slate-300 print:bg-white print:text-black">
          <div className="flex justify-between items-center border-b border-slate-900 pb-2 print:border-slate-200">
            <div className="flex gap-3">
              {['einleitung', 'karriere', 'privates'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`text-[11px] font-black uppercase tracking-tight transition-colors cursor-pointer ${activeTab === tab ? 'text-white print:text-black' : 'text-slate-500'}`}
                >
                  {tab === 'einleitung' ? '✓ Einleitung' : tab === 'karriere' ? '💼 Karriere' : '⚙️ Privates'}
                </button>
              ))}
            </div>
          {isMyOwnProfile && (
            <button
              type="button"
              onClick={() => setEditSection(editSection === 'bio' ? null : 'bio')}
              className="text-[9px] text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 uppercase font-black cursor-pointer"
            >
              <Edit3 className="w-3 h-3" /> {editSection === 'bio' ? 'Close' : 'Edit Bio'}
            </button>
          )}
          </div>

          {editSection === 'bio' ? (
            <div className="space-y-2 animate-fade-in">
              <span className="text-[8px] text-purple-400 font-mono uppercase block">// Bearbeite gerade Sektor: {activeTab}</span>
              <textarea 
                name={activeTab} 
                value={localFields[activeTab] || ''} 
                onChange={handleInplaceChange} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs h-24 resize-none focus:outline-none focus:border-purple-400"
              />
              <button type="button" onClick={handleInplaceSave} className="w-full bg-purple-500 text-white font-mono font-black h-7 rounded-xl text-[9px] uppercase tracking-wider cursor-pointer shadow-lg hover:bg-purple-400 transition-colors">
                Text einbrennen ✓
              </button>
            </div>
          ) : (
            <div className="text-slate-400 font-sans text-[11px] leading-relaxed min-h-12 print:text-slate-800">
              {activeTab === 'einleitung' && (localFields?.einleitung || "Das Wichtigste in ein bis zwei Sätzen...")}
              {activeTab === 'karriere' && (localFields?.karriere || "Je nach Bedeutung des Musikers...")}
              {activeTab === 'privates' && (localFields?.privates || "Kurze Beschreibung des privaten Lebens...")}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* STAMMDATEN-KOMPAKT-BOX MIT INTEGRALEN SCHUTZ-AUGEN (👁️ INPLACE ENGINE) */}
        {/* ========================================================================= */}
        <div className="bg-slate-950/20 border border-slate-900 rounded-3xl p-4 shadow-xl text-[10px] text-slate-500 relative print:border-slate-300 print:bg-white print:text-black">
          <div className="absolute top-3 right-3 flex gap-2 print:hidden">
        {/* 🔒 STAMMDATEN-RIEGEL */}
        {isMyOwnProfile && (
          <button 
            type="button"
            onClick={() => setEditSection(editSection === 'identity' ? null : 'identity')}
            className="text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 uppercase font-black cursor-pointer"
          >
            <Edit3 className="w-3 h-3" /> {editSection === 'identity' ? 'Close' : 'Edit Data'}
          </button>
        )}

          </div>
          {editSection === 'identity' && isMyOwnProfile ? (
            <div className="space-y-3.5 pt-4 animate-fade-in">
              <span className="text-[8px] text-cyan-400 font-mono uppercase block border-b border-slate-900 pb-1">// ID AXIS & PRIVACY LOCKS</span>
              {/* 🔒 SCHREIBGESCHÜTZTER KONTOTYP (NICHT EDITIERBAR!) */}
              <div className="space-y-1 bg-slate-900/40 p-2 rounded-xl border border-slate-900/50">
                <label className="text-[8px] text-slate-500 uppercase block font-bold">Konto-Klassifizierung</label>
                <div className="text-[10px] text-cyan-400 font-black uppercase font-mono tracking-widest">
                  ⚡ [{(userData?.role === 'Caterer' || localFields?.role === 'Caterer') ? 'Catering' : (userData?.role === 'Material' || localFields?.role === 'Material') ? 'Rental' : (userData?.role || localFields?.role || "Künstler")}]
                </div>
              </div>

              {/* 📸 KLEINES AVATAR-BILD DIREKT IN DER KACHEL */}
              {(localFields.avatarUrl || userData?.avatarUrl) && (
                <div className="flex items-center gap-2 pt-2 mt-1 border-t border-slate-900/50">
                  <span className="text-slate-500 uppercase font-mono">AVATAR:</span>
                  <img 
                    src={localFields.avatarUrl || userData?.avatarUrl} 
                    alt="Profil Avatar" 
                    className="w-10 h-10 rounded-full object-cover border border-slate-800 shadow-[0_0_8px_rgba(34,211,238,0.2)]"
                    onError={(e) => { e.target.style.display = 'none'; }} // Blendet sich lautlos aus, falls die URL ungültig ist
                  />
                </div>
              )}

              {/* 📸 NEUES FELD: AVATAR-URL */}
              <div className="space-y-1">
                <label className="text-[8px] text-slate-600 uppercase block font-bold">Profilbild / Avatar (Bild-URL)</label>
                <input type="text" name="avatarUrl" value={localFields.avatarUrl || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs outline-none" placeholder="https://..." />
              </div>

              {/* Künstler- / Locationname (Projektname) */}
              <div className="space-y-1">
                <label className="text-[8px] text-slate-600 uppercase block font-bold">Künstler- / Locationname</label>
                <div className="relative">
                  <input type="text" name="project_name" value={localFields.project_name || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-2 pr-8 py-1 text-white text-[10px]" />
                  <button type="button" onClick={() => setLocalFields(p => ({ ...p, project_name_visible: p.project_name_visible === false }))} className="absolute right-2.5 top-1.5 text-slate-600 hover:text-cyan-400 cursor-pointer">
                    {localFields.project_name_visible !== false ? <Eye className="w-3 h-3 text-cyan-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
                  </button>
                </div>
              </div>

              {/* Vorname */}
              <div className="space-y-1">
                <label className="text-[8px] text-slate-600 uppercase block font-bold">Vorname (Klarname)</label>
                <div className="relative">
                  <input type="text" name="vorname" value={localFields.vorname || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[10px]" />
                  <button type="button" onClick={() => setLocalFields(p => ({ ...p, vorname_visible: p.vorname_visible === false }))} className="absolute right-2.5 top-1.5 text-slate-600 hover:text-cyan-400 cursor-pointer">
                    {localFields.vorname_visible !== false ? <Eye className="w-3 h-3 text-cyan-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
                  </button>
                </div>
              </div>

              {/* Nachname */}
              <div className="space-y-1">
                <label className="text-[8px] text-slate-600 uppercase block font-bold">Nachname (Klarname)</label>
                <div className="relative">
                  <input type="text" name="nachname" value={localFields.nachname || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[10px]" />
                  <button type="button" onClick={() => setLocalFields(p => ({ ...p, nachname_visible: p.nachname_visible === false }))} className="absolute right-2.5 top-1.5 text-slate-600 hover:text-cyan-400 cursor-pointer">
                    {localFields.nachname_visible !== false ? <Eye className="w-3 h-3 text-cyan-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
                  </button>
                </div>
              </div>

              {/* Geodaten-Reihe (PLZ, Stadt, Straße) */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">PLZ (Radar)</label>
                  <input type="text" name="plz" value={localFields.plz || ''} onChange={handleInplaceChange} placeholder="5280" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[10px]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Stadt</label>
                  <input type="text" name="city" value={localFields.city || ''} onChange={handleInplaceChange} placeholder="Braunau" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[10px]" />
                </div>
              </div>

              {/* Straße & Hausnummer */}
              <div className="space-y-1">
                <label className="text-[8px] text-slate-600 uppercase block font-bold">Straße & Hausnummer (Abrechnung)</label>
                <div className="relative">
                  <input type="text" name="street" value={localFields.street || ''} onChange={handleInplaceChange} placeholder="Musterstraße 42" className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-2 pr-8 py-1 text-white text-[10px]" />
                  <button type="button" onClick={() => setLocalFields(p => ({ ...p, street_visible: p.street_visible === false }))} className="absolute right-2.5 top-1.5 text-slate-600 hover:text-cyan-400 cursor-pointer">
                    {localFields.street_visible !== false ? <Eye className="w-3 h-3 text-cyan-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
                  </button>
                </div>
              </div>

              {/* 📞 NEUES FELD: TELEFONNUMMER */}
                <div className="relative">
                  <input type="text" name="phone" value={localFields.phone || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs outline-none" placeholder="+43 660 ..." />
                  <button type="button" onClick={() => setLocalFields(p => ({ ...p, phone_visible: !p.phone_visible }))} className="absolute right-2.5 top-1.5 text-slate-600 hover:text-cyan-400 cursor-pointer">
                    {localFields.phone_visible !== false ? <Eye className="w-3 h-3 text-cyan-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
                  </button>
                </div>

              {/* 📧 NEUES FELD: E-MAIL */}
              <div className="space-y-1">
                <label className="text-[8px] text-slate-600 uppercase block font-bold">E-Mail-Adresse</label>
                <div className="relative">
                  <input type="email" name="email" value={localFields.email || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs outline-none" placeholder="name@gigsda.at" />
                  <button type="button" onClick={() => setLocalFields(p => ({ ...p, email_visible: p.email_visible === false }))} className="absolute right-2.5 top-1.5 text-slate-600 hover:text-cyan-400 cursor-pointer">
                    {localFields.email_visible !== false ? <Eye className="w-3 h-3 text-cyan-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
                  </button>
                </div>
              </div>

              {/* 🌐 INTERNETADRESSE / PORTFOLIO */}
              <div className="space-y-1">
                <label className="text-[8px] text-slate-600 uppercase block font-bold">Homepage / Portfolio URL</label>
                <input
                  type="text"
                  name="website"
                  value={localFields.website || ''}
                  onChange={handleInplaceChange}
                  placeholder="https://deine-website.at"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[10px] outline-none focus:border-cyan-500/30 font-mono"
                />
              </div>

              {/* Genre */}
              <div className="space-y-1">
                <label className="text-[8px] text-slate-600 uppercase block font-bold">Genre</label>
                <input type="text" name="genre" value={localFields.genre || ''} onChange={handleInplaceChange} placeholder="ROCK" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-[10px]" />
              </div>

              <button type="button" onClick={handleInplaceSave} className="w-full bg-cyan-400 text-slate-950 font-mono font-black h-7 rounded-xl text-[9px] uppercase tracking-wider cursor-pointer mt-2">Identität sichern ✓</button>
            </div>
          ) : (
            <div className="space-y-1.5 flex flex-col justify-center h-full pt-4">
                            {/* 📸 KLEINES AVATAR-BILD ALS KACHEL-KOPF */}
              {(localFields.avatarUrl || userData?.avatarUrl) && (
                <div className="pb-2 mb-1 border-b border-slate-900/50 flex justify-start">
                  <img 
                    src={localFields.avatarUrl || userData?.avatarUrl} 
                    alt="Kachel Avatar" 
                    className="w-12 h-12 rounded-full object-cover border border-slate-800 shadow-[0_0_8px_rgba(34,211,238,0.2)]"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
              {/* 🔒 KONTO-TYP STATUS-ANZEIGE */}
              <p className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase mb-1">
                // Kontotyp: {localFields.accountType || userData?.accountType || localFields.role || "Künstler"}
              </p>
              <p>PROJEKTNAME: <span className="text-white font-bold">{localFields?.project_name || userData?.project_name || "[ KEIN PROJEKTNAME ]"}</span></p>
              <p>KLARNAME: {renderField('name', localFields?.name || userData?.name)} {renderField('nachname', localFields?.nachname || userData?.nachname)}</p>
              <p>PLZ / STADT: <span className="text-slate-300 font-bold print:text-black">{localFields?.plz || userData?.plz || '5280'} {localFields?.location || userData?.location || 'Braunau'}</span></p>
              <p>ADRESSE: {renderField('street', localFields?.street || userData?.street)}</p>
              <p>
              <span className="text-slate-500 uppercase font-mono">TELEFON:</span>{' '}
              {renderField('phone', localFields.phone || userData?.phone, '// nicht hinterlegt')}
              </p>
              <p>
              <span className="text-slate-500 uppercase font-mono">E-MAIL:</span>{' '}
              {renderField('email', localFields.email || userData?.email, '// nicht hinterlegt')}
              </p>
               <p>GENRE: <span className="text-cyan-400 font-bold print:text-cyan-600">{localFields?.genre || userData?.genre || 'ROCK / ALTERNATIVE'}</span></p>
            </div>
          )}
        </div>
      </div>

      {/* 🎸 REAKTIVE SEKTION: MUSIKALISCHE IDENTITÄT (MIT FORMULAR-WEICHE) */}
      <div className="bg-slate-950/80 backdrop-blur-md border border-slate-900 p-4 rounded-2xl shadow-xl font-mono text-xs text-slate-300">
        
        {editSection === 'instruments' ? (
          /* 📋 INTERAKTIVE EDIT-MASKE FÜR INSTRUMENTE */
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
              <span className="text-[9px] text-amber-500 font-bold tracking-widest uppercase">// Instrumente bearbeiten</span>
              <button
                type="button"
                onClick={() => setEditSection(null)}
                className="text-[9px] text-slate-500 hover:text-white uppercase font-black"
              >
                Abbrechen
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[8px] text-slate-600 uppercase block font-bold">Haupt-Instrument</label>
                <input 
                  type="text" 
                  name="mainInstrument" 
                  value={(localFields && localFields.mainInstrument) || ''} 
                  onChange={handleInplaceChange} 
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs outline-none focus:border-cyan-500/40" 
                  placeholder="z.B. E-Gitarre, Drums, Vocals" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[8px] text-slate-600 uppercase block font-bold">Neben-Instrumente / Skills</label>
                <input 
                  type="text" 
                  name="subInstruments" 
                  value={(localFields && localFields.subInstruments) || ''} 
                  onChange={handleInplaceChange} 
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs outline-none focus:border-cyan-500/40" 
                  placeholder="z.B. Keys, Songwriting, Backing Vocals" 
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEditSection(null)}
              className="w-full bg-cyan-950/60 border border-cyan-800 hover:border-cyan-500 text-cyan-400 hover:text-white font-black uppercase tracking-widest py-2 rounded-xl text-[10px] transition-all cursor-pointer shadow-lg"
            >
              INSTRUMENTE SPEICHERN ✓
            </button>
          </div>
        ) : (
          /* 📊 NORMALE REIN-ANSICHT (WENN NICHT EDITIERT WIRD) */
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
              <span className="text-[9px] text-cyan-400 font-bold tracking-widest uppercase">// Musikalische Stammdaten</span>
              <div className="flex items-center gap-3">
                <span className="text-[9px] text-slate-600 font-bold font-mono"></span>
                
                {/* 🔒 SCHUTZ-SCHRANKE: Versteckt den Button für Gäste fehlerfrei */}
                {isOwner && (
                  <button
                    type="button"
                    onClick={() => setEditSection('instruments')}
                    className="text-[9px] font-black text-amber-500 hover:text-amber-400 uppercase tracking-wider font-mono cursor-pointer transition-colors px-1.5 py-0.5 rounded border border-slate-900 bg-slate-950/40 hover:border-amber-500/20"
                  >
                    ✎ EDIT
                  </button>
                )}
                
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1">
                <span className="text-slate-500 block text-[10px]">HAUPT-INSTRUMENT:</span>
                <span className="text-white font-black uppercase text-sm tracking-tight">
                  {(localFields && localFields.mainInstrument) || (userData && userData.mainInstrument) || "E-Gitarre"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 block text-[10px]">NEBEN-INSTRUMENTE / SKILLS:</span>
                <span className="text-slate-400 font-bold">
                  {(localFields && localFields.subInstruments) || (userData && userData.subInstruments) || "Vocals, Synths, Percussion"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>


      {/* ========================================================================= */}
      {/* 📋 SEKTION 3.5: DISKOGRAFIE & HIGHLIGHTS PORTFOLIO MIT INPLACE-STIFT     */}
      {/* ========================================================================= */}
      <div className="bg-slate-950/20 border border-slate-900 rounded-3xl p-5 shadow-xl space-y-3 print:border-slate-300 print:bg-white print:text-black">
        <div className="flex justify-between items-center border-b border-slate-900 pb-2 print:border-slate-200">
          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 print:text-cyan-700">
            <Award className="w-4 h-4 print:hidden" /> // Portfolio & Referenz-Akten
          </h4>
          {/* ✏️ Der einheitliche Edit-Stift rechts oben */}
          {/* 🔒 PORTFOLIO-RIEGEL */}
          {isMyOwnProfile && (
            <button 
              type="button" 
              onClick={() => setEditSection(editSection === 'portfolio' ? null : 'portfolio')}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 uppercase font-black cursor-pointer"
            >
              <Edit3 className="w-3 h-3" /> {editSection === 'portfolio' ? 'Close' : 'Edit P & R'}
            </button>
          )}
        </div>

          {editSection === 'portfolio' && isMyOwnProfile ? (
          <div className="space-y-3 pt-2 animate-fade-in print:hidden">
            <div className="space-y-1">
              <label className="text-[8px] text-slate-500 uppercase block font-bold">Diskografie (Alben / Releases)</label>
              <textarea name="diskografie" value={localFields.diskografie || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs h-16 resize-none focus:outline-none focus:border-cyan-400" placeholder="z.B. Demo Album 2025 // Live EP 2026" />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] text-slate-500 uppercase block font-bold">Referenzen / Highlights / Gigs</label>
              <textarea name="referenzen" value={localFields.referenzen || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs h-16 resize-none focus:outline-none focus:border-cyan-400" placeholder="z.B. Support-Gig bei Rock am Inn" />
            </div>
            <button type="button" onClick={handleInplaceSave} className="w-full bg-cyan-400 text-slate-950 font-mono font-black h-7 rounded-xl text-[9px] uppercase tracking-wider cursor-pointer shadow-lg transition-transform hover:scale-[1.002]">Akten einbrennen ✓</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] pt-1">
            <div>
              <span className="text-slate-500 font-bold block print:text-slate-700">Diskografie:</span>
              <span className="text-slate-300 mt-1 block print:text-slate-800">{localFields?.diskografie || userData?.diskografie || "Keine Alben eingetragen"}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold block print:text-slate-700">Referenzen & Highlights:</span>
              <span className="text-slate-300 mt-1 block print:text-slate-800">{localFields?.referenzen || userData?.referenzen || "Warte auf erste Gigsda-Protokolle"}</span>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 🎵 SEKTION 3.6: DIE 4 CLOUDBASIERTEN AUDIO-HÖRPROBEN (MIT TIMEOUT BLOCK)   */}
      {/* ========================================================================= */}
      <div className="bg-slate-950/20 border border-slate-900 rounded-3xl p-5 shadow-xl space-y-4 print:hidden">
        <div className="flex justify-between items-center border-b border-slate-900 pb-2">
          <div className="text-[9px] text-purple-400 font-black tracking-widest uppercase">// 🔊 AUDIO-MONITORING (CLOUD STREAM SYSTEM - OPTION B)</div>
          {/* 🔒 AUDIO-RIEGEL */}
          {isMyOwnProfile && (
            <button 
              type="button" 
              onClick={() => setEditSection(editSection === 'audio' ? null : 'audio')}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 uppercase font-black cursor-pointer"
            >
              <Edit3 className="w-3 h-3" /> {editSection === 'audio' ? 'Close' : 'Edit Audio'}
            </button>
          )}
        </div>

        {editSection === 'audio' && isMyOwnProfile ? (
          <div className="bg-slate-950 border border-slate-900 p-4 rounded-2xl space-y-4 animate-fade-in">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-slate-900/40 p-2.5 rounded-xl border border-slate-950">
                <div className="sm:col-span-12 text-purple-400 text-[8px] font-black uppercase font-mono">// AUDIO-TRACK {num}</div>
                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[8px] text-slate-500 uppercase">Songtitel</label>
                  <input type="text" name={`audio${num}_title`} value={localFields[`audio${num}_title`] || ''} onChange={handleInplaceChange} placeholder="z.B. Aurasiege - Until Sky" className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-white text-[11px]" />
                </div>
                <div className="sm:col-span-6 space-y-1">
                  <label className="text-[8px] text-slate-500 uppercase">Externe MP3-Stream URL</label>
                  <input type="text" name={`audio${num}_url`} value={localFields[`audio${num}_url`] || ''} onChange={handleInplaceChange} placeholder="https://your-cloud.com" className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-white text-[11px]" />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[8px] text-slate-500 uppercase">Limit (Sek.)</label>
                  <input type="number" name={`audio${num}_limit`} value={localFields[`audio${num}_limit`] || ''} onChange={handleInplaceChange} placeholder="30" className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-white text-[11px]" />
                </div>
              </div>
            ))}
            <button type="button" onClick={handleInplaceSave} className="w-full bg-purple-500 text-white font-black h-8 rounded-xl uppercase tracking-wider text-[10px] cursor-pointer">Hörproben einbrennen ✓</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((num) => {
              const title = userData[`audio${num}_title`] || `Aurasiege - Track ${num} Prototyp`;
              const url = userData[`audio${num}_url`];
              const limit = parseInt(userData[`audio${num}_limit`] || '30', 10);
              const isPlaying = currentAudioTrack === num;

              return (
                <div key={num} className="bg-slate-900/50 border border-slate-950 p-3 rounded-2xl space-y-2 hover:border-purple-500/20 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold tracking-tight text-[11px] truncate max-w-[200px]">{title}</span>
                    <span className="text-slate-500 text-[8px] font-mono uppercase bg-slate-950 px-1.5 py-0.5 rounded border border-slate-900">
                      Teaser-Limit: {limit}s
                    </span>
                  </div>
                  
                  {/* Cyber-Audioplayer Nachbau */}
                  <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-900">
                    <button 
                      type="button" 
                      onClick={() => handlePlayAudio(num, url, limit)}
                      className={`font-black transition-colors cursor-pointer text-xs ${isPlaying ? 'text-cyan-400 animate-pulse' : 'text-purple-400 hover:text-purple-300'}`}
                    >
                      {isPlaying ? '◼' : '▶'}
                    </button>
                    
                    {/* Live-Fortschrittsbalken */}
                    <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden relative">
                      <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-100" 
                        style={{ width: isPlaying ? `${audioProgress}%` : '0%' }}
                      />
                    </div>
                    
                    <span className="text-[8px] text-slate-600 font-mono w-6 text-right">
                      {isPlaying ? `${Math.round((audioProgress / 100) * limit)}s` : '0s'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 💰 SEKTION 4: GAGENSTRUKTUR MIT INPLACE-EDIT                              */}
      {/* ========================================================================= */}
      <div className="bg-slate-950/20 border border-slate-900 rounded-3xl p-4 shadow-xl space-y-2.5 print:border-slate-300 print:bg-white print:text-black">
        <div className="flex justify-between items-center border-b border-slate-950 pb-2 print:border-slate-200">
          <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold print:text-slate-600">// VERHANDLUNG-GAGENSTRUKTUR</div>
          {/* 🔒 GAGEN-RIEGEL */}
          {isMyOwnProfile && (
            <button 
              type="button" 
              onClick={() => setEditSection(editSection === 'gagen' ? null : 'gagen')}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 uppercase font-black cursor-pointer"
            >
              <Edit3 className="w-3 h-3" /> {editSection === 'gagen' ? 'Close' : 'Edit Gage'}
            </button>
          )}
        </div>
          {/* 🗺️ NEUES FELD: REISE-RADIUS & EINSATZGEBIET */}
          <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900/50 flex flex-col justify-between space-y-2">
            <div className="text-[8px] text-slate-500 uppercase font-bold tracking-wider">// Mobilitaet & Radius</div>
            <div className="space-y-0.5">
              <div className="text-xs font-black text-purple-400 uppercase tracking-tight">
                {localFields?.travelRadius || "D-A-CH-Raum"}
              </div>
              <div className="text-[9px] text-slate-500 italic">
                {localFields?.travelVehicle || "Eigener PKW / Tourbus vorhanden"}
              </div>
            </div>
          </div>

        {editSection === 'gagen' && isMyOwnProfile ? (
          <div className="bg-slate-950 border border-slate-900 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
            <div className="space-y-1">
              <label className="text-[9px] text-slate-500 uppercase">Mindestgage (€)</label>
              <input type="text" name="mindestgage" value={localFields.mindestgage || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-slate-500 uppercase">Wunschgage (€)</label>
              <input type="text" name="wunschgage" value={localFields.wunschgage || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-slate-500 uppercase">KM-Kosten (€)</label>
              <input type="text" name="fahrtkosten" value={localFields.fahrtkosten || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white" />
            </div>
            <button type="button" onClick={handleInplaceSave} className="sm:col-span-3 bg-cyan-400 text-slate-950 font-black h-8 rounded-xl uppercase tracking-wider text-[10px] mt-2 cursor-pointer">Gagen einbrennen ✓</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900 flex flex-col justify-between h-14 print:border-slate-300 print:bg-slate-50">
              <span className="text-[8px] text-slate-600 font-bold uppercase print:text-slate-500">// MINDESTGAGE</span>
              <span className="text-emerald-400 font-black text-xs mt-1 print:text-emerald-600">{renderField('mindestgage', userData?.mindestgage ? `${userData.mindestgage} € Fixum` : '250 € Fixum')}</span>
            </div>
            <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900 flex flex-col justify-between h-14 print:border-slate-300 print:bg-slate-50">
              <span className="text-[8px] text-slate-600 font-bold uppercase print:text-slate-500">// WUNSCH-GAGE</span>
              <span className="text-cyan-400 font-black text-xs mt-1 print:text-cyan-600">{renderField('wunschgage', userData?.wunschgage ? `${userData.wunschgage} € Umlage` : '400 € Umlage')}</span>
            </div>
            <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900 flex flex-col justify-between h-14 print:border-slate-300 print:bg-slate-50">
              <span className="text-[8px] text-slate-600 font-bold uppercase print:text-slate-500">// FAHRTKOSTEN</span>
              <span className="text-purple-400 font-black text-xs mt-1 print:text-purple-600">{renderField('fahrtkosten', userData?.fahrtkosten ? `${userData.fahrtkosten} € / km` : '0.42 € / km')}</span>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 📷 SEKTION 5: CLOUDBASIERTE LIVEPICS GALERIE (SERVER PROTECTION ENGINE)   */}
      {/* ========================================================================= */}
      <div className="bg-slate-950/20 border border-slate-900 rounded-3xl p-4 shadow-xl space-y-3 print:border-slate-300 print:bg-white">
        <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
          <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold print:text-slate-600">// LIVEPICS (CLOUD OUTSOURCED)</div>
          {isMyOwnProfile && (
            <button
              type="button"
              onClick={() => setEditSection(editSection === 'livepics' ? null : 'livepics')}
              className="text-[9px] text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 uppercase font-black cursor-pointer print:hidden"
            >
              <Edit3 className="w-3 h-3" /> {editSection === 'livepics' ? 'Close' : 'Edit Pics'}
            </button>
          )}
        </div>

        {editSection === 'livepics' && isMyOwnProfile ? (
          <div className="bg-slate-950 border border-slate-900 p-4 rounded-2xl space-y-2 animate-fade-in">
            <input type="text" name="livepic1_url" value={localFields.livepic1_url || ''} onChange={handleInplaceChange} placeholder="Bild-URL 1 (https://...)" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-white text-[11px]" />
            <input type="text" name="livepic2_url" value={localFields.livepic2_url || ''} onChange={handleInplaceChange} placeholder="Bild-URL 2 (https://...)" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-white text-[11px]" />
            <input type="text" name="livepic3_url" value={localFields.livepic3_url || ''} onChange={handleInplaceChange} placeholder="Bild-URL 3 (https://...)" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-white text-[11px]" />
            <button type="button" onClick={handleInplaceSave} className="w-full bg-cyan-400 text-slate-950 font-black h-8 rounded-xl uppercase tracking-wider text-[10px] mt-1 cursor-pointer">Galerie Links einbrennen ✓</button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <div className="h-24 rounded-2xl overflow-hidden border border-slate-900 bg-slate-950 print:border-slate-300 flex items-center justify-center text-slate-700 font-mono text-[9px]">
              <img src={userData.livepic1_url || "/profiles/Jud-Winston/live1.jpg"} alt="Live Pic 1" className="w-full h-full object-cover opacity-80 print:opacity-100" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
            <div className="h-24 rounded-2xl overflow-hidden border border-slate-900 bg-slate-950 print:border-slate-300 flex items-center justify-center text-slate-700 font-mono text-[9px]">
              <img src={userData.livepic2_url || "/profiles/Jud-Winston/live2.jpg"} alt="Live Pic 2" className="w-full h-full object-cover opacity-80 print:opacity-100" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
            <div className="h-24 rounded-2xl overflow-hidden border border-slate-900 bg-slate-950 print:border-slate-300 flex items-center justify-center text-slate-700 font-mono text-[9px]">
              <img src={userData.livepic3_url || "/profiles/Jud-Winston/live3.jpg"} alt="Live Pic 3" className="w-full h-full object-cover opacity-80 print:opacity-100" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 📋 SQUEEZED TECH-RIDER MECHANICAL PATCH BAY (MIT CLOUD STAGE-PLOT)       */}
      {/* ========================================================================= */}
      <div className="bg-slate-950/20 border border-slate-900 rounded-3xl p-5 shadow-xl space-y-3 print:border-slate-300 print:bg-white print:text-black">
        <div className="flex justify-between items-center border-b border-slate-900 pb-2 print:border-slate-200">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 print:text-slate-700">
            <Layers className="w-4 h-4 print:hidden" /> // Bühnen-Setup & Tech-Rider Mechanics
          </h4>
          {/* 🔒 SECURITY-GATE RIDER: Nur für den echten Inhaber sichtbar! */}
          {isMyOwnProfile && (
            <button 
              type="button" 
              onClick={() => setEditRider(!editRider)}
              className="text-[9px] text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 uppercase font-black cursor-pointer print:hidden"
            >
              <Edit3 className="w-3 h-3" /> {editRider ? 'Close' : 'Edit Rider'}
            </button>
          )}

        </div>

        {/* Verhindert das Laden der Rider-Matrix für Gäste */}
        {editRider && isMyOwnProfile ? (
          <div className="space-y-4 pt-2 animate-fade-in print:hidden">
            
            {/* 🎚️ DIE STRUKTURIERTE INPUT PATCH LISTE (6 KANÄLE) */}
            <div className="space-y-1.5">
              <span className="text-[8px] text-cyan-400 font-mono uppercase block">// STAGE INPUT PATCH BAY (KANALLISTE)</span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {[1, 2, 3, 4, 5, 6].map((ch) => (
                  <div key={ch} className="grid grid-cols-12 gap-1.5 items-center bg-slate-900/50 p-1.5 rounded-xl border border-slate-950">
                    <div className="col-span-1 text-[9px] font-bold font-mono text-slate-500 text-center">CH{ch}</div>
                    <div className="col-span-4">
                      <input type="text" name={`ch${ch}_signal`} value={localFields[`ch${ch}_signal`] || ''} onChange={handleInplaceChange} placeholder="z.B. Kick / Vox Lead" className="w-full bg-slate-950 border border-slate-850 rounded px-2 py-0.5 text-white text-[10px]" />
                    </div>
                    <div className="col-span-4">
                      <input type="text" name={`ch${ch}_mic`} value={localFields[`ch${ch}_mic`] || ''} onChange={handleInplaceChange} placeholder="z.B. SM58 / DI-Box" className="w-full bg-slate-950 border border-slate-850 rounded px-2 py-0.5 text-white text-[10px]" />
                    </div>
                    <div className="col-span-3">
                      <input type="text" name={`ch${ch}_stand`} value={localFields[`ch${ch}_stand`] || ''} onChange={handleInplaceChange} placeholder="z.B. Gr. Stativ / +48V" className="w-full bg-slate-950 border border-slate-850 rounded px-2 py-0.5 text-white text-[10px]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 🖼️ NEU: Cloud-Eingabe für das physische Bühnenbild */}
            <div className="space-y-1">
              <label className="text-[8px] text-purple-400 uppercase block font-bold">Bühnenbelegungsplan / Stage-Plot Bild-URL</label>
              <input type="text" name="stageplot_url" value={localFields.stageplot_url || ''} onChange={handleInplaceChange} placeholder="https://your-cloud.com (Grafischer Bühnenplan)" className="w-full bg-slate-950 border border-purple-500/20 rounded-xl px-3 py-1.5 text-purple-300 font-mono text-[11px]" />
            </div>

            {/* Textuelle Beschreibung / Ergänzung */}
            <div className="space-y-1">
              <label className="text-[8px] text-slate-500 uppercase block font-bold">Räumliche Bandaufstellung (Text-Ergänzung)</label>
              <textarea name="bandaufstellung" value={localFields.bandaufstellung || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs h-14 resize-none focus:outline-none focus:border-cyan-400" placeholder="z.B. Drums Center auf Riser, Lead-Vocals vorne Mitte." />
            </div>

            {/* Backline Freitexteingabe */}
            <div className="space-y-1">
              <label className="text-[8px] text-slate-500 uppercase block font-bold">Hinterlegte Backline / Mitgebrachtes Equipment</label>
              <textarea name="backline" value={localFields.backline || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs h-14 resize-none focus:outline-none focus:border-cyan-400" placeholder="z.B. Bringen eigenes Drumset exkl. Becken." />
            </div>

            <button type="button" onClick={handleInplaceSave} className="w-full bg-cyan-400 text-slate-950 font-mono font-black h-7 rounded-xl text-[9px] uppercase tracking-wider cursor-pointer shadow-lg">Gesamte Rider-Matrix einbrennen ✓</button>
          </div>
        ) : (
          <div className="space-y-4 pt-1">
            
            {/* 📊 DIE TABELLE FÜR DEN TONTECHNIKER */}
            <div className="space-y-1">
              <span className="text-slate-500 font-bold block print:text-slate-700">Bühnenbelegungsplan (Input List):</span>
              <div className="w-full overflow-hidden rounded-xl border border-slate-900 bg-slate-950/40 print:border-slate-300 print:bg-white mt-1">
                <table className="w-full text-[10px] font-mono border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-950 text-slate-500 border-b border-slate-900 print:bg-slate-100 print:text-slate-700 print:border-slate-300">
                      <th className="p-1.5 w-12 text-center">CH</th>
                      <th className="p-1.5">SIGNAL / INSTRUMENT</th>
                      <th className="p-1.5">MIKROFON / DI</th>
                      <th className="p-1.5">STATIV / INFO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60 print:divide-slate-200">
                    {[1, 2, 3, 4, 5, 6].map((ch) => {
                      const sig = localFields[`ch${ch}_signal`] || userData[`ch${ch}_signal`];
                      const mic = localFields[`ch${ch}_mic`] || userData[`ch${ch}_mic`];
                      const std = localFields[`ch${ch}_stand`] || userData[`ch${ch}_stand`];
                      
                      if (!sig && !mic && !std) return null;

                      return (
                        <tr key={ch} className="hover:bg-slate-900/20 text-slate-300 print:text-black">
                          <td className="p-1.5 font-bold text-slate-500 text-center">0{ch}</td>
                          <td className="p-1.5 font-sans font-bold">{sig}</td>
                          <td className="p-1.5 text-cyan-400 font-bold print:text-cyan-700">{mic}</td>
                          <td className="p-1.5 text-slate-400 print:text-slate-600">{std}</td>
                        </tr>
                      );
                    })}
                    {!([1, 2, 3, 4, 5, 6].some(ch => localFields[`ch${ch}_signal`] || userData[`ch${ch}_signal`])) && (
                      <tr>
                        <td colSpan="4" className="p-3 text-slate-600 italic text-center font-sans">Noch keine Input-Liste konfiguriert. Klicke auf 'Rider Konfigurator' zum Zuweisen.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 🖼️ VISUELLER STAGE-PLOT GRAPHIC DISPLAY (PERFEKT SKALIERT) */}
            <div>
              <span className="text-slate-500 font-bold block print:text-slate-700">Physischer Bühnenaufstellungsplan (Stage-Plot):</span>
              {userData?.stageplot_url || localFields?.stageplot_url ? (
                // h-auto lässt den Kasten flexibel mitskalieren, max-h-96 verhindert, dass das Bild zu riesig wird
                <div className="w-full h-auto max-h-96 rounded-2xl overflow-hidden border border-slate-900 bg-slate-950 mt-1.5 relative group print:border-slate-300 shadow-xl">
                  <img 
                    src={localFields?.stageplot_url || userData?.stageplot_url} 
                    alt="Künstler Stage-Plot" 
                    // w-full und object-cover zwingen das Bild, sich perfekt in die volle Breite des Frames zu strecken!
                    className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100" 
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              ) : (
                <div className="w-full py-3 px-4 rounded-xl border border-slate-900/60 bg-slate-900/10 text-slate-500 italic mt-1 font-sans">
                  Keine grafische Bühnenskizze hinterlegt. Es gilt die nachfolgende Textaufstellung.
                </div>
              )}
            </div>

            {/* Räumliche Textbeschreibung */}
            <div>
              <span className="text-slate-500 font-bold block print:text-slate-700">Räumliche Positionierung:</span>
              <span className="text-slate-400 mt-1 block print:text-slate-800">{localFields?.bandaufstellung || userData?.bandaufstellung || "Drums Center, Lead-Vocals vorne Mitte."}</span>
            </div>

            {/* Backline Anzeige */}
            <div>
              <span className="text-slate-500 font-bold block print:text-slate-700">Mitgebrachte Backline & Amps:</span>
              <span className="text-slate-400 mt-1 block print:text-slate-800">{localFields?.backline || userData?.backline || "Keine Amps/Drums spezifiziert"}</span>
            </div>

          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 💳 SEKTION 5.5: FINANCIAL BANK-CLEARING & SMART INPLACE-EDIT              */}
      {/* ========================================================================= */}
      <div className="bg-slate-950/20 border border-slate-900 rounded-3xl p-5 shadow-xl space-y-3 relative overflow-hidden print:border-slate-300 print:bg-white print:text-black">
        <div className="flex justify-between items-center border-b border-slate-950 pb-2 print:border-slate-200">
          <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5 print:text-purple-700">
            <Landmark className="w-4 h-4 print:hidden" /> // Bank-Clearing & Abrechnungsdaten
          </h4>
          {/* 🔒 SECURITY-GATE BANKING: Abrechnungsschutz aktiv! */}
          {isMyOwnProfile && (
            <button 
              type="button" 
              onClick={() => setEditSection(editSection === 'banking' ? null : 'banking')}
              className="text-[9px] text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 uppercase font-black cursor-pointer print:hidden"
            >
              <Edit3 className="w-3 h-3" /> {editSection === 'banking' ? 'Close' : 'Edit Finance'}
            </button>
          )}
        </div>

        {editSection === 'banking' && isMyOwnProfile ? (
          <div className="bg-slate-950 border border-slate-900 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
            <div className="space-y-1"><label className="text-[9px] text-slate-500 uppercase">Bankname</label><input type="text" name="bank_name" value={localFields.bank_name || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white" /></div>
            <div className="space-y-1"><label className="text-[9px] text-slate-500 uppercase">IBAN</label><input type="text" name="bank_iban" value={localFields.bank_iban || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white" /></div>
            <div className="space-y-1"><label className="text-[9px] text-slate-500 uppercase">BIC</label><input type="text" name="bank_bic" value={localFields.bank_bic || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white" /></div>
            <div className="space-y-1"><label className="text-[9px] text-slate-500 uppercase">Steuernummer / USt-ID</label><input type="text" name="tax_id" value={localFields.tax_id || ''} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white" /></div>
            <div className="space-y-1 sm:col-span-2"><label className="text-[9px] text-slate-500 uppercase">PayPal.Me Link</label><input type="text" name="paypal_link" value={localFields.paypal_link || ''} onChange={handleInplaceChange} className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1.5 text-white" /></div>
            <button type="button" onClick={handleInplaceSave} className="sm:col-span-2 bg-purple-500 text-white font-black h-8 rounded-xl uppercase tracking-wider text-[10px] mt-2 cursor-pointer">Abrechnung einbrennen ✓</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[10px] pt-1 print:text-black">
              <div className="space-y-1"><p className="text-slate-500 uppercase font-bold text-[9px] tracking-wider print:text-slate-400">Bankinstitut:</p>{renderField('bank_name', userData?.bank_name)}</div>
              <div className="space-y-1"><p className="text-slate-500 uppercase font-bold text-[9px] tracking-wider print:text-slate-400">IBAN Kontonummer:</p>{renderField('bank_iban', userData?.bank_iban)}</div>
              <div className="space-y-1"><p className="text-slate-500 uppercase font-bold text-[9px] tracking-wider print:text-slate-400">BIC Routing-Code:</p>{renderField('bank_bic', userData?.bank_bic)}</div>
              <div className="space-y-1"><p className="text-slate-500 uppercase font-bold text-[9px] tracking-wider print:text-slate-400">Umsatzsteuer-ID / Steuernummer:</p>{renderField('tax_id', userData?.tax_id)}</div>
            </div>
            {userData?.paypal_link && (
              <div className="pt-3 border-t border-slate-950 mt-2 print:border-slate-100">
                <div className="bg-purple-950/10 border border-purple-500/10 p-3 rounded-2xl flex justify-between items-center gap-4 print:bg-slate-50 print:border-slate-200">
                  <span className="text-white font-bold text-[11px] print:text-black">PayPal.Me Blitz-Gage gekoppelt</span>
                  <div className="text-right">{renderField('paypal_link', userData?.paypal_link)}</div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 🎫 SEKTION 5.7: DIGITAL IDENTITY MEMBERCARD (DEINE VISITENKARTE)          */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl print:border-slate-300 print:bg-white print:text-black">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[8px] text-cyan-400 font-bold uppercase tracking-widest block">// OFFICIAL PORTFOLIO CARD</span>
          <h4 className="text-xs font-black text-white uppercase print:text-black">Gigsda Pass & Reflink-Zentrale</h4>
          <p className="text-slate-400 text-[10px] font-sans max-w-sm">Nutze deine verifizierte Mitgliedskarte, um dich via QR-Code oder Direktlink bei Agenturen zu bewerben.</p>
          <div className="pt-2 text-[9px] text-cyan-400 font-bold font-mono select-all">
            🔗 Link: https://gigsda.com{userData?.name ? userData.name.toLowerCase().replace(/\s+/g, '-') : 'user'}
          </div>
        </div>
        
        <div className="w-52 h-28 bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 border border-slate-800 rounded-2xl p-3 flex justify-between items-center relative overflow-hidden shrink-0 shadow-2xl print:border-slate-400 print:from-slate-50 print:to-white">
          <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex flex-col justify-between h-full space-y-1">
            <div>
              <span className="text-[7px] text-cyan-400 block font-black font-mono tracking-widest">// GIGSDA PASS</span>
              <span className="text-white font-black text-[11px] block truncate max-w-[120px] print:text-black">{userData?.project_name || userData?.name}</span>
            </div>
            <span className="text-[8px] text-slate-500 block font-mono">ID: #{userData?.id || "0000"}</span>
          </div>
          <div className="w-16 h-16 bg-white border-2 border-cyan-400/40 p-1 rounded-xl flex flex-wrap content-center gap-0.5 justify-center shrink-0 shadow-lg print:border-slate-400">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className={`w-2 h-2 ${i % 3 === 0 || i % 7 === 0 ? 'bg-black' : 'bg-slate-200'} rounded-[1px]`} />
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🟢 SEKTION 6: FINALE PORTFOLIO-STEUERLEISTE (PRINT ENGINE ACTIVATE)      */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2 print:hidden">
        <button 
          type="button" 
          onClick={() => window.print()}
          className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-slate-950 font-black h-11 rounded-2xl text-xs uppercase tracking-wider transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-xl flex items-center justify-center gap-1.5"
        >
          📄 Portfolio-Bewerbung drucken (PDF)
        </button>
        <button 
          type="button" 
          onClick={onBack}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold h-11 rounded-2xl px-6 text-xs uppercase transition-colors cursor-pointer"
        >
          Zurück zum Cockpit
        </button>
      </div>

    </div>
  );
}

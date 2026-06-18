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
  // ⭐ PRÜFT, OB DIESER KÜNSTLER BEREITS EIN FAVORIT IST
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const savedFavs = JSON.parse(localStorage.getItem('gigsda_favorites') || '[]');
      const found = savedFavs.some(f => f && f.name && f.name.toLowerCase() === (ticketName || "").toLowerCase());
      setIsFavorite(found);
    } catch (e) { console.error(e); }
  }, [ticketName]);

  // ⚡ TOGGLE-FUNKTION: KÜNSTLER-FAVORIT
  const handleToggleFavorite = () => {
    try {
      let savedFavs = JSON.parse(localStorage.getItem('gigsda_favorites') || '[]');
      
      if (isFavorite) {
        savedFavs = savedFavs.filter(f => f && f.name && f.name.toLowerCase() !== ticketName.toLowerCase());
        setIsFavorite(false);
        alert("Künstler aus den B2B-Favoriten entfernt! ☆");
      } else {
        const newFav = {
          name: ticketName,
          role: 'Künstler',
          city: userData?.city || 'Nicht hinterlegt',
          avatarUrl: userData?.avatarUrl || '',
          note: 'Gespeicherter Live-Act Option'
        };
        savedFavs.push(newFav);
        setIsFavorite(true);
        alert("Künstler erfolgreich zu den Favoriten hinzugefügt! ★");
      }
      localStorage.setItem('gigsda_favorites', JSON.stringify(savedFavs));
    } catch (e) { console.error("Fehler beim Favoriten-Toggle:", e); }
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
      
      // 🔒 DIE UNZERSTÖRBARE CORE-WEICHE: Initialisiert ein Ersatzprofil sofort mit ALLEN Amazon-Variablen!
      const freshData = currentProj || { 
        id: "GIGS-" + Math.floor(Math.random() * 9000 + 1000), 
        name: ticketName, 
        project_name: '', 
        vorname: '', 
        nachname: '', 
        website: '', 
        city: '', 
        genre: '',
        role: 'Künstler'
      };
      
      setUserData(freshData);
      
      // Sichert das reaktive Laden und fängt das Avatar-Bild perfekt ab
      setLocalFields({
        ...freshData,
        project_name: freshData.project_name || '',
        vorname: freshData.vorname || '',
        nachname: freshData.nachname || '',
        website: freshData.website || '',
        city: freshData.city || freshData.location || '',
        avatarUrl: freshData.avatarUrl || '',
        bannerUrl: freshData.bannerUrl || ''
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
  
  // 🎛️ MANUELLE PFEIL-STEUERUNG (Ergänzt Daniels Automatik)
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };


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
    <div>
      
      {/* ========================================================================= */}
      {/* HEADER & ASSISTENT                                                        */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-purple-950/20 to-slate-900/20 border border-purple-500/10 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[8px] text-purple-400 font-bold uppercase tracking-widest block">// BACKSTAGE-PORTFOLIO CONTROLLER</span>
            <h3 className="text-sm font-black text-white uppercase tracking-tight mt-0.5">⭐ Gigsda All-In-One Board</h3>
          </div>
          <button type="button" onClick={onBack} className="bg-slate-900 border border-slate-800 text-white px-3 py-1 rounded-xl text-[10px] font-bold cursor-pointer print:hidden">‹ Dashboard</button>
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
        {/* ‹ LINKER PFEIL (Schaltet manuell zurück) */}
        <button 
          type="button"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-400 w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer font-black text-sm shadow-xl"
        >
          ‹
        </button>

        {/* › RECHTER PFEIL (Schaltet manuell weiter) */}
        <button 
          type="button"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-400 w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer font-black text-sm shadow-xl"
        >
          ›
        </button>

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


    </div>
  );
}

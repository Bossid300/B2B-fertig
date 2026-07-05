import React, { useState } from 'react';
import { Search, MapPin, Ticket, Shield, Sliders, Calendar, ArrowRight, CheckCircle2, ChevronDown, Users, Layers, Award } from 'lucide-react';
import GuestPass from './GuestPass';
import Roadmap from "./components/Roadmap";
// 📡 Daniels originale Testdaten (Bands, Termine und geile Locations)
const initialGigs = [
  { id: 1, title: "Band", date: "27.08.2026", location: "Bambug", img: "/2026/profiles/Jud-Herbert/banner.jpg" },
  { id: 2, title: "Band", date: "23.09.2026", location: "Bombug", img: "/2026/profiles/Jud-Herbert/banner.jpg" },
  { id: 3, title: "Band", date: "27.08.2026", location: "Exrnwkug", img: "/2026/profiles/Jud-Herbert/banner.jpg" }
];

export default function LandingPage({ onEnterCenter, onCreateAccount }) {
  // Zustand für den interaktiven Gast-Pass auf der rechten Seite
  const [guestName, setGuestName] = useState('');

  const handleCreateAccountWithPassName = (e) => {
    e.preventDefault();
    // Übergibt den eingetippten Namen direkt an die Registrierungs-Zentrale
    if (typeof onCreateAccount === 'function') {
      onCreateAccount(guestName);
    }
  };
  const [searchQuery, setSearchQuery] = useState('');

const [videoMuted, setVideoMuted] = useState(true);

  return (
    <div className="w-full min-h-screen bg-[#070913] text-white font-sans relative overflow-x-hidden antialiased pb-16">
      
      {/* 🌌 DAS REAKTIVE LIVE-KONZERT HINTERGRUNDBILD (UNZERSTÖRBAR VERANKERT!) */}
      <div 
        className="absolute inset-0 w-full h-[550px] md:h-[650px] bg-cover bg-center bg-no-repeat pointer-events-none opacity-40 select-none z-0 mix-blend-screen"
        style={{ 
          // Holt das Bild direkt aus eurem public/logos/ oder assets-Ordner, falls lokal abgelegt. 
          // Hier als absolut sicherer, kristallklarer Live-Konzert-Stream eingesetzt!
          backgroundImage: `url('/2026/profiles/vibrant-concert-scene-stockcake.jpg')` 
        }}
      >
        {/* SCHWARZE VERLAUFS-BLENDE NACH UNTEN (Verhindert harte Kanten bei den Kacheln!) */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070913]/60 to-[#070913]"></div>
      </div>
      
      {/* 🌌 HERO-SECTION MIT GIGANTISCHEM LIVE-KONZERT HINTERGRUNDBILD */}
      <div className="relative w-full pt-20 pb-16 px-4 md:px-8 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 z-10">
        
        {/* LINKE TEXT-SPALTE & SCHALTZENTRALE */}
        <div className="w-full md:w-7/12 text-left space-y-6 z-20">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight select-none">
              FINDE DEINEN VIBE.<br />
              <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">ERLEBE LIVE-MUSIK.</span>
            </h1>
            <p className="text-sm md:text-base text-slate-300 font-medium tracking-wide">
              Die größte Gig-Datenbank für deine Region.
            </p>
          </div>

          {/* 🔍 UNZERSTÖRBARE NEON-GRADIENT SUCHLEISTE */}
          {/* INTERAKTIVE GEOSUCHE MIT AUTOMATISCHEM GEORADAR */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const city = formData.get('geocity') || 'Braunau';
              if (typeof onEnterCenter === 'function') {
                onEnterCenter(city); 
              }
            }}
            className="pt-4 max-w-md"
          >
            <div className="space-y-2">
              <label className="text-[12px] text-slate-500 uppercase tracking-widest block font-mono flex justify-between items-center">
                <span>// Regional-Radar Status</span>
                <span id="radar-status" className="text-cyan-400">Ready</span>
              </label>
              
              <div className="w-full max-w-3xl mx-auto p-[2px] bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.15)] mb-8 font-mono">
                <div className="w-full bg-[#0b0f19] rounded-[14px] p-1.5 flex items-center justify-between gap-2 relative">
                  {/* Das klickbare Ortungs-Icon für den Gast */}
                  <button
                    type="button"
                    title="Standort automatisch ermitteln"
                    onClick={() => {
                      const statusLabel = document.getElementById('radar-status');
                      const inputField = document.getElementsByName('geocity')[0];
                      
                      if (!navigator.geolocation) {
                        if (statusLabel) statusLabel.innerText = "Nicht unterstützt";
                        return;
                      }

                      if (statusLabel) statusLabel.innerHTML = "📡 Scanne GPS...";
                      
                      navigator.geolocation.getCurrentPosition(
                        async (position) => {
                          try {
                            const lat = position.coords.latitude;
                            const lon = position.coords.longitude;
                            
                            // Holt den echten Stadtnamen rückwärts aus den Koordinaten (Reverse Geocoding)
                            const response = await fetch(`https://openstreetmap.org{lat}&lon=${lon}`);
                            const data = await response.json();
                            
                            // Sucht nach Stadt, Dorf oder Gemeinde im Datenpaket
                            const detectedCity = data.address.city || data.address.town || data.address.village || data.address.suburb || "Braunau";
                            
                            if (inputField) inputField.value = detectedCity;
                            if (statusLabel) statusLabel.innerText = "✓ Geortet: " + detectedCity;
                          } catch (err) {
                            if (statusLabel) statusLabel.innerText = "API Fehler";
                            if (inputField) inputField.value = "Braunau";
                          }
                        },
                        () => {
                          if (statusLabel) statusLabel.innerText = "Zugriff verweigert";
                          if (inputField) inputField.value = "Braunau";
                        }
                      );
                    }}
                    className="absolute left-3 top-2.5 text-cyan-500/60 hover:text-cyan-400 transition-colors cursor-pointer bg-transparent border-none p-0 z-10"
                  >
                    <MapPin className="w-4 h-4 animate-pulse" />
                  </button>
                  
                  <input
                    type="text"
                    name="geocity"
                    placeholder="Stadt eingeben oder auf den Pin klicken ➔"
                    required
                    className="w-full bg-transparent pl-8 pr-2 py-2 text-sm text-slate-300 placeholder-slate-600 outline-none border-none focus:ring-0 font-medium tracking-wide"
                  />
                  <button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 text-slate-950 font-mono font-black px-4 h-9 rounded-xl text-[14px] text-white uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0 flex items-center justify-center"
                  >
                  Suchen
                  </button>
                </div>
              </div>
            </div>
          </form>

        </div>

        {/* RECHTE DEKO-AURA (HÄLT DAS DESIGN REAKTIV RECHTS BALANCIERT) */}
        <div className="hidden md:block w-5/12 h-64 bg-gradient-to-tr from-purple-600/10 to-pink-500/5 rounded-3xl border border-slate-900/40 backdrop-blur-xs relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 rounded-[32px] overflow-hidden border border-cyan-500/20 bg-black/20 backdrop-blur-xl">

              <video
                autoPlay
                muted={videoMuted}
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source
                  src="/2026/videos/gigsda_video_stahlhammer.mp4"
                  type="video/mp4"
                />
              </video>

              <button
                onClick={() => setVideoMuted(!videoMuted)}
                className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/40 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono uppercase hover:bg-cyan-500/10"
              >
                {videoMuted ? "🔇 Ton" : "🔊 Ton"}
              </button>

              <div className="absolute bottom-3 left-4 text-[12px] font-mono text-cyan-400 tracking-widest uppercase">
                // Live Concert Feed Active
              </div>

            </div>
          <div className="absolute bottom-4 left-4 text-left font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-widest animate-pulse">// LIVE CONCERT FEED CHANNEL active</div>
        </div>

      </div>

      {/* 📊 DIE DREI NEON-BAND-KACHELN (1-ZU-1 DESIGNEFFECT AUS DEM SCREENSHOT!) */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-5 mb-16 z-10 relative">
        {initialGigs.map((gig) => (
          <div 
            key={gig.id}
            className="p-[2px] bg-gradient-to-r from-cyan-500/80 to-pink-500/80 rounded-2xl shadow-lg hover:shadow-[0_0_20px_rgba(236,72,153,0.15)] transition-all duration-300 transform hover:scale-[1.01] flex flex-col"
          >
            <div className="bg-[#0b0f19] rounded-[14px] p-4 flex items-center gap-4 text-left h-full">
              {/* BAND-FOTO */}
              <div className="w-16 h-16 rounded-xl border border-slate-800 overflow-hidden shrink-0 relative bg-slate-950">
                <img src={gig.img} alt={gig.title} className="w-full h-full object-cover filter brightness-90 contrast-110" />
              </div>
              {/* DETAILS */}
              <div className="space-y-0.5 min-w-0 font-sans">
                <span className="text-[9px] text-slate-400 font-bold block">Datum: {gig.date}</span>
                <h3 className="text-base font-black text-white uppercase tracking-wide truncate">{gig.title}</h3>
                <span className="text-[10px] text-slate-400 font-medium block truncate">Location: <span className="text-slate-300 font-bold">{gig.location}</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🛠️ SPERREN-SEKTION: "SO FUNKTIONIERT ES" */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-6 border-t border-slate-900/60 text-left font-mono z-10 relative">
        <h2 className="text-sm font-black text-white uppercase tracking-widest mb-6">// SO FUNKTIONIERT ES</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm font-bold">
          
          {/* STEP 1 */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => typeof onNavigate === 'function' && onNavigate('search')}>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 group-hover:border-cyan-400 transition-all text-base shadow-sm">📍</div>
            <span className="text-slate-300 group-hover:text-white transition-colors uppercase tracking-wide">Standort wählen</span>
          </div>

          {/* STEP 2 */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => typeof onNavigate === 'function' && onNavigate('search')}>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20 group-hover:border-purple-400 transition-all text-base shadow-sm">🔍</div>
            <span className="text-slate-300 group-hover:text-white transition-colors uppercase tracking-wide">Gig finden</span>
          </div>

          {/* STEP 3 */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => typeof onNavigate === 'function' && onNavigate('register')}>
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:bg-pink-500/20 group-hover:border-pink-400 transition-all text-base shadow-sm">👥</div>
            <span className="text-slate-300 group-hover:text-white transition-colors uppercase tracking-wide">Dabei sein</span>
          </div>

        </div>

              <section>
                {/* 🌌 ZENTRIERTES CYBERPUNK-LOGO-ZENTRUM */}
                <div className="w-full flex flex-col items-center justify-center my-12 md:my-16 font-mono select-none pointer-events-none">
                {/* DER LEUCHTENDE HINTERGRUND-AURA-RING */}
                <div className="relative flex items-center justify-center">
                  {/* 📡 PULSIERENDE RADAR-NEON-WELLE IM HINTERGRUND */}
                  <span className="animate-ping absolute inline-flex h-24 w-24 md:h-36 md:w-36 rounded-full bg-cyan-500/10 border border-cyan-500/20 opacity-40"></span>
                  {/* DAS ECHTE LOGO (Frisch aus eurem Assets-Ordner!) */}
                  <img 
                    src="/2026/logos/gigsda-logo-1.svg" 
                    alt="Gigsda Portal Logo" 
                    className="h-36 md:h-48 w-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                    onError={(e) => {
                      // 🚨 SECURITY-FALLBACK: Falls Daniels Pfad anders heißt, zeichnet der Code ein edles SVG-Ersatz-Icon, damit nichts abstürzt!
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentNode.insertAdjacentHTML('beforeend', `
                        <div class="h-16 w-16 md:h-20 md:w-20 bg-gradient-to-tr from-cyan-500 to-pink-500 rounded-2xl flex items-center justify-center font-sans font-black text-xl text-white border border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.3)] animate-pulse">
                          G
                        </div>
                      `);
                    }}
                  />
                  </div>
                  {/* REAKTIVE DESIGN-TRENNDOTTS */}
                  <div className="flex gap-1.5 mt-4 opacity-20">
                    <span className="h-1 w-1 bg-cyan-400 rounded-full"></span>
                    <span className="h-1 w-6 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full"></span>
                    <span className="h-1 w-1 bg-pink-500 rounded-full"></span>
                  </div>
                </div>
              </section>

              {/* Building Gigsda In Public */}
              <div className="max-w-4xl mx-auto">
                <Roadmap />
              </div>
              
              <section>
              {/* ANKER-VORSCHAU-PFEIL */}
              <div className="flex justify-center text-slate-600 animate-bounce">
                <div className="text-center font-mono text-[9px] uppercase tracking-widest">
                  für alle Besucher<br/>
                  <ChevronDown className="w-4 h-4 mx-auto mt-1 text-cyan-500/60" />
                </div>
              </div>
              </section>

              {/* ========================================================================= */}
              {/* SEKTION 4: DAS KÜNSTLER- & PLANER-VERSPRECHEN                              */}
              {/* ========================================================================= */}
              <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                
                {/* Block 1: Die Bühne für Künstler */}
                <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 space-y-4 flex flex-col justify-between hover:border-slate-800 transition-all shadow-xl">
                  <div className="space-y-3">
                    <div className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-950 pb-2">
                      <Award className="w-4 h-4" /> Die Bühne für Künstler!
                    </div>
                    <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
                      In erster Linie wollen wir Brücken erstellen, um Bands oder Künstler zu unterstützen, damit Ihr Mehrwert wieder ansteigt. Einmal das Profil informativ ausgefüllt, und jeder Veranstalter sieht auf einen Blick, welche Anforderungen ihr habt (Technical Rider).
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-500 italic font-sans leading-relaxed pt-2">
                    „Durch gigsda bekommen semiprofessionelle Künstler schneller die Chance auf bessere Gigs, mehr Gage und mehr Fans.“
                  </p>
                </div>
        
                {/* Block 2: Eventplanung */}
                <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 space-y-4 flex flex-col justify-between hover:border-slate-800 transition-all shadow-xl">
                  <div className="space-y-3">
                    <div className="text-xs font-black text-purple-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-950 pb-2">
                      <Layers className="w-4 h-4" /> Eventplanung!
                    </div>
                    <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
                      Durch einige Tools schaffen wir neue Wege, um einem Künstler dabei zu helfen, sein Ziel schneller durch vereinfachte Planung zu erreichen. All dies mit geringstem Zeitaufwand, damit er sich wieder auf seine eigentliche Kunst konzentrieren kann.
                    </p>
                  </div>
                  <div className="bg-slate-950/80 border border-slate-900 rounded-xl p-3 text-[10px] text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                    <span>Organisiere deine Projekte mit dem Schritt-für-Schritt-System.</span>
                  </div>
                </div>
              </section>
              
              {/* ========================================================================= */}
              {/* SEKTION 3: DAS MANIFEST FÜR MITGLIEDER (DAS CORE-ÖKOSYSTEM)               */}
              {/* ========================================================================= */}
              <section className="max-w-4xl mx-auto space-y-10">
                <div className="text-center max-w-xl mx-auto space-y-3">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full inline-block">// Das Gigsda Netzwerk</span>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-none">Fans, Künstler, Veranstalter, Verleiher, Techniker, Locations, Catering und viele mehr</h2>
                  <p className="text-slate-500 text-xs font-sans leading-relaxed">
                    „gigsda“ schafft einfache Wege, um die Planung für eine Veranstaltung zu vollziehen. Du musst nicht zwingend ein Veranstalter sein, um ein Projekt zu starten.
                  </p>
                </div>

                {/* Das 3-Spalten-Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Card A */}
                  <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-5 space-y-3 flex flex-col justify-between hover:border-slate-800 transition-all">
                    <div className="space-y-2">
                      <div className="text-cyan-400 font-bold text-[10px] uppercase border-b border-slate-950/40 pb-1.5">// EIGENSTÄNDIGKEIT</div>
                      <h4 className="text-sm font-black text-white uppercase tracking-tight">Wähle Deine Bühne</h4>
                      <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
                        Hier bist du in der Lage, dein Event selbst zu organisieren. Suche einen Künstler, finde Veranstalter, Techniker oder Locations. Alle, die du auf, hinter und vor der Bühne brauchst, um durchzustarten.
                      </p>
                    </div>
                    <span className="text-[9px] text-slate-600 font-mono tracking-widest mt-4 block">#NETZWERK</span>
                  </div>

                  {/* Card B */}
                  <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-5 space-y-3 flex flex-col justify-between hover:border-slate-800 transition-all">
                    <div className="space-y-2">
                      <div className="text-purple-400 font-bold text-[10px] uppercase border-b border-slate-950/40 pb-1.5">// OPTIMIERUNG</div>
                      <h4 className="text-sm font-black text-white uppercase tracking-tight">Mit wenigen Klicks zum Gig</h4>
                      <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
                        Minimiere lange Wartezeiten mit unseren Tools, zugeschnitten auf beste Erfolgschancen und Effizienz. Hier wirst du gefunden und machst dich sichtbar für Veranstalter und Fans.
                      </p>
                    </div>
                    <span className="text-[9px] text-slate-600 font-mono tracking-widest mt-4 block">#EFFIZIENZ</span>
                  </div>

                  {/* Card C */}
                  <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-5 space-y-3 flex flex-col justify-between hover:border-slate-800 transition-all">
                    <div className="space-y-2">
                      <div className="text-emerald-400 font-bold text-[10px] uppercase border-b border-slate-950/40 pb-1.5">// ZUSAGE-DEAL</div>
                      <h4 className="text-sm font-black text-white uppercase tracking-tight">Bring deinen Gig zum Abschluss</h4>
                      <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
                        Durch interaktive Vernetzung und Kommunikation von Künstlern, Veranstaltern, Locations, Technikern und Fans ist gigsda die Lösung, um eigenständige Gigs schnellstmöglich zum Abschluss zu bringen.
                      </p>
                    </div>
                    <span className="text-[9px] text-slate-600 font-mono tracking-widest mt-4 block">#ZUSAGE_DEAL</span>
                  </div>

                </div>
              </section>
              
        </div>        
        
                {/* 🎫 DEIN NEUER GAST-PASS (PERFEKT WEITER UNTEN PLATZIERT) */}
                <GuestPass onEnterCenter={onEnterCenter} />



        {/* ========================================================================= */}
        {/* SEKTION 5: DAS VIERTEILIGE PROFI-FOOTER LAYOUT                            */}
        {/* ========================================================================= */}
        <footer className="w-full border-t border-slate-900 bg-slate-950 pt-12 pb-6 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-[11px] font-sans text-slate-500">
            
            {/* Spalte 1 */}
            <div className="space-y-2.5">
              <h5 className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest">// RECHTLICHES</h5>
              <ul className="space-y-1.5">
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-cyan-400 transition-colors">Nutzungsbedingungen</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-cyan-400 transition-colors">Datenschutzerklärung</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-cyan-400 transition-colors">Impressum</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-cyan-400 transition-colors">AGB</a></li>
              </ul>
            </div>

            {/* Spalte 2 */}
            <div className="space-y-2.5">
              <h5 className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest">// NETZWERK & INFOS</h5>
              <ul className="space-y-1.5">
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-cyan-400 transition-colors">Was ist gigsda?</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-cyan-400 transition-colors">Events & Locations</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-cyan-400 transition-colors">Sucher-Protokoll</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-cyan-400 transition-colors">Tutorials</a></li>
              </ul>
            </div>

            {/* Spalte 3 */}
            <div className="space-y-2.5">
              <h5 className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest">// SICHERHEIT</h5>
              <ul className="space-y-1.5">
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-cyan-400 transition-colors">Richtlinien & Sicherheit</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-cyan-400 transition-colors">Zahlungsarten</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-cyan-400 transition-colors">Treuhand-Schutz</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-cyan-400 transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Spalte 4 */}
            <div className="space-y-2.5">
              <h5 className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest">// GIGDATA GMBH</h5>
              <ul className="space-y-1.5">
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-cyan-400 transition-colors">Über uns</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-cyan-400 transition-colors">Kontakt</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-cyan-400 transition-colors">Karriere</a></li>
                <li className="text-[9px] font-mono text-slate-700 pt-2">© 2026 GIGDATA GmbH</li>
              </ul>
            </div>
          </div>
        </footer>


    </div>
  );
}

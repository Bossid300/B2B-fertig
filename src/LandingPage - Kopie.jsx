import React, { useState } from 'react';
import { Search, MapPin, Ticket, Shield, Sliders, Calendar, ArrowRight, CheckCircle2, ChevronDown, Users, Layers, Award } from 'lucide-react';
import GuestPass from './GuestPass';

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

  return (
    <div className="w-full text-slate-300 font-mono text-xs selection:bg-cyan-500 selection:text-slate-950 animate-fade-in space-y-24 pb-12">
      





















      {/* ========================================================================= */}
      {/* SEKTION 1: THE HERO EINSTIEG (DEIN LETZTER STAND + TICKET-PASS RECHTS)    */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto space-y-8 bg-slate-900/20 border border-slate-900/60 rounded-3xl p-8 shadow-xl">
        {/* Linke Spalte: Slogans & Direktstarter */}
        <div className="flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto py-12">
          <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest px-3 py-1 bg-cyan-950/40 border border-cyan-500/20 rounded-full inline-block">
            // DAS LIVE-MUSIK ÖKOSYSTEM
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
            Hier sind Gigs für <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-black">alle</span> da.
          </h1>
          <p className="text-slate-400 text-xs font-sans leading-relaxed max-w-md">
            Gigsda ist die Lösung für alle Beteiligten, um schnellstmögliche, eigenständige Gigs zum Abschluss zu bringen. Organisiere deine eigenen Projekte mit dem Schritt-für-Schritt-System.
          </p>
          
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
        
        <section class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-y border-slate-900 py-8 bg-slate-900/10 rounded-3xl px-4">
        <div><p class="text-3xl font-black text-white tracking-tight">92</p><p class="text-[10px] text-slate-500 font-mono uppercase mt-1 tracking-wider">Künftige Termine</p>
        </div><div><p class="text-3xl font-black text-white tracking-tight">47</p><p class="text-[10px] text-slate-500 font-mono uppercase mt-1 tracking-wider">Offene Gesuche</p>
        </div><div><p class="text-3xl font-black text-white tracking-tight">22</p><p class="text-[10px] text-slate-500 font-mono uppercase mt-1 tracking-wider">Vergangene Events</p>
        </div><div><p class="text-3xl font-black text-white tracking-tight">100%</p><p class="text-[10px] text-slate-500 font-mono uppercase mt-1 tracking-wider">Self-Organization</p>
        </div>
        </section>

      </section>

      {/* 🌌 ZENTRIERTES CYBERPUNK-LOGO-ZENTRUM */}
      <div className="w-full flex flex-col items-center justify-center my-12 md:my-16 font-mono select-none pointer-events-none">
        
        {/* DER LEUCHTENDE HINTERGRUND-AURA-RING */}
        <div className="relative flex items-center justify-center">
          
          {/* 📡 PULSIERENDE RADAR-NEON-WELLE IM HINTERGRUND */}
          <span className="animate-ping absolute inline-flex h-24 w-24 md:h-36 md:w-36 rounded-full bg-cyan-500/10 border border-cyan-500/20 opacity-40"></span>
          
          {/* DAS ECHTE LOGO (Frisch aus eurem Assets-Ordner!) */}
          <img 
            src="/public/logos/gigsda-logo-1.svg" 
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



      {/* ========================================================================= */}
      {/* SEKTION 2: DER BESUCHER-FAHRPLAN ("So einfach geht es!")                   */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto space-y-8 bg-slate-900/20 border border-slate-900/60 rounded-3xl p-8 shadow-xl">
        <div className="text-center space-y-1">
          <span className="text-[9px] text-slate-500 uppercase tracking-widest">// So funktioniert gigsda.com</span>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">So einfach geht es!</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 relative">
          
          {/* Schritt 1 */}
          <div className="bg-slate-950/40 border border-slate-900 p-5 rounded-2xl text-center space-y-3 relative group hover:border-slate-800 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400 font-bold text-sm shadow-md">01</div>
            <h4 className="text-white font-bold text-xs uppercase">// Gib Deinen Standort an</h4>
            <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
              Gib Deine Adresse ein oder lasse uns Deine Position bestimmen, um Partner in der Nähe zu finden.
            </p>
          </div>

          {/* Schritt 2 */}
          <div className="bg-slate-950/40 border border-slate-900 p-5 rounded-2xl text-center space-y-3 relative group hover:border-slate-800 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400 font-bold text-sm shadow-md">02</div>
            <h4 className="text-white font-bold text-xs uppercase">// Auswählen</h4>
            <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
              Informiere Dich direkt über die Veranstaltungen, Locations oder Künstler in Deiner Umgebung.
            </p>
          </div>

          {/* Schritt 3 */}
          <div className="bg-slate-950/40 border border-slate-900 p-5 rounded-2xl text-center space-y-3 relative group hover:border-slate-800 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400 font-bold text-sm shadow-md">03</div>
            <h4 className="text-white font-bold text-xs uppercase">// Ziehe Los</h4>
            <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
              Besuche Auftritte, checke ob es Tickets gibt oder Eintritt frei ist, und unterstütze Local Heroes.
            </p>
          </div>

        </div>
      </section>

      {/* ANKER-VORSCHAU-PFEIL MITGLIEDER */}
      <div className="flex justify-center text-slate-600 animate-bounce">
        <div className="text-center font-mono text-[9px] uppercase tracking-widest">
          für Mitglieder<br/>
          <ChevronDown className="w-4 h-4 mx-auto mt-1 text-purple-500/60" />
        </div>
      </div>

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

      <section>
      {/* ANKER-VORSCHAU-PFEIL */}
      <div className="flex justify-center text-slate-600 animate-bounce">
        <div className="text-center font-mono text-[9px] uppercase tracking-widest">
          für alle Besucher<br/>
          <ChevronDown className="w-4 h-4 mx-auto mt-1 text-cyan-500/60" />
        </div>
      </div>
        {/* 🎫 DEIN NEUER GAST-PASS (PERFEKT WEITER UNTEN PLATZIERT) */}
        <GuestPass onEnterCenter={onEnterCenter} />
        
      </section>

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

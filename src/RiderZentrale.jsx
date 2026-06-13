import React, { useState, useEffect } from 'react';

export default function RiderZentrale({ onBack, activeEvent }) {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('tech'); // tech | location | security
  const [userRole, setUserRole] = useState('Veranstalter');
  
  // 🎤 Geteilte Künstler-Daten
  const [artistRider, setArtistRider] = useState([]);
  const [liveStageplotUrl, setLiveStageplotUrl] = useState('');
  const [liveBandaufstellung, setLiveBandaufstellung] = useState('');
  const [liveBackline, setLiveBackline] = useState('');
  
  // 🏟️ Geteilte Location-Daten (Frisch aus Daniels echten DB-Variablen!)
  const [venueName, setVenueName] = useState('Keine Location zugewiesen');
  const [venueAudio, setVenueAudio] = useState('---');
  const [venueLight, setVenueLight] = useState('---');
  const [venueVideo, setVenueVideo] = useState('---');
  const [venueInternet, setVenueInternet] = useState('---');
  const [venueArea, setVenueArea] = useState('---');
  const [venueTerms, setVenueTerms] = useState('---');

  // 🛡️ Formular-States für Security
  const [guards, setGuards] = useState('');

  // 📡 1. HIGH-SPEED B2B-KOPPLUNG: ZIEHT KÜNSTLER- & LOCATION-DATEN LIVE
  useEffect(() => {
    try {
      const savedEvents = JSON.parse(localStorage.getItem('gigsda_events') || localStorage.getItem('gigsda_projects') || '[]');
      const targetId = activeEvent?.id || activeEvent?.eventId || activeEvent?._id;
      const matched = savedEvents.find(ev => ev && (ev.id === targetId || ev.eventId === targetId || ev._id === targetId));
      
      const profiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');
      const me = localStorage.getItem('gigsda_user_name') || '';
      const myProfile = profiles.find(p => p && p.name && p.name.toLowerCase() === me.toLowerCase());
      if (myProfile?.role) {
        setUserRole(myProfile.role);
      }

      if (matched) {
        setCurrentEvent(matched);
        setGuards(matched.securityPlan?.guardsCount || '4');

        const eventTitle = (matched.title || matched.name || '').toLowerCase();
        const eventCrew = matched.crew || [];

        // ==========================================
        // 🎤 BLOCK A: KÜNSTLER-PULL
        // ==========================================
        let targetArtistName = "";
        const foundByTitle = profiles.find(p => p && (p.role === 'Künstler' || p.role === 'Artist') && eventTitle.includes((p.name || '').toLowerCase()));
        if (foundByTitle) {
          targetArtistName = foundByTitle.name;
        } else {
          const crewArtist = eventCrew.find(m => m && (m.role === 'Künstler' || m.role === 'Artist'));
          if (crewArtist) targetArtistName = crewArtist.name;
        }

        const artistProfile = profiles.find(p => p && p.name && p.name.toLowerCase() === targetArtistName.toLowerCase());
        if (artistProfile) {
          setLiveStageplotUrl(artistProfile.stageplot_url || '');
          setLiveBandaufstellung(artistProfile.bandaufstellung || 'Keine Angabe');
          setLiveBackline(artistProfile.backline || 'Keine Angabe');

          const parsedChannels = [];
          for (let i = 1; i <= 10; i++) {
            const signalKey = `ch${i}_signal`;
            const micKey = `ch${i}_mic`;
            const standKey = artistProfile[`ch${i}_stand`] !== undefined ? `ch${i}_stand` : `ch${i}_tew`;
            if (artistProfile[signalKey] !== undefined) {
              parsedChannels.push({
                ch: i,
                source: artistProfile[signalKey] || 'Signal-Quelle',
                mic: artistProfile[micKey] || 'wet',
                stand: artistProfile[standKey] || 'wet'
              });
            }
          }
          if (parsedChannels.length > 0) setArtistRider(parsedChannels);
        }

        // ==========================================
        // 🏟️ BLOCK B: DYNAMISCHER LOCATION-PULL
        // ==========================================
        // Scant die Event-Crewliste nach einer Location/Halle (z. B. Arena Braunau)
        const crewLocation = eventCrew.find(m => m && (m.role === 'Location' || m.role === 'Halle' || m.role?.toLowerCase().includes('location')));
        let targetVenueName = crewLocation ? crewLocation.name : "";

        if (!targetVenueName) {
          const foundVenue = profiles.find(p => p && (p.role === 'Location' || p.role === 'Halle') && eventTitle.includes((p.name || '').toLowerCase()));
          if (foundVenue) targetVenueName = foundVenue.name;
        }

        const locationProfile = profiles.find(p => p && p.name && p.name.toLowerCase() === targetVenueName.toLowerCase());
        if (locationProfile) {
          setVenueName(locationProfile.name || 'Halle');
          setVenueAudio(locationProfile.audio_tech || 'Nicht spezifiziert');
          setVenueLight(locationProfile.light_tech || 'Nicht spezifiziert');
          setVenueVideo(locationProfile.video_tech || 'Nicht spezifiziert');
          setVenueInternet(locationProfile.internet_tech || 'Nicht spezifiziert');
          setVenueArea(locationProfile.room1_area || '---');
          setVenueTerms(locationProfile.terms_conditions || 'Keine Einschränkungen');
        } else {
          setVenueName(matched.location || matched.venue || 'Keine aktive Venue gelinkt');
          setVenueAudio('---'); setVenueLight('---'); setVenueVideo('---'); setVenueInternet('---'); setVenueArea('---'); setVenueTerms('---');
        }
      }
    } catch (e) { console.error("Fehler beim B2B-Pull:", e); }
  }, [activeEvent]);

  // 💾 2. MASTER-SPEICHERUNG
  const handleSaveSharedData = (customStatus = null) => {
    try {
      const savedEvents = JSON.parse(localStorage.getItem('gigsda_events') || localStorage.getItem('gigsda_projects') || '[]');
      const targetId = currentEvent?.id || currentEvent?.eventId || currentEvent?._id;
      const index = savedEvents.findIndex(ev => ev && (ev.id === targetId || ev.eventId === targetId || ev._id === targetId));

      if (index > -1) {
        savedEvents[index].riderSpecs = {
          patchplan: artistRider,
          stageplot_url: liveStageplotUrl,
          bandaufstellung: liveBandaufstellung,
          backline: liveBackline,
          status: customStatus || savedEvents[index].riderSpecs?.status || 'pending',
          lastModifiedBy: localStorage.getItem('gigsda_user_name') || 'B2B System'
        };
        savedEvents[index].securityPlan = { guardsCount: guards };
        localStorage.setItem('gigsda_events', JSON.stringify(savedEvents));
        localStorage.setItem('gigsda_projects', JSON.stringify(savedEvents));
        window.dispatchEvent(new CustomEvent('request-sent'));
        window.dispatchEvent(new CustomEvent('route-change'));
        alert(customStatus === 'verified' ? "🟩 RIDER & VENUE SPECS VERIFIZIERT!" : "💾 Daten synchronisiert!");
      }
    } catch (e) { console.error(e); }
  };

  if (!currentEvent) return <div className="p-6 text-xs text-slate-600 font-mono">// PIPELINE SYNC IN PROGRESS...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-950 border border-slate-900 rounded-3xl font-mono text-white shadow-2xl relative">
      
      {/* 🌌 COLLABORATIVE BANNER */}
      <div className="w-full rounded-2xl bg-gradient-to-r from-purple-500/10 via-cyan-500/5 to-slate-900 border border-slate-900/80 p-5 flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 relative overflow-hidden">
        <div className="space-y-1">
          <span className="text-[8px] bg-cyan-500/10 border border-cyan-500 text-cyan-400 font-bold px-2 py-0.5 rounded-md uppercase tracking-widest block w-max">
            📡 DANIEL-ENGINE DATEN-KOPPLUNG ACTIVATED // ROLE: {userRole.toUpperCase()}
          </span>
          <h1 className="text-base font-black uppercase text-white tracking-wide">🎛️ Rider- & Gewerke-Zentrale</h1>
        </div>
        <div className="bg-slate-950/80 border-2 border-cyan-500/40 px-5 py-2.5 rounded-2xl flex flex-col items-center justify-center min-w-[240px] shadow-[0_0_20px_rgba(6,182,212,0.08)]">
          <span className="text-[7px] text-cyan-400 font-black tracking-widest uppercase block">// AKTIVES TARGET-PROJEKT:</span>
          <span className="text-sm font-black text-white uppercase tracking-wider block pt-0.5 animate-pulse">
            🎬 {currentEvent.title || currentEvent.name || "UNBEKANNTES EVENT"}
          </span>
        </div>
        <div className="flex gap-2 shrink-0 w-full md:w-auto justify-end font-bold text-[9px] uppercase">
          <button onClick={onBack} className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl transition-all font-mono tracking-wider">‹ Dashboard</button>
          <button onClick={() => window.print()} className="px-4 py-2 bg-purple-500/10 border border-purple-500 hover:border-purple-400 text-purple-400 hover:text-white rounded-xl transition-all font-mono tracking-wider flex items-center gap-1.5">🖨️ PDF / PRINT</button>
        </div>
      </div>

      {/* TABS */}
      <div className="grid grid-cols-3 gap-2 pb-4 border-b border-slate-900 font-bold text-[8px] uppercase tracking-wider mb-6">
        <button onClick={() => setActiveTab('tech')} className={`py-2 rounded-xl border transition-all cursor-pointer text-center ${activeTab === 'tech' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500' : 'bg-slate-950 text-slate-500 border-slate-900 hover:border-slate-800'}`}>
          🎸 1. TECH-RIDER (ARTIST-PULL)
        </button>
        <button onClick={() => setActiveTab('location')} className={`py-2 rounded-xl border transition-all cursor-pointer text-center ${activeTab === 'location' ? 'bg-blue-500/20 text-blue-400 border-blue-500' : 'bg-slate-950 text-slate-500 border-slate-900 hover:border-slate-800'}`}>
          🏟️ 2. VENUE SPECIFICATIONS
        </button>
        <button onClick={() => setActiveTab('security')} className={`py-2 rounded-xl border transition-all cursor-pointer text-center ${activeTab === 'security' ? 'bg-red-500/20 text-red-400 border-red-500' : 'bg-slate-950 text-slate-500 border-slate-900 hover:border-slate-800'}`}>
          🛡️ 3. SECURITY CONCEPT
        </button>
      </div>

      {/* CONTENT */}
      <div className="space-y-4">
        
        {/* TAB 1: TECH RIDER */}
        {activeTab === 'tech' && (
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-900 pb-2">
              <span className="text-[8px] text-cyan-400 font-black tracking-widest uppercase">// GEZOGENE BAND-STAGESPECS (READ-ONLY)</span>
              <span className="text-[7px] text-slate-500 uppercase">STATUS: <span className={currentEvent.riderSpecs?.status === 'verified' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{currentEvent.riderSpecs?.status || 'pending'}</span></span>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              <div className="grid grid-cols-4 gap-2 items-center px-3 py-1 text-slate-600 font-bold text-[7px] uppercase tracking-wider font-mono">
                <div>Kanal</div><div>Signal-Quelle</div><div>Mikrofon / DI-Box</div><div>Stativ-Typ</div>
              </div>
              {artistRider.map((ch, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-2 items-center bg-slate-950/80 border border-slate-900 p-2.5 rounded-xl text-[10px] font-mono text-left">
                  <div className="text-cyan-400 font-black">CH {ch.ch.toString().padStart(2, '0')}</div>
                  <div className="text-white font-bold tracking-wide">{ch.source}</div>
                  <div className="text-cyan-400 font-medium bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-900 w-max">{ch.mic}</div>
                  <div className="text-slate-400 italic">{ch.stand}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-2 border-t border-slate-900 text-left">
              <span className="text-[7px] text-slate-500 uppercase font-black block tracking-widest">// PHYSISCHER BÜHNENAUFSTELLUNGSPLAN (STAGE-PLOT):</span>
              <div className="w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-900/80 relative p-2 flex justify-center items-center shadow-inner group">
                <img src={liveStageplotUrl || "https://unsplash.com"} alt="Stageplot Grid" className="w-full h-auto max-h-64 object-contain opacity-40 rounded-xl border border-slate-900/60 shadow-xl" />
                {!liveStageplotUrl && <div className="absolute inset-0 flex flex-col justify-center items-center font-mono text-[9px] text-center p-4 bg-slate-950/40"><span className="text-white font-black uppercase tracking-wide">Virtueller Bühnen-Layout-Auszug aktiv</span></div>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-900 text-[9px] text-left">
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-900"><span className="text-[6px] text-cyan-500 block uppercase font-black tracking-widest">// RÄUMLICHE POSITIONIERUNG:</span><p className="text-white mt-1 leading-relaxed font-bold">"{liveBandaufstellung}"</p></div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-900"><span className="text-[6px] text-cyan-500 block uppercase font-black tracking-widest">// MITGEBRACHTE BACKLINE:</span><p className="text-slate-300 mt-1 font-medium italic">"{liveBackline}"</p></div>
            </div>
            {(userRole === 'Techniker' || userRole === 'Veranstalter') && (
              <div className="pt-2 border-t border-slate-900 font-bold text-[9px] uppercase font-mono">
                <button onClick={() => handleSaveSharedData('verified')} className="w-full py-2.5 bg-emerald-500/10 border border-emerald-500/40 hover:border-emerald-500 text-emerald-400 hover:text-white rounded-xl transition-all font-bold animate-pulse">🟩 BACKSTAGE FREIGABE: RIDER REAKTIV ABSEGNEN ✓</button>
              </div>
            )}
          </div>
        )}

        {/* 🏟️ TAB 2: BRANDNEUES LOCATION-SPECIFICATIONS COCKPIT */}
        {activeTab === 'location' && (
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 space-y-4 animate-fade-in text-left">
            <div className="flex justify-between items-center border-b border-slate-900 pb-2">
              <span className="text-[8px] text-blue-400 font-black tracking-widest uppercase">// INFRASTRUKTUR & HOUSE TECH-SPECS (VENUE-PULL)</span>
              <span className="text-[9px] text-white font-black bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded-md uppercase">🏛️ {venueName.toUpperCase()}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950 border border-slate-900 p-4 rounded-2xl space-y-1 shadow-xl">
                <span className="text-[6px] text-blue-400 block font-black tracking-widest">// FLÄCHE / METRIK (ROOM AREA)</span>
                <div className="text-sm font-black text-white font-mono tracking-wide">{venueArea} m²</div>
                <p className="text-[8px] text-slate-500 uppercase pt-1 border-t border-slate-900/60">Hauptbereich (Room 1 Area).</p>
              </div>

              <div className="bg-slate-950 border border-slate-900 p-4 rounded-2xl space-y-1 shadow-xl">
                <span className="text-[6px] text-blue-400 block font-black tracking-widest">// NETZWERK / CONTEXT (INTERNET TECH)</span>
                <div className="text-xs font-bold text-cyan-400 font-mono tracking-wide bg-cyan-500/5 border border-cyan-500/20 px-2 py-1 rounded-lg w-max mt-1 uppercase">{venueInternet}</div>
                <p className="text-[8px] text-slate-500 uppercase pt-1 border-t border-slate-900/60">Konnektivität vor Ort.</p>
              </div>

              <div className="bg-slate-950 border border-slate-900 p-4 rounded-2xl space-y-1.5 shadow-xl sm:col-span-2">
                <span className="text-[6px] text-blue-400 block font-black tracking-widest">// SOUNDSYSTEM / AUDIO EQUIPMENT</span>
                <div className="text-xs font-black text-white uppercase">{venueAudio}</div>
                <p className="text-[8px] text-slate-400 font-medium italic bg-slate-900/40 border border-slate-900/60 p-2 rounded-xl mt-1">✓ Haus-PA und Mikrofone laut Location-Spezifikation.</p>
              </div>

              <div className="bg-slate-950 border border-slate-900 p-4 rounded-2xl space-y-1.5 shadow-xl sm:col-span-2">
                <span className="text-[6px] text-blue-400 block font-black tracking-widest">// LICHTTECHNIK & VIDEO HARDWARE MATRIX</span>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono leading-relaxed bg-slate-900/30 p-2 rounded-xl border border-slate-900">
                  <div><span className="text-slate-500 block text-[7px] font-black tracking-widest uppercase">// LIGHT TECH:</span> <span className="text-white font-bold">{venueLight}</span></div>
                  <div><span className="text-slate-500 block text-[7px] font-black tracking-widest uppercase">// VIDEO TECH:</span> <span className="text-white font-bold">{venueVideo}</span></div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-900 p-4 rounded-2xl space-y-1.5 shadow-xl sm:col-span-2">
                <span className="text-[6px] text-red-400 block font-black tracking-widest">// BEDINGUNGEN & AUFLAGEN (TERMS)</span>
                <div className="text-[10px] text-amber-400 font-bold bg-amber-500/5 border border-amber-500/20 p-2 rounded-xl">{venueTerms}</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SECURITY */}
        {activeTab === 'security' && (
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 space-y-4 animate-fade-in text-left">
            <span className="text-[8px] text-red-400 font-black tracking-widest uppercase block border-b border-slate-900 pb-2">
              // GUARD DEPLOYMENT METRICS
            </span>
            <div className="text-[10px] space-y-1 max-w-xs">
              <label className="text-[7px] text-slate-500 block uppercase font-bold">
                Geplante Ordner-Mannstärke (Guards Count)
              </label>
              <input 
                type="number" 
                value={guards} 
                onChange={(e) => setGuards(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-red-500/30 font-mono text-[9px]" 
              />
            </div>
            
            <div className="pt-2 border-t border-slate-900">
              <button 
                onClick={() => handleSaveSharedData()} 
                className="w-full py-2 bg-red-500/10 border border-red-500/40 text-red-400 hover:text-white font-bold text-[9px] uppercase rounded-xl transition-all cursor-pointer font-mono tracking-wider"
              >
                💾 Sicherheits-Konzept freigeben
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="mt-6 bg-slate-950 border border-slate-900 p-3 rounded-2xl flex justify-between items-center text-[8px] text-slate-500 font-mono uppercase tracking-wider">
        <span>// SYNC-STATE: ONLINE</span>
        <span>Letzter B2B-Abgleich durch: <span className="text-purple-400 font-bold">{currentEvent.riderSpecs?.lastModifiedBy || 'System'}</span></span>
      </div>

    </div>
  );
}

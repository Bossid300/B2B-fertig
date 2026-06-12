import React, { useState, useEffect } from 'react';

export default function RiderZentrale({ onBack, activeEvent }) {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('tech'); // tech | logistik | security
  const [userRole, setUserRole] = useState('Veranstalter');
  
  // Geladener Profil-Rider des Künstlers
  const [artistRider, setArtistRider] = useState([]);
  const [liveStageplotUrl, setLiveStageplotUrl] = useState('');
  const [liveBandaufstellung, setLiveBandaufstellung] = useState('');
  const [liveBackline, setLiveBackline] = useState('');
  
  // Formular-States für die anderen B2B-Gewerke
  const [arrival, setArrival] = useState('');
  const [backline, setBackline] = useState('');
  const [guards, setGuards] = useState('');

  // 📡 1. REALTIME DATA PULL AUS DANIELS EXTRA-VARIABLEN
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
        setArrival(matched.logistikPlan?.arrival || '14:00');
        setBackline(matched.logistikPlan?.backlineCargo || 'Standard Backline');
        setGuards(matched.securityPlan?.guardsCount || '4');

        // 🎤 AUTOMATISCHER KÜNSTLER-RIDER PULL ÜBER DIE EVENT-CREWLISTE
        const eventTitle = (matched.title || matched.name || '').toLowerCase();
        const eventCrew = matched.crew || [];
        
        let targetArtistName = "";
        const foundByTitle = profiles.find(p => p && (p.role === 'Künstler' || p.role === 'Artist') && eventTitle.includes((p.name || '').toLowerCase()));
        
        if (foundByTitle) {
          targetArtistName = foundByTitle.name;
        } else {
          const crewArtist = eventCrew.find(m => m && (m.role === 'Künstler' || m.role === 'Artist'));
          if (crewArtist) {
            targetArtistName = crewArtist.name;
          }
        }

        const artistProfile = profiles.find(p => p && p.name && p.name.toLowerCase() === targetArtistName.toLowerCase());
        
        if (artistProfile) {
          // 🖼️ GIGSDA REALTIME EXTRACTION PIPELINE: Holt die Texte und die Grafik!
          setLiveStageplotUrl(artistProfile.stageplot_url || '');
          setLiveBandaufstellung(artistProfile.bandaufstellung || 'Keine räumliche Positionierung im Profil hinterlegt.');
          setLiveBackline(artistProfile.backline || 'Keine mitgebrachte Backline spezifiziert.');

          // 🔎 Wandelt Daniels flache chX_-Variablen dynamisch in eine Liste um!
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

          if (parsedChannels.length > 0) {
            setArtistRider(parsedChannels);
          }
        }
      }
    } catch (e) {
      console.error("Fehler beim B2B-Daten-Pull:", e);
    }
  }, [activeEvent]);

  // 💾 2. MASTER-SPEICHERUNG BEI ABSEGNUNG
  const handleSaveSharedData = (customStatus = null) => {
    try {
      const savedEvents = JSON.parse(localStorage.getItem('gigsda_events') || localStorage.getItem('gigsda_projects') || '[]');
      const targetId = currentEvent?.id || currentEvent?.eventId || currentEvent?._id;
      const index = savedEvents.findIndex(ev => ev && (ev.id === targetId || ev.eventId === targetId || ev._id === targetId));

      if (index > -1) {
        savedEvents[index].riderSpecs = {
          patchplan: artistRider,
          status: customStatus || savedEvents[index].riderSpecs?.status || 'pending',
          lastModifiedBy: localStorage.getItem('gigsda_user_name') || 'B2B System'
        };

        savedEvents[index].logistikPlan = { arrival, backlineCargo: backline };
        savedEvents[index].securityPlan = { guardsCount: guards };

        localStorage.setItem('gigsda_events', JSON.stringify(savedEvents));
        localStorage.setItem('gigsda_projects', JSON.stringify(savedEvents));

        window.dispatchEvent(new CustomEvent('request-sent'));
        window.dispatchEvent(new CustomEvent('route-change'));

        alert(customStatus === 'verified' ? "🟩 TECH-RIDER ERFOLGREICH VERIFIZIERT!" : "💾 Geteilte Daten synchronisiert!");
      }
    } catch (e) { console.error(e); }
  };

  if (!currentEvent) return <div className="p-6 text-xs text-slate-600 font-mono">// PIPELINE SYNC IN PROGRESS...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-950 border border-slate-900 rounded-3xl font-mono text-white shadow-2xl relative">
      
      {/* 🌌 COLLABORATIVE TOP BANNER */}
      <div className="h-24 w-full rounded-2xl bg-gradient-to-r from-purple-500/10 via-cyan-500/5 to-slate-900 border border-slate-800 p-4 flex justify-between items-center mb-6">
        <div>
          <span className="text-[8px] bg-cyan-500/10 border border-cyan-500 text-cyan-400 font-bold px-2 py-0.5 rounded-md uppercase tracking-widest">
            📡 DANIEL-ENGINE DATEN-KOPPLUNG ACTIVATED // ROLE: {userRole.toUpperCase()}
          </span>
          <h1 className="text-base font-black uppercase text-white mt-1">🎛️ Rider- & Gewerke-Zentrale</h1>
          <p className="text-[8px] text-slate-500 uppercase mt-0.5">Projekt: <span className="text-white">{currentEvent.title || currentEvent.name}</span></p>
        </div>
          <button 
            onClick={onBack} 
            className="text-[9px] bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white px-4 py-2 rounded-xl transition-all cursor-pointer font-bold uppercase tracking-wider"
          >
            ‹ DASHBOARD
          </button>
          
          {/* 📄 REAKTIVER CYBERPUNK B2B PRINT- TO-PDF TRIGGER */}
          <button 
            onClick={() => window.print()} 
            className="text-[9px] bg-purple-500/10 border border-purple-500 hover:border-purple-400 text-purple-400 hover:text-white px-4 py-2 rounded-xl transition-all cursor-pointer font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.1)] flex items-center gap-1.5"
          >
            <span>🖨️ PDF / PRINT</span>
          </button>

      </div>

      {/* TABS */}
      <div className="grid grid-cols-3 gap-2 pb-4 border-b border-slate-900 font-bold text-[8px] uppercase tracking-wider mb-6">
        <button onClick={() => setActiveTab('tech')} className={`py-2 rounded-xl border transition-all cursor-pointer text-center ${activeTab === 'tech' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500' : 'bg-slate-950 text-slate-500 border-slate-900 hover:border-slate-800'}`}>
          🎸 1. TECH-RIDER (LIVE-PULL)
        </button>
        <button onClick={() => setActiveTab('logistik')} className={`py-2 rounded-xl border transition-all cursor-pointer text-center ${activeTab === 'logistik' ? 'bg-blue-500/20 text-blue-400 border-blue-500' : 'bg-slate-950 text-slate-500 border-slate-900 hover:border-slate-800'}`}>
          🚛 2. LOGISTIK & ZEITPLAN
        </button>
        <button onClick={() => setActiveTab('security')} className={`py-2 rounded-xl border transition-all cursor-pointer text-center ${activeTab === 'security' ? 'bg-red-500/20 text-red-400 border-red-500' : 'bg-slate-950 text-slate-500 border-slate-900 hover:border-slate-800'}`}>
          🛡️ 3. SECURITY CONCEPT
        </button>
      </div>

      {/* CONTENT */}
      <div className="space-y-4">
        {activeTab === 'tech' && (
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-900 pb-2">
              <span className="text-[8px] text-cyan-400 font-black tracking-widest uppercase">// GEZOGENE BAND-STAGESPECS (READ-ONLY)</span>
              <span className="text-[7px] text-slate-500 uppercase">STATUS: <span className={currentEvent.riderSpecs?.status === 'verified' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{currentEvent.riderSpecs?.status || 'pending'}</span></span>
            </div>

            {/* 📋 DIE OPTISCHE READ-ONLY TABELLE */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              <div className="grid grid-cols-4 gap-2 items-center px-3 py-1 text-slate-600 font-bold text-[7px] uppercase tracking-wider font-mono">
                <div>Kanal</div>
                <div>Signal-Quelle</div>
                <div>Mikrofon / DI-Box</div>
                <div>Stativ-Typ</div>
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

            {/* 🖼️ 2. DER PHYSISCHE BÜHNENAUFSTELLUNGSPLAN */}
            <div className="space-y-2 pt-2 border-t border-slate-900 text-left">
              <span className="text-[7px] text-slate-500 uppercase font-black block tracking-widest">// PHYSISCHER BÜHNENAUFSTELLUNGSPLAN (STAGE-PLOT):</span>
              <div className="w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-900/80 relative p-2 flex justify-center items-center shadow-inner group">
                <img 
                  src={liveStageplotUrl || "https://unsplash.com"} 
                  alt="Stageplot Grid" 
                  className="w-full h-auto max-h-64 object-contain opacity-40 rounded-xl border border-slate-900/60 shadow-xl" 
                />
                {!liveStageplotUrl && (
                  <div className="absolute inset-0 flex flex-col justify-center items-center font-mono text-[9px] text-center p-4 bg-slate-950/40">
                    <span className="text-white font-black uppercase tracking-wide">Virtueller Bühnen-Layout-Auszug aktiv</span>
                  </div>
                )}
              </div>
            </div>

            {/* 📝 3. DANIELS REAKTIVE TEXT-SPECS INJEKTION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-900 text-[9px] text-left">
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-900">
                <span className="text-[6px] text-cyan-500 block uppercase font-black tracking-widest">// RÄUMLICHE POSITIONIERUNG (BANDAUFSTELLUNG):</span>
                <p className="text-white mt-1 leading-relaxed font-bold">"{liveBandaufstellung}"</p>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-900">
                <span className="text-[6px] text-cyan-500 block uppercase font-black tracking-widest">// MITGEBRACHTE BACKLINE (PROFIL-LISTE):</span>
                <p className="text-slate-300 mt-1 font-medium italic">"{liveBackline}"</p>
              </div>
            </div>

            {/* BACKSTAGE ACTION BUTTONS */}
            {(userRole === 'Techniker' || userRole === 'Veranstalter') && (
              <div className="pt-2 border-t border-slate-900 font-bold text-[9px] uppercase font-mono">
                <button 
                  onClick={() => handleSaveSharedData('verified')} 
                  className="w-full py-2.5 bg-emerald-500/10 border border-emerald-500/40 hover:border-emerald-500 text-emerald-400 hover:text-white rounded-xl transition-all cursor-pointer tracking-wider text-center font-bold shadow-[0_0_15px_rgba(16,185,129,0.05)] animate-pulse"
                >
                  🟩 BACKSTAGE FREIGABE: RIDER REAKTIV ABSEGNEN ✓
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LOGISTIK PLANNER */}
        {activeTab === 'logistik' && (
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 space-y-4 animate-fade-in text-left">
            <span className="text-[8px] text-blue-400 font-black tracking-widest uppercase block border-b border-slate-900 pb-2">// CARGO & ROUTING SPECIFICATIONS</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[10px]">
              <div className="space-y-1">
                <label className="text-[7px] text-slate-500 block uppercase font-bold">Ankunftszeit / Load-In Time</label>
                <input type="text" value={arrival} onChange={(e) => setArrival(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-blue-500/30 font-mono text-[9px]" />
              </div>
              <div className="space-y-1">
                <label className="text-[7px] text-slate-500 block uppercase font-bold">Backline Cargo / Packliste</label>
                <input type="text" value={backline} onChange={(e) => setBackline(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-blue-500/30 font-mono text-[9px]" />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-900">
              <button onClick={() => handleSaveSharedData()} className="w-full py-2 bg-blue-500/10 border border-blue-500/40 text-blue-400 hover:text-white font-bold text-[9px] uppercase rounded-xl transition-all cursor-pointer font-mono tracking-wider">
                💾 Logistik-Daten synchronisieren
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SECURITY CONCEPT */}
        {activeTab === 'security' && (
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 space-y-4 animate-fade-in text-left">
            <span className="text-[8px] text-red-400 font-black tracking-widest uppercase block border-b border-slate-900 pb-2">// GUARD DEPLOYMENT METRICS</span>
            <div className="text-[10px] space-y-1 max-w-xs">
              <label className="text-[7px] text-slate-500 block uppercase font-bold">Geplante Ordner-Mannstärke (Guards Count)</label>
              <input type="number" value={guards} onChange={(e) => setGuards(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-red-500/30 font-mono text-[9px]" />
            </div>
            <div className="pt-2 border-t border-slate-900">
              <button onClick={() => handleSaveSharedData()} className="w-full py-2 bg-red-500/10 border border-red-500/40 text-red-400 hover:text-white font-bold text-[9px] uppercase rounded-xl transition-all cursor-pointer font-mono tracking-wider">
                💾 Sicherheits-Konzept freigeben
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL INFOSANZEIGE FÜR GETEILTE PROTOKOLLE */}
      <div className="mt-6 bg-slate-950 border border-slate-900 p-3 rounded-2xl flex justify-between items-center text-[8px] text-slate-500 font-mono uppercase tracking-wider">
        <span>// SYNC-STATE: ONLINE</span>
        <span>Letzter B2B-Abgleich durch: <span className="text-purple-400 font-bold">{currentEvent.riderSpecs?.lastModifiedBy || 'System'}</span></span>
      </div>

    </div>
  );
}

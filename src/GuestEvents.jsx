import React, { useState, useEffect } from 'react';

export default function GuestEvents({ onNavigate }) {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [searchRadius, setSearchRadius] = useState(50); // 📡 Live-Suchumkreis

  // 📁 EVENT-LOADER: Holt alle Events frisch von der Festplatte
  useEffect(() => {
    // Falls Daniel ein separates Array nutzt, liest er 'gigsda_events' aus
    const localEvents = JSON.parse(localStorage.getItem('gigsda_events') || '[]');
    
    // Prototypen-Fallbacks, falls die Event-Tabelle beim allerersten Start noch leer ist
    if (localEvents.length === 0) {
      const demoEvents = [
        { id: "EVT-8192", title: "Neon Club Night", category: "Club-Gigs", city: "Braunau", date: "15.07.2026", organizer: "Bossid", slide1_url: "https://unsplash.com" },
        { id: "EVT-4431", title: "Rock am Inn Festival", category: "Festivals", city: "Altötting", date: "02.08.2026", organizer: "Winston Jud", slide1_url: "https://unsplash.com" },
        { id: "EVT-2911", title: "Acoustic Songwriter Session", category: "Konzerte", city: "Linz", date: "22.08.2026", organizer: "Musica", slide1_url: "https://unsplash.com" },
        { id: "EVT-9921", title: "B2B Gastro Expo", category: "B2B-Messen", city: "Wien", date: "10.09.2026", organizer: "Gigsda Network", slide1_url: "https://unsplash.com" }
      ];
      localStorage.setItem('gigsda_events', JSON.stringify(demoEvents));
      setEvents(demoEvents);
    } else {
      setEvents(localEvents.filter(evt => evt && evt.title));
    }
  }, []);

  const CATEGORIES_LIST = ['Alle', 'Konzerte', 'Festivals', 'Club-Gigs', 'B2B-Messen'];

  // 🗺️ DIE LIVE-ENTFERNUNGSMATRIX (Exakt identisch zum SearchExplorer von eurer Heimatbasis Braunau)
  const getDistanceTo = (city) => {
    const target = (city || '').toLowerCase().trim();
    if (target.includes('braunau')) return 0;   // Direkt vor Ort
    if (target.includes('altötting')) return 28; // ca. 28 km entfernt
    if (target.includes('linz')) return 120;     // ca. 120 km entfernt
    if (target.includes('wien')) return 290;     // ca. 290 km entfernt
    return 45; // Fallback
  };

  // ⚡ DIE ZWILLINGS-FILTER-SCHLEIFE (Filtert nach Name, Kategorie UND Radius!)
  const filteredEvents = events.filter(event => {
    const matchesName = event.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Kategorie-Weiche
    const matchesCategory = selectedCategory === 'Alle' || event.category === selectedCategory;

    // 🛰️ REAKTIVE RADIUS-PRÜFUNG gegen den Schieberegler
    const eventDistance = getDistanceTo(event.city);
    const matchesRadius = eventDistance <= searchRadius;

    return matchesName && matchesCategory && matchesRadius;
  });

  return (
    <div className="p-6 bg-slate-950 text-white min-h-screen font-mono relative">
      
      {/* 🌌 HEADER SEKTION */}
      <div className="mb-8">
        <h1 className="text-xl font-black text-cyan-400 uppercase tracking-wider mb-2">// EVENT-RADAR</h1>
        <p className="text-xs text-slate-400">Durchsuche alle anstehenden Veranstaltungen und regionalen B2B-Gigs im Umkreis.</p>
      </div>

      {/* 🎛️ FILTER-LEISTE (KATEGORIEN) */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-900 pb-4">
        {CATEGORIES_LIST.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-xl border transition-all duration-300 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            {cat === 'Alle' ? '// ALLES ANZEIGEN' : `// ${cat}`}
          </button>
        ))}
      </div>

      {/* 🎛️ DANIELS SMART-KOMBI: SUCHE & REICHWEITENSKALA IN EXAKTER SYMMETRIE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-3xl font-mono">
        
        {/* Linke Seite: Nach Event-Namen suchen */}
        <div className="flex flex-col justify-end">
          <label className="text-[8px] text-slate-500 uppercase font-black mb-1.5">// Nach Event suchen</label>
          <input
            type="text"
            placeholder="Event-Titel suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/40 rounded-xl px-4 py-2.5 text-xs outline-none text-white placeholder-slate-600 h-[38px]"
          />
        </div>

        {/* Rechte Seite: Perfekt angeglichene Reichweitenskala (Zwillings-Design) */}
        <div className="flex flex-col justify-end">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[8px] text-slate-500 uppercase font-black">// Event-Umkreis</label>
            <span className="text-[10px] text-cyan-400 font-bold tracking-wider font-mono">
              🛰️ {searchRadius} KM
            </span>
          </div>
          
          <div className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 flex items-center gap-3 h-[38px]">
            <span className="text-[8px] text-slate-600 font-mono font-bold">10KM</span>
            <input
              type="range"
              min="0"
              max="500" // Kannst du analog zum SearchExplorer auf 150 oder 200 erhöhen
              step="5"
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              className="flex-grow bg-slate-950 h-1 rounded-none appearance-none cursor-pointer border border-slate-950
                accent-cyan-500
                [&::-webkit-slider-thumb]:appearance-none 
                [&::-webkit-slider-thumb]:h-2 
                [&::-webkit-slider-thumb]:w-2 
                [&::-webkit-slider-thumb]:bg-cyan-400 
                [&::-webkit-slider-thumb]:border 
                [&::-webkit-slider-thumb]:border-cyan-500 
                [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(34,211,238,0.6)] 
                [&::-webkit-slider-thumb]:transition-all 
                [&::-webkit-slider-thumb]:duration-150
                [&::-webkit-slider-thumb]:hover:scale-125
                [&::-moz-range-thumb]:h-2 
                [&::-moz-range-thumb]:w-2 
                [&::-moz-range-thumb]:bg-cyan-400 
                [&::-moz-range-thumb]:border 
                [&::-moz-range-thumb]:border-cyan-500 
                [&::-moz-range-thumb]:rounded-none
                [&::-moz-range-thumb]:shadow-[0_0_6px_rgba(34,211,238,0.6)]"
            />
            <span className="text-[8px] text-slate-600 font-mono font-bold">100KM</span>
          </div>
        </div>

      </div>

      {/* 💳 EVENT-KARTEN-GRID (Zwillings-Struktur) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <div 
              key={`${event.id || 'event'}-${index}`} 
              className="bg-slate-950 border border-slate-900 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col group hover:border-slate-800 transition-all duration-300 min-h-[300px]"
            >
              {/* OBERES EVENT-BANNER */}
              <div className="h-24 w-full relative overflow-hidden bg-slate-900">
                <img 
                  src={event.slide1_url || 'https://unsplash.com'} 
                  alt="Event Banner" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 text-[8px] bg-slate-950/90 border border-slate-800/80 text-cyan-400 font-bold px-2 py-0.5 rounded-md tracking-wider uppercase backdrop-blur-sm z-10">
                  {event.category}
                </span>
              </div>

              {/* DATUMS-BOX ALS ICON-ERSATZ */}
              <div className="absolute top-12 left-4 z-20">
                <div className="w-16 h-16 rounded-xl border-2 border-slate-950 overflow-hidden bg-slate-900 shadow-xl flex flex-col items-center justify-center text-center font-mono">
                  <span className="text-[9px] font-black text-cyan-400 tracking-tighter">DATE</span>
                  <span className="text-[10px] font-bold text-white leading-none mt-0.5">{event.date?.substring(0, 5)}</span>
                </div>
              </div>

              {/* TEXT-KÖRPER DER EVENT-KARTE */}
              <div className="p-4 pt-7 flex-grow flex flex-col justify-between pl-4">
                <div className="mb-4">
                  <h3 className="text-sm font-black uppercase text-white tracking-wide group-hover:text-cyan-400 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-[9px] text-slate-600 uppercase mt-0.5">// EVENT-ID: {event.id || 'N/A'} • BY {event.organizer}</p>
                </div>

                {/* LOGISCHE LIVE-VARIABLEN (STADT & ENTFERNUNG) */}
                <div className="pt-3 border-t border-slate-900 flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>STADT: <strong className="text-slate-200">{event.city || 'Nicht hinterlegt'}</strong></span>
                  <span>DISTANZ: <strong className="text-cyan-400">{getDistanceTo(event.city)} KM</strong></span>
                </div>
                {/* EVENT-BUTTONS */}
                <div className="grid grid-cols-2 gap-2 mt-5 pt-3 border-t border-slate-900/60">
                  <button
                    onClick={() => alert(`Details für ${event.title} öffnen...`)}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-[10px] font-bold uppercase py-2 rounded-xl transition-all duration-300 cursor-pointer text-center"
                  >
                    INFOS
                  </button>

                  <button
                    onClick={() => alert(`Ticket-Anfrage für ${event.title} bereit! ✎`)}
                    className="bg-cyan-500/5 border border-cyan-500/20 hover:border-cyan-500/50 text-cyan-400 text-[10px] font-bold uppercase py-2 rounded-xl transition-all duration-300 cursor-pointer text-center"
                  >
                    TICKETS ✎
                  </button>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-full bg-slate-900/10 border border-dashed border-slate-900 rounded-2xl p-12 text-center text-xs text-slate-600 font-mono">
            // KEINE EVENTS IM GEWÄHLTEN UMKREIS GEFUNDEN 🧹
          </div>
        )}
      </div>

    </div>
  );
}

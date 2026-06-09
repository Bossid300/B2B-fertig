import React, { useState } from 'react';
import { Calendar, MapPin, ArrowLeft, Ticket, Search, Music } from 'lucide-react';

export default function GuestEvents({ onBack, onTriggerGate, currentCity = "Braunau" }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');

  // Die simulierte Live-Event-Datenbank für den Gast-Modus
  const [mockEvents] = useState([
    { id: "G-EVT-01", title: "Winston Jud Unplugged", type: "Rock", date: "Fr, 18. Sept 2026", venue: "Backstage Halle", city: "Braunau" },
    { id: "G-EVT-02", title: "Stadtpark OpenAir Festival", type: "Festival", date: "Sa, 15. Aug 2026", venue: "Stadtpark Wiese", city: "Braunau" },
    { id: "G-EVT-05", title: "Cyber Neon Night", type: "Electro-Pop", date: "Sa, 11. Jul 2026", venue: "Club Airport", city: "Braunau" },
    { id: "G-EVT-06", title: "Kasperl & der Musikdieb", type: "Kasperl", date: "So, 04. Okt 2026", venue: "Stadttheater", city: "Braunau" },
    { id: "G-EVT-03", title: "The Neon Sparks Live", type: "Clubshow", date: "Sa, 10. Okt 2026", venue: "The Jazz Cave", city: "Linz" },
    { id: "G-EVT-04", title: "Salzburg Rock-Gala", type: "Open Air", date: "Fr, 04. Sept 2026", venue: "Festungsgelände", city: "Salzburg" }
  ]);

  // Filtert die Gigs messerscharf nach Stadt, Suchbegriff, Genre und Monat
  const filteredGigs = mockEvents.filter(gig => {
    // 1. Stadt-Filter (schneidet Leerzeichen ab und ignoriert Groß-/Kleinschreibung)
    const matchesCity = gig.city ? gig.city.trim().toLowerCase() === currentCity.trim().toLowerCase() : false;
    
    // 2. Textsuche
    const matchesSearch = searchTerm === '' || 
                          (gig.title && gig.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (gig.venue && gig.venue.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // 3. Genre/Typ-Filter
    const currentSelectedType = selectedType ? selectedType.toLowerCase() : 'all';
    const matchesGenre = currentSelectedType === 'all' || 
                         (gig.type && gig.type.toLowerCase() === currentSelectedType) ||
                         (currentSelectedType === 'festivals' && gig.type && gig.type.toLowerCase() === 'festival');

    // 4. Zeitachsen-Filter (Monat)
    let matchesMonth = true;
    const currentSelectedMonth = selectedMonth ? selectedMonth.toLowerCase() : 'all';
    if (currentSelectedMonth !== 'all') {
      const monthMap = { '07': 'jul', '08': 'aug', '09': 'sept', '10': 'okt' };
      const targetMonthString = monthMap[currentSelectedMonth];
      matchesMonth = gig.date ? gig.date.toLowerCase().includes(targetMonthString) : false;
    }

    return matchesCity && matchesSearch && matchesGenre && matchesMonth;
  });




  return (
    <div className="max-w-4xl mx-auto space-y-6 my-6 p-4 text-xs text-slate-300 font-mono animate-fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl gap-4">
        <div>
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">// Regionaler Gigsda-Scanner</span>
          <h2 className="text-xl font-bold text-white mt-0.5">Anstehende Gigs in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-black">{currentCity}</span></h2>
          <p className="text-slate-400 text-[11px]">Hier siehst du alle Live-Termine und Locations in deiner direkten Umgebung.</p>
        </div>
        <button 
          type="button" 
          onClick={onBack} 
          className="w-full sm:w-auto bg-slate-950 border border-slate-800 text-slate-300 hover:text-white px-4 h-10 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" /> Zurück zur Suche
        </button>
      </div>

      {/* FILTER-LEISTE FÜR DEN GAST */}
      <div className="relative w-full bg-slate-900/40 border border-slate-900 rounded-3xl p-4">
        <Search className="absolute left-7 top-6 w-4 h-4 text-slate-600" />
        <input
          type="text"
          placeholder="Events oder Locations in dieser Stadt durchsuchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-950 border border-slate-900 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-cyan-400 text-xs h-9"
        />
      </div>

      {/* FILTER-PILLS (GENRES) */}
      <div className="flex gap-2 mt-4 px-4 overflow-x-auto no-scrollbar">
          {['ALLE', 'ROCK', 'ELECTRO-POP', 'FESTIVALS', 'KASPERL'].map((genre) => (
              <button
                  key={genre}
                  onClick={() => setSelectedType(genre === 'ALLE' ? 'all' : genre.toLowerCase())}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all border ${
                      (selectedType === genre.toLowerCase() || (genre === 'ALLE' && selectedType === 'all'))
                          ? 'border-emerald-500 text-emerald-400 bg-emerald-950/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                          : 'border-slate-800 text-slate-400 bg-slate-900/50 hover:border-slate-700'
                  }`}
              >
                  {genre}
              </button>
          ))}
      </div>

      {/* ZEITACHSE (MONTH TIMELINE) */}
      <div className="mt-6 mx-4 p-4 bg-slate-900/30 border border-slate-900 rounded-2xl">
          <div className="text-[10px] font-mono text-cyan-400 mb-4 tracking-widest">// ZEITACHSE: SPIELPLAN 2026</div>
          
          <div className="relative flex justify-between items-center px-2">
              {/* Die durchgehende Verbindungslinie im Hintergrund */}
              <div className="absolute left-4 right-4 h-[1px] bg-slate-800 z-0"></div>
              
              {/* Zeitachsen-Knotenpunkte */}
              {[
                  { id: 'all', label: 'GESAMT' },
                  { id: '07', label: 'JUL' },
                  { id: '08', label: 'AUG' },
                  { id: '09', label: 'SEPT' },
                  { id: '10', label: 'OKT' }
              ].map((month) => (
                  <button
                      key={month.id}
                      onClick={() => setSelectedMonth(month.id)}
                      className={`relative z-10 px-4 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all ${
                          selectedMonth === month.id
                              ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                              : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300'
                      }`}
                  >
                      {month.label}
                  </button>
              ))}
          </div>
      </div>







      {/* EVENT GRID */}
      <div className="space-y-4">
        {filteredGigs.length > 0 ? (
          filteredGigs.map((gig) => (
            <div key={gig.id} className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-800 transition-all shadow-xl">
              
              {/* Links: Datum & Titel */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex flex-col items-center justify-center text-cyan-400 text-center shrink-0">
                  <Calendar className="w-4 h-4 mb-0.5" />
                  <span className="text-[8px] font-black uppercase">LIVE</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block uppercase font-bold">#{gig.id} // {gig.type}</span>
                  <h4 className="text-sm font-black text-white mt-0.5">{gig.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-600" /> {gig.venue} ({gig.date})
                  </p>
                </div>
              </div>

              {/* Rechts: Status & Ticket-Sperre (Gäste dürfen laut Lastenheft nur gucken) */}
              <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-between sm:justify-end border-t border-slate-950 sm:border-0 pt-3 sm:pt-0">
                <div className="text-right sm:mr-2">
                  <span className="text-[9px] text-slate-500 block uppercase">Eintritt:</span>
                  <span className="text-white font-bold block">{gig.price}</span>
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    // Lastenheft-Regel: Gäste müssen sich registrieren, um Tickets zu buchen!
                    if (onTriggerGate) {
                      onTriggerGate("Um Tickets zu reservieren oder echten Crew-Workflow zu starten, erstelle bitte zuerst ein kostenloses Gigsda-Konto!");
                    }
                  }}
                  className="bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-500/40 px-4 h-10 rounded-xl font-bold uppercase tracking-wider transition-all active:scale-[0.97] flex items-center gap-1.5 cursor-pointer text-[10px]"
                >
                  <Ticket className="w-3.5 h-3.5 text-cyan-400" /> Tickets sichern ➔
                </button>
              </div>
      {/* 🗺️ EVENT-ROUTENPLANER & INTERAKTIVES RADAR */}
      <div className="mt-8 space-y-3 font-mono text-left max-w-2xl mx-auto">
        <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
          <span className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">// Event-Routenplaner</span>
          <span className="text-[9px] text-cyan-400 font-black animate-pulse">MAP CONNECTED</span>
        </div>
        <p className="text-[10px] text-slate-400">Finde den schnellsten Weg zu den Gigs in deiner Region.</p>

        {/* DAS VISUELLE KARTENGEHÄUSE */}
        <div className="bg-slate-950/90 border border-slate-900 rounded-2xl overflow-hidden p-4 shadow-2xl relative group">
          <div className="absolute top-3 right-3 bg-slate-900/80 border border-slate-800 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full backdrop-blur-sm">
            ⚡ ~15 Min. (11,4 km)
          </div>
          
          <div className="text-[10px] text-slate-400 font-bold mb-3 uppercase tracking-tight">
            Dein Standort (<span className="text-white">Braunau</span>) ➔ <span className="text-cyan-400">Stadtpark Wiese</span>
          </div>

          {/* SIMULIERTE KARTENGRAFIK ODER GOOGLE-MAP-IFRAME CHASSIS */}
          <div className="w-full h-48 bg-slate-900 border border-slate-800/60 rounded-xl flex items-center justify-center overflow-hidden relative grayscale invert opacity-85 group-hover:opacity-100 transition-opacity">
            {/* Hier brennt sich später euer echtes Karten-Iframe oder Leaflet-Skript ein */}
            <div className="text-[10px] text-slate-600 uppercase tracking-widest font-black select-none">// GEOTRACKING MAP COMPONENT //</div>
            
            {/* Kleine simulierte Radar-Pins */}
            <span className="absolute top-1/3 left-1/4 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-ping" />
            <span className="absolute top-1/2 right-1/3 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
          </div>

          {/* GOOGLE MAPS API DISPATCH BUTTON */}
          <div className="pt-3 flex justify-center">
            <button 
              type="button"
              onClick={() => window.open('https://google.com', '_blank')}
              className="bg-cyan-950/40 border border-cyan-800 hover:border-cyan-500 text-cyan-400 hover:text-white font-black uppercase tracking-widest px-4 py-2 rounded-xl text-[9px] transition-all cursor-pointer shadow-lg"
            >
              Google Maps Route starten 🧭
            </button>
          </div>
        </div>
      </div>

            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-slate-900/20 border border-dashed border-slate-900 rounded-3xl text-slate-600">
            Aktuell keine Live-Termine für "{currentCity}" im Gigsda-Scanner hinterlegt. Try "Braunau"!
          </div>
        )}


        
      </div>





    </div>
  );
}

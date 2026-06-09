import React, { useState } from 'react';

export default function CreateEventForm({ onBack, onCreateEvent }) {
  // Alle Zustände für deine strukturierte Eingabemaske
  const [category, setCategory] = useState('Clubshows');
  const [title, setTitle] = useState('');
  const [venue, setVenue] = useState('');
  const [dateStr, setDateStr] = useState(''); // Textfeld für schnelles Tippen
  const [calendarDate, setCalendarDate] = useState(''); // Der echte HTML5 Kalender
  const [time, setTime] = useState('20:00'); // Wunschzeit Standardwert 20:00 Uhr

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !venue.trim()) return;

    // Nutzt entweder das Kalenderdatum oder das getippte Datum
    let finalDate = dateStr;
    if (calendarDate) {
      const d = new Date(calendarDate);
      finalDate = d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
    }

    if (onCreateEvent) {
      onCreateEvent({
        id: "EVT-" + Date.now().toString().slice(-4),
        title: title,
        date: finalDate || "Sa, 12. Sept 2026",
        time: time,
        category: category,
        venue: venue,
        doneProgress: 0
      });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl relative max-w-md mx-auto text-slate-300 text-xs animate-fade-in max-h-[90vh] overflow-y-auto">
      
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-800/60 pb-3 mb-4">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">// Gigsda Management</span>
          <h3 className="text-base font-black text-white uppercase tracking-tight mt-0.5">Event-Spezifikation</h3>
        </div>
        <button type="button" onClick={onBack} className="text-slate-500 hover:text-slate-300 font-mono text-[10px]">[ Abbrechen ]</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* BLOCK 1: WAS */}
        <div className="space-y-3">
          <p className="text-cyan-400 font-mono text-[9px] uppercase tracking-widest font-black">// 🟢 WAS (Spezifikation)</p>
          
          <div>
            <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1">Event-Kategorie</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 font-mono text-xs cursor-pointer"
            >
              <option value="Clubshows">Clubshow</option>
              <option value="Festivals">Festival</option>
              <option value="OpenAirs">Open Air</option>
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1">Name des Events / Headliner</label>
            <input 
              type="text" 
              placeholder="z.B. Winston Jud Live in Concert" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
            />
          </div>
        </div>

        {/* BLOCK 2: WO */}
        <div className="space-y-3 pt-3 border-t border-slate-800/60">
          <p className="text-purple-400 font-mono text-[9px] uppercase tracking-widest font-black">// 🟣 WO (Platzierung)</p>
          
          <div>
            <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1">Name der Location / Spielstätte</label>
            <input 
              type="text" 
              placeholder="z.B. Stadtpark Wiese, Braunau" 
              value={venue} 
              onChange={(e) => setVenue(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 font-mono text-xs"
            />
          </div>
        </div>

        {/* BLOCK 3: WANN */}
        <div className="space-y-3 pt-3 border-t border-slate-800/60">
          <p className="text-amber-400 font-mono text-[9px] uppercase tracking-widest font-black">// 🟡 WANN (Terminierung)</p>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1">Datum eingeben</label>
              <input 
                type="text" 
                placeholder="z.B. Sa, 12. Sept" 
                value={dateStr} 
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono text-slate-500 tracking-wider mb-1 uppercase">Kalender Auswahl</label>
              <input 
                type="date" 
                value={calendarDate} 
                onChange={(e) => setCalendarDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-mono text-xs scheme-dark cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1">Wunschzeit (Einlass / Beginn)</label>
            <input 
              type="time" 
              value={time} 
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400 font-mono text-xs scheme-dark cursor-pointer"
            />
          </div>
        </div>

        {/* INLINE BUTTONS */}
        <div className="pt-4 border-t border-slate-800 flex gap-3 font-mono">
          <button
            type="button"
            onClick={onBack}
            className="w-1/3 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-xl h-11 transition-all text-[10px] uppercase tracking-wider active:scale-[0.97]"
          >
            Abbrechen
          </button>
          
          <button
            type="submit"
            disabled={!title.trim() || !venue.trim() || (!dateStr.trim() && !calendarDate)}
            className="w-2/3 bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black h-11 rounded-xl transition-all text-[10px] uppercase tracking-wider shadow-lg shadow-emerald-500/10 active:scale-[0.97] disabled:opacity-30"
          >
            Event anlegen 💥
          </button>
        </div>

      </form>
    </div>
  );
}

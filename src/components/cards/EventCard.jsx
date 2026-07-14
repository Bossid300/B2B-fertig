import React from 'react';

  // 🗺️ DIE LIVE-ENTFERNUNGSMATRIX (Exakt identisch zum SearchExplorer von eurer Heimatbasis Braunau)
  const getDistanceTo = (city) => {
    const target = (city || '').toLowerCase().trim();
    if (target.includes('braunau')) return 0;   // Direkt vor Ort
    if (target.includes('altötting')) return 28; // ca. 28 km entfernt
    if (target.includes('linz')) return 120;     // ca. 120 km entfernt
    if (target.includes('wien')) return 290;     // ca. 290 km entfernt
    return 45; // Fallback
  };


export default function EventCard({ event }) {

  if (!event) return null;

  return (

    <div className="bg-slate-950 border border-slate-900 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col group hover:border-slate-800 transition-all duration-300 min-h-[300px]">

        <div className="h-24 w-full relative overflow-hidden bg-slate-900">

        <img
            src={event.slide1_url}
            alt="Event Banner"/>
            <span
            className="absolute top-3 right-3 text-[8px] bg-slate-950/90 border border-slate-800/80 text-cyan-400 font-bold px-2 py-0.5 rounded-md tracking-wider uppercase"
            >
            {event.category}
            </span>

        </div>

      <div className="absolute top-12 left-4 z-20">

        <div className="w-20 h-20 rounded-xl border-2 border-slate-950 overflow-hidden bg-slate-900 shadow-xl flex flex-col items-center justify-center text-center font-mon">

          <span className="text-[10px] font-black text-cyan-400 tracking-wider">
            DATE
          </span>

          <span className="text-[10px] font-black text-white">
            FR
          </span>

          <span className="text-[11px] font-black text-white">
            18.SEP
          </span>

        </div>

      </div>

      <div className="p-4 pt-7 flex-grow flex flex-col justify-between">

        <div>

            <h3 className="text-sm font-black uppercase text-white">
            {event.title}
            </h3>

            <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
            {event.shortDescription}
            </p>


            {event.category && (
            <div className="mt-2">

                <span className=" text-[9px] uppercase font-bold tracking-wider text-cyan-400">
                #{event.category}
                </span>

            </div>
            )}

            <div className="mt-2 space-y-1">

              {event.entryTime && (
                <div className="text-[10px] text-slate-400">
                  🕒 Einlass {event.entryTime}
                </div>
              )}

              {event.startTime && (
                <div className="text-[10px] text-slate-400">
                  🎵 Beginn {event.startTime}
                </div>
              )}

            </div>

            <p className="text-[9px] text-slate-600 uppercase mt-0.5">
            // EVENT-ID: {event.id}
            </p>

        </div>

        <div className="pt-3 border-t border-slate-900 flex justify-between text-[10px] text-slate-400">

          <span>
            STADT:
            <strong className="text-slate-200 ml-1">
              {event.city || 'Nicht hinterlegt'}
            </strong>
          </span>
            
          <span>
            DISTANZ:
            <strong className="text-cyan-400 ml-1">
              {getDistanceTo(event.city)} KM
            </strong>
          </span>

        </div>

      </div>

    </div>

  );

}
import React from 'react';

export default function FavoritenCard({
  fav,
  activeSelectFav,
  events,
  onSelect,
  onAddToProject,
  onRemove,
  onCancel
}) {

  const roleStyles = {
    Veranstalter:
      "bg-pink-500/10 border border-pink-500/30 text-pink-400",

    Künstler:
      "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400",

    Techniker:
      "bg-purple-500/10 border border-purple-500/30 text-purple-400",

    Location:
      "bg-orange-500/10 border border-orange-500/30 text-orange-400",

    Material:
      "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400",

    Verleiher:
      "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400",

    Catering:
      "bg-amber-500/10 border border-amber-500/30 text-amber-400",

    Logistik:
      "bg-blue-500/10 border border-blue-500/30 text-blue-400",

    Security:
      "bg-indigo-500/10 border border-indigo-500/30 text-indigo-400",

    Design:
      "bg-violet-500/10 border border-violet-500/30 text-violet-400",

    Fan:
      "bg-slate-500/10 border border-slate-500/30 text-slate-300"
  };

  const role =
    fav.role || "Gewerk";

  const roleClass =
    roleStyles[role] ||
    "bg-slate-900 border-slate-800 text-slate-400";

  return (
    <div className="bg-slate-950 border border-slate-900 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col group hover:border-slate-800 transition-all duration-300">

        {/* OBERES BANNER-BILD */}
        <div className="h-24 w-full relative overflow-hidden bg-slate-900">
        <img 
            // 🔒 DER UNZERSTÖRBARE BANNER-LINK: Holt das echte slide1_url direkt aus eurem Datenbank-Eintrag!
            src={fav.slide1_url || fav.bannerUrl || 'https://unsplash.com'} 
            alt="Banner" 
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
            />
            <span
            className={`absolute top-3 right-3 text-[11px] font-bold px-2 py-0.5 rounded-md tracking-wider uppercase backdrop-blur-sm z-10 ${roleClass}`}
            >
            {fav.role || fav.type || 'Künstler'}
            </span>
        </div>

        {/* AVATARBILD */}
        <div className="absolute top-12 left-4 z-20">
        <div className="w-16 h-16 rounded-full border-2 border-slate-950 overflow-hidden bg-slate-900 shadow-xl">
            {fav.avatarUrl ? (
            <img src={fav.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-black text-slate-600 bg-slate-900">
                {fav.name?.substring(0, 2).toUpperCase()}
            </div>
            )}
        </div>
        </div>

      {/* CONTENT */}
      <div className="p-4 pt-7 flex-grow flex flex-col justify-between pl-4">

        <div className="mb-4">

          <h3 className="text-sm font-black uppercase text-white tracking-wide">
            {fav.name}
          </h3>

          <p className="text-[9px] text-slate-600 uppercase mt-0.5">
            📍 {fav.city || "Nicht hinterlegt"}
          </p>

        </div>

        <div className="pt-3 border-t border-slate-900 text-[10px] text-slate-400 italic">
          "{fav.note || 'Keine Notiz hinterlegt.'}"
        </div>

        <div className="mt-4">

          {activeSelectFav === fav.name ? (
            <div className="bg-slate-950 border border-amber-500/20 rounded-xl p-2 space-y-1.5 animate-fade-in">

              <span className="text-[6px] text-amber-400 block font-black uppercase">
                // WÄHLE DAS ZIEL-PROJEKT:
              </span>

              {events.length === 0 ? (
                <p className="text-slate-600 text-[8px] italic">
                  // Keine aktiven Events gefunden.
                </p>
              ) : (
                <div className="max-h-24 overflow-y-auto space-y-1 pr-1">

                  {events.map(ev => (
                    <button
                      key={ev.id}
                      onClick={() => onAddToProject(ev.id)}
                      className="w-full text-left px-2 py-1 bg-slate-900 hover:bg-amber-500/10 border border-slate-800 text-slate-300 hover:text-white rounded text-[8px]"
                    >
                      📅 {ev.title || ev.name || "Unbenanntes Event"}
                    </button>
                  ))}

                </div>
              )}

              <button
                onClick={onCancel}
                className="w-full text-center text-[7px] text-slate-500 font-bold uppercase mt-1"
              >
                Abbrechen
              </button>

            </div>
          ) : (

            <button
              onClick={onSelect}
              className="w-full py-2 bg-cyan-500/5 border border-cyan-500/20 hover:border-cyan-500 hover:text-white text-cyan-400 rounded-xl transition-all font-bold uppercase tracking-wider"
            >
              ➕ Zum Projekt hinzufügen
            </button>

          )}

          <button
            onClick={onRemove}
            className="w-full mt-2 py-2 bg-red-500/5 border border-red-500/20 hover:border-red-500 hover:text-white text-red-400 text-[10px] font-bold uppercase rounded-xl transition-all"
          >
            ✕ Entfernen
          </button>

        </div>

      </div>

    </div>
  );
}
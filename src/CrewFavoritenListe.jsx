import React, { useState, useEffect } from 'react';

export default function CrewFavoritenListe({ onNavigate }) {
  const [favorites, setFavorites] = useState([]);
  const [filterRole, setFilterRole] = useState('all');

  // SYSTEM-ROLES FÜR DIE GEWERKE-FILTER MATRIX
  const ROLES_LIST = ['all', 'Künstler', 'Catering', 'Rental', 'Location', 'Techniker', 'Logistik', 'Security', 'Design'];

  // LADE DEINE MERKLISTE AUS DEM SPEICHER
  useEffect(() => {
    try {
      const savedFavs = JSON.parse(localStorage.getItem('gigsda_favorites') || '[]');
      
      // DEMO-DATEN FALLBACK FÜR DEN PROBELAUF
      if (savedFavs.length === 0) {
        const demo = [
          { name: "Winston Jud", role: "Künstler", city: "Braunau", note: "Main-Act Option für die Hauptbühne" },
          { name: "Cater John", role: "Catering", city: "Innviertel", note: "Premium Galabuffet & Full-Service" },
          { name: "Security Guard GmbH", role: "Security", city: "Linz", note: "Einlasskontrolle & Ordner nach §34a" }
        ];
        localStorage.setItem('gigsda_favorites', JSON.stringify(demo));
        setFavorites(demo);
      } else {
        setFavorites(savedFavs);
      }
    } catch (e) { console.error(e); }
  }, []);

  const removeFavorite = (name) => {
    const updated = favorites.filter(f => f.name !== name);
    localStorage.setItem('gigsda_favorites', JSON.stringify(updated));
    setFavorites(updated);
  };

  const filteredFavs = favorites.filter(f => filterRole === 'all' || f.role === filterRole);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-950 border border-slate-900 rounded-3xl font-mono text-white shadow-2xl">
      
      {/* HEADER BANNER */}
      <div className="h-24 w-full rounded-2xl bg-gradient-to-r from-amber-500/10 to-slate-900 border border-slate-800 p-4 flex justify-between items-center mb-6">
        <div>
          <span className="text-[8px] bg-amber-500/10 border border-amber-500 text-amber-400 font-bold px-2 py-0.5 rounded-md uppercase tracking-widest">
            ★ REAKTIVE MERKLISTE
          </span>
          <h1 className="text-base font-black uppercase text-white mt-1">Meine gespeicherten Favoriten</h1>
        </div>
        <button onClick={() => onNavigate('projects')} className="text-[9px] bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white px-3 py-1.5 rounded-xl transition-all cursor-pointer">
          ✕ ZURÜCK
        </button>
      </div>

      {/* FILTER MATRIX */}
      <div className="flex flex-wrap gap-1.5 pb-4 border-b border-slate-900 text-[8px] font-bold uppercase mb-4">
        {ROLES_LIST.map(role => (
          <button key={role} onClick={() => setFilterRole(role)} className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${filterRole === role ? 'bg-amber-500/20 text-amber-400 border-amber-500' : 'bg-slate-950 text-slate-400 border-slate-900 hover:border-slate-800'}`}>
            {role === 'all' ? '🌐 ALLE' : role.toUpperCase()}
          </button>
        ))}
      </div>

      {/* FAVORITEN GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredFavs.map(fav => (
          <div key={fav.name} className="bg-slate-900/20 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[7px] bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-bold uppercase">{fav.role}</span>
              <h3 className="text-xs font-black text-white uppercase mt-1">{fav.name}</h3>
              <p className="text-[8px] text-slate-500">📍 {fav.city}</p>
              <p className="text-[9px] text-slate-400 italic mt-2">"{fav.note || 'Keine Notiz hinterlegt.'}"</p>
            </div>
            <button onClick={() => removeFavorite(fav.name)} className="w-full py-1 bg-red-500/5 border border-red-500/20 hover:border-red-500 hover:text-white text-red-400 text-[8px] font-bold uppercase rounded-lg transition-all cursor-pointer">
              ✕ ENTFERNEN
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
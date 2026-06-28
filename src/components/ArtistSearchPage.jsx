import React, { useState } from 'react';
import ArtistSearchFilter from "./ArtistSearchFilter";
import ArtistSearchCard from "./ArtistSearchCard";
import { Users } from 'lucide-react';

export default function ArtistSearchPage() {
  const [filteredArtists, setFilteredArtists] = useState([]);

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-200 p-4 font-sans selection:bg-cyan-500/30">
      <div className="max-w-5xl mx-auto space-y-4">
        
        {/* Seiten-Überschrift im minimalistischen Cyber-Style */}
        <div className="flex items-center gap-2 border-b border-slate-800/40 pb-3">
          <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg">
            <Users size={16} />
          </div>
          <div>
            <span className="text-[8px] font-bold tracking-widest text-slate-500 uppercase">// B2B Booking Matrix</span>
            <h1 className="text-sm font-bold text-white uppercase tracking-wider mt-0.5">KÜNSTLER- & BANDVERZEICHNIS</h1>
          </div>
        </div>

        {/* 1. DIE REAKTIVE FILTERBAR */}
        <ArtistSearchFilter onFilterResult={(results) => setFilteredArtists(results)} />

        {/* 2. ERGEBNIS-ANZEIGE & LIVE-COUNTER */}
        <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">
          <span>Suchergebnisse</span>
          <span className="text-cyan-400/80">{filteredArtists.length} Acts gefunden</span>
        </div>

        {/* 3. DAS ERGEBNIS-GRID */}
        {filteredArtists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredArtists.map((artist) => (
              <ArtistSearchCard key={artist.id || artist.name} artist={artist} />
            ))}
          </div>
        ) : (
          // Elegantes Gigsda-No-Results-Panel
          <div className="bg-[#0b111e] rounded-xl border border-slate-800/40 p-8 text-center border-dashed">
            <span className="block text-2xl mb-1 opacity-40">🔍</span>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Keine passenden Acts gefunden</h4>
            <p className="text-[10px] text-slate-500 max-w-xs mx-auto mt-1">
              Passe deine Gagen-Töpfe oder den Umkreis-Radius in der Filterleiste an, um mehr Ergebnisse zu laden.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

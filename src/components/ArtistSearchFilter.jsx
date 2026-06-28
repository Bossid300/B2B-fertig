import React, { useState, useEffect } from 'react';
import { 
  Search, SlidersHorizontal, Users, DollarSign, 
  MapPin, ShieldCheck, Check, RotateCcw, Music 
} from 'lucide-react';

export default function ArtistSearchFilter({ onFilterResult }) {
  // Such- und Filter-States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState('all');
  const [selectedRadius, setSelectedRadius] = useState('all');
  const [onlyVerified, setOnlyVerified] = useState(false);
  
  // Alle verfügbaren Künstler aus dem LocalStorage
  const [allArtists, setAllArtists] = useState([]);

  // 1. DATEN-PIPELINE: Alle Profile laden, die Musiker/Bands sind
  useEffect(() => {
    const storedProfiles = localStorage.getItem('gigsda_profiles');
    if (storedProfiles) {
      const profiles = JSON.parse(storedProfiles);
      // Filtert Profile heraus, die z.B. Audio-Keys besitzen (Künstler)
      const artists = profiles.filter(p => p && (p.audio1_url || p.album1_title || p.rider_backline || p.type === 'artist'));
      setAllArtists(artists);
    }
  }, []);

  // 2. REAKTIVE FILTER-LOGIK: Filtert die Liste bei jeder Änderung in Echtzeit
  useEffect(() => {
    const filtered = allArtists.filter(artist => {
      // A. Freitextsuche (Name, Beschreibung)
      const name = (artist.name || artist.display_name || '').toLowerCase();
      const bio = (artist.bio || '').toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch = name.includes(query) || bio.includes(query);

      // B. Genre Filter
      const artistGenre = (artist.genre || 'all').toLowerCase();
      const matchesGenre = selectedGenre === 'all' || artistGenre === selectedGenre.toLowerCase();

      // C. Besetzung / Act-Typ Filter
      const artistType = (artist.act_type || 'band').toLowerCase(); // solo, duo, band, dj
      const matchesType = selectedType === 'all' || artistType === selectedType.toLowerCase();

      // D. B2B Budget/Gagen-Topf Weiche
      const gage = parseInt(artist.gage_standard) || 0;
      let matchesBudget = true;
      if (selectedBudget === 'low') matchesBudget = gage < 500;
      else if (selectedBudget === 'mid') matchesBudget = gage >= 500 && gage <= 1500;
      else if (selectedBudget === 'high') matchesBudget = gage > 1500 && gage <= 5000;
      else if (selectedBudget === 'pro') matchesBudget = gage > 5000;

      // E. Umkreis / Radius Weiche (Simuliert über Entfernungs-Daten im Profil)
      const distance = parseInt(artist.travel_radius) || 9999;
      let matchesRadius = true;
      if (selectedRadius === 'local') matchesRadius = distance <= 50;
      else if (selectedRadius === 'region') matchesRadius = distance <= 200;
      else if (selectedRadius === 'national') matchesRadius = distance > 200;

      // F. Gigsda B2B-Trust Hebel (Nur Künstler mit verifizierten Live-Referenzen)
      const isVerified = artist.gigsda_verified === true || (artist.gigsda_events && artist.gigsda_events.length >= 2);
      const matchesVerification = !onlyVerified || isVerified;

      return matchesSearch && matchesGenre && matchesType && matchesBudget && matchesRadius && matchesVerification;
    });

    // Ergebnisse an die übergeordnete Seite zurückgeben
    if (onFilterResult) {
      onFilterResult(filtered);
    }
  }, [searchQuery, selectedGenre, selectedType, selectedBudget, selectedRadius, onlyVerified, allArtists]);

  // Filter komplett zurücksetzen
  const handleReset = () => {
    setSearchQuery('');
    setSelectedGenre('all');
    setSelectedType('all');
    setSelectedBudget('all');
    setSelectedRadius('all');
    setOnlyVerified(false);
  };

  return (
    <div className="bg-[#0b111e] rounded-xl border border-slate-800/50 shadow-2xl p-3 mb-6 text-slate-200 font-sans">
      
      {/* OBERE ZEILE: TEXTURSUCHE & RESET-BUTTON */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-3">
        <div className="relative flex-1 w-full">
          <Search size={12} className="absolute left-3 top-2.5 text-slate-500" />
          <input 
            type="text"
            placeholder="Künstlername, Instrument, Stichwort eingeben..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#070b12]/60 border border-slate-800/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-colors"
          />
        </div>

        <button 
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800/80 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-white hover:border-slate-700 transition-colors w-full sm:w-auto justify-center"
        >
          <RotateCcw size={10} /> Reset
        </button>
      </div>

      {/* INTERAKTIVE MATRIX-FILTERLEISTE (HORIZONTAL & KOMPAKT) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-1 border-t border-slate-800/20">
        
        {/* 1. FILTER: GENRE */}
        <div className="flex flex-col gap-1">
          <label className="text-[8px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 opacity-50"><Music size={8} /> Genre-Cluster</label>
          <select 
            value={selectedGenre} 
            onChange={(e) => setSelectedGenre(e.target.value)}
            className={`bg-[#070b12] border text-[11px] rounded-md px-2 py-1 focus:outline-none w-full font-medium transition-colors ${selectedGenre !== 'all' ? 'border-cyan-500/60 text-cyan-400' : 'border-slate-800/80 text-slate-400'}`}
          >
            <option value="all">Alle Genres</option>
            <option value="rock">Rock / Metal</option>
            <option value="pop">Pop / Indie</option>
            <option value="electronic">Electronic / Techno</option>
            <option value="hiphop">HipHop / Rap</option>
            <option value="jazz">Jazz / Blues</option>
          </select>
        </div>

        {/* 2. FILTER: ACT-TYP */}
        <div className="flex flex-col gap-1">
          <label className="text-[8px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 opacity-50"><Users size={8} /> Besetzung</label>
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
            className={`bg-[#070b12] border text-[11px] rounded-md px-2 py-1 focus:outline-none w-full font-medium transition-colors ${selectedType !== 'all' ? 'border-cyan-500/60 text-cyan-400' : 'border-slate-800/80 text-slate-400'}`}
          >
            <option value="all">Alle Formationen</option>
            <option value="solo">Solo-Act</option>
            <option value="duo">Duo</option>
            <option value="band">Komplette Band</option>
            <option value="dj">DJ / Producer</option>
          </select>
        </div>

        {/* 3. FILTER: BUDGET / GAGE */}
        <div className="flex flex-col gap-1">
          <label className="text-[8px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 opacity-50"><DollarSign size={8} /> Gagen-Budget</label>
          <select 
            value={selectedBudget} 
            onChange={(e) => setSelectedBudget(e.target.value)}
            className={`bg-[#070b12] border text-[11px] rounded-md px-2 py-1 focus:outline-none w-full font-medium transition-colors ${selectedBudget !== 'all' ? 'border-cyan-500/60 text-cyan-400' : 'border-slate-800/80 text-slate-400'}`}
          >
            <option value="all">Jedes Budget</option>
            <option value="low">Unter 500 €</option>
            <option value="mid">500 € – 1.500 €</option>
            <option value="high">1.500 € – 5.000 €</option>
            <option value="pro">Über 5000 €</option>
          </select>
        </div>

        {/* 4. FILTER: RADIUS / LOGISTIK */}
        <div className="flex flex-col gap-1">
          <label className="text-[8px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 opacity-50"><MapPin size={8} /> Anreise-Radius</label>
          <select 
            value={selectedRadius} 
            onChange={(e) => setSelectedRadius(e.target.value)}
            className={`bg-[#070b12] border text-[11px] rounded-md px-2 py-1 focus:outline-none w-full font-medium transition-colors ${selectedRadius !== 'all' ? 'border-cyan-500/60 text-cyan-400' : 'border-slate-800/80 text-slate-400'}`}
          >
            <option value="all">Unbegrenzt</option>
            <option value="local">Lokal (bis 50 km)</option>
            <option value="region">Regional (bis 200 km)</option>
            <option value="national">Überregional / National</option>
          </select>
        </div>

        {/* 5. FILTER: GIGSDA TRUST-HEBEL (VERIFIZIERTE CREWS) */}
        <div className="flex flex-col gap-1 col-span-2 md:col-span-1 justify-end">
          <button
            onClick={() => setOnlyVerified(!onlyVerified)}
            className={`w-full h-[23px] flex items-center justify-center gap-1.5 rounded-md border text-[10px] font-bold uppercase tracking-wider transition-all ${
              onlyVerified 
                ? 'bg-cyan-500/10 border-cyan-500/60 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
                : 'bg-[#070b12] border-slate-800/80 text-slate-500 hover:text-slate-400 hover:border-slate-700'
            }`}
          >
            <ShieldCheck size={11} className={onlyVerified ? 'text-cyan-400' : 'text-slate-500'} />
            {onlyVerified ? 'Verifiziert ✓' : 'Nur Verifizierte'}
          </button>
        </div>

      </div>

    </div>
  );
}

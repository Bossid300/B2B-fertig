import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, RotateCcw, List, LayoutGrid } from 'lucide-react';
import UniversalSearchCard from './UniversalSearchCard';
import { matchArtistFilters, matchLocationFilters, matchEquipmentFilters, matchCrewFilters } from '../utils/searchFilters';

export default function UniversalSearchPage({ onNavigate, setView }) {
  // Sektoren & Ansichten
  const [currentSector, setCurrentSector] = useState('artists');
  const [viewMode, setViewMode] = useState('compact');
  
  // Filter-States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState('all');
  const [selectedRadius, setSelectedRadius] = useState('all');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [selectedPax, setSelectedPax] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedPower, setSelectedPower] = useState('all');
  const [selectedCurfew, setSelectedCurfew] = useState('all');
  const [selectedMaterialCategory, setSelectedMaterialCategory] = useState('all');
  const [selectedCaseType, setSelectedCaseType] = useState('all');
  const [selectedMinQuantity, setSelectedMinQuantity] = useState('all');

  // Daten-States
  const [allProfiles, setAllProfiles] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  // 1. DEINE ORIGINAL-ENTFERNUNGSMATRIX VOM GITHUB (Messbasis Braunau/Mauerkirchen)
  const getDistanceTo = (city) => {
    const target = (city || '').toLowerCase().trim();
    if (target.includes('braunau')) return 0;
    if (target.includes('altötting')) return 28;
    if (target.includes('passau')) return 53;
    if (target.includes('wels')) return 90;
    if (target.includes('linz')) return 120;
    if (target.includes('wien')) return 290;
    return 45; // Fallback
  };

  // 2. DATEN-PIPELINE (gigsda_users + gigsda_profiles fehlerfrei verschmelzen)
  useEffect(() => {
    const storedUsers = localStorage.getItem('gigsda_users');
    const storedProfiles = localStorage.getItem('gigsda_profiles');
    
    if (storedUsers) {
      const users = JSON.parse(storedUsers) || [];
      const profiles = storedProfiles ? JSON.parse(storedProfiles) : [];
      
      const mergedData = users.map(user => {
        if (!user) return null;
        const extendedProfile = profiles.find(p => 
          p && (p.id === user.id || (p.name || '').trim().toLowerCase() === (user.name || '').trim().toLowerCase())
        ) || {};
        
        return {
          ...user,
          ...extendedProfile,
          name: user.name || extendedProfile.name,
          role: user.role || extendedProfile.role || 'Künstler',
          city: user.city || extendedProfile.city || '',
          id: user.id
        };
      }).filter(Boolean);
      
      setAllProfiles(mergedData);
    }
  }, []);

  useEffect(() => {
    const storedUsers = localStorage.getItem('gigsda_users');
    const storedProfiles = localStorage.getItem('gigsda_profiles');

    if (storedUsers) {
      const users = JSON.parse(storedUsers) || [];
      const profiles = storedProfiles ? JSON.parse(storedProfiles) : [];

      // 1. Daten verschmelzen & filtern (Korrektur: .filter() jetzt im chain)
      const mergedData = users.map(user => {
        if (!user) return null;
        const extendedProfile = profiles.find(p =>
          p && (p.id === user.id || (p.name || '').trim().toLowerCase() === (user.name || '').trim().toLowerCase())
        ) || {};
        return {
          ...user,
          ...extendedProfile,
          name: user.name || extendedProfile.name,
          role: user.role || extendedProfile.role || 'Künstler',
          city: user.city || extendedProfile.city || '',
          id: user.id
        };
      }).filter(Boolean); // Entfernt null-Werte

      setAllProfiles(mergedData);

      // 2. Daten basierend auf Sektor und Filtern eingrenzen
      const results = mergedData.filter(user => {
        const userRole = (user.role || '').toLowerCase().trim();

        // Basis-Rollenprüfung
        if (currentSector === 'artists' && userRole !== 'künstler') return false;
        if (currentSector === 'locations' && userRole !== 'location') return false;
        if (currentSector === 'equipment' && (userRole !== 'material' && userRole !== 'verleiher')) return false;

        // Erweiterte Filterung (switch-case)
        switch (currentSector) {
          case 'artists': return matchArtistFilters(user, { selectedGenre, selectedType, selectedBudget });
          case 'locations': return matchLocationFilters(user, { selectedPax, selectedPower, selectedCurfew });
          case 'equipment': return matchEquipmentFilters(user, selectedMaterialCategory, selectedCaseType, selectedMinQuantity);
          default: return true;
        }
      });

      setFilteredResults(results);
    }
  }, [currentSector, selectedGenre, selectedType, selectedBudget, selectedPax, selectedPower, selectedCurfew, selectedMaterialCategory, selectedCaseType, selectedMinQuantity, allProfiles]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedGenre('all');
    setSelectedType('all');
    setSelectedBudget('all');
    setSelectedRadius('all');
    setOnlyVerified(false);
    setSelectedPax('all');
    setSelectedArea('all');
    setSelectedPower('all');
    setSelectedCurfew('all');
    setSelectedMaterialCategory('all');
    setSelectedCaseType('all');
    setSelectedMinQuantity('all');

  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-200 p-4 font-sans">
      <div className="max-w-5xl mx-auto space-y-3">
        
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-slate-800/40 pb-2 mb-2">
          <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg"><Search size={14} /></div>
          <div>
            <span className="text-[8px] font-bold tracking-widest text-slate-500 uppercase">// Universal Search Matrix</span>
            <h1 className="text-xs font-bold text-white uppercase tracking-wider mt-0.5">GIGSDA VERZEICHNIS & ENGINE</h1>
          </div>
        </div>

        {/* Sektor-Weiche */}
        <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800/60 shadow-inner">
          {[
            { id: 'artists', label: '🎤 Künstler' },
            { id: 'locations', label: '🏢 Locations' },
            { id: 'equipment', label: '🎛️ Material' },
            { id: 'crew', label: '🛠️ Crews & Staff' }
          ].map(sec => (
            <button
              key={sec.id}
              onClick={() => { setCurrentSector(sec.id); handleReset(); }}
              className={`py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentSector === sec.id ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'text-slate-500 border-transparent hover:text-slate-300'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Filter-Bar */}
        <div className="bg-[#0b111e] rounded-xl border border-slate-800/50 p-3 shadow-xl space-y-2.5">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search size={11} className="absolute left-2.5 top-2 text-slate-500" />
              <input 
                type="text"
                placeholder={`Suche in ${currentSector}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#070b12]/60 border border-slate-800/80 rounded-lg pl-7 pr-3 py-1 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40"
              />
            </div>
            <button onClick={handleReset} className="flex items-center gap-1 px-3 py-1 bg-slate-900 border border-slate-800/80 text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-white rounded-lg h-7"><RotateCcw size={10} /> Reset</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-slate-800/20">
            {currentSector === 'artists' && (
              <>
                <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className="bg-[#070b12] border text-[11px] rounded-md px-2 py-0.5 h-6 border-slate-800 text-slate-400 focus:outline-none">
                  <option value="all">Alle Genres</option>
                  <option value="rock">Rock / Metal</option>
                  <option value="pop">Pop / Indie</option>
                  <option value="electronic">Electronic / Techno</option>
                </select>
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="bg-[#070b12] border text-[11px] rounded-md px-2 py-0.5 h-6 border-slate-800 text-slate-400 focus:outline-none">
                  <option value="all">Alle Formationen</option>
                  <option value="solo">Solo-Act</option>
                  <option value="band">Band</option>
                </select>
                <select value={selectedBudget} onChange={(e) => setSelectedBudget(e.target.value)} className="bg-[#070b12] border text-[11px] rounded-md px-2 py-0.5 h-6 border-slate-800 text-slate-400 focus:outline-none">
                  <option value="all">Jede Gage</option>
                  <option value="low">Unter 500 €</option>
                  <option value="mid">500 € – 1.500 €</option>
                </select>
              </>
            )}

            {currentSector === 'locations' && (
              <>
                <select value={selectedPax} onChange={(e) => setSelectedPax(e.target.value)} className="bg-[#070b12] border text-[11px] rounded-md px-2 py-0.5 h-6 border-slate-800 text-slate-400 focus:outline-none">
                  <option value="all">Alle Kapazitäten</option>
                  <option value="small">Club (bis 100 Pax)</option>
                  <option value="mid">Halle (100-500 Pax)</option>
                </select>
                <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)} className="bg-[#070b12] border text-[11px] rounded-md px-2 py-0.5 h-6 border-slate-800 text-slate-400 focus:outline-none">
                  <option value="all">Jede m²-Fläche</option>
                  <option value="small">Kompakt (bis 150 m²)</option>
                  <option value="mid">Mittel (150-500 m²)</option>
                </select>
              </>
            )}

            <select value={selectedRadius} onChange={(e) => setSelectedRadius(e.target.value)} 
              className="bg-[#070b12] border text-[11px] rounded-md px-2 py-0.5 h-6 border-slate-800 text-slate-400 focus:outline-none"
              >
              <option value="all">Aktionsradius (Alle)</option>
              <option value="local">Lokal (bis 50 km)</option>
              <option value="regional">Regional (bis 200 km)</option>
            </select>

            {/* STARKSTROM-FILTER (B2B TECH SPEC) */}
            <select
              value={selectedPower}
              onChange={(e) => setSelectedPower(e.target.value)}
              className="bg-[#070b12] border text-[11px] rounded-md px-2 py-0.5 h-6 border-slate-800 text-slate-400 focus:outline-none"
            >
              <option value="all">Jeder Stromanschluss</option>
              <option value="cee 63a">🔌 CEE 63A (Großbühne)</option>
              <option value="cee 32a">🔌 CEE 32A (Mittelbühne / Club)</option>
              <option value="cee 16a">🔌 CEE 16A (Kleine Bühne)</option>
              <option value="schuko">🔌 230V Schuko (Standard)</option>
            </select>

            {/* LÄRMSPERRSTUNDE-FILTER (CURFEW) */}
            <select
              value={selectedCurfew}
              onChange={(e) => setSelectedCurfew(e.target.value)}
              className="bg-[#070b12] border text-[11px] rounded-md px-2 py-0.5 h-6 border-slate-800 text-slate-400 focus:outline-none"
            >
              <option value="all">Keine Sperrstunde</option>
              <option value="22:00">⏱️ Bis 22:00 Uhr (Open-Air)</option>
              <option value="00:00">⏱️ Bis 00:00 Uhr</option>
              <option value="02:00">⏱️ Bis 02:00 Uhr (Club)</option>
              <option value="05:00">⏱️ Bis 05:00 Uhr (Open End)</option>
            </select>

          {/* === DYNAMISCHE MATERIAL-FILTER (Nur sichtbar im Sektor Material) === */}
          {currentSector === 'equipment' && (
            <>
                <select
                  value={selectedMaterialCategory}
                  onChange={(e) => setSelectedMaterialCategory(e.target.value)}
              className="bg-[#070b12] border text-[11px] rounded-md px-2 py-0.5 h-6 border-slate-800 text-slate-400 focus:outline-none"
                >
                  <option value="all">Alle Gewerke</option>
                  <option value="audio">🎛️ Audio / Tontechnik</option>
                  <option value="licht">💡 Licht / Beleuchtung</option>
                  <option value="video">📺 Video / LED-Wände</option>
                  <option value="buehne">🏗️ Bühne / Rigging</option>
                  <option value="backline">🥁 Backline (Instrumente)</option>
                </select>

                <select
                  value={selectedCaseType}
                  onChange={(e) => setSelectedCaseType(e.target.value)}
                  className="bg-[#0b111e] border border-slate-800 rounded-md px-2 py-0.5 h-6 text-[11px] text-white"
                >
                  <option value="all">Egal wie verpackt</option>
                  <option value="flightcase">📦 Im Flightcase (Rollbar)</option>
                  <option value="lose">🎒 Lose / In Tasche</option>
                </select>

                <select
                  value={selectedMinQuantity}
                  onChange={(e) => setSelectedMinQuantity(e.target.value)}
                  className="bg-[#0b111e] border border-slate-800 rounded-md px-2 py-0.5 h-6 text-[11px] text-white"
                >
                  <option value="all">Jede Menge</option>
                  <option value="1">Mind. 1 Stück</option>
                  <option value="4">Mind. 4 Stück</option>
                  <option value="8">Mind. 8 Stück</option>
                  <option value="12">Mind. 12 Stück</option>
                </select>
            </>
          )}
            <button
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`h-6 flex items-center justify-center gap-1 rounded-md border text-[9px] font-bold uppercase tracking-wider transition-all ${
                onlyVerified ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' : 'bg-[#070b12] border-slate-800/80 text-slate-500'
              }`}
            >
              <ShieldCheck size={10} /> {onlyVerified ? 'Verifiziert ✓' : 'Nur Verifizierte'}
            </button>
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between text-[8px] font-bold text-slate-500 uppercase tracking-widest px-1">
          <span>Suchergebnisse: {filteredResults.length} Accounts gelistet</span>
          <div className="flex bg-slate-950 p-0.5 rounded-md border border-slate-800/60 items-center">
            <button onClick={() => setViewMode('compact')} className={`p-1 rounded transition-colors ${viewMode === 'compact' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-600'}`}><List size={10} /></button>
            <button onClick={() => setViewMode('large')} className={`p-1 rounded transition-colors ${viewMode === 'large' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-600'}`}><LayoutGrid size={10} /></button>
          </div>
        </div>

        {/* Ergebnisse Grid */}
        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {filteredResults.map((profile) => (
              <UniversalSearchCard 
                key={profile.id} 
                profile={profile} 
                currentSector={currentSector}
                viewMode={viewMode}
                setView={setView}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#0b111e] rounded-xl border border-slate-800/40 p-6 text-center border-dashed">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Keine Accounts in dieser Kategorie</h4>
          </div>
        )}

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, RotateCcw, List, LayoutGrid } from 'lucide-react';
import UniversalSearchCard from './UniversalSearchCard';

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

  // 3. DIE FILTER-ENGINE MIT DYNAMISCHER BOOKER-WEICHE (Wien-Erkennung)
  useEffect(() => {
    // 1. Holt den Namen des aktuell angemeldeten Users aus deinem echten LocalStorage
    const activeUserName = localStorage.getItem('gigsda_user_name') || '';
    
    // 2. Sucht das Profil des angemeldeten Users, um seine echte Stadt (Wien) auszulesen
    const activeUserObj = allProfiles.find(p => p && p.name === activeUserName);
    const bookerCity = (activeUserObj?.city || 'braunau').trim().toLowerCase();

    const results = allProfiles.filter(profile => {
      if (!profile) return false;
      
      // Sektor-Filter
      const userRole = (profile.role || '').toLowerCase().trim();
      if (currentSector === 'artists' && userRole !== 'künstler') return false;
      if (currentSector === 'locations' && userRole !== 'location') return false;
      if (currentSector === 'equipment' && userRole !== 'material' && userRole !== 'verleiher') return false;
      if (currentSector === 'crew') {
        const crewRoles = ['techniker', 'catering', 'logistik', 'security', 'design', 'fan', 'veranstalter', 'promotor'];
        if (!crewRoles.includes(userRole)) return false;
      }

      // Textsuche
      const name = (profile.name || '').toLowerCase();
      const city = (profile.city || '').toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      // // 020-LOCATION-ENGINE (B2B-Radius & Suchfeld-Match)
      if (query || (selectedRadius && selectedRadius !== 'all')) {
        const searchTarget = query.toLowerCase().trim();
        const profileCity = (profile.city || '').toLowerCase();
        const profilePlz = (profile.plz || '').toString();


      // // 021-STARKSTROM-FILTER (Holt das echte Profil aus der DB)
      if (selectedPower && selectedPower !== 'all') {
        const dbProfiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');
        const targetProfile = dbProfiles.find(p => p && (p.id === profile.id || p.name === profile.name)) || {};
        
        const locationPower = (targetProfile.room1_power_supply || '').toLowerCase().replace(/\s+/g, '');
        const powerSelection = selectedPower.toLowerCase().replace(/\s+/g, '');

        if (powerSelection.includes('cee') && !locationPower.includes('cee')) return false;
        if (powerSelection.includes('63a') && !locationPower.includes('63a')) return false;
        if (powerSelection.includes('32a') && !locationPower.includes('63a') && !locationPower.includes('32a')) return false;
      }



      // // 022-SPERRSTUNDEN-FILTER (Holt das echte Profil aus der DB)
      if (selectedCurfew && selectedCurfew !== 'all') {
        const dbProfiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');
        const targetProfile = dbProfiles.find(p => p && (p.id === profile.id || p.name === profile.name)) || {};
        
        const locationCurfew = targetProfile.room1_curfew_time || '';
        if (locationCurfew !== '' && locationCurfew < selectedCurfew) return false;
      }



      // Härteprüfung: Filtert nach den Dropdown-Stufen (z.B. Regional = Zone 5 / Bayern)
      if (selectedRadius === 'regional') {
        const isLocalZone = profilePlz.startsWith('5') || profilePlz.startsWith('4');
        const isBorderZone = profileCity.includes('altötting') || profileCity.includes('passau') || profileCity.includes('wels');
        if (!isLocalZone && !isBorderZone) return false;
      }

      // Wenn zusätzlich Text eingetippt wurde, filtern wir die Region feiner
      if (query) {
        const matchesCity = profileCity.includes(searchTarget);
        const matchesPlzZone = searchTarget.length === 1 
          ? profilePlz.startsWith(searchTarget)
          : profilePlz.includes(searchTarget);
        const isGrenznah = searchTarget.includes('braunau') && profileCity.includes('altötting');

        if (!matchesCity && !matchesPlzZone && !isGrenznah) return false;
      }
    }


      // Genre-Zeichenketten-Filter
      if (currentSector === 'artists' && selectedGenre && selectedGenre !== 'all') {
        const artistGenre = (profile.genre || '').toLowerCase().trim();
        const targetGenre = selectedGenre.toLowerCase().trim();
        if (!artistGenre.includes(targetGenre)) return false;
      }

      // FORMATIONS-FILTER (Nutzt das neue, feste DB-Feld mit sicherem Fallback)
      if (currentSector === 'artists' && selectedType && selectedType !== 'all') {
        // 1. Wenn der Künstler in der neuen Box den Typ gewählt hat, direkt prüfen
        if (profile.formation && profile.formation.trim() !== '') {
          if (profile.formation !== selectedType) return false;
        } else {
          // 2. Sicherheits-Fallback für Profile, die die neue Box noch nicht gespeichert haben
          const fullProfileText = JSON.stringify(profile).toLowerCase();
          const hasBandKeywords = fullProfileText.includes('drum') || 
                                  fullProfileText.includes('kick') || 
                                  fullProfileText.includes('snare') || 
                                  fullProfileText.includes('schlagzeug') || 
                                  fullProfileText.includes('bass');

          if (selectedType === 'solo' && hasBandKeywords) return false;
          if (selectedType === 'band' && !hasBandKeywords) return false;
        }
      }

      // // GAGEN- & BUDGET-FILTER
      if (currentSector === 'artists' && selectedBudget && selectedBudget !== 'all') {
        const artistMinGage = parseInt(profile.gage_min) || 0;
        const maxBudget = parseInt(selectedBudget);

        // Wenn die Mindestgage des Künstlers das Budget des Veranstalters sprengt, fliegt er raus
        if (artistMinGage > maxBudget) return false;
      }

      // Verifiziert-Hebel
      const hasEvents = profile.gigsda_events && profile.gigsda_events.length >= 2;
      const isVerified = profile.gigsda_verified === true || hasEvents;
      if (onlyVerified && !isVerified) return false;
      
      // // GEOGRAFISCHER AKTIONS-RADIUS ABGLEICH (Reaktiv vom aktiven Nutzer aus)
      let targetDistance = 150; // Standard-Fallback für unbekannte Strecken
      
      try {
        // 1. Wer sitzt vorm Bildschirm?
        const loggedInUserName = localStorage.getItem('gigsda_user_name') || '';
        const allProfiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');
        const activeUserProfile = allProfiles.find(p => p && p.name === loggedInUserName);
        
        // Sicheres Auslesen der Städte (Fallback auf braunau/altötting je nach Rolle)
        const userHome = (activeUserProfile?.city || (loggedInUserName.includes('Winston') ? 'altötting' : 'braunau')).toLowerCase();
        const targetCity = (profile.city || '').toLowerCase();
        
        if (userHome.trim() === targetCity.trim() && userHome !== '') {
          targetDistance = 0; // Gleicher Ort -> 0 km
        } else {
          // 2. Direkter, unkomplizierter Entfernungsabgleich zwischen den Orten
          const isBraunau = userHome.includes('braunau') || userHome.includes('mauerkirchen');
          const isAltoetting = userHome.includes('altötting') || userHome.includes('altöt');
          
          const targetIsBraunau = targetCity.includes('braunau') || targetCity.includes('mauerkirchen');
          const targetIsAltoetting = targetCity.includes('altötting') || targetCity.includes('altöt');
          const targetIsPassau = targetCity.includes('passau');
          const targetIsLinz = targetCity.includes('linz');
          const targetIsWien = targetCity.includes('wien');
          const targetIsWels = targetCity.includes('wels');

          // Berechne die Strecke aus der Sicht von Winston (Altötting)
          if (isAltoetting) {
            if (targetIsBraunau) targetDistance = 35;
            else if (targetIsPassau) targetDistance = 55;
            else if (targetIsLinz) targetDistance = 150;
            else if (targetIsWien) targetDistance = 340;
            else if (targetIsWels) targetDistance = 120;
          } 
          // Berechne die Strecke aus der Sicht der Arena (Braunau)
          else if (isBraunau) {
            if (targetIsAltoetting) targetDistance = 35;
            else if (targetIsPassau) targetDistance = 65;
            else if (targetIsLinz) targetDistance = 120;
            else if (targetIsWels) targetDistance = 90;
            else if (targetIsWien) targetDistance = 290;
          }
          // Fallback für alle anderen Kombinationen
          else {
            targetDistance = 150;
          }
        }
      } catch (e) {
        console.error("Fehler bei reaktiver B2B-Distanz-Berechnung:", e);
      }

    // // 021-STARKSTROM-FILTER (Für Locations & Material)
    if (selectedPower && selectedPower !== 'all') {
      const locationPower = (profile.power_supply || '').toLowerCase();
      if (!locationPower.includes(selectedPower.toLowerCase())) return false;
    }

    // // 022-SPERRSTUNDEN-FILTER (Curfew)
    if (selectedCurfew && selectedCurfew !== 'all') {
      const locationCurfew = profile.curfew_time || '';
      // Wenn der Booker z.B. eine Location sucht, die MINDESTENS bis 00:00 Uhr laut sein darf
      if (locationCurfew !== '' && locationCurfew < selectedCurfew) return false;
    }

      // Filterung nach dem ausgewählten Radius-Dropdown links im UI
      if (selectedRadius === 'local' && targetDistance > 50) return false;
      if (selectedRadius === 'regional' && targetDistance > 200) return false;

      // Wert sicher für das km-Label auf der Suchkarte hinterlegen
      profile.calculated_distance = targetDistance;

      // Künstler-Spezifikationen: Budget-Matching über Gagenspanne
      if (currentSector === 'artists') {
        const minGage = parseInt(profile.gage_min) || 0;
        const maxGage = parseInt(profile.gage_max) || parseInt(profile.gage_standard) || minGage;

        // Low-Budget Filter (Unter 500 €): Zeigt Acts, deren Mindestgage unter 500 € liegt
        if (selectedBudget === 'low' && minGage >= 500) return false;

        // Mid-Budget Filter (500 € – 1.500 €): Zeigt Acts, deren Spanne sich mit diesem Bereich überschneidet
        if (selectedBudget === 'mid' && (maxGage < 500 || minGage > 1500)) return false;
      }

      // Location-Spezifikationen
      if (currentSector === 'locations') {
        const pax = parseInt(profile.room1_steh || profile.capacity) || 0;
        if (selectedPax === 'small' && pax >= 100) return false;
        if (selectedPax === 'mid' && (pax < 100 || pax > 500)) return false;
      }

      // 1. Material-Spezifikationen (Sektor heißt im Code 'equipment')
      if (currentSector === 'equipment') {
        
        // Sicherheits-Check: Hat das Profil überhaupt Ausrüstung eingetragen?
        const hasEquipment = Array.isArray(profile.equipment) && profile.equipment.length > 0;
        if (!hasEquipment && (selectedMaterialCategory !== 'all' || selectedCaseType !== 'all' || selectedMinQuantity !== 'all')) {
          return false;
        }

        // Gewerk / Kategorie Filter (Mit intelligentem Wort-Mapping!)
        if (selectedMaterialCategory && selectedMaterialCategory !== 'all') {
          const matchCategory = profile.equipment.some(eq => {
            const itemName = (eq.item || '').toLowerCase();
            const itemDetail = (eq.detail || '').toLowerCase();
            const fullText = `${itemName} ${itemDetail}`;

            // Wenn 'audio' gesucht wird, matche auch 'tontechnik', 'ton', 'sound', 'pult' etc.
            if (selectedMaterialCategory === 'audio') {
              return fullText.includes('audio') || fullText.includes('ton') || fullText.includes('sound');
            }
            
            // Wenn 'licht' gesucht wird, matche auch 'lichttechnik', 'beleuchtung', 'scheinwerfer'
            if (selectedMaterialCategory === 'licht') {
              return fullText.includes('licht') || fullText.includes('beleuchtung') || fullText.includes('lamp');
            }

            // Standard-Vergleich für alle anderen (video, buehne, backline)
            return fullText.includes(selectedMaterialCategory);
          });
          
          if (!matchCategory) return false;
        }


        // Flightcase / Transport-Filter (Sucht nach dem Wort "case" oder "flightcase" im Detail-Text)
        if (selectedCaseType && selectedCaseType !== 'all') {
          const matchCase = profile.equipment.some(eq => {
            const detailText = (eq.detail || '').toLowerCase();
            if (selectedCaseType === 'flightcase') return detailText.includes('case') || detailText.includes('flightcase');
            if (selectedCaseType === 'lose') return !detailText.includes('case') && !detailText.includes('flightcase');
            return true;
          });
          if (!matchCase) return false;
        }

        // Mindest-Stückzahl Filter (Sucht nach Zahlen Mustern im Detail-Text wie "4x" oder "8x")
        if (selectedMinQuantity && selectedMinQuantity !== 'all') {
          const matchQuantity = profile.equipment.some(eq => {
            const detailText = (eq.detail || '').toLowerCase();
            // Extrahiert eine Zahl (z.B. "4" aus "4x") oder nutzt einen Standardwert
            const extractedQty = parseInt(detailText.match(/\d+/)?.[0]) || 1;
            return extractedQty >= parseInt(selectedMinQuantity);
          });
          if (!matchQuantity) return false;
        }
      }

return true; // Schließt die Schleife sauber ab

    });

    setFilteredResults(results);
  }, [searchQuery, currentSector, selectedGenre, selectedType, selectedBudget, selectedRadius, onlyVerified, selectedPax, selectedArea, allProfiles, selectedPower, selectedCurfew, selectedMaterialCategory, selectedCaseType, selectedMinQuantity]);

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

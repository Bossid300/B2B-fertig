import React, { useState } from "react";
import { Search, ShieldCheck, RotateCcw, List, LayoutGrid } from "lucide-react";
import UniversalSearchCard from "./UniversalSearchCard";
import { useUniversalSearch } from "../hooks/useUniversalSearch";

export default function UniversalSearchPage({ onNavigate, setView }) {
  const [viewMode, setViewMode] = useState("compact");

const {
  currentSector,
  setCurrentSector,
  filters,
  setFilters,
  filteredResults,
  resetFilters,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy // 🔥 DAS FEHLT
} = useUniversalSearch();

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-200 p-4 font-sans">
      <div className="max-w-5xl mx-auto space-y-3">

        {/* HEADER */}
        <div className="flex items-center gap-2 border-b border-slate-800/40 pb-2 mb-2">
          <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg">
            <Search size={14} />
          </div>
          <div>
            <span className="text-[8px] font-bold tracking-widest text-slate-500 uppercase">
              // Universal Search Matrix
            </span>
            <h1 className="text-xs font-bold text-white uppercase tracking-wider mt-0.5">
              GIGSDA VERZEICHNIS & ENGINE
            </h1>
          </div>
        </div>

        {/* SEKTOR */}
        <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800/60 shadow-inner">
          {[
            { id: "artists", label: "🎤 Künstler" },
            { id: "locations", label: "🏢 Locations" },
            { id: "equipment", label: "🎛️ Material" },
            { id: "crew", label: "🛠️ Crews & Staff" }
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => {
                setCurrentSector(sec.id);
                resetFilters();
              }}
              className={`py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentSector === sec.id
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                  : "text-slate-500 border-transparent hover:text-slate-300"
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* FILTER */}
        <div className="bg-[#0b111e] rounded-xl border border-slate-800/50 p-3 shadow-xl space-y-2.5">

          {/* SEARCH + RESET */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={11} className="absolute left-2 top-2 text-slate-500" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Suche..."
                className="w-full bg-[#070b12] border border-slate-800 rounded-lg pl-6 pr-2 py-1 text-xs"
              />
            </div>

            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-3 py-1 bg-slate-900 border border-slate-800 text-[9px] font-bold text-slate-400 uppercase rounded-lg"
            >
              <RotateCcw size={10} /> Reset
            </button>
          </div>

          {/* FILTER GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">


            {/* ARTISTS **********/}
            {currentSector === "artists" && (
              <>
                {/* GENRE */}
                <select
                  value={filters.selectedGenre}
                  onChange={(e) =>
                    setFilters({ ...filters, selectedGenre: e.target.value })
                  }
                  className="bg-[#070b12] border border-slate-800 rounded-md px-2 py-0.5 h-6 text-[11px] text-slate-400"
                >
                  <option value="rock metal">Rock / Metal</option>
                  <option value="pop indie">Pop / Indie</option>
                  <option value="electronic techno">Electronic / Techno</option>
                  <option value="hiphop rap">Hip-Hop / Rap</option>
                  <option value="jazz blues">Jazz / Blues</option>
                  <option value="cover partyband">Cover / Partyband</option>
                  <option value="schlager volksmusik">Schlager / Volksmusik</option>
                  <option value="acoustic singer songwriter">Acoustic / Singer-Songwriter</option>
                </select>

                {/* EVENT TYPE 🔥 */}
                <select
                  value={filters.selectedEventType}
                  onChange={(e) =>
                    setFilters({ ...filters, selectedEventType: e.target.value })
                  }
                  className="bg-[#070b12] border border-slate-800 rounded-md px-2 py-0.5 h-6 text-[11px] text-slate-400"
                >
                  <option value="all">Alle Eventtypen</option>
                  <option value="club">🎧 Club / Nightlife</option>
                  <option value="festival">🎪 Festival</option>
                  <option value="wedding">💍 Hochzeit</option>
                  <option value="corporate">🏢 Firmenevent</option>
                  <option value="private">🎉 Privatparty</option>
                </select>

                {/* FORMATION */}
                <select
                  value={filters.selectedType}
                  onChange={(e) =>
                    setFilters({ ...filters, selectedType: e.target.value })
                  }
                  className="bg-[#070b12] border border-slate-800 rounded-md px-2 py-0.5 h-6 text-[11px] text-slate-400"
                >
                  <option value="all">Alle Formationen</option>
                  <option value="solo">Solo-Act</option>
                  <option value="band">Band</option>
                </select>

                {/* BUDGET */}
                <select
                  value={filters.selectedBudget}
                  onChange={(e) =>
                    setFilters({ ...filters, selectedBudget: e.target.value })
                  }
                  className="bg-[#070b12] border border-slate-800 rounded-md px-2 py-0.5 h-6 text-[11px] text-slate-400"
                >
                  <option value="all">Jede Gage</option>
                  <option value="low">Unter 500 €</option>
                  <option value="mid">500 € – 1.500 €</option>
                  <option value="high">Ab 1.500 €</option>
                </select>

                {/* RADIUS */}
                <select
                  value={filters.selectedRadius || "all"}
                  onChange={(e) =>
                    setFilters({ ...filters, selectedRadius: e.target.value })
                  }
                  className="bg-[#070b12] border border-slate-800 rounded-md px-2 py-0.5 h-6 text-[11px] text-slate-400"
                >
                  <option value="all">Aktionsradius (Alle)</option>
                  <option value="20">20 km</option>
                  <option value="50">50 km</option>
                  <option value="100">100 km</option>
                  <option value="150">150 km</option>
                  <option value="200">200 km</option>
                </select>

                <select
                  value={filters.selectedInstrument}
                  onChange={(e) =>
                    setFilters({ ...filters, selectedInstrument: e.target.value })
                  }
                  className="bg-[#070b12] border border-slate-800 rounded-md px-2 py-1 text-[11px] text-slate-400"
                >
                  <option value="all">Alle Instrumente</option>
                  <option value="guitar">Gitarre</option>
                  <option value="piano">Piano</option>
                  <option value="drums">Drums</option>
                  <option value="vocals">Vocals</option>
                </select>

                {/* VERIFIED FULL WIDTH 🔥 */}
                <button
                  onClick={() =>
                    setFilters({
                      ...filters,
                      onlyVerified: !filters.onlyVerified
                    })
                  }
                  className="col-span-2 md:col-span-4 h-6 flex items-center justify-center gap-1 rounded-md border text-[9px] font-bold uppercase tracking-wider transition-all bg-[#070b12] border-slate-800 text-slate-400"
                >
                  <ShieldCheck size={10} /> Nur Verifizierte
                </button>
              </>
            )}


            {/* LOCATIONS **********/}
            {currentSector === "locations" && (
              <>
                {/* PAX */}
                <select
                  value={filters.selectedPax}
                  onChange={(e) =>
                    setFilters({ ...filters, selectedPax: e.target.value })
                  }
                  className="bg-[#070b12] border border-slate-800 rounded-md px-2 py-0.5 h-6 text-[11px] text-slate-400"
                >
                  <option value="all">Alle Kapazitäten</option>
                  <option value="small">Club (bis 100 Pax)</option>
                  <option value="mid">Halle (100–500 Pax)</option>
                  <option value="large">Arena (500+ Pax)</option>
                </select>

                {/* FLÄCHE */}
                <select
                  value={filters.selectedArea}
                  onChange={(e) =>
                    setFilters({ ...filters, selectedArea: e.target.value })
                  }
                  className="bg-[#070b12] border border-slate-800 rounded-md px-2 py-0.5 h-6 text-[11px] text-slate-400"
                >
                  <option value="all">Jede m²-Fläche</option>
                  <option value="small">Kompakt (bis 150 m²)</option>
                  <option value="mid">Mittel (150–500 m²)</option>
                  <option value="large">Groß (500+ m²)</option>
                </select>

                {/* RADIUS */}
                <select
                  value={filters.selectedRadius}
                  onChange={(e) =>
                    setFilters({ ...filters, selectedRadius: e.target.value })
                  }
                  className="bg-[#070b12] border border-slate-800 rounded-md px-2 py-0.5 h-6 text-[11px] text-slate-400"
                >
                  <option value="all">Aktionsradius (Alle)</option>
                  <option value="local">Lokal (bis 50 km)</option>
                  <option value="regional">Regional (bis 200 km)</option>
                </select>

                {/* STROM */}
                <select
                  value={filters.selectedPower}
                  onChange={(e) =>
                    setFilters({ ...filters, selectedPower: e.target.value })
                  }
                  className="bg-[#070b12] border border-slate-800 rounded-md px-2 py-0.5 h-6 text-[11px] text-slate-400"
                >
                  <option value="all">Jeder Stromanschluss</option>
                  <option value="cee 63a">🔌 CEE 63A</option>
                  <option value="cee 32a">🔌 CEE 32A</option>
                  <option value="cee 16a">🔌 CEE 16A</option>
                  <option value="schuko">🔌 Schuko</option>
                </select>

                {/* CURFEW */}
                <select
                  value={filters.selectedCurfew}
                  onChange={(e) =>
                    setFilters({ ...filters, selectedCurfew: e.target.value })
                  }
                  className="bg-[#070b12] border border-slate-800 rounded-md px-2 py-0.5 h-6 text-[11px] text-slate-400"
                >
                  <option value="all">Keine Sperrstunde</option>
                  <option value="22:00">Bis 22:00 Uhr</option>
                  <option value="00:00">Bis 00:00 Uhr</option>
                  <option value="02:00">Bis 02:00 Uhr</option>
                  <option value="05:00">Bis 05:00 Uhr</option>
                </select>

                {/* VERIFIED FULL WIDTH 🔥 */}
                <button
                  onClick={() =>
                    setFilters({
                      ...filters,
                      onlyVerified: !filters.onlyVerified
                    })
                  }
                  className="col-span-2 md:col-span-4 h-6 flex items-center justify-center gap-1 rounded-md border text-[9px] font-bold uppercase tracking-wider transition-all bg-[#070b12] border-slate-800 text-slate-400"
                >
                  <ShieldCheck size={10} /> Nur Verifizierte
                </button>
              </>
            )}


            {/* EQUIPMENT *********/}
            {currentSector === "equipment" && (
              <>
                {/* RADIUS */}
                <select
                  value={filters.selectedRadius}
                  onChange={(e) =>
                    setFilters({ ...filters, selectedRadius: e.target.value })
                  }
                  className="bg-[#070b12] border border-slate-800 rounded-md px-2 py-0.5 h-6 text-[11px] text-slate-400"
                >
                  <option value="all">Aktionsradius (Alle)</option>
                  <option value="local">Lokal (bis 50 km)</option>
                  <option value="regional">Regional (bis 200 km)</option>
                </select>

                {/* STROM */}
                <select
                  value={filters.selectedPower}
                  onChange={(e) =>
                    setFilters({ ...filters, selectedPower: e.target.value })
                  }
                  className="bg-[#070b12] border border-slate-800 rounded-md px-2 py-0.5 h-6 text-[11px] text-slate-400"
                >
                  <option value="all">Jeder Stromanschluss</option>
                  <option value="cee 63a">🔌 CEE 63A</option>
                  <option value="cee 32a">🔌 CEE 32A</option>
                  <option value="cee 16a">🔌 CEE 16A</option>
                  <option value="schuko">🔌 Schuko</option>
                </select>

                {/* CURFEW */}
                <select
                  value={filters.selectedCurfew}
                  onChange={(e) =>
                    setFilters({ ...filters, selectedCurfew: e.target.value })
                  }
                  className="bg-[#070b12] border border-slate-800 rounded-md px-2 py-0.5 h-6 text-[11px] text-slate-400"
                >
                  <option value="all">Keine Sperrstunde</option>
                  <option value="22:00">Bis 22:00 Uhr</option>
                  <option value="00:00">Bis 00:00 Uhr</option>
                  <option value="02:00">Bis 02:00 Uhr</option>
                  <option value="05:00">Bis 05:00 Uhr</option>
                </select>

                {/* GEWERKE / KATEGORIE */}
                <select
                  value={filters.selectedMaterialCategory}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      selectedMaterialCategory: e.target.value
                    })
                  }
                  className="bg-[#070b12] border border-slate-800 rounded-md px-2 py-0.5 h-6 text-[11px] text-slate-400"
                >
                  <option value="all">Alle Gewerke</option>
                  <option value="audio">🎛️ Audio / Tontechnik</option>
                  <option value="licht">💡 Licht / Beleuchtung</option>
                  <option value="video">📺 Video / LED</option>
                  <option value="buehne">🏗️ Bühne / Rigging</option>
                  <option value="backline">🥁 Backline</option>
                </select>

                {/* CASE */}
                <select
                  value={filters.selectedCaseType}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      selectedCaseType: e.target.value
                    })
                  }
                  className="bg-[#070b12] border border-slate-800 rounded-md px-2 py-0.5 h-6 text-[11px] text-slate-400"
                >
                  <option value="all">Egal wie verpackt</option>
                  <option value="flightcase">📦 Flightcase</option>
                  <option value="lose">🎒 Lose</option>
                </select>

                {/* MENGE */}
                <select
                  value={filters.selectedMinQuantity}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      selectedMinQuantity: e.target.value
                    })
                  }
                  className="bg-[#070b12] border border-slate-800 rounded-md px-2 py-0.5 h-6 text-[11px] text-slate-400"
                >
                  <option value="all">Jede Menge</option>
                  <option value="1">Mind. 1 Stück</option>
                  <option value="4">Mind. 4 Stück</option>
                  <option value="8">Mind. 8 Stück</option>
                  <option value="12">Mind. 12 Stück</option>
                </select>

                {/* VERIFIED FULL WIDTH 🔥 */}
                <button
                  onClick={() =>
                    setFilters({
                      ...filters,
                      onlyVerified: !filters.onlyVerified
                    })
                  }
                  className="col-span-2 md:col-span-4 h-6 flex items-center justify-center gap-1 rounded-md border text-[9px] font-bold uppercase tracking-wider transition-all bg-[#070b12] border-slate-800 text-slate-400"
                >
                  <ShieldCheck size={10} /> Nur Verifizierte
                </button>
              </>
            )}


            {/* CREW & STUFF */}
            {currentSector === "crew" && (
              <>
                {/* GEWERK */}
                <select
                  value={filters.selectedCrewType}
                  onChange={(e) =>
                    setFilters({ ...filters, selectedCrewType: e.target.value })
                  }
                  className="bg-[#070b12] border border-slate-800 rounded-md px-2 py-0.5 h-6 text-[11px] text-slate-400"
                >
                  <option value="all">Alle Gewerke</option>
                  <option value="techniker">🎛️ Tontechniker</option>
                  <option value="licht">💡 Lichttechniker</option>
                  <option value="stage">🛠️ Stagehand</option>
                  <option value="event">📋 Eventmanager</option>
                </select>

                {/* TAGESSATZ */}
                <select
                  value={filters.selectedRate}
                  onChange={(e) =>
                    setFilters({ ...filters, selectedRate: e.target.value })
                  }
                  className="bg-[#070b12] border border-slate-800 rounded-md px-2 py-0.5 h-6 text-[11px] text-slate-400"
                >
                  <option value="all">Jeder Tagessatz</option>
                  <option value="low">Unter 200€</option>
                  <option value="mid">200€ – 500€</option>
                  <option value="high">500€+</option>
                </select>

                {/* RADIUS */}
                <select
                  value={filters.selectedRadius}
                  onChange={(e) =>
                    setFilters({ ...filters, selectedRadius: e.target.value })
                  }
                  className="bg-[#070b12] border border-slate-800 rounded-md px-2 py-0.5 h-6 text-[11px] text-slate-400"
                >
                  <option value="all">Aktionsradius (Alle)</option>
                  <option value="local">Lokal (bis 50 km)</option>
                  <option value="regional">Regional (bis 200 km)</option>
                </select>

                {/* SUPPORT */}
                <select
                  value={filters.selectedSupport}
                  onChange={(e) =>
                    setFilters({ ...filters, selectedSupport: e.target.value })
                  }
                  className="bg-[#070b12] border border-slate-800 rounded-md px-2 py-0.5 h-6 text-[11px] text-slate-400"
                >
                  <option value="all">Support egal</option>
                  <option value="yes">Support bereit ✅</option>
                  <option value="no">Kein Support ❌</option>
                </select>

                {/* VERIFIED FULL WIDTH */}
                <button
                  onClick={() =>
                    setFilters({
                      ...filters,
                      onlyVerified: !filters.onlyVerified
                    })
                  }
                  className="col-span-2 md:col-span-4 h-6 flex items-center justify-center gap-1 rounded-md border text-[9px] font-bold uppercase tracking-wider transition-all bg-[#070b12] border-slate-800 text-slate-400"
                >
                  <ShieldCheck size={10} /> Nur Verifizierte
                </button>
              </>
            )}

          </div>
        </div>

        {/* RESULTS */}
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>{filteredResults.length} Ergebnisse</span>

          <div className="flex gap-1">
            <button onClick={() => setViewMode("compact")}>
              <List size={12} />
            </button>
            <button onClick={() => setViewMode("large")}>
              <LayoutGrid size={12} />
            </button>

            {/* 🔥 HIER REIN */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#070b12] border border-slate-800 rounded-md text-[11px] text-slate-400 ml-2 px-2 py-1"
            >
              <option value="default">Sort</option>
              <option value="priceLow">💶 Preis ↑</option>
              <option value="priceHigh">💶 Preis ↓</option>
              <option value="distance">📍 Entfernung</option>
              <option value="ranking">🔥 Beste Treffer</option>
            </select>
          </div>
        </div>

        {/* LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import FahrplanMetrics from './FahrplanMetrics';

export default function StageSpecs({ 
  onBack, 
  progress, 
  setProgress, 
  onNavigateToStep, 
  onApproveSuccess, 
  activeEvent 
}) {

  const [isApproved, setIsApproved] = useState(false);

  // Holt die crewIds aus dem aktiven Event
  
  const crewIds =
    Array.isArray(activeEvent?.crewIds)
      ? activeEvent.crewIds
      : [];

  const handleApproveAll = () => {
    setIsApproved(true);
    if (typeof onApproveSuccess === 'function') {
      onApproveSuccess(); // Setzt Schritt 2 im globalen Fahrplan auf 100%
    }
  };

  const riderCenter =
  activeEvent?.riderCenter || {};

  const riderEntries =
    Object.values(riderCenter);

  const sortedCrewIds = [...crewIds].sort((a, b) => {

    const riderA = riderCenter?.[a];
    const riderB = riderCenter?.[b];

    const priority = (rider) => {
      if (rider?.changed) return 1;
      if (rider?.confirmed) return 2;
      return 0;
    };

    return priority(riderA) - priority(riderB);
  });

  const confirmedCount =
    riderEntries.filter(
      r => r?.confirmed
    ).length;

  const changedCount =
    riderEntries.filter(
      r => r?.changed
    ).length;

  const openCount =
    Math.max(
      crewIds.length -
        confirmedCount -
        changedCount,
      0
    );


  // STATUSBERECHNUNG FÜR FAHRPLANMETRICS
  const riderProgress =
    crewIds.length > 0
      ? Math.round(
          (confirmedCount /
            crewIds.length) *
            100
        )
      : 0;

  useEffect(() => {
    setProgress(prev => ({
      ...prev,
      stage: riderProgress
    }));
  }, [riderProgress, setProgress]);
  // ENDE STATUSBERECHNUNG



  const roleIcon = {
    "Künstler": "🔵",
    "Location": "🟠",
    "Techniker": "🟣",
    "Material": "🟡",
    "Verleiher": "🟡",
    "Veranstalter": "🩷",
    "Fan": "⚪"
  };


  return (
    <div className="max-w-4xl mx-auto space-y-6 my-6 p-4 text-xs text-slate-300 font-mono animate-fade-in">
      
    {/* GLOBALER FAHRPLAN */}
    <FahrplanMetrics progress={progress} activeStep="stage" onNavigate={onNavigateToStep} />




    {/* StageSpecs & Bühnen-Patching */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl gap-4">
      <div>
        {activeEvent ? (
          <span className="text-[12px] text-emerald-400 font-black uppercase tracking-wider bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-md inline-block mb-1.5">
            📍 Aktives Event: {activeEvent.title} ({activeEvent.date})
          </span>
        ) : (
          <span className="text-[10px] text-cyan-400 font-bold block mb-1">
            // Ebene 02: Rider-Check
          </span>
        )}
        <h2 className="text-3xl font-bold text-white mt-0.5">
          StageSpecs & Bühnen-Patching
        </h2>
        <p className="text-slate-400 text-[12px]">
          Verifiziere die Kanalliste basierend auf deiner zugesagten Crew.
        </p>
        {/* 🚨 REKTIVES PROJEKT-BADGE DIREKT UNTER DER ÜBERSCHRIFT */}
        <div className="bg-slate-950/90 border border-cyan-500/30 px-3 py-1.5 rounded-xl flex items-center gap-2 w-max shadow-[0_0_15px_rgba(6,182,212,0.05)] text-[10px]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
          </span>
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            // ACTIVE TARGET:
          </span>
          <span className="font-black text-cyan-400 uppercase tracking-wide">
            {(() => {
              try {
                const activeData = localStorage.getItem('gigsda_active_event');
                if (activeData) return JSON.parse(activeData).title || "WAYNESTOCK 2";
              } catch(e) {}
              return activeEvent?.title || activeEvent?.name || "WAYNESTOCK 2";
            })()}
          </span>
        </div>
      </div>
      <button type="button" onClick={onBack} className="bg-slate-950 border border-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">
        ‹ Zurück
      </button>
    </div>


    {/* RIDER STATUS ÜBERSICHT */}
    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-5 shadow-xl">

      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">

        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Rider Status
        </h3>

        <span className="text-[10px] text-cyan-400 font-black uppercase">
          Veranstalter Übersicht
        </span>

      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">

        <div className="bg-slate-950 rounded-xl p-3 border border-emerald-500/20">
          <div className="text-[10px] text-slate-500 uppercase">
            🟢 Fertig
          </div>

          <div className="text-xl font-black text-emerald-400">
            {confirmedCount}
          </div>
        </div>

        <div className="bg-slate-950 rounded-xl p-3 border border-amber-500/20">
          <div className="text-[10px] text-slate-500 uppercase">
            🟡 In Arbeit
          </div>

          <div className="text-xl font-black text-amber-400">
            {changedCount}
          </div>
        </div>

        <div className="bg-slate-950 rounded-xl p-3 border border-red-500/20">
          <div className="text-[10px] text-slate-500 uppercase">
            🔴 Handlungsbedarf
          </div>

          <div className="text-xl font-black text-red-400">
            {openCount}
          </div>
        </div>

      </div>

      <div className="text-[11px] text-slate-400">
        Rider-Fortschritt: <span className="text-cyan-400 font-black">
          {riderProgress}%
        </span>
      </div>

      {/* RIDER STATUS ÜBERSICHT */}
      <div className="mt-5 border-t border-slate-800 pt-4">

        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-3">
          Aktive Gewerke
        </div>

        <div className="space-y-2">
            {sortedCrewIds.map((crewId) => {
              const profiles = JSON.parse(
                localStorage.getItem("gigsda_profiles") || "[]"
              );
              const member = profiles.find(
                p => p.id === crewId
              );
              const rider =
                riderCenter?.[crewId];
              const state =
                rider?.changed
                  ? "🟡"
                  : rider?.confirmed
                    ? "🟢"
                    : "🔴";
              return (
                <div
                  key={crewId}
                  className="
                    flex
                    justify-between
                    items-center
                    bg-slate-950/60
                    border
                    border-slate-900
                    rounded-xl
                    px-3
                    py-2
                  "
                >
                  <div>

                    <div className="text-[11px] text-white font-bold">
                      {member?.name || crewId}
                    </div>

                    <div className="text-[9px] text-slate-500">
                      {(roleIcon[member?.role] || "⚫")}{" "}
                      {member?.role || "Unbekannt"}
                    </div>

                  </div>

                  <span className="text-lg">
                    {state}
                  </span>

                </div>
              );

            })}
        </div>
      </div>
</div>

      {/* Absegnen */}
      <div className="border-t border-slate-800 mt-4 pt-4">

        {openCount === 0 && changedCount === 0 ? (

        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-center">
          <p className="text-emerald-400 font-black">
            ✅ Alle Gewerke freigegeben
          </p>
          <p className="text-emerald-300 text-xs mt-1">
            Rider vollständig bestätigt
          </p>
        </div>

        ) : (

          <div
            className="
              w-full
              h-11
              rounded-xl
              flex
              items-center
              justify-center
              bg-slate-950
              border
              border-slate-800
              text-slate-500
              text-[11px]
              uppercase
              tracking-wider
            "
          >
            Noch {openCount + changedCount} Gewerke offen, danach kann der Rider final abgesegnet werden.
          </div>
        )}
      </div>

      {/* WEITERLEITUNGSMASKIERUNG */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => onNavigateToStep && onNavigateToStep('contract')}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-6 h-11 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
        >
          Nächster Meilenstein: Zusage-Deal ➔
        </button>
      </div>

    </div>
  );
}

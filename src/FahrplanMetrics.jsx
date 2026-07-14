import React from 'react';

export default function FahrplanMetrics({ progress = {}, activeStep = '', onNavigate }) {
  
  // OBERE REIHE (Schritte 1 - 3) – Die Vorbereitung & Verträge
  const topRow = [
    { id: 'shortlist', target: 'shortlist', label: '1. Crew-Shortlist', sub: 'Favoriten-Auswahl', current: progress.shortlist || 0 },
    { id: 'stage', target: 'stage', label: '2. Rider-Check', sub: 'Kanalliste Specs', current: progress.stage || 0 },
    { id: 'contract', target: 'contract', label: '3. Zusage-Deal', sub: 'Vertragscenter', current: progress.contract || 0 },
  ];

  // UNTERE REIHE (Schritte 4 - 6) – Fan-Voting, Logistik & Finale
  const bottomRow = [
    { id: 'voting', target: 'voting', label: '4. Team-Voting', sub: 'Setlist-Abstimmung', current: progress.voting || 0 },
    { id: 'planner', target: 'planner', label: '5. Event-Planner', sub: 'Logistik & Zeiten', current: progress.planner || 0 },
    { id: 'countdown', target: 'countdown', label: '6. Live-Countdown', sub: 'Der Tag der Show', current: progress.countdown || 25 },
  
    { id: 'promotion', target: 'promotion', label: '7. Event-Promotion', sublabel: 'Eventbeschreibung & Werbung', current: progress.promotion || 0},

  ];

  const getStatusIcon = (value) => {

    if (value === 100) {
      return "🟢";
    }

    if (value > 0) {
      return "🟡";
    }

    return "🔴";
  };

  const getProgressBadge = (value) => {

    if (value >= 100)
      return "bg-emerald-950 text-emerald-400";

    if (value >= 75)
      return "bg-lime-950 text-lime-400";

    if (value >= 50)
      return "bg-yellow-950 text-yellow-400";

    if (value >= 20)
      return "bg-yellow-950 text-yellow-400";

    if (value > 0)
      return "bg-orange-950 text-orange-400";

    return "bg-red-950 text-red-400";
  };

  const renderStepButton = (step) => {
    const isActive = activeStep === step.id;
    const isDone = step.current === 100;

    // Perfekter Cyberpunk-Style für deine echten Meilensteine
    let buttonStyle = 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-800';
    if (isActive) {
      buttonStyle = 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105 z-10';
    } else if (isDone) {
      buttonStyle = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20';
    }

    return (
      <button
        key={step.id}
        type="button"
        onClick={() => onNavigate && onNavigate(step.target)}
        className={`px-4 py-2 rounded-2xl text-[11px] font-mono font-black uppercase tracking-wider border flex items-center justify-between gap-2 transition-all duration-200 group active:scale-[0.97] text-left min-h-[54px] ${buttonStyle}`}
      >
        <div className="flex flex-col justify-center truncate">

          <span className="font-black tracking-tight block truncate">
            {getStatusIcon(step.current)} {step.label}
          </span>

          <span className={`text-[10px] font-mono tracking-normal block mt-0.5 normal-case ${
            isActive ? 'text-slate-800' : 'text-slate-600 group-hover:text-slate-400'
          }`}>
            {step.sub}
          </span>
        </div>
        
        {/* Die Prozentanzeige rechts im Kasten */}
        <span className={`text-[12px] px-1.5 py-0.5 rounded font-mono font-black shrink-0 transition-colors ${
          isActive
            ? 'bg-slate-950 text-cyan-400'
            : getProgressBadge(step.current)
        }`}>
          {step.current}%
        </span>
      </button>
    );
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 shadow-2xl space-y-3 backdrop-blur-sm">
      
      {/* OBERE REIHE (Schritte 1, 2, 3 nebeneinander) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {topRow.map(renderStepButton)}
      </div>

      {/* UNTERE REIHE (Schritte 4, 5, 6 bündig genau darunter) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {bottomRow.map(renderStepButton)}
      </div>

    </div>
  );
}

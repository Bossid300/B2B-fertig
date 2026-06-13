import React, { useState } from 'react';
import { BarChart3, ArrowRight, CheckCircle2, Flame } from 'lucide-react';
import FahrplanMetrics from './FahrplanMetrics';

export default function TeamVoting({ onBack, progress, onNavigateToStep, onVoteSuccess, activeEvent }) {
  // Simulierter Live-Pool der Fan-Votings
  const [songs, setSongs] = useState([
    { id: 1, title: "Neon Cyber Symphony", votes: 412, category: "Rock-Hymne" },
    { id: 2, title: "Backstage Chaos (Daniel's Mix)", votes: 385, category: "Synth-Wave" },
    { id: 3, title: "Braunau Midnight Gala", votes: 142, category: "Akustik-Ballade" },
  ]);

  const [hasVoted, setHasVoted] = useState(false);
  const totalVotes = songs.reduce((sum, s) => sum + s.votes, 0);

  const handleVote = (id) => {
    if (hasVoted) return;
    
    // Zählt die Stimme live im Speicher hoch
    setSongs(songs.map(s => s.id === id ? { ...s, votes: s.votes + 1 } : s));
    setHasVoted(true);
    
    // Bucht die 100% Fortschritt für das Voting im Hauptsystem ein
    if (typeof onVoteSuccess === 'function') {
      onVoteSuccess();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 my-6 p-4 text-xs text-slate-300 font-mono animate-fade-in">
      
      {/* GLOBALER FAHRPLAN */}
      <FahrplanMetrics progress={progress} activeStep="voting" onNavigate={onNavigateToStep} />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl gap-4">
        <div>
          {activeEvent ? (
            <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-md inline-block mb-1.5">
              📍 Aktives Event: {activeEvent.title} ({activeEvent.date})
            </span>
          ) : (
            <span className="text-[10px] text-cyan-400 font-bold block mb-1">// Ebene 04: Fan-Engagement</span>
          )}
          <h2 className="text-xl font-bold text-white mt-0.5">Team-Voting & Song-Abstimmung</h2>
          <p className="text-slate-400 text-[11px]">Binde deine Fangemeinde direkt ein. Die Fans voten in Echtzeit über die Zugaben der Show.</p>
          {/* 🚨 REKTIVES PROJEKT-BADGE DIREKT UNTER DER ÜBERSCHRIFT */}
          <div className="bg-slate-950/90 border border-cyan-500/30 px-3 py-1.5 rounded-xl flex items-center gap-2 w-max shadow-[0_0_15px_rgba(6,182,212,0.05)] text-[10px]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
            </span>
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px]">// ACTIVE TARGET:</span>
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

      {/* VOTING PLATTFORM */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-purple-400" /> Live-Stimmen-Pool ({totalVotes} Votes)
          </h3>
          <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1 border ${
            hasVoted 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-purple-500/10 text-purple-400 border-purple-500/20 animate-pulse'
          }`}>
            <Flame className="w-3 h-3" /> {hasVoted ? 'Voting beendet' : 'Voting läuft live'}
          </span>
        </div>

        {/* DIEN SONG-LISTE MIT INTERAKTIVEN BALKEN */}
        <div className="space-y-4">
          {songs.map((song) => {
            const percent = totalVotes > 0 ? Math.round((song.votes / totalVotes) * 100) : 0;
            
            return (
              <div key={song.id} className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600">// {song.category}</span>
                    <span className="text-white font-bold">{song.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">{song.votes} Votes</span>
                    <span className="text-cyan-400 font-black min-w-[32px] text-right">{percent}%</span>
                  </div>
                </div>

                {/* Cyberpunk-Fortschrittsbalken */}
                <div className="relative w-full h-9 bg-slate-950 rounded-xl border border-slate-900 overflow-hidden flex items-center justify-between px-3 group">
                  <div 
                    style={{ width: `${percent}%` }}
                    className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-r border-cyan-400/40 transition-all duration-500"
                  />
                  
                  <span className="text-[10px] text-slate-500 relative z-10 font-sans">
                    {hasVoted ? 'Deine Stimme wurde gezählt' : 'Auswahl einreichen'}
                  </span>
                  
                  <button
                    type="button"
                    disabled={hasVoted}
                    onClick={() => handleVote(song.id)}
                    className={`relative z-10 font-black text-[9px] uppercase px-3 py-1 rounded-md transition-all cursor-pointer ${
                      hasVoted 
                        ? 'text-slate-700 bg-slate-900/40 border border-slate-900 cursor-not-allowed' 
                        : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
                    }`}
                  >
                    {hasVoted ? 'Registriert' : '⚡ Vote'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WEITER ZUM PLANNER */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => onNavigateToStep && onNavigateToStep('planner')}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-6 h-11 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
        >
          Nächster Meilenstein: Event-Planner <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
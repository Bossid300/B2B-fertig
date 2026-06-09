import React, { useState } from 'react';
import { ThumbsUp, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import FahrplanMetrics from './FahrplanMetrics';

export default function VotingDashboard({ onBack, onVoteSuccess, progress, onNavigateToStep }) {

  const [votedId, setVotedId] = useState(null);
  const [dates, setDates] = useState([
    { id: 1, date: 'Fr, 18. September 2026', votes: 3, label: 'Favorit (Club frei)' },
    { id: 2, date: 'Sa, 19. September 2026', votes: 1, label: 'Alternativ-Termin' }
  ]);

  const handleVote = (id) => {
    if (votedId) return; // Nur eine Stimme pro Demo-Session
    setVotedId(id);
    setDates(dates.map(d => d.id === id ? { ...d, votes: d.votes + 1 } : d));
    
    if (onVoteSuccess) {
      onVoteSuccess(); // Schaltet die 100% in der Gigsda-Metrik frei!
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 my-4 text-xs select-none">
      
      {/* GLOBALER GIGSDA FAHRPLAN */}
      <div className="mb-6">
        <FahrplanMetrics 
          progress={progress} 
          activeStep="voting" 
          onNavigate={onNavigateToStep} // <-- Reicht den Klick weiter zur App.jsx!
        />
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">// Demokratische Terminfindung</span>
          <h2 className="text-2xl font-black text-white mt-1">Band- & Crew-Voting</h2>
          <p className="text-xs text-slate-400">Stimme intern mit Musikern und Technikern ab, um das Datum final zu fixieren.</p>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* LINKS: VOTING OPTIONEN */}
        <div className="md:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" /> Offene Termin-Abstimmungen
          </h3>

          <div className="space-y-3">
            {dates.map((d) => (
              <div key={d.id} className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${votedId === d.id ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-slate-950/40 border-slate-800'}`}>
                <div>
                  <span className="text-xs font-bold text-white block">{d.date}</span>
                  <span className="text-[10px] font-mono text-slate-500">{d.label}</span>
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-xs font-mono bg-slate-950 px-2 py-1 rounded border border-slate-850 text-slate-400">
                    {d.votes} Crew-Stimmen
                  </span>
                  
                  {votedId ? (
                    <div className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> {votedId === d.id ? 'Deine Stimme' : 'Eingetragen'}
                    </div>
                  ) : (
                    <button 
                      type="button" 
                      onClick={() => handleVote(d.id)}
                      className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1"
                    >
                      <ThumbsUp className="w-3 h-3 fill-slate-950" /> Voten
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECHTS: STATUS & GEFÜHRTES WEITERLEITEN */}
        <div className="md:col-span-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl h-full flex flex-col justify-between min-h-[220px]">
            <div>
              <h3 className="text-xs font-bold text-white uppercase border-b border-slate-800 pb-2 tracking-wider">Abstimmungs-Status</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-3">
                Sobald du deine Stimme abgibst, wird das Demokratie-Prozent-Modul auf 100% gesetzt und der finale Logistik-Countdown für das Event freigeschaltet.
              </p>
            </div>

            {/* HIER PLOPPT DER LOGISCHE WEITER-HEBEL AUF */}
            {votedId && (
              <div className="animate-fade-in pt-4">
                <button 
                  type="button" 
                  onClick={onBack}
                  className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black h-11 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                  Zum Live-Countdown <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

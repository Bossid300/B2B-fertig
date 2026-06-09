import React, { useState } from 'react';
import { CheckCircle2, Circle, ArrowRight, Award, Sparkles, Sliders, MapPin, User } from 'lucide-react';

export default function OnboardingTutorial({ onGoToView }) {
  const [completedSteps, setCompletedSteps] = useState({
    profile: false,
    rider: false,
    radar: false
  });

  const toggleStep = (step) => {
    setCompletedSteps(prev => ({ ...prev, [step]: !prev[step] }));
  };

  const isAllDone = completedSteps.profile && completedSteps.rider && completedSteps.radar;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden my-4">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500 animate-pulse" />
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-4">
        <div>
          <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-black bg-cyan-950/40 border border-cyan-900/30 px-2 py-0.5 rounded-md">// Willkommen im Backstage-Büro</span>
          <h3 className="text-lg font-black text-white mt-1.5 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> Dein Gigsda-Start-Assistent
          </h3>
          <p className="text-slate-400 text-[11px] font-sans">Erledige diese 3 schnellen Schritte, um dein Profil für die Community freizuschalten.</p>
        </div>
        
        {isAllDone && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-1.5 flex items-center gap-2 text-emerald-400 font-mono text-[10px] uppercase font-bold animate-bounce">
            <Award className="w-4 h-4" /> 100% Startbereit!
          </div>
        )}
      </div>

      {/* DETILLIERTE INTERAKTIVE SCHRITTE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* SCHRITT 1: PROFIL */}
        <div className={`p-4 rounded-xl border transition-all flex flex-col justify-between min-h-[140px] ${completedSteps.profile ? 'bg-emerald-500/5 border-emerald-500/30 opacity-80' : 'bg-slate-950/60 border-slate-850'}`}>
          <div className="space-y-1.5">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Schritt 1</span>
              <button type="button" onClick={() => toggleStep('profile')} className="text-slate-500 hover:text-white">
                {completedSteps.profile ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Circle className="w-5 h-5 text-slate-700" />}
              </button>
            </div>
            <h4 className="font-bold text-white text-xs flex items-center gap-1"><User className="w-3.5 h-3.5 text-cyan-400" /> Portfolio befüllen</h4>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">Trage deine Kontaktdaten und Genres ein, um deine op-winston.html scharf zu schalten.</p>
          </div>
          <button type="button" onClick={() => onGoToView('profile')} className="text-[10px] text-cyan-400 hover:underline text-left pt-2 font-bold flex items-center gap-1">Jetzt eintragen <ArrowRight className="w-3 h-3" /></button>
        </div>

        {/* SCHRITT 2: RIDER */}
        <div className={`p-4 rounded-xl border transition-all flex flex-col justify-between min-h-[140px] ${completedSteps.rider ? 'bg-emerald-500/5 border-emerald-500/30 opacity-80' : 'bg-slate-950/60 border-slate-850'}`}>
          <div className="space-y-1.5">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Schritt 2</span>
              <button type="button" onClick={() => toggleStep('rider')} className="text-slate-500 hover:text-white">
                {completedSteps.rider ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Circle className="w-5 h-5 text-slate-700" />}
              </button>
            </div>
            <h4 className="font-bold text-white text-xs flex items-center gap-1"><Sliders className="w-3.5 h-3.5 text-emerald-400" /> Kanalliste absegnen</h4>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">Hinterlege deinen Bühnenbelegungsplan, damit Tontechniker deine Kanäle einsehen können.</p>
          </div>
          <button type="button" onClick={() => onGoToView('stage')} className="text-[10px] text-cyan-400 hover:underline text-left pt-2 font-bold flex items-center gap-1">Rider öffnen <ArrowRight className="w-3 h-3" /></button>
        </div>

        {/* SCHRITT 3: RADAR */}
        <div className={`p-4 rounded-xl border transition-all flex flex-col justify-between min-h-[140px] ${completedSteps.radar ? 'bg-emerald-500/5 border-emerald-500/30 opacity-80' : 'bg-slate-950/60 border-slate-850'}`}>
          <div className="space-y-1.5">
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Schritt 3</span>
              <button type="button" onClick={() => toggleStep('radar')} className="text-slate-500 hover:text-white">
                {completedSteps.radar ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Circle className="w-5 h-5 text-slate-700" />}
              </button>
            </div>
            <h4 className="font-bold text-white text-xs flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-purple-400" /> Umkreis-Radar orten</h4>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">Aktiviere deine GPS-Ortung im Sucher, um Clubs und Gigs in deiner PLZ-Region zu scannen.</p>
          </div>
          <button type="button" onClick={() => onGoToView('search')} className="text-[10px] text-cyan-400 hover:underline text-left pt-2 font-bold flex items-center gap-1">Radar scannen <ArrowRight className="w-3 h-3" /></button>
        </div>

      </div>

    </div>
  );
}

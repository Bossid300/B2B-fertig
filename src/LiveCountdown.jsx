import React, { useState, useEffect } from 'react';
import { Clock, Radio, Users, Ticket, Bell, AlertTriangle } from 'lucide-react';
import FahrplanMetrics from './FahrplanMetrics';

export default function LiveCountdown({ onBack, progress, onNavigateToStep, setProgress, onTriggerGate, activeEvent }) {
  const [ticketCount, setTicketCount] = useState(142);
  const [isLive, setIsLive] = useState(false);
  const [alarmSent, setAlarmSent] = useState(false);

  // Live-Simulator: Lässt die Ticket-Scans im Sekundentakt hochzählen
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setTicketCount(prev => {
        if (prev >= 450) {
          clearInterval(interval);
          return 450;
        }
        return prev + Math.floor(Math.random() * 3) + 1;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [isLive]);

  const handleStartShow = () => {
    setIsLive(true);
    if (typeof setProgress === 'function') {
      setProgress(prev => ({ ...prev, countdown: 100 })); // Setzt das Finale auf 100%
    }
  };

  const handleSendAlarm = () => {
    setAlarmSent(true);
    if (typeof onTriggerGate === 'function') {
      onTriggerGate("🚨 PUSH-ALARM ABGEFEUERT: 'Winston Jud betritt in 15 Minuten die Bühne! Macht euch bereit im Pit!' - Signal an alle Ticketbesitzer übertragen! 💥");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 my-6 p-4 text-xs text-slate-300 font-mono animate-fade-in">
      
      {/* GLOBALER FAHRPLAN */}
      <FahrplanMetrics progress={progress} activeStep="countdown" onNavigate={onNavigateToStep} />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl gap-4">
        <div>
          {activeEvent ? (
            <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-md inline-block mb-1.5">
              📍 Aktives Event: {activeEvent.title} ({activeEvent.date})
            </span>
          ) : (
            <span className="text-[10px] text-cyan-400 font-bold block mb-1">
              // Ebene 06: Live-Countdown
            </span>
          )}
          <h2 className="text-xl font-bold text-white mt-0.5">Live-Countdown & Fan-Signal</h2>
          <p className="text-slate-400 text-[11px]">Überwache den Einlass an den Gates und alarmiere die Fangemeinde kurz vor der Show.</p>
        </div>
        <button type="button" onClick={onBack} className="bg-slate-950 border border-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">
          ‹ Dashboard
        </button>
      </div>

      {/* DETAILED STATS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* MONITORING & SCRIPTS */}
        <div className="md:col-span-8 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-cyan-400" /> Live-Einlass-Überwachung
            </h3>
            <span className={`px-2 py-0.5 rounded font-black text-[9px] uppercase tracking-wider ${
              isLive ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20 animate-pulse' : 'bg-slate-950 text-slate-600'
            }`}>
              {isLive ? '● System Online' : 'Standby'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* CARD 1: SCANNED TICKETS */}
            <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Ticket className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block uppercase">Eingelassene Fans:</span>
                <span className="text-lg font-black text-white tracking-tight">{ticketCount} <span className="text-slate-600 text-xs font-normal">/ 450 Pax</span></span>
              </div>
            </div>

            {/* CARD 2: SHOWTIME COUNTDOWN */}
            <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block uppercase">Verbleibende Zeit:</span>
                <span className="text-lg font-black text-cyan-400 tracking-wider font-mono">
                  {isLive ? '00:14:42' : 'IN STANDBY'}
                </span>
              </div>
            </div>
          </div>

          {/* SYSTEM MESSAGES */}
          <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-4 font-mono text-[10px] text-slate-500 space-y-1.5">
            <p><span className="text-slate-700">18:30:00</span> // [GATES] Scanner-Infrastruktur erfolgreich hochgefahren.</p>
            <p><span className="text-slate-700">18:35:12</span> // [INFO] Erste Ticket-Validierung über Gigsda-Wallet registriert.</p>
            {isLive && <p className="text-emerald-400/80"><span className="text-slate-700">19:02:45</span> // [LIVE] Show-Modus scharfgeschaltet. Einlassfrequenz steigt.</p>}
          </div>
        </div>

        {/* CONTROLS */}
        <div className="md:col-span-4 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl gap-4">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Users className="w-4 h-4 text-purple-400" /> Regiepult
            </h3>
            
            {/* ACTION 1: TRIGGER PUSH ALARM */}
            <button
              type="button"
              disabled={alarmSent}
              onClick={handleSendAlarm}
              className={`w-full font-black text-[9px] uppercase tracking-wider h-10 rounded-xl flex items-center justify-center gap-2 border transition-all active:scale-95 cursor-pointer ${
                alarmSent 
                  ? 'bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed' 
                  : 'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
              }`}
            >
              <Bell className="w-3.5 h-3.5" /> {alarmSent ? 'Push-Alarm gefeuert' : 'Push-Alarm an Fans'}
            </button>
          </div>

          {/* ACTION 2: START EVENT */}
          <button
            type="button"
            disabled={isLive}
            onClick={handleStartShow}
            className={`w-full font-black text-[10px] uppercase tracking-wider h-11 rounded-xl transition-all active:scale-[0.97] flex items-center justify-center gap-1.5 border cursor-pointer ${
              isLive 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-slate-950 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:scale-[1.02]'
            }`}
          >
            {isLive ? '✓ Konzert läuft live' : 'Konzert starten 🚀'}
          </button>
        </div>

      </div>

    </div>
  );
}
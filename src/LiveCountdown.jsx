import React, { useState, useEffect } from 'react';
import { Clock, Radio, Users, Ticket, Bell, AlertTriangle } from 'lucide-react';
import FahrplanMetrics from './FahrplanMetrics';
import EventHeaderBox from "./components/EventHeaderBox";

export default function LiveCountdown({ onBack, progress, onNavigateToStep, setProgress, onTriggerGate, activeEvent }) {

  const countdownStatus =
    activeEvent?.countdownStatus || {};
  const [ticketCount, setTicketCount] = useState(
    countdownStatus.ticketCount || 142
  );
  const [isLive, setIsLive] = useState(
    countdownStatus.isLive || false
  );
  const [alarmSent, setAlarmSent] = useState(
    countdownStatus.alarmSent || false
  );
  const [releaseReady, setReleaseReady] = useState(
    countdownStatus.releaseReady || false
  );

  useEffect(() => {

    setTicketCount(
      countdownStatus.ticketCount || 142
    );

    setIsLive(
      countdownStatus.isLive || false
    );

    setAlarmSent(
      countdownStatus.alarmSent || false
    );

    setReleaseReady(
      countdownStatus.releaseReady || false
    );

  }, [activeEvent]);



  const saveCountdownStatus = (updates) => {
  if (!activeEvent) return;
  const events = JSON.parse(
    localStorage.getItem("gigsda_events") || "[]"
  );
  const updatedEvents = events.map(event => {
    if (event.id !== activeEvent.id) {
      return event;
    }
    return {
      ...event,
      countdownStatus: {
        ticketCount,
        releaseReady,
        alarmSent,
        isLive,
        ...updates
      }
    };
  });

  localStorage.setItem(
    "gigsda_events",
    JSON.stringify(updatedEvents)
  );
};



const handleReleaseEvent = () => {
  setReleaseReady(true);

  saveCountdownStatus({
    releaseReady: true
  });
};



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



  const handleSendAlarm = () => {
    setAlarmSent(true);

    saveCountdownStatus({
      releaseReady: true,
      alarmSent: true
    });
};
    
  const handleStartShow = () => {
    setIsLive(true);

    saveCountdownStatus({
      releaseReady: true,
      alarmSent: true,
      isLive: true
    });
};

const countdownReady =
  progress.shortlist === 100 &&
  progress.stage === 100 &&
  progress.contract === 100 &&
  progress.planner === 100 &&
  progress.promotion === 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6 my-6 p-4 text-xs text-slate-300 font-mono animate-fade-in">
      
      {/* GLOBALER FAHRPLAN */}
      <FahrplanMetrics progress={progress} activeStep="countdown" onNavigate={onNavigateToStep} />


      {/* HEADER Crew-Short-List */}
      <EventHeaderBox
        activeEvent={activeEvent}
        promoImage={activeEvent?.promotionData?.promoImage}
        title="Live-Countdown & Fan-Signal"
        subtitle="Überwache den Einlass an den Gates und alarmiere die Fangemeinde kurz vor der Show."
        /* isOwner={isOwner} */
        onBack={onBack}
      />




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
              {
                isLive
                  ? 'LIVE ● System Online'
                  : alarmSent
                    ? 'PUSH ● System Online'
                    : releaseReady
                      ? 'FREIGEGEBEN ● System Online'
                      : 'STANDBY ● Erwarte Freigabe'
              }
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
                  {
                    isLive
                      ? 'KONZERT LÄUFT LIVE'
                      : alarmSent
                        ? 'PUSH-ALARM GESENDET'
                        : releaseReady
                          ? 'EVENT FREIGEGEBEN'
                          : 'IN STANDBY'
                  }
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
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Users className="w-4 h-4 text-purple-400" /> Regiepult
            </h3>

          {/* ACTION 1: EVENT FREIGEBEN */}
          <button
            type="button"
            onClick={handleReleaseEvent}
            disabled={!countdownReady}
            className={`w-full font-black text-[9px] uppercase tracking-wider h-10 rounded-xl flex items-center justify-center gap-2 border transition-all active:scale-95 cursor-pointer ${
              alarmSent 
                ? 'bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed' 
                : 'bg-green-500/10 border-green-500/30 text-white-400 hover:bg-green-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
            }`}
          >
          {releaseReady
            ? 'EVENT FREIGEGEBEN'
            : 'IN STANDBY 🚨'
          }
          </button>
          
          {/* ACTION 2: TRIGGER PUSH ALARM */}
          <button
            type="button"
            disabled={!releaseReady || alarmSent}
            onClick={handleSendAlarm}
            className={`w-full font-black text-[9px] uppercase tracking-wider h-10 rounded-xl flex items-center justify-center gap-2 border transition-all active:scale-95 cursor-pointer ${
              alarmSent 
                ? 'bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed' 
                : 'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
            }`}
          >
            <Bell className="w-3.5 h-3.5" /> {alarmSent ? 'Push-Alarm gefeuert' : 'Push-Alarm an Fans'}
          </button>

          {/* ACTION 3: START EVENT */}
          <button
            type="button"
            disabled={!alarmSent || isLive}
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
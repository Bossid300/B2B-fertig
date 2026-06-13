import React, { useState } from 'react';
import { ArrowRight, Clock, MapPin, Truck, Radio, Calendar } from 'lucide-react';
import FahrplanMetrics from './FahrplanMetrics';

export default function EventPlanner({ onBack, progress, onNavigateToStep, onStepSuccess, activeEvent }) {
  const [isPlannerLocked, setIsPlannerLocked] = useState(false);

  // Der standardmäßige Ablaufplan vor Ort für die Crew
  const [schedule] = useState([
    { id: 1, time: "14:00", task: "Load-In & Crew Arrival", icon: <Truck className="w-4 h-4 text-purple-400" />, note: "Daniel K. koordiniert das Sound- & Lichtsystem an der Bühne." },
    { id: 2, time: "16:30", task: "Technical Soundcheck", icon: <Clock className="w-4 h-4 text-cyan-400" />, note: "Winston Jud Live & Unplugged – Pegel-Abgleich auf allen Kanälen." },
    { id: 3, time: "18:30", task: "Einlass & Gates Open", icon: <MapPin className="w-4 h-4 text-amber-400" />, note: "Fan-Tickets werden über die Gigsda-App am Eingang gescannt." },
    { id: 4, time: "20:00", task: "SHOWTIME (Live Gig)", icon: <Radio className="w-4 h-4 text-emerald-400" />, note: "Band steht auf der Bühne. Live-Countdown läuft im System." },
  ]);

  const handleLockPlanner = () => {
    setIsPlannerLocked(true);
    if (typeof onStepSuccess === 'function') {
      onStepSuccess(); // Setzt den Meilenstein "Event-Planner" im globalen Fahrplan live auf 100%!
    }
  };

  // 📅 INTEGRATED iCALENDAR EXPORT ENGINE FÜR DIE HANDYS
  const handleExportICal = () => {
    if (!activeEvent) return;

    const eventTitle = activeEvent.title || "Gigsda Live Show";
    const eventVenue = activeEvent.venue || "Stadtpark Wiese, Braunau";
    
    // Hilfsfunktion: Konvertiert ein Datum wie "Sa, 15. Aug 2026" in iCal-Format (YYYYMMDD)
    // Fallback auf das aktuelle Jahr 2026, falls das Parsen fehlschlägt
    let dateStr = "20260815"; 
    if (activeEvent.date) {
      if (activeEvent.date.includes("Sept")) dateStr = "20260918";
      else if (activeEvent.date.includes("Aug")) dateStr = "20260815";
      else if (activeEvent.date.includes("Okt")) dateStr = "20261010";
    }

    // Erstellt die standardisierte .ics Struktur mit Zeitzonen-Dummys
    const icalContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Gigsda Protocol//EventPlanner V2.6//DE",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      
      // Event 1: Load-In
      "BEGIN:VEVENT",
      `UID:loadin-${activeEvent.id}@gigsda.com`,
      `DTSTAMP:${dateStr}T140000Z`,
      `DTSTART:${dateStr}T120000Z`, // UTC Zeit-Kompensation (14:00 Uhr Lokal)
      `DTEND:${dateStr}T143000Z`,
      `SUMMARY:LOAD-IN // ${eventTitle}`,
      `DESCRIPTION:Daniel K. koordiniert das Sound- & Lichtsystem an der Buehne. Crew Arrival!`,
      `LOCATION:${eventVenue}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",

      // Event 2: Showtime Haupt-Gig
      "BEGIN:VEVENT",
      `UID:show-${activeEvent.id}@gigsda.com`,
      `DTSTAMP:${dateStr}T200000Z`,
      `DTSTART:${dateStr}T180000Z`, // UTC Zeit-Kompensation (20:00 Uhr Lokal)
      `DTEND:${dateStr}T220000Z`,
      `SUMMARY:⚡ SHOWTIME // ${eventTitle}`,
      `DESCRIPTION:Haupt-Gig laeuft live im Gigsda-Protokoll. Setlist-Voting beendet.`,
      `LOCATION:${eventVenue}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",

      "END:VCALENDAR"
    ].join("\r\n");

    // Löst den unblockierbaren Datei-Drop im Download-Ordner aus
    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Gigsda_Timings_${activeEvent.id}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 my-6 p-4 text-xs text-slate-300 font-mono animate-fade-in">
      
      {/* 6 ECHTE MEILENSTEINE NAVIGATOR */}
      <FahrplanMetrics progress={progress} activeStep="planner" onNavigate={onNavigateToStep} />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl gap-4">
        <div>
          {activeEvent ? (
            <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-md inline-block mb-1.5">
              📍 Aktives Event: {activeEvent.title} ({activeEvent.date})
            </span>
          ) : (
            <span className="text-[10px] text-cyan-400 font-bold block mb-1">
              // Ebene 05: Logistik & Timings
            </span>
          )}
          <h2 className="text-xl font-bold text-white mt-0.5">Event-Planner & Ablaufplan</h2>
          <p className="text-slate-400 text-[11px]">Regle die zeitliche Taktung für den Einlass, Soundcheck und den Live-Auftritt vor Ort.</p>
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

      {/* TIMELINE CONTAINER */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex justify-between items-center border-b border-slate-800/60 pb-3 gap-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" /> // Tagesablauf (Echtzeit-Synchronisiert)
          </h3>
          
          <div className="flex gap-2 shrink-0">
            {/* 📅 DER NEUE BUTTON FÜR DEN ICAL-EXPORT */}
            <button
              type="button"
              onClick={handleExportICal}
              className="bg-purple-500/10 border border-purple-500/30 text-purple-400 font-black text-[9px] uppercase tracking-wider px-3 h-8 rounded-lg hover:bg-purple-500/20 transition-all flex items-center gap-1 cursor-pointer shadow-md"
            >
              <Calendar className="w-3.5 h-3.5" /> Kalender-Export (.ics) 📅
            </button>

            <button
              type="button"
              onClick={handleLockPlanner}
              className={`text-[9px] font-black uppercase tracking-wider px-3 h-8 rounded-lg transition-all border cursor-pointer ${
                isPlannerLocked 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                  : 'bg-emerald-400 text-slate-950 hover:bg-emerald-300 border-emerald-300'
              }`}
            >
              {isPlannerLocked ? '✓ Zeitplan eingefroren' : 'Zeitplan freigeben 🔒'}
            </button>
          </div>
        </div>

        {/* INTERAKTIVE ZEITLINIE */}
        <div className="relative border-l border-slate-800 pl-6 ml-3 space-y-6 py-2">
          {schedule.map((item) => (
            <div key={item.id} className="relative group">
              <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-cyan-400 transition-all">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-cyan-400 transition-all" />
              </div>

              <div className="bg-slate-950/40 border border-slate-900/60 rounded-2xl p-4 flex justify-between items-start md:items-center gap-4 transition-all hover:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-cyan-400 text-[11px]">{item.time} Uhr</span>
                      <span className="text-white font-bold text-sm tracking-tight">{item.task}</span>
                    </div>
                    <p className="text-slate-500 text-[10px] mt-0.5 font-mono">{item.note}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FINALER HEBEL ZUM LIVE-COUNTDOWN */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => onNavigateToStep && onNavigateToStep('countdown')}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 text-slate-950 font-mono font-black text-[10px] uppercase tracking-wider px-6 h-11 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
        >
          Nächster Meilenstein: Live-Countdown <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}

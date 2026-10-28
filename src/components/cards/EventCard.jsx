import React, { useState } from "react";
import ReportContentLink from '../ReportContentLink';


  // 🗺️ DIE LIVE-ENTFERNUNGSMATRIX (Exakt identisch zum SearchExplorer von eurer Heimatbasis Braunau)
  const getDistanceTo = (city) => {
    const target = (city || '').toLowerCase().trim();
    if (target.includes('braunau')) return 0;   // Direkt vor Ort
    if (target.includes('altötting')) return 28; // ca. 28 km entfernt
    if (target.includes('linz')) return 120;     // ca. 120 km entfernt
    if (target.includes('wien')) return 290;     // ca. 290 km entfernt
    return 45; // Fallback
  };


export default function EventCard({
  event,
  onViewEvent,
}) {

  const [expanded, setExpanded] = useState(false);

  if (!event) return null;

  const eventDate =
  event.date ||
  event.event_date;

  let weekday = '--';
  let dateLabel = '--.--';

    if (
      eventDate &&
      /^\d{4}-\d{2}-\d{2}$/.test(eventDate)
    ) {
      const date =
        new Date(eventDate);

      const weekdays = [
        'SO',
        'MO',
        'DI',
        'MI',
        'DO',
        'FR',
        'SA'
      ];

      const months = [
        'JAN',
        'FEB',
        'MÄR',
        'APR',
        'MAI',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OKT',
        'NOV',
        'DEZ'
      ];

      weekday =
        weekdays[date.getDay()];

      dateLabel =
        `${String(date.getDate()).padStart(2,'0')}.${months[date.getMonth()]}`;
    }


  const venueParts = (event.city || "").split(",").map(v => v.trim());

  const venueName = venueParts[0] || "";
  const venueAddress = venueParts[1] || "";
  const venueCity = venueParts.slice(2).join(", ");

  return (

    <div className="
        bg-slate-950 border border-slate-900 rounded-2xl 
        shadow-2xl relative overflow-hidden flex flex-col 
        group hover:border-slate-800 transition-all duration-300 
        min-h-[300px] transform hover:scale-[1.03] hover:shadow-2xl">

        {/* 1. KLICKBARER HEADER-BEREICH (Öffnet und schließt die Karte) */}
        <div 
          onClick={() => setExpanded(!expanded)} 
          className="cursor-pointer select-none"
        >
          {/* OBERES BANNER-BILD */}
          <div className="h-24 w-full relative overflow-hidden bg-slate-900">
          <img
              src={event.slide1_url}
              alt="Event Banner"/>
              <span
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
              >
              {event.category}
              </span>
          </div>
        </div>

        {/* DATUM AVATAR */}
        <div className="absolute top-12 left-4 z-20">
          <div className="w-20 h-20 rounded-xl border-2 border-slate-950 overflow-hidden bg-slate-900 shadow-xl flex flex-col items-center justify-center text-center font-mon">
            <span className="text-[10px] font-black text-cyan-400 tracking-wider">
              DATE
            </span>
            <span className="text-[10px] font-black text-white">
              {weekday}
            </span>
            <span className="text-[11px] font-black text-white">
              {dateLabel}
            </span>
          </div>
        </div>

        <div className="p-4 pt-7 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-md font-black uppercase text-white pt-2 line-clamp-2">
            {event.title}
            </h3>
            <p className="text-sm text-slate-400 mt-1 line-clamp-2">
            {event.shortDescription}
            </p>
            {event.category && (
            <div className="mt-2">
              <span className=" text-sm uppercase font-bold tracking-wider text-cyan-400">
              #{event.category}
              </span>
            </div>
            )}
          <div className="pt-3 border-t border-slate-900 flex justify-between text-xs text-slate-400">
              {event.entryTime && (
                <div className="text-sm text-slate-400">
                  🕒 Einlass {event.entryTime}
                </div>
              )}
              {event.startTime && (
                <div className="text-sm text-slate-400">
                  🎵 Beginn {event.startTime}
                </div>
              )}
            </div>
            <p className="text-xs text-slate-600 uppercase mt-0.5">
              EVENT-ID: {event.id}
            </p>
            <p className="text-xs text-slate-600 uppercase mt-0.5">
              {event.ownerName && (
                <> VERANSTALTER: {event.ownerName}</>
              )}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-900 flex justify-between text-xs text-slate-400">
            {/* STADT / LOCATION */}
            <div className="flex flex-col min-w-0">
              <span className="text-slate-400 uppercase mb-1">
                Stadt
              </span>

              <strong className="text-slate-200 leading-tight">
                {venueName}
              </strong>

              <span className="text-slate-400 leading-tight">
                {venueAddress}
              </span>

              <span className="text-slate-400 leading-tight">
                {venueCity}
              </span>
            </div>

            <span>
              DISTANZ:
              <strong className="text-cyan-400 ml-1">
                {getDistanceTo(event.city)} KM
              </strong>
            </span>
          </div>

          <div className="mt-3">
            <ReportContentLink
              contentType="Event"
              contentId={event.id || event.eventId || event._id}
              title={event.title}
              className="inline-flex rounded-lg border border-amber-500/30 px-3 py-2 text-xs font-semibold text-amber-300 transition hover:border-amber-400 hover:text-amber-200"
            />
          </div>
          
        </div>

        {/* 3. EXPANDED-DETAILS BEREICH (Schon perfekt abgesichert) */}
        {expanded && (
          <div className="border-t border-cyan-500/20 p-4 bg-slate-950/80">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-500">Tickets</span>
                <div className="text-white font-bold">
                  {event.ticketPrice || "-"}
                </div>
              </div>

              <div>
                <span className="text-slate-500">Status</span>
                <div className="text-orange-400 font-bold">
                  {event.ticketStatus || "-"}
                </div>
              </div>

              <div>
                <span className="text-slate-500">FSK</span>
                <div className="text-white">
                  {event.fsk || "-"}
                </div>
              </div>

              <div>
                <span className="text-slate-500">Line-Up</span>
                <div className="text-white">
                  {
                    event.lineup
                      ? event.lineup.split("\n").filter(Boolean).length + " Acts"
                      : "-"
                  }
                </div>
              </div>
            </div>

              <div>
                <span className="text-slate-500 pt-10">Annehmlichkeiten</span>
                <div className="text-xs text-white">
                  {event.amenities || "-"}
                </div>
              </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewEvent?.(event);
              }}
              className="
                w-full
                mt-4
                py-2.5
                rounded-xl
                border
                border-purple-500/30
                bg-purple-500/10
                text-purple-300
                text-sm
                font-black
                uppercase
                tracking-wider
                hover:bg-purple-500/20
                hover:border-purple-400/60
                hover:text-white
                transition-all
                duration-300
              "
            >
              Details
            </button>

            <button
              onClick={() => {
                alert(
                  "⚡ GIGSDA TICKET-GATE\n\nDiese Funktion befindet sich aktuell im Aufbau.\n\nDie Anbindung an Ticketanbieter folgt in einem kommenden Update."
                );
              }}
              className="mt-4 bg-cyan-500/5 border border-cyan-500/20 hover:border-cyan-500/50 text-cyan-400 text-sm font-bold uppercase py-2 rounded-xl transition-all duration-300 cursor-pointer text-center tracking-wider w-full"
            >
              TICKET
            </button>

          </div>
        )}

    </div>
  );
}
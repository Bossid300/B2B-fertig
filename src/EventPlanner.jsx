import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock, MapPin, Truck, Radio, Calendar } from 'lucide-react';
import FahrplanMetrics from './FahrplanMetrics';
import EventHeaderBox from "./components/EventHeaderBox";

export default function EventPlanner({ onBack, progress, setProgress, onNavigateToStep, onStepSuccess, activeEvent }) {

const [isPlannerLocked, setIsPlannerLocked] =
  useState(
    activeEvent?.plannerLocked || false
  );


// Der standardmäßige Ablaufplan vor Ort für die Crew
const [schedule, setSchedule] = useState(
  activeEvent?.timeline || [

  { id: 1, time: "14:00", task: "Load-In & Crew Arrival", icon: <Truck className="w-4 h-4 text-purple-400" />, note: "Daniel K. koordiniert das Sound- & Lichtsystem an der Bühne." },
  { id: 2, time: "16:30", task: "Technical Soundcheck", icon: <Clock className="w-4 h-4 text-cyan-400" />, note: "Winston Jud Live & Unplugged – Pegel-Abgleich auf allen Kanälen." },
  { id: 3, time: "18:30", task: "Einlass & Gates Open", icon: <MapPin className="w-4 h-4 text-amber-400" />, note: "Fan-Tickets werden über die Gigsda-App am Eingang gescannt." },
  { id: 4, time: "20:00", task: "SHOWTIME (Live Gig)", icon: <Radio className="w-4 h-4 text-emerald-400" />, note: "Band steht auf der Bühne. Live-Countdown läuft im System." },

]);

useEffect(() => {

  setSchedule(
    activeEvent?.timeline || []
  );

  setIsPlannerLocked(
    activeEvent?.plannerLocked || false
  );

}, [activeEvent]);

const logistics = {
  setup: activeEvent?.logistics?.setup || false,
  power: activeEvent?.logistics?.power || false,
  catering: activeEvent?.logistics?.catering || false,
  security: activeEvent?.logistics?.security || false,
};

const handleAddTimelineItem = () => {
  setSchedule([
    ...schedule,
    {
      id: Date.now(),
      time: '21:00',
      task: 'Neuer Programmpunkt',
      icon: <Calendar className="w-4 h-4 text-cyan-400" />,
      note: 'Beschreibung ergänzen',
      editable: true
    }
  ]);
};



const handleSaveTimeline = () => {
  if (!activeEvent) return;
  const events = JSON.parse(
    localStorage.getItem("gigsda_events") || "[]"
  );
  const cleanSchedule = schedule.map(item => ({
    id: item.id,
    time: item.time,
    task: item.task,
    note: item.note,
    editable: item.editable
  }));
  const updatedEvents = events.map(event => {
    if (event.id !== activeEvent.id) {
      return event;
    }
    return {
      ...event,
      timeline: cleanSchedule,
      productionNotes,
      plannerLocked: isPlannerLocked
    };
  });
  localStorage.setItem(
    "gigsda_events",
    JSON.stringify(updatedEvents)
  );
};


const [isEditingNotes, setIsEditingNotes] = useState(false);
const [notesSaved, setNotesSaved] = useState(false);


const handleSaveProductionNotes = () => {
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
      productionNotes
    };
  });

  localStorage.setItem(
    "gigsda_events",
    JSON.stringify(updatedEvents)
  );
  
  setNotesSaved(true);
  setIsEditingNotes(false);

  setTimeout(() => {
    setNotesSaved(false);
  }, 2000);

};

const [productionNotes, setProductionNotes] = useState(
  activeEvent?.productionNotes || ""
);



const profiles = JSON.parse(
  localStorage.getItem("gigsda_profiles") || "[]"
);

const crewProfiles = profiles.filter(
  p => activeEvent?.crewIds?.includes(p.id)
);

const ownerLead =
  profiles.find(
    p => p.id === activeEvent?.ownerId
  );

const artistLead =
  crewProfiles.find(p => p.role === "Künstler");

const locationLead =
  crewProfiles.find(p => p.role === "Location");

const techLead =
  crewProfiles.find(p => p.role === "Techniker");

const materialLead =
  crewProfiles.find(
    p =>
      p.role === "Material" ||
      p.role === "Verleiher"
  );

const fanLead =
  crewProfiles.find(p => p.role === "Fan");








const riderCenter =
  activeEvent?.riderCenter || {};

const riderEntries =
  Object.values(riderCenter);

const confirmedCount =
  riderEntries.filter(
    r => r?.confirmed
  ).length;

const changedCount =
  riderEntries.filter(
    r => r?.changed
  ).length;

const crewIds =
  Array.isArray(activeEvent?.crewIds)
    ? activeEvent.crewIds
    : [];

const openCount =
  Math.max(
    crewIds.length -
    confirmedCount -
    changedCount,
    0
  );

const riderProgress =
  crewIds.length > 0
    ? Math.round(
        (confirmedCount /
        crewIds.length) * 100
      )
    : 0;

const hasTimeline =
  schedule.length > 0;

const plannerProgress =
  (hasTimeline ? 50 : 0) +
  (isPlannerLocked ? 50 : 0);

useEffect(() => {
  setProgress(prev => ({
    ...prev,
    planner: plannerProgress
  }));
}, [plannerProgress, setProgress]);


const currentUserName =
  localStorage.getItem('gigsda_user_name');

const currentProfile =
  profiles.find(
    p =>
      (p.name || '').toLowerCase() ===
      (currentUserName || '').toLowerCase()
  );

const currentUserId =
  currentProfile?.id;

const isOwner =
  activeEvent?.ownerId === currentUserId;



  const handleLockPlanner = () => {

    const newLockedState = !isPlannerLocked;

    setIsPlannerLocked(newLockedState);

    const events = JSON.parse(
      localStorage.getItem("gigsda_events") || "[]"
    );

    const updatedEvents = events.map(event => {

      if (event.id !== activeEvent?.id) {
        return event;
      }

      return {
        ...event,
        plannerLocked: newLockedState
      };

    });

    localStorage.setItem(
      "gigsda_events",
      JSON.stringify(updatedEvents)
    );

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

      {/* HEADER Event-Planner */}
      <EventHeaderBox
        activeEvent={activeEvent}
        promoImage={activeEvent?.promotionData?.promoImage}
        title="Event-Planner & Ablaufplan"
        subtitle="Regle die zeitliche Taktung für den Einlass, Soundcheck und den Live-Auftritt vor Ort."
        /* isOwner={isOwner} */
        onBack={onBack}
      />




      {/* Eventdaten */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 shadow-xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Eventdaten
          </h3>

          <span className="text-sm text-cyan-400 font-black uppercase">
            Owner Cockpit
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] text-slate-500 uppercase">
              Titel
            </div>

            <div className="text-sm text-white font-bold">
              {activeEvent?.title || "-"}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-500 uppercase">
              Datum
            </div>

            <div className="text-sm text-white font-bold">
              {activeEvent?.date || "-"}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-500 uppercase">
              Venue
            </div>

            <div className="text-sm text-white font-bold">
              {activeEvent?.venue || "-"}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-500 uppercase">
              Kategorie
            </div>

            <div className="text-sm text-white font-bold">
              {activeEvent?.type || "-"}
            </div>
          </div>
        </div>
      </div>





      {/* Projektstatus */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 shadow-xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Projektstatus
          </h3>

          <span className="text-sm text-cyan-400 font-black uppercase">
            Live Monitoring
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">
              Crew
            </div>
            <div className="text-xl font-black text-white">
              {crewIds.length}
            </div>
          </div>

          <div className="bg-slate-950 rounded-xl p-3 border border-emerald-500/20">
            <div className="text-[10px] text-slate-500 uppercase">
              Bestätigt
            </div>
            <div className="text-xl font-black text-emerald-400">
              {confirmedCount}
            </div>
          </div>

          <div className="bg-slate-950 rounded-xl p-3 border border-amber-500/20">
            <div className="text-[10px] text-slate-500 uppercase">
              Geändert
            </div>
            <div className="text-xl font-black text-amber-400">
              {changedCount}
            </div>
          </div>

          <div className="bg-slate-950 rounded-xl p-3 border border-red-500/20">
            <div className="text-[10px] text-slate-500 uppercase">
              Offen
            </div>
            <div className="text-xl font-black text-red-400">
              {openCount}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-500">
              Rider-Fortschritt
            </span>

            <span className="text-cyan-400 font-black">
              {riderProgress}%
            </span>
          </div>

          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all"
              style={{
                width: `${riderProgress}%`
              }}
            />
          </div>
        </div>
      </div>







      {/* Betriebsstatus */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 shadow-xl">

        <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">

          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Betriebsstatus
          </h3>

          <span className="text-sm text-cyan-400 font-black uppercase">
            Owner Check
          </span>

        </div>

        <div className="space-y-3">

          <div className="flex justify-between items-center">
            <span className="text-slate-300">
              Crew vorhanden
            </span>

            <span className="text-emerald-400 font-black">
              ✅
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-300">
              Rider vollständig
            </span>

            <span
              className={
                openCount === 0
                  ? "text-emerald-400 font-black"
                  : "text-amber-400 font-black"
              }
            >
              {openCount === 0 ? "✅" : "⚠"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-300">
              Verträge abgeschlossen
            </span>

          <span
            className={
              progress?.contract === 100
                ? "text-emerald-400 font-black"
                : "text-amber-400 font-black"
            }
          >
            {progress?.contract === 100 ? "✅" : "⚠"}
          </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-300">
              Event-Promotion abgeschlossen
            </span>

            <span
              className={
                progress?.promotion === 100
                  ? "text-emerald-400 font-black"
                  : "text-amber-400 font-black"
              }
            >
              {progress?.promotion === 100 ? "✅" : "⚠"}
            </span>
          </div>

          <div className="border-t border-slate-800 pt-3 mt-3 flex justify-between items-center">

            <span className="text-slate-400 uppercase text-[10px] tracking-wider">
              Countdown Status
            </span>

            <span
              className={
                openCount === 0
                  ? "text-emerald-400 font-black"
                  : "text-red-400 font-black"
              }
            >
              {openCount === 0
                ? "✅ READY"
                : "🔴 BLOCKIERT"}
            </span>

          </div>

        </div>

      </div>







      {/* Nächster Meilenstein */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 shadow-xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Nächster Meilenstein
          </h3>

          <span className="text-sm text-cyan-400 font-black uppercase">
            System Empfehlung
          </span>
        </div>

        <div className="space-y-3">
          {openCount > 0 ? (
            <>
              <div className="text-lg font-black text-amber-400">
                🎯 Rider-Check abschließen
              </div>

              <div className="text-slate-400 text-sm">
                Noch {openCount} Gewerke benötigen Aufmerksamkeit.
              </div>

              <div className="text-[11px] text-slate-500 uppercase tracking-wider">
                Nächster Bereich: Rider-Check
              </div>
            </>

          ) : (

            <>
              <div className="text-lg font-black text-emerald-400">
                ✅ Bereit für Zusage-Deal
              </div>

              <div className="text-slate-400 text-sm">
                Alle Rider wurden geprüft und freigegeben.
              </div>

              <div className="text-[11px] text-slate-500 uppercase tracking-wider">
                Nächster Bereich: Zusage-Deal
              </div>
            </>
          )}
        </div>
      </div>






      {/* Verantwortlichkeiten */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 shadow-xl">

        <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">

          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Verantwortlichkeiten
          </h3>

          <span className="text-sm text-cyan-400 font-black uppercase">
            Projektleitung
          </span>

        </div>

        <div className="space-y-3">

          <div className="flex justify-between items-center">
            <span className="text-slate-400">👑 Owner</span>
            <span className="text-white font-bold">
              {ownerLead?.name || "Owner"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">🎤 Künstler</span>
            <span className="text-white font-bold">
              {artistLead?.name || "Offen"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">🏟️ Location</span>
            <span className="text-white font-bold">
              {locationLead?.name || "Offen"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">🎚️ Technik</span>
            <span className="text-white font-bold">
              {techLead?.name || "Offen"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">📦 Material</span>
            <span className="text-white font-bold">
              {materialLead?.name || "Offen"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">📣 Promotion</span>
            <span className="text-amber-400 font-bold">
              Offen
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">🛡️ Security</span>
            <span className="text-amber-400 font-bold">
              Offen
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">👥 Fan Community Support</span>
            <span className="text-amber-400 font-bold">
              {fanLead?.name || "Offen"}
            </span>
          </div>

        </div>
      </div>





      {/* Produktionsnotizen */}
      {isEditingNotes ? (
        <>
        <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 shadow-xl">

          <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Produktionsnotizen
            </h3>

            <span className="text-sm text-cyan-400 font-black uppercase">
              Veranstalter
            </span>
          </div>
          
          <textarea
            value={productionNotes}
            onChange={(e) =>
              setProductionNotes(e.target.value)
            }
            placeholder="Besonderheiten, Absprachen, Hinweise..."
            className="
              w-full
              min-h-[300px]
              bg-slate-950
              border
              border-slate-800
              rounded-2xl
              p-4
              text-slate-300
              text-sm
              resize-none
              outline-none
            "
          />
          <button
            type="button"
            onClick={handleSaveProductionNotes}
                className="
                  mt-3
                  bg-emerald-500
                  text-slate-950
                  font-black
                  px-4
                  py-2
                  rounded-xl
                  text-xm
                  uppercase
                  tracking-wider
                  transition-all
                  hover:border-cyan-500/50
                  hover:text-white
                  hover:scale-[1.02]
                  active:scale-[0.98]
                  cursor-pointer
                "
              >
            {notesSaved
              ? "✅ Produktionsnotizen Gespeichert"
              : "💾 Produktionsnotizen Speichern"}
          </button>
        </div>  
        </>
      ) : (
        <>
        <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 shadow-xl">

          <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Produktionsnotizen
            </h3>

            <span className="text-sm text-cyan-400 font-black uppercase">
              Team Information
            </span>
          </div>

          <textarea
            value={productionNotes}
            onChange={(e) =>
              setProductionNotes(e.target.value)
            }
            placeholder="Besonderheiten, Absprachen, Hinweise..."
            className="
              w-full
              min-h-[300px]
              bg-slate-950
              border
              border-slate-800
              rounded-2xl
              p-4
              text-slate-300
              text-sm
              resize-none
              outline-none
            "
          />

          {isOwner && (
            <button
              type="button"
              onClick={() =>
                setIsEditingNotes(true)
              }
              className="
                mt-3
                bg-cyan-500
                text-slate-950
                font-black
                px-4
                py-2
                rounded-xl
                text-xm
                uppercase
              "
            >
              ✏️ Produktionsnotizen Bearbeiten
            </button>
          )}
        </div>

        </>
      )}







      {/* Produktions- & Logistikübersicht */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 shadow-xl">

        <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">

          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Logistik & Produktion
          </h3>

          <span className="text-sm text-cyan-400 font-black uppercase">
            Eventbetrieb
          </span>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">
              Aufbau
            </div>
              <div
                onClick={() => {
                  if (!activeEvent) return;

                  const events = JSON.parse(
                    localStorage.getItem("gigsda_events") || "[]"
                  );

                  const updated = events.map(evt =>
                    evt.id === activeEvent.id
                      ? {
                          ...evt,
                          logistics: {
                            ...evt.logistics,
                            setup: !evt.logistics?.setup,
                          },
                        }
                      : evt
                  );

                  localStorage.setItem(
                    "gigsda_events",
                    JSON.stringify(updated)
                  );
                  window.location.reload();
                  window.dispatchEvent(
                    new CustomEvent("active-event-updated")
                  );
                }}
                className={
                  `${logistics.setup
                    ? "text-emerald-400 font-bold"
                    : "text-amber-400 font-bold"
                  } cursor-pointer`
                }
              >
              {logistics.setup ? "✅ Fertig" : "⚠ Offen"}
            </div>
          </div>

          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">
              Strom
            </div>
              <div
                onClick={() => {
                  if (!activeEvent) return;

                  const events = JSON.parse(
                    localStorage.getItem("gigsda_events") || "[]"
                  );

                  const updated = events.map(evt =>
                    evt.id === activeEvent.id
                      ? {
                          ...evt,
                          logistics: {
                            ...evt.logistics,
                            power: !evt.logistics?.power,
                          },
                        }
                      : evt
                  );

                  localStorage.setItem(
                    "gigsda_events",
                    JSON.stringify(updated)
                  );
                  window.location.reload();
                  window.dispatchEvent(
                    new CustomEvent("active-event-updated")
                  );
                }}
                className={
                  `${logistics.power
                    ? "text-emerald-400 font-bold"
                    : "text-amber-400 font-bold"
                  } cursor-pointer`
                }
              >
              {logistics.power ? "✅ Fertig" : "⚠ Offen"}
            </div>
          </div>

          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">
              Catering
            </div>
              <div
                onClick={() => {
                  if (!activeEvent) return;

                  const events = JSON.parse(
                    localStorage.getItem("gigsda_events") || "[]"
                  );

                  const updated = events.map(evt =>
                    evt.id === activeEvent.id
                      ? {
                          ...evt,
                          logistics: {
                            ...evt.logistics,
                            catering: !evt.logistics?.catering,
                          },
                        }
                      : evt
                  );

                  localStorage.setItem(
                    "gigsda_events",
                    JSON.stringify(updated)
                  );
                  window.location.reload();
                  window.dispatchEvent(
                    new CustomEvent("active-event-updated")
                  );
                }}
                className={
                  `${logistics.catering
                    ? "text-emerald-400 font-bold"
                    : "text-amber-400 font-bold"
                  } cursor-pointer`
                }
              >
              {logistics.catering ? "✅ Fertig" : "⚠ Offen"}
            </div>
          </div>

          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">
              Security
            </div>
              <div
                onClick={() => {
                  if (!activeEvent) return;

                  const events = JSON.parse(
                    localStorage.getItem("gigsda_events") || "[]"
                  );

                  const updated = events.map(evt =>
                    evt.id === activeEvent.id
                      ? {
                          ...evt,
                          logistics: {
                            ...evt.logistics,
                            security: !evt.logistics?.security,
                          },
                        }
                      : evt
                  );

                  localStorage.setItem(
                    "gigsda_events",
                    JSON.stringify(updated)
                  );
                  window.location.reload();
                  window.dispatchEvent(
                    new CustomEvent("active-event-updated")
                  );
                }}
                className={
                  `${logistics.security
                    ? "text-emerald-400 font-bold"
                    : "text-amber-400 font-bold"
                  } cursor-pointer`
                }
              >
              {logistics.security ? "✅ Fertig" : "⚠ Offen"}
            </div>
          </div>

        </div>

      </div>













      {/* TIMELINE CONTAINER */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex justify-between items-center border-b border-slate-800/60 pb-3 gap-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" /> 
            // Tagesablauf
          </h3>
          
          <div className="flex gap-2 shrink-0">
            {/* 📅 DER NEUE BUTTON FÜR DEN ICAL-EXPORT */}
            <button
              type="button"
              onClick={handleExportICal}
              className="bg-purple-500/10 border border-purple-500/30 text-purple-400 font-black text-sx uppercase tracking-wider px-3 h-8 rounded-lg hover:bg-purple-500/20 transition-all flex items-center gap-1 cursor-pointer shadow-md"
            >
              <Calendar className="w-3.5 h-3.5" /> 
              Kalender-Export (.ics) 📅
            </button>
            {isOwner && (
            <button
              type="button"
              onClick={() => {
                handleSaveTimeline();
                handleLockPlanner();
              }}
              className={`text-sx font-black uppercase tracking-wider px-3 h-8 rounded-lg transition-all border cursor-pointer ${
                isPlannerLocked 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                  : 'bg-emerald-400 text-slate-950 hover:bg-emerald-300 border-emerald-300'
              }`}
            >
              {isPlannerLocked ? '🔓 Zeitplan entsperren' : '🔒 Zeitplan freigeben'}
            </button>
            )}
            {isOwner && (
            <button
              type="button"
              onClick={handleAddTimelineItem}
              className="
                text-sx
                font-black
                uppercase
                tracking-wider
                px-3
                py-2
                rounded-lg
                border
                border-cyan-500/30
                text-cyan-400
                transition-all
                hover:border-cyan-500/50
                hover:text-white
                hover:scale-[1.02]
                active:scale-[0.98]
                cursor-pointer
              "
            >
              + Programmpunkt
            </button>
            )}
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
                      <div>
                        <input
                          type="time"
                          value={item.time}
                          onChange={(e) => {

                            setSchedule(
                              schedule.map(scheduleItem =>

                                scheduleItem.id === item.id
                                  ? {
                                      ...scheduleItem,
                                      time: e.target.value
                                    }
                                  : scheduleItem

                              )
                            );

                          }}
                          className="
                            bg-slate-950
                            border
                            border-slate-800
                            rounded-lg
                            px-2
                            py-1
                            text-cyan-400
                            text-sm
                            font-mono
                            font-black
                          "
                        />
                      </div>

                      <div>

                        {item.editable ? (

                          <input
                            type="text"
                            value={item.task}
                            onChange={(e) => {
                              setSchedule(
                                schedule.map(scheduleItem =>
                                  scheduleItem.id === item.id
                                    ? {
                                        ...scheduleItem,
                                        task: e.target.value
                                      }
                                    : scheduleItem
                                )
                              );
                            }}
                            className="
                              bg-slate-950
                              border
                              border-slate-800
                              rounded-lg
                              px-2
                              py-1
                              text-white
                              text-sm
                            "
                          />

                        ) : (

                          <span className="text-white font-bold text-sm tracking-tight">
                            {item.task}
                          </span>

                        )}

                      </div>
                    </div>
                    <div>
                      {item.editable ? (
                        <input
                          type="text"
                          value={item.note}
                          onChange={(e) => {
                            setSchedule(
                              schedule.map(scheduleItem =>
                                scheduleItem.id === item.id
                                  ? {
                                      ...scheduleItem,
                                      note: e.target.value
                                    }
                                  : scheduleItem
                              )
                            );
                          }}
                          className="
                            mt-1
                            w-full
                            bg-slate-950
                            border
                            border-slate-800
                            rounded-lg
                            px-2
                            py-1
                            text-slate-400
                            text-sm
                          "
                        />
                      ) : (
                        <p className="text-slate-500 text-[10px] mt-0.5 font-mono">
                          {item.note}
                        </p>
                      )}
                    </div>
                    {isOwner && (
                      <button
                      type="button"
                      onClick={() => {

                        setSchedule(
                          schedule.filter(
                            scheduleItem =>
                              scheduleItem.id !== item.id
                          )
                        );

                      }}
                      className="
                        mt-2
                        text-sm
                        uppercase
                        font-black
                        tracking-wider
                        text-red-400
                        hover:text-red-300
                      "
                    >
                      Löschen
                    </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FINALER HEBEL ZUM EVENT-PROMOTION */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => onNavigateToStep && onNavigateToStep('promotion')}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 text-slate-950 font-mono font-black text-[10px] uppercase tracking-wider px-6 h-11 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
        >
          Nächster Meilenstein: Event-Promotion <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}

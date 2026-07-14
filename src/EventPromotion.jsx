import React, { useState, useEffect } from 'react';
import EventCard from './components/cards/EventCard';

export default function EventPromotion({
  onBack,
  progress,
  setProgress,
  activeEvent
}) {

const [promoData, setPromoData] = useState(
  activeEvent?.promotionData || {
    title: '',
    category: '',
    shortDescription: '',
    description: '',
    promoImage: '',
    ticketLink: '',
    entryTime: '',
    startTime: ''
  }
);

const promoChecks = [
  promoData.title,
  promoData.category || activeEvent?.category,
  activeEvent?.venue,
  activeEvent?.date,
  promoData.promoImage,
  promoData.shortDescription,
  promoData.description,
  promoData.ticketLink
];

const completedPromoChecks =
  promoChecks.filter(Boolean).length;

const promoProgress = Math.round(
  (completedPromoChecks / promoChecks.length) * 100
);

useEffect(() => {
  setProgress(prev => ({
    ...prev,
    promotion: promoProgress
  }));
}, [promoProgress, setProgress]);


const handleSavePromotion = () => {

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

      promotionData: promoData
    };

  });

  localStorage.setItem(
    "gigsda_events",
    JSON.stringify(updatedEvents)
  );

  console.log("Promotion gespeichert ✅");









};
  return (

    
    <div className="max-w-5xl mx-auto pt-24 px-6 space-y-6">

      <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6">

        <h1 className="text-3xl font-black text-white uppercase">
          Event Promotion
        </h1>

        <p className="text-slate-400 mt-2">
          Eventbeschreibung & Werbung
        </p>

      </div>











<div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6">

  <div className="flex justify-between items-center mb-4">

    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
      Promotion Status
    </h3>

    <span className="text-cyan-400 font-black">
      {promoProgress}%
    </span>

  </div>

  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden mb-4">

    <div
      className="h-full bg-cyan-400"
      style={{ width: `${promoProgress}%` }}
    />

  </div>

  <div className="space-y-2 text-sm">

    <div>{promoData.title ? '✅' : '🔴'} Eventtitel</div>
    <div>{promoData.category || activeEvent?.category ? '✅' : '🔴'} Kategorie</div>
    <div>{activeEvent?.venue ? '✅' : '🔴'} Veranstaltungsort</div>
    <div>{activeEvent?.date ? '✅' : '🔴'} Datum</div>
    <div>{promoData.shortDescription ? '✅' : '🔴'} Kurzbeschreibung</div>
    <div>{promoData.description ? '✅' : '🔴'} Beschreibung</div>
    <div>{promoData.ticketLink ? '✅' : '🔴'} Ticketlink</div>

  </div>

</div>






















      <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 space-y-5">

        <div>

          <label className="block text-xs uppercase text-slate-500 mb-2">
            Eventtitel
          </label>

          <input
            type="text"
            value={promoData.title}
            onChange={(e) =>
              setPromoData({
                ...promoData,
                title: e.target.value
              })
            }
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
          />

        </div>



<div className="grid md:grid-cols-2 gap-5">

  <div>

    <label className="block text-xs uppercase text-slate-500 mb-2">
      Kategorie
    </label>

        <input
        type="text"
        value={promoData.category}
        onChange={(e) =>
            setPromoData({
            ...promoData,
            category: e.target.value
            })
        }
        className="
            w-full
            bg-slate-950
            border
            border-slate-800
            rounded-xl
            p-3
            text-white
        "
        />


  </div>

  <div>

    <label className="block text-xs uppercase text-slate-500 mb-2">
      Veranstaltungsort
    </label>

    <input
      type="text"
      value={activeEvent?.venue || ''}
      readOnly
      className="
        w-full
        bg-slate-950
        border
        border-slate-800
        rounded-xl
        p-3
        text-white
      "
    />

  </div>

</div>

<div className="grid md:grid-cols-2 gap-5">

  <div>

    <label className="block text-xs uppercase text-slate-500 mb-2">
      Datum
    </label>

    <input
      type="text"
      value={activeEvent?.date || ''}
      readOnly
      className="
        w-full
        bg-slate-950
        border
        border-slate-800
        rounded-xl
        p-3
        text-white
      "
    />

  </div>

















<div className="grid md:grid-cols-2 gap-5">

  <div>

    <label className="block text-xs uppercase text-slate-500 mb-2">
      Einlass
    </label>
    <input
      type="time"
      value={promoData.entryTime}
      onChange={(e) =>
        setPromoData({
          ...promoData,
          entryTime: e.target.value
        })
      }
    className="
      w-full
      bg-slate-950
      border
      border-slate-800
      rounded-xl
      p-3
      text-white
    "
  />


  </div>

  <div>
    <label className="block text-xs uppercase text-slate-500 mb-2">
      Beginn
    </label>
    <input
      type="time"

      value={promoData.startTime}

      onChange={(e) =>
        setPromoData({
          ...promoData,
          startTime: e.target.value
        })
      }
      className="
        w-full
        bg-slate-950
        border
        border-slate-800
        rounded-xl
        p-3
        text-white
      "
    />
  </div>
</div>











<div>

  <label className="block text-xs uppercase text-slate-500 mb-2">
    Veranstalter
  </label>

  <input
    type="text"
    value="Winston Jud"
    readOnly
    className="
      w-full
      bg-slate-950
      border
      border-slate-800
      rounded-xl
      p-3
      text-white
    "
  />

</div>















  <div>

    <label className="block text-xs uppercase text-slate-500 mb-2">
      Ticketlink
    </label>

        <input
        type="text"
        placeholder="https://..."
        value={promoData.ticketLink}
        onChange={(e) =>
            setPromoData({
            ...promoData,
            ticketLink: e.target.value
            })
        }
        className="
            w-full
            bg-slate-950
            border
            border-slate-800
            rounded-xl
            p-3
            text-white
        "
        />

  </div>

</div>














<div>
  <label className="block text-xs uppercase text-slate-500 mb-2">
    Promobild
  </label>
    <input
    type="text"
    placeholder="https://..."
    value={promoData.promoImage}
    onChange={(e) =>
        setPromoData({
        ...promoData,
        promoImage: e.target.value
        })
    }
    className="
        w-full
        bg-slate-950
        border
        border-slate-800
        rounded-xl
        p-3
        text-white
        "
        />
        <div className="mt-4 w-full h-64 md:h-80 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
        {promoData.promoImage ? (
            <img 
            src={promoData.promoImage} 
            alt="Promobild Vorschau" 
            className="w-full h-full object-cover"
            />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-500">
            Füge eine Bild-URL hinzu, um die Vorschau anzuzeigen
          </div>
        )
        }
        </div>

</div>












<div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6">

  <div className="flex justify-between items-center mb-4">

    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
      Promotion Status
    </h3>

    <span className="text-cyan-400 font-black">
      {promoProgress}%
    </span>

  </div>

  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden mb-5">

    <div
      className="h-full bg-cyan-400 transition-all duration-500"
      style={{ width: `${promoProgress}%` }}
    />

  </div>

  <div className="grid md:grid-cols-2 gap-2 text-sm">

    <div>{promoData.title ? '✅' : '🔴'} Eventtitel</div>

    <div>{promoData.category || activeEvent?.category ? '✅' : '🔴'} Kategorie</div>

    <div>{activeEvent?.venue ? '✅' : '🔴'} Veranstaltungsort</div>

    <div>{activeEvent?.date ? '✅' : '🔴'} Datum</div>

    <div>{promoData.promoImage ? '✅' : '🔴'} Promobild</div>

    <div>{promoData.shortDescription ? '✅' : '🔴'} Kurzbeschreibung</div>

    <div>{promoData.description ? '✅' : '🔴'} Beschreibung</div>

    <div>{promoData.ticketLink ? '✅' : '🔴'} Ticketlink</div>

  </div>

</div>










    {/* EVENT-RADAR VORSCHAU - LIVE PREVIEW */}
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Event-Radar Vorschau
        </h3>
        <span className="text-[10px] text-cyan-400 font-black uppercase">
          Live Preview
        </span>
      </div>

      <div className="
        rounded-2xl
        border
        border-slate-900
        bg-slate-900/40
        p-4
      ">
        {/* Hier kommt eure bestehende Suchkarte rein */}
        <EventCard
          event={{
            ...activeEvent,
            title:
                promoData.title || activeEvent?.title,
            category:
                promoData.category || activeEvent?.category,
            shortDescription:
                promoData.shortDescription,
            entryTime: promoData.entryTime,
            startTime: promoData.startTime,
            city:
                activeEvent?.venue,
            slide1_url:
                promoData.promoImage ||
              "https://placehold.co/1200x600/png"
          }}
        />
      </div>
    </div>

























        <div>

          <label className="block text-xs uppercase text-slate-500 mb-2">
            Kurzbeschreibung
          </label>

          <textarea
            rows={3}
            value={promoData.shortDescription}
            onChange={(e) =>
              setPromoData({
                ...promoData,
                shortDescription: e.target.value
              })
            }
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white resize-none"
          />

        </div>

        <div>

          <label className="block text-xs uppercase text-slate-500 mb-2">
            Ausführliche Beschreibung
          </label>

          <textarea
            rows={8}
            value={promoData.description}
            onChange={(e) =>
              setPromoData({
                ...promoData,
                description: e.target.value
              })
            }
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white resize-none"
          />

        </div>

        <button
        onClick={handleSavePromotion}
          type="button"
          className="
            h-11
            px-6
            rounded-xl
            bg-cyan-500
            text-slate-950
            font-black
            uppercase
            tracking-wider
          "
        >
          Speichern 💾
        </button>

      </div>

    </div>

  );

}
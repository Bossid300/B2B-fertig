import React, { useState, useEffect } from 'react';
import EventCard from './components/cards/EventCard';
import FahrplanMetrics from './FahrplanMetrics';
import EventHeaderBox from "./components/EventHeaderBox";
import { eventService } from './services/eventService';
import { getProfilesDb } from './services/apiService';

import { subscriptionService }
from '../moduls/subscriptions/subscriptionService';

import { FEATURES }
from '../moduls/subscriptions/featureGates';


export default function EventPromotion({
  onBack,
  progress,
  setProgress,
  onNavigateToStep, 
  activeEvent
}) {


const [profiles, setProfiles] = useState([]);
useEffect(() => {
  getProfilesDb()
    .then(data => {
      const normalized = data.map(profile => {
        try {
          return {
            ...profile,
            ...(profile.profile_json
              ? JSON.parse(profile.profile_json)
              : {})
          };
        } catch {
          return profile;
        }
      });

      setProfiles(normalized);
    })
    .catch(console.error);
}, []);


const [promoData, setPromoData] = useState(
  activeEvent?.promotionData || {
    title: '',
    category: '',
    shortDescription: '',
    description: '',
    promoImage: '',
    ticketLink: '',
    entryTime: '',
    startTime: '',
    ticketPrice: '',
    ticketStatus: '',
    fsk: '',
    lineup: '',
    amenities: '',
    is_demo: false
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
  promoData.ticketLink,

  promoData.ticketPrice,
  promoData.ticketStatus,
  promoData.fsk,
  promoData.lineup
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


useEffect(() => {
  const timer = setTimeout(() => {
    handleSavePromotion();
  }, 1000);
  return () => clearTimeout(timer);
}, [promoData]);


useEffect(() => {

  const promo =
    activeEvent?.promotionData;
  if (!promo) return;
    setPromoData({
    title:
      promo.title ||
      activeEvent?.title ||
      '',
    category:
      promo.category ||
      activeEvent?.type ||
      '',
    shortDescription:
      promo.shortDescription || '',
    description:
      promo.description || '',
    promoImage:
      promo.promoImage || '',
    ticketLink:
      promo.ticketLink || '',
    entryTime:
      promo.entryTime || '',
    startTime:
      promo.startTime || '',
    ticketPrice:
      promo.ticketPrice || '',
    ticketStatus:
      promo.ticketStatus || '',
    fsk:
      promo.fsk || '',
    lineup:
      promo.lineup || '',
    amenities:
      promo.amenities || ''
  });

}, [activeEvent?.id]);


const handleSavePromotion = () => {

  if (!activeEvent) return;
  const events =
    eventService.getEvents();

    const updatedEvents = events.map(event => {
      if (event.id !== activeEvent.id) {
        return event;
      }
      return {
        ...event,

        promotionData: promoData
      };
    });
  eventService.saveEvents(updatedEvents);

  const changedEvent =
    updatedEvents.find(event =>
      event.id === activeEvent.id
    );

  if (changedEvent) {
    eventService.saveEvent(changedEvent);
  }

  setSaveMessage(true);

  setTimeout(() => {
    setSaveMessage(false);
  }, 3000);

};

const currentUserId =
  localStorage.getItem(
    'gigsda_profile_id'
  );

const isOwner =
  activeEvent?.ownerId === currentUserId;


const ownerLead =
  profiles.find(
    p => p.id === activeEvent?.ownerId
  );
const ownerName =
  ownerLead?.name || "Unbekannt";

const [saveMessage, setSaveMessage] = useState(false);






const formatPromotionDate = (value) => {
  if (!value) return '';

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const [year, month, day] = value.split('-');

  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  const weekdays = [
    'So.',
    'Mo.',
    'Di.',
    'Mi.',
    'Do.',
    'Fr.',
    'Sa.'
  ];

  return `${weekdays[date.getDay()]} ${day}.${month}.${year}`;
};








return (

  <>
    {saveMessage && (
      <div
        className="
          fixed
          top-6
          right-6
          z-[9999]
          px-6
          py-4
          rounded-2xl
          border
          border-cyan-500/30
          bg-slate-950/95
          backdrop-blur-sm
          shadow-[0_0_30px_rgba(6,182,212,0.35)]
        "
      >
        <div className="text-cyan-400 font-black uppercase tracking-wider">
          🚀 Promotion eingebrannt
        </div>

        <div className="text-slate-400 text-xs mt-1">
          Event-Radar aktualisiert.
        </div>
      </div>
    )}


    
    <div className="max-w-4xl mx-auto space-y-6 my-6 p-4 text-xs text-slate-300 font-mono animate-fade-in">


      {/* 📊 GLOBALER B2B-FORTSCHRITTS-FAHRPLAN (DIREKT IM COCKPIT INTEGRIERT) */}
      <FahrplanMetrics 
        progress={progress} 
        activeStep="promotion" 
        onNavigate={onNavigateToStep} 
      />

      {/* Event-Promotion & Sichtbarkeit */}
      <EventHeaderBox
        activeEvent={activeEvent}
        promoImage={promoData?.promoImage}
        title="Event-Promotion & Sichtbarkeit"
        subtitle="Verifiziere Promotion mit Vorschau auf die Radar-Search-Card."
        isOwner={isOwner}
        ownerName={ownerName}
        onBack={onBack}
      />


      {/* Promotion Status */}
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
          <div className="grid md:grid-cols-2 gap-2 text-sm">

            <div>{promoData.title ? '✅' : '🔴'} Eventtitel</div>

            <div>{promoData.category || activeEvent?.category ? '✅' : '🔴'} Kategorie</div>

            <div>{activeEvent?.venue ? '✅' : '🔴'} Veranstaltungsort</div>

            <div>{activeEvent?.date ? '✅' : '🔴'} Datum</div>

            <div>{promoData.promoImage ? '✅' : '🔴'} Promobild</div>

            <div>{promoData.shortDescription ? '✅' : '🔴'} Kurzbeschreibung</div>

            <div>{promoData.description ? '✅' : '🔴'} Beschreibung</div>

            <div>{promoData.ticketLink ? '✅' : '🔴'} Ticketlink</div>

            <div>{promoData.ticketPrice ? '✅' : '🔴'} Ticketpreis</div>

            <div>{promoData.ticketStatus ? '✅' : '🔴'} Eventstatus</div>

            <div>{promoData.fsk ? '✅' : '🔴'} FSK</div>

            <div>{promoData.lineup ? '✅' : '🔴'} Line-Up</div>
            
          </div>
      </div>







      <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 space-y-5">

        <div className="mt-3 flex gap-2">

          <button
            type="button"
            onClick={() =>
              setPromoData({
                ...promoData,
                is_demo: !promoData.is_demo
              })
            }
            title={promoData.is_demo ? 'DEMO' : 'LIVE'}
            className="flex items-center"
          >
            <span
              className={
                promoData.is_demo
                  ? 'w-4 h-4 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]'
                  : 'w-4 h-4 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]'
              }
            />
          </button>

        </div>

        <div>
          <label className="block text-xs uppercase text-slate-500 mb-2">
            Eventtitel
          </label>

          <input
            type="text"
            value={promoData.title}
            disabled={!isOwner}
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
        disabled={!isOwner}
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
      disabled={!isOwner}
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
      value={formatPromotionDate(activeEvent?.date)}
      disabled={!isOwner}
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
      disabled={!isOwner}
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
      disabled={!isOwner}
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
    value={ownerLead?.name || ""}
    disabled={!isOwner}
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
        readOnly={!isOwner}
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





<div className="grid md:grid-cols-3 gap-5">

  <div>
    <label className="block text-xs uppercase text-slate-500 mb-2">
      Ticketpreis
    </label>
    <input
      type="text"
      value={promoData.ticketPrice || ""}
      onChange={(e) =>
        setPromoData({
          ...promoData,
          ticketPrice: e.target.value
        })
      }
      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
      placeholder="z.B. 39,50 €"
    />
  </div>

  <div>
    <label className="block text-xs uppercase text-slate-500 mb-2">
      Eventstatus
    </label>
    <select
      value={promoData.ticketStatus || ""}
      onChange={(e) =>
        setPromoData({
          ...promoData,
          ticketStatus: e.target.value
        })
      }
      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
    >
      <option value="">Bitte wählen</option>
      <option value="Verfügbar">Verfügbar</option>
      <option value="Fast ausverkauft">Fast ausverkauft</option>
      <option value="Ausverkauft">Ausverkauft</option>
    </select>
  </div>

  <div>
    <label className="block text-xs uppercase text-slate-500 mb-2">
      FSK
    </label>
    <select
      value={promoData.fsk || ""}
      onChange={(e) =>
        setPromoData({
          ...promoData,
          fsk: e.target.value
        })
      }
      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
    >
      <option value="">Keine Angabe</option>
      <option value="Ohne Altersbeschränkung">0</option>
      <option value="Ab 12 Jahren">12</option>
      <option value="Ab 16 Jahren">16</option>
      <option value="Ab 18 Jahren">18</option>
    </select>
  </div>

</div>









<div>
  <label className="block text-xs uppercase text-slate-500 mb-2">
    Line-Up
  </label>

  <textarea
    rows={4}
    value={promoData.lineup || ""}
    onChange={(e) =>
      setPromoData({
        ...promoData,
        lineup: e.target.value
      })
    }
    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white resize-none"
    placeholder={`The Foos
DJ Spark
Electro Giants
Local Heroes`}
  />
</div>











<div>
  <label className="block text-xs uppercase text-slate-500 mb-2">
    Fan-Annehmlichkeiten
  </label>

  <textarea
    rows={3}
    value={promoData.amenities || ""}
    onChange={(e) =>
      setPromoData({
        ...promoData,
        amenities: e.target.value
      })
    }
    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white resize-none"
    placeholder="Barrierefrei, kostenlose Parkplätze, VIP-Bereich ..."
  />
</div>















<div>
  <label className="block text-xs uppercase text-slate-500 mb-2">
    Promobild
  </label>
    <input
    type="text"
    placeholder="https://..."
    value={promoData.promoImage}
    readOnly={!isOwner}
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

    <div>{promoData.ticketPrice ? '✅' : '🔴'} Ticketpreis</div>

    <div>{promoData.ticketStatus ? '✅' : '🔴'} Eventstatus</div>

    <div>{promoData.fsk ? '✅' : '🔴'} FSK</div>

    <div>{promoData.lineup ? '✅' : '🔴'} Line-Up</div>

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

            title: promoData.title || activeEvent?.title,
            category: promoData.category || activeEvent?.category,
            shortDescription: promoData.shortDescription,

            entryTime: promoData.entryTime,
            startTime: promoData.startTime,

            ticketPrice: promoData.ticketPrice,
            ticketStatus: promoData.ticketStatus,
            fsk: promoData.fsk,
            lineup: promoData.lineup,
            amenities: promoData.amenities,

            city: activeEvent?.venue,

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
            disabled={!isOwner}
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
            disabled={!isOwner}
            onChange={(e) =>
              setPromoData({
                ...promoData,
                description: e.target.value
              })
            }
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white resize-none"
          />

        </div>












    {/* EVENT-PROMOTION + Aboteil */}

<div className="bg-slate-900/40 border border-cyan-500/20 rounded-2xl p-6 mt-8">

  <div className="flex items-center gap-2 mb-4">
    <span className="text-cyan-400">🚀</span>
    <h3 className="text-cyan-400 font-bold uppercase">
      PROMOTION+
    </h3>
  </div>

  <p className="text-slate-400 text-sm mb-6">
    Erweiterte Vermarktungsoptionen für mehr Reichweite.
    Dieser Bereich befindet sich aktuell im Aufbau.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

    <button
      type="button"
      className="bg-slate-800 border border-cyan-500/20 rounded-xl p-4 text-left"
    >
      <div className="font-bold text-cyan-300">
        🖨 PRINT
      </div>

      <div className="text-xs text-slate-400 mt-2">
        Flyer, Plakate und Druckprodukte
      </div>
    </button>

    <button
      type="button"
      className="bg-slate-800 border border-cyan-500/20 rounded-xl p-4 text-left"
    >
      <div className="font-bold text-cyan-300">
        📢 MEDIEN
      </div>

      <div className="text-xs text-slate-400 mt-2">
        Presse, Magazine und Eventportale
      </div>
    </button>

    <button
      type="button"
      className="bg-slate-800 border border-cyan-500/20 rounded-xl p-4 text-left"
    >
      <div className="font-bold text-cyan-300">
        📈 BOOST
      </div>

      <div className="text-xs text-slate-400 mt-2">
        Zusätzliche Sichtbarkeit und Reichweite
      </div>
    </button>

  </div>

</div>
















        {isOwner && (
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
            transform
            transition-all
            hover:scale-[1.02]
            active:scale-[0.98]
            shadow-[0_0_20px_rgba(6,182,212,0.2)]
          "
        >
          Speichern 💾
        </button>
        )}
      </div>

      {/* FINALER HEBEL ZUM LIVE-COUNTDOWN */}
       <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => onNavigateToStep && onNavigateToStep('countdown')}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 text-slate-950 font-mono font-black text-[10px] uppercase tracking-wider px-6 h-11 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
        >
          Nächster Meilenstein: Live-Countdown
        </button>
      </div>
      
    </div>
  </>
  );

}
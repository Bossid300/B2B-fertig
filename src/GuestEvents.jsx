import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Briefcase, Calendar, ChevronRight, X, Sparkles, Filter, ShieldCheck, Heart, User, Clock, ArrowRight } from 'lucide-react';
import EventCard from './components/cards/EventCard';
import { eventService } from './services/eventService';
import { distanceKm, geocodeAddress } from './services/geoService';
import { getProfilesDb } from './services/apiService';


export default function GuestEvents({ onNavigate }) {

const [currentProfile, setCurrentProfile] = useState(null);

useEffect(() => {

  const currentUserName =
    localStorage.getItem(
      'gigsda_user_name'
    );

  if (!currentUserName) return;

  getProfilesDb()
    .then(profiles => {

      const found =
        profiles.find(
          p =>
            p &&
            (
              p.name ||
              p.user_name ||
              ''
            )
            .toLowerCase()
            .trim() ===
            currentUserName
              .toLowerCase()
              .trim()
        );

      if (!found) return;

      const profileData =
        found.profile_json
          ? JSON.parse(
              found.profile_json
            )
          : found;

      setCurrentProfile(
        profileData
      );

    })
    .catch(console.error);

}, []);


  const [events, setEvents] = useState([]);
  const [eventView, setEventView] = useState('live');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [searchRadius, setSearchRadius] = useState(500); // 📡 Live-Suchumkreis
  const [baseLocation, setBaseLocation] = useState('Braunau');
  const [baseCoordinates, setBaseCoordinates] = useState(null);


  useEffect(() => {
    const loadBaseCoordinates = async () => {
      if (!baseLocation?.trim()) return;
      try {
        const geo =
          await geocodeAddress(
            baseLocation
          );
        setBaseCoordinates(geo);
      } catch (e) {
        console.error(e);
      }
    };
    loadBaseCoordinates();
  }, [baseLocation]);


  useEffect(() => {
    const loadEvents = async () => {
      try {
        const dbEvents =
          await eventService.syncFromDb();
        setEvents(
          dbEvents.filter(
            evt => evt && evt.title
          )
        );
      } catch (e) {
        console.error(
          'EVENT RADAR DB SYNC FEHLER',
          e
        );
      }
    };
    loadEvents();
  }, []);




  const CATEGORIES_LIST = ['Alle', 'Konzerte', 'Festivals', 'Club-Gigs', 'B2B-Messen'];

  // 🗺️ DIE LIVE-ENTFERNUNGSMATRIX (Exakt identisch zum SearchExplorer von eurer Heimatbasis Braunau)


  // ⚡ DIE ZWILLINGS-FILTER-SCHLEIFE (Filtert nach Name, Kategorie UND Radius!)
  const filteredEvents = events.filter(event => {


    const isDemoEvent =
      event.promotionData?.is_demo === true;

    const matchesDemoMode =
      eventView === 'demo'
        ? isDemoEvent
        : !isDemoEvent;

    if (!matchesDemoMode) {
      return false;
    }


    const searchValue =
      searchTerm.toLowerCase();

    const matchesName =
      event.title?.toLowerCase()
        .includes(searchValue);

    const matchesId =
      event.id?.toLowerCase().includes(searchValue) ||
      event.eventId?.toLowerCase().includes(searchValue);

    const matchesCategory =
      selectedCategory === 'Alle' ||
      event.category === selectedCategory;

    const eventDistance =
      baseCoordinates?.lat &&
      baseCoordinates?.lng &&
      event?.lat &&
      event?.lng
        ? distanceKm(
            baseCoordinates.lat,
            baseCoordinates.lng,
            event.lat,
            event.lng
          )
        : Number.MAX_VALUE;


    const matchesRadius =
      eventDistance <= searchRadius;

    return (
      (matchesName || matchesId) &&
      matchesCategory &&
      matchesRadius
    );

  });

return (
    <div className="max-w-7xl mx-auto p-6 text-white min-h-screen font-mono relative">
      
      {/* BANNER HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-900 p-8 mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 p-6 text-slate-800 opacity-20 pointer-events-none">
          <Sparkles size={160} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <ShieldCheck size={12} /> Gigsda Engine V3.0 Activated
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-2 bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            EVENT-RADAR
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-lg uppercase tracking-wide">
            Durchsuche alle anstehenden Veranstaltungen und regionalen B2B-Gigs im Umkreis.
          </p>
        </div>
      </div>   


      {/* 🎛️ FILTER-LEISTE (KATEGORIEN) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {CATEGORIES_LIST.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs uppercase font-bold tracking-widest px-3 py-1.5 rounded-xl border transition-all duration-300 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            {cat === 'Alle' ? ' ALLES ANZEIGEN' : ` ${cat}`}
          </button>
        ))}
      </div>


      {/* Zeile 1: Künstlersuche, Standort, Genre */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pt-6">
        
        {/* 1. Künstlersuche */}
        <div>
          <label className="text-xs font-mono text-slate-500 uppercase block mb-1.5">
            // Events durchsuchen
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Nach Namen suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
              w-full bg-slate-900/60 border border-slate-800 focus:border-cyan-500/50 
              rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all 
              placeholder:text-slate-600
              "
            />
          </div>
        </div>

        {/* 2. Basis-Standort */}
        <div>
          <label className="text-xs font-mono text-slate-500 uppercase block mb-1.5">
            // Basis-Standort
          </label>
          <input
            type="text"
            placeholder="z.B. Braunau, Linz..."
            value={baseLocation}
            onChange={(e) => setBaseLocation(e.target.value)}
            className="
            w-full bg-slate-900/60 border border-slate-800 
            focus:border-cyan-500/50 rounded-xl px-4 py-2.5 
            text-sm text-white focus:outline-none transition-all 
            placeholder:text-slate-600
            "
          />
        </div>

        {/* 2. Aktionsradius */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-mono text-slate-500 uppercase">
              // Aktionsradius
            </label>
            <span className="text-xs font-mono font-bold text-cyan-400">
              🛰️ {searchRadius} km
            </span>
          </div>
          <div className="pt-2">
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-900 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>

      </div>


      {/* 💳 TREFFER */}
      <div className="
        mt-4
        mb-4
        inline-flex
        items-center
        gap-2
        px-3
        py-1
        rounded-xl
        border
        border-yellow-500/30
        bg-yellow-500/5
      ">
        <span className="animate-pulse">
          ⚡
        </span>

        <span className="
          text-yellow-400
          text-xs
          uppercase
          tracking-widest
          font-black
        ">
          {filteredEvents.length} TREFFER GEFUNDEN
        </span>

        <button
          onClick={() =>
            setEventView(
              eventView === 'live'
                ? 'demo'
                : 'live'
            )
          }
          className="flex items-center justify-center"
          title={
            eventView === 'live'
              ? 'LIVE Events'
              : 'DEMO Events'
          }
        >
          <span
            className={
              eventView === 'live'
                ? 'w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]'
                : 'w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'
            }
          />
        </button>
      </div>

      {/* 💳 EVENT-KARTEN-GRID (Zwillings-Struktur) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            
            <EventCard
              key={`${event.id || 'event'}-${index}`}
              event={{
                ...event,

                  title:
                    event.promotionData?.title ||
                    event.title,

                  category:
                    event.promotionData?.category ||
                    event.category,

                  shortDescription:
                    event.promotionData?.shortDescription,

                  slide1_url:
                    event.promotionData?.promoImage ||
                    event.slide1_url,

                  entryTime:
                    event.promotionData?.entryTime,

                  startTime:
                    event.promotionData?.startTime,

                  ticketPrice:
                    event.promotionData?.ticketPrice,

                  ticketStatus:
                    event.promotionData?.ticketStatus,

                  fsk:
                    event.promotionData?.fsk,

                  lineup:
                    event.promotionData?.lineup,

                  amenities:
                    event.promotionData?.amenities,

                  city:
                    event.venue ||
                    event.city

              }}
            />
          ))

        ) : (
          <div className="col-span-full bg-slate-900/10 border border-dashed border-slate-900 rounded-2xl p-12 text-center text-xs text-slate-600 font-mono">
            // KEINE EVENTS IM GEWÄHLTEN UMKREIS GEFUNDEN 🧹
          </div>
        )}
      </div>

    </div>
  );
}

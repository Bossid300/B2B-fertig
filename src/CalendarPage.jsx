import React, { useEffect, useMemo, useState } from 'react';
import { eventService } from './services/eventService';
import CreateFreeSpotForm from './components/CreateFreeSpotForm';
import FreeSpotCard from './components/cards/FreeSpotCard';
import EventCard from './components/cards/EventCard';
import { freeSpotService } from './services/freeSpotService';
import { getProfiles, saveCrewRequest } from './services/apiService';
import PortfolioRouter from './components/portfolio/PortfolioRouter';
import EventPromotionView from './components/EventPromotionView';
import { geocodeAddress, distanceKm } from './services/geoService';

const FILTERS = [
  { id: 'all', label: 'Alle', icon: '📅' },
  { id: 'events', label: 'Events', icon: '⚡' },
  { id: 'freeSpots', label: 'Free Spots', icon: '●' },
  { id: 'voting', label: 'Voting', icon: '〽' },
];

const WEEKDAYS = ['MO', 'DI', 'MI', 'DO', 'FR', 'SA', 'SO'];

const MONTHS = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
];

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function parseEventDate(value) {
  if (!value) return null;

  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
}

function createMonthGrid(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // JS: Sonntag = 0
  // Kalender: Montag = 0
  const startOffset = (firstDay.getDay() + 6) % 7;

  const daysInMonth = lastDay.getDate();
  const cells = [];

  for (let i = startOffset - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);

    cells.push({
      date,
      currentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      date: new Date(year, month, day),
      currentMonth: true,
    });
  }

  let nextDay = 1;

  while (cells.length < 42) {
    cells.push({
      date: new Date(year, month + 1, nextDay++),
      currentMonth: false,
    });
  }

  return cells;
}

export default function CalendarPage({
  setView,
  currentProfileId,
  currentProfileType,
  isGuest = false,
}) {

  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  const [freeSpots, setFreeSpots] = useState([]);
  const [freeSpotsLoading, setFreeSpotsLoading] = useState(true);

  const [showFreeSpotForm, setShowFreeSpotForm] = useState(false);
  const [editingFreeSpot, setEditingFreeSpot] = useState(null);

  const [profiles, setProfiles] = useState([]);
  const [portfolioProfileId, setPortfolioProfileId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedFreeSpot, setSelectedFreeSpot] = useState(null);
  const [activeFreeSpotRequest, setActiveFreeSpotRequest] = useState(null);
  const [freeSpotRequestNote, setFreeSpotRequestNote] = useState('');
  const [freeSpotRequestError, setFreeSpotRequestError] = useState('');
  const [isSendingFreeSpotRequest, setIsSendingFreeSpotRequest] = useState(false);

  useEffect(() => {
    const loadCalendarData = async () => {
      try {
        const [dbEvents, dbFreeSpots, dbProfiles] = await Promise.all([
          eventService.syncFromDb(),
          freeSpotService.getFreeSpots(),
          getProfiles(),
        ]);

        setEvents(
          dbEvents.filter((evt) => evt && evt.title)
        );

        setFreeSpots(
          dbFreeSpots.filter((spot) => spot && spot.title)
        );

        
        const normalizedProfiles = dbProfiles.map((profile) => {
          let profileData = {};

          try {
            profileData = profile.profile_json
              ? JSON.parse(profile.profile_json)
              : {};
          } catch (e) {
            console.error('PROFILE JSON FEHLER', e);
          }

          return {
            ...profile,
            ...profileData,
            role: profile.role,
            type: profile.type,
          };
        });

        setProfiles(normalizedProfiles);


      } catch (e) {
        console.error('CALENDAR DATEN FEHLER', e);
      } finally {
        setEventsLoading(false);
        setFreeSpotsLoading(false);
      }
    };

    loadCalendarData();
  }, []);


  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState(today);
  const [activeFilter, setActiveFilter] = useState('all');

  const [searchRadius, setSearchRadius] = useState(500);
  const [baseLocation, setBaseLocation] = useState('Braunau');
  const [baseCoordinates, setBaseCoordinates] = useState(null);


  useEffect(() => {
    const loadBaseCoordinates = async () => {
      if (!baseLocation?.trim()) return;

      try {
        const geo =
          await geocodeAddress(baseLocation);

        setBaseCoordinates(geo);
      } catch (e) {
        console.error(e);
      }
    };

    loadBaseCoordinates();
  }, [baseLocation]);


  const calendarDays = useMemo(
    () => createMonthGrid(currentMonth),
    [currentMonth]
  );

  const previousMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const goToday = () => {
    const now = new Date();

    setCurrentMonth(
      new Date(now.getFullYear(), now.getMonth(), 1)
    );

    setSelectedDate(now);
  };

  const selectDate = (date) => {
    setSelectedDate(date);

    if (
      date.getMonth() !== currentMonth.getMonth() ||
      date.getFullYear() !== currentMonth.getFullYear()
    ) {
      setCurrentMonth(
        new Date(date.getFullYear(), date.getMonth(), 1)
      );
    }
  };

  const selectedDateLabel = selectedDate.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });



  const selectedDayEvents =
    activeFilter === 'all' ||
    activeFilter === 'events'
      ? events.filter((event) => {

          const eventDate =
            parseEventDate(event.event_date);

          const sameDate =
            eventDate &&
            sameDay(eventDate, selectedDate);

          if (!sameDate) return false;

          // Noch keine Basis-Koordinaten?
          if (
            !baseCoordinates?.lat ||
            !baseCoordinates?.lng
          ) {
            return true;
          }

          // Event hat keine Koordinaten?
          if (
            !event?.lat ||
            !event?.lng
          ) {
            return true;
          }

          const eventDistance =
            distanceKm(
              baseCoordinates.lat,
              baseCoordinates.lng,
              event.lat,
              event.lng
            );

          return eventDistance <= searchRadius;

        })
      : [];


  const selectedDayFreeSpots =
    activeFilter === 'all' || activeFilter === 'freeSpots'
      ? freeSpots.filter((spot) => {

          const spotDate =
            parseEventDate(spot.spot_date);

          const sameDate =
            spotDate &&
            sameDay(spotDate, selectedDate);

          if (!sameDate) return false;

          if (
            !baseCoordinates?.lat ||
            !baseCoordinates?.lng
          ) {
            return true;
          }

          // alte Spots ohne Koordinaten
          if (
            !spot?.lat ||
            !spot?.lng
          ) {
            return true;
          }

          const spotDistance =
            distanceKm(
              baseCoordinates.lat,
              baseCoordinates.lng,
              spot.lat,
              spot.lng
            );

          return spotDistance <= searchRadius;

      })
      : [];

  const getFreeSpotOwner = (spot) => {
    return profiles.find(
      (profile) =>
        String(profile.id) === String(spot.owner_id)
    );
  };

  const handleFreeSpotRequest = async (event) => {
    event.preventDefault();

    if (!activeFreeSpotRequest || !currentProfileId) {
      setFreeSpotRequestError('Bitte melde dich an, um eine Anfrage zu senden.');
      return;
    }

    const spot = activeFreeSpotRequest;
    const owner = getFreeSpotOwner(spot);
    const requester =
      profiles.find(
        (profile) => String(profile.id) === String(currentProfileId)
      );
    const now = Date.now();

    setIsSendingFreeSpotRequest(true);
    setFreeSpotRequestError('');

    try {
      const result = await saveCrewRequest({
        requestId: `REQ-${now}-${Math.floor(Math.random() * 1000)}`,
        requestType: 'free_spot',
        source: 'calendar_free_spot',
        eventId: `free-spot-${spot.id}`,
        eventName: `Free Spot: ${spot.title}`,
        date: spot.spot_date || 'Termin auf Anfrage',
        requestedProfileId: spot.owner_id,
        requestedProfileName:
          owner?.name ||
          owner?.klarname ||
          owner?.display_name ||
          String(spot.owner_id),
        requestedProfileRole:
          owner?.role ||
          owner?.type ||
          owner?.gewerk ||
          'Location',
        requestedProfileCity:
          owner?.city ||
          owner?.ort ||
          spot.region ||
          '',
        requesterProfileId: currentProfileId,
        requesterProfileName:
          requester?.name ||
          requester?.klarname ||
          localStorage.getItem('gigsda_user_name') ||
          'Mitglied',
        requesterName:
          requester?.name ||
          requester?.klarname ||
          localStorage.getItem('gigsda_user_name') ||
          'Mitglied',
        status: 'pending',
        createdAt: now,
        updatedAt: now,
        note:
          freeSpotRequestNote.trim() ||
          `Anfrage zum Free Spot "${spot.title}".`,
      });

      if (!result?.success) {
        throw new Error(result?.error || 'Die Anfrage konnte nicht gesendet werden.');
      }

      window.dispatchEvent(new CustomEvent('request-sent'));
      window.dispatchEvent(new CustomEvent('route-change'));
      setActiveFreeSpotRequest(null);
      setFreeSpotRequestNote('');
    } catch (error) {
      console.error('FREE SPOT ANFRAGE FEHLER', error);
      setFreeSpotRequestError(
        error.message || 'Die Anfrage konnte nicht gesendet werden.'
      );
    } finally {
      setIsSendingFreeSpotRequest(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030816] text-white">

      {/* HEADER */}
      <div className="border-b border-slate-800/80 px-4 sm:px-6 py-5">
        <div className="max-w-[1600px] mx-auto flex items-center gap-5">

          <button
            onClick={() => setView?.('guestEvents')}
            className="text-slate-400 hover:text-white transition"
          >
            ←
          </button>

          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-1">
              GIGSDA
            </div>

            <h1 className="text-2xl sm:text-3xl font-black">
              Kalender
            </h1>
          </div>

        </div>
      </div>

      <main className="max-w-[1600px] mx-auto p-3 sm:p-6">

        {/* FILTER */}
        <div className="
          bg-[#07101f]
          border border-slate-800
          rounded-2xl
          p-2
          mb-4
          flex
          gap-2
          overflow-x-auto
        ">

          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`
                whitespace-nowrap
                px-4 sm:px-6
                py-3
                rounded-xl
                border
                font-semibold
                transition
                ${
                  activeFilter === filter.id
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 border-cyan-400 text-white'
                    : 'border-slate-700 text-slate-300 hover:border-slate-500'
                }
              `}
            >
              <span className="mr-2">{filter.icon}</span>
              {filter.label}
            </button>
          ))}

          {/* REGION */}
          <div className="flex items-center gap-3">

            <input
              type="text"
              value={baseLocation}
              onChange={(e) => setBaseLocation(e.target.value)}
              placeholder="Standort"
              className="
                w-50
                bg-[#07101f]
                border border-slate-700
                rounded-xl
                px-3 py-2
                text-xm
                text-white
              "
            />

            <div className="flex items-center gap-2">

              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={searchRadius}
                onChange={(e) =>
                  setSearchRadius(Number(e.target.value))
                }
                className="w-24 accent-cyan-500"
              />

              <span
                className="
                  w-14
                  text-right
                  text-xm
                  font-bold
                  text-cyan-400
                  shrink-0
                "
              >
                {searchRadius} km
              </span>

            </div>

          </div>


          {!isGuest && currentProfileType === 'Location' && (
            <button
              onClick={() => setShowFreeSpotForm(true)}
              className="
                whitespace-nowrap
                px-5 py-3
                rounded-xl
                border border-pink-500/40
                bg-pink-500/10
                text-pink-300
                font-bold
                hover:bg-pink-500/20
                transition
              "
            >
              + Free Spot
            </button>
          )}


          <button
            className="
              ml-auto
              whitespace-nowrap
              border border-slate-700
              rounded-xl
              px-5
              text-slate-300
              hover:border-purple-500
              transition
            "
          >
            ☰ Filter
          </button>
        </div>


        {!isGuest &&
          currentProfileType === 'Location' &&
          showFreeSpotForm && (
            <div
              className="
                fixed
                inset-0
                z-[9999]
                bg-black/80
                backdrop-blur-sm
                flex
                items-center
                justify-center
                p-3
                sm:p-6
              "
              onClick={() => {
                setShowFreeSpotForm(false);
                setEditingFreeSpot(null);
              }}
            >
              <div
                className="
                  relative
                  w-full
                  max-w-3xl
                  max-h-[92vh]
                  overflow-y-auto
                "
                onClick={(e) => e.stopPropagation()}
              >
                <CreateFreeSpotForm
                  editSpot={editingFreeSpot}
                  currentProfileId={currentProfileId}

                  onCancel={() => {
                    setShowFreeSpotForm(false);
                    setEditingFreeSpot(null);
                  }}

                  onSubmit={async (freeSpot) => {
                    const wasEditing = !!editingFreeSpot;

                    const result = editingFreeSpot
                      ? await freeSpotService.updateFreeSpot(freeSpot)
                      : await freeSpotService.saveFreeSpot(freeSpot);

                    console.log('FREE SPOT DB SAVE ✅', result);

                    // Free Spots direkt neu aus DB laden
                    const updatedFreeSpots =
                      await freeSpotService.getFreeSpots();

                    setFreeSpots(
                      updatedFreeSpots.filter(
                        (spot) => spot && spot.title
                      )
                    );

                    // Zum Free-Spot-Datum springen
                    const newDate =
                      parseEventDate(freeSpot.spot_date);

                    if (newDate) {
                      setSelectedDate(newDate);

                      setCurrentMonth(
                        new Date(
                          newDate.getFullYear(),
                          newDate.getMonth(),
                          1
                        )
                      );
                    }

                    // Free-Spots-Filter aktivieren
                    setActiveFilter('freeSpots');

                    // Formular schließen
                    setShowFreeSpotForm(false);
                    setEditingFreeSpot(null);

                    // Erfolgsbestätigung
                    window.alert(
                      wasEditing
                        ? '✅ Free Spot wurde erfolgreich aktualisiert.'
                        : '✅ Free Spot wurde erfolgreich veröffentlicht.'
                    );
                  }}
                />
              </div>
            </div>
        )}


        {/* CONTENT */}
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-4">

          {/* KALENDER */}
          <section className="
            bg-[#07101f]
            border border-slate-800
            rounded-2xl
            overflow-hidden
          ">

            {/* MONTH NAV */}
            <div className="
              flex
              items-center
              justify-between
              px-4 sm:px-6
              py-5
              border-b
              border-slate-800
            ">

              <div className="flex gap-2">
                <button
                  onClick={previousMonth}
                  className="calendar-nav-btn"
                >
                  ←
                </button>

                <button
                  onClick={nextMonth}
                  className="calendar-nav-btn"
                >
                  →
                </button>
              </div>

              <h2 className="text-lg sm:text-xl font-bold">
                {MONTHS[currentMonth.getMonth()]}{' '}
                {currentMonth.getFullYear()}
              </h2>

              <button
                onClick={goToday}
                className="
                  border
                  border-slate-700
                  rounded-lg
                  px-4
                  py-2
                  text-sm
                  hover:border-cyan-500
                  transition
                "
              >
                Heute
              </button>

            </div>

            {/* WEEKDAYS */}
            <div className="grid grid-cols-7 border-b border-slate-800">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="
                    text-center
                    text-[10px] sm:text-xs
                    tracking-widest
                    text-slate-400
                    py-3
                  "
                >
                  {day}
                </div>
              ))}
            </div>

            {/* DAYS */}
            <div className="grid grid-cols-7">
              {calendarDays.map(({ date, currentMonth: isCurrent }, index) => {
                const selected = sameDay(date, selectedDate);
                const isToday = sameDay(date, today);
                const dayEvents =
                  activeFilter === 'all' ||
                  activeFilter === 'events'
                    ? events.filter((event) => {

                        const eventDate =
                          parseEventDate(event.event_date);

                        const sameDate =
                          eventDate &&
                          sameDay(eventDate, date);

                        if (!sameDate) return false;

                        if (
                          !baseCoordinates?.lat ||
                          !baseCoordinates?.lng
                        ) {
                          return true;
                        }

                        if (
                          !event?.lat ||
                          !event?.lng
                        ) {
                          return true;
                        }

                        const eventDistance =
                          distanceKm(
                            baseCoordinates.lat,
                            baseCoordinates.lng,
                            event.lat,
                            event.lng
                          );

                        return eventDistance <= searchRadius;

                      })
                    : [];

                const dayFreeSpots =
                  activeFilter === 'all' || activeFilter === 'freeSpots'
                    ? freeSpots.filter((spot) => {

                        const spotDate =
                          parseEventDate(spot.spot_date);

                        const sameDate =
                          spotDate &&
                          sameDay(spotDate, date);

                        if (!sameDate) return false;

                        if (
                          !baseCoordinates?.lat ||
                          !baseCoordinates?.lng
                        ) {
                          return true;
                        }

                        // alte Spots ohne Koordinaten
                        if (
                          !spot?.lat ||
                          !spot?.lng
                        ) {
                          return true;
                        }

                        const spotDistance =
                          distanceKm(
                            baseCoordinates.lat,
                            baseCoordinates.lng,
                            spot.lat,
                            spot.lng
                          );

                        return spotDistance <= searchRadius;

                    })
                    : [];

                return (
                  <button
                    key={index}
                    onClick={() => selectDate(date)}
                    className={`
                      relative
                      min-h-[70px]
                      sm:min-h-[100px]
                      lg:min-h-[115px]
                      border-r
                      border-b
                      border-slate-800/70
                      p-2
                      sm:p-3
                      text-left
                      transition
                      hover:bg-slate-800/30
                      ${!isCurrent ? 'opacity-30' : ''}
                      ${
                        selected
                          ? 'bg-purple-500/10 shadow-[inset_0_0_0_2px_rgba(168,85,247,0.8),inset_0_0_25px_rgba(34,211,238,0.12)]'
                          : ''
                      }
                    `}
                  >

                    <span
                      className={`
                        inline-flex
                        items-center
                        justify-center
                        w-7 h-7
                        sm:w-8 sm:h-8
                        rounded-full
                        text-sm
                        sm:text-base
                        ${
                          isToday
                            ? 'bg-cyan-500 text-slate-950 font-black'
                            : 'text-slate-200'
                        }
                      `}
                    >
                      {date.getDate()}
                    </span>

                    {dayEvents.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className="
                              flex items-center gap-1.5
                              text-[10px] sm:text-xs
                              text-cyan-300
                              truncate
                            "
                          >
                            <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                            <span className="truncate">
                              {isGuest
                                ? 'Event'
                                : event.title || event.name}
                            </span>
                          </div>
                        ))}

                        {dayEvents.length > 3 && (
                          <div className="text-[10px] text-slate-500">
                            +{dayEvents.length - 3} weitere
                          </div>
                        )}
                      </div>
                    )}

                    {dayFreeSpots.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {dayFreeSpots.slice(0, 3).map((spot) => (
                          <div
                            key={spot.id}
                            className="
                              flex items-center gap-1.5
                              text-[10px] sm:text-xs
                              text-pink-300
                              truncate
                            "
                          >
                            <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0" />

                            <span className="truncate">
                              {isGuest
                                ? 'Free Spot'
                                : spot.title}
                            </span>
                          </div>
                        ))}

                        {dayFreeSpots.length > 3 && (
                          <div className="text-[10px] text-pink-400">
                            +{dayFreeSpots.length - 3} weitere
                          </div>
                        )}
                      </div>
                    )}

                  </button>
                );
              })}
            </div>

          </section>




          {/* DETAIL PANEL */}
          <aside className="
            bg-[#07101f]
            border border-slate-800
            rounded-2xl
            p-4
            h-fit
            xl:sticky
            xl:top-4
          ">


            {isGuest ? (
              <div
                className="
                  min-h-[320px]
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-center
                  p-6
                "
              >
                <div className="text-4xl mb-4">
                  🔒
                </div>

                <h3 className="text-lg font-black text-white">
                  Informationen nur für registrierte User
                </h3>

                <p className="text-sm text-slate-400 mt-3 max-w-[280px]">
                  Registriere dich oder melde dich an, um Details zu Events,
                  Free Spots und weiteren Kalendereinträgen zu sehen.
                </p>

                <button
                  type="button"
                  onClick={() => setView?.('login')}
                  className="
                    mt-6
                    px-5 py-3
                    rounded-xl
                    border border-cyan-500/30
                    bg-cyan-500/10
                    text-cyan-300
                    text-sm
                    font-bold
                    hover:bg-cyan-500/20
                    transition
                  "
                >
                  Anmelden / Registrieren
                </button>
              </div>
            ) : (
              <>

                {/* HIER DEIN KOMPLETTER BISHERIGER DETAIL-INHALT */}

            <div className="flex items-start justify-between mb-5">

              <div>
                <div className="flex items-center gap-2">

                  <span className="w-3 h-3 rounded-full bg-cyan-400" />

                  <h3 className="font-bold capitalize">
                    {selectedDateLabel}
                  </h3>

                </div>
              </div>

              <button
                onClick={() => setSelectedDate(today)}
                className="text-slate-400 hover:text-white"
              >
                ×
              </button>

            </div>
            {/* TAGESINHALT */}
            {selectedDayEvents.length > 0 ? (

              <div className="space-y-3">
                {selectedDayEvents.map((event, index) => (
                  <EventCard
                    key={`${event.id || 'event'}-${index}`}
                    event={{
                      ...event,
                      title:
                        event.promotionData?.title ||
                        event.title ||
                        event.name,
                      category:
                        event.promotionData?.category ||
                        event.category ||
                        event.event_type ||
                        event.type,
                      shortDescription:
                        event.promotionData?.shortDescription ||
                        event.shortDescription,
                      description:
                        event.promotionData?.description ||
                        event.promotionData?.longDescription ||
                        event.description,
                      slide1_url:
                        event.promotionData?.promoImage ||
                        event.slide1_url,
                      entryTime:
                        event.promotionData?.entryTime ||
                        event.entryTime,
                      startTime:
                        event.promotionData?.startTime ||
                        event.startTime,
                      ticketPrice:
                        event.promotionData?.ticketPrice ??
                        event.ticketPrice,
                      ticketStatus:
                        event.promotionData?.ticketStatus ||
                        event.ticketStatus,
                      fsk:
                        event.promotionData?.fsk ||
                        event.fsk,
                      lineup:
                        event.promotionData?.lineup ||
                        event.lineup,
                      amenities:
                        event.promotionData?.amenities ||
                        event.amenities,
                      city:
                        event.venue ||
                        event.city ||
                        event.location,
                    }}
                    onViewEvent={setSelectedEvent}
                  />
                ))}

              </div>

            ) : selectedDayFreeSpots.length === 0 ? (

              <div className="
                min-h-[300px]
                border border-dashed border-slate-700
                rounded-xl
                flex flex-col
                items-center justify-center
                text-center
                p-8
              ">
                <div className="text-4xl mb-4">
                  📅
                </div>

                <div className="font-semibold text-slate-200 mb-2">
                  Noch keine Einträge
                </div>

                <p className="text-sm text-slate-500 max-w-[250px]">
                  Für diesen Tag sind aktuell keine Events,
                  Free Spots oder Votings geladen.
                </p>
              </div>
            ) : null}

            {/* FREE SPOTS DES AUSGEWÄHLTEN TAGES */}
            {selectedDayFreeSpots.length > 0 && (
              <div className="space-y-3 mt-4">

                {selectedDayFreeSpots.map((spot) => {
                  const isOwner =
                    Boolean(currentProfileId) &&
                    String(spot.owner_id) === String(currentProfileId);

                  return (
                    <FreeSpotCard
                      key={spot.id}
                      spot={spot}
                      owner={getFreeSpotOwner(spot)}
                      isOwner={isOwner}
                      canRequest={Boolean(currentProfileId)}
                      onDetails={() => setSelectedFreeSpot(spot)}
                      onPortfolio={() => setPortfolioProfileId(spot.owner_id)}
                      onEdit={() => {
                        setEditingFreeSpot(spot);
                        setShowFreeSpotForm(true);
                      }}
                      onDelete={async () => {
                        const confirmed = window.confirm(
                          'Diesen Free Spot wirklich löschen?'
                        );

                        if (!confirmed) return;

                        try {
                          await freeSpotService.deleteFreeSpot(
                            spot.id,
                            currentProfileId
                          );

                          const updatedFreeSpots =
                            await freeSpotService.getFreeSpots();

                          setFreeSpots(updatedFreeSpots);
                        } catch (error) {
                          console.error('FREE SPOT DELETE FEHLER ❌', error);
                        }
                      }}
                      onRequest={() => {
                        setActiveFreeSpotRequest(spot);
                        setFreeSpotRequestNote('');
                        setFreeSpotRequestError('');
                      }}
                    />
                  );
                })}

              </div>
            )}




            {/* STATUS LEGENDE */}
            <div className="mt-5 pt-4 border-t border-slate-800">

              <div className="text-xs uppercase tracking-widest text-slate-500 mb-3">
                Kalender
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-slate-400">

                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full" />
                  Events
                </span>

                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full" />
                  Free Spots
                </span>

                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full" />
                  Voting
                </span>

              </div>
            </div>
              </>
            )}
          </aside>

        </div>
      </main>

      <style>{`
        .calendar-nav-btn {
          width: 40px;
          height: 40px;
          border: 1px solid rgb(51 65 85);
          border-radius: 10px;
          color: rgb(203 213 225);
          transition: 0.2s;
        }

        .calendar-nav-btn:hover {
          border-color: rgb(34 211 238);
          color: white;
          background: rgba(34, 211, 238, 0.08);
        }
      `}</style>

      {selectedFreeSpot && (
        <div
          className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedFreeSpot(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="free-spot-details-title"
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-pink-500/30 bg-[#07101f] p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-pink-400">
                  Free Spot
                </div>
                <h2 id="free-spot-details-title" className="mt-2 text-2xl font-black text-white">
                  {selectedFreeSpot.title}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Details schließen"
                onClick={() => setSelectedFreeSpot(null)}
                className="h-9 w-9 shrink-0 rounded-full border border-slate-700 text-slate-300 hover:border-pink-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ['Datum', selectedFreeSpot.spot_date],
                ['Zeit', [selectedFreeSpot.time_from, selectedFreeSpot.time_to].filter(Boolean).join(' – ')],
                ['Kategorie', selectedFreeSpot.category],
                ['Ort', selectedFreeSpot.location],
                ['Region', selectedFreeSpot.region],
              ].filter(([, value]) => value).map(([label, value]) => (
                <div key={label} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {label}
                  </div>
                  <div className="mt-1 text-sm text-slate-200">{value}</div>
                </div>
              ))}
            </div>

            {selectedFreeSpot.description && (
              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Beschreibung
                </div>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-300">
                  {selectedFreeSpot.description}
                </p>
              </div>
            )}
          </section>
        </div>
      )}

      {activeFreeSpotRequest && (
        <div
          className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            if (!isSendingFreeSpotRequest) setActiveFreeSpotRequest(null);
          }}
        >
          <form
            onSubmit={handleFreeSpotRequest}
            className="w-full max-w-lg rounded-2xl border border-cyan-500/30 bg-[#07101f] p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                  Free Spot anfragen
                </div>
                <h2 className="mt-2 text-xl font-black text-white">
                  {activeFreeSpotRequest.title}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Deine Anfrage geht an{' '}
                  {getFreeSpotOwner(activeFreeSpotRequest)?.name ||
                    getFreeSpotOwner(activeFreeSpotRequest)?.klarname ||
                    'den Ersteller des Free Spots'}.
                </p>
              </div>
              <button
                type="button"
                aria-label="Anfrage schließen"
                disabled={isSendingFreeSpotRequest}
                onClick={() => setActiveFreeSpotRequest(null)}
                className="h-9 w-9 shrink-0 rounded-full border border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-white disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <label className="mt-5 block text-sm font-semibold text-slate-300">
              Nachricht (optional)
              <textarea
                value={freeSpotRequestNote}
                onChange={(event) => setFreeSpotRequestNote(event.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="Schreibe eine kurze Nachricht zu deiner Anfrage."
                className="mt-2 w-full resize-y rounded-xl border border-slate-700 bg-[#030816] p-3 text-sm text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none"
              />
            </label>

            {freeSpotRequestError && (
              <p role="alert" className="mt-3 text-sm text-red-300">
                {freeSpotRequestError}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                disabled={isSendingFreeSpotRequest}
                onClick={() => setActiveFreeSpotRequest(null)}
                className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white disabled:opacity-50"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={isSendingFreeSpotRequest}
                className="rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-wait disabled:opacity-50"
              >
                {isSendingFreeSpotRequest ? 'Wird gesendet…' : 'Anfrage senden'}
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedEvent && (
        <EventPromotionView
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onNavigate={setView}
        />
      )}

      {/* PORTFOLIO POPUP */}
      {portfolioProfileId && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            bg-black/80
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-3
            sm:p-6
          "
          onClick={() => setPortfolioProfileId(null)}
        >
          <div
            className="
              relative
              w-full
              max-w-6xl
              max-h-[92vh]
              overflow-y-auto
              bg-[#030816]
              border border-cyan-500/30
              rounded-2xl
              shadow-2xl
            "
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPortfolioProfileId(null)}
              className="
                sticky
                top-4
                float-right
                z-[10000]
                mr-4
                mt-4
                w-10
                h-10
                rounded-full
                bg-slate-950/90
                border border-slate-700
                text-slate-300
                hover:text-white
                hover:border-cyan-400
                transition
              "
            >
              ×
            </button>

            <PortfolioRouter
              profileId={portfolioProfileId}
              onBack={() => setPortfolioProfileId(null)}
            />

          </div>
        </div>
      )}


    </div>
  );
}
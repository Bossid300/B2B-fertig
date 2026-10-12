import React, { useEffect, useMemo, useState } from 'react';
import { eventService } from './services/eventService';
import CreateFreeSpotForm from './components/CreateFreeSpotForm';
import { freeSpotService } from './services/freeSpotService';
import { getProfiles } from './services/apiService';
import ArtistPortfolio from './components/ArtistPortfolio';

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

      console.log(
        'CALENDAR LOCATION PROFILES:',
        normalizedProfiles.filter(
          (profile) => profile.role === 'Location'
        )
      );

      console.log('CALENDAR FREE SPOTS:', dbFreeSpots);

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
  const [region, setRegion] = useState('Region');

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
    activeFilter === 'all' || activeFilter === 'events'
      ? events.filter((event) => {
          const eventDate = parseEventDate(event.event_date);
          return eventDate && sameDay(eventDate, selectedDate);
        })
      : [];


  const selectedDayFreeSpots =
    activeFilter === 'all' || activeFilter === 'freeSpots'
      ? freeSpots.filter((spot) => {
          const spotDate = parseEventDate(spot.spot_date);
          return spotDate && sameDay(spotDate, selectedDate);
        })
      : [];

  const getFreeSpotOwner = (spot) => {
    return profiles.find(
      (profile) =>
        String(profile.id) === String(spot.owner_id)
    );
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
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="
              bg-[#07101f]
              border border-slate-700
              rounded-xl
              px-4
              text-slate-200
              outline-none
            "
          >
            <option>Region</option>
            <option>Deutschland</option>
            <option>Österreich</option>
            <option>Schweiz</option>
          </select>

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
                  activeFilter === 'all' || activeFilter === 'events'
                    ? events.filter((event) => {
                        const eventDate = parseEventDate(event.event_date);
                        return eventDate && sameDay(eventDate, date);
                      })
                    : [];

                const dayFreeSpots =
                  activeFilter === 'all' || activeFilter === 'freeSpots'
                    ? freeSpots.filter((spot) => {
                        const spotDate = parseEventDate(spot.spot_date);
                        return spotDate && sameDay(spotDate, date);
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
                {selectedDayEvents.map((event) => (

                  <div
                    key={event.id}
                    className="
                      border border-cyan-500/30
                      bg-cyan-500/5
                      rounded-xl
                      p-4
                    "
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />

                      <span className="text-xs uppercase tracking-wider text-cyan-400">
                        {event.event_type || event.type || 'Event'}
                      </span>
                    </div>

                    <h4 className="font-bold text-white">
                      {event.title || event.name}
                    </h4>

                    {event.location && (
                      <div className="text-sm text-slate-400 mt-2">
                        📍 {event.location}
                      </div>
                    )}

                    {event.displayDate && (
                      <div className="text-sm text-slate-400 mt-1">
                        📅 {event.displayDate}
                      </div>
                    )}
                  </div>
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

                {selectedDayFreeSpots.map((spot) => (
                  <div
                    key={spot.id}
                    className="
                      border border-pink-500/30
                      bg-pink-500/5
                      rounded-xl
                      p-4
                    "
                  >
                    {/* TYP */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-pink-500" />

                      <span className="text-xs uppercase tracking-wider text-pink-400">
                        Free Spot
                      </span>
                    </div>

                    {/* TITEL */}
                    <h4 className="font-bold text-white text-lg">
                      {spot.title}
                    </h4>

                    {/* KATEGORIE */}
                    {spot.category && (
                      <div className="text-sm text-pink-300 mt-2">
                        {spot.category}
                      </div>
                    )}

                    {/* ORT */}
                    {spot.location && (
                      <div className="text-sm text-slate-400 mt-2">
                        📍 {spot.location}
                      </div>
                    )}

                    {/* REGION */}
                    {spot.region && (
                      <div className="text-sm text-slate-400 mt-1">
                        🌐 {spot.region}
                      </div>
                    )}

                    {(() => {
                      const owner = getFreeSpotOwner(spot);

                      if (!owner) return null;

                      const ownerName =
                        owner.name ||
                        owner.klarname ||
                        spot.owner_id;

                      return (
                        <div className="mt-4 pt-4 border-t border-pink-500/20">
                          <div className="text-[10px] uppercase tracking-wider text-slate-500">
                            Erstellt von
                          </div>

                          <div className="text-sm font-bold text-pink-300 mt-1">
                            🏠 {ownerName}
                          </div>

                        <button
                          type="button"
                          onClick={() => setPortfolioProfileId(spot.owner_id)}
                          className="
                            mt-3
                            px-4 py-2
                            rounded-lg
                            border border-cyan-500/30
                            bg-cyan-500/5
                            text-cyan-300
                            text-xs
                            font-bold
                            hover:bg-cyan-500/15
                            hover:border-cyan-400/50
                            transition
                          "
                        >
                          👁 Portfolio ansehen
                        </button>

                        </div>
                      );
                    })()}

                    {/* ZEIT */}
                    {(spot.time_from || spot.time_to) && (
                      <div className="text-sm text-slate-400 mt-1">
                        🕒 {spot.time_from || ''}
                        {spot.time_from && spot.time_to ? ' - ' : ''}
                        {spot.time_to || ''}
                      </div>
                    )}

                    {/* BESCHREIBUNG */}
                    {spot.description && (
                      <div
                        className="
                          mt-4
                          pt-4
                          border-t border-pink-500/20
                          text-sm
                          text-slate-300
                          leading-relaxed
                        "
                      >
                        {spot.description}
                      </div>
                    )}

                    {String(spot.owner_id) === String(currentProfileId) && (
                      <div className="mt-4 pt-4 border-t border-pink-500/20 flex gap-2">

                        <button
                          type="button"
                          onClick={() => {
                            setEditingFreeSpot(spot);
                            setShowFreeSpotForm(true);
                          }}
                          className="
                            text-xs
                            text-pink-300
                            border border-pink-500/30
                            bg-pink-500/5
                            rounded-lg
                            px-3 py-2
                            hover:bg-pink-500/15
                            transition
                          "
                        >
                          ✏️ Free Spot bearbeiten
                        </button>

                        <button
                          type="button"
                          onClick={async () => {
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

                              console.log('FREE SPOT GELÖSCHT ✅', spot.id);
                            } catch (error) {
                              console.error('FREE SPOT DELETE FEHLER ❌', error);
                            }
                          }}
                          className="
                            text-xs
                            text-red-400
                            border border-red-500/30
                            bg-red-500/5
                            rounded-lg
                            px-3 py-2
                            hover:bg-red-500/15
                            transition
                          "
                        >
                          🗑️ Free Spot löschen
                        </button>

                      </div>
                    )}

                  </div>
                ))}

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

            <ArtistPortfolio
              profileId={portfolioProfileId}
              onBack={() => setPortfolioProfileId(null)}
            />

          </div>
        </div>
      )}


    </div>
  );
}
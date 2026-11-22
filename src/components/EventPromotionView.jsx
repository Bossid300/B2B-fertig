import { useEffect, useState } from 'react';
import { getTicketPriceRows } from '../utils/ticketPrices';
import { AmenityBadges } from './AmenityTags';

export default function EventPromotionView({
  event,
  onClose,
  onNavigate,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const profileId =
    localStorage.getItem('gigsda_profile_id') || '';

  const eventId =
    event?.id ||
    event?.eventId ||
    event?._id ||
    `${event?.title || event?.name || 'event'}-${event?.displayDate || event?.date || ''}`;

  const favoriteStorageKey =
    `gigsda_event_favorite_${encodeURIComponent(profileId || 'guest')}_${encodeURIComponent(String(eventId))}`;

  const [favoriteState, setFavoriteState] = useState(
    () => ({
      storageKey: favoriteStorageKey,
      value: localStorage.getItem(favoriteStorageKey) === 'true',
    })
  );
  const isFavorite =
    favoriteState.storageKey === favoriteStorageKey
      ? favoriteState.value
      : localStorage.getItem(favoriteStorageKey) === 'true';

  if (!event) return null;

  const promotionData = event.promotionData || {};

  const title =
    promotionData.title ||
    event.title ||
    event.name ||
    'Event';

  const category =
    promotionData.category ||
    event.category ||
    event.event_type ||
    event.type ||
    '';

  const image =
    promotionData.promoImage ||
    event.slide1_url ||
    event.promoImage ||
    event.promo_image ||
    event.image ||
    event.banner ||
    '';

  const shortDescription =
    promotionData.shortDescription ||
    event.shortDescription ||
    event.short_description ||
    event.descriptionShort ||
    '';

  const description =
    promotionData.description ||
    promotionData.longDescription ||
    event.description ||
    event.longDescription ||
    event.long_description ||
    '';

  const location =
    promotionData.venueName ||
    event.venueName ||
    event.location ||
    event.venue ||
    event.locationName ||
    '';

  const address =
    promotionData.street ||
    event.street ||
    event.address ||
    '';

  const city =
    promotionData.city ||
    (
      event.city && !event.city.includes(',')
        ? event.city
        : ''
    );

  const safeCity =
    city ||
    (
      event.venue?.includes(',')
        ? event.venue
            .split(',')
            .pop()
            .trim()
            .replace(/^\d+\s+/, '')
        : ''
    );

  const postalCode =
    promotionData.zip ||
    event.zip ||
    event.postalCode ||
    event.plz ||
    '';

  const displayDate =
    event.displayDate ||
    event.date_display ||
    event.event_date ||
    event.date ||
    '';

  const admission =
    promotionData.entryTime ||
    event.admission ||
    event.entryTime ||
    event.entry_time ||
    event.einlass ||
    '';

  const startTime =
    promotionData.startTime ||
    event.startTime ||
    event.start_time ||
    event.begin ||
    event.beginn ||
    '';

  const endTime =
    promotionData.endTime ||
    event.endTime ||
    event.end_time ||
    '';

  const organizer =
    event.organizer ||
    event.organizerName ||
    event.ownerName ||
    event.veranstalter ||
    '';

  const ticketLink =
    promotionData.ticketLink ||
    event.ticketLink ||
    event.ticket_link ||
    event.ticketUrl ||
    '';

  const ticketPriceRows = getTicketPriceRows(event);

  const eventStatus =
    promotionData.ticketStatus ||
    event.ticketStatus ||
    event.status ||
    event.eventStatus ||
    event.event_status ||
    '';

  const fsk =
    promotionData.fsk ||
    event.fsk ||
    '';

  const lineUp =
    promotionData.lineup ||
    event.lineup ||
    event.line_up ||
    '';

  const amenities =
    promotionData.amenities ||
    event.amenities ||
    event.fanAmenities ||
    event.fan_amenities ||
    '';
  const amenityTags = promotionData.amenityTags ?? event.amenityTags;

  const hasTicketLink =
    typeof ticketLink === 'string' &&
    /^https?:\/\//i.test(ticketLink);

  const eventLocation =
    [location, address, postalCode, safeCity]
      .filter(Boolean)
      .join(', ');

  const mapDestination =
    event.lat != null &&
    event.lng != null &&
    Number.isFinite(Number(event.lat)) &&
    Number.isFinite(Number(event.lng))
      ? `${event.lat},${event.lng}`
      : eventLocation;

  const mapUrl =
    mapDestination
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapDestination)}`
      : '';

  const organizerEmail =
    event.contactEmail ||
    event.organizerEmail ||
    event.organizer_email ||
    '';

  const website =
    event.website ||
    event.websiteUrl ||
    event.website_url ||
    event.organizerWebsite ||
    '';

  const hasWebsite =
    typeof website === 'string' &&
    /^https?:\/\//i.test(website);

  const ownerId =
    event.ownerId ||
    event.owner_id ||
    '';

  const isOwner =
    Boolean(profileId) &&
    String(profileId) === String(ownerId);

  const toggleFavorite = () => {
    const nextFavorite = !isFavorite;
    localStorage.setItem(favoriteStorageKey, String(nextFavorite));
    setFavoriteState({
      storageKey: favoriteStorageKey,
      value: nextFavorite,
    });
    window.dispatchEvent(new Event('storage'));
  };

  const cityAndDateMeta = [safeCity, displayDate].filter(Boolean).join(' • ');

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        bg-black/85
        backdrop-blur-md
        flex
        items-center
        justify-center
        p-3
        sm:p-6
      "
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-promotion-title"
        className="
          relative
          w-full
          max-w-6xl
          max-h-[92vh]
          overflow-y-auto
          bg-zinc-950
          text-zinc-900
          border
          border-zinc-800
          shadow-2xl
          font-sans
          selection:bg-amber-500
          selection:text-black
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP ACTION BAR (im Lookbook-Stil) */}
        <div className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4 text-white">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onClose}
                className="text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition"
              >
                ← Schließen
              </button>
              <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
                GIGSDA // Event Magazin
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {hasTicketLink && (
                <a
                  href={ticketLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition"
                >
                  Tickets
                </a>
              )}

              <button
                type="button"
                onClick={toggleFavorite}
                aria-pressed={isFavorite}
                className={`px-3.5 py-1.5 border text-xs font-semibold uppercase tracking-wider transition ${
                  isFavorite
                    ? 'border-amber-400 bg-amber-400/15 text-amber-300'
                    : 'border-zinc-700 text-zinc-300 hover:border-white hover:text-white'
                }`}
              >
                {isFavorite ? '★ Favorisiert' : '☆ Favorit'}
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Eventansicht schließen"
                className="w-8 h-8 flex items-center justify-center border border-zinc-700 text-zinc-400 hover:border-white hover:text-white text-xs transition"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <main className="p-4 sm:p-8 space-y-10">
          {/* =========================================================
              SPREAD 01: EDITORIAL COVER
             ========================================================= */}
          <section className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px] bg-black text-white shadow-2xl overflow-hidden border border-zinc-800">
            {/* Linker Magazin-Rücken */}
            <div className="lg:col-span-4 bg-[#0b0b0b] p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-zinc-800">
              <div className="flex items-center justify-between text-[11px] tracking-[0.3em] text-zinc-400 uppercase">
                <span>EVENT // {String(eventId).slice(0, 10)}</span>
                <span>LIVE EPK</span>
              </div>

              <div className="my-8 flex items-center gap-6">
                <div className="flex flex-col items-center">
                  <span
                    className="text-4xl sm:text-5xl font-black tracking-tighter uppercase leading-none select-none text-white"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                  >
                    EVENT
                  </span>
                  <div className="flex items-end gap-[4px] h-14 mt-6" aria-hidden="true">
                    {[45, 80, 60, 95, 50, 85, 70, 40, 90, 55, 75, 45].map((h, idx) => (
                      <span
                        key={idx}
                        className="w-[3px] bg-amber-400/90"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-between space-y-4">
                  <span
                    className="text-lg sm:text-xl font-light tracking-[0.45em] uppercase text-zinc-400"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                  >
                    SPECIAL
                  </span>
                </div>
              </div>

              <div className="space-y-2 border-t border-zinc-800 pt-5 text-xs text-zinc-400">
                <p className="uppercase tracking-[0.2em] text-white font-semibold">
                  {category || 'Live Event & Show'}
                </p>
                <p className="text-zinc-500">
                  {cityAndDateMeta || 'GIGSDA Event-Programm'}
                </p>
              </div>
            </div>

            {/* Rechtes Hero-Visual */}
            <div className="lg:col-span-8 relative min-h-[380px] bg-zinc-900 flex flex-col justify-end">
              {image ? (
                <img
                  src={image}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-600 uppercase tracking-widest text-sm">
                  Kein Eventbild hinterlegt
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />

              <div className="relative z-10 p-8 sm:p-12">
                <p className="text-amber-400 text-xs uppercase tracking-[0.35em] font-semibold mb-2">
                  {category ? `#${category}` : 'GIGSDA Featured Event'}
                </p>
                <h2
                  id="event-promotion-title"
                  className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-none"
                >
                  {title}
                </h2>

                {(shortDescription || description) && (
                  <p className="mt-4 max-w-2xl text-zinc-200 text-sm sm:text-base leading-relaxed font-light line-clamp-3">
                    {shortDescription || description}
                  </p>
                )}

                {/* Key Facts Strip */}
                <div className="mt-5 pt-4 border-t border-zinc-700/80 flex flex-wrap gap-6 text-xs font-mono uppercase tracking-wider text-amber-400">
                  {displayDate && <span>Datum: {displayDate}</span>}
                  {startTime && <span>Beginn: {startTime}</span>}
                  {safeCity && <span>Ort: {safeCity}</span>}
                  {eventStatus && <span>Status: {eventStatus}</span>}
                </div>

                {/* Aktionen */}
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {eventLocation && (
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById('event-location')?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'center',
                        })
                      }
                      className="rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-amber-300"
                    >
                      Location
                    </button>
                  )}

                  {mapUrl && (
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-zinc-200"
                    >
                      Route planen
                    </a>
                  )}

                  {typeof organizerEmail === 'string' &&
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(organizerEmail) && (
                      <a
                        href={`mailto:${organizerEmail}?subject=${encodeURIComponent(`Anfrage: ${title}`)}`}
                        className="rounded-xl border border-zinc-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:border-amber-400 hover:text-amber-300"
                      >
                        Anfrage
                      </a>
                    )}

                  {hasWebsite && (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-zinc-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:border-amber-400 hover:text-amber-300"
                    >
                      Website
                    </a>
                  )}

                  {isOwner && onNavigate && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose?.();
                        onNavigate('projects');
                      }}
                      className="rounded-xl border border-amber-400 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-amber-300 transition hover:bg-amber-400 hover:text-black"
                    >
                      Verwalten
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================
              SPREAD 02: FACTS, STORY & LOCATION (Heller Kontrast)
             ========================================================= */}
          <section className="grid grid-cols-1 lg:grid-cols-12 bg-white text-zinc-900 shadow-2xl overflow-hidden">
            {/* Links: Hard Facts & Story */}
            <div className="lg:col-span-7 p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-zinc-200 flex flex-col justify-between">
              <div>
                <div className="flex items-baseline justify-between border-b-2 border-black pb-3 mb-6">
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
                    Event Details & Story
                  </h3>
                  <span className="text-xs font-mono text-zinc-500">01 // OVERVIEW</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  <LightFact label="Einlass" value={admission || 'Keine Angabe'} />
                  <LightFact label="Beginn" value={startTime || 'Keine Angabe'} />
                  <LightFact label="Ende" value={endTime || 'Keine Angabe'} />
                  <LightFact label="Datum" value={displayDate || 'Keine Angabe'} />
                  <LightFact label="Status" value={eventStatus || 'Keine Angabe'} />
                  {fsk && <LightFact label="FSK" value={fsk} />}
                </div>

                {shortDescription && (
                  <p className="text-base font-semibold text-zinc-900 leading-snug mb-4">
                    {shortDescription}
                  </p>
                )}

                {description && (
                  <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
                    {description}
                  </p>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-400 font-mono">
                <span>{title}</span>
                <span>PAGE 02</span>
              </div>
            </div>

            {/* Rechts: Venue & Location */}
            <div
              id="event-location"
              className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between bg-zinc-50"
            >
              <div>
                <div className="flex items-baseline justify-between border-b-2 border-black pb-3 mb-6">
                  <h3 className="text-2xl font-black tracking-tight uppercase">
                    Venue & Location
                  </h3>
                  <span className="text-xs font-mono text-zinc-500">02 // PLACE</span>
                </div>

                {(location || address || city || safeCity) ? (
                  <div className="space-y-3 text-sm">
                    {location && (
                      <div className="text-xl font-black text-zinc-900">
                        {location}
                      </div>
                    )}
                    {address && (
                      <div className="text-zinc-700">{address}</div>
                    )}
                    {(postalCode || safeCity) && (
                      <div className="text-zinc-600 font-medium">
                        {[postalCode, safeCity].filter(Boolean).join(' ')}
                      </div>
                    )}
                    {organizer && (
                      <div className="pt-3 border-t border-zinc-200 text-zinc-600">
                        Veranstalter:{' '}
                        <span className="font-bold text-zinc-900">{organizer}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500">
                    Kein Veranstaltungsort hinterlegt.
                  </p>
                )}

                {mapUrl && (
                  <div className="mt-6">
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-amber-400 hover:text-black transition"
                    >
                      Auf Google Maps öffnen →
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-400 font-mono">
                <span>GIGSDA EVENT MAGAZIN</span>
                <span>PAGE 02</span>
              </div>
            </div>
          </section>

          {/* =========================================================
              SPREAD 03: LINE-UP, AMENITIES & TICKETS (Dark Contrast)
             ========================================================= */}
          <section className="grid grid-cols-1 lg:grid-cols-12 bg-[#0d0d0d] text-white shadow-2xl overflow-hidden border border-zinc-800">
            {/* Links: Line-Up & Annehmlichkeiten */}
            <div className="lg:col-span-6 p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-baseline justify-between border-b border-zinc-700 pb-3 mb-6">
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
                    Line-Up & Extras
                  </h3>
                  <span className="text-xs font-mono text-amber-400">03 // PROGRAM</span>
                </div>

                {lineUp && (
                  <div className="bg-zinc-900 p-4 border border-zinc-800 mb-5">
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-2">
                      Line-Up
                    </span>
                    <div className="text-sm text-zinc-100 whitespace-pre-line leading-relaxed">
                      {lineUp}
                    </div>
                  </div>
                )}

                {(amenities || (Array.isArray(amenityTags) && amenityTags.length > 0)) && (
                  <div className="bg-zinc-900 p-4 border border-zinc-800">
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-2">
                      Annehmlichkeiten
                    </span>
                    <div className="space-y-3 text-sm text-zinc-300">
                      <AmenityBadges tags={amenityTags} />
                      {amenities && <div className="whitespace-pre-line">{amenities}</div>}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-between items-center text-[11px] text-zinc-500 font-mono">
                <span>{(event.id || event.eventId) ? `ID: ${event.id || event.eventId}` : 'GIGSDA EVENT'}</span>
                <span>PAGE 03</span>
              </div>
            </div>

            {/* Rechts: Eventinformationen & Tickets */}
            <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between bg-black">
              <div>
                <div className="flex items-baseline justify-between border-b border-zinc-700 pb-3 mb-6">
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
                    Tickets & Info
                  </h3>
                  <span className="text-xs font-mono text-amber-400">04 // ADMISSION</span>
                </div>

                {(fsk || ticketPriceRows.length > 0) ? (
                  <div className="space-y-3 text-sm border-t border-zinc-800 pt-4 mb-6">
                    {fsk && (
                      <div className="flex justify-between gap-4 border-b border-zinc-800/80 pb-2">
                        <span className="text-zinc-400">FSK</span>
                        <span className="text-white font-bold text-right">{fsk}</span>
                      </div>
                    )}
                    {ticketPriceRows.map((row) => (
                      <div
                        key={row.label}
                        className="flex justify-between gap-4 border-b border-zinc-800/80 pb-2"
                      >
                        <span className="text-zinc-400">{row.label}</span>
                        <span className="text-amber-400 font-bold text-right">{row.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-400 mb-6">
                    Weitere Ticket- oder Preisdetails findest du über den Ticket-Link oder direkt beim Veranstalter.
                  </p>
                )}

                {hasTicketLink && (
                  <div className="bg-zinc-900 border border-amber-400/40 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-black uppercase tracking-wider text-white">
                        Tickets sichern
                      </div>
                      <div className="text-xs text-zinc-400 mt-1">
                        Direkt zum offiziellen Ticketverkauf
                      </div>
                    </div>
                    <a
                      href={ticketLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-5 py-2.5 bg-amber-400 text-black text-xs font-black uppercase tracking-wider hover:bg-amber-300 transition"
                    >
                      Zu den Tickets →
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-between items-center text-[11px] text-zinc-500 font-mono">
                <span>POWERED BY GIGSDA.COM</span>
                <span>{new Date().getFullYear()}</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function LightFact({ label, value }) {
  return (
    <div className="bg-zinc-100 p-3.5 border-l-4 border-black">
      <span className="block text-[10px] uppercase tracking-widest text-zinc-500">
        {label}
      </span>
      <span className="font-bold text-sm text-zinc-900 mt-1 block">
        {value}
      </span>
    </div>
  );
}
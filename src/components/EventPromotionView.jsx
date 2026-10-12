import React, { useEffect } from 'react';

export default function EventPromotionView({
  event,
  onClose,
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

  if (!event) return null;


  const title =
    event.title ||
    event.name ||
    'Event';

  const category =
    event.category ||
    event.event_type ||
    event.type ||
    '';

  const image =
    event.slide1_url ||
    event.promoImage ||
    event.promo_image ||
    event.image ||
    event.banner ||
    '';

  const shortDescription =
    event.shortDescription ||
    event.short_description ||
    event.descriptionShort ||
    '';

  const description =
    event.description ||
    event.longDescription ||
    event.long_description ||
    '';

  const location =
    event.venueName ||
    event.location ||
    event.venue ||
    event.locationName ||
    '';

  const address =
    event.street ||
    event.address ||
    '';

  const city =
    event.city &&
    !event.city.includes(',')
      ? event.city
      : '';

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
    event.admission ||
    event.entryTime ||
    event.entry_time ||
    event.einlass ||
    '';

  const startTime =
    event.startTime ||
    event.start_time ||
    event.begin ||
    event.beginn ||
    '';

  const organizer =
    event.organizer ||
    event.organizerName ||
    event.ownerName ||
    event.veranstalter ||
    '';

  const ticketLink =
    event.ticketLink ||
    event.ticket_link ||
    event.ticketUrl ||
    '';

  const ticketPrice =
    event.ticketPrice ??
    event.ticket_price ??
    '';

  const eventStatus =
    event.ticketStatus ||
    event.status ||
    event.eventStatus ||
    event.event_status ||
    '';

  const fsk =
    event.fsk ||
    '';

  const lineUp =
    event.lineup ||
    event.line_up ||
    '';

  const amenities =
    event.amenities ||
    event.fanAmenities ||
    event.fan_amenities ||
    '';

  const hasTicketLink =
    typeof ticketLink === 'string' &&
    /^https?:\/\//i.test(ticketLink);

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
          max-w-5xl
          max-h-[92vh]
          overflow-y-auto
          bg-[#030816]
          border
          border-cyan-500/30
          rounded-2xl
          shadow-2xl
        "
        onClick={(e) => e.stopPropagation()}
      >

        {/* SCHLIESSEN */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Eventansicht schließen"
          className="
            absolute
            top-4
            right-4
            z-30
            w-10
            h-10
            rounded-full
            bg-slate-950/90
            border
            border-slate-700
            text-slate-300
            hover:text-white
            hover:border-cyan-400
            transition
          "
        >
          ×
        </button>


        {/* HERO */}
        <section className="relative overflow-hidden rounded-t-2xl">

          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-[250px] sm:h-[500px] object-cover"
            />
          ) : (
            <div
              className="
                w-full
                h-[220px]
                sm:h-[300px]
                bg-gradient-to-br
                from-cyan-950
                via-[#07101f]
                to-purple-950
              "
            />
          )}

          <div
            className="
              absolute
              left-0
              right-0
              bottom-0
              p-6
              sm:p-10
            "
          >
            <div
              className="
                text-[10px]
                uppercase
                tracking-[0.3em]
                text-cyan-400
                font-black
                mb-3
              "
            >
              GIGSDA EVENT
            </div>

            <h2
              id="event-promotion-title"
              className="
                text-3xl
                sm:text-5xl
                font-black
                text-white
                leading-tight
              "
            >
              {title}
            </h2>

            {category && (
              <div
                className="
                  inline-flex
                  mt-4
                  px-3
                  py-1.5
                  rounded-lg
                  border
                  border-cyan-500/30
                  bg-cyan-500/10
                  text-cyan-300
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                "
              >
                #{category}
              </div>
            )}
          </div>
        </section>


        <div className="p-5 sm:p-8 space-y-6">

          {/* QUICK INFO */}
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-3
            "
          >

            <InfoBox
              icon="📅"
              label="Datum"
              value={displayDate || 'Keine Angabe'}
            />

            <InfoBox
              icon="🕒"
              label="Einlass"
              value={admission || 'Keine Angabe'}
            />

            <InfoBox
              icon="🎵"
              label="Beginn"
              value={startTime || 'Keine Angabe'}
            />

            <InfoBox
              icon="🎟️"
              label="Status"
              value={eventStatus || 'Keine Angabe'}
            />

          </div>


          {/* LOCATION */}
          {(location || address || city) && (
            <ContentBox title="📍 Veranstaltungsort">

              {location && (
                <div className="text-xl font-black text-white">
                  {location}
                </div>
              )}

              {address && (
                <div className="text-sm text-slate-300 mt-3">
                  {address}
                </div>
              )}

              <div className="text-sm text-slate-400">

                {postalCode && (
                  <span>{postalCode}</span>
                )}

                {postalCode && safeCity && ' '}

                {safeCity && (
                  <span>{safeCity}</span>
                )}

              </div>


              {organizer && (
                <div className="text-sm text-slate-400 mt-4">
                  Veranstalter:{' '}
                  <span className="text-cyan-300 font-bold">
                    {organizer}
                  </span>
                </div>
              )}
            </ContentBox>
          )}


          {/* KURZBESCHREIBUNG */}
          {shortDescription && (
            <ContentBox title="⚡ Kurzbeschreibung">
              <p className="text-slate-300 leading-relaxed">
                {shortDescription}
              </p>
            </ContentBox>
          )}


          {/* BESCHREIBUNG */}
          {description && (
            <ContentBox title="📖 Ausführliche Beschreibung">
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </ContentBox>
          )}


          {/* LINE-UP */}
          {lineUp && (
            <ContentBox title="🎤 Line-Up">
              <div className="text-slate-200 whitespace-pre-line">
                {lineUp}
              </div>
            </ContentBox>
          )}


          {/* WEITERE INFOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {amenities && (
              <ContentBox title="✨ Annehmlichkeiten">
                <div className="text-sm text-slate-300 whitespace-pre-line">
                  {amenities}
                </div>
              </ContentBox>
            )}

            {(fsk || ticketPrice !== '') && (
              <ContentBox title="ℹ️ Eventinformationen">

                <div className="space-y-3 text-sm">

                  {fsk && (
                    <InfoRow
                      label="FSK"
                      value={fsk}
                    />
                  )}

                  {ticketPrice !== '' && (
                    <InfoRow
                      label="Ticketpreis"
                      value={
                        String(ticketPrice) === '0'
                          ? 'Eintritt frei'
                          : `${ticketPrice}`
                      }
                    />
                  )}

                </div>

              </ContentBox>
            )}

          </div>


          {/* TICKET */}
          {hasTicketLink && (
            <div
              className="
                border
                border-cyan-500/30
                bg-gradient-to-r
                from-cyan-500/10
                to-purple-500/10
                rounded-2xl
                p-5
                flex
                flex-col
                sm:flex-row
                sm:items-center
                justify-between
                gap-4
              "
            >

              <div>
                <div className="text-sm font-black text-white">
                  🎟️ Tickets
                </div>

                <div className="text-xs text-slate-400 mt-1">
                  Ticketinformationen zum Event
                </div>
              </div>

              <a
                href={ticketLink}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex
                  items-center
                  justify-center
                  px-5
                  py-3
                  rounded-xl
                  bg-cyan-500
                  text-slate-950
                  text-sm
                  font-black
                  hover:bg-cyan-400
                  transition
                "
              >
                🎟️ Zu den Tickets
              </a>

            </div>
          )}


          {/* EVENT-ID */}
          {(event.id || event.eventId) && (
            <div
              className="
                pt-4
                border-t
                border-slate-800
                text-[10px]
                text-slate-600
                uppercase
                tracking-widest
              "
            >
              Event-ID: {event.id || event.eventId}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}


function InfoBox({ icon, label, value }) {
  return (
    <div
      className="
        bg-[#07101f]
        border
        border-slate-800
        rounded-xl
        p-4
      "
    >
      <div
        className="
          text-[10px]
          uppercase
          tracking-widest
          text-slate-500
          mb-2
        "
      >
        {icon} {label}
      </div>

      <div className="text-sm font-bold text-white">
        {value}
      </div>
    </div>
  );
}


function ContentBox({ title, children }) {
  return (
    <section
      className="
        bg-[#07101f]
        border
        border-slate-800
        rounded-2xl
        p-5
      "
    >
      <h3
        className="
          text-sm
          font-black
          text-cyan-300
          uppercase
          tracking-wider
          mb-4
        "
      >
        {title}
      </h3>

      {children}
    </section>
  );
}


function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500">
        {label}
      </span>

      <span className="text-white font-bold text-right">
        {value}
      </span>
    </div>
  );
}
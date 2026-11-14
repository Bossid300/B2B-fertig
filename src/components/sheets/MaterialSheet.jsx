import { Fragment } from 'react';
import { useState } from 'react';
import { eventService } from '../../services/eventService';

const hasValue = (value) =>
  value !== undefined &&
  value !== null &&
  String(value).trim() !== '';

const PAYMENT_TERMS_LABELS = {
  sofort: 'Sofort nach Erhalt ohne Abzug',
  '14_netto': '14 Tage rein netto',
  '30_netto': '30 Tage rein netto',
  anzahlung: '50% Anzahlung / Rest nach Abnahme',
};

const TAX_TYPE_LABELS = {
  regel: 'Regelbesteuerung (zzgl. MwSt.)',
  klein: 'Kleinunternehmer-Regelung (§ 19 UStG)',
  befreit: 'Umsatzsteuerbefreit (Reverse-Charge)',
};

export default function MaterialSheet({ profile, showAllEvents = false }) {
  const [visibleEventCount, setVisibleEventCount] = useState(4);

  if (!profile || profile.show_stamm === false) return null;

  const canShow = (field) => profile[`show_${field}`] !== false;
  const visibleName = canShow('Klarname') ? profile.Klarname || profile.name : '';
  const visibleCategory = (canShow('category') && profile.category) || '';
  const visibleGenre = (canShow('genre') && profile.genre) || '';
  const title = visibleName || visibleCategory;

  const visibleAddress = [
    canShow('street') && profile.street,
    canShow('plz') && profile.plz,
    canShow('city') && profile.city,
  ].filter(hasValue);

  const addressVisible = profile.show_address !== false && visibleAddress.length > 0;

const keyStats = [
  {
    label: 'GENRE',
    value: profile.genre
  },
  {
    label: 'FORMATION',
    value: profile.formation
  },
  {
    label: 'SPIELDAUER',
    value: profile.duration_max
      ? `${profile.duration_max} Min`
      : null
  },
  {
    label: 'CHANGEOVER',
    value: profile.setup_time
      ? `${profile.setup_time} Min`
      : null
  },
];

  const contactName = [
    canShow('vorname') && profile.vorname,
    canShow('nachname') && profile.nachname,
  ].filter(hasValue).join(' ');

  const email = canShow('email') ? profile.email : '';
  const phone = canShow('phone') ? profile.phone : '';
  const website = canShow('website') ? profile.website : '';
  const description = canShow('description') ? profile.description : '';

  const hasPromoImage = hasValue(profile.avatarUrl);

  const hasRiderPdf =
    hasValue(profile.rider_stageplot_url) ||
    hasValue(profile.rider_backline) ||
    hasValue(profile.rider_monitors);

  const artistEvents = eventService.getEvents().filter((event) => {
    const ownerId = event?.owner_id || event?.ownerId;
    return ownerId != null && String(ownerId) === String(profile.id);
  });

  const visibleArtistEvents = showAllEvents
    ? artistEvents
    : artistEvents.slice(0, visibleEventCount);

  const businessDetails = [
    hasValue(profile.gage_min) && {
      label: 'Mindestgage',
      value: `€ ${profile.gage_min}`,
    },

    hasValue(profile.gage_max) && {
      label: 'Maximalgage',
      value: `€ ${profile.gage_max}`,
    },

    hasValue(profile.rate_hour) && {
      label: 'Stundensatz',
      value: `€ ${profile.rate_hour}`,
    },

    hasValue(profile.rate_day) && {
      label: 'Tagessatz',
      value: `€ ${profile.rate_day}`,
    },

    hasValue(profile.duration_max) && {
      label: 'Max. Spieldauer',
      value: `${profile.duration_max} Min`,
    },

    profile.payment_terms && {
      label: 'Zahlungsziel',
      value:
        PAYMENT_TERMS_LABELS[profile.payment_terms] ||
        profile.payment_terms,
    },

    profile.tax_type && {
      label: 'Steuerliche Einstufung',
      value:
        TAX_TYPE_LABELS[profile.tax_type] ||
        profile.tax_type,
    },

    profile.company_uid && {
      label: 'UID',
      value: profile.company_uid,
    },

    profile.steuernummer && {
      label: 'Steuernummer',
      value: profile.steuernummer,
    },
  ].filter(Boolean);

  return (
    <div className="location-standard-sheet min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans print:min-h-0 print:h-auto print:p-0   print:overflow-visible">
      <div className="max-w-6xl mx-auto bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700 print:max-w-none print:shadow-none print:overflow-visible print:h-auto">
        
        {/* HEADER SECTION */}
        <header className="p-6 print:px-10 print:py-10 bg-gradient-to-r from-yellow-950 via-slate-800 to-slate-900 border-b border-yellow-500/30   print:p-0 print:shadow-none">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <span className="text-xs font-semibold tracking-widest text-yellow-400 uppercase bg-yellow-950/60 px-3 py-1 rounded-full border border-yellow-800  ">
              Material Standard Sheet
            </span>
            {hasValue(profile.id) && (
              <span className="text-xs text-slate-400 font-mono ">
                GIGSDA ID: {profile.id}
              </span>
            )}
          </div>

          {hasValue(title) && (
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-2  print:text-3xl">
              {title}
            </h1>
          )}
          {(hasValue(visibleCategory) || hasValue(visibleGenre)) && (
            <p className="text-lg text-yellow-300 font-medium ">
              {[visibleCategory, visibleGenre].filter(hasValue).join(' | ')}
            </p>
          )}
        </header>

        {/* KEY STATS BAR */}
        {keyStats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-800/80 border-b border-slate-700 text-center print:grid-cols-4 print:grid print:gap-2 print:p-2 print:break-inside-avoid">
            {keyStats.map((stat) => (
              <div
                key={stat.label}
                className="p-3 bg-slate-900/60 rounded-lg border border-slate-700/50  print:border  print:p-2"
              >
                <div className="text-xl md:text-2xl font-bold text-yellow-400 ">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400 uppercase font-medium mt-1 ">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        <main className="p-6 print:p-4 space-y-8 print:p-0 print:space-y-4">
          
          {/* PORTRAIT & ATMOSPHÄRE */}
          {hasValue(description) && (
            <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40  print:border  print:p-4 print:mt-6 print:break-inside-avoid">
              <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-wider mb-2 ">
                // Künstelerprofil &amp; Performance
              </h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line  print:p-0">
                {description}
              </p>
            </section>
          )}

          {/* KÜNSTLERDATEN & PERFORMANCE */}
          {(title || contactName || email || phone || website || addressVisible) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 print:break-inside-avoid">

              {/* KÜNSTLERDATEN */}
              <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40 space-y-3 print:p-3">
                <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-wider mb-3">
                  // Künstlerdaten
                </h2>

                <dl className="grid grid-cols-2 gap-y-2 text-sm">
                  <dt className="text-slate-400">Künstler:</dt>
                  <dd className="text-slate-200">{title}</dd>

                  <dt className="text-slate-400">Ansprechpartner:</dt>
                  <dd className="text-slate-200">{contactName}</dd>

                  <dt className="text-slate-400">Standort:</dt>
                  <dd className="text-slate-200">{profile.city || "-"}</dd>

                  <dt className="text-slate-400">Telefon:</dt>
                  <dd className="text-slate-200">{phone || "-"}</dd>

                  <dt className="text-slate-400">E-Mail:</dt>
                  <dd className="text-slate-200">{email || "-"}</dd>

                  <dt className="text-slate-400">Webseite:</dt>
                  <dd className="text-slate-200">{website || "-"}</dd>
                </dl>
              </section>

              {/* PERFORMANCE SPECS */}
              <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40 space-y-3 print:p-3">
                <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-wider mb-3">
                  // Performance Specs
                </h2>

                <dl className="grid grid-cols-2 gap-y-2 text-sm">
                  <dt className="text-slate-400">Haupt-Genres:</dt>
                  <dd className="text-slate-200">{profile.genre || "-"}</dd>

                  <dt className="text-slate-400">Hauptinstrument:</dt>
                  <dd className="text-slate-200">{profile.mainInstrument || "-"}</dd>

                  <dt className="text-slate-400">Nebeninstrument:</dt>
                  <dd className="text-slate-200">{profile.subInstruments || "-"}</dd>

                  <dt className="text-slate-400">Event-Eignung:</dt>
                  <dd className="text-slate-200">{profile.event_types || "-"}</dd>
                </dl>
              </section>

            </div>
          )}

          {/* PROMOFOTO & TECHNCAL RIDER */}
          {(hasPromoImage || hasRiderPdf) && (
            <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40 space-y-5 print:p-3 print:break-inside-avoid">
              <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-wider">
                // Promofoto & technische Dokumente
              </h2>

              <div className="location-standard-sheet-media-grid grid grid-cols-1 md:grid-cols-2 gap-6 print:grid print:grid-cols-2 print:gap-4">

                {hasPromoImage && (
                  <div className="location-standard-sheet-media-card rounded-xl border border-slate-700 bg-slate-950 p-3 print:w-full print:break-inside-avoid">
                    <p className="location-standard-sheet-media-title text-sm font-bold text-yellow-400 uppercase tracking-wider mb-2">
                      Promofoto / Pressebild
                    </p>

                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-full h-64 object-cover rounded-lg border border-slate-800 print:w-full print:h-36 print:object-cover print:rounded-md"
                    />
                  </div>
                )}

                {hasRiderPdf && (
                  <div className="location-standard-sheet-media-card rounded-xl border border-slate-700 bg-slate-950 p-3 print:w-full print:break-inside-avoid">
                    <p className="location-standard-sheet-media-title text-sm font-bold text-yellow-400 uppercase tracking-wider mb-2">
                      Technical Rider & Stageplot
                    </p>

                    <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-lg border border-slate-800 bg-slate-950 p-4 text-center print:h-auto print:p-2">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Technical Rider / Stageplot geladen
                        </p>
                      </div>
                      <a
                        href={profile.rider_stageplot_url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-yellow-500/30 px-4 py-2 text-xs font-bold uppercase tracking-wide text-yellow-400 no-underline transition hover:border-yellow-400 hover:text-yellow-300"
                      >
                        Rider / PDF öffnen
                      </a>
                      <p className="text-sm text-slate-300">
                        Monitoring: {profile.rider_monitors}
                      </p>

                      <p className="text-sm text-slate-300">
                        Backline: {profile.rider_backline}
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </section>
          )}




          {/* INPUT-PATCH-MATRIX & KANALBELEGUNG */}
          <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40 space-y-4 print:p-3 print:break-inside-avoid">
            <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-wider">
              // INPUT-PATCH-MATRIX & KANALBELEGUNG
            </h2>

            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-yellow-400 uppercase text-xs">
                  <tr>
                    <th className="p-3">CH</th>
                    <th className="p-3">Audio-Signal / Quelle</th>
                    <th className="p-3">Mikrofon / DI-Typ</th>
                    <th className="p-3">Stativ</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {[1, 2, 3, 4, 5].map((nr) => {
                    const signal = profile[`ch${nr}_signal`];
                    const mic = profile[`ch${nr}_mic`];
                    const stand = profile[`ch${nr}_stand`];

                    if (!signal && !mic && !stand) return null;

                    return (
                      <tr key={nr}>
                        <td className="p-3 font-bold text-yellow-400">
                          {nr}
                        </td>

                        <td className="p-3">
                          {signal || "—"}
                        </td>

                        <td className="p-3">
                          {mic || "—"}
                        </td>

                        <td className="p-3">
                          {stand || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>





          {/* VERANSTALTUNGS-FORMATE & REFERENZEN */}
          <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40 space-y-4  print:border  print:p-4 print:break-inside-avoid">
              <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-wider ">
              // Veranstaltungs-Formate &amp; Referenzen
            </h2>
            <div className="overflow-x-auto rounded-lg border border-slate-700  print:overflow-visible">
              <table className="w-full text-left text-sm text-slate-300 ">
                <thead className="bg-slate-900 text-slate-400 uppercase text-xs  ">
                  <tr>
                    <th className="p-3 print:p-2">Event / Titel</th>
                    <th className="p-3 print:p-2">Datum</th>
                    <th className="p-3 print:p-2">Format / Genre</th>
                    <th className="p-3 print:p-2">Line-up</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-gray-300">
                  {artistEvents.length > 0 ? (
                    visibleArtistEvents.map((event, index) => (
                      <tr key={event.id || event.eventId || event._id || index} className="hover:bg-slate-700/30">
                        <td className="p-3 font-medium text-white  print:p-2">
                          {event.title || event.name || ''}
                        </td>
                        <td className="p-3 print:p-2">
                          {event.displayDate || event.date_display || event.event_date || event.date || ''}
                        </td>
                        <td className="p-3 print:p-2">
                          {event.category || event.promotionData?.category || event.event_type || event.type || ''}
                        </td>
                        <td className="p-3 print:p-2">
                          {event.lineup || event.promotionData?.lineup || ''}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-3 text-slate-500  print:p-2">
                        Keine zugeordneten Events vorhanden.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {!showAllEvents && visibleEventCount < artistEvents.length && (
              <button
                type="button"
                onClick={() => setVisibleEventCount((count) => count + 4)}
                className="mx-auto mt-4 flex items-center gap-2 rounded-lg border border-yellow-500/30 px-4 py-2 text-sm font-semibold text-yellow-300 transition hover:border-yellow-400 hover:bg-yellow-950/40 print:hidden"
              >
                Weitere Events anzeigen
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M5.22 7.47a.75.75 0 0 1 1.06 0L10 11.19l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </section>

          {/* HONORAR & BOOKING */}
          {businessDetails.length > 0 && (
            <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40 print:p-3 print:break-inside-avoid">
              <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-wider mb-3">
                // HONORAR &amp; RAHMENBEDINGUNGEN
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                {/* Erste Spalte (z.B. Honorare) */}
                <dl className="grid grid-cols-2 gap-y-2">
                  {businessDetails.slice(0, Math.ceil(businessDetails.length / 2)).map(({ label, value }) => (
                    <Fragment key={label}>
                      <dt className="text-slate-400">{label}:</dt>
                      <dd className="text-slate-200 font-medium text-right md:text-left">{value}</dd>
                    </Fragment>
                  ))}
                </dl>

                {/* Zweite Spalte (z.B. Steuer / Buchung) */}
                <dl className="grid grid-cols-2 gap-y-2">
                  {businessDetails.slice(Math.ceil(businessDetails.length / 2)).map(({ label, value }) => (
                    <Fragment key={label}>
                      <dt className="text-slate-400">{label}:</dt>
                      <dd className="text-slate-200 font-medium text-right md:text-left">{value}</dd>
                    </Fragment>
                  ))}
                </dl>
              </div>
            </section>
          )}

          {/* B2B STATUS & BUCHUNG FOOTER */}
          {hasValue(email) && (
            <section className="bg-yellow-950/40 p-5 rounded-lg border border-yellow-900/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
              <div>
                <h3 className="text-sm font-bold text-yellow-300 uppercase tracking-wider ">
                  // Kontakt &amp; Buchungsanfrage
                </h3>
                {hasValue(contactName) && (
                  <p className="text-xs text-slate-300 mt-1 ">{contactName}</p>
                )}
              </div>
              <a
                href={`mailto:${email}`}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-medium text-sm rounded-lg transition-colors shadow-md text-center no-underline  print:border "
              >
                Buchungsanfrage senden
              </a>
            </section>
          )}
          
        </main>

        {/* FOOTER */}
        <footer className="p-4 bg-slate-900 text-center text-xs text-slate-500 border-t border-slate-700 flex justify-between items-center   ">
          {hasValue(title) && <span>Material Standard Sheet: {title}</span>}
          {hasValue(profile.id) && <span>GIGSDA ID: {profile.id}</span>}
        </footer>

      </div>
    </div>
  );
}
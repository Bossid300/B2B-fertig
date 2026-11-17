import { useState } from 'react';
import { eventService } from '../../services/eventService';

const hasValue = (value) =>
  value !== undefined &&
  value !== null &&
  String(value).trim() !== '';

const SERVICE_MODEL_LABELS = {
  dry_hire: 'Dry-Hire',
  full_service: 'Full Service',
  dry_hire_full_service: 'Dry-Hire + Full Service',
};

const LEGACY_SELECTION_LABEL = 'Bitte Auswahl ergänzen';

const getServiceModelLabel = (value) => {
  if (!hasValue(value)) return value;
  return SERVICE_MODEL_LABELS[value] || String(value).replace(/_/g, ' ');
};

const getSelectionLabel = (value) =>
  ['ja', 'nein'].includes(String(value).toLowerCase())
    ? LEGACY_SELECTION_LABEL
    : value;

const PORTFOLIO_FIELDS = [
  { key: 'verleiher_portfolio_ton', label: 'Ton' },
  { key: 'verleiher_portfolio_pulte', label: 'Pulte' },
  { key: 'verleiher_portfolio_licht', label: 'Licht' },
  { key: 'verleiher_portfolio_video', label: 'Video' },
  { key: 'verleiher_portfolio_rigging', label: 'Rigging' },
];

const LOGISTICS_FIELDS = [
  { key: 'verleiher_electrical_inspection', label: 'Elektrische Prüfung' },
  { key: 'verleiher_motors_hoists', label: 'Motoren & Hebezeuge' },
  { key: 'verleiher_packaging', label: 'Verpackung' },
  { key: 'verleiher_fleet_standards', label: 'Fuhrpark' },
];

const DRY_HIRE_TIERS = [
  {
    label: '1 Einsatztag',
    factor: 'verleiher_dry_hire_1_day_factor',
    conditions: 'verleiher_dry_hire_1_day_conditions',
  },
  {
    label: '2 Einsatztage',
    factor: 'verleiher_dry_hire_2_days_factor',
    conditions: 'verleiher_dry_hire_2_days_conditions',
  },
  {
    label: '3–4 Einsatztage',
    factor: 'verleiher_dry_hire_3_4_days_factor',
    conditions: 'verleiher_dry_hire_3_4_days_conditions',
  },
  {
    label: '1 Woche',
    factor: 'verleiher_dry_hire_1_week_factor',
    conditions: 'verleiher_dry_hire_1_week_conditions',
  },
];

const RENTAL_TERMS_FIELDS = [
  { key: 'verleiher_material_handover', label: 'Materialausgabe' },
  { key: 'verleiher_emergency_support', label: '24/7 Notfall-Support' },
  { key: 'verleiher_deposit', label: 'Kaution / Sicherheitsleistung' },
  { key: 'verleiher_payment_terms', label: 'Zahlungsziel' },
  { key: 'verleiher_transport_costs', label: 'Transportkosten' },
  { key: 'verleiher_insurance', label: 'Versicherung' },
];

function ValueList({ profile, fields }) {
  const entries = fields.filter(({ key }) => hasValue(profile[key]));
  if (entries.length === 0) return null;

  return (
    <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
      {entries.map(({ key, label }) => (
        <div key={key} className="min-w-0">
          <dt className="mb-1 text-xs font-medium uppercase text-slate-400">
            {label}
          </dt>
          <dd className="whitespace-pre-line break-words text-slate-200">
            {profile[key]}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function SheetSection({ title, children }) {
  return (
    <section className="break-inside-avoid rounded-lg border border-slate-700/40 bg-slate-900/40 p-5 print:border print:p-4">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-yellow-400">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function VerleiherSheet({ profile, showAllEvents = false }) {
  const [visibleEventCount, setVisibleEventCount] = useState(4);
  if (!profile || profile.show_stamm === false) return null;

  const canShow = (field) => profile[`show_${field}`] !== false;
  const visibleName = canShow('Klarname')
    ? profile.Klarname || profile.name
    : '';
  const visibleCategory = (canShow('category') && profile.category) || '';
  const visibleGenre = (canShow('genre') && profile.genre) || '';
  const title = visibleName || visibleCategory;

  const contactName = [
    canShow('vorname') && profile.vorname,
    canShow('nachname') && profile.nachname,
  ].filter(hasValue).join(' ');

  const email = canShow('email') ? profile.email : '';
  const phone = canShow('phone') ? profile.phone : '';
  const website = canShow('website') ? profile.website : '';
  const description = canShow('description') ? profile.description : '';

  const serviceModel = getServiceModelLabel(profile.verleiher_service_model);
  const ownFleet = getSelectionLabel(profile.verleiher_own_fleet);
  const support247 = getSelectionLabel(profile.verleiher_24_7_support);

  const serviceFields = [
    {
      key: 'verleiher_storage_area',
      label: 'Lagerfläche',
      format: (value) => `${value} m²`,
    },
    {
      key: 'verleiher_service_model',
      label: 'Service-Modell',
      value: serviceModel,
    },
    {
      key: 'verleiher_own_fleet',
      label: 'Eigener Fuhrpark',
      value: ownFleet,
    },
    {
      key: 'verleiher_24_7_support',
      label: '24/7 Support',
      value: support247,
    },
  ].filter(({ key, value }) =>
    hasValue(value !== undefined ? value : profile[key])
  );

  const dryHireTiers = DRY_HIRE_TIERS.filter(
    ({ factor, conditions }) =>
      hasValue(profile[factor]) || hasValue(profile[conditions])
  );

  const rentalTerms = RENTAL_TERMS_FIELDS.filter(({ key }) =>
    hasValue(profile[key])
  );

  const verleiherEvents = eventService.getEvents().filter((event) => {
    const ownerId = event?.owner_id || event?.ownerId;
    return ownerId != null && String(ownerId) === String(profile.id);
  });
  const visibleVerleiherEvents = showAllEvents
    ? verleiherEvents
    : verleiherEvents.slice(0, visibleEventCount);

  const keyStats = [
    {
      label: 'LAGERFLÄCHE',
      value: profile.verleiher_storage_area
        ? `${profile.verleiher_storage_area} m²`
        : null
    },
    {
      label: 'SERVICE MODI',
      value: serviceModel,
    },
    {
      label: 'FUHRPARK & DELIVERY',
      value: ownFleet,
    },
    {
      label: 'NOTFALL-SUPPORT',
      value: support247,
    },
  ];



  return (
    <div className="location-standard-sheet min-h-screen bg-slate-900 p-4 font-sans text-slate-100 print:min-h-0 print:p-0">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-2xl print:max-w-none print:overflow-visible print:shadow-none">
        
        {/* HEADER SECTION */}
        <header className="p-6 print:px-10 print:py-10 bg-gradient-to-r from-yellow-950 via-slate-800 to-slate-900 border-b border-yellow-500/30   print:p-0 print:shadow-none">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <h1 className="text-xs font-semibold tracking-widest text-yellow-400 uppercase bg-yellow-950/60 px-3 py-1 rounded-full border border-yellow-800">
              Verleiher Standard Sheet
            </h1>
            {hasValue(profile.id) && (
              <span className="text-xs text-slate-400 font-mono ">
                GIGSDA ID: {profile.id}
              </span>
            )}
          </div>

          {hasValue(title) && (
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-2 print:text-3xl">
              {title}
            </h2>
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


        <main className="space-y-6 p-6 print:space-y-4 print:p-4">

          {/* PORTRAIT & ATMOSPHÄRE */}
          {hasValue(description) && (
            <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40  print:border  print:p-4 print:mt-6 print:break-inside-avoid">
              <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-wider mb-2 ">
                // ÜBER UNSEREN MIETPARK
              </h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line  print:p-0">
                {description}
              </p>
            </section>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 print:break-inside-avoid">

            {/* Mietpark & Service */}        
  {/*           <SheetSection title="Mietpark & Service">
              {serviceFields.length > 0 ? (
                <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                  {serviceFields.map(({ key, label, value, format }) => (
                    <div key={key}>
                      <dt className="mb-1 text-xs font-medium uppercase text-slate-400">
                        {label}
                      </dt>
                      <dd className="text-slate-200">
                        {value ?? format?.(profile[key]) ?? profile[key]}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-sm text-slate-500">Keine Angaben hinterlegt.</p>
              )}
            </SheetSection>
  */}

            {/* Mietpark & Portfolio */}
            <SheetSection title="// Mietpark-Portfolio">
              <ValueList profile={profile} fields={PORTFOLIO_FIELDS} />
              {PORTFOLIO_FIELDS.every(({ key }) => !hasValue(profile[key])) && (
                <p className="text-sm text-slate-500">Keine Angaben hinterlegt.</p>
              )}
            </SheetSection>

            {/* Logistik & Prüfstandards */}
            <SheetSection title="// Logistik & Prüfstandards">
              <ValueList profile={profile} fields={LOGISTICS_FIELDS} />
              {LOGISTICS_FIELDS.every(({ key }) => !hasValue(profile[key])) && (
                <p className="text-sm text-slate-500">Keine Angaben hinterlegt.</p>
              )}
            </SheetSection>
          </div>



          {/* VERLEIHERDATEN & KONTAKT */}
          {(title || contactName || email || phone || website || addressVisible) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 print:break-inside-avoid">

              {/* VERLEIHERDATEN */}
              <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40 space-y-3 print:p-3">
                <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-wider mb-3">
                  // Verleiherdaten
                </h2>

                <dl className="grid grid-cols-2 gap-y-2 text-sm">
                  <dt className="text-slate-400">Firmenname:</dt>
                  <dd className="text-slate-200">{title}</dd>
                  <dt className="text-slate-400">Ansprechpartner:</dt>
                  <dd className="text-slate-200">{contactName}</dd>
                  <dt className="text-slate-400">Standort:</dt>
                  <dd className="text-slate-200">{profile.city || "-"}</dd>
                </dl>
              </section>

              {/* KONTAKT */}
              <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40 space-y-3 print:p-3">
                <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-wider mb-3">
                  // Kontakt
                </h2>
                <dl className="grid grid-cols-2 gap-y-2 text-sm">
                  <dt className="text-slate-400">Telefon:</dt>
                  <dd className="text-slate-200">{phone || '-'}</dd>
                  <dt className="text-slate-400">E-Mail:</dt>
                  <dd className="text-slate-200">{email || '-'}</dd>
                  <dt className="text-slate-400">Webseite:</dt>
                  <dd className="text-slate-200">{website || '-'}</dd>
                </dl>
              </section>

            </div>
          )}

          {/* Dry-Hire-Staffelung */}
          <SheetSection title="// Dry-Hire-Staffelung">
            {dryHireTiers.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-slate-700">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900 text-xs uppercase text-slate-400">
                    <tr>
                      <th className="p-3">Einsatzdauer</th>
                      <th className="p-3">Berechnungsfaktor</th>
                      <th className="p-3">Konditionen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {dryHireTiers.map(({ label, factor, conditions }) => (
                      <tr key={label}>
                        <th scope="row" className="p-3 font-medium text-slate-200">
                          {label}
                        </th>
                        <td className="whitespace-pre-line p-3 text-slate-300">
                          {profile[factor] || '–'}
                        </td>
                        <td className="whitespace-pre-line p-3 text-slate-300">
                          {profile[conditions] || '–'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Keine Angaben hinterlegt.</p>
            )}
          </SheetSection>


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
                  {verleiherEvents.length > 0 ? (
                    visibleVerleiherEvents.map((event, index) => (
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
            {!showAllEvents && visibleEventCount < verleiherEvents.length && (
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


          {/* Mietbedingungen */}
          <SheetSection title="// Mietbedingungen">
            <ValueList profile={profile} fields={RENTAL_TERMS_FIELDS} />
            {rentalTerms.length === 0 && (
              <p className="text-sm text-slate-500">Keine Angaben hinterlegt.</p>
            )}
          </SheetSection>

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
          {hasValue(title) && <span>Verleiher Standard Sheet: {title}</span>}
          {hasValue(profile.id) && <span>GIGSDA ID: {profile.id}</span>}
        </footer>


      </div>
    </div>
  );
}

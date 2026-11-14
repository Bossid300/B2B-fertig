import { useState } from 'react';
import { eventService } from '../../services/eventService';

const hasValue = (value) =>
  value !== undefined &&
  value !== null &&
  String(value).trim() !== '';

const PROFILE_SECTIONS = [
  {
    title: '// UNTERNEHMENSPROFIL & EINSATZKENNZAHLEN',
    fields: [
      { key: 'security_company_management', label: 'Unternehmen & Leitung' },
      { key: 'security_location_radius', label: 'Standort & Aktionsradius' },
      { key: 'security_staff_pool_scalability', label: 'Personalpool & Skalierbarkeit' },
      { key: 'security_authorizations', label: 'Behördliche Zulassung' },
      { key: 'security_insurance', label: 'Versicherungsschutz' },
      { key: 'security_contact_availability', label: 'Kontakt & Erreichbarkeit' },
    ],
  },
  {
    title: '// LEISTUNGSSPEKTRUM FÜR VERANSTALTER',
    fields: [
      { key: 'security_service_access_control', label: 'Einlass- & Zugangskontrollen' },
      { key: 'security_service_stage_backstage', label: 'Bühnengraben & Backstage-Schutz' },
      { key: 'security_service_vip_artist', label: 'VIP- & Artist-Begleitschutz' },
      { key: 'security_service_site_security', label: 'Geländesicherung & Nachtwachen' },
      { key: 'security_service_concepts_authorities', label: 'Sicherheitskonzepte & Behördenabstimmung' },
    ],
  },
  {
    title: '// QUALIFIKATIONEN & TECHNISCHE AUSSTATTUNG',
    fields: [
      { key: 'security_qualification_personnel', label: 'Personal-Qualifikation' },
      { key: 'security_communication', label: 'Kommunikation' },
      { key: 'security_control_equipment', label: 'Kontroll-Equipment' },
      { key: 'security_appearance_clothing', label: 'Auftreten & Dienstkleidung' },
    ],
  },
];

const BUSINESS_FIELDS = [
  { key: 'security_price_security_staff', label: 'Sicherheitsmitarbeiter' },
  { key: 'security_price_shift_lead', label: 'Einsatzleiter / Schichtführer' },
  { key: 'security_price_night_watch_setup', label: 'Nachtwache / Auf- & Abbau' },
  { key: 'security_minimum_assignment', label: 'Mindesteinsatzzeit' },
  { key: 'security_payment_terms', label: 'Zahlungsziel' },
];

function ProfileDetails({ title, fields, profile }) {
  const details = fields.filter(({ key }) => hasValue(profile[key]));
  if (details.length === 0) return null;

  return (
    <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40 print:p-3 print:break-inside-avoid">
      <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-3">
        {title}
      </h2>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
        {details.map(({ key, label }) => (
          <div key={key} className="min-w-0">
            <dt className="text-slate-400">{label}</dt>
            <dd className="text-slate-200 whitespace-pre-wrap break-words">{profile[key]}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function SecuritySheet({ profile, showAllEvents = false }) {
  const [visibleEventCount, setVisibleEventCount] = useState(4);

  if (!profile || profile.show_stamm === false) return null;

  const canShow = (field) => profile[`show_${field}`] !== false;
  const visibleName = canShow('Klarname') ? profile.Klarname || profile.name : '';
  const category = canShow('category') ? profile.category : '';
  const title = visibleName || category;

  const keyStats = [
    { label: 'PERSONALPOOL', value: profile.security_personnel_pool },
    { label: 'MAX. TEAMGRÖSSE', value: profile.security_max_team_size },
    { label: 'EINSATZRADIUS', value: profile.security_operating_radius },
    { label: '24/7 BEREITSCHAFT', value: profile.security_247_dispatch },
  ].filter((stat) => hasValue(stat.value));

  const securityEvents = eventService.getEvents().filter((event) => {
    const ownerId = event?.owner_id || event?.ownerId;
    return ownerId != null && String(ownerId) === String(profile.id);
  });

  const visibleSecurityEvents = showAllEvents
    ? securityEvents
    : securityEvents.slice(0, visibleEventCount);

  const businessDetails = BUSINESS_FIELDS.filter(({ key }) =>
    hasValue(profile[key])
  );

  const visibleCity = canShow('city') ? profile.city : '';
 
  const contactName = [
    canShow('vorname') && profile.vorname,
    canShow('nachname') && profile.nachname,
  ].filter(hasValue).join(' ');
  const email = canShow('email') ? profile.email : '';
  const phone = canShow('phone') ? profile.phone : '';
  const website = canShow('website') ? profile.website : '';
  const description = canShow('description') ? profile.description : '';



   console.log(profile); 


  return (
    <div className="location-standard-sheet min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans print:min-h-0 print:h-auto print:p-0 print:overflow-visible">
      <div className="max-w-6xl mx-auto bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700 print:max-w-none print:shadow-none print:overflow-visible print:h-auto">
        
        {/* HEADER SECTION */}
        <header className="p-6 print:px-10 print:py-10 bg-gradient-to-r from-indigo-950 via-slate-800 to-slate-900 border-b border-indigo-500/30 print:p-0 print:shadow-none">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <span className="text-xs font-semibold tracking-widest text-indigo-400 uppercase bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800">
              Security Standard Sheet
            </span>
            {hasValue(profile.id) && (
              <span className="text-xs text-slate-400 font-mono">
                GIGSDA ID: {profile.id}
              </span>
            )}
          </div>
          {hasValue(title) && (
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-2 print:text-3xl">
              {title}
            </h1>
          )}
          {hasValue(category) && (
            <p className="text-lg text-indigo-300 font-medium">{category}</p>
          )}
        </header>

        {/* KEY STATS BAR */}
        {keyStats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-800/80 border-b border-slate-700 text-center print:grid-cols-5 print:gap-2 print:p-2 print:break-inside-avoid">
            {keyStats.map((stat) => (
              <div
                key={stat.label}
                className="p-3 bg-slate-900/60 rounded-lg border border-slate-700/50 print:p-2"
              >
                <div className="text-xl md:text-3xl font-bold text-indigo-400 break-words">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400 uppercase font-medium mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        <main className="p-6 print:p-4 space-y-8 print:p-0 print:space-y-4">

          {/* Securityprofil & Performance */}          
          {hasValue(description) && (
            <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40  print:border  print:p-4 print:mt-6 print:break-inside-avoid">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-indigo-400">
                // Securityprofil &amp; Performance
              </h2>
              <p className="whitespace-pre-line leading-relaxed text-slate-300">
                {description}
              </p>
            </section>
          )}

          {/* Stammdaten & Kontakt */}  
          {(title || contactName || email || phone || website || hasValue(visibleCity)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 print:break-inside-avoid">  

              {/* Securitydaten */}           
              <section className="space-y-3 rounded-lg border border-slate-700/40 bg-slate-900/40 p-5 print:break-inside-avoid print:p-3">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-indigo-400">
                  // Securitydaten
                </h2>
                
                <dl className="grid grid-cols-2 gap-y-2 text-sm">
                  {[
                    { label: 'Firmenname', value: title },
                    { label: 'Ansprechpartner', value: contactName },
                    { label: 'Standort', value: profile.city },
                  ].filter(({ value }) => hasValue(value)).map(({ label, value }) => (
                    <div key={label} className="contents">
                      <dt className="text-slate-400">{label}:</dt>
                      <dd className="text-slate-200 whitespace-pre-wrap">{value}</dd>
                    </div>
                  ))}
                </dl>
{/* 
                <dl className="grid grid-cols-1 gap-y-2 text-sm md:grid-cols-2 md:gap-x-8">
                  {[
                    { label: 'Unternehmen & Leitung', value: profile.security_company_management },
                    { label: 'Standort & Aktionsradius', value: profile.security_location_radius },
                    { label: 'Kontakt & Erreichbarkeit', value: profile.security_contact_availability },
                  ].filter(({ value }) => hasValue(value)).map(({ label, value }) => (
                    <div key={label} className="contents">
                      <dt className="text-slate-400">{label}:</dt>
                      <dd className="text-slate-200 whitespace-pre-wrap">{value}</dd>
                    </div>
                  ))}
                </dl>

                  <dl className="grid grid-cols-2 gap-y-2 text-sm">
                  <dt className="text-slate-400">Firmenname:</dt>
                  <dd className="text-slate-200">{title}</dd>

                  <dt className="text-slate-400">Ansprechpartner:</dt>
                  <dd className="text-slate-200">{contactName}</dd>

                  <dt className="text-slate-400">Standort:</dt>
                  <dd className="text-slate-200">{profile.city || "-"}</dd>
                </dl>
 */}
              </section>

              {/* KONTAKT */}
              <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40 space-y-3 print:p-3">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-indigo-400">
                  // Kontakt
                </h2>
                <dl className="grid grid-cols-2 gap-y-2 text-sm">
                  {[
                    { label: 'Telefon', value: phone },
                    { label: 'E-Mail', value: email },
                    { label: 'Webseite', value: website },
                  ].filter(({ value }) => hasValue(value)).map(({ label, value }) => (
                    <div key={label} className="contents">
                      <dt className="text-slate-400">{label}:</dt>
                      <dd className="text-slate-200 break-all">{value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>
          )}

          {PROFILE_SECTIONS.map((section) => (
            <ProfileDetails
              key={section.title}
              title={section.title}
              fields={section.fields}
              profile={profile}
            />
          ))}

          {(
            <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40 space-y-4 print:p-4 print:break-inside-avoid">
              <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
                // VERIFIZIERTE EVENT-REFERENZEN
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-700 print:overflow-visible">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-xs">
                    <tr>
                      <th className="p-3 print:p-2">Event / Titel</th>
                      <th className="p-3 print:p-2">Datum</th>
                      <th className="p-3 print:p-2">Format / Genre</th>
                      <th className="p-3 print:p-2">Line-up</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 print:divide-gray-300">
                    {securityEvents.length > 0 ? visibleSecurityEvents.map((event, index) => (
                      <tr
                        key={event.id || event.eventId || event._id || index}
                        className="hover:bg-slate-700/30"
                      >
                        <td className="p-3 font-medium text-white print:p-2">
                          {event.title || event.name}
                        </td>
                        <td className="p-3 print:p-2">
                          {event.displayDate || event.date_display || event.event_date || event.date}
                        </td>
                        <td className="p-3 print:p-2">
                          {event.category || event.promotionData?.category || event.event_type || event.type}
                        </td>
                        <td className="p-3 print:p-2">
                          {event.lineup || event.promotionData?.lineup}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="p-3 text-slate-500 print:p-2">
                          Keine zugeordneten Events vorhanden.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {!showAllEvents && visibleEventCount < securityEvents.length && (
                <button
                  type="button"
                  onClick={() => setVisibleEventCount((count) => count + 4)}
                  className="mx-auto mt-4 flex items-center gap-2 rounded-lg border border-indigo-500/30 px-4 py-2 text-sm font-semibold text-indigo-300 transition hover:border-indigo-400 hover:bg-indigo-950/40 print:hidden"
                >
                  Weitere Events anzeigen
                  <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path fillRule="evenodd" d="M5.22 7.47a.75.75 0 0 1 1.06 0L10 11.19l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </section>
          )}

          {businessDetails.length > 0 && (
            <ProfileDetails
              title="// KONDITIONEN & ABRECHNUNGSRAHMEN"
              fields={businessDetails}
              profile={profile}
            />
          )}



          {hasValue(email) && (
            <section className="flex flex-col items-start justify-between gap-4 rounded-lg border border-indigo-900/60 bg-indigo-950/40 p-5 md:flex-row md:items-center print:hidden">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300">
                  // Kontakt &amp; Buchungsanfrage
                </h3>
                {hasValue(contactName) && (
                  <p className="mt-1 text-xs text-slate-300">{contactName}</p>
                )}
              </div>
              <a
                href={`mailto:${email}`}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white no-underline shadow-md transition-colors hover:bg-indigo-500"
              >
                Buchungsanfrage senden
              </a>
            </section>
          )}
        </main>

        <footer className="p-4 bg-slate-900 text-center text-xs text-slate-500 border-t border-slate-700 flex justify-between items-center">
          {hasValue(title) && <span>Security Standard Sheet: {title}</span>}
          {hasValue(profile.id) && <span>GIGSDA ID: {profile.id}</span>}
        </footer>
      </div>
    </div>
  );
}

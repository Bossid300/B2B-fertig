import { Fragment, useState } from 'react';
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

const REPRESENTATION_TYPE_LABELS = {
  self: 'Eigenständig / Direktkontakt',
  management: 'Exklusiv-Management',
  booking: 'Booking-Agentur',
  dispo: 'Disponent / Einsatzleitung',
};

export default function TechnicianSheet({ profile, showAllEvents = false }) {
  const [visibleEventCount, setVisibleEventCount] = useState(4);

  if (!profile || profile.show_stamm === false) return null;

  const canShow = (field) => profile[`show_${field}`] !== false;
  const visibleName = canShow('Klarname')
    ? profile.Klarname || profile.name
    : '';
  const visibleTrade =
    (canShow('category') && profile.category) ||
    (canShow('gewerk') && profile.gewerk) ||
    '';
  const visibleCity = canShow('city') ? profile.city : '';
  const title = visibleName || visibleTrade;
  const contactName = [
    canShow('vorname') && profile.vorname,
    canShow('nachname') && profile.nachname,
  ].filter(hasValue).join(' ');
  const email = canShow('email') ? profile.email : '';
  const phone = canShow('phone') ? profile.phone : '';
  const website = canShow('website') ? profile.website : '';
  const description = canShow('description') ? profile.description : '';

  const hasPromoImage = hasValue(profile.avatarUrl);

  const skills = Array.isArray(profile.skills) ? profile.skills : [];
  const certificates = Array.isArray(profile.certificates)
    ? profile.certificates
    : [];
  const equipment = Array.isArray(profile.equipment)
    ? profile.equipment
    : [];
  const visibleSkills =
    profile.show_skills === false
      ? []
      : skills.filter(
          (skill, index) =>
            hasValue(skill) && profile.skills_visibility?.[index] !== false
        );
  const visibleCertificates =
    profile.show_certificates === false
      ? []
      : certificates.filter(
          (certificate, index) =>
            hasValue(certificate) &&
            profile.certificate_visibility?.[index] !== false
        );
  const visibleEquipment =
    profile.show_equipment === false
      ? []
      : equipment.filter((item) => item?.visible !== false);

  const keyStats = [
    { label: 'SPEZIFIZIERUNG', value: visibleTrade || 'Nicht angegeben' },
    { label: 'KOMPETENZEN', value: visibleSkills.length },
    { label: 'NACHWEISE', value: visibleCertificates.length },
    { label: 'EQUIPMENT', value: visibleEquipment.length },
  ];

  const technicianEvents = eventService.getEvents().filter((event) => {
    const ownerId = event?.owner_id || event?.ownerId;
    return ownerId != null && String(ownerId) === String(profile.id);
  });
  const visibleTechnicianEvents = showAllEvents
    ? technicianEvents
    : technicianEvents.slice(0, visibleEventCount);

  const businessDetails = profile.show_finance === true
    ? [
        profile.show_rate_hour !== false &&
          hasValue(profile.rate_hour) && {
            label: 'Stundensatz',
            value: `€ ${profile.rate_hour}`,
          },
        profile.show_rate_day !== false &&
          hasValue(profile.rate_day) && {
            label: 'Tagessatz',
            value: `€ ${profile.rate_day}`,
          },
        profile.show_payment_terms !== false &&
          hasValue(profile.payment_terms) && {
            label: 'Zahlungsziel',
            value:
              PAYMENT_TERMS_LABELS[profile.payment_terms] ||
              profile.payment_terms,
          },
        profile.show_tax_type !== false &&
          hasValue(profile.tax_type) && {
            label: 'Steuerliche Einstufung',
            value: TAX_TYPE_LABELS[profile.tax_type] || profile.tax_type,
          },
        profile.show_company_uid === true &&
          hasValue(profile.company_uid || profile.uid) && {
            label: 'UID',
            value: profile.company_uid || profile.uid,
          },
        profile.show_steuernummer === true &&
          hasValue(profile.steuernummer) && {
            label: 'Steuernummer',
            value: profile.steuernummer,
          },
      ].filter(Boolean)
    : [];

  const representationVisible =
    profile.show_representation !== false &&
    (
      profile.show_representation_type !== false ||
      profile.show_agent_name !== false ||
      profile.show_agent_email !== false ||
      profile.show_agent_phone !== false
    );
  const representationType = profile.representation_type || 'self';
  const representationDetails = [
    profile.show_representation_type !== false && {
      label: 'Vertretungsart',
      value:
        REPRESENTATION_TYPE_LABELS[representationType] || representationType,
    },
    profile.show_agent_name !== false &&
      hasValue(profile.agent_name) && {
        label: 'Vertretung / Agentur',
        value: profile.agent_name,
      },
    representationType !== 'self' &&
      profile.show_agent_email !== false &&
      hasValue(profile.agent_email) && {
        label: 'E-Mail Vertretung',
        value: profile.agent_email,
      },
    representationType !== 'self' &&
      profile.show_agent_phone !== false &&
      hasValue(profile.agent_phone) && {
        label: 'Telefon Vertretung',
        value: profile.agent_phone,
      },
  ].filter(Boolean);



  return (
    <div className="location-standard-sheet min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans print:min-h-0 print:h-auto print:p-0   print:overflow-visible">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-2xl print:h-auto print:max-w-none print:overflow-visible print:shadow-none">
        
        {/* HEADER SECTION */}       
        <header className="p-6 print:px-10 print:py-10 bg-gradient-to-r from-purple-950 via-slate-800 to-slate-900 border-b border-purple-500/30   print:p-0 print:shadow-none">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <span className="rounded-full border border-purple-800 bg-purple-950/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-purple-400">
              Technician Standard Sheet
            </span>
            {hasValue(profile.id) && (
              <span className="font-mono text-xs text-slate-400">
                GIGSDA ID: {profile.id}
              </span>
            )}
          </div>
          {hasValue(title) && (
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-white md:text-5xl print:text-3xl">
              {title}
            </h1>
          )}
          {hasValue(visibleTrade) && (
            <p className="text-lg font-medium text-purple-300">{visibleTrade}</p>
          )}
        </header>

        {/* KEY STATS BAR */}
        <div className="grid grid-cols-2 gap-4 border-b border-slate-700 bg-slate-800/80 p-6 text-center md:grid-cols-4 print:grid print:grid-cols-4 print:break-inside-avoid print:gap-2 print:p-2">
          {keyStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-slate-700/50 bg-slate-900/60 p-3 print:border print:p-2"
            >
              <div className="text-xl font-bold text-purple-400 md:text-2xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs font-medium uppercase text-slate-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <main className="p-6 print:p-4 space-y-8 print:p-0 print:space-y-4">

          {/* PORTRAIT & ATMOSPHÄRE */}          
          {hasValue(description) && (
            <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40  print:border  print:p-4 print:mt-6 print:break-inside-avoid">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-purple-400">
                // Technikerprofil &amp; Leistung
              </h2>
              <p className="whitespace-pre-line leading-relaxed text-slate-300">
                {description}
              </p>
            </section>
          )}

          {(title || contactName || email || phone || website || hasValue(visibleCity)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 print:break-inside-avoid">  

              {/* TECHNIKERDATEN */}           
              <section className="space-y-3 rounded-lg border border-slate-700/40 bg-slate-900/40 p-5 print:break-inside-avoid print:p-3">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-purple-400">
                  // TECHNIKERDATEN
                </h2>
                <dl className="grid grid-cols-1 gap-y-2 text-sm md:grid-cols-2 md:gap-x-8">
                  <dt className="text-slate-400">Techniker:</dt>
                  <dd className="text-slate-200">{title || '-'}</dd>
                  <dt className="text-slate-400">Ansprechpartner:</dt>
                  <dd className="text-slate-200">{contactName || '-'}</dd>
                  <dt className="text-slate-400">Standort:</dt>
                  <dd className="text-slate-200">{visibleCity || '-'}</dd>

                </dl>
              </section>

              {/* KONTAKT */}
              <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40 space-y-3 print:p-3">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-purple-400">
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

          {/* PROMOFOTO & INVENTAR */}
          {(hasPromoImage || visibleEquipment.length > 0) && (
            <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40 space-y-5 print:p-3 print:break-inside-avoid">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-purple-400">
                // Promofoto & Inventar
              </h2>

              <div className="location-standard-sheet-media-grid grid grid-cols-1 md:grid-cols-2 gap-6 print:grid print:grid-cols-2 print:gap-4">

                {hasPromoImage && (
                  <div className="location-standard-sheet-media-card rounded-xl border border-slate-700 bg-slate-950 p-3 print:w-full print:break-inside-avoid">
                    <p className="mb-3 text-sm font-bold uppercase tracking-wider text-purple-400">
                      Promofoto / Pressebild
                    </p>

                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-full h-64 object-cover rounded-lg border border-slate-800 print:w-full print:h-36 print:object-cover print:rounded-md"
                    />
                  </div>
                )}

                {visibleEquipment.length > 0 && (
                  <div className="location-standard-sheet-media-card rounded-xl border border-slate-700 bg-slate-950 p-3 print:w-full print:break-inside-avoid">
                    <p className="mb-3 text-sm font-bold uppercase tracking-wider text-purple-400">
                      // EQUIPMENT &amp; INVENTAR
                    </p>
                    <div className="flex max-h-64 flex-col gap-2 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-3 print:max-h-none print:overflow-visible print:p-2">
                      {visibleEquipment.map((item, index) => (
                        <div
                          key={`${item.item || 'equipment'}-${index}`}
                          className="rounded-lg border border-slate-800 bg-slate-900/60 p-2"
                        >
                          <p className="text-xs font-semibold text-white">
                            {item.item || 'Equipment'}
                          </p>
                          {hasValue(item.detail) && (
                            <p className="mt-1 text-xs text-slate-400">
                              {item.detail}
                            </p>
                          )}
                          {item.rental && (
                            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-cyan-300">
                              Dry-Hire Option
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </section>
          )}

          {/* KOMPETENZEN & ZERTIFIZIERUNGEN */}
          <section className="space-y-4 rounded-lg border border-slate-700/40 bg-slate-900/40 p-5 print:break-inside-avoid print:p-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-purple-400">
              // KOMPETENZEN &amp; ZERTIFIZIERUNGEN
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 print:grid-cols-2">
              <div>
                <h3 className="mb-2 border-b border-slate-700 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Kompetenzen
                </h3>
                {visibleSkills.length > 0 ? (
                  <ul className="flex flex-wrap gap-2">
                    {visibleSkills.map((skill, index) => (
                      <li
                        key={`${skill}-${index}`}
                        className="rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-200"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">
                    Keine veröffentlichten Kompetenzen.
                  </p>
                )}
              </div>
              <div>
                <h3 className="mb-2 border-b border-slate-700 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Nachweise &amp; Zertifikate
                </h3>
                {visibleCertificates.length > 0 ? (
                  <ul className="space-y-2">
                    {visibleCertificates.map((certificate, index) => (
                      <li
                        key={`${certificate}-${index}`}
                        className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-200"
                      >
                        {certificate}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">
                    Keine veröffentlichten Nachweise.
                  </p>
                )}
              </div>
            </div>
          </section>




          {representationVisible && (
            <section className="space-y-4 rounded-lg border border-slate-700/40 bg-slate-900/40 p-5 print:break-inside-avoid print:p-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-purple-400">
                // REPRÄSENTATION &amp; BOOKING AUTHORITY
              </h2>
              {representationDetails.length > 0 ? (
                <dl className="grid grid-cols-1 gap-y-2 text-sm md:grid-cols-2 md:gap-x-8">
                  {representationDetails.map(({ label, value }) => (
                    <Fragment key={label}>
                      <dt className="text-slate-400">{label}:</dt>
                      <dd className="text-slate-200">{value}</dd>
                    </Fragment>
                  ))}
                </dl>
              ) : (
                <p className="text-sm text-slate-500">
                  Keine veröffentlichten Vertretungsdaten.
                </p>
              )}
            </section>
          )}




          {/* VERANSTALTUNGS-FORMATE & REFERENZEN */}
          <section className="space-y-4 rounded-lg border border-slate-700/40 bg-slate-900/40 p-5 print:break-inside-avoid print:p-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-purple-400">
              // REFERENZEN &amp; EINSÄTZE
            </h2>
            <div className="overflow-x-auto rounded-lg border border-slate-700 print:overflow-visible">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="p-3 print:p-2">Event / Titel</th>
                    <th className="p-3 print:p-2">Datum</th>
                    <th className="p-3 print:p-2">Format</th>
                    <th className="p-3 print:p-2">Einsatz</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-gray-300">
                  {technicianEvents.length > 0 ? (
                    visibleTechnicianEvents.map((event, index) => (
                      <tr
                        key={event.id || event.eventId || event._id || index}
                        className="hover:bg-slate-700/30"
                      >
                        <td className="p-3 font-medium text-white print:p-2">
                          {event.title || event.name || ''}
                        </td>
                        <td className="p-3 print:p-2">
                          {event.displayDate ||
                            event.date_display ||
                            event.event_date ||
                            event.date ||
                            ''}
                        </td>
                        <td className="p-3 print:p-2">
                          {event.category ||
                            event.promotionData?.category ||
                            event.event_type ||
                            event.type ||
                            ''}
                        </td>
                        <td className="p-3 print:p-2">
                          {event.lineup || event.promotionData?.lineup || ''}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-3 text-slate-500 print:p-2">
                        Keine zugeordneten Einsätze vorhanden.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {!showAllEvents && visibleEventCount < technicianEvents.length && (
              <button
                type="button"
                onClick={() => setVisibleEventCount((count) => count + 4)}
                className="mx-auto mt-4 flex items-center gap-2 rounded-lg border border-purple-500/30 px-4 py-2 text-sm font-semibold text-purple-300 transition hover:border-purple-400 hover:bg-purple-950/40 print:hidden"
              >
                Weitere Einsätze anzeigen
              </button>
            )}
          </section>


          {/* HONORAR & BOOKING */}
          {businessDetails.length > 0 && (
            <section className="rounded-lg border border-slate-700/40 bg-slate-900/40 p-5 print:break-inside-avoid print:p-3">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-purple-400">
                // HONORAR &amp; ABWICKLUNG
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                {[
                  businessDetails.slice(0, Math.ceil(businessDetails.length / 2)),
                  businessDetails.slice(Math.ceil(businessDetails.length / 2)),
                ].map((details, columnIndex) => (
                  <dl key={columnIndex} className="grid grid-cols-2 gap-y-2">
                    {details.map(({ label, value }) => (
                      <Fragment key={label}>
                        <dt className="text-slate-400">{label}:</dt>
                        <dd className="font-medium text-slate-200">{value}</dd>
                      </Fragment>
                    ))}
                  </dl>
                ))}
              </div>
            </section>
          )}

          {hasValue(email) && (
            <section className="flex flex-col items-start justify-between gap-4 rounded-lg border border-purple-900/60 bg-purple-950/40 p-5 md:flex-row md:items-center print:hidden">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300">
                  // Kontakt &amp; Buchungsanfrage
                </h3>
                {hasValue(contactName) && (
                  <p className="mt-1 text-xs text-slate-300">{contactName}</p>
                )}
              </div>
              <a
                href={`mailto:${email}`}
                className="rounded-lg bg-purple-600 px-4 py-2 text-center text-sm font-medium text-white no-underline shadow-md transition-colors hover:bg-purple-500"
              >
                Buchungsanfrage senden
              </a>
            </section>
          )}
        </main>

        <footer className="flex items-center justify-between border-t border-slate-700 bg-slate-900 p-4 text-center text-xs text-slate-500">
          {hasValue(title) && <span>Technician Standard Sheet: {title}</span>}
          {hasValue(profile.id) && <span>GIGSDA ID: {profile.id}</span>}
        </footer>
      </div>
    </div>
  );
}

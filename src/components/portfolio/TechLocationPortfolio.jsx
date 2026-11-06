import { Fragment } from 'react';
import { useState } from 'react';
import { eventService } from '../../services/eventService';

const POWER_SUPPLY_LABELS = {
  'cee 63a': 'CEE 63A (Großbühne)',
  'cee 32a': 'CEE 32A (Mittelbühne / Club)',
  'cee 16a': 'CEE 16A (Kleine Bühne)',
  schuko: '230V Schuko (Standard)',
};

const hasValue = (value) =>
  value !== undefined &&
  value !== null &&
  String(value).trim() !== '';

const getPowerSupplyLabel = (value) => {
  const normalizedValue = String(value || '').trim().toLowerCase();
  return POWER_SUPPLY_LABELS[normalizedValue] || value;
};

const getRooms = (profile) => {
  const roomIndexes = Object.keys(profile)
    .map((key) => key.match(/^room(\d+)_/))
    .filter(Boolean)
    .map((match) => Number(match[1]));

  return [...new Set(roomIndexes)]
    .sort((a, b) => a - b)
    .filter((index) => profile[`room${index}_visibility`] !== false)
    .map((index) => ({
      index,
      name: profile[`room${index}_name`],
      area: profile[`room${index}_area`],
      standing: profile[`room${index}_steh`],
      banquet: profile[`room${index}_bankett`],
      theater: profile[`room${index}_theater`],
      uShape: profile[`room${index}_uform`],
      powerSupply: profile[`room${index}_power_supply`],
      curfew: profile[`room${index}_curfew_time`],
      openingHours: profile[`room${index}_opening_hours`],
      equipment: profile[`room${index}_equipment`],
      transport: profile[`room${index}_opnv`],
      conditions: profile[`room${index}_konditionen`],
      image: profile[`room${index}_img`],
      techPlan: profile[`room${index}_tech_plan`],
    }));
};

const getExternalUrl = (value) =>
  /^https?:\/\//i.test(value) ? value : `https://${value}`;

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

function ProfileValue({ label, value, children }) {
  if (!hasValue(value) && !children) return null;

  return (
    <div>
      <span className="text-slate-400 block text-xs">{label}:</span>
      {children || <span className="text-slate-200">{value}</span>}
    </div>
  );
}

export default function TechLocationPortfolio({ profile }) {
  const [visibleEventCount, setVisibleEventCount] = useState(4);

  if (!profile || profile.show_stamm === false) return null;

  const canShow = (field) => profile[`show_${field}`] !== false;
  const rooms = getRooms(profile);
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
  const firstRoom =
    rooms.find((room) =>
      [room.area, room.standing, room.powerSupply, room.curfew].some(hasValue)
    ) || rooms[0];

  const capacityColumns = [
    { key: 'area', label: 'Fläche', getValue: (room) => room.area, format: (value) => `${value} m²` },
    { key: 'standing', label: 'Stehempfang', getValue: (room) => room.standing, format: (value) => `${value} Pers.` },
    { key: 'theater', label: 'Theater-Reihen', getValue: (room) => room.theater, format: (value) => `${value} Pers.` },
    { key: 'uShape', label: 'U-Form Bestuhlung', getValue: (room) => room.uShape, format: (value) => `${value} Pers.` },
    { key: 'banquet', label: 'Bankett-Gala', getValue: (room) => room.banquet, format: (value) => `${value} Pers.` },
  ].filter((column) => rooms.some((room) => hasValue(column.getValue(room))));

  const showRoomName = rooms.some((room) => hasValue(room.name));

  const keyStats = [
    { label: 'Gesamtfläche', value: hasValue(firstRoom?.area) ? `${firstRoom.area} m²` : null },
    { label: 'Max. Kapazität', value: hasValue(firstRoom?.standing) ? `${firstRoom.standing} Pax` : null },
    { label: 'Bühnenstrom', value: hasValue(firstRoom?.powerSupply) ? getPowerSupplyLabel(firstRoom.powerSupply) : null },
    { label: 'Sperrstunde', value: hasValue(firstRoom?.curfew) ? `${firstRoom.curfew} Uhr` : null },
  ].filter((stat) => hasValue(stat.value));

  const contactName = [
    canShow('vorname') && profile.vorname,
    canShow('nachname') && profile.nachname,
  ].filter(hasValue).join(' ');

  const email = canShow('email') ? profile.email : '';
  const phone = canShow('phone') ? profile.phone : '';
  const website = canShow('website') ? profile.website : '';
  const description = canShow('description') ? profile.description : '';

  const hasRoomDetails = rooms.some((room) =>
    [room.equipment, room.transport, room.conditions].some(hasValue)
  );

  const hasRoomMedia = rooms.some((room) =>
    [room.image, room.techPlan].some(hasValue)
  );

  const locationEvents = eventService.getEvents().filter((event) => {
    const ownerId = event?.owner_id || event?.ownerId;
    return ownerId != null && String(ownerId) === String(profile.id);
  });

  const visibleLocationEvents = locationEvents.slice(0, visibleEventCount);

  const usageHighlights = [
    { key: 'location_rental_possible', label: 'Vermietung möglich' },
    { key: 'location_external_promoters_allowed', label: 'Fremdveranstalter erlaubt' },
    { key: 'location_club_operation_possible', label: 'Clubbetrieb möglich' },
    { key: 'location_concert_operation_possible', label: 'Konzertbetrieb möglich' },
    { key: 'location_corporate_events_possible', label: 'Firmenveranstaltungen möglich' },
    { key: 'location_weddings_possible', label: 'Hochzeiten möglich' },
    { key: 'location_workshops_possible', label: 'Workshops / Seminare möglich' },
    { key: 'location_dry_hire_possible', label: 'Dry Hire möglich' },
    { key: 'location_external_catering_allowed', label: 'Fremdcatering erlaubt' },
    { key: 'location_external_security_allowed', label: 'Eigene Security erlaubt' },
  ].filter(({ key }) => profile[key] === true);

  const rentalPriceFrom = profile.location_rental_price_from;
  const rentalPriceTo = profile.location_rental_price_to;
  const rentalPrice =
    hasValue(rentalPriceFrom) || hasValue(rentalPriceTo)
      ? `${hasValue(rentalPriceFrom) ? `${rentalPriceFrom} €` : ''} – ${hasValue(rentalPriceTo) ? `${rentalPriceTo} €` : ''}`
      : '';

  const businessDetails = [
    hasValue(profile.location_rental_model) && { label: 'Mietmodell', value: profile.location_rental_model },
    hasValue(rentalPrice) && { label: 'Mietpreis', value: rentalPrice },
    profile.show_payment_terms !== false && hasValue(profile.payment_terms) && {
      label: 'Zahlungsziel',
      value: PAYMENT_TERMS_LABELS[profile.payment_terms] || profile.payment_terms,
    },
    profile.location_dry_hire_possible === true && { label: 'Dry-Hire', value: 'Möglich' },
    profile.show_company_uid === true && hasValue(profile.company_uid || profile.uid) && {
      label: 'UID',
      value: profile.company_uid || profile.uid,
    },
    profile.show_steuernummer === true && hasValue(profile.steuernummer) && {
      label: 'Steuernummer',
      value: profile.steuernummer,
    },
    profile.show_tax_type !== false && hasValue(profile.tax_type) && {
      label: 'Steuerliche Einstufung',
      value: TAX_TYPE_LABELS[profile.tax_type] || profile.tax_type,
    },
  ].filter(Boolean);

  return (
    <div className="location-standard-sheet min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans print:min-h-0 print:h-auto print:p-0   print:overflow-visible">
      <div className="max-w-6xl mx-auto bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700 print:max-w-none print:shadow-none print:overflow-visible print:h-auto">
        
        {/* HEADER SECTION */}
        <header className="p-6 print:px-10 print:py-10 bg-gradient-to-r from-orange-950 via-slate-800 to-slate-900 border-b border-orange-500/30   print:p-0 print:shadow-none">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <span className="text-xs font-semibold tracking-widest text-orange-400 uppercase bg-orange-950/60 px-3 py-1 rounded-full border border-orange-800  ">
              Location Standard Sheet
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
            <p className="text-lg text-orange-300 font-medium ">
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
                <div className="text-xl md:text-2xl font-bold text-orange-400 ">
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
              <h2 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-2 ">
                // Location Portrait &amp; Atmosphäre
              </h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line  print:p-0">
                {description}
              </p>
            </section>
          )}


          {(title || contactName || email || phone || website || addressVisible) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 print:break-inside-avoid">
              <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40 space-y-3   print:p-3">
                <h2 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-3 ">
                  // Rahmendaten
                </h2>
                <div className="text-sm space-y-2 ">
                  <ProfileValue label="Location" value={title} />
                  <ProfileValue label="Ansprechperson" value={contactName} />
                  {addressVisible && (
                    <ProfileValue
                      label="Adresse"
                      value={visibleAddress.join(', ')}
                    />
                  )}
                </div>
              </section>

              <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40 space-y-3   print:p-3">
                <h2 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-3 ">
                  // Kontakt
                </h2>
                <div className="text-sm space-y-2 ">
                  {hasValue(phone) && (
                    <ProfileValue label="Telefon" value={phone}>
                      <a href={`tel:${phone}`} className="text-orange-400 no-underline hover:underline ">
                        {phone}
                      </a>
                    </ProfileValue>
                  )}
                  {hasValue(email) && (
                    <ProfileValue label="E-Mail" value={email}>
                      <a href={`mailto:${email}`} className="text-orange-400 no-underline hover:underline ">
                        {email}
                      </a>
                    </ProfileValue>
                  )}
                  {hasValue(website) && (
                    <ProfileValue label="Webseite" value={website}>
                      <a href={getExternalUrl(website)} target="_blank" rel="noreferrer" className="text-orange-400 hover:underline ">
                        {website}
                      </a>
                    </ProfileValue>
                  )}
                </div>
              </section>
            </div>
          )}

          {/* KAPAZITÄTEN NACH BESTUHLUNG */}
          {capacityColumns.length > 0 && (
            <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40   print:p-3 print:break-inside-avoid">
              <h2 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-3 ">
                // Kapazitäten nach Bestuhlung
              </h2>
              <div className="overflow-x-auto print:overflow-visible">
                <table className="w-full text-left text-sm text-slate-300 border-collapse ">
                  <thead className="text-slate-900 uppercase text-xs ">
                    <tr>
                      {showRoomName && (
                        <th className="p-3 border border-[#e6e6e6] bg-[#f5f5f5] print:p-2">Raum</th>
                      )}
                      {capacityColumns.map((column) => (
                        <th key={column.key} className="p-3 border border-[#e6e6e6] bg-[#f5f5f5] print:p-2">
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room) => {
                      if (!capacityColumns.some((column) => hasValue(column.getValue(room)))) return null;

                      return (
                        <tr key={room.index}>
                          {showRoomName && (
                            <td className="p-3 border border-[#e6e6e6] font-medium text-white  print:p-2">
                              {room.name}
                            </td>
                          )}
                          {capacityColumns.map((column) => {
                            const value = column.getValue(room);
                            return (
                              <td key={column.key} className="p-3 border border-[#e6e6e6] print:p-2">
                                {hasValue(value) ? column.format(value) : ''}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}


          {/* INHOUSE-TECHNIK & INFRASTRUKTUR */}
          {rooms.some((room) => hasValue(room.powerSupply) || hasValue(room.curfew) || hasValue(room.openingHours)) && (
            <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40  print:border  print:p-4 print:break-inside-avoid">
                  <h2 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-3 ">
                // Inhouse-Technik &amp; Infrastruktur
              </h2>
              <div className="space-y-4 text-sm text-slate-300 ">
                {rooms.map((room) => {
                  const details = [
                    hasValue(room.curfew) && { label: 'Sperrstunde', value: `${room.curfew} Uhr` },
                    hasValue(room.powerSupply) && { label: 'Strom', value: getPowerSupplyLabel(room.powerSupply) },
                    hasValue(room.openingHours) && { label: 'Öffnungszeiten', value: room.openingHours },
                  ].filter(Boolean);

                  if (details.length === 0) return null;

                  return (
                    <div key={room.index}>
                      {rooms.length > 1 && (
                        <h3 className="font-semibold text-white mb-2 ">{room.name}</h3>
                      )}
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {details.map((detail) => (
                          <div key={detail.label}>
                            <dt className="text-slate-400 ">{detail.label}:</dt>
                            <dd className="whitespace-pre-line ">{detail.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  );
                })}
              </div>
            </section>
          )}



          {/* TECHNIK, LOGISTIK & MIETBEDINGUNGEN */}
          {hasRoomDetails && (
            <section className="location-standard-sheet-media-section bg-slate-900/40 p-5 rounded-lg border border-slate-700/40 space-y-5   print:p-3">
              <h2 className="text-sm font-bold text-orange-400 uppercase tracking-wider ">
                // Technik, Logistik &amp; Mietbedingungen
              </h2>
              {rooms.map((room) => {
                const details = [
                  ['Inhouse-Technik & Equipment', room.equipment],
                  ['Parken & ÖPNV-Anbindung', room.transport],
                  ['Preise, Konditionen & Mietbedingungen', room.conditions],
                ].filter(([, value]) => hasValue(value));

                if (details.length === 0) return null;

                return (
                  <div key={room.index} className="location-standard-sheet-room space-y-4">
                    {rooms.length > 1 && (
                      <h3 className="font-semibold text-white ">{room.name}</h3>
                    )}
                    {details.map(([label, value]) => (
                      <p key={label} className="text-sm text-slate-300 whitespace-pre-line ">
                        <strong className="text-white ">{label}:</strong> {value}
                      </p>
                    ))}
                  </div>
                );
              })}
            </section>
          )}

          {/* RAUMFOTO & TECHNISCHE DOKUMENTE */}
          {hasRoomMedia && (
            <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40 space-y-5   print:p-3 print:break-inside-avoid">
              <h2 className="text-sm font-bold text-orange-400 uppercase tracking-wider ">
                // Raumfoto &amp; technische Dokumente
              </h2>
              {rooms.map((room) => {
                const hasRoomImage = hasValue(room.image);
                const hasTechPlan = hasValue(room.techPlan);

                if (!hasRoomImage && !hasTechPlan) return null;

                return (
                  <div key={room.index} className="location-standard-sheet-room space-y-4">
                    {rooms.length > 1 && (
                      <h3 className="font-semibold text-white ">{room.name}</h3>
                    )}
                    {/* HIER GEÄNDERT: print:grid print:grid-cols-2 anstelle von print:flex print:flex-col */}
                    <div className="location-standard-sheet-media-grid grid grid-cols-1 md:grid-cols-2 gap-6 print:grid print:grid-cols-2 print:gap-4">
                      {hasRoomImage && (
                        <div className="location-standard-sheet-media-card rounded-xl border border-slate-700 bg-slate-950 p-3   print:w-full print:break-inside-avoid">
                          <p className="location-standard-sheet-media-title text-sm font-bold text-orange-400 uppercase tracking-wider mb-2 ">
                            Raumfoto / Foto
                          </p>
                            <img
                              src={room.image}
                              alt={`Veranstaltungsraum ${room.name || ''}`}
                              className="w-full h-64 object-cover rounded-lg border border-slate-800 print:w-full print:h-36 print:object-cover print:rounded-md "
                            />
                        </div>
                      )}

                      {hasTechPlan && (
                        <div className="location-standard-sheet-media-card rounded-xl border border-slate-700 bg-slate-950 p-3   print:w-full print:break-inside-avoid">
                          <p className="location-standard-sheet-media-title text-sm font-bold text-orange-400 uppercase tracking-wider mb-2 ">
                            Bühnenplan &amp; Stromnetz-Matrix
                          </p>
                          {room.techPlan.includes('/api/media.php?preview=') ? (
                            <img
                              src={room.image}
                              alt={`Veranstaltungsraum ${room.name || ''}`}
                              className="w-full h-64 object-cover rounded-lg border border-slate-800 print:w-full print:h-40 print:object-cover "
                            />
                          ) : (
                            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-lg border border-slate-800 bg-slate-950 p-4 text-center print:h-auto print:p-2  ">
                              <div>
                                <p className="text-sm font-semibold text-white ">
                                  Technischer Rider / Plan geladen
                                </p>
                              </div>
                              <a
                                href={room.techPlan}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg border border-cyan-500/30 px-4 py-2 text-xs font-bold uppercase tracking-wide text-cyan-400 no-underline transition hover:border-cyan-400 hover:text-cyan-300  "
                              >
                                Dokument / PDF öffnen
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {/* VERANSTALTUNGS-FORMATE & REFERENZEN */}
          <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40 space-y-4  print:border  print:p-4 print:break-inside-avoid">
              <h2 className="text-sm font-bold text-orange-400 uppercase tracking-wider ">
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
                  {locationEvents.length > 0 ? (
                    visibleLocationEvents.map((event, index) => (
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
            {visibleEventCount < locationEvents.length && (
              <button
                type="button"
                onClick={() => setVisibleEventCount((count) => count + 4)}
                className="mx-auto mt-4 flex items-center gap-2 rounded-lg border border-orange-500/30 px-4 py-2 text-sm font-semibold text-orange-300 transition hover:border-orange-400 hover:bg-orange-950/40 print:hidden"
              >
                Weitere Events anzeigen
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M5.22 7.47a.75.75 0 0 1 1.06 0L10 11.19l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </section>

          {/* MIETKONDITIONEN & HIGHLIGHTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 print:break-inside-avoid">
            {businessDetails.length > 0 && (
              <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40   print:p-3">
                <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-3 ">
                  // Mietkonditionen &amp; B2B-Abwicklung
                </h2>
                <dl className="grid grid-cols-2 gap-y-2 text-sm ">
                  {businessDetails.map(({ label, value }) => (
                    <Fragment key={label}>
                      <dt className="text-slate-400 ">{label}:</dt>
                      <dd className="text-slate-200 ">{value}</dd>
                    </Fragment>
                  ))}
                </dl>
              </section>
            )}

            {usageHighlights.length > 0 && (
              <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40   print:p-3">
                <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-3 ">
                  // Highlights für Veranstalter
                </h2>
                <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside ">
                  {usageHighlights.map(({ key, label }) => (
                    <li key={key}>{label}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* B2B STATUS & BUCHUNG FOOTER */}
          {hasValue(email) && (
            <section className="bg-orange-950/40 p-5 rounded-lg border border-orange-900/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
              <div>
                <h3 className="text-sm font-bold text-orange-300 uppercase tracking-wider ">
                  // Kontakt &amp; Buchungsanfrage
                </h3>
                {hasValue(contactName) && (
                  <p className="text-xs text-slate-300 mt-1 ">{contactName}</p>
                )}
              </div>
              <a
                href={`mailto:${email}`}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-medium text-sm rounded-lg transition-colors shadow-md text-center no-underline  print:border "
              >
                Buchungsanfrage senden
              </a>
            </section>
          )}
          
        </main>

        {/* FOOTER */}
        <footer className="p-4 bg-slate-900 text-center text-xs text-slate-500 border-t border-slate-700 flex justify-between items-center   ">
          {hasValue(title) && <span>Location Standard Sheet: {title}</span>}
          {hasValue(profile.id) && <span>GIGSDA ID: {profile.id}</span>}
        </footer>

      </div>
    </div>
  );
}
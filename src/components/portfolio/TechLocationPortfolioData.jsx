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
  if (!profile || profile.show_stamm === false) return null;

  const canShow = (field) =>
    profile[`show_${field}`] !== false;
  const rooms = getRooms(profile);
  const visibleName = canShow('Klarname')
    ? profile.Klarname || profile.name
    : '';
  const visibleCategory =
    (canShow('category') && profile.category) || '';
  const visibleGenre =
    (canShow('genre') && profile.genre) || '';
  const title = visibleName || visibleCategory;

  const visibleAddress = [
    canShow('street') && profile.street,
    canShow('plz') && profile.plz,
    canShow('city') && profile.city,
  ].filter(hasValue);
  const addressVisible =
    profile.show_address !== false &&
    visibleAddress.length > 0;
  const firstRoom =
    rooms.find((room) =>
      [room.area, room.standing, room.powerSupply, room.curfew].some(hasValue)
    ) || rooms[0];

  const capacityColumns = [
    {
      key: 'area',
      label: 'Fläche',
      getValue: (room) => room.area,
      format: (value) => `${value} m²`,
    },
    {
      key: 'standing',
      label: 'Stehempfang',
      getValue: (room) => room.standing,
      format: (value) => `${value} Personen`,
    },
    {
      key: 'theater',
      label: 'Theater',
      getValue: (room) => room.theater,
      format: (value) => `${value} Personen`,
    },
    {
      key: 'uShape',
      label: 'U-Form',
      getValue: (room) => room.uShape,
      format: (value) => `${value} Personen`,
    },
    {
      key: 'banquet',
      label: 'Bankett / Gala',
      getValue: (room) => room.banquet,
      format: (value) => `${value} Personen`,
    },
  ].filter((column) =>
    rooms.some((room) => hasValue(column.getValue(room)))
  );
  const showRoomName = rooms.some((room) => hasValue(room.name));

  const keyStats = [
    {
      label: 'Gesamtfläche',
      value: hasValue(firstRoom?.area)
        ? `${firstRoom.area} m²`
        : null,
    },
    {
      label: 'Max. Kapazität',
      value: hasValue(firstRoom?.standing)
        ? `${firstRoom.standing} Pax`
        : null,
    },
    {
      label: 'Bühnenstrom',
      value: hasValue(firstRoom?.powerSupply)
        ? getPowerSupplyLabel(firstRoom.powerSupply)
        : null,
    },
    {
      label: 'Sperrstunde',
      value: hasValue(firstRoom?.curfew)
        ? `${firstRoom.curfew} Uhr`
        : null,
    },
  ].filter((stat) => hasValue(stat.value));

  const contactName = [
    canShow('vorname') && profile.vorname,
    canShow('nachname') && profile.nachname,
  ].filter(hasValue).join(' ');
  const email = canShow('email') ? profile.email : '';
  const phone = canShow('phone') ? profile.phone : '';
  const website = canShow('website') ? profile.website : '';
  const description =
    canShow('description') ? profile.description : '';

  const hasRoomDetails = rooms.some((room) =>
    [
      room.equipment,
      room.transport,
      room.conditions,
      room.image,
      room.techPlan,
    ].some(hasValue)
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
        <header className="bg-gradient-to-r from-orange-950 via-slate-800 to-slate-900 p-6 border-b border-orange-500/30">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <span className="text-xs font-semibold tracking-widest text-orange-400 uppercase bg-orange-950/60 px-3 py-1 rounded-full border border-orange-800">
              Location Standard Sheet
            </span>
            {hasValue(profile.id) && (
              <span className="text-xs text-slate-400 font-mono">
                GIGSDA ID: {profile.id}
              </span>
            )}
          </div>

          {hasValue(title) && (
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
              {title}
            </h1>
          )}
          {(hasValue(visibleCategory) || hasValue(visibleGenre)) && (
            <p className="text-lg text-orange-300 font-medium">
              {[visibleCategory, visibleGenre].filter(hasValue).join(' | ')}
            </p>
          )}
        </header>

        {keyStats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-800/80 border-b border-slate-700 text-center">
            {keyStats.map((stat) => (
              <div
                key={stat.label}
                className="p-3 bg-slate-900/60 rounded-lg border border-slate-700/50"
              >
                <div className="text-xl md:text-2xl font-bold text-orange-400">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400 uppercase font-medium mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        <main className="p-6 space-y-8">
          {hasValue(description) && (
            <section>
              <h2 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-2">
                // Location Portrait &amp; Atmosphäre
              </h2>
              <p className="text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-lg border border-slate-700/40 whitespace-pre-line">
                {description}
              </p>
            </section>
          )}

          {(title || contactName || email || phone || website || addressVisible) && (
            <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40 space-y-3">
              <h2 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-3">
                // Rahmendaten &amp; Kontakt
              </h2>
              <div className="text-sm space-y-2">
                <ProfileValue label="Location" value={title} />
                <ProfileValue label="Ansprechperson" value={contactName} />
                {hasValue(email) && (
                  <ProfileValue label="E-Mail" value={email}>
                    <a
                      href={`mailto:${email}`}
                      className="text-[#464feb] no-underline hover:underline"
                    >
                      {email}
                    </a>
                  </ProfileValue>
                )}
                {hasValue(phone) && (
                  <ProfileValue label="Telefon" value={phone}>
                    <a
                      href={`tel:${phone}`}
                      className="text-[#464feb] no-underline hover:underline"
                    >
                      {phone}
                    </a>
                  </ProfileValue>
                )}
                {hasValue(website) && (
                  <ProfileValue label="Webseite" value={website}>
                    <a
                      href={getExternalUrl(website)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#464feb] no-underline hover:underline"
                    >
                      {website}
                    </a>
                  </ProfileValue>
                )}
                {addressVisible && (
                  <ProfileValue
                    label="Adresse"
                    value={visibleAddress.join(', ')}
                  />
                )}
              </div>
            </section>
          )}

          {capacityColumns.length > 0 && (
            <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40">
              <h2 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-3">
                // Kapazitäten nach Bestuhlung
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300 border-collapse">
                  <thead className="text-slate-900 uppercase text-xs">
                    <tr>
                      {showRoomName && (
                        <th className="p-3 border border-[#e6e6e6] bg-[#f5f5f5]">Raum</th>
                      )}
                      {capacityColumns.map((column) => (
                        <th
                          key={column.key}
                          className="p-3 border border-[#e6e6e6] bg-[#f5f5f5]"
                        >
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room) => {
                      if (!capacityColumns.some((column) =>
                        hasValue(column.getValue(room))
                      )) return null;

                      return (
                        <tr key={room.index}>
                          {showRoomName && (
                            <td className="p-3 border border-[#e6e6e6] font-medium text-white">
                              {room.name}
                            </td>
                          )}
                          {capacityColumns.map((column) => {
                            const value = column.getValue(room);
                            return (
                              <td
                                key={column.key}
                                className="p-3 border border-[#e6e6e6]"
                              >
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

          {rooms.some((room) => hasValue(room.powerSupply) || hasValue(room.curfew) || hasValue(room.openingHours)) && (
            <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40">
              <h2 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-3">
                // Inhouse-Technik &amp; Infrastruktur
              </h2>
              <div className="space-y-4 text-sm text-slate-300">
                {rooms.map((room) => {
                  const details = [
                    hasValue(room.powerSupply) && {
                      label: 'Strom',
                      value: getPowerSupplyLabel(room.powerSupply),
                    },
                    hasValue(room.curfew) && {
                      label: 'Sperrstunde',
                      value: `${room.curfew} Uhr`,
                    },
                    hasValue(room.openingHours) && {
                      label: 'Öffnungszeiten',
                      value: room.openingHours,
                    },
                  ].filter(Boolean);

                  if (details.length === 0) return null;

                  return (
                    <div key={room.index}>
                      {rooms.length > 1 && (
                        <h3 className="font-semibold text-white mb-2">{room.name}</h3>
                      )}
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {details.map((detail) => (
                          <div key={detail.label}>
                            <dt className="text-slate-400">{detail.label}:</dt>
                            <dd>{detail.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {hasRoomDetails && (
            <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40 space-y-5">
              <h2 className="text-sm font-bold text-orange-400 uppercase tracking-wider">
                // Technik, Logistik &amp; Mietbedingungen
              </h2>
              {rooms.map((room) => {
                const details = [
                  ['Inhouse-Technik & Equipment', room.equipment],
                  ['Parken & ÖPNV-Anbindung', room.transport],
                  ['Preise, Konditionen & Mietbedingungen', room.conditions],
                ].filter(([, value]) => hasValue(value));

                if (details.length === 0 && !room.image && !room.techPlan) {
                  return null;
                }

                return (
                  <div key={room.index} className="space-y-3">
                    {rooms.length > 1 && (
                      <h3 className="font-semibold text-white">{room.name}</h3>
                    )}
                    {details.map(([label, value]) => (
                      <p key={label} className="text-sm text-slate-300 whitespace-pre-line">
                        <strong className="text-white">{label}:</strong> {value}
                      </p>
                    ))}
                    {hasValue(room.image) && (
                      <img
                        src={room.image}
                        alt={`Veranstaltungsraum ${room.name}`}
                        className="w-full h-auto rounded-lg border border-slate-700"
                      />
                    )}
                    {hasValue(room.techPlan) && (
                      room.techPlan.includes('/api/media.php?preview=') ? (
                        <img
                          src={room.techPlan}
                          alt={`Bühnenplan und Technik ${room.name}`}
                          className="w-full h-auto rounded-lg border border-slate-700"
                        />
                      ) : (
                        <a
                          href={room.techPlan}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#464feb] no-underline hover:underline"
                        >
                          Technikplan / Dokument öffnen
                        </a>
                      )
                    )}
                  </div>
                );
              })}
            </section>
          )}

          {hasValue(email) && (
            <section className="bg-orange-950/40 p-5 rounded-lg border border-orange-900/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-sm font-bold text-orange-300 uppercase tracking-wider">
                  // Kontakt &amp; Buchungsanfrage
                </h3>
                {hasValue(contactName) && (
                  <p className="text-xs text-slate-300 mt-1">{contactName}</p>
                )}
              </div>
              <a
                href={`mailto:${email}`}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-medium text-sm rounded-lg transition-colors shadow-md text-center no-underline"
              >
                Buchungsanfrage senden
              </a>
            </section>
          )}
        </main>

        <footer className="p-4 bg-slate-900 text-center text-xs text-slate-500 border-t border-slate-700 flex justify-between items-center">
          {hasValue(title) && <span>Location Standard Sheet: {title}</span>}
          {hasValue(profile.id) && <span>GIGSDA ID: {profile.id}</span>}
        </footer>
      </div>
    </div>
  );
}

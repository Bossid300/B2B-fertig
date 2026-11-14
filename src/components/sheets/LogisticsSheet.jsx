const hasValue = (value) =>
  value !== false &&
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

function SheetSection({ title, children }) {
  if (!children) return null;

  return (
    <section className="break-inside-avoid rounded-lg border border-slate-700/40 bg-slate-900/40 p-5 print:border print:p-4">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-blue-400">
        {title}
      </h2>
      {children}
    </section>
  );
}

function DetailList({ entries }) {
  const visibleEntries = entries.filter(([, value]) => hasValue(value));
  if (visibleEntries.length === 0) return null;

  return (
    <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
      {visibleEntries.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <dt className="mb-1 text-xs font-medium uppercase text-slate-400">
            {label}
          </dt>
          <dd className="whitespace-pre-line break-words text-slate-200">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function LogisticsSheet({ profile }) {
  if (!profile || profile.show_stamm === false) return null;

  const canShow = (field) => profile[`show_${field}`] !== false;
  const companyName =
    (canShow('Klarname') && profile.Klarname) ||
    (canShow('name') && profile.name) ||
    (canShow('category') && profile.category) ||
    (canShow('project_name') && profile.project_name) ||
    '';
  const contactName = [
    canShow('vorname') && profile.vorname,
    canShow('nachname') && profile.nachname,
  ].filter(hasValue).join(' ');
  const address = [
    canShow('street') && profile.street,
    canShow('plz') && profile.plz,
    canShow('city') && profile.city,
  ].filter(hasValue).join(', ');

  const companyDetails = [
    ['Unternehmen & Dispo', profile.logistics_company_dispatch],
    ['Standort & Einsatzradius', profile.logistics_location_radius],
    ['Fuhrpark & Ladevolumen', profile.logistics_fleet_capacity],
    ['Personalpool (Hands/Fahrer)', profile.logistics_personnel_pool],
    ['Transport- & Frachtversicherung', profile.logistics_transport_insurance],
    ['Kontakt & Erreichbarkeit', profile.logistics_contact_availability],
    ['Ansprechpartner', contactName],
    ['Standort', canShow('city') && profile.city],
    ['Adresse', profile.show_address !== false && address],
    ['Telefon', canShow('phone') && profile.phone],
    ['E-Mail', canShow('email') && profile.email],
    ['Webseite', canShow('website') && profile.website],
    ['Leistungsprofil', canShow('description') && profile.description],
  ];

  const capacityDetails = [];
  const logisticsDetails = [];
  if (profile.show_logistik !== false) {
    if (canShow('travel_radius') && hasValue(profile.travel_radius)) {
      const radiusLabels = {
        '50': 'Lokalbetrieb (bis 50 km)',
        '100': 'Standard-Aktionsradius (bis 100 km)',
        '200': 'Regionaler Radius (bis 200 km)',
        europe: 'Zentral-Europa (D / A / CH / International)',
        worldwide: 'Weltweit / Touring',
      };
      logisticsDetails.push([
        'Aktionsradius',
        radiusLabels[profile.travel_radius] || `${profile.travel_radius} km`,
      ]);
    }
    if (canShow('mobility_status')) {
      logisticsDetails.push(['Fuhrpark & Mobilität', profile.mobility_status]);
    }
  }

  if (
    profile.show_avail !== false &&
    canShow('general_status') &&
    hasValue(profile.general_status)
  ) {
    const statusLabels = {
      available: 'Einsatzbereit',
      booked: 'Ausgebucht',
    };
    capacityDetails.push([
      'Dispositionsstatus',
      statusLabels[profile.general_status] || profile.general_status,
    ]);
  }

  const supportDetails = [
    ['Equipment- & Backline-Transporte', profile.logistics_equipment_backline_transport],
    ['Stagehands & Auf-/Abbauhilfe', profile.logistics_stagehands_setup],
    ['Stapler- & Flurförderzeug-Logistik', profile.logistics_forklift_handling],
    ['Artist-, VIP- & Crew-Shuttle', profile.logistics_artist_vip_shuttle],
    ['Leergut- & Lager-Management', profile.logistics_returnables_storage],
  ];
  const helpCategories = profile.hilfe_categories;
  if (
    profile.show_hilfe !== false &&
    helpCategories &&
    typeof helpCategories === 'object'
  ) {
    const categoryLabels = {
      aufbau: 'Aufbau-Unterstützung',
      logistik: 'Logistik-Unterstützung',
      abbau: 'Abbau-Unterstützung',
      flyer: 'Flyer-Unterstützung',
    };
    Object.entries(categoryLabels).forEach(([key, label]) => {
      if (
        typeof helpCategories[key] === 'boolean' &&
        profile[`show_hilfe_${key}`] !== false
      ) {
        supportDetails.push([label, helpCategories[key] ? 'Ja' : 'Nein']);
      }
    });
  }
  if (
    profile.show_hilfe !== false &&
    canShow('hilfe_status') &&
    hasValue(profile.hilfe_status)
  ) {
    const statusLabels = {
      ready: 'Für Unterstützung verfügbar',
      none: 'Keine zusätzliche Unterstützung',
    };
    supportDetails.unshift([
      'Support-Status',
      statusLabels[profile.hilfe_status] || profile.hilfe_status,
    ]);
  }

  if (
    profile.show_avail !== false &&
    canShow('avail_days') &&
    profile.avail_days &&
    typeof profile.avail_days === 'object'
  ) {
    const dayLabels = {
      MO: 'Mo',
      DI: 'Di',
      MI: 'Mi',
      DO: 'Do',
      FR: 'Fr',
      SA: 'Sa',
      SO: 'So',
    };
    const days = Object.entries(profile.avail_days)
      .filter(([, available]) => typeof available === 'boolean')
      .map(([day, available]) => ({
        label: dayLabels[day] || day,
        available,
      }));
    if (days.length > 0) {
      capacityDetails.push([
        'Reguläre Einsatztage',
        <span className="flex flex-wrap gap-1" key="days">
          {days.map(({ label, available }) => (
            <span
              key={label}
              className={`rounded border px-2 py-1 text-xs ${
                available
                  ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-300'
                  : 'border-slate-700 bg-slate-900 text-slate-500'
              }`}
            >
              {label}
            </span>
          ))}
        </span>,
      ]);
    }
  }

  const visibleSupportDetails = supportDetails.filter(([, value]) =>
    hasValue(value)
  );

  const equipment = profile.show_equipment !== false &&
    Array.isArray(profile.equipment)
    ? profile.equipment.filter((item) => item && item.visible !== false)
    : [];
  const skills = profile.show_skills !== false && Array.isArray(profile.skills)
    ? profile.skills.filter(
      (skill, index) =>
        hasValue(skill) && profile.skills_visibility?.[index] !== false
    )
    : [];
  const certificates =
    profile.show_certificates !== false && Array.isArray(profile.certificates)
      ? profile.certificates.filter(
        (certificate, index) =>
          hasValue(certificate) &&
          profile.certificate_visibility?.[index] !== false
      )
      : [];
  const compliance =
    profile.show_compliance === true && Array.isArray(profile.compliance)
      ? profile.compliance.filter((item) => item && item.visible !== false)
      : [];
  const qualificationDetails = [
    ['Fahrer- & Bedienerscheine', profile.logistics_licenses_certificates],
    ['Sicherheit & Arbeitsschutz', profile.logistics_safety_occupational],
    ['Verlade- & Transportmittel', profile.logistics_loading_transport_equipment],
    ['Kommunikation vor Ort', profile.logistics_on_site_communication],
  ];
  const documents =
    profile.show_docs !== false && Array.isArray(profile.documents)
      ? profile.documents.filter(
        (document) =>
          document &&
          document.security === 'public' &&
          hasValue(document.name) &&
          hasValue(document.url)
      )
      : [];

  const qualificationContent =
    qualificationDetails.some(([, value]) => hasValue(value)) ||
    skills.length > 0 ||
    certificates.length > 0 ||
    equipment.length > 0 ||
    compliance.length > 0 ||
    documents.length > 0;

  const businessDetails = [
    ['Stagehand / Logistikhelfer', profile.logistics_rate_stagehand],
    ['Crew-Chief / Staplerfahrer', profile.logistics_rate_crew_chief],
    ['3,5t Sprinter inkl. Fahrer', profile.logistics_rate_sprinter],
    ['7,5t / 12t LKW inkl. Fahrer', profile.logistics_rate_truck],
    ['Transport- & Crew-Anfragen', profile.logistics_transport_crew_inquiries],
  ];
  if (profile.show_finance === true) {
    const financeFields = [
/* 
      ['rate_hour', 'Stundensatz', (value) => `€ ${value} / Stunde`],
      ['rate_day', 'Tagessatz', (value) => `€ ${value} / Tag`],
      ['gage_min', 'Mindestgage', (value) => `€ ${value}`],
      ['gage_max', 'Maximalgage', (value) => `€ ${value}`],

 */      
      [
        'payment_terms',
        'Zahlungsziel',
        (value) => PAYMENT_TERMS_LABELS[value] || value,
      ],
      [
        'tax_type',
        'Steuerliche Einstufung',
        (value) => TAX_TYPE_LABELS[value] || value,
      ],
    ];
    financeFields.forEach(([field, label, format]) => {
      if (canShow(field) && hasValue(profile[field])) {
        businessDetails.push([label, format(profile[field])]);
      }
    });
    if (profile.show_company_uid === true) {
      const uid = profile.company_uid || profile.uid;
      if (hasValue(uid)) businessDetails.push(['UID', uid]);
    }
    if (profile.show_steuernummer === true && hasValue(profile.steuernummer)) {
      businessDetails.push(['Steuernummer', profile.steuernummer]);
    }
  }
/* 
  if (
    profile.show_logistik !== false &&
    canShow('travel_expenses') &&
    hasValue(profile.travel_expenses)
  ) {
    businessDetails.push(['Reisespesen / Transportkosten', profile.travel_expenses]);
  }

 */  const visibleBusinessDetails = businessDetails.filter(([, value]) =>
    hasValue(value)
  );

  const keyStats = [
    ['FUHRPARK', profile.logistics_fleet_kpi],
    ['PERSONALPOOL', profile.logistics_personnel_pool_kpi],
    ['EINSATZRADIUS', profile.logistics_operating_radius_kpi],
    ['24/7 HOTLINE', profile.logistics_hotline_kpi],
  ].filter(([, value]) => hasValue(value));

  const visibleName = canShow('Klarname') ? profile.Klarname || profile.name : '';
  const visibleCategory = (canShow('category') && profile.category) || '';
  const visibleGenre = (canShow('genre') && profile.genre) || '';
  const title = visibleName || visibleCategory;


  const email = canShow('email') ? profile.email : '';
  const phone = canShow('phone') ? profile.phone : '';
  const website = canShow('website') ? profile.website : '';
  const description = canShow('description') ? profile.description : '';

   console.log(profile); 

  return (
    <div className="min-h-screen bg-slate-900 p-4 font-sans text-slate-100 print:min-h-0 print:p-0">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-2xl print:max-w-none print:overflow-visible print:shadow-none">
        <header className="border-b border-blue-500/30 bg-gradient-to-r from-blue-950 via-slate-800 to-slate-900 p-6 print:px-10 print:py-8">
          <p className="mb-3 inline-flex rounded-full border border-blue-800 bg-blue-950/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-300">
            Logistikprofil
          </p>
          {hasValue(companyName) && (
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl print:text-3xl">
              {companyName}
            </h1>
          )}
          {canShow('category') && hasValue(profile.category) && (
            <p className="mt-2 text-lg font-medium text-blue-300">
              {profile.category}
            </p>
          )}
          {hasValue(profile.id) && (
            <p className="mt-3 text-xs font-mono text-slate-400">
              GIGSDA ID: {profile.id}
            </p>
          )}
        </header>

        {/* KEY STATS BAR */}
        {keyStats.length > 0 && (
          <div className="grid grid-cols-2 gap-3 border-b border-slate-700 bg-slate-800/80 p-5 text-center sm:grid-cols-4 print:grid-cols-4 print:break-inside-avoid">
            {keyStats.map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg border border-slate-700/50 bg-slate-900/60 p-3 print:p-2"
              >
                <p className="text-3xl font-bold text-blue-400">{value}</p>
                <p className="mt-1 text-xs font-medium uppercase text-slate-400">
                  {label}
                </p>
              </div>
            ))}
          </div>
        )}

        <main className="space-y-6 p-6 print:space-y-4 print:p-4">

          {/* Logistikprofil & Performance */}
          {hasValue(description) && (
            <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40  print:border  print:p-4 print:mt-6 print:break-inside-avoid">
              <h2 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2 ">
                // Logistikprofil &amp; Performance
              </h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line  print:p-0">
                {description}
              </p>
            </section>
          )}

          {/* KÜNSTLERDATEN & PERFORMANCE */}
          {(title || contactName || email || phone || website || addressVisible) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 print:break-inside-avoid">

              {/* Logistikdaten */}
              <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40 space-y-3 print:p-3">
                <h2 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-3">
                  // Logistikdaten
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

              {/* Kontakt */}
              <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40 space-y-3 print:p-3">
                <h2 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-3">
                  // Kontakt
                </h2>
                <dl className="grid grid-cols-2 gap-y-2 text-sm">
                  <dt className="text-slate-400">Telefon:</dt>
                  <dd className="text-slate-200">{phone || "-"}</dd>

                  <dt className="text-slate-400">E-Mail:</dt>
                  <dd className="text-slate-200">{email || "-"}</dd>

                  <dt className="text-slate-400">Webseite:</dt>
                  <dd className="text-slate-200">{website || "-"}</dd>
                </dl>
              </section>

            </div>
          )}

          {/* Unternehmensprofil & Kapazitäten */}
          <section className="bg-slate-900/40 p-5 rounded-lg border border-slate-700/40 space-y-4 print:p-3">
            <h2 className="text-sm font-bold text-blue-400 uppercase tracking-wider">
              // Unternehmensprofil & Kapazitäten
            </h2>

            <div className="grid grid-cols-3 gap-4 print:grid-cols-3">

              <div className="rounded-lg border border-slate-700 bg-slate-950 p-4">
                <h3 className="text-white font-bold mb-2">
                  Unternehmen & Dispo
                </h3>

                <p className="text-sm text-slate-300 whitespace-pre-line">
                  {profile.logistics_company_dispatch}
                </p>
              </div>

              <div className="rounded-lg border border-slate-700 bg-slate-950 p-4">
                <h3 className="text-white font-bold mb-2">
                  Standort & Einsatzradius
                </h3>

                <p className="text-sm text-slate-300 whitespace-pre-line">
                  {profile.logistics_location_radius}
                </p>
              </div>

              <div className="rounded-lg border border-slate-700 bg-slate-950 p-4">
                <h3 className="text-white font-bold mb-2">
                  Fuhrpark & Ladevolumen
                </h3>

                <p className="text-sm text-slate-300 whitespace-pre-line">
                  {profile.logistics_fleet_capacity}
                </p>
              </div>

              <div className="rounded-lg border border-slate-700 bg-slate-950 p-4">
                <h3 className="text-white font-bold mb-2">
                  Personalpool (Hands/Fahrer)
                </h3>

                <p className="text-sm text-slate-300 whitespace-pre-line">
                  {profile.logistics_personnel_pool}
                </p>
              </div>

              <div className="rounded-lg border border-slate-700 bg-slate-950 p-4">
                <h3 className="text-white font-bold mb-2">
                  Transport- & Frachtversicherung
                </h3>

                <p className="text-sm text-slate-300 whitespace-pre-line">
                  {profile.logistics_transport_insurance}
                </p>
              </div>

              <div className="rounded-lg border border-slate-700 bg-slate-950 p-4">
                <h3 className="text-white font-bold mb-2">
                  Kontakt & Erreichbarkeit
                </h3>

                <p className="text-sm text-slate-300 whitespace-pre-line">
                  {profile.logistics_contact_availability}
                </p>
              </div>

            </div>
          </section>

{/* 
          {(companyDetails.some(([, value]) => hasValue(value)) ||
            capacityDetails.length > 0 ||
            (canShow('avatarUrl') && hasValue(profile.avatarUrl))) && (
            <SheetSection title="Unternehmensprofil & Kapazitäten">
              {canShow('avatarUrl') && hasValue(profile.avatarUrl) && (
                <img
                  src={profile.avatarUrl}
                  alt={companyName || 'Profilbild'}
                  className="mb-5 max-h-72 w-full rounded-lg border border-slate-700 object-cover sm:max-w-md"
                />
              )}
              <DetailList entries={companyDetails} />
              {capacityDetails.length > 0 && (
                <div className="mt-5">
                  <DetailList entries={capacityDetails} />
                </div>
              )}
            </SheetSection>
          )}
 */}
          {(logisticsDetails.some(([, value]) => hasValue(value)) ||
            visibleSupportDetails.length > 0) && (
            <SheetSection title="Logistik- & Supportleistungen">
              <div className="space-y-6">
                <DetailList entries={logisticsDetails} />
                <DetailList entries={visibleSupportDetails} />
              </div>
            </SheetSection>
          )}

          {qualificationContent && (
            <SheetSection title="Qualifikationen & eigenes Logistik-Equipment">
              <div className="space-y-6">
                <DetailList entries={qualificationDetails} />

{/* 
                {skills.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase text-slate-400">
                      Kompetenzen
                    </h3>
                    <ul className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <li
                          key={`${skill}-${index}`}
                          className="rounded border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-200"
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}


                {certificates.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase text-slate-400">
                      Qualifikationen & Zertifikate
                    </h3>
                    <ul className="flex flex-wrap gap-2">
                      {certificates.map((certificate, index) => (
                        <li
                          key={`${certificate}-${index}`}
                          className="rounded border border-blue-900/50 bg-blue-950/20 px-3 py-1.5 text-sm text-blue-200"
                        >
                          {certificate}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}


                {equipment.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase text-slate-400">
                      Equipment & Inventar
                    </h3>
                    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {equipment.map((item, index) => (
                        <li
                          key={`${item.item || 'equipment'}-${index}`}
                          className="rounded border border-slate-700 bg-slate-900/60 p-3"
                        >
                          {hasValue(item.item) && (
                            <p className="font-semibold text-white">{item.item}</p>
                          )}
                          {hasValue(item.detail) && (
                            <p className="mt-1 whitespace-pre-line text-sm text-slate-400">
                              {item.detail}
                            </p>
                          )}
                          {item.rental && (
                            <span className="mt-2 inline-block rounded border border-blue-500/30 bg-blue-950/30 px-2 py-1 text-xs text-blue-300">
                              Dry-Hire verfügbar
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
 */}


                {compliance.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase text-slate-400">
                      Versicherungen & Nachweise
                    </h3>
                    <DetailList
                      entries={compliance.flatMap((item, index) => {
                        if (!hasValue(item.detail)) return [];
                        const validity = hasValue(item.valid_until)
                          ? ` · gültig bis ${item.valid_until}`
                          : '';
                        return [[
                          item.type || `Nachweis ${index + 1}`,
                          `${item.detail}${validity}`,
                        ]];
                      })}
                    />
                  </div>
                )}
                {documents.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase text-slate-400">
                      Öffentliche Dokumente
                    </h3>
                    <ul className="flex flex-wrap gap-3">
                      {documents.map((document, index) => (
                        <li key={`${document.name}-${index}`}>
                          <a
                            href={document.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-medium text-blue-300 underline decoration-blue-500/50 underline-offset-4 hover:text-blue-200"
                          >
                            {document.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </SheetSection>
          )}

          {visibleBusinessDetails.length > 0 && (
            <SheetSection title="B2B-Konditionen & Kalkulationsbasis">
              <DetailList entries={visibleBusinessDetails} />
            </SheetSection>
          )}





          {/* STATUS & BUCHUNG FOOTER */}
          {hasValue(email) && (
            <section className="bg-blue-950/40 p-5 rounded-lg border border-blue-900/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
              <div>
                <h3 className="text-sm font-bold text-blue-300 uppercase tracking-wider ">
                  // Kontakt &amp; Buchungsanfrage
                </h3>
                {hasValue(contactName) && (
                  <p className="text-xs text-slate-300 mt-1 ">{contactName}</p>
                )}
              </div>
              <a
                href={`mailto:${email}`}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg transition-colors shadow-md text-center no-underline  print:border "
              >
                Buchungsanfrage senden
              </a>
            </section>
          )}
          
        </main>

        {/* FOOTER */}
        <footer className="p-4 bg-slate-900 text-center text-xs text-slate-500 border-t border-slate-700 flex justify-between items-center   ">
          {hasValue(title) && <span>Veranstalter Standard Sheet: {title}</span>}
          {hasValue(profile.id) && <span>GIGSDA ID: {profile.id}</span>}
        </footer>


      </div>
    </div>
  );
}

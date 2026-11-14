const KPI_FIELDS = [
  { key: 'fan_events_attended_kpi', label: 'Besuchte Events' },
  { key: 'fan_referred_members_kpi', label: 'Geworbene Mitglieder' },
  { key: 'fan_street_team_kpi', label: 'Street-Team' },
  { key: 'fan_supporter_level_kpi', label: 'Supporter-Level' },
];

const SECTIONS = [
  {
    title: 'FAN-STAMMDATEN & COMMUNITY-KENNZAHLEN',
    fields: [
      { key: 'fan_supporter_level_badges', label: 'Supporter-Level & Badges' },
      { key: 'fan_home_region_radius', label: 'Heimatregion & Radius' },
      { key: 'fan_mobility_carpooling', label: 'Mobilität & Carpooling' },
      { key: 'fan_community_network', label: 'Community-Netzwerk' },
      { key: 'fan_social_channels', label: 'Social-Kanäle' },
    ],
  },
  {
    title: 'MUSIK-DNA & EVENT-PRÄFERENZEN',
    fields: [
      { key: 'fan_main_genres', label: 'Haupt-Genres' },
      { key: 'fan_preferred_event_formats', label: 'Bevorzugte Event-Formate' },
      { key: 'fan_favorite_network_acts', label: 'Favorisierte Acts im Netzwerk' },
      { key: 'fan_regular_venues', label: 'Stamm-Locations' },
    ],
  },
  {
    title: 'STREET-TEAM & SUPPORTER-ANGEBOT',
    fields: [
      { key: 'fan_local_promotion_word_of_mouth', label: 'Lokale Promotion & Mundpropaganda' },
      { key: 'fan_pre_release_demo_feedback', label: 'Pre-Release & Demo-Feedback' },
      { key: 'fan_crowdfunding_early_bird_support', label: 'Crowdfunding & Early-Bird-Support' },
      { key: 'fan_volunteer_event_crew_support', label: 'Freiwillige Event-Hilfe (Crew-Support)' },
    ],
  },
  {
    title: 'COMMUNITY & EINLADUNGEN',
    fields: [
      { key: 'fan_networking_guest_list_invitations', label: 'Vernetzung & Gästelisten-Einladungen' },
      { key: 'fan_vip_passes_support_programs', label: 'VIP-Pässe & Supportprogramme' },
      { key: 'fan_community_activities', label: 'Community-Aktivitäten' },
    ],
  },
];

const hasValue = (value) =>
  value !== undefined &&
  value !== null &&
  String(value).trim() !== '';

export default function FanSheet({ profile }) {
  if (!profile || profile.show_stamm === false) return null;

  const displayName =
    profile.display_name ||
    (profile.show_Klarname === false ? '' : profile.Klarname) ||
    profile.name ||
    'Fan Community';
  const avatar =
    profile.show_avatarUrl === false
      ? ''
      : profile.avatarMediaUrl || profile.avatarUrl;
  const slides = [1, 2, 3, 4]
    .map((number) => ({
      number,
      image: profile[`show_slide${number}_image`] === false
        ? ''
        : profile[`slide${number}_media_url`] || profile[`slide${number}_url`],
      line1: profile[`slide${number}_line1`],
      line2: profile[`slide${number}_line2`],
    }))
    .filter((slide) => hasValue(slide.image));

     console.log(profile); 
     
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 font-sans text-slate-100 print:min-h-0 print:bg-slate-950 print:p-0">
      <article className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-900 shadow-2xl print:max-w-none print:rounded-none print:shadow-none">
        <header className="relative overflow-hidden border-b border-cyan-400/15 bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-950 p-6 md:p-10 print:p-6">
          <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            {hasValue(avatar) && (
              <img
                src={avatar}
                alt={`${displayName} – Avatar`}
                className="h-28 w-28 shrink-0 rounded-3xl border border-cyan-300/30 object-cover shadow-xl shadow-cyan-950/40"
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-cyan-300/20 bg-cyan-950/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                  Fan Community
                </span>
                {hasValue(profile.id) && (
                  <span className="font-mono text-xs text-slate-500">
                    GIGSDA ID: {profile.id}
                  </span>
                )}
              </div>
              <h1 className="break-words text-3xl font-black tracking-tight text-white md:text-5xl">
                {displayName}
              </h1>
              {hasValue(profile.description) && (
                <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-6 text-slate-300">
                  {profile.description}
                </p>
              )}
            </div>
          </div>

          {slides.length > 0 && (
            <div className="relative mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 print:grid-cols-4">
              {slides.map((slide) => (
                <figure
                  key={slide.number}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-slate-950"
                >
                  <img
                    src={slide.image}
                    alt={hasValue(slide.line1) ? slide.line1 : `Fan-Sliderbild ${slide.number}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  {(hasValue(slide.line1) || hasValue(slide.line2)) && (
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 to-transparent px-3 pb-3 pt-8">
                      {hasValue(slide.line1) && (
                        <span className="block text-xs font-black uppercase tracking-wide text-white">
                          {slide.line1}
                        </span>
                      )}
                      {hasValue(slide.line2) && (
                        <span className="mt-1 block text-[10px] text-slate-300">
                          {slide.line2}
                        </span>
                      )}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </header>

        <div className="grid grid-cols-2 gap-px border-b border-slate-800 bg-slate-800 md:grid-cols-4 print:grid-cols-4">
          {KPI_FIELDS.map((field) => (
            <div key={field.key} className="bg-slate-900/90 px-4 py-5 text-center">
              <div className="break-words text-xl font-black text-cyan-300 md:text-2xl">
                {hasValue(profile[field.key]) ? profile[field.key] : '–'}
              </div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {field.label}
              </div>
            </div>
          ))}
        </div>

        <main className="space-y-5 p-4 md:p-8 print:space-y-4 print:p-5">
          {SECTIONS.map((section, index) => {
            const values = section.fields.filter((field) =>
              hasValue(profile[field.key])
            );

            return (
              <section
                key={section.title}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70 print:break-inside-avoid"
              >
                <h2 className="flex items-center gap-3 border-b border-slate-800 px-5 py-4 text-xs font-black tracking-[0.12em] text-cyan-300 md:text-sm">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 font-mono text-cyan-300">
                    0{index + 1}
                  </span>
                  {section.title}
                </h2>
                {values.length > 0 ? (
                  <dl className="grid grid-cols-1 gap-px bg-slate-800 sm:grid-cols-2">
                    {values.map((field) => (
                      <div key={field.key} className="min-w-0 bg-slate-900/80 p-4">
                        <dt className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {field.label}
                        </dt>
                        <dd className="whitespace-pre-line break-words text-sm leading-6 text-slate-200">
                          {profile[field.key]}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="px-5 py-4 text-sm text-slate-500">
                    Noch keine Angaben hinterlegt.
                  </p>
                )}
              </section>
            );
          })}
        </main>
      </article>
    </div>
  );
}

import React, { useState } from 'react';
import GigsdaPass from "../GigsdaPass";
import { eventService } from '../../services/eventService';
import PortfolioActionBar from './shared/PortfolioActionBar';
import SecuritySheet from '../sheets/SecuritySheet';
import SheetRouter from '../sheets/SheetRouter';
import { DownloadSecurityPdfButton } from './SecurityPortfolioPdf';

export default function SecurityPortfolio({
  profile,
  onBack = null,
  setView
}) {
  const [showStandardSheet, setShowStandardSheet] = useState(false);

  const loggedInProfileId = localStorage.getItem('gigsda_profile_id');
  const isOwner = String(loggedInProfileId) === String(profile?.id);

  const events = eventService.getEvents();
  const references = events.filter(evt => {
    const hasJoined =
      Array.isArray(evt.crew) &&
      evt.crew.some(member =>
        member &&
        member.name === profile?.name &&
        (member.status === "accepted" || member.status === "confirmed")
      );
    const evtOwner = evt.ownerId === profile?.id;
    return hasJoined || evtOwner;
  });

  if (!profile) return null;

  if (showStandardSheet) {
    return (
      <SheetRouter
        profile={profile}
        SheetComponent={SecuritySheet}
        roleLabel="Security"
        backLabel="Zurück zum Security-Portfolio"
        onBack={() => setShowStandardSheet(false)}
        setView={setView}
      />
    );
  }

  const companyName = profile?.Klarname || profile?.name || 'SHIELDGUARD EVENT SECURITY';
  const heroImage = profile?.slide1_url || profile?.gallery_slot1_url || profile?.avatarUrl;
  
  const galleryImages = [1, 2, 3, 4]
    .map(num => ({
      url: profile?.[`slide${num}_url`] || profile?.[`gallery_slot${num}_url`],
      title: profile?.[`slide${num}_line1`] || `Security 0${num}`
    }))
    .filter(item => Boolean(item.url));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-900 font-sans selection:bg-amber-500 selection:text-black">
      
      {/* FLOATING ACTION BAR */}
      <div className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 px-6 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition"
              >
                ← Zurück
              </button>
            )}
            <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
              GIGSDA // Security EPK
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <DownloadSecurityPdfButton profile={profile} references={references} />
            <button
              type="button"
              onClick={() => setShowStandardSheet(true)}
              className="px-4 py-1.5 border border-zinc-700 text-zinc-300 text-xs font-semibold uppercase tracking-wider hover:border-white hover:text-white transition"
            >
              Security Standard Sheet
            </button>
          </div>
        </div>
      </div>

      {/* MAIN MAGAZINE CONTAINER */}
      <main className="max-w-6xl mx-auto py-10 px-4 sm:px-6 space-y-12">

        {/* =========================================================
            SPREAD 01: COVER
           ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 min-h-[680px] bg-black text-white shadow-2xl overflow-hidden border border-zinc-800">
          
          {/* Linker Magazin-Rücken */}
          <div className="lg:col-span-4 bg-[#0b0b0b] p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-zinc-800">
            <div className="flex items-center justify-between text-[11px] tracking-[0.3em] text-zinc-400 uppercase">
              <span>GIGSDA ID // {profile?.id || 'SECU'}</span>
              <span>EPK</span>
            </div>

            <div className="my-10 flex items-center gap-6">
              <div className="flex flex-col items-center">
                <span
                  className="text-4xl sm:text-5xl font-black tracking-tighter uppercase leading-none select-none text-white"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  SECURITY
                </span>
                {/* Security-Linien Raster */}
                <div className="flex items-end gap-[4px] h-14 mt-6" aria-hidden="true">
                  {[50, 85, 60, 95, 45, 80, 65, 35, 90, 55, 75, 40].map((h, idx) => (
                    <span
                      key={idx}
                      className="w-[3px] bg-amber-400/90"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between h-full space-y-6">
                <span
                  className="text-lg sm:text-xl font-light tracking-[0.45em] uppercase text-zinc-400"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  PORTFOLIO
                </span>

                <div className="space-y-3 pt-4">
                  {galleryImages.slice(0, 2).map((img, i) => (
                    <div key={i} className="w-20 h-20 overflow-hidden border border-zinc-700 grayscale hover:grayscale-0 transition">
                      <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t border-zinc-800 pt-5 text-xs text-zinc-400">
              <p className="uppercase tracking-[0.2em] text-white font-semibold">
                {profile?.genre || 'Veranstaltungsschutz & Deeskalation'}
              </p>
              <p className="text-zinc-500">
                {profile?.city ? `${profile.city} • ` : ''}
                {profile?.security_personnel_pool || '65 PAX'} Personalpool
              </p>
            </div>
          </div>

          {/* Rechtes Hero-Visual */}
          <div className="lg:col-span-8 relative min-h-[480px] bg-zinc-900 flex flex-col justify-end">
            {heroImage ? (
              <img
                src={heroImage}
                alt={companyName}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-600 uppercase tracking-widest text-sm">
                Kein Coverbild hinterlegt
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

            <div className="relative z-10 p-8 sm:p-12">
              <p className="text-amber-400 text-xs uppercase tracking-[0.35em] font-semibold mb-2">
                {profile?.category || 'Sicherheitsdienst & Veranstaltungsschutz'}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-none">
                {companyName}
              </h1>
              {profile?.description && (
                <p className="mt-4 max-w-xl text-zinc-200 text-sm sm:text-base leading-relaxed font-light">
                  {profile.description}
                </p>
              )}

              {/* Key KPIs */}
              <div className="mt-5 pt-4 border-t border-zinc-700/80 flex flex-wrap gap-6 text-xs font-mono uppercase tracking-wider text-amber-400">
                <span>Personalpool: {profile?.security_personnel_pool || '65 PAX'}</span>
                <span>Max. Team: {profile?.security_max_team_size || '80 PAX'}</span>
                <span>Radius: {profile?.security_operating_radius || '250 km'}</span>
              </div>

              <div className="mt-6">
                <PortfolioActionBar
                  profile={profile}
                  isOwner={isOwner}
                  setView={setView}
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SPREAD 02: PROFILE & STORY (Heller Kontrast)
           ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 bg-white text-zinc-900 shadow-2xl overflow-hidden">
          
          {/* Linke Seite: Profil & Story */}
          <div className="lg:col-span-6 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-zinc-200 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between border-b-2 border-black pb-3 mb-8">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">Profile</h2>
                <span className="text-xs font-mono text-zinc-500">01 // SECURITY</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 mb-8 items-start">
                <div className="sm:col-span-5 aspect-[3/4] bg-zinc-100 overflow-hidden">
                  <img
                    src={galleryImages[0]?.url || heroImage}
                    alt={companyName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="sm:col-span-7 space-y-3 text-sm">
                  <div className="border-b border-zinc-200 pb-2">
                    <span className="block text-[10px] uppercase tracking-widest text-zinc-400">Unternehmen</span>
                    <span className="font-bold text-base">{companyName}</span>
                  </div>
                  <div className="border-b border-zinc-200 pb-2">
                    <span className="block text-[10px] uppercase tracking-widest text-zinc-400">Einsatzleitung</span>
                    <span className="font-medium">{profile?.name || '-'}</span>
                  </div>
                  <div className="border-b border-zinc-200 pb-2">
                    <span className="block text-[10px] uppercase tracking-widest text-zinc-400">Standort</span>
                    <span className="font-medium">{profile?.city || '-'}</span>
                  </div>
                  <div className="border-b border-zinc-200 pb-2">
                    <span className="block text-[10px] uppercase tracking-widest text-zinc-400">Zulassung</span>
                    <span className="font-medium">§ 34a GewO</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-sm text-zinc-700 leading-relaxed">
                {profile?.bio_einleitung && (
                  <p className="font-medium text-zinc-900 text-base leading-snug">
                    {profile.bio_einleitung}
                  </p>
                )}
                {profile?.bio_karriere && (
                  <p className="whitespace-pre-line">{profile.bio_karriere}</p>
                )}
                {profile?.bio_privates && (
                  <p>{profile.bio_privates}</p>
                )}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-400 font-mono">
              <span>{companyName}</span>
              <span>PAGE 02</span>
            </div>
          </div>

          {/* Rechts: Visual & Contents */}
          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between bg-zinc-50">
            <div className="aspect-[16/10] w-full bg-zinc-900 overflow-hidden mb-8">
              <img
                src={galleryImages[1]?.url || heroImage}
                alt="Security Visual"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight border-b-2 border-black pb-2 mb-6">
                Contents
              </h3>

              <ul className="space-y-3 text-sm">
                <li className="flex justify-between border-b border-zinc-300 pb-1.5">
                  <span className="font-bold uppercase tracking-wider">01. Sicherheits-Profil & Unternehmen</span>
                  <span className="font-mono text-zinc-500">P. 02</span>
                </li>
                <li className="flex justify-between border-b border-zinc-300 pb-1.5">
                  <span className="font-bold uppercase tracking-wider">02. Leistungsspektrum & Einsatzbereiche</span>
                  <span className="font-mono text-zinc-500">P. 03</span>
                </li>
                <li className="flex justify-between border-b border-zinc-300 pb-1.5">
                  <span className="font-bold uppercase tracking-wider">03. Qualifikationen & Ausrüstung</span>
                  <span className="font-mono text-zinc-500">P. 03</span>
                </li>
                <li className="flex justify-between border-b border-zinc-300 pb-1.5">
                  <span className="font-bold uppercase tracking-wider">04. Stundensätze, Tarife & Kontakt</span>
                  <span className="font-mono text-zinc-500">P. 04</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-400 font-mono">
              <span>SECURITY PORTFOLIO</span>
              <span>PAGE 02</span>
            </div>
          </div>
        </section>

        {/* =========================================================
            SPREAD 03: SERVICES & GEAR (Dark Contrast)
           ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 bg-[#0d0d0d] text-white shadow-2xl overflow-hidden border border-zinc-800">
          
          {/* Linke Seite: Leistungsspektrum */}
          <div className="lg:col-span-6 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between border-b border-zinc-700 pb-3 mb-8">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">Services</h2>
                <span className="text-xs font-mono text-amber-400">02 // PROTECTION</span>
              </div>

              <div className="space-y-4">
                {profile?.security_service_access_control && (
                  <div className="bg-zinc-900 p-4 border border-zinc-800">
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-1">Einlass- & Zugangskontrollen</span>
                    <p className="font-medium text-sm text-white">{profile.security_service_access_control}</p>
                  </div>
                )}
                {profile?.security_service_stage_backstage && (
                  <div className="bg-zinc-900 p-4 border border-zinc-800">
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-1">Bühnengraben & Backstage-Schutz</span>
                    <p className="font-medium text-sm text-white">{profile.security_service_stage_backstage}</p>
                  </div>
                )}
                {profile?.security_service_vip_artist && (
                  <div className="bg-zinc-900 p-4 border border-zinc-800">
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-1">VIP- & Artist-Begleitschutz</span>
                    <p className="font-medium text-sm text-white">{profile.security_service_vip_artist}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-500 font-mono">
              <span>SECURITY SERVICES</span>
              <span>PAGE 03</span>
            </div>
          </div>

          {/* Rechts: Qualifikationen & Ausrüstung */}
          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between bg-black">
            <div>
              <div className="flex items-baseline justify-between border-b border-zinc-700 pb-3 mb-8">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">Standards & Gear</h2>
                <span className="text-xs font-mono text-amber-400">03 // QUALIFICATIONS</span>
              </div>

              <div className="space-y-4 text-sm text-zinc-300">
                <div>
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-400 block mb-1">Personal-Qualifikation</span>
                  <p>{profile?.security_qualification_personnel || 'Sachkundeprüfung § 34a GewO, Deeskalationstraining, Ersthelfer'}</p>
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-400 block mb-1">Kommunikation & Funk</span>
                  <p>{profile?.security_communication || 'Digitale Betriebsfunkgeräte (Motorola) mit Security-Headsets'}</p>
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-400 block mb-1">Kontroll-Equipment</span>
                  <p>{profile?.security_control_equipment || 'Hand-Metalldetektoren, Einsatzlampen, Zählwerke'}</p>
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-400 block mb-1">Dienstkleidung</span>
                  <p>{profile?.security_appearance_clothing || 'Einheitliche Einsatzkleidung (Black-Tactical oder Anzug)'}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-500 font-mono">
              <span>GEAR & QUALIFICATIONS</span>
              <span>PAGE 03</span>
            </div>
          </div>
        </section>

        {/* =========================================================
            SPREAD 04: RATES & CONTACT
           ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 bg-white text-zinc-900 shadow-2xl overflow-hidden">
          
          {/* Linke Seite: Stundensätze & Tarife */}
          <div className="lg:col-span-7 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-zinc-200 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between border-b-2 border-black pb-3 mb-8">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">Rates & Terms</h2>
                <span className="text-xs font-mono text-zinc-500">04 // FINANCIALS</span>
              </div>

              <p className="text-sm text-zinc-600 leading-relaxed mb-8">
                Transparente B2B-Konditionen für Veranstaltungsschutz und Security-Personal:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-zinc-100 p-5 border-l-4 border-black">
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500">Sicherheitsmitarbeiter</span>
                  <span className="font-bold text-base mt-1 block">
                    {profile?.security_price_security_staff || '32,00 - 38,00 EUR / Std.'}
                  </span>
                </div>
                <div className="bg-zinc-100 p-5 border-l-4 border-black">
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500">Einsatzleiter / Schichtführer</span>
                  <span className="font-bold text-base mt-1 block">
                    {profile?.security_price_shift_lead || '44,00 EUR / Stunde'}
                  </span>
                </div>
                <div className="bg-zinc-100 p-5 border-l-4 border-black">
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500">Nachtwache / Aufbau</span>
                  <span className="font-bold text-sm mt-1 block">
                    {profile?.security_price_night_watch_setup || '29,50 EUR / Stunde'}
                  </span>
                </div>
                <div className="bg-zinc-100 p-5 border-l-4 border-black">
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500">Mindesteinsatzzeit</span>
                  <span className="font-bold text-sm mt-1 block">
                    {profile?.security_minimum_assignment || '5 Stunden pro Kraft'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStandardSheet(true)}
                  className="px-4 py-2 border border-black text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 transition"
                >
                  Security Standard Sheet öffnen
                </button>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-400 font-mono">
              <span>RATES & FINANCIALS</span>
              <span>PAGE 04</span>
            </div>
          </div>

          {/* Rechts: Dispatch Contact */}
          <div className="lg:col-span-5 p-8 sm:p-12 bg-zinc-950 text-white flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-amber-400">
                Security Dispatch & Booking
              </span>
              <h2 className="text-3xl font-black uppercase tracking-tight mt-2 mb-6">
                Booking Contact
              </h2>

              <p className="text-sm text-zinc-400 leading-relaxed mb-8">
                Für Sicherheitskonzepte, Personaldisposition und Event-Anfragen wenden Sie sich bitte direkt an:
              </p>

              <div className="space-y-4 text-sm border-t border-zinc-800 pt-6">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500">Unternehmen & Adresse</span>
                  <p className="text-sm font-semibold text-zinc-200">
                    {companyName}<br />
                    {profile?.street}<br />
                    {profile?.plz} {profile?.city}
                  </p>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500">E-Mail</span>
                  <a href={`mailto:${profile?.email}`} className="text-base font-semibold text-white hover:text-amber-400 transition">
                    {profile?.email || '-'}
                  </a>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500">Telefon</span>
                  <a href={`tel:${profile?.phone}`} className="text-base font-semibold text-white hover:text-amber-400 transition">
                    {profile?.phone || '-'}
                  </a>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500">Webseite</span>
                  <span className="text-base font-semibold text-amber-400 break-all">
                    {profile?.website || 'https://www.gigsda.com'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-4 border-t border-zinc-800 flex justify-between items-center text-[11px] text-zinc-500 font-mono">
              <span>POWERED BY GIGSDA.COM</span>
              <span>{new Date().getFullYear()}</span>
            </div>
          </div>
        </section>

        {/* GIGSDAPASS - NUR FÜR OWNER */}
        {isOwner && (
          <div className="pt-4">
            <GigsdaPass profile={profile} />
          </div>
        )}

      </main>
    </div>
  );
}
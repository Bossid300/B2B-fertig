import React, { useState } from 'react';
import GigsdaPass from "../GigsdaPass";
import { eventService } from '../../services/eventService';
import GoogleMapsConsent from '../maps/GoogleMapsConsent';
import PortfolioActionBar from './shared/PortfolioActionBar';
import LocationSheet from '../sheets/LocationSheet';
import SheetRouter from '../sheets/SheetRouter';
import { DownloadLocationPdfButton } from './LocationPortfolioPdf';

const POWER_SUPPLY_LABELS = {
  'cee 63a': 'CEE 63A (Großbühne)',
  'cee 32a': 'CEE 32A (Mittelbühne / Club)',
  'cee 16a': 'CEE 16A (Kleine Bühne)',
  schuko: '230V Schuko (Standard)'
};

const getPowerSupplyLabel = (value) => {
  const normalizedValue = String(value || '').trim().toLowerCase();
  return POWER_SUPPLY_LABELS[normalizedValue] || value || 'Keine Angabe';
};

export default function LocationPortfolio({
  profile,
  onBack = null,
  setView
}) {
  const [showStandardSheet, setShowStandardSheet] = useState(false);

  const loggedInProfileId = localStorage.getItem('gigsda_profile_id');
  const isOwner = String(loggedInProfileId) === String(profile?.id);
  const powerSupply = getPowerSupplyLabel(profile?.room1_power_supply);

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
        SheetComponent={LocationSheet}
        roleLabel="Location"
        backLabel="Zurück zum Location-Portfolio"
        onBack={() => setShowStandardSheet(false)}
        setView={setView}
      />
    );
  }

  const venueName = profile?.Klarname || profile?.name || 'Event Location';
  const heroImage = profile?.slide1_url || profile?.room1_img || profile?.gallery_slot1_url;
  const roomImage = profile?.room1_img || profile?.gallery_slot1_url || profile?.slide1_url;

  const galleryImages = [1, 2, 3, 4]
    .map(num => ({
      url: profile?.[`gallery_slot${num}_url`],
      title: profile?.[`gallery_slot${num}_title`] || `Impression 0${num}`
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
              GIGSDA // Venue Exposé
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <DownloadLocationPdfButton profile={profile} references={references} />
            <button
              type="button"
              onClick={() => setShowStandardSheet(true)}
              className="px-4 py-1.5 border border-zinc-700 text-zinc-300 text-xs font-semibold uppercase tracking-wider hover:border-white hover:text-white transition"
            >
              Location Standard Sheet
            </button>
          </div>
        </div>
      </div>

      {/* MAIN MAGAZINE CONTAINER */}
      <main className="max-w-6xl mx-auto py-10 px-4 sm:px-6 space-y-12">

        {/* =========================================================
            SPREAD 01: VENUE COVER
           ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 min-h-[680px] bg-black text-white shadow-2xl overflow-hidden border border-zinc-800">
          
          {/* Linker Magazin-Rücken */}
          <div className="lg:col-span-4 bg-[#0b0b0b] p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-zinc-800">
            <div className="flex items-center justify-between text-[11px] tracking-[0.3em] text-zinc-400 uppercase">
              <span>GIGSDA ID // {profile?.id || 'VENUE'}</span>
              <span>EXPOSÉ</span>
            </div>

            <div className="my-10 flex items-center gap-6">
              <div className="flex flex-col items-center">
                <span
                  className="text-5xl sm:text-6xl font-black tracking-tighter uppercase leading-none select-none text-white"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  VENUE
                </span>
                {/* Architektonisches Linien-Raster */}
                <div className="flex items-end gap-[4px] h-14 mt-6" aria-hidden="true">
                  {[35, 75, 50, 95, 45, 70, 85, 40, 65, 30, 80, 55].map((h, idx) => (
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
                {profile?.city || 'Event Location'}
              </p>
              <p className="text-zinc-500">
                {profile?.room1_area ? `${profile.room1_area} m² • ` : ''}
                {profile?.room1_steh ? `Max. ${profile.room1_steh} Personen` : 'Flexible Kapazität'}
              </p>
            </div>
          </div>

          {/* Rechtes Hero-Visual */}
          <div className="lg:col-span-8 relative min-h-[480px] bg-zinc-900 flex flex-col justify-end">
            {heroImage ? (
              <img
                src={heroImage}
                alt={venueName}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-600 uppercase tracking-widest text-sm">
                Kein Coverbild hinterlegt (slide1_url)
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

            <div className="relative z-10 p-8 sm:p-12">
              <p className="text-amber-400 text-xs uppercase tracking-[0.35em] font-semibold mb-2">
                {profile?.category || 'Event Location / Club / Veranstaltungshalle'}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-none">
                {venueName}
              </h1>
              <p className="mt-3 text-zinc-200 text-sm sm:text-base font-light">
                {[profile?.street, `${profile?.plz || ''} ${profile?.city || ''}`.trim()]
                  .filter(Boolean)
                  .join(', ')}
              </p>

              {/* Key KPIs */}
              <div className="mt-5 pt-4 border-t border-zinc-700/80 flex flex-wrap gap-6 text-xs font-mono uppercase tracking-wider text-amber-400">
                {profile?.room1_area && <span>Fläche: {profile.room1_area} m²</span>}
                {profile?.room1_steh && <span>Max. Kapazität: {profile.room1_steh} Pax</span>}
                {profile?.room1_curfew_time && <span>Sperrstunde: {profile.room1_curfew_time} Uhr</span>}
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
            SPREAD 02: VENUE PORTRAIT & KAPAZITÄTEN (Heller Kontrast)
           ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 bg-white text-zinc-900 shadow-2xl overflow-hidden">
          
          {/* Linke Seite: Portrait & Bestuhlung */}
          <div className="lg:col-span-6 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-zinc-200 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between border-b-2 border-black pb-3 mb-8">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">Venue Portrait</h2>
                <span className="text-xs font-mono text-zinc-500">01 // OVERVIEW</span>
              </div>

              <p className="text-sm sm:text-base text-zinc-700 leading-relaxed mb-8 whitespace-pre-line">
                {profile?.description || 'Keine Beschreibung vorhanden.'}
              </p>

              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 mb-4">
                Fläche & Kapazitäten nach Bestuhlung
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-zinc-100 p-4 border-l-4 border-black">
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500">Gesamtfläche</span>
                  <span className="font-black text-lg">{profile?.room1_area ? `${profile.room1_area} m²` : '-'}</span>
                </div>
                <div className="bg-zinc-100 p-4 border-l-4 border-black">
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500">Stehempfang</span>
                  <span className="font-black text-lg">{profile?.room1_steh ? `${profile.room1_steh} Pers.` : '-'}</span>
                </div>
                <div className="bg-zinc-100 p-4 border-l-4 border-black">
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500">Bankett / Gala</span>
                  <span className="font-black text-lg">{profile?.room1_bankett ? `${profile.room1_bankett} Pers.` : '-'}</span>
                </div>
                <div className="bg-zinc-100 p-4 border-l-4 border-black">
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500">Theater-Reihen</span>
                  <span className="font-black text-lg">{profile?.room1_theater ? `${profile.room1_theater} Pers.` : '-'}</span>
                </div>
                <div className="bg-zinc-100 p-4 border-l-4 border-black">
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500">U-Form</span>
                  <span className="font-black text-lg">{profile?.room1_uform ? `${profile.room1_uform} Pers.` : '-'}</span>
                </div>
                <div className="bg-zinc-100 p-4 border-l-4 border-black">
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500">Sperrstunde</span>
                  <span className="font-black text-lg">{profile?.room1_curfew_time ? `${profile.room1_curfew_time} Uhr` : '-'}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-400 font-mono">
              <span>{venueName}</span>
              <span>PAGE 02</span>
            </div>
          </div>

          {/* Rechte Seite: Raumfoto & Contents */}
          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between bg-zinc-50">
            {roomImage && (
              <div className="aspect-[16/10] w-full bg-zinc-900 overflow-hidden mb-8">
                <img
                  src={roomImage}
                  alt="Veranstaltungsraum"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight border-b-2 border-black pb-2 mb-6">
                Contents
              </h3>

              <ul className="space-y-3 text-sm">
                <li className="flex justify-between border-b border-zinc-300 pb-1.5">
                  <span className="font-bold uppercase tracking-wider">01. Venue Portrait & Kapazitäten</span>
                  <span className="font-mono text-zinc-500">P. 02</span>
                </li>
                <li className="flex justify-between border-b border-zinc-300 pb-1.5">
                  <span className="font-bold uppercase tracking-wider">02. Inhouse-Technik & Bühne</span>
                  <span className="font-mono text-zinc-500">P. 03</span>
                </li>
                <li className="flex justify-between border-b border-zinc-300 pb-1.5">
                  <span className="font-bold uppercase tracking-wider">03. Impressionen & Referenzen</span>
                  <span className="font-mono text-zinc-500">P. 03</span>
                </li>
                <li className="flex justify-between border-b border-zinc-300 pb-1.5">
                  <span className="font-bold uppercase tracking-wider">04. Konditionen, Standort & Kontakt</span>
                  <span className="font-mono text-zinc-500">P. 04</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-400 font-mono">
              <span>VENUE PORTFOLIO</span>
              <span>PAGE 02</span>
            </div>
          </div>
        </section>

        {/* =========================================================
            SPREAD 03: TECH & INFRASTRUCTURE + ATMOSPHERE (Dark Contrast)
           ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 bg-[#0d0d0d] text-white shadow-2xl overflow-hidden border border-zinc-800">
          
          {/* Linke Seite: Inhouse-Technik & Bühnenplan */}
          <div className="lg:col-span-6 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between border-b border-zinc-700 pb-3 mb-8">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">Tech & Stage</h2>
                <span className="text-xs font-mono text-amber-400">02 // INFRASTRUCTURE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="border-b border-zinc-800 pb-3">
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-400">Stromversorgung</span>
                  <span className="font-bold text-base text-white mt-1 block">{powerSupply}</span>
                </div>
                <div className="border-b border-zinc-800 pb-3">
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-400">Öffnungszeiten</span>
                  <span className="font-bold text-sm text-white mt-1 block">
                    {profile?.room1_opening_hours || 'Nach Vereinbarung'}
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <span className="block text-xs font-mono uppercase tracking-widest text-amber-400 mb-3">
                  Inhouse-Technik & Equipment
                </span>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                  {profile?.room1_equipment || 'Keine Angaben vorhanden.'}
                </p>
              </div>

              {profile?.room1_tech_plan && (
                <div className="pt-2">
                  <span className="block text-xs font-mono uppercase tracking-widest text-amber-400 mb-3">
                    Bühnenplan & Technik-Dokument
                  </span>
                  {profile.room1_tech_plan.includes('/api/media.php?preview=') ? (
                    <img
                      src={profile.room1_tech_plan}
                      alt="Bühnenplan & Technik"
                      className="w-full h-auto border border-zinc-800"
                    />
                  ) : (
                    <a
                      href={profile.room1_tech_plan}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-amber-400 text-black text-xs font-bold uppercase tracking-wider hover:bg-amber-300 transition"
                    >
                      Technischen Plan / PDF öffnen ↗
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-500 font-mono">
              <span>TECHNICAL SPECIFICATIONS</span>
              <span>PAGE 03</span>
            </div>
          </div>

          {/* Rechte Seite: Galerie & Referenzen */}
          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between bg-black">
            <div>
              <div className="flex items-baseline justify-between border-b border-zinc-700 pb-3 mb-8">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">Atmosphere</h2>
                <span className="text-xs font-mono text-amber-400">03 // GALLERY & EVENTS</span>
              </div>

              {galleryImages.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {galleryImages.map((img, i) => (
                    <div key={i} className="group relative aspect-[4/3] overflow-hidden bg-zinc-900 border border-zinc-800">
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                        <p className="text-[11px] text-zinc-300 truncate">{img.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400 mb-4">
                  Veranstaltungen & GIGSDA References
                </h3>
                {references.length > 0 ? (
                  <div className="space-y-2.5">
                    {references.map(ref => (
                      <div
                        key={ref.id}
                        className="flex items-center justify-between border-b border-zinc-800 pb-2 text-sm"
                      >
                        <span className="font-semibold text-white">{ref.title}</span>
                        <span className="text-xs font-mono text-zinc-400">{ref.date}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Alle Veranstaltungen, Konzerte und Produktionen in dieser Location über GIGSDA erscheinen hier automatisch.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-500 font-mono">
              <span>IMPRESSIONS & CREDITS</span>
              <span>PAGE 03</span>
            </div>
          </div>
        </section>

        {/* =========================================================
            SPREAD 04: KONDITIONEN, STANDORT & LOCATION CONTACT
           ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 bg-white text-zinc-900 shadow-2xl overflow-hidden">
          
          {/* Linke Seite: Mietbedingungen, ÖPNV & Karte */}
          <div className="lg:col-span-7 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-zinc-200 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between border-b-2 border-black pb-3 mb-8">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">Booking & Access</h2>
                <span className="text-xs font-mono text-zinc-500">04 // LOGISTICS</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                    Preise, Konditionen & Mietbedingungen
                  </span>
                  <p className="text-sm font-medium text-zinc-900 leading-relaxed">
                    {profile?.room1_konditionen || 'Buchbar auf Anfrage'}
                  </p>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                    Parken & ÖPNV-Anbindung
                  </span>
                  <p className="text-sm font-medium text-zinc-900 leading-relaxed">
                    {profile?.room1_opnv || 'Keine Angabe'}
                  </p>
                </div>
              </div>

              {/* Interaktive Standort-Karte */}
              {profile?.lat && profile?.lng && (
                <div className="border border-zinc-300 overflow-hidden mb-4">
                  <GoogleMapsConsent height="220px">
                    <iframe
                      src={`https://maps.google.com/maps?q=${profile.lat},${profile.lng}&z=15&output=embed`}
                      width="100%"
                      height="220px"
                      className="border-0"
                      allowFullScreen=""
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Google Maps Karte für ${venueName}`}
                    />
                  </GoogleMapsConsent>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                {profile?.lat && profile?.lng && (
                  <a
                    href={`https://www.google.com/maps?q=${profile.lat},${profile.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition"
                  >
                    Route in Google Maps öffnen ↗
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setShowStandardSheet(true)}
                  className="px-4 py-2 border border-black text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 transition"
                >
                  Location Standard Sheet öffnen
                </button>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-400 font-mono">
              <span>CONDITIONS & LOCATION</span>
              <span>PAGE 04</span>
            </div>
          </div>

          {/* Rechte Seite: Location Contact */}
          <div className="lg:col-span-5 p-8 sm:p-12 bg-zinc-950 text-white flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-amber-400">
                Venue Management & Booking
              </span>
              <h2 className="text-3xl font-black uppercase tracking-tight mt-2 mb-6">
                Location Contact
              </h2>

              <p className="text-sm text-zinc-400 leading-relaxed mb-8">
                Für Terminanfragen, Besichtigungen, technische Rückfragen und Mietkonditionen wenden Sie sich bitte direkt an:
              </p>

              <div className="space-y-4 text-sm border-t border-zinc-800 pt-6">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500">Adresse</span>
                  <p className="text-sm font-semibold text-zinc-200">
                    {venueName}<br />
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
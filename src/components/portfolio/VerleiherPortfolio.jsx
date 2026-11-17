import React, { useState } from 'react';
import GigsdaPass from "../GigsdaPass";
import { eventService } from '../../services/eventService';
import PortfolioActionBar from './shared/PortfolioActionBar';
import VerleiherSheet from '../sheets/VerleiherSheet'; // Passe den Pfad bei Bedarf an
import SheetRouter from '../sheets/SheetRouter';
import { DownloadVerleiherPdfButton } from './VerleiherPortfolioPdf';

export default function VerleiherPortfolio({
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
        SheetComponent={VerleiherSheet}
        roleLabel="Verleiher"
        backLabel="Zurück zum Verleiher-Portfolio"
        onBack={() => setShowStandardSheet(false)}
        setView={setView}
      />
    );
  }

  const companyName = profile?.Klarname || profile?.name || 'STAGE & TECH RENTAL';
  const heroImage = profile?.avatarUrl || profile?.slide1_url || profile?.gallery_slot1_url;
  
  const galleryImages = [1, 2, 3, 4]
    .map(num => ({
      url: profile?.[`gallery_slot${num}_url`],
      title: profile?.[`gallery_slot${num}_title`] || `Rental 0${num}`
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
              GIGSDA // Rental EPK
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <DownloadVerleiherPdfButton profile={profile} references={references} />
            <button
              type="button"
              onClick={() => setShowStandardSheet(true)}
              className="px-4 py-1.5 border border-zinc-700 text-zinc-300 text-xs font-semibold uppercase tracking-wider hover:border-white hover:text-white transition"
            >
              Verleiher Standard Sheet
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
              <span>GIGSDA ID // {profile?.id || 'RENTAL'}</span>
              <span>EPK</span>
            </div>

            <div className="my-10 flex items-center gap-6">
              <div className="flex flex-col items-center">
                <span
                  className="text-4xl sm:text-5xl font-black tracking-tighter uppercase leading-none select-none text-white"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  VERLEIH
                </span>
                {/* Tech-Linien Raster */}
                <div className="flex items-end gap-[4px] h-14 mt-6" aria-hidden="true">
                  {[45, 80, 60, 95, 50, 85, 70, 35, 90, 55, 75, 40].map((h, idx) => (
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
                  DRY-HIRE
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
                {profile?.genre || 'Ton, Licht, Video & Rigging'}
              </p>
              <p className="text-zinc-500">
                {profile?.city ? `${profile.city} • ` : ''}
                {profile?.verleiher_storage_area || '1500'} m² Lagerfläche
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
                {profile?.category || 'Professioneller Materialverleih'}
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
                <span>Service: {profile?.verleiher_service_model || 'Dry-Hire'}</span>
                <span>Fuhrpark: {profile?.verleiher_own_fleet || 'Eigene LKW'}</span>
                <span>Support: {profile?.verleiher_24_7_support || '24/7 Hotline'}</span>
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
          
          {/* Linke Seite: Profil & Bio */}
          <div className="lg:col-span-6 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-zinc-200 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between border-b-2 border-black pb-3 mb-8">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">Profile</h2>
                <span className="text-xs font-mono text-zinc-500">01 // RENTAL</span>
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
                    <span className="block text-[10px] uppercase tracking-widest text-zinc-400">Ansprechpartner</span>
                    <span className="font-medium">{profile?.name || '-'}</span>
                  </div>
                  <div className="border-b border-zinc-200 pb-2">
                    <span className="block text-[10px] uppercase tracking-widest text-zinc-400">Standort</span>
                    <span className="font-medium">{profile?.city || '-'}</span>
                  </div>
                  <div className="border-b border-zinc-200 pb-2">
                    <span className="block text-[10px] uppercase tracking-widest text-zinc-400">Lagerfläche</span>
                    <span className="font-medium">
                      {profile?.verleiher_storage_area ? `${profile.verleiher_storage_area} m²` : '1.500 m²'}
                    </span>
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
                  <p>{profile.bio_karriere}</p>
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
                alt="Rental Visual"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight border-b-2 border-black pb-2 mb-6">
                Contents
              </h3>

              <ul className="space-y-3 text-sm">
                <li className="flex justify-between border-b border-zinc-300 pb-1.5">
                  <span className="font-bold uppercase tracking-wider">01. Verleih-Profil & Unternehmen</span>
                  <span className="font-mono text-zinc-500">P. 02</span>
                </li>
                <li className="flex justify-between border-b border-zinc-300 pb-1.5">
                  <span className="font-bold uppercase tracking-wider">02. Mietpark-Portfolio & Equipment</span>
                  <span className="font-mono text-zinc-500">P. 03</span>
                </li>
                <li className="flex justify-between border-b border-zinc-300 pb-1.5">
                  <span className="font-bold uppercase tracking-wider">03. Dry-Hire-Staffelung & Logistik</span>
                  <span className="font-mono text-zinc-500">P. 03</span>
                </li>
                <li className="flex justify-between border-b border-zinc-300 pb-1.5">
                  <span className="font-bold uppercase tracking-wider">04. Tarife, Konditionen & Kontakt</span>
                  <span className="font-mono text-zinc-500">P. 04</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-400 font-mono">
              <span>RENTAL & TECH PORTFOLIO</span>
              <span>PAGE 02</span>
            </div>
          </div>
        </section>

        {/* =========================================================
            SPREAD 03: INVENTORY & DRY-HIRE (Dark Contrast)
           ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 bg-[#0d0d0d] text-white shadow-2xl overflow-hidden border border-zinc-800">
          
          {/* Linke Seite: Mietpark-Portfolio */}
          <div className="lg:col-span-6 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between border-b border-zinc-700 pb-3 mb-8">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">Inventory</h2>
                <span className="text-xs font-mono text-amber-400">02 // MIETPARK</span>
              </div>

              <div className="space-y-4">
                {profile?.verleiher_portfolio_ton && (
                  <div className="bg-zinc-900 p-4 border border-zinc-800">
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-1">Tontechnik</span>
                    <p className="font-semibold text-sm text-white">{profile.verleiher_portfolio_ton}</p>
                  </div>
                )}
                {profile?.verleiher_portfolio_licht && (
                  <div className="bg-zinc-900 p-4 border border-zinc-800">
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-1">Lichttechnik</span>
                    <p className="font-semibold text-sm text-white">{profile.verleiher_portfolio_licht}</p>
                  </div>
                )}
                {profile?.verleiher_portfolio_pulte && (
                  <div className="bg-zinc-900 p-4 border border-zinc-800">
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-1">Mischpulte</span>
                    <p className="font-semibold text-sm text-white">{profile.verleiher_portfolio_pulte}</p>
                  </div>
                )}
                {profile?.verleiher_portfolio_video && (
                  <div className="bg-zinc-900 p-4 border border-zinc-800">
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-1">Videotechnik & LED</span>
                    <p className="font-semibold text-sm text-white">{profile.verleiher_portfolio_video}</p>
                  </div>
                )}
                {profile?.verleiher_portfolio_rigging && (
                  <div className="bg-zinc-900 p-4 border border-zinc-800">
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-1">Rigging & Truss</span>
                    <p className="font-semibold text-sm text-white">{profile.verleiher_portfolio_rigging}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-500 font-mono">
              <span>RENTAL INVENTORY</span>
              <span>PAGE 03</span>
            </div>
          </div>

          {/* Rechts: Dry-Hire Staffelung & Standards */}
          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between bg-black">
            <div>
              <div className="flex items-baseline justify-between border-b border-zinc-700 pb-3 mb-8">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">Dry-Hire Rates</h2>
                <span className="text-xs font-mono text-amber-400">03 // STAFFELUNG</span>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between border-b border-zinc-800 pb-2 text-xs font-mono text-amber-400 uppercase">
                  <span>Dauer</span>
                  <span>Faktor & Bedingungen</span>
                </div>
                <div className="border-b border-zinc-800 pb-2.5">
                  <span className="font-bold text-sm text-white block">1 Einsatztag (1,0 × Tagessatz)</span>
                  <span className="text-xs text-zinc-400">Standard Dry-Hire Abholung ab 14:00 Uhr am Vortag.</span>
                </div>
                <div className="border-b border-zinc-800 pb-2.5">
                  <span className="font-bold text-sm text-white block">2 Einsatztage (1,5 × Tagessatz)</span>
                  <span className="text-xs text-zinc-400">Wochenend-Spezialtarif (Fr. – Mo.).</span>
                </div>
                <div className="border-b border-zinc-800 pb-2.5">
                  <span className="font-bold text-sm text-white block">3-4 Einsatztage (2,0 × Tagessatz)</span>
                  <span className="text-xs text-zinc-400">Inklusive Kabelbäume & Verteiler-Zubehör.</span>
                </div>
                <div className="border-b border-zinc-800 pb-2.5">
                  <span className="font-bold text-sm text-white block">1 Woche (3,0 × Tagessatz)</span>
                  <span className="text-xs text-zinc-400">Attraktiver Langzeit-Mietfaktor für Festival-Touren.</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400 mb-3 block">
                  Prüf- & Logistikstandards
                </span>
                <ul className="space-y-1.5 text-sm text-zinc-300">
                  <li>• Elektrische Prüfung: {profile?.verleiher_electrical_inspection || 'DGUV-V3 Zerti-Check'}</li>
                  <li>• Motoren & Hebezeuge: {profile?.verleiher_motors_hoists || 'DGUV-V17/18 Sachkunde'}</li>
                  <li>• Verpackung: {profile?.verleiher_packaging || 'Standard-Truckmass Cases'}</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-500 font-mono">
              <span>DRY-HIRE CONDITIONS</span>
              <span>PAGE 03</span>
            </div>
          </div>
        </section>

        {/* =========================================================
            SPREAD 04: RATES & BOOKING CONTACT
           ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 bg-white text-zinc-900 shadow-2xl overflow-hidden">
          
          {/* Linke Seite: Honorare & Bedingungen */}
          <div className="lg:col-span-7 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-zinc-200 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between border-b-2 border-black pb-3 mb-8">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">Rates & Terms</h2>
                <span className="text-xs font-mono text-zinc-500">04 // FINANCIALS</span>
              </div>

              <p className="text-sm text-zinc-600 leading-relaxed mb-8">
                B2B-Konditionen für Materialverleih, Dry-Hire-Abwicklungen und projektbezogene Logistik:
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-zinc-100 p-5 border-l-4 border-black">
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500">Stundensatz</span>
                  <span className="font-black text-2xl mt-1 block">
                    {profile?.rate_hour ? `${profile.rate_hour} €` : '65 €'}
                  </span>
                </div>
                <div className="bg-zinc-100 p-5 border-l-4 border-black">
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500">Tagessatz</span>
                  <span className="font-black text-2xl mt-1 block">
                    {profile?.rate_day ? `${profile.rate_day} €` : '500 €'}
                  </span>
                </div>
                <div className="bg-zinc-100 p-5 border-l-4 border-black">
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500">Gage Min. / Max.</span>
                  <span className="font-black text-lg mt-1 block">
                    {profile?.gage_min || profile?.gage_max
                      ? `${profile?.gage_min || '400'} € – ${profile?.gage_max || '1200'} €`
                      : 'Auf Anfrage'}
                  </span>
                </div>
                <div className="bg-zinc-100 p-5 border-l-4 border-black">
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500">Materialausgabe</span>
                  <span className="font-black text-sm mt-1 block">
                    {profile?.verleiher_material_handover || 'Mo.–Fr. 08:00–17:00'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStandardSheet(true)}
                  className="px-4 py-2 border border-black text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 transition"
                >
                  Verleiher Standard Sheet öffnen
                </button>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-400 font-mono">
              <span>RATES & RENTAL TERMS</span>
              <span>PAGE 04</span>
            </div>
          </div>

          {/* Rechts: Booking Contact */}
          <div className="lg:col-span-5 p-8 sm:p-12 bg-zinc-950 text-white flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-amber-400">
                Rental Dispatch & Disposition
              </span>
              <h2 className="text-3xl font-black uppercase tracking-tight mt-2 mb-6">
                Booking Contact
              </h2>

              <p className="text-sm text-zinc-400 leading-relaxed mb-8">
                Für Dry-Hire-Anfragen, Verfügbarkeits-Checks, Dispositions-Absprachen und Materialabholungen wenden Sie sich bitte direkt an:
              </p>

              <div className="space-y-4 text-sm border-t border-zinc-800 pt-6">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500">Adresse</span>
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
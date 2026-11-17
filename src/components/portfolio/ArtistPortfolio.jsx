import { useEffect, useRef, useState } from 'react';
import GigsdaPass from "../GigsdaPass";
import { eventService } from '../../services/eventService';
import PortfolioActionBar from './shared/PortfolioActionBar';
import ArtistSheet from '../sheets/ArtistSheet';
import SheetRouter from '../sheets/SheetRouter';

import { DownloadPortfolioPdfButton } from '../portfolio/ArtistPortfolioPdf';

export default function ArtistPortfolio({
  profile,
  onBack = null,
  setView,
  printMode = false
}) {
  const [showStandardSheet, setShowStandardSheet] = useState(false);
  const hasStartedPrint = useRef(false);

  useEffect(() => {
    if (!printMode || !profile) return undefined;

    let cancelled = false;
    const printWhenReady = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled && !hasStartedPrint.current) {
            hasStartedPrint.current = true;
            window.print();
          }
        });
      });
    };

    printWhenReady();
    return () => {
      cancelled = true;
    };
  }, [printMode, profile]);

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

  const handlePrintInNewTab = () => {
    if (profile.id == null) return;

    const portfolioUrl = new URL(
      `/portfolio/${encodeURIComponent(profile.id)}`,
      window.location.origin
    );
    portfolioUrl.searchParams.set('print', '1');
    window.open(portfolioUrl.href, '_blank', 'noopener,noreferrer');
  };

  if (showStandardSheet) {
    return (
      <SheetRouter
        profile={profile}
        SheetComponent={ArtistSheet}
        roleLabel="Künstler"
        backLabel="Zurück zum Artist-Portfolio"
        onBack={() => setShowStandardSheet(false)}
        setView={setView}
      />
    );
  }

  // Dynamische Bilder aus dem Profil sammeln (mit Fallbacks)
  const heroImage = profile?.slide1_url || profile?.gallery_slot1_url;
  const galleryImages = [1, 2, 3, 4]
    .map(num => ({
      url: profile?.[`gallery_slot${num}_url`],
      title: profile?.[`gallery_slot${num}_title`] || `Live Impression 0${num}`
    }))
    .filter(item => Boolean(item.url));

  // Alben & Tracks aus dem Profil strukturieren
  const albums = [1, 2, 3, 4, 5]
    .map(albumNum => {
      const cover = profile?.[`album${albumNum}_cover`];
      const title = profile?.[`album${albumNum}_title`];
      const tracks = [1, 2, 3, 4]
        .map(trackNum => {
          const name = albumNum === 1
            ? profile?.[`audio${trackNum}_name`]
            : profile?.[`album${albumNum}_track${trackNum}_name`];
          const url = albumNum === 1
            ? profile?.[`audio${trackNum}_url`]
            : profile?.[`album${albumNum}_track${trackNum}_url`];
          return url ? { name: name || `Track 0${trackNum}`, url } : null;
        })
        .filter(Boolean);

      if (!cover && !title && tracks.length === 0) return null;
      return { albumNum, cover, title: title || `Release 0${albumNum}`, tracks };
    })
    .filter(Boolean);

  return (

		
    <div className="min-h-screen bg-zinc-950 text-zinc-900 font-sans selection:bg-amber-500 selection:text-black print:bg-white">

      {/* Print-Styles für sauberen Agentur-PDF-Export */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .editorial-spread { break-after: page; page-break-after: always; box-shadow: none !important; margin: 0 !important; }
        }
      `}</style>

      {/* FLOATING ACTION BAR (Nicht im Druck sichtbar) */}
      <div className="no-print sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 px-6 py-3">
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
              GIGSDA // Agency Presskit
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">

						<DownloadPortfolioPdfButton profile={profile} references={references} />

{/*
            <button
              type="button"
              onClick={handlePrintInNewTab}
              className="px-4 py-1.5 border border-zinc-700 text-zinc-300 text-xs font-semibold uppercase tracking-wider hover:border-white hover:text-white transition"
            >
              In neuem Tab öffnen &amp; drucken
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-1.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition"
            >
              Als PDF speichern / drucken
            </button>
 */}

        		<button
              type="button"
              onClick={() => setShowStandardSheet(true)}
              className="px-4 py-1.5 border border-zinc-700 text-zinc-300 text-xs font-semibold uppercase tracking-wider hover:border-white hover:text-white transition"
            >
              Artist Standard Sheet
            </button>
          </div>
        </div>
      </div>

      {/* MAIN MAGAZINE CONTAINER */}
      <main className="max-w-6xl mx-auto py-10 px-4 sm:px-6 space-y-12 print:p-0 print:space-y-0">

        {/* =========================================================
            SPREAD 01: EDITORIAL COVER (Vertikaler Rücken + Soundwave + Hero)
           ========================================================= */}
        <section className="editorial-spread grid grid-cols-1 lg:grid-cols-12 min-h-[720px] bg-black text-white shadow-2xl overflow-hidden border border-zinc-800">
          
          {/* Linker Magazin-Rücken (4 Spalten) */}
          <div className="lg:col-span-4 bg-[#0b0b0b] p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-zinc-800 relative">
            <div className="flex items-center justify-between text-[11px] tracking-[0.3em] text-zinc-400 uppercase">
              <span>GIGSDA ID // {profile?.id || 'ARTIST'}</span>
              <span>EPK</span>
            </div>

            {/* Vertikaler Typo-Block + Soundwave */}
            <div className="my-10 flex items-center gap-6">
              <div className="flex flex-col items-center">
                <span
                  className="text-5xl sm:text-6xl font-black tracking-tighter uppercase leading-none select-none text-white"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  MUSICAL
                </span>
                {/* Dekorative Soundwave-Balken */}
                <div className="flex items-center gap-[3px] h-14 mt-6" aria-hidden="true">
                  {[25, 60, 95, 40, 80, 100, 50, 30, 85, 65, 35, 90, 45, 20].map((h, idx) => (
                    <span
                      key={idx}
                      className="w-[2px] bg-amber-400/90"
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

                {/* Mini-Thumbnails aus der Galerie */}
                <div className="space-y-3 pt-4">
                  {galleryImages.slice(0, 2).map((img, i) => (
                    <div key={i} className="w-20 h-20 overflow-hidden border border-zinc-700 grayscale hover:grayscale-0 transition">
                      <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cover Footer Metadaten */}
            <div className="space-y-2 border-t border-zinc-800 pt-5 text-xs text-zinc-400">
              <p className="uppercase tracking-[0.2em] text-white font-semibold">
                {profile?.genre || 'Live Artist'}
              </p>
              <p className="text-zinc-500">
                {profile?.city ? `${profile.city} • ` : ''}{profile?.formation || 'Solo / Live Act'}
              </p>
            </div>
          </div>

          {/* Rechtes Hero-Visual mit Artist-Signatur (8 Spalten) */}
          <div className="lg:col-span-8 relative min-h-[480px] bg-zinc-900 flex flex-col justify-end">
            {heroImage ? (
              <img
                src={heroImage}
                alt={profile?.name}
                className="absolute inset-0 w-full h-full object-cover object-center contrast-110"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-600 uppercase tracking-widest text-sm">
                Kein Coverbild hinterlegt (slide1_url)
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

            <div className="relative z-10 p-8 sm:p-12">
              <p className="text-amber-400 text-xs uppercase tracking-[0.35em] font-semibold mb-2">
                {profile?.category || 'Musiker / Live Performance'}
              </p>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase leading-none">
                {profile?.name}
              </h1>
              {profile?.description && (
                <p className="mt-4 max-w-xl text-zinc-200 text-sm sm:text-base leading-relaxed font-light">
                  {profile.description}
                </p>
              )}

              <div className="mt-6 no-print">
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
            SPREAD 02: PROFILE & CONTENTS (Heller Magazin-Kontrast)
           ========================================================= */}
        <section className="editorial-spread grid grid-cols-1 lg:grid-cols-12 bg-white text-zinc-900 shadow-2xl overflow-hidden">
          
          {/* Linke Seite: Profile & Story */}
          <div className="lg:col-span-6 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-zinc-200 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between border-b-2 border-black pb-3 mb-8">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">Profile</h2>
                <span className="text-xs font-mono text-zinc-500">01 // BIOGRAPHY</span>
              </div>

              {/* Porträt + Eckdaten */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 mb-8 items-start">
                <div className="sm:col-span-5 aspect-[3/4] bg-zinc-100 overflow-hidden">
                  <img
                    src={galleryImages[0]?.url || heroImage}
                    alt={profile?.name}
                    className="w-full h-full object-cover grayscale contrast-125"
                  />
                </div>
                <div className="sm:col-span-7 space-y-3 text-sm">
                  <div className="border-b border-zinc-200 pb-2">
                    <span className="block text-[10px] uppercase tracking-widest text-zinc-400">Act / Artist</span>
                    <span className="font-bold text-base">{profile?.name}</span>
                  </div>
                  <div className="border-b border-zinc-200 pb-2">
                    <span className="block text-[10px] uppercase tracking-widest text-zinc-400">Genre & Stil</span>
                    <span className="font-medium">{profile?.genre || '-'}</span>
                  </div>
                  <div className="border-b border-zinc-200 pb-2">
                    <span className="block text-[10px] uppercase tracking-widest text-zinc-400">Base / Standort</span>
                    <span className="font-medium">{profile?.city || '-'}</span>
                  </div>
                  <div className="border-b border-zinc-200 pb-2">
                    <span className="block text-[10px] uppercase tracking-widest text-zinc-400">Formation & Setup</span>
                    <span className="font-medium">
                      {profile?.formation || '-'} {profile?.mainInstrument ? `(${profile.mainInstrument})` : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Redaktionelle Bio-Spalten */}
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
                  <p className="text-zinc-600 italic border-l-2 border-black pl-4">
                    {profile.bio_privates}
                  </p>
                )}
                {!profile?.bio_einleitung && !profile?.bio_karriere && profile?.description && (
                  <p>{profile.description}</p>
                )}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-400 font-mono">
              <span>{profile?.name}</span>
              <span>PAGE 02</span>
            </div>
          </div>

          {/* Rechte Seite: Großes Visual + Magazin-Contents */}
          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between bg-zinc-50">
            <div className="aspect-[16/10] w-full bg-zinc-900 overflow-hidden mb-8">
              <img
                src={galleryImages[1]?.url || heroImage}
                alt="Stage Visual"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight border-b-2 border-black pb-2 mb-6">
                Contents
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                {galleryImages[2]?.url && (
                  <div className="sm:col-span-4 aspect-square overflow-hidden bg-zinc-200">
                    <img
                      src={galleryImages[2].url}
                      alt="Detail"
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                )}

                <ul className={`${galleryImages[2]?.url ? 'sm:col-span-8' : 'sm:col-span-12'} space-y-3 text-sm`}>
                  <li className="flex justify-between border-b border-zinc-300 pb-1.5">
                    <span className="font-bold uppercase tracking-wider">01. Artist Profile & Story</span>
                    <span className="font-mono text-zinc-500">P. 02</span>
                  </li>
                  <li className="flex justify-between border-b border-zinc-300 pb-1.5">
                    <span className="font-bold uppercase tracking-wider">02. Discography & Audio</span>
                    <span className="font-mono text-zinc-500">P. 03</span>
                  </li>
                  <li className="flex justify-between border-b border-zinc-300 pb-1.5">
                    <span className="font-bold uppercase tracking-wider">03. Live Performances & Gallery</span>
                    <span className="font-mono text-zinc-500">P. 04</span>
                  </li>
                  <li className="flex justify-between border-b border-zinc-300 pb-1.5">
                    <span className="font-bold uppercase tracking-wider">04. Tech Specs & Booking</span>
                    <span className="font-mono text-zinc-500">P. 05</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-400 font-mono">
              <span>AGENCY PORTFOLIO</span>
              <span>PAGE 03</span>
            </div>
          </div>
        </section>

        {/* =========================================================
            SPREAD 03: DISCOGRAPHY & LIVE PERFORMANCES (Dark Contrast)
           ========================================================= */}
        <section className="editorial-spread grid grid-cols-1 lg:grid-cols-12 bg-[#0d0d0d] text-white shadow-2xl overflow-hidden border border-zinc-800">
          
          {/* Linke Seite: Discography & Audio Showcase */}
          <div className="lg:col-span-6 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between border-b border-zinc-700 pb-3 mb-8">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">Discography</h2>
                <span className="text-xs font-mono text-amber-400">02 // SOUND</span>
              </div>

              {albums.length > 0 ? (
                <div className="space-y-8">
                  {albums.map(album => (
                    <div key={album.albumNum} className="space-y-4 border-b border-zinc-800 pb-6 last:border-none">
                      <div className="flex gap-4 items-center">
                        {album.cover && (
                          <img
                            src={album.cover}
                            alt={album.title}
                            className="w-20 h-20 object-cover border border-zinc-700 shrink-0"
                          />
                        )}
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                            Release 0{album.albumNum}
                          </span>
                          <h3 className="text-xl font-bold">{album.title}</h3>
                        </div>
                      </div>

                      {album.tracks.length > 0 && (
                        <div className="space-y-3">
                          {album.tracks.map((track, idx) => (
                            <div key={idx} className="bg-zinc-900/90 p-3 border border-zinc-800">
                              <div className="flex justify-between text-xs mb-2">
                                <span className="font-semibold text-zinc-200">
                                  0{idx + 1} // {track.name}
                                </span>
                                <span className="text-zinc-500 font-mono">AUDIO</span>
                              </div>
                              <audio controls className="w-full h-8 no-print">
                                <source src={track.url} type="audio/mpeg" />
                              </audio>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-sm">
                  <p className="font-semibold text-white mb-1">Live- & Studio-Repertoire</p>
                  <p>
                    Spieldauer bis zu {profile?.duration_max || 90} Minuten ({profile?.genre || 'Rock / Metal'}).
                    Hörproben und Live-Mitschnitte auf Anfrage oder direkt über das GIGSDA-Profil abrufbar.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-500 font-mono">
              <span>AUDIO & RELEASES</span>
              <span>PAGE 04</span>
            </div>
          </div>

          {/* Rechte Seite: Performances, Referenzen & Visual Grid */}
          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between bg-black">
            <div>
              <div className="flex items-baseline justify-between border-b border-zinc-700 pb-3 mb-8">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">Performances</h2>
                <span className="text-xs font-mono text-amber-400">03 // LIVE</span>
              </div>

              {/* 2x2 Visual Grid */}
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

              {/* Referenzen / Events aus GIGSDA */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400 mb-4">
                  Selected Shows & GIGSDA References
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
                    Verfügbar für Club-Shows, Festivals, Support-Slots und exklusive Event-Produktionen.
                    Alle bestätigten GIGSDA-Engagements werden hier automatisch gelistet.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-500 font-mono">
              <span>LIVE & CREDITS</span>
              <span>PAGE 05</span>
            </div>
          </div>
        </section>

        {/* =========================================================
            SPREAD 04: TECH SPECS & BOOKING (Heller Editorial-Abschluss)
           ========================================================= */}
        <section className="editorial-spread grid grid-cols-1 lg:grid-cols-12 bg-white text-zinc-900 shadow-2xl overflow-hidden">
          
          {/* Linke Seite: Stage & Tech Specs */}
          <div className="lg:col-span-7 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-zinc-200 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between border-b-2 border-black pb-3 mb-8">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">Stage & Tech</h2>
                <span className="text-xs font-mono text-zinc-500">04 // RIDER</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-400">Hauptinstrument</span>
                  <span className="font-bold text-sm">{profile?.mainInstrument || '-'}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-400">Nebeninstrumente</span>
                  <span className="font-bold text-sm">{profile?.subInstruments || '-'}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-400">Formation</span>
                  <span className="font-bold text-sm">{profile?.formation || '-'}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-400">Max. Spieldauer</span>
                  <span className="font-bold text-sm">{profile?.duration_max ? `${profile.duration_max} Min.` : '-'}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-400">Changeover / Check</span>
                  <span className="font-bold text-sm">{profile?.setup_time ? `${profile.setup_time} Min.` : '-'}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-400">Monitoring</span>
                  <span className="font-bold text-sm">{profile?.rider_monitors || '-'}</span>
                </div>
              </div>

              {profile?.rider_backline && (
                <div className="bg-zinc-100 p-4 mb-6 border-l-4 border-black">
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
                    Backline & Strombedarf
                  </span>
                  <p className="text-sm font-medium text-zinc-900">{profile.rider_backline}</p>
                </div>
              )}

              {/* Downloads / Dokumente */}
              <div className="flex flex-wrap gap-3 pt-2 no-print">
                {profile?.rider_pdf_url && (
                  <a
                    href={profile.rider_pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition"
                  >
                    Technical Rider (PDF) ↗
                  </a>
                )}
                {profile?.stageplot_url && (
                  <a
                    href={profile.stageplot_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-black text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 transition"
                  >
                    Stageplot ansehen ↗
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setShowStandardSheet(true)}
                  className="px-4 py-2 border border-zinc-300 text-zinc-700 text-xs font-bold uppercase tracking-wider hover:border-black hover:text-black transition"
                >
                  Komplettes Patch-Sheet öffnen
                </button>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-400 font-mono">
              <span>PRODUCTION & SOUND</span>
              <span>PAGE 06</span>
            </div>
          </div>

          {/* Rechte Seite: Agency & Booking Contact */}
          <div className="lg:col-span-5 p-8 sm:p-12 bg-zinc-950 text-white flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-amber-400">
                Direct Booking & Management
              </span>
              <h2 className="text-3xl font-black uppercase tracking-tight mt-2 mb-6">
                Booking Contact
              </h2>

              <p className="text-sm text-zinc-400 leading-relaxed mb-8">
                Für Booking-Anfragen, Festival-Slots, Agentur-Kooperationen und Presseinformationen wenden Sie sich bitte direkt an das Management:
              </p>

              <div className="space-y-4 text-sm border-t border-zinc-800 pt-6">
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
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500">Web / GIGSDA</span>
                  <span className="text-base font-semibold text-zinc-200 break-all">
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

        {/* GIGSDAPASS - NUR FÜR OWNER (Nicht im Druck) */}
        {isOwner && (
          <div className="no-print pt-4">
            <GigsdaPass profile={profile} />
          </div>
        )}

      </main>
    </div>
  );
}
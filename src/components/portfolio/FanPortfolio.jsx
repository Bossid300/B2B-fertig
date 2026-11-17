import React, { useState } from 'react';
import GigsdaPass from "../GigsdaPass";
import { eventService } from '../../services/eventService';
import PortfolioActionBar from './shared/PortfolioActionBar';
import FanSheet from '../sheets/FanSheet';
import SheetRouter from '../sheets/SheetRouter';
import { DownloadFanPdfButton } from './FanPortfolioPdf';

export default function FanPortfolio({
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
        SheetComponent={FanSheet}
        roleLabel="Fan"
        backLabel="Zurück zum Supporter-Portfolio"
        onBack={() => setShowStandardSheet(false)}
        setView={setView}
      />
    );
  }

  const fanName = profile?.Klarname || profile?.name || 'Fanny Helps';
  const heroImage = profile?.avatarUrl || profile?.slide1_url;
  
  const galleryImages = [1, 2, 3, 4]
    .map(num => ({
      url: profile?.[`slide${num}_url`],
      title: `Supporter Moment 0${num}`
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
              GIGSDA // Supporter Pass
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <DownloadFanPdfButton profile={profile} references={references} />
            <button
              type="button"
              onClick={() => setShowStandardSheet(true)}
              className="px-4 py-1.5 border border-zinc-700 text-zinc-300 text-xs font-semibold uppercase tracking-wider hover:border-white hover:text-white transition"
            >
              Fan Standard Sheet
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
          
          <div className="lg:col-span-4 bg-[#0b0b0b] p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-zinc-800">
            <div className="flex items-center justify-between text-[11px] tracking-[0.3em] text-zinc-400 uppercase">
              <span>GIGSDA ID // {profile?.id || 'FAN'}</span>
              <span>PASS</span>
            </div>

            <div className="my-10 flex items-center gap-6">
              <div className="flex flex-col items-center">
                <span
                  className="text-4xl sm:text-5xl font-black tracking-tighter uppercase leading-none select-none text-white"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  FIRST ROW
                </span>
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
                  SUPPORTER
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
                {profile?.fan_supporter_level_kpi || 'First Row'} // Street-Team
              </p>
              <p className="text-zinc-500">
                {profile?.city ? `${profile.city} • ` : ''}
                {profile?.fan_events_attended_kpi || '28'} Besuchte Events
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 relative min-h-[480px] bg-zinc-900 flex flex-col justify-end">
            {heroImage ? (
              <img
                src={heroImage}
                alt={fanName}
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
                {profile?.category || 'Verifizierter GIGSDA Community Supporter'}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-none">
                {fanName}
              </h1>
              {profile?.description && (
                <p className="mt-4 max-w-xl text-zinc-200 text-sm sm:text-base leading-relaxed font-light">
                  {profile.description}
                </p>
              )}

              <div className="mt-5 pt-4 border-t border-zinc-700/80 flex flex-wrap gap-6 text-xs font-mono uppercase tracking-wider text-amber-400">
                <span>Events: {profile?.fan_events_attended_kpi || '28'}</span>
                <span>Netzwerk: {profile?.fan_referred_members_kpi || '12'} Mitglieder</span>
                <span>Level: {profile?.fan_supporter_level_kpi || 'First Row'}</span>
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
            SPREAD 02: PROFILE & MUSIK-DNA
           ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 bg-white text-zinc-900 shadow-2xl overflow-hidden">
          
          <div className="lg:col-span-6 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-zinc-200 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between border-b-2 border-black pb-3 mb-8">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">Profile</h2>
                <span className="text-xs font-mono text-zinc-500">01 // SUPPORTER</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 mb-8 items-start">
                <div className="sm:col-span-5 aspect-[3/4] bg-zinc-100 overflow-hidden">
                  <img
                    src={galleryImages[0]?.url || heroImage}
                    alt={fanName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="sm:col-span-7 space-y-3 text-sm">
                  <div className="border-b border-zinc-200 pb-2">
                    <span className="block text-[10px] uppercase tracking-widest text-zinc-400">Name</span>
                    <span className="font-bold text-base">{fanName}</span>
                  </div>
                  <div className="border-b border-zinc-200 pb-2">
                    <span className="block text-[10px] uppercase tracking-widest text-zinc-400">Level & Badges</span>
                    <span className="font-medium">{profile?.fan_supporter_level_badges || 'First-Row Supporter'}</span>
                  </div>
                  <div className="border-b border-zinc-200 pb-2">
                    <span className="block text-[10px] uppercase tracking-widest text-zinc-400">Heimatregion</span>
                    <span className="font-medium">{profile?.fan_home_region_radius || profile?.city || '-'}</span>
                  </div>
                  <div className="border-b border-zinc-200 pb-2">
                    <span className="block text-[10px] uppercase tracking-widest text-zinc-400">Mobilität & Carpooling</span>
                    <span className="font-medium">{profile?.fan_mobility_carpooling || 'PKW vorhanden'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-zinc-700 leading-relaxed">
                {profile?.fan_main_genres && (
                  <p><strong>Haupt-Genres:</strong> {profile.fan_main_genres}</p>
                )}
                {profile?.fan_preferred_event_formats && (
                  <p><strong>Event-Formate:</strong> {profile.fan_preferred_event_formats}</p>
                )}
                {profile?.fan_favorite_network_acts && (
                  <p><strong>Favorisierte Netzwerk-Acts:</strong> {profile.fan_favorite_network_acts}</p>
                )}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-400 font-mono">
              <span>{fanName}</span>
              <span>PAGE 02</span>
            </div>
          </div>

          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between bg-zinc-50">
            <div className="aspect-[16/10] w-full bg-zinc-900 overflow-hidden mb-8">
              <img
                src={galleryImages[1]?.url || heroImage}
                alt="Supporter Visual"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight border-b-2 border-black pb-2 mb-6">
                Contents
              </h3>

              <ul className="space-y-3 text-sm">
                <li className="flex justify-between border-b border-zinc-300 pb-1.5">
                  <span className="font-bold uppercase tracking-wider">01. Supporter-Profil & Musik-DNA</span>
                  <span className="font-mono text-zinc-500">P. 02</span>
                </li>
                <li className="flex justify-between border-b border-zinc-300 pb-1.5">
                  <span className="font-bold uppercase tracking-wider">02. Street-Team & Supporter-Angebot</span>
                  <span className="font-mono text-zinc-500">P. 03</span>
                </li>
                <li className="flex justify-between border-b border-zinc-300 pb-1.5">
                  <span className="font-bold uppercase tracking-wider">03. Live-Impressionen & Stamm-Locations</span>
                  <span className="font-mono text-zinc-500">P. 03</span>
                </li>
                <li className="flex justify-between border-b border-zinc-300 pb-1.5">
                  <span className="font-bold uppercase tracking-wider">04. VIP-Programme, Gästeliste & Kontakt</span>
                  <span className="font-mono text-zinc-500">P. 04</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-400 font-mono">
              <span>FAN & SUPPORTER PORTFOLIO</span>
              <span>PAGE 02</span>
            </div>
          </div>
        </section>

        {/* =========================================================
            SPREAD 03: STREET-TEAM & LIVE GALLERY
           ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 bg-[#0d0d0d] text-white shadow-2xl overflow-hidden border border-zinc-800">
          
          <div className="lg:col-span-6 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between border-b border-zinc-700 pb-3 mb-8">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">Street-Team</h2>
                <span className="text-xs font-mono text-amber-400">02 // SUPPORT</span>
              </div>

              <div className="space-y-4">
                {profile?.fan_local_promotion_word_of_mouth && (
                  <div className="bg-zinc-900 p-4 border border-zinc-800">
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-1">Lokale Promotion & Mundpropaganda</span>
                    <p className="font-medium text-sm text-white">{profile.fan_local_promotion_word_of_mouth}</p>
                  </div>
                )}
                {profile?.fan_pre_release_demo_feedback && (
                  <div className="bg-zinc-900 p-4 border border-zinc-800">
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-1">Pre-Release & Demo-Feedback</span>
                    <p className="font-medium text-sm text-white">{profile.fan_pre_release_demo_feedback}</p>
                  </div>
                )}
                {profile?.fan_volunteer_event_crew_support && (
                  <div className="bg-zinc-900 p-4 border border-zinc-800">
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-1">Freiwillige Event-Hilfe (Crew-Support)</span>
                    <p className="font-medium text-sm text-white">{profile.fan_volunteer_event_crew_support}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-500 font-mono">
              <span>STREET-TEAM & PROMOTION</span>
              <span>PAGE 03</span>
            </div>
          </div>

          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between bg-black">
            <div>
              <div className="flex items-baseline justify-between border-b border-zinc-700 pb-3 mb-8">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">Live Gallery</h2>
                <span className="text-xs font-mono text-amber-400">03 // COMMUNITY</span>
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
                    </div>
                  ))}
                </div>
              )}

              <div>
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400 mb-2 block">
                  Stamm-Locations & Netzwerk
                </span>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {profile?.fan_regular_venues || 'Tanz Arena Kirchdorf, lokale Kulturhäuser & Festivalgelände in OÖ/Bayern'}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-500 font-mono">
              <span>GALLERY & VENUES</span>
              <span>PAGE 03</span>
            </div>
          </div>
        </section>

        {/* =========================================================
            SPREAD 04: COMMUNITY & INVITATIONS
           ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 bg-white text-zinc-900 shadow-2xl overflow-hidden">
          
          <div className="lg:col-span-7 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-zinc-200 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between border-b-2 border-black pb-3 mb-8">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight uppercase">Invitations</h2>
                <span className="text-xs font-mono text-zinc-500">04 // COMMUNITY</span>
              </div>

              <p className="text-sm text-zinc-600 leading-relaxed mb-8">
                Kooperationsmöglichkeiten für Bands, Veranstalter und Locations im GIGSDA-Netzwerk:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-zinc-100 p-5 border-l-4 border-black">
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500">Gästeliste & Showcases</span>
                  <span className="font-semibold text-sm mt-1 block">
                    {profile?.fan_networking_guest_list_invitations || 'Offen für Club-Gigs, Showcases & Release-Partys'}
                  </span>
                </div>
                <div className="bg-zinc-100 p-5 border-l-4 border-black">
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500">VIP-Pässe & Meet & Greet</span>
                  <span className="font-semibold text-sm mt-1 block">
                    {profile?.fan_vip_passes_support_programs || 'Early-Bird-Pässe, Demo-Feedback & Merch-Support'}
                  </span>
                </div>
              </div>

              <div className="bg-zinc-100 p-5 border-l-4 border-black mb-6">
                <span className="block text-[10px] uppercase tracking-widest text-zinc-500">Community-Aktivitäten & Socials</span>
                <span className="font-medium text-sm mt-1 block">
                  {profile?.fan_community_activities || 'Social-Media-Sharing, Flyer-Support, Konzert-Carpooling & Merch-Stand-Hilfe.'}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStandardSheet(true)}
                  className="px-4 py-2 border border-black text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 transition"
                >
                  Fan Standard Sheet öffnen
                </button>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-400 font-mono">
              <span>COMMUNITY & INVITATIONS</span>
              <span>PAGE 04</span>
            </div>
          </div>

          <div className="lg:col-span-5 p-8 sm:p-12 bg-zinc-950 text-white flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-amber-400">
                Direct Supporter Network
              </span>
              <h2 className="text-3xl font-black uppercase tracking-tight mt-2 mb-6">
                Direct Contact
              </h2>

              <p className="text-sm text-zinc-400 leading-relaxed mb-8">
                Für Gästelisten-Einladungen, Pre-Release-Hörproben, Street-Team-Einsätze oder Carpooling-Absprachen:
              </p>

              <div className="space-y-4 text-sm border-t border-zinc-800 pt-6">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500">Supporter & Region</span>
                  <p className="text-sm font-semibold text-zinc-200">
                    {fanName}<br />
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
                  <span className="block text-[10px] uppercase tracking-widest text-zinc-500">Social Kanäle</span>
                  <span className="text-sm font-semibold text-amber-400 block">
                    {profile?.fan_social_channels || 'Instagram, Spotify, YouTube'}
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

        {isOwner && (
          <div className="pt-4">
            <GigsdaPass profile={profile} />
          </div>
        )}

      </main>
    </div>
  );
}
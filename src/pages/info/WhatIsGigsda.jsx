import React from 'react';
import Footer from "../../Footer";

import { Award, Layers, CheckCircle2, Eye, ShieldAlert, ArrowRight } from 'lucide-react';
import { Search, MapPin, Star, Briefcase, Calendar, ChevronRight, X, Sparkles, Filter, ShieldCheck, Heart, User, Clock } from 'lucide-react';

export default function WhatIsGigsda({ setView }) {
  
  return (
    <div className="relative min-h-screen bg-[#05050a] text-slate-200 font-sans overflow-x-hidden">
      {/* Hintergrundbild */}
      <div
        className="fixed inset-0 bg-cover bg-top bg-no-repeat opacity-[0.62] blur-[1.5px] brightness-[0.85] contrast-[1.05] z-0 pointer-events-none"
        style={{ backgroundImage: "url('/s.jpg')" }}
      />

      {/* Overlay */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 100% 80% at 20% 20%, rgba(236, 72, 153, 0.12), transparent 50%),
            radial-gradient(ellipse 80% 70% at 80% 30%, rgba(6, 182, 212, 0.12), transparent 45%),
            linear-gradient(to bottom, rgba(5,5,10,0.35), rgba(5,5,10,0.65))
          `,
        }}
      />

      {/* Noise Overlay */}
      <div
        className="fixed inset-0 z-[2] pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />


      {/* Content */}
      <div className="relative z-10">

        <main className="pt-10 pb-24 px-4">
          <div className="max-w-5xl mx-auto space-y-16">

            {/* BANNER HEADER */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-900 p-8 mb-8 shadow-2xl">
              <div className="absolute top-0 right-0 p-6 text-slate-800 opacity-20 pointer-events-none">
                <Sparkles size={160} />
              </div>
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                  <ShieldCheck size={12} /> Gigsda Engine V3.0 Activated
                </div>
                <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-2 bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
                  Gigsda Ökosystem
                </h1>
                <p className="text-xs text-slate-400 leading-relaxed max-w-lg uppercase tracking-wide">
                  Durchsuche das verifizierte Gigsda-Netzwerk nach Technikern, Künstlern und Allianzen für deine anstehenden Produktionen.
                </p>
              </div>
            </div>   

            {/* DIE MISSION */}
            <section className="relative">
              <div className="absolute -inset-16 bg-gradient-to-r from-pink-600/15 via-cyan-500/10 to-purple-600/15 rounded-[4rem] blur-3xl" />
              {/* NEU: Das Bild als visueller Header der Sektion */}
              <div className="mb-10 relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-cyan-400/25 bg-slate-900 shadow-2xl">
                <img
                  src="/2026/profiles/gigsda_banner.jpg" 
                  alt="GIGSDA Event Revolution Vision"
                  className="absolute inset-0 h-full w-full object-cover object-center opacity-90 transition-opacity duration-500 hover:opacity-100"
                />
                {/* Optionaler Overlay-Gradient für bessere Lesbarkeit falls Text drüber stünde */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                
                {/* Optional: Ein kleiner Text-Badge im Bild */}
                <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-cyan-400/20 text-cyan-300 text-xs font-[Space_Grotesk]">
                    Live-Innovation in Echtzeit
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
                <div className="absolute top-6 right-6 animate-[float_4.5s_ease-in-out_infinite]">
                  <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/25 to-purple-500/25 border border-pink-400/50 text-xs font-semibold text-pink-200 tracking-wide shadow-[0_0_20px_rgba(236,72,153,0.4)]">
                    LIVE & RECHTSSICHER
                  </div>
                </div>

                <h2 className="font-[Orbitron] text-xs tracking-[0.25em] text-cyan-400/80 uppercase mb-10">
                  // DIE MISSION
                </h2>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <p className="text-mx md:text-mx text-slate-100 leading-relaxed mb-6">
                      Die Mission von GIGSDA brennt vor Tatendrang und zielt darauf ab, 
                      die Event-Welt komplett auf den Kopf zu stellen! 🚀🔥
                    </p>
                    <p className="text-sm text-slate-500 mb-8">
                      Bereit die Event-organisation zu revolutionieren?
                    </p>
                    <button className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 bg-[length:300%_100%] text-white font-semibold tracking-wide text-sm shadow-[0_0_25px_rgba(236,72,153,0.7)] hover:shadow-[0_0_40px_rgba(236,72,153,1)] hover:scale-105 transition-all duration-300 animate-[gradientMove_3.5s_linear_infinite]">
                      Starte jetzt!
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute -inset-[2px] bg-gradient-to-br from-cyan-400 via-pink-500 to-purple-500 rounded-2xl blur-[2px] opacity-75 animate-[borderGlow_5s_linear_infinite] bg-[length:300%_300%]" />
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                      <img
                        src="/2026/profiles/die_mission.jpg"
                        alt="Live Stage"
                        className="w-full h-72 md:h-80 object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* GIGSDA MISSIONS-PRINZIP */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-[Orbitron] text-xs tracking-[0.25em] text-cyan-400/80 uppercase">
                  // GIGSDA MISSIONS-PRINZIP
                </h2>
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-2xl p-7 shadow-2xl hover:border-cyan-400/55 hover:-translate-y-1.5 transition-all duration-400 group">
                  <div className="absolute left-0 top-[15%] bottom-[15%] w-[3px] bg-gradient-to-b from-cyan-400 to-pink-500 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mb-6 text-2xl shadow-[0_0_25px_rgba(34,211,238,0.35)]">
                    ⚡
                  </div>
                  <h3 className="font-[Space_Grotesk] text-mx font-bold text-cyan-300 mb-3 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]">
                    Schluss mit dem Organisations-Chaos:
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Die Mission ist es, jegliche Reibungsverluste und nervige Zettelwirtschaft in 
                    der Musik- und Eventbranche radikal auszurotten und durch glasklare, 
                    digitale Effizienz zu ersetzen! ⚡
                  </p>
                </div>

                {/* Card 2 */}
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-2xl p-7 shadow-2xl hover:border-cyan-400/55 hover:-translate-y-1.5 transition-all duration-400 group">
                  <div className="absolute left-0 top-[15%] bottom-[15%] w-[3px] bg-gradient-to-b from-cyan-400 to-pink-500 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mb-6 text-2xl shadow-[0_0_25px_rgba(34,211,238,0.35)]">
                    📡
                  </div>
                  <h3 className="font-[Space_Grotesk] text-mx font-bold text-cyan-300 mb-3 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]">
                    Bühne frei für jeden:
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    GIGSDA will Barrieren einreißen und jedem – vom leidenschaftlichen 
                    Newcomer-Act bis zum lokalen Technik-Profi – sofortigen, unkomplizierten Zugang 
                    zum großen Markt verschaffen! Alle sollen die Chance bekommen, durchzustarten.
                  </p>
                </div>

                {/* Card 3 */}
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-2xl p-7 shadow-2xl hover:border-cyan-400/55 hover:-translate-y-1.5 transition-all duration-400 group">
                  <div className="absolute left-0 top-[15%] bottom-[15%] w-[3px] bg-gradient-to-b from-cyan-400 to-pink-500 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center mb-6 text-2xl shadow-[0_0_25px_rgba(236,72,153,0.35)]">
                    🔏
                  </div>
                  <h3 className="font-[Space_Grotesk] text-mx font-bold text-cyan-300 mb-3 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]">
                    Volle Power für das Wesentliche:
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Die Plattform hat die Mission, den gesamten administrativen Papierkrieg so 
                    drastisch zu automatisieren und zu bündeln, dass Veranstaltern und Künstlern 
                    nur eins bleibt: Ihre ganze Energie in unvergessliche Live-Momente und 
                    pure musikalische Magie zu stecken! 🎤🎸
                  </p>
                </div>
              </div>
            </section>

            {/* DIE VISION */}
            <section className="relative">
              <div className="absolute -inset-16 bg-gradient-to-r from-pink-600/15 via-cyan-500/10 to-purple-600/15 rounded-[4rem] blur-3xl" />

              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
                <div className="absolute top-6 right-6 animate-[float_4.5s_ease-in-out_infinite]">
                  <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/25 to-purple-500/25 border border-pink-400/50 text-xs font-semibold text-pink-200 tracking-wide shadow-[0_0_20px_rgba(236,72,153,0.4)]">
                    LIVE & RECHTSSICHER
                  </div>
                </div>

                <h2 className="font-[Orbitron] text-xs tracking-[0.25em] text-cyan-400/80 uppercase mb-10">
                  // DIE VISION
                </h2>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <p className="text-mx md:text-mx text-slate-100 leading-relaxed mb-6">
                      GIGSDA brennt darauf, die gesamte Live-Musik- und Eventbranche komplett zu 
                      revolutionieren und auf ein völlig neues Level zu heben! Hier trifft pure Leidenschaft auf radikale Innovation:
                    </p>
                    <p className="text-sm text-slate-500 mb-8">
                      Bereit die Event-organisation zu revolutionieren?
                    </p>
                    <button className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 bg-[length:300%_100%] text-white font-semibold tracking-wide text-sm shadow-[0_0_25px_rgba(236,72,153,0.7)] hover:shadow-[0_0_40px_rgba(236,72,153,1)] hover:scale-105 transition-all duration-300 animate-[gradientMove_3.5s_linear_infinite]">
                      Gigsda Ökosystem!
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute -inset-[2px] bg-gradient-to-br from-cyan-400 via-pink-500 to-purple-500 rounded-2xl blur-[2px] opacity-75 animate-[borderGlow_5s_linear_infinite] bg-[length:300%_300%]" />
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                      <img
                        src="/2026/profiles/die_vision.jpg"
                        alt="Live Stage"
                        className="w-full h-72 md:h-80 object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* GIGSDA VISIONS-PRINZIP */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-[Orbitron] text-xs tracking-[0.25em] text-cyan-400/80 uppercase">
                  // GIGSDA VISIONS-PRINZIP
                </h2>
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-2xl p-7 shadow-2xl hover:border-cyan-400/55 hover:-translate-y-1.5 transition-all duration-400 group">
                  <div className="absolute left-0 top-[15%] bottom-[15%] w-[3px] bg-gradient-to-b from-cyan-400 to-pink-500 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mb-6 text-2xl shadow-[0_0_25px_rgba(34,211,238,0.35)]">
                    ⚡
                  </div>
                  <h3 className="font-[Space_Grotesk] text-mx font-bold text-cyan-300 mb-3 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]">
                    Die ultimative All-in-One-Bühne:
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    GIGSDA sprengt alle Grenzen und vereint absolut alle kreativen und technischen Köpfe der Musikwelt – von unbändigen Künstlern 
                    über visionäre Veranstalter und atemberaubende Locations bis hin zu den unverzichtbaren Profis für 
                    Technik, Catering, Security und Logistik – in einem einzigen, pulsierenden Ökosystem! 🎸✨
                  </p>
                </div>

                {/* Card 2 */}
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-2xl p-7 shadow-2xl hover:border-cyan-400/55 hover:-translate-y-1.5 transition-all duration-400 group">
                  <div className="absolute left-0 top-[15%] bottom-[15%] w-[3px] bg-gradient-to-b from-cyan-400 to-pink-500 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mb-6 text-2xl shadow-[0_0_25px_rgba(34,211,238,0.35)]">
                    📡
                  </div>
                  <h3 className="font-[Space_Grotesk] text-mx font-bold text-cyan-300 mb-3 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]">
                    Schluss mit dem Branchen-Chaos:
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Die Plattform bündelt Booking, Planung und Organisation mit einer unfassbaren 
                    Leichtigkeit und Effizienz, damit sich jeder voll und ganz auf das konzentrieren 
                    kann, was wirklich zählt: Die pure Magie der Live-Performance! ⚡
                  </p>
                </div>

                {/* Card 3 */}
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-2xl p-7 shadow-2xl hover:border-cyan-400/55 hover:-translate-y-1.5 transition-all duration-400 group">
                  <div className="absolute left-0 top-[15%] bottom-[15%] w-[3px] bg-gradient-to-b from-cyan-400 to-pink-500 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center mb-6 text-2xl shadow-[0_0_25px_rgba(236,72,153,0.35)]">
                    🔏
                  </div>
                  <h3 className="font-[Space_Grotesk] text-mx font-bold text-cyan-300 mb-3 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]">
                    Direkt, transparent und unaufhaltsam:
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Hier wird nicht lange gefackelt – Künstler bekommen die Sichtbarkeit, 
                    die sie verdienen, und Veranstalter finden genau die Partner, 
                    die ihre Events legendär machen. Es geht darum, Barrieren einzureißen und 
                    die Live-Kultur so lebendig, direkt und greifbar wie nie zuvor zu machen! 🎤🚀
                  </p>
                </div>
              </div>
            </section>

            {/* Für wen ist gigsda? */}
            <section className="relative">
              <div className="absolute -inset-16 bg-gradient-to-r from-pink-600/15 via-cyan-500/10 to-purple-600/15 rounded-[4rem] blur-3xl" />

              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
                <div className="absolute top-6 right-6 animate-[float_4.5s_ease-in-out_infinite]">
                  <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/25 to-purple-500/25 border border-pink-400/50 text-xs font-semibold text-pink-200 tracking-wide shadow-[0_0_20px_rgba(236,72,153,0.4)]">
                    LIVE & RECHTSSICHER
                  </div>
                </div>

                <h2 className="font-[Orbitron] text-xs tracking-[0.25em] text-cyan-400/80 uppercase mb-10">
                  // Für wen ist GIGSDA?
                </h2>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <p className="text-mx md:text-mx text-slate-100 leading-relaxed mb-6">
                      GIGSDA ist für alle, die live etwas bewegen wollen.

                      Für Menschen, die nicht warten möchten, bis Chancen 
                      zu ihnen kommen, sondern selbst Bühnen erschaffen, 
                      Projekte starten und Ideen verwirklichen.
                    </p>
                    <p className="text-sm text-slate-500 mb-8">
                      Bereit die Event-organisation zu revolutionieren?
                    </p>
                    <button className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 bg-[length:300%_100%] text-white font-semibold tracking-wide text-sm shadow-[0_0_25px_rgba(236,72,153,0.7)] hover:shadow-[0_0_40px_rgba(236,72,153,1)] hover:scale-105 transition-all duration-300 animate-[gradientMove_3.5s_linear_infinite]">
                      Bereit gefunden zu werden?
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute -inset-[2px] bg-gradient-to-br from-cyan-400 via-pink-500 to-purple-500 rounded-2xl blur-[2px] opacity-75 animate-[borderGlow_5s_linear_infinite] bg-[length:300%_300%]" />
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                      <img
                        src="/2026/profiles/fuer_wen_ist_gigsda.jpg"
                        alt="Live Stage"
                        className="w-full h-72 md:h-80 object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* 6 Rollen im System */}
            <div className="grid md:grid-cols-2 gap-7">
              <div className="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  <h3 className="font-[Orbitron] text-xs tracking-[0.2em] text-yellow-500 uppercase">
                    🎤 Künstler & Bands
                  </h3>
                </div>
                <p className="text-slate-400 leading-relaxed mb-6">
                  Für Musiker, Singer-Songwriter, DJs, Produzenten 
                  und Bands, die gesehen werden möchten, neue Kontakte suchen und ihre nächsten Auftritte planen.
                </p>
                <p className="text-sm text-slate-500 mb-3">Du kannst:</p>
                <div className="space-y-2 text-sm text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-500">→</span> Profile ansehen
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-500">→</span> Events suchen, finden und Planen
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-500">→</span> Crew für Events suchen und
                    finden
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-500">→</span> Portfoliomappe für Argenturen machen
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-500">→</span> Deine Favoriten speichern und Anfragen
                  </div>
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-2xl p-8 shadow-2xl overflow-hidden">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl" />
                <div className="flex items-center gap-3 mb-6 relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                  <h3 className="font-[Orbitron] text-xs tracking-[0.2em] text-cyan-300 uppercase">
                    🎚 Techniker & Crew
                  </h3>
                </div>
                <p className="text-slate-300 leading-relaxed mb-5 relative">
                  Erst mit einem kostenlosen Account erwacht Gigsda für dich zum
                  Leben. Du verlässt die passive Rolle und steuerst Events aktiv
                  über automatisierte Tools. Ein sauberes und vollständig
                  gefülltes Profil hilft dir schneller entdeckt zu werden.
                </p>
                <p className="text-sm text-slate-400 relative">

                </p>
              </div>

              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-2xl p-8 shadow-2xl overflow-hidden">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl" />
                <div className="flex items-center gap-3 mb-6 relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                  <h3 className="font-[Orbitron] text-xs tracking-[0.2em] text-cyan-300 uppercase">
                    🏟 Locations
                  </h3>
                </div>
                <p className="text-slate-300 leading-relaxed mb-5 relative">
                  Für Clubs, Bars, Eventhallen, Open-Air-Flächen und 
                  Veranstaltungsorte, die Künstlern und Besuchern eine Bühne bieten.
                </p>
                <p className="text-sm text-slate-400 relative">

                </p>
              </div>

              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-2xl p-8 shadow-2xl overflow-hidden">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl" />
                <div className="flex items-center gap-3 mb-6 relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                  <h3 className="font-[Orbitron] text-xs tracking-[0.2em] text-cyan-300 uppercase">
                    🎫 Veranstalter
                  </h3>
                </div>
                <p className="text-slate-300 leading-relaxed mb-5 relative">
                  Für Menschen mit Visionen, die Events organisieren, Netzwerke 
                  aufbauen und unvergessliche Erlebnisse schaffen möchten.
                </p>
                <p className="text-sm text-slate-400 relative">

                </p>
              </div>

              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-2xl p-8 shadow-2xl overflow-hidden">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl" />
                <div className="flex items-center gap-3 mb-6 relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                  <h3 className="font-[Orbitron] text-xs tracking-[0.2em] text-cyan-300 uppercase">
                    🚚 Dienstleister
                  </h3>
                </div>
                <p className="text-slate-300 leading-relaxed mb-5 relative">
                  Für Verleiher, Fotografen, Videografen, Security-Teams, 
                  Promotion-Partner und alle professionellen Unterstützer der Eventbranche.
                </p>
                <p className="text-sm text-slate-400 relative">

                </p>
              </div>

              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-2xl p-8 shadow-2xl overflow-hidden">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl" />
                <div className="flex items-center gap-3 mb-6 relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                  <h3 className="font-[Orbitron] text-xs tracking-[0.2em] text-cyan-300 uppercase">
                    🤝 Community Builder
                  </h3>
                </div>
                <p className="text-slate-300 leading-relaxed mb-5 relative">
                  Für Menschen, die Verbindungen schaffen, Talente fördern und 
                  gemeinsam mit anderen wachsen möchten.
                </p>
                <p className="text-sm text-slate-400 relative">

                </p>
              </div>


            </div>
         
            {/* Eine Plattform. Tausende Möglichkeiten. */}
            <section className="relative">
              <div className="absolute -inset-16 bg-gradient-to-r from-pink-600/15 via-cyan-500/10 to-purple-600/15 rounded-[4rem] blur-3xl" />

              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
                <div className="absolute top-6 right-6 animate-[float_4.5s_ease-in-out_infinite]">
                  <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/25 to-purple-500/25 border border-pink-400/50 text-xs font-semibold text-pink-200 tracking-wide shadow-[0_0_20px_rgba(236,72,153,0.4)]">
                    LIVE & RECHTSSICHER
                  </div>
                </div>

                <h2 className="font-[Orbitron] text-xs tracking-[0.25em] text-cyan-400/80 uppercase mb-10">
                  // Eine Plattform. Tausende Möglichkeiten.
                </h2>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <p className="text-mx md:text-mx text-slate-100 leading-relaxed mb-6">
                      GIGSDA verbindet Menschen, Fähigkeiten, Ideen und Projekte an einem Ort.
                      
                      Egal ob du dein erstes kleines Konzert planst, eine Crew für dein Event suchst, eine neue Location 
                      entdecken möchtest oder den nächsten großen Schritt deiner Karriere vorbereitest:
                    </p>
                    <p className="text-sm text-slate-500 mb-8">
                      Hier findest du die Menschen, die daraus Realität machen.
                    </p>
                    <p className="text-mx md:text-mx text-slate-100 leading-relaxed mb-6">
                      🚀 Unsere Vision
                    </p>
                    <p className="text-sm text-slate-500 mb-8">
                      Wir glauben, dass großartige Events entstehen, wenn die richtigen Menschen zusammenfinden.

                      Deshalb bauen wir mit GIGSDA nicht einfach eine Plattform.
                    </p>
                    <p className="text-sm text-slate-500 mb-8">
                      Wir bauen ein Netzwerk für die Zukunft der Event- und Musikbranche. 🎵✨
                    </p>
                    <button className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 bg-[length:300%_100%] text-white font-semibold tracking-wide text-sm shadow-[0_0_25px_rgba(236,72,153,0.7)] hover:shadow-[0_0_40px_rgba(236,72,153,1)] hover:scale-105 transition-all duration-300 animate-[gradientMove_3.5s_linear_infinite]">
                      Hol Dir Dein Portfolio!
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute -inset-[2px] bg-gradient-to-br from-cyan-400 via-pink-500 to-purple-500 rounded-2xl blur-[2px] opacity-75 animate-[borderGlow_5s_linear_infinite] bg-[length:300%_300%]" />
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                      <img
                        src="/2026/profiles/tausend_moeglichkeiten.jpg"
                        alt="Live Stage"
                        className="w-full h-72 md:h-80 object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
         
            {/* Der Locationaufruf. */}
            <section className="relative">
              <div className="absolute -inset-16 bg-gradient-to-r from-pink-600/15 via-cyan-500/10 to-purple-600/15 rounded-[4rem] blur-3xl" />

              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
                <div className="absolute top-6 right-6 animate-[float_4.5s_ease-in-out_infinite]">
                  <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/25 to-purple-500/25 border border-pink-400/50 text-xs font-semibold text-pink-200 tracking-wide shadow-[0_0_20px_rgba(236,72,153,0.4)]">
                    LIVE & RECHTSSICHER
                  </div>
                </div>

                <h2 className="font-[Orbitron] text-xs tracking-[0.25em] text-yellow-400/80 uppercase mb-10">
                  // Der Locationaufruf, gib Talenten eine Bühne..
                </h2>

                <div className="gap-12 items-center">
                  <div>
                    <p className="text-mx md:text-mx text-slate-100 leading-relaxed mb-6 text-yellow-400/80">
                      🏟️ Deine Location kann der Beginn von etwas Großem sein
                    </p>

                    <p className="text-mx md:text-mx text-slate-100 leading-relaxed mb-6">
                      Jede erfolgreiche Veranstaltung beginnt mit einer einzigen Entscheidung:
                    </p>
                    <p className="text-mx md:text-mx text-slate-100 leading-relaxed mb-6">
                      Jemand stellt einen Raum zur Verfügung und macht Möglichkeiten sichtbar.
                    </p>
                    <p className="text-mx md:text-mx text-slate-100 leading-relaxed mb-6">
                      Viele Locations stehen an einzelnen Tagen, Abenden oder in bestimmten Zeiträumen leer. 
                      Gleichzeitig suchen Künstler, Veranstalter, Techniker und 
                      kreative Projekte nach dem passenden Ort, um Ideen Wirklichkeit werden zu lassen.
                    </p>
                    <p className="text-mx md:text-mx text-slate-100 leading-relaxed mb-6">
                      Warum Potenzial ungenutzt lassen?
                    </p>
                    <p className="text-mx md:text-mx text-slate-100 leading-relaxed mb-6">
                      Ob vergünstigt, partnerschaftlich oder sogar kostenfrei für ausgewählte Projekte: 
                      Wer seine Location öffnet, schafft Chancen 
                      für neue Veranstaltungen, neue Kontakte und neue Geschichten.
                    </p>
                    <p className="text-mx md:text-mx text-slate-100 leading-relaxed mb-6 text-yellow-400/80">
                      🚀 Räume schaffen Erlebnisse
                    </p>
                    <p className="text-mx md:text-mx text-slate-100 leading-relaxed mb-6 text-orange-400/80">
                      Mit jeder geöffneten Tür entsteht die Möglichkeit für:
                    </p>
                    <p className="text-mx md:text-mx text-slate-100 leading-relaxed mb-1">
                      ✨ neue Künstler und Talente
                    </p>
                    <p className="text-mx md:text-mx text-slate-100 leading-relaxed mb-1">
                      ✨ lokale Veranstaltungen
                    </p>
                    <p className="text-mx md:text-mx text-slate-100 leading-relaxed mb-1">
                      ✨ langfristige Kooperationen
                    </p>
                    <p className="text-mx md:text-mx text-slate-100 leading-relaxed mb-1">
                      ✨ neue Gäste und Netzwerke
                    </p>
                    <p className="text-mx md:text-mx text-slate-100 leading-relaxed mb-8">
                      ✨ eine aktive Event-Community
                    </p>
                    <p className="text-mx md:text-mx text-slate-100 leading-relaxed mb-8">
                      Eine ungenutzte Location bleibt ein Raum.
                    </p>
                    <p className="text-mx md:text-mx text-slate-100 leading-relaxed mb-8">
                      Eine geöffnete Location wird zur Bühne.
                    </p>
                    <p className="text-mx md:text-mx text-slate-100 leading-relaxed mb-6 text-yellow-400/80">
                      🤝 Gemeinsam die Eventszene stärken
                    </p>
                    <p className="text-mx md:text-mx text-slate-100 leading-relaxed mb-8">
                      GIGSDA bringt Menschen zusammen, die etwas bewegen wollen.
                    </p>
                    <p className="text-mx md:text-mx text-slate-100 leading-relaxed mb-8">
                      Wenn du über freie Zeiten, ungenutzte Flächen oder verfügbare Räume verfügst, 
                      kannst du einen wichtigen Beitrag leisten und gleichzeitig die Sichtbarkeit deiner Location erhöhen.
                    </p>
                    <p className="text-mx md:text-mx text-slate-100 leading-relaxed mb-8">
                      Denn jede Bühne, die nicht leer bleibt, kann der Anfang eines unvergesslichen Events sein. 🎵✨
                    </p>
                    <p className="text-mx md:text-mx text-slate-100 leading-relaxed mb-8">
                      Öffne deine Türen. Entdecke neue Möglichkeiten. Werde Teil des GIGSDA-Netzwerks. 🚀
                    </p>


                    <div className="relative">
                      <div className="absolute -inset-[2px] bg-gradient-to-br from-cyan-400 via-pink-500 to-purple-500 rounded-2xl blur-[2px] opacity-75 animate-[borderGlow_5s_linear_infinite] bg-[length:300%_300%]" />
                      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                        <img
                          src="/2026/profiles/location_aufruf.png"
                          alt="Live Stage"
                          className="w-full max-w-full h-auto"
                        />
                      </div>
                      
                    </div>
                    <div className="pt-8 relative">
                      <button className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 bg-[length:300%_100%] text-white font-semibold tracking-wide text-sm shadow-[0_0_25px_rgba(236,72,153,0.7)] hover:shadow-[0_0_40px_rgba(236,72,153,1)] hover:scale-105 transition-all duration-300 animate-[gradientMove_3.5s_linear_infinite]">
                        Freie Locations zeigen!
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </section>
            
            </div>



        </main>

      <Footer setView={setView} />




      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        @keyframes borderGlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};
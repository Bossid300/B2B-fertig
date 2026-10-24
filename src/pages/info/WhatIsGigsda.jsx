import React from 'react';

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
          <div className="max-w-6xl mx-auto space-y-16">

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
                  Was ist Gigsda für dich?
                </h1>
                <p className="text-xs text-slate-400 leading-relaxed max-w-lg uppercase tracking-wide">
                  und wie du die Live-Musik- und Eventbranche mitgestalten kannst!
                </p>
              </div>
            </div>   

            {/* KÜNSTLER*/}
            <section className="relative mb-8">
              <div className="absolute -inset-16 bg-gradient-to-r from-pink-600/15 via-cyan-500/10 to-purple-600/15 rounded-[4rem] blur-3xl" />
              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-3xl font-black uppercase tracking-tight leading-tight select-none">
                    <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                      🎤 Künstler
                    </span>
                  </h1>
                  <p className="text-sm md:text-base text-slate-300 font-medium tracking-wide">
                    Bei GIGSDA wirst du als Künstler sichtbar – für Locations, Veranstalter und Fans. Du kannst dich auf Free Spots bewerben, bei denen die Community mit abstimmt, und so leichter an echte Auftritte kommen. Statt endloser Anfragen hast du eine zentrale Anlaufstelle für Buchungen und neue Möglichkeiten.
                  </p>
                </div>                
              </div>
            </section>

            {/* LOCATIONS */}
            <section className="relative mb-8">
              <div className="absolute -inset-16 bg-gradient-to-r from-pink-600/15 via-cyan-500/10 to-purple-600/15 rounded-[4rem] blur-3xl" />
              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-3xl font-black uppercase tracking-tight leading-tight select-none">
                    <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                     📍 Locations
                    </span>
                  </h1>
                  <p className="text-sm md:text-base text-slate-300 font-medium tracking-wide">
                    Als Location kannst du freie Termine einfach als Free Spot einstellen und passende Künstler finden – oder die Community per Voting entscheiden lassen. So werden leere Abende gefüllt, ohne langen Suchaufwand. Gleichzeitig wirst du für Acts und Veranstalter in der Region besser auffindbar.                  </p>
                </div>                
              </div>
            </section>

            {/* VERANSTALTER */}
            <section className="relative mb-8">
              <div className="absolute -inset-16 bg-gradient-to-r from-pink-600/15 via-cyan-500/10 to-purple-600/15 rounded-[4rem] blur-3xl" />
              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-3xl font-black uppercase tracking-tight leading-tight select-none">
                    <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                     💼 Veranstalter
                    </span>
                  </h1>
                  <p className="text-sm md:text-base text-slate-300 font-medium tracking-wide">
                    GIGSDA bringt Künstler, Locations und Technik an einem Ort zusammen. Du sparst Zeit bei der Suche und Planung, behältst den Überblick über mögliche Acts und kannst Free Spots oder Events gezielt bespielen. Die Community kann zusätzlich mitentscheiden, wer auf die Bühne kommt.
                  </p>
                </div>                
              </div>
            </section>

            {/* FANS */}
            <section className="relative mb-8">
              <div className="absolute -inset-16 bg-gradient-to-r from-pink-600/15 via-cyan-500/10 to-purple-600/15 rounded-[4rem] blur-3xl" />
              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-3xl font-black uppercase tracking-tight leading-tight select-none">
                    <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                      🎉 Fans
                    </span>
                  </h1>
                  <p className="text-sm md:text-base text-slate-300 font-medium tracking-wide">
                    Als Fan entdeckst du neue Bands und lokale Gigs, kannst bei Free Spots mitabstimmen und die Szene aktiv mitgestalten. Du bist näher dran an dem, was in deiner Region passiert – und hilfst mit deiner Stimme, dass die richtigen Acts auf die Bühne kommen.
                  </p>
                </div>                
              </div>
            </section>

            {/* TECHNIKER */}
            <section className="relative mb-8">
              <div className="absolute -inset-16 bg-gradient-to-r from-pink-600/15 via-cyan-500/10 to-purple-600/15 rounded-[4rem] blur-3xl" />
              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-3xl font-black uppercase tracking-tight leading-tight select-none">
                    <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                     🎛️ Techniker
                    </span>
                  </h1>
                  <p className="text-sm md:text-base text-slate-300 font-medium tracking-wide">
                    Als Techniker wirst du für Locations und Veranstalter sichtbar und kommst schneller an Einsätze. Statt ständiger Eigenakquise findest du über die Plattform passende Jobs in der Region – von einzelnen Gigs bis zu wiederkehrenden Zusammenarbeiten.
                  </p>
                </div>                
              </div>
            </section>

            {/* CATERING */}
            <section className="relative mb-8">
              <div className="absolute -inset-16 bg-gradient-to-r from-pink-600/15 via-cyan-500/10 to-purple-600/15 rounded-[4rem] blur-3xl" />
              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-3xl font-black uppercase tracking-tight leading-tight select-none">
                    <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                     🍽️ Catering
                    </span>
                  </h1>
                  <p className="text-sm md:text-base text-slate-300 font-medium tracking-wide">
                    Als Caterer wirst du direkt von Locations und Veranstaltern gefunden, die für Events Verpflegung brauchen. Statt über Umwege an Jobs zu kommen, erscheinst du genau dort, wo Live-Events geplant werden – unkompliziert und regional.
                  </p>
                </div>                
              </div>
            </section>

            {/* SECURITY */}
            <section className="relative mb-8">
              <div className="absolute -inset-16 bg-gradient-to-r from-pink-600/15 via-cyan-500/10 to-purple-600/15 rounded-[4rem] blur-3xl" />
              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-3xl font-black uppercase tracking-tight leading-tight select-none">
                    <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                      🛡️ Security
                    </span>
                  </h1>
                  <p className="text-sm md:text-base text-slate-300 font-medium tracking-wide">
                    Als Security-Dienst wirst du für Veranstalter und Locations sichtbar, die für ihre Events Personal suchen. Über GIGSDA kommst du schneller an Einsätze und baust langfristige Verbindungen in der regionalen Event-Szene auf.
                  </p>
                </div>                
              </div>
            </section>
            
           
            {/* VERLEIHER */}
            <section className="relative mb-16">
              <div className="absolute -inset-16 bg-gradient-to-r from-pink-600/15 via-cyan-500/10 to-purple-600/15 rounded-[4rem] blur-3xl" />
              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-3xl font-black uppercase tracking-tight leading-tight select-none">
                    <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
                     🔌Verleih (Technik & Equipment)
                    </span>
                  </h1>
                  <p className="text-sm md:text-base text-slate-300 font-medium tracking-wide">
                    Als Verleiher von PA, Licht, Bühne oder Equipment wirst du genau von den Leuten gefunden, die für Gigs und Events Technik brauchen. Weniger Kaltakquise, mehr direkte Anfragen aus der Live-Szene.
                  </p>
                </div>                
              </div>
            </section>




            {/* GIGSDA MISSIONS-PRINZIP */}
            <section>


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

            
            </div>

        </main>


      </div>

      {/* Custom Animations */}
      <style jsx global>{`

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
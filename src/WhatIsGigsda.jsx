import React from 'react';
import { Award, Layers, CheckCircle2, Eye, ShieldAlert, ArrowRight } from 'lucide-react';

export default function WhatIsGigsda() {
  
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
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/70 backdrop-blur-2xl">
          <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg width="32" height="30" viewBox="0 0 48 46" fill="none">
                <path
                  fill="#863bff"
                  d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"
                />
              </svg>
              <span className="font-[Orbitron] text-white text-lg tracking-widest">
                GIGSDA
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
              <a href="#" className="hover:text-cyan-300 transition">
                Was ist Gigsda?
              </a>
              <a href="#" className="hover:text-cyan-300 transition">
                Events-Radar
              </a>
              <a href="#" className="hover:text-cyan-300 transition">
                Search-Explorer
              </a>
              <a href="#" className="hover:text-cyan-300 transition">
                Preise
              </a>
            </div>

            <button className="px-5 py-1.5 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 bg-[length:300%_100%] text-white text-sm font-semibold tracking-wide shadow-[0_0_25px_rgba(236,72,153,0.7)] hover:shadow-[0_0_40px_rgba(236,72,153,1)] hover:scale-105 transition-all duration-300 animate-[gradientMove_3.5s_linear_infinite]">
              LOGIN
            </button>
          </div>
        </nav>

        <main className="pt-28 pb-24 px-4">
          <div className="max-w-5xl mx-auto space-y-16">
            {/* DAS GIGSDA-PRINZIP */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-[Orbitron] text-xs tracking-[0.25em] text-cyan-400/80 uppercase">
                  // DAS GIGSDA-PRINZIP
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
                  <h3 className="font-[Space_Grotesk] text-2xl font-bold text-cyan-300 mb-3 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]">
                    Digitaler Rider
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Keine veralteten PDF’s mehr. Alle technischen Daten fließen
                    live in die Rider und euer Portfolio
                  </p>
                </div>

                {/* Card 2 */}
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-2xl p-7 shadow-2xl hover:border-cyan-400/55 hover:-translate-y-1.5 transition-all duration-400 group">
                  <div className="absolute left-0 top-[15%] bottom-[15%] w-[3px] bg-gradient-to-b from-cyan-400 to-pink-500 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mb-6 text-2xl shadow-[0_0_25px_rgba(34,211,238,0.35)]">
                    📡
                  </div>
                  <h3 className="font-[Space_Grotesk] text-2xl font-bold text-cyan-300 mb-3 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]">
                    Realtime-Radar
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Finden statt ewig zu Suchen. Filtere nach Acts, Region, Gage
                    oder Localsupport’s
                  </p>
                </div>

                {/* Card 3 */}
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-2xl p-7 shadow-2xl hover:border-cyan-400/55 hover:-translate-y-1.5 transition-all duration-400 group">
                  <div className="absolute left-0 top-[15%] bottom-[15%] w-[3px] bg-gradient-to-b from-cyan-400 to-pink-500 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center mb-6 text-2xl shadow-[0_0_25px_rgba(236,72,153,0.35)]">
                    🔏
                  </div>
                  <h3 className="font-[Space_Grotesk] text-2xl font-bold text-cyan-300 mb-3 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]">
                    Der Deal
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Rechtssicherheit per Klick. Verträge und (Rider)Freigaben
                    werden digital besiegelt.
                  </p>
                </div>
              </div>
            </section>

            {/* FOKUS: DER DEAL */}
            <section className="relative">
              <div className="absolute -inset-16 bg-gradient-to-r from-pink-600/15 via-cyan-500/10 to-purple-600/15 rounded-[4rem] blur-3xl" />

              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
                <div className="absolute top-6 right-6 animate-[float_4.5s_ease-in-out_infinite]">
                  <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/25 to-purple-500/25 border border-pink-400/50 text-xs font-semibold text-pink-200 tracking-wide shadow-[0_0_20px_rgba(236,72,153,0.4)]">
                    LIVE & RECHTSSICHER
                  </div>
                </div>

                <h2 className="font-[Orbitron] text-xs tracking-[0.25em] text-cyan-400/80 uppercase mb-10">
                  // FOKUS: DER DEAL
                </h2>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <p className="text-lg md:text-xl text-slate-100 leading-relaxed mb-6">
                      Sobald die Verhandlungen im integrierten Tool abgeschlossen
                      ist, generiert das System eine digitale Vereinbarung. Gage,
                      Zeiten und Auflagen werden digital unverzüglich rechtssicher
                      besiegelt
                    </p>
                    <p className="text-sm text-slate-500 mb-8">
                      Bereit die Event-organisation zu revolutionieren?
                    </p>
                    <button className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 bg-[length:300%_100%] text-white font-semibold tracking-wide text-sm shadow-[0_0_25px_rgba(236,72,153,0.7)] hover:shadow-[0_0_40px_rgba(236,72,153,1)] hover:scale-105 transition-all duration-300 animate-[gradientMove_3.5s_linear_infinite]">
                      Starte jetzt!
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute -inset-[14px] bg-gradient-to-br from-cyan-400 via-pink-500 to-purple-500 rounded-2xl blur-[18px] opacity-75 animate-[borderGlow_5s_linear_infinite] bg-[length:300%_300%]" />
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                      <img
                        src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&q=80"
                        alt="Live Stage"
                        className="w-full h-72 md:h-80 object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* GÄSTE / MITGLIEDER */}
            <div className="grid md:grid-cols-2 gap-7">
              <div className="bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  <h3 className="font-[Orbitron] text-xs tracking-[0.2em] text-slate-500 uppercase">
                    GÄSTE (nicht registrierte)
                  </h3>
                </div>
                <p className="text-slate-400 leading-relaxed mb-6">
                  Als Gast bist du stiller Beobachter des Systems. Du hast
                  Einblick in die Daten der Plattform, um dich von der Qualität
                  zu überzeugen, bevor du Daten von dir preisgibst.
                </p>
                <p className="text-sm text-slate-500 mb-3">Du kannst:</p>
                <div className="space-y-2 text-sm text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-500">→</span> Profile ansehen
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-500">→</span> Events suchen und
                    finden
                  </div>
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-cyan-400/25 rounded-2xl p-8 shadow-2xl overflow-hidden">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl" />
                <div className="flex items-center gap-3 mb-6 relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                  <h3 className="font-[Orbitron] text-xs tracking-[0.2em] text-cyan-300 uppercase">
                    MITGLIEDER (Fan bis zum Veranstalter)
                  </h3>
                </div>
                <p className="text-slate-300 leading-relaxed mb-5 relative">
                  Erst mit einem kostenlosen Account erwacht Gigsda für dich zum
                  Leben. Du verlässt die passive Rolle und steuerst Events aktiv
                  über automatisierte Tools. Ein sauberes und vollständig
                  gefülltes Profil hilft dir schneller entdeckt zu werden.
                </p>
                <p className="text-sm text-slate-400 relative">
                  Nutze den Chat mit deiner Crew und verhandle über Gagen,
                  Spielzeiten usw. und schließe Verträge rechtssicher mit einem
                  Klick ab. Stimme dich mit anderen ab über Termine, Abmachungen
                  oder Auflagen.
                </p>
              </div>
            </div>
          </div>
        </main>
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
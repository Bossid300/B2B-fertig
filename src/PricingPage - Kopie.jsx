import React from 'react';
import { PLAN_CONFIG }
from '../moduls/subscriptions/subscriptionPlans';

console.log(PLAN_CONFIG);

export default function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 ">

      <div className="mb-12">
        <h1 className="text-cyan-400 text-4xl font-black uppercase tracking-wider font-mono flex items-center gap-4">
          💎 GIGSDA MODEL
        </h1>

        <p className="text-slate-500 mt-4 font-mono">
          Vom Entdecken bis zur eigenen Event-Organisation.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* COMMUNITY */}

          <div 
            className="bg-slate-900 rounded-2xl p-8 relative transition-all duration-300 hover:scale-[1.02]"
            style={{
              border: "2px solid transparent",
              backgroundImage: "linear-gradient(#0f172a, #0f172a), linear-gradient(135deg, #00f2fe, #ff0844)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box"
            }}
          >

          <h2 className="text-cyan-400 text-3xl font-black uppercase mb-2 font-mono">
            COMMUNITY
          </h2>

          <div className="text-cyan-300 text-5xl font-black mb-1 font-mono">
            0 €
          </div>

          <div className="text-slate-500 text-xs uppercase tracking-widest mb-8 font-mono">
            pro Monat
          </div>

          <div className="space-y-3 text-slate-300 font-mono">

            <div>✓ Profil</div>
            <div>✓ Community</div>
            <div>✓ Favoriten</div>
            <div>✓ Requests</div>
            <div>✓ Crew Support</div>

            <div className="border-t border-slate-800 pt-4 mt-4"></div>

            <div className="text-red-300">
              ✗ Event-Erstellung
            </div>

            <div className="text-red-300">
              ✗ Portfolio
            </div>

          </div>
        </div>

        {/* PRO */}

          <div 
            className="bg-slate-900 rounded-2xl p-8 relative transition-all duration-300 hover:scale-[1.02]"
            style={{
              border: "2px solid transparent",
              backgroundImage: "linear-gradient(#0f172a, #0f172a), linear-gradient(135deg, #00f2fe, #ea08ff)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box"
            }}
          >

          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-black tracking-widest uppercase font-mono animate-pulse">
            Beliebteste Wahl
          </div>

          <h2 className="text-pink-400 text-3xl font-black uppercase mb-2 font-mono animate-pulse">
            PRO
          </h2>

          <div className="text-pink-400 text-5xl font-black mb-1 font-mono">
            9,90 €
          </div>

          <div className="text-slate-500 text-xs uppercase tracking-widest mb-8 font-mono">
            pro Monat
          </div>

          <div className="space-y-3 text-slate-300 font-mono">

            <div>✓ Event-Erstellung</div>
            <div>✓ Event-Chat</div>
            <div>✓ Crew-Management</div>
            <div>✓ Rider-Check</div>
            <div>✓ Deal-System</div>
            <div>✓ Event Planner</div>
            <div>✓ Promotion</div>
            <div>✓ Premium Portfolio</div>
            <div>✓ GIGSDA Pass</div>

          </div>
        </div>

        {/* AGENCY */}

          <div 
            className="bg-slate-900 rounded-2xl p-8 relative transition-all duration-300 hover:scale-[1.02]"
            style={{
              border: "2px solid transparent",
              backgroundImage: "linear-gradient(#0f172a, #0f172a), linear-gradient(135deg, #00f2fe, #ffe608)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box"
            }}
          >
          <h2 className="text-yellow-400 text-3xl font-black uppercase mb-2 font-mono">
            AGENCY
          </h2>

          <div className="text-yellow-400 text-5xl font-black mb-1 font-mono">
            24,90 €
          </div>

          <div className="text-slate-500 text-xs uppercase tracking-widest mb-8 font-mono">
            pro Monat
          </div>

          <div className="space-y-3 text-slate-300 font-mono">

            <div>✓ Alles aus PRO</div>
            <div>✓ Agency Dashboard</div>
            <div>✓ Dokumente</div>
            <div>✓ Statistiken</div>
            <div>✓ Erweiterte Crewsuche</div>
            <div>✓ Höhere Event-Kapazitäten</div>

          </div>
        </div>

      </div>


      {/* PROMOTION+ */}

      <div className="mt-16 bg-slate-900/40 border border-cyan-500/20 rounded-2xl p-8 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]">

        <h2 className="text-cyan-400 text-2xl font-black uppercase mb-4 font-mono">
          🚀 PROMOTION+
        </h2>

        <p className="text-slate-400 font-mono mb-8">
          Erweiterte Vermarktungsoptionen für mehr Reichweite.
        </p>

        <div className="grid md:grid-cols-3 gap-4">

          <div 
            className="bg-slate-900 rounded-2xl p-8 relative transition-all duration-300 hover:scale-[1.02]"
            style={{
              border: "2px solid transparent",
              backgroundImage: "linear-gradient(#0f172a, #0f172a), linear-gradient(135deg, #00f2fe, #ff08ea)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box"
            }}
          >
            <div className="text-cyan-300 font-black mb-2 font-mono">
              🖨 PRINT
            </div>

            <div className="text-slate-400 text-sm font-mono">
              Flyer, Plakate und Druckprodukte
            </div>

            <div className="text-pink-400 font-black mt-4 font-mono">
              ab 19 €
            </div>
          </div>

          <div 
            className="bg-slate-900 rounded-2xl p-8 relative transition-all duration-300 hover:scale-[1.02]"
            style={{
              border: "2px solid transparent",
              backgroundImage: "linear-gradient(#0f172a, #0f172a), linear-gradient(135deg, #00f2fe, #ff08ea)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box"
            }}
          >
            <div className="text-cyan-300 font-black mb-2 font-mono">
              📢 MEDIEN
            </div>

            <div className="text-slate-400 text-sm font-mono">
              Magazine, Presse und Eventportale
            </div>

            <div className="text-pink-400 font-black mt-4 font-mono">
              ab 49 €
            </div>
          </div>

          <div 
            className="bg-slate-900 rounded-2xl p-8 relative transition-all duration-300 hover:scale-[1.02]"
            style={{
              border: "2px solid transparent",
              backgroundImage: "linear-gradient(#0f172a, #0f172a), linear-gradient(135deg, #00f2fe, #ff08ea)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box"
            }}
          >
            <div className="text-cyan-300 font-black mb-2 font-mono">
              📈 BOOST
            </div>

            <div className="text-slate-400 text-sm font-mono">
              Zusätzliche Sichtbarkeit und Reichweite
            </div>

            <div className="text-pink-400 font-black mt-4 font-mono">
              ab 9 €
            </div>
          </div>

        </div>
      </div>

      {/* TESTPHASE */}

      <div className="mt-12 text-center">

        <div className="text-pink-400 uppercase tracking-widest font-black mb-3 font-mono animate-pulse">
          🚧 Testphase
        </div>

        <div className="text-slate-500 text-sm font-mono">
          Alle Preise dienen aktuell der internen Entwicklung
          und können sich bis zum offiziellen Start ändern.
        </div>

      </div>

    </div>
  );
}
import React from "react";
import Footer from "../../Footer";

export default function Roadmap({ setView }) {
  const completed = [
    "Profile System",
    "Events System",
    "Crew Requests",
    "Community Chat",
    "Search Explorer",
    "Event Radar",
    "Google Maps Integration",
    "Billing Center",
    "Subscription System",
    "Budget Planner",
    "Contract Center",
    "Gigsda Pass",
    "Security Stack",
    "Website & Legal Pages",
  ];

  const currentGoals = [
    "Registrierung testen",
    "Login testen",
    "Event Workflow testen",
    "Crew Workflow testen",
    "Premium Upgrade testen",
    "Fehlerlogs überwachen",
    "Backups prüfen",
    "Monitoring aktivieren",
  ];

  const upcoming = [
    "Notification Center",
    "Activity Feed",
    "Realtime Chat",
    "Matrix Search V2",
    "Referral System V2",
    "Ticketing Integration",
    "Agency Accounts",
    "Team Funktionen",
  ];

  return (
    <div className="min-h-screen bg-[#050B1F] text-slate-300">
      <div className="w-full max-w-7xl mx-auto px-6 py-10 text-slate-200">

      {/* HERO */}

      <section className="mb-12 text-center">
        <div className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm uppercase tracking-widest">
          Building Gigsda In Public
        </div>

        <h1 className="text-5xl font-black mt-6 mb-4">
          🚀 GIGSDA ROADMAP
        </h1>

        <p className="max-w-3xl mx-auto text-slate-400 text-lg">
          Die großen Architektur-, Datenbank- und Migrationsarbeiten
          sind abgeschlossen. Der Fokus liegt jetzt auf Go-Live,
          Stabilisierung, Monitoring und den ersten echten Nutzern.
        </p>
      </section>

      {/* STATUS */}

      <section className="grid md:grid-cols-4 gap-6 mb-12">

        <div className="bg-slate-900/60 border border-green-500/20 rounded-3xl p-6">
          <div className="text-4xl mb-2">✅</div>
          <h3 className="font-bold">Migration</h3>
          <p className="text-sm text-slate-400 mt-2">
            Vollständig abgeschlossen
          </p>
        </div>

        <div className="bg-slate-900/60 border border-green-500/20 rounded-3xl p-6">
          <div className="text-4xl mb-2">✅</div>
          <h3 className="font-bold">Architektur</h3>
          <p className="text-sm text-slate-400 mt-2">
            Produktionsreif
          </p>
        </div>

        <div className="bg-slate-900/60 border border-yellow-500/20 rounded-3xl p-6">
          <div className="text-4xl mb-2">🧪</div>
          <h3 className="font-bold">Go-Live Test</h3>
          <p className="text-sm text-slate-400 mt-2">
            Letzte Prüfungen laufen
          </p>
        </div>

        <div className="bg-slate-900/60 border border-cyan-500/20 rounded-3xl p-6">
          <div className="text-4xl mb-2">🚀</div>
          <h3 className="font-bold">Soft Launch</h3>
          <p className="text-sm text-slate-400 mt-2">
            Nächster Meilenstein
          </p>
        </div>

      </section>

      {/* TIMELINE */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-cyan-400 mb-8">
          Roadmap Timeline
        </h2>

        <div className="space-y-6">

          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-xl font-bold">
              ✅ Phase 1 – Architektur & Migration
            </h3>
            <p className="text-slate-400">
              Datenbanken vereinheitlicht, Services migriert,
              Rollenrouting stabilisiert, Legacy-Strukturen entfernt.
            </p>
          </div>

          <div className="border-l-4 border-cyan-500 pl-6">
            <h3 className="text-xl font-bold">
              🚀 Phase 2 – Go-Live Readiness
            </h3>
            <p className="text-slate-400">
              End-to-End Testing, Security Review,
              Monitoring und Produktionsfreigabe.
            </p>
          </div>

          <div className="border-l-4 border-yellow-500 pl-6">
            <h3 className="text-xl font-bold">
              🌍 Phase 3 – Erste Nutzer
            </h3>
            <p className="text-slate-400">
              Soft Launch, Nutzerfeedback,
              Fehleranalyse und Optimierung.
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-6">
            <h3 className="text-xl font-bold">
              📈 Phase 4 – Wachstum
            </h3>
            <p className="text-slate-400">
              Community-Aufbau, Veranstalter,
              Crew-Mitglieder und Premium-Ausbau.
            </p>
          </div>

        </div>
      </section>

      {/* SYSTEME */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-green-400 mb-6">
          Abgeschlossene Kernsysteme
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {completed.map((item) => (
            <div
              key={item}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4"
            >
              ✅ {item}
            </div>
          ))}
        </div>
      </section>

      {/* LIVE CHECK */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6">
          Aktuelle Go-Live Aufgaben
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {currentGoals.map((goal) => (
            <div
              key={goal}
              className="bg-slate-900/50 border border-yellow-500/20 rounded-2xl p-4"
            >
              ⏳ {goal}
            </div>
          ))}
        </div>
      </section>

      {/* BACKLOG */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-purple-400 mb-6">
          Ausbau nach Go-Live
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {upcoming.map((item) => (
            <div
              key={item}
              className="bg-slate-900/50 border border-purple-500/20 rounded-2xl p-4"
            >
              🔮 {item}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}

      <section className="text-center border-t border-slate-800 pt-10">
        <div className="text-3xl mb-4">🍺🚀</div>

        <h3 className="text-2xl font-bold text-cyan-400">
          Status: Vor Produktivstart
        </h3>

        <p className="text-slate-400 mt-3 max-w-3xl mx-auto">
          GIGSDA hat die Architektur-, Datenbank- und
          Migrationsphase erfolgreich abgeschlossen.
          Der nächste Meilenstein ist der kontrollierte
          Soft Launch mit den ersten echten Nutzern.
        </p>
      </section>


    </div>
    
          <Footer setView={setView} />

    </div>

    
  );
}
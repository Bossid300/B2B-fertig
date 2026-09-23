import React from 'react';

export default function GuestProjectsPage({ setView }) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 text-slate-300 animate-fade-in">

      {/* HEADER */}
      <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 mb-6">
        <p className="text-cyan-400 text-[10px] uppercase tracking-[0.3em] font-black">
          // PROJEKTZENTRALE
        </p>

        <h1 className="text-3xl md:text-4xl font-black text-white mt-2">
          Die Einsatzzentrale für Events & Crews
        </h1>

        <p className="text-slate-400 mt-4 max-w-3xl leading-relaxed">
          In der GIGSDA Projektzentrale werden Veranstaltungen gemeinsam
          geplant, organisiert und umgesetzt. Künstler, Veranstalter,
          Techniker, Dienstleister und Crews arbeiten hier in einer gemeinsamen
          Umgebung an realen Projekten.
        </p>
      </div>

      {/* FEATURE GRID */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">

        <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5">
          <div className="text-cyan-400 font-black text-xs uppercase tracking-widest mb-4">
            // Projektmanagement
          </div>

          <div className="space-y-3 text-sm">
            <div>✅ Events erstellen und verwalten</div>
            <div>✅ Projektfortschritt überwachen</div>
            <div>✅ Crew koordinieren</div>
            <div>✅ Riders & Gewerke organisieren</div>
            <div>✅ Dokumente verwalten</div>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5">
          <div className="text-cyan-400 font-black text-xs uppercase tracking-widest mb-4">
            // Zusammenarbeit
          </div>

          <div className="space-y-3 text-sm">
            <div>✅ Community Chats</div>
            <div>✅ Crew Anfragen</div>
            <div>✅ Counter Offer Workflow</div>
            <div>✅ Budgetplanung</div>
            <div>✅ Promotion & Vorbereitung</div>
          </div>
        </div>

      </div>

      {/* DEMO PROJECT */}
      <div className="bg-slate-950 border border-cyan-500/20 rounded-3xl p-6 mb-6">

        <div className="text-cyan-400 text-xs uppercase tracking-widest font-black mb-2">
          // Beispielprojekt
        </div>

        <h2 className="text-white text-xl font-black">
          🎤 Summer Open Air Festival 2027
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mt-5">

          <div className="space-y-3">
            <div className="bg-slate-900 rounded-xl p-3">
              👥 Crewmitglieder: <strong>12</strong>
            </div>

            <div className="bg-slate-900 rounded-xl p-3">
              📋 Offene Gewerke: <strong>4</strong>
            </div>

            <div className="bg-slate-900 rounded-xl p-3">
              💬 Projektchats aktiv
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-900 rounded-xl p-3">
              💰 Budgetplanung aktiv
            </div>

            <div className="bg-slate-900 rounded-xl p-3">
              📄 Dokumente & Vereinbarungen
            </div>

            <div className="bg-slate-900 rounded-xl p-3">
              ✅ Projektfortschritt: 78%
            </div>
          </div>

        </div>
      </div>

      {/* INFO BLOCK */}
      <div className="bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 mb-6">

        <div className="text-amber-400 text-xs uppercase tracking-widest font-black mb-3">
          🔒 Mitgliederbereich
        </div>

        <p className="text-slate-300 leading-relaxed">
          Die Projektzentrale enthält aktive Projekte, Crew-Kommunikation,
          Veranstaltungsdaten, Budgets, Dokumente und interne Projektwerkzeuge.
          Deshalb ist der Zugriff ausschließlich für registrierte Mitglieder
          möglich.
        </p>

      </div>

      {/* CTA */}
      <div className="bg-slate-950 border border-slate-900 rounded-3xl p-8 text-center">

        <h2 className="text-2xl font-black text-white">
          Bereit für dein nächstes Event?
        </h2>

        <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
          Registriere dich kostenlos und erhalte Zugriff auf die komplette
          GIGSDA Projektzentrale, Crew-Verwaltung, Budgetplanung,
          Community-Funktionen und viele weitere Werkzeuge.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">

          <button
            type="button"
            onClick={() => setView('login')}
            className="
              px-8 py-3
              rounded-2xl
              bg-gradient-to-r
              from-emerald-400
              to-cyan-400
              text-slate-950
              font-black
              uppercase
              tracking-wider
              hover:scale-[1.02]
              transition-all
              cursor-pointer
            "
          >
            🚀 Kostenlos registrieren
          </button>

          <button
            type="button"
            onClick={() => setView('login')}
            className="
              px-8 py-3
              rounded-2xl
              border
              border-slate-700
              bg-slate-900
              text-white
              font-black
              uppercase
              tracking-wider
              hover:border-cyan-400
              transition-all
              cursor-pointer
            "
          >
            🔐 Anmelden
          </button>

        </div>

      </div>

    </div>
  );
}
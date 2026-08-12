import React from "react";
import Footer from "../../Footer";

export default function TermsPage({ setView }) {
  return (
    <div className="min-h-screen bg-[#050B1F] text-slate-300">

      <div className="max-w-5xl mx-auto px-6 py-16">

        <div className="text-center mb-16">
          <div className="text-cyan-400 text-xs uppercase tracking-[0.4em] mb-4">
            // RECHTLICHE INFORMATIONEN
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            NUTZUNGSBEDINGUNGEN
          </h1>

          <p className="max-w-3xl mx-auto text-slate-400 leading-relaxed">
            Willkommen bei GIGSDA. Mit der Nutzung der Plattform
            erklärst du dich mit den folgenden Grundregeln für die
            Zusammenarbeit, Kommunikation und Nutzung unserer
            Dienste einverstanden.
          </p>
        </div>

        <div className="space-y-8">

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Nutzung der Plattform
            </h2>

            <p className="text-slate-400 leading-relaxed">
              GIGSDA dient der Vernetzung von Künstlern,
              Veranstaltern, Technikern, Locations,
              Dienstleistern und weiteren Teilnehmern
              der Eventbranche.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Benutzerkonten
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Nutzer sind für die Richtigkeit ihrer Angaben und den
              Schutz ihrer Zugangsdaten selbst verantwortlich.
              Die Weitergabe von Zugangsdaten an Dritte ist nicht
              gestattet.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Verhaltensregeln
            </h2>

            <ul className="space-y-3 text-slate-400">
              <li>• Respektvoller Umgang mit allen Mitgliedern</li>
              <li>• Keine beleidigenden oder diskriminierenden Inhalte</li>
              <li>• Keine irreführenden Profile oder Falschangaben</li>
              <li>• Keine missbräuchliche Nutzung der Plattform</li>
              <li>• Einhaltung geltender Gesetze und Vorschriften</li>
            </ul>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Inhalte und Verantwortung
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Für hochgeladene Inhalte, Profile, Veranstaltungen,
              Nachrichten und sonstige Beiträge sind die jeweiligen
              Nutzer selbst verantwortlich.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Verfügbarkeit
            </h2>

            <p className="text-slate-400 leading-relaxed">
              GIGSDA bemüht sich um einen möglichst störungsfreien
              Betrieb. Ein Anspruch auf permanente Verfügbarkeit
              einzelner Funktionen besteht jedoch nicht.
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Änderungen
            </h2>

            <p className="text-slate-300 leading-relaxed">
              Die Plattform befindet sich in aktiver Entwicklung.
              Funktionen, Angebote und Nutzungsbedingungen können
              erweitert, angepasst oder aktualisiert werden, um die
              Plattform kontinuierlich zu verbessern.
            </p>
          </div>

        </div>

      </div>

      <Footer setView={setView} />
    </div>
  );
}
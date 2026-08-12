import React from "react";
import Footer from "../../Footer";

export default function AGBPage({ setView }) {
  return (
    <div className="min-h-screen bg-[#050B1F] text-slate-300">

      <div className="max-w-5xl mx-auto px-6 py-16">

        <div className="text-center mb-16">
          <div className="text-cyan-400 text-xs uppercase tracking-[0.4em] mb-4">
            // ALLGEMEINE GESCHÄFTSBEDINGUNGEN
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            AGB
          </h1>

          <p className="max-w-3xl mx-auto text-slate-400 leading-relaxed">
            Diese Allgemeinen Geschäftsbedingungen regeln die Nutzung
            der Plattform GIGSDA sowie der angebotenen Dienste und
            Funktionen.
          </p>
        </div>

        <div className="space-y-8">

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Geltungsbereich
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Diese Bedingungen gelten für alle Nutzer der Plattform
              GIGSDA sowie für sämtliche angebotenen Funktionen,
              Services und digitalen Inhalte.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Registrierung und Nutzerkonto
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Für bestimmte Funktionen ist die Erstellung eines
              Benutzerkontos erforderlich. Nutzer verpflichten sich,
              wahrheitsgemäße Angaben zu machen und ihre Zugangsdaten
              sicher aufzubewahren.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Leistungen von GIGSDA
            </h2>

            <p className="text-slate-400 leading-relaxed">
              GIGSDA stellt digitale Werkzeuge zur Vernetzung,
              Kommunikation, Eventplanung, Profildarstellung und
              Projektorganisation innerhalb der Event- und
              Musikbranche bereit.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Pflichten der Nutzer
            </h2>

            <ul className="space-y-3 text-slate-400">
              <li>• Einhaltung geltender Gesetze</li>
              <li>• Wahrheitsgemäße Profilangaben</li>
              <li>• Respektvoller Umgang mit anderen Mitgliedern</li>
              <li>• Keine missbräuchliche Nutzung der Plattform</li>
              <li>• Kein Veröffentlichen rechtswidriger Inhalte</li>
            </ul>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Kostenpflichtige Leistungen
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Einzelne Funktionen oder Mitgliedschaften können
              kostenpflichtig angeboten werden. Preis- und
              Leistungsinformationen werden vor Abschluss eines
              kostenpflichtigen Dienstes gesondert angezeigt.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Haftung
            </h2>

            <p className="text-slate-400 leading-relaxed">
              GIGSDA übernimmt keine Gewähr für die Richtigkeit von
              nutzergenerierten Inhalten, Profilangaben oder
              Vereinbarungen zwischen Mitgliedern der Plattform.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Änderungen der Leistungen
            </h2>

            <p className="text-slate-400 leading-relaxed">
              GIGSDA entwickelt sich kontinuierlich weiter.
              Funktionen, Inhalte und Angebote können erweitert,
              angepasst oder ersetzt werden.
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Entwicklungsstatus
            </h2>

            <p className="text-slate-300 leading-relaxed">
              Diese AGB dienen aktuell als Vorabversion innerhalb
              der laufenden Entwicklungsphase von GIGSDA. Vor dem
              finalen Plattform-Launch erfolgt eine rechtliche
              Überarbeitung und Ergänzung aller erforderlichen
              Vertragsbestandteile.
            </p>
          </div>

        </div>

      </div>

      <Footer setView={setView} />
    </div>
  );
}
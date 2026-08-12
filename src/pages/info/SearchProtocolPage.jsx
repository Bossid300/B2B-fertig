import React from "react";
import Footer from "../../Footer";

export default function SearchProtocolPage({ setView }) {
  return (
    <div className="min-h-screen bg-[#050B1F] text-slate-300">

      <div className="max-w-5xl mx-auto px-6 py-16">

        <div className="text-center mb-16">
          <div className="text-cyan-400 text-xs uppercase tracking-[0.4em] mb-4">
            // SUCHER-PROTOKOLL
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            SUCHER-PROTOKOLL
          </h1>

          <p className="max-w-3xl mx-auto text-slate-400 leading-relaxed">
            Transparenz schafft Vertrauen. Das Sucher-Protokoll
            erklärt, welche Faktoren die Suche innerhalb des
            GIGSDA-Netzwerks beeinflussen und wie passende
            Ergebnisse gefunden werden.
          </p>
        </div>

        <div className="space-y-8">

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Standort & Region
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Die Suche berücksichtigt regionale Informationen,
              damit Künstler, Veranstalter, Locations,
              Dienstleister und Crews passende Ergebnisse in ihrer
              Umgebung erhalten.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Suchradius
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Je nach Suche können regionale Entfernungen eine
              Rolle spielen. Dadurch werden Ergebnisse bevorzugt,
              die tatsächlich für Projekte, Veranstaltungen und
              Einsätze erreichbar sind.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Rollen & Kategorien
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Die Plattform unterscheidet zwischen Künstlern,
              Veranstaltern, Technikern, Locations, Catering,
              Security, Verleihern, Logistik und weiteren
              Kategorien der Eventbranche.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Skills & Erfahrungen
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Fähigkeiten, Erfahrungen und Schwerpunkte helfen
              dabei, relevante Kontakte und Projekte genauer
              miteinander zu verknüpfen.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Equipment & Leistungen
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Hinterlegte Ausrüstung, Technik, Dienstleistungen
              und verfügbare Ressourcen können bei Suchergebnissen
              berücksichtigt werden.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Profilaktivität
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Aktuelle und gepflegte Profile liefern häufig
              bessere Informationen und können dadurch bei
              Suchvorgängen relevanter erscheinen.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Matching
            </h2>

            <p className="text-slate-400 leading-relaxed">
              GIGSDA entwickelt Matching-Funktionen, die Menschen,
              Projekte, Veranstaltungen und Möglichkeiten
              gezielter miteinander verbinden sollen.
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/10 rounded-3xl p-8 text-center">
            <h2 className="text-3xl font-black text-white mb-6">
              Relevanz statt Zufall
            </h2>

            <p className="max-w-3xl mx-auto text-slate-300 leading-relaxed">
              Unser Ziel ist es nicht, möglichst viele Ergebnisse
              anzuzeigen, sondern die passenden. Das Sucher-Protokoll
              wird kontinuierlich weiterentwickelt, um die Qualität
              von Verbindungen innerhalb der Eventbranche zu verbessern.
            </p>

            <div className="mt-8 text-cyan-400 font-bold uppercase tracking-widest text-sm">
              Finden. Vernetzen. Durchstarten.
            </div>
          </div>

        </div>

      </div>

      <Footer setView={setView} />
    </div>
  );
}